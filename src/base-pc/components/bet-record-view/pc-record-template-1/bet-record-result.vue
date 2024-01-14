<!--

 * @Description: 投注记录，投注结果部分
-->
<template>
  <div>
    <div class="row">
      <div style="display: none;">{{ BetRecordLeft.bet_record_version }}</div>
      <div class="col bet-money">
        {{i18n_t('common.bets_val')}}
        <!-- 投注额 -->
      </div>
      <div class="col-auto bet-money">
        <!--最高可赢-->
        <template v-if="[0,2].includes(BetRecordLeft.selected)">{{i18n_t('common.maxn_amount_val')}}</template>
        <!--返还金额-->
        <template v-if="BetRecordLeft.selected==1">{{i18n_t('common.donate_win')}}</template>
        <!-- 可赢额 -->
      </div>
    </div>
    <div class="row bet-win-input">
      <div class="col bet-value">
       {{ format_currency(item.orderAmountTotal) }}
      </div>
      <!-- <div class="col-auto bet-value" :class="{'red-text':(item.outcome=='4' || item.outcome=='5')}"> -->
      <div class="col-auto bet-value red-text">
        <template v-if="[0,2].includes(BetRecordLeft.selected)">
          {{  format_currency(item.maxWinAmount) }}
        </template>
        <template v-if="BetRecordLeft.selected==1">
          {{ format_currency(item.backAmount) }}
        </template>
      </div>
    </div>
    <template v-if="item.addition!= '0.00'">
      <div class="row bet-win-money yb-fontsize12">
        <div class="col">
          <div class="bet-addition">
            [{{item.addition}}]
          </div>
        </div>
        <!--¥300.00-->
        <div class="col-auto"></div>
      </div>
    </template>
    <!-- 专业版单关 未结算 可以提前结算 -->
    <bet-early-settle v-if="BetRecordLeft.selected == 0" :item="item"></bet-early-settle>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue"
import lodash from 'lodash'
import { format_odds, format_currency, formatTime, useMittEmit, useMittOn,  MITT_TYPES, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import  BetRecordLeft  from "src/core/bet-record/pc/bet-record-left.js"
import betEarlySettle from "src/base-pc/components/bet-record/record-table/bet-early-settle.vue"

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  item: {},
  order: {},
})

const toast = ref(false)

const ref_data = reactive({
 bet_pre_code: 0, // 提前结算编码 0 未结算 1 结算成功 其他结算失败 0400524(提示结算为通过审核) 0400500(按钮置灰)
 amount: 1.00, // 按钮上的显示金额
 cur_bet_pre: {},
 more_index: -1,//查看更多按钮index
})


// 1 - 初始状态，2 - 确认提前结算， 3 - 确认中..., 4 - 已提前结算, 5 - 暂停提前结算(置灰), 6 - 仅支持全额结算, 7 - 按钮不显示
let status = ref(1)
// 是否展示提前结算
let calc_show = ref(false)
// 提前结算申请未通过提示
let unSuccessTips = ref(false)
let bet_pre_code = ref('')
// 滑块是否显示
let slider_show = ref(false)
// 0  100
let percentage = ref(100)
// 接口返回的正在确认中的金额，当 [2, 3, 4, 6] 4种情况时，也用于赋值锁定金额
let front_settle_amount = ref('')
// 根据轮询获取的最新预计返还金额
let expected_profit = ref(0)
// 工具方法
// let utils = ref(utils)
// 接口调用次数计数 // 概率，用于计算钮下的预计返还（盈利），注意，查询订单记录接口是直接返回的金额，而ws推送返回的是概率，所以概率更新了需要重新计算钮下的预计返还（盈利）
// 延时器
let timer = null
let timer2 = null
let timer3 = null
let timer4 = null

let mitt_c201_handle = null
let mitt_expected_profit = null


const betting_amount = computed(() => {
  let bet_amount;
  // 提前结算应先取接口返回利率
  if (status.value == 1) {
    bet_amount = Number(expected_profit.value || front_settle_amount.value)
  } else {
    bet_amount = Number(front_settle_amount.value || expected_profit.value)
  }
  return bet_amount.toFixed(2)
})
/**
 * 是否仅支持全额结算
 */
const is_only_fullbet = computed(() => {
  return props.item.preSettleBetAmount != null && props.item.preSettleBetAmount <= min_bet_money && expected_profit.value >= 1
})

// 提前结算投注额,四舍五入取整
const cashout_stake = computed(() => {
  let pba = props.item.preSettleBetAmount || 0
  let _money = Math.round(pba * (percentage.value / 100));
  if (percentage.value == 100) {
    _money = pba;
  }
  if (pba > min_bet_money) {
    return _money < min_bet_money ? +min_bet_money : +_money;
  } else {
    return _money
  }
})

// 单关最低投注金额
const min_bet_money = computed(() => {
  return lodash.get(UserCtr, "cvo.single.min") || 10;
})

watch(() => expected_profit.value, (_new, _old) => {
  // 小于 1 时暂停提前结算
  if (_new < 1) {
    status.value = 5;
  }
  // 这4种情况时，不接受按钮中的金额变动
  let flag = [2, 3, 4, 6].includes(status.value)
  if (flag && !front_settle_amount.value) {
    front_settle_amount.value = _old
  }
})

onMounted(() => {
  // 计算提前结算按钮是否显示
  calc_show.value = (BetRecordLeft.selected === 0 && props.item.seriesType === '1' && props.item.enablePreSettle)
  //  /10true[1-6]+/.test("" + lodash.get(UserCtr.user_info, 'settleSwitch') + BetRecordLeft.selected + props.item.enablePreSettle + status.value);


  if (is_only_fullbet.value) {
    // 剩余的金额小于最低限额时，只支持全额结算
    status.value = 6;
  }
  /**
   * 监听轮询提前结算列表数据
   * 给expected_profit赋值
   */
  mitt_expected_profit = useMittOn(MITT_TYPES.EMIT_EARLY_MONEY_LIST_CHANGE, (early_money_list_data) => {
    // 如果early_money_list_data为null, 隐藏提前结算按钮
    if(!early_money_list_data) {
      calc_show.value = false
      return
    }
    // 当前单号
    const moneyData = lodash.find(early_money_list_data, (item) => {
      return props.item.orderNo == item.orderNo
    })
    // 如果没有当前单号
    // if(!moneyData) {
    //   calc_show.value = false
    //   return
    // }
    // 有当前单号
    // calc_show.value = true
    let _maxCashout = props.item.maxCashout
    if (moneyData && moneyData.orderStatus === 0) {
      if (moneyData.preSettleMaxWin !=  props.item.maxCashout) {
        _maxCashout = moneyData.preSettleMaxWin
      }
    }
    let _percentage = cashout_stake.value / parseInt(props.item.preSettleBetAmount)
    //四舍五入至小数点第二位
    expected_profit.value =  Math.round(_maxCashout * _percentage * 100) / 100
  }).off;

  // 处理ws订单状态推送
  mitt_c201_handle = useMittOn(MITT_TYPES.EMIT_C201_HANDLE_BET_RECORD, c201_handle).off;
})
onUnmounted(() => {
  // 清除定时器 和 ws推送
  clear_timer()
  mitt_c201_handle()
  mitt_expected_profit()
})

// ...mapMutations(["set_toast","set_early_moey_data"]),
/**
 *@description 处理ws订单状态推送
 *@param {Object} · orderNo - 订单号, orderStatus - 订单状态
 */
const c201_handle = ({ orderNo, orderStatus }) => {
  if (props.item.orderNo == orderNo) {
    if (orderStatus == 1) {
      // 成功
      status.value = 4;
    } else if (orderStatus == 2) {
      // 失败
      // 提示未通过
      showUnSuccessTips()
      status.value = 1;
    }
  }
  // console.log("qwe", orderStatus, orderNo);
}

/**
 *@description 滑块是否显示
 */
const change_slider_show = () => {
  if (status.value == 5 || status.value == 6) return;
  slider_show = !slider_show;
}
/**
 *@description 改变滑块百分比
 *@param {Number} val 滑块值
 */
const change_percentage = (val) => {
  front_settle_amount.value = ''
  percentage.value = val;
}

/**
 *@description 提前结算提交事件
 */
const submit_early_settle = () => {
  if (cashout_stake.value < 0.01) return;
  status.value = 3;
  unSuccessTips.value = false
  bet_pre_code.value = ''
  let params = {
    // 订单号
    orderNo: props.item.orderNo,
    // 结算金额
    settleAmount: cashout_stake.value,
    // 结算设备类型 1:H5（默认），2：PC，3:Android，4:IOS
    deviceType: 2,
    // 预计返还（盈利）
    frontSettleAmount: String(front_settle_amount.value || expected_profit.value),
  };
  // 响应码【0000000 成功（仅在测试模式出现） | 0400524 确认中（仅在非测试模式出现）| 0400500 提交申请失败，提示message信息】
  api_betting.post_pre_bet_order(params).then((reslut) => {
    let res = reslut.status ? reslut.data : reslut
    if (res.code == 200) {
      status.value = 4;
    } else if (res.code == "0400524") {
      // 注单确认中···
      // 等到ws推送，c201_handle处理后续注单状态
    } else if (res.code == "0400527") {
      // 不支持提前结算或者暂停
      status.value = 5;
      bet_pre_code.value = '0400527'
    } else if (res.code == "0400537") {
      // 金额有变动，需要更新按钮上的金额
      status.value = 1;
      bet_pre_code.value = '0400537'
      let money = res.data
      if (+money > 0) {
        nextTick(() => {
          front_settle_amount.value = money
        })
      }
    } else {
      // 提前结算申请未通过
      status.value = 1;
      // 提示未通过
      showUnSuccessTips()
    }
  }).catch((err) => {
    // 提前结算申请未通过
    status.value = 1;
    // 提示未通过
    showUnSuccessTips()
  });
}
/**
 *@description 橙色大按钮点击处理
 */
const submit_click = () => {
  if (status.value == 1 || status.value == 6) {
    slider_show = false;
    status.value = 2;
    // 提示5秒后消失
    clearTimeout(timer);
    timer = setTimeout(() => {
      status.value = is_only_fullbet.value ? 6 : 1;
    }, 5000);
  } else if (status.value == 2) {
    clearTimeout(timer);
    timer = null;
    submit_early_settle();
  }
}

/**
 * 提前结算申请未通过的提示
 * 5s后消失
 */
const showUnSuccessTips = () => {
  unSuccessTips.value = true
  timer2 = setTimeout(() => {
    unSuccessTips.value = false
  }, 5000);
}

// 批量清除定时器
const clear_timer = () => {
  clearTimeout(timer)
  clearTimeout(timer2)
  clearTimeout(timer3)
  clearTimeout(timer4)
}

</script>
<style lang="scss" scoped>
.pt10 {
  padding-top: 10px;
}
.mt0 {
  margin-top: 0;
}
.info-wrap {
  text-align: center;
  .bet-pre-title {
    font-size: 12px;
    line-height: 30px;
  }
  .bet-pre-wrap {
    width: 200px;
    height: 38px;
    background: var(--q-gb-bg-c-4);
    border-radius: 50px;
    position: relative;
    .bet-pre-btn {
      font-size: 12px;
      color: var(--q-gb-t-c-18);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      line-height: 1.2;
    }
    img {
      position: absolute;
      right: 14px;
      top: 10px;
      height: 18px;
      width: 18px;
      &.roll {
        animation: .5s loading-roll infinite linear
      }
    }
  }
}
.toast {
  position: fixed;
  top: 50%;
  left: 110px;
  padding: 0 20px;
  height: 36px;
  border-radius: 2px;
  text-align: center;
  line-height: 36px;
  transform: translate(-50%, -50%);
  z-index: 3;
}
.bet-pre-stop-tip{
  text-align: center;
  color: #f00;
  margin-right: 15px;
  padding: 10px 0 0px 0;
}

@keyframes loading-roll {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }

</style>