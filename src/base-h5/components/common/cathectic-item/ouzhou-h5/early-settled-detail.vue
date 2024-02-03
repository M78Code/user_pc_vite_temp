<!--
 * @Desc: 投注记录页提前结算的按钮、滑块和提前结算详情
 * @Author:
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div v-if="details_show_btn" class="warp">
    <div class="settle-btn" @click="fetch_early_settle_detail">
      <span>{{ i18n_t('early.list1') }}</span>
      <icon-wapper :name="detail_show_info ? 'icon-triangle' : 'icon-triangle1'" />
    </div>
      <!-- 滑块 -->
      <q-slide-transition>
        <div v-show="detail_show_info && presettleorderdetail_data.length" class="slider-wrap">
          <template v-for="(item, index) in presettleorderdetail_data" :key="index">
            <div class="body-main number_family">
                <!-- 单号、日期 -->
                <p>
                  <label class="number"  @click="copy">
                    {{ item.preOrderNo }}
                    <img :src="compute_local_project_file_path('/image/svg/copy.svg')" alt=""  style="width:0.1rem" />
                  </label> 
                  <span>{{formatTime(+item.createTime, 'mm/DD HH:MM')}}</span>
                </p>
                <!-- 结算本金  item.orderStatus == 2(注单被取消) -->
                <p><label>{{ item.remainingBetAmount ? i18n_t('early.list7') : i18n_t('early.list2') }}：</label> <span>{{ item.orderStatus == 2 ? '0.00' : (+item.preBetAmount).toFixed(2) }}</span></p>
                <!-- 返还金额 -->
                <p><label>{{ i18n_t('early.list4') }}：</label> <span>{{ item.orderStatus == 2 ? '0.00' : (+item.settleAmount).toFixed(2) }}</span></p>
                <!-- 输/赢 -->
                <p><label>{{ i18n_t('early.list5') }}：</label> <span>{{ item.orderStatus == 2 ? '0.00' : (+item.profit).toFixed(2) }}</span></p>
              </div>
          </template>
        </div>
      </q-slide-transition>

  </div>
</template>

<script setup>
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import { api_betting } from "src/api/index.js";
import { i18n_t, compute_local_project_file_path } from 'src/output/index.js'
import { IconWapper } from 'src/components/icon'
import { ref, computed, onMounted } from 'vue'
import { Platform } from "quasar";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"
import { formatTime } from 'src/output/index.js'
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

/**
 *@description 复制订单号
  *@param {Object} evt 事件对象
  */
const copy = (evt) => {
  let orderno = props.item_data.orderNo
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
</script>

<style lang="scss" scoped>
template {
  display: block;
}
.warp {
  margin: 0 0.14rem;
}
.body-main {
    p {
      line-height: 3;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--q-gb-bg-c-5);
      label.number {
        color: var(--q-gb-bg-c-1);
      }
    }
  }
  .settle-btn {
    padding-top: 0.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.16rem;
    line-height: 0.4rem;
    border-bottom: 1px solid var(--q-gb-bg-c-5);
    i {
      font-size: 0.24rem;
    }
  }
</style>