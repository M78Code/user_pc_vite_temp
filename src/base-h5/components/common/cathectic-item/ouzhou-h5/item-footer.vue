<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框底部
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="item-footer yb_px14 yb_pt8 row yb_fontsize12">
    <!-- 左 -->
    <div class="col-4">
      <p class="top-p">{{i18n_t('bet.bet_book_amount')}}</p>
      <p class="yb_fontsize14 money-p fw_700" v-if="data_f.orderAmountTotal">{{format_money2(data_f.orderAmountTotal)}}</p>
    </div>

    <!-- 中 -->
    <div class="col-4">
      <!-- 订单状态orderStatus(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败) -->
      <template v-if="data_f.orderStatus == 1 || data_f.orderStatus == 2 || data_f.orderStatus == 4">
        <p class="top-p">{{i18n_t('bet_record.go_back')}}</p>
        <!-- 有返还金额取返还金额，没有返还金额取投注金额 -->
        <p class="yb_fontsize14 money-p fw_700 red">
          <template v-if="data_f.backAmount !== null">{{format_money2(data_f.backAmount)}}</template>
          <template v-else>{{format_money2(data_f.orderAmountTotal)}}</template>
        </p>
      </template>
      <template v-else>
        <!-- 预约失效 -->
        <template v-if="[2,3,4].includes(data_f.preOrderStatus)">
          <p class="top-p"> {{i18n_t('bet_record.bet_refund')}} </p>
          <p class="yb_fontsize14 money-p fw_700">
            <!-- 留空处理 -->
            <template v-if="data_f.acCode">- -</template>
            <!-- 返还金额 -->
            <template v-else>{{format_money2(data_f.backAmount)}}</template>
          </p>
        </template>
        <template v-else>
          <p class="top-p">{{i18n_t('bet_record.bet_max_win')}}</p>
          <p class="yb_fontsize14 money-p fw_700">
            <!-- 留空处理 -->
            <template v-if="data_f.acCode">- -</template>
            <!-- 最高金额 -->
            <template v-else>{{format_money2(data_f.maxWinAmount)}}</template>
          </p>
        </template>
      </template>
    </div>

    <!-- 右 -->
    <div class="text-right" style="margin-left:auto" v-if='BetRecordClass.selected !== 2'>
      <!-- 订单状态(确认中。。) -->
      <p v-if="data_f.orderStatus == '3'" :class="confirming.color" class="yb_fontsize14 fw_700">
        {{confirming.text}}
      </p>
      <!-- 订单状态(非确认中) -->
      <p v-else :class="calc_text(data_f).color" class="yb_fontsize14 fw_700">
        {{calc_text(data_f).text}}
      </p>
    </div>

  </div>
</template>

<script setup>
// import { mapGetters } from "vuex";
import { format_money2 } from "src/output/index.js"
import { i18n_t } from "src/boot/i18n.js";
import { reactive, onMounted, onUnmounted } from 'vue'
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import { calc_text_only_status, calc_text } from "src/core/bet-record/h5/util.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"

  const props = defineProps({
    data_f: {
      type: Object
    }
  })
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
    if (props.data_f.orderNo == orderNo ) {
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
.item-footer {
  height: 0.5rem;
  background: var(--q-gb-bg-c-10);
  .result-p {
    line-height: 0.12rem;
  }
  .top-p {
    margin-bottom: -0.02rem;
    min-height: 0.18rem;
    color: var(--q-gb-bg-c-3);
  }
  .money-p {
    color: var(--q-gb-bg-c-13);
  }
  .green {
    color: green;
  }

  .gray {
    color: var(--q-gb-bg-c-3);
  }
  .orange {
    color:  var(--q-gb-bg-c-1);
  }
  .red {
    color: var(--q-gb-bg-c-1);
  }
  .black {
    color: var(--q-gb-bg-c-13);
  }
}
.text-right {
  p {
    line-height:0.36rem;
    padding-right: 0.3rem;
  }
}
</style>