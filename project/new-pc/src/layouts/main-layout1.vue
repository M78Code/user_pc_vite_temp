
<template>
  <div class="page-main full-height" id="parent">
    <div :style="{ height: LayOutMain_pc.layout_top_height }">
      <!-- 搜索 -->
      <!--<search-wapper />-->
      <!-- 页面头部容器-->
      <layout-header />
    </div>
    <div v-show="false"> {{ LayOutMain_pc.layout_version }}-{{ BetData.bet_data_class_version}}-{{ LayOutMain_pc.layout_content_width }}-{{ UserCtr.user_version }}</div>
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
import { onUnmounted, watch,onMounted,onBeforeMount } from "vue";

import { useRoute,useRouter } from "vue-router";
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
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";


// 监听页面是否转入休眠状态
window.addEventListener("resize", resize_);

const route = useRoute();
const router = useRouter();

let upd_time_refresh_timer;
onMounted(() => {

  // 全局一秒钟定时器
  upd_time_refresh_timer = setInterval(global_one_second_timer, 1000);

})


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

onUnmounted(() => {
  window.removeEventListener("resize", resize_);
  clearInterval(upd_time_refresh_timer)
})

onBeforeMount(()=>{
    clearInterval(upd_time_refresh_timer)
  })




/**
   * @Description 设置吸顶高度
   * @param {Object}
  */
function set_sticky_top() {
  let type_name = ''
  let obj = {
    type: 32,
    league: 32
  }
  // 搜索页面
  if (route.name == 'search') {
    obj = {
      type: 36,
      league: 74
    }
  }
  // 冠军聚合页
  else if (type_name == 'winner_top') {
    obj = {
      type: 84,
      league: 122
    }
  }
  // 非滚球电竞
  else if (MenuData.is_esports() && !['hot', 'play'].includes(type_name)) {
    obj = {
      type: 196,
      league: 196
    }
  }
  // 冠军 并且不是早盘
  else if (MenuData.is_kemp() == 18 && type_name != 'early') {
    obj = {
      type: 40,
      league: 40
    }
  }
  // 今日
  else if (MenuData.is_today()) {
    obj = {
      type: 36,
      league: 74
    }
  }
  // 滚球
  else if (MenuData.is_scroll_ball()) {
    obj = {
      type: 84,
      league: 122
    }
    if (MenuData.is_show_hot) {
      obj = {
        type: 36,
        league: 74
      }
    }
    //虚拟体育
    if (MenuData.is_vr()) {
      // 虚拟足球
      if (MenuData.menu_current_mi == "30054") {
        obj = {
          type: 160,
          league: 20
        }
      } else {
        obj = {
          type: 117.5,
          league: 20
        }
      }
    }
  }
  // 早盘
  else if (MenuData.is_zaopan()) {
    obj = {
      type: 90,
      league: 90
    }
    if (MenuData.is_show_hot) {
      obj = {
        type: 36,
        league: 74
      }
    }
  }
  // 串关
  else if (MenuData.is_mix()) {
    obj = {
      type: 86,
      league: 124
    }
    if (MenuData.is_show_hot) {
      obj = {
        type: 36,
        league: 74
      }
    }
  }
  // 热门赛事
  else if (type_name == 'hot') {
    obj = {
      type: 84,
      league: 122
    }
  }
  // 收藏页面
  if (MenuData.is_collect) {
    obj = {
      type: 36,
      league: 74
    }
    // 电竞收藏
    if (MenuData.is_esports()) {
      obj = {
        type: 196,
        league: 196
      }
    }
    // 冠军收藏
    else if (MenuData.is_kemp() && type_name != 'winner_top') {
      obj = {
        type: 40,
        league: 40
      }
    }
  }
  const fixed_header_height = obj.type + 'px'
  MatchListCardDataClass.set_sticky_top({
    fixed_header_height,...obj
  })
}
watch(()=>[router.path,MenuData.menu_data_version.value],lodash.throttle(set_sticky_top,10),{immediate:true})
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