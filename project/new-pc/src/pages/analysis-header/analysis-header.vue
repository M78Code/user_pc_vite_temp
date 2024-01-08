<!--
 * @Author: 
 * @Date: 2021-11-03 13:44:42
 * @Description: 足篮赛事分析页
 * @Path: 
-->
<template>
  <div class="analysis">
    <!-- 赛事分析 -->
    <simple-header><span>{{ i18n_t('common.analysis') }}</span></simple-header>
    <analysis-page />
  </div>
</template>

<script setup>
import simpleHeader from "src/base-pc/components/site-header/simple-header.vue";
// import analysisPage from "/src/base-pc/components/analysis/index.vue";
import analysisPage from "./analysis/index.vue";
</script>

<style lang="scss" scoped>
.analysis {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 1000px;
  width: 100vw;
}
</style>