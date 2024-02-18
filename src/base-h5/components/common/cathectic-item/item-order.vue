<!--
 * @Author:
 * @Description: bw3新版投注记录页底部订单号和时间
-->
<template>
  <div class="item-order row mx-16 justify-between">
    <!-- 订单号 -->
    <div class="text-left ellipsis"  @click="copy">
      {{i18n_t('bet.order_no')}}&thinsp;
      <span class="yb_mr4 orderno">{{data_o.orderNo}}</span>
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/copy.svg`" alt=""  style="width:0.1rem" />
    </div>
    <!-- 时间 i18n_t('bet_record.bet_time')   .Format(i18n_t('time4'))-->
    <div class="text-right">{{i18n_t('bet_record.bet_time')}}<span class="orderno">&thinsp;{{formatTime(+data_o.betTime, 'mm/DD HH:MM')}}</span></div>
  </div>
</template>

<script setup>
import ClipboardJS from "clipboard";
// import { mapMutations } from "vuex";
import { Platform } from "quasar";
import { ref, onUnmounted } from 'vue'
import { formatTime } from 'src/output/index.js'
import { i18n_t } from "src/boot/i18n.js";
import { LOCAL_PROJECT_FILE_PREFIX,useMittEmit,MITT_TYPES } from "src/output/index.js"
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
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('bet_record.copy_suc'))
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
.item-order {
  font-size: 0.11rem;
  height: 0.36rem;
  line-height: 0.36rem;
  color: var(--q-gb-t-c-27);
}
</style>