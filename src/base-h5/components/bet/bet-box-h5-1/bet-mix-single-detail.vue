<!--
 * @Author: Iverson
 * @Description: 处理单关多项输入框
-->
<template>
  <div class="bet_mix_single_detail" ref="bet_mix_detail">
    <div class="locked-shadow" v-if="has_pre"></div>
    <div class="content-box2 yb_px14 row items-center">
      <!-- 左 -->
      <div class="content-t">
        <p class="yb_fontsize16 black-color">{{ i18n_t('bet.single_more') }}</p>
 
        <p style="font-size:0.11rem">{{ i18n_t('bet.total_win2') }} <span
            :class="{ 'red-color': !(max_win_money == '0.00' || money_ok), 'yellow-color': money_ok && money }"
            class="yb_fontsize12">&thinsp;{{  format_money2(four_five_six_double(max_win_money) ) }}</span></p>
      </div>
      <!-- 右 -->
      <div class="content-b"
        :class="{ 'red-color': !money_ok, 'content-b2': !(BetData.active_index == index_ && [1, 7].includes(+get_bet_status)) }"
        @click="change_kbdshow">
        <span class="intro-other yb_fontsize16">{{ BetData.bet_list.length }}&nbsp;X</span>
        <span v-if="money" class="yb_fontsize20 money-number">{{  format_money3(money) }}</span>
        <span class="money-span" ref="money_span"
          :class="{ 'money-span2': !(BetData.active_index == index_ && [1, 7].includes(+get_bet_status)) }"></span>
        <span v-if="!money && max_money_back" class="yb_fontsize14 limit-txt">{{ BetData.bet_money_format() }}</span>
        <span @click.stop="clear_money" class="money-close" :style="{ opacity: money > 0 ? '1' : '0' }">x</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import betting from 'src/core/bet/common-helper/index.js';
// const licia_format = require('licia/format');
import BetData from "src/core/bet/class/bet-data-class.js";
import { format_money3,format_money2 } from 'src/output/index.js'
import { nextTick } from "vue"

const money = ref('')  //输入框金额
const money_ok = ref(true)   //金额是否合适
const min_money = ref(1)   //最低投注金额
// const ax_money = 0   //最高可投金额
const is_watch = ref(true)    //组件渲染时是否监听money，后期再优化
const max_money_back = ref(false)   //最高可赢金额的接口是否有返回(不管成功与失败)
const index_ = ref(-1)//光标默认索引

const store_state = store.getState()

const get_s_count_data = ref(store_state.get_s_count_data)
const get_bet_status = ref(store_state.get_bet_status)
const get_order_los = ref(store_state.get_order_los)
const get_money_notok_list2 = ref(store_state.get_money_notok_list2)
const get_menu_type = ref(store_state.get_menu_type)

const update_state = () => {
  const new_state = store.getState()
  get_s_count_data.value = new_state.get_s_count_data
  get_bet_status.value = new_state.get_bet_status
  get_order_los.value = new_state.get_order_los
  get_money_notok_list2.value = new_state.get_money_notok_list2
  get_menu_type.value = new_state.get_menu_type
}

const unsubscribe = store.subscribe(() => {
  update_state()
})


/**   ----------------computed 开始-----------------*/
const has_pre = computed(() => {
  const item_name = _.findKey(view_ctr_obj, function (o) { return o.show_pre })
  if (item_name) {
    return true
  } else {
    return false
  }
})

const max_win_money = computed(() => {
  let max_win = 0

  Object.keys(_item).map((key) => {
    let vl =
      compute_money_by_cur_odd_type(
        _.get(_item[key], 'bs.hps[0].hl[0].ol[0].ov') / 100000,
        null,
        _item[key].bs.hps[0].hsw,
        money.value,
        _item[key].bs.csid
      )

    max_win += vl * 10000
  })

  return max_win / 10000
})
const _item = computed(() => {
  return view_ctr_obj
})
/**   ----------------computed 结束-----------------*/

/**   ----------------watch 开始-----------------*/

watch(() => _item, (new_) => {
  if (new_) {
    let num = 0
    //获取最大最小限额
    const tempNew = Object
      .keys(new_)
      .map((key) => {
        if (!new_[key].orderMaxPay) {
          num++
        }

        return {
          minBet: _.toNumber(new_[key].minBet),
          maxBet: _.toNumber(new_[key].orderMaxPay),
          money: new_[key].money
        }
      })

    change_others_money_(tempNew)

    if (num > 0) {
      return
    }
    // 最低可投注金额取每个投注框最低可投注金额中的最大值，
    // 最高可投注金额取每个投注框最高可投注金额中的最小值
    min_money.value = _.maxBy(tempNew, (item) => { return item.minBet }).minBet * 1
    max_money = _.minBy(tempNew, (item) => { return item.maxBet }).maxBet * 1

    if (max_money > min_money.value) {
      max_money = round_money(min_money.value, max_money)
    } else {
      min_money.value = max_money
    }

    if (!max_money) {
      max_money = 8888
    }

    max_money_back.value = true
  }
})
//点击投注后当输入金额小于最低限额时，默认转化为最低限额
watch(() => money, (new_) => {
  if (BetData.active_index == index_.value) {
    if (new_) { return }

    if (money.value < min_money.value && money.value >= 0.01) {
      money.value = min_money.value.toString()

      useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money })
      tips_msg_update(i18n_t('bet.err_msg10', [min_money.value]))

      clearTimeout(timer2)
      // 提示信息展示3秒
      timer2 = setTimeout(() => {
        tips_msg_update()
      }, 3000);
    }
  }

})
// 监听金额的变化
watch(() => BetData.active_index, (new_) => {
  if (BetData.active_index != index_.value) {
    return
  }

  check_moneyok(new_)

  if (BetData.active_index == index_.value) {
    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money })
  }

  if (!is_watch.value) { return }

  // 缓存金额到vuex
  let temp_bet_obj = _.cloneDeep(view_ctr_obj)
  Object.keys(temp_bet_obj).map((key) => {
    temp_bet_obj[key].money = money.value
    temp_bet_obj[key].full_bet = view_ctr_obj[key].max_money == money.value ? 1 : 0
  })
  set_bet_obj(temp_bet_obj)
})
//将金额和最高可投传递给键盘
watch(() => BetData.active_index, (new_) => {
  if (BetData.active_index == index_.value) {
    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money })
  }
})

/**   ----------------watch 结束-----------------*/


/**   ----------------onMounted 开始-----------------*/

onMounted(() => {
  timer = null  // 计时器
  timer2 = null  // 计时器2
  flicker_timer = undefined     //光标闪动计时器
  const newArr = []
  Object.keys(view_ctr_obj).map((key) => {
    newArr.push(view_ctr_obj[key].money)
  })

  let rst = newArr.every(item => newArr.every(it => it == item ? true : false))
  if (rst) {
    money.value = newArr.length > 0 && (newArr[0] || '')
  }

  // 5秒后没有限额金额返回就用默认值
  timer = setTimeout(() => {
    if (!max_money_back.value) {
      max_money = 8888;
      // 获取接口返回的单关最小投注金额
      min_money.value = _.get(UserCtr, 'cvo.single.min', 10)

      if (max_money < min_money.value) {
        min_money.value = max_money
      }

      max_money_back.value = true;
    }
  }, 5000);

  //投注项大于1时，光标聚焦到多项单关输入框
  if (BetData.bet_list.value.length > 1 && !has_pre) {
    set_active_index(-1);
  }

  if (BetData.active_index === index_.value) {
    flicker_();
  }

  //监听键盘金额改变事件
  useMittOn(MITT_TYPES.EMIT_CHANGE_MONEY, change_money_)

  //将金额和最高可投传递给键盘
  nextTick(() => {
    if (BetData.active_index == index_.value) {
      useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money })
    }
  })
})
/**   ----------------onMounted 结束-----------------*/
// ...mapMutations(["set_active_index", "set_bet_obj", "set_money_notok_list", "set_keyboard_show", "set_money_notok_list2"]),

/**
     *@description 点击删除按钮，清空金额
     *@return {Undefined} undefined
     */
const clear_money = () => {
  money.value = 0
}
//格式化后的金额
const get_money_format = () => {
  let mi = global_filters.format_money3(min_money.value)
  let ma = global_filters.format_money3(max_money)
  // return licia_format(i18n_t('bet.money_limit2'), mi, ma);
}
const flicker_ = () => {    //光标闪动，animation有兼容问题，用函数替代
  flicker_timer = setInterval(() => {
    let ele = $refs.money_span

    if (ele) {
      ele.classList.toggle('money-span3')
    }
  }, 700);
}
//判断单关输入金额是否一致，并处理
const change_others_money_ = () => {
  const newArr = []
  Object.keys(view_ctr_obj).map((key) => {
    newArr.push(view_ctr_obj[key].money)
  })
  //判断每个投注项输入框的金额是否一致
  let rst = newArr.every(item => newArr.every(it => it == item ? true : false))

  if (rst) {
    money.value = newArr.length > 0 && (newArr[0] || '') || ''
  } else {
    money.value = ''
  }
}
/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
const change_money_ = (new_money) => {
  if (index_.value != BetData.active_index) { return };

  if (max_money < 0.01 && max_money_back.value) {
    if (new_money) {
      money.value = '0.00';
      money_ok.value = false;
      set_money_notok_list({ value: BetData.bet_list.value[0], status: 1 });
    } else {
      money.value = '';
      money_ok.value = true;
      set_money_notok_list({ value: BetData.bet_list.value[0], status: 2 });
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
  //当输入金额超出用户余额时，默认转化为用户余额；并提示“余额不足，已转换为最大可投注金额” 3s消失
  if (val > +UserCtr.balance) {
    money.value = UserCtr.balance.toString()

    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money })

    tips_msg = i18n_t('bet.err_msg09')

    clearTimeout(timer2)
    // 3秒后取消提示信息
    timer2 = setTimeout(() => {
      tips_msg = ''
    }, 3000);

    return
  }

  if (
    val > max_money &&
    (val >= 0.01 || val === '0.00') &&
    max_money_back.value
  ) {
    set_money_notok_list({ value: BetData.bet_list.value[0], status: 1 })
    money.value = max_money.toString()
    useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money })
  }
  else if (
    val < min_money.value &&
    (val >= 0.01 || val === '0.00') &&
    max_money_back.value
  ) {
    set_money_notok_list2({ value: BetData.bet_list.value[0], status: 1 })
  }
  else {
    money_ok.value = true;
    set_money_notok_list({ value: BetData.bet_list.value[0], status: 2 });
  };

}
//改变键盘显示
const change_kbdshow = () => {
  set_keyboard_show(true)

  if ([4, 5].includes(+get_bet_status.value)) { return };

  set_active_index(index_.value);

  let ele = $refs.bet_mix_detail

  ele && ele.scrollIntoView({ block: "nearest" })

  //将金额和最高可投传递给键盘
  if (BetData.active_index == index_.value) {
    // 同步程序走完后再处理逻辑
    nextTick(() => {
      useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money })
    })
  }
}
// 清除当前组件所有定时器
const clear_timer = () => {
  // timeout定时器列表
  const timeout_timer_arr = [
    'timer',
    'timer2',
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
  unsubscribe()
})

</script>
<style scoped lang="scss">
.bet_mix_single_detail {
  /* ************** 失效蒙层 ************** -S */
  position: relative;

  .locked-shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
  }

  /* ************** 失效蒙层 ************** -E */
  .content-box2 {
    margin-top: 0.06rem;
    min-height: 0.56rem;
    position: relative;
  }

  /* ************** 左边内容 ************** -S */
  .content-b {
    width: 1.6rem;
    height: 0.4rem;
    border-radius: 4px;
    font-size: 0.16rem;
    padding-left: 0.1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .intro-other {
      position: absolute;
      left: -0.33rem;
    }
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
      font-weight: 500;

      &::after {
        content: '';
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
  .content-m {
    min-width: 0.4rem;
    text-align: right;
  }

  .content-t2 {
    position: relative;
  }
}
</style>