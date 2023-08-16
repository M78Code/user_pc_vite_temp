<!-- 页面头部容器-->
<template>
  <!-- v-show="route.params.video_size != 1" -->
  <div class="yb-layout-margin-header" :class="{ 'activity_bonus': has_bonus_type }">
    <site-header  v-bind="site_header_data"
      @navigate="navigate" />
    <!-- 第二行 -->
    <div :class="['header-item item2 row items-center', { 'search-off': !global_switch.search_switch }]"
      :style="search_isShow ? 'z-index:900;' : ''">
      <!-- 搜索 -->
      <header-search />
      <!-- 公告滚动组件 -->
      <marquee v-if='!get_search_status' @navigate="navigate" />
      <!-- 占位盒子 -->
      <div :style="`width:${is_iframe ? 10 : 14}px`"></div>
      <!-- 广告 & 语言主题等切换 -->
      <header-select />
    </div>
    <timer />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import store from "src/store-redux/index.js";
/** 组件 */
import siteHeader from 'project_path/src/components/site-header/site-header.vue'
import headerSearch from 'project_path/src/components/site-header/header-search.vue'
import marquee from "project_path/src/components/marquee/marquee.vue";
import headerSelect from 'project_path/src/components/site-header/header-select.vue'
import timer from "project_path/src/components/site-header/timer.vue"

const props = defineProps({
  /** 
   * 是否有小红点提示
   */
  has_bonus_type: {
    type: Boolean,
    default: false
  }
})

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
    {
      "id": 9,
      "tab_name": "任务中心",
      "img_src": "https://image.gredfged.com/group1/M00/15/C3/CgURtWJGfT-ABbXtAAA2DscP7Dg590.png",
      "class": "activity_center animate-activity-entry activity_dot_bonus",
      "path": "/activity",
      "_blank": true
    },
  ];
  // 判断是否有活动
  let activityList = get(computed_data.get_user, "activityList");
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
      imgUrl || require("app/public/image/activity_imgs/imgs/gift_package.png");
    nav_list.push(tab);
    activityList.forEach((item) => {
      data_ref.activityIds += item.activityId + ",";
    });
    activityTimer();
    activity_timer = setTimeout(
      () => getActivityLists({ id: 1, type: "init_nav" }),
      1000
    );
  }
  if (type != 2) {
    // 运营位专题页
    special_page();
  }

  // 运营位弹窗,如果当前是最新版本就直接展示弹窗，如果不是，就延迟几秒再展示
  if (type == null) {
    // type 为 null 是自然触发，如果 == 1就是导航栏二次触发，不要更新这里
    if (new_version) {
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
  // useMittEmit(MITT_TYPES["close_home_loading"], false);

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

// // 检测到语言变化之后初始化导航
watch(
  () => [computed_data.lang],
  () => {
    init_site_header(2);
  }
);

// 首次加载页面的时候 activityList 会出现没值的情况，所以等有值了再初始化一下导航
watch(
  () => computed_data.get_user?.activityList,
  (new_) => {
    // 没渲染上的时候才再次调用
    if (data_ref.hasActivity != true) {
      data_ref.isMaintaining = get(computed_data.get_user, "maintaining");
      if (new_ && new_.length > 0) {
        init_site_header(1);
      }
    }
  }
);
//全局点击事件
watch(
  () => computed_data.get_global_click,
  () => {
    data_ref.showActivity = false;
  }
);

//全局开关
watch(
  () => computed_data.get_global_switch.activity_switch,
  () => {
    init_site_header();
  }
);

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
</script>