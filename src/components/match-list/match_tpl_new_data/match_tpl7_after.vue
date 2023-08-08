<!--
 * @Author: Amor
 * @Date: 2020-08-06 21:27:29
 * @Description: 赛事玩法模板7
-->

<template>
  <div
    class="c-match-item "
    :class="{'more-handicap':match.has_add1 || match.has_add2 || match.is_show_cur_handicap}"
  >
    <!-- 比赛进程 -->
    <div class="process-col process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" src="~public/image/common/svg/hot.svg" v-if="match.is_hot"/>
      <!-- 比赛进程 -->
      <!-- :style="`height:105px;margin-top:${process_margin}px`" -->
      <!-- <div class="yb-flex-center full-width" > -->
        <match-process v-if="is_mounted && match.api_update_time !=0" :match_props="{match, source: 'match_list'}" show_page="match-list" :rows="2" />
      <!-- </div> -->
    </div>

    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted" :match="match" :is_show_more="score_column_position === 'main'" />
        </div>

        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.main_handicap_list"
          :match="match"
          :is_show_score="score_column_position === 'main'"
        />

        <!-- 视频按钮 -->
        <div class="media-col" >
          <match-media :match="match" />
        </div>
      </div>

      <!-- 附加盘1 -->
      <div class="match-handicap-item" v-if="match.has_add1">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info3 :is_suffix="false" v-if="is_mounted && score_column_position === 'add1'" :match="match" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.add1_handicap_list"
          :match="match"
          :is_show_score="score_column_position === 'add1'"
        />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>

      <!-- 附加盘2 -->
      <div class="match-handicap-item" v-if="match.has_add2">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info3 :is_suffix="false" v-if="is_mounted && score_column_position === 'add2'" :match="match" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.add2_handicap_list"
          :match="match"
          :is_show_score="score_column_position === 'add2'"
        />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>

      <!-- 当前局盘 -->
      <div class="match-handicap-item" v-if="match.is_show_cur_handicap">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:105px !important;`">
          <basis-info3  v-if="is_mounted" :match="match" />
        </div>

        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.cur_handicap_list"
          :match="match"
          is_show_score
        />

        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
    </div>
  </div>
</template>

<script>
import match_item_mixin from "src/project/yabo/mixins/match_list/match_item_mixin_new_data.js";

export default {
  name: "MatchItem",

  mixins: [match_item_mixin],
  computed:{
    score_column_position(){
      let {is_show_cur_handicap,has_add2,has_add1} = this.match
      if(is_show_cur_handicap){
        return 'cur'
      }else if(has_add2){
        return 'add2'
      }else if(has_add1){
        return 'add1'
      }else{
        return 'main'
      }
    }
  }
};
</script>

<style>
</style>
