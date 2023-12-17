<!--
 * @Description: 串关投注记录组件
-->
<template>
  <div class="bet-mix-record">
    <!--串关-->
    <!-- <div class="bet-record-title">
      {{ i18n_t('bet.bet_series')}}
    </div> -->
    <!--投注记录项部分-->
    <bet-mix-record-item
      :oid="item.playOptionsId"
          
      :item_obj="item"
      v-for="(item, index) in view_ctr_obj.bet_order_success_all"
      :key="item.playOptionsId"
      :class="{'bet-mix-record-item-first': (index==0 && BetData.bet_list.length>1),  'bet-mix-record-item-last': ((index+1)==BetData.bet_list.length && BetData.bet_list.length>1)}"
    ></bet-mix-record-item>
    <!--投注结果部分-->
    <bet-mix-result 
      :series_obj="item" 
      v-for="(item, index) in view_ctr_obj.bet_order_success_all" 
      :key="index"
      :class="{'bet-mix-record-result-last': ((index+1)==view_ctr_obj.bet_order_success_all.length)}"></bet-mix-result>
  </div>
</template>
<script setup>
// import bet_mix_record from "src/public/mixins/bet/bet_mix_record.js";
import BetMixRecordItem from "./bet-mix-record-item.vue";
import BetMixResult from "./bet-mix-result.vue";

</script>