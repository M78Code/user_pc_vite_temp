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
<script setup>
import { onUnmounted, ref, watch } from "vue";

import useTimer from "./useTimer";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js";

const { clear, start, replay, time_str, timer_tmp } = useTimer();
// 定时器
const timer_status = ref("");
// 定时器
const time_str_old = ref("");
let timer = null;

const props = defineProps({
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
});


const set_date_time = (e) => {
  if (!timer_status.value) {
    return;
  }
  
  timer_tmp.value += props.tconfig.step;
  // 设置格式化时间
  if (props.tconfig.time_format) {
    time_str.value = props.tconfig.time_format(
      parseInt(props.tconfig.time) + timer_tmp.value
    );
  } else {
    time_str.value = props.tconfig.time + timer_tmp.value;
  }
  // 回调时间变更事件
  if (props.tconfig.on_time_change) {
    props.tconfig.on_time_change();
  }
};


useMittOn(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, set_date_time);
start();

onUnmounted(() => {
  clear();
});

watch(time_str, (new_) => {
  if (
    (new_ ? new_ : "").length !=
    (time_str_old.value ? time_str_old.value : "").length
  ) {
    time_str_old.value = new_ ? new_ : "";
  }
});

watch(props.tconfig.time, () => {
  timer_tmp.value = 0;
  start();
});

watch(props.tconfig.step, () => {
  timer_tmp.value = 0;
  start();
});



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
