<template>
  <div class="page-main full-height">
    <layout-header />
    <div class="window-width flex" :style="{ height: content_height }">
      <layout-left :style="{ height: content_height }" />
      <!-- 中间区域 -->
      <keep-alive include="matchListRouter" max="1">
        <router-view
          class="page-center col"
          :style="computed_style"
          :class="{
            video_size: route.params.video_size == 1,
          }"
        />
      </keep-alive>
      <layout-right :style="{ height: content_height }" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, reactive, nextTick, onBeforeUnmount, watch } from "vue";
import { get, isEmpty, cloneDeep, isArray } from "lodash";
import store from "src/store-redux/index.js";
/**组件*/
import layoutHeader from "./layout-header.vue";
import layoutLeft from "./layout-left.vue";
import layoutRight from "./layout-right.vue";
import { useRoute } from "vue-router";
import { useEventListener } from "src/core/utils/event-hook";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt";
const route = useRoute();
const content_height = ref(0);
const content_width = ref(0);
const computed_style = computed(() => {
  return {
    height: content_height.value,
    width: content_width.value,
  };
});
const { layoutReducer } = store.getState();
const layout_size = layoutReducer.layout_size;
/**
 *映射store内部的方法
 */
const methods_map_store = [
  "set_odds_coversion_map",
  "SET_INIT_ODD",
  "SET_INIT_MATCH_SORT",
  // 设置单关是否正在投注处理中
  "set_is_single_handle",
  // 设置串关是否正在处理
  "set_is_handle",
  // 虚拟投注正在处理中
  "set_is_virtual_handle",
  "virtual_bet_clear",
  "set_cur_odd",
  // 左侧菜单展开折叠状态
  "set_left_menu_toggle",
  // 保存页面布局的宽高等数据
  "SET_LAYOUT_SIZE",
  // 保存当前路由信息
  "set_layout_cur_page",
  "set_show_filter_popup",
  "set_show_record",
  "set_match_details_params",
  "set_main_menu_toggle",
  "SET_LAYOUT_LIST_SIZE",
  // 保存列表的宽度
  "SET_LAYOUT_LIST_WIDTH",
  "set_is_bet_merge",
  "set_is_bet_single",
  //设置全局开关
  "set_global_switch",
  // 设置左侧布局
  "set_layout_left_show",
  //设置多列玩法状态
  "set_unfold_multi_column",
].reduce((obj, type) => {
  obj[type] = (data) => {
    store.dispatch({ type, data });
  };
  return obj;
}, {});
//重新计算
const { off, emit } = useMittOn(MITT_TYPES.EMIT_LAYOUT_RESIZE, function () {
  // const { layoutReducer } = store.getState();
  resize();
});
function resize() {
  const { layoutReducer } = store.getState();
  // emit();
  let {
    // 主内容最大宽度
    max_width,
    // 主内容最小宽度出现滚动条
    min_width,
    // 左侧菜单宽度
    left_width,
    // 左侧菜单宽度mini
    left_width_mini,
    // 右侧区域宽度
    right_width,
    // 头部导航高度
    nav_height,
    //公告高度
    notice_height,
  } = layoutReducer.layout_size;
  const {
    //is_unfold_multi_column多列玩法
    is_unfold_multi_column,
    //左侧列表显示形式 normal：展开 mini：收起  mini-normal手动展开
    main_menu_toggle,
  } = layoutReducer;
  //多列玩法 右侧隐藏了
  if (is_unfold_multi_column) {
    right_width = 0;
  }
  //内嵌iframe 隐藏菜单
  let is_iframe = window.frames.length != parent.frames.length;
  if (is_iframe) {
    nav_height = 0;
  }
  // 浏览器宽度
  let inner_width = document.documentElement.clientWidth;
  // 浏览器高度
  let inner_height = document.documentElement.clientHeight;
  let menu_statu = main_menu_toggle;
  //小于最小宽度
  if (inner_width <= min_width) {
    //"mini-normal" 自己展开的 不做操作
    if ("normal" == main_menu_toggle) {
      menu_statu = "mini";
      methods_map_store["set_left_menu_toggle"]("mini");
      //通知菜单变mini
      useMittEmit(MITT_TYPES.EMIT_LAYOUT_MENU_TOGGLE, true);
    }
  } else {
    if ("mini" == main_menu_toggle) {
      menu_statu = "normal";
      methods_map_store["set_left_menu_toggle"]("normal");
      //通知菜单变展开normal
      useMittEmit(MITT_TYPES.EMIT_LAYOUT_MENU_TOGGLE, false);
    }
  }
  content_height.value = inner_height - nav_height - notice_height + "px";
  if (menu_statu == "mini") {
    left_width = left_width_mini;
  }
  content_width.value = inner_width - left_width - right_width + "px";
}
resize();
useEventListener({
  name: "resize",
  listener: resize,
  wait: 150,
});
onBeforeUnmount(() => {
  off();
});
</script>
<style lang="scss" scoped>
@import url(./main-layout.scss);
.page-main {
  max-width: $layout_max_width;
  min-width: $layout_min_width;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  .video_page {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>