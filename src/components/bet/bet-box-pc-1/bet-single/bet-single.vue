<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 正常赛事单关组件
-->
<template>
  <!-- 单关组件 -->
  <div class="bet-single" data-container="single-container" ref="single-container">
    <!--未投注-->
    <template v-if="bet_flag">
      <!--投注信息-->
      <bet-single-info
        :view_ctr_obj="view_ctr_obj"
        :id="item"
        :index="index"
        :is_forward="is_forward"
        :common_amount="common_amount"
        :is_common_amount="is_common_amount"
        :key="`single-${item}`"
        @get_lock_index="get_lock_index"
        @get_button_text="get_button_text"
        v-for="(item, index) in vx_get_bet_single_list"
      ></bet-single-info>
      <!-- 多项单关投注 -->
      <bet-multiple
      :view_ctr_obj="view_ctr_obj"
      v-if="vx_get_bet_single_list.length>1"
      :key="`multiple-${vx_get_bet_single_list.length}`"
      :is_forward="is_forward"
      >
      </bet-multiple>
    </template>
    <!--已投注-->
    <template v-else>
      <!--投注结果 order_detail_data 里面的每一项就是投注结果数据源-->
      <bet-single-record
        :view_ctr_obj="view_ctr_obj"
        :single_record_obj="item"
        v-for="(item, index) in view_ctr_obj.order_detail_data"
        :key="`${item.playOptionsId}`"
        :class="{'mt5': index>0,'fillet': index<view_ctr_obj.order_detail_data.length-2, 'last-item':index==view_ctr_obj.order_detail_data.length-1}"
      ></bet-single-record>
      <!--确认中, 投注成功, 投注失败的提示-->
      <div class="bet-confirm-message  text-center yb-fontsize12"
        :id="DOM_ID_SHOW && `but-bet-single-ok`"
        :class="{
          'bet-success-order':view_ctr_obj.order_confirm_complete==2,
          'bet-fail-order':[3,4].includes(view_ctr_obj.order_confirm_complete),
          'yn-message': ['ad', 'vi', 'th'].includes(lang)
        }">
        <template v-if="[1,4].includes(view_ctr_obj.order_confirm_complete)">
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
<script setup>
// 单关混入js
// import bet_single from "src/public/mixins/bet/bet_single.js";
// 单关投注信息
import BetSingleInfo from "./bet-single-info.vue";
// 多项单关
import BetMultiple from "./bet-multiple.vue";
// 单关投注记录
import BetSingleRecord from "./bet-single-record.vue";

</script>
