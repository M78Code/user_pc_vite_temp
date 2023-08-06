<!--
 * @Description: 串关投注记录组件
-->
<template>
  <div class="bet-mix-record">
    <!--串关-->
    <!-- <div class="bet-record-title">
      {{$root.$t('bet.bet_series')}}
    </div> -->
    <!--投注记录项部分-->
    <bet-mix-record-item
      :oid="item.playOptionsId"
      :view_ctr_obj="view_ctr_obj"    
      :item_obj="item"
      v-for="(item, index) in view_ctr_obj.order_detail_data"
      :key="item.playOptionsId"
      :class="{'bet-mix-record-item-first': (index==0 && vx_get_bet_list.length>1),  'bet-mix-record-item-last': ((index+1)==vx_get_bet_list.length && vx_get_bet_list.length>1)}"
    ></bet-mix-record-item>
    <!--投注结果部分-->
    <bet-mix-result 
      :series_obj="item" 
      v-for="(item, index) in view_ctr_obj.series_order_data" 
      :key="index"
      :class="{'bet-mix-record-result-last': ((index+1)==view_ctr_obj.series_order_data.length)}"></bet-mix-result>
  </div>
</template>
<script setup>
// import bet_mix_record from "src/public/mixins/bet/bet_mix_record.js";
import BetMixRecordItem from "./bet/bet_mix_record_item.vue";
import BetMixResult from "./bet/bet_mix_result.vue";

</script>