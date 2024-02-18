<!--
 * @Author:
 * @Description: bw3新版投注记录页底部订单号和时间
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="item-order row justify-between">
    <!-- 订单号 -->
    <div class="text-left row ellipsis"  @click="copy">
      <p class="title">{{i18n_t('bet.order_no')}}</p>
      <span class="yb_mr4 orderno fw_700">{{data_o.orderNo}}</span>
      <img :src="compute_local_project_file_path('/image/svg/copy.svg')" alt=""  style="width:0.1rem" />
    </div>
    <!-- 时间 i18n_t('bet_record.bet_time')   .Format(i18n_t('time4'))-->
    <div class="text-right row">
      <p class="title">{{i18n_t('bet_record.time')}}</p>
      <span class="orderno fw_700">{{formatTime(+data_o.betTime, 'mm/DD HH:MM')}}</span>
    </div>
  </div>
</template>

<script setup>
import ClipboardJS from "clipboard";
// import { mapMutations } from "vuex";
import { Platform } from "quasar";
import { ref, onUnmounted } from 'vue'
import { formatTime } from 'src/output/index.js'
import { compute_local_project_file_path } from 'src/output/index.js'
import { i18n_t } from "src/boot/i18n.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
//国际化


  const props = defineProps({
    data_o: {
      type: Object,
      default: {},
    }
  })

  onUnmounted(() => {
    // clearTimeout(timer)
    // timer = null

    // for (const key in $data) {
    //   $data[key] = null
    // }
  })
    // ...mapMutations(["set_toast"]),

    /**
     *@description 复制订单号
     *@param {Object} evt 事件对象
     */
  const copy = (evt) => {
      let orderno = props.data_o.orderNo
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
            // console.error(error)
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
.item-order {
  height: 0.4rem;
  line-height: 0.5rem;
  padding: 0 0.14rem;
}
.title {
  color: var(--q-gb-bg-c-14);
  margin-right: 0.04rem;
}
</style>