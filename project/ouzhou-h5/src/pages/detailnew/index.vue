<template>
  <div
    :class="['match-detail-container', {'bg_fff': tab == 'event_analysis'}, { 'overflow_hidden': match_detail?.mvs > -1 }]"
    @touchstart.passive="touchstart"
    @scroll="detail_scrolling"
    @touchmove.passive="touchmove"
    @touchend.passive="touchend"
  >
    <loading_page v-show="loading" />
    <!-- mvs动画状态：-1：没有配置动画源 | 0 ：已配置，但是不可用 | 1：已配置，可用，播放中 | 2：已配置，可用，播放中 -->
    <!-- <template v-if="get_detail_data.mvs > -1 || (get_detail_data.mms > 1 && [1,2,7,10,110].includes(get_detail_data.ms*1))"> -->
    <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
    <!-- v-if="match_detail?.mvs > -1 " -->
    <!-- 动画组件 -->
    <div v-if="match_detail?.mvs > -1 || label">
      <detail_header_tem2 :get_match_detail="match_detail || {}" :label="label"/>
    </div>
    
    <div v-else class="mini-header-container"  @click="onClickTest">
      <div class="header-fix" ref="header_fix">
        <div ref="scroll_video_height" class="relative-position scroll_video_h">
          <detail_header_tem1 :get_match_detail="match_detail || {}" @handle-change="handle_change"/>
        </div>
      </div>
    </div>
    <!-- <detail_header_tem2 v-if="match_detail?.mvs" :get_match_detail="match_detail || {}" :label="match_detail?.mvs <= -1 ? 'score' : ''"/> -->
    <div class="change-header-fix" ref="change_header_fix"
      :style="{ visibility: (changeHeader||match_detail?.mvs > -1||match_detail?.mms > -1) ? 'visible' : 'hidden' }">
      <detail_header_tem0 :get_match_detail="match_detail || {}"/>
    </div>
    <div class="detail-container-position">
      <div class="match-detail-tabs-header">
        <div class="separator" style="height: 1px; background-color: #F5F5F5;"></div>
        <div class="match-detail-tabs" v-if="[1,2,'1','2'].includes(match_detail?.csid)">
          <div
            :class="[{ 'tab-active': tab == 'betting' }, 'tabs-item']"
            @click="tabChange('betting')"
          >
            <span class="tab-text">{{ i18n_t("ouzhou.detail.betting") }}</span>
          </div>
          <div style="color: #E2E2E2">|</div>
          <div
            :class="[{ 'tab-active': tab == 'event_analysis' }, 'tabs-item']"
            @click="tabChange('event_analysis')"
          >
            <span class="tab-text">{{ i18n_t("ouzhou.detail.event_analysis") }}</span>
          </div>
        </div>
        <div class="match-detail-line"></div>
        <!-- tabs 玩法分类切换 -->
        <div v-if="tab == 'betting' && category_list?.length > 0 ">
          <detail_tabs :category_list="category_list" :active="tab_selected_obj"
            @detail_tabs_change="detail_tabs_change"/>
        </div>
        <div v-if="tab == 'event_analysis'">
          <detail_event_tabs :match_detail="match_odds_info" @change="detail_event_tabs_change" />
        </div>
      </div>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="betting">
          <!-- 玩法模板 -->
          <div ref="fixedHeight" class="match-detail-odds-scroll"
            :class="[match_detail?.mvs > -1 ? 'match-detail-odds-height2' : 'match-detail-odds-height3']">
            <OddsListContrainer :match_odds_info="match_odds_info" :match_detail="match_detail"
              :loading="loading"/>
          </div>
          <!-- <div class="match-detail-odds-bottom"></div> -->
        </q-tab-panel>
        <q-tab-panel name="event_analysis">
          <event_analysis :match_odds_info="match_odds_info" :match_detail="match_detail" :active_tab="detail_event_tabs_value" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <!-- 视频info说明弹窗,和切换高清和标清的 弹框 -->
    <info-rules v-if="get_info_show" class="info_rules"></info-rules>
  </div>
</template>

<script >
import { onMounted, ref, watch, onUnmounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import detail_header_tem0 from "./detail_header/detail_header_tem0.vue";
import detail_header_tem1 from "./detail_header/detail_header_tem1.vue";
import detail_header_tem2 from "./detail_header/detail_header_tem2.vue";
import detail_tabs from "./components/detail_tabs.vue";
import detail_event_tabs from "./components/detail_event_tabs.vue";
// import odds_info from "./components/odds_info.vue";
// import odds_info from "./components/bevis_odds_info.vue";
import OddsListContrainer from "./components/OddsListContrainer.vue";
import loading_page from 'src/components/details/loading/index.vue'
import event_analysis from "./components/event_analysis.vue";
import { details_main } from "./details.js";
import { i18n_t } from "src/output/index.js"
import infoRules from "src/base-h5/components/details/components/info-rules.vue"  // 视频info说明弹框
// import './index.scss'
export default {
  components:{
    detail_header_tem0,
    detail_header_tem1,
    detail_header_tem2,
    detail_tabs,
    detail_event_tabs,
    // odds_info,
    loading_page,
    event_analysis,
    OddsListContrainer,
    infoRules
  },
  setup(ctx){
    const router = useRouter();
    const route = useRoute();
    const mid = ref(route?.params?.mid)
    const {
      detail_store,
      match_odds_info,
      match_detail,
      category_list,
      tab,
      cuid,
      scroller_height,
      loading ,
      detail_event_tabs_value,
      timer ,
      mst_timer ,
      tab_selected_obj ,
      change_header_fix ,
      header_fix,
      fixedHeight,
      tabChange,
      detail_event_tabs_change,
      detail_scrolling,
      touchmove,
      touchend,
      touchstart,
      detail_tabs_change,
      changeHeader,
      MatchDataWarehouseInstance,
      get_info_show
    } = details_main(router,route)

    const label = ref("");
    
    const handle_change = (value) => {
      console.log(value, "valuessss");
      label.value = value;
    }

    watch(() => route.params.mid, (value) => {
      label.value = "";
    })

    return{
      label,
      handle_change,
      detail_store,
      match_odds_info,
      match_detail,
      category_list,
      tab,
      cuid,
      scroller_height,
      loading ,
      detail_event_tabs_value,
      timer ,
      mst_timer ,
      tab_selected_obj ,
      change_header_fix ,
      header_fix,
      fixedHeight,
      tabChange,
      detail_event_tabs_change,
      detail_scrolling,
      touchmove,
      touchend,
      touchstart,
      detail_tabs_change,
      changeHeader,
      mid,
      MatchDataWarehouseInstance,
      get_info_show
     }
  } 
}



</script>

<style lang="scss" scoped>
.info_rules {
  :deep(.content-box) {
    background-color: #fff;
  }
}
.match-detail-container {
  display: flex;
  flex-direction: column;
  background: #F1F1F1;
  // height: calc(100vh - 50px - 54px );
  height: 100%;
  width: 100%;
  // height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overflow-x: hidden;
  .mini-header-container {
    /** 不太清楚这里为什么要吸顶, 现有效果中似乎不需要这个吸顶 */
    // position: sticky;
    // top: 0;
    position: relative;
    z-index: 102;
    width: 100%;
  }
  .header-fix {

  }
  .change-header-fix {
    width: 100vw;
    position: fixed;
    top: 49px;
    z-index: 91;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
  .detail-container-position {
    position: relative;
    z-index: 90;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .match-detail-line {
    height: 10px;
    background: #F1F1F1;
  }
  .match-detail-tabs-header {
    position: sticky;
    width: 100vw;
    top: 43px;
    z-index: 81;
    width: 100%;
  }
  .match-detail-tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    color: var(--q-gb-t-c-4);
    background-color: var(--q-gb-bg-c-2);
    .tab-active {
      color: var(--q-gb-t-c-1);
      .tab-text {
        display: inline-block;
        font-weight: 500;
        position:relative;
       &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 3px;
        bottom: 0;
        left:0;
        background:var(--q-gb-bd-c-1);
      }
       // border-bottom: 3px solid var(--q-gb-bd-c-1);
      }
    }
    .tabs-item {
      width: 50%;
      text-align: center;
    }
  }
  .q-tab-panel {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
  }
  .match-detail-tab {
    height: 50px;
    background-color: var(--q-gb-bg-c-2);
  }
  .match-detail-odds-scroll {
    width: 100vw;
    background: #F1F1F1;
    // padding: 14px 0;
    // min-height: calc(100vh - 50px);
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
  // .match-detail-odds-height1 {
  //   height: calc(100vh - 210px);
  // }
  .match-detail-odds-height2 {
    // overflow-y: scroll;
    // height: calc(100vh - 325px);
  }
  // .match-detail-odds-height3 {
  //   height: calc(100vh - 275px);
  // }
  // .match-detail-odds-bottom {
  //   width: 100%;
  //   background: #C4C4C4;
  //   height: 30px;
  //   position: fixed;
  //   bottom: 0;
  // }
}
.bg_fff {
  background-color: var(--q-gb-bg-c-2);
}
.overflow_hidden {
  // overflow: hidden;
  // height: 100vh;
}
</style>