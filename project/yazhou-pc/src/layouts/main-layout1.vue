
<template>
  <div class="page-main full-height" :style="page_style">
    <div :style="{ height: LayOutMain_pc.layout_top_height  }">
      <!-- 搜索 -->
      <search-wapper />
      <!-- 页面头部容器-->
      <layout-header />
    </div>
    <div style="display: none;"> {{ LayOutMain_pc.layout_version }}</div>
    <div class="flex">
      <!-- 左侧 菜单 -->
      <div :style="{ height: LayOutMain_pc.layout_content_height , width:LayOutMain_pc.layout_left_width }" class="layout_main_left">
        <layout-left />
      </div>
      <div :style="{ height: LayOutMain_pc.layout_content_height , width:LayOutMain_pc.layout_content_width + 'px' }" class="layout_main_center">
        <!-- 中间区域 -->
        <router-view
            class="col"
            :class="{
              video_page: route.params.video_size == 1,
            }"
            v-slot="{Component}"
          >
          <keep-alive include="matchListRouter" max="1">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
      <!-- 右侧 视频  动画 比分板 详情 -->
      <div :style="{ height: LayOutMain_pc.layout_content_height , width:LayOutMain_pc.layout_right_width +'px' }" class="layout_main_right">
        <layout-right />
      </div>
    </div>
    <!-- toast 消息提示 -->
    <toast-components />
    <confirm-components />
    <alert-components />
  </div>
</template>
<script setup>
import { ref, computed,onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { LayOutMain_pc } from "src/core/index.js";
import "./main-layout.js"; //初始化数据
// import { debounce } from "lodash";
/**组件*/
import { SearchWapper } from 'src/components/search'
import layoutHeader from "./layout-header.vue";
import layoutLeft from "./layout-left.vue";
import layoutRight from "./layout-right.vue";
import toastComponents from "project_path/src/components/toast/toast.vue";
import alertComponents from "project_path/src/components/toast/alert.vue";
import confirmComponents from "project_path/src/components/toast/confirm.vue";
import "./match-list.scss";

import { compute_css_variables } from "src/core/css-var/index.js"

const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'layout' })

const route = useRoute();
console.error(route);
//重新计算高度
const mitt_offs = [
  // useMittOn(MITT_TYPES.EMIT_LAYOUT_RESIZE, debounce(resize, 150)).off,
];
// resize();

</script>
<style lang="scss" scoped>
@import url(./main-layout.scss);
@import url(./content-layout.scss);
@import url(./match-list.scss);

.page-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--q-gb-bg-c-22);
  .video_page {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
  }
}

.layout_main_left {
  padding-top: 5px;
}
.layout_main_center {
  padding-top: 5px;
}
.layout_main_right {
  padding-top: 5px;
}
</style>