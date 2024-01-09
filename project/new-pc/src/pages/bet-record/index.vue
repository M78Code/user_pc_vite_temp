<template>
  <div class="cont">
    <div style="display: none;">{{ BetRecordHistory.bet_record_version }}</div>
    <div class="record-page">
      <div class="record-page-main">
        <!-- 注单历史头部 -->
        <record_head />
        <!-- 注单历史筛选区域 -->
        <record_select />
        <!-- 注单历史表格组件 -->
        <record_table />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onActivated } from 'vue'
import record_head from './compoments/record_head.vue'
import record_select from './compoments/record_select.vue'
import record_table from './compoments/record_table.vue'
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import BetRecordHistory from "src/core/bet-record/pc/bet-record-history.js"


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
  background-color: var(--q-gb-bd-c-8);
}

.header {
  margin-bottom: 10px;
}

.record-page {
  // width: 100vw;
  width: 100%;
  height: calc(100vh - 78px);
  margin: 0 auto;

  .record-page-main {
    width: 100%;
    height: 100%;
  }
}
</style>