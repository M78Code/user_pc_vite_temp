<!--
 * @Date: 2021-04-28 19:44:43
 * @FilePath: /user-pc-vite/src/components/match-results/template/virtual_soccer.vue
 * @Description: 虚拟足球模板
 * @Author: Echo
-->

<template>
  <div class="wrap-table" :class="{'football':sportType=='1001'}">
    <div class="table-header">
      <div class="table-col cursor" @click="change_sort">
        <span>{{i18n_t('results.date')}}</span>
        <div class="sort icon" :class="{'up':is_sortUp}" ></div>
      </div>
      <div class="table-col">{{i18n_t('results.league')}}</div>
      <div class="table-col">{{i18n_t(`results.${sportType=='1001'?'round':'number'}`)}}</div>
      <div class="table-col">{{i18n_t('results.competition')}}</div>
      <!-- 总分 -->
      <div class="table-col">{{i18n_t('msc.S1')}}</div>
      <!-- 点球比分 -->
      <div  v-if="sportType=='1001'" class="table-col">{{i18n_t('msc.S10')}}</div>
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
              <!-- 全场比分 -->
              <div class="table-col">
                <template v-if="sportType=='1001'">
                  <div v-if="item.teamGroup === 'GROUPS'">{{format_i18n_num('round1', item.matchDay)}}&nbsp;&nbsp;&nbsp;{{format_i18n_num('legOrder', item.legOrder)}}</div>
                  <!-- 'INGAME', 'PREGAME' 新增的值，没有同步到前端，导致控制台报 warning ，先规避一下 -->
                  <div v-if="!['GROUPS', 'INGAME', 'PREGAME'].includes(item.teamGroup) && item.teamGroup != ''">{{i18n_t('results.' + item.teamGroup)}}&nbsp;&nbsp;&nbsp;{{format_i18n_num('legOrder', item.legOrder)}}</div>
                  <div v-if="item.teamGroup == ''">{{format_i18n_num('round1', item.matchDay)}}</div>
                </template>
                <template v-else>
                  <div>
                    {{sportType=='1004'?item.matchesGroupId:item.batchNo}}
                  </div>
                </template>
              </div>
              <!-- 赛事 -->
              <div class="table-col">
                <div class="ellipsis">{{item.homeName}}</div>
                <div class="ellipsis">{{item.awayName}}</div>
              </div>
              <!-- 全局比分 -->
              <div class="table-col">
                <div>{{item.scoreResult ? item.scoreResult.split(':')[0] : '-' }}</div>
                <div>{{item.scoreResult ? item.scoreResult.split(':')[1] : '-'}}</div>
              </div>
               <!-- 点球比分 -->
              <div class="table-col"  v-if="sportType=='1001'">
                <div>{{item.penaltyScore ? item.penaltyScore.split(':')[0] : '-'}}</div>
                <div>{{item.penaltyScore ? item.penaltyScore.split(':')[1] : '-'}}</div>
              </div>
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
  name: 'virtual_soccer',
  components: {
    loadData
  },
  mixins: [results],
  methods:{
    format_i18n_num(i18n, num) {
      let string;
      if (i18n === 'legOrder') {
        string = this.i18n_t('results.legOrder');
      } else if (i18n === 'round1') {
        string = this.i18n_t('results.round1')
      }
      let finalStr = string.replace('%s', num);
      return finalStr;
    }
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
  }
};
</script>

<style lang="scss" scoped>
.wrap-table {
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
    }
    &:nth-child(3),
    &:nth-child(4),
    &:last-child {
      padding-left: 20px;
      width: 21.16%;
    }
    &:nth-child(4),
    &:last-child {
      // text-align: center;
    }
    &:nth-child(4) {
      user-select: text;
    }
  }
  &.football{
    .table-col {
      &:first-child {
        display: flex;
        align-items: center;
        width: 13%;
      }
      &:nth-child(2) {
        padding-left: 20px;
        width: 21%;
      }
      &:nth-child(3) {
        padding-left: 20px;
        user-select: none!important;
      }
      &:nth-child(3),
      &:nth-child(4) {
        width: 18.25%;
      }
      &:nth-child(5),
      &:last-child{
        // padding-left: 20px;
        width: 12%;
      }
      &:nth-child(5),
      &:last-child {
        text-align: center;
      }
    }
  }
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
      width: 36.6%;
    }
    .tr-detail-item .item:nth-child(odd) {
      width: 50%;
    }
  }
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
