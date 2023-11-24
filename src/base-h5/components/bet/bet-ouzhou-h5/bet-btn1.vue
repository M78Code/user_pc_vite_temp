<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="tip" v-show="false">{{BetViewDataClass.error_message}}</div> 
  <div class="bet_content_bottom">
    <p class="bet_cancel"  @click.self="set_retain_selection">{{$t('bet.save')}}</p>
    <!-- <p class="bet_cancel"  @touchmove.prevent>{{$t('bet.save')}}</p> -->
    <p class="place_bet" @click.self="pack_up">
      <span>{{$t('bet.understand')}}</span>
    </p>
  </div>
  <div style="display:none">{{ BetData.bet_data_class_version }}</div>
  <div style="display:none">{{ BetViewDataClass.bet_view_version }}</div>
</template>

<script setup>
import { useMittEmit, MITT_TYPES  } from "src/core/index.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import BetData from "src/core/bet/class/bet-data-class.js";

const pack_up = (val) => {
  // TODO: 临时调试用
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
  BetData.set_clear_bet_info()
  BetViewDataClass.set_clear_bet_view_config()
}
// 保留投注项
const set_retain_selection = () => {
    BetData.set_bet_amount(0)
    BetViewDataClass.set_bet_order_status(1)
    BetViewDataClass.set_bet_before_message({})
    setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
    }, 200);
}
</script>

<style lang="scss" scoped>
.tip{
  color: var(--q-gb-bd-c-4);
  text-align: center;
  margin-top: 0.1rem;
  font-size: 0.15rem;
  margin-right: 0.2rem;
  width: 100%;
  height: .36rem;
}
.bet_content_bottom{
    height: 0.6rem;
    display: flex;
    align-items: center;
    text-align: center;
    // margin-top: 26px;
   .bet_cancel{
      width: 100px;
      line-height: 0.3rem;
      border-radius: 2px;
      font-family: "Roboto";
      font-size: 0.13rem;
      font-weight: 400;
      letter-spacing: 0px;
      border: 0.5px solid var(--q-gb-t-c-5);
      margin: 0 0.1rem 0 0.1rem;
      line-height: 0.4rem;
    }
    .place_bet{
      font-family: "DIN";
      font-size: 0.14rem;
      font-weight: 500;
      line-height: 0.4rem;
      width: 2.37rem;
      // height: 46px;
      border-radius: 2px;
      background: var(--q-gb-bg-c-1);
      color:  var(--q-gb-bg-c-15);
      .right_amount{
        font-family: DIN;
        font-size: 0.2rem;
        margin-left: 6px;
      }
    }
  }
</style>
