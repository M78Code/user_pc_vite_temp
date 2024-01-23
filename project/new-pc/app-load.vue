<template>
  <div class="full-height" @click="set_global_click">
    <ws />
    <!-- 页面路由开始 -->
    <router-view />
    <div class="error-data">{{ GlobalSwitchClass.error_data }}</div>
    <div style="display:none">{{ GlobalSwitchClass.global_switch_version }}</div>
    <div id="v-tooltip"></div>
  </div>
</template>
<script setup>
import "src/base-pc/core/globel-mitt";
import { PageSourceData ,GlobalSwitchClass,set_theme_style_sheet_by_css_obj} from "src/output/index.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import { wslog, httplog } from "src/core/log/";
import {get_query_string as urlparams } from "src/output/index.js";
import { copyToClipboard } from "quasar";
import { reactive, onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";

// import { set_remote_server_time } from "./src/store/module/global";
import { useRouter,useRoute } from "vue-router";
import { compute_css_variables } from "src/core/css-var/index.js"
import ws from "src/core/data-warehouse/ws/ws-ctr/ws.vue"
const { NODE_ENV, CURRENT_ENV, DEFAULT_VERSION_NAME } = window.BUILDIN_CONFIG;
const router = useRouter();
const route= useRoute();
const _data = reactive({
  is_ws_run: wslog.ws_run, //// 初始化启动日志系统--开发模式时日志打开
  // config:window.BUILDIN_CONFIG,
  current_env: CURRENT_ENV,
  // 父类窗口句柄
  parent_doc_element: null,
});
const emitters = ref('')
// 检查内嵌版的逻辑处理动作
iframe_check();
//设置错误数据
GlobalSwitchClass.set_error_data("delete")
// 初始化版本类型
// store.dispatch({
//   type: "INIT_VERSION_NAME",
// });
// 初始化语言设置

// store.dispatch({
//   type: "INIT_LANG",
//   data: i18n_t("isoName"),
// });
//获取服务器时间
// store.dispatch(set_remote_server_time());
// 发送日志s
// window.wslog.sendMsg('xxx');
// timeCheck();
// 只在开发环境下启用vconsole
/* const Vconsole = require('vconsole')
      new Vconsole(); */
//重置即将开赛筛选
// this.$store.state.filter.open_select_time = null;

onBeforeMount(()=>{
  set_global_theme_change()
})

onMounted(() => {
  emitters.value = {
    emitter_1: useMittOn( MITT_TYPES.EMIT_THEME_CHANGE,  set_global_theme_change ).off
  }
})

// 设置主题
const set_global_theme_change = () => {
 set_theme_style_sheet_by_css_obj(global_color_obj())
}

// 公共全局主题色
const global_color_obj = () => {
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
 * 监听路由变化设置全局路由信息  来源和目标
 */
watch(
  () => router.currentRoute,
  (_to, _from = {}) => {
    const cur = _to.name;
    const from = _from.name;
    if (cur != from) {
      // store.dispatch({
      //   type: "SET_LAYOUT_CUR_PAGE",
      //   data: {
      //     cur,
      //     from,
      //   },
      // });
    }
  },
  { immediate: true }
);
/**
 * @description: message事件监听
 * 这是个啥 没有搜到vx_set_video_iframe_status
 */
// const remove_message = useEventListener({
//   name: "message",
//   listener: (e) => {
//     let status_text = ["loading", "success", "error"];
//     if (e.data.video_iframe_msg && status_text.includes(e.data.msg)) {
//       //
//       // this .vx_set_video_iframe_status(e.data.msg);
//     }
//   },
//   wait: 0,
// });
// 检测是否时间变化异常 怎么都没有用到 ws send_msg用的？？？？
// function timeCheck() {
//   let date_time_tmp = 0;
//   clearInterval(_data.timer);
//   _data.timer = setInterval(() => {
//     date_time_tmp = Date.now();
//     _data.date_time = date_time_tmp;
//   }, 1000);
// }
//设置点击全局事件+1
function set_global_click() {
  //设置全局点击事件
  GlobalSwitchClass.set_global_click()

}
/**
 * @description: 检查内嵌版的逻辑处理动作
 */
function iframe_check() {
  if (NODE_ENV === "development") {
    // 开发环境取消内嵌版的逻辑处理动作
    return;
  }
  // 检测是否忽略监测处理
  if (window.SEARCH_PARAMS.init_param.get('ignore_iframe_pc') == 1) {
    return;
  }
  // 公告栏,注单历史,体育规则和赛果页面不进行跳转
  if (
    location.href.indexOf("#/announce") != -1 ||
    location.href.indexOf("#/bet_record") != -1 ||
    location.href.indexOf("#/match_results") != -1 ||
    location.href.indexOf("#/rule") != -1
  ) {
    return;
  }
  if (top.location == location) {
    // 内嵌版的场景
    if (DEFAULT_VERSION_NAME != "zhuanye") {
      // 非专业版时跳转到专业版 ，兼容旧代码，生产运维实际已解析指向到同一个地方
      let url = location.href;
      url = url.replace("-bw3.", ".");
      url = url.replace("-bw2.", ".");
      if (location.href == url) {
        router.push({ name: "error404" });
      } else {
        location.href = url;
      }
    }
  }
}
/**
 * @description: 使父窗口中body标签中的滚动条滚动到顶部
 */
const scroll_mitt = useMittOn(
  MITT_TYPES.EMIT_PATENT_BODY_SCROLL_TOP_CMD,
  () => {
    if (!_data.parent_doc_element) {
      _data.parent_doc_element = window.parent.document.documentElement;
    }
    if (_data.parent_doc_element.scrollTop != 0) {
      _data.parent_doc_element.scrollTop = 0;
    }
  }
);

onBeforeMount(() => {
  // 释放日志功能对象
  if (wslog.destroyed) {
    wslog.beforeUnmount();
  }
  if (httplog.destroyed) {
    httplog.beforeUnmount();
  }
  if (_data.timer) {
    clearInterval(_data.timer);
  }
  // 销毁接收父窗口中body标签中的滚动条滚动到顶部事件
  scroll_mitt.off();
  // remove_message();
});
onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
});
</script>
<script>
import {LayOutMain_pc} from "src/output/project/index.js";
export default {
  watch: {
  // 监听路由变化 并记录到layout类中
    $route: {
      handler(_to, _from) {
        let cur = lodash.get(_to, "name");
        let from = lodash.get(_from, "name");
        let from_path = lodash.get(_from, "path");
        if (cur != from) {
          LayOutMain_pc.set_layout_current_path({
          cur,
          from,
          from_path
        })
        }
      },
      immediate: true,
    },
  }
}
</script>
<style scoped>

.error-data {
  display: none;
}

#v-tooltip {
  position: fixed;
  transform: translateX(-50%);
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0 5px;
  height: 22px;
  line-height: 22px;
  pointer-events: none;
  display: none;
  z-index: 10000000;
  white-space: nowrap;
}
</style>
 