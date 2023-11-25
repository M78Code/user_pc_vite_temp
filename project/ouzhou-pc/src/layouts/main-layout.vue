
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
        height: LayOutMain_pc.oz_layout_content_height + 'px'
      }">
        <!-- 中间区域 -->
        <router-view></router-view>
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
      v-model:active="BetData.bet_box_draggable.isActive" :draggable="stop_drap" :resizable="false" :parent="true"
      v-if="BetData.bet_box_draggable.show">
      <div class="ty-bet-box">
        <bet-box-wapper use_component_key="BetBoxOuZhouPC_1" />
      </div>
    </Vue3DraggableResizable>
  </div>
</template>
<script setup>
import { ref, computed, onMounted ,onUnmounted,reactive } from "vue";
import lodash_ from "lodash"
import { useRoute } from "vue-router";
import { LayOutMain_pc, UserCtr } from "src/core/index.js";
import { api_betting } from "src/api/"

import layoutHeader from "./layout-header.vue";
import layoutLeft from "./layout-left.vue";
import layoutRight from "./layout-right.vue";
import toastComponents from "src/base-pc/components/toast/toast.vue";
import alertComponents from "src/base-pc/components/toast/alert.vue";
import confirmComponents from "src/base-pc/components/toast/confirm.vue";
import secondaryModule from 'src/base-pc/components/secondary-module/index.vue'
import { BetBoxWapper } from "src/base-pc/components/bet";
import { compute_css_variables } from "src/core/css-var/index.js"
import BetData from 'src/core/bet/class/bet-data-class.js'
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";

const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'layout' })

const route = useRoute();

const ref_data = reactive({
  emit_lsit:{}
})

// 屏蔽视频移动组件(视频回播功能)
const show_move_video = computed(() => {
  return lodash.get(UserCtr.get_user(), "merchantEventSwitchVO.eventSwitch")
})

const stop_drap = ref(true)
const stop_drap_emit = (props) => {
  stop_drap.value = props
}
onMounted(() => {
  let obj = {
    x: window.innerWidth * 0.6,
    y: window.innerHeight * 0.7,
    isActive: false,
    height: 'auto',
    show: true,
  }
  BetData.set_bet_box_draggable(obj)

  get_unsettle_tickets_count_config()
  // 投注成功后获取投注记录数据 24小时内的
  ref_data.emit_lsit = {
      emitter_1: useMittOn(MITT_TYPES.EMIT_TICKRTS_COUNT_CONFIG, get_unsettle_tickets_count_config).off,
      emitter_2: useMittOn(MITT_TYPES.EMIT_STOP_DRAP, stop_drap_emit).off
  }
})

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

  onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
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