<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show">
    <div @click="btn_reduce(item)">-</div>
    <div class="bet-mix-show-value font700 number_family"><span class="bet-mix-show-box">@</span>{{ ref_pre_book.appoint_odds_value }}</div>
    <div @click="btn_add(item)">+</div>
  </div>
</template>
<script setup>
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { btn_reduce, btn_add, ref_pre_book } from "src/core/bet/common/appoint-data.js"

const props = defineProps({
  item: {}
})


</script>

<style lang="scss" scoped>
    .bet-mix-show{
        height: 0.4rem;
        overflow: hidden;
        padding-left: .24rem;
        padding-right: .24rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: var(--q-gb-bg-c-22);
        border-radius: .12rem;
        margin: 0.1rem 0;
        color: var(--q-gb-t-c-11);
        font-size: .2rem;
    }
    .bet-mix-show-value{
        color: var(--q-gb-t-c-17);
        display: flex;
        align-items: center;
    }
    .bet-mix-show-box{
        font-size: 0.12rem;
        margin-right: 0.02rem;
        margin-top: -0.01rem;
    }
</style>