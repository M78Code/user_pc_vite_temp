<!--
 * @Description: 虚拟体育时钟
-->
<template>
  <div class="v-s-timer">
    <div class="v-timer-inner column justify-center items-center">
      <div class="timer-format" :class="{last:is_last_circle}">{{timer_format}}</div>
    </div>
    <div class="graphic-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="none" :d="get_path_background_d()" stroke-width="3.4" :stroke="strokeBgColor"></path>
      </svg>
    </div>
    <div class="graphic-wrapper circle-time-wrapper" :class="{'final-circle': strokeColor}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="none" :d="path_d" stroke-width="3.4"></path>
      </svg>
    </div>
    <div class="count-wrap" v-if="title">
      <div class="count">{{title}}</div>
    </div>
  </div>
</template>
<script>
import virtual_sports_timer_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-timer-mixin.js";
export default {
  mixins:[virtual_sports_timer_mixin],
  name:'virtual_sports_timer',
}
</script>

<style lang="scss" scoped>
.v-s-timer {
  min-width: 1.1rem;
  height: 1.1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.38rem;
  z-index:555;
  .circle-time-wrapper svg path{
    stroke: var(--q-gb-t-c-2);
  }
  .final-circle {
      svg path {
        stroke: var(--q-gb-bd-c-8);
      }
    }

  .v-timer-inner {
    width: 1.05rem;
    height: 1.05rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    line-height: 1;

    position: relative;

    .timer-format {
      // color: #ffb001;
      font-size: 0.3rem;
      font-weight: 500;
      color: var(--q-gb-t-c-2) !important;
      &.last {
        // color: #E23E3E;
        color: var(--q-gb-bd-c-8) !important;
      }
    }
  }

  .graphic-wrapper {
    width: 1.1rem;
    height: 100%;
    position: absolute;
    z-index: 566;
    top: 0;
    left: 0;
  }

  canvas {
    position: absolute;
    z-index: 577;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translateY(-50%) translateX(-50%) rotateZ(-90deg);
  }

  .count-wrap {
    position: absolute;
    z-index: 588;
    left: 50%;
    bottom: -0.38rem;
    display: flex;
    justify-content: center;
    transform: translateX(-50%);

    .count {
      height: 0.3rem;
      line-height: 0.3rem;
      min-width: 0.8rem;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 0.1rem;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 0.15rem;
      font-size: 0.14rem;
      color: #F5F8FA;
      backdrop-filter: blur(5px);
      letter-spacing: 0.02rem;
    }
  }
}
</style>
 