<!--
 * @Description: 主菜单
-->
<template>
  <div class="c-main-menu column" :class="{ 'bet-menu-upd': LayOutMain_pc.layout_left_show == 'bet_history' }">

    <div style="display:none;"> {{ MenuData.menu_data_version }} --- {{ BetData.bet_data_class_version }} -- {{
      LayOutMain_pc.layout_version }} </div>

    <div class="menu-wrap scroll-fixed-bg relative-position border-bottom">
      <div class="left-header-all">
        <!-- 昵称、余额 -->
        <main-header />
        <!-- 投注记录 入口 -->
        <div v-show="LayOutMain_pc.layout_left_show != 'bet_history'" @click="change_left_menu('bet_history')"
          class="menu-item menu-top menu-border item bet_history"
          :class="[bet_count > 0 ? 'justify-end' : 'justify-start']">

          <span class="record-icon" :style="compute_img_url('pc-img-bet-record')" alt=""></span>

          <div class="col">
            {{ i18n_t("common.betting_record") }}
          </div>
          <span class="bet-count" v-show="bet_record_count > 0">{{ bet_record_count }}</span>
        </div>
        <!-- 单/串关投注栏 入口 -->
        <template v-if="bet_count && LayOutMain_pc.layout_left_show == 'menu'">
          <div @click="change_left_menu('bet_list')" class="menu-item menu-top menu-border item bet_history bet-record-count">

            <span class="col">
              {{ i18n_t("bet.bet_my_count") }}
            </span>
            <span class="bet-count">{{ bet_count }}</span>
          </div>
        </template>
      </div>


      <div class="left-scroll-area">
        <!-- 菜单项 -->
        <v-scroll-area ref="ref_bet_scroll_area" position="menu" :observer_area="3"
          v-show="LayOutMain_pc.layout_left_show == 'menu'" :observer_middle="LayOutMain_pc.layout_left_show == 'menu'">
          <!-- 滚动：头部 --------------------------------->
          <template v-slot:header>
            <div class="left-bg-box" :style="'height:'+LayOutMain_pc.layout_left_top"></div>
          </template>
          <div>
            <!-- 滚动：内容 --------------------------------->
            <left-main-menu />
          </div>
        </v-scroll-area>

        <!-- 投注栏 -->
        <div class="bet-box-pc-1" v-if="LayOutMain_pc.layout_left_show == 'bet_list'">
          <bet-box-wapper use_component_key="bet_box_pc_1"  />
        </div>

        <!-- 投注记录 -->
        <bet-record-view-wapper use_component_key="PcRecordTemplate1" v-if="LayOutMain_pc.layout_left_show == 'bet_history'" />

      </div>
    </div>
    <!--提示区域-->
    <q-tooltip content-class="bet-bg-tooltip" anchor="bottom left" self="top left" :offset="[181, 10]"
      target="#merge-info" v-if="BetData.show_merge_info">
      <div style="
          width: 170px;
          min-height: 60px;
          padding-top: 5px;
          padding-bottom: 10px;
          padding-left: 5px;
          word-break: break-all;
        ">
        {{ i18n_t('bet.merge_info') }}
      </div>
    </q-tooltip>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import lodash_ from "lodash";

import MainHeader from "./main-header.vue";
import LeftMainMenu from "./menu/index.vue";
import { BetBoxWapper } from "src/base-pc/components/bet";
import { BetRecordViewWapper } from "src/base-pc/components/bet-record-view";
// // 通屏垂直滚动
import vScrollArea from "src/base-pc/components/v-scroll-area/v-scroll-area.vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import { MenuData } from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/index.js";
import { api_betting } from "src/api/index.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";

import { compute_img_url } from 'src/core/server-img/index.js'


onMounted(() => {
  // 投注成功后获取投注记录数据 24小时内的
  get_unsettle_tickets_count_config()
  useMittOn(MITT_TYPES.EMIT_TICKRTS_COUNT_CONFIG, get_unsettle_tickets_count_config).on
})

onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_TICKRTS_COUNT_CONFIG, get_unsettle_tickets_count_config).off
})

let bet_record_count = ref(0)

// 投注数量
let bet_count = ref(0)

watch( LayOutMain_pc.layout_version, (val) => {
  let number = 0
  // 是否虚拟体育投注
  if (BetData.is_virtual_bet) {
    number = BetData.virtual_bet_list.length;
  }
  // 是否单关投注
  if (BetData.is_bet_single) {
    number = BetData.bet_single_list.length;
  }else{
    number = BetData.bet_s_list.length;
  }
  bet_count.value = number
  // 只有作用于菜单
  if(number && LayOutMain_pc.layout_left_show == 'menu'){
    LayOutMain_pc.set_layout_left_top('120px')
  }else{
    LayOutMain_pc.set_layout_left_top('80px')
  }
});


/**
 * @description 左侧菜单与投注栏切换时调用
 * @param  {string} page  类似类型
 * @return {undefined} undefined
 */
const change_left_menu = page => {
  // 设置左侧显示
  LayOutMain_pc.set_layout_left_show(page)
};

//诸葛埋点事件
const record_zhuge_point = (menu_type) => {
  let eventLabel = "PC_现场滚球盘";
  if (menu_type == "hot") {
    eventLabel = "PC_热门赛事";
  }
  // 发送埋点事件
  // $send_zhuge_event(eventLabel);
};
/**
 * @Description 设置用户偏好
 * @param {undefined} undefined
 */
const set_user_preference = (cur, old) => {
  let userMarketPrefer;
  if (cur == 18) {
    userMarketPrefer = "EU";
  } else if (old == 18) {
    userMarketPrefer = UserCtr.odds.pre_odds;
  }
  if (!userMarketPrefer || userMarketPrefer == UserCtr.odds.cur_odds) {
    return;
  }
  // 设置用户偏好
  api_betting.record_user_preference({ userMarketPrefer }).then((res) => {
    let code = lodash_.get(res, "data.code");
    if (code == 200) {
      if (cur == 18) {
        // 设置盘口类型
        // set_pre_odd(get_pre_odd);
        // set_cur_odd('EU');
      } else if (old == 18) {
        // set_pre_odd(get_pre_odd);
      }
    }
  });
};
/**
 * @description 设置滚动数据
 * @param  {string} type  类型
 * @param  {oject} _this  上下文对象
 * @return {undefined} undefined
 */
const set_scroll_this = ({ type, _this }) => {
  // this[type] = _this
};
const get_unsettle_tickets_count_config = () => {
  let param = {};
  api_betting.get_unsettle_tickets_count(param).then(response => {
    let status = lodash_.get(response, "code");
    if (status == 200) {
      // 获取24小时内的投注量 
      let count = lodash_.get(response, "data", 0);
      bet_record_count.value = count;
    }
  }).catch((error) => {
    console.error(error);
  });
};
</script>

<style lang="scss" scoped>
.left-scroll-area {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
}

.left-bg-box {
  width: 100%;
}

.bet-box-pc-1 {
  width: 100%;
  height: 100%;

  >div {
    width: 100%;
    height: 100%;
  }
}
 /*  投注栏入口 */
 .item.bet_history.bet-record-count {
  color: var(--q-gb-t-c-18);
  background: var(--q-gb-bg-lg-1);
  margin-left: 0;
  width: 100%;
  height: 40px;
  border-radius: 0;
  &::before{
    content: '';
    background-image: url($SCSSPROJECTPATH +'/image/svg/add.svg');
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }
  .text{
    flex: 1;
    margin-left: 10px;
  }
}

.left-header-all {
  width: 220px;
  position: relative;
  z-index: 10;

  .bet_history {
    background: var(--q-gb-bg-c-11);
    border-bottom: 1px solid var(--q-gb-bd-c-8) !important;
    border-right: 1px solid var(--q-gb-bd-c-6) !important;
  }
}

.c-main-menu {
  font-size: 13px;
  /* *** 头部 ************ -S */
  z-index: 211;
  width: 100%;



  /* *** 头部 ************ -E */
  .scroll-inner-wrap {
    margin-bottom: 10px;
  }

  /* *** 体育 ************ -S */
  .c-menu-sports {
    font-size: 13px;

    .menu-item {

      &.menu-tab {
        font-size: 13px;
        justify-content: space-around;
        padding: 10px 4px;

        .item {
          height: 30px;
          border-radius: 8px;
          margin-right: 10px;
          flex: 1;
          white-space: nowrap;
          max-width: 95px;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            font-weight: 600;
            font-size: 14px;
          }

          &.active1 {
            margin-left: 152px;
          }
        }
      }
    }
  }

  /* *** 体育 ************ -E */
  /* *** 公共 ************ -S */
  .menu-wrap {
    cursor: pointer;

    &.scroll-fixed-bg {
      width: 100%;
      height: 100%;
    }

    .no-click {
      cursor: auto;

      &:hover {
        background: none !important;
      }
    }

    .menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.active {
        font-weight: 700;
        border-bottom: 0;
      }

      .hot-icon {
        width: 14px;
        height: 14px;
        margin-right: 10px;
      }

      .menu-new-icon {
        margin: 0 0 3px 4px;
      }

      .match-count {
        padding-right: 15px;
        display: inline-block;
        width: 40px;
        text-align: right;
        max-width: 45px;
      }

      &.disable-hover {
        &:hover {
          background-color: transparent !important;
        }
      }

      &.menu-top {
        padding: 0 15px 0 16px;
        height: 40px;
        border-right: 2px solid transparent;

        .match-count {
          padding-right: 0;
        }

        &.menu-virtual {
          .menu-name {
            margin-left: 10px;
          }
        }

        &.hot-menu {
          &:hover {
            background: none;
          }
        }

        &.item-bet {
          width: 200px;
          height: 36px;
          border-radius: 10px;
          border-right: 0;
          margin-left: 10px;
        }

        &.no-click {
          font-size: 12px;
        }
      }

      &.menu-fold1,
      &.menu-fold2 {
        padding-left: 16px;
        height: 36px;

        &.active {
          border-bottom: 0;

          & .items-right.menu-border {
            border-bottom: 1px solid transparent;
          }

          & .menu-border {
            border-bottom: 1px solid transparent;
          }
        }

        .league-logo {
          width: 18px;
          height: 18px;
        }

        .items-right {
          margin-left: 10px;
          flex: 1;
          align-items: center;
          justify-content: space-between;
          height: 100%;

          .live-text {
            position: relative;
            top: 2px;
            display: inline-block;
            width: 26px;
            height: 12px;
          }
        }
      }
    }

    /*  玩法 菜单项 */
    .menu-fold2-wrap {
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.2s;

      &.open {
        max-height: 500px;
      }

      .menu-fold2 {
        padding: 0 0 0 43px;
        border-right: 2px solid transparent;

        .menu-border {
          position: absolute;
          width: 128px;
          height: 1px;
          right: 0;
          bottom: 0;
        }

        .menu-point {
          position: absolute;
          left: -18px;
          width: 4px;
          height: 4px;
          border-radius: 100%;
        }

        .menu-text {
          max-width: 130px;
        }

        .match-count {
          padding-right: 13px;
        }

        &.menu-virtual {
          padding-left: 34px;
        }
      }
    }
  }

  .hot-menu-wrap {
    margin-top: 15px;

    .level2 {
      .menu-text {
        max-width: 170px;
      }
    }
  }

  .menu-normal-fixed-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    cursor: pointer;

    .left {
      padding-left: 15px;

      .icon-menu_show_normal {
        margin-right: 5px;
      }
    }

    .right {
      padding-right: 15px;
      height: 100%;

      .icon-close {
        transform: scale(0.7);
      }
    }

    &.normal-close {
      height: 32px;
      justify-content: center;

      .icon-close {
        transform: scale(0.7);
      }
    }
  }

  .bet-mode-zone {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 40px;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      padding-left: 15px;

      .bet-single-count {
        border-radius: 10px;
        color: var(--q-gb-t-c-1);
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-left: 5px;
        text-align: center;
        transform: scale(0.8);
      }
    }

    .right {
      display: flex;
      flex-wrap: nowrap;
      margin-right: 10px;

      .check-box {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        padding-left: 5px;
        padding-right: 5px;

        .check-wrap {
          padding: 0;
          margin-right: 5px;
        }
      }
    }
  }

  .tip-content {
    width: calc(100% - 20px);
    height: 100px;
    position: absolute;
    bottom: 0;
    z-index: 500;
    top: 40px;
    left: 10px;

    &.top-content {
      top: 5px;
    }

    .content-wrap {
      position: absolute;
      top: 6px;
      width: 100%;
      background: var(--q-gb-bg-c-4);
      border: 2px solid var(--q-gb-bd-c-8);
      border-radius: 5px;

      .content {
        padding: 10px;
        font-size: 12px;

        .row-1,
        .row-2,
        .row-3 {
          color: #2d2d2d;
          text-align: center;
        }

        .row-1 {
          margin-bottom: 10px;
          font-size: 14px;
          color: var(--q-gb-bd-c-8);
          font-weight: bold;
        }
      }

      .triangle,
      .triangle1 {
        position: absolute;
        background: var(--q-gb-bg-c-4);
        border: 2px solid var(--q-gb-bd-c-8);
        border-top: 0;
        border-left: 0;
        width: 15px;
        height: 15px;
        transform: rotate(45deg);
        top: 81px;
        right: 22px;
      }

      .triangle1 {
        top: 116px;
      }

      .icon-del {
        position: absolute;
        top: 16px;
        right: 10px;
        cursor: pointer;
      }
    }
  }

  /* *** 公共 ************ -E */
}

.bet-view {
  width: 220px;
}

.bet-bg-tooltip {
  background: #a3afbf;
  color: var(--q-gb-t-c-1);
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}

.record-icon {
  background-size: 100% 100%;
  width: 14px;
  height: 14px;
  margin-right: 10px;
}

.border-bottom {
  border-bottom: 1px solid var(--q-gb-bd-c-8);
}</style>