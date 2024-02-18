<!--
 * @Author:
 * @Date:
 * @Description: 投注记录页无数据时展示去投注的界面
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="settle-void" @touchmove.prevent :style="compute_css_obj({key: 'fkh5_bg_jiesuan'})">
    <img :src="compute_local_project_file_path('/image/bet/img_loading.png')">
    <template>
      <!-- 数据加载中。。。 -->
      <p class="centerText">{{ i18n_t('app_h5.cathectic.data_loading') }}</p>
    </template>
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
.centerText{
  text-align: center;
  color: rgba(255, 255, 255, 0.60);
  font-size: 12px;
  font-weight: 400;
  word-wrap: break-word;
  margin: 8px auto;
  >a{
    color: #179CFF;
  }
}
.settle-void {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 4rem;
  border-radius: 0.1rem;
  background-color: var(--q-gb-bg-c-23);
  background-size: cover;
  // opacity: 0;
  // animation: opacityAnimate 0.2s linear;
  // animation-fill-mode: forwards;
  img {
    width: 1.8rem;
    height: auto;
  }
  p {
    color: var(--q-gb-bg-c-6);
    font-size: 0.14rem;
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