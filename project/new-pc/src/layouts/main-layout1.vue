
<template>
  <div class="page-main full-height" id="parent" :style="layout_style">
    <div :style="{ height: LayOutMain_pc.layout_top_height }">
      <!-- 搜索 -->
      <!--<search-wapper />-->
      <!-- 页面头部容器-->
      <layout-header />
    </div>
    <div v-show="false"> {{ LayOutMain_pc.layout_version }}-{{ BetData.bet_data_class_version }}-{{
      LayOutMain_pc.layout_content_width }}-{{ UserCtr.user_version }}</div>
    <div class="flex">
      <!-- 左侧 菜单 -->
      <div :style="{ height: LayOutMain_pc.layout_content_height + 'px', width: LayOutMain_pc.layout_left_width + 'px' }"
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
    <!-- <moveVideo v-if="lodash.get(UserCtr.get_user(), "merchantEventSwitchVO.eventSwitch")"></moveVideo> -->
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
import { onUnmounted, watch, onMounted, onBeforeMount, ref, reactive, nextTick } from "vue";

import { useRoute, useRouter } from "vue-router";
// import "./main-layout.js"; //初始化数据

import { LayOutMain_pc, UserCtr, MenuData } from "src/output/index.js";
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
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import { set_sticky_top } from 'src/core/match-list-pc/match-card/module/sticky-top.js'
import { compute_css_variables } from "src/core/css-var/index.js"
import { set_template_width } from 'src/core/match-list-pc/list-template/match-list-tpl.js'

// 监听页面是否转入休眠状态
window.addEventListener("resize", resize_);

const layout_style = ref('')
const ref_data = reactive({
  emit_lsit: {}
})

const route = useRoute();
const router = useRouter();

let upd_time_refresh_timer;

onBeforeMount(() => {
  clearInterval(upd_time_refresh_timer)
})

onMounted(() => {
  // 全局一秒钟定时器
  upd_time_refresh_timer = setInterval(global_one_second_timer, 1000);
  UserCtr.set_e_sports_domain_img()
  set_components_style()
  ref_data.emit_lsit = {
    emitter_3: useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, set_components_style).off
  }
})

onUnmounted(() => {
  Object.values(ref_data.emit_lsit).map((x) => x());

  window.removeEventListener("resize", resize_);
  clearInterval(upd_time_refresh_timer)

})

// 公共全局主题色
function global_color_obj() {
  // 背景色
  let bg = compute_css_variables({ category: 'global', module: 'background' })
  // 边框色
  let bd = compute_css_variables({ category: 'global', module: 'border' })
  // 字体色
  let tc = compute_css_variables({ category: 'global', module: 'color' })
  // 渐变色
  let lg = compute_css_variables({ category: 'global', module: 'linear-gradient' })
  // layout
  let layout = compute_css_variables({ category: 'component', module: 'layout' })
  return {
    ...bg,
    ...bd,
    ...tc,
    ...lg,
    ...layout
  }
}

// 设置组件样式
const set_components_style = () => {
  nextTick(() => {
    // layout_style.value = compute_css_variables({ category: 'component', module: 'layout' })
    layout_style.value = global_color_obj()
    console.error('layout_style.value', layout_style.value)
  })
}

/**
 * @Description 全局一秒钟定时器 
 * @param {undefined} undefined
*/
const global_one_second_timer = () => {
  useMittEmit(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, { time: new Date().getTime(), step: 1000 })
}
function resize_() {
  LayOutMain_pc.set_layout_content_config()
}
watch(LayOutMain_pc.layout_version, () => set_template_width(LayOutMain_pc.layout_content_width - 15), { immediate: true })
watch(() => [router.path, MenuData.menu_data_version.value], lodash.throttle(set_sticky_top, 10), { immediate: true })
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