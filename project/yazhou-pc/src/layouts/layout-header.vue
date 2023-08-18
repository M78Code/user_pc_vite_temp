<!-- 页面头部容器-->
<template>
  <!-- v-show="route.params.video_size != 1" -->
  <div class="yb-layout-margin-header c-site-header relative-position" :class="{ 'activity_bonus': has_bonus_type, 'is-iframe': is_iframe }">
    <site-header v-bind="site_header_data" @navigate="navigate" />
     <!-- 第二行 -->
     <div :class="['header-item item2 row items-center', { 'search-off': !global_switch.search_switch }]"
      :style="search_isShow ? 'z-index:900;' : ''">
      <!-- 搜索 -->
      <header-search />
      <!-- 公告滚动组件 -->
      <marquee v-if='!search_isShow' @navigate="navigate" />
      <!-- 占位盒子 -->
      <div :style="`width:${is_iframe ? 10 : 14}px`"></div>
      <!-- 广告 & 语言主题等切换 -->
      <header-select />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from "vue-i18n";

import store from 'src/store-redux/index.js'
import utils from "src/core/utils/utils.js"

/** 组件 */
import siteHeader from 'project_path/src/components/site-header/site-header.vue'
import headerSearch from 'project_path/src/components/site-header/header-search.vue'
import marquee from "project_path/src/components/marquee/marquee.vue";
import headerSelect from 'project_path/src/components/site-header/header-select.vue'
// import timer from "project_path/src/components/site-header/timer.vue"

const props = defineProps({
  /** 
   * 是否有小红点提示
   */
  has_bonus_type: {
    type: Boolean,
    default: false
  }
})

/** 国际化 */
const { t } = useI18n();

/** mock 菜单数据 */
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
  {
    "id": 9,
    "tab_name": "任务中心",
    "img_src": "https://image.gredfged.com/group1/M00/15/C3/CgURtWJGfT-ABbXtAAA2DscP7Dg590.png",
    "class": "activity_center animate-activity-entry activity_dot_bonus",
    "path": "/activity",
    "_blank": true
  },
]

/** 
 * siteHeader组件props数据
 */
const site_header_data = reactive({
  /** 
 * 菜单数据
 * 从菜单类拿 get
 */
  nav_list,
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
})

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
  let _window_width = (['/activity', '/activity_aegis'].includes(_path)) ? 1217 : 1000;
  if (_path == '/match_results') {
    _window_width = 1170
  }
  let _window_height = 650;
  if (['/activity', '/activity_aegis'].includes(_path)) {
    _window_height = 800;
    let maintaining = lodash.get(vx_get_user.value, "maintaining");
    if (maintaining && maintaining == true) {
      _path = '/activity_aegis';
    }
  }

  let _window_offset_left = (screen.width - _window_width) / 2;
  let _window_offset_top = (screen.height - _window_height) / 2;
  let url = "";
  if (_path == "/bet_record") {
    url = _path;
    let hide_logo_icon = ss.get('hide_logo_icon');
    url = router.resolve({ path: url }).href
    const searchParams = new URLSearchParams('');
    if (hide_logo_icon) {
      // if(url.includes('?')){
      //   url = url +'&i_h=1&t='+new Date().getTime();
      // } else {
      //   url = url +'?i_h=1&t='+new Date().getTime();
      // }
      searchParams.set('i_h', 1);
    }
    // 在#/前增加参数api,i_h
    searchParams.set('t', new Date().getTime());
    let url_temp_p = searchParams.toString();
    // 组合url参数
    url = '/' + (url_temp_p ? ('?' + url_temp_p) : '') + url.substr(url.indexOf('#/'))

    // url = '/'+url.substr(url.indexOf('#/'))
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
  let hide_logo_icon = ss.get('hide_logo_icon');
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
    url = '/' + (url_temp_p ? ('?' + url_temp_p) : '') + url.substr(url.indexOf('#/'))
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

/** stroe仓库 */
const store_data = store.getState()
/** 
 * 全局开关 default: object
 * 路径: project_path\src\store\module\global.js
 */
const { global_switch } = store_data.globalReducer
/** 
* 是否显示搜索组件 default: false
* 路径: project_path\src\store\module\search.js
*/
const { search_isShow } = store_data.searchReducer


/** 是否内嵌 */
const is_iframe = ref(utils.is_iframe)

</script>

<style lang="scss" scoped>
@import 'project_path/src/components/site-header/site-header.scss';
</style>