<!--
 * @Description: 单关组件 虚拟体育左侧菜单和内嵌
-->
<template>
  <div class="bet-single" data-container="single-container" ref="single-container">
    <!--未投注-->
    <template v-if="bet_flag">
      <!--投注信息-->
      <bet-single-info
        :view_ctr_obj="view_ctr_obj"
        :id="item"
        :index="index"
        :common_amount="common_amount"
        :is_common_amount="is_common_amount"
        :key="`single-${item}`"
        @get_button_text="get_button_text"
        v-for="(item, index) in vx_get_virtual_bet_list"
      ></bet-single-info>
    </template>
    <!--已投注-->
    <template v-else>
      <!--投注结果-->
      <bet-single-record
        :view_ctr_obj="view_ctr_obj"
        :single_record_obj="item"
        v-for="(item,index) in view_ctr_obj.order_detail_data"
        :key="`${item.playOptionsId}`"
        :class="{'last-item':index==view_ctr_obj.order_detail_data.length-1}"
      ></bet-single-record>
      <!--确认中, 投注成功, 投注失败的提示-->
      <div class="bet-confirm-message  text-center yb-fontsize12"
        :id="DOM_ID_SHOW && `but-bet-single-ok`"
        :class="{
          'bet-success-order':(view_ctr_obj.order_confirm_complete==2),
          'bet-fail-order':(view_ctr_obj.order_confirm_complete==3)
        }">
        <template v-if="view_ctr_obj.order_confirm_complete==1">
          <!--订单确认中的提示:订单需要系统审核,请关注投注记录-->
          {{$root.$t('bet.bet_order_info1')}}
        </template>
        <template v-else-if="view_ctr_obj.order_confirm_complete==2">
          <!--投注成功的提示:您的订单已确认-->
          {{$root.$t('bet.bet_order_info2')}}
        </template>
        <template v-else-if="view_ctr_obj.order_confirm_complete==3">
          <!--投注失败的提示:投注失败-->
          {{$root.$t('bet.bet_order_info3')}}
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import bet_single from "src/public/mixins/virtual_bet/bet_single.js";
import BetSingleInfo from "src/public/components/virtual_bet/bet_single_info.vue";
import BetSingleRecord from "src/public/components/virtual_bet/bet_single_record.vue";

export default {
  mixins: [  bet_single],
  components: {
    "bet-single-info": BetSingleInfo,
    "bet-single-record": BetSingleRecord
  }
};
</script>
<style lang="scss" scoped>
.bet-single{
  margin-top:5px
}

</style>
