<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
    <div class="bet-mix-show">

      <div v-for="(items, index) in item" :key="index">
        <div class="nonebox4-content">
          <div class="nonebox4-content-left">
              <div class="nonebox4-content-left-content">
                  <div class="nonebox4-content-left-content-xian">删</div>
                  <div class="nonebox4-content-left-info">
                    <div class="nonebox4-content-left-content-text">
                      <div class="nonebox4-content-left-content-text-one">{{items.handicap}} <span class="text-one-span">0.25</span></div>
                      <div class="nonebox4-content-left-content-text-two">{{items.matchType == 2?'[In-play]':''}} <span class="text-two-span">{{items.playName}}</span></div>
                      <div class="nonebox4-content-left-content-text-three">{{items.home}} v {{items.away}}</div>
                    </div>
                    <div>
                        <div class="nonebox4-content-right">
                            <div class="nonebox4-content-right-profit" v-if="type != 4">{{compute_value_by_cur_odd_type(item.odds,'','',item.sportId)}}</div>
                            <div v-if="type == 2" class="content-right-duo"></div>
                            <div v-else-if="type == 3" class="content-right-shao"></div>
                            <div v-else-if="type == 4" class="content-right-closed">closed</div>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <!-- 输入框 -->
        <bet-input-info></bet-input-info>
      </div>
      <!-- 合并单关最下面的多个输入框 -->
      <div>
        <!-- 输入框 -->
        <bet-input-info></bet-input-info>
        <!-- 输入框 -->
        <bet-input-info></bet-input-info>
        <!-- 输入框 -->
        <bet-input-info></bet-input-info>
      </div>
      
    </div>
  </template>
<script setup>
  import betInputInfo from "./bet_input_info.vue";
  const type = 4;//1:不涨也不少    2：增长     3：减少   4:注单失效
   const props = defineProps({
    item:{}
  })

</script>
  
  <style lang="scss" scoped>
  .content-right-closed{
    width: 0.6rem;
    height: 0.15rem;
    font-size: 0.12rem;
    border-radius: 0.01rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--q-gb-t-c-4);
    color: var(--q-gb-t-c-3);
    margin-top: 0.05rem;
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
      color: var(--q-gb-t-c-11);
  }
  .nonebox4-content-right{
    display: flex;
  }
  </style>
  