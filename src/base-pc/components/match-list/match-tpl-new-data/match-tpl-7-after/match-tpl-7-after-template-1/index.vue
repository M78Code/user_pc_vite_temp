<template>
  <div class="c-match-item " :class="{ 'more-handicap': lodash.get(match, 'has_add1') || lodash.get(match, 'has_add2') }">
    <!-- 比赛进程 -->
    <div v-show="false">{{ MatchListData.data_version.version }}</div>
    <div class="process-col process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')"
        v-show="lodash.get(match, 'is_hot')" />
      <!-- 比赛进程 -->
      <!-- :style="`height:105px;margin-top:${process_margin}px`" -->
      <!-- <div class="yb-flex-center full-width" > -->
      <match-process v-if="is_mounted && match && match.api_update_time != 0" :match="match" source='match_list'
        show_page="match-list" :rows="2" />
      <!-- </div> -->
    </div>

    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted && match" :is_show_more="score_column_position === 'main'" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap v-if="match" :handicap_list="match.main_handicap_list"
          :is_show_score="score_column_position === 'main'" />

        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media v-if="match" :match="match" />
        </div>
      </div>

      <!-- 附加盘1 -->
      <div class="match-handicap-item" v-if="match.has_add1">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info3 :is_suffix="false" v-if="is_mounted && score_column_position === 'add1' && match" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap v-if="match" :handicap_list="match.add1_handicap_list"
          :is_show_score="score_column_position === 'add1'" :add_type="2" />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
      <!-- 附加盘2 -->
      <div class="match-handicap-item" v-if="match.has_add2">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info3 :is_suffix="false" v-if="is_mounted && score_column_position === 'add2' && match" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap v-if="match" :handicap_list="match.add2_handicap_list"
          :is_show_score="score_column_position === 'add2'" :add_type="3" />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
      <!-- 当前局盘 -->
      <div class="match-handicap-item" v-if="match.is_show_cur_handicap">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:105px !important;`">
          <basis-info3 v-if="is_mounted" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap v-if="match" :handicap_list="match.cur_handicap_list" is_show_score />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import match_item_mixin from "src/project/yabo/mixins/match_list/match_item_mixin_new_data.js";
// mixins: [match_item_mixin],
import { computed, ref, inject } from 'vue';
import { MatchDataWarehouse_PC_List_Common as MatchListData, compute_local_project_file_path } from "src/output/index.js";
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo2FullVersionWapper as BasisInfo2 } from 'src/base-pc/components/match-list/match-basis-info/template-2/index.js'
import { MatchBasisInfo3FullVersionWapper as BasisInfo3 } from 'src/base-pc/components/match-list/match-basis-info/template-3/index.js'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
import { CommonTabFullVersionWapper as Tab } from "src/base-pc/components/tab/common-tab/index.js";

const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  },
})
const match = inject("match");
const match_style_obj = inject("match_style_obj");
const match_list_tpl_size = inject("match_list_tpl_size");
const match_tpl_info = inject("match_tpl_info");

const is_mounted = ref(true);

const score_column_position = computed(() => {
  let has_add1 = lodash.get(match.value, 'has_add1')
  let has_add2 = lodash.get(match.value, 'has_add2')
  let { is_show_cur_handicap } = match_tpl_info.value || {}
  if (is_show_cur_handicap) {
    return 'cur'
  } else if (has_add2) {
    return 'add2'
  } else if (has_add1) {
    return 'add1'
  } else {
    return 'main'
  }
})

/**
   * @Description 获取当前局盘口列表模板
   * @param {undefined} undefined
   */
function get_cur_handicap_list(match) {
  // 当前局盘口列表
  let cur_handicap_list = [];
  let play_config = match_tpl_info.value[`template_${match_style_obj.data_tpl_id}`]
  // 篮球根据赛事阶段获取当前局盘口列表
  if (match_style_obj.data_tpl_id == 7) {
    switch (+match.mmp) {
      case 1: //上半场
        cur_handicap_list = play_config.cur_handicap_list_up;
        break;
      case 31: //中场休息
      case 2: //下半场
        cur_handicap_list = play_config.cur_handicap_list_down;
        break;
      case 13: //第一节
        cur_handicap_list = play_config.cur_handicap_list_1;
        break;
      case 301: //第一节休息
        cur_handicap_list = play_config.cur_handicap_list_1_rest;
        break;
      case 14: //第二节
        cur_handicap_list = play_config.cur_handicap_list_2;
        break;
      case 302: //第二节休息
      case 15: //第三节
        cur_handicap_list = play_config.cur_handicap_list_3;
        break;
      case 303: //第三节休息
      case 16: //第四节
        cur_handicap_list = play_config.cur_handicap_list_4;
        break;
      default:
        cur_handicap_list = play_config.cur_handicap_list;
        break;
    }
  }
  // 斯诺克让球与大小当前局盘口列表
  else if (match_style_obj.data_tpl_id == 11 && match.csid == 7) {
    cur_handicap_list = play_config.cur_handicap_list_7;
  }
  // 排球让球与大小当前局盘口列表
  else if (match_style_obj.data_tpl_id == 11 && match.csid == 9) {
    cur_handicap_list = play_config.cur_handicap_list_9;
  }
  // 判断模板是否有当前局玩法
  else if ([7, 9, 11, 16].includes(+match_style_obj.data_tpl_id)) {
    cur_handicap_list = play_config.cur_handicap_list;
  }
  return cur_handicap_list;
}

</script>

<style></style>