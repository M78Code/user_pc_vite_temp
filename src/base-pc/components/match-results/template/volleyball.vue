<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:14:22
 * @Description: 赛果排球
-->
<template>
  <div class="wrap-table">
    <div class="table-header">
      <div class="table-col cursor" @click="change_sort">
        <span>{{i18n_t('results.date')}}</span>
        <div class="sort icon" :class="{'up':is_sortUp}" ></div>
      </div>
      <div class="table-col">{{i18n_t('results.league')}}</div>
      <div class="table-col">{{i18n_t('results.competition')}}</div>
      <div class="table-col">1</div>
      <div class="table-col">2</div>
      <div class="table-col">3</div>
      <div class="table-col">4</div>
      <div class="table-col">5</div>
      <!-- 总分 -->
      <div class="table-col">{{i18n_t('results.total_points')}}</div>
      <!-- 局比分 -->
      <div class="table-col">{{i18n_t('results.bureau_score')}}</div>
    </div>
    <load-data :state="load_data_state" color="light">
      <q-scroll-area
        ref="scrollArea"
        class="rule-scroll-area"
        :style="{height: '100%'}"
      >
        <div class="tbale-body">
          <template v-for="(item, index) in results_list" :key="item.tnameCode + index">
            <div
              class="table-tr-td"
              :class="{'active':index == activeIndex}"
              @click="get_tr_detail(item, index)"            
            >
              <!-- 日期 -->
              <div class="table-col">
                <div class="browser" :class="{'del':index==activeIndex}" ></div>
                <div class="time-wrap">
                  <div>{{formatTime(item.matchTime, lang=='vi'?'hh:MM dd/mm/yyyy':'yyyy-mm-dd hh:MM')}}</div>
                  <div class="match-stage" :class="item.matchStatus==1?'roll':'cancel'" v-if="format_mmp(item.matchPeriodId, item.matchStatus)!=''">
                    {{format_mmp(item.matchPeriodId, item.matchStatus)}}
                  </div>
                </div>
              </div>
              <!-- 联赛 -->
              <div class="table-col">
                <img v-img="[lodash.get(item,'iconUrl')]" class="tournament-logo" alt="">
                <span class="ellipsis-line-2">{{item.tournamentName}}</span>
              </div>
              <!-- 赛事 -->
              <div class="table-col">
                <div class="ellipsis">{{item.homeName}}</div>
                <div class="ellipsis">{{item.awayName}}</div>
              </div>
              <!-- 1 -->
              <div class="table-col">
                <div>{{lodash.get(item, "scoreResult.S120.home", item.matchStatus==1?'':'-')}}</div>
                <div>{{lodash.get(item, "scoreResult.S120.away", item.matchStatus==1?'':'-')}}</div>
              </div>
              <!-- 2 -->
              <div class="table-col">
                <div>{{lodash.get(item, "scoreResult.S121.home", item.matchStatus==1?'':'-')}}</div>
                <div>{{lodash.get(item, "scoreResult.S121.away", item.matchStatus==1?'':'-')}}</div>
              </div>
              <!-- 3 -->
              <div class="table-col">
                <div>{{lodash.get(item, "scoreResult.S122.home", item.matchStatus==1?'':'-')}}</div>
                <div>{{lodash.get(item, "scoreResult.S122.away", item.matchStatus==1?'':'-')}}</div>
              </div>
              <!-- 4 -->
              <div class="table-col">
                <div>{{lodash.get(item, "scoreResult.S123.home", item.matchStatus==1?'':'-')}}</div>
                <div>{{lodash.get(item, "scoreResult.S123.away", item.matchStatus==1?'':'-')}}</div>
              </div>
              <!-- 5 -->
              <div class="table-col">
                <div>{{lodash.get(item, "scoreResult.S124.home", item.matchStatus==1?'':'-')}}</div>
                <div>{{lodash.get(item, "scoreResult.S124.away", item.matchStatus==1?'':'-')}}</div>
              </div>
              <!-- 总分 -->
              <div class="table-col">
                <div>{{lodash.get(item, "score_total.home", item.matchStatus==1?'':'-')}}</div>
                <div>{{lodash.get(item, "score_total.away", item.matchStatus==1?'':'-')}}</div>
              </div>
              <!-- 局比分 -->
              <div class="table-col color-highlight">
                <div>{{lodash.get(item, "scoreResult.S1.home", item.matchStatus==1?'':'-')}}</div>
                <div>{{lodash.get(item, "scoreResult.S1.away", item.matchStatus==1?'':'-')}}</div>
              </div>
            </div>
            <div v-if="index == activeIndex" class="wrap-load">
              <load-data :state="details_load" color="light">
                <template v-for="(list,i) in results_order_list" :key="i">
                  <div class="table-tr-detail" v-if="list.posrList.length" >
                    <div class="tr-detail-title">{{list.playName}}</div>
                    <div class="tr-detail-item">
                      <template v-for="(list2, j) in list.posrList" :key="j">
                        <div class="item" >
                          <span>{{list2.playOptionName}}</span>
                          <span :class="format_name(list2.scoreResult).class">{{format_name(list2.scoreResult)['name']}}</span>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </load-data>
            </div>
          </template>
        </div>
      </q-scroll-area>
    </load-data>
  </div>
</template>

<script>
import results from "src/core/match-results/match-results-mixin/index";
import loadData from "src/components/load_data/load_data.vue"
export default {
  mixins: [results],
  components: {
    loadData
  },
  watch:{
    results_list:{
      handler(res){
        if(!res.length) return false
        //累加局比分
        res.forEach(item => {
          let obj = { home: 0, away: 0 }
          if(item.scoreResult != ""){
            obj.home = parseInt(lodash.get(item, "scoreResult.S120.home")||0) + 
                        parseInt(lodash.get(item, "scoreResult.S121.home")||0) + 
                        parseInt(lodash.get(item, "scoreResult.S122.home")||0) +
                        parseInt(lodash.get(item, "scoreResult.S123.home")||0) +
                        parseInt(lodash.get(item, "scoreResult.S124.home")||0) +
                        parseInt(lodash.get(item, "scoreResult.S125.home")||0) +
                        parseInt(lodash.get(item, "scoreResult.S126.home")||0)

            obj.away = parseInt(lodash.get(item, "scoreResult.S120.away")||0) + 
                        parseInt(lodash.get(item, "scoreResult.S121.away")||0) + 
                        parseInt(lodash.get(item, "scoreResult.S122.away")||0) +
                        parseInt(lodash.get(item, "scoreResult.S123.away")||0) +
                        parseInt(lodash.get(item, "scoreResult.S124.away")||0) +
                        parseInt(lodash.get(item, "scoreResult.S125.away")||0) +
                        parseInt(lodash.get(item, "scoreResult.S126.away")||0)
          }
          item.score_total = obj
        })
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.table-col {
  &:first-child {
    display: flex;
    align-items: center;
    width: 13%;
  }
  &:nth-child(2) {
    padding-left: 20px;
    width: 18.9%;
  }
  &:nth-child(3) {
    padding-left: 20px;
    width: 20.6%;
  }
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6),
  &:nth-child(7),
  &:nth-child(8),
  &:nth-child(9),
  &:last-child {
    width: 6.78%;
    text-align: center;
  }
}

/* ************** 赛果详情 *************** -S */
.table-tr-detail {
  .tr-detail-title {
    width: 36.83%;
  }
  .tr-detail-item {
    .item {
      &:nth-child(odd) {
        width: 50%;
      }
    }
  }
}
/* ************** 赛果详情 *************** -E */
</style>
