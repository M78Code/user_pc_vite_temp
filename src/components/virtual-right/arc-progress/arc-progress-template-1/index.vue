<!--
 * @Description: 圆形进度
-->

<template>
  <div class="arc-progress yb-flex-center relative-position">
    <div class="content yb-flex-center">
      <!-- 倒计时 -->
      <div class="time">{{vsport_ctr.rest_time_str}}</div>
      <div class="which-round ellipsis">{{vsport_ctr.info.no}}</div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path fill="none" :d="vsport_ctr.path_d" stroke-width="3.4" stroke="#FFECB6"></path>
    </svg>
  </div>
</template>

<script>
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "arcProgress",
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object
  },
  setup(props, evnet) {
    const data = reactive({

    });
    onUnmounted(() => {
      clearInterval(vsport_ctr.interval_id)
    })
    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>
.arc-progress {
  width: 108px;
  height: 108px;

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .content {
    width: 105px;
    height: 105px;
    border-radius: 50%;
    flex-direction: column;
    line-height: 1.4;
    .time {
      font-size: 24px;
    }
    .which-round {
      font-size: 14px;
      width: 100px;
      text-align: center;
    }
  }
}
</style>
