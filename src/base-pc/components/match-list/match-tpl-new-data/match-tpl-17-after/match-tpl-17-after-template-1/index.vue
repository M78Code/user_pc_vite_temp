<template>
  <div class="c-match-item">
    <!-- <div v-show="false">{{MatchListData.data_version.version}}</div> -->
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
import { ref, inject } from 'vue';
import { compute_local_project_file_path } from "src/output/index.js";
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo2FullVersionWapper as BasisInfo2 } from 'src/base-pc/components/match-list/match-basis-info/template-2/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
// 赛事信息
const match = inject('match');
const match_style_obj = inject('match_style_obj');
const match_tpl_info = inject('match_tpl_info');
const match_list_tpl_size = inject('match_list_tpl_size');
const is_mounted = ref(true);
</script>

