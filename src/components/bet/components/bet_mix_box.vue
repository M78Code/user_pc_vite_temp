<!--
 * @Author: Router
 * @Description: 投注弹框，单关串关切换逻辑与普通赛事不一致，所以组件区分，避免逻辑混乱
-->
<template>
  <div class="bet-mix-box fullscreen" style="display: none;">
    <!-- 冠军、虚拟体育、电竞菜单 -->
    <!-- <betMixBoxChild1 v-if="[100, 900, 3000].includes(+get_menu_type)"></betMixBoxChild1> -->
    <!-- 普通赛事菜单 -->
    <!-- <betMixBoxChild2 v-else></betMixBoxChild2> -->
    <betMixBoxChild2></betMixBoxChild2>
  </div>
</template>

<script setup>

import { ref, onMounted,watch,computed,onUnmounted } from 'vue';
// import betMixBoxChild1 from "./bet_mix_box_child1.vue";
import betMixBoxChild2 from "./bet_mix_box_child2.vue";


// ...mapMutations(['clear_single_money'])
onUnmounted(() => {
  clear_single_money(1)
})

const get_menu_type = computed((val) => {
    return val
})
</script>

<style lang="scss" scoped>
.bet-mix-box {
  z-index: 541;
  max-width:3.78rem;
}
</style>
