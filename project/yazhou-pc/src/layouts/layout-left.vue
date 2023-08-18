<template>
  <!-- 左侧 菜单区域 -->
  <div
    ref="page_left"
    v-show="route.params.video_size != 1"
    class="layout-left page-left row relative-position full-height"
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
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import store from "src/store-redux/index.js";
import leftMain from "../pages/left-main/index.vue";
import leftMainMin from "../pages/left-main/index-min.vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt";

// loading 属性
const props = defineProps({
  loading: {},
});
const { menuReducer, layoutReducer } = store.getState();
const route = useRoute();
//是否为mini状态
const is_mini_menu = ref(layoutReducer.left_menu_is_mini);
const bet_loadding = ref(false);
//监听宽度变化/单击事件
useMittOn(MITT_TYPES.EMIT_LAYOUT_MENU_TOGGLE, (v) => {
  is_mini_menu.value = v == "mini";
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