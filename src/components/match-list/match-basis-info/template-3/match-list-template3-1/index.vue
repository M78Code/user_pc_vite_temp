<template>
  <div class="basic-wrap" @click.stop="on_go_detail" >
    <!-- 队伍信息 -->
    <div class="row-item team-item" v-for="item in ['home','away']" :key="item">
      <template v-if="is_suffix">
        <div class="team-logo" :class="_.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
        <div class="ellipsis-wrap">
          <div class="row no-wrap absolute-full">
            <div :class="['team-name ellipsis allow-user-select',item,{'bold':  match.other_team_let_ball == (item === 'home' ? 'T1' :'T2')}]"   v-tooltip="{content:team_names[item],overflow:1}">{{team_names[item]}}</div>
          </div>
        </div>
        <!-- 当前局比分 -->
        <div class="score">{{match.cur_score[item]}}</div>
     </template>
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
    <div class=" more-info flex" v-if="is_show_more">
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
<script setup>
// import match_basis_info_mixin from "src/project/yabo/components/match_list/match_basis_info/match_basis_info_mixin.js"
// mixins:[match_basis_info_mixin],

import { computed, defineProps } from 'vue';
import { useRegistPropsHelper, useProps } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)

const props = defineProps({ ...useProps });
const team_names = computed(() => {
  let { mhn = '', man = '', up_half_text = '' } = this.match
  let team_names = {
    away:"",
    home:"",
  }
  if(is_suffix.value){
    team_names = {
      away:man+up_half_text,
      home:mhn+up_half_text,
    }
  }else {
    team_names = {
      away:man,
      home:mhn,
    }
  }
  return team_names
})
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
  .match-icon {
    justify-content: space-between;
  }
  .more-info{
     align-items: center;
  }
}
</style>