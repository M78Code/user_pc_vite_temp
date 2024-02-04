<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <!-- 提前兑换按钮 -->
  <div class="early-settle" v-if="calc_show">
    <div class="early-tips row">
      <p>{{ i18n_t('early.info1') }}</p>
      <span v-if="status == 2 || status == 3">{{ i18n_t('early.info3') }}</span>
    </div>
    <div class="early-button">
      <button @click="submit_click" :class="{'confirm': status == 2 || status == 3, 'success': status == 4}">
        <span>
          <!-- 暂停提前结算 -->
          <!-- <template v-if="status == 5">{{ i18n_t('early.btn1') }} </template> -->
          <!-- 提前结算 -->
          <template v-if="status == 1">{{ i18n_t('early.btn2') }}</template>
          <!-- 确认提前结算 -->
          <template v-if="status == 2">{{ i18n_t('early.btn3') }}</template>
          <!-- 确认中... -->
          <template v-if="status == 3">{{ i18n_t('early.btn4') }}</template>
          <!-- 已提前结算 -->
          <template v-if="status == 4">{{ i18n_t('early.btn5') }}</template>
          <!-- 按钮上的金额 -->
          <i v-if="(Number(front_settle_amount) || expected_profit)" class="amount">{{ betting_amount }}</i>
        </span>
        <!-- loading -->
        <img class="load" v-if="status == 3" :src="compute_local_project_file_path('/image/gif/loding.gif')">
        <icon-wapper v-if="status == 4" name="icon-success" />
      </button>
    </div>
  </div>
</template>

<script setup>
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import { api_betting } from "src/api/index.js"
import { inject, ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import lodash from 'lodash'
import { compute_css_obj, compute_local_project_file_path } from 'src/output/index.js'
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"
import { i18n_t } from "src/boot/i18n.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { IconWapper } from 'src/components/icon'
import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
const { PROJECT_NAME,IS_FOR_NEIBU_TEST } = BUILD_VERSION_CONFIG;
import math_js from "src/core/bet/common/mathjs.js"

const props = defineProps({
  item_data: {
    type: Object
  }
})
// 1 - 初始状态，2 - 确认提前结算， 3 - 确认中..., 4 - 已提前结算, 5 - 暂停提前结算(置灰), 6 - 仅支持全额结算, 7 - 按钮不显示
let status = ref(1)
// 是否展示提前结算
let calc_show = ref(false)
// 是否已经成功发生过提前结算
let has_early_settled = ref(false)
// 滑块是否显示
let slider_show = ref(false)
// 0  100
let percentage = ref(100)
// 0-提前结算金额已包含本金  1-提前结算申请未通过  2-功能暂停中，请稍后再试  3-提前结算金额调整中，请再试一次
let tips = ref(0)
// orderVOS 里面的第一条数据，只考虑单关
let ordervos_ = null
// 接口返回的正在确认中的金额，当 [2, 3, 4, 6] 4种情况时，也用于赋值锁定金额
let front_settle_amount = ref('')
// 预计返还（盈利）
let expected_profit = ref(0)
// 结算金额
let cashout_stake = ref(0)
// 工具方法
// let utils = ref(utils)
// 接口调用次数计数 // 概率，用于计算钮下的预计返还（盈利），注意，查询订单记录接口是直接返回的金额，而ws推送返回的是概率，所以概率更新了需要重新计算钮下的预计返还（盈利）
// 延时器
let timer = null

let mitt_c201_handle = null
let mitt_c210_handle = null
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


watch(() => expected_profit.value, (_new, _old) => {
  // 小于 1 时暂停提前结算
  // if (_new < 1) {
  //   status.value = 5;
  // }
  // 这4种情况时，不接受按钮中的金额变动
  let flag = [2, 3, 4, 6].includes(status.value)
  if (flag && !front_settle_amount.value) {
    front_settle_amount.value = _old
  }
})

onMounted(() => {
  // 计算提前结算按钮是否显示
  // calc_show.value = (BetRecordClass.selected === 0 && props.item_data.seriesType === '1' && props.item_data.enablePreSettle)
  //  /10true[1-6]+/.test("" + lodash.get(UserCtr.user_info, 'settleSwitch') + BetRecordClass.selected + props.item_data.enablePreSettle + status.value);

  // 接口：当 enablePreSettle=true && hs = 0  提前结算显示高亮， 当 enablePreSettle=true && hs != 0  显示置灰， 当 enablePreSettle=false 不显示
  // ordervos_ = lodash.get(props.item_data, "orderVOS[0]", {});
  // if (ordervos_.hs != 0) {
  //   status.value = 5;
  // }

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
      return props.item_data.orderNo == item.orderNo
    })
    // 如果没有当前单号并没有提前结算
    // 提前结算成功的一直显示
    if(!moneyData && !has_early_settled.value) {
      calc_show.value = false
      return
    }
    // 有当前单号
    calc_show.value = true

    // 预计返还（盈利）
    expected_profit.value =  moneyData.preSettleMaxWin
    
    // 结算金额(投注金额 - 已结算金额)
    let preBetAmount = moneyData.preBetAmount || 0
    cashout_stake.value = math_js.subtract(moneyData.betAmount, preBetAmount)
  }).off;
 
  // 处理ws订单状态推送
  mitt_c201_handle = useMittOn(MITT_TYPES.EMIT_C201_HANDLE_BET_RECORD, c201_handle).off;
})
onUnmounted(() => {
  // 清除定时器 和 ws推送
  clearTimeout(timer)
  mitt_c201_handle()
  // mitt_c210_handle()
  mitt_expected_profit()
})

// ...mapMutations(["set_toast","set_early_moey_data"]),
/**
 *@description 处理ws订单状态推送
 *@param {Object} · orderNo - 订单号, orderStatus - 提前结算状态  1:通过  2:拒绝
 */
const c201_handle = ({ orderNo, orderStatus }) => {
  if (props.item_data.orderNo == orderNo && status.value == 3) {
    if (orderStatus == 1) {
      // 成功
      status.value = 4;
      // 发生过提前结算
      has_early_settled.value = true
    } else if (orderStatus == 2) {
      // 失败
      status.value = 1;
      // 提前结算申请未通过
      useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('early.info2'))
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
  status.value = 3;
  let params = {
    // 订单号
    orderNo: props.item_data.orderNo,
    // 结算金额
    settleAmount: cashout_stake.value,
    // 结算设备类型 1:H5（默认），2：PC，3:Android，4:IOS
    deviceType: 1,
    // 预计返还（盈利）
    frontSettleAmount: String(front_settle_amount.value || expected_profit.value),
  };
  let message = ''
  // 响应码【0000000 成功（仅在测试模式出现） | 0400524 确认中（仅在非测试模式出现）| 0400500 提交申请失败，提示msg信息】
  api_betting.post_pre_bet_order(params).then((reslut) => {
    let res = reslut.status ? reslut.data : reslut
    if (res.code == 200) {
      status.value = 4;
      // 发生过提前结算
      has_early_settled.value = true
    } else if (res.code == "0400524") {
      // 注单确认中···  等ws推送
    } else if (res.code == "0400527") {
      // 不支持提前结算或者暂停
      message = i18n_t('early.btn1');
      // status.value = 5;
    } else if (res.code == "0400537") {
      // 金额有变动，需要更新按钮上的金额
      status.value = 1;
      message = i18n_t('early.info7');
      let money = res.data
      if (+money > 0) {
        nextTick(() => {
          front_settle_amount.value = money
        })
      }
    } else {
      // 提前结算申请未通过
      status.value = 1;
      message = i18n_t('early.info2');
    }
    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, message)
  }).catch((err) => {
    // 提前结算申请未通过
    status.value = 1;
    message = i18n_t('early.info2');
    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, message)
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
      status.value = 1;
    }, 5000);
  } else if (status.value == 2) {
    clearTimeout(timer);
    timer = null;
    submit_early_settle();
  }
}

</script>
<style lang="scss" scoped>
template {
  display: block;
}
.early-settle {
  .early-tips {
    justify-content: space-between;
    padding: 0 0.14rem;
    margin: 0.1rem 0;
    p {
      color: var(--q-gb-bg-c-14);
    }
    span {
      color: var(--q-gb-bg-c-1);
    }
  }
  .early-button {
    padding: 0 0.14rem;
    margin-bottom: 0.1rem;
    button {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: var(--q-gb-bg-c-7);
      border: 1px solid var(--q-gb-bg-c-1);
      width: 100%;
      height: 0.46rem;
      line-height: 0.46rem;
      font-size: 0.18rem;
      border-radius: 0.5rem;
      position: relative;
      &.confirm {
        background-color: var(--q-gb-bg-c-1);
        color: #fff;
        i.amount {
          color: #fff;
        }
      }
      &.success {
        background-color: var(--q-gb-bg-c-5);
        color: var(--q-gb-bg-c-2);
        border-color: var(--q-gb-bg-c-5);
        span{
          color: var(--q-gb-bg-c-13);
        }
        i.amount {
          color: var(--q-gb-bg-c-1);
        }
      }
      i.amount {
        color: var(--q-gb-bg-c-1);
        margin-left: 0.16rem;
      }
      img.load {
        width: 0.26rem;
        height: auto;
        margin-left: 0.04rem;
      }
      
    }
  }
  .slider-wrap {
    margin: 0 0.14rem;
    padding-top: 0.2rem;
  }
  .change-btn {
    font-size: 0.16rem;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      margin-right: 0.1rem;
    }
    img {
      width: 0.2rem;
    }
    &.down span {
      padding-top: 0.04rem;
    }
    &.down img {
        transform: rotate(-90deg);
      }
    &.up img {
      transform: rotate(90deg);
    }
  }
}
:deep(.q-slider--inactive .q-slider__thumb--h) {
    width: 0.3rem!important;
    background-color: var(--q-gb-bg-c-9);
    border-radius: 0.06rem;
    svg {
      display: none;
    }
  }
  :deep(.q-slider__track), :deep(.q-slider__thumb) {
    color: var(--q-gb-bg-c-9);
  }
</style>