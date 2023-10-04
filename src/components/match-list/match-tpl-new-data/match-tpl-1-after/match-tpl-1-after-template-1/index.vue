<template>
  <div class="c-match-item  match-tpl1-bg" :class="{ 'more-handicap': lodash.get(match, 'has_add1') || lodash.get(match, 'has_add2') }" v-if="match">
  <!-- <div class="c-match-item  match-tpl1-bg" :class="{ 'more-handicap': match.has_add1 || match.has_add2 }"> -->
    <div v-show="false">{{ MatchListData.data_version.version }}</div>
    <div v-show="false">{{ MatchListCardData.list_version }}</div>
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" src="~public/image/common/svg/hot.svg" v-show="lodash.get(match, 'is_hot')" />
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match" :match="match" source='match_list'
        show_page="match-list" :rows="2" />
    </div>
    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:105px !important;`">
          <basis-info1 v-if="is_mounted" :match="match" show_type="all" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="match_tpl_info[`template_${match_style_obj.data_tpl_id}`].main_handicap_list" :match="match" />
        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media :match="match" />
        </div>
      </div>
      <!-- 附加盘1 -->
      <div class="match-handicap-item" v-if="lodash.get(match, 'has_add1')">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:70px !important;`">
          <!-- <basis-info4 v-if="is_mounted" :match="match" /> -->
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="match_tpl_info[`template_${match_style_obj.data_tpl_id}`].add_handicap_list" :match="match" />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
      <!-- 附加盘2 -->
      <div class="match-handicap-item" v-if="lodash.get(match, 'has_add2')">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:70px !important;`">
          <!-- <basis-info4 v-if="is_mounted" :match="match" /> -->
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="match_tpl_info[`template_${match_style_obj.data_tpl_id}`].add_handicap_list" :match="match" />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
      <!-- 角球玩法tab -->
      <div class="other-play-tab" v-if="lodash.get(match, 'has_other_play')">
        <!-- <div class="process-col"></div> -->
        <div class="play-title col" @click="fold_tab_play"
          :style="`width:${match_list_tpl_size.team_width + match_list_tpl_size.bet_width * (match_style_obj.data_tpl_id == 13 ? 13 : 6)}px !important;flex:none`">
          <div class="arrow-wrap yb-flex-center">
            <div class="yb-icon-arrow" :class="{ active: match_style_obj.is_fold_tab_play }"></div>
          </div>
          <tab :list="play_name_list" :padding="10" :currentIndex="lodash.get(match, 'play_current_index')" tab_name_key="play_name"
            @onclick="play_tab_click" />

        </div>
        <div class="media-col"></div>
      </div>
      <!-- 次要玩法标题 -->
      <div :class="['fifteen-box', { 'double-title': ['en', 'ad', 'ms'].includes(UserCtr.lang) }]"
        v-if="lodash.get(match, 'has_other_play') && !match_style_obj.is_fold_tab_play">
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`"></div>
        <div class="row">
          <div class="handicap-col fifteen-item bet-item-wrap fifteen_tab_txt"
            :class="[{ 'tab-tilte-bg': set_secondary_bg(key, bet_col.length) }, { 'flex justify-center items-center': item.includes('%n') }, { 'highlight-t': set_secondary_bg(key, bet_col.length) && !item.includes('%n') }]"
            :key="key" :style="`width:${get_bet_width(key, bet_col.length)}px !important;`"
            v-tooltip="{ content: item.includes('%n') ? '' : item, overflow: 1 }" v-for="(item, key) in bet_col">
            <div class="double-row" v-if="item.includes('%n')">
              <div v-for="(text, i) in item.split('%n')" :class="[{ 'highlight-t': i === 1 && [3, 4, 5].includes(key) }]"
                :key="i">{{ text }}</div>
            </div>
            <template v-else>
              {{ item }}
            </template>
          </div>
        </div>
      </div>
      <!-- 次要玩法盘 -->
      <!--  is_fold_tab_play 次要玩法 是否折叠  -->
      <div class="match-handicap-item other-handicap-item"
        v-if="lodash.get(match, 'has_other_play') && !match_style_obj.is_fold_tab_play">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
          <basis-info4 v-if="is_mounted" :is_other_concede="true" :match="match" :is_show_score="true" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="match_tpl_info[`template_${match_style_obj.data_tpl_id}`].hpsOutright" :match="match" other_play />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>

    </div>
  </div>
</template>

<script setup>

import { ref, computed, watch, onMounted, nextTick } from 'vue';
import lodash from 'lodash'

import { t, get_match_status, MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
// useRegistPropsHelper(component_symbol, need_register_props)
import { utils_info } from 'src/core/utils/module/match-list-utils.js';
import { UserCtr } from 'src/core/index.js';

import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo1FullVersionWapper as BasisInfo1 } from 'src/components/match-list/match-basis-info/template-1/index.js'
import { MatchBasisInfo4FullVersionWapper as BasisInfo4 } from 'src/components/match-list/match-basis-info/template-4/index.js'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/components/match-list/match-handicap/index.js'
import MatchMedia from 'src/components/match-list/match-media/index.vue'
import { CommonTabFullVersionWapper as Tab } from "src/components/tab/common-tab/index.js";

const props = defineProps({
  mid: {
    type: [String, Number],
    default: null,
  },
  is_show_more: {
    type: Boolean,
    default: () => false
  }
})

const play_name_list = ref([]);
let match_style_obj = MatchListCardDataClass.all_card_obj[props.mid+'_']
const match_list_tpl_size = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config
const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`]
let match = MatchListData.list_to_obj.mid_obj[props.mid+'_'];
const is_mounted = ref(true);

watch(() => MatchListData.data_version.version, (new_value, old_value) => {
  match = MatchListData.list_to_obj.mid_obj[props.mid+'_'];
})

// const match = computed(() => {
//   return MatchListData.list_to_obj.mid_obj[props.mid+'_']
// })
// 其他玩法标题
const bet_col = computed(() => {
  let bet_col = []
  //是否多列
  let multi_column = lodash.get( 'match_style_obj.data_tpl_id') == 13
  let play_current_key = lodash.get( 'match.play_current_key')

  // 5分钟玩法
  if (play_current_key == 'hps5Minutes') {
    let hpid = 361
    if (get_match_status(lodash.get( 'match.ms'), [110]) == 1) {
      hpid = 362
    }
    bet_col = [lodash.get( `match.play_obj.hpid_${hpid}.hpn`, '')]
    if (multi_column) {
      bet_col.push('')
    }
    // 波胆
  } else if (play_current_key == 'hpsBold') {
    let { mhn, man } = match
    let [draw, ht_draw] = t('list.match_tpl_title.tpl1.bold_bet_col')
    bet_col = [mhn, draw, man, mhn, ht_draw, man]
    if (multi_column) {
      bet_col.push(...['', '', '', '', '', '', ''])
    }
    // 15分钟玩法
  } else if (play_current_key == 'hps15Minutes') {
    let start = match.hSpecial - 1,
      end = match.hSpecial + (multi_column ? 3 : 1);
    bet_col = [...t('list.match_tpl_title.tpl1.15minutes_bet_col')]
    if (match.hSpecial > 3) {
      start -= 1
      end -= 1
    }
    if (match.hSpecial > 1) {
      bet_col.splice(2, 1)
    }
    bet_col = bet_col.slice(start, end)
    if (multi_column) {
      if (match.hSpecial > 1) {
        bet_col[bet_col.length - 1] = ''
      }
      if ([3, 4].includes(match.hSpecial)) {
        bet_col.push(...[''])
      }
      if (match.hSpecial == 5) {
        bet_col.push(...['', ''])
      }
      bet_col.push(...[''])
    } else {
      if (match.hSpecial == 5) {
        bet_col[bet_col.length - 1] = ''
      }
    }
    // 冠军
  } else if (play_current_key == 'hpsOutright') {
    bet_col = [t('list.outright'), '', '', '', '', '']
    if (multi_column) {
      bet_col.push(...['', '', '', '', '', '', ''])
    }
    // 晋级
  } else if (play_current_key == 'hpsPromotion') {
    bet_col = [t('list.promotion'), '', '', '', '', '']
    if (multi_column) {
      bet_col.push(...['', '', '', '', '', '', ''])
    }
    //角球
  } else if (play_current_key === 'hpsCorner') {
    bet_col = [...t('list.match_tpl_title.tpl1.corner_bet_col')]
    if (multi_column) {
      bet_col.push(...[...t('list.match_tpl_title.tpl13_m.corner_col'), '', '', ''])
    }
    //点球
  } else if (play_current_key == 'hpsPenalty') {
    bet_col = [...t('list.match_tpl_title.tpl1.penalty_bet_col')]
    if (multi_column) {
      bet_col = bet_col.slice(0, 3)
      bet_col.push(...[...t('list.match_tpl_title.tpl13_m.penalty_col'), '', '', '', '', '', '', '', ''])
    }
    //加时赛
  } else if (play_current_key == 'hpsOvertime') {
    bet_col = [...t('list.match_tpl_title.tpl1.overtime_bet_col')]
    if (multi_column) {
      bet_col.push(...[...t('list.match_tpl_title.tpl13_m.overtime_col'), '', '', '', '', ''])
    }
    // 罚牌
  } else if (play_current_key == 'hpsPunish') {
    bet_col = [...t('list.match_tpl_title.tpl1.punish_bet_col')]
    if (multi_column) {
      bet_col.push(...[...t('list.match_tpl_title.tpl13_m.punish_col'), '', '', ''])
    }
  } else {
    bet_col = [...t('list.match_tpl_title.tpl1.bet_col')]
    if (multi_column) {
      bet_col.push(...['', '', '', '', '', '', ''])
    }
  }
  return bet_col
})

/**
 * @Description 设置次要玩法 tab
 * @param {string} tab_play_keys  所有次要玩法
*/
const set_play_name_list = (tab_play_keys = '') => {
  let play_name_list_info = []
  if (typeof tab_play_keys !== 'string') return
  let play_name_obj = {
    // 角球
    hpsCorner: { play_name: t('list.corner'), field: 'hpsCorner' },
    // 罚牌
    hpsPunish: { play_name: t('list.punish'), field: 'hpsPunish' },
    // 晋级赛
    hpsPromotion: { play_name: t('list.promotion'), field: 'hpsPromotion' },
    // 冠军
    hpsOutright: { play_name: t('list.outright'), field: 'hpsOutright' },
    // 加时赛
    hpsOvertime: { play_name: t('list.overtime'), field: 'hpsOvertime' },
    // 点球大战
    hpsPenalty: { play_name: t('list.penalty'), field: 'hpsPenalty' },
    // 15分钟玩法
    hps15Minutes: { play_name: t('list.15minutes'), field: 'hps15Minutes' },
    // 波胆
    hpsBold: { play_name: t('list.bold'), field: 'hpsBold' },
    // 5分钟玩法 5minutes_roll
    hps5Minutes: { play_name: get_match_status(lodash.get( 'match.ms'), [110]) == 1 ? t('list.5minutes_roll') : t('list.5minutes'), field: 'hps5Minutes' },
  }
  tab_play_keys = tab_play_keys.split(',')
  tab_play_keys.forEach(key => {
    play_name_obj[key] && play_name_list_info.push(play_name_obj[key])
  });
  play_name_list.value = play_name_list_info
}

/**
 * @Description 设置次要玩法 bg
 * @param {Number} index  当前标题索引
 * @param {Number} length 整行标题个数
*/
const set_secondary_bg = (index, length) => {
  let bg_status = false
  if ([2, 5].includes(length) && index == 1 && lodash.get( 'match.play_current_key') !== 'hps5Minutes') {
    bg_status = true
  } else if ([3, 4, 5].includes(index) && length > 5) {
    bg_status = true
  }
  return bg_status
}

/**
 * @Description 设置次要玩法 标题宽度
 * @param {Number} index  当前标题索引
 * @param {Number} length 整行标题个数
 * @return {Number} bet_width 标题长度
*/
const get_bet_width = (index, length) => {
  //是否多列
  let multi_column = lodash.get( 'match_style_obj.data_tpl_id') == 13
  let bet_width = match_list_tpl_size.bet_width
  if (multi_column) {
    if (length == 5) {
      if (index < 4) {
        bet_width = bet_width * 3
      }
    } else if (length === 1) {
      bet_width = bet_width * 13
    } else if (length === 2) {
      if (index === 0) {
        bet_width = bet_width * 6
      } else {
        bet_width = bet_width * 7
      }
    }
  } else {
    if (length === 1) {
      bet_width = bet_width * 6
    } else if (length == 2) {
      bet_width = bet_width * 3
    } else {
      if (utils_info.is_iframe) {
        if ([0, 3].includes(index)) {
          bet_width = match_list_tpl_size.bet_width - 4
        } else {
          bet_width = match_list_tpl_size.bet_width + 2
        }
      }
    }
  }
  return bet_width
}

/**
 * @Description 点击tab玩法
 * @param {undefined} undefined
*/
const play_tab_click = (obj) => {
  // 当前已选中
  if(match.play_current_index == obj.index){
    return
  }
  let play_key = play_name_list.value[obj.index].field
  // 切换玩法
  this.match_list_data.switch_other_play(match.mid,play_key)
  if (match.csid == 1) {
    let zhugeObj = {
      "玩法集名称": play_name_list.value[obj.index].play_name,
      "玩法集ID": '',
      "区域位置": "主列表"
    }
  }
  MatchListCardData && MatchListCardData.update_match_cur_card_style(match.mid,play_key)
}

/**
 * @Description 角球折叠
 * @param {undefined} undefined
*/
const fold_tab_play = () => {
  MatchListCardData && MatchListCardData.fold_tab_play(match.mid)
}

onMounted(() => {
  // 异步设置组件是否挂载完成
  // setTimeout(()=>{
  //   is_mounted.value = true
  // })
})

// 监听其他tab玩法标题变化  设置其他玩法tab栏
// watch(match.tab_play_keys, (tab_play_keys) => {
//   set_play_name_list(tab_play_keys)
// }, { immediate: true })

//赛事阶段变化时跟新次要玩法
// watch(match.ms, () => {
//   let tab_play_keys = lodash.get( 'match.tab_play_keys', '') || ''
//   if (tab_play_keys.includes('hps5Minutes')) {
//     set_play_name_list(tab_play_keys)
//   }
// }, { immediate: true })
</script>

<style lang="scss" scoped>
.other-play-tab {
  height: 32px;
  display: flex;
  .play-title {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    position: relative;
    .tab-wrap {
      :deep(.item-wrap) {
        .tab-item {
          padding: 0 10px;
        }
      }
    }
  }
  .arrow-wrap {
    width: 34px;
    height: 100%;
    .yb-icon-arrow {
      transform: rotate(270deg);
      &.active {
        transform: rotate(90deg);
      }
    }
  }
}
/*15分钟和角球tab*/
.fifteen-box {
  display: flex;
  height: 24px;
  &.double-title{
    height: 40px;
    .fifteen-item {
      line-height: 40px;
    }
  }
  .fifteen-item {
    text-align: center;
    font-weight: 500;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    height: 100%;
    padding: 0 2px;
    &.flex{
      line-height: 16px;
    }
  }
  .bet-item-wrap:last-child{
    border-right: none !important;
  }
}
</style>