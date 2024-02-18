<!--
 * @
 * @Author: 
 * @Date: 2023-08-09 17:14:23
 * @Description: 赛果
-->
<template>
  <div class="wrap match_results" :style="page_style">
    <!-- 视频画中画组件 -->
    <!-- <moveVideo></moveVideo> -->
    <p class="font_match_results">12222</p>
    <!-- 赛果 -->
    <!-- <simple-header @refresh="sub_search" :data_loaded="refresh_finish" :title="i18n_t('common.amidithion')"></simple-header> -->
    <!-- 中间内容 S-->
    <div class="main_wrap">
      <!-- 筛选条件 S-->
      <result-header
        :sport_type="sport_type"
        :sport="sport"
        :champion_sport_type="champion_sport_type"
        :champion_sport="champion_sport"
        :startTimeShowFunc="startTimeShowFunc"
        :current_sport_id="current_sport_id"
        :startTimeShow="startTimeShow"
        :showSelectTime="showSelectTime"
        :isSelectConfirm="isSelectConfirm"
        :dateValue.sync="model"
        :ipt_search="ipt_search"
        @refresh="sub_search"
        :api_league_type="api_league_type"
        :select_submit="select_submit"
        :hideSelect="hideSelect"
        :pournament_params="pournament_params"
        :sport_id="sport_id"
        :results_params="results_params"
        :input_radio="input_radio"
        :is_bowls="is_bowls"
        :cancel="cancel"
        :is_show="is_show"
        :click_popup="click_popup"
        :img_mouseleave="img_mouseleave"
        :timeChanged="timeChanged"
        :search_hot="search_hot"
      ></result-header>
      <!-- 筛选条件 E-->

      <!-- 各球类赛果表格 S-->
      <rusult-type
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
      <pagination-wrapper
        :count="results_data.total"
        @pageChange="changePage"
        :is_bet_record="false"
        :results_table="results_table_style"
        :reset_pagination="reset_pagination"
      ></pagination-wrapper>
    </div>
    <!-- 底部分页条 E-->
    <div class="tips" v-if="tips.statu">{{ tips.message }}</div>
  </div>
</template>

<script setup>
import { i18n_t } from "src/boot/i18n.js";
import { useGetResultConfig } from "src/base-pc/components/match-results/results-config.js";
import { RusultType } from "src/base-pc/components/match-results/rusult-type/index.js";
import { SimpleHeaderWapper as simpleHeader } from "src/components/common/simple-header/index.js";
import { PaginationWrapper } from "src/components/pagination/index.js";
import moveVideo from "src/base-pc/components/video-replay/move-video.vue";
import { ResultHeader } from "src/base-pc/components/match-results/result-header/index.js";
import { onMounted,ref,nextTick } from "vue";
import { MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
//引入组件样式
import { compute_css_variables } from "src/core/css-var/index.js"
const page_style = ref(null)
page_style.value = compute_css_variables({ category: 'component', module: 'match-results' })
const {
  //变量
  current_sport_id,
  champion_sport_type,
  champion_sport,
  sport,
  sport_type,
  refresh_finish,
  results_data,
  tips,
  results_table_style,
  sport_id,
  load_data_state,
  details_load,
  results_list,
  results_order_list,
  results_playback_list,
  is_sortUp,
  activeIndex,
  reset_pagination,
  startTimeShow,
  showSelectTime,
  model,
  api_league_type,
  pournament_params,
  results_params,
  is_bowls,
  is_show,
  cancel,
  timeChanged,
  //函数
  get_tr_detail,
  change_sort,
  change_playback_type,
  changePage,
  get_serverTime,
  startTimeShowFunc,
  isSelectConfirm,
  ipt_search,
  select_submit,
  input_radio,
  // xinzen
  sub_search,
  hideSelect,
  input_focus,
  input_blur,
  champion_sport_type_filter,
  search_hot,
  highlights_input_radio,
   click_popup,
  img_mouseleave
} = useGetResultConfig();

onMounted(() => {
  get_serverTime();
  nextTick(() => {
    // 隐藏loading动画 
    useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,0);
  })
});

</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url("/other-assets/font/roboto/v20/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2")
    format("woff2");
}

@import "./index.scss";
</style>

<style lang="scss" scope>
@import "./match_results.scss";
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
