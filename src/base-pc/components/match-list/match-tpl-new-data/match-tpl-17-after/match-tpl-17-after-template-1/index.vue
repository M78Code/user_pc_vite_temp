<template>
  <div class="c-match-item">
    <div v-show="false">{{MatchListData.data_version.version}}</div>
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')" v-if="lodash.get(match, 'is_hot')"/>
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match && match.api_update_time !=0" :match="match" source='match_list' show_page="match-list" :rows="2" />
    </div>
    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted && match" :match="match" />
        </div>
        <!-- 赛事盘口投注项 -->
         <match-handicap
          v-if="match"
          :handicap_list="match_tpl_info[`template_${match_style_obj.data_tpl_id}`].main_handicap_list"
          :match="match"
          :is_show_score="true"
          />

        <!-- 视频按钮 -->
        <div class="media-col" >
          <match-media v-if="match" :match="match" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// import { ref, watch, defineProps } from 'vue';
import { ref, watch } from 'vue';

import { compute_local_project_file_path, MatchDataWarehouse_PC_List_Common as MatchListData, UserCtr } from "src/output/index.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo2FullVersionWapper as BasisInfo2 } from 'src/base-pc/components/match-list/match-basis-info/template-2/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'

const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  }
})

// 赛事模板样式
let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(props.mid)
// 赛事模板宽度信息
const match_list_tpl_size = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config
// 赛事模板投注项信息
const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`]
// 赛事信息
let match = MatchListData.list_to_obj.mid_obj[props.mid+'_'];
const is_mounted = ref(true);

// 数据仓库version变更时 重新赋值
watch(() => MatchListData.data_version.version, (new_value, old_value) => {
  match = MatchListData.list_to_obj.mid_obj[props.mid+'_'];
})

</script>
