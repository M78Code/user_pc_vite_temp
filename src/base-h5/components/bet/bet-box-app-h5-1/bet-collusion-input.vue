<template>
 <div>
  {{BetViewDataClass.bet_view_version}}
  <div v-for="item in BetViewDataClass.bet_special_series" :key="item.id" class="list">
    {{item.name}} X{{item.count}} --{{item.money}}
    <span v-if="item.money" class="yb_fontsize20 money-number" @click.stop="input_click(item,$event)">{{  item.money }}</span>
    <span class="money-span" ref="money_span"
      :class="{ 'money-span2': !(BetData.active_index == index_ ) }" @click.stop="input_click(item,$event)">
      <span v-if="!item.money" >{{ i18n_t('app_h5.bet.limit')}}{{ set_min_max_money(item.id,'min_money') }}-{{ set_min_max_money(item.id,'max_money')  }}</span>
    </span>
  </div>
  <key-board v-if="BetViewDataClass.bet_keyboard_show" :config="ref_data.key_board_config" ></key-board>
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
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle).on
})

onUnmounted(()=>{
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY).off;
})

const ref_data = reactive({
  money:0,
  bet_keyboard_show:false,
  key_board_config: {}, //键盘配置信息
})

const input_click = (item,evnet) => {
  event.preventDefault()
  ref_data.key_board_config = item
  BetViewDataClass.set_bet_keyboard_show(true)

  // if ([4, 5].includes(+get_bet_status)) { return };
  // // set_active_index(bet_index);
  // let ele = bet_single_detail.value
  // ele && ele.scrollIntoView({ block: "nearest" })

}

// 设置限额
const set_min_max_money = computed(()=> (id,type) => {
  console.error('BetViewDataClass.bet_min_max_money',BetViewDataClass.bet_min_max_money)
  let obj = lodash_.get(BetViewDataClass.bet_min_max_money,`${id}`,{})
  return obj[type] || ''
})

// 设置投注金额
const change_money_handle = val => {
  let obj = {
    ...ref_data.key_board_config,
    money: val.money,
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