<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:14:22
 * @Description: 赛果篮球
-->
<template>
  <div class="wrap-table">
    <div class="table-header" >
      <div class="table-col cursor" @click="change_sort">
        <!-- 日期 -->
        <span>{{i18n_t('results.date')}}</span>
        <div class="sort icon" :class="{'up':is_sortUp}" ></div>
      </div>
      <!-- 联赛 -->
      <div class="table-col">{{i18n_t('results.league')}}</div>
      <!-- 赛事 -->
      <div class="table-col">{{i18n_t('results.competition')}}</div>
      <div class="table-col">Q1</div>
      <div class="table-col">Q2</div>
      <!-- 上半场 -->
      <div class="table-col">{{i18n_t('results.first_half')}}</div>
      <div class="table-col">Q3</div>
      <div class="table-col">Q4</div>
      <!-- 下半场 -->
      <div class="table-col">{{i18n_t('results.second_half')}}</div>
      <!-- 加时 -->
      <div class="table-col">{{i18n_t('results.extra_time')}}</div>
      <!-- 总分 -->
      <div class="table-col">{{i18n_t('results.total_points')}}</div>
    </div>
    <load-data :state="load_data_state" color="light">
      <q-scroll-area
        ref="scrollArea"
        class="rule-scroll-area"
        :style="{height: '100%'}"
      >
        <div class="tbale-body">
          <template v-for="(item, index) in results_list"  :key="item.tnameCode + index">
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
                <div class="ellipsis">{{item.homeName || `&nbsp;`}}</div>
                <div class="ellipsis">{{item.awayName || `&nbsp;`}}</div>
              </div>
              <!-- 篮球3X3时只显示总分 -->
              <template v-if="lodash.get(item,'mle')==73">
                <div v-for="i in 7" class="table-col" :key="i">
                  <div>
                    <div>-</div>
                    <div>-</div>
                  </div>
                </div>
              </template>
              <template v-else>
                <!-- Q1 -->
                <div class="table-col">
                  <div>
                    <div>{{lodash.get(item, "scoreResult.S19.home", item.matchStatus==1?'':'-')}}</div>
                    <div>{{lodash.get(item, "scoreResult.S19.away", item.matchStatus==1?'':'-')}}</div>
                  </div>
                </div>
                <!-- Q2 -->
                <div class="table-col">
                  <div>
                    <div>{{lodash.get(item, "scoreResult.S20.home", item.matchStatus==1?'':'-')}}</div>
                    <div>{{lodash.get(item, "scoreResult.S20.away", item.matchStatus==1?'':'-')}}</div>
                  </div>
                </div>
                <!-- 上半场 -->
                <div class="table-col">
                  <div>
                    <div>{{lodash.get(item, "scoreResult.S2.home", item.matchStatus==1?'':'-')}}</div>
                    <div>{{lodash.get(item, "scoreResult.S2.away", item.matchStatus==1?'':'-')}}</div>
                  </div>
                </div>
                <!-- Q3 -->
                <div class="table-col">
                  <div>
                    <div>{{lodash.get(item, "scoreResult.S21.home", item.matchStatus==1?'':'-')}}</div>
                    <div>{{lodash.get(item, "scoreResult.S21.away", item.matchStatus==1?'':'-')}}</div>
                  </div>
                </div>
                <!-- Q4 -->
                <div class="table-col">
                  <div>
                    <div class="home">{{lodash.get(item, "scoreResult.S22.home", item.matchStatus==1?'':'-')}}</div>
                    <div class="away">{{lodash.get(item, "scoreResult.S22.away", item.matchStatus==1?'':'-')}}</div>
                  </div>
                </div>
                <!-- 下半场 -->
                <div class="table-col">
                  <div>
                    <div>{{lodash.get(item, "scoreResult.S3.home", item.matchStatus==1?'':'-')}}</div>
                    <div>{{lodash.get(item, "scoreResult.S3.away", item.matchStatus==1?'':'-')}}</div>
                  </div>
                </div>
                <!-- 加时 -->
                <div class="table-col">
                  <div>
                    <div>{{lodash.get(item, "scoreResult.S7.home", item.matchStatus==1?'':'-')}}</div>
                    <div>{{lodash.get(item, "scoreResult.S7.away", item.matchStatus==1?'':'-')}}</div>
                  </div>
                </div>
              </template>
              <!-- 总分 -->
              <div class="table-col color-highlight">
                <div>
                  <div>{{lodash.get(item, "scoreResult.S1.home", item.matchStatus==1?'':'-')}}</div>
                  <div>{{lodash.get(item, "scoreResult.S1.away", item.matchStatus==1?'':'-')}}</div>
                </div>
              </div>
            </div>
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
    width: 23.5%;
  }
  &:nth-child(3) {
    padding-left: 20px;
    width: 25%;
  }
  &:nth-child(4) {
    display: flex;
    justify-content: space-around;
    width: 4.8%;
  }
  &:nth-child(5) {
    display: flex;
    justify-content: space-around;
    width: 4.8%;
  }
  &:nth-child(6) {
    display: flex;
    justify-content: space-around;
    width: 4.8%;
  }
  &:nth-child(7) {
    display: flex;
    justify-content: space-around;
    width: 4.8%;
  }
  &:nth-child(8) {
    display: flex;
    justify-content: space-around;
    width: 4.8%;
  }
  &:nth-child(9) {
    display: flex;
    justify-content: space-around;
    width: 4.8%;
  }
  &:nth-child(10) {
    display: flex;
    justify-content: space-around;
    width: 4.8%;
  }
  &:last-child {
    display: flex;
    justify-content: space-around;
    width: 4.8%;
  }
}

/* ************** 赛果详情 *************** -S */
.table-tr-detail {
  .tr-detail-title {
    width: 36.5%;
  }
  .tr-detail-item {
    .item {
      &:nth-child(odd) {
        width: 54.55%;
      }
    }
  }
}

/* ************** 赛果详情 *************** -E */
</style>