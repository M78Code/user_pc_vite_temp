<template>
  <div class="comopnent details_container">
    <!-- 骨架屏  -->
    <div
      class="details-fat scroll relative-position"
      :class="{
      'show-video':get_show_video||viewTab === 'chatroom',
      'show-replay-video': get_is_dp_video_full_screen && !get_is_hengping,
      'video-full-screen': get_is_hengping,
      'details-bet': viewTab === 'bet' &&is_esports}"
      :style="page_style"
      v-cloak ref="details_box"
      @touchstart.passive="start"
      @scroll="detail_scrolling"
      @touchmove.passive="moved"
      @click="details_click"
      v-if="!lodash.isEmpty(detail_data)">
      <div >
        <div  class="header-fix">
          <div ref="scroll_video_height" class="relative-position scroll_video_h">
            <videos
              ref="videosRef"
              :fix_status="true" 
              v-if="get_show_video" 
              @change_fullscreen="change_fullscreen" 
              :detail_data="detail_data" 
              :tips.sync="tips" 
              :is_show_text="is_show_text"  
              :show_go_back="show_go_back" 
              @change_go_back="change_go_back"
            ></videos>
            <details-header  @click.stop :detail_data="detail_data" :view_tab="viewTab" :style="{display:get_show_video?'none':'block'}"></details-header>
          </div>
        </div>
        <!-- 滚动时置顶的悬浮条 -->
        <!-- <div style="position: fixed;z-index: 1000; top: 100px;background:#000;color: #fff;">{{ scroll_visible_1 }}{{ get_show_video }}</div> -->
        <div class="mini-header-container" :class="{'no-z-index': get_is_dp_video_full_screen}" :style="{ visibility: scroll_visible && viewTab != 'chatroom'? 'visible' : 'hidden' }">
          <change-header :detail_data="detail_data"></change-header>
        </div>

        <!-- @click.stop -->
        <div class="play-wrapper" v-show="!get_is_dp_video_full_screen" ref="play_wrapper" :class="(get_bet_show) ? 'bet-wrapper-show' : 'bet-wrapper-hide'" >
          <!-- 玩法集 start -->
          <div class="details-tab-wrap" :class="{ 'z-index0': get_is_full_screen, 'z-index81': get_bet_show }">
            <!-- 足蓝赛种 才展示 投注/赛事分析 切换tab -->
            <q-tabs
                v-if="(!get_is_hengping || get_is_dp_video_full_screen) &&
                !['BE', 'C01', 'OD'].includes(detail_data.cds)"
                v-model="viewTab"
                shrink
                stretch
                inline-label
                narrow-indicator
                class="bg-tabs"
                active-color="active-tab"
                :content-class="curr_active_tab">
              <q-tab v-if="show_match_analysis_tab || show_chatroom_tab" name="bet" :content-class="viewTab === 'match_analysis' ? 'tab-bet' : ''" :ripple="false" :label="i18n_t('bet.betting')" />
              <q-tab
                v-if="show_match_analysis_tab"
                name="match_analysis"
                :ripple="false"
                label="赛事分析"
               />

              <!-- 根据中文，繁体、聊天室ID不为空以及 chatRoomSwitch 打开 才显示聊天室Tab -->
              <!-- <q-tab
                v-if="get_event_list.length>0"
                name="playback"
                :ripple="false"
                label="精彩回放"
               /> -->
            </q-tabs>
            <!-- 玩法集展示内容 -->
            <details-tab
            v-show="viewTab === 'bet' || get_is_hengping"
            v-if="category?.is_no_data === false"
            :data_list="data_list"
            :fixd_left="true"
            :scroller_scroll_top="scroller_scroll_top"
            :get_details_item="get_details_item"
            :new_match_detail_ctr="new_match_detail_ctr"
            @change-item="change_item"
            ></details-tab>
          </div>
          <!-- tab 激活投注展示内容 -->
          <!-- 投注展示内容 -->
          <div
              v-show="viewTab === 'bet' || get_is_hengping"
              class="content-box play-items"
              :class="[{baseball: detail_data.csid == '3'},  'details-f']"
              ref="content_box">
            <div
                ref="fixedHeight"
                class="details-tab-list"
                :class="{'details-tab-list-scroll': fixed_status, 'details-tab-list-scroll-zhiding': get_zhiding_info}"
                @scroll="full_screen_detail_scrolling">
              <div style="height:inherit" ref="scroll_box">
                <div v-show="viewTab === 'bet'">
                  <!-- ms 为0 或者 1时，表示未开赛或进行中 -->
                  <category v-if="[0,1,110].includes(+detail_data.ms)" :active="round"
                  :category_arr="matchDetailCtr.category_arr" ref="category"></category>
                  <no-data v-else-if="detail_data?.ms!=undefined" which='noMatch' height='500'></no-data>
                  <!-- detail_data.ms!=undefined 不然会闪现no-data哦 -->
                </div>
              </div>
            </div>
          </div>

          <!-- 赛事首发展示内容 -->
          <template v-if="viewTab == 'match_analysis' && (!get_is_hengping || get_is_dp_video_full_screen)">
            <div>
                <!-- 足球赛事分析 页面-->
                <analysis-football-matches :detail_data="detail_data" v-if="detail_data.csid == '1'"></analysis-football-matches>
                <!-- 篮球赛事分析 页面-->
                <basketball-match-analysis  :detail_data="detail_data" v-if="detail_data.csid == '2'"></basketball-match-analysis>
            </div>
          </template>
        </div>

        <!--  详情赛事下拉三角形,赛事列表组件 -->
        <div>
          <q-dialog v-model="is_dialog_details" position="top" content-class="detail-top-pop" v-cloak>
            <details-dialog
              :detail_data="detail_data"
              :math_list_data="math_list_data"
            ></details-dialog>
          </q-dialog>
        </div>
      </div>
      <!-- 视频info说明弹窗,和切换高清和标清的 弹框 -->
      <info-rules v-if="get_info_show"></info-rules>
      <div v-show="scroll_visible && !get_bet_show && !get_is_full_screen && !get_is_hengping && !is_highlights" class="details-ref" @click="details_refresh">
        <div :class="{'refreshing':refreshing}"></div>
      </div>
    </div>
    <template v-if="!is_show_detail_header_data">
      <!-- 活动返回按钮 及 标题 -->
        <img :src="compute_img_url('go-back-icon')"  >
      <!-- <div class="head yb_px14 yb_fontsize14"> -->
        <!-- <img
            :src="('day') ? `/image/wwwassets/bw3/svg/go-back-icon-theme02.svg` : `/image/wwwassets/bw3/svg/go-back-icon.svg`"
            @click="$common.go_where({back_to: 'go_to_back'})"
        /> -->
      <!-- </div> -->
      <!-- <no-data which='noMatch' height='500'></no-data> -->
    </template>
  </div>
</template>
<script>
// #TODO mixins
// import websocket_data from "src/base-h5/mixins/websocket/data/skt_data_info_header.js";  // websocket数据页面数据接入----赛事详情头详细推送处理
// import common from 'src/project/mixins/constant/module/common.js';    // 公共的常用工具方法
// 引入国际化
import lodash from "lodash";
import detailsHeader from "src/base-h5/components/details/components/details-header.vue";   // 整个详情页的上部视频区域
import detailsDialog from "src/base-h5/components/details/details-dialog.vue";   // 详情赛事下拉,赛事列表组件
// // import no_data from "src/project/components/common/no-data.vue";   // 无网络展示组件
import videos from "src/base-h5/components/details/components/videos2.vue";   // 详情页视频+动画直播区域
import changeHeader from "src/base-h5/components/details/components/header/change-header.vue";  // 详情页下拉置顶title
import info_rules from "src/base-h5/components/details/components/info-rules.vue"  // 视频info说明弹框
// import SDetails from "src/base-h5/components/skeleton/skeleton-details.vue"  // 详情骨架屏
import category from "./children/category.vue";
// import chatroom from "src/base-h5/components/details/components/chatroom/chatroom.vue"
import analysisFootballMatches from "src/base-h5/components/details/analysis-ky-matches/football-match-analysis/analysis-football-matches.vue"
import basketballMatchAnalysis from "src/base-h5/components/details/analysis-ky-matches/basketball-match-analysis/basketball-match-analysis.vue"
import { useRouter, useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt/index.js"
import { details_main } from "./details.js";
import { ref, defineComponent, reactive, computed, onMounted, onUnmounted, toRefs, watch, provide,nextTick } from "vue";
import {compute_css_obj,compute_img_url,MatchDetailCalss,MenuData, SessionStorage} from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { compute_css_variables } from "src/core/css-var/index.js"
import {is_esports } from "src/base-h5/mixin/menu";
// 详情页中部玩法集tab
import detailsTab from "src/base-h5/components/details/components/details-tab-2.vue";
import  no_data  from "src/base-h5/components/common/no-data.vue";
export default defineComponent({
  name: "match-details",
  // mixins: [websocket_data,common],
  components: {
    analysisFootballMatches,
    basketballMatchAnalysis,
    "details-header": detailsHeader,
    "details-dialog": detailsDialog,
    changeHeader,
    detailsTab,
    "no-data": no_data,
    "info-rules": info_rules,
    videos: videos,
    //  SDetails,
    category,
  },
  // 从首页轮播区域跳转到详情页 增加判断
//   beforeRouteEnter(to, from, next) {
//     next(vm => {
//       // if(from.name == 'home' && !vm.get_golistpage){
//       if(from.name == 'home' && !to.params.flag){
//         vm._data.is_banner_jump = true;
//       }
//     });
//   },
  setup(props, evnet) {
    const router = useRouter();
    const route = useRoute();
    const scroll_box = ref(null)
    const content_box = ref(null)
    const fixedHeight = ref(null)
    const scroll_visible_1 = ref(true)
    const page_style = ref('')
    const videosRef = ref(null)
    const round = ref(SessionStorage.get('ACTIVE_TAB') || -1);
    const {
      scroller_scroll_top,
      state_data,
      is_highlights,
      show_match_analysis_tab,
      show_chatroom_tab,
      scroll_visible,
      skeleton_finish,
      matchid,
      curr_active_tab,
      icon_replay,
      matchDetailCtr,
      is_show_detail_header_data,
      get_show_video,
      get_info_show,
      get_bet_show,
      details_click,
      change_go_back,
      details_refresh,
      cancel_ref,
      api_interface,
      set_details_scroll,
      loading_list,
      ana_show,
      tab_changed_handle,
      detail_scrolling,
      full_screen_detail_scrolling,
      start,
      moved,
      rem,
      scrollMethod,
      changge_bool,
      initEvent,
      get_chatroom_info,
      get_football_replay,
      get_match_details,
      match_detail_data_handle,
      get_match_list,
      get_odds_list,
      updata_detail_data,
      set_native_detail_data,
      change_data_list,
      event_switch,
      detail_scroller_height,
      on_listeners,
      off_listeners,
      clear_timer,
      new_match_detail_ctr,
      change_fullscreen,
      MatchDataWarehouseInstance
    } = details_main();
    watch(
      () => state_data.data_list,
      (data) => {
        if (!data) {
          return
        }
        // 只有一个玩法集时，及时更新当前玩法集id
        if (lodash.get(data,'length') == 1) {
          MatchDetailCalss.set_details_item(data[0].id)
          matchDetailCtr.current_category_id = data[0].id
        }
        // 玩法个数不及3个时，提前退出
        if (lodash.get(state_data.data_list, 'length', 0) < 3) {
          return
        }

        // "所有投注"下标值
        const all_bet_index = state_data.data_list.findIndex(item => item.id == '0')
        if (all_bet_index < 0) {
          return
        }
        // 深拷贝后操作，否则会报store错误
        const deep_data_list = lodash.cloneDeep(state_data.data_list)

        // 非横屏并且"所有投注"不在最后
        if (!state_data.get_is_hengping && all_bet_index !== data.length - 1) {
          // state_data.data_list = swapArray(deep_data_list, all_bet_index, deep_data_list.length - 1)
        } else if (state_data.get_is_hengping && all_bet_index !== 1) {
          // 横屏并且"所有投注"不在热门后面
          // state_data.data_list = swapArray(deep_data_list, 1, all_bet_index)
        }
      },
      { deep: true }
    );
    
    // 切换横屏状态时，调整相应玩法集顺序
    watch(
      () => state_data.get_is_hengping,
      () => {
      if (lodash.get(state_data.data_list, 'length', 0) < 3) {
        return
      }

      const deep_data_list = lodash.cloneDeep(state_data.data_list)
        // 横屏时接口返回数据时“所有投注”已排在最后(接口依据orderNo这个字段来排序返回)，解决42812BUG
        // data_list = swapArray(deep_data_list, 1, deep_data_list.length - 1)
      }
    );
    // 顶部切换赛事后，默认展示投注视图
    // watch(
    //   () => state_data.detail_data.mid,
    //   () => {
    //     state_data.viewTab = 'bet';
    //     get_chatroom_info();

    //     // 切换赛事时，重置玩法集请求次数计数
    //     get_category_list_req_count = 0
    //   }
    // );
    // 从轮播区域跳转到详情,设置Vuex的值
    watch(
      () => state_data.is_banner_jump,
      (_new) => {
        if(_new == true){
          // set_is_banner_jump(true)
        }
      }
    );
    // 监听is_dialog_details(控制是否显示联赛列表)
    watch(
      () => state_data.is_dialog_details,
      (new_value, old_value) => {
        // 新的值等于true的时候也就是点击下三角准备查看联赛列表 此时调用接口:详情页下拉列表接口(/v1/m/matchDetail/getMatchDetailByTournamentIdPB)
        if (new_value) {
          // tid: 联赛id
          let tId = state_data.detail_data.tid;
          let params0 = {tId  };
          get_match_list(params0);
        }
      }
    );
    // 监听赛事状态mmp的值
    watch(
      () => state_data.detail_data?.mmp,
      (_new) => {
        // 如果是999赛事结束即调接口切换赛事
        if(_new == '999'){
          event_switch();
        }
        // 否则更新玩法集
        else {
          get_odds_list()
        }
      }
    );
    // 监听赛事状态ms的值，0:未开赛 1:滚球阶段 2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
    watch(
      () => state_data.detail_data?.ms,
      (_new, _old) => {
        let arr_ms = [0, 1, 2, 7, 10, 110];
        if(!arr_ms.includes(Number(_new))){
          event_switch();
        }
        // 赛事状态为 0:未开赛 1:滚球阶段 2:暂停 7:延迟 10:比赛中断 110:即将开赛 时更新玩法集
        else {
          // ms变更时才调用
          if (_old) {
            // 重新调用 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
            get_match_details({ mid: matchid.value, cuid: UserCtr.uid });
            get_odds_list()
          }
        }
      }
    );
    // 解决点击收藏状态闪动:vuex的值被初始化接口里面的值覆盖的问题 当修改了vuex里面get_detail_data.mf值同步修改data变量里面detail_data.mf的值才可以解决此问题
    // watch(
    //   () => state_data.detail_data.mf,
    //   (_new) => {
    //     data.detail_data.mf = new_
    //   }
    // );
    watch(
      () => state_data.get_betbar_show,
      () => {
        detail_scroller_height()
      }
    );
    // 监听tab状态
    watch(
      () => state_data.viewTab,
      (val) => {
        // #TODO $utils
        // $send_zhuge_event('H5_情报分析', data.UserCtr);
        if(val == 'bet'){
          // initEvent({refresh:true})
        }
      }
    );
    // 赛事分析三级服务开关开启后，视图切换到投注tab
    // watch(
    //   () => show_match_analysis_tab,
    //   (curr, prev) => {
    //     if (!curr && data.viewTab === 'match_analysis') {
    //       data.viewTab = 'bet'
    //     }
    //   }
    // );

    
    onMounted(() => {
      // 原created
      state_data.init_event_timer_count = 0;
    //   cancel_ref = debounce(cancel_ref,200)
    //   set_is_full_screen(false)
      // 设置info说明弹窗不显示
    //   set_info_show(false)
    //   set_tab_fix(false);
    //   set_is_hengping(false)
    //   detailsTableHeight = innerHeight - rem(2.4);
    page_style.value = compute_css_variables({ category: 'component', module: 'analysis' })
      // 记录路由信息
      const {fullPath, hash, name, params, path, query} = route
    //   set_last_route_info({fullPath, hash, name, params, path, query})
      let video_details = sessionStorage.getItem('video_details')
      if(video_details){
        if (params?.csid && [100,101,102,103].includes(+params.csid)) {  // 如果是电竞赛事，需要设置菜单类型
          MenuData.set_menu_type(7)
        }else{
          MenuData.set_menu_type('')
        }
      }

      on_listeners()
      initEvent()
    //   if(!get_play_video){
    //     set_show_video(false);
    //   }
    //   set_video_zhiding(true);
    //   set_change_count(0);
      detail_scroller_height()
      state_data.is_creating = true;
      if(state_data.timer1_) { clearTimeout(state_data.timer1_) }
      state_data.timer1_ = setTimeout(() => {
        state_data.is_creating = false;
      },500);
      // 原mounted
      get_chatroom_info()
    //   load_video_resources(data.get_uid, 'is_details_page')
    //   set_zhiding_info( false );
    //   set_video_zhiding( false );
      if (!location.search.includes('keep_url')) {
        history.replaceState(window.history.state,'',`${location.pathname}${location.hash}`)     //地址栏优化
      }

      // 进入详情页直接展示赛事分析
      if (route.params.analysis) {
        state_data.viewTab = 'match_analysis'
      }
    });
    onUnmounted(() => {
      // debounce_throttle_cancel(cancel_ref);
      // 组件销毁时,不显示视频
      // set_play_video(false)
      // 组件销毁时设置轮播区域跳转到详情的值为false
      // set_is_banner_jump(false)

      // set_tab_fix(false);
      // set_event_list([])

      // vuex--清空详情页的数据
      // set_detail_data('');
      // vuex--清空玩法集的title列表数据
      // set_details_tabs_list('');
      // vuex--清空详情页的选中玩法id
      // set_details_item('')
      // store.dispatch({
      //   type: 'SET_DETAIL_DATA',
      //   data: ''
      // })
      // store.dispatch({
      //   type: 'SET_DETAILS_TABS_LIST',
      //   data: ''
      // })
      // store.dispatch({
      //   type: 'SET_DETAILS_ITEM',
      //   data: ''
      // })

      off_listeners()
      clear_timer()
      clear_timer()
      sessionStorage.removeItem('video_details');

      //删除详情页玩法缓存
      for (const key in sessionStorage) {
        if (key.match(/^\d.+-cache$/)) {
          sessionStorage.removeItem(key);
        }
      }

      useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, false)
      useMittEmit(MITT_TYPES.EMIT_SET_PLAY_VIDEO, false)
      // for (const key in $data) {
      //   $data[key] = null
      // }
    })

    const change_item = (value) => {
      round.value = value;
    }
    const ChangeVideoKind = (replay)=>{
      useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true)
      useMittEmit(MITT_TYPES.EMIT_SET_PLAY_VIDEO, true)
      nextTick(()=>{
        try{
          videosRef.value.is_playing_replay = true
          videosRef.value.change_event_video(replay)
        }catch(e){}
      })
      
    }
    provide('ChangeVideoKind',ChangeVideoKind)
    // #TODO VUEX
    //   ...mapActions([
    //   // 设置玩法tab列表 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
    //   "set_details_item",
    // ]),
    // ...mapMutations([
    //   //聊天室对应开关地址集合
    //   "set_details_chatroom_data",
    //   // 设置详情页的数据
    //   "set_detail_data",
    //   // 设置是否显示视频
    //   "set_show_video",
    //   // 设置详情下拉三角是否显示
    //   "set_sanjiao_is_bool",
    //   // 设置视频是否置顶
    //   "set_video_zhiding",
    //   // 设置toast内容及持续时间
    //   "set_toast",
    //   "set_change_count",
    //   // 设置玩法集置顶效果
    //   "set_zhiding_info",
    //   // 设置玩法集的title栏
    //   "set_details_tabs_list",
    //   // 设置赛事比分变化
    //   "set_detail_msc_changed",
    //   // 赛事id
    //   "set_goto_detail_matchid",
    //   // 设置玩法集tab是否固定
    //   "set_tab_fix",
    //   // 设置info说明弹窗
    //   "set_info_show",
    //   // 设置是否从首页轮播区域跳转到详情默认值
    //   "set_is_banner_jump",
    //   // 是否从直播进入详情
    //   "set_play_video",
    //   // 设置视频全屏
    //   "set_is_full_screen",
    //   // 轮播请求的更新时间
    //   'updateHotReqTime',
    //   'set_menu_type',
    //   'set_is_hengping',
    //   'set_last_route_info',
    //   'set_event_list',
    // ]),
    return {
      ...toRefs(state_data),
      change_fullscreen,
      round,
      change_item,
      i18n_t,compute_css_obj,compute_img_url,
      is_highlights,
      show_match_analysis_tab,
      show_chatroom_tab,
      scroll_visible,
      skeleton_finish,
      matchid,
      curr_active_tab,
      icon_replay,
      scroll_box,
      content_box,
      fixedHeight,
      scroll_visible_1,
      get_bet_show,
      get_info_show,
      details_click,
      change_go_back,
      details_refresh,
      cancel_ref,
      api_interface,
      set_details_scroll,
      loading_list,
      ana_show,
      tab_changed_handle,
      detail_scrolling,
      full_screen_detail_scrolling,
      start,
      moved,
      rem,
      scrollMethod,
      changge_bool,
      initEvent,
      get_chatroom_info,
      get_football_replay,
      get_match_details,
      match_detail_data_handle,
      get_match_list,
      get_odds_list,
      updata_detail_data,
      set_native_detail_data,
      change_data_list,
      event_switch,
      detail_scroller_height,
      on_listeners,
      off_listeners,
      clear_timer,
      matchDetailCtr,
      new_match_detail_ctr,
      page_style,
      is_esports,
      videosRef,
      MatchDataWarehouseInstance
    }
  }
})
</script>
<style scoped lang="scss">
@import "./styles/details.scss";
.details_container {
  flex:10;
  height:0;
}
.details-fat {
  // background-color: var(--q-gb-bg-c-20);
.details-f9 {
  // background: var(--q-color-page-bg-color-9);
}
.details-f {
  // background-color: var(--q-gb-bg-c-20);
  // background: $details-odds-bg-color;
}
}
.bg-tabs {
    background: var(--q-gb-bg-c-23);
    box-shadow: 0px 2px 8px 0px var(--q-gb-bd-c-14);
  .bg-active-tab {
    background: var(--q-gb-bg-c-15);
  
  }
  }
 .details-tab{
  // border-top:0.5px solid #F2F2F6;
  background: var(--q-gb-bg-c-23);
 } 
 .q-focus-helper {
  opacity: 0 !important;
} 
</style>
<style lang="scss">
.detail-top-pop .q-dialog__inner--minimized {
  padding: 0;
}
:deep(.counting-down-wrap) {
  
}
</style>