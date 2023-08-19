<template>
  <!-- 左侧 菜单区域 -->
  <div
    v-show="route.params.video_size != 1"
    class="layout-left row relative-position full-height"
    :class="{
      mini: is_mini_menu,
    }"
  >
    <div class="cathectic-shade" v-show="bet_loadding && is_mini_menu">
      <div class="shade-fixed">
        <!-- 确认中转圈圈 -->
        <div class="loading-wrap">
          <div class="img-loading"></div>
          <div class="text-center loading-text flex items-end justify-center">
            {{ $t("bet.bet_loading") + "..." }}
            <!-- 内容加载中... -->
          </div>
        </div>
      </div>
    </div>
    <!-- 左侧 mini -->
    <left-main-min v-show="is_mini_menu" />
    <!-- 左侧 -->
    <left-main v-show="!is_mini_menu" />
  </div>
</template>

<script setup>
import leftMain from "../pages/left-main/index.vue";
import leftMainMin from "../pages/left-main/index-min.vue";

import { is_mini_menu, list_emit } from "../core/layout/left-menu";
import { useRoute } from "vue-router";
import { onBeforeUnmount, ref } from "vue";
const route = useRoute();
const bet_loadding = ref(false);

onBeforeUnmount(() => {
  list_emit.forEach((i) => i());
});
</script>
<style scoped lang="scss">
.layout-left {
  width: $layout_menu_width;
  &.mini {
    width: $layout_menu_width_mini;
  }
}
</style>