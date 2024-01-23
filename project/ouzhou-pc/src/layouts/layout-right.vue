<template>
  <div class="layout-right" :class="{ mini_hide: right_status }" v-if="show_right">
    <!-- <button @click="handle_click">隐藏右侧</button> -->
    <!-- 右侧区域 -->
    <div
      class="page-right"
      :style=" route.params.video_size == 1 ? '' : `width:${LayOutMain_pc.layout_right_width}px  !important; height:${LayOutMain_pc.layout_content_height}px  !important;`"
      v-if="LayOutMain_pc.layout_right_width > 0"
    >
      <!-- 虚拟体育 -->
      <!-- <virtual-right
      v-if="
        MenuData.is_vr() &&
        route.name != 'search' &&
        route.name != 'details'
      "
    /> -->
      <!-- v-else -->
      <!-- 右侧数据分析 -->
      <analysis ></analysis>
      <!-- <match-details-right  class="page-match-detail fit" /> -->
    </div>
  </div>
</template>
<script setup>
////import store from "src/store-redux/index.js";
// import virtualRight from "src/base-pc/components/virtual-right/virtual-right.vue";
// import matchDetailsRight  from "src/base-pc/components/match-details-right/match-details-right.vue"

import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import analysis from "../pages/match-new-detail/analysis/index.vue";
import {LayOutMain_pc} from "src/output/project/index.js";
const route = useRoute();
const right_status = ref(null);
const show_right = ref(false);
watch(
  () => route.name,
  () => {
    show_right.value = ["details", "in_play"].includes(route.name);
  },
  { immediate: true }
);

// onBeforeUnmount(() => {
//   list_emit.forEach((i) => i());
// });
function handle_click() {
  // store.dispatch({
  //   type: "SET_LAYOT_RIGHT_STATS",
  //   data: !right_status.value,
  // });
}
</script>
<style scoped lang="scss">
.layout-right {
  // width: $layout_right_width;
  &.mini_hide {
    width: 0px !important;
    display: none;
  }
}
</style>