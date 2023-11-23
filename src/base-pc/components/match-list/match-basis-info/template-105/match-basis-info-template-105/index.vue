<template>
  <div class="basic-wrap" @click.stop="on_go_detail">
    <!-- 发球方 -->
    <div class="serve-ball" :class="match.mat" v-if="match.csid != 4">
      <div class="point home"></div>
      <div class="point away"></div>
    </div>
    <!-- 主队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{'bold':match.other_team_let_ball=='T1'}" v-tooltip="{content:match.mhn,overflow:1}">{{match.mhn}}{{match.up_half_text}}</div>
        </div>
      </div>
      <!-- 当前盘下的当前局比分 -->
      <div class="score" v-if="match.csid == 5">{{ lodash.get(match, 'msc_obj.S103.home') }}</div>
      <!-- 当前局比分 -->
      <div class="score-game">{{match.cur_score.home}}</div>
    </div>
    <!-- 客队信息 -->
    <div class="row-item team-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'"></div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name away ellipsis allow-user-select" :class="{'bold':match.other_team_let_ball=='T2'}" v-tooltip="{content:lodash.get(match,'man'),overflow:1}">{{match.man}}{{match.up_half_text}}</div>
        </div>
      </div>
      <!-- 当前盘下的当前局比分 -->
      <div class="score" v-if="match.csid == 5">{{ lodash.get(match, 'msc_obj.S103.away') }}</div>
      <!-- 当前局比分 -->
      <div class="score-game">{{match.cur_score.away}}</div>
    </div>                      
    
    <div class="row-item match-icon">
      <!-- 提前结算 -->
       <div @click.stop="">
         <div
          v-if="lodash.get(match, 'mearlys', 0) && match_style_obj.data_tpl_id != 12 && vx_cur_menu_type.type_name!='bet'"
          class="icon-wrap settlement-pre relative-position"
          v-tooltip="{content: i18n_t('bet_record.settlement_pre')}"
        >
           <img class="match_pre" :src="compute_local_project_file_path('/image/png/match_pre.png')"/>
        </div>
       </div>
      <!-- 中立场、盘口数 -->
      <div class="flex more-info" :style="`${match.csid == 4 ? 'margin-top:35px':''}`">
        <!-- 中立场 -->
        <div class="neutral-wrap">
          <span v-if="match.mng" class="icon-neutral q-icon c-icon"><span class="path1"></span><span class="path2"></span></span>
        </div>
    
        <!-- 是否收藏 -->
        <span @click.stop="collect" class="yb-flex-center yb-hover-bg m-star-wrap-match" v-if="GlobalAccessConfig.get_collectSwitch()">
          <i aria-hidden="true" class="icon-star q-icon c-icon" :class="(match.mf==1 || match.mf==true) && 'active'"></i>
        </span>
        <!-- 统计分析 -->
        <div class="sr-link-icon-w" v-tooltip="{content:i18n_t('common.analysis')}" @click.stop="details.sr_click_handle(match)">
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

import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import lodash from 'lodash'
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';

import { get_match_status } from 'src/core/utils/index'
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { MenuData, MatchDataWarehouse_PC_List_Common } from "src/core/index.js"
import details  from "src/core/match-list-pc/details-class/details.js"
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { i18n_t,compute_local_project_file_path } from "src/core/index.js";
import { useRouter } from "vue-router";
import { format_mst_data } from 'src/core/utils/matches_list.js'
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { compute_css_obj } from 'src/core/server-img/index.js'

const router = useRouter()
const props = defineProps({
  match: {
    type: Object,
    default: () => {}
  },
  show_type: {
    type: String,
    default: () => ''
  },
  is_15min:{
    type:Boolean,
    default:false
  },
  is_show_more: {
    type:Boolean,
    default:false
  }
})


const is_show_home_goal = ref(false) // 是否显示主队进球动画
const is_show_away_goal = ref(false) // 是否显示客队进球动画
const is_show_home_red = ref(false) // 是否显示主队红牌动画
const is_show_away_red = ref(false) // 是否显示客队红牌动画
const is_collect = ref(false) //赛事是否收藏

let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(lodash.get(props, 'match.mid'))
const handicap_num = computed(() => {
  if(GlobalAccessConfig.get_handicapNum()){
    return `+${ lodash.get(props, 'match.mc') || 0}`
  }else{
    return i18n_t('match_info.more')
  }
})

const play_name_obj = computed(() => {
  let play_name_obj = {
    key: 'main',
    suffix_name: '',
    score_key: ''
  }
  let {ms, hSpecial}  =  props.match || {}
  //滚球
  if (get_match_status(ms, [110]) == 1) {
      //角球后缀
    if (MenuData.is_corner_menu()) {
      play_name_obj = {
        key: 'corner',
        suffix_name: ' - ' + i18n_t('list.corner'),
        score_key: 'S5'
      }
      //罚牌后缀
    } else if (match_style_obj.data_tpl_id == 25) {
      play_name_obj = {
        key: 'punish',
        suffix_name: ' - ' + i18n_t('list.punish'),
        score_key: 'S10102'
      }
      // 15分钟比分
    }else if(match_style_obj.data_tpl_id == 24 ){
      play_name_obj = {
        key: 'main',
        suffix_name: '',
        score_key: `S100${hSpecial}`
      }
    }
  }
  return play_name_obj
})

is_collect.value = Boolean(lodash.get(props, 'match.mf'))

/**
 * @Description 赛事收藏 
*/
const collect = () => {
  //前端修改收藏状态
  is_collect.value = !is_collect.value
  useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_MATCH, props.match)
}

// 监听收藏变化
watch(() => props.match.mf, (n) => {
  is_collect.value = Boolean(n)
})

//进球特效防抖
// hide_home_goal = this.debounce(hide_home_goal,5000);
// hide_away_goal = this.debounce(hide_away_goal,5000);

// 监听收藏数量，更新收藏icon 颜色
// watch(get_collect_count, () => {
//   const cur = props.match_list_data.mid_obj
//   is_collect.value = Boolean (cur['mid_'+props.match.mid].mf)
// })

// 监听主比分变化
// watch(props.match.home_score, (n) => {
//   //推送时间是否过期
//   let is_time_out = (get_remote_time()-props.match.ws_update_time)<3000
//   // 足球 并且已开赛
//   if(props.match.csid == 1 && get_match_status(props.match.ms,[110]) == 1 && n!=0 && is_time_out ){
//     is_show_home_goal.value = true;
//     hide_home_goal();
//   }
// })

// // 监听主比分变化
// watch(props.match.away_score, (n) => {
//   //推送时间是否过期
//   let is_time_out = (get_remote_time()-props.match.ws_update_time)<3000
//   // 足球 并且已开赛
//   if(props.match.csid == 1 && get_match_status(props.match.ms,[110]) == 1  && n!=0 && is_time_out ){
//     is_show_away_goal.value = true;
//     hide_away_goal();
//   }
// })

let timer;

/**
   * @description 开赛时间自动加1
   * @param {object} payload 
   */
   const use_polling_mst = payload => {
    if (payload.cmec === 'timeout' ) return payload.mstValue = format_mst_data(payload.mst)
    // mlet 每个阶段的时间
    if ([301, 302, 303].includes(payload.mle)) return payload.mstValue = payload.mlet;
    if (Number(payload.mst) <= 0 || payload.ms !== 1) return
    if (payload.csid === '2') {
      
      timer = setInterval(() => {
      if (payload.mst <= 0) return
        payload.mst--
        payload.mstValue = format_mst_data(payload.mst)
      }, 1000)
    } else {
      timer = setInterval(() => {
        payload.mst++
        payload.mstValue = format_mst_data(payload.mst)
        
      }, 1000)
    }
    
  }

/**
 * @Description 隐藏主队进球动画
 * @param {undefined} undefined
*/
function hide_home_goal () {
  is_show_home_goal.value = false;
}

/**
 * @Description 隐藏客队进球动画
 * @param {undefined} undefined
*/
function hide_away_goal () {
  is_show_away_goal.value = false;
}

onMounted(()=>{
  // use_polling_mst(props.match);
})

onUnmounted(() => {
  clearInterval(timer);
  timer = null;
  // this.debounce_throttle_cancel(hide_home_goal());
  // this.debounce_throttle_cancel(hide_away_goal());
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
