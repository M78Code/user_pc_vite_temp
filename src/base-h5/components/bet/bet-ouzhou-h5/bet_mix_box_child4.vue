<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
      <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-content">
                  <div class="nonebox4-content-left-content-xian" v-if="type == 1">
                    <div class="nonebox4-content-left-content-nei"></div>
                  </div>
                  <div class="nonebox4-content-left-content-xian green" v-if="type == 2">
                    <div class="nonebox4-content-left-content-nei green-nei"></div>
                  </div>
                  <div class="nonebox4-content-left-content-xian red" v-if="type == 3">
                    <div class="nonebox4-content-left-content-nei red-nei"></div>
                  </div>
                  <div class="nonebox4-content-left-info">
                    <div class="nonebox4-content-left-content-text">
                      <div class="nonebox4-content-left-content-text-one">Sevilla Futbol Club <span class="text-one-span">0.25</span></div>
                      <div class="nonebox4-content-left-content-text-two">[In-play] <span class="text-two-span">1X2</span></div>
                      <div class="nonebox4-content-left-content-text-three">Sevilla Futbol Club</div>
                    </div>
                    <div>
                        <div class="nonebox4-content-right">
                            <div class="nonebox4-content-right-profit">123</div>
                        </div>
                        <div class="nonebox4-content-right-bot" :class="type == 2?'green-color':type==3?'red-color':''">Bet Placed</div>
                    </div>
                  </div>
              </div>
          </div>
      </div>
     
      <div class="total">
        <div>Highest Win<span class="total-left">72.40</span></div>
        <div>Stake<span class="total-right">10.00</span></div>
      </div>
    </div>
  </template>
  <script setup>
    const type = 2//1:等待   2：成功    3：失败
  </script>
  
  <style lang="scss" scoped>
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
    color: var(--q-gb-t-c-11);
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
    color: var(--q-gb-t-c-11);
  }
  .nonebox4-content-left-content-text-three{
    font-size: 0.16rem;
    color: var(--q-gb-bg-c-8);
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
    width: calc(100% - 0.25rem);
  }
  .nonebox4-content{
      width: 100%;
      background: var(--q-gb-t-c-14);
      padding: 10px;
      padding: 0.15rem;
  }
  .nonebox4-content-left-title{
      font-size: 13px;
      color: #000;
  }
  .nonebox4-content-left-content{
      height: 70px;
      display: flex;
      margin-top: 5px;
      width: 100%;
  }
  .nonebox4-content-left-content-xian{
      width: 0.15rem;
      height: 0.15rem;
      border: 1px solid var(--q-gb-bg-c-12);
      border-radius: 50%;
      margin-right: 0.15rem;
      margin-top: 0.06rem;
  }
  .nonebox4-content-left-content-nei{
      width: 0.1rem;
      height: 0.1rem;
      background: var(--q-gb-bg-c-12);
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
    color: var(--q-gb-bg-c-12);
  }
  </style>
  