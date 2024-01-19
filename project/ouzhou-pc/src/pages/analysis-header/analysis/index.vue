<!--
 * @Author:
 * @Date:
 * @Description: 足篮赛事分析页
 * @Path:
-->
<template>
  <div class="analysis-page relative-position">
    <div class="match-header">
      <div class="both home">
        <span class="team-name">
          <div class="yb-absolute ellipsis">{{ matchDetail.mhn }}</div>
        </span>
        <img
          v-img="[
            lodash.get(matchDetail, 'mhlu[0]'),
            lodash.get(matchDetail, 'frmhn[0]'),
          ]"
          class="team_logo"
          alt
        />
        <span class="score">{{
          [0, 110].includes(matchDetail.ms)
            ? "—"
            : lodash.get(matchDetail, "msc.S1.home")
        }}</span>
      </div>
      <div class="both-time">
        <div>{{ formatTime(matchDetail.mgt, "yyyy/mm/dd hh:MM:ss") }}</div>
        <div class="match-tn">{{ matchDetail.tn }}</div>
        <!-- 未开始 -->
        <span v-if="[0, 110].includes(matchDetail.ms)">{{
          i18n_t("analysis.not_start")
        }}</span>
        <match-date
          v-else
          :match_props="{ match: matchDetail }"
          style="justify-content: center"
        ></match-date>
      </div>
      <div class="both away">
        <span class="score">{{
          [0, 110].includes(matchDetail.ms)
            ? "—"
            : lodash.get(matchDetail, "msc.S1.away")
        }}</span>
        <img
          v-img="[
            lodash.get(matchDetail, 'malu[0]'),
            lodash.get(matchDetail, 'frman[0]'),
          ]"
          class="team_logo"
          alt
        />
        <span class="team-name">
          <div class="yb-absolute ellipsis">{{ matchDetail.man }}</div>
        </span>
      </div>
    </div>

    <div
      class="tab relative-position"
      :class="{
        'tab-no-border': [2, 3, 4, 5].includes(activeTab),
        mya_tab_style: ['mya'].includes(UserCtr.lang),
      }"
    >
      <span
        v-for="(item, index) in tab"
        :key="index"
        class="item"
        :class="{ active: index == activeTab }"
        @click="switchTabs(index)"
        >{{ item == "news" ? newsTabName : i18n_t(`analysis.${item}`) }}</span
      >
    </div>

    <q-scroll-area
      class="rule-scroll-area"
      :visible="true"
      :style="{
        height: '100%',
        margin: hasNews && activeTab == 0 ? '0' : '0 20px',
      }"
    >
      <!-- 文章资讯 -->
      <news
        :mid="this.get_active_detail.mid"
        v-if="hasNews && activeTab == 0"
      />
      <!-- 赛况 -->
      <tab-results :match="matchDetail" v-if="show_tab('result')" />
           <!-- 数据 -->
       <tab-data :match="matchDetail" v-if="show_tab('data')"/>
     <!-- 阵容 -->
     <tab-lineup :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 2"/>
      
       <tab-information :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 3"/>
      
      <tab-odds :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 4"/>
    </q-scroll-area>
  </div>
</template>

<script>
import tabResults from "./template/tab_results.vue";
 import tabData from './template/tab_data.vue'
 import tabLineup from './template/tab_lineup.vue'
  import tabInformation from './template/tab_information.vue'
 import tabOdds from './template/tab_odds.vue'
import { MatchProcessFullVersionWapper as matchDate } from "src/components/match-process/index.js";
// import {api_analysis} from 'src/public/api/index'
import { api_analysis, api_details, api_common } from "src/api/index.js";
import news from "./template/tab_news.vue";
// import { mapGetters } from 'vuex'

import { formatTime, msc_array_obj } from "src/output/index.js";
import zhugeTag from "src/core/http/zhuge-tag.js";
//import store from 'src/store-redux/index.js'
import { UserCtr } from "src/output/index.js";
export default {
  data() {
    return {
      //赛况，数据，阵容，情报，赔率
      tab: ["result", "data", "lineup", "information", "odds"],
      activeTab: null,
      sportDict: {
        allScore: [
          "S1",
          "S11",
          "S12",
          "S5",
          "S8",
          "S105",
          "S104",
          "S1101",
          "S17",
          "S18",
          "S106",
          "S109",
          "S12345",
          "S1235",
          "S1088",
          "S12346",
          "S111",
          "S108",
          "S107",
          "S110",
        ],
        line: ["S1101", "S17", "S18", "S108", "S107", "S110"],
      },
      hasNews: false,
      articleDetail: {},
      newsTabName: null,
      formatTime,
      UserCtr,
    };
  },
  props: {
    // 获取详情页保存的比分面板数据
    get_active_detail: {
      type: Object,
      default: {},
    },
  },

  components: {
    matchDate,
    news,
    tabResults,
    tabData,
    tabLineup,
     tabInformation,
    tabOdds
  },
  created() {
    if (Object.keys(this.$route.params).length) {
      let { csid } = this.$route.params;
      // 篮球只展示赛况、数据和阵容
      if (csid == "2") {
        this.tab = ["result", "data", "lineup"];
      }
    }
    // 只在简中和繁中的时候有赛事文章
    if (["zh", "tw", "hk"].includes(this.UserCtr.lang)) {
      if (this.UserCtr.lang == "zh" || this.UserCtr.lang == "hk") {
        this.newsTabName = "资讯";
      } else {
        this.newsTabName = "資訊";
      }
      this.tab.unshift("news");
      this.hasNews = true;
      this.activeTab = this.get_active_detail.ms == 1 ? 1 : 2;
      //  如果是C01数据，屏蔽其它tab 只展示资讯、数据
      if (this.get_active_detail.cds == "C01") {
        this.tab = ["news", "data"];
      }
    } else {
      this.activeTab = this.get_active_detail.ms == 1 ? 0 : 1;
      if (this.get_active_detail.cds == "C01") {
        this.tab = ["data"];
      }
    }
  },
  computed: {
    // ...mapGetters({
    //   // get_active_detail: "get_active_detail", // 获取详情页保存的比分面板数据
    //   vx_get_user: 'get_user',
    //   lang: 'get_lang'
    // }),
    matchDetail() {
      let match = lodash.cloneDeep(this.get_active_detail);
    
      let obj = {};
      if (match.msc_obj) {
        this.sportDict.allScore.map((k) => {
          if (!match.msc_obj[k]) {
            obj[k] = {
              home: 0,
              away: 0,
              percentage: 50,
            };
          } else {
            // 获取主客队得分数据
            let home = parseInt(lodash.get(match, `msc_obj[${k}][1]`)),
              away = parseInt(lodash.get(match, `msc_obj[${k}][2]`));
            if (this.sportDict.line.includes(k)) {
              //'S108'三分球得分，'S107'两分球得分
              if (k == "S107") {
                home *= 2;
                away *= 2;
              }
              if (k == "S108") {
                home *= 3;
                away *= 3;
              }
              obj[k] = {
                home: home,
                away: away,
                percentage: isNaN(home / (home + away))
                  ? 50
                  : (home / (home + away)) * 100,
              };
            } else {
              obj[k] = {
                home: home,
                away: away,
                percentage: isNaN(away / (home + away))
                  ? 50
                  : (away / (home + away)) * 100,
              };
            }
          }
        });
      } else {
        let msc = match.msc;

        this.sportDict.allScore.map((k) => {
          if (!msc[k]) {
            obj[k] = {
              home: 0,
              away: 0,
              percentage: 50,
            };
          }
        });
        Object.assign(obj, msc);
      }
      match.msc = obj;
      console.log(1111155, match);
      return match;
    },
  },
  methods: {
    // 赛况和数据显示与否
    show_tab(type) {
      if (type == "result") {
        return (
          (this.hasNews ? this.activeTab - 1 : this.activeTab) == 0 &&
          this.get_active_detail.cds !== "C01"
        );
      } else {
        return (
          (this.hasNews ? this.activeTab - 1 : this.activeTab) ==
          (this.get_active_detail.cds == "C01" ? 0 : 1)
        );
      }
    },

    switchTabs(index) {
      this.activeTab = index;
      let eventLabel = "";
      switch (index) {
        case 0:
          eventLabel = "PC_情报分析_资讯";
          break;
        case 1:
          eventLabel = "PC_情报分析_赛况";
          break;
        case 2:
          eventLabel = "PC_情报分析_数据";
          break;
        case 3:
          eventLabel = "PC_情报分析_阵容";
          break;
        case 4:
          eventLabel = "PC_情报分析_情报";
          break;
        default:
          eventLabel = "PC_情报分析_赔率";
      }
      // 发送埋点事件
      zhugeTag.send_zhuge_event(eventLabel);
    },
    /**
     * 文章阅读数
     */
    atrticleReadCount(id) {
      api_analysis.get_article_count({ id: id }).then((res) => {
        let count = lodash.get(res, "data.data");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// :deep(){
//   .panel-title {
//     color:red
//   }
// }
.analysis-page {
  background: #e2e2e2;
  flex: 1;
  // padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  min-width: 1000px;
  & > * {
    margin: 0 20px;
  }
  /*  height calc(100vh - 20px) */
  /*  头部比分展示区域 */
  .match-header {
    color: var(--qq--y0-text-color5);
    height: 115px;
    display: flex;
    justify-content: center;
    align-items: center;
    .both-time {
      color: var(--qq--y0-text-color5);
      width: 285px;
      line-height: 17px;
      text-align: center;
      div:first-child {
        color: var(--qq--analysis-both-time-color-1);
      }

      :deep(.c-match-process) {
        .process-name {
          padding: 0 5px 0 0;
        }
        .c-match-date {
          padding: 0 0 0 5px;
        }
      }
      .match-tn {
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
        color: var(--qq--y0-text-color5_3_1);
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
    background: #ffffff;
    margin-bottom: 5px;
    padding: 10px;
    .item {
      // width: 100px;
      height: 25px;
      display: flex;
      padding: 0 18px;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
      border-radius: 12px;
      border: 0.5px solid #e2e2e2;
      background: #ffffff;
      color: #484848;
      border-radius: 12px;
      z-index: 2;
      cursor: pointer;
      font-family: PingFangSC-Regular;

      font-size: 12px;
      &.active {
        background: #ff7000 !important;
        color: #ffffff !important;
        // border-bottom-color: var(--qq--analysis-bd-color-3);
        // color: var(--qq--analysis-text-color-4);
        font-family: PingFangSC-Medium;
      }
      &:hover {
        background: #ff7000;
        color: #ffffff;
      }
    }
  }
  .tab-no-border {
    // border-radius: 8px 8px 0 0;
    margin-bottom: 0;
    // border-bottom: 0;
    .tab.mya_tab_style {
      .item {
        width: 110px;
      }
    }
    /*  内容区 */
    .rule-scroll-area {
      flex: 1;
    }
  }
  :deep(.datum.mya_width_style) {
    .select-wrap .selct-menu {
      width: 190px;
    }
    .select-wrap .selct-menu .select-page {
      width: 190px;
    }
    .before .content .d-title div {
      max-width: 300px;
      width: 24.15%;
    }
    .near .t-body .away .d-title div {
      width: 270px;
    }
    .near .t-body .home .d-title div {
      width: 270px;
    }
    .history .content .d-title span {
      width: 100px;
    }
  }

  :deep() {
    .panel {
      border-top: transparent;
      .panel-title {
        position: relative;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        border-bottom: 1px solid #e2e2e2;
        background: #ffffff;
        color: #1a1a1a;
        font-weight: 500;
        // border-radius: 8px 8px 0 0;
        &:last-child {
          // border-radius: 8px;
        }
        &:before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0, -50%);
          width: 3px;
          height: 14px;
          background: #ff7000;
          border-radius: 0px 8px 8px 0;
        }
      }
      .content {
        background: #ffffff;
        // border-radius: 0 0 8px 8px;
      }
      .d-header {
        //  border-left: 1px solid var(--qq--match-border-color5);
        //  border-right: 1px solid var(--qq--match-border-color5);
        //  border-bottom: 1px solid var(--qq--match-border-color5);
        &:last-child {
          // border-radius: 0 0 8px 8px;
        }
      }
      .win {
        color: #ff7373;
      }
      .lose {
        color: #71c866;
      }
      .dogfall {
        color: #5ab6f7;
      }
      .default {
        color: #afb3bb;
      }
      .simple-title {
        background: #ffffff;
        border-left: 1px solid #E4EAFF;
        border-right: 1px solid #E4EAFF;
        &:last-child {
          border-radius: 0 0 8px 8px;
        }
      }
    }
  }
  :deep(.select-wrap .tab-menu span) {
    color: #555555;
  }
}
</style>
