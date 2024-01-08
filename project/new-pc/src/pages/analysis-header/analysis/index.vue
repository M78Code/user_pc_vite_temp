<template>
  <div class="analysis-page">
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
    <div class="analysis-page-c">
      <div class="tab">
        <span v-for="(item, index) in tab" :key="index" class="item" :class="{ 'active': item === activeTab }"
            @click="switchTabs(item)">{{ item === 'news' ? newsTabName : i18n_t(`analysis.${item}`) }}</span>
      </div>
      <q-scroll-area class="rule-scroll-area" :visible="true" v-if="matchLoaded" style="height: 100%">
        <!-- 文章资讯  -->
        <news :mid="mid" v-if="activeTab === 'news'" />
        <!-- 赛况 -->
        <tab-results :match="matchDetail" v-if="activeTab === 'result'" />
        <!-- 数据 -->
        <tab-data :match="matchDetail" v-if="activeTab === 'data'" />
        <!-- 阵容 -->
        <tab-lineup :match="matchDetail" v-if="activeTab === 'lineup'" />
        <!-- 情报 -->
        <tab-information :match="matchDetail" v-if="activeTab === 'information'" />
        <!-- 赔率 -->
        <tab-odds :match="matchDetail" v-if="activeTab === 'odds'" />
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import { useRoute } from 'vue-router';
import { api_analysis, api_details } from 'src/api/index.js'
import {msc_array_obj, formatTime, UserCtr} from "src/output/index.js";
import { MatchProcessFullVersionWapper as matchDate } from "src/components/match-process/index.js";

import { TabNewsFullVersionWapper as news } from './template/tab-news/index.js';
import { TabResultsFullVersionWapper as tabResults } from './template/tab-results/index.js';
import { TableDataFullVersionWapper as tabData } from './template/tab-data/index.js'
import { TabLineupFullVersionWapper as tabLineup } from './template/tab-lineup/index.js'
import { TabInformationFullVersionWapper as tabInformation } from './template/tab-information/index.js'
import { TabOddsFullVersionWapper as tabOdds } from 'src/base-pc/components/analysis/template/tab-odds/index.js'

import zhugeTag from "src/core/http/zhuge-tag.js";

//赛况，数据，阵容，情报，赔率
const tab = ref(['result', 'data', 'lineup', 'information', 'odds']);
const activeTab = ref(null); //用字符串代替数字可减少判断
const sportDict = {
  allScore: ['S1', 'S11', 'S12', 'S5', 'S8', 'S105', 'S104', 'S1101', "S17", "S18", 'S106', 'S109', 'S12345', 'S12346', 'S111', 'S108', 'S107', 'S110'],
  line: ['S1101', "S17", "S18", 'S108', 'S107', 'S110']
}
const matchDetail = ref({})
const matchLoaded = ref(false) //match 数据接口是否就绪

const hasNews = ref(false)
const articleDetail = ref({})
const newsTabName = ref(null)

const route = useRoute();

const mid = ref(0);

if (Object.keys(route.params).length) {
  let { csid } = route.params
  // 篮球只展示赛况、数据和阵容
  if (csid == '2') {
    tab.value = ['result', 'data', 'lineup']
  }
}

// 只在简中和繁中的时候有赛事文章
// if (['zh', 'tw'].includes(localStorage.getItem('lang'))) {
// if (localStorage.getItem('lang') == 'zh') {
if (['zh', 'tw'].includes(UserCtr.lang)) {
  if (UserCtr.lang == 'zh') {
    newsTabName.value = '资讯'
  } else {
    newsTabName.value = '資訊'
  }
  tab.value.unshift('news');
  hasNews.value = true;
}

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
    activeTab.value = match.ms == 1 ? 'result' : 'data';
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

function switchTabs(item, index) {
  activeTab.value = item;
  // let eventLabel = '';
  // switch (index) {
  //   case 0:
  //     eventLabel = 'PC_情报分析_资讯'
  //     break
  //   case 1:
  //     eventLabel = 'PC_情报分析_赛况'
  //     break;
  //   case 2:
  //     eventLabel = 'PC_情报分析_数据'
  //     break;
  //   case 3:
  //     eventLabel = 'PC_情报分析_阵容'
  //     break;
  //   case 4:
  //     eventLabel = 'PC_情报分析_情报'
  //     break;
  //   default:
  //     eventLabel = 'PC_情报分析_赔率'
  // }
  // // 发送埋点事件
  // zhugeTag.send_zhuge_event(eventLabel);
}


</script>

<style lang="scss" scoped>
.analysis-page {
  background: linear-gradient(180deg, #EAF2FF 0%, #E7F0FF 100%);
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
  .analysis-page-c {
    padding: 10px;
    height: 100%;
  }
  /*  tab 区 */
  .tab {
    display: flex;
    gap: 15px;
    align-items: center;
    //margin-bottom: 10px;
    background: #F6F9FF;
    border: 2px solid #FFFFFF;
    border-radius: 6px;
    height: 48px;
    padding: 0 15px;
    .item {
      height: 30px;
      line-height: 30px;
      padding: 0 35px;
      cursor: pointer;
      font-family: PingFangSC;
      font-size: 12px;
      color: #555555;
      background: linear-gradient(180deg, #E4ECFD 0%, #F8FAFF 47.92%, #F5F8FF 100%);
      border: 0.5px solid #D7E1FD;
      box-shadow: 0px 3px 3px 0px rgba(0, 56, 98, 0.1);
      border-radius: 100px;
      &.active {
        background: #179CFF;
        color: #fff;
        border: none;
        box-shadow: none;
      }
    }
  }

  /*  内容区 */
  .rule-scroll-area {
    flex: 1;
  }
  :deep(.panel) {
    border-top: transparent;
    background: #fff;
    .panel-title {
      position: relative;
      height: 32px;
      line-height: 32px;
      padding-left: 29px;
      background-image: var(--q-analysis-bg-gradient-1) !important;
      color: var(--q-analysis-color-3);

      border: 1px solid #DEE4F2;
      border-bottom: 0;
      border-radius: 8px 8px 0 0;

      &:last-child {
        border-radius: 8px;
        border-bottom: 1px solid #DEE4F2;
      }

      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translate(0, -50%);
        width: 3px;
        height: 14px;
        background: #179cff;
      }
    }

    .d-header {
      border-left: 1px solid #DEE4F2;
      border-right: 1px solid #DEE4F2;
      border-bottom: 1px solid #DEE4F2;

      &:last-child {
        border-radius: 0 0 8px 8px;
      }
    }

    .win {
      color: #E93D3D;;
    }

    .lose {
      color: #71c866;;
    }

    .dogfall {
      color: #179cff;
    }

    .default {
      color: var(--q-analysis-color-9);
    }

    .simple-title {
      border-left: 1px solid #DEE4F2;
      border-right: 1px solid #DEE4F2;

      &:last-child {
        border-radius: 0 0 8px 8px;
      }
    }

    .title,
    .simple-title,
    .d-tr,
    .match-info {
      border-left: 1px solid #DEE4F2;
      border-right: 1px solid #DEE4F2;
    }
    .d-tr {
      border-top: 1px solid #DEE4F2;
    }
    .wrap-home {
      .future-item {
        border-left: 1px solid #DEE4F2;
      }
    }

    .wrap-away {
      .future-item {
        border-right: 1px solid #DEE4F2;
      }
    }
  }
}
</style>