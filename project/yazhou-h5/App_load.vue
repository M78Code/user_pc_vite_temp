<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 项目页面入口
-->
<template>
  <!-- 右侧菜单 -->
  <div
    :class="['bw3', { rightMenu: right_menu_show }]"
    @click.stop="appclick($event)"
  >
    <div v-if="time_str" class="time-show">
      <div>{{ server_env }}-{{ time_str }}</div>
    </div>
    <!-- 页面路由开始 -->
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
// websocket Log文件
 
import {WsLog_H5 as WsLog} from  "src/core/log/log-config.js"
window.wslog = WsLog;

const BUILDIN_CONFIG = window.BUILDIN_CONFIG;

const { CURRENT_ENV_NAME } = BUILDIN_CONFIG;
export default {
  name: "AppLoad",
  data() {
    return {
      vue_hidden_run_flg: false,
      background_run_time: "",
      time_str: "",
      server_env: CURRENT_ENV_NAME,
      buried_time: 0, // 代表今日足球下边距离触发埋点的时间
      right_menu_show:false
    };
  },
 

 
  created() {
    // 定时器
    this.timer = null;
    this.timer2 = null;
    // 设置商户样式

    this.timerFormat();
    this.init_version_name();
    this.on_listeners();

    // 初始化启动日志系统--开发模式时日志打开
    // window.wslog = new WsLog(window.env.NODE_ENV === 'development');

    if (window.wslog.wsRun) {
      this.timer = setInterval(() => {
        this.time_str = new Date().Format("yyyy-MM-dd hh:mm:ss.S");
      }, 100);
    }
    // 发送日志
    // window.wslog.sendMsg('xxx');
    this.set_vue_hidden_run(false);
    this.timer2 = setTimeout(() => {
      this.vue_hidden_run_flg = true;
    }, 4000);

    let url_search = new URLSearchParams(location.search);
    let vlg = url_search.get("vlg");
    if (vlg) {
      sessionStorage.setItem("vlg", vlg);
    }

    // 移动端设备下 url参数 vlg=1 开启vconsole调试
    if (sessionStorage.getItem("vlg")) {
      const script = document.createElement("script");
      let BUILD_VERSION = window.env.config.BUILD_VERSION;

      script.src = `${
        BUILD_VERSION ? "/" + BUILD_VERSION : ""
      }/lib/js/vconsole.min.js`;
      script.async = false;

      script.onload = function () {
        new VConsole();
      };

      document.head.appendChild(script);
    }
  },
  methods: {
    ...mapMutations(["set_global_click_count"]),
    ...mapActions({
      init_version_name: "init_version_name",
      set_vue_hidden_run: "set_vue_hidden_run",
    }),
    /**
     *@description 事件preventDefault函数执行体
     */
    event_listener_preventDefault(event) {
      event.preventDefault();
    },

    /**
     *@description 页面可见性变化的处理函数
     */
    visibilitychange_handle() {
      if (!this.vue_hidden_run_flg) {
        return false;
      }
      let is_hidden = document.visibilityState == "hidden";

      if (is_hidden) {
        window.DOCUMENT_HIDDEN = new Date().getTime();
      } else {
        // 获取 焦点后 ，页面激活 ，次开关打开 ，HTTP,WS 就会自动 打开开关
        window.DOCUMENT_HIDDEN = "";
      }
      // 设置当前页面是否后台运行中状态
      this.set_vue_hidden_run(is_hidden);

      //页面失去焦点 ，隐藏   后台运行
      if (is_hidden) {
        this.background_run_time = new Date().getTime();
        // 在后台运行超过 over_timer 分钟后才广播刷新数据指令
      } else {
        // 页面 唤起  这里流程分 二种：
        // 流程一：   离开不到30分钟 ，  列表或者详情 ，监听到 页面聚焦时间 变更 ，重新拉取当前的接口
        // 流程二：   离开超过30分钟 ，  页面直接刷新 重走流程
        // 30分钟  重载刷新  页面
        let over_timer = 30 * (60 * 1000);
        let now_time = new Date().getTime();
        // 在后台共运行了多少时间
        let run_time = now_time - this.background_run_time;
        // 页面需要 重载刷新
        let need_reload = run_time > over_timer;
        //如果需要 重载刷新
        if (need_reload) {
          window.location.reload();
        } else {
          // 站点 tab 休眠状态转激活  ，

          this.$root.$emit(this.emit_cmd.EMIT_VISIBILITYCHANGE_EVENT);
        }
      }
    },
    /**
     * @Description 阻止双击放大
     * @param {undefined} undefined
     */
    appclick(e) {
      e.preventDefault();
      // 全局点击次数+1
      this.set_global_click_count();
    },
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
    timerFormat() {
      Date.prototype.Format = function (fmt) {
        var o = {
          "M+": this.getMonth() + 1, // 月份
          "d+": this.getDate(), // 日
          "h+": this.getHours(), // 小时
          "m+": this.getMinutes(), // 分
          "s+": this.getSeconds(), // 秒
          "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
          S: this.getMilliseconds(), // 毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return fmt;
      };
    },
    // 添加相应监听事件
    on_listeners() {
      // 监听页面是否转入休眠状态
      document.addEventListener(
        "visibilitychange",
        this.visibilitychange_handle
      );
      document.addEventListener("pagehide", this.visibilitychange_handle);
      document.addEventListener(
        "gesturestart",
        this.event_listener_preventDefault
      );
      document.addEventListener(
        "gesturechange",
        this.event_listener_preventDefault
      );
      document.addEventListener(
        "gestureend",
        this.event_listener_preventDefault
      );

      // 阻止双击变大
      document.addEventListener(
        "click",
        this.event_listener_preventDefault,
        true
      );
    },
    // 移除相应监听事件
    off_listeners() {
      document.removeEventListener(
        "visibilitychange",
        this.visibilitychange_handle
      );
      document.removeEventListener("pagehide", this.visibilitychange_handle);
      document.removeEventListener(
        "gesturestart",
        this.event_listener_preventDefault
      );
      document.removeEventListener(
        "gesturechange",
        this.event_listener_preventDefault
      );
      document.removeEventListener(
        "gestureend",
        this.event_listener_preventDefault
      );
      document.removeEventListener("click", this.event_listener_preventDefault);
    },
  },
  destroyed() {
    // 释放日志功能对象
    if (window.wslog && window.wslog.destroyed) {
      window.wslog.destroyed();
    }
    window.wslog = null;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    clearTimeout(this.timer2);
    this.timer2 = null;

    this.off_listeners();
  },
  watch: {},
};
</script>

<style lang="scss">
* {
  /* 禁止火狐浏览器下显示滚动条 */
  scrollbar-width: none;
}

.time-show {
  position: fixed;
  left: 0.5rem;
  color: red;
  z-index: 9999999;
  font-size: 15px;
  margin-left: -50px;
}

.rightMenu {
  -webkit-overflow-scrolling: unset !important;
}
</style>
