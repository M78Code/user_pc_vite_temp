<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注记录组件
-->
<template>
  <div class="bet-mix-record">
    <!--投注记录项部分-->
    <bet-mix-record-item
      :oid="item.playOptionsId"
      :view_ctr_obj="view_ctr_obj"    
      :item_obj="item"
      v-for="(item, index) in order_detail_data"
      :key="item.playOptionsId"
      :class="{'bet-mix-record-item-first': (index==0 && vx_get_virtual_bet_list.length>1),  'bet-mix-record-item-last': ((index+1)==vx_get_virtual_bet_list.length && vx_get_virtual_bet_list.length>1)}"
    ></bet-mix-record-item>
    <!--投注结果部分-->
    <bet-mix-result 
      :series_obj="item" 
      v-for="(item, index) in series_order_data" 
      :key="index"
      :class="{'bet-mix-record-result-last': ((index+1)==series_order_data.length)}"></bet-mix-result>
  </div>
</template>
<script>
import bet_mix_record from "src/public/mixins/virtual_bet/bet_mix_record.js";
import bet_mix_record_item from "src/public/components/virtual_bet/bet_mix_record_item.vue";
import bet_mix_result from "src/public/components/virtual_bet/bet_mix_result.vue";
export default {
  mixins: [bet_mix_record],
  components: {
    "bet-mix-record-item":bet_mix_record_item, // 串关投注结果投注项组件
    "bet-mix-result":bet_mix_result // 串关投注结果组件
  }
};
</script>