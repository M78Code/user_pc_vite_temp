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
    <p>{{i18n_t('common.no_data')}}</p>
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
  img {
    width: 2.4rem;
    height: 2.4rem;
  }
  p {
    font-size: 0.16rem;
  }
}

</style>
