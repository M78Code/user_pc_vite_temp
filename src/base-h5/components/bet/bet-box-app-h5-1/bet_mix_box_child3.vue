<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
     <div v-show="false"> {{BetData.bet_data_class_version }}</div>
      <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-title">{{ item.handicap }}</div>
              <div class="nonebox4-content-left-content">
                  <div class="nonebox4-content-left-content-xian"></div>
                  <div class="nonebox4-content-left-content-text">
                      <div>{{ item.playName }} </div>
                      <div>{{ item.home }} VS {{ item.away }}</div>
                      <div>{{ item.tid_name }}</div>
                  </div>
              </div>
          </div>
          <div class="nonebox4-content-right">
              <div class="nonebox4-content-right-profit"><span class="nonebox4-content-right-profit-type">@</span>{{ format_odds(item.oddFinally, item.sportId) }}</div>
          </div>
      </div>
     
    </div>
  </template>
  <script setup>
  import BetData from "src/core/bet/class/bet-data-class.js";
  import { format_odds, format_currency, formatTime } from "src/core/format/index.js"
  
  import betSingleDetail from './bet-single-detail.vue';
  
  const props = defineProps({
      item:{},
      index:{}
  })
  
  </script>
  
  <style lang="scss" scoped>
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
      height: 70px;
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
  }
  .nonebox4-content-right-profit-type{
      font-size: 16px;
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
  