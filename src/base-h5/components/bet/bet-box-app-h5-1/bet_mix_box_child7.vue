<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
     <div v-show="false"> {{BetData.bet_data_class_version }}</div>
      <div class="nonebox4-content" :class="type == 1?'nonebox4-content-hui':''">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-title" :class="type == 1?'color-hui':''"> item.handicap </div>
              <div class="nonebox4-content-left-content">
                  <div class="nonebox4-content-left-content-xian"></div>
                  <div class="nonebox4-content-left-content-text">
                      <div> item.playName  </div>
                      <div> item.home  VS  item.away </div>
                  </div>
              </div>
          </div>
          <div class="nonebox4-content-right">
              <div class="nonebox4-content-right-profit" :class="type == 1?'color-hui':''"><span class="nonebox4-content-right-profit-type">@</span>7000</div>
              <div v-if="type == 1" class="font-red">不支持串关投注</div>
              <div v-else :class="state == 1?'font-red':'font-greed'">赔率已变更</div>
          </div>
      </div>
     
    </div>
  </template>
  <script setup>
  import BetData from "src/core/bet/class/bet-data-class.js";
  import { format_odds, format_currency, formatTime } from "src/core/format/index.js"
  
  import betSingleDetail from './bet-single-detail.vue';

  const type = 1 //1：不支持串关投注     2：支持
  const state = 2 //1:涨   2：跌
  
  const props = defineProps({
      item:{
        type: Object,
        default: () => {}
      },
      index:{}
  })
  
  </script>
  
  <style lang="scss" scoped>
  .color-hui{
    color: #999 !important;
  }
  .nonebox4-content-hui{
    background: var(--q-gb-bg-c-10) !important;
  }
  .bet-mix-show{
    margin-top: 5px;
  }
  .font-red{
    color: var(--q-gb-bd-c-8);
    font-size: 11px !important;
  }
  .font-greed{
    color: var(--q-gb-t-c-2);
    font-size: 11px !important;
  }
  .nonebox4-content{
      width: 100%;
      //margin-top: 10px;
      display: flex;
      justify-content: space-between;
      background: var(--q-gb-bg-c-9);
      padding: 10px;
  }
  .nonebox4-content-left-title{
      font-size: 13px;
      color: #000;
  }
  .nonebox4-content-left-content{
      height: 45px;
      display: flex;
      margin-top: 5px;
  }
  .nonebox4-content-left-content-xian{
      width: 2px;
      height: 100%;
      background: #2394fc;
      margin-right: 4px;
  }
  .nonebox4-content-left-content-text{
      font-size: 12px;
      color: #999;
      line-height: 23px;
  }
  .nonebox4-content-right-profit{
      font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
  }
  .nonebox4-content-right-profit-type{
      font-size: 12px !important;
      margin-top: -2px;
  }
  .nonebox4-content-right-num{
      width: 20px;
      height: 20px;
      background: #2394fc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      border-radius: 50%;
      font-size: 16px;
      margin-top: 44px;
      float: right;
  }
  
  </style>
  