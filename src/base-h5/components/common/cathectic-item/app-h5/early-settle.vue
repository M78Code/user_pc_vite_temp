<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
  <div class="early-settle">
    <span class="tips" @click="alertTips=true;">提前兑现规则申明</span>
  
    <div class="early-button">
      <button @click="earlyBtnClick">
        {{ sure_settle_button_text }}
        <span v-if="btnStatus===1 || btnStatus===2">(含本金)</span>
      </button>
      <button class="change" v-if="btnStatus===2"> 金额有变更 </button>
      <button class="cancel" v-if="btnStatus===2" @click="btnStatus=1;"> 取消 </button>
    </div>
    <!-- 滑块 -->
    <q-slide-transition>
      <div v-show="slider_show" class="slider-wrap">
        <!-- 提前结算投注额 -->
        <p class="yb_mb14">{{ t('early.info4') }}：{{ cashout_stake.toFixed(2) }} </p>
        <q-slider track-size="0.06rem" @change="change_percentage" class="slider-content" thumb-size="0.16rem"
          v-model="percentage" :min="0" :max="100" :step="25" />
        <div class="num row yb_pt6">
          <i v-for="(n, i) in [25, 50, 75, 100]" :key="i" class="col text-right">{{ `${n}%` }}</i>
        </div>
      </div>
    </q-slide-transition>
    <!-- 提前兑现规则申明弹框 -->
    <q-dialog v-model="alertTips">
      <div class="tips-main">
        <h2>提前兑现规则申明</h2>
        <p>开云体育提前兑现只适用于指定赛事和盘口，如遇到赛事或盘口取消，提前兑现注单将会被收回重新结算。开云体育保留赛果最终解释权。</p>
        <p>具体兑现规则请查看【帮助中心】-【开云体育提前兑现规则】</p>
        <span @click="alertTips=false;">我知道了</span>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import ClipboardJS from "clipboard";
import { api_betting } from "src/api/index.js"
// import { mapGetters, mapMutations } from "vuex";
import { format_time_zone_time } from "src/core/format/index.js"
import { utils,compute_css_obj, LOCAL_PROJECT_FILE_PREFIX } from 'src/core/index.js'
import { Platform } from "quasar";
import { inject, ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import lodash from 'lodash'
import store from "src/store-redux/index.js"
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"
import { t } from "src/boot/i18n.js";
import UserCtr from "src/core/user-config/user-ctr.js";

let store_cathectic = store.getState().cathecticReducer
const props = defineProps({
  item_data: {
    type: Object
  }
})
// 提前兑现规则申明弹框
let alertTips = ref(false)
// 1 - 初始状态，2 - 确认提前结算， 3 - 兑现中...
let btnStatus = ref(1)

// 待确认中的提前结算单
let queryorderpresettleconfirm_data = inject('queryorderpresettleconfirm_data')
// 1 - 初始状态，2 - 确认提前结算， 3 - 确认中..., 4 - 已提前结算, 5 - 暂停提前结算(置灰), 6 - 仅支持全额结算, 7 - 按钮不显示
let status = ref(1)
// 滑块是否显示
let slider_show = ref(false)
// 提前结算详情列表是否显示
let details_show = ref(false)
// 展开 提前结算详情列表 的按钮是否显示
let details_show2 = ref(false)
// 0  25 - 25%, 50 - 50%, 75 - 75%, 100 - 100%, 一共5个点
let percentage = ref(100)
// 0-提前结算金额已包含本金  1-提前结算申请未通过  2-功能暂停中，请稍后再试  3-提前结算金额调整中，请再试一次
let tips = ref(0)
// 提前结算详情数据
let presettleorderdetail_data = ref([])
// orderVOS 里面的第一条数据，只考虑单关
let ordervos_ = ref({})
// 接口返回的正在确认中的金额，当 [2, 3, 4, 6] 4种情况时，也用于赋值锁定金额
let front_settle_amount = ref('')
// 工具方法
// let utils = ref(utils)
// 接口调用次数计数 // 概率，用于计算钮下的预计返还（盈利），注意，查询订单记录接口是直接返回的金额，而ws推送返回的是概率，所以概率更新了需要重新计算钮下的预计返还（盈利）
// let count_ = ref(0)
let origin_settle_money = ref(lodash.cloneDeep(props.item_data.maxCashout))
// 延时器
let timer = ref(null)
let timer2 = ref(null)
let timer3 = ref(null)
let timer4 = ref(null)
let timer5 = ref(null)

// 提前兑现button文案
const sure_settle_button_text = computed(() => {
  if (btnStatus.value === 1) {
    return '确认兑现9.00元'
  }
  if (btnStatus.value === 2) {
    return '提起兑现9.00元'
  }
  if (btnStatus.value === 3) {
    return '兑现中'
  }
  console.log(btnStatus.value);
})

const earlyBtnClick = () => {
  if(btnStatus.value === 1) {
    btnStatus.value = 2;
    return;
  }
  if (btnStatus.value === 2) {
    btnStatus.value = 3;
    return;
  }
}

// ...mapGetters([
//当前皮肤
//用户信息
// 0未结算/筛选 1已结算/搜索
//   "get_main_item",
//提前结算金额集合
//   "get_early_moey_data",
// ]),
// 剩余可提前结算次数
const remaining_num = computed(() => {
  if (details_show2.value || is_only_fullbet.value) {
    return 1
  } else {
    return 2
  }
})
// 提示信息是否展示
const is_tips_show = computed(() => {
  // 必备条件,没有 剩余可提前结算的本金 时不显示, 按钮不展示时不显示
  let flag1 = props.item_data.preSettleBetAmount && calc_show
  // 第一次就全额结算
  let flag2 = status.value == 4 && details_show2.value == false
  // 发生过2次提前结算
  let flag3 = props.item_data.settleType == 999
  return flag1 && !flag2 && !flag3
})
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
  return props.item_data.preSettleBetAmount != null && props.item_data.preSettleBetAmount <= min_bet_money && expected_profit >= 1
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
/**
  * @description 按钮下的预计返还（盈利）返回Number类型
  * @param {undefined} undefined
  * @return {number}  返还金额
  */
const expected_profit = computed(() => {
  let _maxCashout = props.item_data.maxCashout
  // if (_maxCashout) {
  const moneyData = lodash.find(store_cathectic.early_moey_data, (item) => {
    return props.item_data.orderNo == item.orderNo
  })
  if (moneyData && moneyData.orderStatus === 0) {
    if (moneyData.preSettleMaxWin != origin_settle_money) {
      _maxCashout = moneyData.preSettleMaxWin
    }
  }
  let _percentage = cashout_stake.value / parseInt(props.item_data.preSettleBetAmount)
  //四舍五入至小数点第二位

  return Math.round(_maxCashout * _percentage * 100) / 100
  // } else {
  //   return 0
  // }
})
// 单关最低投注金额
const min_bet_money = computed(() => {
  return lodash.get(UserCtr, "cvo.single.min") || 10;
})
// 计算提前结算按钮是否显示
const calc_show = computed(() => {
  return /10true[1-6]+/.test("" + lodash.get(UserCtr.user_info, 'settleSwitch') + store_cathectic.main_item + props.item_data.enablePreSettle + status.value);
})
watch(() => expected_profit, (_new, _old) => {
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


ordervos_ = lodash.get(props.item_data, "orderVOS[0]", {});
// 接口：当 enablePreSettle=true && hs = 0  提前结算显示高亮， 当 enablePreSettle=true && hs != 0  显示置灰， 当 enablePreSettle=false 不显示，
if (ordervos_.hs != 0) {
  status.value = 5;
}
// 设置哪些注单处于确认中的状态
if (Array.isArray(queryorderpresettleconfirm_data) && store_cathectic.main_item == 0) {
  queryorderpresettleconfirm_data.forEach((item) => {
    if (item.orderNo == props.item_data.orderNo && item.preSettleOrderStatus == 0) {
      status.value = 3
      front_settle_amount.value = item.frontSettleAmount
    }
  });
}
onMounted(() => {
  // 已发生过提前结算或者提前结算取消
  if (props.item_data.preBetAmount > 0 || [3, 4, 5].includes(props.item_data.settleType)) {
    details_show2.value = true;
  }
  if (is_only_fullbet.value) {
    // 剩余的金额小于最低限额时，只支持全额结算
    status.value = 6;
  }
  // 该注单支持提前结算，或者做过提前结算的话，需要打个标记
  if (calc_show.value || details_show2.value) {
    props.item_data.is_show_early_settle = true
  }

  // 处理ws订单状态推送
  useMittOn(MITT_TYPES.EMIT_C201_HANDLE, c201_handle).on;
  useMittOn(MITT_TYPES.EMIT_C210_HANDLE, c210_handle).on;
})
onUnmounted(() => {
  clear_timer();
  useMittOn(MITT_TYPES.EMIT_C201_HANDLE, c201_handle).off;
  useMittOn(MITT_TYPES.EMIT_C210_HANDLE, c210_handle).off;
})

// ...mapMutations(["set_toast","set_early_moey_data"]),
/**
 *@description 处理ws订单状态推送
 *@param {Object} · orderNo - 订单号, orderStatus - 订单状态
 */
const c201_handle = ({ orderNo, orderStatus }) => {
  if (props.item_data.orderNo == orderNo && status.value == 3) {
    if (orderStatus == 1) {
      // 成功
      status.value = 4;
    } else if (orderStatus == 2) {
      // 失败
      status.value = 1;
      tips = 1;
    }
  }
  // console.log("qwe", orderStatus, orderNo);
}
/**
 *@description 处理ws订单状态推送, 当 cashOutStatus=1 && hs = 0  提前结算显示高亮，当 cashOutStatus=1 && hs != 0  显示置灰，当cashOutStatus=-1  显示置灰，  当cashOutStatus=-2  不显示
 *@param {Number} hid 盘口id
 *@param {Number} oid 投注项id
 *@param {String} ov 保留2位小数后的欧赔
 *@param {Number} cashOutStatus 1 AVAILABLE(=1才能提前结算), -1 UNAVAILABLE(按钮置灰), -2 CLOSED(按钮隐藏)
 */
const c210_handle = ({ hid, cashOutStatus, hs }) => {
  let { marketId, oddFinally } = ordervos_;
  oddFinally = Number(oddFinally)
  let flag = cashOutStatus == 1 || cashOutStatus == -1
  if (hid == marketId) {
    props.item_data.enablePreSettle = flag
    if (flag) {
      if (hs == 0 && cashOutStatus == 1 && (status.value == 5 || status.value == 7)) {
        if (!props.item_data.maxCashout) {
          useMittEmit(MITT_TYPES.EMIT_GET_ORDER_LIST)
        }
        if (expected_profit > 1) {
          status.value = 1;
        }
      }
      if ((hs != 0 && cashOutStatus == 1 || cashOutStatus == -1) && (status.value == 1 || status.value == 2 || status.value == 6)) {
        status.value = 5;
      }
      front_settle_amount.value = ''
    } else {
      status.value = 7;
    }
  }
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
 *@description 获取提前结算详情数据
 */
const fetch_early_settle_detail = () => {
  if (details_show) {
    details_show = false;
  } else {
    api_betting.get_pre_settle_order_detail({ orderNo: props.item_data.orderNo }).then((res) => {
      let { code, data = [] } = res || {};
      if (code == 200) {
        presettleorderdetail_data = data;
        details_show = true;
      }
    }).catch((err) => {
      console.error(err);
    });
  }
}
/**
 *@description 提前结算提交事件
 */
const submit_early_settle = () => {
  if (cashout_stake.value < 0.01) return;
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
  // 响应码【0000000 成功（仅在测试模式出现） | 0400524 确认中（仅在非测试模式出现）| 0400500 提交申请失败，提示msg信息】
  api_betting.post_pre_bet_order(params).then((reslut) => {
    let res = {}
    if (reslut.status) {
      res = reslut.data
    } else {
      res = reslut
    }

    if (res.code == 200) {
      status.value = 4;
    } else if (res.code == "0400524") {
      // 注单确认中···
      // 前5次 每3s拉一次
      // 6-10次 每5s拉一次
      // 11~35次  每10s拉一次
      timer4 = setInterval(() => {
        count_++;
        if (count_ > 5) {
          clearInterval(timer4)
          timer4 = setInterval(() => {
            count_++;
            if (count_ > 10) {
              clearInterval(timer4)
              timer4 = setInterval(() => {
                count_++;
                if (count_ > 35) {
                  clearInterval(timer4)
                }
              }, 10000);
            }
          }, 5000);
        }
      }, 3000);
    } else if (res.code == "0400527") {
      // 不支持提前结算或者暂停
      status.value = 5;
      tips = 2;
    } else if (res.code == "0400537") {
      // 金额有变动，需要更新按钮上的金额
      status.value = 1;
      tips = 3;
      let money = res.data
      if (+money > 0) {
        nextTick(() => {
          front_settle_amount.value = money
        })
      }
    } else {
      status.value = 1;
      tips = 1;
    }
  }).catch((err) => {
    console.error(err)
    status.value = 1;
    tips = 1;
  });
}
/**
 *@description 橙色大按钮点击处理
 */
const submit_click = () => {
  tips = 0
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
 *@description 复制订单号
 *@param {Object} evt 事件对象
 *@param {String} orderno 订单号
 */
const copy = (evt, orderno) => {
  const clipboard = new ClipboardJS(evt.target, {
    text: () => orderno
  })
  clipboard.on('success', () => {
    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("bet_record.copy_suc"))
    // h5嵌入时Safari阻止弹窗
    if (!Platform.is.safari) {
      try {
        location.href = `pasteOrderAction://paste?orderSN=${orderno}`;
      } catch (error) {
        console.error(error)
      }
    }
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboard.destroy()
  })
  clipboard.onClick(evt)
}
// 批量清除定时器
const clear_timer = () => {
  const timer_arr = [
    'timer',
    'timer2',
    'timer3',
    'timer4',
    'timer5',
    'timer6',
  ]

  // for (const timer of timer_arr) {
  //   clearTimeout([timer])
  //   timer = null
  // }
}
</script>
<style lang="scss" scoped>
.early-settle {
  .tips {
    display: block;
    text-align: right;
    padding-right: 0.14rem;
    color: var(--q-gb-bg-c-6);
    font-size: 0.12rem;
    line-height: 2;
  }
  .early-button {
    padding: 0 0.14rem;
    button {
      display: block;
      border: none;
      background-color: var(--q-gb-bg-c-9);
      color: var(--q-gb-bg-c-15);
      width: 100%;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.16rem;
      border-radius: 0.1rem;
      &.cancel {
        background-color: transparent;
        color: var(--q-gb-bg-c-6);
      }
      &.change {
        background-color: transparent;
        color: var(--q-gb-bg-c-12);
        line-height: 0.5rem;
      }
      span {
        font-size: 0.14rem;
      }
    }
  }
}
.tips-main {
  background-color: #fff;
  border-radius: 0.1rem;
  width: 90%;
  padding: 0 0.14rem;
  h2 {
    font-size: 0.2rem;
    font-weight: bold;
    text-align: center;
    line-height: 4;
  }
  p {
    font-size: 0.16rem;
    line-height: 1.5;
    margin-bottom: 0.2rem;
    text-align: justify;
  }
  span {
    font-size: 0.20rem;
    color: var(--q-info);
    line-height: 2.5;
    border-top: 1px solid #e5e5e5;
    display: block;
    text-align: center;
  }
}
</style>
