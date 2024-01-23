<template>
  <div class="c-match-item  match-tpl1-bg" :class="{ 'more-handicap': match.has_add1 || match.has_add2 }">
    <!-- 比赛进程 -->
    <div class="process-col yb-flex-center">
      <!--热门赛事显示hot标识-->
      <img class="match-hot" :src="compute_local_project_file_path('/image/common/svg/hot.svg')"
        v-show="lodash.get(match, 'is_hot')" />
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match" :match="match" source='match_list' show_page="match-list" :rows="2" />
    </div>
    <!-- 盘口 -->
    <div class="match-handicap-item-wrap">
      <!-- 主盘 -->
      <div class="match-handicap-item">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:105px !important;`">
          <basis-info1 v-if="is_mounted && match" show_type="all" />
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="match.main_handicap_list" />
        <!-- 视频按钮 -->
        <div class="media-col">
          <match-media :match="match" />
        </div>
      </div>
      <!-- 附加盘1 -->
      <div class="match-handicap-item" v-if="match.has_add1">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:70px !important;`">
          <!-- <basis-info4 v-if="is_mounted" :match="match" /> -->
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="match.add1_handicap_list" :add_type="2" />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
      <!-- 附加盘2 -->
      <div class="match-handicap-item" v-if="match.has_add2">
        <!-- 赛事基础信息 -->
        <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:70px !important;`">
          <!-- <basis-info4 v-if="is_mounted" :match="match" /> -->
        </div>
        <!-- 赛事盘口投注项 -->
        <match-handicap :handicap_list="match.add2_handicap_list" :match="match" :add_type="3" />
        <!-- 视频按钮 -->
        <div class="media-col"></div>
      </div>
      <template v-if="has_other_play">
        <!-- 角球玩法tab -->
        <div class="other-play-tab">
          <!-- <div class="process-col"></div> -->
          <div class="play-title col" @click="fold_tab_play"
            :style="`width:${match_list_tpl_size.team_width + match_list_tpl_size.bet_width * (match_style_obj.data_tpl_id == 13 ? 13 : 6)}px !important;flex:none`">
            <div class="arrow-wrap yb-flex-center">
              <div class="yb-icon-arrow" :class="{ active: match_style_obj.is_fold_tab_play }"></div>
            </div>
            <tab :list="play_name_list" :padding="10" :currentIndex="match?.play_current_index" tab_name_key="play_name"
              @onclick="play_tab_click" />
          </div>
          <div class="media-col"></div>
        </div>
        <!-- 次要玩法标题 -->
        <div :class="['fifteen-box', { 'double-title': ['en', 'ad', 'ms'].includes(UserCtr.lang) }]"
          v-if="!match_style_obj.is_fold_tab_play">
          <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`"></div>
          <div class="row">
            <div class="handicap-col fifteen-item bet-item-wrap fifteen_tab_txt secondary-gameplay-title-text" v-for="(item, key) in bet_col" :class="[{ 'tab-tilte-bg': set_secondary_bg(key, bet_col.length) },
            { 'flex justify-center items-center': item.includes('%n') },
            { 'highlight-t': set_secondary_bg(key, bet_col.length) && !item.includes('%n') }]" :key="key"
              :style="`width:${get_bet_width(key, bet_col.length,match.play_current_key == 'hpsCompose')}px !important;`"
              v-tooltip="{ content: item.includes('%n') ? '' : item, overflow: 1 }">
              <div class="double-row" v-if="item.includes('%n')">
                <div v-for="(text, i) in item.split('%n')"
                  :class="[{ 'highlight-t': i === 1 && [3, 4, 5].includes(key) }]" :key="i">{{ text }}</div>
              </div>
              <template v-else>
                {{ item }}
              </template>
            </div>
          </div>
        </div>
        <!-- 次要玩法盘 -->
        <!--  is_fold_tab_play 次要玩法 是否折叠  -->
        <div class="match-handicap-item other-handicap-item" v-if="!match_style_obj.is_fold_tab_play">
          <!-- 赛事基础信息 -->
          <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`">
            <basis-info4 v-if="is_mounted && match" :is_other_concede="true" :match="match" :is_show_score="true" />
          </div>
          <!-- 赛事盘口投注项 -->
          <match-handicap :handicap_list="match?.other_handicap_list" :match="match" other_play />
          <!-- 视频按钮 -->
          <div class="media-col"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue';
import lodash from 'lodash'
import { get_match_status, MenuData, UserCtr, compute_local_project_file_path } from "src/output/index.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
// useRegistPropsHelper(component_symbol, need_register_props)
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js';
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { socket_remove_match } from "src/core/match-list-pc/match-list-composition.js";
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo1FullVersionWapper as BasisInfo1 } from 'src/base-pc/components/match-list/match-basis-info/template-1/index.js'
import { MatchBasisInfo4FullVersionWapper as BasisInfo4 } from 'src/base-pc/components/match-list/match-basis-info/template-4/index.js'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'
import { CommonTabFullVersionWapper as Tab } from "src/base-pc/components/tab/common-tab/index.js";
import { check_match_end } from 'src/core/match-list-pc/match-handle-data.js'
import { switch_other_play, set_match_play_current_index, get_play_current_play } from 'src/core/match-list-pc/composables/match-list-other.js'
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
const match = inject("match")
const play_name_list = computed(() => {
  /**
   * @Description 设置次要玩法 tab
   * @param {string} tab_play_keys  所有次要玩法
  */
  let tab_play_keys = match.value?.tab_play_keys || '';
  let play_name_list_info = []
  if (typeof tab_play_keys !== 'string') return;
  let play_name_obj = {
    // 角球
    hpsCorner: { play_name: i18n_t('list.corner'), field: 'hpsCorner' },
    // 罚牌
    hpsPunish: { play_name: i18n_t('list.punish'), field: 'hpsPunish' },
    // 组合玩法
    hpsCompose: {
      // play_name: i18n_t("hps.compose.details.feature"),
      play_name: "特色玩法",
      field: "hpsCompose",
    },
    // 晋级赛
    hpsPromotion: { play_name: i18n_t('list.promotion'), field: 'hpsPromotion' },
    // 冠军
    hpsOutright: { play_name: i18n_t('list.outright'), field: 'hpsOutright' },
    // 加时赛
    hpsOvertime: { play_name: i18n_t('list.overtime'), field: 'hpsOvertime' },
    // 点球大战
    hpsPenalty: { play_name: i18n_t('list.penalty'), field: 'hpsPenalty' },
    // 15分钟玩法
    hps15Minutes: { play_name: i18n_t('list.15minutes'), field: 'hps15Minutes' },
    // 波胆
    hpsBold: { play_name: i18n_t('list.bold'), field: 'hpsBold' },
    // 5分钟玩法 5minutes_roll
    hps5Minutes: { play_name: get_match_status(lodash.get(match.value, 'ms'), [110]) == 1 ? i18n_t('list.5minutes_roll') : i18n_t('list.5minutes'), field: 'hps5Minutes' },
  }
  tab_play_keys = tab_play_keys.split(',')
  tab_play_keys.forEach(key => {
    play_name_obj[key] && play_name_list_info.push(play_name_obj[key])
  });
  // 是否有其他玩法
  if (play_name_list_info.length > 0) {
    // 当前选中的其他的玩法
    let play_key = get_play_current_play(match.value)
    //玩法关闭时选择第一个
    if (!tab_play_keys.includes(play_key)) {
      play_key = tab_play_keys[0]
    }
    // set_match_play_current_index(match.value, play_key)
  } else {
    // set_match_play_current_index(match.value, '')
  }
  return play_name_list_info
});
//当前选中的次要玩法
let match_style_obj = inject('match_style_obj')
let match_list_tpl_size = inject('match_list_tpl_size')
let match_tpl_info = inject('match_tpl_info')
const is_mounted = ref(true);
const has_other_play = computed(() => { //是否有其他玩法
  return play_name_list.value && play_name_list.value.length > 0
});

watch(() => [match.value.ms, match.value.mmp], () => {
  if (match.value?.mmp || match.value?.ms) {
    check_match_end(match.value, socket_remove_match)
  }
}, { immediate: true, deep: true })
// 其他玩法标题
const bet_col = computed(() => {
  let bet_col = []
  //是否多列
  let multi_column = lodash.get(match_style_obj, 'data_tpl_id') == 13
  let _play_current_key = get_play_current_play(match.value)
  if (MatchListCardDataClass.list_version.value) { }
  // 5分钟玩法
  if (_play_current_key == 'hps5Minutes') {
    let hpid = 361
    if (get_match_status(lodash.get('match.value.ms'), [110]) == 1) {
      hpid = 362
    }
    bet_col = [lodash.get(match.value, `play_obj.hpid_${hpid}.hpn`, '')]
    if (multi_column) {
      bet_col.push('')
    }
    // 波胆
  } else if (_play_current_key == 'hpsBold') {
    let { mhn, man } = match.value
    let [draw, ht_draw] = i18n_t('list.match_tpl_title.tpl1.bold_bet_col')
    bet_col = [mhn, draw, man, mhn, ht_draw, man]
    if (multi_column) {
      bet_col.push(...['', '', '', '', '', '', ''])
    }
    // 15分钟玩法
  } else if (_play_current_key == 'hps15Minutes') {
    let start = match.value.hSpecial - 1,
      end = match.value.hSpecial + (multi_column ? 3 : 1);
    bet_col = [...i18n_t('list.match_tpl_title.tpl1.15minutes_bet_col')]
    if (match.value.hSpecial > 3) {
      start -= 1
      end -= 1
    }
    if (match.value.hSpecial > 1) {
      bet_col.splice(2, 1)
    }
    bet_col = bet_col.slice(start, end)
    if (multi_column) {
      if (match.value.hSpecial > 1) {
        bet_col[bet_col.length - 1] = ''
      }
      if ([3, 4].includes(match.value.hSpecial)) {
        bet_col.push(...[''])
      }
      if (match.value.hSpecial == 5) {
        bet_col.push(...['', ''])
      }
      bet_col.push(...[''])
    } else {
      if (match.value.hSpecial == 5) {
        bet_col[bet_col.length - 1] = ''
      }
    }
    // 冠军
  } else if (_play_current_key == 'hpsOutright') {
    bet_col = [i18n_t('list.outright'), '', '', '', '', '']
    if (multi_column) {
      bet_col.push(...['', '', '', '', '', '', ''])
    }
    // 晋级
  } else if (_play_current_key == "hpsCompose") {
    bet_col = [
      "全場獨贏 & 兩隊都進球",
      "半場獨贏 & 兩隊都進球",
      // i18n_t("hps.compose.details.all_both"),
      // i18n_t("hps.compose.details.half_both"),
    ];
    if (multi_column) {
      bet_col.push(...["", "", ""]);
    }
  } else if (_play_current_key == 'hpsPromotion') {
    bet_col = [i18n_t('list.promotion'), '', '', '', '', '']
    if (multi_column) {
      bet_col.push(...['', '', '', '', '', '', ''])
    }
    //角球
  } else if (_play_current_key === 'hpsCorner') {
    bet_col = [...i18n_t('list.match_tpl_title.tpl1.corner_bet_col')]
    if (multi_column) {
      bet_col.push(...[...i18n_t('list.match_tpl_title.tpl13_m.corner_col'), '', '', ''])
    }
    //点球
  } else if (_play_current_key == 'hpsPenalty') {
    bet_col = [...i18n_t('list.match_tpl_title.tpl1.penalty_bet_col')]
    if (multi_column) {
      bet_col = bet_col.slice(0, 3)
      bet_col.push(...[...i18n_t('list.match_tpl_title.tpl13_m.penalty_col'), '', '', '', '', '', '', '', ''])
    }
    //加时赛
  } else if (_play_current_key == 'hpsOvertime') {
    bet_col = [...i18n_t('list.match_tpl_title.tpl1.overtime_bet_col')]
    if (multi_column) {
      bet_col.push(...[...i18n_t('list.match_tpl_title.tpl13_m.overtime_col'), '', '', '', '', ''])
    }
    // 罚牌
  } else if (_play_current_key == 'hpsPunish') {
    bet_col = [...i18n_t('list.match_tpl_title.tpl1.punish_bet_col')]
    if (multi_column) {
      bet_col.push(...[...i18n_t('list.match_tpl_title.tpl13_m.punish_col'), '', '', ''])
    }
  } else {
    bet_col = [...i18n_t('list.match_tpl_title.tpl1.bet_col')]
    if (multi_column) {
      bet_col.push(...['', '', '', '', '', '', ''])
    }
  }
  return bet_col
})



/**
 * @Description 设置次要玩法 bg
 * @param {Number} index  当前标题索引
 * @param {Number} length 整行标题个数
*/
function set_secondary_bg(index, length) {
  let bg_status = false
  if ([2, 5].includes(length) && index == 1 && lodash.get('match.value.play_current_key') !== 'hps5Minutes') {
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
 * @return {Number} isCompose 标题长度
*/
function get_bet_width(index, length, isCompose) {
  //是否多列
  let multi_column = lodash.get(match_style_obj, 'data_tpl_id') == 13
  let bet_width = match_list_tpl_size.value.bet_width
  if (multi_column) {
    if (length == 5) {
      if (index < 4) {
        bet_width = bet_width * 3
      }
    } else if (length === 1) {
      bet_width = bet_width * 13
    } else if (length === 2 && !isCompose) {
      if (index === 0) {
        bet_width = bet_width * 6
      } else {
        bet_width = bet_width * 7
      }
    } else if (isCompose) {
      if (index < 2) {
        bet_width = bet_width * 3;
      } else {
        bet_width = bet_width * 7;
      }
    }
  } else {
    if (length === 1) {
      bet_width = bet_width * 6
    } else if (length == 2) {
      bet_width = bet_width * 3
    } else if (isCompose) {
      if (index < 2) {
        bet_width = bet_width * 3;
      } else {
        bet_width = bet_width * 0;
      }
    } else {
      if (utils_info.is_iframe) {
        if ([0, 3].includes(index)) {
          bet_width = match_list_tpl_size.value.bet_width - 4
        } else {
          bet_width = match_list_tpl_size.value.bet_width + 2
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
function play_tab_click(obj) {
  // 当前已选中
  if (match.value.play_current_index == obj.index) {
    return
  }
  let play_key = play_name_list.value[obj.index].field
  // 切换玩法
  switch_other_play(match.value.mid, play_key)
  if (match.value.csid == 1) {
    let zhugeObj = {
      "玩法集名称": play_name_list.value[obj.index].play_name,
      "玩法集ID": '',
      "区域位置": "主列表"
    }
  }
  MatchListCardData && MatchListCardData.update_match_cur_card_style(match.value.mid, play_key)
}

/**
 * @Description 角球折叠
 * @param {undefined} undefined
*/
function fold_tab_play() {
  MatchListCardData && MatchListCardData.fold_tab_play(match.value.mid)
}
onMounted(() => {
  // 异步设置组件是否挂载完成
  // nextTick(()=>{
  //   is_mounted.value = true
  // })
})
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

  &.double-title {
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

    &.flex {
      line-height: 16px;
    }
  }

  .bet-item-wrap:last-child {
    border-right: none !important;
  }
}
</style>