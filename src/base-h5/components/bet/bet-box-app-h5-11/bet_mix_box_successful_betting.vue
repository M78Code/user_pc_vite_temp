<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show">
   <div v-show="false"> {{ BetViewDataClass.bet_view_version}} </div>
    <div class="nonebox4-result" v-for="item in BetViewDataClass.orderNo_bet_obj" :key="item.playOptionsId">
        <div class="nonebox4-content-result nonebox4-content-top0">
            <div class="nonebox4-content-result-left">{{ i18n_t('app_h5.bet.reserve_win')}}</div>
            <div class="nonebox4-content-result-right">  {{ format_currency(parseFloat(item.betMoney)/100) }}</div>
        </div>
        <div class="nonebox4-content-result">
            <div class="nonebox4-content-result-left">{{i18n_t('bet.bet_win')}}</div>
            <div class="nonebox4-content-result-right">  {{ format_currency(parseFloat(item.maxWinMoney)/100) }}</div> 
        </div>
    </div>
  </div>
</template>
<script setup>
import { format_currency } from 'src/output/index.js'
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
</script>

<style lang="scss" scoped>
.nonebox4-result{
    width: 100%;
    margin-top: 10px;
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
    color: var(--q-gb-t-c-3);
}
.nonebox4-content-result-right{
    font-size: 14px;
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

</style>