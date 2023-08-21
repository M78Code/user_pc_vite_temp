<template>
  <div
    v-if="match.mhs != 2"
    class="c-match-item  relative-position virtual-match-item "
    :class="{'virtual-football':match.csid==1001}"
  >
    <!-- 主盘 -->
    <div class="match-handicap-item">
      <!-- 比赛进程 -->
      <div class="process-col yb-flex-center">
        {{ match._match_index }}
      </div>
      <!-- 赛事基础信息 -->
      <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
        <basis-info6 v-if="is_mounted" :match="match" />
      </div>

      <!-- 赛事盘口投注项 -->
      <match-handicap
        :handicap_list="match.main_handicap_list"
        :match="match"
      />

      <!-- 视频按钮 -->
      <div class="media-col" >
        <virtual-match-media v-if="match.csid == 1001" :match="match" />
      </div>
    </div>
  </div>
</template>

<script setup>
// import match_item_mixin from "src/project/yabo/mixins/match_list/match_item_mixin_new_data.js";
// mixins: [match_item_mixin],
</script>