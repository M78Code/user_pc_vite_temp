<template>
  <div class="basic-wrap relative-position" @click.stop="on_go_detail" >
    <!-- 棒球发球方 -->
    <div class="serve-ball" :class="match.mat" v-if="match.csid == 3 && $utils.get_match_status(match.ms) == 1">
      <div class="point home"></div>
      <div class="point away"></div>
    </div>
    <!-- 主队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'">
        <!-- 电竞和普通赛事图片地址不同需要传入csid(球种id)进行区分 -->
        <img style="width: 22px; max-height: 24px;" v-img="[(match.match_logo || {}).home_1_logo,(match.match_logo || {}).home_1_letter,match.csid]" />
        <!-- 双打局，就会有两个头像 -->
        <img style="width: 22px; max-height: 24px;" class="logo2" v-if="lodash.get(match,'match_logo.is_double',false)" v-img="[(match.match_logo || {}).home_2_logo,(match.match_logo || {}).home_2_letter,match.csid]" />
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{'bold':match.team_let_ball=='T1'}" v-tooltip="{content:lodash.get(match,'mhn',''),overflow:1}">{{match.mhn}}</div>
        </div>
      </div>
      <!-- 主比分 -->
      <div class="score">
        <span v-show="!scoring">{{match.home_score}}</span>
        <span v-show="scoring" class="scoring">{{ i18n.t('mmp.100.scoring') }}</span>
      </div>
    </div>
    <!-- 客队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'">
        <!-- 同主队 -->
        <img style="width: 22px; max-height: 24px;" v-img="[(match.match_logo || {}).away_1_logo,(match.match_logo || {}).away_1_letter,match.csid]" />
        <img style="width: 22px; max-height: 24px;" class="logo2" v-if="lodash.get(match,'match_logo.is_double',false)" v-img="[(match.match_logo || {}).away_2_logo,(match.match_logo || {}).away_2_letter,match.csid]" />
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name away ellipsis allow-user-select" :class="{'bold':match.team_let_ball=='T2'}"  v-tooltip="{content:lodash.get(match,'man'),overflow:1}">{{match.man}}</div>
        </div>
      </div>
      <!-- 主比分 -->
      <div class="score">
        <span v-show="!scoring">{{match.away_score}}</span>
      </div>
    </div>                      
  
    <div class="row-item match-icon" v-if="is_show_more">
      <!-- 提前结算 -->
       <div @click.stop="">
         <div
          v-if="lodash.get(match, 'mearlys', 0) && match.tpl_id != 12 && vx_cur_menu_type.type_name!='bet'"
          class="icon-wrap settlement-pre relative-position"
          v-tooltip="{content: i18n.t('bet_record.settlement_pre')}"
        >
           <img class="match_pre" :src="`${$g_image_preffix}/image/yabo/png/match_pre.png`"/>
        </div>
       </div>
       <!-- 中立场、盘口数 -->
    <div class="more-info flex" >
      <!-- 中立场 -->
      <div class="neutral-wrap">
        <span v-if="match.mng"   class="icon-neutral q-icon c-icon"><span class="path1"></span><span class="path2"></span></span>
      </div>
  
      <!-- 是否收藏 -->
      <span  @click.stop="collect" class="yb-flex-center yb-hover-bg m-star-wrap-match" v-if="get_global_switch.collect_switch">
        <i aria-hidden="true" class="icon-star q-icon c-icon" :class="(match.mf==1 || match.mf==true) && 'active'"></i>
      </span>
      <!-- 统计分析 -->
      <div class="sr-link-icon-w" v-tooltip="{content:i18n.t('common.analysis')}" v-if="$utils.is_show_sr_flg(match)" @click.stop='sr_click_handle(match)'>
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
import lodash from 'lodash'
import { i18n } from 'src/boot/i18n.js'
import { useRegistPropsHelper, useProps } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import { get_match_status, is_eports_csid } from 'src/core/utils/index'

const props = defineProps({ ...useProps });

//是否展示为比分判定中
const scoring = computed(() => {
  const {csid, ms, mmp, home_score, away_score} = this.match
  let scoring = false
  if (
    is_eports_csid(csid) && // 电竞赛事
    get_match_status(ms, [ 110 ]) // 且为滚球（进行中）状态
  ) {
    // 电竞未开赛 展示为 第一局
    const mmp_state = mmp || 1
    // 当前局数不等于 比分总和加一，則提示比分判定中
    if (mmp_state != (Number(home_score) + Number(away_score) + 1)) {
      scoring = true
    }
  }
  return scoring
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

