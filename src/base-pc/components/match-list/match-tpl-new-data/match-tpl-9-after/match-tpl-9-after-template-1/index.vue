<template>
  <div class="c-match-item  match-tpl1-bg"
    :class="{ 'more-handicap': lodash.get(match, 'has_add1') || lodash.get(match, 'has_add2') }">
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')"
        v-show="lodash.get(match, 'is_hot')" />
      <!-- 比赛进程 -->
      <match-process v-if="match" :match="match" source='match_list' show_page="match-list" :rows="2" />
      <!-- 比赛进程 -->
      <div class="yb-flex-center full-width" :style="`height:105px;margin-top:${process_margin}px`">
        <match-process v-if="is_mounted && match && match.api_update_time != 0"
          :match_props="{ match, source: 'match_list' }" show_page="match-list" :rows="2" />
      </div>
    </div>
    <div v-show="false">{{ MatchListCardData.list_version }}</div>
    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted && match" :match="match" :is_show_more="!match_tpl_info.is_show_cur_handicap" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap v-if="match"
          :handicap_list="get_main_handicap_list(match)" :match="match"
          :is_show_score="!match_tpl_info.is_show_cur_handicap && match.csid != 4" />

        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media v-if="match" :match="match" />
        </div>
      </div>

      <!-- 当前局盘 -->
      <div class="match-handicap-item" v-if="match_tpl_info.is_show_cur_handicap">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info5 v-if="is_mounted && match" :match="match" />
        </div>

        <!-- 赛事盘口投注项 -->
        <match-handicap v-if="match" :handicap_list="get_cur_handicap_list(match)" :match="match" :is_show_score="true" />

        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import lodash from 'lodash'
import { get_match_status } from "src/output/index.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import { compute_local_project_file_path } from 'src/output/index.js';
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo2FullVersionWapper as BasisInfo2 } from 'src/base-pc/components/match-list/match-basis-info/template-2/index.js'
import { MatchBasisInfo5FullVersionWapper as BasisInfo5 } from 'src/base-pc/components/match-list/match-basis-info/template-5/index.js'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  },
})
let match_style_obj = inject('match_style_obj')
let match = inject('match')
let match_list_tpl_size = inject('match_list_tpl_size')
let match_tpl_info = inject('match_tpl_info')
const is_mounted = ref(true)
const process_margin = computed(() => {
  let { is_show_cur_handicap } = match_tpl_info.value
  let process_margin = 0
  if (is_show_cur_handicap) {
    process_margin = 70
    if (match.value.has_add1) {
      process_margin += 70
    }
    if (match.value.has_add2) {
      process_margin += 70
    }
    if (match.value.csid == 4) {
      process_margin += 35
    }
  }
  return process_margin
})
/**
   * @Description 获取当前局盘口列表模板
   * @param {undefined} undefined
   */
function get_cur_handicap_list(match) {
  // 当前局盘口列表
  let cur_handicap_list = [];
  let play_config = match_tpl_info.value[`template_${match_style_obj.value.data_tpl_id}`]
  // 斯诺克让球与大小当前局盘口列表
  if (match_style_obj.value.data_tpl_id == 11 && match.csid == 7) {
    cur_handicap_list = play_config.cur_handicap_list_7;
  }
  // 排球让球与大小当前局盘口列表
  else if (match_style_obj.value.data_tpl_id == 11 && match.csid == 9) {
    cur_handicap_list = play_config.cur_handicap_list_9;
  }
  // 判断模板是否有当前局玩法
  else if ([7, 9, 11, 16].includes(+match_style_obj.value.data_tpl_id)) {
    cur_handicap_list = play_config.cur_handicap_list;
  }
  return cur_handicap_list;
}

/**
   * @Description 获取主盘口列表模板
   * @param {undefined} undefined
   */
function get_main_handicap_list(match) {
  // 主盘口列表
  let main_handicap_list = [];
  let play_config = match_tpl_info.value[`template_${match_style_obj.value.data_tpl_id}`]
  // 斯诺克让球与大小主盘口列表
  if (match_style_obj.value.data_tpl_id == 11 && match.csid == 7) {
    main_handicap_list = play_config.main_handicap_list_7;
  }
  // 排球让球与大小主盘口列表
  else if (match_style_obj.value.data_tpl_id == 11 && match.csid == 9) {
    main_handicap_list = play_config.main_handicap_list;
  }
  // 判断模板是否有主玩法
  else if ([7, 9, 11, 16].includes(+match_style_obj.value.data_tpl_id)) {
    main_handicap_list = play_config.main_handicap_list;
  }
  return main_handicap_list;
}
</script>

<style lang="scss" scoped>
.other-play-tab {
  height: 32px;
  display: flex;

  .play-title {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    position: relative;

    .tab-wrap {
      :deep(.item-wrap) {
        .tab-item {
          padding: 0 10px;
        }
      }
    }
  }

  .arrow-wrap {
    width: 34px;
    height: 100%;

    .yb-icon-arrow {
      transform: rotate(270deg);

      &.active {
        transform: rotate(90deg);
      }
    }
  }
}

/*15分钟和角球tab*/
.fifteen-box {
  display: flex;
  height: 24px;

  &.double-title {
    height: 40px;

    .fifteen-item {
      line-height: 40px;
    }
  }

  .fifteen-item {
    text-align: center;
    font-weight: 500;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    height: 100%;
    padding: 0 2px;

    &.flex {
      line-height: 16px;
    }
  }

  .bet-item-wrap:last-child {
    border-right: none !important;
  }
}</style>/index.js