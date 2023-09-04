<!--
 * @Description: 串关信息
-->
<template>
  <div class="c-bet-mix-info">
      <!---串关投注项部分-->
      <bet-mix-item
        :id="item"
        :item_obj="item"
        :key="`${item}-${index}`"
        :class="{'bet-mix-item-first': (index==0 && BetData.bet_list.length>1), 'bet-mix-item-one': (index==0 && BetData.bet_list.length==1)}"
        :ref="`bet-mix-item-${index}`" v-for="(item, index) in BetData.bet_list"
      ></bet-mix-item>
    <template v-if="view_ctr_obj.bet_order_success_success && view_ctr_obj.bet_order_success_success.length>0">
      <!--投注结果部分-->
      <bet-mix-result 
        :series_obj="item" 
        v-for="(item, index) in view_ctr_obj.bet_order_success_success" 
        :key="index"
        :class="{'bet-mix-result-first':(index==0)}"
      ></bet-mix-result>
    </template>
    <template v-else>
      <div id="bet_input_defaut_one" v-if="BetData.bet_s_list.length > 0">
        <!--第一个输入框的-->
        <bet-mix-input
          ref="bet-mix-input-0"
          class="bet-input"
          :index="0"
          
          :id="BetData.bet_s_list[0]"
          :key="`0-${BetData.bet_s_list[0]}`"
          v-if="BetData.bet_list.length>1"          
        ></bet-mix-input>
      </div>
    </template>
  </div>
</template>
<script setup>
import bet_mix_info from "./config/bet_mix_info.js";
import BetMixItem from "./bet-mix-item.vue";
import BetMixInput from "./bet-mix-input.vue";
import BetMixResult from "./bet-mix-result.vue";

 

</script>
<style lang="scss" scoped>
/*  第一个输入框距离顶部样式 */
#bet_input_defaut_one {
  .bet-mix-input-card {
    border-top: 0 !important;
  }
}
</style>