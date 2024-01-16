<!--
 * @Author: Router
 * @Description: 投注弹框，单关串关切换逻辑与普通赛事不一致，所以组件区分，避免逻辑混乱
-->
<template>
  <div v-show="false">-{{ BetData.bet_data_class_version }}-{{BetData.bet_box_h5_show}}-{{BetData.bet_oid_list}}</div>
  <div class="component bet-mix-box ouzhou-h5" v-if="BetData.bet_box_h5_show && BetData.bet_oid_list.length ">
    <betMixBoxChild></betMixBoxChild>
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
