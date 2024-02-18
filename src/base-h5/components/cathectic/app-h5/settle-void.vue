<!--
 * @Author:
 * @Date:
 * @Description: 投注记录页无数据时展示去投注的界面
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="settle-void" @touchmove.prevent :style="compute_css_obj({key: 'fkh5_bg_jiesuan'})">

    <!-- <img :src="compute_local_project_file_path('/image/bet/def_nobetrecord.png')"> -->
    <div :style="compute_css_obj({key: 'h5-kyapp-no-data'})"></div>

    <template>
      <p class="centerText">{{ i18n_t( 'app_h5.cathectic.' + formatInternationalText(BetRecordClass.selected) ) }}</p>
      <!-- <p>如需查询历史记录，请访问历史记录</p> -->
    </template>
  </div>
</template>

<script setup>
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import {  i18n_t, compute_css_obj, compute_local_project_file_path } from 'src/output/index.js'

const formatInternationalText = function (status){
  const formatInternationalTextObj = {
    0: 'no_data_unsettle',  //未结算
    1: 'no_data_pre', //预约中
    2: 'no_data_invalid',  //已失效
    3: 'no_data_settle' //已结算
  }
  let message = formatInternationalTextObj[status] ?? 'no_data_settle'
  return message
}

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
  opacity: 0;
  animation: opacityAnimate 0.5s linear;
  animation-fill-mode: forwards;
  div {
    width: 1.8rem;
    height: 1.8rem;
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