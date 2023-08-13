<template>
  <q-layout view="lHh Lpr lFf">
    <div class="c-main-scroll window-width window-height">
      <div
        class="main overflow-hidden relative-position"
        :class="{
          'iframe-top-collapse': computed_data.menu_collapse_status,
        }"
        :style="`width:${computed_data.layout_sizemain_width}px;`"
      >
        <!-- 搜索 -->
        <search
          v-if="computed_data.get_search_status"
          v-show="route.params.video_size != 1"
        />
        <!-- 页面头部容器-->
        <site-header
          v-show="route.params.video_size != 1"
          class="yb-layout-margin-header"
          :nav_list="data_ref.nav_list"
          :class="{ activity_bonus: data_ref.hasBonusType3 }"
          :imgUrl="data_ref.special_img_url"
          :hostUrl="data_ref.special_host_url"
          :urlType="data_ref.special_url_type"
          :hasActivity="data_ref.hasActivity"
        />

        <div
          class="c-main-content c-content-bg"
          :style="`width:${
            computed_data.layout_size.main_width
          }px  !important; height:${
            computed_data.layout_size.content_height + 4
          }px  !important;`"
        >
          <!-- 左侧 菜单区域 -->
          <div
            ref="page_left"
            v-show="route.params.video_size != 1"
            class="page-left row yb-layout-margin-menu relative-position"
            :style="`width:${computed_data.layout_sizeleft_width}px  !important; height:${computed_data.layout_size.content_height}px  !important;`"
            :class="computed_data.vx_main_menu_toggle"
          >
            <div
              class="cathectic-shade"
              v-show="data_ref.bet_loadding && computed_data.left_menu_toggle"
            >
              <div class="shade-fixed">
                <!--确认中转圈圈-->
                <div class="loading-wrap">
                  <div class="img-loading"></div>
                  <div
                    class="text-center loading-text flex items-end justify-center"
                  >
                    {{ $t("bet.bet_loading") + "..." }}
                    <!-- 内容加载中... -->
                  </div>
                </div>
              </div>
            </div>
            <!--左侧菜单mini-->
            <main-menu-mini
              v-show="computed_data.vx_main_menu_toggle == 'mini'"
            />
            <!--左侧菜单-->
            <main-menu
              v-show="
                ['normal', 'mini-normal'].includes(
                  computed_data.vx_main_menu_toggle
                )
              "
            />
          </div>

          <!-- 中间区域 -->
          <keep-alive include="matchListRouter" max="1">
            <router-view
              class="page-center"
              :class="data_ref.screen_width"
              :style="
                route.params.video_size == 1
                  ? 'position: fixed; top: 0;  bottom: 0;right: 0;  left: 0; width: 100%;height: 100%;'
                  : `width:${computed_data.layout_sizecenter_width}px  !important; height:${computed_data.layout_size.content_height}px  !important;`
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
                : `width:${computed_data.layout_sizeright_width}px  !important; height:${computed_data.layout_size.content_height}px  !important;`
            "
            v-if="computed_data.layout_sizeright_width > 0"
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

        <!-- 视频js预加载 -->
        <iframe
          v-if="data_ref.video_src"
          style="display: none"
          :src="data_ref.video_src"
        ></iframe>
        <iframe
          v-if="animation_src"
          style="display: none"
          :src="animation_src"
        ></iframe>

        <!-- toast 消息提示 -->
        <toast />
        <confirm />
        <alert />
        <!-- 押注操作相关组件 -->
        <!-- 活动弹框 -->
        <activityModel
          v-if="showActivity"
          :imgUrl="imgUrl"
          :imgShowTimer="userBannerTimer"
          :hostUrl="hostUrl"
          :urlType="urlType"
          :allowClick="allowClick"
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
            <template v-if="computed_data.is_virtual_bet">
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
                <template v-if="computed_data.is_virtual_bet">
                  <!-- 虚拟单关 -->
                  <virtual-bet-single
                    ref="embedded_single"
                    @set_scroll_this="set_scroll_this"
                    v-if="vx_get_virtual_bet_list.length == 1"
                  />
                  <!-- 虚拟串关 -->
                  <virtual-bet-mix
                    ref="embedded_mix"
                    @set_scroll_this="set_scroll_this"
                    v-if="vx_get_virtual_bet_list.length > 1"
                  />
                </template>
                <!--非虚拟体育部分-->
                <template v-else>
                  <div
                    ref="bet_mode_zone"
                    class="bet-mode-zone"
                    v-if="computed_data.vx_is_bet_single"
                  >
                    <div class="left">
                      <span>{{ $t("bet.bet_one_") }}</span>
                      <span class="bet-single-count">
                        {{ computed_data.bet_single_list.length }}
                      </span>
                    </div>
                    <div class="right">
                      <span
                        class="check-box"
                        :class="{ checked: computed_data.is_bet_merge }"
                        @click.stop="toggle_merge"
                      >
                        <check-box
                          :checked="computed_data.is_bet_merge"
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
                    v-if="computed_data.vx_is_bet_single"
                  />
                  <!--内嵌的串关-->
                  <bet-mix
                    ref="embedded_mix"
                    @set_scroll_this="set_scroll_this"
                    v-if="!computed_data.vx_is_bet_single"
                  />
                </template>
              </q-scroll-area>
              <!-- 滚动：尾部 --------------------------------->
              <!--滚动条底部-->
              <template v-if="computed_data.is_virtual_bet">
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
} from "vue";
import { get, isEmpty, cloneDeep, isArray } from "lodash";
import store from "../store/index.js";
import base_data from "src/core/utils/base-data/base-data.js";
import matchlist from "src/core/match-list-pc/match-scroll.js";
import match_list_tpl_size from "src/core/match-list/data-class-ctr/match-list-tpl-size.js";
import new_menu from "src/core/menu/menu-class-new";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt";
import { useEventListener } from "src/core/utils/event-hook";
import utils from "src/core/utils/utils.js";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { api_account, api_common } from "src/api/";
import { get_file_path } from "src/core/file-path/file-path.js";
/**组件*/
import MainMenu from "../pages/left-menu/index.vue";
// import siteHeader from "../components/site-header/site-header.vue"; //报错
// import moveVideo from '../components/video/video.vue'//报错
// const search=defineAsyncComponent(() => import( "../pages/search/search.vue")),
const matchDetails = defineAsyncComponent(() =>
  import("../pages/match-details/match-details.vue")
);

const { t } = useI18n();
const route = useRoute();
const {
  userReducer,
  menuReducer,
  layoutReducer,
  globalReducer,
  betInfoReducer,
  detailsReducer,
} = store.getState();

const data_ref = {
  nav_list: [], // 顶部导航栏数据
  upd_time_refresh_timer: null,
  showActivity: false, //活动弹框显隐
  imgUrl: "", // 弹窗图片 Url
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
  bet_this: null,
  max_height: document.body.clientHeight - 100,
  content_height: 0,
  single_height: 278,
  mix_height: 100,
  offset_height: null,
  thumb_style: {
    right: "3px",
    borderRadius: "3px",
    backgroundColor: "#000000",
    width: "6px",
    opacity: 0.3,
  },
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
  new_version: false, // 是否是最新版本
  showBannerTimer: null, // 展示运营位弹窗的 setTimeout
  // 通过链接参数打开活动页面的时间
  openActivityPageTime: null,
  userBannerTimer: t("common.auto_close").replace("%s", 5),
  isMaintaining: null, // 活动是否处于维护状态
  hasActivity: false, // 是否有活动入口
  // 菜单是否创建
  menu_obj_created: false,
  // 预加载视频地址
  video_src: "",
  // 预加载动画地址
  animation_src: "",
  // 屏幕宽度
  screen_width: "",
  // 页面首次加载loading
  dataLoading: true,
  // 是否显示合并信息
  show_merge_info: false,
  // 是否是首次加载页面
  isFirstLoadPage: true,
};
const timeOutIds = {}; // 存储 setTimeOut id 方便统一销毁
// 延迟 重置轮询时间
let init_reset_time,
  // 菜单初始化 因为菜单是去轮询的 so
  menu_init_time,
  activityUpdateTimer; // 活动入口状态提示更新定时器

//dom 节点ref
const page_left = ref(null);
const resizable = ref(null);
const resizeable_header = ref(null);
const bet_scroll_area = ref(null);
const embedded_single = ref(null);
const embedded_mix = ref(null);
const bet_mode_zone = ref(null);
const resizeable_footer = ref(null);

const computed_data = reactive({
  is_invalid: userReducer.is_invalid,
  // 搜索状态
  get_search_status: detailsReducer.search_isShow,
  // 获取用户信息
  user: userReducer.user,
  // 当前语言
  lang: userReducer.lang,
  // 单关部分 是否为串关
  vx_is_bet_single: betInfoReducer.is_bet_single,
  // 串关是否正在处理中
  is_handle: betInfoReducer.is_handle,
  // 单关是否正在处理中
  is_single_handle: betInfoReducer.is_single_handle,
  // 是否为虚拟体育投注
  is_virtual_bet: betInfoReducer.is_virtual_bet,
  // 虚拟投注是否正在进行
  is_virtual_handle: betInfoReducer.is_virtual_handle,
  // 获取虚拟投注列表
  virtual_bet_list: betInfoReducer.virtual_bet_list,
  bet_list: betInfoReducer.bet_list,
  bet_single_list: betInfoReducer.bet_single_list,
  bet_single_obj: betInfoReducer.bet_single_obj,
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
  is_bet_merge: betInfoReducer.is_bet_merge,
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
    betInfoReducer,
    detailsReducer,
  } = store.getState();
  console.log("update store");
  computed_data.is_invalid = userReducer.is_invalid;
  // 搜索状态
  computed_data.get_search_status = detailsReducer.search_isShow;
  // 获取用户信息
  computed_data.user = userReducer.user;
  // 当前语言
  computed_data.lang = userReducer.lang;
  // 单关部分 是否为串关
  computed_data.vx_is_bet_single = betInfoReducer.is_bet_single;
  // 串关是否正在处理中
  computed_data.is_handle = betInfoReducer.is_handle;
  // 单关是否正在处理中
  computed_data.is_single_handle = betInfoReducer.is_single_handle;
  // 是否为虚拟体育投注
  computed_data.is_virtual_bet = betInfoReducer.is_virtual_bet;
  // 虚拟投注是否正在进行
  computed_data.is_virtual_handle = betInfoReducer.is_virtual_handle;
  // 获取虚拟投注列表
  computed_data.virtual_bet_list = betInfoReducer.virtual_bet_list;
  computed_data.bet_list = betInfoReducer.bet_list;
  computed_data.bet_single_list = betInfoReducer.bet_single_list;
  computed_data.bet_single_obj = betInfoReducer.bet_single_obj;
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
  computed_data.is_bet_merge = betInfoReducer.is_bet_merge;
  computed_data.menu_collapse_status = menuReducer.menu_collapse_status;
  //收起右侧详情 展开多列玩法
  computed_data.get_unfold_multi_column = globalReducer.is_unfold_multi_column;
  //全局开关
  computed_data.get_global_switch = globalReducer.global_switch;
});

const thumb_style = ref({
  right: "3px",
  borderRadius: "3px",
  backgroundColor: "#000000",
  width: "6px",
  opacity: 0.3,
});
const show_bet_zone = computed(() => {
  //是不是可以显示内嵌框
  if (
    !computed_data.is_virtual_bet &&
    ((computed_data.vx_is_bet_single &&
      computed_data.bet_single_list.length > 0) ||
      (!computed_data.vx_is_bet_single && computed_data.bet_list.length > 0))
  ) {
    return true;
  } else if (
    computed_data.is_virtual_bet &&
    computed_data.virtual_bet_list.length > 0
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
    computed_data.user.merchantEventSwitchVO &&
    computed_data.user.merchantEventSwitchVO.eventSwitch
  );
});
// ...mapActions({
//       set_odds_coversion_map: "set_odds_coversion_map",
//       vx_set_init_odd: "set_init_odd",
//       vx_set_init_match_sort: "set_init_match_sort",
//       // 设置单关是否正在投注处理中
//       vx_set_is_single_handle: 'set_is_single_handle',
//       // 设置串关是否正在处理
//       vx_set_is_handle: 'set_is_handle',
//       // 虚拟投注正在处理中
//       vx_set_is_virtual_handle: "set_is_virtual_handle",
//       // 保存用户余额
//       vx_set_user_balance: "set_user_balance",
//       vx_virtual_bet_clear: "virtual_bet_clear",
//       vx_set_cur_odd: "set_cur_odd",
//       // 左侧菜单展开折叠状态
function vx_set_left_menu_toggle(data) {
  store.dispatch({ type: "set_left_menu_toggle", data });
}
//       // 保存页面布局的宽高等数据
//       vx_set_layout_size: "set_layout_size",
//       // 保存当前路由信息
//       vx_set_layout_cur_page: "set_layout_cur_page",
//       vx_set_show_filter_popup: "set_show_filter_popup",

function vx_set_show_record(data) {
  store.dispatch({ type: "set_show_record", data });
}
//       vx_set_match_details_params: "set_match_details_params",

function vx_set_main_menu_toggle(data) {
  store.dispatch({ type: "set_main_menu_toggle", data });
}

//       set_layout_list_size: "set_layout_list_size",
//       // 保存列表的宽度
function set_layout_list_width(data) {
  store.dispatch({ type: "SET_LAYOUT_LIST_WIDTH", data });
}
//       vx_set_is_bet_merge: "set_is_bet_merge",
//       vx_set_is_bet_single: 'set_is_bet_single',
//       //设置全局开关
//       set_global_switch: 'set_global_switch',
function set_global_switch(data) {
  store.dispatch({ type: "set_global_switch", data });
}
//       // 设置左侧布局
//       vx_set_layout_left_show: "set_layout_left_show",
//       //设置多列玩法状态
//       set_unfold_multi_column:"set_unfold_multi_column"
//     }),
/**
 * @Description 获取全局配置开关
 * @param {undefined} undefined
 */
function get_access_config() {
  api_common
    .get_access_config()
    .then((res) => {
      let data = get(res, "data.data", {});
      if (!data) return;
      let {
        //热门推荐
        hotRecommend: hot_recommend = true,
        //统计
        statisticsSwitch: statistics_switch = true,
        //收藏
        collectSwitch: collect_switch = true,
        //近期
        recentSwitch: recent_switch = true,
        //活动
        activitySwitch: activity_switch = true,
        //搜索
        searchSwitch: search_switch = true,
        //联赛筛选
        filterSwitch: filter_switch = true,
        //盘口数量
        handicapNum: handicap_num = true,
        //热门赛事
        hotMatchNum: hot_match_num = true,
        //排序
        sortCut: sort_cut = true,
        //滚球全部
        playAllShow: play_all_show = true,
        //多列
        multiColumn: multi_column = true,
      } = data;
      set_global_switch({
        hot_recommend,
        statistics_switch,
        collect_switch,
        recent_switch,
        activity_switch,
        search_switch,
        filter_switch,
        handicap_num,
        hot_match_num,
        sort_cut,
        play_all_show,
        multi_column,
      });
    })
    .catch((err) => console.error(err));
}
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
 * @description 赔率转换
 * @return {undefined} undefined
 */
function get_odds_conversion() {
  api_common.get_fetch_odds_conversion().then((res) => {
    let code = get(res, "data.code") || "";
    if (code == 200) {
      let data = get(res, "data.data") || "";

      this.set_odds_coversion_map(data);
    }
  });
}
/**
 * @description 设置顶部菜单
 * @param {number} type  类型(null-自然触发，1-导航栏二次触发，2-切换语言)
 */
function init_site_header(type = null) {
  let nav_list = [
    { id: 1, tab_name: t("common.sports_betting"), path: "/home" }, //体育投注
    {
      id: 2,
      tab_name: t("common.note_single_history"),
      path: "/bet_record",
      _blank: true,
    }, //注单历史
    // { id: 8, tab_name: t("common.e_sports"), path: "" }, //电子竞技
    //{ id: 3, tab_name: t("common.winning_champions"), path: "" }, //优胜冠军
    {
      id: 4,
      tab_name: t("common.amidithion"),
      path: "/match_results",
      _blank: true,
    }, //赛果
    // { id: 5, tab_name: t("common.score_center"), path: "" }, //比分中心
    // { id: 6, tab_name: t("common.statistic_analysis"), path: `${details.signal_url}/kaihongman/${src_lang}`,_blank:true }, //统计分析
    {
      id: 7,
      tab_name: t("common.sports_betting_rules"),
      path: "/rule",
      _blank: true,
    }, //体育竞猜规则
  ];
  // 判断是否有活动
  let activityList = get(computed_data.user, "activityList");
  // 多语言屏蔽活动入口
  if (
    activityList &&
    activityList.length > 0 &&
    computed_data.lang == "zh" &&
    computed_data.get_global_switch.activity_switch
  ) {
    data_ref.hasActivity = true;
    // 向顶部导航栏添加活动入口
    let tab = {
      id: 9,
      tab_name: "任务中心",
      img_src: "",
      class: "activity_center animate-activity-entry activity_dot_bonus",
      path: "/activity",
      _blank: true,
    };
    // 获取活动入口的图片
    let imgUrl = activityList.find((item) => item.pcUrl != "");
    if (imgUrl) {
      imgUrl = imgUrl.pcUrl;
    }
    imgUrl = get_file_path(imgUrl);
    // 活动入口的图片，如果接口未返回就用默认图片
    tab.img_src =
      imgUrl || require("public/image/activity_imgs/imgs/gift_package.png");
    nav_list.push(tab);
    activityList.forEach((item) => {
      data_ref.activityIds += item.activityId + ",";
    });
    activityTimer();
    setTimeout(() => getActivityLists({ id: 1, type: "init_nav" }), 1000);
  }
  if (type != 2) {
    // 运营位专题页
    special_page();
  }

  // 运营位弹窗,如果当前是最新版本就直接展示弹窗，如果不是，就延迟几秒再展示
  if (type == null) {
    // type 为 null 是自然触发，如果 == 1就是导航栏二次触发，不要更新这里
    if (data_ref.new_version) {
      timeOutIds.timer2 = setTimeout(() => {
        activity_dialog();
      }, 3000);
    } else {
      if (timeOutIds.timer2) {
        clearTimeout(timeOutIds.timer2);
      }
      timeOutIds.timer2 = setTimeout(() => {
        activity_dialog();
      }, 5000);
    }
  }
  data_ref.nav_list = nav_list;
  useMittEmit(MITT_TYPES["close_home_loading"], false);

  // 菜单初始化 因为菜单是去轮询的 so
  // 因为设置菜单是500s
  set_menu_init_time(600);

  init_reset_time = setTimeout(() => {
    // 本身商户的设置有缓存 所以频率太快
    set_menu_init_time(5000);
    clearTimeout(init_reset_time);
  }, 2000);
}
/**
 * 定时请求菜单
 * */
function set_menu_init_time(number) {
  clearInterval(menu_init_time);
  // 菜单初始化 因为菜单是去轮询的
  menu_init_time = setInterval(() => {
    menu_init_done();
  }, number);
}
/***
 * 运营位活动弹窗
 */
function activity_dialog() {
  let token = get(computed_data.user, "token");
  api_account.get_BannersUrl({ type: 5, token }).then((res) => {
    let code = get(res, "data.code");
    let data = get(res, "data.data");
    if (code == 200) {
      let isShow = false;
      if (data && data.length > 0) {
        data.forEach((item) => {
          if (item.tType && item.tType == 5) {
            // 去掉一个自然日展示一次的判断，有值就展示
            if (data_ref.showActivityTime) {
              // 判断日期如果不在同一天就展示弹窗
              if (
                new Date(data_ref.showActivityTime).getDate() !==
                new Date().getDate()
              ) {
                isShow = true;
              }
            } else {
              isShow = true;
              sessionStorage.setItem("showActivityTime", new Date().getTime());
            }
            // 获取图片地址
            data_ref.imgUrl = get_file_path(item.imgUrl);
            data_ref.hostUrl = item.hostUrl;
            data_ref.urlType = item.urlType;
            // 是否允许点击跳转 ayx_act 爱游戏  act1 乐鱼
            data_ref.allowClick =
              ["act", "zr", "ayx_act", "act1"].includes(item.hostUrl) ||
              item.hostUrl != "";
          }
        });
      } else {
        isShow = false;
      }
      data_ref.showActivity = isShow;
      if (data_ref.showActivity) {
        // 5秒后自动消失
        let time = 5;
        data_ref.userBannerTimer = t("common.auto_close").replace("%s", time);
        let timer = setInterval(() => {
          time--;
          data_ref.userBannerTimer = t("common.auto_close").replace("%s", time);
          if (time == 0) {
            data_ref.showActivity = false;
            clearInterval(timer);
          }
        }, 1000);
      }
    }
  });
}
/***
 * 运营位专题页
 */
function special_page() {
  let token = get(computed_data.user, "token");
  api_account.get_BannersUrl({ type: 7, token }).then((res) => {
    let code = get(res, "data.code");
    let data = get(res, "data.data");
    if (code == 200) {
      if (data && data.length > 0) {
        data.forEach((item) => {
          if (item.tType && item.tType == 7) {
            // 获取图片地址
            data_ref.special_img_url = get_file_path(item.imgUrl);
            data_ref.special_host_url = item.hostUrl;
            data_ref.special_url_type = item.urlType;
          }
        });
      }
    }
  });
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
  this[type] = _this;
}
/**
 * @description: 开启投注确认中的loadding效果
 */
let bet_is_handle_status_timer;
function open_menu_loadding() {
  data_ref.data_ref = true;
  // 投注正在处理中
  if (computed_data.is_virtual_bet) {
    vx_set_is_virtual_handle(true);
  } else if (computed_data.vx_is_bet_single) {
    vx_set_is_single_handle(true);
  } else {
    vx_set_is_handle(true);
  }

  useMittEmit(MITT_TYPES.IS_MENU_LOADDING, data_ref.data_ref);
  // 兜底25s后初始化投注处理中状态
  clearTimeout(bet_is_handle_status_timer);
  bet_is_handle_status_timer = setTimeout(() => {
    // 投注中状态初始化
    if (computed_data.is_virtual_bet) {
      vx_set_is_virtual_handle(false);
    } else if (computed_data.vx_is_bet_single) {
      vx_set_is_single_handle(false);
    } else {
      vx_set_is_handle(false);
    }
  }, 25000);
}
/**
 * @description: 关闭投注确认中的loadding效果
 */
function close_menu_loadding() {
  data_ref.data_ref = false;
  // 取消投注处理中
  if (computed_data.is_virtual_bet) {
    vx_set_is_virtual_handle(false);
  } else if (computed_data.vx_is_bet_single) {
    vx_set_is_single_handle(false);
  } else {
    vx_set_is_handle(false);
  }
  useMittEmit(MITT_TYPES.IS_MENU_LOADDING, data_ref.data_ref);
}

/**
 * @description 获取用户余额
 * @return {undefined} undefined
 */
function get_balance() {
  let uid = computed_data.user.uid;
  api_account.check_balance({ uid, t: new Date().getTime() }).then((res) => {
    const result = get(res, "data.data");
    const code = get(res, "data.code");
    if (code == 200) {
      vx_set_user_balance(result.amount);
    }
    // //显示token失效弹窗
    //this.show_fail_alert();
  });
}
/**
 * 计算投注框的高度
 */
function computed_bet_height() {
  if (computed_data.left_menu_toggle) return;
  if (
    (!computed_data.is_virtual_bet && computed_data.vx_is_bet_single) ||
    (computed_data.is_virtual_bet && computed_data.virtual_bet_list.length == 1)
  ) {
    if (timeOutIds.timer3) {
      clearTimeout(timeOutIds.timer3);
    }
    timeOutIds.timer3 = setTimeout(() => {
      // 内嵌组件获取
      if (embedded_single.value) {
        let left_height = 0;
        let page_left = page_left.value;
        if (page_left) {
          left_height = page_left.clientHeight;
          page_left = null;
        }
        let embedded_merge;
        let header = resizeable - headervalue;
        let footer = resizeable_footer.value;
        data_ref.max_height =
          left_height - header.$el.clientHeight - footer.$el.clientHeight;
        // 若为合并模式
        if (computed_data.is_bet_merge) {
          // 获取投注区域
          embedded_merge = bet_mode_zone.value;
        }
        let merge_height = 0;
        if (embedded_merge) {
          merge_height = embedded_merge.clientHeight;
        } else if (!computed_data.is_virtual_bet && !new_menu.is_esports()) {
          merge_height = 35;
        }
        // 内容计算 内嵌单关高度 + 合并区域的高度
        date_ref.content_height =
          embedded_single.value.clientHeight + merge_height + 10;
        if (data_ref.content_height) {
          data_ref.single_height = data_ref.content_height;
        } else {
          date_ref.content_height = computed_data.is_virtual_bet
            ? data_ref.single_height + 24
            : data_ref.single_height;
        }
        if (
          computed_data.bet_list.length > 1 &&
          embedded_single.value.$data.view_ctr_obj.order_confirm_complete ==
            0 &&
          !computed_data.vx_is_bet_single
        ) {
          date_ref.content_height += 90;
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
      let page_left = page_left.value;
      if (page_left) {
        left_height = page_left.clientHeight;
        page_left = null;
      }
      if (embedded_mix.value) {
        let header = resizeable_header.value;
        let footer = resizeable_footer.value;
        data_ref.max_height =
          left_height - header.$el.clientHeight - footer.$el.clientHeight;
        date_ref.content_height = embedded_mix.value.clientHeight;

        if (
          computed_data.bet_list.length > 1 &&
          embedded_mix.value.$data.view_ctr_obj.order_confirm_complete == 0
        ) {
          date_ref.content_height += 90;
        }
        if (data_ref.max_height < data_ref.content_height) {
          date_ref.content_height = data_ref.max_height;
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
  let isMaintaining = get(computed_data.user, "maintaining");
  // 如果活动处于维护状态，直接去掉小红点
  if (isMaintaining == true) {
    if (data_ref.hasBonusType3 == true) {
      data_ref.hasBonusType3 = false;
    }
    return;
  }
  // 判断是否有活动
  let activityList = get(computed_data.user, "activityList");
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
  data_ref.new_version = true;
}
/**
 * @Description 菜单初始化完成
 * @param {undefined} undefined
 */
function menu_init_done() {
  let nav_list = [...data_ref.nav_list];
  // 如果有电竞
  if (base_data.is_mi_2000_open) {
    if (nav_list.findIndex((i) => i.id == 5) == -1) {
      nav_list.splice(1, 0, {
        id: 5,
        tab_name: t("common.e_sports"),
        path: "/e_sport",
      });
    }
  } else {
    let index = nav_list.findIndex((i) => i.id == 5);
    if (index > -1) {
      nav_list.splice(index, 1);
    }
  }
  // 如果有虚拟体育
  if (base_data.is_mi_300_open) {
    if (nav_list.findIndex((i) => i.id == 3) == -1) {
      let e_index = nav_list.findIndex((i) => i.id == 5);
      if (e_index == -1) {
        e_index = 1;
      } else {
        e_index++;
      }
      nav_list.splice(e_index, 0, {
        id: 3,
        tab_name: t("common.virtuals"),
        path: "",
        class: "tab_virtaul_sport",
      });
    }
  } else {
    let index = nav_list.findIndex((i) => i.id == 3);
    if (index > -1) {
      nav_list.splice(index, 1);
    }
  }
  // console.error('nav_list',nav_list)
  let old_nav = JSON.stringify(data_ref.nav_list);
  let new_nav = JSON.stringify(nav_list);
  // 对比菜单
  if (old_nav != new_nav) {
    data_ref.nav_list = [...nav_list];
  }
  // console.error('ssssss',base_data.is_mi_2000_open,'----1111---'+base_data.is_mi_300_open)
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
 * @Description 设置视频预加载地址
 * @param {undefined} undefined
 */
let load_video_js_timer;
function set_video_src(obj) {
  data_ref.video_src = obj.video_src;
  data_ref.animation_src = obj.animation_src;
  // 延迟10s销毁预加载iframe
  if (load_video_js_timer) {
    clearTimeout(load_video_js_timer);
  }
  load_video_js_timer = setTimeout(() => {
    data_ref.video_src = "";
    data_ref.animation_src = "";
  }, 10000);
}
/**
 * 菜单状态切换
 */
function on_main_menu_toggle() {
  if (data_ref.data_ref) {
    return;
  }
  let cur =
    computed_data.vx_main_menu_toggle == "mini" ? "mini-normal" : "mini";
  vx_set_main_menu_toggle(cur);
  vx_set_left_menu_toggle(computed_data.vx_main_menu_toggle != "mini");
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
    new_menu.is_multi_column &&
    ["search", "home"].includes(route.name)
  ) {
    // console.warn('right_width-赋值为0')
    right_width = 0;
  }
  // 中间区域宽度
  let center_width = parseInt(main_width - left_width - right_width);
  // 头部高度
  let header_height = utils.is_iframe
    ? computed_data.computed_data.menu_collapse_status
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
  console.log(match_list_tpl_size, "match_list_tpl_size");
  match_list_tpl_size.set_template_width(list_content_width);
  store.dispatch({
    type: "SET_LAYOUT_SIZE",
    data: {
      inner_width,
      inner_height,
      main_width,
      left_width,
      right_width,
      center_width,
      list_content_width,
      header_height,
      content_height,
    },
  });
  store.dispatch({
    type: "SET_LAYOUT_LIST_SIZE",
    data: {
      width: main_width,
      height: content_height,
    },
  });
  store.dispatch({
    type: "SET_LAYOUT_LIST_SIZE",
    data: center_width,
  });
  set_layout_list_width(center_width);
  vx_set_main_menu_toggle(main_menu_toggle);
  vx_set_left_menu_toggle(main_menu_toggle != "mini");
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
  tihs.vx_set_is_bet_merge(!computed_data.is_bet_merge);
  if (computed_data.is_bet_merge) {
    // utils.send_zhuge_event("PC_合并");
  }
  let len = computed_data.bet_single_list.length;
  // 取消合并
  if (!computed_data.is_bet_merge && len > 1) {
    let id = computed_data.bet_single_list[len - 1];
    let bet_single_obj = cloneDeep(get(computed_data.bet_single_obj, `${id}`));
    this.vx_bet_single_clear();
    this.vx_set_bet_single_list([id]);
    bet_single_obj.key = id;
    // mode为清除原有的添加最新的
    bet_single_obj.mode = "clear_and_add";
    this.vx_bet_single_obj_attr(bet_single_obj);
  }
}
function update_bet_data() {
  /* ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...
      type:0表示普通赛事(默认值)，1虚拟赛事 */
  let type = computed_data.is_virtual_bet ? 1 : 0;
  let ids = [],
    bet_type;
  if (computed_data.is_virtual_bet) {
    bet_type = "vx_get_virtual_bet_obj";
  } else if (computed_data.vx_is_bet_single) {
    bet_type = "vx_get_bet_single_obj";
  } else {
    bet_type = "vx_get_bet_obj";
  }
  for (let obj of Object.values(computed_data[bet_type])) {
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
          if (computed_data.is_virtual_bet) {
            this.virtual_common.update_bet_item_info(this, data);
          } else {
            yabo_common.update_bet_item_info(this, data);
          }
          if (computed_data.vx_is_bet_single) {
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
store.dispatch({ type: "set_is_virtual_handle", data: true });
store.dispatch({ type: "set_is_single_handle", data: false });
store.dispatch({ type: "set_is_handle", data: false });
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
store.dispatch({ type: "SET_INIT_ODD" });
store.dispatch({ type: "SET_INIT_MATCH_SORT" });
init_site_header();
const remove_mitt_list = [
  // 接收开启loadding指令
  useMittOn(MITT_TYPES.EMIT_OPEN_MENU_LOADDING_CMD, open_menu_loadding).off,
  // 接收关闭loadding指令
  useMittOn(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD, close_menu_loadding).off,
  // 更新用户余额
  useMittOn(MITT_TYPES.EMIT_GET_BALANCE_CMD, get_balance).off,
  useMittOn(MITT_TYPES.EMIT_OPEN_SINGLE_BET, open_single_bet).off,
  //计算投注框高度
  useMittOn(MITT_TYPES.EMIT_COMPUTED_BET_HEIGHT_CMD, computed_bet_height).off,
  //获取投注数据(内嵌mini切换或者语言发生变化时调用)

  useMittOn(MITT_TYPES.EMIT_UPDATE_BET_DATA_CMD, update_bet_data).off,

  // // 左侧菜单初始化完成，顶部导航增加虚拟体育和电竞
  useMittOn(MITT_TYPES.MENU_INIT_DONE, menu_init_done).off,
  useMittOn(MITT_TYPES.IS_MENU_LOADDING, is_menu_loadding).off,
  useMittOn(MITT_TYPES.SET_PRE_VIDEO_SRC, set_video_src).off,
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
data_ref.isMaintaining = get(computed_data.user, "maintaining");
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
store.dispatch({
  type: "set_show_filter_popup",
  data: false,
});
store.dispatch({
  type: "set_match_details_params",
  data: {},
});
// // 进入首页
//gtag打点
// utils.gtag_view_send('PC_home', '/home')
data_ref.first_load = true;
get_access_config();
/*销毁组件*/
onBeforeUnmount(() => {
  unsubscribe();
  remove_mitt_list.forEach((item) => item());
});
</script>
<style lang="scss" scoped>
.c-main-scroll {
  overflow-x: auto;

  ::v-deep .q-page-sticky > div {
    width: 100%;
  }

  ::v-deep .page-right {
    z-index: 52;
  }
}

.main {
  height: 100%;

  .c-site-header {
    width: 100%;
  }

  .zero-opacity {
    opacity: 0;
  }

  .c-main-content {
    background-position: center;
    background-size: cover;
    display: flex;

    ::v-deep .page-right {
      z-index: 52;

      .football-after,
      .more-info {
        width: 90% !important;
      }
    }
  }
}

.iframe-top-collapse {
  ::v-deep {
    .c-site-header.is-iframe {
      height: 36px;
    }

    .serach-wrap.iframe {
      top: 0 !important;
    }
  }
}

.football-after,
.basketball-after,
.more-info {
  width: 90% !important;
}

.bet-mode-zone {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
  align-items: center;

  .left {
    display: flex;
    align-items: center;
    padding-left: 15px;
  }

  .bet-single-count {
    font-size: 16px;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    line-height: 24px;
    margin-left: 5px;
    text-align: center;
    transform: scale(0.8);
  }

  .right {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin-right: 10px;

    .check-box {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      padding-left: 5px;
      padding-right: 5px;

      .check-wrap {
        padding: 0;
        margin-right: 5px;
      }

      &.checked {
        .check-wrap {
          border: 0;
        }
      }
    }
  }
}

.tip-content {
  width: calc(100% - 20px);
  height: 100px;
  position: absolute;
  bottom: 0;
  z-index: 2003;
  top: -50px;
  left: 10px;

  &.top-content {
    top: 5px;
  }

  .content-wrap {
    position: absolute;
    top: 6px;
    width: 100%;
    background: #fff;
    border: 2px solid #ff781d;
    border-radius: 5px;

    .content {
      padding: 10px;
      font-size: 12px;

      .row-1,
      .row-2,
      .row-3 {
        color: #2d2d2d;
        text-align: center;
      }

      .row-1 {
        margin-bottom: 10px;
        font-size: 14px;
        color: #ff781d;
        font-weight: bold;
      }
    }

    .triangle,
    .triangle1 {
      position: absolute;
      background: #fff;
      border: 2px solid #ff781d;
      border-top: 0;
      border-left: 0;
      width: 15px;
      height: 15px;
      transform: rotate(45deg);
      top: 81px;
      right: 22px;
    }

    .triangle1 {
      top: 116px;
    }

    .icon-del {
      position: absolute;
      top: 16px;
      right: 10px;
      cursor: pointer;
    }
  }
}

.bet-bg-tooltip {
  background: #a3afbf;
  color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>
