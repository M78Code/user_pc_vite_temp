<template>
  <div class="c-match-item">
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')" v-if="match.is_hot" />
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match.api_update_time != 0" :match="match" sourc='match_list'
        show_page="match-list" :rows="2" />
    </div>
    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted && get_match_status(match.ms, [110]) == 0" :match="match" />
          <basis-info5 v-if="is_mounted && get_match_status(match.ms, [110]) == 1" :match="match" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="main_handicap_list" :match="match" :is_show_score="true" />
        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media :match="match" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, computed } from 'vue';
import { compute_local_project_file_path, get_match_status } from "src/output/index.js";
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo2FullVersionWapper as BasisInfo2 } from 'src/base-pc/components/match-list/match-basis-info/template-2/index.js'
import { MatchBasisInfo5FullVersionWapper as BasisInfo5 } from 'src/base-pc/components/match-list/match-basis-info/template-5/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
// 赛事信息
const match = inject('match');
const match_tpl_info = inject('match_tpl_info');
let match_style_obj = inject('match_style_obj')
const match_list_tpl_size = inject('match_list_tpl_size');
const is_mounted = ref(true);
// 网球准确局数 | 排球准确局数 | 羽毛球准确局数 根据赛制获取主盘列表
const main_handicap_list = computed(() => {
  let { mft, csid, tpl_id } = match.value
  mft = mft == 3 ? 3 : 5
  let play_config = match_tpl_info.value[`template_${match_style_obj.value.data_tpl_id}`]
  if ([5, 9].includes(+csid)) {
    return lodash.merge([], lodash.get(play_config, `main_handicap_list_5_${mft}`))
  } else {
    return lodash.merge([], lodash.get(play_config, `main_handicap_list_${csid}_${mft}`))
  }
})
</script>