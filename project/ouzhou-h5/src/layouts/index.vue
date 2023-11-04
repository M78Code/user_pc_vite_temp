<!--
 * @Author:
 * @Description:
-->
<template>
  <q-layout view="lHh Lpr lFf" class="layout_container">
    <q-page-container id="ouzhou-h5" class="page_container" :style="`height:${+inner_height / 100}rem`">
      
      <!-- 顶部菜单 -->
      <TopMenuWapper />
      
      <router-view />

      <!-- 投注框 -->
      <BetBoxWapper />

     
      <FooterWapper />

    </q-page-container>
  </q-layout>

  <!-- 吐司提示框 v-if="toast_show" -->
  <toast></toast>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
  nextTick,
} from "vue";


import { MenuWapper } from "src/base-h5/components/menu";
import { TopMenuWapper } from "src/base-h5/components/top-menu/"
import { BetBoxWapper } from "src/base-h5/components/bet";
import { FooterWapper } from "src/base-h5/components/footer-bar/"

import { useRoute } from "vue-router";

import { api_common } from "src/api/index.js";
import { useMittOn, MITT_TYPES, i18n_t, UserCtr,MenuData } from "src/core/";

const toast = defineAsyncComponent(() =>
  import("src/base-h5/components/common/toast.vue")
);


import BetData from "src/core/bet/class/bet-data-class.js";


import "./index.scss"

const inner_height = window.innerHeight;  // 视口高度
const route = useRoute();

// 是否展示左侧菜单
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};


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

/**
 * @description 获取服务器当前时间
 */
const init_local_server_time = () => {
  api_common.get_time_server().then(res => {
    let server_time = res.data;
    let local_time = new Date().getTime();
    // PageSourceData.set_init_time({
    //   server_time,
    //   local_time,
    // });
  });
}
onMounted(() => {
  // 阻止双击放大
  document.addEventListener("touchstart", touchstart_event_fun, false);
  document.addEventListener("touchend", touchend_event_fun, false);
  // 阻止双指放大
  document.addEventListener("gesturestart", gesturestart_event_fun);
  init_local_server_time()
  // 开启注单历史弹窗
  useMittOn(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, (val) => {
    // footer中点击，传过来的是对象，根据settle值确定显示未结注单还是已结注单
    if(typeof(val) === 'object') {
      const num = val.settle ? 3 : 0;
      BetRecordClass.set_selected(num);
    }
    change_settle_status(Boolean(val));
  });
  // 设置设备类型
  BetData.set_device_type(1)
});
const mitt_list = [
  // 监听设置框状态
  useMittOn(MITT_TYPES.EMIT_CHANGE_SETTING_SHOW, function (value) {
    // this.select_cleck = type
    //   this.select_dialog = val
    setting_dialog.value = value
  }).off,
  // 监听搜索框状态
  // useMittOn(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, function (value) {
  //   // this.select_cleck = type
  //   //   this.select_dialog = val
  //   select_dialog.value = value
  // }).off,
  //首页活动弹框
  useMittOn(MITT_TYPES.EMIT_INDEX_ACTIVITY_STATUS, function (imgUrl) {
    if (route.name == 'home' && imgUrl) {
      activity_status.value = true;
      activity_layerimg.value = imgUrl;
      //T弹框5秒之后 自动关闭
      let time = 5;
      userBannerTimer.value = i18n_t('common.auto_close').replace('%s', time);
      const _timme1 = setInterval(() => {
        time--
        console.error(time)
        userBannerTimer.value = i18n_t('common.auto_close').replace('%s', time);
        if (time == 0) {
          activity_status.value = false;
          clearInterval(_timme1)
        }
      }, 1000)
    }
  }).off,
  // 监听当前国际化语言
  useMittOn(MITT_TYPES.EMIT_LANG_CHANGE, () => {
    UserCtr.fetch_actimg()
    UserCtr.set_e_sports_domain_img()
  }).off
]
// 监听搜索弹框是否展示

onUnmounted(() => {
  document.removeEventListener("touchstart", touchstart_event_fun);
  document.removeEventListener("touchend", touchend_event_fun);
  document.removeEventListener("gesturestart", gesturestart_event_fun);
  // timer_3.value = null;
  // unsubscribe();
  mitt_list.map(i => i())
});




if (UserCtr.get_user_token()) {
  //获取资源配置(商户后台配置的图片、跳转链接)  延迟触发以优化首屏加载速度
  UserCtr.fetch_resourcesimg()
  // 电竞图片域名 获取
  UserCtr.set_e_sports_domain_img()
}
</script>
<style lang="scss" scoped>
.select-mask {
  position: fixed;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  z-index: 2000;
  left: 0
}

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
    background-color: rgba(0, 0, 0, 1); //var(--q-color-page-bg-color-4);
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

  .bet-record-box2+.shadow-box {
    opacity: 1;
  }

  /* **********注单记录********************* *-S*/
  .bet-record-box {
    width: 80%;
    max-width: 7.7rem !important;
    transition: bottom 0.3s;
    position: fixed;
    left: 10%;
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
