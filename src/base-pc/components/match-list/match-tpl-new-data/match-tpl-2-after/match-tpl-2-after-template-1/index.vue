<template>
  <div class="c-match-item " :class="'tpl-'+match_style_obj.data_tpl_id">
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')" v-show="lodash.get(match, 'is_hot')"/>
      <!-- 比赛进程 -->
      <match-process v-if="match" :match="match" source='match_list' show_page="match-list" :rows="2" />
    </div>
    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info1 show_type="all" v-if="is_mounted && match_style_obj.data_tpl_id == 29" :match="match" />
          <basis-info2 v-else-if="match" :match="match" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap
          v-if="match"
          :handicap_list="(match.main_handicap_list)"
          :match="match"
          :is_show_score="![20,22,23,29].includes(+match_style_obj.data_tpl_id)"
          :is_show_score_content="false"
        />
        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media v-if="match" :match="match" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref,inject } from 'vue';
import { compute_local_project_file_path } from "src/output/index.js";
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"

import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo1FullVersionWapper as BasisInfo1 } from 'src/base-pc/components/match-list/match-basis-info/template-1/index.js'
import { MatchBasisInfo2FullVersionWapper as BasisInfo2 } from 'src/base-pc/components/match-list/match-basis-info/template-2/index.js'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  },
})
let match = inject('match')
let match_style_obj = inject('match_style_obj')
let match_list_tpl_size = inject('match_list_tpl_size')
let match_tpl_info = inject('match_tpl_info')
const is_mounted = ref(true);

</script>
src/output/index.js