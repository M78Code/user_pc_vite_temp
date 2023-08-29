<!--
 * @Author: 
 * @Description: bw3新版投注记录页底部订单号和时间
-->
<template>
  <div class="item-order row mx-16 justify-between">
    <!-- 订单号 -->
    <div class="text-left ellipsis"  @click="copy">{{i18n.t('bet.order_no')}}&thinsp;<span class="yb_mr4 orderno">{{data_o.orderNo}}</span>
      <img  src="image/wwwassets/bw3/svg/copy.svg" alt=""  style="width:0.1rem" />
    </div>
    <!-- 时间 -->
    <div class="text-right">{{i18n.t('bet_record.bet_time')}}<span class="orderno">&thinsp;{{(new Date(utils.format_time_zone_time(+data_o.betTime))).Format(i18n.t('time4'))}}</span></div>
  </div>
</template>

<script setup>
import ClipboardJS from "clipboard";
// import { mapMutations } from "vuex";
import { Platform } from "quasar";
import utils from "src/core/utils/index.js";

  const props = defineProps({
    data_o: {
      type: Obeject,
      default: {},
    }
  })
  
  let utils = ref(utils)
  onUnmounted(() => {
    clearTimeout(timer)
    timer = null

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
      let orderno = data_o.orderNo
      const clipboard = new ClipboardJS(evt.target, {
        text: () => orderno
      })
      clipboard.on('success', () => {
        set_toast({
          txt: i18n.t("bet_record.copy_suc"),
        });

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
}
</style>
