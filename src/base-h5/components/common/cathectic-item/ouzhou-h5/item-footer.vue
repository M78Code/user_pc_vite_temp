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
      <p class="top-p">Bet Amoint</p>
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
        <p class="top-p" v-if="[2,3].includes(data_f.preOrderStatus)||data_f.preOrderStatus == 4">
          <!-- {{i18n_t('bet_record.bet_refund')}} -->
        </p>
        <p class="top-p" v-else>{{i18n_t('bet_record.bet_max_win')}}</p>
        <p class="yb_fontsize14 money-p fw_700" v-if="[2,3].includes(data_f.preOrderStatus)||data_f.preOrderStatus == 4">
          <!-- 留空处理 -->
          <!-- <template v-if="data_f.acCode">- -</template> -->
          <!-- 返还金额 -->
          <!-- <template v-else>{{format_money2(data_f.backAmount)}}</template> -->
        </p>
        <p class="yb_fontsize14 money-p fw_700" v-else>
          <!-- 留空处理 -->
          <template v-if="data_f.acCode">- -</template>
          <!-- 最高金额 -->
          <template v-else>{{format_money2(data_f.maxWinAmount)}}</template>
        </p>
      </template>
    </div>

    <!-- 右 -->
    <div class="text-right" style="margin-left:auto">
      <!-- <p class="top-p">{{calc_settle_score}}</p> -->
      <!-- 订单状态 -->
      <p :class="BetRecordClass.calc_text(data_f).color" class="yb_fontsize14 fw_700" style="line-height:0.36rem;padding-right: 0.3rem;">
        {{BetRecordClass.calc_text(data_f).text}}
      </p>
    </div>

  </div>
</template>

<script setup>
// import { mapGetters } from "vuex";
import { format_money2 } from "src/core/format/index.js"
import { i18n_t } from "src/boot/i18n.js";
import BetRecordClass from "src/core/bet-record/bet-record.js";

  const props = defineProps({
    data_f: {
      type: Object
    }
  })

</script>

<style lang="scss" scoped>
.item-footer {
  height: 0.5rem;
  background: var(--q-gb-bg-c-18);
  .result-p {
    line-height: 0.12rem;
  }
  .top-p {
    margin-bottom: -0.02rem;
    min-height: 0.18rem;
    color: var(--q-gb-bg-c-8);
  }
  .money-p {
    color: var(--q-gb-bg-c-1);
  }
  .green {
    color: green;
  }

.gray {
    color: var(--q-gb-bg-c-6);
  }
  .orange {
    color:  var(--q-gb-bg-c-12);
  }
  .red {
    color: var(--q-gb-bg-c-12);
  }
  .black {
    color: var(--q-gb-bg-c-1);
  }
}
</style>
