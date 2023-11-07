<template>
  <div class="match-tpl-101 flex flex-start items-center">
      <!-- 赛事基础信息 -->
      <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;height:80px !important;`">
          <basis-info1  :match="match" show_type="all" />
      </div>
      <!-- 竖线 -->
      <div class="vertical-line"></div>
      <!-- 图标信息 -->
      <icon-box></icon-box>
      <!-- 投注信息 -->
      <match-handicap></match-handicap>
      <!-- 最右侧图标 -->
      <div class="score-data-box" @click="jump_to_details(match)">
        <i aria-hidden="true" class="icon-signal q-icon c-icon"></i>
      </div>
  </div>
</template>

<script setup>

import { ref, computed, watch, onMounted, nextTick } from 'vue';
import lodash from 'lodash'

import { t, get_match_status, MatchDataWarehouse_PC_List_Common as MatchListData, UserCtr, compute_local_project_file_path } from "src/core/index.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
// useRegistPropsHelper(component_symbol, need_register_props)
import { utils_info } from 'src/core/utils/module/match-list-utils.js';
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import { MatchBasisInfo1FullVersionWapper as BasisInfo1 } from 'src/base-pc/components/match-list/match-basis-info/template-101/index.js'
import IconBox from '../modules/iconBox/index.vue'
import MatchHandicap from '../modules/matchHandicap/index.vue'
import MatchMedia from 'src/base-pc/components/match-list/match-media/index.vue'

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

let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(props.mid)
match_style_obj.data_tpl_id = 101; //调试用
const match_list_tpl_size = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config
const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`]
let match = MatchListData.list_to_obj.mid_obj[props.mid+'_'];
const is_mounted = ref(true);

watch(() => MatchListData.data_version.version, (new_value, old_value) => {
  match = MatchListData.list_to_obj.mid_obj[props.mid+'_'];
})

const jump_to_details = payload => {
    if (is_in_play && payload) {
      // score_img.value =  switch_active_icon;
      emitter.emit('set_detail_info', payload)
      return;
    }
    const {mid, csid} = card_info
    const params = {
      sportId: csid,
      mid,
      resource:route.path
    }

    router.push({
      path: '/details',
      query: params,
    })
  }






onMounted(() => {
  // 异步设置组件是否挂载完成
  // setTimeout(()=>{
  //   is_mounted.value = true
  // })
})

</script>

<style lang="scss" scoped>
.match-tpl-101{
  background: var(--q-gb-bg-c-11);
  .vertical-line {
    width: 1px;
    height: 60px;
    background: #e2e2e2;
    margin-right: 24px;
  }
}
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