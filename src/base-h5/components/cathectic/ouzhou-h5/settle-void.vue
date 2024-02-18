<!--
 * @Author:
 * @Date:
 * @Description: 投注记录页无数据时展示去投注的界面
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="settle-void" @touchmove.prevent>
    <img :src="compute_local_project_file_path('/image/bet/no-data.png')">
    <p>{{i18n_t('common.no_data')}}</p>
  </div>
</template>

<script setup>
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import {  i18n_t, compute_css_obj, compute_local_project_file_path } from 'src/output/index.js'
</script>

<style lang="scss" scoped>
template {
  display: block;
}
.settle-void {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 4rem;
  border-radius: 0.1rem;
  opacity: 0;
  animation: opacityAnimate 0.5s linear;
  animation-fill-mode: forwards;
  img {
    width: 2.4rem;
    height: 2.4rem;
  }
  p {
    font-size: 0.16rem;
  }
}
@keyframes opacityAnimate {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>