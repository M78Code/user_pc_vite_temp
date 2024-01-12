<!--
 * @Description: 串关投注记录组件
-->
<template>
  <div class="bet-mix-record">
    <div v-show="false">-{{BetViewDataClass.bet_view_version}}</div>
    {{ BetViewDataClass.orderNo_bet_obj  }}--{{ BetViewDataClass.orderNo_bet_single_obj }}
    <!--投注记录项部分-->
    <bet-mix-record-item
      :item_obj="item"
      v-for="(item,index ) in BetViewDataClass.orderNo_bet_obj "
      :key="index"
    ></bet-mix-record-item>
    <!--投注结果部分-->
    <bet-mix-result 
      :series_obj="item" 
      v-for="(item, index) in BetViewDataClass.orderNo_bet_single_obj" 
      :key="index"></bet-mix-result>
  </div>
</template>
<script setup>
import BetMixRecordItem from "./bet-mix-record-item.vue";
import BetMixResult from "./bet-mix-result.vue";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";

</script>