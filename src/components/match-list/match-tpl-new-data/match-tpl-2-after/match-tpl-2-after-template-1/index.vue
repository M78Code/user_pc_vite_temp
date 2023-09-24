<template>
  <div class="c-match-item " :class="'tpl-'+match.tpl_id">
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" src="~public/image/common/svg/hot.svg" v-if="match.is_hot"/>
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match.api_update_time !=0" :match="match" source='match_list' show_page="match-list" :rows="2" />
    </div>

    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info1 show_type="all" v-if="is_mounted && match.tpl_id == 25" :match="match" />
          <basis-info2 v-else-if="is_mounted" :match="match" />
        </div>

        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.main_handicap_list"
          :match="match"
          :is_show_score="![20,22,23,25].includes(+match.tpl_id)"
          :is_show_score_content="false"
        />

        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media :match="match" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// import match_item_mixin from "src/project/yabo/mixins/match_list/match_item_mixin_new_data.js";
// mixins: [match_item_mixin],
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)


</script>
