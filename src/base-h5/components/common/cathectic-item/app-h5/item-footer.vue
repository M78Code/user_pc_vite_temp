<template>
  <!-- 可赢额、结算 -->
  <template>
    <!-- orderStatus 订单状态(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败) -->
    <!-- 在未结算页 -->
    <p v-if="BetRecordClass.selected !== 3" class="acount">
      <label>{{ i18n_t('app_h5.cathectic.winnable') }}：</label> 
      <template v-if="data_f.orderStatus == 1 || data_f.orderStatus == 2 || data_f.orderStatus == 4">
        <span>
          <template v-if="data_f.backAmount !== null">{{format_money2(data_f.backAmount)}}{{ i18n_t('common.unit') }}</template>
          <template v-else>{{format_money2(data_f.orderAmountTotal)}}{{ i18n_t('common.unit') }}</template>
        </span>
      </template>
      <template v-else>
        <span>{{format_money2(data_f.maxWinAmount)}}{{ i18n_t('common.unit') }}</span>
      </template>
    </p>
    <!-- 在已结算页 -->
    <p v-else class="acount">
      <label>{{i18n_t('app_h5.cathectic.settle')}}：</label> 
      <span :class="[calc_amount_settle(data_f).color]">{{ calc_amount_settle(data_f).text }}</span>
     
    </p>
    <p>
      <label>{{ i18n_t('bet_record.l/w') }}：</label>
      <span>{{ calc_settle(data_f).text }}</span>
    </p>
  </template>
  <!-- 注单状态： -->
  <p>
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <label>{{ i18n_t('app_h5.cathectic.bet_status') }}：</label>
    <template>
      <!-- 预约中、预约失效页 -->
      <span v-if="BetRecordClass.selected === 1 || BetRecordClass.selected === 2">
        <template v-if="[2, 3].includes(data_f.preOrderStatus)">{{ i18n_t('pre_record.booked_fail') }}</template>
        <template v-else-if="[4].includes(data_f.preOrderStatus)">{{ i18n_t('pre_record.canceled') }}</template>
        <template v-else>{{ i18n_t('pre_record.booking') }}</template>
      </span>

      <!-- 未结算页 -->
      <span v-else-if="BetRecordClass.selected === 0">
        <!-- 订单状态(确认中。。) -->
        <template v-if="data_f.orderStatus == '3'">
          {{ confirming.text }}
        </template>
        <!-- 订单状态(非确认中) -->
        <template v-else>
          {{ calc_text(data_f).text }}
        </template>
      </span>

      <!-- 已结算页 -->
      <span v-else>
        {{ calc_text_settle(data_f) }}
      </span>
    </template>
  </p>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { calc_text } from "src/core/bet-record/util.js";
import { i18n_t } from "src/boot/i18n.js";;
import { useMittOn, MITT_TYPES } from "src/core/mitt/"
import { outcome } from "src/core/bet-record/util.js";
import { formatTime, format_money2, format_balance } from 'src/output/index.js'
let props = defineProps({
  data_f: {
    type: Object
  }
})
// 已结算 => 结算金额
const calc_amount_settle = (data_f) => {
  let text = ''
  let color = 'black'
  text = `${format_balance(data_f.profitAmount)}${i18n_t('common.unit')}`
  if(data_f.outcome == 4 || data_f.outcome == 5) {
    color = ''
  }
  return { text, color }
}
const calc_settle = (data_f) => {
  let text = ''
  text = `${outcome[data_f.outcome]}`
  return { text }
}
// 已结算 => 注单状态
const calc_text_settle = (data_f) => {
  let text = ''
  switch (data_f.orderStatus) {
    case '0':
    case '1':
      text = i18n_t('bet_record.successful_betting')
      break;
    case '2':
      text = i18n_t('bet_record.invalid_bet')
      break
    case '3':
      text = i18n_t('bet_record.confirming')
      break
    case '4':
      text = i18n_t('bet.bet_err')
      break
    default:
      break
  }
  return text
}

// 订单确认中。。。
const confirming = reactive({
  color: 'orange',
  text: i18n_t('bet_record.confirming')
})

let mitt_c201_handle = null
/**
 *@description 处理ws订单状态推送
*@param {Object} · orderNo - 订单号, status - 订单状态(1:投注成功 2:投注失败)
*/
const c201_handle = ({ orderNo, status }) => {
  if (props.data_f.orderNo == orderNo) {
    if (status == 1) {
      // 成功
      confirming.color = 'green'
      confirming.text = i18n_t('bet_record.successful_betting')
    } else if (status == 2) {
      // 失败
      confirming.color = 'red'
      confirming.text = i18n_t('bet_record.bet_err')
    }
  }
}

onMounted(() => {
  // 如果注单状态是确认中，ws监听注单状态变化
  mitt_c201_handle = useMittOn(MITT_TYPES.EMIT_C201_HANDLE_BET_RECORD, c201_handle).on;
})
onUnmounted(() => {
  mitt_c201_handle && mitt_c201_handle()
})


</script>

<style lang="scss" scoped>
template {
  display: block;
}

p {
  line-height: 2;
  display: flex;
  justify-content: space-between;
  &.acount {
      color: var(--q-gb-bg-c-13);
    }
}
</style>