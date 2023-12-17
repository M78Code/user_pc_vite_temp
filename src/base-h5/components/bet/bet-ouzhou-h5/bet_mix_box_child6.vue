<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">

      <div>
        <div class="nonebox4-content" v-for="(item, index) in BetViewDataClass.orderNo_bet_obj" :key="index">
          <div class="nonebox4-content-xian">
            <div v-for="item in 4" :key="item" class="nonebox4-content-left-content-dian" :class="type == 2?'green-nei':type == 3?'red-nei':''" v-if="index>0"></div>
            <div class="nonebox4-content-left-content-xian" :class="index>0?'top0':''" v-if="type == 1">
              <div class="nonebox4-content-left-content-nei"></div>
            </div>
            <div class="nonebox4-content-left-content-xian green" :class="index>0?'top0':''" v-if="type == 2">
              <div class="nonebox4-content-left-content-nei green-nei"></div>
            </div>
            <div class="nonebox4-content-left-content-xian red" :class="index>0?'top0':''" v-if="type == 3">
              <div class="nonebox4-content-left-content-nei red-nei"></div>
            </div>
            <div v-for="item in 13" :key="item" class="nonebox4-content-left-content-dian" :class="type == 2?'green-nei':type == 3?'red-nei':''" v-if="index<BetViewDataClass.orderNo_bet_obj.length"></div>
          </div>
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-content">
                <div class="nonebox4-content-left-info">
                  <div class="nonebox4-content-left-content-text">
                      <div class="nonebox4-content-left-content-text-one">{{item.matchName}} <span class="text-one-span">{{ items.marketValue }}</span></div>
                      <div class="nonebox4-content-left-content-text-two">{{item.matchType == 2?'[In-play]':''}}
                        <span class="text-two-span">{{item.playName}}
                       
                        </span>
                      </div>
                      <div class="nonebox4-content-left-content-text-three">{{item.matchInfo}}</div>
                    </div>
                  <div>
                      <div class="nonebox4-content-right">
                          <div class="nonebox4-content-right-profit">123</div>
                      </div>
                      <div class="nonebox4-content-right-bot" :class="BetViewDataClass.bet_order_status == 3?'green-color':BetViewDataClass.bet_order_status==4?'red-color':''">{{i18n_t('bet.bet_suc')}}</div>
                  </div>
                </div>
              </div>
          </div>
        </div>


        <div class="total">
          <div>{{ i18n_t("common.maxn_amount_val") }}<span class="total-left">72.40</span></div>
          <div>{{ i18n_t("bet_record.total_v") }}<span class="total-right">10.00</span></div>
        </div>
      </div>

    </div>
  </template>
  <script setup>
    const type = 1//1:等待   2：成功    3：失败
  </script>
  
  <style lang="scss" scoped>
  .nonebox4-content-xian{
    width: 0.15rem;
  }
  .nonebox4-content-left-content-dian{
    width: 2px;
    height: 2px;
    background: var(--q-gb-bd-c-8);
    border-radius: 50%;
    margin-top: 3px;
    margin-left: calc(50% - 1px);
  }
  .nonebox4-content-left{
    width: calc(100% - 0.4rem);
    padding: 0.15rem 0.05rem;
    border-bottom: 1px solid var(--q-gb-bd-c-6);
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
    display: flex;
  }
  .nonebox4-content-left-info{
    display: flex;
    justify-content: space-between;
    width: calc(100% - 0.25rem);
  }
  .nonebox4-content{
      width: 100%;
      background: var(--q-gb-bg-c-2) ;
      padding: 10px;
      padding: 0 0.15rem;
      display: flex;
      justify-content: space-between;
  }
  .nonebox4-content-left-title{
      font-size: 13px;
      color: var(--q-gb-t-c-13);
  }
  .nonebox4-content-left-content{
      height: 70px;
      display: flex;
      width: 100%;
  }
  .nonebox4-content-left-content-xian{
      width: 0.15rem;
      height: 0.15rem;
      border: 1px solid var(--q-gb-bd-c-1);
      border-radius: 50%;
      margin-right: 0.15rem;
      margin-top: 0.25rem;
  }
  .top0{
    margin-top: 0;
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
  