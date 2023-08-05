<template>
  <div class="zhuanye" @click="set_global_click">
    <div v-if="_data.is_ws_run" class="timeShow" @click="copyToken()">
      {{ _data.current_env }}
    </div>
    <!-- 页面路由开始 -->
    <router-view />
    <div class="error-data">{{ get_error_data }}</div>
    <div id="v-tooltip"></div>
  </div>
</template>
  
  <script setup>
import "./src/boot/globel-mitt";
import { useMittOn, MITT_TYPES } from "src/core/mitt/";
import wslog from "src/core/ws/ws-log.js";
import { httplog } from "src/core/http/";
import { useEventListener } from "src/core/utils/event-hook";
import { GetUrlParams } from "src/core/utils/";
import { copyToClipboard } from "quasar";
import { reactive, onBeforeMount, onMounted } from "vue";
import { useRouter } from "vue-router";
const { NODE_ENV, CURRENT_ENV, DEFAULT_VERSION_NAME } = window.BUILDIN_CONFIG;
const urlparams = GetUrlParams();
const router = useRouter();
const _data = reactive({
  is_ws_run: wslog.ws_run, //// 初始化启动日志系统--开发模式时日志打开
  // config:window.env.config,
  current_env: CURRENT_ENV,
  // 父类窗口句柄
  parent_doc_element: null,
});
const get_error_data = ref({});
// 检查内嵌版的逻辑处理动作
iframe_check();

//设置错误数据
// set_error_data("delete");
// 初始化版本类型
init_version_name();
// 初始化语言设置
// init_lang($t("isoName"));

// 发送日志s
// window.wslog.sendMsg('xxx');
timeCheck();

// 只在开发环境下启用vconsole
/* const Vconsole = require('vconsole')
      new Vconsole(); */
//重置即将开赛筛选
// this.$store.state.filter.open_select_time = null;

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
// 检测是否时间变化异常
// function timeCheck() {
//   let date_time_tmp = 0;
//   clearInterval(_data.timer);
//   _data.timer = setInterval(() => {
//     date_time_tmp = Date.now();
//     _data.date_time = date_time_tmp;
//   }, 1000);
// }
function global_click() {}
function copyToken(is_key_down) {
  // if (this.get_user && this.get_user.token) {
  if (is_key_down) {
    copyToClipboard(`?ignore_iframe_pc=1&token=${this.get_user.token}`);
  } else {
    copyToClipboard(
      `?wsl=9999&ignore_iframe_pc=1&token=${this.get_user.token}`
    );
  }
  // }
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
  if (urlparams.ignore_iframe_pc == 1) {
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
onMounted(() => {});
onBeforeMount(() => {
  // 释放日志功能对象
  if (wslog.destroyed) {
    wslog.destroyed();
  }
  if (httplog.destroyed) {
    httplog.destroyed();
  }
  if (_data.timer) {
    clearInterval(_data.timer);
  }
  // 销毁接收父窗口中body标签中的滚动条滚动到顶部事件
  scroll_mitt.off();
  // remove_message();
});
</script>
<style scoped>
.timeShow {
  position: fixed;
  top: 20px;
  left: 50%;
  width: 100px;
  color: red;
  z-index: 9999999;
  font-size: 20px;
  text-align: right;
}
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
  