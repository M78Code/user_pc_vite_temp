<!--
 * @Author:
 * @Date:
 * @Description: bw3新版投注记录的页每一条注单（矩形框）
-->
<template>
  <div
      v-if="show_bet_record"
      class="common-cathectic-item hairline-border-ky" :class="{'common-cathectic-item2': key2==0,'common-cathectic-item3': len==key2+1,}" v-show="(!is_early || (is_early && is_show_early_settle)) && !is_show_pre">
    <div v-if="item_data.seriesType != '1'" class="yb_mx10 item-header yb_fontsize14 yb_py4">
      {{item_data.seriesValue}}
      <!-- <template v-if="item_data.seriesType != 3">&nbsp;&nbsp;@&thinsp;{{mix_odds_sum}}</template>  -->
    </div>
    <!-- bw3新版矩形框中部 -->
    <item-body :is_pre="is_pre" :data_b="item_data"></item-body>
    <!-- bw3新版矩形框底部 -->
    <item-footer :is_pre="is_pre" :data_f="item_data"></item-footer>
    <!-- 投注记录页提前结算的按钮、滑块和提前结算详情 -->
    <early-settle :item_data="item_data"></early-settle>
    <!-- bw3新版投注记录页底部订单号和时间 -->
    <item-order :data_o="item_data"></item-order>
  </div>
</template>

<script setup>
import itemBody from "src/base-h5/components/common/cathectic-item/item-body.vue";
import itemFooter from "src/base-h5/components/common/cathectic-item/item-footer.vue";
import itemOrder from "src/base-h5/components/common/cathectic-item/item-order.vue";
import earlySettle from "src/base-h5/components/common/cathectic-item/early-settle.vue";
import lodash from 'lodash';
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt/"


// 是否显示注单记录
let show_bet_record = ref(true)
// 该注单是否存在提前结算
let is_show_early_settle = ref(false)
const props = defineProps(
  {
    item_data: {
      type: Object

    },
    key2: {
      type: Number

    },
    len: {
      type: Number

    },
    is_early: {
      type: Boolean

    },
    is_pre: {
      type: Boolean

    },
    is_show_pre: {
      type: Boolean

    }
  }
)

const mix_odds_sum = computed(() => {
  if (props.item_data.seriesType != '1') {
    const ordervos_data = lodash.get(props.item_data, 'orderVOS') || []
    let odds_sum = 1
    for (let i = 0; i < ordervos_data.length; i++) {
      let odd = ordervos_data[i].marketType == 'HK' ? $mathjs.add(ordervos_data[i].oddFinally, 1) : ordervos_data[i].oddFinally
      odds_sum = $mathjs.multiply(odd, odds_sum)
    }
    if (ordervos_data.length > 0) {
      if (props.item_data.managerCode == 4) {
        return odds_sum.toFixed(3)
      } else {
        return odds_sum.toFixed(2)
      }
    }
  }
  return ''
})
// 监听 重载注单页面
let off_ = () => {}
onMounted(() => {
  is_show_early_settle.value = props.item_data.is_show_early_settle
  let { off: off_} =useMittOn(MITT_TYPES.EMIT_RELOAD_NOTE_SHEET, reload_note_sheet)
})

// 重载注单页面
const reload_note_sheet = () => {
  show_bet_record = false
  nextTick(() => {
    show_bet_record = true
  })
}
onUnmounted(() => {
  off_()
})

</script>

<style lang="scss" scoped>
.common-cathectic-item {
  width: 3.75rem;
  margin: 0.04rem auto;
  border-radius: 0.08rem;
  background: var(--q-gb-bg-c-15);
}
.common-cathectic-item2 {
  margin-top: 0;
}
.common-cathectic-item3 {
  margin-bottom: 0;
}
.item-header {
  height: 0.38rem;
  color: var(--q-gb-t-c-18);
}

.hairline-border-ky {
    position: relative;
    border-radius: 0.08rem;

    &::after {
      content: "";
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      border: 1px solid var(--q-gb-t-c-1) !important;
      border-radius: 0.16rem;
      width: 200%;
      height: 200%;
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      -webkit-transform-origin: left top;
      transform-origin: left top;
    }
  }
</style>
