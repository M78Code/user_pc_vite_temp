<!--
 * @Author: cooper
 * @Date: 2023-06-24 17:13:55
 * @Description: 注单历史
-->
<template>
  <div class="cont">
    <div class="header">
      <layout-header />
    </div>
    <div class="record-page">
      <div class="record-page-main">
        <!-- 注单历史头部 -->
        <record_head @tab_change = "tab_change" />
        <!-- 注单历史筛选区域 -->
        <record_select :current_tab="current_tab" @itemFilter="itemFilter" />
        <!-- 注单历史表格组件 -->
        <record_table :current_tab="current_tab" ref="tableRef"  @itemFilter="itemFilter" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import record_head from "./compoments/record_head.vue";
import record_select from "./compoments/record_select.vue";
import record_table from "./compoments/record_table.vue";
import layoutHeader from "project_path/src/layouts/layout-header.vue";
const current_tab = ref('unsettled')
const tableRef = ref(null)

//  tab 切换
const tab_change = (val)=>{
  current_tab.value = val
}

const itemFilter = (obj)=>{
 const orderStatus = current_tab.value=='settled'?1:0
 tableRef.value.getTableData({...obj,orderStatus})
}

</script>

<style lang="scss" scoped>
.cont{
  min-height: 100vh;
  background-color: #E2E2E2;
}
.header{
  margin-bottom: 10px;
}
 .record-page{
  // width: 100vw;
   width: 1430px;
  height: 100%;
  background-color: #e2e2e2;
  margin: 0 auto;
  .record-page-main{
   width: 100%;
    height: 100%;
    background-color: #ffffff;
    //  margin: 0 200px;
  }
 }
</style>
