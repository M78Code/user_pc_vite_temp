
<template>
  <div class="page-main full-height" :style="page_style" id="parent">
    <div :style="{ height: LayOutMain_pc.layout_top_height  }">
      <!-- 搜索 -->
      <!--<search-wapper />-->
      <!-- 页面头部容器-->
      <layout-header />
    </div>
    <div style="display: none;"> {{ LayOutMain_pc.layout_version }}{{BetData.bet_data_class_version}}</div>
    <div class="flex">
      <!-- 左侧 菜单 -->
      <div :style="{ height: LayOutMain_pc.layout_content_height + 'px' , width:LayOutMain_pc.layout_left_width }" class="layout_main_left">
        <layout-left />
      </div>
      <div :style="{ height: LayOutMain_pc.layout_content_height + 'px' , width:LayOutMain_pc.layout_content_width + 'px' }" class="layout_main_center">
        <!-- 中间区域 -->
        <router-view
            class="col"
            :class="{
              video_page: route.params.video_size == 1,
            }"
            v-slot="{Component}"
          >
          <keep-alive include="matchListRouter" max="1">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
      <!-- 右侧 视频  动画 比分板 详情 -->
      <div :style="{ height: LayOutMain_pc.layout_content_height + 'px' , width:LayOutMain_pc.layout_right_width +'px' }" class="layout_main_right">
        <layout-right />
      </div>
    </div>
      <!-- 视频画中画组件 -->
      <!-- <moveVideo v-if="show_move_video"></moveVideo> -->
    <!-- toast 消息提示 -->
    <toast-components />
    <confirm-components />
    <alert-components />

    <Vue3DraggableResizable
      v-model:x="BetData.bet_box_draggable.x"
      v-model:y="BetData.bet_box_draggable.y"
      v-model:h="BetData.bet_box_draggable.height"
      v-model:active="BetData.bet_box_draggable.isActive"
      :draggable="true"
      :parent="true"
      :resizable="false"
      parent="#parent"
      v-if="BetData.bet_box_draggable.show"
    >
    <div  class="ty-bet-box">
      <bet-box-wapper use_component_key="BetBoxYaZhouPC_1"  />
    </div>
  </Vue3DraggableResizable>
  </div>
</template>
<script setup>
import { ref, computed,onBeforeUnmount,watch } from "vue";

import { useRoute } from "vue-router";
import "./main-layout.js"; //初始化数据

import { UserCtr } from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/index.js";

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

const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'layout' })

const route = useRoute();


//重新计算高度
const mitt_offs = [
  // useMittOn(MITT_TYPES.EMIT_LAYOUT_RESIZE, debounce(resize, 150)).off,
];
// resize();
 // 屏蔽视频移动组件(视频回播功能)
 const  get_user = ref(UserCtr.get_user())
const show_move_video = computed(()=>{
    return  lodash.get(get_user.value,"merchantEventSwitchVO.eventSwitch") 
  } )
  /* Í监听user版本号 */
 watch(()=>UserCtr.user_version,(val)=>{
  if(val){
    get_user.value =UserCtr.get_user()
  }
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

:deep(.vdr-container){
  width: 438px;
  border: none;
  z-index: 30000;
}
:deep(.ty-bet-box){
   width:100%;
  height:100%;
}
</style>