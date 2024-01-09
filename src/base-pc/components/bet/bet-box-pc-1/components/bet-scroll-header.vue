<!--
 * @Description: 左侧菜单 投注相关 头部 正常
-->
<template>
  <div class="bet-scorll-header">

    <div style="display: none;">{{ BetViewDataClass.bet_view_version }}--{{ BetData.bet_data_class_version }} </div>

    <div class="row bet-back-btn yb-flex-between" :class="{ 'free-style': LayOutMain_pc.is_iframe }">
      <!-- 返回菜单（投注记录、单/串关投注栏） -->
      <div class="col yb-flex cursor-pointer" v-if="LayOutMain_pc.is_iframe" @click="set_menu_back('menu')">
        <!--箭头图标-->
        <icon-wapper name="icon-back" size="14px" />
        <!--返回菜单-->
        <div class="back-text ellipsis" v-if="BetData.is_bet_single">返回 {{ i18n_t('common.return_sports') }}</div>
        <div class="back-text2 ellipsis"
          v-tooltip="{ content: '&nbsp;' + i18n_t('common.return_spo r ts')+'&nbsp;' ,   overflow:1}" v-else>
          {{ i18n_t('common.return_sports') }}</div>
      </div>
      <div v-else  @click="set_menu_back('menu')">
        <!--bet-zone-head-width虚拟体育投注框宽度-->
        <div class="bet-zone-head justify-between align-items center cursor-pointer"
          :class="{ 'bet-zone-head-width': BetData.is_virtual_bet }">
          <!--箭头图标-->
          <icon-wapper name="icon-back" size="14px" />
          <!--返回菜单-->
          <div class="back-text ellipsis">{{ i18n_t('common.return_sports') }}</div>
        </div>
      </div>

       <!--右边的单关或者复式串关按钮-->
      <template v-if="!BetData.is_virtual_bet && (LayOutMain_pc.layout_left_show != 'bet_history')">
        <div class="bet-series-box" @click="set_change_bet_single">
          <span class="bet-series-text" :class="!BetData.is_bet_single ? 'actions':'' ">{{i18n_t('bet.bet_series')}}</span>
            <!--复式串关已改为串关-->
          <div class="bet-series-switch" :class="!BetData.is_bet_single ? 'actions':'' ">
            <div class="bet-series-ok" :class="!BetData.is_bet_single ? 'actions':'' "></div>
          </div>
        </div>
      </template>
    </div>


    <div class="row bg-white"></div>
    <!-- 供投注项定位时 获取头部定位 -->
    <div class="bet-header-position"></div>

  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'

import { IconWapper } from 'src/components/icon'

/**
 * @description:投注数量  默认是单关数量
 * @param {undefined} undefined
 * @return {undefined} undefined
*/
const bet_count = computed(() => {
  if (BetData.is_virtual_bet) {
    return BetData.virtual_bet_list.length;
  }
  if (BetData.is_bet_single) {
    return BetData.bet_single_list.length;
  } else {
    return BetData.bet_s_list.length;
  }
})

// 返回菜单列表
const set_menu_back = val => {
  LayOutMain_pc.set_layout_left_show(val)
}

// 切换单关/串关
const set_change_bet_single = () => {
  BetData.set_is_bet_single()
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
  background: var(--q-bet-box-8);
  border-bottom: 1px solid var(--q-gb-bd-c-8);
  border-right: 1px solid var(--q-gb-bd-c-6);

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
    font-size: 12px;
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
      background: var(--q-gb-bg-c-21);
      color: rgba(45, 45, 45, 0.3);
      border: 1px solid var(--q-gb-bd-c-7);
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
.bet-series-box {
  display: flex;
  align-items: center;
  .bet-series-text{
    //color: var(--q-gb-t-c-10) ;
    color: var(--q-gb-t-c-11) ;
    &.actions{
      color: var(--q-gb-t-c-16);
    }
  }
  .bet-series-switch{
    position: relative;
    display: flex;
    min-width: 36px;
    height: 18px;
    border-radius: 18px;
    margin-left: 4px;
    margin-right: 5px;
    transition: .3s;
    background: var(--q-gb-t-c-18);
    border: 0.5px solid rgba(0, 0, 0, 0.2);
    &.actions{
      background: var(--q-gb-t-c-16);
    }
    
    .bet-series-ok{
      width: 14px;
      height: 14px;
      position: absolute;
      background: var(--q-gb-t-c-11);
      border-radius: 50%;
      top: 1px;
      left: 2px;
      transition: .3s;
      &.actions{
        background: var(--q-gb-t-c-18);
        left: 19px;
      }
    }
  }
}
</style>
