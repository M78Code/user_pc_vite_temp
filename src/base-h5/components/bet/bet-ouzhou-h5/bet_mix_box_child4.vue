<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
      <div v-for="(item, index) in BetViewDataClass.orderNo_bet_obj" :key="index">
      <!-- <div>{{BetViewDataClass.bet_order_status}}</div> -->
          <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-content">
                  <div class="bet-result-state">
                    <div class="nonebox4-content-left-content-xian" v-if="BetViewDataClass.bet_order_status == 2">
                      <img class="icon_loading" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/gif/icon_loading.gif`" alt="" />
                    </div>
                    <div class="nonebox4-content-left-content-xian" v-if="BetViewDataClass.bet_order_status == 3">
                      <span class="icon-success"></span>
                    </div>
                    <div class="nonebox4-content-left-content-xian" v-if="BetViewDataClass.bet_order_status == 4">
                      <span class="icon-failure"></span>
                    </div>
                  </div>
                  <div class="nonebox4-content-left-info">
                    <div class="nonebox4-content-left-content-text">
                      <div class="nonebox4-content-left-content-text-one">{{item.playOptionName}} <span class="text-one-span">【{{ i18n_t(`odds.${item.marketType}`) }}】</span></div>
                      <div class="nonebox4-content-left-content-text-two">{{item.matchType == 2?  i18n_t("bet.bet_inplay") :''}}   
                         <span class="text-two-span">{{item.playName}}
                          <span v-if="[4,19,143,113].includes(item.playId*1)">{{item.matchType == 2? item.mark_score : ''}}</span>
                         </span>
                      </div>
                      <div class="nonebox4-content-left-content-text-three" v-if="item.matchType != 3">{{item.matchName}}</div>
                      <div class="nonebox4-content-left-content-text-three">{{item.matchInfo}}</div>
                    </div>
                    <div class="flex">
                      <div>
                        <div class="nonebox4-content-right">
                           <div class="nonebox4-content-right-profit">@{{item.oddsValues}}</div>
                        </div>
                        <div class="nonebox4-content-right-bot" :class="BetViewDataClass.bet_order_status == 3?'green-color':BetViewDataClass.bet_order_status==4?'red-color':''">
                          {{BetViewDataClass.bet_order_status==4?i18n_t('bet.bet_err'):BetViewDataClass.bet_order_status==2?i18n_t('bet.bet_loading'):i18n_t('bet.bet_suc')}}{{}}
                        </div>
                      </div>
                    
                    </div>
                  </div>
              </div>
          </div>
      </div>
     
      <div class="total">
        <div>{{ i18n_t("bet.total_win2") }}<span class="total-left">{{ format_currency(parseFloat(item.maxWinMoney)/100) }}</span></div>
        <div>{{ i18n_t("bet.bet_val") }}<span class="total-right">{{ format_currency(parseFloat(item.betMoney)/100) }}</span></div>
      </div>
      <div style="display:none">{{ BetViewDataClass.bet_view_version }}</div>
      </div>
    </div>
  </template>
  <script setup>
  
    import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
      import { compute_value_by_cur_odd_type,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
      import { i18n_t, format_currency } from "src/output/index.js"
// import i18n from "project/activity/src/i18n";

  const props = defineProps({
    items:{}
  })
    const type = 2//1:等待   2：成功    3：失败
  </script>
  
  <style lang="scss" scoped>
  .icon-failure:before{
    font-size: 18px;
  }
  .icon-success:before{
    font-size: 18px;
    color: var(--q-gb-t-c-16);
  }
  .hps_img{
    width: 9px;
    height: 18px;
    margin-top: 6px;
    transform: rotate(180deg);
  }
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
    color: var(--q-gb-t-c-17) !important;
  }
  .red-nei{
    background: var(--q-gb-bd-c-8) !important;
  }
  .red{
     border: 1px solid var(--q-gb-bd-c-8) !important;
  }
  .green-color{
    color: var(--q-gb-t-c-16) !important;
  }
  .green{
    border: 1px solid var(--q-gb-t-c-16) !important;
  }
  .green-nei{
    background: var(--q-gb-t-c-16) !important;
  }
  .total-right{
    font-weight: bold;
    margin-left: 0.05rem;
    font-size: 0.16rem;
  }
  .total-left{
    color: var(--q-gb-t-c-18);
    font-size: 0.15rem;
    margin-left: 0.05rem;
    font-weight: bold;
  }
  .total{
    padding: 0.1rem;
    background: var(--q-gb-bg-c-17);
    display: flex;
    justify-content: space-between;
    font-size: 0.14rem;
    height: 40px;
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
    font-size: 0.13rem;
    color: var(--q-gb-t-c-3);
  }
  .nonebox4-content-left-content-text-two{
    color: var(--q-gb-t-c-15);
    font-size: 0.13rem;
    padding: 0.01rem;
  }
  .text-two-span{
    color: #000000;
    font-weight: 400;
  }
  .nonebox4-content-left-content-text-one{
    font-size: 0.15rem;
    font-weight: 600;
  }
  .nonebox4-content-left-content-text{
      line-height: 0.25rem;
      margin-top: 0.02rem;
      width: calc(100% - 1rem);
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
      padding: 0.05rem 0.1rem;
  }
  .nonebox4-content-left-title{
      font-size: 13px;
      color: var(--q-gb-t-c-13);
  }
  .nonebox4-content-left-content{
      min-height: 70px;
      display: flex;
      margin-top: 5px;
      width: 100%;
      .bet-result-state{
        width: 0.38rem;
        margin-top: 0.05rem;
      }
  }
  .nonebox4-content-left-content-xian{
    width: 0.18rem;
    height: 0.18rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nonebox4-content-left-content-nei{
    width: 0.09rem;
    height: 0.09rem;
    background: var(--q-gb-bg-c-1);
    border-radius: 50%;
  }
  .nonebox4-content-left-content-text{
      line-height: 0.25rem;
        margin-top: 0.02rem;
  }
  .nonebox4-content-right-profit{
      font-size: 0.2rem;
      font-weight: bold;
      padding: 0 0.05rem;
      font-family: "DIN";
  }
  .nonebox4-content-right{
    text-align: right;
    width: 0.7rem;
  }
  .nonebox4-content-right-bot{
    font-size: 0.12rem;
    font-weight: bold;
    color: var(--q-gb-t-c-1);
    padding: 0 0.05rem;
  text-align: right;
  }
  .icon_loading{
    width: 0.18rem;
    height: 0.18rem;
  }
  </style>
 