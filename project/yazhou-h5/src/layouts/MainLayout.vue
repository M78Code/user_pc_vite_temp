<!--
 * @Author:
 * @Description:
-->
<template>
  <div>
    <q-layout view="lHh Lpr lFf" class="layout_container">
      <q-page-container class="page_container">
        <!-- <layout-header /> -->
        <!-- <layout-conent /> -->
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt/";
import { i18n } from "src/boot/i18n";
import layoutHeader from "./layout-header.vue";
import layoutConent from "./layout-content.vue";
let get_accept_show = ref(false); // 接受更好赔率变化 弹窗
let get_combine_tips_show = ref(false); // 合并投注项提示弹框 弹窗
let lastTouchEnd = ref(0);
// 是否展示左侧菜单
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// useMittOn(MITT_TYPES["change_accept"], (e) => {
//   get_accept_show.value = e
// })
// useMittOn(MITT_TYPES["change_combine_tips"], (e) => {
//   get_combine_tips_show.value = e
// })
/**
 * @description: touchstart事件方法体
 */
const touchstart_event_fun = (event) => {
  if (event.touches.length > 0) {
    // 记录用户最后操作时间
    event.preventDefault();
    // alert('禁止')
  }
};
/**
 * @description: touchend事件方法体
 */
const touchend_event_fun = (event) => {
  var now = Date.now();
  if (parseInt(now - lastTouchEnd.value) < 300) {
    event.preventDefault();
  }
  lastTouchEnd.value = now;
};
/**
 * @description: gesturestart事件方法体
 */
const gesturestart_event_fun = (event) => {
  event.preventDefault();
};

const show_bet = () => {
  useMittOn(MITT_TYPES.EMIT_SET_SCROLL_TOP, true);
};
onMounted(() => {
  // 阻止双击放大
  document.addEventListener("touchstart", touchstart_event_fun, false);
  document.addEventListener("touchend", touchend_event_fun, false);
  // 阻止双指放大
  document.addEventListener("gesturestart", gesturestart_event_fun);
});
onUnmounted(() => {
  document.removeEventListener("touchstart", touchstart_event_fun);
  document.removeEventListener("touchend", touchend_event_fun);
  document.removeEventListener("gesturestart", gesturestart_event_fun);
});
</script>

<style lang="scss" scoped>
.layout_container {
  height: 100%;
  overflow: hidden;
  .layouts_header {
    height: 50px;
    :deep(.q-layout__shadow) {
      display: none;
    }
    :deep(.q-drawer-container) {
      .q-drawer__backdrop {
        background-color: rgba(56, 55, 50, 0.6) !important;
        filter: blur(5px);
      }
      .q-drawer__opener {
        display: none;
      }
    }
  }
  :deep(.q-drawer) {
    width: 260px !important;
  }
  .page_container {
    height: calc(100% - 50px);
    overflow: hidden;
    // margin-top: 50px;
    padding-top: 0 !important;
  }
}
</style>
