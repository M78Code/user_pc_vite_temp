<!--
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 列表赛事盘口
-->
<template>
  <div class="c-match-handicap-ouzhou" :style="`height:${lodash.get(match_style_obj, `total_height`)}px !important;`">
    <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
    <div class="row no-wrap">
      <!-- 玩法列表 -->
      <div class="handicap-col-ouzhou" v-for="(col, col_index) in col_ols_data" :key="col._hpid + col_index"
        :style="{ 'width': match_list_tpl_size.bet_width + 'px' }">
        <div :class="['bet-item-wrap-ouzhou', (col.ols).length === 2 && 'bet-item-wrap-ouzhou-bigger']"
          v-for="(ol_data, ol_index) in (col.ols)" :key="ol_index + '_' + ol_data._hpid + '_' + ol_data._ot">
          <!-- 投注项组件 -->
          <bet-item :ol_data="ol_data" match_data_type="pc_list" :is_scroll_ball="MenuData.is_scroll_ball()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';

import { utils_info } from 'src/core/utils/common/module/match-list-utils.js';
import { get_match_status } from 'src/core/utils/common/index'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import betItem from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import BetData from 'src/core/bet/class/bet-data-class.js'
import MenuData from "src/core/menu-pc/menu-data-class.js"

const MatchListData = inject("MatchListData")
const match = inject("match")
const not_hn_obj_map = inject('not_hn_obj_map')

const props = defineProps({
  // 盘口列表
  handicap_list: {
    type: Array,
    default: () => [],
  },
  // 是否显示比分
  is_show_score: {
    type: Boolean,
    default: () => false,
  },
  // 是否显示比分内容
  is_show_score_content: {
    type: Boolean,
    default: () => false,
  },
  // 是否主球次要玩法
  other_play: {
    type: Boolean,
    default: () => false,
  }
})
let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(match.value)
// 赛事模板宽度
let match_list_tpl_size = MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`].width_config
const col_ols_data = computed(() => {
  try {
    let { hn, mid, csid } = match.value
    let handicap_type = hn || 1
    const hn_obj = lodash.get(MatchListData, "list_to_obj.hn_obj", {})
    return lodash.cloneDeep(props.handicap_list || []).map(col => {
      col.ols = col.ols.map(item => {
        if (item.empty) { return }
        // 投注项数据拼接
        let hn_obj_config = MatchListData.get_list_to_obj_key(mid, `${mid}_${item._hpid}_${handicap_type}_${item.ot}`, 'hn')
        // 获取投注项内容 
        return lodash.get(hn_obj, hn_obj_config) || not_hn_obj_map.value[hn_obj_config] || {};
      })
      col.csid = csid;
      return col
    })
  } catch (e) {
    console.error('deal_width_handicap_ols', e)
    return []
  }
})
// 组件是否已挂载
const cur_esports_mode = ref(BetData.cur_esports_mode);
/**
 * @description 获取5分钟玩法时的类名，滚球时不需要背景色，早盘时需要背景色
 */
function get_5min_classname() {
  let className = ''
  if (
    props.other_play && ['hps5Minutes'].includes(match.value.play_current_key) // 5分钟玩法
  ) {
    // 滚球 不需要背景色
    if (get_match_status(lodash.get(match.value, 'ms'), [110]) == 1) {
      className = 'not-bg-handicap min5-roll-handicap'
    } else {
      // not-bg-handicap 清除被影响的背景色
      className = 'not-bg-handicap min5-early-handicap'
    }
  }
  return className
}

/**
 * @description 获取投注项宽度
 * @param {Number} index 当前列表第几列
 * @param {string} other_class 样式类名
 * @return {Number}  bet_width 投注项宽度 
 */
function get_bet_width(index, other_class = '') {
  let { bet_width } = match_list_tpl_size
  // let bet_width = 110;
  let { data_tpl_id } = match_style_obj
  if (other_class.includes('col1.5')) {
    bet_width *= 1.5
  } else if (other_class.includes('col2')) {
    bet_width *= 2
  } else if (other_class.includes('col3')) {
    bet_width *= 3
  } else if (data_tpl_id == 22) {
    if (index <= 5) {
      bet_width += 5
    } else {
      bet_width -= 10
    }
  } else if ([0, 24, 1001].includes(+data_tpl_id) && utils_info.is_iframe) {
    if ([0, 3].includes(index)) {
      bet_width -= 4
    } else {
      bet_width += 2
    }
  }
  return bet_width
}


/**
 * @description 获取投注项宽度
 * @param {Object} length 当前列数量
 * @param { Object} ol_data 投注项
 * * @return {height} 投注项高度
 */
function get_bet_height(length) {
  let height = 35
  let { data_tpl_id } = match_style_obj
  if (length == 1) {
    if (+data_tpl_id === 22) {
      height = height * 3
    } else {
      height = height * 2
    }
  }
  return height
}
/**
* @description 获取投注项样式
* @param { Object} ol_data 投注项信息
* * @return {String} 投注项样式
*/
function get_bet_style(col_index, length, ol_data) {
  let other_class = lodash.get(ol_data, 'other_class', '')
  let style = `width:${get_bet_width(col_index, other_class)}px !important;height:${get_bet_height(length)}px !important;`
  if (other_class.includes('displacement')) {
    let { data_tpl_id } = match_style_obj
    let { bet_width, media_width } = match_list_tpl_size
    let right = data_tpl_id == 13 ? bet_width * 7 + media_width - 1 : media_width - 1
    style += `right: ${right}px;`
  }
  if (other_class.includes('row2')) {
    style += `margin-top: ${get_bet_height(length)}px;`
  }
  return style
}
/**
 * @description: 根据串关模式是否显示投注项
 * @param {hipo} 盘口是否支持 0不支持 1支持  
 * @return {undefined} undefined
 */
function getCurState(hipo) {
  if (cur_esports_mode.value) {
    //判断盘口是否支持
    return hipo == 1
  } else {
    //正常显示
    return true
  }
}

</script>
<style lang="scss" scoped>
.handicap-col {
  .bet-item-wrap {
    &.visibility {
      visibility: hidden;
    }

    &.right-rimless {
      border-right: none;
    }
  }
}

.c-match-handicap-ouzhou {
  .row {
    height: 100%;
  }
}
</style>