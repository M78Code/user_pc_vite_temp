<!--
 * @
 * @Author: 
 * @Date: 2023-08-09 17:14:23
 * @Description: 赛果
-->
<template>
  <div class="wrap match_results">
    <!-- 视频画中画组件 -->
    <moveVideo></moveVideo>
    <p class="font_match_results">1</p>
    <simple-header @refresh="sub_search" :data_loaded="refresh_finish">
      <!-- 赛果 -->
      <span>{{ t("common.amidithion") }}</span>
    </simple-header>

    <!-- 中间内容 S-->
    <div class="main_wrap">
      <!-- 筛选条件 S-->
    <result-header></result-header>
      <!-- 筛选条件 E-->

      <!-- 各球类赛果表格 S-->
      <results
        :sportType="sport_id"
        :load_data_state="load_data_state"
        :details_load="details_load"
        :results_list="results_list"
        :results_order_list="results_order_list"
        :results_playback_list="results_playback_list"
        :is_sortUp="is_sortUp"
        :activeIndex="activeIndex"
        @get_tr_detail="get_tr_detail"
        @change_sort="change_sort"
        @change_playback_type="change_playback_type"
        versions="yabo"
        ref="result_ref"
      />
      <!-- 各球类赛果表格 E-->
    </div>
    <!-- 中间内容 E-->

    <!-- 底部分页条 S-->
    <div
      class="table-footer"
      v-if="results_data.total && load_data_state != 'empty'"
    >
      <Pagination
        :count="results_data.total"
        @pageChange="changePage(arguments)"
        :is_bet_record="false"
        :results_table="results_table_style"
        :reset_pagination="reset_pagination"
      ></Pagination>
    </div>
    <!-- 底部分页条 E-->
    <div class="tips" v-if="tips.statu">{{ tips.message }}</div>
  </div>
</template>

<script setup>
import { t } from "src/boot/i18n";
console.log(t,'t111');
import { useGetResultConfig } from "./results.config.js";
// import results from "src/public/components/results/index.vue";
// import simpleHeader from "src/project/yabo/components/site_/header/simple_header";
// import Pagination from "src/project/yabo/components/bet_record/Pagination";
// import ySelect from "src/public/components/select/y_select";
// import normalSelect from "src/public/components/select/normal_select.vue";
// import normalSelect2 from "src/public/components/select/normal_select.vue";
// import Calendar from "src/project/yabo/components/bet_record/calendar.vue";
// import formatmixin from "src/public/mixins/common/time_format";
// import { api_common, api_analysiss } from "src/public/api/index";
// import fliterCheckbox from "src/project/yabo/components/match_list/filter_checkbox.vue";
// import moveVideo from "project_path/src/components/video-replay/move_video.vue";
// import resultHeader from './components/result-header.vue'
// import { mapGetters } from "vuex";
  // mixins: [formatmixin],
  const {
    results_data,
    tips
} = useGetResultConfig();
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url("~public/lib/font/roboto/v20/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2")
    format("woff2");
}
@import './index.scss'
</style>

<style lang="scss" >
 div.q-menu {
  border: 0 none !important;
}

div.select-item {
  border-left: 1px solid rgb(208, 216, 222);
  border-right: 1px solid rgb(208, 216, 222);

  &:first-child {
    border-top: 1px solid rgb(208, 216, 222);
  }

  &:last-child {
    border-bottom: 1px solid rgb(208, 216, 222);
  }
}
</style>