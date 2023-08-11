<template>
  <div class="c-main-scroll window-width window-height">
    <div
      class="main overflow-hidden relative-position"
      :class="{ 'iframe-top-collapse': vx_get_menu_collapse_status }"
      :style="`width:${vx_get_layout_size.main_width}px;`"
    >
      <!-- 搜索 -->
      <search v-if="get_search_status" v-show="$route.params.video_size != 1" />
      <!-- 页面头部容器-->
      <site-header
        v-show="$route.params.video_size != 1"
        class="yb-layout-margin-header"
        :nav_list="nav_list"
        :class="{ activity_bonus: hasBonusType3 }"
        :imgUrl="special_img_url"
        :hostUrl="special_host_url"
        :urlType="special_url_type"
        :hasActivity="hasActivity"
      />

      <div
        class="c-main-content c-content-bg"
        :style="`width:${vx_get_layout_size.main_width}px  !important; height:${
          vx_get_layout_size.content_height + 4
        }px  !important;`"
      >
        <!-- 左侧 菜单区域 -->
        <div
          ref="page-left"
          v-show="$route.params.video_size != 1"
          class="page-left row yb-layout-margin-menu relative-position"
          :style="`width:${vx_get_layout_size.left_width}px  !important; height:${vx_get_layout_size.content_height}px  !important;`"
          :class="vx_main_menu_toggle"
        >
          <div
            class="cathectic-shade"
            v-show="bet_loadding && vx_get_left_menu_toggle"
          >
            <div class="shade-fixed">
              <!--确认中转圈圈-->
              <div class="loading-wrap">
                <div class="img-loading"></div>
                <div
                  class="text-center loading-text flex items-end justify-center"
                >
                  {{ $root.$t("bet.bet_loading") + "..." }}
                  <!-- 内容加载中... -->
                </div>
              </div>
            </div>
          </div>
          <!--左侧菜单mini-->
          <main-menu-mini v-show="vx_main_menu_toggle == 'mini'" />
          <!--左侧菜单-->
          <main-menu
            v-show="['normal', 'mini-normal'].includes(vx_main_menu_toggle)"
          />
        </div>

        <!-- 中间区域 -->
        <keep-alive include="matchListRouter" max="1">
          <router-view
            class="page-center"
            :class="screen_width"
            :style="
              $route.params.video_size == 1
                ? 'position: fixed; top: 0;  bottom: 0;right: 0;  left: 0; width: 100%;height: 100%;'
                : `width:${vx_get_layout_size.center_width}px  !important; height:${vx_get_layout_size.content_height}px  !important;`
            "
          />
        </keep-alive>

        <!-- 右侧区域 -->
        <div
          class="page-right"
          :class="screen_width"
          :style="
            $route.params.video_size == 1
              ? ''
              : `width:${vx_get_layout_size.right_width}px  !important; height:${vx_get_layout_size.content_height}px  !important;`
          "
          v-if="vx_get_layout_size.right_width > 0"
        >
          <!-- 虚拟体育 -->
          <virtual-right
            v-if="
              NewMenu.is_virtual_sport() &&
              $route.name != 'search' &&
              $route.name != 'details'
            "
          />
          <!-- 常规竞猜 -->
          <match-details v-else class="page-match-detail fit" />
        </div>
      </div>

      <!-- 小于 1440 时显示折叠按钮  -->
      <div
        v-if="$route.params.video_size != 1"
        v-show="vx_main_menu_toggle != 'normal'"
        @click="on_main_menu_toggle"
        class="menu_toggle-btn yb-flex-center"
        :class="[vx_main_menu_toggle, bet_loadding ? 'disable-toggle' : '']"
      >
        <img src="~public/image/yabo/svg/left_menu_toggle.svg" alt="" />
      </div>

      <!-- 视频js预加载 -->
      <iframe v-if="video_src" style="display: none" :src="video_src"></iframe>
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
          show_bet_zone && !vx_get_left_menu_toggle && $route.name != 'video'
        "
      >
        <vue-draggable-resizable
          ref="resizable"
          :axis="axis"
          :x="x"
          :y="y"
          :w="300"
          :h="h"
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
            :class="{ 'zero-opacity': !bet_loadding && dragging }"
            v-show="bet_loadding || dragging"
          >
            <!--确认中转圈圈-->
            <template v-if="bet_loadding">
              <div class="shade-fixed">
                <div class="loading-wrap">
                  <div class="img-loading"></div>
                  <div
                    class="text-center loading-text flex items-end justify-center"
                  >
                    {{ $root.$t("bet.bet_loading") + "..." }}
                  </div>
                </div>
              </div>
            </template>
          </div>
          <!--滚动条头部-->
          <template v-if="vx_get_is_virtual_bet">
            <virtual-bet-scroll-header
              ref="resizeable-header"
              :is_free="false"
              :is_expand="is_expand"
            />
          </template>
          <bet-scroll-header
            v-else
            ref="resizeable-header"
            :is_expand="is_expand"
            :bet_flag="bet_flag"
            :is_free="false"
          />
          <div
            class="cathectic-zone"
            :class="{ 'bet-zone-height': !is_expand }"
            v-show="is_expand2"
            @click.stop="check_drag"
          >
            <!--中间内容部分-->
            <q-scroll-area
              ref="bet-scroll-area"
              class="bet-scroll-area"
              :thumb-style="thumb_style"
              :style="{
                height: `${content_height}px`,
                width: '300px',
                'max-height': `${vx_get_layout_size.content_height - 190}px`,
              }"
            >
              <!--虚拟体育部分-->
              <template v-if="vx_get_is_virtual_bet">
                <!-- 虚拟单关 -->
                <virtual-bet-single
                  ref="embedded-single"
                  @set_scroll_this="set_scroll_this"
                  v-if="vx_get_virtual_bet_list.length == 1"
                />
                <!-- 虚拟串关 -->
                <virtual-bet-mix
                  ref="embedded-mix"
                  @set_scroll_this="set_scroll_this"
                  v-if="vx_get_virtual_bet_list.length > 1"
                />
              </template>
              <!--非虚拟体育部分-->
              <template v-else>
                <div
                  ref="bet-mode-zone"
                  class="bet-mode-zone"
                  v-if="vx_is_bet_single"
                >
                  <div class="left">
                    <span>{{ $root.$t("bet.bet_one_") }}</span>
                    <span class="bet-single-count">
                      {{ vx_get_bet_single_list.length }}
                    </span>
                  </div>
                  <div class="right">
                    <span
                      class="check-box"
                      :class="{ checked: vx_get_is_bet_merge }"
                      @click.stop="toggle_merge"
                    >
                      <check-box :checked="vx_get_is_bet_merge" /><span>{{
                        $root.$t("bet.merge")
                      }}</span>
                    </span>
                    <span
                      @mouseover="show_merge_info = true"
                      @mouseout="show_merge_info = false"
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
                  ref="embedded-single"
                  @set_scroll_this="set_scroll_this"
                  v-if="vx_is_bet_single"
                />
                <!--内嵌的串关-->
                <bet-mix
                  ref="embedded-mix"
                  @set_scroll_this="set_scroll_this"
                  v-if="!vx_is_bet_single"
                />
              </template>
            </q-scroll-area>
            <!-- 滚动：尾部 --------------------------------->
            <!--滚动条底部-->
            <template v-if="vx_get_is_virtual_bet">
              <virtual-bet-scroll-footer
                ref="resizeable-footer"
                :bet_this="bet_this"
              />
            </template>
            <template v-else>
              <bet-scroll-footer ref="resizeable-footer" :bet_this="bet_this" />
            </template>
          </div>
        </vue-draggable-resizable>
      </template>
      <!-- 视频画中画组件 -->
      <moveVideo v-if="show_move_video"></moveVideo>
    </div>
    <loading v-if="dataLoading" />
    <!--提示区域-->
    <q-tooltip
      content-class="bet-bg-tooltip"
      anchor="bottom left"
      self="top left"
      :offset="[262, 10]"
      target="#merge-info"
      v-if="show_merge_info"
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
        {{ $root.$t("bet.merge_info") }}
      </div>
    </q-tooltip>
    <!-- 引导页 -->
    <introduce />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { api_account, api_common, api_details } from "src/public/api/index.js";
import toast from "src/public/components/toast/toast";
import alert from "src/public/components/toast/alert.vue";
import confirm from "src/public/components/toast/confirm.vue";
import site_header from "src/project/yabo/components/site_header/site_header.vue";
import skt_data_finance from "src/public/mixins/websocket/data/skt_data_finance";
// import activityModel from "src/public/components/activity/model";
// import bet_single from "src/project/yabo/components/bet2/bet_single.vue";
// import bet_mix from "src/project/yabo/components/bet2/bet_mix.vue";
// import virtual_bet_single from "src/project/yabo/components/virtual_bet2/bet_single.vue";
// import virtual_bet_mix from "src/project/yabo/components/virtual_bet2/bet_mix.vue";
// import bet_scroll_header from "src/public/components/bet2/bet_scroll_header.vue";
// import bet_scroll_footer from "src/public/components/bet2/bet_scroll_footer.vue";
// import virtual_bet_scroll_footer from "src/public/components/virtual_bet2/bet_scroll_footer.vue";
import mainMenu from "src/project/yabo/pages/main_menu/main_menu";
import MainMenuMini from "src/project/yabo/pages/main_menu/main_menu_mini";
// import matchDetails from "src/project/yabo/pages/match_details/match_details.vue";
import loading from "src/public/components/load_data/loading_global.vue";
import introduce from "src/public/components/introduce/introduce.vue";

import BaseUserInfo from "src/public/utils/user/base_user_info.js";
import tooltip from "src/public/utils/tooltip.js";

// 需要请求活动数据来判断是否有可领取状态
import * as api_activity from "src/public/activity_page/activity/api/index.js";
// import FliterCheckbox from "src/project/yabo/components/match_list/filter_checkbox";
import match_list_tpl_size from "src/public/utils/dataClassCtr/match_list_tpl_size.js";

import "src/project/yabo/pages/match_list/match_list.scss";
import VueDraggableResizable from "vue-draggable-resizable";
import moveVideo from "src/project/yabo/components/video/move_video.vue";
export default {
  name: "MainLayout",
  mixins: [skt_data_finance],

  components: {
    "site-header": site_header,
    toast,
    alert,
    confirm,
    search: () =>
      import(
        /* webpackChunkName: "details" */ "src/project/yabo/pages/search/search.vue"
      ),
    activityModel: () =>
      import(
        /* webpackChunkName: "details" */ "src/public/components/activity/model.vue"
      ),

    // "bet-single":  () => import( /* webpackChunkName: "details" */ "src/project/yabo/components/bet2/bet_single.vue"),
    "bet-single": () =>
      import(
        /* webpackChunkName: "details" */ "src/project/yabo/components/bet/bet_single.vue"
      ),
    // "bet-mix":() => import( /* webpackChunkName: "details" */ "src/project/yabo/components/bet2/bet_mix.vue"),

    "bet-mix": () =>
      import(
        /* webpackChunkName: "details" */ "src/project/yabo/components/bet/bet_mix.vue"
      ),

    // "virtual-bet-single": () => import( /* webpackChunkName: "details" */ "src/project/yabo/components/virtual_bet2/bet_single.vue"),

    "virtual-bet-single": () =>
      import(
        /* webpackChunkName: "details" */ "src/project/yabo/components/virtual_bet/bet_single.vue"
      ),

    // "virtual-bet-mix": () => import( /* webpackChunkName: "details" */ "src/project/yabo/components/virtual_bet2/bet_mix.vue"),

    "virtual-bet-mix": () =>
      import(
        /* webpackChunkName: "details" */ "src/project/yabo/components/virtual_bet/bet_mix.vue"
      ),

    "virtual-bet-scroll-header": () =>
      import(
        /* webpackChunkName: "details" */ "src/public/components/virtual_bet/bet_scroll_header.vue"
      ),
    "bet-scroll-header": () =>
      import(
        /* webpackChunkName: "details" */ "src/public/components/bet/bet_scroll_header.vue"
      ),

    // "bet-scroll-footer": () => import( /* webpackChunkName: "details" */ "src/public/components/bet2/bet_scroll_footer.vue"),
    "bet-scroll-footer": () =>
      import(
        /* webpackChunkName: "details" */ "src/public/components/bet/bet_scroll_footer.vue"
      ),
    "virtual-bet-scroll-footer": () =>
      import(
        /* webpackChunkName: "details" */ "src/public/components/virtual_bet2/bet_scroll_footer.vue"
      ),
    // "draggable-resizable":() => import( /* webpackChunkName: "details" */ "import VueDraggableResizable from 'vue-draggable-resizable'"),
    VueDraggableResizable,
    mainMenu,
    MainMenuMini,
    matchDetails: () =>
      import(
        /* webpackChunkName: "details" */ "src/project/yabo/pages/match_details/match_details.vue"
      ),
    virtualRight: () =>
      import(
        /* webpackChunkName: "details" */ "src/project/yabo/components/virtual_right/virtual_right.vue"
      ),
    loading,
    introduce,
    "check-box": () =>
      import(
        /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/filter_checkbox.vue"
      ),
    moveVideo,
  },

  data() {
    return {
      NewMenu: $NewMenu,
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
      activityUpdateTimer: null, // 活动入口状态提示更新定时器
      activityIds: "", // 已开启的活动 id
      timeOutIds: {}, // 存储 setTimeOut id 方便统一销毁
      new_version: false, // 是否是最新版本
      showBannerTimer: null, // 展示运营位弹窗的 setTimeout
      // 通过链接参数打开活动页面的时间
      openActivityPageTime: null,
      userBannerTimer: this.$root.$t("common.auto_close").replace("%s", 5),
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
      // 菜单初始化 因为菜单是去轮询的 so
      menu_init_time: "",
      // 延迟 重置轮询时间
      init_reset_time: "",
    };
  },

  computed: {
    ...mapGetters({
      vx_get_is_invalid: "get_is_invalid",
      // 搜索状态
      get_search_status: "get_search_status",
      // 获取用户信息
      vx_get_user: "get_user",
      // 当前语言
      lang: "get_lang",
      // 单关部分 是否为串关
      vx_is_bet_single: "is_bet_single",
      // 串关是否正在处理中
      vx_get_is_handle: "get_is_handle",
      // 单关是否正在处理中
      vx_get_is_single_handle: "get_is_single_handle",
      // 是否为虚拟体育投注
      vx_get_is_virtual_bet: "get_is_virtual_bet",
      // 虚拟投注是否正在进行
      vx_get_is_virtual_handle: "get_is_virtual_handle",
      // 获取虚拟投注列表
      vx_get_virtual_bet_list: "get_virtual_bet_list",
      vx_get_bet_list: "get_bet_list",
      vx_get_bet_single_list: "get_bet_single_list",
      vx_get_bet_single_obj: "get_bet_single_obj",
      vx_layout_left_show: "get_layout_left_show",
      vx_get_cur_odd: "get_cur_odd",
      vx_get_left_menu_toggle: "get_left_menu_toggle",
      // 当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      vx_main_menu_toggle: "get_main_menu_toggle",
      // 获取项目主题
      theme: "get_theme",
      // 全局点击事件
      get_global_click: "get_global_click",

      vx_get_layout_size: "get_layout_size",
      vx_get_is_bet_merge: "get_is_bet_merge",
      vx_get_menu_collapse_status: "get_menu_collapse_status",
      //收起右侧详情 展开多列玩法
      get_unfold_multi_column: "get_unfold_multi_column",
      //全局开关
      get_global_switch: "get_global_switch",
    }),
    // 拖拽区域的样式  计算属性用于计算拖拽位置
    draggable_style() {
      return {
        transform: `translate(${this.x}px, ${this.y}px)`,
        left: null,
        top: 0,
        bottom: null,
      };
    },

    // 小于 1280 时的底部横向滚动条
    scroll_style() {
      return {
        borderRadius: "3px",
        height: "8px",
        opacity: 1,
        zIndex: 99999,
        cursor: "pointer",
      };
    },
    //是不是可以显示内嵌框
    show_bet_zone() {
      if (
        !this.vx_get_is_virtual_bet &&
        ((this.vx_is_bet_single && this.vx_get_bet_single_list.length > 0) ||
          (!this.vx_is_bet_single && this.vx_get_bet_list.length > 0))
      ) {
        return true;
      } else if (
        this.vx_get_is_virtual_bet &&
        this.vx_get_virtual_bet_list.length > 0
      ) {
        return true;
      }
      return false;
    },
    // 屏蔽视频移动组件(视频回播功能)
    show_move_video() {
      return (
        this.vx_get_user.merchantEventSwitchVO &&
        this.vx_get_user.merchantEventSwitchVO.eventSwitch
      );
    },
  },
  created() {
    // 投注中状态初始化
    this.vx_set_is_virtual_handle(false);
    this.vx_set_is_single_handle(false);
    this.vx_set_is_handle(false);

    this.NewMenu.get_new_data();
    $BaseData.get_new_data();

    this.NewMenu.show_bet_zone = false;
    // 用户是否操作过页面
    this.user_is_handle = false;
    this.$matchlist.init_loading_time_record();

    // 无 token 时直接关闭loading
    if (!window.vue.get_user) {
      this.dataLoading = false;
    }
    this.resize();
    // 获取赔率转换表数据
    // this.get_odds_conversion();
    this.vx_set_init_odd();
    this.vx_set_init_match_sort();
    this.init_site_header();

    // 接收开启loadding指令
    this.$root.$on(
      this.emit_cmd.EMIT_OPEN_MENU_LOADDING_CMD,
      this.open_menu_loadding
    );
    // 接收关闭loadding指令
    this.$root.$on(
      this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD,
      this.close_menu_loadding
    );
    // 更新用户余额
    this.$root.$on(this.emit_cmd.EMIT_GET_BALANCE_CMD, this.get_balance);
    this.$root.$on(this.emit_cmd.EMIT_OPEN_SINGLE_BET, this.open_single_bet);
    //计算投注框高度
    this.$root.$on(
      this.emit_cmd.EMIT_COMPUTED_BET_HEIGHT_CMD,
      this.computed_bet_height
    );
    //获取投注数据(内嵌mini切换或者语言发生变化时调用)
    this.$root.$on(
      this.emit_cmd.EMIT_UPDATE_BET_DATA_CMD,
      this.update_bet_data
    );
    // 左侧菜单初始化完成，顶部导航增加虚拟体育和电竞
    this.$root.$on("menu_init_done", this.menu_init_done);
    this.$root.$on("is_menu_loadding", this.is_menu_loadding);
    this.$root.$on("set_pre_video_src", this.set_video_src);
    this.$root.$on("close_home_loading", this.closeLoading);
    // 保存首页路径，活动页需要用到
    if (this.$route.path == "/home") {
      window.localStorage.setItem("home_url", window.location.origin);
    }
    // 获取活动维护状态
    this.isMaintaining = _.get(this.vx_get_user, "maintaining");
    // 在活动窗口内更新首页小红点
    window.addEventListener("message", this.cancelDot);
    window.addEventListener("resize", this.resize);
    window.addEventListener("mousedown", this.globalclick);
    // 更新活动入口小红点
    this.$root.$on("update-bonus", this.getActivityLists);
    // 版本号检查状态通知
    this.$root.$on("request_user_banner", this.newVersion);
    // 重新计算投注框高度
    this.$root.$on("toggle-handle", this.toggle_handle);
    this.$root.$on("emit_list_on_scroll", this.list_on_scroll);
    this.$root.$on("right_details_on_scroll", this.list_on_scroll);

    // 重置 vuex 存储
    this.vx_set_show_record(false);
    this.vx_set_show_filter_popup(false);

    this.vx_set_match_details_params({});
    // 进入首页
    this.$utils.gtag_view_send("PC_home", "/home");
    this.first_load = true;
    this.get_access_config();
  },
  watch: {
    // 投注浮层折叠状态变化时，更新相应max_top值
    is_expand2() {
      if (this.is_expand2) {
        this.max_top -= 521;

        const max_top = document.body.clientHeight - 568;
        if (this.y > max_top) {
          this.y = max_top;
        }
      } else {
        this.max_top += 521;
      }
    },
    // 内嵌版菜单折叠状态
    vx_get_menu_collapse_status(is_collapse) {
      this.resize();
    },
    "vx_get_layout_size.inner_width": {
      handler(width) {
        $NewMenu.set_multi_column();
        if (width < 1440) {
          this.set_unfold_multi_column(false);
          if (this.vx_main_menu_toggle != "mini" && !this.first_load) {
            this.on_main_menu_toggle();
          }
        }
        this.first_load = false;
      },
    },
    // 检测到语言变化之后初始化导航
    lang() {
      this.init_site_header(2);
    },
    // 监听路由变化 并记录到 vuex
    $route: {
      handler(to, from) {
        tooltip("cancel", 0, 0, 0);
        let _to = _.get(to, "name") || "";
        let _from = _.get(from, "name") || "";
        if (_to != _from) {
          //需要重新计算一遍投注框高度
          this.computed_bet_height();
        }
        this.init_bet_postion();
        this.resize();
        $NewMenu.set_multi_column();
      },
      immediate: true,
    },
    //单关
    vx_is_bet_single: {
      handler() {
        //计算一遍投注框高度
        this.computed_bet_height();
      },
      immediate: true,
    },
    //串关长度
    "vx_get_bet_list.length": {
      handler() {
        //计算一遍投注框高度
        this.computed_bet_height();
      },
      immediate: true,
    },
    //单关长度
    "vx_get_bet_single_list.length": {
      handler() {
        //需要重新计算一遍投注框高度
        this.computed_bet_height();
      },
      immediate: true,
    },
    //虚拟体育
    "vx_get_virtual_bet_list.length": {
      handler(count) {
        if (count > 1) {
          this.vx_set_is_bet_single(false);
        } else if (count == 1) {
          this.vx_set_is_bet_single(true);
        }
        //需要重新计算一遍投注框高度
        this.computed_bet_height();
      },
      immediate: true,
    },
    "bet_this.bet_flag"(new_) {
      this.bet_flag = new_;
      if (this.vx_is_bet_single) {
        this.$nextTick(() => {
          let embedded_single = this.$refs["embedded-single"];
          let bet_scroll_area = this.$refs["bet-scroll-area"];
          if (bet_scroll_area) {
            let embedded_merge;
            if (this.vx_get_is_bet_merge) {
              embedded_merge = this.$refs["bet-mode-zone"];
            }
            let merge_height = 0;
            if (embedded_merge) {
              merge_height = embedded_merge.clientHeight;
            } else if (
              !this.vx_get_is_virtual_bet &&
              !window.$NewMenu.is_esports()
            ) {
              merge_height = 40;
            }
            bet_scroll_area.$el.style.height = `${
              embedded_single.$el.clientHeight + merge_height
            }px`;
            embedded_merge = null;
          }
          embedded_single = null;
          bet_scroll_area = null;
        });
      } else {
        this.$nextTick(() => {
          let embedded_mix = this.$refs["embedded-mix"];
          if (!new_ && embedded_mix && embedded_mix.$refs["bet-mix-record"]) {
            this.content_height =
              embedded_mix.$refs["bet-mix-record"].$el.clientHeight;
            embedded_mix = null;
          } else {
            //需要重新计算一遍投注框高度
            this.computed_bet_height();
          }
        });
      }
    },
    // 左侧菜单切换状态
    vx_get_left_menu_toggle() {
      //需要重新计算一遍投注框高度
      this.computed_bet_height();
      this.init_bet_postion();
      this.resize();
    },
    //当前赔率
    vx_get_cur_odd(new_) {
      BaseUserInfo.assign({ userMarketPrefer: new_ }); //缓存用户盘口偏好信息
    },
    //多列玩法切换
    get_unfold_multi_column() {
      this.resize();
    },

    // 首次加载页面的时候 activityList 会出现没值的情况，所以等有值了再初始化一下导航
    "vx_get_user.activityList": {
      handler(new_) {
        // 没渲染上的时候才再次调用
        if (this.hasActivity != true) {
          this.isMaintaining = _.get(this.vx_get_user, "maintaining");
          if (new_ && new_.length > 0) {
            this.init_site_header(1);
          }
        }
      },
    },
    // 全局点击事件
    get_global_click() {
      this.showActivity = false;
    },
    //全局开关
    "get_global_switch.activity_switch"() {
      this.init_site_header();
    },
    "NewMenu.is_multi_column"() {
      this.resize();
    },
  },
  methods: {
    ...mapActions({
      set_odds_coversion_map: "set_odds_coversion_map",
      vx_set_init_odd: "set_init_odd",
      vx_set_init_match_sort: "set_init_match_sort",
      // 设置单关是否正在投注处理中
      vx_set_is_single_handle: "set_is_single_handle",
      // 设置串关是否正在处理
      vx_set_is_handle: "set_is_handle",
      // 虚拟投注正在处理中
      vx_set_is_virtual_handle: "set_is_virtual_handle",
      // 保存用户余额
      vx_set_user_balance: "set_user_balance",
      vx_virtual_bet_clear: "virtual_bet_clear",
      vx_set_cur_odd: "set_cur_odd",
      // 左侧菜单展开折叠状态
      vx_set_left_menu_toggle: "set_left_menu_toggle",
      // 保存页面布局的宽高等数据
      vx_set_layout_size: "set_layout_size",
      // 保存当前路由信息
      vx_set_layout_cur_page: "set_layout_cur_page",
      vx_set_show_filter_popup: "set_show_filter_popup",

      vx_set_show_record: "set_show_record",
      vx_set_match_details_params: "set_match_details_params",

      vx_set_main_menu_toggle: "set_main_menu_toggle",
      set_layout_list_size: "set_layout_list_size",
      // 保存列表的宽度
      set_layout_list_width: "set_layout_list_width",
      vx_set_is_bet_merge: "set_is_bet_merge",
      vx_set_is_bet_single: "set_is_bet_single",
      //设置全局开关
      set_global_switch: "set_global_switch",
      // 设置左侧布局
      vx_set_layout_left_show: "set_layout_left_show",
      //设置多列玩法状态
      set_unfold_multi_column: "set_unfold_multi_column",
    }),
    /**
     * @Description 获取全局配置开关
     * @param {undefined} undefined
     */
    get_access_config() {
      api_common
        .get_access_config()
        .then((res) => {
          let data = _.get(res, "data.data", {});
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
          this.set_global_switch({
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
    },
    /**
     * @Description 列表滚动
     * @param {undefined} undefined
     */
    list_on_scroll(obj) {
      let scroll_top = obj ? obj.position : this.$matchlist.scroll_top;
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
        this.$root.$off("emit_list_on_scroll", this.list_on_scroll);
        this.$root.$off("right_details_on_scroll", this.list_on_scroll);
      }

      // 发送今日足球诸葛事件
      if (
        !is_send_today_football_zhuge &&
        scroll_top > 100 &&
        !this.user_is_handle
      ) {
        this.$utils.send_zhuge_event("PC_今日_足球_默认页面滚动超100");
        sessionStorage.setItem("is_send_today_football_zhuge", 1);
        this.user_is_handle = true;
      }
    },
    /**
     * @Description 全局点击事件
     * @param {undefined} undefined
     */
    globalclick() {
      this.user_is_handle = true;
      window.removeEventListener("mousedown", this.globalclick);
      // sessionStorage.setItem('is_send_today_football_zhuge2',1)
    },
    /**
     * @description 赔率转换
     * @return {undefined} undefined
     */
    get_odds_conversion() {
      api_common.get_fetch_odds_conversion().then((res) => {
        let code = _.get(res, "data.code") || "";
        if (code == 200) {
          let data = _.get(res, "data.data") || "";

          this.set_odds_coversion_map(data);
        }
      });
    },
    /**
     * @description 设置顶部菜单
     * @param {number} type  类型(null-自然触发，1-导航栏二次触发，2-切换语言)
     */
    init_site_header(type = null) {
      let nav_list = [
        {
          id: 1,
          tab_name: this.$root.$t("common.sports_betting"),
          path: "/home",
        }, //体育投注
        {
          id: 2,
          tab_name: this.$root.$t("common.note_single_history"),
          path: "/bet_record",
          _blank: true,
        }, //注单历史
        // { id: 8, tab_name: this.$root.$t("common.e_sports"), path: "" }, //电子竞技
        //{ id: 3, tab_name: this.$root.$t("common.winning_champions"), path: "" }, //优胜冠军
        {
          id: 4,
          tab_name: this.$root.$t("common.amidithion"),
          path: "/match_results",
          _blank: true,
        }, //赛果
        // { id: 5, tab_name: this.$root.$t("common.score_center"), path: "" }, //比分中心
        // { id: 6, tab_name: this.$root.$t("common.statistic_analysis"), path: `${details.signal_url}/kaihongman/${src_lang}`,_blank:true }, //统计分析
        {
          id: 7,
          tab_name: this.$root.$t("common.sports_betting_rules"),
          path: "/rule",
          _blank: true,
        }, //体育竞猜规则
      ];
      // 判断是否有活动
      let activityList = _.get(this.vx_get_user, "activityList");
      // 多语言屏蔽活动入口
      if (
        activityList &&
        activityList.length > 0 &&
        this.lang == "zh" &&
        this.get_global_switch.activity_switch
      ) {
        this.hasActivity = true;
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
        imgUrl = this.get_file_path(imgUrl);
        // 活动入口的图片，如果接口未返回就用默认图片
        tab.img_src =
          imgUrl || require("public/image/activity_imgs/imgs/gift_package.png");
        nav_list.push(tab);
        activityList.forEach((item) => {
          this.activityIds += item.activityId + ",";
        });
        this.activityTimer();
        this.activity_timer = setTimeout(
          () => this.getActivityLists({ id: 1, type: "init_nav" }),
          1000
        );
      }
      if (type != 2) {
        // 运营位专题页
        this.special_page();
      }

      // 运营位弹窗,如果当前是最新版本就直接展示弹窗，如果不是，就延迟几秒再展示
      if (type == null) {
        // type 为 null 是自然触发，如果 == 1就是导航栏二次触发，不要更新这里
        if (this.new_version) {
          this.timeOutIds.timer2 = setTimeout(() => {
            this.activity_dialog();
          }, 3000);
        } else {
          if (this.timeOutIds.timer2) {
            clearTimeout(this.timeOutIds.timer2);
          }
          this.timeOutIds.timer2 = setTimeout(() => {
            this.activity_dialog();
          }, 5000);
        }
      }
      this.nav_list = nav_list;
      this.$root.$emit("close_home_loading", false);

      // 菜单初始化 因为菜单是去轮询的 so
      // 因为设置菜单是500s
      this.set_menu_init_time(600);

      this.init_reset_time = setTimeout(() => {
        // 本身商户的设置有缓存 所以频率太快
        this.set_menu_init_time(5000);
        clearTimeout(this.init_reset_time);
      }, 2000);
    },
    /**
     * 定时请求菜单
     * */
    set_menu_init_time(number) {
      clearInterval(this.menu_init_time);
      // 菜单初始化 因为菜单是去轮询的
      this.menu_init_time = setInterval(() => {
        this.menu_init_done();
      }, number);
    },
    /***
     * 运营位活动弹窗
     */
    activity_dialog() {
      let token = _.get(this.vx_get_user, "token");
      api_account.get_BannersUrl({ type: 5, token }).then((res) => {
        let code = _.get(res, "data.code");
        let data = _.get(res, "data.data");
        if (code == 200) {
          let isShow = false;
          if (data && data.length > 0) {
            data.forEach((item) => {
              if (item.tType && item.tType == 5) {
                // 去掉一个自然日展示一次的判断，有值就展示
                if (this.showActivityTime) {
                  // 判断日期如果不在同一天就展示弹窗
                  if (
                    new Date(this.showActivityTime).getDate() !==
                    new Date().getDate()
                  ) {
                    isShow = true;
                  }
                } else {
                  isShow = true;
                  sessionStorage.setItem(
                    "showActivityTime",
                    new Date().getTime()
                  );
                }
                // 获取图片地址
                this.imgUrl = window.vue.get_file_path(item.imgUrl);
                this.hostUrl = item.hostUrl;
                this.urlType = item.urlType;
                // 是否允许点击跳转 ayx_act 爱游戏  act1 乐鱼
                this.allowClick =
                  ["act", "zr", "ayx_act", "act1"].includes(item.hostUrl) ||
                  item.hostUrl != "";
              }
            });
          } else {
            isShow = false;
          }
          this.showActivity = isShow;
          if (this.showActivity) {
            // 5秒后自动消失
            let time = 5;
            this.userBannerTimer = this.$root
              .$t("common.auto_close")
              .replace("%s", time);
            let timer = setInterval(() => {
              time--;
              this.userBannerTimer = this.$root
                .$t("common.auto_close")
                .replace("%s", time);
              if (time == 0) {
                this.showActivity = false;
                clearInterval(timer);
              }
            }, 1000);
          }
        }
      });
    },
    /***
     * 运营位专题页
     */
    special_page() {
      let token = _.get(this.vx_get_user, "token");
      api_account.get_BannersUrl({ type: 7, token }).then((res) => {
        let code = _.get(res, "data.code");
        let data = _.get(res, "data.data");
        if (code == 200) {
          if (data && data.length > 0) {
            data.forEach((item) => {
              if (item.tType && item.tType == 7) {
                // 获取图片地址
                this.special_img_url = window.vue.get_file_path(item.imgUrl);
                this.special_host_url = item.hostUrl;
                this.special_url_type = item.urlType;
              }
            });
          }
        }
      });
    },
    /**
     * 投注框转开和折叠
     */
    toggle_handle() {
      this.is_expand = !this.is_expand;
      if (this.is_expand) {
        //展开则需要重新计算一遍投注框高度
        this.computed_bet_height();
      }
      this.is_expand2 = this.is_expand;
    },
    /**
     * 展开单关投注框
     */
    open_single_bet() {
      this.is_expand = true;
      this.is_expand2 = this.is_expand;
      //展开则需要重新计算一遍投注框高度
      this.computed_bet_height();
    },
    /**
     * @description 设置滚动数据
     * @param  {string} type  类型
     * @param  {oject} _this  上下文对象
     * @return {undefined} undefined
     */
    set_scroll_this({ type, _this }) {
      this[type] = _this;
    },
    /**
     * @description: 开启投注确认中的loadding效果
     */
    open_menu_loadding() {
      this.bet_loadding = true;
      // 投注正在处理中
      if (this.vx_get_is_virtual_bet) {
        this.vx_set_is_virtual_handle(true);
      } else if (this.vx_is_bet_single) {
        this.vx_set_is_single_handle(true);
      } else {
        this.vx_set_is_handle(true);
      }
      this.$root.$emit("is_menu_loadding", this.bet_loadding);
      // 兜底25s后初始化投注处理中状态
      clearTimeout(this.bet_is_handle_status_timer);
      this.bet_is_handle_status_timer = setTimeout(() => {
        // 投注中状态初始化
        if (this.vx_get_is_virtual_bet) {
          this.vx_set_is_virtual_handle(false);
        } else if (this.vx_is_bet_single) {
          this.vx_set_is_single_handle(false);
        } else {
          this.vx_set_is_handle(false);
        }
      }, 25000);
    },
    /**
     * @description: 关闭投注确认中的loadding效果
     */
    close_menu_loadding() {
      this.bet_loadding = false;
      // 取消投注处理中
      if (this.vx_get_is_virtual_bet) {
        this.vx_set_is_virtual_handle(false);
      } else if (this.vx_is_bet_single) {
        this.vx_set_is_single_handle(false);
      } else {
        this.vx_set_is_handle(false);
      }
      this.$root.$emit("is_menu_loadding", this.bet_loadding);
    },

    /**
     * @description 获取用户余额
     * @return {undefined} undefined
     */
    get_balance() {
      let uid = this.vx_get_user.uid;
      api_account
        .check_balance({ uid, t: new Date().getTime() })
        .then((res) => {
          const result = _.get(res, "data.data");
          const code = _.get(res, "data.code");
          if (code == 200) {
            this.vx_set_user_balance(result.amount);
          }
          this.show_fail_alert();
        });
    },
    /**
     * 计算投注框的高度
     */
    computed_bet_height() {
      if (this.vx_get_left_menu_toggle) return;
      if (
        (!this.vx_get_is_virtual_bet && this.vx_is_bet_single) ||
        (this.vx_get_is_virtual_bet && this.vx_get_virtual_bet_list.length == 1)
      ) {
        if (this.timeOutIds.timer3) {
          clearTimeout(this.timeOutIds.timer3);
        }
        this.timeOutIds.timer3 = setTimeout(() => {
          // 内嵌组件获取
          let embedded_single = this.$refs["embedded-single"];
          if (embedded_single) {
            let left_height = 0;
            let page_left = this.$refs["page-left"];
            if (page_left) {
              left_height = page_left.clientHeight;
              page_left = null;
            }
            let embedded_merge;
            let header = this.$refs["resizeable-header"];
            let footer = this.$refs["resizeable-footer"];
            this.max_height =
              left_height - header.$el.clientHeight - footer.$el.clientHeight;
            // 若为合并模式
            if (this.vx_get_is_bet_merge) {
              // 获取投注区域
              embedded_merge = this.$refs["bet-mode-zone"];
            }
            let merge_height = 0;
            if (embedded_merge) {
              merge_height = embedded_merge.clientHeight;
            } else if (
              !this.vx_get_is_virtual_bet &&
              !window.$NewMenu.is_esports()
            ) {
              merge_height = 35;
            }
            // 内容计算 内嵌单关高度 + 合并区域的高度
            this.content_height =
              embedded_single.$el.clientHeight + merge_height + 10;
            if (this.content_height) {
              this.single_height = this.content_height;
            } else {
              this.content_height = this.vx_get_is_virtual_bet
                ? this.single_height + 24
                : this.single_height;
            }
            if (
              this.vx_get_bet_list.length > 1 &&
              embedded_single.$data.view_ctr_obj.order_confirm_complete == 0 &&
              !this.vx_is_bet_single
            ) {
              this.content_height += 90;
            }
            embedded_single = null;
            header = null;
            footer = null;
            this.$nextTick(() => {
              let bet_scroll_area = this.$refs["bet-scroll-area"];
              if (bet_scroll_area) {
                bet_scroll_area.$el.style.height = `${this.content_height}px`;
              }
            });
          }
        }, 0);
      } else {
        if (this.timeOutIds.timer4) {
          clearTimeout(this.timeOutIds.timer4);
        }
        this.timeOutIds.timer4 = setTimeout(() => {
          let left_height = 0;
          let page_left = this.$refs["page-left"];
          if (page_left) {
            left_height = page_left.clientHeight;
            page_left = null;
          }
          let embedded_mix = this.$refs["embedded-mix"];
          if (embedded_mix) {
            let header = this.$refs["resizeable-header"];
            let footer = this.$refs["resizeable-footer"];
            this.max_height =
              left_height - header.$el.clientHeight - footer.$el.clientHeight;
            this.content_height = this.$refs["embedded-mix"].$el.clientHeight;

            if (
              this.vx_get_bet_list.length > 1 &&
              embedded_mix.$data.view_ctr_obj.order_confirm_complete == 0
            ) {
              this.content_height += 90;
            }
            if (this.max_height < this.content_height) {
              this.content_height = this.max_height;
            }
            embedded_mix = null;
            header = null;
            footer = null;
          }
        }, 0);
      }
    },
    /**
     * 拖拽完成时间 停止拖拽
     */
    stop_handle() {
      this.dragging = false;
    },
    /**
     * 拖拽中调用
     */
    move_handle(x, y) {
      // 如果x轴为发生变化触发此事件说明是点击操作
      if (this.x == x || this.y == y) return;
      // 拖拽在左侧最大距离后停止拖拽
      if (x > this.max_left) {
        this.x = this.max_left;
      } else if (x < 0) {
        // 拖拽到右侧最小距离停止拖拽
        this.x = 0;
      } else {
        this.x = Math.round(x);
      }

      if (y > this.max_top) {
        this.y = this.max_top;
      } else if (y < 0) {
        this.y = 0;
      } else {
        this.y = Math.round(y);
      }

      // 记录拖拽的位置
      localStorage.setItem(
        "bet_position",
        JSON.stringify({ x: this.x, y: this.y })
      );
      this.dragging = true; // 允许拖拽
    },
    /**
     * 检查是否正在拖拽
     */
    check_drag() {
      return !this.dragging;
    },
    init_pos() {
      this.x = document.body.clientWidth / 2 + 150;
      this.y = document.body.clientHeight / 2 - 280;
    },
    /**
     * 初始化投注框的位置
     */
    init_bet_postion() {
      // 体育投注菜单部分
      let pos = localStorage.getItem("bet_position");
      pos = JSON.parse(pos);
      if (!pos) {
        this.x = document.body.clientWidth / 2 + 150;
        this.y = document.body.clientHeight / 2 - 280;
      } else {
        this.x = pos.x;
        this.y = pos.y;
      }
    },
    // 检查是否有可领取奖券
    getActivityLists({ id = 1, type }) {
      // 如果是首次加载页面并且由用户信息接口发起，则不发起请求
      if (type == "update_bonus" && this.isFirstLoadPage) {
        this.isFirstLoadPage = false;
        return;
      }
      let isMaintaining = _.get(this.vx_get_user, "maintaining");
      // 如果活动处于维护状态，直接去掉小红点
      if (isMaintaining == true) {
        if (this.hasBonusType3 == true) {
          this.hasBonusType3 = false;
        }
        return;
      }
      // 判断是否有活动
      let activityList = _.get(this.vx_get_user, "activityList");
      // 多语言屏蔽活动入口
      if (activityList && activityList.length > 0 && this.lang == "zh") {
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
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data");
          if (code == 200 && data && data.length > 0) {
            // 判断是否有可领取奖券的任务
            this.hasBonusType3 =
              data.find((item) => item.bonusType == 3) || false;
            if (!this.hasBonusType3 && id == 1) {
              this.getActivityLists({ id: 2, type: "2nd" });
            }
          }
        });
      }
    },
    /**
     * 控制活动入口可领取提示的显示和隐藏
     * @param e window.opener 发送的消息对象
     */
    cancelDot(e) {
      if (_.get(e, "data.name") == "cancelActivityDot") {
        // dotHide 1 隐藏 否则显示
        if (e.data.dotHide == 1) {
          this.hasBonusType3 = false;
        } else {
          this.hasBonusType3 = true;
        }
      } else if (_.get(e, "data.name") == "close_win") {
        let obj = _.get(e, "data.obj") || {};
        this.$utils.send_zhuge_event(obj.name, obj.info);
      }
    },
    /**
     * 检查当前代码是不是最新版本
     */
    newVersion() {
      this.new_version = true;
    },
    /**
     * @Description 菜单初始化完成
     * @param {undefined} undefined
     */
    menu_init_done() {
      let nav_list = [...this.nav_list];
      // 如果有电竞
      if ($BaseData.is_mi_2000_open) {
        if (nav_list.findIndex((i) => i.id == 5) == -1) {
          nav_list.splice(1, 0, {
            id: 5,
            tab_name: this.$root.$t("common.e_sports"),
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
      if ($BaseData.is_mi_300_open) {
        if (nav_list.findIndex((i) => i.id == 3) == -1) {
          let e_index = nav_list.findIndex((i) => i.id == 5);
          if (e_index == -1) {
            e_index = 1;
          } else {
            e_index++;
          }
          nav_list.splice(e_index, 0, {
            id: 3,
            tab_name: this.$root.$t("common.virtuals"),
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
      let old_nav = JSON.stringify(this.nav_list);
      let new_nav = JSON.stringify(nav_list);
      // 对比菜单
      if (old_nav != new_nav) {
        this.nav_list = [...nav_list];
      }
      // console.error('ssssss',$BaseData.is_mi_2000_open,'----1111---'+$BaseData.is_mi_300_open)
    },
    // 活动入口小红点定时拉取
    activityTimer() {
      clearInterval(this.activityUpdateTimer);
      // 每隔15分钟拉取一次接口更新活动入口状态
      this.activityUpdateTimer = setInterval(() => {
        this.getActivityLists({ id: 1, type: "setInterval" });
      }, 900000);
    },
    /**
     * @Description 设置视频预加载地址
     * @param {undefined} undefined
     */
    set_video_src(obj) {
      this.video_src = obj.video_src;
      this.animation_src = obj.animation_src;
      // 延迟10s销毁预加载iframe
      if (this.load_video_js_timer) {
        clearTimeout(this.load_video_js_timer);
      }
      this.load_video_js_timer = setTimeout(() => {
        this.video_src = "";
        this.animation_src = "";
      }, 10000);
    },
    /**
     * 菜单状态切换
     */
    on_main_menu_toggle() {
      if (this.bet_loadding) {
        return;
      }
      let cur = this.vx_main_menu_toggle == "mini" ? "mini-normal" : "mini";
      this.vx_set_main_menu_toggle(cur);
      this.vx_set_left_menu_toggle(this.vx_main_menu_toggle != "mini");
      this.update_bet_data();
    },
    /**
     * @description: 开启投注的loadding效果
     */
    is_menu_loadding(data) {
      this.bet_loadding = data;
    },
    /**
     * @Description 浏览器窗口大小改变
     * @param {undefined} undefined
     */
    resize() {
      let is_iframe = this.$utils.is_iframe;
      // 主内容最小宽度
      let main_min_width = 1440;
      // 浏览器宽度
      let inner_width = window.innerWidth;
      // 浏览器高度
      let inner_height = window.innerHeight;
      // if(this.$route.name === 'video'){
      //    inner_height = Math.max(inner_height,712)
      // }
      // 如果浏览器小于主内容最小宽度  减去底部滚动条高度
      if (inner_width < main_min_width) {
        inner_height -= 14;
        this.init_pos();
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
      // console.warn(this.get_unfold_multi_column)
      // console.warn(window.$NewMenu.set_multi_column())
      // console.warn(['search','home'].includes(this.$route.name))
      if (
        this.get_unfold_multi_column &&
        $NewMenu.is_multi_column &&
        ["search", "home"].includes(this.$route.name)
      ) {
        // console.warn('right_width-赋值为0')
        right_width = 0;
      }
      // 中间区域宽度
      let center_width = parseInt(main_width - left_width - right_width);
      // 头部高度
      let header_height = this.$utils.is_iframe
        ? this.vx_get_menu_collapse_status
          ? 36
          : 86
        : 96;
      // 主内容高度（菜单、列表、详情、右侧）
      let content_height = inner_height - header_height - 4;
      // 屏幕大小类
      this.screen_width = main_width < 1440 ? "screen-medium" : "";

      // 设置菜单状态
      let main_menu_toggle = "";
      if (main_width > 1440) {
        main_menu_toggle = "normal";
      } else {
        // 已选择了，则用之前的选择
        if (["mini-normal", "mini"].includes(this.vx_main_menu_toggle)) {
          main_menu_toggle = this.vx_main_menu_toggle;
        } else {
          // 判断地址栏是否收起菜单
          main_menu_toggle = this.$route.query.toggle ? "mini" : "mini-normal";
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

      match_list_tpl_size.set_template_width(list_content_width);
      this.vx_set_layout_size({
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

      this.set_layout_list_size({
        width: main_width,
        height: content_height,
      });
      this.set_layout_list_width(center_width);

      this.vx_set_main_menu_toggle(main_menu_toggle);
      this.vx_set_left_menu_toggle(main_menu_toggle != "mini");
    },
    /**
     * @Description 关闭页面首次加载loading
     * @param {undefined} undefined
     */
    closeLoading(state) {
      if (this.timeOutIds.data_loading_timer) {
        clearTimeout(this.timeOutIds.data_loading_timer);
      }
      this.timeOutIds.data_loading_timer = setTimeout(() => {
        this.dataLoading = state;
      }, 600);
    },
    toggle_merge() {
      this.vx_set_is_bet_merge(!this.vx_get_is_bet_merge);
      if (this.vx_get_is_bet_merge) {
        this.$utils.send_zhuge_event("PC_合并");
      }
      let len = this.vx_get_bet_single_list.length;
      // 取消合并
      if (!this.vx_get_is_bet_merge && len > 1) {
        let id = this.vx_get_bet_single_list[len - 1];
        let bet_single_obj = _.cloneDeep(
          _.get(this.vx_get_bet_single_obj, `${id}`)
        );
        this.vx_bet_single_clear();
        this.vx_set_bet_single_list([id]);
        bet_single_obj.key = id;
        // mode为清除原有的添加最新的
        bet_single_obj.mode = "clear_and_add";
        this.vx_bet_single_obj_attr(bet_single_obj);
      }
    },
    update_bet_data() {
      /* ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...
      type:0表示普通赛事(默认值)，1虚拟赛事 */
      let type = this.vx_get_is_virtual_bet ? 1 : 0;
      let ids = [],
        bet_type;
      if (this.vx_get_is_virtual_bet) {
        bet_type = "vx_get_virtual_bet_obj";
      } else if (this.vx_is_bet_single) {
        bet_type = "vx_get_bet_single_obj";
      } else {
        bet_type = "vx_get_bet_obj";
      }
      for (let obj of Object.values(this[bet_type])) {
        let match_id = _.get(obj, "cs.match_id", "");
        let handicap_id = _.get(obj, "cs.handicap_id", "");
        let play_id = _.get(obj, "cs.play_id", "");
        let oid = _.get(obj, "cs.oid", "");
        if (
          !_.isEmpty(match_id) &&
          !_.isEmpty(handicap_id) &&
          !_.isEmpty(play_id) &&
          !_.isEmpty(oid)
        ) {
          ids.push(`${match_id}-${play_id}-${handicap_id}-${oid}`);
        }
      }
      if (!_.isEmpty(ids)) {
        if ($NewMenu.is_esports()) {
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
            let data = _.get(res, "data.data");
            if (_.isArray(data) && data.length > 0) {
              if (this.vx_get_is_virtual_bet) {
                this.virtual_common.update_bet_item_info(this, data);
              } else {
                this.yabo_common.update_bet_item_info(this, data);
              }
              if (this.vx_is_bet_single) {
                this.$root.$emit(this.emit_cmd.EMIT_INIT_BET_LIST_ITEM_CMD);
              } else {
                this.$root.$emit(this.emit_cmd.EMIT_UPDATE_HOME_AWAY_CMD);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },

  destroyed() {
    // 接收开启loadding指令
    this.$root.$off(
      this.emit_cmd.EMIT_OPEN_MENU_LOADDING_CMD,
      this.open_menu_loadding
    );
    // 接收关闭loadding指令
    this.$root.$off(
      this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD,
      this.close_menu_loadding
    );
    // 更新用户余额
    this.$root.$off(this.emit_cmd.EMIT_GET_BALANCE_CMD, this.get_balance);
    this.$root.$off(this.emit_cmd.EMIT_OPEN_SINGLE_BET, this.open_single_bet);
    //计算投注框高度
    this.$root.$off(
      this.emit_cmd.EMIT_COMPUTED_BET_HEIGHT_CMD,
      this.computed_bet_height
    );
    this.$root.$off("update-bonus", this.getActivityLists);
    this.$root.$off("request_user_banner", this.newVersion);
    this.$root.$off("menu_init_done", this.menu_init_done);
    this.$root.$off("is_menu_loadding", this.is_menu_loadding);
    this.$root.$off("set_pre_video_src", this.set_video_src);
    this.$root.$off("close_home_loading", this.closeLoading);
    // 重新计算投注框高度
    this.$root.$off("toggle-handle", this.toggle_handle);
    this.$root.$off("emit_list_on_scroll", this.list_on_scroll);
    this.$root.$off("right_details_on_scroll", this.list_on_scroll);
    //获取投注数据(内嵌mini切换或者语言发生变化时调用)
    this.$root.$off(
      this.emit_cmd.EMIT_UPDATE_BET_DATA_CMD,
      this.update_bet_data
    );
    window.removeEventListener("message", this.cancelDot);
    window.removeEventListener("resize", this.resize);

    window.removeEventListener("mousedown", this.globalclick);
    clearInterval(this.activityUpdateTimer);
    for (let item in this.timeOutIds) {
      if (item) {
        clearTimeout(this.timeOutIds[item]);
      }
    }
    clearTimeout(this.load_video_js_timer);
    clearTimeout(this.bet_is_handle_status_timer);
    if (this.activity_timer) {
      clearTimeout(this.activity_timer);
    }
  },
  beforeDestroy() {
    clearTimeout(this.init_reset_time);
    clearInterval(this.menu_init_time);
    clearInterval($BaseData.clear_menu_init_time());
    clearTimeout($BaseData.clear_reset_init_time());
  },
};
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

