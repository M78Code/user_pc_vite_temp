<template>
  <div class="analysis-page relative-position">
    <div class="match-header" v-if="matchLoaded">
      <div class="both home">
        <span class="team-name">
          <div class="yb-absolute ellipsis">{{ matchDetail.mhn }}</div>
        </span>
        <img v-img="([lodash.get(matchDetail, 'mhlu[0]'), lodash.get(matchDetail, 'frmhn[0]')])" class="team_logo" alt />
        <span class="score">{{ [0, 110].includes(matchDetail.ms) ? "—" : lodash.get(matchDetail, 'msc.S1.home') }}</span>
      </div>
      <div class="both-time">
        <div>{{ formatTime(matchDetail.mgt, 'yyyy/mm/dd hh:MM:ss') }}</div>
        <div class="match-tn">{{ matchDetail.tn }}</div>
        <!-- 未开始 -->
        <span v-if="[0, 110].includes(matchDetail.ms)">{{ i18n_t("analysis.not_start") }}</span>
        <match-date v-else :match="matchDetail" style="justify-content:center;"></match-date>
      </div>
      <div class="both away">
        <span class="score">{{ [0, 110].includes(matchDetail.ms) ? "—" : lodash.get(matchDetail, 'msc.S1.away') }}</span>
        <img v-img="([lodash.get(matchDetail, 'malu[0]'), lodash.get(matchDetail, 'frman[0]')])" class="team_logo" alt />
        <span class="team-name">
          <div class="yb-absolute ellipsis">{{ matchDetail.man }}</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import { useRoute } from 'vue-router';
import { api_analysis, api_details } from 'src/api/index.js'
import {msc_array_obj, formatTime, UserCtr} from "src/output/index.js";
import { MatchProcessFullVersionWapper as matchDate } from "src/components/match-process/index.js";

//赛况，数据，阵容，情报，赔率
const tab = ref(['result', 'data', 'lineup', 'information', 'odds']);
const activeTab = ref(null);
const sportDict = {
  allScore: ['S1', 'S11', 'S12', 'S5', 'S8', 'S105', 'S104', 'S1101', "S17", "S18", 'S106', 'S109', 'S12345', 'S12346', 'S111', 'S108', 'S107', 'S110'],
  line: ['S1101', "S17", "S18", 'S108', 'S107', 'S110']
}
const matchDetail = ref({})
const matchLoaded = ref(false) //match 数据接口是否就绪

const route = useRoute();

const mid = ref(0);

onMounted(() => {
  get_match_data();
})

// 获取赛事数据
function get_match_data() {
  let params = { mid: route.params.mid, cuid: UserCtr.get_uid() }
  api_details.get_match_detail_MatchInfo(params).then(res => {
    let match = res.data
    mid.value = match.mid //设置news 需要的mid
    // 设置页面激活的tab
    if (['zh', 'tw'].includes(UserCtr.lang)) {
      activeTab.value = match.ms == 1 ? 1 : 2
    }else {
      activeTab.value = match.ms == 1 ? 0 : 1
    }
    match.msc = msc_array_obj(match.msc)
    return match
  }).then(match_info => {
    let match = lodash.cloneDeep(match_info) || {}
    let obj = {}
    if (match.msc_obj) {
      sportDict.allScore.map(k => {
        if (!match.msc_obj[k]) {
          obj[k] = {
            home: 0,
            away: 0,
            percentage: 50
          }
        } else {
          // 获取主客队得分数据
          let home = parseInt(lodash.get(match, `msc_obj[${k}].home`)),
              away = parseInt(lodash.get(match, `msc_obj[${k}].away`));
          if (sportDict.line.includes(k)) {
            //'S108'三分球得分，'S107'两分球得分
            if (k == 'S107') {
              home *= 2
              away *= 2
            }
            if (k == 'S108') {
              home *= 3
              away *= 3
            }
            obj[k] = {
              home: home,
              away: away,
              percentage: isNaN(home / (home + away)) ? 50 : home / (home + away) * 100
            }
          } else {
            obj[k] = {
              home: home,
              away: away,
              percentage: isNaN(away / (home + away)) ? 50 : away / (home + away) * 100
            }
          }
        }
      })
    } else {
      let msc = match.msc

      sportDict.allScore.map(k => {
        if (!msc[k]) {
          obj[k] = {
            home: 0,
            away: 0,
            percentage: 50
          }
        }
      })
      Object.assign(obj, msc)
    }
    match.msc = obj
    return match
  }).then(match => {
    matchDetail.value = match
    matchLoaded.value = true
  })



}

</script>

<style lang="scss" scoped>
.analysis-page {
  background: var(--q-analysis-color-16);
  flex: 1;
  display: flex;
  flex-direction: column;
  /*  height calc(100vh - 20px) */
  .match-header {
    color: var(--qq--y0-text-color5);
    height: 115px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(60.87% 60.87% at 50% 88.7%, #EDF2FF 0%, #C7D7FF 100%);
    .both-time {
      color: var(--qq--y0-text-color5);
      width: 285px;
      line-height: 17px;
      text-align: center;
      div:first-child {
        color: var(--qq--analysis-both-time-color-1)
      }
      :deep(.c-match-process) {
        .process-name {
          padding: 0 5px 0 0;
        }
        .c-match-date {
          padding: 0 0 0 5px;
        }
      }
      .match-tn{
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: center;
        color: var(--qq--analysis-tab-data-text-color-1);
      }
    }
    .both {
      display: flex;
      flex: 1;
      align-items: center;
      &.home {
        justify-content: flex-end;
        text-align: right;
        .score {
          text-align: right;
        }
        .team_logo {
          margin-left: 15px;
        }
      }
      &.away {
        .team_logo {
          margin-right: 15px;
        }
      }
      .score {
        width: 60px;
        font-size: 30px;
        color: var(--qq--y0-text-color5_3);
        line-height: 30px;
      }
      .team_logo {
        max-height: 40px;
        min-width: 40px;
      }
      img[class*="team-logo-"] {
        width: 40px;
      }
      .team-name {
        flex: 1;
        font-size: 16px;
        color: var(--qq--yb-text-color3);
        line-height: 25px;
        position: relative;
        height: 25px;
      }
    }
  }

  /*  tab 区 */
  .tab {
    display: flex;
    margin-bottom: 10px;

    &:after {
      content: "";
      position: absolute;
      bottom: 0px;
      height: 1px;
      width: 100%;
      background: var(--q-analysis-color-10);
      z-index: 1;
    }

    .item {
      width: 100px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
      background: var(--q-analysis-color-12);
      border: 1px solid var(--q-analysis-color-12);
      border-bottom-color: var(--q-analysis-color-10);
      color: var(--q-analysis-color-3);
      z-index: 2;
      cursor: pointer;
      font-family: PingFangSC-Regular;

      font-size: 14px;

      &.active {
        background: transparent;
        border-bottom-color: var(--q-analysis-color-16);
        color: var(--q-analysis-color-0);
        font-family: PingFangSC-Medium;
      }
    }
  }

  /*  内容区 */
  .rule-scroll-area {
    flex: 1;
  }
  :deep(.panel) {
    border-top: transparent;

    .panel-title {
      position: relative;
      height: 32px;
      line-height: 32px;
      padding-left: 29px;
      background-image: var(--q-analysis-bg-gradient-1) !important;
      color: var(--q-analysis-color-3);

      border: 1px solid var(--q-analysis-color-10);
      border-bottom: 0;
      border-radius: 8px 8px 0 0;

      &:last-child {
        border-radius: 8px;
        border-bottom: 1px solid var(--q-analysis-color-10);
      }

      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translate(0, -50%);
        width: 3px;
        height: 14px;
        background: var(--q-analysis-color-12);
      }
    }

    .d-header {
      border-left: 1px solid var(--q-analysis-color-10);
      border-right: 1px solid var(--q-analysis-color-10);
      border-bottom: 1px solid var(--q-analysis-color-10);

      &:last-child {
        border-radius: 0 0 8px 8px;
      }
    }

    .win {
      color: var(--q-analysis-color-14);
    }

    .lose {
      color: var(--q-analysis-color-6);
    }

    .dogfall {
      color: var(--q-analysis-color-4);
    }

    .default {
      color: var(--q-analysis-color-9);
    }

    .simple-title {
      border-left: 1px solid var(--q-analysis-color-10);
      border-right: 1px solid var(--q-analysis-color-10);

      &:last-child {
        border-radius: 0 0 8px 8px;
      }
    }

    .title,
    .simple-title,
    .d-tr,
    .match-info {
      border-left: 1px solid var(--q-analysis-color-10);
      border-right: 1px solid var(--q-analysis-color-10);
    }

    .wrap-home {
      .future-item {
        border-left: 1px solid var(--q-analysis-color-10);
      }
    }

    .wrap-away {
      .future-item {
        border-right: 1px solid var(--q-analysis-color-10);
      }
    }
  }
}
</style>