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
          <div class="yb-absolute ellipsis">{{matchDetail.mhn}}</div>
        </span>
        <img v-img="([_.get(matchDetail,'mhlu[0]'),_.get(matchDetail,'frmhn[0]')])" class="team_logo" alt/>
        <span class="score">{{[0,110].includes(matchDetail.ms)?"—":_.get(matchDetail, 'msc.S1.home')}}</span>
      </div>
      <div class="both-time">
        <div >{{formatTime(matchDetail.mgt,'yyyy/mm/dd hh:MM:ss')}}</div>
        <div class="match-tn">{{matchDetail.tn}}</div>
        <!-- 未开始 -->
        <span  v-if="[0,110].includes(matchDetail.ms)">{{$root.$t("analysis.not_start")}}</span>
        <match-date v-else :match_props="{match: matchDetail}" style="justify-content:center;"></match-date>
      </div>
      <div class="both away">
        <span class="score">{{[0,110].includes(matchDetail.ms)?"—":_.get(matchDetail, 'msc.S1.away')}}</span>
        <img v-img="([_.get(matchDetail,'malu[0]'),_.get(matchDetail,'frman[0]')])" class="team_logo" alt/>
        <span class="team-name">
          <div class="yb-absolute ellipsis">{{matchDetail.man}}</div>
        </span>
      </div>
    </div>

    <div class="tab relative-position" :class='{"tab-no-border": [2, 3, 4, 5].includes(activeTab)}'>
      <span
      v-for="(item,index) in tab"
      :key="index"
      class="item"
      :class="{'active':index == activeTab}"
      @click="switchTabs(index)"
      >{{item == 'news' ? newsTabName : $root.$t(`analysis.${item}`)}}</span>
    </div>

    <q-scroll-area class="rule-scroll-area" :visible="true" :style="{height:'100%',margin: hasNews && activeTab == 0 ? '0' : '0 20px'}">
      <!-- 文章资讯 -->
      <news :mid="this.get_active_detail.mid" v-if="hasNews && activeTab == 0" />
      <!-- 赛况 -->
      <tab-results :match="matchDetail" v-if="show_tab('result')"/>
      <!-- 数据 -->
      <tab-data :match="matchDetail" v-if="show_tab('data')"/>
      <!-- 阵容 -->
      <tab-lineup :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 2"/>
      <!-- 情报 -->
      <tab-information :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 3"/>
      <!-- 赔率 -->
      <tab-odds :match="matchDetail" v-if="(hasNews ? activeTab - 1 : activeTab) == 4"/>
    </q-scroll-area>
  </div>
</template>

<script>
import tabResults from 'src/public/components/analysis/template/tab_results.vue'
import tabData from 'src/public/components/analysis/template/tab_data'
import tabLineup from 'src/public/components/analysis/template/tab_lineup'
import tabInformation from 'src/public/components/analysis/template/tab_information'
import tabOdds from 'src/public/components/analysis/template/tab_odds'
import matchDate from "src/public/components/match_process/match_process.vue";
import {api_analysis} from 'src/public/api/index'
import news from "src/public/components/analysis/template/tab_news"
import { mapGetters } from 'vuex'
import time_format from 'src/public/mixins/common/time_format'
export default {
  data() {
    return {
      //赛况，数据，阵容，情报，赔率
      tab: ['result','data','lineup','information','odds'],
      activeTab: null,
      sportDict:{
        allScore:['S1','S11','S12','S5','S8','S105','S104','S1101',"S17", "S18",'S106','S109','S12345','S1235','S1088','S12346','S111','S108','S107','S110'],
        line: ['S1101',"S17", "S18",'S108','S107','S110']
      },
      hasNews: false,
      articleDetail: {},
      newsTabName: null,
    };
  },
  props: {
    // 获取详情页保存的比分面板数据
    get_active_detail: {
      type: Object,
      default: {}
    }
  },
  mixins:[time_format],
  components:{
    tabResults,tabData,tabLineup,tabInformation,tabOdds,matchDate,news
  },
  created() {
    if (Object.keys(this.$route.params).length) {
      let { csid } = this.$route.params
      // 篮球只展示赛况、数据和阵容
      if(csid == '2'){
        this.tab = ['result','data','lineup']
      }
    }
    // 只在简中和繁中的时候有赛事文章
    if (['zh', 'tw'].includes(this.lang)) {
      if (this.lang == 'zh') {
        this.newsTabName = '资讯'
      } else {
        this.newsTabName = '資訊'
      }
      this.tab.unshift('news');
      this.hasNews = true;
      this.activeTab = this.get_active_detail.ms==1?1:2
      //  如果是C01数据，屏蔽其它tab 只展示资讯、数据
      if (this.get_active_detail.cds=='C01') {
      this.tab = ['news','data']
    }
    } else {
      this.activeTab = this.get_active_detail.ms==1?0:1
      if (this.get_active_detail.cds=='C01') {
      this.tab = ['data']
    }
    }
   
  },
  computed:{
    ...mapGetters({
      // get_active_detail: "get_active_detail", // 获取详情页保存的比分面板数据
      vx_get_user: 'get_user',
      lang: 'get_lang'
    }),
    matchDetail(){
      let match = _.cloneDeep(this.get_active_detail)
      let obj = {}
      if(match.msc_obj){
         this.sportDict.allScore.map(k=>{
          if(!match.msc_obj[k]){
            obj[k] = {
              home: 0,
              away: 0,
              percentage: 50
            }
          } else {
            // 获取主客队得分数据
            let home = parseInt(_.get(match, `msc_obj[${k}][1]`)),
                away = parseInt(_.get(match, `msc_obj[${k}][2]`));
            if(this.sportDict.line.includes(k)){
              //'S108'三分球得分，'S107'两分球得分
              if(k == 'S107'){
                home*= 2
                away*= 2
              }
              if(k == 'S108'){
                home*= 3
                away*= 3
              }
              obj[k] = {
                home: home,
                away: away,
                percentage: isNaN(home / (home+away))? 50: home / (home+away)*100
              }
            } else{
              obj[k] = {
                home: home,
                away: away,
                percentage: isNaN(away / (home+away))? 50: away / (home+away)*100
              }
            }
          }
        })
      } else {
        let msc = match.msc

        this.sportDict.allScore.map(k=>{
          if(!msc[k]){
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
    }
  },
  methods: {
    // 赛况和数据显示与否
    show_tab(type){
      if (type=='result') {
        return (this.hasNews ? this.activeTab - 1 : this.activeTab) == 0 && this.get_active_detail.cds!=='C01'
      }else{
        return (this.hasNews ? this.activeTab - 1 : this.activeTab) == (this.get_active_detail.cds=='C01'?0:1)
      }
    },
    
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
      this.$utils.send_zhuge_event(eventLabel);
    },
    /**
     * 文章阅读数
     */
    atrticleReadCount(id) {
      api_analysis.get_article_count({id: id}).then(res => {
        let count = _.get(res, 'data.data');
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.analysis-page {
  background: var(--qq--y0-bg-color8);
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
          color: var(--qq--analysis-both-time-color-1)
        }
      ::v-deep .c-match-process {
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
    // margin-bottom: 10px;
    // height: 40px;
    // border: 1px solid var(--qq--match-border-color2);
    // background: var(--qq--background-gradient-14);
    background: var(--qq--y0-bg-color12);
    //border: 1px solid var(--qq--match-border-color5);
    border-radius: 8px;
    margin-bottom: 5px;
    padding: 10px;
    // border-radius: 8px;
    // margin-bottom: 10px;
    // &:after {
    //   content: "";
    //   position: absolute;
    //   bottom: 0px;
    //   height: 1px;
    //   width: 100%;
    //   background: var(--qq--analysis-bg-color-2);
    //   z-index: 1;
    // }
    .item {
      // width: 100px;
      height: 25px;
      display: flex;
      padding: 0 18px;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
      border: 0.5px solid var(--qq--theme-bd-tab-item);
      background: var(--qq--y0-bg-color12);
      // border: 1px solid var(--qq--y0-bg-color12);
      // border-bottom-color: var(--qq--analysis-bd-color-2);
      // color: var(--qq--analysis-text-color-3);
      // background: var(--qq--background-gradient-14);
      // border-bottom: 1px solid var(--qq--match-border-color5);
      color: var(--qq--league-rank-title-text-color);
      border-radius: 12px;
      z-index: 2;
      cursor: pointer;
      font-family: PingFangSC-Regular;

      font-size: 12px;
      &.active {
        background: var(--qq--theme-bg-tab-item-active);
        color: var(--qq--analysis-text-color-13);
        // border-bottom-color: var(--qq--analysis-bd-color-3);
        // color: var(--qq--analysis-text-color-4);
        font-family: PingFangSC-Medium;
      }
      &:hover {
        background: var(--qq--theme-bg-tab-item-active);
        color: var(--qq--analysis-text-color-13);
      }
    }
  }
  .tab-no-border {
    border-radius: 8px 8px 0 0;
    margin-bottom: 0;
    // border-bottom: 0;
  }
  /*  内容区 */
  .rule-scroll-area {
    flex: 1;
  }
  ::v-deep {
    .panel {
      border-top: transparent;
      .panel-title {
        position: relative;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        // background-image: var(--qq--analysis-bg-gradient-1) !important;
        // color: var(--qq--analysis-text-color-5);

       border-bottom: 1px solid var(--qq--analysis-bd-color-4-1);
        // background: var(--qq--background-gradient-14);
        background: var(--qq--y0-bg-color12);
       // border: 1px solid var(--qq--match-border-color5);
        color: var(--qq--league-rank-title-text-color);
        // border-bottom: 0;
        border-radius: 8px 8px 0 0;
        // margin-bottom: 5px;
        &:last-child {
          border-radius: 8px;
          // border-bottom: 1px solid var(--qq--analysis-bd-color-4);
        //  border-bottom: 1px solid var(--qq--match-border-color5);
        }
        &:before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0, -50%);
          width: 3px;
          height: 14px;
          background: var(--qq--analysis-bg-color-4);
        }
      }
      .content {
        background: var(--qq--y0-bg-color12);
        border-radius: 8px;
      }
      .d-header {
      //  border-left: 1px solid var(--qq--match-border-color5);
      //  border-right: 1px solid var(--qq--match-border-color5);
        border-bottom: 1px solid var(--qq--match-border-color5);
        &:last-child {
          border-radius: 0 0 8px 8px;
        }
      }
      .win {
        color: var(--qq--analysis-text-color-6);
      }
      .lose {
        color: var(--qq--analysis-text-color-7);
      }
      .dogfall {
        color: var(--qq--analysis-text-color-8);
      }
      .default {
        color: var(--qq--analysis-text-color-9);
      }
      .simple-title {
        border-left: 1px solid var(--qq--match-border-color5);
        border-right: 1px solid var(--qq--match-border-color5);
        &:last-child {
          border-radius: 0 0 8px 8px;
        }
      }
      .title,
      .simple-title,
      .d-tr,
      .match-info {
      //  border-left: 1px solid var(--qq--match-border-color5);
      //  border-right: 1px solid var(--qq--match-border-color5);
      }
      .wrap-home {
        .future-item {
    //      border-left: 1px solid var(--qq--match-border-color5);
        }
      }
      .wrap-away {
        .future-item {
       //   border-right: 1px solid var(--qq--match-border-color5);
        }
      }
    }
  }
}

</style>
