<template>
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
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"

let props = defineProps({
  data_f: {
    type: Object
  }
})

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
}
</style>
