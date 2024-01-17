<!--
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 列表赛事盘口
-->
<template>
  <div :class="['c-match-handicap', { 'unfold_multi_column': match_style_obj.data_tpl_id == 13 }, get_5min_classname()]">
    <div class="row no-wrap">
      <!-- 玩法列表 -->
      <div class="handicap-col" v-for="(col, col_index) in col_ols_data" :key="col_index">
        <div  v-for="(ol_data, ol_index) in col.ols" :key="col_index + '_' + ol_index" 
          :class="['bet-item-wrap',ol_data?.other_class]"  :style="get_bet_style(col_index, lodash.get(col, 'ols.length'),ol_data)"
          >
          <!-- 投注项组件 -->
          <template
            v-if="match_style_obj.data_tpl_id != 'esports' || (match_style_obj.data_tpl_id == 'esports' && getCurState(ol_data._hipo))">
            <bet-item v-if="is_mounted && ol_data && ol_data._hpid" match_data_type="pc_list" :ol_data="ol_data" />
            <div class="c-bet-item" v-else>-</div>
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
import { ref, onMounted, computed, nextTick,toRef, inject } from 'vue';
import lodash from 'lodash';

import { utils_info } from 'src/core/utils/common/module/match-list-utils.js';
import { get_match_status } from 'src/core/utils/common/index'
import betItem from "src/base-pc/components/bet-item/bet-item-list-new-data.vue"
import { MatchFooterScoreFullVersionWapper as MatchFooterScore } from "src/base-pc/components/match-list/match-footer-score/index.js"
import BetData from 'src/core/bet/class/bet-data-class.js'
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
    default: () => true,
  },
  // 是否是附加盘 且有type
  add_type: {
    type: [String, Number],
    default: () => 1,
  },
  // 是否主球次要玩法
  other_play: {
    type: Boolean,
    default: () => false,
  }
})

const MatchListData=inject("MatchListData")
const match_style_obj=inject("match_style_obj")
const match=inject("match")
// 赛事模板宽度
const match_list_tpl_size=inject("match_list_tpl_size")
//非坑位对象
const not_hn_obj_map=inject('not_hn_obj_map')
// 组件是否已挂载
const is_mounted = ref(false);
const cur_esports_mode = ref(BetData.cur_esports_mode);
onMounted(() => {
  // 异步设置组件是否挂载完成
  setTimeout(() => {
    is_mounted.value = true
  })
})

//坑位对象
const hn_obj = toRef(MatchListData.list_to_obj,'hn_obj')
const col_ols_data = computed(() => {
  try {
    let { mid, csid } =match.value
    let handicap_type = props.add_type
    return lodash.cloneDeep(props.handicap_list || []).map(col => {
      col.ols = col.ols.map(item => {
        if (item.empty) { return }
        // 投注项数据拼接
        let hn_obj_config = MatchListData.get_list_to_obj_key(mid, `${mid}_${item._hpid}_${handicap_type}_${item.ot}`, 'hn')
        return Object.assign({other_class:item.other_class},lodash.get(hn_obj.value, hn_obj_config) || not_hn_obj_map.value[hn_obj_config] || {}) 
      })
      col.csid = csid;
      return col
    })
  } catch (e) {
    console.error('deal_width_handicap_ols', e)
    return []
  }
})

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
  let { bet_width } = match_list_tpl_size.value
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
    let { bet_width, media_width } = match_list_tpl_size.value
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
    padding: 4px;
    &.visibility {
      visibility: hidden;
    }

    &.right-rimless {
      border-right: none;
    }
    .c-bet-item {
      border-radius: 4px;
      background-color: var(--q-gb-bg-c-27);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>