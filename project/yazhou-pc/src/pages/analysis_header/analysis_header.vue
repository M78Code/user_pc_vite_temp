<!--
 * @Author: 
 * @Date: 2021-11-03 13:44:42
 * @Description: 足篮赛事分析页
 * @Path: 
-->
<template>
  <div class="analysis">
    <!-- 赛事分析 -->
    <simple-header><span>{{$root.$t('common.analysis')}}</span></simple-header>
    <analysis-page/>
  </div>
</template>

<script>
import simpleHeader from "src/project/yabo/components/site_header/simple_header";
import analysisPage from "src/public/components/analysis/index";
export default {
  components: {
    simpleHeader,
    analysisPage
  },
};
</script>

<style lang="scss" scoped>
.analysis {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 1000px;
}
</style>