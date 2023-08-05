<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关信息
-->
<template>
  <div class="c-bet-mix-info">
    <template v-for="(item, index) in vx_get_bet_list">
      <!---串关投注项部分-->
      <bet-mix-item
        :view_ctr_obj="view_ctr_obj"
        :id="item"
        :item_obj="item"
        :key="`${item}_${index}`"
        :class="{'bet-mix-item-first': (index==0 && vx_get_bet_list.length>1), 'bet-mix-item-one': (index==0 && vx_get_bet_list.length==1)}"
        :ref="`bet-mix-item-${index}`"
      ></bet-mix-item>
    </template>
    <template v-if="view_ctr_obj.series_order_success && view_ctr_obj.series_order_success.length>0">
      <!--投注结果部分-->
      <bet-mix-result 
        :series_obj="item" 
        v-for="(item, index) in view_ctr_obj.series_order_success" 
        :key="index"
        :class="{'bet-mix-result-first':(index==0)}"
      ></bet-mix-result>
    </template>
    <template v-else>
      <div id="bet_input_defaut_one" v-if="vx_get_bet_s_list.length > 0">
        <!--第一个输入框的-->
        <bet-mix-input
          ref="bet-mix-input-0"
          class="bet-input"
          :index="0"
          :view_ctr_obj="view_ctr_obj"
          :id="vx_get_bet_s_list[0]"
          :key="`0-${vx_get_bet_s_list[0]}`"
          v-if="vx_get_bet_list.length>1"          
        ></bet-mix-input>
      </div>
    </template>
  </div>
</template>
<script setup>
// import bet_mix_info from "src/public/mixins/bet/bet_mix_info.js";
import BetMixItem from "./bet/bet_mix_item.vue";
import BetMixInput from "./bet/bet_mix_input.vue";
import BetMixResult from "./bet/bet_mix_result.vue";

const props = defineProps({
  //接收到的串关数据
  view_ctr_obj: {
    type: Object,
    default: {}
  }
})

</script>
<style lang="scss" scoped>
/*  第一个输入框距离顶部样式 */
#bet_input_defaut_one {
  .bet-mix-input-card {
    border-top: 0 !important;
  }
}
</style>