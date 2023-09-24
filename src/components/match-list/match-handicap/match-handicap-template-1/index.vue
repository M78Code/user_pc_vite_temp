<!--
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 列表赛事盘口
-->
<template>
  <div :class="['c-match-handicap', { 'unfold_multi_column': match.tpl_id == 13 }, get_5min_classname()]">
    <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
    <div class="row no-wrap">
      <!-- 玩法列表 -->
      <div class="handicap-col" v-for="(col, col_index) in handicap_list" :key="col_index">
        <div :class="['bet-item-wrap', ]"
          :style="get_bet_style(col_index, lodash.get(col, 'ols.length'))" v-for="(ol_data, ol_index) in deal_width_handicap_ols(col.ols)"
          :key="ol_index">
          {{ ol_data }}
          <!-- 投注项组件 -->
          <template v-if="match.tpl_id != 'esports' || (match.tpl_id == 'esports' && getCurState(ol_data._hipo))">
            <bet-item v-if="is_mounted && ol_data && ol_data._hpid" :ol_data="ol_data" />
          </template>
        </div>
      </div>
    </div>

    <!-- 赛事比分 -->
    <MatchFooterScore v-if="is_show_score" :match="match" :is_show_score_content="is_show_score_content"
      :score_wrap_width="lodash.get(match_list_tpl_size, 'bet_width', 0) * lodash.get(match_list_tpl_size, 'bet_col_count', 0)">
    </MatchFooterScore>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, computed } from 'vue';
import lodash from 'lodash';

import { utils_info } from 'src/core/utils/module/match-list-utils.js';
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
import { get_match_status } from 'src/core/utils/index'
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import betItem from "src/components/bet-item/bet-item-list-new-data.vue"
import { MatchFooterScoreFullVersionWapper as MatchFooterScore } from "src/components/match-list/match-footer-score/index.js"
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import BetData from 'src/core/bet/class/bet-data-class.js'
import MenuData from "src/core/menu-pc/menu-data-class.js";
import { compute_sport_id  } from 'src/core/constant/index.js'

// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
const props = defineProps({
  // 盘口列表
  handicap_list: {
    type: Array,
    default: () => [],
  },
  // 赛事
  match: {
    type: Object,
    default: () => {},
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
let current_csid = MenuData.left_menu_result.lv1_mi
// 赛事模板宽度
const match_list_tpl_size = ref(MATCH_LIST_TEMPLATE_CONFIG[`template_${compute_sport_id(current_csid)}_config`].width_config)

// 组件是否已挂载
const is_mounted = ref(true);
const cur_esports_mode = ref(BetData.cur_esports_mode);
onMounted(() => {
  // 异步设置组件是否挂载完成
  // setTimeout(() => {
  //   is_mounted.value = true
  // })
})

const deal_width_handicap_ols = (payload) => {
  const { match } = props;
  let handicap_type = 1
  let { hn, mid } =  match
  if(hn){
    handicap_type =  hn
  }else{
    handicap_type = 1
  }
  let new_ols = payload.map(item => {
    if (item.empty) { return }
    item = lodash.get(MatchListData, 'list_to_obj.hn_obj')[`${mid}_${mid}_${item._hpid}_${handicap_type}_${item.ot}`]
    return item;
  })
  return new_ols
}

/**
 * @description 获取5分钟玩法时的类名，滚球时不需要背景色，早盘时需要背景色
 */
const get_5min_classname = () => {
  let className = ''
  if (
    props.other_play && ['hps5Minutes'].includes(props.match.play_current_key) // 5分钟玩法
  ) {
    // 滚球 不需要背景色
    if (get_match_status(lodash.get(props, 'match.ms'), [110]) == 1) {
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
const get_bet_width = (index, other_class = '') => {
  // let { bet_width } = match_list_tpl_size.value
  let bet_width = 110;
  let { tpl_id } = props.match
  if (other_class.includes('col1.5')) {
    bet_width *= 1.5
  } else if (other_class.includes('col2')) {
    bet_width *= 2
  } else if (other_class.includes('col3')) {
    bet_width *= 3
  } else if (tpl_id == 22) {
    if (index <= 5) {
      bet_width += 5
    } else {
      bet_width -= 10
    }
  } else if ([0, 24, 1001].includes(+tpl_id) && utils_info.is_iframe) {
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
const get_bet_height = (length) => {
  let height = 35
  let { tpl_id } = props.match
  if (length == 1) {
    if (+tpl_id === 22) {
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
const get_bet_style = (col_index, length, ol_data) => {
  let other_class = lodash.get(ol_data, 'other_class', '')
  let style = `width:${get_bet_width(col_index, other_class)}px !important;height:${get_bet_height(length)}px !important;`
  if (other_class.includes('displacement')) {
    let { tpl_id } = props.match
    let { bet_width, media_width } = match_list_tpl_size.value
    let right = tpl_id == 13 ? bet_width * 7 + media_width - 1 : media_width - 1
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
const getCurState = (hipo) => {
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
</style>