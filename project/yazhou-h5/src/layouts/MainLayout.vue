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
        <!-- <betMixBox /> -->
         <!--页脚-->
    <menu-wapper use_component_key="H5FooterMenu" class='m-layout' v-if="['sport_menu', 'matchList', 'sport_menu', ].includes(route.name)">
    </menu-wapper>

    <!-- 投注记录弹层 -->
    <div v-if="record_show" :class="get_settle_dialog_bool && 'shadow-box2'" class="shadow-box" @click="change_settle_status(false)" @touchmove.prevent></div>
    <!-- 投注记录弹框（已结算+未结算） -->
    <div class="bet-record-box" v-if="record_show" :class="get_settle_dialog_bool && 'bet-record-box2'" :style="{bottom:calc_bottom}">
      <!-- 结算弹窗 -->
      <settle-dialog></settle-dialog>
    </div>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, defineAsyncComponent, nextTick } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import {MenuWapper} from "src/components/menu/index.js"
import { useRoute } from "vue-router"
import betMixBox from "src/components/bet/components/bet_mix_box.vue"
import store from "src/store-redux/index.js"
const settleDialog = defineAsyncComponent(() => import("project_path/src/pages/cathectic/index.vue"))
// import { i18n } from "src/boot/i18n.js";
// import layoutHeader from "./layout-header.vue";
// import layoutConent from "./layout-content.vue";
const route = useRoute()
let get_accept_show = ref(false); // 接受更好赔率变化 弹窗
let get_combine_tips_show = ref(false); // 合并投注项提示弹框 弹窗
const record_show = ref(false)
let lastTouchEnd = ref(0);


let unsubscribe = store.subscribe(() => {
  const { globalReducer: new_globalReducer } = store.getState()
  record_show.value = true
    
})
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
    let rem_1 = window.innerWidth * 100 / 375;
    return '-' + window.innerHeight - rem_1 + 'px';
}
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
    record_show.value = true
    nextTick(() => {
      store.dispatch({
        type: "SET_SETTLE_DIALOG_BOOL",
        data: true,
      })
      set_settle_dialog_bool(true)
    })
  }
  else {
    store.dispatch({
        type: "SET_SETTLE_DIALOG_BOOL",
        data: false,
      })
    timer_3 = setTimeout(() => {
      record_show.value = false
    }, 300);
  }
}
onMounted(() => {
  // 阻止双击放大
  document.addEventListener("touchstart", touchstart_event_fun, false);
  document.addEventListener("touchend", touchend_event_fun, false);
  // 阻止双指放大
  document.addEventListener("gesturestart", gesturestart_event_fun);
  useMittOn(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, (val) => record_show.value = val)
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
