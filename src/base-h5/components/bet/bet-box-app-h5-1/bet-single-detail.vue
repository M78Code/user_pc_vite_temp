<!--
 * @Author: Router
 * @Date: 2020-11-12 11:46:40
 * @Description: 单关矩形金额输入框
-->
<template>
  <!-- 混合过关投注选项 -->
  <div class="bet_single_detail" ref="bet_single_detail">
    <div class="content-b" :class="{ 'red-color': !money_ok }" @click.stop="input_click">
      <span v-if="ref_data.money" class="yb_fontsize20 money-number">{{ format_money3(ref_data.money) }}</span>
      <span class="money-span" ref="money_span"
        :style="{ opacity: BetData.active_index === bet_index && [1, 7].includes(+get_bet_status) ? '1' : '0' }"></span>
      <span class="yb_fontsize14 limit-txt" v-show="ref_data.money">{{ ref_data.money }}</span>
      <span class="yb_fontsize14 limit-txt" v-show="!ref_data.money">限额{{ ref_data.min_money }}-{{ ref_data.max_money }}</span>
      <span @click.stop="clear_money" class="money-close" :style="{ opacity: ref_data.money > 0 ? '1' : '0' }">x</span>
    </div>
    <div class="content-rmb">RMB</div>
  </div>
</template>

<script setup>
// import betting from 'src/project/mixins/betting/betting.js';
import lodash_ from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import UserCtr from 'src/core/user-config/user-ctr.js'
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue';
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { format_money3, format_money2 } from 'src/core/format/index.js'
import { format_currency } from "src/core/format/module/format-currency.js"


let timer1 = null
let timer4 = null;
let flicker_timer = null

const get_cur_odd = ref()
const get_bet_status = ref()
const get_used_money = ref()
const get_money_notok_list2 = ref()

const bet_single_detail = ref()  // 实列
const money_span = ref()  // 实列

// 复式连串过关投注
const special_series = reactive({
  id: '',
  name: '',
  count: "",
})

const ref_data = reactive({
  DOM_ID_SHOW: false,
  active: 1,    //投注项状态
  appoint: true, // 是否预约
  odds_change_up: false,  // 赔率上升
  odds_change_down: false, // 赔率下降
  min_money: 10, // 最小投注金额
  max_money: 8888, // 最大投注金额
  win_money: 0.00, // 最高可赢
  money: '', // 投注金额
  keyborard: true, // 是否显示 最高可赢 和 键盘
  seriesOdds: '', // 赔率
})

const props = defineProps({
  index:{
    type: Number,
    default: 0
  },
  item: {}
})

onMounted(() => {
  // 延时器
  timer1 = null;
  timer4 = null;
  flicker_timer = null  //光标闪动计时器


  //监听键盘金额改变事件
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle)
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money)
})

/**   ----------------computed 开始-----------------*/

const item_ = computed(() => {
  return view_ctr_obj[name_].bs;
})
// 转化过后的坑位id
const hn_id = computed(() => {
  return BetData.bet_list[bet_index]
})
// 单关监听最高可投注金额
const obj_max_money = computed(() => {
  return view_ctr_obj[name_].orderMaxPay
})
// 单关监听多项单关输入值
const obj_bet_money = computed(() => {
  return view_ctr_obj[name_].money
})

/**   ----------------computed 开始-----------------*/

// ...mapMutations(['set_money_total', "set_money_notok_list", "set_keyboard_show", "set_money_notok_list2", "set_active_index", "set_http_update"]),
/**
 *@description 点击删除按钮，清空金额
 *@return {Undefined} undefined
 */
const clear_money = () => {
  ref_data.money = 0
  BetData.set_bet_amount("0")
}

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
 const change_money_handle = (new_money) => {
  ref_data.money = new_money
}


// 限额改变 修改限额内容
const set_ref_data_bet_money = () => {
  console.error('ssss')
    let value = props.item.playOptionsId
    // 串关获取 复试连串
    if (!BetData.is_bet_single) {

        // 复式连串关投注
        const { id, name, count } = BetViewDataClass.bet_special_series[props.index]
        special_series.id = id
        special_series.name = name
        special_series.count = count
        // 串关 type
        value = id
    }

    const { min_money = 10, max_money = 8888, seriesOdds } = lodash_.get(BetViewDataClass.bet_min_max_money, `${value}`, {})
    // 最小限额
    ref_data.min_money = min_money
    // 最大限额
    ref_data.max_money = max_money
    // 复试串关赔率
    ref_data.seriesOdds = seriesOdds
    // 限额改变 重置投注金额
    ref_data.money = ''
}

// 快捷金额
const set_click_keybord = obj => {
    // 快捷金额 max 使用限额最大金额作为投注金额
    if (obj.text == 'MAX') {
        ref_data.money = ref_data.max_money
    } else {
        // 投注金额 = 快捷金额 加上 原有的投注金额
        let max_money = ref_data.money * 1 + obj.value
        // 投注金额 大于 最大投注限额 则 使用最大限额作为投注金额
        if (max_money > ref_data.max_money) {
            ref_data.money = ref_data.max_money
        } else {
            ref_data.money = max_money
        }
        // 记录投注金额 单关 不合并
        BetData.set_bet_amount(ref_data.money)
    }
}

// 输入判断
const set_win_money = () => {
    // 输入控制 在2位小数 todo
    if (ref_data.money > ref_data.max_money) {
        // 超出最大限额 使用 最大限额 作为投注金额
        ref_data.money = ref_data.max_money
        // 修改页面提示 1: 输入金额超出最大限额时
        BetViewDataClass.set_input_money_state(1)
    }
    BetData.set_bet_amount(ref_data.money)
    // 计算最高可赢金额
    // ref_data.win_money = ref_data.money * props.item.oddFinally
}

/**
 *@description 金额输入框点击
 *@param {Undefined}
 *@return {Undefined} undefined
 */
 const input_click = (evnet) => {
  event.preventDefault()
  set_keyboard_show(true)

  if ([4, 5].includes(+get_bet_status)) { return };

  set_active_index(bet_index);

  let ele = bet_single_detail.value
  ele && ele.scrollIntoView({ block: "nearest" })

  send_money_to_keyboard()
}
// 将当前活动项的金额和最高可投金额传递给键盘
const send_money_to_keyboard = () => {
  if (BetData.active_index == bet_index) {
    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: ref_data.money, max_money: ref_data.max_money })
  }
}


onUnmounted(() => {
  // clear_timer()

  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle).off;
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off

  // for (const key in $data) {
  //   $data[key] = null
  // }
  // unsubscribe()
})



</script>
<style lang="scss" scoped>
@import url("src/base-h5/css/bet/bet_single_detail.scss");
.bet_single_detail{
  margin-top: 0.1rem;
  background:var(--q-gb-bg-c-9);
  border-radius: 0.01rem;
  display: flex;
  justify-content: space-between;
  border-radius: 12px;
  .content-rmb{
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0px;
    text-align: center;
    height: 0.4rem;
    border-radius: 4px;
    font-size: 0.16rem;
    padding-right: 0.1rem;
    position: relative;
    display: flex;
    align-items: center;
  }
}
.bet-single-detail {
  height: 0.56rem;
  position: relative;
}

/* ************** 右边内容 ************** -S */
.content-b {
  width: 1.6rem;
  height: 0.4rem;
  border-radius: 4px;
  font-size: 0.16rem;
  overflow: hidden;
  padding-left: 0.1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 70%;
}

/* ************** 右边内容 ************** -E */

.set-opacity {
  opacity: 0.2;
  pointer-events: none;
}

.money-number {
  margin-top: 1px;
}

.money-span {
  width: 0.02rem;
  height: 0.16rem;
  margin: 0 1px;
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
  font-size: 13px;
}

/* ************** 左边内容 ************** -S */
.content-t {
  padding-left: 0.12rem;
  margin-right: auto;

  p:nth-child(1) {
    position: relative;

    &::after {
      content: "";
      width: 3px;
      height: 0.12rem;
      border-radius: 2px;
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
