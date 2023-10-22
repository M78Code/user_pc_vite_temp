<!--
 * @Author: Router
 * @Date: 2021-01-03 17:25:27
 * @Description: 虚拟体育倒计时
-->

<template>
  <div class="timer" :class="less_min && 'timer2'" v-show="time">
    {{ time }}
  </div>
</template>

<script setup>
// import common from "src/project/mixins/constant/module/common.js"
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import lodash from 'lodash'



const time = ref('')  //时间
const less_min = ref(false)  //是否小于1分钟
const timer_ = null

onMounted(() => {
  timer_format_handle()
})

const props = defineProps({
  mgt: String,
})

/**
     * 时钟变化
     * @param {Number} remaining_time
     */
const timer_format_handle = () => {
  let now = get_now_server();
  let remaining_time = props.mgt - now;

  if (remaining_time < 0) {
    // this.$emit('time_over');
    return
  }

  //毫秒格式化为: 分钟'秒''
  let minutes = Math.floor(remaining_time / (1000 * 60));
  let sub_ms_r = remaining_time - minutes * 60 * 1000;
  let seconds_f = Math.floor(sub_ms_r / 1000);

  minutes = String(minutes);
  seconds_f = String(seconds_f);

  let minutes_format = minutes.padStart(2, '0');
  let seconds_f_format = seconds_f.padStart(2, '0');

  if (minutes_format == '00') {    //小于1分钟
    less_min.value = true;
  }

  if ((minutes_format == '00') && seconds_f_format < 11) {  //小于10秒
    // this.$emit('time_over');
  }

  time.value = `${minutes_format}'${seconds_f_format}"`;

  if (remaining_time > 0) {
    timer_ = setTimeout(() => {
      timer_format_handle();
    }, 1000);
  }
}

onUnmounted(() => {
  clearTimeout(timer_)
  timer_ = null;
})

</script>
<style lang="scss" scoped>
.timer2 {
  background: #ff2a2a !important;
}
</style>
