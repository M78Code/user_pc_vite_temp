<template>
 <div>
  
  <div v-show="false">{{BetViewDataClass.bet_view_version}}{{BetData.bet_data_class_version}}</div>

  <div v-for="item in BetViewDataClass.bet_special_series" :key="item.id" class="list">
    {{item.name}} X{{item.count}} --{{item.money}}
    <span v-if="item.money" class="yb_fontsize20 money-number" @click.stop="input_click(item,$event)">{{  item.money }}</span>
    <span class="money-span" ref="money_span"
      :class="{ 'money-span2': !(BetData.active_index == index_ ) }" @click.stop="input_click(item,$event)">
      <span v-if="!item.money" >{{ i18n_t('app_h5.bet.limit')}}{{ set_min_max_money(item.id,'min_money') }}-{{ set_min_max_money(item.id,'max_money')  }}</span>
    </span>
  </div>

  <key-board v-if="BetData.bet_keyboard_show" :config="ref_data.key_board_config" ></key-board>

 </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, reactive, ref} from 'vue';
import keyBoard from './bet-keyboard.vue';
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import lodash_ from "lodash"
import { useMittOn, MITT_TYPES } from "src/core/index.js";

onMounted(()=>{
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle).on;
})

onUnmounted(()=>{
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY).off;
})

const ref_data = reactive({
  money: 0,
  key_board_config: {}, //键盘配置信息
})

const input_click = (item,evnet) => {
  event.preventDefault()
  BetData.set_bet_keyboard_config(item)
  BetData.set_bet_keyboard_show(true)
}

// 设置限额
const set_min_max_money = computed(()=> (id,type) => {
  let obj = lodash_.get(BetViewDataClass.bet_min_max_money,`${id}`,{})
  return obj[type] || ''
})

// 设置投注金额
const change_money_handle = val => {
  let obj = {
    money: val.money,
    ...val.params,
  }
  BetViewDataClass.set_bet_special_series_item(obj)
}

</script>
<style scoped>
  .list{
    display: flex;
    justify-content: space-between;
    background: var(--q-gb-t-c-7);
    margin: 0.1rem 0;
    padding: 0.1rem;
    border-radius: 12px;
  }
</style>