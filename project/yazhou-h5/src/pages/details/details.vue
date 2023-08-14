<template>
  <div>
    <!-- 骨架屏  -->
    <!-- <SDetails v-if="skeleton_finish"/> -->
    <div>details</div>
    <div
      class="details-fat scroll relative-position"
      :class="{
      'show-video':get_show_video||viewTab === 'chatroom',
      'show-replay-video': get_is_dp_video_full_screen && !get_is_hengping,
      'video-full-screen': get_is_hengping,
      'details-bet': viewTab === 'bet' && get_menu_type !== 3000,}"
      :style="{height:`${scroller_height}px`}"
      v-cloak ref="details_box"
      @touchstart.passive="start"
      @scroll="detail_scrolling"
      @touchmove.passive="moved"
      @click="details_click"
      v-if="is_show_detail_header_data">
      <div>
        <div  class="header-fix">
          <div ref="scroll_video_height" class="relative-position scroll_video_h">
            <!-- <videos v-if="get_show_video" :detail_data="detail_data" :tips.sync="tips" :is_show_text="is_show_text"  :show_go_back="show_go_back" @change_go_back="change_go_back"></videos> -->
            <details-header  @click.stop :detail_data="detail_data" :view_tab="viewTab" :style="{display:get_show_video?'none':'block'}"></details-header>
          </div>
        </div>
        <!-- 滚动时置顶的悬浮条 -->
        <div class="mini-header-container" :class="{'no-z-index': get_is_dp_video_full_screen}" :style="{ visibility: scroll_visible && !get_show_video&& viewTab != 'chatroom'? 'visible' : 'hidden' }">
          <!-- <change-header :detail_data="detail_data"></change-header> -->
        </div>

        <!-- @click.stop -->
        <div class="play-wrapper"  ref="play_wrapper" :class="(get_bet_show) ? 'bet-wrapper-show' : 'bet-wrapper-hide'" >
          <!-- 玩法集 start -->
          <div class="details-tab-wrap" :class="{ 'z-index0': get_is_full_screen, 'z-index81': get_bet_show }">
            <!-- 足蓝赛种 才展示 投注/赛事分析 切换tab -->
            <q-tabs
                v-if="!get_is_hengping || get_is_dp_video_full_screen"
                v-model="viewTab"
                shrink
                stretch
                inline-label
                switch-indicator
                :indicator-color="scroll_visible && !get_show_video ? 'view-tab-active-top': ''"
                class="bg-tabs"
                active-color="active-tab"
                active-bg-color="active-tab"
                :content-class="curr_active_tab">
              <q-tab v-if="show_match_analysis_tab || show_chatroom_tab" name="bet" :content-class="viewTab === 'match_analysis' ? 'tab-bet' : ''" :ripple="false" :label="$t('bet.betting')" />
              <q-tab
                v-if="show_match_analysis_tab"
                name="match_analysis"
                :content-class="viewTab === 'bet' ? 'tab-match-analysis' : 'tab-match-analysis-active'"
                :ripple="false"
                :label="$t('match_result.match_analysis')"
                alert
                :alert-icon="icon_replay"/>
              <!-- 根据中文，繁体、聊天室ID不为空以及 chatRoomSwitch 打开 才显示聊天室Tab -->
              <q-tab name="chatroom" :content-class="viewTab === 'chatroom' ? 'tab-chatroom' : ''" v-if="show_chatroom_tab" :ripple="false" :label="$t('bet.chatroom')" />
            </q-tabs>
            <!-- 玩法集展示内容 -->
            <details-tab v-show="viewTab === 'bet' || get_is_hengping" :data_list="data_list" :scroller_scroll_top="scroller_scroll_top"></details-tab>
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
                <template >
                  <!-- ms 为0 或者 1时，表示未开赛或进行中 -->
                  <!-- <category v-if="[0,1,110].includes(+detail_data.ms)" ref="category"></category>
                  <no-data v-else which='noMatch' height='500'></no-data> -->
                </template>
              </div>
            </div>
          </div>
          <!-- 赛事分析展示内容 -->
          <template v-if="viewTab === 'match_analysis' && (!get_is_hengping || get_is_dp_video_full_screen)">
            <!-- 足球赛事分析 页面-->
            <!-- <analysis-football-matches v-if="get_detail_data.csid === '1'"></analysis-football-matches> -->
            <!-- 篮球赛事分析 页面-->
            <!-- <basketball-match-analysis v-if="get_detail_data.csid === '2'"></basketball-match-analysis> -->
          </template>
          <!-- 聊天室 -->
          <template v-if="viewTab === 'chatroom'">
            <!-- <chatroom></chatroom> -->
          </template>
        </div>

        <!--  详情赛事下拉三角形,赛事列表组件 -->
        <div>
          <q-dialog v-model="is_dialog_details" position="top" content-class="detail-top-pop" v-cloak>
            <!-- <details-dialog
              :detail_data="detail_data"
              :math_list_data="math_list_data"
            ></details-dialog> -->
          </q-dialog>
        </div>
      </div>
      <!-- 视频info说明弹窗,和切换高清和标清的 弹框 -->
      <!-- <info-rules v-if="get_info_show"></info-rules> -->
      <div v-show="scroll_visible && !get_bet_show && !get_is_full_screen && !get_is_hengping && !is_highlights" class="details-ref" @click="details_refresh">
        <div :class="{'refreshing':refreshing}"></div>
      </div>
    </div>
    <template v-if="!is_show_detail_header_data">
      <!-- 活动返回按钮 及 标题 -->
      <!-- <div class="head yb_px14 yb_fontsize14">
        <img
            :src="get_theme.includes('theme01') ? `${ $g_image_preffix }/image/wwwassets/bw3/svg/go-back-icon-theme02.svg` : `${ $g_image_preffix }/image/wwwassets/bw3/svg/go-back-icon.svg`"
            @click="$common.go_where({back_to: 'go_to_back'})"
        />
      </div> -->
      <!-- <no-data which='noMatch' height='500'></no-data> -->
    </template>
  </div>
</template>
<script>
import utils from 'src/core/utils/utils.js';  // 公共方法

// #TODO vuex 
// import { mapGetters, mapActions, mapMutations } from "vuex";
import {api_common, api_result} from "src/api/index.js";  // API 公共入口

// #TODO mixins 
// import websocket_data from "src/public/mixins/websocket/data/skt_data_info_header.js";  // websocket数据页面数据接入----赛事详情头详细推送处理
// import common from 'src/project/mixins/constant/module/common.js';    // 公共的常用工具方法


import lodash from "lodash";
import details_header from "project_path/src/pages/details/components/details-header.vue";   // 整个详情页的上部视频区域
import details_tab from "project_path/src/pages/details/components/details-tab.vue";         // 详情页中部玩法集tab
// // import details_dialog from "src/components/details/details-dialog/details-dialog-template-1/details-dialog.vue";   // 详情赛事下拉,赛事列表组件
// // import no_data from "src/project/components/common/no-data.vue";   // 无网络展示组件
// // import videos from "project_path/src/pages/details/components/videos.vue";   // 详情页视频+动画直播区域
// import change_header from "project_path/src/pages/details/components/header/change-header.vue";  // 详情页下拉置顶title
// // import analysis_football_matches from "project_path/src/pages/details/analysis-matches/football-match-analysis/analysis-football-matches.vue"; // 详情页  足球赛事分析
// // import basketball_match_analysis from "project_path/src/pages/details/analysis-matches/basketball-match-analysis/basketball-match-analysis";  // 详情页 或者 赛果  篮球赛事分析
// import info_rules from "project_path/src/pages/details/components/info-rules.vue"  // 视频info说明弹框
// // import SDetails from "src/project/components/skeleton/skeleton-details.vue"  // 详情骨架屏
// import category from "project_path/src/pages/details/children/category.vue";
// import chatroom from "project_path/src/pages/details/components/chatroom/chatroom.vue"
import { useRouter, useRoute } from "vue-router";
import store from "../../store/index.js";
import { Level_one_category_list, Level_one_detail_data, Level_one_detail_odd_info } from "./category-list.js";
// import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { defineComponent, reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "details",
  // mixins: [websocket_data,common],
  components: {
    "details-header": details_header,
//     // "details-dialog": details_dialog,
//     "change-header": change_header,
    "details-tab": details_tab,
//     // "no-data": no_data,
//     "info-rules": info_rules,
//     // videos: videos,
//     // "analysis-football-matches": analysis_football_matches,
//     // "basketball-match-analysis": basketball_match_analysis,
//     // SDetails,
//     category,
//     // chatroom
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
    const router = useRouter()
    const route = useRoute();
    const state = store.getState()
    const data = reactive({
      details_box: null,
      // refs['category']
      category: null,
      // emit 数据集合
      emitters: [],
      // 默认不刷新
      refreshing:false,
      // 固定的状态
      fixed_status: false,
      // 默认接口数据
      detail_data: {},
      // 固定高度
      fixedHeight: "",
      // 赛事列表数据
      math_list_data: [],
      // 数据列表
      data_list: [],
      // 控制详情头部显示
      is_show_detail_header_data: false,
      // 控制下拉列表显示
      is_dialog_details: false,
      // 列表样式
      // a_list_style: false,
      //视频说明是否展示
      tips: false,
      // 默认详情头部高度
      detailsTableHeight:0,
      // 触点坐标选取
      startY: '',
      // 详情头部高
      scroller_height:0,
      // 滚动条的距离
      scroller_scroll_top:0,
      // 玩法集传参赛事id
      params1:null,
      // 是否显示分析页面
      analysis_show: {
        football: false,
        basketball: false,
      },
      // 是否从首页轮播区域跳转到详情
      is_banner_jump: false,
      //加载骨架状态
      skeleton: {
        details: false,
        list: false
      },
      is_creating:false,
      // 随机数props传参是否显示视频对阵信息，还可以控制动画显示返回按钮
      is_show_text:'',
      // 盘口数据请求次数
      requestCount: 0,
      // 当前tab选项卡
      viewTab: 'bet',
      // 控制视频是否展示返回按钮
      show_go_back:false,
      init_event_timer_count: 0,
      timer1_: null,
      get_match_detail_timer: null,
      back_main_list_timer: null,
      axios_debounce_timer: null,
      init_event_timer: null,



      get_details_chatroom_data: "",
      get_theme: "",
      // 视频url信息
      get_video_url: 'get_video_url',
      // "get_bet_list",
      // 当前选中的一级菜单, 二级菜单, 三级菜单对象
      get_current_menu: "get_current_menu",
      // 是否展示视频
      get_show_video: false,

      // 玩法集置顶效果
      get_zhiding_info: "get_zhiding_info",
      // 视频置顶
      // "get_video_zhiding",
      // 玩法tab
      get_details_item: "get_details_item",
      // 登录用户Id
      get_uid: '505915677417900030',
      // 早盘或者串关日期参数
      get_md: "get_md",
      // 菜单
      get_current_sub_menuid: "get_current_sub_menuid",
      // 排序
      get_sort_type: "get_sort_type",
      // 搜素关键字
      get_search_txt: "get_search_txt",
      // 是否显示info说明
      get_info_show: "get_info_show",
      // 设置玩法集固定
      get_tab_fix: "get_tab_fix",
      // 赛果标识
      get_menu_type: "",
      // 获取列表页当前选中时间
      get_current_menu: "get_current_menu",
      // 是否从直播进入详情
      get_play_video: "get_play_video",
      get_detail_data: "get_detail_data",
      // 视频是否全屏
      get_is_full_screen: "get_is_full_screen",
      // 商户是否需要直接跳到列表页（url地址有label参数）
      get_golistpage: "get_golistpage",
      get_godetailpage: "get_godetailpage",
      get_betbar_show: true,
      // 是否显示全屏下投注弹窗
      get_bet_show: "get_bet_show",
      get_is_hengping: false,
      get_is_dp_video_full_screen: "get_is_dp_video_full_screen",
      get_match_base_info_obj: 'get_match_base_info_obj',
      get_user: 'get_user',
      // 'get_analyze_show',
      // 'get_goto_detail_matchid',
      get_access_config: 'get_access_config',
      // 聊天室ID
      // 'get_chatroom_id',
      // 获取语言
      get_lang: 'get_lang',
      get_event_list: 'get_event_list',
      get_curr_tab_info: 'get_curr_tab_info',
    });

    // #TODO VUEX 
    // computed: {
    // ...mapGetters([
    //   'get_details_chatroom_data',
    //   'get_theme',
    //   // 视频url信息
    //   'get_video_url',
    //   // "get_bet_list",
    //   // 当前选中的一级菜单, 二级菜单, 三级菜单对象
    //   "get_current_menu",
    //   // 是否展示视频
    //   "get_show_video",

    //   // 玩法集置顶效果
    //   "get_zhiding_info",
    //   // 视频置顶
    //   // "get_video_zhiding",
    //   // 玩法tab
    //   "get_details_item",
    //   // 登录用户Id
    //   'get_uid',
    //   // 早盘或者串关日期参数
    //   "get_md",
    //   // 菜单
    //   "get_current_sub_menuid",
    //   // 排序
    //   "get_sort_type",
    //   // 搜素关键字
    //   "get_search_txt",
    //   // 是否显示info说明
    //   "get_info_show",
    //   // 设置玩法集固定
    //   "get_tab_fix",
    //   // 赛果标识
    //   "get_menu_type",
    //   // 获取列表页当前选中时间
    //   "get_current_menu",
    //   // 是否从直播进入详情
    //   "get_play_video",
    //   "get_detail_data",
    //   // 视频是否全屏
    //   "get_is_full_screen",
    //   // 商户是否需要直接跳到列表页（url地址有label参数）
    //   "get_golistpage",
    //   "get_godetailpage",
    //   "get_betbar_show",
    //   // 是否显示全屏下投注弹窗
    //   "get_bet_show",
    //   "get_is_hengping",
    //   "get_is_dp_video_full_screen",
    //   'get_match_base_info_obj',
    //   'get_user',
    //   // 'get_analyze_show',
    //   // 'get_goto_detail_matchid',
    //   'get_access_config',
    //   // 聊天室ID
    //   // 'get_chatroom_id',
    //   // 获取语言
    //   'get_lang',
    //   'get_event_list',
    //   'get_curr_tab_info',
    // ]),
    const is_highlights = computed(() => {
      return lodash.get(get_curr_tab_info, 'component') === 'highlights'
    });
    // 足篮赛种和后台开关开了才显示显示赛事分析tab
    const show_match_analysis_tab = computed(() => {
      return [1, 2].includes(+data.get_detail_data.csid) && lodash.get(get_access_config,'statisticsSwitch')
    });
    // 是否显示聊天室tab
    const show_chatroom_tab = computed(() => {
      // 中文，繁体并且聊天室ID不为空才显示聊天室Tab, crs 0关闭1打开
      const { crs }=data.get_details_chatroom_data||{};
      const {chatRoomSwitch} = data.get_user||{}
      return ['zh','tw'].includes(data.get_lang) && crs==1&&chatRoomSwitch==1;
    });
    // 判断页面滑动的高度 是否显示置顶change-header
    const scroll_visible = computed(() => {
      // return data.scroller_scroll_top >= rem(1.65);
      return data.scroller_scroll_top >= 100;
    });
    //接口请求是否全部完成
    const skeleton_finish = computed(() => {
      if(data.skeleton.details && data.skeleton.list){
        return false
      } else {
        return true
      }
    });
    const matchid = computed(() => {
      return route.params.mid || data.get_detail_data.mid
    });
    // 当前tab
    const curr_active_tab = computed(() => {
      const tab_name = data.viewTab.replace('_', '-')
      return `tab-${tab_name}-wrapper`
    });
    // 重播图标
    const icon_replay = computed(() => {
      const { configValue, eventSwitch } = lodash.get(data.get_user, 'merchantEventSwitchVO', {})
      if (configValue != 1 || eventSwitch != 1 || !get_event_list.length) {
        return ''
      }
      // 主题后缀
      const suffix_theme = get_theme.includes('theme02') ? '2' : ''
      // y0后缀
      const suffix_y0  = get_theme.includes('_y0') ? '_y0' : ''

      return `img:${ $g_image_preffix }/image/bw3/svg/details/replay${suffix_theme}${suffix_y0}.svg`
    });
    watch(
      () => data.data_list,
      (data) => {
        if (!data) {
          return
        }

        // 只有一个玩法集时，及时更新当前玩法集id
        if (lodash.get(data,'length') == 1) {
          set_details_item(data[0].id)
        }
        // 玩法个数不及3个时，提前退出
        if (lodash.get(data.data_list, 'length', 0) < 3) {
          return
        }

        // "所有投注"下标值
        const all_bet_index = data_list.findIndex(item => item.id === '0')
        if (all_bet_index < 0) {
          return
        }
        // 深拷贝后操作，否则会报store错误
        const deep_data_list = lodash.cloneDeep(data.data_list)

        // 非横屏并且"所有投注"不在最后
        if (!get_is_hengping && all_bet_index !== data.length - 1) {
          data.data_list = utils.swapArray(deep_data_list, all_bet_index, deep_data_list.length - 1)
        } else if (get_is_hengping && all_bet_index !== 1) {
          // 横屏并且"所有投注"不在热门后面
          data.data_list = utils.swapArray(deep_data_list, 1, all_bet_index)
        }
      },
      { deep: true }
    );
    // 切换横屏状态时，调整相应玩法集顺序
    
    watch(
      () => data.get_is_hengping,
      () => {
      if (lodash.get(data.data_list, 'length', 0) < 3) {
        return
      }

      const deep_data_list = lodash.cloneDeep(data.data_list)
        // 横屏时接口返回数据时“所有投注”已排在最后(接口依据orderNo这个字段来排序返回)，解决42812BUG
        // data_list = utils.swapArray(deep_data_list, 1, deep_data_list.length - 1)
      }
    );
    // 顶部切换赛事后，默认展示投注视图
    // watch(
    //   () => get_detail_data.mid,
    //   () => {
    //     data.viewTab = 'bet';
    //     get_chatroom_info();

    //     // 切换赛事时，重置玩法集请求次数计数
    //     get_category_list_req_count = 0
    //   }
    // );
    // 从轮播区域跳转到详情,设置Vuex的值
    watch(
      () => data.is_banner_jump,
      (_new) => {
        if(_new == true){
          set_is_banner_jump(true)
        }
      }
    );
    // 监听is_dialog_details(控制是否显示联赛列表)
    watch(
      () => data.is_dialog_details,
      (new_value, old_value) => {
        // 新的值等于true的时候也就是点击下三角准备查看联赛列表 此时调用接口:详情页下拉列表接口(/v1/m/matchDetail/getMatchDetailByTournamentIdPB)
        if (new_value) {
          // tid: 联赛id
          let tId = data.detail_data.tid;
          let params0 = {tId  };
          get_match_list(params0);
        }
      }
    );
    // 监听赛事状态mmp的值
    watch(
      () => data.detail_data.mmp,
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
      () => data.detail_data.ms,
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
            get_match_details({ mid: matchid.value, cuid: data.get_uid });
            get_odds_list()
          }
        }
      }
    );
    // 解决点击收藏状态闪动:vuex的值被初始化接口里面的值覆盖的问题 当修改了vuex里面get_detail_data.mf值同步修改data变量里面detail_data.mf的值才可以解决此问题
    // watch(
    //   () => get_detail_data.mf,
    //   (_new) => {
    //     data.detail_data.mf = new_
    //   }
    // );
    watch(
      () => data.get_betbar_show,
      () => {
        detail_scroller_height()
      }
    );
    // 监听tab状态
    watch(
      () => data.viewTab,
      () => {
        // #TODO $utils 
        // $utils.zhuge_event_send('H5_情报分析', data.get_user);
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
      data.init_event_timer_count = 0;
      // 延时器
      data.timer1_ = null;
      data.timer2_ = null;
    //   cancel_ref = debounce(cancel_ref,200)
    //   set_is_full_screen(false)
      // 设置info说明弹窗不显示
    //   set_info_show(false)
    //   set_tab_fix(false);
    //   set_is_hengping(false)
    //   detailsTableHeight = innerHeight - rem(2.4);

      // 记录路由信息
      const {fullPath, hash, name, params, path, query} = route
    //   set_last_route_info({fullPath, hash, name, params, path, query})
      let video_details = sessionStorage.getItem('video_details')
      if(video_details){
        if (params?.csid && [100,101,102,103].includes(+params.csid)) {  // 如果是电竞赛事，需要设置菜单类型
          set_menu_type(3000)
        }else{
          set_menu_type('')
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

      data.is_creating = true;
      if(data.timer1_) { clearTimeout(data.timer1_) }
      data.timer1_ = setTimeout(() => {
        data.is_creating = false;
      },500);

      // 原mounted
      get_chatroom_info()
    //   utils.load_video_resources(data.get_uid, 'is_details_page')
    //   set_zhiding_info( false );
    //   set_video_zhiding( false );
      if (!location.search.includes('keep_url')) {
        history.replaceState(null,'',`${location.pathname}${location.hash}`)     //地址栏优化
      }

      // 进入详情页直接展示赛事分析
      if (route.params.analysis) {
        data.viewTab = 'match_analysis'
      }
    });
    onUnmounted(() => {
      debounce_throttle_cancel(cancel_ref);
      // 组件销毁时,不显示视频
      set_play_video(false)
      // 组件销毁时设置轮播区域跳转到详情的值为false
      set_is_banner_jump(false)

      set_tab_fix(false);
      set_event_list([])

      // vuex--清空详情页的数据
      // set_detail_data('');
      // vuex--清空玩法集的title列表数据
      // set_details_tabs_list('');
      // vuex--清空详情页的选中玩法id
      set_details_item('')

      off_listeners()
      clear_timer()
      utils.clear_timer()
      sessionStorage.removeItem('video_details');

      //删除详情页玩法缓存
      for (const key in sessionStorage) {
        if (key.match(/^\d.+-cache$/)) {
          sessionStorage.removeItem(key);
        }
      }

      for (const key in $data) {
        $data[key] = null
      }
    })
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
    /**
     *@description: 点击详情任意地方显示视频对阵信息
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const details_click = () => {
      // 生成一个随机数
      is_show_text = Math.random();
      show_go_back = true
    };
    /**
     * 子组件触发父组件方法
    */
    const change_go_back = (state) => {
      console.log(state,'子组件触发父组件方法');
      show_go_back = state
    };
    /**
     *@description: 详情页刷新
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const details_refresh = () => {
      if(refreshing) return;

      const curr_tab = data.viewTab
      if (curr_tab === 'bet') {
        // 刷新 盘口赔率信息
        api_interface();
      } else if (curr_tab === 'match_analysis'){
        // 刷新 赛事分析信息
        // #TODO IMIT 
        // useMittEmit(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS);
        // $root.$emit(emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS)
      } else {

      }

      refreshing = true;
      if(timer2_) { clearTimeout(timer2_) }
      timer2_ = setTimeout(() => {
        // 取消刷新 已做节流
        cancel_ref();
      },700);
    };
    /**
     * @description: 取消刷新
     * @param {undefined} undefined
     * @returns {undefined} undefined
    */
    const cancel_ref = () => {
      refreshing = false;
    };
    const api_interface = () => {
      // #TODO IMIT 
    //   useMittEmit(MITT_TYPES.EMIT_REF_API, 'details_refresh');
      // $root.$emit(emit_cmd.EMIT_REF_API, 'details_refresh')
    };
    /**
     *@description 0号模板点击收起的时候，要调整滚动距离
    *@param {Number} val 要调整的距离
    *@return {Undefined} undefined
    */
    const set_details_scroll = (val) => {
      let dom_box = $refs.details_box
      if (!dom_box) return
      dom_box.scrollTop = dom_box.scrollTop - val
    };
    /**
     *@description 骨架屏加载
    *@param {Undefined} undefined
    *@return {Undefined} undefined
    */
    const loading_list = () => {
      data.skeleton.list = true
    };
    /**
     *@description: 足篮显示分析页
    *@param {Boolean} Boolean
    *@return {Undefined} undefined
    */
    const ana_show = (val) => {
      if(val == 1) {  // 足球
        analysis_show.football = true;
        return
      }else if(val == 2){ // 篮球
        analysis_show.basketball = true;
        return
      }else{
        Object.getOwnPropertyNames(analysis_show).forEach((key) => {
          analysis_show[key] = false
        });
      }
    };
    /**
     *@description 切换玩法集时候的动作
    *@param {Undefined} undefined
    *@return {Undefined} undefined
    */
    const tab_changed_handle = () => {
      $nextTick(() => {
        let dom_box = $refs.details_box
        // 视频和动画播放的时候，点击玩法集要重置滚动距离
        if (get_show_video && data.scroller_scroll_top > 0) {
          dom_box.scrollTop = 0
        }
        // 切换玩法集后滚动至首个玩法名称处
        // else if (data.scroller_scroll_top > rem(1.65)) {
        //   dom_box.scrollTop = rem(1.67);
        // }
        // 当点开视频或者动画时,设置玩法区域的高度
        // if(get_tab_fix){
        //   dom_box.scrollTop = rem(0);
        // }
      })
    };

    /**
     *@description 实时获取页面滚动的高度
    *@param {event} event 事件
    *@return {Undefined} undefined
    */
    const detail_scrolling = (event) => {
      data.scroller_scroll_top = event.target.scrollTop;

      // 滚动时隐藏罚牌/角球等说明弹窗
      // #TODO IMIT 
    //   useMittEmit(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, false);
      // $root.$emit(emit_cmd.EMIT_HIDE_GAMEPLAY_TITLE, false)
    };
    /**
     *@description 横屏投注下滚动
    *@param {e} e 事件
    *@return {undefined} undefined
    */
    const full_screen_detail_scrolling = (e) => {
      // 滚动时隐藏罚牌/角球等说明弹窗
      // #TODO IMIT 
    //   useMittEmit(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, false);
      // $root.$emit(emit_cmd.EMIT_HIDE_GAMEPLAY_TITLE, false)
    };
    /**
     *@description 获取当前手指第一次触摸的高度
    *@param {e} e 事件
    *@return {undefined} undefined
    */
    const start = (e) => {
      data.startY = e.targetTouches[0].pageY;
    };
    /**
     * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
     * @param {Number} value 需要转换的值
     * @return {Number} 
     */
    const rem = (value) => {
      let font_size = innerWidth * 100 / 375;
      return Math.ceil(value * font_size);
    };
    /**
     *@description 监听touchmove
    *@param {e} e 事件
    *@return {undefined} undefined
    */
    const moved = (e) => {
      let dom_ = document, dom_ele = dom_.documentElement
      var osTop = dom_ele.scrollTop || dom_.body.scrollTop;
      let px160 = rem(1.6);
      if(( (!!osTop && osTop + 12 >= px160) || ((data.startY - e.targetTouches[0].pageY) * 1.55) >= px160 )){
        fixed_status = true;
      }else if( $refs.fixedHeight.scrollTop == 0 && ((e.targetTouches[0].pageY - data.startY) * 1.5) >= px160){
        fixed_status = false;
      }
    };
    // 监听reset_set_hton事件(详情页投注项点击置顶),设置详情页玩法集合区域的高度为0
    const scrollMethod = () => {
      let el_dom = $refs.fixedHeight
      if(el_dom && el_dom.scrollTop != 0){
        el_dom.scrollTop = 0;
      }
    };
    // 监听is_bool_dialog_details事件，控制是否显示下拉联赛列表
    const changge_bool = (bool) => {
      // bool 的值为true或者是false
      is_dialog_details = bool;
    };
    //  赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
    const initEvent = () => {
      // get_uid为空时循环检测进行拉取逻辑处理
      if(data.get_uid || data.init_event_timer_count>30){
        get_football_replay(0)
        get_match_details({
          // 赛事id
          // mid: '33522226000129832', // matchid,
          mid: matchid.value,
          // 用户id
          cuid: data.get_uid,
        });
        data.init_event_timer_count = 0;
      } else {
        data.init_event_timer_count++;
        clearTimeout(data.init_event_timer);
        data.init_event_timer = setTimeout(() => {
          initEvent();
        }, 500);
      }
    };
    /**
     * 聊天室接口
     */
    const get_chatroom_info = () => {
      api_common.get_chat_datainfo({mid: matchid.value,device:'H5'}).then(({data})=>{
        if(data){
          set_details_chatroom_data(data)
        }
      }).catch((res)=>{
        console.log(res)
      })
    };
    /**
     * 获取精彩回放事件
     * @param {String} event_code 事件code
     */
    const get_football_replay = (event_code) => {
    //   if ([route.params.csid, lodash.get(get_detail_data, 'csid')].includes('1')) {
    //     const params = {
    //       mid: route.params.mid,
    //       device: 'H5',
    //       eventCode: event_code
    //     }
    //     api_result.get_replay_football(params)
    //         .then(res => {
    //           if (res.code == 200 && lodash.get(res.data, 'eventList.length')) {
    //             set_event_list(res.data.eventList)
    //           }
    //         })
    //         .catch(err => {
    //           console.error(err)
    //         })
    //         .finally(() => {

    //         })
    //   }
    };
    /**
     * 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
     */
    const get_match_details = (params) => {
      let api = data.get_menu_type == 3000 ? api_common.get_DJ_matchDetail_MatchInfo : api_common.get_matchDetail_MatchInfo
      api( params ).then(({ data, ts,code }) => {




        // #TODO 
        code = 200
        console.log("code===", data, code)
      // 当状态码为0400500, data:null,data:{} 去到列表中的早盘
        if( code == '0400500' || !data || Object.keys(data).length===0 ){
          router.push({name: 'matchList'})
        }else if(code === 200){
          let data11 = {"tnjc":"Australia Football Queensland Premier League","csna":"足球","tid":"826292","mst":"0","srid":"11134232","mcg":1,"mf":false,"mgt":"1691899200000","maid":"191708","mct":0,"tlev":1,"mhlut":"","mo":0,"mp":1,"csid":"1","ms":110,"mle":0,"lvs":-1,"malu":[""],"lurl":"","mprmc":"PA","mhn":"SWQ Thunder","cds":"LS","frmhn":["S"],"mhs":1,"mlet":"45:00","mhid":"101720","mrmc":"","mid":"3528427","mess":1,"mmp":"0","mststi":"0","mms":-1,"mbmty":1,"mhlu":[""],"seid":"","mstst":"0","malut":"","man":"Sunshine Coast FC","frman":["S"],"mat":"","mng":0,"mststr":"0","mvs":-1,"mststs":0,"mearlys":0,"mft":0,"tn":"Australia Football Queensland Premier League","msc":[]}
          match_detail_data_handle(data11)
          console.log("code===", data11)
          // if (data && Object.keys(data).length) {
          //   match_detail_data_handle(data)
          // } else {
          //   // 赛事下发999后, 显示空空如也
          //   data.skeleton.details = true
          //   data.skeleton.list = true
          //   data.is_show_detail_header_data = false

          //   // 赛事结束后，1.5s后返回主列表页面——bug35360
          //   clearTimeout(data.back_main_list_timer)
          //   data.back_main_list_timer = setTimeout(() => {
          //     // 如果不是演播厅的，才有退出回到 列表
          //     if(lodash.get(get_video_url, 'active') != 'lvs' ){
          //       $common.go_where({back_to: 'go_to_back'})
          //     }
          //   }, 1500)
          // }
        }
      })
      .catch((err)=>{
        console.error(err);
        data.requestCount++
        // 兜底处理，若连续5次拉取接口数据失败，则从仓库取基本数据
        // 间隔3s拉取（服务端节流限制）
        if (data.requestCount < 5) {
          clearTimeout(data.get_match_detail_timer)
          data.get_match_detail_timer = setTimeout(() => {
            initEvent()
          }, 3000)
        } else {
          const match_base_info_obj = lodash.cloneDeep(get_match_base_info_obj)
          match_detail_data_handle(match_base_info_obj)
        }
      })
    };
    // 当前赛事数据后续处理
    const match_detail_data_handle = (res_data) => {
      if( data.skeleton ){
        data.skeleton.details = true
        data.skeleton.list = true
        if(!res_data || Object.keys(res_data).length <= 0) {
          router.replace({name:'category', params: {mid: matchid.value}});
          return false;
        }

        data.requestCount = 0
        data.is_show_detail_header_data = true;
        // data.detail_data = res_data;
        // #TODO 暂时使用假数据 
        data.detail_data = Level_one_detail_data();
        data.math_list_data = [res_data]
        // updateHotReqTime(Date.now())

        // 克隆一份;
        let cloneData = lodash.cloneDeep(res_data);
        // set_detail_data(cloneData);
        store.dispatch({ type: 'detailsReducer/set_detail_data',  payload: cloneData })

        // 设置赛事盘口状态 赛事关盘状态  0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
        let params1 = { sportId: res_data.csid,mid: matchid.value};
        params1 = params1;  // get_odds_list
        // 关联联赛下的赛事项查询,是否存在
        params1 && get_odds_list(params1, 'init_req');
        // sendSocketInitCmd();
      }
    };
    /**
     * 联赛下拉选择组件展开时的联赛列表获取
     */
    const get_match_list = async(params) => {
      let sessiong_store = sessionStorage.getItem('match_list_ofdetails');
      if(sessiong_store) {
        let store_data = JSON.parse(sessiong_store);
        if(store_data.tId == params.tId){
          data.math_list_data = store_data.list;
        }
      }
      if(data.get_menu_type == 3000){
        Object.assign(params,{isESport: 1})
      }
      /**
       *@description 详情页下拉列表接口(/v1/m/matchDetail/getMatchDetailByTournamentIdPB)
      *@param {obj}
      *@return {obj}
      */
      api_common.get_matchDetail_getMatchDetailByTournamentId(params).then(({ data }) => {
        if(!data || data.length == 0){

            set_toast({
              // #TODO IMIT 
              // txt: $root.$t("bet_record.bet_match_tishi"),
            });

          sessionStorage.setItem('match_list_ofdetails','');
          data.math_list_data = [];
          set_sanjiao_is_bool(false);
        }else{
          let store_data = {
            // tid:联赛id
            tId:params.tId,
            list:data
          };
          // 将store_data对象转换为 JSON 字符串
          let sessiong_store = JSON.stringify(store_data);
          // 将sessiong_store的值存在sessionStorage里面
          sessionStorage.setItem('match_list_ofdetails',sessiong_store);
          data.math_list_data = data;
          set_sanjiao_is_bool(true);
        }
      });
    };
    /**
     *@description 获取详情页面玩法集接口(/v1/m/category/getCategoryList)
    *@param {obj} params 请求参数
    *@return {obj} init_req 是否是初次进入详情
    */
    const get_odds_list = async(params = { sportId: data.get_detail_data.csid,mid: matchid.value}, init_req) => {
      const _get_category_list = () => {
        // #TODO 暂时使用假数据
        data.data_list = Level_one_category_list();
        api_common.get_category_list(params).then(res => {
          const res_data = lodash.get(res, "data");
          // data_list = res_data
          
          // 给vuex 设置玩法集数据
          // set_details_tabs_list(res_data);
          // 当玩法集存在激活得项，循环找到对用得id，找得到就不管，找不到就赋值为玩法集第一项
          if( get_details_item && res_data.length ){
            const set_details_item_flag = res_data.some( item=>item.id === get_details_item )
            // 找不到就赋值为玩法集第一项
            if( !set_details_item_flag  ){
              set_details_item(res_data[0]['id']);
            }
          }else{
            // 当第一次进来就会走这里默认赋值第一项
          res_data && set_details_item(res_data[0]['id']);
          }
          let search_term = route.query && route.query.search_term
          if(search_term){
            router.replace({name:'category', params:{mid: matchid.value, mcid: data_list[0]['id']},query:{search_term: search_term}})
          }
          // else{
          // router.replace({name:'category', params:{mcid: data_list[0]['id']}})
          // }
        }).finally(() => {
          // 玩法集接口请求结果返回后，再请求盘口信息接口
          console.log("category", data.category);
          // if ($refs['category']) {
          if (data.category) {
            // 初次进入详情，请求赔率信息需显示loading，其他情况触发玩法集更新，走到这里，请求赔率信息则不显示loading
            const flag = get_category_list_req_count ? 'hide_loading' : ''
            // $refs['category'].initEvent(flag, init_req).then(() => {
            data.category.initEvent(flag, init_req).then(() => {
              if (!get_category_list_req_count) {
                get_category_list_req_count = 1
              } else {
                get_category_list_req_count++
              }

              // 获取赛果数据后，滑动到顶部
              if (data.get_menu_type === 28 && route.name === 'match_result') {
                document.querySelector('.match-header-result').scrollTop = 0
              }
            });
          }
        })
      }

      // const get_category_list_debounce = axios_debounce_cache.get_category_list
      // if(get_category_list_debounce && get_category_list_debounce['ENABLED']){
      //   let info = get_category_list_debounce.can_send_request(params);
      //   if(info.can_send){
      //     //直接发请求    单次数 请求的方法
      //     _get_category_list();
      //   }else{
      //     // 记录timer
      //     clearTimeout(axios_debounce_timer)
      //     axios_debounce_timer = setTimeout(() => {
      //       //直接发请求    单次数 请求的方法
      //       _get_category_list();
      //     }, info.delay_time || 1000);
      //   }
      // } else {
        //直接发请求    多 次数  循环请求 的方法
        _get_category_list();
      // }
    };
    /**
     *@description 响应WS推送C101, C102, C103, C104, C107(参看:src\public\mixins\websocket\data\skt_data_info_header.js)
    *@param {obj}
    *@return {obj}
    */
    const updata_detail_data = (payload, flag) => {
      // 只需要单独对C103的命令单独处理一下，因为msc是个数组，合并需要转化处理;
      if(payload.msc){
        let obj = {}, obj_payload = {}, trans_msc=[];
        lodash.forEach(lodash.get(detail_data, 'msc' ), (item)=>{
          let _key = item.split('|')[0], _val = item.split("|")[1];
          obj[_key] = _val;
        })
        lodash.forEach(payload.msc, (item) => {
          let _key = item.split('|')[0], _val = item.split("|")[1];
          obj_payload[_key] = _val;
        })
        // 合并转化的对象；
        Object.assign(obj, obj_payload);
        // 遍历对象
        for( let key in obj){
          trans_msc.push([key, obj[key]].join("|"));
        }
        // 有赛事比分存在的情况；
        data.detail_data.msc = trans_msc;
        if(flag == 'c801'){   //c801有比分，但是也要合并其他数据
          Object.assign(data.detail_data, payload);
        }
      }else{// 合并数据对象
        Object.assign(data.detail_data, payload);
      }
      // 克隆解决问题
      let cloneData = lodash.cloneDeep(data.detail_data);
      set_detail_data(cloneData);
    };
    const set_native_detail_data = (str) => {
      // 判断是否有相对应的赛事
      let arr_msc = [];
      lodash.forEach(lodash.get(data.detail_data, 'msc' ), (item)=>{
        arr_msc.push(item.split("|")[0]);
      })
      if(!arr_msc.includes(str.split("|")[0])){
        data.detail_data.msc.push(str);
      }
    };
    /**
     *@description WSC112推送过来的玩法删除||新增
    *@param {Object} 推送过来的数据集合
    *@return {Array} 返回新的玩法集
    */
    const change_data_list = (playing) => {
      // mcms = 3 删除玩法集
      // mcms = 2 新增玩法集
      // 无论增减 都重新调用玩法集接口：category/getCategoryList
      let n_params = { sportId: data.detail_data.csid,mid: matchid.value};
      get_odds_list(n_params);
    };
    /**
     *@description 详情页赛事结束自动切换赛事
    *@param {Undefined}
    *@return {Object} 返回赛事各项id(球类id:csid/赛事id:mid/联赛id:tid)
    */
    const event_switch = () => {
      let params = {
        // 查找参数 1:赛事列表(非滚球:今日 早盘...) 2:赛事详情(滚球) 3:赛事筛选 4:赛事搜索(int) 如果不传默认 1:赛事列表
        sm: 2,
        // 菜单ID 多个用逗号分割(字符串)
        euid: get_current_sub_menuid,
        // 早盘日期的参数 早盘 和 串关都要加 (字符串)
        md: get_md != -1 ? get_md : '',
        // 赛事种类id
        csid: data.detail_data.csid,
        // 联赛id
        tid: data.detail_data.tid,
        // 排序 int 类型 1按热门排序 2按时间排序(整型)
        sort: get_sort_type,
        // 搜索关键词 赛事搜索(字符串)
        keyword: get_search_txt || '',
        // 用户id或者uuid
        // cuid: data.get_uid,
        // 赛事id
        mid: matchid.value
      }

      api_common.get_detail_video(params).then(res => {
        let event_data = lodash.get(res, "data", {});
        if(event_data && event_data.mid){

          // 普通赛事跳电竞赛事，或者电竞赛事跳普通赛事，就需要重置菜单类型
          let flag1 = [100,101,103].includes(+event_data.csid)
          let flag2 = [100,101,103].includes(+params.csid)
          if(!get_godetailpage){ // 如果是从app直接进详情页
            if(flag1){
              set_menu_type(3000)
            } else {
              set_menu_type('')
            }
          } else {  // 如果是正常情况下触发了自动跳转
            if(flag1 !== flag2) {
              if(flag1){
                set_menu_type(3000)
              } else {
                set_menu_type('')
              }
            }
          }

          // 重新调用 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
          get_match_details({ mid: event_data.mid, cuid: data.get_uid });
          // 重新调用 详情页面玩法集接口(/v1/m/category/getCategoryList)
          get_odds_list({sportId: event_data.csid,mid: event_data.mid});
          // 存储设置新的赛事id
          set_goto_detail_matchid(event_data.mid);
        } else {
          // 如果不是演播厅的，才有退出回到 列表
          if(lodash.get(get_video_url, 'active') != 'lvs' ) {
            // 没有返回赛事数据就跳转到列表页
            router.push({name: 'matchList'})
          }
        }
      })
    };
    /**
     *@description 监听页面的高度的变化 及时更新页面的高度
    *@param {Undefined}
    *@return {Undefined} undefined
    */
    const detail_scroller_height = () => {
      // 投注栏收起后的底部条预留空间
      if(data.get_betbar_show) {
        // data.scroller_height = window.innerHeight - rem(0.5);
        data.scroller_height = window.innerHeight - 100;
      } else {
        data.scroller_height = window.innerHeight;
      }
    };
    const on_listeners = () => {
      // #TODO IMIT 
      data.emitters = [
        // useMittOn(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, info_icon_click_h).off,
        // useMittOn(MITT_TYPES.EMIT_RESET_SET_HTON, info_icon_click_h).off,
        // useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS, info_icon_click_h).off,
        // // 拳击赛事级别关盘+当前时间(服务器时间)>=赛事开赛时间(mgt) 此时详情页拳击赛事切换下一场
        // useMittOn(MITT_TYPES.EMIT_CHANGE_DETAILS_MATCH, info_icon_click_h).off,
        // useMittOn(MITT_TYPES.EMIT_DETAILS_SKT, info_icon_click_h).off,
        // useMittOn(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, info_icon_click_h).off,
        // useMittOn(MITT_TYPES.EMIT_ANA_SHOW, info_icon_click_h).off,
        // // 0号模板点击收起的时候，要调整滚动距离
        // useMittOn(MITT_TYPES.EMIT_SET_DETAILDS_SCROLL, info_icon_click_h).off,
        // useMittOn(MITT_TYPES.EMIT_MATCHINFO_LOADING, info_icon_click_h).off,
        // useMittOn(MITT_TYPES.EMIT_DETAILILS_TAB_CHANGED, info_icon_click_h).off,
        // useMittOn(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE, info_icon_click_h).off,
        // // 监听页面高度的变化 及时动态更新最新的页面高度
        // useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, info_icon_click_h).off,
      ]
      // $root.$on(emit_cmd.EMIT_IS_BOOL_DIALOG_DETAILS, changge_bool);
      // $root.$on(emit_cmd.EMIT_RESET_SET_HTON, scrollMethod );
      // $root.$on(emit_cmd.EMIT_REFRESH_DETAILS, initEvent);
      // // 拳击赛事级别关盘+当前时间(服务器时间)>=赛事开赛时间(mgt) 此时详情页拳击赛事切换下一场
      // $root.$on(emit_cmd.EMIT_CHANGE_DETAILS_MATCH, event_switch);
      // $root.$on(emit_cmd.EMIT_DETAILS_SKT, sendSocketInitCmd);
      // $root.$on(emit_cmd.EMIT_SET_NATIVE_DETAIL_DATA, set_native_detail_data);

      // $root.$on(emit_cmd.EMIT_ANA_SHOW,ana_show);
      // // 0号模板点击收起的时候，要调整滚动距离
      // $root.$on(emit_cmd.EMIT_SET_DETAILDS_SCROLL,set_details_scroll)
      // $root.$on(emit_cmd.EMIT_MATCHINFO_LOADING, loading_list);

      // $root.$on(emit_cmd.EMIT_DETAILILS_TAB_CHANGED,tab_changed_handle);
      // $root.$on(emit_cmd.EMIT_TABS_LIST_UPDATE_HANDLE,get_odds_list);
      // // 监听页面高度的变化 及时动态更新最新的页面高度
      // $root.$on(emit_cmd.EMIT_WINDOW_RESIZE, detail_scroller_height);
    };
    const off_listeners = () => {
      // #TODO IMIT 
      data.emitters.map((x) => x())
      // $root.$off(emit_cmd.EMIT_ANA_SHOW,ana_show)
      // // 清除刷新详情页;
      // $root.$off(emit_cmd.EMIT_REFRESH_DETAILS, initEvent);
      // // 清除赛事切换事件监听(拳击)
      // $root.$off(emit_cmd.EMIT_CHANGE_DETAILS_MATCH, event_switch);
      // $root.$off(emit_cmd.EMIT_RESET_SET_HTON, scrollMethod );

      // // 取消订阅事件
      // $root.$off(emit_cmd.EMIT_IS_BOOL_DIALOG_DETAILS, changge_bool);
      // $root.$off(emit_cmd.EMIT_SET_NATIVE_DETAIL_DATA, set_native_detail_data);
      // $root.$off(emit_cmd.EMIT_DETAILS_SKT, sendSocketInitCmd);
      // $root.$off(emit_cmd.EMIT_DETAILILS_TAB_CHANGED,tab_changed_handle);
      // $root.$off(emit_cmd.EMIT_TABS_LIST_UPDATE_HANDLE, get_odds_list);

      // // 清除页面高度的监听动作
      // $root.$off(emit_cmd.EMIT_WINDOW_RESIZE, detail_scroller_height);
      // $root.$off(emit_cmd.EMIT_MATCHINFO_LOADING,loading_list)
      // $root.$off(emit_cmd.EMIT_SET_DETAILDS_SCROLL,set_details_scroll)
    };
    // 清除当前组件所有定时器
    const clear_timer = () => {
      // timeout定时器列表
      const timeout_timer_arr = [
        'timer1_',
        'timer2_',
        'get_match_detail_timer',
        'back_main_list_timer',
        'axios_debounce_timer',
        'init_event_timer'
      ]

      // interval定时器列表
      const interval_timer_arr = [

      ]

      // 批量清除timeout定时器
      for (const timer of timeout_timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }

      // 批量清除interval定时器
      for (const timer of interval_timer_arr) {
        clearInterval(this[timer])
        this[timer] = null
      }
    };
    return {
      ...toRefs(data),
      is_highlights,
      show_match_analysis_tab,
      show_chatroom_tab,
      scroll_visible,
      skeleton_finish,
      matchid,
      curr_active_tab,
      icon_replay,
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
      clear_timer
    }
  }
})
</script>

<style lang="scss" scoped>
.details-fat {
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overflow-x: hidden;
}
.play-wrapper {
  ::v-deep .q-tab {
    min-height: 0.4rem;
    height: 0.4rem;

    &.text-active-tab {
      .q-tab__label {
        font-weight: bolder;
      }
    }

    .q-tab__label {
      font-size: 0.14rem;
    }
  }

  ::v-deep .q-tab__indicator {
    color: var(--q-color-page-bg-color-50);
    border-radius: 1.5px;
    z-index: 1;
  }
}

.header-fix {
  position: sticky;
  top: 0;
  z-index: 80;
  width: 100%;

  &.results_header_top {
    height: unset;

    .scroll_video_h {
      min-height: unset;
    }
  }

  &.match-header-result {
    z-index: 90;
  }
}


/****************** 横屏投注弹窗 开始*******************/
.video-full-screen {
  .play-wrapper {
    position: fixed;
    top: 0;
    right: -2.8rem;
    width: 2.8rem;

    height: 3.75rem;
    z-index: 100;
    overflow: auto;

    /*************模拟毛玻璃*************/
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:  var(--q-color-com-img-bg-88);
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: cover;
      background-position: top;
      filter: blur(10px);
      z-index: -2;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--q-color-com-bg-color-32);
      z-index: -1;
    }

    .details-tab-list {
      overflow: auto;
    }

    &.bet-wrapper-show {
      right: 0;
      transition: all 0.15s ease-in;
    }

    &.bet-wrapper-hide {
      right: -2.8rem;
      transition: all 0.15s ease-in;
    }

    .details-tab-wrap {
      position: unset;

      ::v-deep .details-tab {
        position: relative;
        height: 0.32rem;
        background: transparent;

        border-bottom: 0;

        &::before {
          position: absolute;
          top: 0;
          content: ' ';
          width: 2.8rem;
          height: 100%;
          z-index: -1;
          background: var(--q-color-com-bg-color-34);
        }

        &::after {
          bottom: 0;
          left: 0;
          position: absolute;
          content: ' ';
          display: block;
          width: 100%;
          height: 1px;
          background-color: var(--q-color-com-fs-color-3);
          transform: scaleY(0.5);
        }

        .t_color::after {
          width: calc(100% - 0.24rem);
          bottom: 0;
          z-index: 9;
        }
      }

      ::v-deep .fat-btn {
        width: 0.36rem;
        float: right;
        padding-top: 0;
      }

      ::v-deep .menu-third {
        padding-right: 0;

        &::after {
          width: 0;
        }
      }

      ::v-deep .menu-item {
        font-size: 0.12rem;
        line-height: 0.32rem;

        &.t_color {
          color: var(--q-color-com-fs-color-8);
          // color: var(--q-color-com-fs-color-8) !important;
        }
      }
    }

    .content-box {
      position: relative;

      &::after {
        position: absolute;
        top: 0;
        content: ' ';
        width: 2.8rem;
        height: 100%;
        z-index: -1;
        background: var(--q-color-com-bg-color-34);
      }
    }

    ::v-deep .virtual-bet-wrapper {
      border-radius: 0;
      overflow: initial;
    }

    ::v-deep .esport-bet-wrapper {
      border-radius: 0;
      overflow: initial;
    }

    ::v-deep .category {
      .mat-info, .mat-info2 {
        left: unset !important;
        right: 0.3rem !important;
      }

      .bottom-style::after {
        bottom: 0;
        left: 0;
        position: absolute;
        content: ' ';
        display: block;
        width: 100%;
        height: 1px;
        background-color: var(--q-color-com-bg-color-29);
        transform: scaleY(0.5);
        border-bottom: 0;
      }

      .match-recommend-wrapper {
        position: absolute;
        top: 40%;
        transform: translate3d(0, -50%, 0);
        background-color: transparent !important;

        img {
          height: 0.99rem;
        }

        .empty-m-list-w {
          position: unset;
          font-size: 0.1rem;
          font-weight: 500;
        }
      }

      .text-color {
        font-size: 0.1rem;
        color: var(--q-color-com-fs-color-8) !important;
      }

      .tournament-play {
        min-width: 2.8rem;
        background: transparent !important;

        .hairline-border::after {
          border: 0 !important;
        }

        .play-name {
          margin: 0;

          .items-center {
            padding-right: 0.12rem;
          }

          .icon_zd_default {
            position: relative;
            width: 0.2rem;
            height: 0.2rem;
            background: none;

            &::after {
              content: '';
              position: absolute;
              right: -0.04rem;
              width: 0.2rem;
              height: 0.2rem;
              background: var(--q-color-com-img-bg-87) no-repeat right / 96% 96%;
            }
          }

          .icon_zd_select {
            position: relative;
            width: 0.2rem;
            height: 0.2rem;
            background: none;

            &::after {
              content: '';
              position: absolute;
              right: -0.04rem;
              width: 0.2rem;
              height: 0.2rem;
            }
          }

          .corner-ball-weg {
            padding-left: 0.15rem;

            &::after {
              left: 0;
              width: 2px;
              border-radius: 1.1rem;
            }
          }

          .basic-score {
            padding-left: 0.15rem;
          }
        }

        .font-weg {
          padding-left: 0.15rem;
        }

        .base-font-weg {
          min-height: 0.26rem;

          &::after {
            left: -0.15rem;
            width: 2px;
            height: 0.12rem;
            border-radius: 1.1rem;
          }
        }

        .vir-sport {
          height: 0.26rem;
          line-height: 0.26rem;
        }
      }
    }

    .details-f {
      top: 0;
      background: transparent !important;
      min-height: 3.43rem;
      height: 3.43rem;
    }

    ::v-deep [class^=temp] {
      padding: 0.04rem 0.05rem 0.06rem 0.05rem;
    }

    ::v-deep .play-name-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 0.2rem;

      &::after {
        position: absolute;
        content: ' ';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--q-color-com-bg-color-31);
        border-radius: 0.04rem;
      }

      .item-name {
        flex: 0 0 50%;
        padding: 0 0.1rem;
        text-align: center;
        font-size: 0.1rem;
        color: var(--q-color-com-fs-color-11);
        font-weight: 500;
      }
    }

    ::v-deep .title-style {
      position: relative;
      height: 0.2rem;
      margin-bottom: 0;

      &::after {
        position: absolute;
        content: ' ';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--q-color-com-bg-color-31);
        border-radius: 0.04rem;
      }

      .fam {
        height: 0.2rem;
        line-height: 0.2rem;
        padding: 0 0.1rem;
        color: var(--q-color-com-fs-color-11);
        font-size: 0.1rem;
        font-weight: 500;
      }
    }

    ::v-deep .fz_16 {
      font-size: 0.11rem;
      font-weight: 400;
    }

    ::v-deep .odds_new {
      font-size: 0.12rem;
      font-weight: 700;
      color: var(--q-color-com-fs-color-8);

      .change-icon {
        right: -0.1rem;
      }
    }

    ::v-deep .details_t_color6, ::v-deep .details_t_color7 {
      font-size: 0.11rem;
      font-weight: 400;
      color: var(--q-color-com-fs-color-11);
    }

    ::v-deep .size-color {
      color: var(--q-color-fs-color-50);
    }

    ::v-deep .details_t_color7 {
      color: var(--q-color-com-fs-color-26) !important;

      .size-color {
        color: var(--q-color-com-fs-color-26) !important;
      }
    }

    ::v-deep .play-box-style {
      position: relative;
      height: 0.31rem;
      line-height: 0.31rem;
      padding: 0 0.1rem;
      background-color: var(--q-color-com-bg-color-35);
      border-bottom: 0;
      &.is-like-bodan-play {
        line-height: .18rem;
      }

      &::after {
        content: "";
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
        border: 1px solid var(--q-color-com-border-color-18);
        border-radius: 0.08rem;
        background-color: transparent;
        overflow: hidden;
      }
    }

    ::v-deep .play-box-lock {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ::v-deep .item-wrap {
      overflow: initial;
    }

    ::v-deep .rad-style {
      background-color: transparent !important;
    }

    ::v-deep .temp0 {
      .bor-style {
        border-radius: 0;
        overflow: initial;

        > div {
          margin-bottom: 0.05rem;
        }
      }
    }

    ::v-deep .temp1 {
      .item-wrap .row {
        justify-content: space-between;
      }

      .play-box-style {

        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .details_color {
        background: var(--q-color-com-bg-color-35);
      }

      .fat-warp {
        flex: 0 0 0.8rem;
        border-radius: 0;
      }

      .led {
        width: inherit;
        height: 0.12rem;
        line-height: 0.12rem;
        font-size: 0.1rem;
        color: var(--q-color-com-fs-color-11);
        font-weight: 500;
        margin-top: 0.03rem;
      }

      .odds_new {
        height: 0.14rem;
        line-height: 0.14rem;
        font-size: 0.12rem;
        margin-bottom: 0.02rem;
        padding-bottom: 0;
        color: var(--q-color-com-fs-color-8);
        font-weight: 700;
      }

      .odds-wrap {
        height: 0.32rem;
      }

      .icon-lock {
        margin: 0;
      }
    }

    ::v-deep .temp2 {
      .bet-wrapper {
        border-radius: 0;
        overflow: initial;
      }

      .row {
        justify-content: space-between;

        .col {
          flex: 0 0 1.23rem;
          margin: 0.05rem 0 0 0;

          .play-box {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 0.32rem;
            padding: 0 0.1rem;
            border-radius: 0;
            background-color: var(--q-color-com-bg-color-35);

            &.play-box-lock {
              justify-content: center;
            }

            &::after {
              content: "";
              pointer-events: none;
              position: absolute;
              left: 0;
              top: 0;
              width: 200%;
              height: 200%;
              -webkit-transform: scale(0.5);
              transform: scale(0.5);
              -webkit-transform-origin: left top;
              transform-origin: left top;
              border: 1px solid var(--q-color-com-border-color-18);
              border-radius: 0.08rem;
              overflow: hidden;
            }

            .ellipsis {
              flex: 1;
              text-align: left;
              font-size: 0.11rem;
              font-weight: 400;
            }

            .odds_new {
              flex: 1;
              text-align: right;
            }
          }
        }
      }
    }

    ::v-deep .temp3 {
      .item-wrap {
        justify-content: space-between;
        border-radius: 0;
        overflow: initial;

        .item2 {
          position: relative;
          flex: 0 0 1.23rem;
          height: 0.32rem;
          border-right: 0;
          margin-bottom: 0.04rem;

          &::after {
            content: "";
            pointer-events: none;
            position: absolute;
            left: 0;
            top: 0;
            width: 200%;
            height: 200%;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            -webkit-transform-origin: left top;
            transform-origin: left top;
            border: 1px solid var(--q-color-com-border-color-18);
            border-radius: 0.08rem;
            background-color: transparent;
            overflow: hidden;
          }

          .play-box-style::after {
            border: 0;
          }
        }
      }
    }

    ::v-deep .temp4 {
      .item-wrap {
        overflow: initial;

        .row {
          justify-content: space-between;

          .col {
            flex: 0 0 0.8rem;
          }
        }
      }

      .play-box-style {
        margin-top: 0.05rem;

        &.details_color {
          background-color: var(--q-color-com-bg-color-35);
        }

        .odds-wrap {
          width: auto;
        }
      }

      .margin-other {
        border-top: 0;

        .remark {
          flex: 0 0 auto;
          margin-right: 0.05rem;
        }

        .icon-lock {
          vertical-align: text-bottom;
        }
      }

      .other .odds-wrap {
        width: 0.45rem;
      }
    }

    ::v-deep .temp5 {
      .head {
        position: relative;
        height: 0.2rem;
        margin-bottom: 0;

        &::after {
          position: absolute;
          content: ' ';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--q-color-com-bg-color-31);
          border-radius: 0.04rem;
        }

        .col {
          height: 0.2rem;
          line-height: 0.2rem;
          padding: 0 0.1rem;
          color: var(--q-color-com-fs-color-11);
          font-size: 0.1rem;
          font-weight: 500;
        }
      }

      > .row:not(.head) {
        justify-content: space-between;

        .col {
          flex: 0 0 0.8rem;

          .ellipsis {
            overflow: initial;
          }
        }
      }

      .play-box-style {
        margin-top: 0.05rem;
      }

      .other {
        justify-content: space-between;

        .play-box-style {
          flex: 0 0 0.8rem;

          &:last-child {
            flex: 0 0 1.65rem;
          }
        }
      }
    }

    ::v-deep .temp6 {
      .title-style {
        position: relative;
        height: 0.2rem;
        line-height: 0.2rem;
        color: var(--q-color-com-fs-color-11);

        &::after {
          position: absolute;
          content: ' ';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--q-color-com-bg-color-31);
          border-radius: 0.04rem;
        }

        > .col {
          flex: 0 0 50%;
          padding: 0 0.1rem;
        }
      }

      .item {
        justify-content: space-between;
      }

      .item-col {
        flex: 0 0 1.23rem;
      }

      .play-box-style {
        justify-content: space-between;
        margin-top: 0.05rem;

        &.show-more {
          justify-content: center;
        }

        .remark {
          -webkit-line-clamp: 1;
        }

        .odds-wrap {
          width: auto;
        }
      }

      .size-color {
        color: var(--q-color-com-fs-color-11);
      }

      .item-col:first-child {
        border: 0;
      }

      .bor-style {
        border: 0 !important;
      }
    }

    ::v-deep .temp7 {
      .item-wrap {
        .bor-style {
          border: 0;
        }

        .row {
          justify-content: space-between;

          .col {
            flex: 0 0 0.8rem;
            margin-top: 0.05rem;

            &:last-child {
              .play-box-style::before {
                content: "";
                pointer-events: none;
                position: absolute;
                left: 0;
                top: 0;
                width: 200%;
                height: 200%;
                -webkit-transform: scale(0.5);
                transform: scale(0.5);
                -webkit-transform-origin: left top;
                transform-origin: left top;
                border: 1px solid var(--q-color-com-border-color-18);
                border-radius: 0.08rem;
                overflow: hidden;
              }
            }
          }

          .play-box-style {
            align-items: center;

            .details_t_color6 {
              &.size-color-imp {
                color: var(--q-color-com-fs-color-26) !important;
              }
            }

            .remark {
              text-align: left;
            }

            .odds-wrap {
              flex: 1;
              text-align: right;
            }

            img {
              margin-top: 0;
              vertical-align: text-bottom;
            }
          }
        }
      }
    }

    ::v-deep .temp13 {
      .rad-style {
        overflow: initial;

        > .row {
          position: relative;
          display: inline-block;
          width: 1.23rem;
          margin-top: 0.05rem;

          &.bor-style {
            margin-right: 0.04rem;
          }
        }
      }

      .slide-con {
        overflow: initial;

        .slide-wrap {
          position: unset;
          height: auto;
          flex-wrap: wrap;
          background-color: transparent;

          .col {
            position: relative;
            flex: 0 0 100%;
            height: 0.32rem;

            &::after {
              content: "";
              pointer-events: none;
              position: absolute;
              left: 0;
              top: 0;
              width: 200%;
              height: 200%;
              -webkit-transform: scale(0.5);
              transform: scale(0.5);
              -webkit-transform-origin: left top;
              transform-origin: left top;
              border: 1px solid var(--q-color-com-border-color-18);
              border-radius: 0.08rem;
              overflow: hidden;
            }

            &:not(:first-child) {
              margin-top: 0.05rem;
            }
          }
        }
      }

      .play-box-sty {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.32rem;

        padding: 0 0.1rem;
        background: var(--q-color-com-bg-color-35);

        &.odds-lock {
          justify-content: center;
        }

        .single-name {
          float: left;
          font-weight: 400;
          padding-top: 0;
          line-height: 0.32rem;

          [class^=fz_] {
            font-size: 0.11rem;
          }
        }

        .odds-style {
          width: auto;
          float: right;
          line-height: 0.32rem;
          padding-bottom: 0;
          font-size: 0.12rem;
          font-weight: 700;
          color: var(--q-color-com-fs-color-8);
        }

        .night-style {
          color: var(--q-color-com-fs-color-26);
        }
      }
    }

    ::v-deep .temp14 {
      .tittle {
        position: relative;
        height: 0.2rem;
        font-size: 0.1rem;
        font-weight: 500;
        color: var(--q-color-com-fs-color-11);

        &::after {
          position: absolute;
          content: ' ';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--q-color-com-bg-color-31);
          border-radius: 0.04rem;
        }

        .col {
          padding: 0 0.1rem;
        }
      }

      .row-bet-wrapper {
        justify-content: space-between;
        border-radius: 0;
        overflow: initial;

        .col {
          flex: 0 0 1.23rem;

          &.col3 {
            flex: 0 0 0.8rem;
          }

          > div {
            position: relative;
            height: 0.32rem;
            margin-top: 0.05rem;
            background-color: var(--q-color-com-bg-color-35);

            &::after {
              content: "";
              pointer-events: none;
              position: absolute;
              left: 0;
              top: 0;
              width: 200%;
              height: 200%;
              -webkit-transform: scale(0.5);
              transform: scale(0.5);
              -webkit-transform-origin: left top;
              transform-origin: left top;
              border: 1px solid var(--q-color-com-border-color-18);
              border-radius: 0.08rem;
              overflow: hidden;
            }
          }
        }
      }

      .play-box {
        position: relative;
        display: flex;

        align-items: center;
        justify-content: space-around;
        height: 0.32rem;
        padding: 0 0.1rem;
        background-color: transparent;

        .remark {


          flex: 1;
          text-align: left;
          font-size: 0.11rem;
          color: var(--q-color-com-fs-color-26);
        }

        .odds_new {


          flex: 1;
          text-align: right;
        }

        img {
          width: 0.12rem;
          height: 0.14rem;
        }
      }

      .item-fat {
        font-size: 0.1rem;
        font-weight: 500;
        color: var(--q-color-com-fs-color-11);
      }

      > .content {
        position: relative;
        border-bottom: 0;

        &:not(:first-child)::after {
          bottom: 0;
          left: 0;
          position: absolute;
          content: ' ';
          display: block;
          width: 100%;
          height: 1px;
          background-color: var(--q-color-com-bg-color-12);
          transform: scaleY(0.5);
        }
      }

      .item-son {
        font-size: 0.11rem;
        font-weight: 400;
      }

      .content {
        border-radius: 0;
        overflow: initial;
      }
    }

    ::v-deep .temp15 {
      overflow: initial;
      .play-box {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 0.32rem;
        padding: 0 0.1rem;
        background-color: var(--q-color-com-bg-color-35);

        &::after {
          content: "";
          pointer-events: none;
          position: absolute;
          left: 0;
          top: 0;
          width: 200%;
          height: 200%;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          -webkit-transform-origin: left top;
          transform-origin: left top;
          border: 1px solid var(--q-color-com-border-color-18);
          border-radius: 0.08rem;
          overflow: hidden;
        }

        &.every5:nth-child(n + 4), &.every5 ~ i {
          margin-top: 0.05rem;
        }

        &.every2, &.every4 {
          flex: 0 0 1.23rem;

          &:nth-child(n + 3) {
            margin-top: 0.05rem;
          }
        }

        &.every3, &.every5, &.every5 ~ i {
          flex: 0 0 0.8rem;
        }

        &.play-box-lock {
          justify-content: center;
        }
      }

      .play-box.every5.border-top {
        border-top: 0;

        & ~ i.border-top {
          border-top: 0;
        }
      }

      .play-box.every5:not(:nth-child(3n)) {
        border-right: 0;
      }

      i.play-box:not(:last-child) {
        border-right: 0;
      }
    }

    ::v-deep .temp16 {
      .tittle {
        position: relative;
        height: 0.2rem;
        font-size: 0.1rem;
        font-weight: 500;
        color: var(--q-color-com-fs-color-11);

        &::after {
          position: absolute;
          content: ' ';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--q-color-com-bg-color-31);
          border-radius: 0.04rem;
        }

        .col {
          padding: 0 0.1rem;
        }
      }

      .row-bet-wrapper {
        justify-content: space-between;
        border-radius: 0;
        overflow: initial;

        .col {
          flex: 0 0 1.23rem;

          &.col3 {
            flex: 0 0 0.8rem;
          }

          > div {
            position: relative;
            height: 0.32rem;
            margin-top: 0.05rem;
            background-color: var(--q-color-com-bg-color-35);

            &::after {
              content: "";
              pointer-events: none;
              position: absolute;
              left: 0;
              top: 0;
              width: 200%;
              height: 200%;
              -webkit-transform: scale(0.5);
              transform: scale(0.5);
              -webkit-transform-origin: left top;
              transform-origin: left top;
              border: 1px solid var(--q-color-com-border-color-18);
              border-radius: 0.08rem;
              overflow: hidden;
            }
          }
        }
      }

      .play-box {
        position: relative;
        display: flex;

        align-items: center;
        justify-content: space-around;
        height: 0.32rem;
        padding: 0 0.1rem;
        background-color: transparent;

        .remark {


          flex: 1;
          text-align: left;
          font-size: 0.11rem;
          color: var(--q-color-com-fs-color-26);
        }

        .odds_new {


          flex: 1;
          text-align: right;
        }

        img {
          width: 0.12rem;
          height: 0.14rem;
        }
      }

      .item-fat {
        font-size: 0.1rem;
        font-weight: 500;
        color: var(--q-color-com-fs-color-11);
      }

      > .content {
        position: relative;
        border-bottom: 0;

        &:not(:first-child)::after {
          bottom: 0;
          left: 0;
          position: absolute;
          content: ' ';
          display: block;
          width: 100%;
          height: 1px;
          background-color: var(--q-color-com-bg-color-12);
          transform: scaleY(0.5);
        }
      }

      .item-son {
        font-size: 0.11rem;
        font-weight: 400;
      }

      .content {
        border-radius: 0;
        overflow: initial;
      }
    }
  }
}


/****************** 横屏投注弹窗 结束*******************/
.content-box {
  position: sticky;
  top: .44rem;
  z-index: 80;
}

.details-tab-wrap {
  background-color:  var(--q-color-page-bg-color-103);
  position: sticky;
  top: 0.44rem;
  z-index: 81;
  width: 100%;

  &.z-index0 {
    z-index: 0;
  }

  &.z-index81 {
    z-index: 81;
  }

  ::v-deep [class*=tab-match-analysis]{
    .q-tab__alert-icon {
      top: .118rem;
      right: -.19rem;
      font-size: .14rem;
    }
  }
}

.show-video {
  .header-fix {
    z-index: 81;
  }

  .content-box {
    top: 2.59rem;
  }

  .details-tab-wrap {
    top: 2.11rem;
  }
}

.show-replay-video {
  .header-fix {
    z-index: 80;
  }
}

.scroll_video_h {
  min-height: 2.11rem;
}

.details-tab-list {
  width: 100%;
  height: inherit;
  overflow: hidden;
}

.details-tab-list-scroll {
  &::-webkit-scrollbar {
    display: none !important;
  }
}

.details-tab-list-scroll-zhiding {
  overflow: scroll !important;

  &::-webkit-scrollbar {
    display: none !important;
  }
}

.no-data-style {
  position: absolute;
  left: 0;
  right: 0;
}

.mini-header-container {
  width: 100%;
  height: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 85;
  &.no-z-index {
    z-index: 0;
  }
}

/*  刷新按钮 */
// @include keyframes(loading-ring-animate) {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }

.details-ref {
  position: fixed;
  right: 6.5%;
  bottom: 0.56rem;
  z-index: 90;
  width: 0.28rem;
  height: 0.28rem;
  border-radius: 50%;
  background-color: var(--q-color-page-bg-color-82);
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 0.2rem;
    height: 0.2rem;
    background: var(--q-color-com-img-bg-70) center no-repeat;
    background-size: 100% 100%;
  }

  .refreshing {
    animation: 0.7s loading-ring-animate linear;
  }
}

.head {
  width: 100%;
  line-height: 0.44rem;
  height: 0.44rem;
  color: var(--q-color-com-fs-color-34);
  text-align: center;

  > span {
    font-family: PingFangSC-Medium sans-serif;
    font-size: 0.13rem;
    color: var(--q-color-com-fs-color-34);
  }

  img {


    position: absolute;
    left: 0.15rem;
    top: 0.1rem;
    display: inline-block;
    width: 0.12rem;
    height: 0.2rem;
    vertical-align: -0.04rem;
    margin-left: 0.01rem;
  }
}
</style>
<style lang="scss">
.detail-top-pop .q-dialog__inner--minimized {
  padding: 0;
}
</style>
