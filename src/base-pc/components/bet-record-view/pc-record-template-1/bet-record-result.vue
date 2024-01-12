<!--

 * @Description: 投注记录，投注结果部分
-->
<template>
  <div>
    <div class="row">
      <div class="col bet-money">
        <template v-if="[0,1].includes(BetRecordLeft.selected)">
          <!--投注额-->
          {{i18n_t('common.bets_val')}}
        </template>
        <template v-else-if="BetRecordLeft.selected==2">
          <!-- 预约投注额 -->
          {{i18n_t("bet.bet_book_stake")}}
        </template>
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
       {{ format_currency(item.orderAmount) }}
      </div>
      <div class="col-auto bet-value" :class="{'red-text':(item.outcome=='4' || item.outcome=='5')}">
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
    <div class="info-wrap" v-if="calc_show">
      <!--提前结算提示语-->
      <div class="bet-pre-title">
        <template v-if="ref_data.bet_pre_code>1 && ref_data.bet_pre_code!='0400524'">
          <span style="color:red">
            <template v-if="ref_data.bet_pre_code=='0400527'">
              <!--功能暂停中，请稍后再试-->
              {{i18n_t('bet_record.pre_suspend')}}
            </template>
            <template v-else-if="ref_data.bet_pre_code=='0400537'">
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
          <span>{{i18n_t('bet_record.pre_bet_include_money')}}</span>
        </template>
      </div>
      <div class="bet-pre-wrap">
        <!-- 提前结算按钮-->
        <div class="bet-pre-btn">
          <!-- 提前结算-->
          <div class="bet-row-1">{{i18n_t("bet_record.settlement_pre")}} </div>
          <div class="bet-row-2" v-if="status !== 5 && (Number(front_settle_amount) || expected_profit)">￥{{ betting_amount }}</div>
        </div>
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/success.png`" alt="">
      </div>
    </div>
    <template v-if="item.seriesType=='1'">
      <div class="info-wrap">
        <!--选择的是未结算 且settleSwitch开关为1且enablePreSettle为true -->
        <template v-if="BetRecordLeft.selected==0 && UserCtr.settleSwitch && item.enablePreSettle">
          <!--账户有钱且是开盘状态且结算状态为1-->
          <template v-if="ref_data.amount > 1 && lodash_.get(item,'orderVOS.0.hs')==0 && item.cash_out_status==1">
            <!--settleType 1 未发生提前结算(支持全额)4已发生 部分提前部分结算(支持部分),5 已发生提前全结算(支持全部),3 提前结算取消-->
            <template v-if="ref_data.bet_pre_code!='0400524' || [4,5].includes(item.settleType) || item.pre_settle_order_status==2">
              <div class="row">
                <!--提前结算提示语-->
                <div class="col bet-pre-title">
                  <template v-if="ref_data.bet_pre_code>1 && ref_data.bet_pre_code!='0400524'">
                    <span style="color:red">
                      <template v-if="ref_data.bet_pre_code=='0400527'">
                        <!--功能暂停中，请稍后再试-->
                        {{i18n_t('bet_record.pre_suspend')}}
                      </template>
                      <template v-else-if="ref_data.bet_pre_code=='0400537'">
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
                    <span>{{i18n_t('bet_record.pre_bet_include_money')}}</span>
                  </template>
                </div>
              </div>
            </template>
            <!--提前结算开始-->
            <!---提前结算按钮状态不存在或者为default时显示提前结算按钮--->
            <template v-if="!item.bet_status || item.bet_status == 'default'">
              <div class="row">
                <div class="bet-pre-wrap">
                  <!-- 提前结算按钮-->
                  <div class="bet-pre-btn" @click.stop="start_bet_pre()">
                    <!-- 提前结算-->
                    <div class="bet-row-1">{{i18n_t("bet_record.settlement_pre")}} </div>
                    <div class="bet-row-2">{{ format_balance(ref_data.amount) }}
                    </div>
                  </div>
                  <!--提前结算按钮右侧icon按钮,点击可以展开提前结算滑块显示-->
                  <div class="bet-pre-handle"
                    @click.stop="show_bet_pre(index)" v-if="UserCtr.pcs=='1'">
                    <!-- <icon name="icon-bet_pre" class="bet-pre-info" size="14px" :class="{'bet-pre-over':ref_data.cur_bet_pre.show_operate=='bet_pre'}"/> -->
                  </div>
                </div>
              </div>
            </template>
            <template v-if="item.bet_status=='start_bet_pre'">
              <div class="row" :class="{'mt0': item.settleType==1}">
                <!--提前结算确认中 、确认提前结算-->
                <div class="col bet-pre-confirming-btn" @click="bet_handle(item.orderNo)">
                  <div class="bet-pre-left">
                    <!-- 确认中...|确认提前结算 -->
                    <div class="bet-row-1">{{item.bet_confirm?i18n_t("bet_record.confirm"):i18n_t("bet_record.confirm_bet_pre")}}</div>
                    <div class="bet-row-2">{{ format_balance(ref_data.amount) }}</div>
                  </div>
                  <div class="bet-pre-right" v-if="item.bet_confirm">
                    <template v-if="['theme01','theme02'].includes(UserCtr.theme)">
                      <img :src="(`/image/wwwassets/yabo/gif/${UserCtr.theme}/${UserCtr.theme}_confirming.gif`)" style="height:18px;width:18px"/>
                    </template>
                    <template v-else>
                      <img :src="(`/image/wwwassets/yabo/gif/${UserCtr.theme}/${UserCtr.theme}_pre_confirming.gif`)" style="height:18px;width:18px"/>
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <!--提前结算结算成功按钮显示-->
            <template v-else-if="item.bet_status=='end_bet_pre'">
              <div class="bet-pre-complete-btn" :class="{'mt0': item.settleType==1}">
                <div class="bet-pre-left">
                  <!-- 已提前结算 成功 item.probabilities-->
                  <div class="bet-row-1">{{i18n_t("bet_record.finish_bet_pre")}}</div>
                  <div class="bet-row-2">{{ format_balance(ref_data.amount) }}</div>
                </div>
                <div class="bet-pre-right">
                  <!-- <icon name="icon-success" size="18px" color="#FFF"/> -->
                </div>
              </div>
            </template>
            <!--提前结算提示及滑块显示-->
            <template v-if="false">
              <template v-if="show_count_operate">
                  <div class="row">
                    <!-- 结算投注额 -->
                    <div class="col bet-pre-money">
                      {{i18n_t('bet_record.pre_bet_money')}}:<span class="bet-money">{{money_obj.money|format_currency}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 bet-compute-money">
                      <!--提前结算滑块展示-->
                      <!-- <vue-slider
                        :ref="`vue-slider-${index}`"
                        :adsorb="true"
                        :minRange="money_obj.min_money"
                        :maxRange="money_obj.max_money"
                        v-model="money_obj.money"
                        :data="money_obj.bet_amount_data"
                        :data-value="'id'"
                        :data-label="'name'"
                        :dot-options="[{tooltip:'none'}]"
                        @change="change_slider"
                        >
                        <template v-slot:label="{ label, active }">
                          <div :class="['vue-slider-mark-label', 'custom-label', {active}]">{{ label }}%</div>
                        </template>
                      </vue-slider> -->
                    </div>

                  </div>
              </template>
                <!--提前结算提示部分-->
              <template>
                <div class="col-12 bet-pre-Remaining">
                      <!-- 注单剩余本金 -->
                      {{i18n_t("bet_record.settlement_bet_remaining")}}: {{ lodash_.get(item,'preSettleBetAmount')|format_currency }}
                    </div>
                    <div class="col-12 bet-pre-count">
                      <!-- 提前结算可用次数 -->
                      {{i18n_t("bet_record.settlement_bet_count")}}: {{ betPreCount }}
                    </div>
                <div v-if="!show_count_operate" class="row">
                  <!-- <icon name="icon-tips" class="bet-info" size="14px" /> -->
                  <div class="col bet-tips-info">
                    <!-- TIPS:部分结算后,剩余本金不支持再次提前结算! -->
                    <span>
                      <template>
                         <!--仅支持全额结算-->
                        {{i18n_t('bet_record.settlement_only_full')}}
                      </template>
                    </span>
                  </div>
                </div>
              </template>
            </template>
          </template>

          <!--暂停提前结算-->
          <template v-else-if="false">
            <!--当点击提前结算的时候遇到封关盘 给个提示提前结算申请未通过-->
            <div class="bet-pre-stop-tip" v-if="is_cancel"> {{i18n_t('bet_record.pre_not_approved')}}</div>
            <div class="row">
              <!--暂停提前结算-->
              <div class="col bet-pre-wrap bet-pre-stop">
                <div class="bet-pre-btn">
                  {{i18n_t('bet_record.pre_bet_stop')}}
                </div>
                <div class="bet-pre-handle" v-if="UserCtr.pcs=='1'">
                  <!-- <icon name="icon-bet_pre" class="bet-pre-info" size="14px" color="#99A3B1"/> -->
                </div>
              </div>
            </div>
          </template>
        </template>
        <!--已结算下部分提前结算和全部结算显示分隔符-->
        <hr class="bet-result-separator" v-if="BetRecordLeft.selected==1 && [4,5].includes(item.settleType)" />
        <!--部分以及全部结算展示与隐藏按钮切换-->
        <template v-if="[3,4,5].includes(item.settleType)">
          <div class="row" @click="show_bet_pre_info(item.orderNo)">
            <div class="col yb-fontsize12 yb-flex-between cursor-pointer" >
              <span>{{i18n_t('bet_record.settlement_pre_info')}}</span>
              <span>
                <!-- <icon
                  name="icon-triangle"
                  size="16px"
                  :class="{'icon-pull-down': ref_data.cur_bet_pre.show_detail, 'icon-pull-up': !ref_data.cur_bet_pre.show_detail}"
                /> -->
              </span>
            </div>
          </div>
        </template>
        <!--提前结算详情部分-->
        <template v-if="ref_data.cur_bet_pre.show_detail && pre_order_list">
          <template v-for="(obj, order_index) in pre_order_list" :key="'head-'+order_index"> 
            <div  class="row" :class="{'pt10': order_index>0}">
              <div class="col yb-fontsize12 yb-flex-between cursor-pointer">
                <template v-if="obj.type==3">
                  <!--剩余本金结算显示-->
                  <span class="orange">{{i18n_t('bet_record.settlement_pre_surplus')}}</span>
                </template>
                <template v-else>
                  <!--点击拷贝订单号图标-->
                  <span class="order-copy">
                    <span class="order-no">{{obj.preOrderNo}}</span>
                    <span
                      class="copy"
                      @click="copy(obj.preOrderNo)"
                    >
                      <!-- <icon name="icon-icon_copy"/> -->
                    </span>
                  </span>
                </template>
                <!--结算时间展示-->
                <span>{{formatTime(obj.createTime,'hh:MM')}}</span>
              </div>
            </div>
            <template v-if="obj.orderStatus==2">
              <div :key="'tip-'+order_index" class="row">
                <div class="col">
                  <span class="red-bg">{{i18n_t("common.cancel")}}</span>
                </div>
              </div>
            </template>
            <div class="bet-detail-info">
              <div class="row">
                <!--结算本金-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{i18n_t('bet_record.settlement_money')}}<template v-if="obj.type==1">({{i18n_t('bet_record.part')}})</template></span>
                  <span>{{(obj.orderStatus==2?0.00:obj.preBetAmount)|format_currency}}</span>
                </div>
              </div>
              <div class="row">
                <!--返还金额-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{i18n_t('common.donate_win')}}</span>
                  <span>{{(obj.orderStatus==2?0.00:obj.settleAmount)|format_currency}}</span>
                </div>
              </div>
              <div class="row">
                <!--输/赢-->
                <div class="col yb-fontsize12 yb-flex-between">
                  <span>{{i18n_t('bet_record.lose_win')}}</span>
                  <span>{{(obj.orderStatus==2?0.00:obj.profit)|format_currency}}</span>
                </div>
              </div>
              <template v-if="obj.type==1 && obj.orderStatus!=2">
                <!--剩余本金-->
                <div class="row">
                  <div class="col yb-fontsize12 yb-flex-between">
                    <span>{{i18n_t('bet_record.surplus')}}</span>
                    <span>{{obj.remainingBetAmount|format_currency}}</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
      <!--已复制弹出框-->
      <div class="toast" v-if="toast">{{i18n_t("bet_record.copyed")}}</div>
    </template>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue"
import lodash from 'lodash'
import { format_odds, format_currency, formatTime, useMittEmit, useMittOn,  MITT_TYPES, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import  BetRecordLeft  from "src/core/bet-record/pc/bet-record-left.js"

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
  let params = {
    // 订单号
    orderNo: props.item.orderNo,
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


</style>