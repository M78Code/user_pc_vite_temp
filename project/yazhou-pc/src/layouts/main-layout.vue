<template>
  <q-layout view="lHh Lpr lFf">
    <div class="c-main-scroll window-width window-height">
      <div
        class="main overflow-hidden relative-position"
        :class="{
          'iframe-top-collapse': computed_data.menu_collapse_status,
        }"
        :style="`width:${computed_data.layout_size.main_width}px;`"
      >
        <!-- 搜索 -->
        <search
          v-if="computed_data.get_search_status"
          v-show="route.params.video_size != 1"
        />
        <!-- 页面头部容器-->
        <layout-header class="yb-layout-margin-header" :has_bonus_type="data_ref.hasBonusType3"></layout-header>
        <div
          class="c-main-content c-content-bg"
          :style="`width:${
            computed_data.layout_size.main_width
          }px  !important; height:${
            computed_data.layout_size.content_height + 4
          }px  !important;`"
        >
          <layout-left :loading:="data_ref.bet_loadding" />

          <!-- 中间区域 -->
          <keep-alive include="matchListRouter" max="1">
            <router-view
              class="page-center"
              :class="data_ref.screen_width"
              :style="
                route.params.video_size == 1
                  ? 'position: fixed; top: 0;  bottom: 0;right: 0;  left: 0; width: 100%;height: 100%;'
                  : `width:${computed_data.layout_size.center_width}px  !important; height:${computed_data.layout_size.content_height}px  !important;`
              "
            />
          </keep-alive>

          <!-- 右侧区域 -->
          <div
            class="page-right"
            :class="data_ref.screen_width"
            :style="
              route.params.video_size == 1
                ? ''
                : `width:${computed_data.layout_size.right_width}px  !important; height:${computed_data.layout_size.content_height}px  !important;`
            "
            v-if="computed_data.layout_size.right_width > 0"
          >
            <!-- 虚拟体育 -->
            <virtual-right
              v-if="
                new_menu.is_virtual_sport() &&
                route.name != 'search' &&
                route.name != 'details'
              "
            />
            <!-- 常规竞猜 -->
            <match-details v-else class="page-match-detail fit" />
          </div>
        </div>

        <!-- 小于 1440 时显示折叠按钮  -->
        <div
          v-if="route.params.video_size != 1"
          v-show="computed_data.vx_main_menu_toggle != 'normal'"
          @click="on_main_menu_toggle"
          class="menu_toggle-btn yb-flex-center"
          :class="[
            computed_data.vx_main_menu_toggle,
            data_ref.bet_loadding ? 'disable-toggle' : '',
          ]"
        >
          <!-- <img src="~public/image/yabo/svg/left_menu_toggle.svg" alt="" /> -->
        </div>

        <!-- toast 消息提示 -->
        <toast />
        <confirm />
        <alert />
        <!-- 押注操作相关组件 -->
        <!-- 活动弹框 -->
        <activityModel
          v-if="data_ref.showActivity"
          :imgUrl="data_ref.imgUrl"
          :imgShowTimer="data_ref.userBannerTimer"
          :hostUrl="data_ref.hostUrl"
          :urlType="data_ref.urlType"
          :allowClick="data_ref.allowClick"
        />
        <!-- 页面底部容器 整个内嵌可拖拽组件 -->
        <template
          v-if="
            show_bet_zone &&
            !computed_data.left_menu_toggle &&
            route.name != 'video'
          "
        >
          <vue-draggable-resizable
            ref="resizable"
            :axis="data_ref.axis"
            :x="data_ref.x"
            :y="data_ref.y"
            :w="300"
            :h="data_ref.h"
            :z="2000"
            :resizable="false"
            :parent="true"
            :prevent-deactivation="true"
            @dragging="move_handle"
            @dragstop="stop_handle"
            :style="draggable_style"
            class-name="bet-zone"
          >
            <div
              class="cathectic-shade"
              :class="{
                'zero-opacity': !data_ref.bet_loadding && data_ref.dragging,
              }"
              v-show="data_ref.bet_loadding || data_ref.dragging"
            >
              <!--确认中转圈圈-->
              <template v-if="data_ref.bet_loadding">
                <div class="shade-fixed">
                  <div class="loading-wrap">
                    <div class="img-loading"></div>
                    <div
                      class="text-center loading-text flex items-end justify-center"
                    >
                      {{ $t("bet.bet_loading") + "..." }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <!--滚动条头部-->
            <template v-if="BetData.is_virtual_bet">
              <virtual-bet-scroll-header
                ref="resizeable_header"
                :is_free="false"
                :is_expand="data_ref.is_expand"
              />
            </template>
            <bet-scroll-header
              v-else
              ref="resizeable_header"
              :is_expand="data_ref.is_expand"
              :bet_flag="data_ref.bet_flag"
              :is_free="false"
            />
            <div
              class="cathectic-zone"
              :class="{ 'bet-zone-height': !data_ref.is_expand }"
              v-show="data_ref.data_ref.is_expand2"
              @click.stop="check_drag"
            >
              <!--中间内容部分-->
              <q-scroll-area
                ref="bet_scroll_area"
                class="bet-scroll-area"
                :thumb-style="thumb_style"
                :style="{
                  height: `${data_ref.content_height}px`,
                  width: '300px',
                  'max-height': `${
                    computed_data.layout_size.content_height - 190
                  }px`,
                }"
              >
                <!--虚拟体育部分-->
                <template v-if="BetData.is_virtual_bet">
                  <!-- 虚拟单关 -->
                  <virtual-bet-single
                    ref="embedded_single"
                    @set_scroll_this="set_scroll_this"
                    v-if="virtual_bet_list.length == 1"
                  />
                  <!-- 虚拟串关 -->
                  <virtual-bet-mix
                    ref="embedded_mix"
                    @set_scroll_this="set_scroll_this"
                    v-if="virtual_bet_list.length > 1"
                  />
                </template>
                <!--非虚拟体育部分-->
                <template v-else>
                  <div
                    ref="bet_mode_zone"
                    class="bet-mode-zone"
                    v-if="BetData.is_bet_single"
                  >
                    <div class="left">
                      <span>{{ $t("bet.bet_one_") }}</span>
                      <span class="bet-single-count">
                        {{ BetData.bet_single_list.length }}
                      </span>
                    </div>
                    <div class="right">
                      <span
                        class="check-box"
                        :class="{ checked: BetData.is_bet_merge }"
                        @click.stop="toggle_merge"
                      >
                        <check-box
                          :checked="BetData.is_bet_merge"
                        /><span>{{ $t("bet.merge") }}</span>
                      </span>
                      <span
                        @mouseover="data_ref.show_merge_info = true"
                        @mouseout="data_ref.show_merge_info = false"
                      >
                        <icon
                          id="merge-info"
                          name="icon-tips"
                          class="bet-info"
                          size="14px"
                        />
                      </span>
                    </div>
                  </div>
                  <!--内嵌的单关-->
                  <bet-single
                    ref="embedded_single"
                    @set_scroll_this="set_scroll_this"
                    v-if="BetData.is_bet_single"
                  />
                  <!--内嵌的串关-->
                  <bet-mix
                    ref="embedded_mix"
                    @set_scroll_this="set_scroll_this"
                    v-if="!BetData.is_bet_single"
                  />
                </template>
              </q-scroll-area>
              <!-- 滚动：尾部 --------------------------------->
              <!--滚动条底部-->
              <template v-if="BetData.is_virtual_bet">
                <virtual-bet-scroll-footer
                  ref="resizeable_footer"
                  :bet_this="data_ref.bet_this"
                />
              </template>
              <template v-else>
                <bet-scroll-footer
                  ref="resizeable_footer"
                  :bet_this="data_ref.bet_this"
                />
              </template>
            </div>
          </vue-draggable-resizable>
        </template>
        <!-- 视频画中画组件 -->
        <moveVideo v-if="show_move_video"></moveVideo>
      </div>
      <loading v-if="data_ref.dataLoading" />
      <!--提示区域-->
      <q-tooltip
        content-class="bet-bg-tooltip"
        anchor="bottom left"
        self="top left"
        :offset="[262, 10]"
        target="#merge-info"
        v-if="data_ref.show_merge_info"
      >
        <div
          style="
            width: 252px;
            min-height: 60px;
            padding-top: 5px;
            padding-bottom: 10px;
            padding-left: 5px;
            word-break: break-all;
          "
        >
          {{ $t("bet.merge_info") }}
        </div>
      </q-tooltip>
      <!-- 引导页 -->
      <introduce />
    </div>
  </q-layout>
</template>
<script setup>
import {
  ref,
  onMounted,
  computed,
  defineAsyncComponent,
  reactive,
  nextTick,
  onBeforeUnmount,
  watch,
} from "vue";
import { get, isEmpty, cloneDeep, isArray } from "lodash";
import store from "src/store-redux/index.js";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import base_data from "src/core/base-data/base-data.js";
import matchlist from "src/core/match-list-pc/match-scroll.js";
import match_list_tpl_size from "src/core/match-list/data-class-ctr/match-list-tpl-size.js";
import new_menu from "src/core/menu-pc/menu-data-class.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt";
import { useEventListener } from "src/core/utils/event-hook";
import {utils } from 'src/core/index.js';
import { useRoute } from "vue-router";
import { t } from "src/core/index.js";;
import { api_account, api_common } from "src/api/";
import { get_file_path } from "src/core/file-path/file-path.js";
import { pre_load_iframe } from "src/core/pre-load";

/**组件*/
import LayoutLeft from "./layout-left.vue";
import layoutHeader from "project_path/src/layouts/layout-header.vue"; //报错

// import moveVideo from '../components/video/video.vue'//报错
// const search=defineAsyncComponent(() => import( "../pages/search/search.vue")),
// const matchDetails = defineAsyncComponent(() =>
//   import("../pages/match-details/match-details.vue")
// );

console.error(compute_css_variables({ category: 'component', module: 'bet-record' }));
;
const route = useRoute();

const thumb_style = {
  right: "3px",
  borderRadius: "3px",
  backgroundColor: "#000000",
  width: "6px",
  opacity: 0.3,
};
let new_version = false; // 是否是最新版本
const data_ref = {
  // 上一次打开弹窗的时间
  showActivityTime: sessionStorage.getItem("showActivityTime"),
  allowClick: false, // 弹窗图片是否可以点击跳转
  urlType: "", // 0：无连接，1：内部导航，2：弹窗连接
  special_img_url: "", // 专题页图片url
  special_host_url: "", // 专题页判断跳转到哪个链接
  special_url_type: "", // 专题页0：无连接，1：内部导航，2：弹窗连接
  bet_loadding: false,
  dragging: false, // 拖拽中
  is_expand: true, // 是否展开
  bet_this: Object.create({}),
  max_height: document.body.clientHeight - 100,
  content_height: 0,
  single_height: 278,
  mix_height: 100,
  offset_height: null,
  is_expand2: true,
  bet_flag: false, // 是否投注
  pre_odds: "EU",
  bet_show: false,
  x: null, // x投注框轴坐标
  y: null, // y投注框轴坐标
  h: null,
  max_left: document.body.clientWidth - 315, // 距离左侧最大距离
  max_top: document.body.clientHeight - 568,
  height: "auto",
  axis: "both", // axis:控制可拖动的轴 有x,y,both三个值 both可以支持横向和纵向拖动
  drag_cancel: "", //是否取消拖拽
  hostUrl: "act", // 首页弹窗配置标识符，多活动并存时用来判断跳转到哪个链接
  hasBonusType3: false, // 是否有小红点提示
  activityIds: "", // 已开启的活动 id
  showBannerTimer: null, // 展示运营位弹窗的 setTimeout
  // 通过链接参数打开活动页面的时间
  openActivityPageTime: null,
  userBannerTimer: t("common.auto_close").replace("%s", 5),
  isMaintaining: null, // 活动是否处于维护状态
  // 菜单是否创建
  menu_obj_created: false,
  // 屏幕宽度
  screen_width: "",
  // 页面首次加载loading
  dataLoading: true,
  // 是否显示合并信息
  show_merge_info: false,
  // 是否是首次加载页面
  isFirstLoadPage: true,
};

//一些定时器保存
const timeOutIds = {}; // 存储 setTimeOut id 方便统一销毁
// 延迟 重置轮询时间
let init_reset_time,
  // 菜单初始化 因为菜单是去轮询的 so
  menu_init_time,
  activityUpdateTimer, // 活动入口状态提示更新定时器
  activity_timer;

//----------------------dom开始节点ref----------------------
const page_left = ref(null);
const resizable = ref(null);
const resizeable_header = ref(null);
const bet_scroll_area = ref(null);
const embedded_single = ref(null);
const embedded_mix = ref(null);
const bet_mode_zone = ref(null);
const resizeable_footer = ref(null);
//----------------------dom结束----------------------

//----------------------计算属性开始----------------------
const {
  userReducer,
  menuReducer,
  layoutReducer,
  globalReducer,
  betInfoReducer,
  detailsReducer,
  langReducer,
} = store.getState();

const computed_data = reactive({
  is_invalid: userReducer.is_invalid,
  // 搜索状态
  get_search_status: detailsReducer.search_isShow,
  // 获取用户信息
  get_user: userReducer.user_info,
  // 当前语言
  lang: langReducer.lang,

  vx_layout_left_show: layoutReducer.layout_left_show,
  cur_odd: globalReducer.odds.cur_odds,
  left_menu_toggle: layoutReducer.left_menu_toggle,
  // 当前菜单类型
  vx_cur_menu_type: menuReducer.cur_menu_type,
  vx_main_menu_toggle: menuReducer.main_menu_toggle,
  // 获取项目主题
  // theme:userReducer.theme,
  // 全局点击事件
  get_global_click: globalReducer.global_click,
  layout_size: layoutReducer.layout_size,
  menu_collapse_status: menuReducer.menu_collapse_status,
  //收起右侧详情 展开多列玩法
  get_unfold_multi_column: globalReducer.is_unfold_multi_column,
  //全局开关
  get_global_switch: globalReducer.global_switch,
});

const unsubscribe = store.subscribe(() => {
  const {
    userReducer,
    menuReducer,
    layoutReducer,
    globalReducer,
    detailsReducer,
    langReducer,
  } = store.getState();
  console.log("update store");
  computed_data.is_invalid = userReducer.is_invalid;
  // 搜索状态
  computed_data.get_search_status = detailsReducer.search_isShow;
  // 获取用户信息
  computed_data.get_user = userReducer.user;
  // 当前语言
  computed_data.lang = langReducer.lang;
  computed_data.vx_layout_left_show = layoutReducer.layout_left_show;
  computed_data.cur_odd = globalReducer.odds.cur_odds;
  computed_data.left_menu_toggle = layoutReducer.left_menu_toggle;
  // 当前菜单类型
  computed_data.vx_cur_menu_type = menuReducer.cur_menu_type;
  computed_data.vx_main_menu_toggle = menuReducer.main_menu_toggle;
  // 获取项目主题
  // theme:userReducer.theme,
  // 全局点击事件
  computed_data.get_global_click = globalReducer.global_click;
  computed_data.layout_size = layoutReducer.layout_size;
  computed_data.menu_collapse_status = menuReducer.menu_collapse_status;
  //收起右侧详情 展开多列玩法
  computed_data.get_unfold_multi_column = globalReducer.is_unfold_multi_column;
  //全局开关
  computed_data.get_global_switch = globalReducer.global_switch;
});


//是不是可以显示内嵌框
const show_bet_zone = computed(() => {
  //是不是可以显示内嵌框
  if (
    !BetData.is_virtual_bet &&
    ((BetData.is_bet_single &&
    BetData.bet_single_list.length > 0) ||
      (!BetData.is_bet_single && BetData.bet_list.length > 0))
  ) {
    return true;
  } else if (
    BetData.is_virtual_bet &&
    BetData.virtual_bet_list.length > 0
  ) {
    return true;
  }
  return false;
});

// 拖拽区域的样式  计算属性用于计算拖拽位置
const draggable_style = computed(() => {
  return {
    transform: `translate(${x.value}px, ${y.value}px)`,
    left: null,
    top: 0,
    bottom: null,
  };
});

// 小于 1280 时的底部横向滚动条
const scroll_style = {
  borderRadius: "3px",
  height: "8px",
  opacity: 1,
  zIndex: 99999,
  cursor: "pointer",
};
// 屏蔽视频移动组件(视频回播功能)
const show_move_video = computed(() => {
  return (
    computed_data.get_user?.merchantEventSwitchVO &&
    computed_data.get_user?.merchantEventSwitchVO.eventSwitch
  );
});
//----------------------计算属性结束----------------------

//----------------------methods开始----------------------

/**
 *映射store内部的方法
 */
const methods_map_store = [
 
  "SET_INIT_ODD",
  "SET_INIT_MATCH_SORT",
  "set_cur_odd",
  // 左侧菜单展开折叠状态
  "set_left_menu_toggle",
  // 保存页面布局的宽高等数据
  "SET_LAYOUT_SIZE",
  // 保存当前路由信息
  "set_layout_cur_page",
  "set_show_filter_popup",
  "set_show_record",
  "set_match_details_params",
  "set_main_menu_toggle",
  "SET_LAYOUT_LIST_SIZE",
  // 保存列表的宽度
  "SET_LAYOUT_LIST_WIDTH",
 
  // 设置左侧布局
  "set_layout_left_show",
  //设置多列玩法状态
  "set_unfold_multi_column",
].reduce((obj, type) => {
  obj[type] = (data) => {
    store.dispatch({ type, data });
  };
  return obj;
}, {});
 
/**
 * @Description 列表滚动
 * @param {undefined} undefined
 */
function list_on_scroll(obj) {
  let scroll_top = obj ? obj.position : matchlist.scroll_top;
  if (scroll_top === 0) {
    return;
  }

  // 是否发送过诸葛事件
  let is_send_today_football_zhuge = sessionStorage.getItem(
    "is_send_today_football_zhuge"
  );
  let is_send_today_basketball_zhuge = sessionStorage.getItem(
    "is_send_today_basketball_zhuge"
  );

  // 两个诸葛事件都发送过 销毁事件绑定
  if (is_send_today_football_zhuge && is_send_today_basketball_zhuge) {
    remove_mitt_list.pop()();
    remove_mitt_list.pop()();
  }

  // 发送今日足球诸葛事件
  if (!is_send_today_football_zhuge && scroll_top > 100 && !user_is_handle) {
    // utils.send_zhuge_event("PC_今日_足球_默认页面滚动超100");
    sessionStorage.setItem("is_send_today_football_zhuge", 1);
    user_is_handle = true;
  }
}

 

/**
 * 投注框转开和折叠
 */
function toggle_handle() {
  data_ref.is_expand = !data_ref.is_expand;
  if (data_ref.is_expand) {
    //展开则需要重新计算一遍投注框高度
    computed_bet_height();
  }
  data_ref.is_expand2 = data_ref.is_expand;
}
/**
 * 展开单关投注框
 */
function open_single_bet() {
  data_ref.is_expand = true;
  data_ref.is_expand2 = data_ref.is_expand;
  //展开则需要重新计算一遍投注框高度
  computed_bet_height();
}
/**
 * @description 设置滚动数据
 * @param  {string} type  类型
 * @param  {oject} _this  上下文对象
 * @return {undefined} undefined
 */
function set_scroll_this({ type, _this }) {
  data_ref[type] = _this;
}
/**
 * @description: 开启投注确认中的loadding效果
 */
let bet_is_handle_status_timer;
function open_menu_loadding() {
  data_ref.data_ref = true;
  // 投注正在处理中
  if (BetData.is_virtual_bet) {
    true;
    methods_map_store["set_is_virtual_handle"];
  } else if (BetData.is_bet_single) {
    methods_map_store["set_is_single_handle"](true);
  } else {
    methods_map_store["set_is_handle"](true);
  }

  useMittEmit(MITT_TYPES.IS_MENU_LOADDING, data_ref.data_ref);
  // 兜底25s后初始化投注处理中状态
  clearTimeout(bet_is_handle_status_timer);
  bet_is_handle_status_timer = setTimeout(() => {
    // 投注中状态初始化
    if (BetData.is_virtual_bet) {
      methods_map_store["set_is_virtual_handle"](false);
    } else if (BetData.is_bet_single) {
      methods_map_store["set_is_single_handle"](false);
    } else {
      methods_map_store["set_is_handle"](false);
    }
  }, 25000);
}
/**
 * @description: 关闭投注确认中的loadding效果
 */
function close_menu_loadding() {
  data_ref.data_ref = false;
  // 取消投注处理中
  if (BetData.is_virtual_bet) {
    methods_map_store["set_is_virtual_handle"](false);
  } else if (BetData.is_bet_single) {
    methods_map_store["set_is_single_handle"](false);
  } else {
    methods_map_store["set_is_handle"](false);
  }
  useMittEmit(MITT_TYPES.IS_MENU_LOADDING, data_ref.data_ref);
}


/**
 * 计算投注框的高度
 */
function computed_bet_height() {
  if (computed_data.left_menu_toggle) return;
  if (
    (!BetData.is_virtual_bet && BetData.is_bet_single) ||
    (BetData.is_virtual_bet && BetData.virtual_bet_list.length == 1)
  ) {
    if (timeOutIds.timer3) {
      clearTimeout(timeOutIds.timer3);
    }
    timeOutIds.timer3 = setTimeout(() => {
      // 内嵌组件获取
      if (embedded_single.value) {
        let left_height = 0;
        if (page_left.vallue) {
          left_height = page_left.vallue.clientHeight;
        }
        let embedded_merge;
        let header = resizeable - headervalue;
        let footer = resizeable_footer.value;
        data_ref.max_height =
          left_height - header.$el.clientHeight - footer.$el.clientHeight;
        // 若为合并模式
        if (BetData.is_bet_merge) {
          // 获取投注区域
          embedded_merge = bet_mode_zone.value;
        }
        let merge_height = 0;
        if (embedded_merge) {
          merge_height = embedded_merge.clientHeight;
        } else if (!BetData.is_virtual_bet && !new_menu.is_esports()) {
          merge_height = 35;
        }
        // 内容计算 内嵌单关高度 + 合并区域的高度
        data_ref.content_height =
          embedded_single.value.clientHeight + merge_height + 10;
        if (data_ref.content_height) {
          data_ref.single_height = data_ref.content_height;
        } else {
          data_ref.content_height = BetData.is_virtual_bet
            ? data_ref.single_height + 24
            : data_ref.single_height;
        }
        if (
          BetData.bet_list.length > 1 &&
          embedded_single.value.$data.view_ctr_obj.order_confirm_complete ==
            0 &&
          !BetData.is_bet_single
        ) {
          data_ref.content_height += 90;
        }
        nextTick(() => {
          let bet_scroll_area = bet_scroll_area.value;
          if (bet_scroll_area) {
            bet_scroll_area.$el.style.height = `${data_ref.content_height}px`;
          }
        });
      }
    }, 0);
  } else {
    if (timeOutIds.timer4) {
      clearTimeout(timeOutIds.timer4);
    }
    timeOutIds.timer4 = setTimeout(() => {
      let left_height = 0;
      if (page_left.value) {
        left_height = page_left.value.clientHeight;
      }
      if (embedded_mix.value) {
        let header = resizeable_header.value;
        let footer = resizeable_footer.value;
        data_ref.max_height =
          left_height - header.$el.clientHeight - footer.$el.clientHeight;
        data_ref.content_height = embedded_mix.value.clientHeight;

        if (
          BetData.bet_list.length > 1 &&
          embedded_mix.value.$data.view_ctr_obj.order_confirm_complete == 0
        ) {
          data_ref.content_height += 90;
        }
        if (data_ref.max_height < data_ref.content_height) {
          data_ref.content_height = data_ref.max_height;
        }
      }
    }, 0);
  }
}
/**
 * 拖拽完成时间 停止拖拽
 */
function stop_handle() {
  data_ref.dragging = false;
}
/**
 * 拖拽中调用
 */
function move_handle(x, y) {
  // 如果x轴为发生变化触发此事件说明是点击操作
  if (data_ref.x == x || data_ref.y == y) return;
  // 拖拽在左侧最大距离后停止拖拽
  if (x > data_ref.max_left) {
    data_ref.x = data_ref.max_left;
  } else if (x < 0) {
    // 拖拽到右侧最小距离停止拖拽
    data_ref.x = 0;
  } else {
    data_ref.x = Math.round(x);
  }

  if (y > data_ref.max_top) {
    data_ref.y = data_ref.max_top;
  } else if (y < 0) {
    data_ref.y = 0;
  } else {
    data_ref.y = Math.round(y);
  }

  // 记录拖拽的位置
  localStorage.setItem("bet_position", JSON.stringify({ x: x, y: y }));
  data_ref.dragging = true; // 允许拖拽
}
/**
 * 检查是否正在拖拽
 */
function check_drag() {
  return !data_ref.dragging;
}
function init_pos() {
  data_ref.x = document.body.clientWidth / 2 + 150;
  data_ref.y = document.body.clientHeight / 2 - 280;
}
/**
 * 初始化投注框的位置
 */
function init_bet_postion() {
  // 体育投注菜单部分
  let pos = localStorage.getItem("bet_position");
  pos = JSON.parse(pos);
  if (!pos) {
    data_ref.x = document.body.clientWidth / 2 + 150;
    data_ref.y = document.body.clientHeight / 2 - 280;
  } else {
    data_ref.x = pos.x;
    data_ref.y = pos.y;
  }
}
// 检查是否有可领取奖券
function getActivityLists({ id = 1, type }) {
  // 如果是首次加载页面并且由用户信息接口发起，则不发起请求
  if (type == "update_bonus" && data_ref.isFirstLoadPage) {
    data_ref.isFirstLoadPage = false;
    return;
  }
  let isMaintaining = get(computed_data.get_user, "maintaining");
  // 如果活动处于维护状态，直接去掉小红点
  if (isMaintaining == true) {
    if (data_ref.hasBonusType3 == true) {
      data_ref.hasBonusType3 = false;
    }
    return;
  }
  // 判断是否有活动
  let activityList = get(computed_data.get_user, "activityList");
  // 多语言屏蔽活动入口
  if (activityList && activityList.length > 0 && computed_data.lang == "zh") {
    let param = new FormData();
    // 检测两个活动是否存在以及活动状态不能是未开始和已结束
    let daily =
      activityList.find(
        (item) => item.activityId == "10007" && item.period == 2
      ) || null;
    let growup =
      activityList.find(
        (item) => item.activityId == "10008" && item.period == 2
      ) || null;
    if (!daily && !growup) {
      return;
    }
    // 1 每日任务 2成长任务
    param.append("actId", id);
    api_activity.get_activity_list_details(param).then((res) => {
      let code = get(res, "data.code");
      let data = get(res, "data.data");
      if (code == 200 && data && data.length > 0) {
        // 判断是否有可领取奖券的任务
        data_ref.hasBonusType3 =
          data.find((item) => item.bonusType == 3) || false;
        if (!data_ref.hasBonusType3 && id == 1) {
          getActivityLists({ id: 2, type: "2nd" });
        }
      }
    });
  }
}
/**
 * 控制活动入口可领取提示的显示和隐藏
 * @param e window.opener 发送的消息对象
 */
function cancelDot(e) {
  if (get(e, "data.name") == "cancelActivityDot") {
    // dotHide 1 隐藏 否则显示
    if (e.data.dotHide == 1) {
      data_ref.hasBonusType3 = false;
    } else {
      data_ref.hasBonusType3 = true;
    }
  } else if (get(e, "data.name") == "close_win") {
    let obj = get(e, "data.obj") || {};
    // utils.send_zhuge_event(obj.name, obj.info);
  }
}
/**
 * 检查当前代码是不是最新版本
 */
function newVersion() {
  new_version = true;
}

// 活动入口小红点定时拉取
function activityTimer() {
  clearInterval(activityUpdateTimer);
  // 每隔15分钟拉取一次接口更新活动入口状态
  activityUpdateTimer = setInterval(() => {
    getActivityLists({ id: 1, type: "setInterval" });
  }, 900000);
}

/**
 * 菜单状态切换
 */
function on_main_menu_toggle() {
  if (data_ref.bet_loadding) {
    return;
  }
  let cur =
    computed_data.vx_main_menu_toggle == "mini" ? "mini-normal" : "mini";
  methods_map_store["set_main_menu_toggle"](cur);
  methods_map_store["set_left_menu_toggle"](
    computed_data.vx_main_menu_toggle != "mini"
  );
  update_bet_data();
}
/**
 * @description: 开启投注的loadding效果
 */
function is_menu_loadding(data) {
  data_ref.data_ref = data;
}
/**
 * @Description 浏览器窗口大小改变
 * @param {undefined} undefined
 */
function resize() {
  let is_iframe = utils.is_iframe;
  // 主内容最小宽度
  let main_min_width = 1440;
  // 浏览器宽度
  let inner_width = window.innerWidth;
  // 浏览器高度
  let inner_height = window.innerHeight;
  // if(this.route.name === 'video'){
  //    inner_height = Math.max(inner_height,712)
  // }
  // 如果浏览器小于主内容最小宽度  减去底部滚动条高度
  if (inner_width < main_min_width) {
    inner_height -= 14;
    init_pos();
  }
  // 主内容宽度
  let main_width = Math.max(inner_width, main_min_width);
  // 左侧菜单宽度
  let left_width = 234;
  // 右侧区域宽度
  let right_width = parseInt(main_width * 0.3);
  if (is_iframe) {
    left_width = 230;
    right_width = 390;
  }
  //展开多列玩法
  // console.warn('right_width = 0')
  // console.warn(computed_data.get_unfold_multi_column)
  // console.warn(window.new_menu.set_multi_column())
  // console.warn(['search','home'].includes(this.route.name))
  if (
    computed_data.get_unfold_multi_column &&
    new_menu.is_multi_column.value &&
    ["search", "home"].includes(route.name)
  ) {
    // console.warn('right_width-赋值为0')
    right_width = 0;
  }
  // 中间区域宽度
  let center_width = parseInt(main_width - left_width - right_width);
  // 头部高度
  let header_height = utils.is_iframe
    ? computed_data.menu_collapse_status
      ? 36
      : 86
    : 96;
  // 主内容高度（菜单、列表、详情、右侧）
  let content_height = inner_height - header_height - 4;
  // 屏幕大小类
  data_ref.screen_width = main_width < 1440 ? "screen-medium" : "";

  // 设置菜单状态
  let main_menu_toggle = "";
  if (main_width > 1440) {
    main_menu_toggle = "normal";
  } else {
    // 已选择了，则用之前的选择
    if (["mini-normal", "mini"].includes(computed_data.vx_main_menu_toggle)) {
      main_menu_toggle = computed_data.vx_main_menu_toggle;
    } else {
      // 判断地址栏是否收起菜单
      main_menu_toggle = route.query.toggle ? "mini" : "mini-normal";
    }
  }
  // mini菜单状态
  if (main_menu_toggle == "mini") {
    left_width = 64;
    center_width = parseInt(main_width - left_width - right_width);
  }
  let list_content_width = center_width;
  // 列表实际内容宽度，除去边框间距等等
  if (is_iframe) {
    list_content_width -= 10;
  } else {
    list_content_width -= 14;
  }
  // match_list_tpl_size.set_template_width(list_content_width);
  methods_map_store["SET_LAYOUT_SIZE"]({
    inner_width,
    inner_height,
    main_width,
    left_width,
    right_width,
    center_width,
    list_content_width,
    header_height,
    content_height,
  });
  methods_map_store["SET_LAYOUT_LIST_SIZE"]({
    width: main_width,
    height: content_height,
  });
  methods_map_store["SET_LAYOUT_LIST_WIDTH"](center_width);
  methods_map_store["set_main_menu_toggle"](main_menu_toggle);
  methods_map_store["set_left_menu_toggle"](main_menu_toggle != "mini");
}
/**
 * @Description 关闭页面首次加载loading
 * @param {undefined} undefined
 */
function closeLoading(state) {
  if (timeOutIds.data_loading_timer) {
    clearTimeout(timeOutIds.data_loading_timer);
  }
  timeOutIds.data_loading_timer = setTimeout(() => {
    data_ref.dataLoading = state;
  }, 600);
}
function toggle_merge() {
  methods_map_store["set_is_bet_merge"](!BetData.is_bet_merge);

  if (BetData.is_bet_merge) {
    // utils.send_zhuge_event("PC_合并");
  }
  let len = BetData.bet_single_list.length;
  // 取消合并
  if (!BetData.is_bet_merge && len > 1) {
    let id = BetData.bet_single_list[len - 1];
    let bet_single_obj = cloneDeep(get(BetData.bet_single_obj, `${id}`));
    BetData.bet_single_clear();
    BetData.set_bet_single_list([id]);
    bet_single_obj.key = id;
    // mode为清除原有的添加最新的
    bet_single_obj.mode = "clear_and_add";
    BetData.bet_single_obj_attr(bet_single_obj);
  }
}
function update_bet_data() {
  /* ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...
      type:0表示普通赛事(默认值)，1虚拟赛事 */
  let type = BetData.is_virtual_bet ? 1 : 0;
  let ids = [],
    bet_type;
  if (BetData.is_virtual_bet) {
    bet_type = "virtual_bet_obj";
  } else if (BetData.is_bet_single) {
    bet_type = "bet_single_obj";
  } else {
    bet_type = "bet_obj";
  }
  for (let obj of Object.values(BetData[bet_type])) {
    let match_id = get(obj, "cs.match_id", "");
    let handicap_id = get(obj, "cs.handicap_id", "");
    let play_id = get(obj, "cs.play_id", "");
    let oid = get(obj, "cs.oid", "");
    if (
      !isEmpty(match_id) &&
      !isEmpty(handicap_id) &&
      !isEmpty(play_id) &&
      !isEmpty(oid)
    ) {
      ids.push(`${match_id}-${play_id}-${handicap_id}-${oid}`);
    }
  }
  if (!isEmpty(ids)) {
    if (new_menu.is_esports()) {
      type = 2;
    }
    let params = {
      ids: ids.join(","),
      type,
    };
    return;
    api_details
      .get_bet_olds(params)
      .then((res) => {
        let data = get(res, "data.data");
        if (isArray(data) && data.length > 0) {
          if (BetData.is_virtual_bet) {
            this.virtual_common.update_bet_item_info( data);
          } else {
            yabo_common.update_bet_item_info( data);
          }
          if (BetData.is_bet_single) {
            useMittEmit(MITT_TYPES[EMIT_INIT_BET_LIST_ITEM_CMD]);
          } else {
            useMittEmit(MITT_TYPES[EMIT_UPDATE_HOME_AWAY_CMD]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
//----------------------方法结束----------------------

//----------------------created开始----------------------
methods_map_store["set_is_virtual_handle"](true);
methods_map_store["set_is_single_handle"](false);
methods_map_store["set_is_handle"](false);
new_menu.get_new_data();
base_data.get_new_data();
new_menu.show_bet_zone = false;
// 用户是否操作过页面
let user_is_handle = false;
matchlist.init_loading_time_record();
// 无 token 时直接关闭loading
if (window.vue && !window.vue.get_user) {
  data_ref.dataLoading = false;
}
resize();
//获取赔率转换表数据
//this.get_odds_conversion()
methods_map_store["SET_INIT_ODD"]();
methods_map_store["SET_INIT_MATCH_SORT"]();
const remove_mitt_list = [
  // 接收开启loadding指令
  useMittOn(MITT_TYPES.EMIT_OPEN_MENU_LOADDING_CMD, open_menu_loadding).off,
  // 接收关闭loadding指令
  useMittOn(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD, close_menu_loadding).off,

  //计算投注框高度
  useMittOn(MITT_TYPES.EMIT_COMPUTED_BET_HEIGHT_CMD, computed_bet_height).off,
  //获取投注数据(内嵌mini切换或者语言发生变化时调用)

  useMittOn(MITT_TYPES.EMIT_UPDATE_BET_DATA_CMD, update_bet_data).off,

  // // 左侧菜单初始化完成，顶部导航增加虚拟体育和电竞
  useMittOn(MITT_TYPES.MENU_INIT_DONE, menu_init_done).off,
  useMittOn(MITT_TYPES.IS_MENU_LOADDING, is_menu_loadding).off,
  useMittOn(
    MITT_TYPES.SET_PRE_VIDEO_SRC,
    function set_video_src({ video_src, animation_src }) {
      /**
       * @Description 设置视频预加载地址
       * @param {undefined} undefined
       */
      pre_load_iframe(video_src);
      pre_load_iframe(animation_src);
    }
  ).off,
  useMittOn(MITT_TYPES.CLOSE_HOME_LOADING, closeLoading).off,

  // /在活动窗口内更新首页小红点
  useEventListener({
    name: "message",
    listener: cancelDot,
  }),
  useEventListener({
    name: "resize",
    listener: resize,
  }),
  // // 更新活动入口小红点
  useMittOn(MITT_TYPES.UPDATE_BONUS, getActivityLists).off,
  // // 版本号检查状态通知
  useMittOn(MITT_TYPES.REQUEST_USER_BANNER, newVersion).off,
  // // 重新计算投注框高度
  useMittOn(MITT_TYPES.TOGGLE_HANDLE, toggle_handle).off,

  // 两个诸葛事件事件绑定 请放在最后二个 最后二个 最后二个
  useMittOn(MITT_TYPES.EMIT_LIST_ON_SCROLL, list_on_scroll).off,
  useMittOn(MITT_TYPES.RIGHT_DETAILS_ON_SCROLL, list_on_scroll).off,
];

// // 保存首页路径，活动页需要用到
if (route.path == "/home") {
  localStorage.setItem("home_url", window.location.origin);
}
// // 获取活动维护状态
data_ref.isMaintaining = get(computed_data.get_user, "maintaining");
const remove_mousedown = useEventListener({
  name: "mousedown",
  listener: function () {
    /**
     * @Description 全局点击事件
     * @param {undefined} undefined
     */
    user_is_handle = true;
    remove_mousedown();
    // sessionStorage.setItem('is_send_today_football_zhuge2',1)
  },
});
// // 重置 vuex 存储
// vx_set_show_record(false);
methods_map_store["set_show_filter_popup"](false);
methods_map_store["set_match_details_params"]({});
// // 进入首页
//gtag打点
// utils.gtag_view_send('PC_home', '/home')
data_ref.first_load = true;
GlobalAccessConfig();

//----------------------created结束----------------------
/*销毁组件*/
onBeforeUnmount(() => {
  unsubscribe();
  remove_mitt_list.forEach((item) => item());
  clearInterval(activityUpdateTimer);
  for (let item in timeOutIds) {
    if (item) {
      clearTimeout(timeOutIds[item]);
    }
  }
  clearTimeout(load_video_js_timer);
  clearTimeout(bet_is_handle_status_timer);
  activity_timer && clearTimeout(activity_timer);

  clearTimeout(init_reset_time);
  clearInterval(menu_init_time);
  clearInterval(base_data.clear_menu_init_time());
  clearTimeout(base_data.clear_reset_init_time());
});
/**
 * ----------------------watch开始----------------------
 */
// 投注浮层折叠状态变化时，更新相应max_top值
watch(
  () => data_ref.is_expand2,
  (v) => {
    if (v) {
      data_ref.max_top -= 521;

      const max_top = document.body.clientHeight - 568;
      if (data_ref.y > max_top) {
        data_ref.y = max_top;
      }
    } else {
      data_ref.max_top += 521;
    }
  }
);
// menu_collapse_status 内嵌版菜单折叠状态
// get_unfold_multi_column 多列玩法切换
watch(
  () => [
    computed_data.menu_collapse_status,
    computed_data.get_unfold_multi_column,
    new_menu.is_multi_column,
  ],
  () => {
    resize();
  }
);
watch(
  () => [computed_data.layout_size.inner_width],
  (width) => {
    new_menu.set_multi_column();
    if (width < 1440) {
      methods_map_store["set_unfold_multi_column"](false);
      if (computed_data.vx_main_menu_toggle != "mini" && !data_ref.first_load) {
        on_main_menu_toggle();
      }
    }
    data_ref.first_load = false;
  }
);

// // 监听路由变化 并记录到 vuex
// $route: {
//   handler(to, from) {
//     tooltip('cancel',0,0,0)
//     let _to = _.get(to, "name") || '';
//     let _from = _.get(from, "name") || '';
//     if(_to!=_from) {
//       //需要重新计算一遍投注框高度
//       this.computed_bet_height();
//     }
//     this.init_bet_postion();
//     this.resize()
//     $NewMenu.set_multi_column()
//   },
//   immediate: true
// },

watch(
  () => [
    BetData.is_bet_single, //单关
    BetData.bet_list?.length, //串关长度
    BetData.bet_single_list?.length, //单关长度
  ],
  () => {
    //计算一遍投注框高度
    computed_bet_height();
  },
  {
    immediate: true,
  }
);
// //虚拟体育

watch(
  () => BetData.virtual_bet_list.length,
  (count) => {
    if (count > 1) {
      methods_map_store["set_is_bet_single"](false);
    } else if (count == 1) {
      methods_map_store["set_is_bet_single"](true);
    }
    //需要重新计算一遍投注框高度
    computed_bet_height();
  },
  {
    immediate: true,
  }
);
watch(
  () => data_ref.bet_this.bet_flag,
  (new_) => {
    data_ref.bet_flag = new_;
    if (BetData.is_bet_single) {
      nextTick(() => {
        if (bet_scroll_area.value) {
          let embedded_merge;
          if (BetData.is_bet_merge) {
            embedded_merge = bet_mode_zone.value;
          }
          let merge_height = 0;
          if (embedded_merge) {
            merge_height = embedded_merge.clientHeight;
          } else if (!BetData.is_virtual_bet && !new_menu.is_esports()) {
            merge_height = 40;
          }
          bet_scroll_area.value.style.height = `${
            embedded_single.value.clientHeight + merge_height
          }px`;
          embedded_merge = null;
        }
      });
    } else {
      nextTick(() => {
        if (
          !new_ &&
          embedded_mix.value &&
          embedded_mix.value.$refs["bet-mix-record"]
        ) {
          data_ref.content_height =
            embedded_mix.value.$refs["bet-mix-record"].$el.clientHeight;
        } else {
          //需要重新计算一遍投注框高度
          computed_bet_height();
        }
      });
    }
  }
);

// // 左侧菜单切换状态
watch(
  () => computed_data.left_menu_toggle,
  () => {
    //   //需要重新计算一遍投注框高度
    computed_bet_height();
    init_bet_postion();
    resize();
  }
);
// //当前赔率
watch(
  () => computed_data.cur_odd,
  (new_) => {
    BaseUserInfo.assign({ userMarketPrefer: new_ }); //缓存用户盘口偏好信息
  }
);

/**
 * ----------------------watch结束----------------------
 */
</script>
<style lang="scss" scoped>
@import url(./main-layout.scss);
</style>