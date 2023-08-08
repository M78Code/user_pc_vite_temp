<!--
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 赛事基础信息
-->
<template>
  <div class="basic-wrap" @click.stop="on_go_detail" >
    <!-- 主队信息 -->
    <div class="row-item team-item" v-for="(item,index) in ['home','away']" :key="item">
      <div class="team-logo">
        <img style="width: 22px; max-height: 24px;" v-img="[match.match_logo[`${item}_1_logo`],match.match_logo[`${item}_1_letter`]]" />
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{'bold':match.team_let_ball == (item === 'home' ? 'T1' :'T2')}" v-tooltip="{content:match.teams[index],overflow:1}">{{match.teams[index]}}</div>
        </div>
      </div>
      <!-- 主比分 -->
      <div class="score" v-if="match.csid=='1004' && match.mmp=='INGAME'">{{match[`${item}Score`]}}</div>
    </div>
                       
    <!-- 中立场、盘口数 -->
    <div class="row-item more-info" v-if="is_show_more">
      <!-- 玩法数量 -->
      <div class="play-count-wrap row no-wrap">
        <span class="play-count">{{handicap_num}}</span>
        <span class="yb-flex-center">
          <div class="yb-icon-arrow"></div>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import match_basis_info_mixin from "src/project/yabo/components/match_list/match_basis_info/match_basis_info_mixin.js"
export default {
  mixins:[match_basis_info_mixin],
  props: {  
    // 是否显示中立场 盘口数
    is_show_more: {
      type:Boolean,
      default:true
    },
  },
};
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
  .more-info {
    justify-content: flex-end;
  }
}
</style>
