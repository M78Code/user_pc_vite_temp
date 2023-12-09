<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show">
   <div v-show="false"> {{ BetViewDataClass.bet_view_version}} </div>
    <div class="nonebox4-result" v-for="item in BetViewDataClass.orderNo_bet_obj" :key="item.playOptionsId">
        <div class="nonebox4-content-result nonebox4-content-top0">
            <div class="nonebox4-content-result-left">{{ i18n_t('bet.bet_val') }}</div>
            <div class="nonebox4-content-result-right num">  {{ format_currency(parseFloat(item.betMoney)/100) }}</div>
        </div>
        <div class="nonebox4-content-result">
            <div class="nonebox4-content-result-left">{{ i18n_t('app_h5.bet.win_amount')}}</div>
            <div class="nonebox4-content-result-right num">  {{ format_currency(parseFloat(item.maxWinMoney)/100) }}</div>
        </div>
        <div class="nonebox4-content-result">
            <div class="nonebox4-content-result-left">{{i18n_t('bet.order_no')}}</div>
            <div class="nonebox4-content-result-left orderNumber">{{item.orderNo}}</div>
        </div>
    </div>
  </div>
</template>
<script setup>
import { format_currency, i18n_t } from 'src/output/index.js'
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
</script>

<style lang="scss" scoped>
.nonebox4-result{
    width: 100%;
    //margin-top: 14px;
    // background: var(--q-gb-bg-c-9);
    padding: 10px;
    margin-top: 0.1rem;
    background-color: var(--q-gb-bg-c-22);
    border-radius: 0.12rem;
}
.nonebox4-content-top0{
    margin-top: 0 !important;
}
.nonebox4-content-result{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
.nonebox4-content-result-left{
    font-size: 12px;
    color: var(--q-gb-t-c-11);
}
.nonebox4-content-result-right{
    font-size: 14px;
  &.num{
    font-weight: bold;
  }
}
.nonebox4-sub{
    padding: 8px 0;
    width: 96%;
    margin-left: 2%;
    font-size: 16px;
    text-align: center;
    color: #FFFFFF;
    background-color: #2394fc;
    border-radius: 6px;
}
// .orderNumber{
//   font-size: 14px;
// }
</style>