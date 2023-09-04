<!--
 * @Description: 左侧菜单 投注相关 头部 正常
-->
<template>
  <div class="bet-scorll-header">
    <div class="row bet-back-btn yb-flex-between" :class="{ 'free-style': !LayOutMain_pc.is_iframe }"
      @click="set_menu_back('menu')">
      <!-- 返回菜单（投注记录、单/串关投注栏） -->
      <div class="col yb-flex cursor-pointer" v-if="LayOutMain_pc.is_iframe">
        <!--箭头图标-->
        <icon name="icon-back" size="14px" />
        <!--返回菜单-->
        <div class="back-text ellipsis" v-if="BetData.is_bet_single">返回 {{ $t('common.return_sports') }}</div>
        <div class="back-text2 ellipsis"
          v-tooltip="{ content: '&nbsp;' + i18n_t('common.return_spo r ts') + '&nbsp;' , overflow:1}" v-else>
          {{ $t('common.return_sports') }}</div>
      </div>
      <div v-else>
        <!--bet-zone-head-width虚拟体育投注框宽度-->
        <div class="bet-zone-head justify-between align-items center cursor-pointer"
          :class="{ 'bet-zone-head-width': BetData.is_virtual_bet }">
          <!--箭头图标-->
          <icon name="icon-back" size="14px" />
          <!--返回菜单-->
          <div class="back-text ellipsis" v-if="BetData.is_bet_single">{{ $t('common.return_sports') }}</div>
        </div>
      </div>
    </div>

    <!--右边的单关或者复式串关按钮-->
    <template v-if=" !BetData.is_virtual_bet && (MenuData.layout_left_show != 'bet_history')">
      <div class="col-auto bet-series yb-flex-between" >
        <template v-if="BetData.is_bet_single">
          <!--复式串关已改为串关-->
          <span class="series_style" :class="{ 'vi_th_series_style': ['vi', 'th', 'ad'].includes(UserCtr.lang) }">{{
            $t('bet.bet_series') }}</span>
          <span>+</span>
        </template>
        <!--单关-->
        <template v-else>
          <span>{{ $t('bet.bet_one_') }}</span>
          <span class="bet-single-btn">
            <!--单关数量-->
            <span class="bet-single-count">{{ bet_count }}</span>
            <span class="add">+</span>
          </span>
        </template>
      </div>
    </template>

    <div class="row bg-white"></div>
    <!-- 供投注项定位时 获取头部定位 -->
    <div class="bet-header-position"></div>

  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"
import LayOutMain_pc from "src/core/layout/index.js";
import UserCtr from "src/core/user-config/user-ctr.js"
import MenuData from "src/core/menu-pc/menu-data-class.js"
import BetData from "src/core/bet/class/bet-data-class.js";

import lodash from 'lodash'

/**
 * @description:投注数量  默认是单关数量
 * @param {undefined} undefined
 * @return {undefined} undefined
*/
const bet_count = () => {
  if (BetData.is_virtual_bet) {
    return BetData.virtual_bet_list.length;
  }
  if (BetData.is_bet_single) {
    return BetData.bet_single_list.length;
  } else {
    return BetData.bet_s_list.length;
  }
}

// 返回菜单列表
const set_menu_back = val => {
  MenuData.set_layout_left_show(val)
}

</script>

<style lang="scss" scoped>
.add {
  font-size: 16px;
}

.mr15 {
  margin-right: 15px;
}

.free-style {
  padding-left: 0px !important;
  height: 44px !important;
}

/* 返回体育项目 */
.bet-back-btn {
  padding-left: 15px;
  height: 34px;
  cursor: pointer;

  /**返回菜单文字样式*/
  .back-text {
    width: 100px;
    padding-left: 10px;
  }

  /**返回菜单文字样式2*/
  .back-text2 {
    width: 65px;
    padding-left: 10px;
  }

  .bet-zone-head {
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
  }

  /**虚拟体育投注框宽度*/
  .bet-zone-head-width {
    width: 300px;
  }

  /** 右边的单关或者复式串关按钮*/
  .bet-series {
    display: flex;
    padding: 8px;
    margin-right: 5px;
    min-width: 86px;
    height: 28px;
    font-size: 12px;

    /**单关按钮*/
    .bet-single-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;

      /**单关数量*/
      .bet-single-count {
        font-size: 14px;
        text-align: center;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 50%;
        transform: scale(0.7);
      }
    }

    /** 串关按钮不可用*/
    &.bet-series-disabled {
      background: #f0f5fc;
      color: rgba(45, 45, 45, 0.3);
      border: 1px solid #e4ebf1;
      border-radius: 4px;
    }
  }
}

/* 投注记录相关 */
.bet-type {

  /** 行样式*/
  .row {
    height: 34px;
    line-height: 34px;
  }

  /* 未结算,已结算中间分割线设置 */
  .tabs-line {
    margin-left: auto;
    margin-right: auto;
    margin-top: -4px;
    height: 2px;
    width: 39px;
    border-radius: 2px;
    transition: all 0.3s;
  }
}

.yb-flex {
  display: flex;
}

/** 切换按钮样式 */
.series_style {
  padding-left: 10px;
}

.vi_th_series_style {
  padding-left: 5px
}
</style>
