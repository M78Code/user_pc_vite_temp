<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <template v-if="details_show_btn">
    <!-- 提前兑现规则申明 -->
    <!-- <early-settle-tips/> -->
    <div class="warp">
      <!-- 滑块 -->
      <q-slide-transition>
        <div v-show="detail_show_info && presettleorderdetail_data.length" class="slider-wrap">
          <template v-for="(item, index) in presettleorderdetail_data" :key="index">
            <!-- 注单被取消 -->
            <template v-if="item.orderStatus == 2">
              <p class="font-style">{{ i18n_t('app_h5.cathectic.cash_failed') }}</p>
              <div class="body-main">
                <!-- 结算本金 -->
                <p><label>{{ item.remainingBetAmount ? i18n_t('early.list7') : i18n_t('early.list2') }}：</label> <span>0.00</span></p>
                <!-- 输/赢 -->
                <p><label>{{ i18n_t('early.list5') }}：</label> <span>0.00</span></p>
                <!-- 返还金额 -->
                <p><label>{{ i18n_t('early.list4') }}：</label> <span>0.00</span></p>
              </div>              
            </template>
            <template v-else>
              <p class="font-style">全部提前兑现成功</p>
              <div class="body-main">
                <!-- 结算本金 -->
                <p><label>{{ item.remainingBetAmount ? i18n_t('early.list7') : i18n_t('early.list2') }}：</label> <span class="font-style">{{ (+item.preBetAmount).toFixed(2) }}</span></p>
                <!-- 输/赢 -->
                <p><label>{{ i18n_t('early.list5') }}：</label> <span class="font-style">{{ (+item.profit).toFixed(2) }}</span></p>
                <!-- 返还金额 -->
                <p><label>{{ i18n_t('early.list4') }}：</label> <span class="font-style">{{ (+item.settleAmount).toFixed(2) }}</span></p>
              </div>
            </template>
          </template>
        </div>
      </q-slide-transition>
      <div class="settle-btn" :class="detail_show_info ? 'up' : 'down'" @click="fetch_early_settle_detail">
        <span class="font-style">提前兑现详情</span>
        <img :src="compute_local_project_file_path('/image/gif/change.gif')">
      </div>
    </div>
  </template>
  
</template>

<script setup>
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import earlySettleTips from "src/base-h5/components/common/cathectic-item/app-h5/early-settle-tips.vue";
import { api_betting } from "src/api/index.js";
import {  i18n_t, compute_css_obj, compute_local_project_file_path } from 'src/output/index.js'
import { ref, computed, onMounted } from 'vue'
const props = defineProps({
  item_data: {
    type: Object
  }
})

// 展开 提前结算详情列表 的按钮是否显示
let details_show_btn = ref(false)
// 提前兑现详情信息
let detail_show_info = ref(false)
// 提前结算详情数据
let presettleorderdetail_data = ref([])

onMounted(() => {
  // 已发生过提前结算或者提前结算取消
  if (props.item_data.preBetAmount > 0 || [3, 4, 5].includes(props.item_data.settleType)) {
    details_show_btn.value = true;
  }
})

/**
 *@description 获取提前结算详情数据
 */
 const fetch_early_settle_detail = () => {
  if (detail_show_info.value) {
    detail_show_info.value = false;
  } else {
    api_betting.get_pre_settle_order_detail({ orderNo: props.item_data.orderNo }).then((res) => {
      let { code, data = [] } = res || {};
      if (code == 200) {
        presettleorderdetail_data.value = data;
        detail_show_info.value = true;
      }
    }).catch((err) => {
      console.error(err);
    });
  }
}

</script>

<style lang="scss" scoped>
template {
  display: block;
}
.warp {
  margin: 0 0.14rem;
  border-top: 1px solid var(--q-gb-bd-c-4);
}
.slider-wrap {
  font-size: 0.14rem;
  border-bottom: 1px solid var(--q-gb-bd-c-4);
  & > p {
    line-height: 3;
  }
}
.body-main {
    p {
      line-height: 2;
      display: flex;
      justify-content: space-between;
      label {
        color: var(--q-gb-t-c-19);
      }
    }
  }
.font-style{
  color: var(--q-gb-t-c-18);
}

  .settle-btn {
    font-size: 0.14rem;
    padding-top: 0.1rem;
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
</style>