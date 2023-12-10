<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
     <div v-show="false"> {{BetData.bet_data_class_version }}</div>
      <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-title" v-html="item.handicap"></div>
              <div class="nonebox4-content-left-content" :class="!item.home?'nonebox4-content-left-content-no':''">
                  <div class="nonebox4-content-left-content-xian"></div>
                  <div class="nonebox4-content-left-content-text">
                      <div>{{ item.playName }} <span class="font-color">【{{i18n_t(`odds.${UserCtr.odds.cur_odds}`)}}】</span></div>
                      <div v-if="item.home">{{ item.home }} VS {{ item.away }}</div> 
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
  import { format_odds, format_currency, formatTime } from "src/output/index.js"
  import { UserCtr } from "src/output/index.js";
  import betSingleDetail from './bet-single-detail.vue';
  
  const props = defineProps({
      item:{
        type: Object,
        default: () => {}
      },
      index:{}
  })
  
  </script>
  
  <style lang="scss" scoped>
  .nonebox4-content-right-num{
    // background: var(--q-gb-bg-c-9);
    background:#d2ebff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--q-gb-bg-c-8);
    border-radius: 1rem;
    font-size: 16px;
    margin-top: 44px;
    float: right;
    height: 20px;
    padding: 0 5px;
}
  .nonebox4-content{
      width: 100%;
      //margin-top: 10px;
      display: flex;
      justify-content: space-between;
      background: var(--q-gb-bg-c-22);
      padding: 10px;
      border-radius: 0.12rem;
  }
  .nonebox4-content-left-title{
      color: var(--q-gb-t-c-20);
      font-size: 0.14rem;
			font-weight: 500;
  }
  .nonebox4-content-left-content{
      height: 70px;
      display: flex;
      margin-top: 5px;
  }
  .nonebox4-content-left-content-no{
    height: 48px;
  }
  .nonebox4-content-left-content-xian{
      width: 2px;
      height: 100%;
      background: var(--q-gb-bg-c-13);
      margin-right: 4px;
  }
  .nonebox4-content-left-content-text{
      font-size: 0.12rem;
      color: var(--q-gb-t-c-11);
      line-height: 23px;
			font-weight: 500;
  }
  .nonebox4-content-right-profit{
      font-size: 0.22rem;
      font-weight: bold;
      display: flex;
      align-items: center;
  }
  .nonebox4-content-right-profit-type{
      font-size: 0.14rem;
  }
  .font-color{
    color: var(--q-gb-t-c-1);
  }
  .nonebox4-content-right{
    margin-top: -6px;
  }
  
  </style>
  src/output/index.js