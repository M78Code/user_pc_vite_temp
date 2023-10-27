<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show">
    <div>-</div>
    <div class="bet-mix-show-value"><span class="bet-mix-show-box">@</span>{{ format_odds(item.oddFinally, item.sportId) }}</div>
    <div>+</div>
  </div>
</template>
<script setup>
import { format_currency,format_odds } from 'src/core/index.js'
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import BetData from "src/core/bet/class/bet-data-class.js";

const props = defineProps({
  item: {}
})
</script>

<style lang="scss" scoped>
    .bet-mix-show{
        height: 0.4rem;
        border-radius: 4px;
        font-size: 0.16rem;
        overflow: hidden;
        padding-left: 0.1rem;
        padding-right: 0.1rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: var(--q-gb-t-c-7);
        border-radius: 12px;
        margin: 0.1rem 0;
        color: var(--q-gb-t-c-3);
        font-size: 18px;
    }
    .bet-mix-show-value{
        color: var(--q-gb-t-c-3);
    }
    .bet-mix-show-box{
        font-size: 0.12rem;
        margin-right: 0.02rem;
        margin-top: -0.01rem;
    }
</style>
