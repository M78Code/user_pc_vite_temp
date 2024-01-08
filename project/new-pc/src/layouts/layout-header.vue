<!-- 页面头部容器-->
<template>
  <!-- v-show="route.params.video_size != 1" -->
  <div class="yb-layout-margin-header c-site-header relative-position"
    :class="{ 'activity_bonus': has_bonus_type, 'is-iframe': is_iframe }"
    :style="page_style">
    <site-header v-bind="site_header_data" @navigate="navigate" />
    <!-- 第二行 -->
    <div style="display:none">{{SearchPCClass.update_time}}</div>
    <div :class="['header-item item2 row items-center', { 'search-off': !globalAccessConfig.get_activitySwitch() }]"
      :style="SearchPCClass.search_isShow ? 'z-index:900;' : ''">
      <!-- 搜索 -->
      <header-search v-if="!SearchPCClass.search_isShow" />
      <searchCom v-if="SearchPCClass.search_isShow" />
        <!-- <bevisHeaderSearch class="layout-header-search"></bevisHeaderSearch> -->
      <!-- 公告滚动组件 -->
      <marquee-cst v-if='!SearchPCClass.search_isShow' @navigate="navigate" />
      <!-- 占位盒子 -->
      <div :style="`width:${is_iframe ? 10 : 14}px`"></div>
      <!-- 广告 & 语言主题等切换 -->
      <header-select />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import lodash from 'lodash'
import { useRoute, useRouter } from "vue-router";

//import store from 'src/store-redux/index.js'
import { SessionStorage} from 'src/output/index.js'
import {SearchPCClass} from "src/output/project/common/pc-common.js";

import UserCtr from "src/core/user-config/user-ctr.js";
import globalAccessConfig from "src/core/access-config/access-config.js"
import { i18n_t } from "src/boot/i18n.js"
import { get_server_file_path } from "src/core/file-path/file-path.js"
import { api_activity, api_account } from "src/api/index";
import { useMittOn, MITT_TYPES } from "src/core/mitt/"
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
/** 组件 */
import siteHeader from 'src/base-pc/components/site-header/site-header.vue'
import headerSearch from 'src/base-pc/components/site-header/header-search.vue'

import bevisHeaderSearch from "src/base-pc/components/site-header/bevis/bevis-header-search.vue"

import marqueeCst from "src/base-pc/components/marquee/marquee-cst.vue";
import headerSelect from 'src/base-pc/components/site-header/header-select.vue'
// import timer from "src/base-pc/components/site-header/timer.vue"
import gift_package from '/yazhou-pc/image/common/activity_banner/gift_package.png'
import { compute_css_variables } from "src/core/css-var/index.js"
import BaseData from "src/core/base-data/base-data.js";
import searchCom from 'src/components/search/search-3/index.vue';

const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'site-header' })

const props = defineProps({
  /** 
   * 是否有小红点提示
   */
  has_bonus_type: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close_home_loading'])


/** 路由对象 */
const route = useRoute()
/** 路由实例 */
const router = useRouter()



/** 是否内嵌 */
const is_iframe = ref(utils_info.is_iframe)

/** 
 * siteHeader组件props数据
 */
const site_header_data = reactive({
  /** 
 * 菜单数据
 * 从菜单类拿 get
 */
  nav_list: [],
  /** 
   * 专题页图片url
   * 取 special_img_url
   */
  img_url: "",
  /** 
   * 专题页判断跳转到哪个链接
   * 取 special_host_url
   */
  host_url: "",
  /** 
   * 专题页0：无连接，1：内部导航，2：弹窗连接 
   * 取 special_url_type
   */
  url_type: "",
  /** 是否有活动入口 */
  has_activity: false,
  emit_lsit:{}
})

/** 已开启的活动 id */
const activityIds = ref('')
/** 是否是首次加载页面 */
const isFirstLoadPage = ref(true)
/** 是否有小红点提示 */
const hasBonusType3 = ref(false)
// TODO: useMittOn('update-bonus', this.getActivityLists);

onMounted(()=>{
  init_site_header()
  site_header_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_LANG_CHANGE, init_site_header ).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_MENU_INIT_DONE, menu_init_done ).off,
  }
})

/** 检查是否有可领取奖券 */
function getActivityLists({ id = 1, type }) {
  // 如果是首次加载页面并且由用户信息接口发起，则不发起请求
  if (type == "update_bonus" && isFirstLoadPage.value) {
    isFirstLoadPage.value = false;
    return;
  }
  let isMaintaining = lodash.get(UserCtr.get_user(), 'maintaining');
  // 如果活动处于维护状态，直接去掉小红点
  if (isMaintaining == true) {
    if (hasBonusType3.value == true) {
      hasBonusType3.value = false;
    }
    return
  };
  // 判断是否有活动
  let activityList = lodash.get(UserCtr.get_user(), 'activityList');
  // 多语言屏蔽活动入口
  if (activityList && activityList.length > 0 && UserCtr.lang == 'zh') {
    let param = new FormData();
    // 检测两个活动是否存在以及活动状态不能是未开始和已结束
    let daily = activityList.find(item => item.activityId == '10007' && item.period == 2) || null;
    let growup = activityList.find(item => item.activityId == '10008' && item.period == 2) || null;
    if (!daily && !growup) return
    // 1 每日任务 2成长任务
    param.append('actId', id);
    api_activity.get_activity_list_details(param).then(res => {
      let code = lodash.get(res, 'data.code');
      let data = lodash.get(res, 'data.data');
      if (code == 200 && data && data.length > 0) {
        // 判断是否有可领取奖券的任务
        hasBonusType3.value = data.find(item => item.bonusType == 3) || false;
        if (!hasBonusType3.value && id == 1) {
          getActivityLists({ id: 2, type: "2nd" })
        };
      }
    });
  }
}
/** 活动入口状态提示更新定时器 */
let activityUpdateTimer = null
/** 活动入口小红点定时拉取 */
function activityTimer() {
  clearInterval(activityUpdateTimer);
  // 每隔15分钟拉取一次接口更新活动入口状态
  activityUpdateTimer = setInterval(() => {
    getActivityLists({ id: 1, type: "setInterval" });
  }, 900000);
}

const activity_timer = ref(null)
/***
 * 运营位专题页
 */
function special_page() {
  let token = UserCtr.get_user_token();
  api_account.get_BannersUrl({ 'type': 7, token }).then(res => {
    let code = lodash.get(res, 'data.code');
    let data = lodash.get(res, 'data.data');
    if (code == 200) {
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item.tType && item.tType == 7) {
            // 获取图片地址
            site_header_data.img_url = get_server_file_path(item.imgUrl);
            site_header_data.host_url = item.hostUrl;
            site_header_data.url_type = item.urlType;
          }
        })
      }
    }
  })
}
/** 是否是最新版本 */
const new_version = ref(false)
// TODO: useMittOn('request_user_banner', this.newVersion);
/**
 * 检查当前代码是不是最新版本
 */
function newVersion() {
  new_version.value = true;
}
// mitt request_user_banner
/**  存储 setTimeOut id 方便统一销毁 */
const timeOutIds = reactive({})
/** 上一次打开弹窗的时间 */
const showActivityTime = ref(SessionStorage.get('showActivityTime'))
/** 弹窗图片是否可以点击跳转 */
const allowClick = ref(false)
/** 活动弹框显隐 */
const showActivity = ref(false)
const userBannerTimer = ref(i18n_t('common.auto_close').replace('%s', 5))
/***
 * 运营位活动弹窗
 */
function activity_dialog() {
  let token = UserCtr.get_user_token()
  api_account.get_BannersUrl({ 'type': 5, token }).then(res => {
    let code = lodash.get(res, 'data.code');
    let data = lodash.get(res, 'data.data');
    if (code == 200) {
      let isShow = false;
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item.tType && item.tType == 5) {
            // 去掉一个自然日展示一次的判断，有值就展示
            if (showActivityTime.value) {
              // 判断日期如果不在同一天就展示弹窗
              if (new Date(showActivityTime.value).getDate() !== new Date().getDate()) {
                isShow = true
              }
            } else {
              isShow = true
              SessionStorage.set('showActivityTime', new Date().getTime())
            }
            // 获取图片地址
            site_header_data.img_url = get_server_file_path(item.imgUrl);
            site_header_data.host_url = item.hostUrl;
            site_header_data.url_type = item.urlType;
            // 是否允许点击跳转 ayx_act 爱游戏  act1 乐鱼
            allowClick.value = ['act', 'zr', 'ayx_act', 'act1'].includes(item.hostUrl) || item.hostUrl != '';
          }
        })
      } else {
        isShow = false;
      }
      showActivity.value = isShow;
      if (showActivity.value) {
        // 5秒后自动消失
        let time = 5;
        userBannerTimer.value = i18n_t('common.auto_close').replace('%s', time);
        let timer = setInterval(() => {
          time--;
          userBannerTimer.value = i18n_t('common.auto_close').replace('%s', time);
          if (time == 0) {
            showActivity.value = false;
            clearInterval(timer);
          }
        }, 1000);
      }
    }
  })
}

/**
 * @Description 菜单初始化完成
 * @param {undefined} undefined
 */
function menu_init_done() {
  let nav_list = [...site_header_data.nav_list]
  // 如果有电竞
  const { is_mi_2000_open, is_mi_300_open } = BaseData
  if (is_mi_2000_open) {
    if (nav_list.findIndex(i => i.id == 5) == -1) {
      nav_list.splice(1, 0, { id: 5, tab_name: i18n_t("common.e_sports"), path: "/e_sport" });
    }
  }
  // 如果有虚拟体育
  if (is_mi_300_open) {
    if (nav_list.findIndex(i => i.id == 3) == -1) {
      let e_index = nav_list.findIndex(i => i.id == 5)
      if (e_index == -1) {
        e_index = 1
      } else {
        e_index++
      }
      nav_list.splice(e_index, 0, { id: 3, tab_name: i18n_t("common.virtuals"), path: "", class: 'tab_virtaul_sport' });
    }
  } else {
    let index = nav_list.findIndex(i => i.id == 3)
    if (index > -1) {
      nav_list.splice(index,1)
    }
  }
  let old_nav = JSON.stringify(site_header_data.nav_list)
  let new_nav = JSON.stringify(nav_list)
  // 对比菜单
  if(old_nav != new_nav){
    site_header_data.nav_list = [...nav_list]
  }
}

/**
 * @description 设置顶部菜单
 * @param {number} type  类型(null-自然触发，1-导航栏二次触发，2-切换语言)
 */
function init_site_header(type = null) {
  console.error('init_site_header')
  let nav_list = [
    { id: 1, tab_name: i18n_t("common.sports_betting"), path: "/home" }, //体育投注
    { id: 2, tab_name: i18n_t('common.note_single_history'), path: "/bet_record", _blank: true }, //注单历史
    // { id: 8, tab_name: i18n_t("common.e_sports"), path: "" }, //电子竞技
    //{ id: 3, tab_name: i18n_t("common.winning_champions"), path: "" }, //优胜冠军
    { id: 4, tab_name: i18n_t("common.amidithion"), path: "/match_results", _blank: true }, //赛果
    // { id: 5, tab_name: i18n_t("common.score_center"), path: "" }, //比分中心
    // { id: 6, tab_name: i18n_t("common.statistic_analysis"), path: `${details.signal_url}/kaihongman/${src_lang}`,_blank:true }, //统计分析
    { id: 7, tab_name: i18n_t("common.sports_betting_rules"), path: "/rule", _blank: true }, //体育竞猜规则
  ];
  // 判断是否有活动
  let activityList = lodash.get(UserCtr.get_user(), 'activityList') || [];
  // 多语言屏蔽活动入口
  if (activityList && activityList.length > 0 && UserCtr.lang == 'zh' && globalAccessConfig.get_activitySwitch()) {
    site_header_data.hasActivity = true;
    // 向顶部导航栏添加活动入口
    let tab = { id: 9, tab_name: "任务中心", img_src: '', class: "activity_center animate-activity-entry activity_dot_bonus", path: "/activity", _blank: true };
    // 获取活动入口的图片
    let imgUrl = activityList.find(item => item.pcUrl != '');
    if (imgUrl) {
      imgUrl = imgUrl.pcUrl;
    }
    imgUrl = get_server_file_path(imgUrl);
    // 活动入口的图片，如果接口未返回就用默认图片
    tab.img_src = imgUrl || gift_package;
    nav_list.push(tab);
    activityList.forEach(item => {
      activityIds.value += item.activityId + ',';
    });
    activityTimer();
    activity_timer.value = setTimeout(() => getActivityLists({ id: 1, type: "init_nav" }), 1000)
  }
  if (!type) {
    console.error('运营位专题页')
    // 运营位专题页 
    special_page()
  }

  // 运营位弹窗,如果当前是最新版本就直接展示弹窗，如果不是，就延迟几秒再展示
  if (type == null) { // type 为 null 是自然触发，如果 == 1就是导航栏二次触发，不要更新这里
    if (new_version.value) {
      timeOutIds.timer2 = setTimeout(activity_dialog, 3000);
    } else {
      if (timeOutIds.timer2) {
        clearTimeout(timeOutIds.timer2);
      }
      timeOutIds.timer2 = setTimeout(activity_dialog, 5000);
    }
  }
  site_header_data.nav_list = nav_list;
  emit('close_home_loading', false);
  // 菜单初始化 因为菜单是去轮询的 so
  // 因为设置菜单是500s
  // set_menu_init_time(600)

  // init_reset_time = setTimeout(()=>{
  //   // 本身商户的设置有缓存 所以频率太快
  //   set_menu_init_time(5000)
  //   clear_init_reset_time()
  // },2000)
}
let init_reset_time = null
function clear_init_reset_time () {
  if (init_reset_time) {
    clearTimeout(init_reset_time)
    init_reset_time = null
  }
}

let menu_init_time = null
function clear_menu_init_time () {
  if (menu_init_time) {
    clearTimeout(menu_init_time)
    menu_init_time = null
  }
}


onUnmounted(()=>{
  clear_init_reset_time()
  clear_menu_init_time()
  Object.values(site_header_data.emit_lsit).map((x) => x());
})

/**
 * 定时请求菜单
 */
// function set_menu_init_time(number){
//   clear_menu_init_time()
//   // 菜单初始化 因为菜单是去轮询的
//   menu_init_time = setInterval(menu_init_done,number)
// }

/**
 * @description 导航路由跳转
 * @param {obj} 路由数据
 * 不同的路由根据具体的需求，有不同的打开方式
 * 弹出式窗口有不同大小之分，具体视需求UI而定
 * /rule 体育规则
 * /virtual 虚拟体育
 * /e_sport 电子竞技
 * /bet_record 注单历史
 * ^/activity 活动相关
 * /activity_aegis 活动维护页
 */
function navigate(obj) {
  let _path = obj.path;
  if (route.name == "rule" || !_path) {
    return;
  }
  // 改为欧洲杯大师赛路径
  let _window_width = (['/activity_aegis'].includes(_path)) ? 1217 : 1000;
  if (_path == '/match_results') {
    _window_width = 1170
  }
  if (_path == '/activity') {
    _window_width = 1400
  }
  if (_path == "/bet_record") {
    _window_width = 1440
  }
  let _window_height = 650;
  if (['/activity', '/activity_aegis'].includes(_path)) {
    _window_height = 800;
    let maintaining = lodash.get(UserCtr.get_user(), "maintaining");
    if (maintaining && maintaining == true) {
      _path = '/activity_aegis';
    }
  }

  let _window_offset_left = (screen.width - _window_width) / 2;
  let _window_offset_top = (screen.height - _window_height) / 2;
  let url = "";
  if (_path == "/bet_record") {
    url = _path;
    let hide_logo_icon = SessionStorage.get('hide_logo_icon');
    url = router.resolve({ path: url }).href
    const searchParams = new URLSearchParams('');
    if (hide_logo_icon) {
      searchParams.set('i_h', 1);
    }
    // 在#/前增加参数api,i_h
    searchParams.set('t', new Date().getTime());
    let url_temp_p = searchParams.toString();
    // 组合url参数
    // TODO: 临时调试用
    // let win_url = window.location.href.replace('/home', '/bet_record')
    url = // '/' + (url_temp_p ? ('?' + url_temp_p) : '') + url.substr(url.indexOf('#/'))

    show_record(
      url,
      _window_height,
      _window_width,
      _window_offset_top,
      _window_offset_left
    );
    return;
  }

  // 增加参数
  let hide_logo_icon = SessionStorage.get('hide_logo_icon');
  if (_path.includes("http")) {
    url = _path;
    if (hide_logo_icon) {
      if (url.includes('?')) {
        url = url + '&i_h=1&t=' + new Date().getTime();
      } else {
        url = url + '?i_h=1&t=' + new Date().getTime();
      }
    }
  } else {
    // 本地路径的时候
    url = router.resolve({ path: _path }).href;
    // 在#/前增加参数api,i_h
    const searchParams = new URLSearchParams('');

    if (hide_logo_icon) {
      searchParams.set('i_h', 1);
    }
    searchParams.set('t', new Date().getTime());
    let url_temp_p = searchParams.toString();
    // 组合url参数
    url = (url_temp_p ? ('?' + url_temp_p) : '') + url.substr(url.indexOf('#/'))

    url = window.location.pathname + url
  }

  if (obj._blank) {
    window.open(
      url,
      "",
      `height=${_window_height}, width=${_window_width}, top=${_window_offset_top}, left=${_window_offset_left}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
    );
  } else {
    location.href = url;
  }
}
/**
   * 打开注单历史窗口
   */
  const show_record = (
    path,
    _window_height,
    _window_width,
    _window_offset_top,
    _window_offset_left
  ) => {
    UserCtr.show_fail_alert();
    if (UserCtr.is_invalid) {
      return;
    }
    if (!UserCtr.get_user()) {
      set_show_login_popup({
        isShow: true,
        redirect: "bet_order_history",
      });
    } else {
      window.open(
        path,
        "",
        `height=${_window_height}, width=${_window_width}, top=${_window_offset_top}, left=${_window_offset_left}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
      );
    }
  }
  /** 保存显示搜索组件状态 */
const set_show_login_popup = (data) =>{
//   store.dispatch({
//     type: 'SET_SHOW_LOGIN_POPUP',
//     data
// })
}

</script>

<style lang="scss" scoped>

.layout-header-search {
  margin-right: 13px;
}
</style>
<!--
 <style lang="scss" scoped>
@import 'src/base-pc/components/site-header/site-header.scss';
</style>-->
src/output/index.js