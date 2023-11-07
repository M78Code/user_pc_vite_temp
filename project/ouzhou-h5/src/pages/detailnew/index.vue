<template>
  <div
    :class="['match-detail-container', {'bg_fff': tab == 'event_analysis'}, { 'overflow_hidden': match_detail.mvs > -1 }]"
    @touchstart.passive="touchstart"
    @scroll="detail_scrolling"
    @touchmove.passive="touchmove"
    @touchend.passive="touchend"
  >
    <loading_page v-show="loading" />
    <div v-if="match_detail.mvs > -1">
      <detail_header_tem2 :get_match_detail="match_detail" />
    </div>
    <div v-else class="mini-header-container">
      <div class="header-fix" ref="header_fix">
         <!-- v-if="!changeHeader" -->
        <div ref="scroll_video_height" class="relative-position scroll_video_h">
          <detail_header_tem1 :get_match_detail="match_detail" />
        </div>
      </div>
    </div>
    <div class="change-header-fix" ref="change_header_fix"
      :style="{
        visibility: changeHeader ? 'visible' : 'hidden',
      }">
      <detail_header_tem0 :get_match_detail="match_detail"/>
    </div>
    <div class="detail-container-position">
      <div class="match-detail-tabs-header">
        <q-separator />
        <div class="match-detail-tabs" v-if="['1','2'].includes(match_detail.csid)">
          <div
            :class="[{ 'tab-active': tab == 'betting' }, 'tabs-item']"
            @click="tabChange('betting')"
          >
            <span class="tab-text">Betting</span>
          </div>
          <div style="color: #E2E2E2">|</div>
          <div
            :class="[{ 'tab-active': tab == 'event_analysis' }, 'tabs-item']"
            @click="tabChange('event_analysis')"
          >
            <span class="tab-text">Event Analysis</span>
          </div>
        </div>
        <div class="match-detail-line"></div>
        <!-- tabs 玩法分类切换 -->
        <div v-if="tab == 'betting'">
          <detail_tabs :category_list="category_list" :active="tab_selected_obj" @detail_tabs_change="detail_tabs_change"/>
        </div>
        <div v-if="tab == 'event_analysis'">
          <detail_event_tabs @change="detail_event_tabs_change" />
        </div>
      </div>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="betting">
          <!-- 玩法模板 -->
          <div ref="fixedHeight" class="match-detail-odds-scroll"
            :class="[match_detail.mvs > -1 ? 'match-detail-odds-height2' : 'match-detail-odds-height3']">
            <odds_info :match_odds_info="match_odds_info" :match_detail="match_detail" :loading="loading"/>
          </div>
          <!-- <div class="match-detail-odds-bottom"></div> -->
        </q-tab-panel>
        <q-tab-panel name="event_analysis">
          <event_analysis :match_odds_info="match_odds_info" :match_detail="match_detail" :active_tab="detail_event_tabs_value" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import { MatchDetailCalss, MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance } from "src/core";
import detail_header_tem0 from "./detail_header/detail_header_tem0.vue";
import detail_header_tem1 from "./detail_header/detail_header_tem1.vue";
import detail_header_tem2 from "./detail_header/detail_header_tem2.vue";
import detail_tabs from "./components/detail_tabs.vue";
import detail_event_tabs from "./components/detail_event_tabs.vue";
import odds_info from "./components/odds_info.vue";
import loading_page from 'src/components/details/loading/index.vue'
import event_analysis from "./components/event_analysis.vue";
// import { detail_module } from "src/project-ouzhou/stores/detail"; //todo
import { api_match_list } from "src/api/index.js";
import courseData from "src/core/match-detail/match-detail-h5/config/course.js";
// import EMITTER from  "src/global/mitt.js" //todo
// import { Loading } from 'quasar'
// 传入模拟数据
// import {
//   get_match_odds_info_mock,
//   get_match_detail_mock,
//   get_category_list_mock,
// } from "./mock";
const router = useRouter();
const route = useRoute();
// const detail_store = detail_module();
const detail_store = ref(MatchDetailCalss); //todo
const match_odds_info = ref([]);
const match_detail = ref({});
const category_list = ref([]);
const tab = ref("betting");
const cuid = ref("");
const scroller_height = ref(0);
const loading = ref(false);
const detail_event_tabs_value = ref({ label: 'Match', id: 1 });
const timer = ref(null);
const mst_timer = ref(null);
const tab_selected_obj = ref({});
const change_header_fix = ref(null);
const header_fix = ref(null);
const fixedHeight = ref(null);
// 切换tab
const tabChange = (item) => {
  tab.value = item;
  detail_event_tabs_value.value = { label: 'Match', id: 1 };
};
const detail_event_tabs_change = (item) => {
  detail_event_tabs_value.value = item;
}
/**
 * @name 开赛时间自动加1
 * @param {*} t 
 */
const use_polling_mst = (t) => {
  // console.log("detail", t)
  if (Number(t.mst) <= 0 || t.ms !== 1) {
    if (mst_timer.value) {
      clearInterval(mst_timer.value);
    }
    return
  }
  mst_timer.value = setInterval(() => {
    if (t.csid == 2) {
      t.mst--
    } else {
      t.mst++
    }
    
    t.mstValueTime = format_mst_data(t)
    t.mstValue
  }, 1000)
}
// 获取格式化时间对象
const format_date_time = (value) => {
  
  const time = new Date(parseInt(value))
  const y = time.getFullYear()
  const m = (time.getMonth() + 1 + "").padStart(2, 0)
  const d = (time.getDate() + "").padStart(2, 0)
  const h = (time.getHours() + "").padStart(2, 0)
  const mm = (time.getMinutes() + "").padStart(2, 0)
  const s = (time.getSeconds() + "").padStart(2, 0)
  const w = time.getDay();
  return { y, m, d, h, mm, s, w };
}
/**
 *@description 开赛时间转换 分：秒
 *@param {mst} 时间
 *@return {*}
 */
const format_mst_data = (t) => {
  const { ms, mst, mgt } = t
  if (ms === 1) {
    const m = String(Math.floor((mst / 60))).padStart(2, '0')
    const s = String(Math.floor((mst % 60))).padStart(2, '0')
    return `${m}:${s}`
  } else {
    const { m, d, h, mm, s } = format_date_time(mgt)
    return `${d}/${m} ${h}:${mm}`
  }
}
const get_match_odds_info = ref([]);
/**
 *@description // 触发切换玩法tab
 *@param {obj} tab_item 请求参数
 *@return {obj}
 */
const detail_tabs_change = (tab_item) => {
  tab_selected_obj.value = tab_item;
  const { plays } = tab_item;
  const m_plays = [];
  const list = get_match_odds_info.value.filter(item => {
    let play = item.topKey;
    let topKeyArr = item.topKey.split("-");
    if (topKeyArr.length > 0) {
      play = topKeyArr[0];
    }
    m_plays.push(Number(play));
    return plays.includes(Number(play));
  });
  match_odds_info.value = [...list];
}
const startY = ref(0);
const scroller_scroll_top = ref(0);
const changeHeader = ref(false);
/**
 *@description 监听页面触摸
 *@param {e} e 请求参数
 *@return {*}
 */
const touchstart = (e) => {
  startY.value = e.targetTouches[0].pageY;
};
const touchend = (e) => {
  if (match_detail.value.mvs <= -1) {
    if (header_fix.value && change_header_fix.value) {
      let px160 = header_fix.value.clientHeight - change_header_fix.value.clientHeight;
      // console.log("touchend", px160, scroller_scroll_top.value);
      if(scroller_scroll_top.value >= px160){
        changeHeader.value = true;
      }else {
        changeHeader.value = false;
      }
    }
  }
}
/**
 *@description 监听页面触摸移动
 *@param {e} e 请求参数
 *@return {*}
 */
const touchmove = (e) => {
  if (match_detail.value.mvs <= -1) {
    if (header_fix.value && change_header_fix.value) {
      let px160 = header_fix.value.clientHeight - change_header_fix.value.clientHeight;
      // console.log("touchmove", px160, scroller_scroll_top.value);
      let dom_ = document, dom_ele = dom_.documentElement;
      let osTop = dom_ele.scrollTop || dom_.body.scrollTop;
      if(scroller_scroll_top.value >= px160 && ( (!!osTop && osTop > px160) || (startY.value - e.targetTouches[0].pageY) > px160 )){
        changeHeader.value = true;
        startY.value = e.targetTouches[0].pageY
      }else if(scroller_scroll_top.value <= px160 && (e.targetTouches[0].pageY - startY.value) >= 0){
        changeHeader.value = false;
        startY.value = e.targetTouches[0].pageY
      }
    }
  }
};
const detail_scrolling = (event) => {
  scroller_scroll_top.value = event.target.scrollTop;
  if (header_fix.value && change_header_fix.value) {
    let px160 = header_fix.value.clientHeight - change_header_fix.value.clientHeight;
    if(scroller_scroll_top.value >= px160){
      changeHeader.value = true;
    }else if(scroller_scroll_top.value <= px160){
      changeHeader.value = false;
    }
  }
};
/**
 *@description // 调用: /v1/m/matchDetail/getMatchOddsInfoPB接口 //赛果页面调用赛果玩法详情接口
 *@param {obj} params 请求参数
 *@return {obj}
 */
const get_matchDetail_getMatchOddsInfo = (params) => {
  //赛果页面调用赛果玩法详情接口
  // match_odds_info.value = get_match_odds_info.value;
  api_match_list
    .get_detail_list(params)
    .then((res) => {
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      // console.log("get_matchDetail_getMatchOddsInfo", res);
      get_match_odds_info.value = res.data;
      if (tab_selected_obj.value.marketName) {
        detail_tabs_change(tab_selected_obj.value);
      } else {
        match_odds_info.value = res.data;
      }
    });

  // get_match_odds_info.value = get_match_odds_info_mock.data;
  // match_odds_info.value = get_match_odds_info_mock.data
};
/**
 *@description 获取详情页面玩法集接口(/v1/m/category/getCategoryList)
 *@param {obj} params 请求参数
 *@return {obj}
 */
const get_category_list_info = (params) => {
  // category_list.value = get_category_list.value;
  api_match_list
    .get_detail_category(params)
    .then((res) => {
      // console.log("get_category_list", res);
      category_list.value = res.data;
      if (!tab_selected_obj.value.id) {
        tab_selected_obj.value = res.data[0] || {};
      }
    });
};
/**
 *@description 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
 *@param {obj} params 请求参数
 *@return {obj}
 */
const get_matchDetail_MatchInfo = (params) => {
  api_match_list
    .get_detail_data(params)
    .then((res) => {
      const res_data = lodash.get(res, 'data')
      if (res_data && res_data.mhid) {
        match_detail.value = res_data;
        match_detail.value.course =  lodash.get(res_data, 'ms') == 110 ?
          'Soon' : (courseData[lodash.get(res_data, 'csid')][lodash.get(res_data, 'mmp')] || "");
        match_detail.value.mstValueTime = format_mst_data(match_detail.value);
        use_polling_mst(match_detail.value)
      } else {
        clear_all_timer();
        router.replace("/");
      }
      // detail_store.get_detail_params
      MatchDataWarehouseInstance.set_match_details(match_detail.value);
      // console.log("get_matchDetail_MatchInfo", res);
    });

  // mock Start
  // match_detail.value = get_match_detail_mock.data;
  // match_detail.value.course = (get_match_detail_mock.data.ms === 110) ? 'Soon' : courseData[match_detail.value.csid][match_detail.value.mmp];
  // match_detail.value.mstValue = format_mst_data(match_detail.value.mst);
  // use_polling_mst(match_detail.value)
  // mock end 
};
/**
 *@description 初始化
 *@param {*} 
 *@return {*}
*/
const detail_init = () => {
  const { mid, csid  } = route.params;
  get_matchDetail_getMatchOddsInfo({
      mcid: 0,
      cuid: cuid.value,
      mid,
      newUser: 0,
    });
  get_category_list_info({
    sportId: csid,
    mid,
  });
  get_matchDetail_MatchInfo({
    mid,
    cuid: cuid.value,
  });
}
const timer_s_interval = (time = 4000) => {
  clear_all_timer();
  timer.value = setTimeout(() => {
    detail_init();
    timer_s_interval();
  }, time);
}
const clear_all_timer = () => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  if (mst_timer.value) {
    clearInterval(mst_timer.value);
    mst_timer.value = null;
  }
}
onMounted(() => {
  loading.value = true;
  setTimeout(() => {
    detail_init();
    timer_s_interval(4000);
  }, 10);
  // 监听顶部刷新功能
  // EMITTER.on("detail_refresh", () => {
  //   // detail_init();
  // });
});
onUnmounted(() => {
  clear_all_timer();
})
</script>

<style lang="scss" scoped>
.match-detail-container {
  background: #F1F1F1;
  height: calc(100vh - 50px);
  width: 100%;
  // height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overflow-x: hidden;
  .mini-header-container {
    position: sticky;
    top: 0;
    z-index: 80;
    width: 100%;
  }
  .header-fix {
    
  }
  .change-header-fix {
    width: 100vw;
    position: fixed;
    top: 50px;
    z-index: 91;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
  .detail-container-position {
    position: relative;
    z-index: 90;
    width: 100%;
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
    color: #1a1a1a;
    background: #fff;
    .tab-active {
      color: #ff7000;
      .tab-text {
        display: inline-block;
        font-weight: 500;
        border-bottom: 3px solid #ff7000;
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
    background: #ffffff;
  }
  .match-detail-odds-scroll {
    overflow-x: hidden;
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
    overflow-y: scroll;
    height: calc(100vh - 325px);
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
  background: #fff;
}
.overflow_hidden {
  // overflow: hidden;
  // height: 100vh;
}
</style>
