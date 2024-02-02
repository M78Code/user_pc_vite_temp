<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="tip component bet-btn-item" v-if="BetViewDataClass.error_message">
    <div class="bet-error" v-if="BetViewDataClass.error_message">
      {{ BetViewDataClass.error_code_list.includes(BetViewDataClass.error_code) ? i18n_t(BetViewDataClass.error_message) : BetViewDataClass.error_message }}
    </div>
  </div> 
  <div v-else class="box-line"></div>
    <div class="bet_content_bottom component bet-btn-item">
      <!-- 串关 -->
      <div class="bet_crosstalk" @click="set_bet_single_change()" :class="{active:!BetData.is_bet_single}">
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
import { submit_handle,get_query_bet_amount_esports_or_vr,get_query_bet_amount_common } from "src/core/bet/class/bet-box-submit.js" 
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittEmit, MITT_TYPES,i18n_t,UserCtr, MenuData  } from "src/output/index.js";
import {computed} from "vue"
import mathJs from 'src/core/bet/common/mathjs.js'

const place_bet = () => {
  // 未投注之前 可以点击
  if(BetViewDataClass.bet_order_status == 1){
    submit_handle()
  }
}

// 判断当前投注项内 是否有不允许串关的 有的话把串关按钮干掉
const is_serial = () => {
    return BetData.bet_single_list.filter(i => i.is_serial == false).length
};

// 单串关切换
const set_bet_single_change = () => {

  // 冠军不能串
  if(!MenuData.is_kemp() && is_serial()) {
    BetData.set_is_bet_single()

    // 判断获取限额接口类型
    if(MenuData.is_esports() || MenuData.is_vr()){
      // C01/B03/O01  电竞/电竞冠军/VR体育
      get_query_bet_amount_esports_or_vr()
    }else{
      // 获取限额 常规
      get_query_bet_amount_common()
    }

  }
}

// 计算合集
const bet_total = computed(()=> state =>{
  let sum = 0
  if (BetData.is_bet_single) {
    sum = BetData.bet_single_list.reduce((pre, cur) => {
      return pre*1 + cur.bet_amount*1;
    }, 0)
    //保留两位小数
     sum = sum.toFixed(2)
     sum = sum.replace(/(\.\d)0$/,'$1')
    return sum
  }
  if (!BetData.is_bet_single) {
    if (BetViewDataClass.bet_order_status === 1) {
      sum = BetViewDataClass.bet_special_series.reduce((pre, cur) => {
        return pre*1 + (cur.bet_amount ? cur.bet_amount : 0)*1
      }, 0)
    } else {
      sum = BetViewDataClass.orderNo_bet_single_obj.reduce((pre, cur) => {
        return pre*1 + mathJs.divide(item.seriesBetAmount, 100)*1
      }, 0)
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
    height: 0.68rem;
    display: flex;
    text-align: center;
    justify-content: space-between;
    align-content: space-between;
    padding: 0 0.12rem .22rem;
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
  .box-line{
    width: 100%;
    height: 0.1rem;
  }
</style>