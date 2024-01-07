<template>
  <div class="basic-wrap" @click.stop="on_go_detail">
    <!-- 发球方 -->
    <div class="serve-ball" :class="match.mat" v-if="match.csid != 4">
      <div class="point home"></div>
      <div class="point away"></div>
    </div>
    <!-- 主队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{'bold':match.other_team_let_ball=='T1'}" v-tooltip="{content:match.mhn,overflow:1}">{{match.mhn}}{{match.up_half_text}}</div>
        </div>
      </div>
      <!-- 当前盘下的当前局比分 -->
      <div class="score" v-if="match.csid == 5">{{match.score_obj.S103.home}}</div>
      <!-- 当前局比分 -->
      <div class="score-game">{{match.cur_score.home}}</div>
    </div>
    <!-- 客队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name away ellipsis allow-user-select" :class="{'bold':match.other_team_let_ball=='T2'}" v-tooltip="{content:lodash.get(match,'man'),overflow:1}">{{match.man}}{{match.up_half_text}}</div>
        </div>
      </div>
      <!-- 当前盘下的当前局比分 -->
      <div class="score" v-if="match.csid == 5">{{match.score_obj.S103.away}}</div>
      <!-- 当前局比分 -->
      <div class="score-game">{{match.cur_score.away}}</div>
    </div>                      
    
    <div class="row-item match-icon">
      <!-- 提前结算 -->
       <div @click.stop="">
         <div
          v-if="lodash.get(match, 'mearlys', 0) && match_style_obj.data_tpl_id != 12 && vx_cur_menu_type.type_name!='bet'"
          class="icon-wrap settlement-pre relative-position"
          v-tooltip="{content: i18n_t('bet_record.settlement_pre')}"
        >
           <img class="match_pre" :src="compute_local_project_file_path('/image/png/match_pre.png')"/>
        </div>
       </div>
      <!-- 中立场、盘口数 -->
      <div class="flex more-info" :style="`${match.csid == 4 ? 'margin-top:35px':''}`">
        <!-- 中立场 -->
        <div class="neutral-wrap">
          <span v-if="match.mng" class="icon-neutral q-icon c-icon"><span class="path1"></span><span class="path2"></span></span>
        </div>
    
        <!-- 是否收藏 -->
        <span @click.stop="collect" class="yb-flex-center yb-hover-bg m-star-wrap-match" v-if="GlobalAccessConfig.get_collectSwitch()">
          <i aria-hidden="true" class="icon-star q-icon c-icon" :class="(match.mf==1 || match.mf==true) && 'active'"></i>
        </span>
        <!-- 统计分析 -->
        <div class="sr-link-icon-w" v-tooltip="{content:i18n_t('common.analysis')}" v-if="is_show_sr_flg(match)" @click.stop='details.sr_click_handle(match)'>
          <i aria-hidden="true" class="icon-signal q-icon c-icon"></i>
        </div>
        <!-- 玩法数量 -->
        <div class="play-count-wrap row no-wrap">
          <span class="play-count">{{handicap_num}}</span>
          <span class="yb-flex-center">
            <div class="yb-icon-arrow"></div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { compute_local_project_file_path, is_show_sr_flg } from "src/output/index.js";
// useRegistPropsHelper(component_symbol, need_register_props)
import {inject} from 'vue'
import details  from "src/core/match-list-pc/details-class/details.js"

import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
let match = inject("match")
let match_style_obj = inject("match_style_obj")
// let match_list_tpl_size = inject("match_list_tpl_size")


</script>
<style lang="scss" scoped>
.basic-col {
  .row-item {
    display: flex;
    height: 35px;
    align-items: center;
    .team-logo {
      display: flex;
      width: 22px;
      min-width: 22px;
      align-items: center;
    }
  }
  .gif-text {
    white-space: nowrap;
    padding-left: 3px;
    animation: 1s text-flash linear infinite normal;
  }
  .red-ball {
    margin: 0 0 2.5px 8px;
    position: relative;
    top: 1px;
    padding: 0 2px;
    height: 14px;
    line-height: 14px;
    &.flash {
      animation: 1s text-flash linear infinite normal;
    }
  }
  .match-icon {
    justify-content: space-between;
  }
  .more-info{
     align-items: center;
  }
}
</style>
