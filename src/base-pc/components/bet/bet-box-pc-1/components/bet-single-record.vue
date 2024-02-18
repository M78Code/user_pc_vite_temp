<!--
 * @Description: 单住投注项信息组件 正常
-->
<template>
  <div>
    <div  v-for="(item,index) in betViewDataClass.orderNo_bet_obj" :key="index">
      <bet-result :items="item"></bet-result>
      <div class="yb-fontsize12 bet-single-record">
        <div class="bet-content-value">
          <!--投注额-->
          <span  v-if="item.preOrderDetailStatus == 0 || item.preOrderDetailStatus == 1">
            {{ i18n_t("bet.bet_book_stake")}}
          </span>
          <span>
            {{ i18n_t('common.bets_val')}}
          </span>
          <span>
            {{ i18n_t('common.maxn_amount_val')}}
          </span>
        </div>

        <div class="bet-content-value">
          <span>{{ format_currency(parseFloat(item.betMoney)/100) }}</span>
          <span>{{ format_currency(parseFloat(item.maxWinMoney)/100) }}</span>
        </div>

      </div>
    </div>
  </div>
 
</template>
<script setup>
import { IconWapper } from 'src/components/icon'
import { format_currency,formatTime } from "src/output/index.js"
import BetResult from './bet-result.vue';
import betViewDataClass from 'src/core/bet/class/bet-view-data-class';

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  id: {   //赛事id
    type: String,
    default: "0"
  },
  item: {}
})

</script>
<style lang="scss" scoped>
.bet-single-record {
  padding: 0 15px 15px;
  .bet-content-value{
  display: flex;
  justify-content: space-between;
}
}
</style>