
<template>
  <div class="page-main full-height" :style="page_style" id="parent">
    <div :style="{ height: LayOutMain_pc.layout_top_height }">
      <!-- 搜索 -->
      <!--<search-wapper />-->
      <!-- 页面头部容器-->
      <layout-header />
    </div>
    <div v-show="true"> {{ LayOutMain_pc.layout_version }}-{{ BetData.bet_data_class_version }}-{{LayOutMain_pc.layout_content_width}}</div>
    <div class="flex" >
      <!-- 左侧 菜单 -->
      <div :style="{ height: LayOutMain_pc.layout_content_height + 'px', width: LayOutMain_pc.layout_left_width }"
        class="layout_main_left">
        <layout-left />
      </div>
      <div
        :style="{ height: LayOutMain_pc.layout_content_height + 'px', width: LayOutMain_pc.layout_content_width + 'px' }"
        class="layout_main_center">
        <!-- 中间区域 -->
        <router-view class="col" :class="{
          video_page: route.params.video_size == 1,
        }" v-slot="{ Component }">
          <keep-alive include="matchListRouter" max="1">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
      <!-- 右侧 视频  动画 比分板 详情 -->
      <div :style="{ height: LayOutMain_pc.layout_content_height + 'px', width: LayOutMain_pc.layout_right_width + 'px' }"
        class="layout_main_right">
        <layout-right />
      </div>
    </div>
    <!-- 视频画中画组件 -->
    <!-- <moveVideo v-if="show_move_video"></moveVideo> -->
    <!-- toast 消息提示 -->
    <toast-components />
    <confirm-components />
    <alert-components />

    <Vue3DraggableResizable v-model:x="BetData.bet_box_draggable.x" v-model:y="BetData.bet_box_draggable.y"
      v-model:h="BetData.bet_box_draggable.height" v-model:active="BetData.bet_box_draggable.isActive" :draggable="true"
      :parent="true" :resizable="false" parent="#parent" v-if="BetData.bet_box_draggable.show">
      <div class="ty-bet-box">
        <bet-box-wapper use_component_key="BetBoxYaZhouPC_1" />
      </div>
    </Vue3DraggableResizable>
  </div>
</template>
<script setup>
import { ref, computed, onUnmounted, watch } from "vue";

import { useRoute } from "vue-router";
// import "./main-layout.js"; //初始化数据

import { LayOutMain_pc, UserCtr, GlobalAccessConfig } from "src/output/index.js";
import BetData from 'src/core/bet/class/bet-data-class.js'
import { BetBoxWapper } from "src/base-pc/components/bet";

/**组件*/
import layoutHeader from "./layout-header.vue";
import layoutLeft from "./layout-left.vue";
import layoutRight from "./layout-right.vue";
import toastComponents from "src/base-pc/components/toast/toast.vue";
import alertComponents from "src/base-pc/components/toast/alert.vue";
import confirmComponents from "src/base-pc/components/toast/confirm.vue";
// import moveVideo from 'src/base-pc/components/video-replay/move-video.vue'
import { compute_css_variables } from "src/core/css-var/index.js"
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'layout' })
// 监听页面是否转入休眠状态
document.addEventListener('visibilitychange', event_listener_visibilitychange);
document.addEventListener('pagehide', event_listener_visibilitychange);
window.addEventListener("resize", resize_);


const route = useRoute();
/**
 * @Description 全局一秒钟定时器 
 * @param {undefined} undefined
*/
const global_one_second_timer = () => {
  useMittEmit(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, { time: new Date().getTime(), step: 1000 })
}

function resize_(){
  LayOutMain_pc.set_layout_content_config()
}

//重新计算高度
const mitt_offs = [
  // useMittOn(MITT_TYPES.EMIT_LAYOUT_RESIZE, debounce(resize, 150)).off,
];
// resize();
// 屏蔽视频移动组件(视频回播功能)
const get_user = ref(UserCtr.get_user())
const show_move_video = computed(() => {
  return lodash.get(get_user.value, "merchantEventSwitchVO.eventSwitch")
})
let vue_hidden_run_flg = false;
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

/* Í监听user版本号 */
watch(() => UserCtr.user_version, (val) => {
  if (val) {
    get_user.value = UserCtr.get_user()
  }
}) 

onUnmounted(() => {
  document.removeEventListener('visibilitychange', event_listener_visibilitychange);
  document.removeEventListener('pagehide', event_listener_visibilitychange);
  window.removeEventListener("resize", resize_);
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

:deep(.vdr-container) {
  width: 438px;
  border: none;
  z-index: 30000;
}

:deep(.ty-bet-box) {
  width: 100%;
  height: 100%;
}
</style>