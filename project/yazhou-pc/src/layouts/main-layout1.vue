<template>
  <div class="page-main full-height">
    <layout-header />
    <div class="flex" :style="{ height: content_height }">
      <layout-left class="full-height" :style="{ height: content_height }" />
      <!-- 中间区域 -->
      <keep-alive include="matchListRouter" max="1">
        <router-view
          class="col"
          :style="computed_style"
          :class="{
            video_page: route.params.video_size == 1,
          }"
        />
      </keep-alive>
      <layout-right class="full-height" :style="{ height: content_height }" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import store from "src/store-redux/index.js";
import "./main-layout.js"; //初始化数据
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
const layout_setting = layoutReducer.layout_size;
/**
 *映射store内部的方法
 */
const methods_map_store = [
  // 保存列表的宽度
  "SET_LAYOUT_LIST_WIDTH",
  "SET_IS_MIN_WIDTH",
  //设置全局开关
  "set_global_switch",
  // 设置左侧布局
  "set_layout_left_show",
  //设置多列玩法状态
  "set_unfold_multi_column",
  // 页面所有布局宽高信息
  "SET_LAYOUT_SIZE",
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
emit();
function resize() {
  const { layoutReducer } = store.getState();
  let {
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
  } = layout_setting;
  let {
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
  let client_width = document.documentElement.clientWidth;
  // 浏览器高度
  let client_height = document.documentElement.clientHeight;
  //小于最小宽度
  if (client_width < min_width) {
    //"mini-normal" 自己展开的 不做操作
    if ("normal" == main_menu_toggle) {
      main_menu_toggle = "mini";
      methods_map_store["set_left_menu_toggle"](main_menu_toggle);
      //通知菜单变mini
      useMittEmit(MITT_TYPES.EMIT_LAYOUT_MENU_TOGGLE, true);
    }
  } else {
    if ("mini" == main_menu_toggle) {
      main_menu_toggle = "normal";
      methods_map_store["set_left_menu_toggle"](main_menu_toggle);
      //通知菜单变展开normal
      useMittEmit(MITT_TYPES.EMIT_LAYOUT_MENU_TOGGLE, false);
    }
  }
  if (main_menu_toggle == "mini") {
    left_width = left_width_mini; //宽度变为 mini
  }
  //设置已是否达到 最小宽度 true/false
  methods_map_store["SET_IS_MIN_WIDTH"](client_width < min_width);
  content_height.value = client_height - nav_height - notice_height + "px";
  content_width.value = client_width - left_width - right_width + "px";
  methods_map_store["SET_LAYOUT_SIZE"]({
    //中间区域宽度
    center_width: content_width.value,
    // // 列表实际内容宽度，除去边框间距等等
    list_content_width: content_width.value,
    // // 主内容高度（菜单、列表、详情、右侧）
    content_height: content_height.value,
    // 列表实际内容宽度，除去边框间距等等
    list_content_width: 0,
  });
}
useEventListener({
  name: "resize",
  listener: resize,
  wait: 150,
});
// 用户是否操作过页面
let user_is_handle = false;
const remove_mousedown = useEventListener({
  name: "mousedown",
  listener: function () {
    /**
     * @Description 全局点击事件
     * @param {undefined} undefined
     */
    user_is_handle = true;
    remove_mousedown();
    // sessionStorage.setItem('is_send_today_football_zhuge2',1)
  },
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
    width: 100% !important;
    height: 100% !important;
  }
}
</style>