<!--
 * @Author: Router
 * @Date: 2020-11-12 11:46:40
 * @Description: 单关矩形金额输入框
-->
<template>
  <!-- 混合过关投注选项 -->
  <div class="bet-single-detail yb_px14 row items-center" ref="bet_single_detail">
    <!-- 左 -->
    <div class="yb_fontsize16 content-t">
      <p>{{ i18n_t('bet.bet') }}</p>
      <p>
        <span>{{ i18n_t('bet_record.bet_max_win') }}</span>
        <span :class="{ 'red-color': !(max_win_money == '0.00' || money_ok), 'yellow-color': money_ok && money }">{{
          format_money2(max_win_money) }}
        </span>
      </p>
    </div>

    <!-- 右 -->
    <div class="content-b" :class="{ 'red-color': !money_ok }" @click.stop="input_click">
      <span v-if="money" class="yb_fontsize20 money-number">{{ format_money3(money) }}</span>
      <span class="money-span" ref="money_span"
        :style="{ opacity: BetData.active_index === bet_index && [1, 7].includes(+get_bet_status) ? '1' : '0' }"></span>
      <span class="yb_fontsize14 limit-txt" v-show="!money">{{ get_money_format() }}</span>
      <span @click.stop="clear_money" class="money-close" :style="{ opacity: money > 0 ? '1' : '0' }">x</span>
    </div>
  </div>
</template>

<script setup>
// import betting from 'src/project/mixins/betting/betting.js';
import lodash from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import UserCtr from 'src/core/user-config/user-ctr.js'
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue';
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { format_money3, format_money2 } from 'src/output/index.js'
import { format_currency } from "src/output/index.js"
import { i18n_t } from "src/output/index.js"

const money = ref('10')  //输入框金额
const money_ok = ref(true)   //金额是否合适
const min_money = ref(10)   //最低投注金额
const max_money = ref(0)   //最高可投金额
const is_watch = ref(false)    //组件渲染时是否监听money
const max_money_back = ref(true)   //最高可赢金额的接口是否有返回(不管成功与失败)
const obj_pre_max_money = ref(null) // 单关预约最高可投注金额

let timer1 = null
let timer3 = null;
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
  bet_index: {
    type: Number,
    default: 0
  },
  item: {}
})
let mitt_off;
onMounted(() => {
  // 延时器
  timer1 = null;
  timer3 = null;
  timer4 = null;
  flicker_timer = null  //光标闪动计时器


  money.value = BetData.bet_money_total && view_ctr_obj[name_].money || ''

  // // 同步程序走完后再处理逻辑
  // nextTick(() => {
  //   is_watch.value = true;
  // })

  cursor_flashing();

  // 5秒后没有限额金额返回就用默认值
  timer3 = setTimeout(() => {
    if (!max_money_back.value) {
      max_money.value = 8888;
      // 获取接口返回的单关最小投注金额
      min_money.value = lodash.get(UserCtr, 'cvo.single.min', 10)

      if (max_money.value < min_money.value) {
        min_money.value = max_money.value
      }

      max_money_back.value = true;
    }
  }, 5000);
  //监听键盘金额改变事件

  mitt_off=useMittEmitterGenerator([
    {type:MITT_TYPES.EMIT_INPUT_BET_MONEY,callback:change_money_handle},
    {type:MITT_TYPES.EMIT_REF_DATA_BET_MONEY,callback:set_ref_data_bet_money}
  ]).emitters_off;
})

/**   ----------------computed 开始-----------------*/

const item_ = computed(() => {
  return view_ctr_obj[name_].bs;
})
// 计算单关最高可赢
const max_win_money = computed(() => {
  // return 300
  let oddFinally = lodash.get(props, 'item.oddFinally')
  // 串关使用 限额赔率 = 每一个赛事赔率相乘
  let money = BetData.is_bet_single ? oddFinally : ref_data.seriesOdds
  // 常量 精度值（赔率为+万位）
  let number = 100000
  // 最高可赢金额 = 赔率 * 投注金额 - 投注金额 
  let multiply_money = mathJs.subtract(mathJs.multiply(ref_data.money, money, number), mathJs.multiply(ref_data.money, 1, number))
  // 最高可赢金额 / 常量
  let win_money = mathJs.divide(multiply_money, number)
  // 格式化
  return format_currency(win_money)
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

/**   ----------------watch 开始-----------------*/
watch(() => obj_bet_money, (new_) => {
  his.money = new_
})
watch(() => obj_bet_money, (new_) => {
  if (!newVal) { return }
  if (+money.value > +newVal) {
    money.value = newVal
    tips_msg_update(i18n_t('bet_record.bet_amount_betting_limit'))
  }
  max_money.value = +newVal
  min_money.value = +view_ctr_obj[name_].minBet
  if (max_money.value > min_money.value) {
    max_money.value = round_money(min_money.value, newVal)
  } else {
    min_money.value = max_money.value
  }

  max_money_back.value = true;
})
watch(() => money, (new_, old_) => {
  check_moneyok(new_)
  send_money_to_keyboard()

  if (!is_watch.value) { return }

  set_money_total(new_ - old_);

  // 缓存金额到vuex
  set_http_update({
    money_obj: {
      hn_id: hn_id,
      obj: {
        money: new_,
        full_bet: max_money.value == money.value ? 1 : 0
      }
    }
  })
})
// 最大可投注金额返回后，填充常用金额, 或者将最大可投传递给键盘
// 有3种情况会改变这里的值，1 - 接口返回了最高可赢 2 - 5秒计时到了时间  3 - 串关时投注项数量改变时，需要重新获取数据，所有要先设为false
watch(() => max_money_back, (new_) => {
  if (
    get_used_money > 0 &&
    BetData.bet_list.length == 1 &&
    money.value < 0.01 &&
    !BetData.bet_money_total &&
    new_
  ) {
    money.value = (get_used_money > max_money.value ? max_money.value : get_used_money).toString()
  } else {
    send_money_to_keyboard()
  }
})
// 点击投注后当输入金额小于最低限额时，默认转化为最低限额
watch(() => get_money_notok_list2.length, (new_) => {
  if (new_) { return }

  if (money.value < min_money.value && money.value >= 0.01) {
    if (BetData.active_index === -1) {
      //获取最大最小限额
      const tempNew =
        Object
          .keys(view_ctr_obj)
          .map((key) => {
            return {
              minBet: lodash.toNumber(view_ctr_obj[key].minBet),
            }
          })
      money.value = lodash.maxBy(tempNew, (item) => { return item.minBet }).minBet * 1
      
    } else {
      money.value = min_money.value.toString()
    }

    tips_msg_update(i18n_t('bet.err_msg10', [min_money.value]))

    clearTimeout(timer1)
    // 3秒后重置样式
    timer1 = setTimeout(() => {
      tips_msg_update()
    }, 3000);
  }
})
// 多注单项，删除投注项时，需要清空金额
watch(() => BetData.bet_list.length, (newVal, oldVal) => {
  if (newVal < oldVal) {
    money.value = BetData.bet_money_total && view_ctr_obj[name_].money || ''

    is_watch.value = false
    nextTick(() => {
      is_watch.value = true;
    })
  }
})
watch(() => BetData.bet_money_total, (new_) => {
  if (newVal == 0) {
    money.value = ''
    send_money_to_keyboard()
  }
})

/**   ----------------watch 结束-----------------*/

// ...mapMutations(['set_money_total', "set_money_notok_list", "set_keyboard_show", "set_money_notok_list2", "set_active_index", "set_http_update"]),
/**
 *@description 点击删除按钮，清空金额
 *@return {Undefined} undefined
 */
const clear_money = () => {
  money.value = 0
  BetData.set_bet_amount("0")
}
/**
 *@description 格式化后的金额
 *@return {Undefined} undefined
 */
const get_money_format = () => {
  //min_money
  //max_money

  console.error("最小值1111",BetViewDataClass)
  console.error("最小值2222",BetViewDataClass.bet_min_max_money)
  let mi = format_money3(ref_data.min_money)
  let ma = format_money3(ref_data.max_money)
  // console.error('ref_data', ref_data)
  return `${i18n_t('app_h5.bet.limit')} ${mi}~${ma}`
  // return licia_format(i18n_t('bet.money_limit2'), mi, ma);
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
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
const change_money_handle = (new_money) => {
  // if (bet_index != BetData.active_index) { return };
  console.error('ssssaaaa', new_money)
  money.value = new_money
  return
  if (max_money.value < 0.01 && max_money_back.value) {
    if (new_money) {
      money.value = '0.00';
      money_ok.value = false;
      set_money_notok_list({ value: BetData.bet_list[0], status: 1 });
    } else {
      money.value = '';
      money_ok.value = true;
      set_money_notok_list({ value: BetData.bet_list[0], status: 2 });
    }

    return;
  }

  money.value = new_money;
}
/**
 *@description 检查金额是否合适
 *@param {Number} val 金额
 *@return {Undefined} undefined
 */
const check_moneyok = (val) => {
  // 当输入金额超出用户余额时，默认转化为用户余额；并提示“余额不足，已转换为最大可投注金额” 3s消失
  if (+val > +UserCtr.balance) {
    money.value = UserCtr.balance.toString()
    tips_msg_update(i18n_t('bet.err_msg09'))

    clearTimeout(timer4)
    // 3秒后重置样式
    timer4 = setTimeout(() => {
      tips_msg_update('')
    }, 3000);

    return
  }

  // 金额高于最高和低于最低都要记录
  if (
    (val > max_money.value) &&
    (val >= 0.01 || val === '0.00') &&
    max_money_back.value
  ) {
    set_money_notok_list({ value: BetData.bet_list[0], status: 1 })
    money.value = max_money.value.toString()
  }
  else if (
    (val < min_money.value) &&
    (val >= 0.01 || val === '0.00') &&
    max_money_back.value
  ) {
    set_money_notok_list2({ value: BetData.bet_list[0], status: 1 })
  }
  else {
    money_ok.value = true; set_money_notok_list({ value: BetData.bet_list[0], status: 2 });
  }
}
/**
 *@description 金额输入框点击
 *@param {Undefined}
 *@return {Undefined} undefined
 */
const input_click = (evnet) => {
  console.log(99999999)
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
    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
  }
}

// 限额赋值
const set_ref_data_bet_money = () => {
  console.error('限额赋值')
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
  const { min_money = 10, max_money = 8888, seriesOdds } = lodash.get(BetViewDataClass.bet_min_max_money, `${value}`, {})
  // 最小限额
  ref_data.min_money = min_money
  // 最大限额
  ref_data.max_money = max_money
  // 复试串关赔率
  ref_data.seriesOdds = seriesOdds
  // 限额改变 重置投注金额
  ref_data.money = ''
}


onUnmounted(() => {
  // clear_timer()
  mitt_off&&mitt_off()

  // for (const key in $data) {
  //   $data[key] = null
  // }
  // unsubscribe()
})


</script>
<style lang="scss" scoped>
@import url("src/base-h5/css/bet/bet_single_detail.scss");

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
</style>src/core/format/common/module/format-currency.jssrc/output/index.js