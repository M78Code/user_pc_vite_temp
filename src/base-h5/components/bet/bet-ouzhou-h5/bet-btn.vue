<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="bet_content_bottom">
    <p class="bet_cancel" @click="bet_retract">Bet Retract</p>
    <p class="place_bet"  @click="place_bet">
      <span>Place Bet</span>
      <span class="right_amount">{{BetData.bet_amount}}</span>
    </p>
  </div>
</template>

<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { submit_handle } from "src/core/bet/class/bet-box-submit.js" 

const place_bet = () => {
  submit_handle()
}

</script>

<style lang="scss" scoped>
.bet_content_bottom{
    height: 0.9rem;
    display: flex;
    align-items: center;
    text-align: center;
    // margin-top: 26px;
   .bet_cancel{
      width: 100px;
      line-height: 0.3rem;
      border-radius: 2px;
      font-family: "Roboto";
      font-size: 0.15rem;
      font-weight: 400;
      letter-spacing: 0px;
      border: 0.5px solid var(--q-gb-t-c-5);
      margin: 0 0.2rem 0 0.2rem;
      line-height: 0.4rem;
    }
    .place_bet{
      font-family: "DIN";
      font-size: 0.14rem;
      font-weight: 500;
      line-height: 0.4rem;
      width: 2.17rem;
      // height: 46px;
      border-radius: 2px;
      background: var(--q-gb-bg-c-12);
      color:  var(--q-gb-bg-c-15);
      .right_amount{
        font-family: DIN;
        font-size: 0.2rem;
        margin-left: 6px;
      }
    }
  }
</style>
