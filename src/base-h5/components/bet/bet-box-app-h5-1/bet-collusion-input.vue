<template>
 <div>
  dddd
  <div v-for="item in BetViewDataClass.bet_special_series" :key="item.id">
    {{item.name}} X{{item.count}} 
    
    <span v-if="money" class="yb_fontsize20 money-number">{{  format_money3(money) }}</span>
    <span class="money-span" ref="money_span"
      :class="{ 'money-span2': !(BetData.active_index == index_ ) }"></span>

  </div>
  <key-board v-show="BetViewDataClass.bet_keyboard_show"></key-board>
 </div>
</template>

<script setup>
import keyBoard from './/bet-keyboard.vue';
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";

const money = ref(0)
</script>