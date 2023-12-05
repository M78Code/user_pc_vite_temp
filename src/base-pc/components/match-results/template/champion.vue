<!--
 * @Date: 2021-08-21 17:29:27
 * @FilePath: /user-pc1/src/public/components/results/template/champion.vue
 * @Description: 冠军球种模板
 * @Author: Echo
-->
<template>
  <div class="wrap-table">
    <div class="table-header">
      <!-- 日期 -->
      <div class="table-col cursor" @click="change_sort">
        <span>{{i18n_t('results.date')}}</span>
        <div class="sort icon" :class="{'up':is_sortUp}" ></div>
      </div>
      <!-- 联赛 -->
      <div class="table-col">{{i18n_t('results.league')}}</div>
      <!-- 玩法 -->
      <div class="table-col">{{i18n_t('list.play')}}</div>
      <!-- 结果 -->
      <div class="table-col">{{i18n_t('results.results')}}</div>
    </div>
    <load-data :state="load_data_state" color="light">
      <q-scroll-area
        ref="scrollArea"
        class="rule-scroll-area"
        :style="{height: '100%'}"
      >
        <div class="tbale-body">
          <template v-for="(item, index) in results_list" :key="index">
            <div
              class="table-tr-td"
              :class="{'active':index == activeIndex}"             
            >
              <!-- 日期 -->
              <div class="table-col">
                <div class="time-wrap">
                  <div>{{formatTime(item.matchTime, lang=='vi'?'hh:MM dd/mm/yyyy':'yyyy-mm-dd hh:MM')}}</div>
                </div>
              </div>
              <!-- 联赛 -->
              <div class="table-col">
                <img v-img="[lodash.get(item,'iconUrl')]" class="tournament-logo" alt="">
                <span class="ellipsis-line-2">{{item.tournamentName}}</span>
              </div>
              <!-- 玩法 -->
              <div class="table-col" style="display:flex;align-items:center;">
                <span class="ellipsis-line-2">{{item.playName}}</span>
              </div>
              <!-- 结果 -->
              <div class="table-col" style="display:flex;align-items:center;">
                <span class="ellipsis-line-2">{{item.scoreResult}}</span>
              </div>
            </div>
            <div v-if="index == activeIndex" class="wrap-load" >
              <load-data :state="details_load" color="light">
                <template v-for="(list,i) in results_order_list" :key="i">
                  <div class="table-tr-detail" v-if="list.posrList.length" >
                    <div class="tr-detail-title">{{list.playName}}</div>
                    <div class="tr-detail-item">
                        <div class="item" v-for="(list2, j) in list.posrList" :key="j">
                          <span>{{list2.playOptionName}}</span>
                          <span :class="format_name(list2.scoreResult).class">{{format_name(list2.scoreResult)['name']}}</span>
                        </div>
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
    user-select: none!important;
  }
  &:last-child {
    padding-left: 20px;
    width: 25%;
  }
  .rs_jiao_shang,
  .rs_jiao_xia,
  .rs_jiao_quan {
    width: 16px;
    height: 16px;
    background-size: cover;
  }
  .rs_dian {
    width: 18px;
    height: 18px;
    background-size: cover;
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
        width: 51.33%;
      }
    }
  }
}
/* ************** 赛果详情 *************** -E */
.wrap-table {
  .tbale-body {
    .table-tr-td {
      cursor: auto !important;
      .table-col:nth-child(3) {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>