<!--
 * @Author: 'jacques' 'jacques@itcom888.com'
 * @Date: 2023-10-02 16:12:29
 * @LastEditors: lowen pmtylowen@itcom888.com
 * @FilePath: \user-pc-vite\src\components\analysis\index.vue
 * @Description: 足篮赛事分析页
-->
<template>
  <div class="analysis-page relative-position" :style="page_style">
    <div class="match-header" v-if="matchLoaded">
      <div class="both home">
        <span class="team-name">
          <div class="yb-absolute ellipsis">{{ matchDetail.mhn }}</div>
        </span>
        <img v-img="([lodash.get(matchDetail, 'mhlu[0]'), lodash.get(matchDetail, 'frmhn[0]')])" class="team_logo" alt />
        <span class="score">{{ [0, 110].includes(matchDetail.ms) ? "—" : lodash.get(matchDetail, 'msc.S1.home') }}</span>
      </div>
      <div class="both-time">
        <div style="color:#83838A;margin-bottom: 6px;">{{ formatTime(matchDetail.mgt, 'yyyy/mm/dd hh:MM:ss') }}</div>
        <div>{{ matchDetail.tn }}</div>
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

    <div class="tab relative-position">
      <span v-for="(item, index) in tab" :key="index" class="item" :class="{ 'active': index == activeTab }"
        @click="switchTabs(index)">{{ item == 'news' ? newsTabName : i18n_t(`analysis.${item}`) }}</span>
    </div>

    <q-scroll-area class="rule-scroll-area" :visible="true" v-if="matchLoaded"
      :style="{ height: '100%', margin: hasNews && activeTab == 0 ? '0' : '0 20px' }">
      <!-- 文章资讯  -->
      <news :mid="mid" v-if="hasNews && activeTab == 0" />
      <!-- 赛况 -->
      <tab-results :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 0" />
      <!-- 数据 -->
      <tab-data :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 1" />
      <!-- 阵容 -->
      <tab-lineup :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 2" />
      <!-- 情报 -->
      <tab-information :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 3" />
      <!-- 赔率 -->
      <tab-odds :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 4" />
    </q-scroll-area>
  </div>
</template>



<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { TabResultsFullVersionWapper as tabResults } from 'src/base-pc/components/analysis/template/tab-results/index.js'

import { TableDataFullVersionWapper as tabData } from 'src/base-pc/components/analysis/template/tab-data/index.js'
import { TabLineupFullVersionWapper as tabLineup } from 'src/base-pc/components/analysis/template/tab-lineup/index.js'
import { TabInformationFullVersionWapper as tabInformation } from 'src/base-pc/components/analysis/template/tab-information/index.js'
import { TabOddsFullVersionWapper as tabOdds } from 'src/base-pc/components/analysis/template/tab-odds/index.js'
import { TabNewsFullVersionWapper as news } from 'src/base-pc/components/analysis/template/tab-news/index.js'
import { MatchProcessFullVersionWapper as matchDate } from "src/components/match-process/index.js";
import { api_analysis, api_details, api_common } from 'src/api/index.js'
import { compute_css_variables } from "src/core/css-var/index.js"
import { formatTime,msc_array_obj } from 'src/output/index.js'
import zhugeTag from "src/core/http/zhuge-tag.js"
//import store from 'src/store-redux/index.js'
import { UserCtr } from "src/output/index.js";
// let state = store.getState();

export default {
  components: {
    tabResults,
    tabData,
    tabLineup,
    tabInformation,
    tabOdds,
    matchDate,
    news
  },
  setup() {
    const route = useRoute();

    //赛况，数据，阵容，情报，赔率
    const tab = ref(['result', 'data', 'lineup', 'information', 'odds'])
    // 赛事分析页面  css变量
    const page_style = ref('')
    page_style.value = compute_css_variables({ category: 'component', module: 'analysis' })
    const activeTab = ref(null)
    const sportDict = ref({
      allScore: ['S1', 'S11', 'S12', 'S5', 'S8', 'S105', 'S104', 'S1101', "S17", "S18", 'S106', 'S109', 'S12345', 'S12346', 'S111', 'S108', 'S107', 'S110'],
      line: ['S1101', "S17", "S18", 'S108', 'S107', 'S110']
    })
    const hasNews = ref(false)
    const articleDetail = ref({})
    const newsTabName = ref(null)
    // let mid = lodash.get(route, 'params.mid');
    const mid = ref(0);
    // (function(){
    //   let match_info = JSON.parse(localStorage.getItem('test_match_info'));
    //   console.log('--------------------------------',match_info)
    // })()
    const euid = route.params.euid
    // let params = { mids: route.params.mid, "cuid": UserCtr.get_uid(), euid, "orpt": "0", "sort": false, "pids": "", "cos": 0 }
    const matchDetail = ref({})
    const matchLoaded = ref(false) //match 数据接口是否就绪
    let params = { mid: route.params.mid, cuid: UserCtr.get_uid() }
    api_details.get_match_detail_MatchInfo(params).then(res => {
      let match = res.data
      mid.value = match.mid //设置news 需要的mid
      // 设置页面激活的tab
      if (['zh', 'tw', 'hk'].includes(UserCtr.lang)) {
        activeTab.value = match.ms == 1 ? 1 : 2
      }else {
        activeTab.value = match.ms == 1 ? 0 : 1
      }
      match.msc = msc_array_obj(match.msc)
      return match
    }).then(match_info => {
      // computed(() => {
        let match = lodash.cloneDeep(match_info) || {}
        let obj = {}
        if (match.msc_obj) {
          sportDict.value.allScore.map(k => {
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
              if (sportDict.value.line.includes(k)) {
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

          sportDict.value.allScore.map(k => {
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
      // })
    }).then(match => {
      matchDetail.value = match
      matchLoaded.value = true
    })

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
    if (['zh', 'tw', 'hk'].includes(UserCtr.lang)) {
      if (['zh', 'hk'].includes(UserCtr.lang)) {
        newsTabName.value = '资讯'
      } else {
        newsTabName.value = '資訊'
      }
      tab.value.unshift('news');
      hasNews.value = true;
      // activeTab.value = match_info.ms == 1 ? 1 : 2
    } else {
      // activeTab.value = match_info.ms == 1 ? 0 : 1
    }



    return {
      tab,
      activeTab,
      sportDict,
      hasNews,
      articleDetail,
      newsTabName,
      page_style,
      route,
      matchDetail,
      matchLoaded,
      formatTime,
      // MatchListData,
      // match_info,
      mid,
      i18n_t
    }
  },
  methods: {
    switchTabs(index) {
      this.activeTab = index;
      let eventLabel = '';
      switch (index) {
        case 0:
          eventLabel = 'PC_情报分析_资讯'
          break
        case 1:
          eventLabel = 'PC_情报分析_赛况'
          break;
        case 2:
          eventLabel = 'PC_情报分析_数据'
          break;
        case 3:
          eventLabel = 'PC_情报分析_阵容'
          break;
        case 4:
          eventLabel = 'PC_情报分析_情报'
          break;
        default:
          eventLabel = 'PC_情报分析_赔率'
      }
      // 发送埋点事件
      zhugeTag.send_zhuge_event(eventLabel);
    },
    /**
     * 文章阅读数
     */
    atrticleReadCount(id) {
      api_common.addArticleCount({ id: id }).then(res => {
        let count = lodash.get(res, 'data.data');
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.analysis-page {
  background: var(--q-analysis-color-16);
  flex: 1;
  // padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  min-width: 1000px;

  &>* {
    margin: 0 20px;
  }

  /*  height calc(100vh - 20px) */
  /*  头部比分展示区域 */
  .match-header {
    height: 115px;
    display: flex;
    justify-content: center;
    align-items: center;

    .both-time {
      width: 285px;
      line-height: 17px;
      text-align: center;

      :deep(.c-match-process) {
        .process-name {
          padding: 0 5px 0 0;
        }

        .c-match-date {
          padding: 0 0 0 5px;
        }
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
        color: var(--q-analysis-color-1);
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
        color: var(--q-analysis-color-5);
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