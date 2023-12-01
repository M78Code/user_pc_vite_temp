<template>
  <div class="basic-wrap" @click.stop="details.on_go_detail(match,null,router,route)">
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

<script setup>
// import match_basis_info_mixin from "src/project/yabo/components/match_list/match_basis_info/match_basis_info_mixin.js"
// mixins:[match_basis_info_mixin],

import { } from 'vue';
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
import { useRouter,useRoute } from "vue-router";
const router = useRouter()
const route = useRoute()
const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));

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
