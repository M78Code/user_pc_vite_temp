<!--
 * @Date: 2021-04-28 20:38:27
 * @FilePath: /user-pc-vite/src/components/match-results/template/virtual_race_dog.vue
 * @Description: 虚拟赛马和赛狗
 * @Author: Echo
-->

<template>
  <div class="wrap-table">
    <div class="table-header">
      <div class="table-col cursor" @click="change_sort">
        <span>{{i18n_t('results.date')}}</span>
        <div class="sort icon" :class="{'up':is_sortUp}" ></div>
      </div>
      <div class="table-col">{{i18n_t('results.league')}}</div>
      <!-- 期号 -->
      <div class="table-col">{{i18n_t('results.number')}}</div>
      <!-- 第一名 -->
      <div class="table-col">{{i18n_t('results.first')}}</div>
      <!-- 第二名 -->
      <div class="table-col">{{i18n_t('results.second')}}</div>
      <!-- 第三名 -->
      <div class="table-col">{{i18n_t('results.third')}}</div>
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
              <!-- 期号 -->
              <div class="table-col">
                <div>{{item.batchNo + ' ' + i18n_t('bet_record.periods')}}</div>
              </div>
              <!-- 第一名-第三名 -->
              <template v-if="item.teamsTop">
                <div class="table-col" v-for="(item1, index) in item.teamsTop" :key="index">
                  <div class="ellipsis">
                  <!-- csid 球类id 虚拟赛狗1002 虚拟赛马1011 虚拟摩托1010 泥地摩托车1009 -->
                    <div :class="`ranking-icon rankingNum ranking-bg-style1-${(item1.split('_')[0])} csid-${sportType}`"></div>
                    {{item1.split('_')[1]}}
                  </div>
                </div>
                <template v-if="item.teamsTop.length < 3">
                  <div class="table-col" v-for="(item1, index) in [1, 2, 3].filter(i => i + item.teamsTop.length == 3)" :key="index">
                    <div class="ellipsis">
                      {{'-'}}
                    </div>
                  </div>
                </template>
              </template>
              <!-- 名次无数据时用 - 占位 -->
              <template v-else>
                <div class="table-col" v-for="(item1, index) in [1, 2, 3]" :key="index">
                  <div class="ellipsis">
                    {{'-'}}
                  </div>
                </div>
              </template>
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
  name: 'virtual_race_dog',
  components: {
    loadData
  },
  mixins: [results],
  props: {
    sportType: {
      type: String,
      default: '1002'
    }
  },
};
</script>

<style lang="scss" scoped>
.ranking-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
}
.table-col {
  &:first-child {
    display: flex;
    align-items: center;
    width: 13%;
  }
  &:nth-child(2) {
    padding-left: 20px;
    width: 20%;
  }
  &:nth-child(3) {
    width: 10%;
    padding-left: 20px;
    user-select: none!important;
  }
  &:nth-child(4) {
    width: 18%;
  }
  &:nth-child(5),
  &:last-child {
    text-align: center;
  }
}

/* ************** 赛果详情 *************** -S */
.score-wrap {
  display: flex;
  height: 80px;
  border: 1px solid #d0d8de;
  border-top: none;
}
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
.table-tr-detail {
  .tr-detail-title {
    width: 36.6%;
  }
}
.tr-detail-item {
  .item {
    &:nth-child(odd) {
      width: 50%;
    }
  }
}

/* ************** 赛果详情 *************** -E */
</style>
<style scoped>
.table-col:nth-child(3) {
  display: flex;
  align-items: center;
  /* padding: 0 20px 0 0; */
}
.table-col:nth-child(4),
.table-col:nth-child(5),
.table-col:last-child {
  width: 15%;
  padding-left: 20px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
}
.table-col:nth-child(4) .num {
  padding: 10px;
  background: #ff9933;
}
.table-col:nth-child(5) .num {
  padding: 10px;
  background: #069;
}
.table-col:nth-child(6) .num {
  padding: 10px;
  background: #693;
}

.wrap-table .tbale-body .table-tr-td {
  cursor: auto !important;
}
.rankingNum {
  vertical-align: middle;
  position: relative;
  top: -1px;
}
</style>

