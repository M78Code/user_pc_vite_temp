<!--
 * @Description: bw3新版混合过关投注选项
-->
<template>
  <div class="bet-mix-detail half-border-bottom" ref="bet_mix_detail" v-if="index_ == 0 || get_is_spread"
    :class="{ 'bet-mix-detail2': BetData.bet_list.length - 1 == index_ }">
    <div class="content-box2 yb_px14 row items-center">
      <!-- 左 -->
      <div class="content-t">
        <p class="yb_fontsize16">{{ i18n_t(`bet.bet_${value_.id}`) }} X {{ value_.count }}&nbsp;&nbsp;&nbsp;{{ mix_odds
        }}</p>
        <p style="font-size:0.11rem">{{ i18n_t('bet.total_win2') }} <span
            :class="{ 'red-color': !(max_win_money == '0.00' || money_ok), 'yellow-color': money_ok && money }"
            class="yb_fontsize12">&thinsp;{{ format_money2() }}</span></p>
      </div>
      <!-- 右 -->
      <div class="content-b"
        :class="{ 'red-color': !money_ok, 'content-b2': !(BetData.active_index == index_ && [1, 7].includes(+get_bet_status)) }"
        @click="change_kbdshow">
        <span v-if="money" class="yb_fontsize20 money-number">{{ format_money3(money) }}</span>
        <span class="money-span" ref="money_span"
          :class="{ 'money-span2': !(BetData.active_index == index_ && [1, 7].includes(+get_bet_status)) }"></span>
        <span v-if="!money && max_money_back" class="yb_fontsize14 limit-txt">{{ BetData.bet_money_format() }}</span>
        <span @click.stop="clear_money" class="money-close" :style="{ opacity: money > 0 ? '1' : '0' }">x</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// import betting from 'src/project/mixins/betting/betting.js';
// const licia_format = require('licia/format');
// import global_filters from 'src/boot/global-filters.js';
import { ref, onMounted, watch, computed, onUnmounted, nextTick } from 'vue';

import lodash from 'lodash'
import store from "src/store-redux/index.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import BetData from "src/core/bet/class/bet-data-class.js";
import { UserCtr } from "src/output/index.js";
import { format_money2, format_money3 } from 'src/output/index.js'


const money = ref('')  //输入框金额
const money_ok = ref(true)   //金额是否合适
const min_money = ref(1)   //最低投注金额
const max_money = ref(0)   //最高可投金额
const is_watch = ref(true)    //组件渲染时是否监听money，后期再优化
const max_money_back = ref(false)   //最高可赢金额的接口是否有返回(不管成功与失败)
emitters.value = ref({
  emitter_1: useMittOn(MITT_TYPES.EMIT_CHANGE_MONEY, change_money_).off,
})


const store_state = store.getState()
const active_index = ref(store_state.BetData.active_index)
const get_is_spread = ref(store_state.get_is_spread)
const get_s_count_data = ref(store_state.get_s_count_data)
const get_bet_status = ref(store_state.get_bet_status)
const get_order_los = ref(store_state.get_order_los)
const get_money_notok_list2 = ref(store_state.get_money_notok_list2)
const get_menu_type = ref(store_state.get_menu_type)

const unsubscribe = store.subscribe(() => {
  update_state()
})

const update_state = () => {
  const new_state = store.getState()
  BetData.active_index = new_state.BetData.active_index
  get_is_spread.value = new_state.get_is_spread
  get_s_count_data.value = new_state.get_s_count_data
  get_bet_status.value = new_state.get_bet_status
  get_order_los.value = new_state.get_order_los
  get_money_notok_list2.value = new_state.get_money_notok_list2
  get_menu_type.value = new_state.get_menu_type
}


onMounted(() => {

  // 延时器
  timer = null;
  timer2 = null;
  timer3 = null;
  m_timer = null;     // 金额变动计时器
  //获取串关最小投注金额
  if (get_s_count_data.value[index_].money) {
    is_watch.value = false;
    money.value = get_s_count_data.value[index_].money;
    // 同步程序走完后再处理逻辑
    clearTimeout(timer3)
    timer3 = setTimeout(() => {
      is_watch.value = true;
    }, 500)
  }


  // 总金额为0时，初始化设置串关各项的金额为0
  if (+BetData.bet_money_total == 0) {
    money.value = ''
    set_s_money(index_, 0);
  }

  // 第一个自动弹起键盘
  if (index_ == 0) {
    nextTick(() => {
      let ele = $refs.bet_mix_detail
      ele && ele.scrollIntoView({ block: "end" })
    })
  }

  // 5秒后没有金额返回就用默认值
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (!max_money_back.value) {
      max_money.value = 8888;
      // 获取接口返回的串关最小投注金额
      min_money.value = _.get(UserCtr, 'cvo.series.min', 5)
      if (max_money.value < min_money.value) {
        min_money.value = max_money.value
      }

      max_money_back.value = true;
      check_moneyok(money.value)
    }
  }, 5000);

  //只有2个投注项是固定active_index是0
  if (BetData.bet_list.value.length >= 2) {
    set_active_index(0);
  }

  //监听键盘金额改变事件
  useMittOn(MITT_TYPES.EMIT_CHANGE_MONEY, change_money_)

  //将金额和最高可投传递给键盘
  nextTick(() => {
    if (BetData.active_index == index_) {
      useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
    }
  })
  $emit('max-win-money-emit', max_win_money_all)
})


const max_win_money = computed(() => {
  // 获取第一个的赛种id
  let _first = BetData.bet_list.value[0]
  let _first_item = view_ctr_obj
  let _csid = _.get(_first_item, 'bs.csid')
  // console.log(get_s_count_data.value, '--get_s_count_data.value')
  return calc_maxwin_money(value_.name, money.value, _csid) || '0.00';  // 电竞时计算赔率需要保留3位小数
})
const max_win_money_all = computed(() => {
  let all_win_money = 0
  get_s_count_data.value.map((item, i) => {
    if (item.money > 0) {
      let _first = BetData.bet_list.value[i]
      let _first_item = view_ctr_obj[xx]
      let _csid = _.get(_first_item, 'bs.csid')
      all_win_money = all_win_money + calc_maxwin_money(item.name, item.money, _csid) * 100;
    }
  })
  return (all_win_money / 100).toFixed(2);  // 电竞时计算赔率需要保留3位小数
})
const index_obj = computed(() => {
  return get_s_count_data.value[index_]
})
const mix_odds = computed(() => {
  //当前串关赔率
  if (index_obj.odds) {
    let S = index_obj.odds + ''
    if (S.length > 9) {//超过9位数，显示前六位，后面小数点代替
      return '@' + S.substring(0, 6) + '...'
    } else {
      return '@' + S
    }
  } else {
    return ''
  }
})

/**   ----------------watch开始-----------------*/

//点击投注后当输入金额小于最低限额时，默认转化为最低限额
watch(() => get_money_notok_list2.value.length, (new_) => {
  if (new_) { return }

  if (money.value < min_money.value && money.value >= 0.01) {
    money.value = min_money.value.toString()

    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
    tips_msg_update(i18n_t('bet.err_msg10', [min_money.value]))

    clearTimeout(timer2)
    // 提示信息展示3秒
    timer2 = setTimeout(() => {
      tips_msg_update()
    }, 3000);
  }
})
watch(() => BetData.bet_list.value.length, (new_) => {
  money.value = '';

  useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })

  //投注项数量变动时,先将默认限额置空
  max_money_back.value = false

  if (m_timer) {
    clearTimeout(m_timer)
    m_timer = null
  }
  // 5秒后没有金额返回就用默认值
  m_timer = setTimeout(() => {
    if (!max_money_back.value) {
      max_money.value = 8888;
      // 获取接口返回的串关最小投注金额
      min_money.value = _.get(UserCtr, 'cvo.series.min', 5)
      if (max_money.value < min_money.value) {
        min_money.value = max_money.value
      }
      max_money_back.value = true;
      check_moneyok(money.value)
    }
  }, 5000);
})

// 监听金额的变化
watch(() => money.length, (new_, old_) => {
  check_moneyok(new_)

  let calc_money = (new_ - old_) * value_.count;
  if (is_watch.value == true) set_money_total(calc_money);

  let full_bet = max_money.value == money.value ? 1 : 0;
  set_s_money(index_, money.value, full_bet);
  $emit('max-win-money-emit', max_win_money_all)
})

// 监听活动下标的变化
watch(() => BetData.active_index, (new_) => {
  if (new_ == index_) {
    flicker_();
  } else {
    clearInterval(flicker_timer);
    flicker_timer = null;
  }
})

//将金额和最高可投传递给键盘
watch(() => get_money_notok_list2.value.length, (new_, old_) => {
  if (BetData.active_index == index_) {
    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
  }
})

// 监听投注框状态的变化
watch(() => get_bet_status.value, (new_) => {
  if (new_ == 1 && old_ == 2 && get_order_los.value.length) {
    money.value = get_s_count_data.value[index_].money
  }
  // 添加投注状态变化，手动变化金额，定位解决隐藏bug
  if (new_ == 5 || old_ == 5) {
    // 防止投注状态多次发生变化
    set_money_change(money.value)
  }
})

watch(() => index_obj, (new_) => {
  if (
    new_ &&
    (new_.minBet || new_.orderMaxPay) &&
    !max_money_back.value
  ) {
    min_money.value = new_.minBet * 1
    max_money.value = new_.orderMaxPay * 1
    if (max_money.value > min_money.value) {
      max_money.value = round_money(new_.minBet, new_.orderMaxPay)
    } else {
      min_money.value = max_money.value
    }
    max_money_back.value = true
    // 同步程序走完后再检查金额
    nextTick(() => {
      check_moneyok(money.value)
    })
  }
})


/**   ----------------watch结束-----------------*/
// ...mapMutations(["set_active_index", 'set_money_total', "set_money_notok_list", "set_keyboard_show", "set_money_notok_list2"]),

/**
    *@description 点击删除按钮，清空金额
    *@return {Undefined} undefined
    */
const clear_money = () => {
  money.value = 0
  useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
}
//格式化后的金额
const get_money_format = () => {
  let mi = global_filters.format_money3(min_money.value)
  let ma = global_filters.format_money3(max_money.value)
  return licia_format(i18n_t('bet.money_limit2'), mi, ma);
}
const flicker_ = () => {    //光标闪动，animation有兼容问题，用函数替代
  clearInterval(flicker_timer)
  flicker_timer = setInterval(() => {
    let ele = $refs.money_span
    if (ele) {
      ele.classList.toggle('money-span2')
    }
  }, 700);
}
/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
const change_money_ = (new_money) => {
  if (index_ != BetData.active_index) { return };

  if (max_money.value < 0.01 && max_money_back.value) {
    if (new_money) {
      money.value = '0.00';
      money_ok.value = false;
      set_money_notok_list({ value: value_.id, status: 1 });
    } else {
      money.value = '';
      money_ok.value = true;
      set_money_notok_list({ value: value_.id, status: 2 });
    }
    return;
  }

  money.value = new_money;
}
/**
 *@description 设置金额
 *@param {Number} new_money 最新金额值
 */
const set_money_change = (money) => {
  // 手动改变金额的类型，暂时解决投注时赔率发生变化导致投注金额参数丢失问题
  if (typeof (money.value) == 'string') {
    money.value = money - 0
  } else {
    money.value = money + ''
  }
}
/**
 *@description 检查金额是否合适
 *@param {Number} val 金额
 *@return {Undefined} undefined
 */
const check_moneyok = (val) => {
  //当输入金额超出用户余额时，默认转化为用户余额；并提示“余额不足，已转换为最大可投注金额” 3s消失
  if (val > +UserCtr.balance && BetData.bet_list.value.length == 2) {
    money.value = UserCtr.balance.toString()

    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
    tips_msg_update(i18n_t('bet.err_msg09'))

    clearTimeout(timer2)
    // 3秒后取消提示信息
    timer2 = setTimeout(() => {
      tips_msg_update()
    }, 3000);
    return
  }

  if (val > max_money.value && (val >= 0.01 || val === '0.00') && max_money_back.value) {
    set_money_notok_list({ value: value_.id, status: 1 })
    money.value = max_money.value.toString()

    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
  }
  else if (
    val < min_money.value &&
    (val >= 0.01 || val === '0.00') &&
    max_money_back.value
  ) {
    set_money_notok_list2({ value: value_.id, status: 1 })
  }
  else {
    money_ok.value = true; set_money_notok_list({ value: value_.id, status: 2 });
  };

}
//改变键盘显示
const change_kbdshow = () => {
  set_keyboard_show(true)
  if ([4, 5].includes(+get_bet_status.value)) { return };

  set_active_index(index_);

  let ele = $refs.bet_mix_detail
  ele && ele.scrollIntoView({ block: "nearest" })

  //将金额和最高可投传递给键盘
  if (BetData.active_index == index_) {
    // 同步程序走完后再处理逻辑
    nextTick(() => {
      useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
    })
  }
}
// 清除当前组件所有定时器
const clear_timer = () => {
  // timeout定时器列表
  const timeout_timer_arr = [
    'timer',
    'timer2',
    'timer3',
    'm_timer',
  ]

  // interval定时器列表
  const interval_timer_arr = [
    'flicker_timer'
  ]

  // 批量清除timeout定时器
  for (const timer of timeout_timer_arr) {
    clearTimeout(this[timer])
    this[timer] = null
  }

  // 批量清除interval定时器
  for (const timer of interval_timer_arr) {
    clearInterval(this[timer])
    this[timer] = null
  }
}


onUnmounted(() => {
  clear_timer();
  Object.values(emitters.value).map((x) => x())

  for (const key in $data) {
    $data[key] = null
  }

  unsubscribe()
})


</script>
<style lang="scss" scoped>
.bet-mix-detail {
  .content-box2 {
    min-height: 0.56rem;
    position: relative;
  }

  .content-b {
    width: 1.6rem;
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: right;
    border-radius: 4px;
    font-size: 0.16rem;
    overflow: hidden;
    padding-left: 0.1rem;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

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

  /* ************** 左边元素相关样式 ************** -S */
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
      font-size: 0.12rem;
      line-height: 0.14rem;
    }
  }

  /* ************** 左边元素相关样式 ************** -E */
}</style>
