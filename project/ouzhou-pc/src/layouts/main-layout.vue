
<template>
  <div class="page-main full-height" :style="page_style" id="parent">
    <div :style="{ height: LayOutMain_pc.layout_top_height }">
      <!-- 搜索 -->
      <!-- <search-wapper /> -->
      <!-- 页面头部容器-->
      <layout-header />
    </div>
    <div v-show="false"> {{ LayOutMain_pc.layout_version }}-{{ BetData.bet_data_class_version }}-{{LayOutMain_pc.layout_secondary_dialog}}</div>
    <div class="flex full-content">
      <!-- 左侧 菜单 -->
      <div class="layout_main_left" :style="`width:${LayOutMain_pc.oz_left_width}px`" v-if="LayOutMain_pc.oz_show_left">
        <layout-left />
      </div>
      <div class="layout_main_center" :style="{
        width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,
        height: `calc(100vh - 68px)`
      }">
        <!-- 中间区域 -->
        <!-- https://www.cnblogs.com/yg_zhang/p/10867617.html -->
        <!-- 修复49535，搜索后如果本来在详情页，不会刷新页面 -->
        <router-view :key="route.fullPath"></router-view>
      </div>
      <!-- 右侧 视频  动画 比分板 详情 -->
      <div v-if="LayOutMain_pc.oz_show_right" :style="`width:${LayOutMain_pc.oz_right_width}px`" class="layout_main_right">
        <layout-right />
      </div>
    </div>
    <!-- 视频画中画组件 -->
    <!-- <moveVideo v-if="show_move_video"></moveVideo> -->
    <!-- toast 消息提示 -->
    <toast-components />
    <confirm-components />
    <alert-components />

    <secondaryModule></secondaryModule>
  
      <Vue3DraggableResizable v-model:x="BetData.bet_box_draggable.x" v-model:y="BetData.bet_box_draggable.y"
        v-model:active="BetData.bet_box_draggable.isActive" :draggable="BetData.bet_box_draggable.draggable" :resizable="false" :parent="true"
        v-if="BetData.bet_box_draggable.show && BetData.bet_oid_list.length">
        <div v-show="false">{{ BetData.bet_data_class_version }}</div>
        <div class="ty-bet-box" v-if="BetData.bet_oid_list.length">
          <bet-box-wapper use_component_key="BetBoxOuZhouPC_1" />
        </div>
      </Vue3DraggableResizable>
  </div>
</template>
<script setup>
import { ref, computed, onMounted ,onUnmounted,reactive, onBeforeMount, nextTick } from "vue";
import lodash_ from "lodash"
import { useRoute } from "vue-router";
import { LayOutMain_pc, GlobalAccessConfig ,MenuData} from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { api_betting, api_common } from "src/api/"
import { compute_css_variables } from "src/core/css-var/index.js"
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import BetData from 'src/core/bet/class/bet-data-class.js'

import layoutHeader from "./layout-header.vue";
import layoutLeft from "./layout-left.vue";
import layoutRight from "./layout-right.vue";
import toastComponents from "src/base-pc/components/toast/toast.vue";
import alertComponents from "src/base-pc/components/toast/alert.vue";
import confirmComponents from "src/base-pc/components/toast/confirm.vue";
import secondaryModule from 'src/base-pc/components/secondary-module/index.vue'
import { BetBoxWapper } from "src/base-pc/components/bet";
import { set_template_width } from 'src/core/match-list-pc/list-template/match-list-tpl.js'


const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'layout' })

let timeout_vue_hidden_run_flg = null
let vue_hidden_run_flg = null

const background_run_time = ref('')
const route = useRoute();

const ref_data = reactive({
  emit_lsit:{}
})

timeout_vue_hidden_run_flg = setTimeout(() => {
  vue_hidden_run_flg = true;
}, 4000);

// 监听页面是否转入休眠状态
document.addEventListener('visibilitychange', event_listener_visibilitychange);
document.addEventListener('pagehide', event_listener_visibilitychange);

// 屏蔽视频移动组件(视频回播功能)
const show_move_video = computed(() => {
  return lodash.get(UserCtr.get_user(), "merchantEventSwitchVO.eventSwitch")
})
set_template_width(LayOutMain_pc.layout_content_width - 15,MenuData.is_scroll_ball())
let upd_time_refresh_timer;
onMounted(() => {
  let obj = {
    x: window.innerWidth * 0.6,
    y: window.innerHeight * 0.4,
    isActive: false,
    height: "auto",
    draggable: true,
    show: true,
  }
  BetData.set_bet_box_draggable(obj)

  get_unsettle_tickets_count_config()
  // 投注成功后获取投注记录数据 24小时内的
  ref_data.emit_lsit = {
      emitter_1: useMittOn(MITT_TYPES.EMIT_TICKRTS_COUNT_CONFIG, get_unsettle_tickets_count_config).off,
  }
  get_event_info()
  // 全局一秒钟定时器
  upd_time_refresh_timer = setInterval(global_one_second_timer, 1000);
  nextTick(() => {
    // 隐藏loading动画 
    useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,0);
  })
})
// 获取var事件国际化
function get_event_info () {
  api_common.get_event_info().then(res => {
    if (res.code != 200) return
    UserCtr.set_var_event_i18n(res.data)
  })
}

/**
 * @Description 全局一秒钟定时器 
 * @param {undefined} undefined
*/
const global_one_second_timer = () => {
  useMittEmit(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD,  {time:new Date().getTime(), step:1000})
}

// 投注成功后获取投注记录数据 24小时内的
const get_unsettle_tickets_count_config = () => {
    let param = {};
    api_betting.get_unsettle_tickets_count(param).then(res => {
      let status = lodash_.get(res, "code");
      if (status == 200) {
        // 获取24小时内的投注量 
        let count = lodash_.get(res, "data", 0);
        BetData.set_bet_record_count(count)
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  function event_listener_visibilitychange(){
       if (!vue_hidden_run_flg) { return false }
       let _is_hidden = document.visibilityState == 'hidden'
      //  document.visibilityState == 'visible'
       if (_is_hidden) {
         window.DOCUMENT_HIDDEN = new Date().getTime()
       } else {
         // 获取 焦点后 ，页面激活 ，次开关打开 ，HTTP,WS 就会自动 打开开关
         window.DOCUMENT_HIDDEN = ''
       }

       // 设置当前页面是否后台运行中状态
       GlobalAccessConfig.set_vue_hidden_run(_is_hidden);
       //页面失去焦点 ，隐藏   后台运行
       if (_is_hidden) {
         background_run_time.value = new Date().getTime()
         // 在后台运行超过 over_timer 分钟后才广播刷新数据指令
       } else {
         // 页面 唤起  这里流程分 二种：
         // 流程一：   离开不到30分钟 ，  列表或者详情 ，监听到 页面聚焦时间 变更 ，重新拉取当前的接口
         // 流程二：   离开超过30分钟 ，  页面直接刷新 重走流程
         // 30分钟  重载刷新  页面
         let over_timer = 30 * (60 * 1000)
         let now_time = new Date().getTime()
         // 在后台共运行了多少时间
         let run_time = now_time - background_run_time.value
         // 页面需要 重载刷新
         let need_reload = run_time > over_timer
         //如果需要 重载刷新
         if (need_reload) {
          window.location.reload()
         } else {
           // 站点 tab 休眠状态转激活  ，
           useMittEmit(MITT_TYPES.EMIT_SITE_TAB_ACTIVE )
         }
       }
}

  onBeforeMount(()=>{
    clearInterval(upd_time_refresh_timer)
  })
  onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
    document.removeEventListener('visibilitychange', event_listener_visibilitychange);
    document.removeEventListener('pagehide', event_listener_visibilitychange);
    clearInterval(upd_time_refresh_timer)
})

</script>
<style lang="scss">
@import url(./content-layout.scss);
@import url(./main-layout.scss);
@import url(./match-list.scss);
</style>
<style lang="scss" scoped>
.page-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--q-gb-bg-c-6);

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
  padding-top: 10px;
  padding-right: 10px;
}

.layout_main_center {
  padding: 10px 0 0;
  // height: 100%;
}

.layout_main_right {
  padding-top: 10px;
  margin-left: 10px;
}


:deep(.vdr-container) {
  width: 438px;
  border: none;
  z-index: 30000;
}

:deep(.ty-bet-box) {
  width: 100%;
  height: 100%;
}

.full-content {
  flex-wrap: nowrap;
  min-width: 1440px;
  margin: 0 auto;
}
</style>