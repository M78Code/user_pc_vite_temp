<template>
  <div class="basic-wrap" @click.stop="on_go_detail">
    <!-- 主队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{'bold': match.other_team_let_ball == 'T1'}" v-tooltip="{content:match.mhn+addition_name,overflow:1}">{{match.mhn }}{{addition_name}} </div>
        </div>
      </div>
      <!-- 角球比分 -->
      <div class="score" v-if="is_show_score && match.play_current_key == 'hpsCorner'">{{match.score_obj.S5.home}}</div>
      <!-- 罚牌比分 -->
      <div class="score" v-if="is_show_score && match.play_current_key == 'hpsPunish'">{{match.score_obj.S10102.home}}</div>
    </div>
    <!-- 客队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name away ellipsis team-name allow-user-select" :class="{'bold': match.other_team_let_ball == 'T2'}" v-tooltip="{content:lodash.get(match,'man')+addition_name,overflow:1}">{{match.man}}{{addition_name}}</div>
        </div>
      </div>
      <!-- 角球比分 -->
      <div class="score" v-if="is_show_score && match.play_current_key == 'hpsCorner'">{{match.score_obj.S5.away}}</div>
      <!-- 罚牌比分 -->
      <div class="score" v-if="is_show_score && match.play_current_key == 'hpsPunish'">{{match.score_obj.S10102.away}}</div>
    </div>
    <!-- 玩法说明 -->
    <tips v-if="play_key && is_show_score" :ms="match.ms" :type="play_key" playId="307" :tipstatus="true" />
  </div>
</template>

<script setup>
// mixins:[match_basis_info_mixin],
// import match_basis_info_mixin from "src/project/yabo/components/match_list/match_basis_info/match_basis_info_mixin.js"

import { computed, defineProps} from 'vue';
import lodash from 'lodash';
import { useRegistPropsHelper, useProps } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import { i18n } from 'src/boot/i18n.js'
import { get_match_status } from 'src/core/utils/index'
import { get_remote_time } from 'src/core/utils/match-list-utils.js';
import( /* webpackChunkName: "pc-mini-chunks" */ "src/public/components/match_list/tips1.vue")

const props = defineProps({ ...useProps });

//附加盘名称
const addition_name = computed(() => {
  let addition_name_obj = {
    //角球
    hpsCorner: i18n.t('list.corner'),
    //罚牌
    hpsPunish: i18n.t('list.punish'),
    //15分钟
    hps15Minutes: i18n.t('list.15minutes'),
    //波胆
    hpsBold: i18n.t('list.bold'),
      //5分钟
    hps5Minutes: i18n.t('list.5minutes'),
  }
  let name = addition_name_obj[this.match.play_current_key]
  return name ? ' - ' + name : ""
})
/**
 * 玩法key
 */
const play_key = computed(() => {
  let current_key = {
    //点球
    hpsPenalty:'penalty',
    //15分钟
    hps15Minutes:'15minutes',
    //罚牌
    hpsPunish:'punish',
    //5分钟
    hps5Minutes:'5minutes',
  }
  return current_key[this.match.play_current_key] || ""
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
}
</style>