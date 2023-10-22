<template>
  <div class="c-match-item">
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="`/${project_name}/image/common/svg/hot.svg`" v-if="match.is_hot"/>
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match.api_update_time !=0" :match="match" sourc='match_list' show_page="match-list" :rows="2" />
    </div>

    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted && $utils.get_match_status(match.ms,[110]) == 0" :match="match" />
          <basis-info5 v-if="is_mounted && $utils.get_match_status(match.ms,[110]) == 1" :match="match" />
        </div>

        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.main_handicap_list"
          :match="match"
          :is_show_score="true"
        />

        <!-- 视频按钮 -->
        <div class="media-col" >
          <match-media :match="match" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { project_name } from 'src/core/index.js';
</script>

<style>
</style>