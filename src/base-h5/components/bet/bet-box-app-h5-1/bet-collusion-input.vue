<template>
 <div>
  
  <div v-show="false">{{BetViewDataClass.bet_view_version}}{{BetData.bet_data_class_version}}</div>

  <div v-for="(item,index) in BetViewDataClass.bet_special_series" :key="item.id" class="list">
    <span>{{item.name}} X{{item.count}}</span> 

    <span class="money-span1" @click.stop="input_click(item,index,$event)">

      <span class="money-span" v-if="BetData.active_index == index " ref="money_span_single" :style="{ opacity:  '1' }"></span>
      
      <span v-if="item.money" class="yb_fontsize20 money-number" @click.stop="input_click(item,index,$event)">{{  item.money }}</span>

      <span v-show="!item.money">{{ i18n_t('app_h5.bet.limit')}}{{ set_min_max_money(item.id,'min_money') }}-{{ set_min_max_money(item.id,'max_money')  }}</span>
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
import { useMittOn, MITT_TYPES } from "src/output/index.js";

let flicker_timer = null
const money_span_single = ref()

const ref_data = reactive({
  money: 0,
  key_board_config: {}, //键盘配置信息
  index_: '', // 当前选中的数据
  flicker_timer:"",
})

onMounted(()=>{
  flicker_timer = null
  cursor_flashing()
  // 设置默认值
  BetData.set_bet_keyboard_config(BetViewDataClass.bet_special_series[0])

  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle).on;
})

onUnmounted(()=>{
  clearInterval(flicker_timer)
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY).off;
})

const input_click = (item,index,evnet) => {
  event.preventDefault()
  BetData.set_bet_keyboard_config(item)
  BetData.set_bet_keyboard_show(true)
  BetData.set_active_index(index)
}

// 设置限额
const set_min_max_money = computed(()=> (id,type) => {
  let obj = lodash_.get(BetViewDataClass.bet_min_max_money,`${id}`,{})
  return obj[type] || ''
})

// 设置投注金额
const change_money_handle = (val = {} ) => {
  // 单关 串关切换 引起方法被调用  
  if(!val.params.id) return
  let obj = {
    money: val.money,
    ...val.params,
  }
  BetViewDataClass.set_bet_special_series_item(obj)
}

/**
 *@description 光标闪动，animation有兼容问题，用函数替代
 *@return {Undefined} undefined
 */
 const cursor_flashing = () => {
  clearInterval(flicker_timer)
  flicker_timer = setInterval(() => {
    money_span_single.value && money_span_single.value[0].classList.toggle('money-span3')
  }, 700);
}

</script>
<style scoped lang="scss">
  .list{
    display: flex;
    justify-content: space-between;
    background: var(--q-gb-t-c-7);
    margin: 0.1rem 0;
    padding: 0.1rem;
    border-radius: 12px;
  }
  .yb_fontsize20{
    font-size: 0.12rem;
  }
  .money-span1{
    display: flex;
  }
  .money-span {
    width: 0.02rem;
    height: 0.16rem;
    margin: 0 1px;
    display: flex;
    background: var(--q-gb-bg-c-1);
    &.money-span3{
      background: transparent;
    }
  }
</style>