<template>
  <!--当前投注-->
  <div>
    <!-- 投注头部 -->
    <bet-scroll-header />

    <div style="display: none;"> {{ BetData.bet_data_class_version }} </div>

    <div class="bet-mode-zone" v-if="BetData.is_bet_single">
      <div class="left">
        <span>{{ $t("bet.bet_one_") }}</span>
        <span class="bet-single-count" style="color:blue">
          {{ BetData.bet_single_list.length }}
        </span>
      </div>
      <div class="right">
        <!-- 单关 合并 -->
        <span class="check-box">
          <span class="check-wrap relative-position" :class="{ 'active': BetData.is_bet_merge }" :style="results_checkbox_style" />
          <span>{{ $t('bet.merge') }}</span>
        </span>

        <span @mouseover="show_merge_info = true" @mouseout="show_merge_info = false">
          <icon id="merge-info" name="icon-tips" class="bet-info" size="14px" />
        </span>
      </div>
    </div>
    <!-- 正常入口的单关 -->
    <bet-single v-show="BetData.is_bet_single" @set_scroll_this="set_scroll_this" />
    <!-- 正常入口的串关 -->
    <bet-mix v-show="!BetData.is_bet_single" class="full-height" @set_scroll_this="set_scroll_this" />

    <bet-scroll-footer />

  </div>
</template>

<script setup>
import { ref } from "vue"

import BetData from "src/core/bet/class/bet-data-class.js";

import BetScrollHeader from './bet-single/bet-scroll-header.vue'
import BetScrollFooter from './bet-single/bet-scroll-footer.vue'
import BetSingle from "./bet-single/bet-single.vue"
import BetMix from "./bet-single/bet-mix.vue"

// 是否显示合并信息A
const show_merge_info = ref(false)

const set_scroll_this = val => {
  console.error('val', val)
}

// 合并投注 单关
const toggle_merge = () => {
  BetData.set_is_bet_merge();
}


</script>

<style scoped lang="scss">
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
      color: #ffffff;
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

/** 选择框样式 -S*/
.check-wrap {
  width: 14px;
  min-width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid var(--q-gb-bd-c-7);
  margin-right: 10px;
  position: relative;
  &.active {
    border: none;
    &::before {
      position: absolute;
      content: "";
      left: 4px;
      width: 6px;
      height: 4px;
      top: 4px;
      border-top: 2px solid transparent;
      border-right: 2px solid transparent;
      transform: rotate(135deg);
    }
  }
}
/** 选择框样式 -E*/
</style>