<template>
  <div style="width: 236px">
    <!-- 左侧 菜单区域 -->
    <div ref="page_left" v-show="route.params.video_size != 1"
      class="page-left row yb-layout-margin-menu relative-position fit"
      :class="computed_data.vx_main_menu_toggle">
      <div class="cathectic-shade" v-show="bet_loadding && computed_data.left_menu_toggle">
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
      <left-main-min v-show="computed_data.vx_main_menu_toggle == 'mini'" />
      <!-- 左侧 -->
      <left-main v-show="['normal', 'mini-normal'].includes(computed_data.vx_main_menu_toggle)" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { useRoute } from "vue-router";
import store from "src/store-redux/index.js";
import leftMain from "../pages/left-main/index.vue";
import leftMainMin from "../pages/left-main/index-min.vue";

// loading 属性
const props = defineProps({
  loading: {}
})

const route = useRoute();

const {
  menuReducer,
  layoutReducer,
} = store.getState();

const computed_data = reactive({
  // 页面布局
  layout_size: layoutReducer.layout_size,
  // 左侧列表显示形式 normal：展开 mini：收起
  vx_main_menu_toggle: menuReducer.main_menu_toggle,

});

</script>