<!--
 * @Description: 串关信息
-->
<template>
  <div class="c-bet-mix-info">
    <div style="display:none"> {{ BetData.bet_data_class_version }} </div>
      <!---串关投注项部分-->
      <bet-mix-item
        :item="item"
        :key="`${item}-${index}`"
        v-for="(item, index) in BetData.bet_s_list"
      ></bet-mix-item>
      
    <template v-if="BetViewDataClass.bet_order_success_success && BetViewDataClass.bet_order_success_success.length>0">
      <!--投注结果部分-->
      <!-- <bet-mix-result 
        :series_obj="item" 
        v-for="(item, index) in BetViewDataClass.bet_order_success_success" 
        :key="index"
        :class="{'bet-mix-result-first':(index==0)}"
      ></bet-mix-result> -->
    </template>
    <template v-else>
      <div id="bet_input_defaut_one" v-if="BetData.bet_s_list.length > 0">
        <!--第一个输入框的-->
        <bet-input
          ref="bet-mix-input-0"
          class="bet-input"
          :index="0"
          :item="BetData.bet_s_list[0]"
          :key="`0-${BetData.bet_s_list[0].custom_id}`"
          v-if="BetData.bet_s_list.length>1"          
        ></bet-input>
      </div>
    </template>
  </div>
</template>
<script setup>
import bet_mix_info from "./config/bet_mix_info.js";
import BetMixItem from "./bet-mix-item.vue";
import BetInput from "./bet-input.vue";
import BetMixResult from "./bet-mix-result.vue";

import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
 

</script>
<style lang="scss" scoped>
/*  第一个输入框距离顶部样式 */
#bet_input_defaut_one {
  .bet-mix-input-card {
    border-top: 0 !important;
  }
}
</style>