<!--
 * @Description: 串关投注记录组件
-->
<template>
  <div class="bet-mix-record">
    <div v-show="false">-{{BetViewDataClass.bet_view_version}}</div>
    <!--投注记录项部分-->
    <bet-result
      :items="item"
      v-for="(item,index ) in BetViewDataClass.orderNo_bet_obj"
      :key="index"
    ></bet-result>
    <!--投注结果部分-->
    <bet-mix-result 
      :items="item" 
      v-for="(item, index) in BetViewDataClass.orderNo_bet_single_obj" 
      :key="index"></bet-mix-result>

   

  </div>
</template>
<script setup>
import BetResult from "./bet-result.vue";
import BetMixResult from "./bet-mix-result.vue";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";

</script>