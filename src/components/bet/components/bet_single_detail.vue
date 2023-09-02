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
      <p>{{ $t('bet.bet') }}</p>
      <p>{{ $t('bet.total_win2') }}
        <span :class="{ 'red-color': !(max_win_money == '0.00' || money_ok), 'yellow-color': money_ok && money }">{{
          format_money2(max_win_money) }}</span>
      </p>
    </div>

    <!-- 右 -->
    <div class="content-b"
      :class="{ 'red-color': !money_ok, 'content-b2': !(BetData.active_index === index_ && [1, 7].includes(+get_bet_status)) }"
      @click.stop="input_click">
      <span v-if="money" class="yb_fontsize20 money-number">{{  format_money3(money) }}</span>
      <span class="money-span" ref="money_span"
        :style="{ opacity: BetData.active_index === index_ && [1, 7].includes(+get_bet_status) ? '1' : '0' }"></span>
      <span v-if="!money && max_money_back" class="yb_fontsize14 limit-txt">{{ get_money_format() }}</span>
      <span @click.stop="clear_money" class="money-close" :style="{ opacity: money > 0 ? '1' : '0' }">x</span>
    </div>
  </div>
</template>

<script setup>
// import betting from 'src/project/mixins/betting/betting.js';
import { ref, onMounted,watch,computed,onUnmounted } from 'vue';
import lodash from 'lodash'

import store from "src/store-redux/index.js";
import {useMittOn,useMittEmit,MITT_TYPES} from  "src/core/mitt/"
import { format_money3,format_money2 } from'src\core\format\index.js'
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"

const money = ref('')  //输入框金额
const money_ok = ref(true)   //金额是否合适
const min_money = ref(10)   //最低投注金额
const max_money = ref(0)   //最高可投金额
const is_watch = ref(false)    //组件渲染时是否监听money
const max_money_back = ref(false)   //最高可赢金额的接口是否有返回(不管成功与失败)
const obj_pre_max_money = ref(null) // 单关预约最高可投注金额

const store_state = store.getState()

const get_cur_odd = ref(store_state.get_cur_odd)
const get_bet_status = ref(store_state.get_bet_status)
const get_used_money = ref(store_state.get_used_money)
const get_money_notok_list2 = ref(store_state.get_money_notok_list2)

const unsubscribe = store.subscribe(() => {
  update_state()
})

const update_state = () => {
  const new_state = store.getState()
  get_show_favorite_list.value = new_state.get_show_favorite_list
  get_collapse_map_match.value = new_state.get_collapse_map_match
  get_collapse_csid_map.value = new_state.get_collapse_csid_map
  get_collapse_all_ball.value = new_state.get_collapse_all_ball
  get_curr_sub_menu_type.value = new_state.get_curr_sub_menu_type
  get_current_menu.value = new_state.get_current_menu
  GlobalAccessConfig.value = GlobalAccessConfig.init()
}



onMounted(() => {
  // 延时器
  timer1 = null;
  timer3 = null;
  timer4 = null;
  flicker_timer = null  //光标闪动计时器

  money.value = BetData.bet_money_total && view_ctr_obj[name_].money || ''

  // 同步程序走完后再处理逻辑
  $nextTick(() => {
    is_watch.value = true;
  })

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
  useMittOn(MITT_TYPES.EMIT_CHANGE_MONEY, change_money_handle)
})

/**   ----------------computed 开始-----------------*/

const item_ = computed(() => {
  return view_ctr_obj[name_].bs;
})
// 计算单关最高可赢
const max_win_money = computed(() => {
  let ov = (view_ctr_obj[name_].show_pre ? view_ctr_obj[name_].pre_odds : lodash.get(item_, 'hps[0].hl[0].ol[0].ov')) / 100000
  return compute_money_by_cur_odd_type(ov, null, lodash.get(item_, 'hps[0].hsw'), money.value, item_.csid)
})
// 转化过后的坑位id
const hn_id = computed(() => {
  return BetData.bet_list[index_]
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
      $nextTick(() => {
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
  }
  /**
   *@description 格式化后的金额
   *@return {Undefined} undefined
   */
  const get_money_format = () => {
    let mi = global_filters.format_money3(min_money.value)
    let ma = global_filters.format_money3(max_money.value)
    return licia_format(i18n_t('bet.money_limit2'), mi, ma);
  }
  /**
   *@description 光标闪动，animation有兼容问题，用函数替代
   *@return {Undefined} undefined
   */
  const cursor_flashing = () => {
    clearInterval(flicker_timer)
    flicker_timer = setInterval(() => {
      $refs.money_span && $refs.money_span.classList.toggle('money-span3')
    }, 700);
  }
  /**
   *@description 金额改变事件
   *@param {Number} new_money 最新金额值
   */
  const change_money_handle = (new_money) => {
    if (index_ != BetData.active_index) { return };

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
    event.preventDefault()
    set_keyboard_show(true)

    if ([4, 5].includes(+get_bet_status)) { return };

    set_active_index(index_);

    let ele = $refs.bet_single_detail
    ele && ele.scrollIntoView({ block: "nearest" })

    send_money_to_keyboard()
  }
  // 将当前活动项的金额和最高可投金额传递给键盘
  const send_money_to_keyboard = () => {
    if (BetData.active_index == index_) {
      useMittEmit(MITT_TYPES.EMIT_SEND_VALUE, { money: money.value, max_money: max_money.value })
    }
  }



  onUnmounted(() => {
    clear_timer()

    useMittOn(MITT_TYPES.EMIT_CHANGE_MONEY, change_money_).off;

    for (const key in $data) {
      $data[key] = null
    }
    unsubscribe()
  })


</script>
<style lang="scss" scoped>
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
</style>
