<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关信息
-->
<template>
  <div class="c-bet-mix-info">
    <template v-for="(item, index) in vx_get_virtual_bet_list">
      <!---串关投注项部分-->
      <bet-mix-item
        :view_ctr_obj="view_ctr_obj"
        :id="item"
        :item_obj="item"
        :key="`${item}-${index}`"
        :class="{'bet-mix-item-first': (index==0 && vx_get_virtual_bet_list.length>1), 'bet-mix-item-last': ((index+1)==vx_get_virtual_bet_list.length && vx_get_virtual_bet_list.length>1)}"
      ></bet-mix-item>
    </template>
    <div id="bet_input_defaut_one">
      <!--第一个输入框的-->
      <bet-mix-input
        ref="bet-mix-input-0"
        class="bet-input"
        :index="0"
        :view_ctr_obj="view_ctr_obj"
        :id="vx_get_virtual_bet_s_list[0]"
        :key="`0-${vx_get_virtual_bet_s_list[0]}`"
        v-if="vx_get_virtual_bet_list.length>1 && vx_get_virtual_bet_s_list.length>0"          
      ></bet-mix-input>
    </div>
  </div>
</template>
<script>
import bet_mix_info from "src/public/mixins/virtual_bet/bet_mix_info.js";
import BetMixItem from "src/public/components/virtual_bet/bet_mix_item.vue";
import BetMixInput from "src/public/components/virtual_bet/bet_mix_input.vue";
export default {
  mixins: [bet_mix_info],
    components: {
    // 串关投注项组件
    "bet-mix-item": BetMixItem,
    // 串关投注输入框组件
    "bet-mix-input": BetMixInput,
  },
};
</script>
<style lang="scss" scoped>
/*  第一个输入框距离顶部样式 */
#bet_input_defaut_one {
  .bet-mix-input-card {
    border-top: 0 !important;
  }
}
</style>