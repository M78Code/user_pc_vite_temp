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
      <!-- 串关 -->
      <div class="bet_crosstalk" @click="set_bet_single_change()" :class="{active:BetData.is_bet_single}">
        <span class="bet-title">串关</span>
        <span class="bet-single"></span>
      </div>

      <div class="place_bet"  @click="place_bet">
        <span>{{i18n_t('bet_record.bet_val')}}</span> 
        <span class="right_amount">{{bet_total()}}</span>
      </div>
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

// 单串关切换
const set_bet_single_change = () => {
  BetData.set_is_bet_single()
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
   .bet_cancel,.bet_crosstalk,.bet_crosstalk_active{
      width: 1rem;
      line-height: 0.46rem;
      border-radius: 0.02rem;
      font-size: 0.16rem;
      font-weight: 400;
      height: 0.46rem;
      letter-spacing: 0px;
      text-align: center;
      color: var(--q-gb-t-c-4);
    }
    /* ************** 串关 ************** -S */
    .bet_crosstalk{
      position: relative;
      border: 1px solid var(--q-gb-bd-c-1);
      border-radius: .02rem;
      .bet-title{
        width: .88rem;
        height: 0.58rem;
      }
      .bet-single{
        width: 0.14rem;
        height: 0.38rem;
        position:absolute;
        background: var(--q-gb-t-c-14);
        left: 0.08rem;
        top: 0.03rem;
        border-radius: 0.04rem;
      }
      &.active{
        background: var(--q-gb-bg-c-1);
        border: 1px solid var(--q-gb-bd-c-2);
        color: var(--q-gb-t-c-2);
        border-radius: .02rem;
        .bet-single{
          background: var(--q-gb-t-c-2);
          left: .78rem;
        }
      }
    }
     /* ************** 串关激活 ************** -S */
    
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