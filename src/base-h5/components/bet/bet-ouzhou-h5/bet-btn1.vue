<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="tip component bet-btn-item">
    <div :class="BetViewDataClass.error_code == 200 ? 'bet-success' : 'bet-error'">
      {{ BetViewDataClass.error_message }}
    </div>
  </div> 
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
  BetViewDataClass.set_is_finally(true)
  BetData.set_h5_bet_box_show(false)
  BetData.set_clear_bet_info()
  BetViewDataClass.set_clear_bet_view_config()
}
// 保留投注项
const set_retain_selection = () => {
    BetViewDataClass.set_is_finally(true)
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
  color: var(--q-gb-t-c-4);
  text-align: center;
  font-size: 0.14rem;
  width: 100%;
  height: .36rem;
  line-height: 0.36rem;
  .bet-error {
    color: var(--q-gb-t-c-17);
  }

  .bet-success {
    color: var(--q-gb-t-c-16);
  }
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
      font-size: 0.13rem;
      font-weight: 400;
      letter-spacing: 0px;
      border: 0.5px solid var(--q-gb-t-c-5);
      margin: 0 0.11rem 0 0.12rem;
      line-height: 0.4rem;
    }
    .place_bet{
      font-size: 0.14rem;
      font-weight: 500;
      line-height: 0.4rem;
      width: 2.37rem;
      // height: 46px;
      border-radius: 2px;
      background: var(--q-gb-bg-c-1);
      color:  var(--q-gb-t-c-2);
      .right_amount{
        font-size: 0.2rem;
        margin-left: 6px;
      }
    }
  }
</style>
