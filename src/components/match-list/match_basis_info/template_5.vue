<!--
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 赛事基础信息
-->
<template>
  <div class="basic-wrap" @click.stop="on_go_detail">
    <!-- 发球方 -->
    <div class="serve-ball" :class="match.mat" v-if="match.csid != 4">
      <div class="point home"></div>
      <div class="point away"></div>
    </div>
    <!-- 主队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="_.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
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
      <div class="team-logo" :class="_.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name away ellipsis allow-user-select" :class="{'bold':match.other_team_let_ball=='T2'}" v-tooltip="{content:_.get(match,'man'),overflow:1}">{{match.man}}{{match.up_half_text}}</div>
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
          v-if="_.get(match, 'mearlys', 0) && match.tpl_id != 12 && vx_cur_menu_type.type_name!='bet'"
          class="icon-wrap settlement-pre relative-position"
          v-tooltip="{content: $root.$t('bet_record.settlement_pre')}"
        >
           <img class="match_pre" :src="`${$g_image_preffix}/image/yabo/png/match_pre.png`"/>
        </div>
       </div>
      <!-- 中立场、盘口数 -->
      <div class="flex more-info" :style="`${match.csid == 4 ? 'margin-top:35px':''}`">
        <!-- 中立场 -->
        <div class="neutral-wrap">
          <span v-if="match.mng" class="icon-neutral q-icon c-icon"><span class="path1"></span><span class="path2"></span></span>
        </div>
    
        <!-- 是否收藏 -->
        <span @click.stop="collect" class="yb-flex-center yb-hover-bg m-star-wrap-match" v-if="get_global_switch.collect_switch">
          <i aria-hidden="true" class="icon-star q-icon c-icon" :class="(match.mf==1 || match.mf==true) && 'active'"></i>
        </span>
        <!-- 统计分析 -->
        <div class="sr-link-icon-w" v-tooltip="{content:$root.$t('common.analysis')}" v-if="$utils.is_show_sr_flg(match)" @click.stop='sr_click_handle(match)'>
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

<script>
import match_basis_info_mixin from "src/project/yabo/components/match_list/match_basis_info/match_basis_info_mixin.js"
export default {
  mixins:[match_basis_info_mixin],
};
</script>

<style lang="scss" scoped>
.basic-wrap {
  position: relative;
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
  .match-icon {
    justify-content: space-between;
  }
  .more-info{
     align-items: center;
  }

  /*  发球方 */
  .serve-ball {
    position: absolute;
    top: 0;
    left: -14px;
    width: 7px;
    height: 100%;
    .point {
      width: 100%;
      height: 7px;
      border-radius: 50%;
      margin-top: 14px;
      background-color: #d0d8de;
      &.away {
        margin-top: 26px;
      }
    }
  }
}
</style>
