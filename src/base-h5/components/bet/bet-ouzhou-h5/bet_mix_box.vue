<!--
 * @Author: Router
 * @Description: 投注弹框，单关串关切换逻辑与普通赛事不一致，所以组件区分，避免逻辑混乱
-->
<template>
<div v-if="false">{{ BetData.bet_data_class_version }}</div>
  <div class="bet-mix-box ">
    <betMixBoxChild v-if="ref_data.bet_box_h5_show "></betMixBoxChild>
  </div>
</template>

<script setup>

import betMixBoxChild from "./bet_mix_box_child.vue";
import BetData from "src/core/bet/class/bet-data-class.js";

</script>
 
<style lang="scss" scoped>
.bet-mix-box {
  // z-index: 541;
  // max-width:3.78rem;
}
</style>
