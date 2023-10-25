<!--
 * @Author:
 * @Date:
 * @Description: bw3新版投注记录的页每一条注单（矩形框）
-->
<template>
    <div v-if="show_bet_record" class="common-cathectic-item hairline-border">
    <!-- 单关、串关内容显示 -->
    <template>
      <item-simple-body v-if="item_data.seriesType == '1'" :main_item="main_item" :data_b="item_data"></item-simple-body>
      <item-multiple-body v-else :main_item="main_item" :data_b="item_data"></item-multiple-body>
    </template>
    <!-- 未结算列表 => 投注记录页提前结算的按钮、滑块 -->
    <early-settle v-if="main_item == '0'" :item_data="item_data"></early-settle>
    <!-- 已结算列表 => 提前结算详情 -->
    <early-settled-detail v-if="main_item == '1'"></early-settled-detail>
    <!-- 预约列表 => 取消预约 -->
    <cancel-reserve v-if="main_item == '2'"></cancel-reserve>
  </div>
</template>

<script setup>
import itemSimpleBody from "src/base-h5/components/common/cathectic-item/app-h5/item-simple-body.vue";
import itemMultipleBody from "src/base-h5/components/common/cathectic-item/app-h5/item-multiple-body.vue";
import earlySettle from "src/base-h5/components/common/cathectic-item/app-h5/early-settle.vue";
import earlySettledDetail from "src/base-h5/components/common/cathectic-item/app-h5/early-settled-detail.vue";
import cancelReserve from "src/base-h5/components/common/cathectic-item/app-h5/cancel-reserve.vue";
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
    main_item: {
      type: [String, Number],
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
template {
  display: block;
}
.common-cathectic-item {
  width: 100%;
  border-radius: 0.1rem;
  background: var(--q-gb-bg-c-15);
  overflow: hidden;
  margin:  0 0 0.1rem;
  padding-bottom: 0.2rem;
}
.item-header {
  height: 0.38rem;
  line-height: 0.34rem;
}
.hairline-border {
  &::after {
    border: 1px solid var(--q-gb-bd-c-3) !important;
  }
}
</style>
