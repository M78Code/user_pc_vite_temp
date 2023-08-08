<!--
 * @Author: Amor
 * @Date: 2020-08-06 21:27:29
 * @Description: 赛事玩法模板7
-->

<template>
  <div
    class="c-match-item tpl-9"
    :class="{'more-handicap':match.is_show_cur_handicap}"
  >
    <!-- 比赛进程 -->
    <div class="process-col ">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" src="~public/image/common/svg/hot.svg" v-if="match.is_hot"/>
      <!-- 比赛进程 -->
      <div class="yb-flex-center full-width" :style="`height:105px;margin-top:${process_margin}px`">
          <match-process v-if="is_mounted && match.api_update_time !=0" :match_props="{match, source: 'match_list'}" show_page="match-list" :rows="2" />
      </div>
    </div>

    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info2 v-if="is_mounted" :match="match" :is_show_more="!match.is_show_cur_handicap" />
        </div>

        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.main_handicap_list"
          :match="match"
          :is_show_score="!match.is_show_cur_handicap && match.csid != 4"
        />

        <!-- 视频按钮 -->
        <div class="media-col" >
          <match-media :match="match" />
        </div>
      </div>

      <!-- 当前局盘 -->
      <div class="match-handicap-item" v-if="match.is_show_cur_handicap">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info5 v-if="is_mounted" :match="match" />
        </div>

        <!-- 赛事盘口投注项 -->
        <match-handicap
          :handicap_list="match.cur_handicap_list"
          :match="match"
          :is_show_score="true"
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
    // 赛事阶段 间距
    process_margin(){
      let process_margin = 0
      if(this.match.is_show_cur_handicap){
        process_margin = 70
        if(this.match.has_add1){
          process_margin += 70
        }
        if(this.match.has_add2){
          process_margin += 70
        }
        if(this.match.csid ==4){
          process_margin +=35
        }
      }
      return process_margin
    }
  },
};
</script>

<style>
</style>
