<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
      <div v-for="(item, index) in BetViewDataClass.orderNo_bet_obj" :key="index">
          <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-content">
                  <div class="nonebox4-content-left-content-xian" v-if="BetViewDataClass.bet_order_status == 5">
                    <div class="nonebox4-content-left-content-nei"></div>
                  </div>
                  <div class="nonebox4-content-left-content-xian green" v-if="BetViewDataClass.bet_order_status == 3">
                    <div class="nonebox4-content-left-content-nei green-nei"></div>
                  </div>
                  <div class="nonebox4-content-left-content-xian red" v-if="BetViewDataClass.bet_order_status == 4">
                    <div class="nonebox4-content-left-content-nei red-nei"></div>
                  </div>
                  <div class="nonebox4-content-left-info">
                    <div class="nonebox4-content-left-content-text">
                      <div class="nonebox4-content-left-content-text-one">{{item.matchName}} <span class="text-one-span">0.25</span></div>
                      <div class="nonebox4-content-left-content-text-two">{{item.matchType == 2?'[In-play]':''}} <span class="text-two-span">{{item.playName}}</span></div>
                      <div class="nonebox4-content-left-content-text-three">{{item.matchInfo}}</div>
                    </div>
                    <div class="flex">
                      <div>
                        <div class="nonebox4-content-right">
                           <div class="nonebox4-content-right-profit">{{item.oddsValues}}</div>
                        </div>
                        <div class="nonebox4-content-right-bot" :class="BetViewDataClass.bet_order_status == 3?'green-color':BetViewDataClass.bet_order_status==4?'red-color':''">{{BetViewDataClass.bet_order_status==4?$t('bet.bet_err'):BetViewDataClass.bet_order_status==2?$t('bet.bet_loading'):$t('bet.bet_suc')}}{{}}</div>
                      </div>
                      <!--红色箭头-->
                      <div class="top" style="display:none">
                        <div class="jiantou one"></div>
                        <div class="jiantou two"></div>
                        <div class="jiantou three"></div>
                      </div>
                      <!--绿色箭头-->
                      <div class="top" style="display:none">
                        <div class="jiantou onegreen"></div>
                        <div class="jiantou twogreen"></div>
                        <div class="jiantou threegreen"></div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
      </div>
     
      <div class="total">
        <div>Highest Win<span class="total-left">{{ format_currency(parseFloat(item.maxWinMoney)/100) }}</span></div>
        <div>Stake<span class="total-right">{{ format_currency(parseFloat(item.betMoney)/100) }}</span></div>
      </div>
      </div>
    </div>
  </template>
  <script setup>
  
    import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
      import { compute_value_by_cur_odd_type } from "src/core/index.js"
      import { format_currency } from "src/core/format/index.js"

  const props = defineProps({
    items:{}
  })
    const type = 2//1:等待   2：成功    3：失败
  </script>
  
  <style lang="scss" scoped>
  .jiantou{
    width: 0;
    height: 0;
    border: 5px solid;
    position: relative;
  }
  .one{
    border-color: rgba(255, 70, 70, .3) transparent transparent transparent;
  }
  .two{
    border-color: rgba(255, 70, 70, .6) transparent transparent transparent;
  }
  .three{
    border-color: rgba(255, 70, 70, 1) transparent transparent transparent;
  }
  .onegreen{
    border-color: rgba(23, 164, 20, 1) transparent transparent transparent;
  }
  .twogreen{
    border-color: rgba(23, 164, 20, .6) transparent transparent transparent;
  }
  .threegreen{
    border-color: rgba(23, 164, 20, .3) transparent transparent transparent;
  }
  .jiantou::after{
    content: "";
    position: absolute;
    top: -11px;
    left: -9px;
    border: 9px solid;
    border-color: white transparent transparent transparent;
  }
  .top{
    margin-top: 4px;
    margin-left: 4px;
  }
  .red-color{
    color: var(--q-gb-bd-c-8) !important;
  }
  .red-nei{
    background: var(--q-gb-bd-c-8) !important;
  }
  .red{
     border: 1px solid var(--q-gb-bd-c-8) !important;
  }
  .green-color{
    color: var(--q-gb-t-c-2) !important;
  }
  .green{
    border: 1px solid var(--q-gb-t-c-2) !important;
  }
  .green-nei{
    background: var(--q-gb-t-c-2) !important;
  }
  .total-right{
    font-weight: bold;
  }
  .total-left{
    color: var(--q-gb-t-c-18);
    font-size: 0.15rem;
  }
  .total{
    padding: 0.15rem;
    background: var(--q-gb-t-c-6);
    display: flex;
    justify-content: space-between;
    font-size: 0.14rem;
  }
  .content-right-duo{
    display: inline-block;
    background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat center / contain;
    width: 0.14rem;
    height: 0.2rem;
    margin-top: 0.05rem;
  }
  .content-right-shao{
    display: inline-block;
    background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat center / contain;
    width: 0.14rem;
    height: 0.2rem;
    margin-top: 0.05rem;
  }
  .text-one-span{
    color: var(--q-gb-t-c-18);
  }
  .nonebox4-content-left-content-text-three{
    font-size: 0.16rem;
    color: var(--q-gb-t-c-3);
  }
  .nonebox4-content-left-content-text-two{
    color: var(--q-gb-t-c-1);
    font-size: 0.16rem;
  }
  .text-two-span{
    color: var(--q-gb-t-c-18);
    font-weight: 400;
  }
  .nonebox4-content-left-content-text-one{
    font-size: 0.18rem;
    font-weight: 600;
  }
  .nonebox4-content-left-info{
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .nonebox4-content{
      width: 100%;
      background: var(--q-gb-bg-c-2);
      padding: 10px;
      padding: 0.15rem;
  }
  .nonebox4-content-left-title{
      font-size: 13px;
      color: var(--q-gb-t-c-13);
  }
  .nonebox4-content-left-content{
      min-height: 70px;
      //display: flex;
      margin-top: 5px;
      width: 100%;
  }
  .nonebox4-content-left-content-xian{
      width: 0.15rem;
      height: 0.15rem;
      border: 1px solid var(--q-gb-bd-c-1);
      border-radius: 50%;
      margin-right: 0.15rem;
      margin-top: 0.06rem;
  }
  .nonebox4-content-left-content-nei{
      width: 0.1rem;
      height: 0.1rem;
      background: var(--q-gb-bg-c-1);
      border-radius: 50%;
      margin: calc(50% - 0.05rem) calc(50% - 0.05rem);
  }
  .nonebox4-content-left-content-text{
      line-height: 0.25rem;
        margin-top: 0.02rem;
  }
  .nonebox4-content-right-profit{
      font-size: 0.2rem;
      font-weight: bold;
  }
  .nonebox4-content-right{
    text-align: right;
  }
  .nonebox4-content-right-bot{
    font-size: 0.12rem;
    font-weight: bold;
    color: var(--q-gb-t-c-1);
  }
  </style>
  