

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}-{{BetViewDataClass.bet_view_version}}</div>
  <!-- 最高可赢 -->
  <div class="highest_win row items-center justify-between">
    <div class="left_text">
      <p>highest win</p>
      <p class="money">72.40</p>
    </div>
    <div class="right_text">
      <p>total stske</p>
      <p class="multiple">10.00</p>
    </div>
  </div>
</template>

<script setup> 
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
</script>


<style scoped lang="scss">
  /* ************** 最高可赢 ************** -S */
  .highest_win{
    width: 100%;
    height: 0.62rem;
    padding: 0 0.12rem;
    font-size: 0.14rem;
    color: var(--q-gb-t-c-4);
    font-weight: 400;
    .left_text{
      text-align: left;
      .money{
        font-weight: 500;
        color: var(--q-gb-t-c-1);
        font-size: 0.18rem;
      }
    }
    .right_text{
      text-align: right;
      .multiple{
        font-weight: 500;
        font-size: 0.18rem;
      }
    }
  }
  
</style>