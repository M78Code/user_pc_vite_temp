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
        <betMixBox />
        <!--页脚-->
        <FooterWapper
          class="m-layout"
          v-if="['sport_menu', 'matchList', 'sport_menu'].includes(route.name)"
        >
        </FooterWapper>

        <!-- 投注记录弹层 -->
        <div
          v-if="record_show"
          :class="settle_dialog_bool && 'shadow-box2'"
          class="shadow-box"
          @click="change_settle_status(false)"
          @touchmove.prevent
        ></div>
        <!-- 投注记录弹框（已结算+未结算） -->
        <div
          class="bet-record-box"
          v-if="record_show"
          :class="settle_dialog_bool && 'bet-record-box2'"
          :style="{ bottom: calc_bottom }"
        >
          <!-- 结算弹窗 -->
          <settle-dialog></settle-dialog>
        </div>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  reactive,
  defineAsyncComponent,
  nextTick,
} from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import { FooterWapper } from "src/components/footer/index.js";
import { useRoute } from "vue-router";
import betMixBox from "src/components/bet/components/bet_mix_box.vue";
import store from "src/store-redux/index.js";
const settleDialog = defineAsyncComponent(() =>
  import("project_path/src/pages/cathectic/index.vue")
);
import BetData from "src/core/bet/class/bet-data-class.js";// import { i18n } from "src/boot/i18n.js";
// import layoutHeader from "./layout-header.vue";
// import layoutConent from "./layout-content.vue";

const { footerMenuReducer } = store.getState();
const route = useRoute();
const get_accept_show = ref(false); // 接受更好赔率变化 弹窗
const get_combine_tips_show = ref(false); // 合并投注项提示弹框 弹窗
const record_show = ref(false);
const lastTouchEnd = ref(0);

const timer_3 = ref(null);
// 开启注单历史弹窗及遮罩
const settle_dialog_bool = ref(footerMenuReducer.settle_dialog_bool);

let unsubscribe = store.subscribe(() => {
  const { footerMenuReducer: new_footer_menu_reducer } = store.getState();
  settle_dialog_bool.value = new_footer_menu_reducer.settle_dialog_bool;
});
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
    // event.preventDefault();
    // alert('禁止')
  }
};
/**
 * @description: touchend事件方法体
 */
const touchend_event_fun = (event) => {
  var now = Date.now();
  if (parseInt(now - lastTouchEnd.value) < 300) {
    // event.preventDefault();
  }
  lastTouchEnd.value = now;
};
/**
 * @description: gesturestart事件方法体
 */
const gesturestart_event_fun = (event) => {
  event.preventDefault();
};

//计算投注记录框的样式
const calc_bottom = () => {
  let rem_1 = (window.innerWidth * 100) / 375;
  return "-" + window.innerHeight - rem_1 + "px";
};
const show_bet = () => {
  useMittOn(MITT_TYPES.EMIT_SET_SCROLL_TOP, true);
};
/**
 * @description 投注记录显示开关
 * @param {Boolean} val
 * @return {Undefined} undefined
 */
const change_settle_status = (val) => {
  // set_virtual_video_show(!val)
  if (val) {
    record_show.value = true;
    nextTick(() => {
      store.dispatch({
        type: "SET_SETTLE_DIALOG_BOOL",
        data: true,
      });
    });
  } else {
    store.dispatch({
      type: "SET_SETTLE_DIALOG_BOOL",
      data: false,
    });
    timer_3.value = setTimeout(() => {
      record_show.value = false;
    }, 300);
  }
};
onMounted(() => {
  // 阻止双击放大
  document.addEventListener("touchstart", touchstart_event_fun, false);
  document.addEventListener("touchend", touchend_event_fun, false);
  // 阻止双指放大
  document.addEventListener("gesturestart", gesturestart_event_fun);
  // 开启注单历史弹窗
  useMittOn(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, (val) => {
    // record_show.value = val
    change_settle_status(val);
  });
  // 设置设备类型
  BetData.set_device_type(1)
});
onUnmounted(() => {
  document.removeEventListener("touchstart", touchstart_event_fun);
  document.removeEventListener("touchend", touchend_event_fun);
  document.removeEventListener("gesturestart", gesturestart_event_fun);
  timer_3.value = null;
  unsubscribe();
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
  /* ************** 悬浮按钮 ************** -E */
  /* **********注单记录********************* *-S*/
  .shadow-box {
    background-color: rgba(0, 0, 0, 0.3); //var(--q-color-page-bg-color-4);
    opacity: 0;
    transition: opacity 0.3s;
    backdrop-filter: var(--q-color-backdrop-filter-bg-1);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 550;
    transition: opacity 0.3s;
  }
  .bet-record-box2 {
    bottom: -2px !important;
  }
  .shadow-box2 {
    opacity: 1;
  }
  .bet-record-box2 + .shadow-box {
    opacity: 1;
  }
  /* **********注单记录********************* *-S*/
  .bet-record-box {
    width: 100%;
    max-width: 7.7rem !important;
    transition: bottom 0.3s;
    position: fixed;
    left: 0;
    z-index: 600;
  }

  .match-main-menu {
    max-width: 3.78rem;
    width: 100%;
    position: fixed;
    top: 0;

    &.hide-menu {
      display: none;
    }
  }

  .shadow-box {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 550;
    transition: opacity 0.3s;
    background-image: url("");
  }

  .bet-record-box2 {
    bottom: -2px !important;
  }

  /* **********注单记录********************* *-E*/
}
</style>
