<!--

 * @Description: 投注记录，提前结算部分
-->
<template>
    <!-- 专业版单关 未结算 可以提前结算 -->
    <div class="info-wrap" v-if="calc_show">
      <!--提前结算提示语-->
      <div class="bet-pre-title">
        <template v-if="unSuccessTips">
          <span style="color:red">
            <template v-if="bet_pre_code=='0400527'">
              <!--功能暂停中，请稍后再试-->
              {{i18n_t('bet_record.pre_suspend')}}
            </template>
            <template v-else-if="bet_pre_code=='0400537'">
              <!--提前结算金额调整中，请再试一次-->
              {{i18n_t('bet_record.pre_amount_change')}}
            </template>
            <template v-else>
              <!--提前结算申请未通过-->
              {{i18n_t('bet_record.pre_not_approved')}}
            </template>
          </span>
        </template>
        <template v-else>
          <!--提前结算金额已包含本金-->
          <span class="bet-include-money">* {{i18n_t('bet_record.pre_bet_include_money')}}</span>
        </template>
      </div>
      <div class="bet-pre-wrap">
        <!-- 提前结算按钮-->
        <div class="bet-pre-btn" @click="submit_click">
          <!-- 提前结算-->
          <div class="bet-row-1">
            <!-- 提前结算 -->
            <template v-if="status == 1 || status == 6">{{i18n_t("bet_record.settlement_pre")}} </template>
            <!-- 确认提前结算 -->
            <template v-if="status == 2">{{i18n_t("bet_record.confirm_bet_pre")}} </template>
            <!-- 确认中... -->
            <template v-if="status == 3">{{i18n_t("bet_record.confirm")}} </template>
            <!-- 已提前结算 -->
            <template v-if="status == 4">{{i18n_t("bet_record.finish_bet_pre")}} </template>
          </div>
          <div class="bet-row-2" v-if="(Number(front_settle_amount) || expected_profit)">￥{{ betting_amount }}</div>
        </div>
        <img v-if="status == 3" class="roll" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/suring.png`" alt="">
        <img v-if="status == 4" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/success.png`" alt="">
      </div>
    </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue"
import lodash from 'lodash'
import { format_odds, format_currency, formatTime, useMittEmit, useMittOn,  MITT_TYPES, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import { api_betting } from 'src/api/index';

const props = defineProps({
  item: {},
})
// 1 - 初始状态，2 - 确认提前结算， 3 - 确认中..., 4 - 已提前结算, 5 - 暂停提前结算(置灰), 6 - 仅支持全额结算, 7 - 按钮不显示
let status = ref(1)
// 是否展示提前结算
let calc_show = ref(false)
// 提前结算申请未通过提示
let unSuccessTips = ref(false)
let bet_pre_code = ref('')

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
  return pba < min_bet_money ? +min_bet_money : +pba;
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
  calc_show.value = (props.item.seriesType === '1' && props.item.enablePreSettle)
  //  /10true[1-6]+/.test("" + lodash.get(UserCtr.user_info, 'settleSwitch')  + props.item.enablePreSettle + status.value);


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
}

onUnmounted(() => {
  // 清除定时器 和 ws推送
  clear_timer()
  mitt_c201_handle()
  mitt_expected_profit()
})

</script>
<style lang="scss" scoped>
.info-wrap {
  text-align: center;
  .bet-pre-title {
    font-size: 12px;
    line-height: 30px;
    .bet-include-money {
      color: var(--q-gb-bd-c-1)
    }
  }
  .bet-pre-wrap {
    width: 200px;
    height: 38px;
    background: var(--q-gb-bd-c-1);
    border-radius: 50px;
    position: relative;
    cursor: pointer;
    .bet-pre-btn {
      font-size: 12px;
      color: var(--q-gb-t-c-18);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      line-height: 1.2;
      .bet-row-2 {
        margin-left: 6px;
      }
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

@keyframes loading-roll {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }

</style>