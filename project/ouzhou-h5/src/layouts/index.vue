<!--
 * @Author:
 * @Description:
-->
<template>
  <q-layout view="lHh Lpr lFf" class="layout_container ouzhou-h5-layout">
    <!-- 顶部菜单 -->
    <TopMenuWapper />
    <q-page-container id="ouzhou-h5" class="page_container" >

      <!-- <router-view /> -->

      <router-view v-slot="{ Component }">
        <keep-alive :include="keep_comps">
          <component :is="Component" />
        </keep-alive>
      </router-view>

    </q-page-container>
    <div class="footer" id="page-footer">
       <!-- 投注框 -->
       <BetBoxWapper use_component_key="BetOuzhouH5"></BetBoxWapper>
      <FooterWapper />
    </div>
  </q-layout>

  <!-- token 失效页面 -->
  <token-invalid v-if="is_token_invalid_show" @is_go_vender_url="is_go_vender_url"></token-invalid>

  <!-- 吐司提示框 v-if="toast_show" -->
  <toast></toast>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute } from 'vue-router'

import { TopMenuWapper } from "src/base-h5/components/top-menu/"
import { BetBoxWapper } from "src/base-h5/components/bet/index.js";
import { FooterWapper } from "src/base-h5/components/footer-bar/"

import BetData from "src/core/bet/class/bet-data-class.js";

import { api_common } from "src/api/index.js";
import { useMittOn, MITT_TYPES, useMittEmit, i18n_t } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import TokenInvalid from "./token-invalid.vue"
import toast from "src/base-h5/components/common/toast.vue"

import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

import "./index.scss"

var tou_show = ref(true)
const is_token_invalid_show = ref(false); // token失效

const route = useRoute()
watch(() => route.path,newRoute => {
  tou_show.value = false
  if(newRoute == '/home' || newRoute == '/inplay' || newRoute == '/match'){
    tou_show.value = BetData.bet_single_list.length>0?true:false
  }
})

// 缓存组件名称
const keep_comps = computed(() => {
  return MatchResponsive.keep_comps.value
})



const inner_height = window.innerHeight;  // 视口高度

let lastTouchEnd = ref(0)
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

// 跳转第三方提供商链接
const is_go_vender_url = (value) => {
  is_token_invalid_show.value = false;
  window.is_token_invalid_show=false;
  UserCtr.set_user_token('')
  if (value) goto_vender_url();
}
// 跳转第三方提供商链接
const goto_vender_url = () => {
  // let url = lodash.get(UserCtr,'callbackUrl',lodash.get(UserCtr,'loginUrl')) 
  // if (url) {
  //   nextTick(()=> {
  //     location.href = url;
  //   })
  // } else {
    window.close();
    // console.warn('跳转地址不存在！')
  // }
}



onMounted(() => {
  // 阻止双击放大
  document.addEventListener("touchstart", touchstart_event_fun, false);
  document.addEventListener("touchend", touchend_event_fun, false);
  // 阻止双指放大
  document.addEventListener("gesturestart", gesturestart_event_fun);
  init_local_server_time()
  // 设置设备类型
  BetData.set_device_type(1)
  nextTick(() => {
    // 隐藏loading动画 
    useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,0);
  })
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
  }).off,
  // 登录失效
  useMittOn(MITT_TYPES.EMIT_GO_TO_VENDER, () => {
    if (!is_token_invalid_show.value) is_token_invalid_show.value = true
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

.footer{
  position: sticky;
  bottom: 0;
  // 不能高于投注框的z-index: 1600
  // 可能存在列表项超过1000个之后z-index大于下值导致底部栏被遮挡
  z-index: 1100;
}
.bar-top{
    // position: fixed;
    display: flex;
    align-items: center;
    text-align: center;
    height: 56px;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
    // bottom: 56px;
    width: 100%;
    z-index: 900;
}
.select-mask {
  position: fixed;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  z-index: 2000;
  left: 0
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

.layout_container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .layouts_header {
    height: 50px;

    :deep(.q-layout__shadow) {
      display: none;
    }

  }

  :deep(.q-drawer) {
    width: 260px !important;
  }

  .page_container {
    // height: calc(100% - 50px);
    // overflow: hidden;
    // margin-top: 50px;
    flex: 10;
    height: 0;
    padding-top: 0 !important;
    display: flex;
    flex-direction: column;
    position: relative;
    :deep(.q-drawer-container){
      .q-drawer__backdrop {
        background-color: rgba(56, 55, 50, 0.6) !important;
        filter: blur(5px);
      }
      .q-drawer__opener{
        display: none;
        z-index: -1;
      }
    }
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