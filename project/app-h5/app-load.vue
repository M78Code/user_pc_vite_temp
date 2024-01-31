<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 项目页面入口
-->
<template>
  <!-- 右侧菜单 -->
  <div :class="['bw3', { rightMenu: right_menu_show }]" @click.stop="appclick($event)" >
    <ws />
    <!-- 页面路由开始 页面路由开始 页面路由开始 -->
    <!-- 页面路由开始 -->
    <router-view />
    <!-- 预加载页面 -->
    <iframeBeforeLoading />
  </div>
</template>

<script setup>
// websocket Log文件
import ws from "src/core/data-warehouse/ws/ws-ctr/ws.vue"
import iframeBeforeLoading from "src/components/iframe-before-loading/iframe-before-loading.vue";
import { wslog } from "src/core/log/";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { compute_css_variables } from "src/core/css-var/index.js"
import { PageSourceData, GlobalAccessConfig, ServerTime,set_css ,set_theme_style_sheet_by_css_obj,pre_load_img, BUILDIN_CONFIG} from "src/output/index.js";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import { reactive, onBeforeMount, onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

import './src/css/common/app.scss'
import './src/css/common/public.scss'
import './src/css/common/common.scss'
import { pre_load_video } from 'src/core/pre-load/module/pre-load-video.js'

window.wslog = wslog;
// const BUILDIN_CONFIG = window.BUILDIN_CONFIG;
const { CURRENT_ENV } = BUILDIN_CONFIG;

const time_str = ref('');
 
const right_menu_show = ref(false);
// 公共主题色
const page_style = reactive({
  style:''
});
const emitters = ref(null)

let vue_hidden_run_flg = false;
let background_run_time = "";

// 代表今日足球下边距离触发埋点的时间
let buried_time = 0;

let timer, timer2, timer3;

const route = useRoute();

onMounted(()=>{
  pre_load_img({key:"common_sport_detail_image"})
  clearTimeout(timer3);
  timer3 = setTimeout(() => {
    pre_load_video.load_player_js('old')
  }, 5000);
    emitters.value = {
    // 接受ws断开命令
    emitter_1: useMittOn(
      MITT_TYPES.EMIT_THE_THEME_CHANGE,
      set_global_theme_change
    ).off
  };

  
})

watch(
  () => route.name,
  () => {
    PageSourceData.set_route_name(route.name)
    PageSourceData.set_route_parmas(route.params)
  },
  { immediate: true }
);

// 设置主题
const set_global_theme_change = (a) => {
 

  set_theme_style_sheet_by_css_obj(global_color_obj())
}

onBeforeMount(() => {
  // 定时器
  timer = null;
  timer2 = null;
  // 设置商户样式
  // 复刻版默认中文
  LocalStorage.set('lang','zh')
  // this.init_version_name();
  on_listeners();
  // 公共主题色
  // page_style.style = global_color_obj()
  set_global_theme_change()
  // 初始化启动日志系统--开发模式时日志打开
  // window.wslog = new WsLog(window.env.NODE_ENV === 'development');
  if (window.wslog.wsRun) {
    timer = setInterval(() => {
      time_str.value = new Date().Format("yyyy-MM-dd hh:mm:ss.S");
    }, 100);
  }
  // 发送日志
  // window.wslog.sendMsg('xxx');
  // GlobalAccessConfig.set_vue_hidden_run(false);
  timer2 = setTimeout(() => {
    vue_hidden_run_flg = true;
  }, 4000);

  let url_search = SEARCH_PARAMS.init_param;
  let vlg = url_search.get("vlg");
  if (vlg) {
    sessionStorage.setItem("vlg", vlg);
  }

  // 移动端设备下 url参数 vlg=1 开启vconsole调试
  if (sessionStorage.getItem("vlg")) {
    const script = document.createElement("script");
    let BUILD_VERSION = window.BUILDIN_CONFIG.BUILD_VERSION;

    script.src = `${BUILD_VERSION ? "/" + BUILD_VERSION : ""
      }/other-assets/lib/js/vconsole.min.js`;
    script.async = false;

    script.onload = function () {
      new VConsole();
    };
    document.head.appendChild(script);
  }

  // 复刻版默认设置中文
  LocalStorage.set('lang','zh')
});


onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
  // 释放日志功能对象
  if (window.wslog && window.wslog.destroyed) {
    window.wslog.beforeUnmount();
  }
  window.wslog = null;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  clearTimeout(timer2);
  timer2 = null;
  clearTimeout(timer3);
  timer3 = null;
  off_listeners();
});


// 公共全局主题色
function global_color_obj() {
  // 背景色
  let bg = compute_css_variables({ category: 'global', module: 'background' })
  // 边框色
  let bd = compute_css_variables({ category: 'global', module: 'border' })
  // 字体色
  let tc = compute_css_variables({ category: 'global', module: 'color' })
  // 渐变色
  let lg = compute_css_variables({ category: 'global', module: 'linear-gradient' })
  return { ...bg, ...bd, ...tc, ...lg }
}

/**
 *@description 事件preventDefault函数执行体
 */
function event_listener_preventDefault(event) {
  event.preventDefault();
}

// /**
//  *@description 页面可见性变化的处理函数
//  */
// function visibilitychange_handle() {
//   if (!vue_hidden_run_flg) {
//     return false;
//   }
//   let is_hidden = document.visibilityState == "hidden";

//   if (is_hidden) {
//     window.DOCUMENT_HIDDEN = new Date().getTime();
//   } else {
//     // 获取 焦点后 ，页面激活 ，次开关打开 ，HTTP,WS 就会自动 打开开关
//     window.DOCUMENT_HIDDEN = "";
//   }
//   // // 设置当前页面是否后台运行中状态
//   // GlobalAccessConfig.set_vue_hidden_run(is_hidden);

//   //页面失去焦点 ，隐藏   后台运行
//   if (is_hidden) {
//     background_run_time = new Date().getTime();
//     // 在后台运行超过 over_timer 分钟后才广播刷新数据指令
//   } else {
//     // 页面 唤起  这里流程分 二种：
//     // 流程一：   离开不到30分钟 ，  列表或者详情 ，监听到 页面聚焦时间 变更 ，重新拉取当前的接口
//     // 流程二：   离开超过30分钟 ，  页面直接刷新 重走流程
//     // 30分钟  重载刷新  页面
//     let over_timer = 30 * (60 * 1000);
//     let now_time = new Date().getTime();
//     // 在后台共运行了多少时间
//     let run_time = now_time - background_run_time;
//     // 页面需要 重载刷新
//     let need_reload = run_time > over_timer;
//     //如果需要 重载刷新
//     if (need_reload) {
//       window.location.reload();
//     } else {
//       // 站点 tab 休眠状态转激活  ，

//       useMittEmit(MITT_TYPES.EMIT_VISIBILITYCHANGE_EVENT);
//     }
//   }
// }
/**
 * @Description 阻止双击放大
 * @param {undefined} undefined
 */
function appclick(e) {
  e.preventDefault();
  // 全局点击次数+1
  // set_global_click_count();
}
// 添加相应监听事件
function on_listeners() {
  // // 监听页面是否转入休眠状态
  // document.addEventListener(
  //   "visibilitychange",
  //   visibilitychange_handle
  // );
  // document.addEventListener("pagehide", visibilitychange_handle);
  document.addEventListener(
    "gesturestart",
    event_listener_preventDefault
  );
  document.addEventListener(
    "gesturechange",
    event_listener_preventDefault
  );
  document.addEventListener(
    "gestureend",
    event_listener_preventDefault
  );

  // 阻止双击变大
  document.addEventListener(
    "click",
    event_listener_preventDefault,
    true
  );
}
// 移除相应监听事件
function off_listeners() {
  // document.removeEventListener(
  //   "visibilitychange",
  //   visibilitychange_handle
  // );
  // document.removeEventListener("pagehide", visibilitychange_handle);
  document.removeEventListener(
    "gesturestart",
    event_listener_preventDefault
  );
  document.removeEventListener(
    "gesturechange",
    event_listener_preventDefault
  );
  document.removeEventListener(
    "gestureend",
    event_listener_preventDefault
  );
  document.removeEventListener("click", event_listener_preventDefault);
}
// // 客户端-获取紧急开关配置
// GlobalAccessConfig.init()
//服务器时间
ServerTime.get_server_time()
</script>

<style lang="scss">
* {
  /* 禁止火狐浏览器下显示滚动条 */
  scrollbar-width: none;
}

.rightMenu {
  -webkit-overflow-scrolling: unset !important;
}
</style>src/core/utils/common/module/web-storage.js