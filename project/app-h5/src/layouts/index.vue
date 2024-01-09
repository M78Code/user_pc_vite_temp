<!--
 * @Author:
 * @Description:
-->
<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}-{{BetData.bet_s_list?.length}}-{{BetData.bet_box_h5_show}}</div>
  <q-layout view="lHh Lpr lFf" class="layout_container">
    <q-page-container id="app-h5" class="page_container" :style="`height:${inner_height}px`">
      <!-- <layout-header /> -->
      <!-- <layout-conent /> -->
      <!-- <MenuWapper v-if="['sport_menu', 'matchList'].includes(route.name)">
        <template #menu-right>
          <activityIcon />
          <setMenu />
        </template>
      </MenuWapper> -->
      <!-- 当路由为盘口教程时 不展示topMenu 和 scrollMenu -->
      <!-- <layoutTop /> -->
      
      <router-view />
      <BetBoxWapper />

      <!--页脚-->
      <Tabbar id="page-footer" class="m-layout" v-if="['sport_menu', 'matchList', 'virtual_sports', 'esports_sports'].includes(route.name)">
      </Tabbar>

      <!-- 筛选+搜索   已脱离文档流-->
      <!-- <div v-if="select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
        <div style="height:100%;width: 100%" @click="select_dialog = false" />
        <setect-league @closedHandle="select_dialog = false"></setect-league>
      </div> -->

      <!-- token失效弹框 -->
      <token-invalid v-if="is_token_invalid_show" @is_go_vender_url='is_go_vender_url'></token-invalid>

      <div v-if="setting_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
        <div style="height:100%;width: 100%" @click="setting_dialog = false"></div>
        <!-- 筛选弹窗 -->
        <setting-filter @closedHandle="setting_dialog = false"></setting-filter>
      </div>

      <!-- 投注记录弹层 -->
      <div class="shadow-box" v-if="record_show" @click="change_settle_status(false)" @touchmove.prevent></div>
      <!-- 投注记录弹框（已结算+未结算） -->
      <div class="bet-record-box" v-if="record_show" >
        <!-- 结算弹窗 -->
        <settle-dialog></settle-dialog>
      </div>
      
      <div v-show="false">{{ BetData.bet_data_class_version }}-{{BetData.bet_s_list.length}}-{{BetData.bet_box_h5_show}}</div>


      <!-- 串关投注 只有串关/电竞/VR 才展示--> 
      <q-page-sticky position="bottom-right" :offset="fabPos" v-if="!BetData.is_bet_single && (is_mix||is_esports||is_vr|| is_detail_category()) && BetData.bet_s_list.length && !is_activity">
          <div class="chain_bet" @click="show_chain_bet" :disable="draggingFab" v-touch-pan.prevent.mouse="moveFab">
            <span class="count">{{BetData.bet_s_list.length}}</span>
          </div>
      </q-page-sticky>

    </q-page-container>
  </q-layout>
  <!-- 吐司提示框 v-if="toast_show" -->
  <toast></toast>

  <!-- 商户活动的弹层,只在home页展示，两个都已 脱离文档流-->
  <!-- <activity-layer v-if="activity_status" @activity_hide="activity_status = false" :activity_layerimg="activity_layerimg"
    :count_down_time="userBannerTimer" /> -->
  <StandardEdition></StandardEdition>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  computed, 
} from "vue";
import StandardEdition from 'src/base-h5/components/standard-edition/index.vue'
import { useMittOn, MITT_TYPES, useMittEmit, i18n_t, MenuData } from "src/output/index.js";
import {is_mix,is_esports,is_vr, is_detail_category} from "src/base-h5/mixin/menu.js"
import UserCtr from "src/core/user-config/user-ctr.js"; 
import { Tabbar } from 'src/base-h5/components/menu/app-h5-menu/index'
import { BetBoxWapper } from "src/base-h5/components/bet";

import settingFilter from 'src/base-h5/components/setting-filter/index.vue'
// import layoutTop from "./top.vue"
import { useRoute } from "vue-router";
import { api_common } from "src/api/index.js";
import PageSourceData from "src/core/page-source/page-source.js";
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import { bet_special_series_change,get_query_bet_amount_common,set_market_id_to_ws } from "src/core/bet/class/bet-box-submit.js"
import TokenInvalid from "./token-invalid.vue"
import {debounce} from "lodash";
import { api_account } from "src/api/index";
// import betMixBoxChild from "src/base-h5/components/bet/bet-box-app-h5-1/bet_mix_box_child.vue";
import toast from "src/base-h5/components/common/toast.vue"
import settleDialog from "project_path/src/pages/cathectic/index.vue"

import BetData from "src/core/bet/class/bet-data-class.js";// project/yazhou-h5/src/components/common/toast.vue

import "./index.scss"
const inner_height = ref(window.innerHeight);  // 视口高度
const route = useRoute();

const record_show = ref(false);
const lastTouchEnd = ref(0);
// const select_dialog = ref(false)//暂时筛选窗口
const setting_dialog = ref(false)//暂时筛选窗口
const activity_status = ref(false)//首页活动弹框
const activity_layerimg = ref("") //首页活动图
const userBannerTimer = ref(5);
const is_token_invalid_show = ref(false); // token失效
const timer_3 = ref(null);
// 开启注单历史弹窗及遮罩
const settle_dialog_bool = ref(true);

// 活动页面不展示串关入口
const is_activity = computed(() => {
    return route.path === '/activity';
  });


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
/**
 * @description: 设置当前版本 
 */
const set_standard_edition_fun = () => {
  const status =  sessionStorage.getItem('standard_edition') || 2
    UserCtr.set_standard_edition(Number(status));
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
  } else {
    timer_3.value = setTimeout(() => {
      record_show.value = false;
    }, 300);
  }
};
/**
 * @description 获取服务器当前时间
 */
const init_local_server_time = () => {
  api_common.get_time_server().then(res => {
    let server_time = res.data;
    let local_time = new Date().getTime();
    PageSourceData.set_init_time({
      server_time,
      local_time,
    });
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

// 显示串关投注弹框
const show_chain_bet = () => {
  // 不满足串关条件 不允许 展开投注项
  if(!bet_special_series_change()){
    return
  }
  // 获取限额
  get_query_bet_amount_common()
  // 订阅推送
  set_market_id_to_ws()
  BetData.set_bet_box_h5_show(true)
}

// 串关投注按钮拖拽
const fabPos = ref([15, 8]);
const draggingFab = ref(false)
const moveFab = (e) => {
  draggingFab.value = e.isFirst !== true && e.isFinal !== true
  // console.log(e, e.distance, e.position, 'eee', e.isFinal);
  e.evt.target.style.opacity = '0.6'
  // 处理左右边界条件
  if(e.position.left <= 30) {
    fabPos.value[0] = 300
  } else if (e.position.left >= 300) {
    fabPos.value[0] = 15
  }
  // 处理上下边界条件
  if(e.position.top <= 70) {
    fabPos.value[1] = 505
  } else if (e.position.top >= 600) {
    fabPos.value[1] = -20
  };
  fabPos.value = [
    fabPos.value[0] - e.delta.x,
    fabPos.value[1] - e.delta.y
  ]
  if(e.isFinal) {
    e.evt.target.style.opacity = '1'
    stickyAside(e.position.left)
  }
}

// 贴紧到侧边栏
const stickyAside = (x) => {
  // console.log(1111, x, y, fabPos.value);
  if(x <= 145) {
    fabPos.value[0] = 300
  } else {
    fabPos.value[0] = 15
  }
}

onMounted(  () => {
  console.log("~~~~~~~~~~~",is_activity)
    //设置当前默认版本
  set_standard_edition_fun()
  //获取当前版本默认值
  window.onresize = debounce((e) => {
    console.log(e)
    inner_height.value = window.innerHeight
  }, 500)
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
  // 上报用户当前使用的版本 
  shangbao_version()
});

// 上报用户当前使用的版本 
//点击切换新版的时候传参，旧版传空参即可，
// frontVer参数：PC>pc-new,H5>h5-new
const shangbao_version= async ()=>{
 //当前是新系统还是旧系统
 await api_account.get_UserVersion({frontVer:'h5-new'})

}

const mitt_list = [
  // 监听设置框状态
  useMittOn(MITT_TYPES.EMIT_CHANGE_SETTING_SHOW, function (value) {
    // this.select_cleck = type
    //   this.select_dialog = val
    setting_dialog.value = value.open
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
  // 开启注单历史弹窗
  useMittOn(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, (val) => {
    // footer中点击，传过来的是对象，根据settle值确定显示未结注单还是已结注单
    if(typeof(val) === 'object') {
      const num = val.settle ? 3 : 0;
      BetRecordClass.set_selected(num);
    }
    change_settle_status(Boolean(val));
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
  timer_3.value = null;
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--q-gb-bg-c-27);
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
    width: 260px;
  }

  .page_container {
    overflow: hidden;
    // margin-top: 50px;
    display: flex;
    flex-direction: column;
    padding-top: 0 !important;
  }

  /* ************** 悬浮按钮 ************** -E */
  /* **********注单记录********************* *-S*/
  .shadow-box {
    background-color: rgba(0, 0, 0, .4); //var(--q-color-page-bg-color-4);
    opacity: 1;
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
    top: 10vh;
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
// 串关按钮
.q-page-sticky {
  z-index: 599;
  transition: .4s ease-out;
}
.chain_bet {
  width: 0.48rem;
  height: 0.48rem;
  position: fixed;
  bottom: .72rem;
  right: .14rem;
  z-index: 999;
  // background-color: #f00;
  background: url($SCSSPROJECTPATH+"/image/bet/chuan_bet.png") no-repeat center / contain;
  // position: relative;
  .count {
    width: 0.2rem;
    height: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--q-gb-bg-c-15);
    border-radius: 50%;
    color: var(--q-gb-t-c-14);
    background-color: #f76565;
    position: absolute;
    top: -.06rem;
    right: -.06rem;
    font-weight: 600;
  }
}
</style>