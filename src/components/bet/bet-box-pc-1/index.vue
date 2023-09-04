<template>
  <!--当前投注-->
  <div>
    <bet-scroll-header />

    <div style="display:none;"> {{ BetData.bet_data_class_version }} </div>

    <div class="bet-mode-zone" v-if="BetData.is_bet_single">
      <div class="left">
        <span>{{ $t("bet.bet_one_") }}</span>
        <span class="bet-single-count" style="color:blue">
          {{ BetData.bet_single_list.length }}
        </span>
      </div>
      <div class="right">
        <span class="check-box" :class="{ 'checked': BetData.is_bet_merge }" @click.stop="toggle_merge"> 
        </span>
        <span @mouseover="show_merge_info = true" @mouseout="show_merge_info = false">
          <icon id="merge-info" name="icon-tips" class="bet-info" size="14px" />
        </span>
      </div>
    </div>
    <!-- 正常入口的单关 -->
    <bet-single v-show="BetData.is_bet_single" @set_scroll_this="set_scroll_this" />
    <!-- 正常入口的串关 -->
    <!-- <bet-mix v-show="!BetData.is_bet_single" class="full-height" @set_scroll_this="set_scroll_this" /> -->
  </div>
</template>

<script setup>
import { ref,onMounted } from "vue"

import BetData from "src/core/bet/class/bet-data-class.js";
import lodash from 'lodash'

// import BetDataCtrClass from "src/core/bet/bet-data-ctr-class.js";
// import BetUpdData from "src/core/bet/module/upd_data.js";

import BetScrollHeader from './bet-single/bet-scroll-header.vue'

// import CheckBox from './common/filter-checkbox.vue'
import BetSingle from "./bet-single/bet-single.vue"
import BetMix from "./bet-single/bet-mix.vue"

// 是否显示合并信息A
const show_merge_info = ref(false)

const set_scroll_this = val => {
  console.error('val',val)
}

// 合并投注 单关
const toggle_merge = () => {
  return
  BetDataCtrClass.set_is_bet_merge(!BetData.is_bet_merge);
  // if(BetData.is_bet_merge) {
  //   this.$utils.send_zhuge_event('PC_合并');
  // }
  let len = BetData.bet_single_list.length;
  // 取消合并
  if (!BetData.is_bet_merge && len > 1) {
    let id = BetData.bet_single_list[len - 1];
    let bet_single_obj = lodashcloneDeep(lodashget(BetData.bet_single_obj, `${id}`));
    BetDataCtrClass.bet_single_clear();
    BetDataCtrClass.set_bet_single_list([id]);
    bet_single_obj.key = id;
    // mode为清除原有的添加最新的
    bet_single_obj.mode = "clear_and_add";
    BetUpdData.set_bet_obj_value(bet_single_obj);
  }
}


</script>