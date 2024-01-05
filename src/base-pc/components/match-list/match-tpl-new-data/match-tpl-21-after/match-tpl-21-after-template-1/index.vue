<template>
  <div class="c-match-item tpl-21">
    <!-- 比赛进程 -->
    <div class="process-col">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')" v-if="MenuData.is_hot"/>
        <!-- 比赛进程 -->
      <div class="yb-flex-center full-width" :style="`height:105px;`">
        <match-process v-if="is_mounted && match" :match="match" source='match_list' show_page="match-list" :rows="2" />
      </div>
    </div>

    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted && match.api_update_time !=0" :match="match" />
        </div>
         <!-- 赛事盘口投注项 -->
         <match-handicap
          :handicap_list="match.main_handicap_list"
          :match="match"
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
import { compute_local_project_file_path,MenuData } from 'src/output/index.js'
</script>

<style lang="scss" scoped>

</style>