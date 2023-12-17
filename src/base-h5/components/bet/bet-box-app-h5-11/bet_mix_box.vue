<!--
 * @Author: Router
 * @Description: 投注弹框，单关串关切换逻辑与普通赛事不一致，所以组件区分，避免逻辑混乱
-->
<template>
  <div class="bet-mix-box ">
    <!-- 冠军、虚拟体育、电竞菜单 -->
    <!-- <betMixBoxChild1 v-if="[100, 900, 3000].includes(+get_menu_type)"></betMixBoxChild1> -->
    <!-- 普通赛事菜单 -->
    <!-- <betMixBoxChild2 v-else></betMixBoxChild2> -->
    <div v-show="false">-{{ BetData.bet_data_class_version }}-{{BetData.h5_bet_box_show}}</div>
    <!-- <div class="bet-mix-box " v-if="BetData.h5_bet_box_show && BetData.bet_oid_list.length">
      <betMixBoxChild></betMixBoxChild>
    </div> -->
    <betMixBoxChild v-if="BetData.h5_bet_box_show && BetData.bet_oid_list.length"></betMixBoxChild>
  </div>
</template>

<script setup>

import { ref, onMounted,watch,computed,onUnmounted } from 'vue';
// import betMixBoxChild1 from "./bet_mix_box_child1.vue";
import betMixBoxChild from "./bet_mix_box_child.vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";

const bet_show = ref(false)


const set_bet_show = (ref)=>{
  // console.error(888888,ref);
  bet_show.value = ref
}

onMounted(() => {
  // 监听 变化
  useMittOn(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, set_bet_show)
})

onUnmounted(() => {
  // clear_single_money(1)
  useMittOn(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, set_bet_show).off
})

const get_menu_type = computed((val) => {
    return val
})

</script>
 
<style lang="scss" scoped>
.bet-mix-box {
  // z-index: 541;
  // max-width:3.78rem;
}
</style>
