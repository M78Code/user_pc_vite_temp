<template>
  <div class="basic-wrap" @click.stop="details.on_go_detail(match,null,router,route)" >

    <!-- 赛事信息 -->
    <div class="collect-box flex items-center justify-between">
      <div class="left-info-box flex items-center flex-start">
        <!-- 是否收藏 -->
        <div @click.stop="collect"
          v-if="GlobalAccessConfig.get_collectSwitch()">
          <div  class="collect-start" :style="compute_css_obj({key: is_collect ? 'pc-home-star-fill' : 'pc-home-star-empty'})"></div>
        </div>
        <!-- 比赛进程 -->
        <match-process style="cursor:pointer" v-if="match" :match="match" source='match_list' show_page="match-list" :rows="1" :date_rows="1" date_show_type="inline"
        periodColor="gray" />
      </div>
      <!-- 玩法数量 -->
      <div class="right-handle-box flex flex-start items-center">
        <span>{{ handicap_num }}</span>
        <div class="yb-icon-arrow"></div>
      </div>
    </div>
     <!-- 主队信息 -->
     <div class="row-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'">
        <!-- 电竞和普通赛事图片地址不同需要传入csid(球种id)进行区分 -->
        <!-- 双打局，就会有两个头像 -->
        <div>
          <img v-if="show_type == 'all' && home_avatar"
          :style="show_default_img && compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).home_1_letter })"
          v-img="[(lodash.get(match, 'match_logo') || {}).home_1_logo, (lodash.get(match, 'match_logo') || {}).home_1_letter, match?.csid, update_show_default]" />
          <div v-else v-show="lodash.get(match, 'man')" :style="compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).home_1_letter })"></div>
        </div>
        <div v-if="lodash.get(match,'match_logo.is_double',false)">
          <img class="logo2" v-if="show_type == 'all' && home_avatar2"
          :style="show_default_img && compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).home_2_letter })"
          v-img="[(lodash.get(match, 'match_logo') || {}).home_2_logo, (lodash.get(match, 'match_logo') || {}).home_2_letter, match?.csid, update_show_default]" />
          <div class="logo2" v-else v-show="lodash.get(match, 'man')" :style="compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).home_2_letter })"></div>
        </div>
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{'bold': handicap_index == 1}" v-tooltip="{content:lodash.get(match, 'mhn')+play_name_obj.suffix_name,overflow:1}">
            {{lodash.get(match, 'mhn')}}
          </div>
          <!-- 发球方 -->
          <div class="serve-ball" :class="[match.mat == 'home' && 'active']" v-if="get_match_status(match.ms)">
            <div class="point"></div>
          </div>
        </div>
      </div>
      <!-- 当前盘下的当前局比分 -->
      <div class="score" v-if="get_match_status(match.ms)">{{ lodash.get(score_list, '[2].home')}}</div>
      <!-- 当前局比分 -->
      <div class="score-game" v-if="get_match_status(match.ms)">{{ lodash.get(match, 'msc_obj.S1.home') }}</div>
    </div>
    <!-- 客队信息 -->
    <div class="row-item kedui-item">
      <div class="team-logo" :class="lodash.get(match,'match_logo.is_double',false) && 'double-logo'">
        <!-- 同主队 -->
        <div>
          <img v-if="show_type == 'all' && away_avatar"
          :style="show_default_img && compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).away_1_letter })"
          v-img="[(lodash.get(match, 'match_logo') || {}).away_1_logo, (lodash.get(match, 'match_logo') || {}).away_1_letter,  match?.csid, update_show_default]" />
          <div v-else v-show="lodash.get(match, 'man')" :style="compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).away_1_letter })"></div>
        </div>
        <div v-if="lodash.get(match,'match_logo.is_double',false)">
          <img class="logo2" v-if="show_type == 'all' && away_avatar2"
          :style="show_default_img && compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).away_2_letter })"
          v-img="[(lodash.get(match, 'match_logo') || {}).away_2_logo, (lodash.get(match, 'match_logo') || {}).away_2_letter,  match?.csid, update_show_default]" />
          <div class="logo2" v-else v-show="lodash.get(match, 'man')" :style="compute_css_obj({ key: 'pc-team-logo', position: (lodash.get(match, 'match_logo') || {}).away_2_letter })"></div>
        </div>
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div
            class="team-name away ellipsis allow-user-select"
            :class="{'bold':handicap_index == 2}"
          >{{lodash.get(match, 'man')}}{{play_name_obj.suffix_name}}</div>
          <!-- 发球方 -->
          <div class="serve-ball" :class="[match.mat == 'away' && 'active']" v-if="get_match_status(match.ms)">
            <div class="point"></div>
          </div>
        </div>
      </div>
       <!-- 当前局比分 -->
      <div class="score" v-if="get_match_status(match.ms)">{{ lodash.get(score_list, '[2].away') }}</div>
      <!-- 主比分 -->
      <div class="score-game" v-if="get_match_status(match.ms)">{{ lodash.get(match, 'msc_obj.S1.away') }}</div>
    </div>


  </div>
</template>

<script setup>

import { computed, ref, watch, onMounted,inject, onUnmounted } from 'vue';
import lodash from 'lodash'
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';

import { get_match_status } from 'src/core/utils/common/index'
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { MenuData, MatchDataWarehouse_PC_List_Common } from "src/output/index.js"
import details  from "src/core/match-list-pc/details-class/details.js"
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { i18n_t,compute_local_project_file_path } from "src/output/index.js";
import { useRouter,useRoute } from "vue-router";
import { format_mst_data } from 'src/core/utils/matches_list.js'
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { compute_css_obj } from 'src/core/server-img/index.js'
import { get_handicap_index_by,get_history_score_list } from 'src/core/match-list-pc/match-handle-data.js'

const match=inject('match');

const router = useRouter()
const route = useRoute()
const props = defineProps({
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

const show_default_img = ref(false); //是否显示默认队伍头像

const update_show_default = (value)=>{
  show_default_img.value = value;
}

let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(lodash.get(match.value, 'match.mid'))
const handicap_num = computed(() => {
  if(GlobalAccessConfig.get_handicapNum()){
    return `${ lodash.get(match.value, 'mc') || 0}`
  }else{
    return i18n_t('match_info.more')
  }
})
const score_list=computed(()=>{
  return get_history_score_list(match.value)
})
const play_name_obj = computed(() => {
  let play_name_obj = {
    key: 'main',
    suffix_name: '',
    score_key: ''
  }
  let {ms, hSpecial}  =  match.value || {}
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

let handicap_index = computed(() => {
  return get_handicap_index_by(match.value)
})

/**
 * @Description 赛事收藏 
*/
const collect = () => {
  //前端修改收藏状态
  is_collect.value = !is_collect.value
  useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_MATCH, match.value)
}

const home_avatar = computed(()=>{
  const url = ((lodash.get(match.value, 'match_logo') || {}) || {}).home_1_logo;
  
  return url
})
const home_avatar2 = computed(()=>{
  const url = ((lodash.get(match.value, 'match_logo') || {}) || {}).home_2_logo;
  
  return url
})

const away_avatar = computed(()=>{
  const url = (lodash.get(match.value, 'match_logo') || {}).away_1_logo;
  return url
})

const away_avatar2 = computed(()=>{
  const url = (lodash.get(match.value, 'match_logo') || {}).away_2_logo;
  return url
})

// 监听收藏变化
watch(() => match.value.mf, (n) => {
  is_collect.value = Boolean(n)
}, { immediate: true})

//进球特效防抖
// hide_home_goal = this.debounce(hide_home_goal,5000);
// hide_away_goal = this.debounce(hide_away_goal,5000);

// 监听收藏数量，更新收藏icon 颜色
// watch(get_collect_count, () => {
//   const cur = match.value_list_data.mid_obj
//   is_collect.value = Boolean (cur['mid_'+match.value.mid].mf)
// })

// 监听主比分变化
// watch(match.value.home_score, (n) => {
//   //推送时间是否过期
//   let is_time_out = (get_remote_time()-match.value.ws_update_time)<3000
//   // 足球 并且已开赛
//   if(match.value.csid == 1 && get_match_status(match.value.ms,[110]) == 1 && n!=0 && is_time_out ){
//     is_show_home_goal.value = true;
//     hide_home_goal();
//   }
// })

// // 监听主比分变化
// watch(match.value.away_score, (n) => {
//   //推送时间是否过期
//   let is_time_out = (get_remote_time()-match.value.ws_update_time)<3000
//   // 足球 并且已开赛
//   if(match.value.csid == 1 && get_match_status(match.value.ms,[110]) == 1  && n!=0 && is_time_out ){
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
  // use_polling_mst(match.value);
})

onUnmounted(() => {
  clearInterval(timer);
  timer = null;
  // this.debounce_throttle_cancel(hide_home_goal());
  // this.debounce_throttle_cancel(hide_away_goal());
})
</script>
<style lang="scss" scoped>
.basic-wrap {
  padding: 10px 10px;
  .team-logo {
    display: flex;
    align-items: center;
    margin-right: 8px;
    img,div {
      width: 16px;
      height: 16px;
      background-size: 100%;
    }
    .logo2 {
      margin-left: -4px;
    }
  }
  .collect-box {
    margin-bottom: 7px;
    .collect-start {
      width: 14px;
      height: 14px;
      cursor: pointer;
      margin-right: 11px;
      background-size: 100% 100%;
    }
    .bet-num {
      margin-left: 12px;
      .match_times_hour {
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0px;
          color: var(--q-gb-bd-c-4);
          margin-right: 5px;
      }
      .match_times {
          color: var(--q-gb-bg-c-1);
          font-weight: 500;
      }
    }
    .right-handle-box {
      cursor: pointer;
      span {
        font-weight: 500;
        margin-right: 6px;
      }
    }
  }
  .row-item {
    position: relative;
    display: flex;
    height: 16px;
    align-items: center;
    cursor: pointer;
    &+.row-item {
      margin-top: 4px;
    }
    .team-name {
      max-width: 180px;
      &.bold {
        color: var(--q-gb-t-c-2);
      }
    }
    &.kedui-item {
      color: var(--q-gb-t-c-8);
    }
    .score {
      font-weight: 500;
      color: var(--q-gb-bg-c-2);
    }
  }
  .score-game {
    color: var(--q-gb-t-c-2);
    font-weight: 500;
  }

    /*  发球方 */
  .serve-ball {
    width: 5px;
    height: 5px;
    margin-left: 10px;
    &.active {
      .point {
        background-color: var(--q-gb-bg-c-1);
      }
    }
    .point {
      width: 100%;
      height: 5px;
      border-radius: 50%;
       background-color: var(--q-gb-bg-c-11);
    }
  }

  :deep(.c-match-process ) {
    .jingcai ,.process-name {
      margin-right: 5px;
    }
    .date-wrap {
      padding-left: 0 !important;
    }
  } 
}

</style>
