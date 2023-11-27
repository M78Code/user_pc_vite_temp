<template>
  <div class="basic-wrap" @click.stop="details.on_go_detail(match,null,router)" >

    <!-- 赛事信息 -->
    <div class="collect-box flex items-center justify-between">
      <div class="left-info-box flex items-center flex-start">
        <!-- 是否收藏 -->
        <div @click.stop="collect"
          v-if="GlobalAccessConfig.get_collectSwitch()">
          <div  class="collect-start" :style="compute_css_obj({key: is_collect ? 'pc-home-star-fill' : 'pc-home-star-empty'})"></div>
        </div>
        <!-- {{ match.mid }} -->
        <!-- 比赛进程 -->
        <match-process style="cursor:pointer" v-if="match" :match="match" source='match_list' show_page="match-list" :rows="1" :date_rows="1" date_show_type="inline"
        periodColor="gray" />
      </div>
      <!-- 玩法数量 -->
      <div class="right-handle-box flex flex-start items-center" v-if="lodash.get(match, 'mhn')">
        <span>{{ handicap_num }}</span>
        <div class="yb-icon-arrow"></div>
      </div>
    </div>
     <!-- 主队信息 -->
     <div class="row-item">
      <div class="team-logo">
        <img v-if="show_type == 'all' && home_avatar"
          v-img="[((lodash.get(match, 'match_logo') || {}) || {}).home_1_logo, (lodash.get(match, 'match_logo') || {}).home_1_letter]" />
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{'bold':lodash.get(match, 'team_let_ball')=='T1'}" v-tooltip="{content:lodash.get(match, 'mhn')+play_name_obj.suffix_name,overflow:1}">
            {{lodash.get(match, 'mhn')}}
          </div>
           <!-- 红牌数 -->
       <span  class="red-ball" v-show="lodash.get(match, 'msc_obj.S11.home',0)>0"
          :class="{ flash: is_show_home_red }">{{ lodash.get(match, 'msc_obj.S11.home') }}</span>
          <!-- 黄牌数 -->
       <span  class="red-ball yellow" v-show="lodash.get(match, 'msc_obj.S12.home',0)>0&&lodash.get(match, 'msc_obj.S11.home',0)<0"
          :class="{ flash: is_show_home_red }">{{ lodash.get(match, 'msc_obj.S12.home') }}</span>
        </div>
      </div>
      <!-- 主比分 -->
      <div class="score" v-if="show_type == 'all'" v-tooltip="{content: is_15min ? i18n_t('list.15min_stage'):'' ,overflow:1}">{{ lodash.get(match,`msc_obj.S1.home`)}}</div>
    </div>
    <!-- 客队信息 -->
    <div class="row-item kedui-item">
      <div class="team-logo">
        <img v-if="show_type == 'all' && away_avatar"
          v-img="[(lodash.get(match, 'match_logo') || {}).away_1_logo, (lodash.get(match, 'match_logo') || {}).away_1_letter]" />
      </div>  
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div
            class="team-name away ellipsis allow-user-select"
            :class="{'bold':lodash.get(match, 'team_let_ball')=='T2'}"
          >{{lodash.get(match, 'man')}}{{play_name_obj.suffix_name}}</div>
              <!-- 红牌数 -->
       <span  class="red-ball" v-show="lodash.get(match, 'msc_obj.S11.away')>0"
            :class="{ flash: is_show_away_red }">{{ lodash.get(match, 'msc_obj.S11.away') }}</span>
             <!-- 黄牌数 -->
       <span  class="red-ball yellow" v-show="lodash.get(match, 'msc_obj.S12.away',0)>0&&lodash.get(match, 'msc_obj.S11.away',0)<0"
          :class="{ flash: is_show_away_red }">{{ lodash.get(match, 'msc_obj.S12.away') }}</span>
        </div>
      </div>
   
      <!-- 主比分 -->
      <div
        class="score"
        :key="lodash.get(match, 'mid')"
        v-if="show_type == 'all'"
        v-tooltip="{content: is_15min ? i18n_t('list.15min_stage'):'' ,overflow:1}"
      >
        {{lodash.get(match,`msc_obj.S1.away`)}}
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
import { MenuData, MatchDataWarehouse_PC_List_Common, i18n_t } from "src/core/index.js"
import details  from "src/core/match-list-pc/details-class/details.js"
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
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
    const mc=lodash.get(props, 'match.mc')
    return mc?`+${lodash.get(props, 'match.mc')}`:'+0'
  }else{
    return i18n_t('match_info.more')
  }
})

const home_avatar = computed(()=>{
  const url = ((lodash.get(props.match, 'match_logo') || {}) || {}).home_1_logo || (lodash.get(props.match, 'match_logo') || {}).home_1_letter;
  return url
})

const away_avatar = computed(()=>{
  const url = (lodash.get(props.match, 'match_logo') || {}).away_1_logo ||  (lodash.get(props.match, 'match_logo') || {}).away_1_letter
  return url
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
.basic-wrap {
  padding: 10px 10px;
  .team-logo {
      display: flex;
      align-items: center;
      margin-right: 6px;
      img {
        width: 18px;
        height: 18px;
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
    padding-left: 25px;
    &+.row-item {
      margin-top: 4px;
    }

    .team-name {
      max-width: 180px;
    }
    &.kedui-item {
      color: var(--q-gb-t-c-8);
    }
    .score {
      font-weight: 500;
      color: var(--q-gb-t-c-5);
    }
  }
  .red-ball {
    // position: absolute;
    // top: 0px;
    // left:1px;
    height:14px;
    line-height: 14px;
    color:#fff;
    margin-left: 3px;
    min-width: 10px;
    padding: 0 1px;
    text-align: center;
    border-radius: 1px;
    font-size: 12px;
    background-color: #ff4141;
    &.yellow{
     background-color: #FFA800;
    }
    &.flash {
      animation: 1s text-flash linear infinite normal;
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
