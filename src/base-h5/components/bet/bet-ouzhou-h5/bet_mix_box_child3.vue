<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">
      {{ '串关' }}
      <div v-for="(item, index) in items" :key=index>
        <div class="nonebox4-content">
            <div class="nonebox4-content-left">
                <div class="nonebox4-content-left-content">
                    <span class="icon-delete nonebox4-content-left-content-xian"></span>
                    <div class="nonebox4-content-left-info">
                      <div class="nonebox4-content-left-content-text">
                        <div class="nonebox4-content-left-content-text-one">{{item.handicap}} 
                          <span class="text-one-span">{{ items.marketValue }}</span></div>
                        <div class="nonebox4-content-left-content-text-two">{{item.matchType == 2?'[In-play]':''}} <span class="text-two-span">{{item.playName}}</span></div>
                        <div class="nonebox4-content-left-content-text-three">{{item.home}} v {{item.away}}</div>
                      </div>
                      <div>
                          <div class="nonebox4-content-right">
                              <div class="nonebox4-content-right-profit">{{compute_value_by_cur_odd_type(item.odds,item.playId,item.odds_hsw,item.sportId)}}</div>
                          </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- <div>
          <bet-input-info1 :item="item" :index="index" ></bet-input-info1>
        </div> -->
      </div>
     
    </div>
  </template>
  <script setup>
    // import betInputInfo1 from "./bet_input_info1.vue";
    import { compute_value_by_cur_odd_type } from "src/output/index.js"

    const props = defineProps({
      items:{}
    })
  </script>
  
  <style lang="scss" scoped>
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
    color: var(--q-gb-bg-c-8);
  }
  .nonebox4-content-left-content-text-two{
    color: var(--q-gb-t-c-1);
    font-size: 0.16rem;
  }
  .text-two-span{
    color: var(--q-gb-t-c-12);
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
      background: var(--q-gb-bg-c-2);
      padding: 10px;
      padding: 0.15rem;
  }
  .nonebox4-content-left-title{
      font-size: 13px;
      color: var(--q-gb-t-c-13);
  }
  .nonebox4-content-left-content{
      height: 70px;
      display: flex;
      margin-top: 5px;
      width: 100%;
  }
  .nonebox4-content-left-content-xian{
      color: var(--q-gb-t-c-18);
      font-size: 0.12rem;
      width: 0.1rem;
      margin-right: 0.15rem;
      margin-top: 0.06rem;
  }
  .nonebox4-content-left-content-text{
      line-height: 0.25rem;
        margin-top: 0.02rem;
  }
  .nonebox4-content-right-profit{
      font-size: 0.2rem;
      font-weight: bold;
      color: var(--q-gb-t-c-18);
  }
  .nonebox4-content-right{
    display: flex;
  }
  </style>
  src/output/index.js