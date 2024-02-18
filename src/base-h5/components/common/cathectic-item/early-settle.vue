<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
  <div class="early-settle yb_mt10 yb_mb12" v-if="calc_show || details_show2">
    <template v-if="calc_show">
      <!-- 提示消息 -->
      <p class="row justify-between yb_pl10">
        <span class="col-7">
          <!-- 提前结算申请未通过 -->
          <i class="tips" v-if="tips == 1">{{ i18n_t('early.info2') }}</i>
          <!-- 功能暂停中，请稍后再试 -->
          <i class="tips" v-else-if="tips == 2">{{ i18n_t('early.info6') }}</i>
          <!-- 提前结算金额调整中，请再试一次 -->
          <i class="tips" v-else-if="tips == 3">{{ i18n_t('early.info7') }}</i>
          <!-- 提前结算金额已包含本金 -->
          <i v-else>{{ i18n_t('early.info1') }}</i>
        </span>
        <span class="col-5 text-right tips-right" v-if="status == 6">{{ i18n_t('early.info3') }}</span>
      </p>

      <div class="btn-wrap row justify-between yb_mt8 yb_mb12">
        <div class="btn-l row justify-between col"
          :class="{ 'btn2': status !== 1 && status !== 5 && status !== 6, 'btn3': status == 5 }">
          <p class="btn-ll text-center col ellipsis yb_fontsize12 column justify-center" @click="submit_click">
            <!-- 暂停提前结算 -->
            <span v-if="status == 5">{{ i18n_t('early.btn1') }} </span>
            <!-- 提前结算 -->
            <span v-if="status == 1 || status == 6">{{ i18n_t('early.btn2') }}</span>
            <!-- 确认提前结算 -->
            <span v-if="status == 2">{{ i18n_t('early.btn3') }}</span>
            <!-- 确认中... -->
            <span v-if="status == 3">{{ i18n_t('early.btn4') }}</span>
            <!-- 已提前结算 -->
            <span v-if="status == 4">{{ i18n_t('early.btn5') }}</span>
            <!-- 按钮上的金额 -->
            <span v-if="status !== 5 && (Number(front_settle_amount) || expected_profit)">{{ betting_amount }}</span>
          </p>

          <!-- 转圈按钮 -->
          <p class="btn-spin" v-if="status != 1 && status != 5">
            <img :src="compute_local_project_file_path('/image/record/loading.svg')" alt="" v-if="status == 3" class="loading2">
            <img :src="compute_local_project_file_path('/image/record/done.svg')" alt="" v-if="status == 4">
          </p>
        </div>

        <!-- 右边设置按钮 -->
        <div class="btn-r text-center" @click="change_slider_show"
          v-if="(status == 1 || status == 5 || status == 6) && lodash.get(UserCtr, 'pcs')"
          :style="{ opacity: status == 5 || status == 6 ? 0.3 : 1 }">
          <template v-if="slider_show">
             <img :style="compute_css_obj('log-set')"  alt="">
            <!-- <img :style="" :src="compute_local_project_file_path('/image/record/set4.svg')" alt="" v-if="('y0')">
            <img :src="`/${compute_local_project_file_path}/image/record/set.svg`" alt="" v-else> -->
          </template>
          <template v-else>
            <img :style="compute_css_obj('log-set')"  alt="">
            <!-- <img :src="compute_local_project_file_path('/image/record/set2.svg')" v-if="('day')" alt="">
            <img :src="`/${compute_local_project_file_path}/image/record/set3.svg`" v-else alt=""> -->
          </template>

        </div>

      </div>

      <!-- 滑块 -->
      <q-slide-transition>
        <div v-show="slider_show" class="slider-wrap">
          <!-- 提前结算投注额 -->
          <p class="yb_mb14">{{ i18n_t('early.info4') }}：{{ cashout_stake.toFixed(2) }} </p>
          <q-slider track-size="0.06rem" @change="change_percentage" class="slider-content" thumb-size="0.16rem"
            v-model="percentage" :min="0" :max="100" :step="25" />
          <div class="num row yb_pt6">
            <i v-for="(n, i) in [25, 50, 75, 100]" :key="i" class="col text-right">{{ `${n}%` }}</i>
          </div>
        </div>
      </q-slide-transition>

    </template>
    <div class="yb_pl10 yb_pt10 yb_mb6" v-if="is_tips_show">
      <!-- 注单剩余本金 -->
      <p class="yb_mb4">{{ i18n_t('early.info8') }}：{{ (+item_data.preSettleBetAmount).toFixed(2) }}</p>
      <!-- 提前结算可用次数 -->
      <p
        v-if="item_data.enablePreSettle && item_data.initPresettleWs && lodash.get(UserCtr, 'pcs') == 1 && lodash.get(UserCtr, 'user_info.settleSwitch')">
        {{ i18n_t('early.info9') }}：{{ remaining_num }}</p>
    </div>

    <!-- 提前结算详情 -->
    <p class="row justify-between yb_pl10 yb_py4" @click="fetch_early_settle_detail" v-if="details_show2">
      <!-- 提前结算详情 -->
      <span>{{ i18n_t('early.list1') }}</span>
      <img :src="compute_local_project_file_path('/image/list/league-collapse-icon.svg')" alt="" :class="{ arrow2: details_show }" class="arrow">
    </p>
    <q-slide-transition>
      <div v-show="details_show">

        <template v-if="presettleorderdetail_data.length">
          <div class="detail-wrap yb_pb12" v-for="(item, index) in presettleorderdetail_data" :key="index">
            <!-- 注单号和时间 -->
            <p class="order-title row yb_px10">
              <span class="order-num" v-if="item.preOrderNo">{{ item.preOrderNo }}
                &ensp;<img :src="compute_local_project_file_path('/image/svg/copy.svg')" style="width:0.1rem;vertical-align:-2px" alt=""
                  @click="copy($event, item.preOrderNo)">
              </span>
              <span class="order-num" v-else>{{ i18n_t('early.list6') }}</span>
              <!-- .Format(i18n_t('time4')) -->
              <span>{{ (new Date(format_time_zone_time(+item.createTime))) }}</span>
            </p>
            <!-- 取消原因 -->
            <div class="row yb_px10 yb_py4" v-if="item.orderStatus == 2">
              <span class="cancel">{{ i18n_t('common.cancel') }}</span>
            </div>
            <!-- 注单被取消 -->
            <template v-if="item.orderStatus == 2">
              <!-- 部分结算 -->
              <!-- 结算本金 -->
              <p class="yb_mt4">
                <span>{{ item.remainingBetAmount ? i18n_t('early.list7') : i18n_t('early.list2') }}</span><span>0.00</span></p>
              <!-- 返还金额 -->
              <p><span>{{ i18n_t('early.list4') }}</span><span>0.00</span></p>
              <!-- 输/赢 -->
              <p><span>{{ i18n_t('early.list5') }}</span><span>0.00</span></p>
            </template>
            <template v-else>
              <!-- 部分结算 -->
              <!-- 结算本金 -->
              <p class="yb_mt4">
                <span>{{ item.remainingBetAmount ? i18n_t('early.list7') : i18n_t('early.list2') }}</span><span>{{ (+item.preBetAmount).toFixed(2) }}</span>
              </p>
              <!-- 返还金额 -->
              <p><span>{{ i18n_t('early.list4') }}</span><span>{{ (+item.settleAmount).toFixed(2) }}</span></p>
              <!-- 输/赢 -->
              <p><span>{{ i18n_t('early.list5') }}</span><span>{{ (+item.profit).toFixed(2) }}</span></p>
              <!-- 剩余本金 -->
              <p v-if="item.remainingBetAmount">
                <span>{{ i18n_t('early.list3') }}</span><span>{{ (+item.remainingBetAmount).toFixed(2) }}</span></p>
            </template>
          </div>
        </template>
      </div>
    </q-slide-transition>

  </div>
</template>

<script setup>
import ClipboardJS from "clipboard";
import { api_betting } from "src/api/index.js"
// import { mapGetters, mapMutations } from "vuex";
import { format_time_zone_time } from "src/output/index.js"
import { compute_css_obj, compute_local_project_file_path } from 'src/output/index.js'
import { Platform } from "quasar";
import { inject, ref, computed, onMounted, onUnmounted, watch, nextTick,reactive } from 'vue'
import lodash from 'lodash'
import { useMitt, MITT_TYPES, useMittEmit } from "src/core/mitt/"
import { i18n_t } from "src/boot/i18n.js";
import UserCtr from "src/core/user-config/user-ctr.js";


const store_cathectic = reactive({
    // 0未结算/筛选 1已结算/搜索
    main_item: 0,
  // 0筛选 1搜索
  search_for_choose: 0,
  // 搜索 去到 详情页的记录
  search_term: '',
  //提前结算金额集合
  early_moey_data: [],
})
const props = defineProps({
  item_data: {
    type: Object
  }
})
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
  useMitt(MITT_TYPES.EMIT_C201_HANDLE, c201_handle);
  useMitt(MITT_TYPES.EMIT_C210_HANDLE, c210_handle);
})
onUnmounted(() => {
  clear_timer();
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
    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("bet_record.copy_suc"))
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
  width: 3.25rem;
  margin: 0.1rem auto 0;
  font-size: 0.11rem;
  line-height: 1.3;
}

.tips {
  color: #ff0000;
}

/* ************** 注单取消原因 ************** -S */
.tips-wrap {
  i {
    width: 1.04rem;
    line-height: 0.38rem;
    background: #ffffff;
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    top: 120%;
    left: -0.12rem;
    color: #000;

    &::before {
      content: "";
      position: absolute;
      border: inherit;
      border-width: 1px 0 0 1px;
      background: inherit;
      width: 0.08rem;
      height: 0.08rem;
      transform: rotate(45deg);
      top: -0.04rem;
      left: 0.14rem;
    }
  }

  img {
    height: 0.14rem;
    transform: translateY(1px);
  }

  /* ************** 注单取消原因 ************** -E */
}

.cancel {
  color: #ffffff;
  border-radius: 2px;
  background-color: #ff7272;
  padding: 0 0.04rem;
  line-height: 0.18rem;
  height: 0.16rem;
  display: inline-block;
}

.btn-l {
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 0.2rem;
  background-image: var(--q-color-linear-gradient-bg-9);
  border-style: solid;
  border-width: 1px;
}

.btn2 {
  width: 100%;
  padding: 0 0.2rem 0 0.38rem;
  background-image: linear-gradient(270deg, #ffb001 0%, #ff7000 100%);
}

.btn3 {
  background-image: none;
  border: unset;

  span {
    font-size: 0.14rem;
  }
}

.btn-r {
  width: 0.6rem;
  line-height: 0.4rem;
}

.btn-wrap {
  height: 0.4rem;
}

.btn-spin {
  flex: 1 1 0.18rem;

  img {
    width: 0.18rem;
    transform: translateY(0.09rem) rotate(0);
  }

  /* ************** 滑动条 ************** -S */
}

.slider-wrap {
  --width: 3.05rem;
  padding: 0 0.1rem;
}

.slider-content {
  :deep(.q-slider__track-container--h) {
    padding: 0;
  }
}

.num {
  i {
    font-style: normal;
    margin-right: -0.1rem;
  }

  /* ************** 滑动条 ************** -E */
}

.loading2 {
  animation: loading 1s linear infinite;
}

@keyframes loading {
  to {
    transform: translateY(0.09rem) rotate(360deg);
  }
}

.detail-wrap {
  p {
    display: flex;
    justify-content: space-between;
    line-height: 0.2rem;
    margin-bottom: 1px;
    padding: 0 0.1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  span:nth-child(2n) {
    font-size: 0.12rem;
  }
}

.arrow {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

.arrow2 {
  transform: rotate(0);
}</style>