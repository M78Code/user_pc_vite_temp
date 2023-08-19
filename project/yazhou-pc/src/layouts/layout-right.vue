<template>
  <div class="layout-right" :class="{ mini_hide: right_status }">
    <button @click="handle_click">隐藏右侧</button>
    <!-- 右侧区域 -->
    <!-- <div
    class="page-right"
    :class="data_ref.screen_width"
    :style="
      route.params.video_size == 1
        ? ''
        : `width:${computed_data.layout_size.right_width}px  !important; height:${computed_data.layout_size.content_height}px  !important;`
    "
    v-if="computed_data.layout_size.right_width > 0"
  > -->
    <!-- 虚拟体育 -->
    <!-- <virtual-right
      v-if="
        new_menu.is_virtual_sport() &&
        route.name != 'search' &&
        route.name != 'details'
      "
    /> -->
    <!-- 常规竞猜 -->
    <!-- <match-details v-else class="page-match-detail fit" /> -->
  </div>
</template>
<script setup>
import { ref,onBeforeUnmount } from "vue";
import store from "src/store-redux/index.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt";
const { layoutReducer } = store.getState();
//右侧状态
const right_status = ref(layoutReducer.layout_right_status);
//监听是否展示右侧
const list_emit = [
  useMittOn(MITT_TYPES.EMIT_LAYOUT_RIGHT_STATUS, (v) => {
    right_status.value = v;
  }).off,
];
onBeforeUnmount(() => {
  list_emit.forEach((i) => i());
});
function handle_click() {
  store.dispatch({
    type: "SET_LAYOT_RIGHT_STATS",
    data: !right_status.value,
  });
}
</script>
<style scoped lang="scss">
.layout-right {
  width: $layout_right_width;
  &.mini_hide {
    width: 0px !important;
    display: none;
  }
}
</style>