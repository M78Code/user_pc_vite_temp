<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="tip component bet-btn-item">
    <div class="bet-error" v-if="BetViewDataClass.error_message">
      {{ BetViewDataClass.error_code_list.includes(BetViewDataClass.error_code) ? i18n_t(BetViewDataClass.error_message) : BetViewDataClass.error_message }}
    </div>
  </div> 
    <div class="bet_content_bottom component bet-btn-item">
      <p class="bet_cancel" @click="pack_up">{{i18n_t('bet.bet_retract')}}</p>
      <p class="place_bet"  @click="place_bet">
        <span>{{i18n_t('bet_record.bet_val')}}</span> 
        <span class="right_amount">{{bet_total()}}</span>
      </p>
    </div>
  <div style="display:none">{{ BetData.bet_data_class_version }} -{{UserCtr.user_version}}-{{ BetViewDataClass.bet_view_version }}</div>
</template>

<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import { submit_handle } from "src/core/bet/class/bet-box-submit.js" 
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittEmit, MITT_TYPES,i18n_t,UserCtr  } from "src/output/index.js";
import {computed} from "vue"
import mathJs from 'src/core/bet/common/mathjs.js'


const place_bet = () => {
  // 未投注之前 可以点击
  if(BetViewDataClass.bet_order_status == 1){
    submit_handle()
  }
}

const bet_total = computed(()=> state =>{
  let sum = 0
  if (BetData.is_bet_single) {
    if (BetData.is_bet_merge) {
      BetData.bet_single_list.forEach(item => {
        sum += item.bet_amount*1
      });
      return sum
    }
    sum = BetData.bet_amount*1
    return sum
  }
  if (!BetData.is_bet_single) {
    if (BetViewDataClass.bet_order_status === 1) {
        BetViewDataClass.bet_special_series.forEach((item)=>{
            sum += (item.bet_amount ? item.bet_amount : 0)*1
        })
    } else {
        BetViewDataClass.orderNo_bet_single_obj.forEach((item)=>{
            sum += mathJs.divide(item.seriesBetAmount, 100)*1
        })
    }
  }
})

const pack_up = (val) => {
  BetData.set_clear_bet_info()
  // TODO: 临时调试用
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
  // BetData.set_clear_bet_info()
  // BetViewDataClass.set_clear_bet_view_config()
}
</script>

<style lang="scss" scoped>
.tip{
  color: var(--q-gb-bd-c-4);
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
    height: 0.58rem;
    display: flex;
    text-align: center;
    justify-content: space-between;
    align-content: space-between;
    padding: 0 0.12rem .12rem;
   .bet_cancel{
      width: 1rem;
      line-height: 0.46rem;
      border-radius: 0.02rem;
      font-size: 0.16rem;
      font-weight: 400;
      height: 0.46rem;
      letter-spacing: 0px;
      border: 0.5px solid var(--q-gb-bd-c-12);
      text-align: center;
      color: var(--q-gb-t-c-4);
    }
    .place_bet{
      height: 0.46rem;
      font-size: 0.14rem;
      font-weight: 500;
      line-height: 0.46rem;
      width: 2.35rem;
      border-radius: 0.02rem;
      background: var(--q-gb-bg-c-1);
      color:  var(--q-gb-t-c-2);
      .right_amount{
        font-size: 0.18rem;
        margin-left: 0.06rem;
      }
    }
  }
</style>