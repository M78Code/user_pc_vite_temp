

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
  <!-- 展开串关类型 -->
  <div v-if="is_type" class="open-crosstalk">
  <span>展开串关类型</span>
    <!-- <img  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/odds_up.png`" alt=""/> -->
    <img class='icon' :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/odds_down.png`" alt=""/>
  </div>
</template>

<script setup> 
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import {  LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js'
const props = defineProps({
  is_type: {
    type: Boolean,
    default: false
  },
})
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
  /* ************** 展开串关类型 ************** -S */
  .open-crosstalk{
    display: flex;
    width: 100%;
    padding: 0.11rem 0.13rem 0.12rem 2.72rem;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #E2E2E2;
    background: #FFF;
    color: var(--q-gb-t-c-3);
    font-size: 0.12rem;
    .icon{
      margin-left: 0.08rem;
    }
  }
  
</style>