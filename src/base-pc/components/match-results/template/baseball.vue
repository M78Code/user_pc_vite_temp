<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:14:23
 * @Description: 赛果棒球
-->
<template>
  <div class="wrap-table">
    <div class="table-header" tyle="color: #000;">
      <div class="table-col cursor" @click="change_sort">
        <!-- 日期 -->
        <span>{{i18n_t('results.date')}}</span>
        <div class="sort icon" :class="{'up':is_sortUp}" ></div>
      </div>
      <!-- 联赛 -->
      <div class="table-col">{{i18n_t('results.league')}}</div>
      <!-- 赛事 -->
      <div class="table-col">{{i18n_t('results.competition')}}</div>
      <!-- 1 -->
      <div class="table-col">{{lang_results.one}}</div>
      <!-- 2 -->
      <div class="table-col">{{lang_results.two}}</div>
      <!-- 3 -->
      <div class="table-col">{{lang_results.three}}</div>
      <!-- 4 -->
      <div class="table-col">{{lang_results.four}}</div>
      <!-- 5 -->
      <div class="table-col">{{lang_results.five}}</div>
      <!-- 6 -->
      <div class="table-col">{{lang_results.six}}</div>
      <!-- 7 -->
      <div class="table-col">{{lang_results.seven}}</div>
      <!-- 8 -->
      <div class="table-col">{{lang_results.eight}}</div>
      <!-- 9 -->
      <div class="table-col">{{lang_results.nine}}</div>
      <!-- 加时 -->
      <div class="table-col">{{i18n_t('results.extra_time')}}</div>
      <!-- 总分 -->
      <div class="table-col">{{i18n_t('results.front_score')}}</div>
      <!-- 全场比分 -->
      <div class="table-col">{{i18n_t('results.all_score')}}</div>
      <!-- 安打比分 -->
      <div class="table-col">{{i18n_t('results.hit')}}</div>
    </div>
    <load-data :state="load_data_state" color="light">
      <q-scroll-area
        ref="scrollArea"
        class="rule-scroll-area"
        :style="{height: '100%'}"
      >
        <div class="tbale-body">
          <template v-for="(item, index) in results_list"  :key="item.matchId + index">
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
                <div>
                  <div>{{lodash.get(item, "scoreResult.S120.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S120.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 2 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S121.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S121.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 3 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S122.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S122.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 4 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S123.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S123.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 5 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S124.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S124.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 6 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S125.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S125.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 7 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S126.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S126.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 8 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S127.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S127.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 9 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S128.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S128.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 加时 -->
              <div class="table-col">
                <!-- 加时比分为0时不展示 -->
                <div v-if="lodash.get(item, 'scoreResult.S7.home') == 0 && lodash.get(item, 'scoreResult.S7.away') == 0">
                  <div></div>
                  <div></div>
                </div>
                <div v-else>
                  <div>{{lodash.get(item, "scoreResult.S7.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S7.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 前5局比分 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "score_total.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "score_total.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 局比分 -->
              <div class="table-col color-highlight">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S1.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S1.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
              <!-- 安打比分 -->
              <div class="table-col">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S3015.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S3015.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
            </div>
            <!-- 赛果详情 -->
            <!-- <div v-if="index == activeIndex" class="wrap-load" :key="`details-${index}`"> -->
            <div v-if="index == activeIndex" class="wrap-load" >
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
  data() {
    return {
      lang_results:{},
    }
  },
  watch:{
    // 格式化比分数据
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
                            parseInt(lodash.get(item, "scoreResult.S124.home")||0)

                    obj.away = parseInt(lodash.get(item, "scoreResult.S120.away")||0) + 
                            parseInt(lodash.get(item, "scoreResult.S121.away")||0) + 
                            parseInt(lodash.get(item, "scoreResult.S122.away")||0) +
                            parseInt(lodash.get(item, "scoreResult.S123.away")||0) +
                            parseInt(lodash.get(item, "scoreResult.S124.away")||0)
                }
                item.score_total = obj
            })
        },
        immediate: true
    }
  },
  created() {
    this.lang_results = {
      one: i18n_t('results.one'),
      two: i18n_t('results.two'),
      three: i18n_t('results.three'),
      four: i18n_t('results.four'),
      five: i18n_t('results.five'),
      six: i18n_t('results.six'),
      seven: i18n_t('results.seven'),
      eight: i18n_t('results.eight'),
      nine: i18n_t('results.nine'),           
    }
  },
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
    width: 21.5%;
  }
  &:nth-child(3) {
    padding-left: 20px;
    width: 22%;
  }
  &:nth-child(4) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(5) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(6) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(7) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(8) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(9) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(10) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(11) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(12) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(13) {
    display: flex;
    justify-content: space-around;
    width: 3.27%;
  }
  &:nth-child(14) {
    display: flex;
    justify-content: space-around;
    width: 4%;
  }
  &:nth-child(15),
  &:last-child {
    display: flex;
    justify-content: space-around;
    width: 5.4%;
  }
}

/* ************** 赛果详情 *************** -S */
.score-wrap {
  display: flex;
  height: 80px;
  border: 1px solid #d0d8de;
  border-top: none;
  .score-title {
    width: 12.83%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #d0d8de;
  }
  .score-details {
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: nowrap;
    text-align: center;

    .scrore-details-item {
      width: 41px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      &:last-child {
        margin: 0;
      }
      &.item-label {
        color: #666;
      }
      &.item-both {
        color: var(--q-gb-t-c-2);
      }
    }
  }
}
.table-tr-detail {
  .tr-detail-title {
    width: 33.98%;
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
