<!--
 * @Author: cooper
 * @Date: 2023-08-05 15:13:55
 * @Description:详情页头部
-->

<template>
  <div class="">
    <!-- 顶部栏 -->
    <div class="wrap-title" ref="wrap_title">
      <!-- 返回按钮 -->
      <div class="group-back cursor-pointer" @click.stop="back_to">
        <icon name="icon-back" class="back" color="#ABBAC8" />
      </div>
      <!-- 联赛标题 -->
      <div class="title ellipsis allow-user-select">
        {{ match_infoData.tn }}
      </div>
      <div class="right-icon">
        <!-- 显示比分栏 -->
        <span v-if="!toggle_panel" @click="toggle_panel = true">{{
          $t("common.show_score_panel")
        }}</span>
        <!-- 打开赛事分析窗口 -->
        <div
          class="sr-link-icon-w"
          v-if="is_show_sr_flg(match_infoData)"
          @click.stop="sr_click_handle(match_infoData, 'details')"
          v-tooltip="{ content: $t('common.analysis') }"
        >
          <icon name="icon-signal" color="#ABBAC8" />
        </div>
        <!-- 刷新按钮 -->
        <div class="refresh">
          <refresh
            :other_icon="true"
            icon_name="icon-balance_refresh"
            :loaded="data_loaded"
            @click="refresh()"
          />
        </div>
      </div>
    </div>

    <!-- 赛事基本信息 start -->
    <template v-if="toggle_panel">
      <div
        :style="{ background: `url('${background_img}') center center` }"
        class="head-info relative-position"
        :class="`esports-head-info-${sportId}`"
      >
        <!-- 赛事对阵状态展示面板 -->
        <info
          class="info-upd full-width row justify-center fod_show"
          :match_info="match_infoData"
        />
        <!-- 隐藏 -->
        <div
          v-if="is_eports_csid(sportId)"
          class="hide-btn"
          @click="toggle_panel = false"
        >
          {{ $t("common.hide_score_panel") }}
        </div>
      </div>
    </template>
    <!-- 赛事基本信息 end -->
    <!-- 玩法tab条 -->
    <handicap-tabs-bar
      ref="handicap_tabs_bar"
      :handicap_this="handicap_this"
      :match_info="match_infoData"
      @get_mattch_details="get_mattch_details"
      @on_go_top="on_go_top"
      @change-loading-state="change_loading_state"
      :class="{
        all_empty: ['all_empty', 'new_empty'].includes(handicap_state),
      }"
      whitchDetail="details"
    />
  </div>
</template>

<script setup>
import { ref, defineExpose, onUnmounted } from "vue";
import { is_show_sr_flg, is_eports_csid } from "src/core/utils/utils";
import ZhuGe from "src/core/http/zhuge-tag";
import details from "src/core/match-detail/match-detail";
// 玩法tab条
import handicapTabsBar from "src/components/match-detail/match_info/handicap_tabs_bar";
import { useRoute, useRouter } from "vue-router";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/";

import store from "project_path/src/store/index.js";

const props = defineProps({
  match_infoData: Object,
  background_img: String,
  handicap_this: Object,
  handicap_state: String,
});

const toggle_panel = ref(true); //比分扳显示|隐藏
const data_loaded = ref(false); //刷新按钮动画开关

const handicap_tabs_bar = ref(null);
defineExpose({ handicap_tabs_bar });

const route = useRoute();
const router = useRouter();

const emit = defineEmits(["init", "back_to", "get_mattch_details",'change_loading_state']);

// 监听状态变化
let un_subscribe = store.subscribe(() => {
  state = store.getState();
  const {} = state.detailsReducer;
});
/**
 * @description 返回上一页
 */
const back_to = (is_back = true) => {
  // 重新请求相应接口
  emit("back_to", true);
};
/**
 * @description 子组件玩法切换
 * @param {string} id 玩法集id
 * @param round 电竞赛事需要的动态玩法集局数 id
 * 获取具体的玩法集数据
 */
const get_mattch_details = (arg) => {
  emit("get_mattch_details", arg);
};
   /**
     * 详情页手动切换玩法时展示 loading 状态
     * @param n 要展示的 loading 状态
     */

const change_loading_state = (n)=>{
  emit("change_loading_state", n);
}

// sr 分析数据点击跳转
const sr_click_handle = (match, type) => {
  if (type == "details") {
    // 发送埋点事件
    ZhuGe.send_zhuge_event("PC_情报分析");
  } else if (type == 1) {
    ZhuGe.send_zhuge_event("PC_热门推荐_赛事分析点击");
  }
  details.sr_click_handle(match);
};
/**
 * @description 返回顶部
 * @return {Undefined} Undefined
 */
const on_go_top = () => {
  useMittEmit(MITT_TYPES.EMIT_SET_SCROLL_POSITION, [0, 0]);
};

/**
 * @description 刷新页面
 */
const refresh = () => {
  // 接口请求中
  if (is_request.value) {
    return;
  }

  // 重新请求相应接口
  emit("init", { is_refresh: true });

  // 重新请求相应接口
  // this.init({ is_refresh: true });

  // 刷新前 先关闭聊天室
  this.set_chatroom_available(0);
  // 聊天室开关开启后才显示聊天室
  if (this.vx_get_user.chatRoomSwitch) {
    // 获取直播、聊天室信息
    this.get_live_chat_info();
  }
};

onUnmounted(() => {
  un_subscribe();
});
</script>
