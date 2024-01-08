<!--
 * @Author: cooper
 * @Date: 2023-08-05 15:13:55
 * @Description:详情页头部
-->

<template>
  <div class="detail-header-box">
    <!-- 顶部栏 -->
    <div class="wrap-title" ref="wrap_title">
      <!-- 返回按钮 -->
      <div class="group-back cursor-pointer" @click.stop="back_to">
        <icon-wapper name="icon-back" class="back" color="#ABBAC8" />
      </div>
      <!-- 联赛标题 -->
      <div class="title ellipsis allow-user-select">
        {{ match_infoData?.tn }}
      </div>
      <div class="right-icon">
        <!-- 显示比分栏 -->
        <span v-if="!toggle_panel" @click="toggle_panel = true">{{
          i18n_t("common.show_score_panel")
        }}</span>
        <!-- 刷新按钮 -->
        <div class="refresh">
          <refresh
            :other_icon="true"
            icon_name="icon-balance_refresh"
            :loaded="data_loaded"
            @click="refreshFun()"
          />
        </div>
        <!-- 打开赛事分析窗口 -->
        <div
          class="sr-link-icon-w"
          v-if="is_show_sr_flg(match_infoData)"
          @click.stop="sr_click_handle(match_infoData, 'details')"
          v-tooltip="{ content: i18n_t('common.analysis') }"
        >
          <icon-wapper name="icon-signal" color="#ABBAC8" />
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
          v-if="!is_eports_csid(sportId)"
          class="hide-btn"
          @click="toggle_panel = false"
        >
          {{ i18n_t("common.hide_score_panel") }}
        </div>
      </div>
    </template>
    <!-- 赛事基本信息 end -->
    <!-- 玩法tab条 -->
    <handicap-tabs-bar
      ref="handicap_tabs_bar"
      :handicap_this="handicap_this"
      :match_info="match_infoData"
      @get_mattch_details="get_mattch_details_func"
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
import { i18n_t,is_eports_csid } from "src/output/index.js";
import ZHUGE from "src/core/http/zhuge-tag";
import details from "src/core/match-detail/match-detail-pc/match-detail.js";
import info from "src/base-pc/components/match-detail/match_info/info.vue";
// // 玩法tab条
import handicapTabsBar from "src/base-pc/components/match-detail/match_info/handicap_tabs_bar.vue";
import { useRoute, useRouter } from "vue-router";
// import { useMittEmit, MITT_TYPES } from "src/core/mitt/";
import { IconWapper } from "src/components/icon";
import refresh from "src/components/refresh/refresh.vue";
const props = defineProps({
  match_infoData: Object, //赛事状态比分信息
  background_img: String,
  handicap_this: Object, // 传给玩法集 tabs 的数据
  handicap_state: String, //玩法加载状态状态
  is_request: Boolean, //详情接口 是否请求中
  sportId: Number || String, //球类id
});
import { is_show_sr_flg } from "src/core/utils/project/module/other.js";
const toggle_panel = ref(true); //比分扳显示|隐藏
const data_loaded = ref(false); //刷新按钮动画开关

const handicap_tabs_bar = ref(null);
defineExpose({ handicap_tabs_bar });

const route = useRoute();
const router = useRouter();

const emit = defineEmits([
  "init",
  "back_to",
  "change_loading_state",
  "get_mattch_details",
]);

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
const get_mattch_details_func = (arg) => {
  emit("get_mattch_details", arg);
};
/**
 * 详情页手动切换玩法时展示 loading 状态
 * @param n 要展示的 loading 状态
 */

const change_loading_state = (n) => {
  emit("change_loading_state", n);
};

// sr 分析数据点击跳转
const sr_click_handle = (match, type) => {
  if (type == "details") {
    // 发送埋点事件
    ZHUGE.send_zhuge_event("PC_情报分析");
  } else if (type == 1) {
    ZHUGE.send_zhuge_event("PC_热门推荐_赛事分析点击");
  }
  details.sr_click_handle(match);
};
/**
 * @description 返回顶部
 * @return {Undefined} Undefined
 */
const on_go_top = () => {
  // useMittEmit(MITT_TYPES.EMIT_SET_SCROLL_POSITION, [0, 0]);
};

/**
 * @description 刷新页面
 */
const refreshFun = () => {
  // 接口请求中
  if (props.is_request) {
    return;
  }

  // 重新请求相应接口
  emit("init");
  data_loaded.value = true
  // this.init({ is_refresh: true });

  // // 刷新前 先关闭聊天室
  // this.set_chatroom_available(0);
  // // 聊天室开关开启后才显示聊天室
  // if (this.vx_get_user.chatRoomSwitch) {
  //   // 获取直播、聊天室信息
  //   this.get_live_chat_info();
  // }
};

onUnmounted(() => {});
</script>
<style lang="scss" scoped>
.detail-header-box {
}
.wrap-title {
  display: flex;
  align-items: center;
  padding: 0 10px 0 15px;
  height: 36px;
  font-size: 14px;
  border-radius: 6px 6px 0 0;
  .group-back {
    display: flex;
    align-items: center;
    .back {
      margin-right: 11px;
    }
    .before_active {
      margin-left: 3px;
      color: #d2ac46;
    }
  }
  .title {
    flex: 1;
    text-align: center;
  }
  .sr-link-icon-w {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 13px;
    cursor: pointer;

    i.icon-signal {
      display: block;
      width: 14px;
      height: 13px;
      &:before {
        color: #abbac8;
      }
      &.focus-icon {
        display: none;
      }
    }
  }
  .right-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    :deep(.icon-wrap) {
      // height: 15px;
      .icon-refresh {
        position: relative;
        top: -2px;
      }
    }
    & > span {
      margin-right: 15px;
      color: var(--qq--color-card-wrap-title);
      font-size: 12px;
      cursor: pointer;
    }
  }
  .refresh {
    width: 24px;
    height: 24px;
    border-radius: 13px;
    margin-right: 5px;
    .refresh_icon {
      .icon-balance_refresh {
        span {
          font-size: 18px;
          &::before {
            color: #999;
          }
        }
      }
    }
  }
  .i-refresh {
    width: 17px;
  }
  .title-label {
    color: #d1d1d1;
  }
  .mr-10 {
    margin-right: 10px;
  }
  .score {
    color: #b1987f;
  }
  .live-source {
    display: flex;
    .icon {
      padding-right: 8px;
    }
    .wrap_source {
      display: flex;
      align-items: center;
      cursor: pointer;
      &:first-child {
        margin-right: 15px;
      }
      .active {
        color: #b1987f;
      }
    }
  }
}
/* ************** 顶部标题 *************** -S */

/* ************** 顶部标题 *************** -E */
/* ************** 比分扳 *************** -S */
.head-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 190px;
  background-size: cover !important;
  color: var(--q-gb-t-c-1);
  .info-upd {
    z-index: 90;
    justify-content: center;
    :deep(.match_time) {
      .timer-layout2 {
        width: 100%;
        min-width: 42px;
      }
    }
  }
  .hide-btn {
    position: absolute;
    top: 13px;
    right: 13px;
    padding: 5px 6px;
    border-radius: 13px;
    color:var(--q-gb-bd-c-13) !important;
    background: rgba(31, 33, 41, 0.6);
    cursor: pointer;
    &:hover {
      background: rgba(31, 33, 41, 0.8);
      color: var(--q-gb-t-c-1);
    }
  }
}
</style>
src/output/indexsrc/core/constant/common/module/csid-util
