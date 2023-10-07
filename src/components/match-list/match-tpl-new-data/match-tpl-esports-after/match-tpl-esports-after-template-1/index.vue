<template>
  <div class="c-match-item tpl-esports-bg">
    <!-- 主盘 -->
    <div class="match-handicap-item">
      <!-- 比赛进程 -->
      <div class="process-col yb-flex-center tpl-esports">
        <!--热门赛事显示hot标识-->
        <img class="match-hot" src="/yazhou-pc/image/common/svg/hot.svg" v-if="match.is_hot"/>
        <!-- 串 ：可串关文字提示 ispo：0否 1普通串关 2局内串关 -->
        <div class="match-parlay">
          <template v-if="lodash.get(match,'ispo', 0) != 0">
            <div v-if="parlay_overflow" class="wd1" v-tooltip="{content:'Parlay',overflow:1}">P&nbsp;</div>
            <div class="wd" v-else>{{ $t('match_info.match_parlay') }}</div>
          </template>          
          <div>{{match.mfo}}</div>
        </div>

        <!-- 比赛进程 -->
        <match-process v-if="is_mounted && match.api_update_time !=0" :match="match" source='match_list' 
          :class="pos_class" show_page="match-list" :rows="2" />
      </div>
      <!-- 赛事基础信息 -->
      <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
        <basis-info2 v-if="is_mounted" :match="match" :is_show_more="false" />
      </div>

      <!-- 赛事盘口投注项 -->
      <match-handicap
        :handicap_list="match.main_handicap_list"
        :match="match"
        :is_show_score="false"
      />

      <!-- 视频按钮 -->
      <div class="media-col" >
        <match-media :match="match" />
      </div>
    </div>

  </div>
</template>

<script setup>
// import match_item_mixin from "src/project/yabo/mixins/match_list/match_item_mixin_new_data.js";
// mixins: [match_item_mixin],
import lodash from 'lodash';
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)

</script>

<style lang="scss" scoped>
.basic-wrap {
  .row-item {
    display: flex;
    height: 35px;
    align-items: center;
    .team-logo {
      display: flex;
      width: 22px;
      min-width: 22px;
      align-items: center;

      img {
        width: 100%;
        max-height: 24px;
      }
    }
  }
}
.tpl-esports{
  .c-match-process{top: 26px;}
}
.process-col {    
 line-height: 1.7;
}
.top18{
  top: 18px!important;
}
</style>
