<!--
 * @Description: 单关矩形金额输入框
-->
<template>
  <!-- 混合过关投注选项 -->
  <div>
    <div v-show="false">{{BetData.bet_data_class_version}}</div>
    <!-- {{ item }} -->
    <div class="bet-box-line"></div>

    <div class="bet_single_info">
      <div class="bet_single_detail" ref="bet_single_detail">
        <div class="content-b" @click.stop="input_click">
          <span v-if="ref_data.money" class="yb_fontsize20 money-number number_family">{{ ref_data.money }}</span>

          <span class="money-span" ref="money_span" v-if="show_money_span" :style="{ opacity: '1' }"></span>
          
          <span class="yb_fontsize14 limit-txt" v-show="!ref_data.money">{{ i18n_t('app_h5.bet.limit')}}
            <em class="yb_fontsize16 number_family">{{ ref_data.min_money ? format_money2(ref_data.min_money) : '' }}-{{ref_data.max_money ? format_money2(ref_data.max_money) : '' }}</em>
          </span>
        </div>
        <div class="content-rmb">{{ currency_code[UserCtr.currency] }}</div>
      </div>
      <div class="bet_single_info_btn" :class="ref_data.is_bet_pre ? 'focus' : ''" v-if="BetData.bet_pre_list.includes(item.playOptionsId)">
        <div class="" v-if="ref_data.is_bet_pre" @click="set_bet_pre">{{ i18n_t('app_h5.bet.cancel_appoint') }}</div>
        <div v-else @click="set_bet_pre"><span class="space">+</span>{{ i18n_t('pre_record.book')}}</div>
      </div>
    </div>

     <!--加减-->
     <bet-mix-box-addition-subtraction v-if="ref_data.is_bet_pre" :item='item'></bet-mix-box-addition-subtraction>

     <!-- 键盘 -->
     <bet-keyboard v-if="BetData.bet_keyboard_show"></bet-keyboard>

  </div>
</template>


<script setup>
import betMixBoxAdditionSubtraction from './bet_mix_box_addition_subtraction.vue';
import betKeyboard from "./bet-keyboard.vue"

import lodash_ from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { ref, reactive, onMounted,computed, onUnmounted } from 'vue';
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { get_query_bet_amount_pre } from "src/core/bet/class/bet-box-submit.js"
import { format_money2,currency_code,UserCtr } from "src/output/index.js"

let flicker_timer = null

const get_bet_status = ref()
const bet_single_detail = ref()  // 实列
const money_span = ref()  // 实列
const show_money_span = ref(false)
const money_ok = ref('')

const ref_data = reactive({
  DOM_ID_SHOW: false,
  active: 1,    //投注项状态
  appoint: true, // 是否预约
  odds_change_up: false,  // 赔率上升
  odds_change_down: false, // 赔率下降
  min_money: '', // 最小投注金额
  max_money: '', // 最大投注金额
  win_money: 0.00, // 最高可赢
  money: '', // 投注金额
  keyborard: true, // 是否显示 最高可赢 和 键盘
  seriesOdds: '', // 赔率
  is_bet_pre: false, // 预约按钮
})

const props = defineProps({
  index:{
    type: Number,
    default: 0
  },
  item: {
    default: () => {},
  }
})

onMounted(() => {
  flicker_timer = null  //光标闪动计时器
  cursor_flashing()
  // 刷新数据后 设置限制 再设置金额
  // set_ref_data_bet_money()
  ref_data.money = BetData.bet_amount
  BetData.bet_keyboard_show = true
  //监听键盘金额改变事件

  ref_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_SINGLE, change_money_handle).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off,
  }
})

// 设置预约开关
const set_bet_pre = () => {
  ref_data.is_bet_pre = !ref_data.is_bet_pre
  // 预约开启 获取预约数据
  if(ref_data.is_bet_pre){
    get_query_bet_amount_pre()
    // BetData.set_bet_amount(0) //预约不重置金额
  }
  // 设置是否开启预约
  BetData.set_is_bet_pre(true)
}

/**
 *@description 光标闪动，animation有兼容问题，用函数替代
 *@return {Undefined} undefined
 */
 const cursor_flashing = () => {
  clearInterval(flicker_timer)
  flicker_timer = setInterval(() => {
    money_span.value && money_span.value.classList.toggle('money-span3')
  }, 700);
}

/**
 *@description 点击删除按钮，清空金额
 *@return {Undefined} undefined
 */
const clear_money = () => {
  ref_data.money = 0
  BetData.set_bet_amount(0)
}

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
 const change_money_handle = (new_money) => {
  ref_data.money = new_money.money
  BetData.set_bet_obj_amount(ref_data.money,props.item.playOptionsId)
  BetData.set_bet_amount(ref_data.money)
}

// 限额改变 修改限额内容
const set_ref_data_bet_money = () => {
  let value = props.item.playOptionsId

  const { min_money = 10, max_money = 8888, seriesOdds } = lodash_.get(BetViewDataClass.bet_min_max_money, `${value}`, {})
  // 最小限额
  ref_data.min_money = min_money
  // 最大限额
  ref_data.max_money = max_money
  // console.error(' ref_data.min_money ', ref_data.min_money )
  // 复试串关赔率
  ref_data.seriesOdds = seriesOdds
  // 限额改变 重置投注金额 如果大于当前额度为最大额度 如果最小额度旧是最小 否则保持
  // if(ref_data.money){
    // ref_data.money = ref_data.money*1 > max_money ? max_money : ref_data.money*1 < min_money ? min_money : ref_data.money
  // }
  // 设置键盘设置的限额和数据
  BetData.set_bet_keyboard_config({playOptionsId:props.item.playOptionsId})
}



/**
 *@description 金额输入框点击
 *@param {Undefined}
 *@return {Undefined} undefined
 */
 const input_click = (evnet) => {
  event.preventDefault()

  show_money_span.value = true

  BetData.set_bet_keyboard_show(true)
}

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})


</script>
<style lang="scss" scoped>
.bet-box-line{
  width: 100%;
  height: 0.04rem;
}
.bet_single_info{
  display: flex;
  justify-content: space-between;
  align-items: center;
  
}
.bet_single_info_btn{
    width: .96rem;
    font-size: .16rem;
    background: var(--q-gb-t-c-1);
    color: var(--q-gb-t-c-14);
    border-radius: .10rem;
    height: 0.44rem;
    display: flex;
    margin-left: 0.08rem;
    align-items: center;
    justify-content: center;
    &.focus {
      background: none;
      border: 1px solid var(--q-gb-t-c-1);
      color: var(--q-gb-t-c-1);
    }
    .space {
      margin-right: .04rem; 
      font-size: .18rem;
    }
}
@import url("src/base-h5/css/bet/bet_single_detail.scss");
.bet_single_detail{
  background: var(--q-gb-bg-c-22);
  border-radius: 0.01rem;
  display: flex;
  justify-content: space-between;
  border-radius: 0.12rem;
  flex: 1;
  height: 0.44rem;
  .content-rmb{
    
    
    font-weight: 500;
    letter-spacing: 0px;
    text-align: center;
    height: 0.44rem;
    border-radius: 4px;
    font-size: 0.14rem;
    padding-right: 0.1rem;
    position: relative;
    display: flex;
    align-items: center;
    color: var(--q-gb-t-c-11);
  }
}
.bet-single-detail {
  height: 0.56rem;
  position: relative;
}
/* ************** 右边内容 ************** -S */
.content-b {
  height: 0.44rem;
  border-radius: .04rem;
  font-size: 0.16rem;
  overflow: hidden;
  padding-left: 0.1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 70%;
  color: var(--q-gb-t-c-18);
  .limit-txt {
    color: var(--q-gb-t-c-19);
    em {
      margin-left: .04rem;
    }
  }
}
/* ************** 右边内容 ************** -E */
.set-opacity {
  opacity: 0.2;
  pointer-events: none;
}
.money-number {
  margin-top: .01rem;
  color:var(--q-gb-t-c-18);
  font-weight: 700;
}
.money-span {
  width: 0.02rem;
  height: 0.16rem;
  margin: 0 .01rem;
  background: var(--q-gb-t-c-1);
  &.money-span3{
    background: transparent;
  }
}
.money-close {
  position: absolute;
  top: 50%;
  right: 0.08rem;
  width: 0.15rem;
  height: 0.15rem;
  line-height: 0.15rem;
  text-align: center;
  margin-top: -0.09rem;
  background: gray;
  color: #FFFFFF;
  border-radius: 50%;
  font-size: .13rem;
}
/* ************** 左边内容 ************** -S */
.content-t {
  padding-left: 0.12rem;
  margin-right: auto;

  p:nth-child(1) {
    position: relative;

    &::after {
      content: "";
      width: .03rem;
      height: 0.12rem;
      border-radius: .02rem;
      position: absolute;
      left: -0.08rem;
      top: 50%;
      transform: translateY(-58%);
    }
  }

  p:nth-child(2) {
    font-size: 0.11rem;
    line-height: 0.14rem;
  }
}

/* ************** 左边内容 ************** -E */
</style>