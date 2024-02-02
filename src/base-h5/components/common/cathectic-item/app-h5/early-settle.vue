<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <!-- 提前兑现规则申明 -->
  <early-settle-tips v-if="calc_show" />
  <!-- 提前兑换按钮 -->
  <div class="early-settle" v-if="calc_show">
    <div class="un-success" v-if="unSuccessTips">{{ i18n_t('early.info2') }}</div>
    <div class="early-button">
      <button @click="submit_click" :class="{'disabled-btn': status == 4 || status == 5}">
        <!-- 暂停提前结算 -->
        <template v-if="status == 5">{{ i18n_t('early.btn1') }} </template>
        <!-- 提前结算 -->
        <template v-if="status == 1 || status == 6">{{ i18n_t('early.btn2_1') }}</template>
        <!-- 确认提前结算 -->
        <template v-if="status == 2">{{ i18n_t('early.btn3') }}</template>
        <!-- 确认中... -->
        <template v-if="status == 3">{{ i18n_t('early.btn4') }}</template>
        <!-- 已提前结算 -->
        <template v-if="status == 4">{{ i18n_t('early.btn5') }}</template>
        <!-- 按钮上的金额 -->
        <template v-if="(Number(front_settle_amount) || expected_profit)">{{ betting_amount }}{{ i18n_t('early.btn2_2') }}</template>
        <img class="load" v-if="status == 3" :src="compute_local_project_file_path('/image/gif/loding.gif')">
      </button>
      <!-- <button class="change"> 金额有变更 </button>
      <button class="cancel"> 取消 </button> -->
    </div>
    <!-- 调整金额滑块，暂时隐藏 -->
    <template style="display: none;">
      <q-slide-transition>
        <div v-show="slider_show" class="slider-wrap">
          <!-- 提前结算投注额 -->
          <q-slider track-size="0.06rem" @change="change_percentage" class="slider-content" thumb-size="0.16rem"
            v-model="percentage" :min="0" :max="100" label label-always :label-value="cashout_stake.toFixed(2)" />
        </div>
      </q-slide-transition>
      <div class="change-btn" 
        v-if="(status == 1 || status == 5 || status == 6) && lodash.get(UserCtr, 'pcs')"
        :class="slider_show ? 'up' : 'down'" 
        @click="change_slider_show">
        <span>{{i18n_t('app_h5.cathectic.adjustment_amount')}}</span>
        <img :src="compute_local_project_file_path('/image/gif/change.gif')">
      </div>
    </template>
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
import earlySettleTips from "src/base-h5/components/common/cathectic-item/app-h5/early-settle-tips.vue";

const props = defineProps({
  item_data: {
    type: Object
  }
})
// 待确认中的提前结算单
let queryorderpresettleconfirm_data = inject('queryorderpresettleconfirm_data')
// 1 - 初始状态，2 - 确认提前结算， 3 - 确认中..., 4 - 已提前结算, 5 - 暂停提前结算(置灰), 6 - 仅支持全额结算, 7 - 按钮不显示
let status = ref(1)
// 是否展示提前结算
let calc_show = ref(false)
// 是否已经成功发生过提前结算
let has_early_settled = ref(false)
// 提前结算申请未通过提示
let unSuccessTips = ref(false)
// 滑块是否显示
let slider_show = ref(false)
// 0  100
let percentage = ref(100)
// orderVOS 里面的第一条数据，只考虑单关
let ordervos_ = null
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
/**
 * 是否仅支持全额结算
 */
const is_only_fullbet = computed(() => {
  return props.item_data.preSettleBetAmount != null && props.item_data.preSettleBetAmount <= min_bet_money && expected_profit.value >= 1
})

// 提前结算投注额,四舍五入取整
const cashout_stake = computed(() => {
  let pba = props.item_data.preSettleBetAmount || 0
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


// provide 进来的 待确认中的提前结算单
watch(() => queryorderpresettleconfirm_data.value, (_new) => {
    // 设置哪些注单处于确认中的状态
    if (Array.isArray(_new) && BetRecordClass.select == 0) {
      _new.forEach((item) => {
      if (item.orderNo == props.item_data.orderNo && item.preSettleOrderStatus == 0) {
        status.value = 3
        front_settle_amount.value = item.frontSettleAmount
      }
    });
  }
}, { immediate: true })


onMounted(() => {
  // 计算提前结算按钮是否显示
  // calc_show.value = (BetRecordClass.selected === 0 && props.item_data.seriesType === '1' && props.item_data.enablePreSettle)
  //  /10true[1-6]+/.test("" + lodash.get(UserCtr.user_info, 'settleSwitch') + BetRecordClass.selected + props.item_data.enablePreSettle + status.value);

  // 接口：当 enablePreSettle=true && hs = 0  提前结算显示高亮， 当 enablePreSettle=true && hs != 0  显示置灰， 当 enablePreSettle=false 不显示，
  ordervos_ = lodash.get(props.item_data, "orderVOS[0]", {});
  if (ordervos_.hs != 0) {
    status.value = 5;
  }

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
    let _maxCashout = props.item_data.maxCashout
    if (moneyData && moneyData.orderStatus === 0) {
      if (moneyData.preSettleMaxWin !=  props.item_data.maxCashout) {
        _maxCashout = moneyData.preSettleMaxWin
      }
    }
    let _percentage = cashout_stake.value / parseInt(props.item_data.preSettleBetAmount)
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
  if (props.item_data.orderNo == orderNo) {
    if (orderStatus == 1) {
      // 成功
      status.value = 4;
      // 发生过提前结算
      has_early_settled.value = true
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
  // 响应码【0000000 成功（仅在测试模式出现） | 0400524 确认中（仅在非测试模式出现）| 0400500 提交申请失败，提示message信息】
  api_betting.post_pre_bet_order(params).then((reslut) => {
    let res = reslut.status ? reslut.data : reslut
    if (res.code == 200) {
      status.value = 4;
      // 发生过提前结算
      has_early_settled.value = true
    } else if (res.code == "0400524") {
      // 注单确认中···
      // 等到ws推送，c201_handle处理后续注单状态
    } else if (res.code == "0400527") {
      // 不支持提前结算或者暂停
      status.value = 5;
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
      // 提示未通过
      showUnSuccessTips()
    }
    message && useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, message)
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
template {
  display: block;
}
.early-settle {
  .un-success {
    padding: 0 0.14rem;
    color: #f53f3f;
    line-height: 2;
  }
  .early-button {
    padding: 0 0.14rem;
    margin-bottom: 0.1rem;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: var(--q-gb-bg-c-13);
      color: var(--q-gb-t-c-14);
      width: 100%;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.16rem;
      border-radius: 0.1rem;
      &.disabled-btn {
        background-color: var(--q-gb-bg-c-9);
      }
      span {
        font-size: 0.14rem;
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
    background-color: var(--q-gb-bg-c-13);
    border-radius: 0.06rem;
    svg {
      display: none;
    }
  }
  :deep(.q-slider__track), :deep(.q-slider__thumb) {
    color: var(--q-gb-bg-c-13);
  }
</style>