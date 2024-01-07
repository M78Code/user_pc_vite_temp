<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <!-- 投注额 -->
  <p><label>{{i18n_t('bet_record.bet_val')}}：</label> <span class="font500">{{format_money2(data_f.orderAmountTotal)}}{{ i18n_t('common.unit') }}</span></p>
  
  <template>
    <!-- orderStatus 订单状态(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败) -->
    <!-- 在未结算页 => 可赢额 -->
    <p v-if="BetRecordClass.selected !== 3" class="acount">
      <label>{{ i18n_t('app_h5.cathectic.winnable') }}：</label> 
      <template v-if="data_f.orderStatus == 1 || data_f.orderStatus == 2 || data_f.orderStatus == 4">
        <span class="font500">
          <template v-if="data_f.backAmount !== null">{{format_money2(data_f.backAmount)}}{{ i18n_t('common.unit') }}</template>
          <template v-else>{{format_money2(data_f.orderAmountTotal)}}{{ i18n_t('common.unit') }}</template>
        </span>
      </template>
      <template v-else>
        <span class="font500">{{format_money2(data_f.maxWinAmount)}}{{ i18n_t('common.unit') }}</span>
      </template>
    </p>
    <!-- 在已结算页 -->
    <template v-else>
      <!-- 结算  -->
      <p>
        <label class="acount">{{i18n_t('app_h5.cathectic.settle')}}：</label> 
        <span :class="{'acount': data_f.profitAmount > 0}">
          {{ showText(data_f) }}
          {{ format_balance(data_f.profitAmount) }}
          {{ currency_code[UserCtr.currency] }}</span>
      </p>
      <!-- 输/赢  -->
      <!-- <p>
        <label>{{i18n_t('bet_record.l/w')}}：</label> 
        <span>
          {{ calc_text(data_f).text }}
        </span>
      </p> -->
    </template>
  </template>

  <!-- 串关显示 -->
  <template v-if="data_f.seriesType !== '1' && data_f.seriesType !== '3'">
    <p>
      <!-- 投注单号 -->
      <label>{{i18n_t('bet.order_no')}}：</label> 
      <span  @click="copy">{{data_f.orderNo}} 
        <img :src="compute_local_project_file_path('/image/svg/copy.svg')" alt=""  style="width:0.1rem" />
      </span>
    </p>
    <p>
      <!-- 投注时间 -->
      <label>{{i18n_t('bet_record.time')}}：</label>
      <span>{{formatTime(+data_f.betTime, 'yyyy-mm-dd hh:MM')}}</span>
    </p>
  </template>

  <!-- 注单状态： -->
  <p>
    <label>{{ i18n_t('app_h5.cathectic.bet_status') }}：</label>
    <template>
      <!-- 预约中、预约失效页 -->
      <span v-if="BetRecordClass.selected === 1 || BetRecordClass.selected === 2">
        <template v-if="[2, 3].includes(data_f.preOrderStatus)"> <span class="font-style">{{ i18n_t('pre_record.booked_fail') }}</span> </template>
        <template v-else-if="[4].includes(data_f.preOrderStatus)"><span class="font-style">{{ i18n_t('pre_record.canceled') }}</span> </template>
        <template v-else><span class="font-style-blue">{{ i18n_t('pre_record.booking') }}</span> </template>
      </span>

      <!-- 未结算页、已结算页 -->
      <template v-else>
        <!-- 订单状态(确认中。。) -->
        <span v-if="data_f.orderStatus == '3'" :class="confirming.color">
          {{ confirming.text }}
        </span>
        <!-- 订单状态(非确认中) -->
        <span v-else :class="calc_text_only_status(data_f).color">
          {{ calc_text_only_status(data_f).text }}
        </span>
      </template>
    </template>
  </p>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { calc_text_only_status, calc_text, outcome } from "src/core/bet-record/util.js";
import { i18n_t } from "src/boot/i18n.js";;
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"
import { formatTime, format_money2, format_balance, compute_local_project_file_path } from 'src/output/index.js'
import ClipboardJS from "clipboard";
import { Platform } from "quasar";
let props = defineProps({
  data_f: {
    type: Object
  }
})

/**
 * 输/赢 文案
 */
const showText = (data_f) => {
  // 注单无效、失败(显示 已确认)
  if(data_f.orderStatus == '2' || data_f.orderStatus == '4') {
    return i18n_t('bet_record.bet_no_status17')
  }
  // (和)
  if(data_f.profitAmount == 0) {
    return i18n_t('bet_record.bet_no_status16')
  }
  // (赢)
  if(data_f.profitAmount > 0) {
    return i18n_t('bet_record.bet_no_status04')
  }
  // (输)
  if(data_f.profitAmount < 0) {
    return i18n_t('bet_record.bet_no_status03')
  }
}

  /**
 *@description 复制订单号
  *@param {Object} evt 事件对象
  */
  const copy = (evt) => {
  let orderno = props.data_f.orderNo
  const clipboard = new ClipboardJS(".text-left", {
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
.acount {
      color: var(--q-gb-bg-c-13);
    }
  .red {
    color: #D2D2D2
  }

  .black {
    color: #666666
  }

  .gray {
    color: #D2D2D2
  }
  .font500 {
    font-weight: 500;
  }
  .font-style{
    color:#F53F3F
  }
  .font-style-blue{
    color:#127DCC
  }
</style>