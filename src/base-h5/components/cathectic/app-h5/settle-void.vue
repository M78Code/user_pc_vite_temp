<!--
 * @Author:
 * @Date:
 * @Description: 投注记录页无数据时展示去投注的界面
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="settle-void" @touchmove.prevent>
    <!-- <div class="img-s" :style="compute_css_obj('no-record')"></div> -->
    <img :src="compute_local_project_file_path('/image/bet/no-data.png')">
    <template>
      <p v-if="BetRecordClass.selected === 0">{{i18n_t("app_h5.cathectic.no_data_unsettle")}}</p>
      <p v-else-if="BetRecordClass.selected == 1">{{i18n_t("app_h5.cathectic.no_data_pre")}}</p>
      <p v-else-if="BetRecordClass.selected == 2">{{i18n_t("app_h5.cathectic.no_data_invalid")}}</p>
      <p v-else="BetRecordClass.selected == 3">{{i18n_t("app_h5.cathectic.no_data_settle")}}</p>
    </template>
  </div>
</template>

<script setup>
import BetRecordClass from "src/core/bet-record/bet-record.js";
import { utils, i18n_t, compute_css_obj, compute_local_project_file_path } from 'src/core/index.js'
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
  background-color: var(--q-gb-bg-c-15);
  img {
    width: 1.8rem;
    height: 1.8rem;
  }
  p {
    color: var(--q-gb-bg-c-6);
    font-size: 0.14rem;
  }
}

</style>
