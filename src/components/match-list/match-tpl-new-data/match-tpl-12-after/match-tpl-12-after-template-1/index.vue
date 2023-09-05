<template>
  <div class="c-match-item jingcai">
    <!-- 主盘 -->
    <div class="match-handicap-item">
      <!-- 比赛进程 -->
      <div class="process-col yb-flex-center">
        <!-- 比赛进程 -->
        <match-process v-if="is_mounted && match.api_update_time !=0" :match_props="{match, source: 'match_list'}" show_page="match-list" :rows="2" />
      </div>
      <!-- 赛事基础信息 -->
      <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`" @click.stop="on_go_detail">
        <div class="ellipsis-wrap">
          <div class="row no-wrap absolute-full">
            <div class="team-name home ellipsis allow-user-select" v-tooltip="{content:match.mhn,overflow:1}">{{match.mhn}}</div>
          </div>
        </div>

        <img class="team-logo" v-img="[(match.match_logo || {}).home_1_logo,(match.match_logo || {}).home_1_letter]" />

        <div class="score-wrap yb-flex-center">
          <!-- 滚球：比分 -->
          <template v-if="get_match_status(match.ms,[110]) == 1">
            <div :class="['onset-team',match.mat=='home' &&'active']" />

            <div class="score">{{match.home_score}}</div>
            <div class="separate">:</div>
            <div class="score">{{match.away_score}}</div>
            <div :class="['onset-team',match.mat=='away' &&'active']" />
          </template>
          <!-- 非滚球： VS 图片-->
          <template v-else>
            <div class="font-vs">VS</div>
          </template>
        </div>

        <img class="team-logo" v-img="[(match.match_logo || {}).away_1_logo,(match.match_logo || {}).away_1_letter]" />
        <div class="ellipsis-wrap">
          <div class="row no-wrap absolute-full">
            <div class="team-name away ellipsis allow-user-select" v-tooltip="{content:match.man,overflow:1}">{{match.man}}</div>
          </div>
        </div>
      </div>

      <!-- 让球 -->
      <div class="rangqiu">
        <div 
          class="bet-item-wrap" 
          :style="`width:${match_list_tpl_size.bet_width}px !important; height:35px !important;`"
        >
          0
        </div>
        <div 
          class="bet-item-wrap" 
          :style="`width:${match_list_tpl_size.bet_width}px !important; height:35px !important;`"
        >
          {{hv}}
        </div>
      </div>

      <!-- 赛事盘口投注项 -->
      <match-handicap
        :handicap_list="match.main_handicap_list"
        :match="match"
        :is_show_score="false"
      />
      <div
        @click.stop="on_go_detail"
        class="action-wrap column yb-flex-center cursor-pointer"
      >
        <div class="row1 yb-flex-center">
          <div
            class="yb-flex-center yb-hover-bg"
            @click.stop="collect"
            v-if="GlobalAccessConfig.get_collectSwitch()"
          >
            <i aria-hidden="true" class="icon-star q-icon c-icon" :class="(match.mf==1 || match.mf==true) && 'active'"></i>
            
          </div>
          <div class="sr-link-icon-w" v-tooltip="{content:t('common.analysis')}" v-if="is_show_sr_flg(match)" @click.stop='sr_click_handle(match)'>
            <i aria-hidden="true" class="icon-signal q-icon c-icon"></i>
          </div>
        </div>

        <div class="play-count-wrap row no-wrap">
          <span class="play-count">{{handicap_num}}</span>
          <span class="row" style="align-items:center;margin-left:2px">
            <div class="yb-icon-arrow"></div>
          </span>
        </div>
      </div>
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
// inject:['match_list_data'],


import { ref, computed, watch, reactive } from 'vue';
import { t } from "src/core/index.js";
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt"
import { is_eports_csid } from 'src/core/utils/module/match-list-utils.js';
import { get_match_status, is_show_sr_flg } from 'src/core/index.js'
import store from 'prject_path/src/store/index.js'
let state = store.getState()
;

const hv = ref('');
const hv_ol = ref({_hid: -1});
hv_ol.value = this.match.main_handicap_list[0].ols[1]
// 其他玩法标题
const handicap_num = computed(() => {
  if(GlobalAccessConfig.get_handicapNum()){
    return `+${ this.match.mc || 0}`
  }else{
    return  t('match_info.more')
  }
})

watch(hv_ol.value._hid, () => {
  set_hv()
})

/**
 * @Description 设置让球数量 
 * @param {undefined} undefined
*/
const set_hv = () => {
  let hl_obj = this.match_list_data.hl_obj['hid_'+hv_ol.value._hid] || {}
  hv.value = hl_obj.hv || -1
}

/**
 * @Description 赛事收藏 
 * @param {undefined} undefined
*/
const collect = () => {
  useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_MATCH, this.match)
}

/**
 * 跳转至详情
 * @return {undefined} undefined
 */
const on_go_detail = () => {
  if(is_eports_csid(this.match.csid)){
    this.match.go_detail_type = 'no_switch'
  }
  details.on_go_detail(this.match);
}

/**
 * @Description 点击tab玩法
 * @param {undefined} undefined
*/
const play_tab_click = (obj) => {
  // 当前已选中
  if(this.match.play_current_index == obj.index){
    return
  }
  let play_key = play_name_list.value[obj.index].field
  // 切换玩法
  this.match_list_data.switch_other_play(this.match.mid,play_key)
  if (this.match.csid == 1) {
    let zhugeObj = {
      "玩法集名称": play_name_list.value[obj.index].play_name,
      "玩法集ID": '',
      "区域位置": "主列表"
    }
  }
  this.match_list_card && this.match_list_card.update_match_cur_card_style(this.match.mid,play_key)
}

/**
 * @Description 角球折叠
 * @param {undefined} undefined
*/
const fold_tab_play = () => {
  this.match_list_card && this.match_list_card.fold_tab_play(this.match.mid)
}
</script>

<style lang="scss" scoped>
.basic-col {
  display: flex;
  align-items: center;
  cursor: pointer;
  .team-name {
    width: 100%;
    &.home {
      text-align: right;
      margin-right: 12px;
    }
    &.away {
      margin-left: 12px;
    }
  }
  .team-logo {
    width: 24px;
    max-height: 26px;
  }
  .score-wrap {
    width: 80px;
    margin: 0 8px;
    height: 24px;
    border-radius: 2px;
  }
}
.rangqiu {
  line-height: 35px;
  text-align: center;
}
.action-wrap {
  width: 60px;
  .play-count-wrap {
    margin-top: 5px;
  }
  .sr-link-icon-w {
    margin-right: 0px !important;
    margin-left: 10px;
  }
}
</style>