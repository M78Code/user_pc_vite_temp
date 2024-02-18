<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 时间日期定时器显示组件可用于显示静止时间,倒计时,标准时间日期等
 * 
 * 使用如下:
 * <timer :tconfig="{time:0,time_format:timeshow2,step:1,timer_ms:1000,on_time_change:on_time_change}"></timer>
 * on_time_change 为接收消息变化函数事件
-->
<template>
  <div class="timer-layout">
    <span class="timer-layout0">{{ time_str_old }}</span>
    <span class="timer-layout2">{{ time_str }}</span>
  </div>
</template>
<script>
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/";
export default {
  name: "Timer",
  data() {
    return {
      // 定时器
      timer_status: "",
      // 页面显示字符串
      time_str: "",
      time_str_old: "",
      // 增量临时值
      timer_tmp: 0,
    };
  },
  props: {
    tconfig: {
      // 时间
      time: 0,
      // 时间格式化函数
      time_format: "",
      // 步长 0-不增长, 1-增长, -1-递减
      step: 0,
      // 定时器延迟毫秒数,
      timer_ms: 1000,
      // 时间变化事件
      on_time_change: "",
    },
  },
  created() {
    
    // 启动计时器
    this.start();
    // useMittOn(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, set_date_time)
  },
  beforeUnmount() {
    // useMittOn(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, set_date_time).off;
    this.clear();
  },
  watch: {
    time_str(new_) {
      if (
        (new_ ? new_ : "").length !=
        (this.time_str_old ? this.time_str_old : "").length
      ) {
        this.time_str_old = new_ ? new_ : "";
      }
    },
    // 监测是否重新设置时间
    "tconfig.time": {
      handler(new_, old_) {
        this.timer_tmp = 0;
        this.start();
      },
    },
    "tconfig.step": {
      handler(new_, old_) {
        if (new_ != 0) {
          this.timer_tmp = 0;
          this.start();
        }
      },
    },
  },
  methods: {
    // 启动计时器
    start() {
      const that = this;
      if (that.tconfig.step) {
        if (!that.timer || that.replay) {
          // clearInterval(that.timer);
          // 设置格式化时间
          if (that.tconfig.time_format) {
            that.time_str = that.tconfig.time_format(
              that.tconfig.time + that.timer_tmp
            );
          } else {
            that.time_str = that.tconfig.time + that.timer_tmp;
          }
          if (that.tconfig.on_time_change) {
            that.tconfig.on_time_change(that);
          }
          this.timer_status = true;
        }
      } else {
        that.time_str = that.tconfig.time_format(
          that.tconfig.time + that.timer_tmp
        );
      }
      return that;
    },
    set_date_time(e) {
      if (!this.timer_status) {
        return;
      }
      const that = this;
      that.timer_tmp += that.tconfig.step;
      // 设置格式化时间
      if (that.tconfig.time_format) {
        that.time_str = that.tconfig.time_format(
          parseInt(that.tconfig.time) + that.timer_tmp
        );
      } else {
        that.time_str = that.tconfig.time + that.timer_tmp;
      }
      // 回调时间变更事件
      if (that.tconfig.on_time_change) {
        that.tconfig.on_time_change(that);
      }
    },
    //销毁计时器
    clear() {
      this.timer = false;
    },
  },
};
</script>
<style scoped>
.timer-layout {
  position: relative;
  width: 100%;
}
.timer-layout0 {
  visibility: hidden;
}

.timer-layout2 {
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
  /* text-align: center; */
}
</style>
