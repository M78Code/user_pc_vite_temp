<template>
  <!--当前投注-->
  <div>
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
        <span class="check-box" :class="{ 'checked': BetData.is_bet_merge }" @click.stop="toggle_merge"> 
          <span v-if="!BetData.is_bet_merge">不</span> <span>{{$t('bet.merge')}}</span>
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
import { ref,onMounted } from "vue"

import BetData from "src/core/bet/class/bet-data-class.js";
import lodash from 'lodash'

import BetScrollHeader from './bet-single/bet-scroll-header.vue'
import BetScrollFooter from './bet-single/bet-scroll-footer.vue'
import CheckBox from './common/filter-checkbox.vue'
import BetSingle from "./bet-single/bet-single.vue"
import BetMix from "./bet-single/bet-mix.vue"

// 是否显示合并信息A
const show_merge_info = ref(false)

const set_scroll_this = val => {
  console.error('val',val)
}

// 合并投注 单关
const toggle_merge = () => {
  BetData.set_is_bet_merge();
}


</script>