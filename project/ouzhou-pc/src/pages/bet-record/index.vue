<template>
  <div class="cont">
    <div class="record-page">
      <div class="record-page-main">
        <!-- 注单历史头部 -->
        <record_head @tab_change="tab_change" />
        <!-- 注单历史筛选区域 -->
        <record_select :current_tab="current_tab" @itemFilter="itemFilter" />
        <!-- 注单历史表格组件 -->
        <record_table :timeType="timeType" :current_tab="current_tab" ref="tableRef" @itemFilter="itemFilter" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onActivated } from 'vue'
import record_head from './compoments/record_head.vue'
import record_select from './compoments/record_select.vue'
import record_table from './compoments/record_table.vue'
import {LayOutMain_pc} from "src/output/project/index.js";

const current_tab = ref('unsettled')
const tableRef = ref(null)
const timeType = ref(null)
//  tab 切换
const tab_change = (val) => {
  current_tab.value = val
}
const itemFilter = (obj) => {
  const {timeType: objTimeType, ...rest} = obj || {}
  timeType.value = objTimeType;
  const orderStatus = current_tab.value == 'settled' ? 1 : 0
  tableRef.value.getTableData({
    ...(current_tab.value == 'settled' ? {
      timeType: objTimeType || ''
    } : {}),
    ...rest,
    orderStatus
  })
}

onMounted(() => {
  LayOutMain_pc.set_oz_show_right(false)
  LayOutMain_pc.set_oz_show_left(false)
})
onActivated(() => {
  LayOutMain_pc.set_oz_show_right(false)
  LayOutMain_pc.set_oz_show_left(false)
})
</script>

<style lang="scss" scoped>
.cont {
  min-height: 100vh;
  background-color: var(--q-gb-bg-c-6);
}

.header {
  margin-bottom: 10px;
}

.record-page {
  // width: 100vw;
  width: 100%;
  height: calc(100vh - 78px);
  background-color: var(--q-gb-bg-c-6);
  margin: 0 auto;

  .record-page-main {
    width: 100%;
    height: 100%;
    background-color: var(--q-gb-bg-c-4);
    //  margin: 0 200px;
  }
}
</style>