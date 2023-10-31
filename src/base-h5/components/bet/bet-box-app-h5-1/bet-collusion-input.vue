<template>
 <div>
  <div v-for="item in BetViewDataClass.bet_special_series" :key="item.id" class="list">
    {{item.name}} X{{item.count}} 
    
    <span v-if="money" class="yb_fontsize20 money-number" @click.stop="input_click">{{  format_money3(money) }}</span>
    <span class="money-span" ref="money_span"
      :class="{ 'money-span2': !(BetData.active_index == index_ ) }" @click.stop="input_click"></span>

  </div>
  <key-board v-show="BetViewDataClass.bet_keyboard_show"></key-board>
 </div>
</template>

<script setup>
import {ref} from 'vue';
import keyBoard from './/bet-keyboard.vue';
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";


const money = ref(0)

 const input_click = (evnet) => {
  event.preventDefault()
  BetViewDataClass.set_bet_keyboard_show(true)

  // if ([4, 5].includes(+get_bet_status)) { return };
  // // set_active_index(bet_index);
  // let ele = bet_single_detail.value
  // ele && ele.scrollIntoView({ block: "nearest" })

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