<template>
  <div class="match-tpl-101 flex flex-start items-center">
    <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
    <!-- 赛事基础信息 -->
    <div class="basic-col"
      :style="`width:${match_list_tpl_size.process_team_width}px !important;height:80px !important;`">
      <!-- 比赛进程 网球用105模板，别的用101 -->
      <component v-if="match" :is="current_basic_info()" :match="match" show_type="all"></component>
      <!-- <basis-info101 :match="match" show_type="all" /> -->
      <!-- <basis-info105 v-else :match="match" show_type="all" /> -->
    </div>
    <!-- 竖线 -->
    <div class="vertical-line"></div>
    <!-- 图标信息 -->
    <div :style="`width:${match_list_tpl_size.play_icon_width}px !important;`">
      <icon-box :match="match"></icon-box>
    </div>
    <!-- 投注信息 -->
    <match-handicap :handicap_list="handicap_list" use_component_key="MatchHandicap2" />
    <!-- 比分板 -->
    <div v-tooltip="{ content: i18n_t('common.score_board') }" class="score-board"
      :style="`width:${match_list_tpl_size.media_width}px !important;`" @click="jump_to_details()">
      <!-- 图片资源有问题，先用文字替代  -->
      <div :style="compute_css_obj({ key: 'pc-home-score-board' })"></div>
    </div>
  </div>
</template>

<script>

import { ref, watch, inject } from 'vue';
import lodash from 'lodash'

import { MatchDataWarehouse_PC_List_Common as MatchListData, MenuData, MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance, } from "src/core/index.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { socket_remove_match } from "src/core/match-list-pc/match-list-composition.js";

import { MatchBasisInfo101FullVersionWapper as BasisInfo101 } from 'src/base-pc/components/match-list/match-basis-info/template-101/index.js'
import { MatchBasisInfo105FullVersionWapper as BasisInfo105 } from 'src/base-pc/components/match-list/match-basis-info/template-105/index.js'
import IconBox from '../modules/iconBox/index.vue'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import { compute_css_obj } from 'src/core/server-img/index.js'
import { useRouter } from 'vue-router';
import { get_ouzhou_data_tpl_id, check_match_end } from 'src/core/match-list-pc/match-handle-data.js'
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
export default {
  components: {
    BasisInfo101,
    BasisInfo105,
    MatchHandicap,
    IconBox
  },
  props: {
      is_show_more: {
        type: Boolean,
        default: () => false
      },
  },
  setup(props) {
    const router = useRouter()
    const match=inject("match")
    const {mid}=match.value||{}
    let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(mid)
    //101号模板 默认就是 101的宽高配置 不会改变
    let match_list_tpl_size = lodash.get(MATCH_LIST_TEMPLATE_CONFIG, 'template_101_config.width_config', {})
    let match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`]
    let handicap_list = ref([]);
    watch(() => MatchListCardDataClass.list_version, (new_value, old_value) => {
      if (match.value) {
        const csid = lodash.get(match.value, 'csid')
        //获取欧洲要显示的数据
        const tpl_id = get_ouzhou_data_tpl_id(csid)
        //101 视图模板 却是对应不同的数据模板ID 所以要重新取
        match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${tpl_id}_config`]
        //获取要展示的赔率数据
        handicap_list.value = match_tpl_info.get_current_odds_list(MatchListCardDataClass.get_csid_current_hpids(csid))
      }
    }, { deep: true, immediate: true })
    
    watch(() => [props.match?.ms, props.match?.mmp],() => {
      if (props.match) {
        check_match_end(props.match, socket_remove_match)      
      }
    }, { immediate: true })
    function current_basic_info() {
      if (match.value.csid == 5) {
        return 'BasisInfo105'
      } else {
        return 'BasisInfo101'
      }
    }
    // watch(() => MatchListCardDataClass.list_version.value, (new_value, old_value) => {
    //   if (match) {
    //     handicap_list.value = match_tpl_info.get_current_odds_list(MatchListCardDataClass.get_csid_current_hpids(lodash.get(match, 'csid')))
    //   }
    // })
    function jump_to_details() {
      const { tid, csid } = match.value;
      if(MenuData.is_scroll_ball()){
        // 控制右侧比分板
        MatchDataWarehouseInstance.set_match_details(match.value,[])
        useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, match.value.mid);
      }else {
        //比分板跳转到详情页
        router.push({
          name: 'details',
          params: {
            mid: mid,
            tid: tid,
            csid: csid
          }
        })
      }
    }


    return {
      current_basic_info,
      jump_to_details,
      MatchListCardDataClass,
      match_list_tpl_size,
      compute_css_obj,
      handicap_list,
      match
    }
  }
}



</script>

<style lang="scss" scoped>
.match-tpl-101 {
  background: var(--q-gb-bg-c-4);

  .vertical-line {
    width: 1px;
    height: 60px;
    background: var(--q-gb-bg-c-10);
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

.score-board {
  cursor: pointer;
  text-align: center;
  margin-left: auto;

  >div {
    width: 16px;
    height: 12px;
    background-size: 100%;
  }

  &:hover {
    color: var(--q-gb-bg-c-17);
  }
}
</style>