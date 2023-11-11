<template>
  <tab-date />
  <!--赛事列表-->
  <div class="match-list-page">
    <match-container />
  </div>
</template>
<script setup>

import tabDate from './tab-date/tab-date.vue';
import MatchContainer from "src/base-h5/components/match-list/index.vue";


</script>
<style scoped lang="scss">
/* ************** 赛事列表包装器 **************** -S */
.match-list-page {
  width: 100%;
  height: calc(100% - 2.1rem);
  overflow-y: hidden;
  position: relative;
  .match-list-container{
    height: 100%;
    background: #fff !important;
    :deep(.scroll-wrapper){
      background: #fff !important;
      .s-w-item{
        background: #fff !important;
      }
    }
  }
}
</style>
