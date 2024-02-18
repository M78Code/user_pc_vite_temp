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
      <!-- 为什么要使用visibility: hidden;隐藏  占位了啊兄弟们 -->
    <span class="timer-layout0" v-show="false">{{time_str_old}}</span>
   
    <span class="timer-layout2" :class="[date_show_type === 'inline' && 'no-absolute' ]">{{ counting_time_ctr_show_format_ouzhou(match, time_str)}}</span>
  </div>
</template>
<script>
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import { counting_time_ctr_show_format_ouzhou } from 'src/core/format/common/index.js'

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
      counting_time_ctr_show_format_ouzhou
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
      on_time_change: ""
    },
    // 当前赛事信息
    match: {
      type: Object,
      default: () => {}
    },
     // 控制日期是否绝对定位，不换行时，不需要定位
     date_show_type: {
      type: String,
      default: 'br',
    },
  },
  // let off_ = ''
  created() {
    // 启动计时器
    this.start();
    useMittOn(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, this.set_date_time);
  },
  destroyed() {
    // off_()
    this.clear();
  },
  watch: {
    time_str(new_){
      if((new_?new_:'').length!=(this.time_str_old?this.time_str_old:'').length){
        this.time_str_old = (new_?new_:'');
    }
  },
    // 监测是否重新设置时间
    "tconfig.time": {
      handler(new_, old_) {
        this.timer_tmp = 0;
        this.start();
      }
    },
    "tconfig.step": {
      handler(new_, old_) {
        if(new_ != 0)
        {
          this.timer_tmp = 0;
          this.start();
        }
      }
    }
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
    set_date_time() {
      if(!this.timer_status){
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
      if(this.timer){
        clearInterval(this.timer);
        this.timer = false;
      }
    }
  },
  // 销毁前，清除定时器
  beforeDestroy() {
    this.clear();
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
  /*position: absolute;*/
  /*z-index: 1;*/
    padding: 8px;
  /* text-align: center; */
}
.timer-layout2 .no-absolute {
    position: static;
    /* margin-left: -30px; 如果有特殊需求 请再组件上加 不要加公共组件内*/
  }
</style>