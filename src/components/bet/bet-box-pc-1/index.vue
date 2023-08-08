<template>
    <!--当前是否为虚拟投注-->
    <template v-if="is_virtual_bet">
      <!-- 虚拟单关 -->
      <virtual-bet-single v-if="virtual_bet_list.length == 1" @set_scroll_this="set_scroll_this" />
      <!-- 虚拟串关 -->
      <virtual-bet-mix v-else-if="virtual_bet_list.length > 1" class="full-height"
        @set_scroll_this="set_scroll_this" />
    </template>
    <template v-else>
      <div class="bet-mode-zone" v-if="is_bet_single">
        <div class="left">
          <span>{{ $root.$t("bet.bet_one_") }}</span>
          <span class="bet-single-count">
            {{ bet_single_list.length }}
          </span>
        </div>
        <div class="right">
          <span class="check-box" :class="{ 'checked': is_bet_merge }" @click.stop="toggle_merge">
            <check-box :checked="is_bet_merge" /> <span>{{ $root.$t('bet.merge') }}</span>
          </span>
          <span @mouseover="show_merge_info = true" @mouseout="show_merge_info = false">
            <icon id="merge-info" name="icon-tips" class="bet-info" size="14px" />
          </span>
        </div>
      </div>
      <!-- 正常入口的单关 -->
      <bet-single v-if="is_bet_single" @set_scroll_this="set_scroll_this" />
      <!-- 正常入口的串关 -->
      <bet-mix v-if="!is_bet_single" class="full-height" @set_scroll_this="set_scroll_this" />
    </template>
</template>
<script setup>

import VirtualBetSingle from "./bet-virtual/bet-virtual-single.vue"
import VirtualBetSingle from "./bet-virtual/bet-virtual-single.vue"
import CheckBox from './filter-checkbox.vue'
import BetSingle from "./bet-single/bet-single.vue"
import BetMix from "./bet-single/bet-mix.vue"

const props = defineProps({
  // 是否为虚拟投注
  is_virtual_bet: {
    type: Boolean,
    default: () => false,
  },
  // 是否单关投注
  is_bet_merge: {
    type: Boolean,
    default: () => false,
  },
  // 是否单关合并
  is_bet_single: {
    type: Boolean,
    default: () => false,
  },
  // 获取虚拟投注列表
  virtual_bet_list: {
    type: Object,
    default: () => [],
  },
  // 单关投注列表
  bet_single_list: {
    type: Object,
    default: () => [],
  },
})


</script>