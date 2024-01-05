<!--
 * @Author: 虚拟赛事时钟
-->
<template>
  <div class="flag-wrapper">
    <div class="flag-bg-"
      :class="{
        'show-background':minutes > 0 || match.match_status == 2 || match.match_status == 11,
        'whistle-state':match.match_status == 2 || match.match_status == 11
      }">
    </div>
    <div v-if="minutes > 0 && match.match_status == 1" class="score-w">
      <span v-if="minutes > 0">{{minutes}}'</span>
      <span v-else>{{seconds}}''</span>
    </div>
    <img v-if="match.match_status == 2 || match.match_status == 11"
         class="whistle-icon-w" src="image/bw3/svg/virtual-sports/icon_whistle.svg" alt="">
  </div>
</template>
<script>
import virtual_sports_match_timer_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-timer-mixin.js";
export default {
  mixins:[virtual_sports_match_timer_mixin],
}
</script>
<style lang="scss" scoped>
.flag-wrapper {
  width: 0.5rem;
  height: 0.5rem;
  position: absolute;
  top: 0;
  left: 0;

  .flag-bg- {
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    transform: rotateZ(45deg);
    top: -0.3rem;
    left: -0.3rem;

    &.show-background {
      background: -webkit-linear-gradient(bottom, #E0CAA9, #F8E6B5);

      &.whistle-state {
        background: none;
        background-color: #CACACA;
      }
    }
  }

  .score-w {
    width: auto;
    height: auto;
    line-height: 1;
    top: 0;
    left: 0;
    color: #956B42;
    position: absolute;
    font-size: 0.14rem;
    padding: 0.06rem 0 0 0.04rem;
  }

  .whistle-icon-w {
    width: 0.16rem;
    height: 0.16rem;
    left: 0.07rem;
    top: 0.03rem;
    position: absolute;
  }
}
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/virtual_sports_match_timer_mixin.js