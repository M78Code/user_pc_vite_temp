<template>
  <div class="match-tpl-129">
    <div class="flex flex-start items-center">
      <!-- 赛事基础信息 -->
      <div class="basic-col"
        :style="`width: 338px !important;height:80px !important;`">
        <!-- 比赛进程 网球，羽毛球用105模板，别的用101 -->
        <!-- <BasisInfo101 v-if="match" :match="match" show_type="all"></BasisInfo101> -->
        <!-- 战队名称 -->
        <div class="team-title" :class="{over:[2,11].includes(+match.match_status)}">
            <div class="ellipsis">{{match.teams ? match.teams[0] : ''}}</div>
          </div>
          <div class="team-title" :class="{over:[2,11].includes(+match.match_status)}">
            <div class="ellipsis">
              {{match.teams ? match.teams[1] : ''}}
            </div>
          </div>
      </div>
      <!-- 竖线 -->
      <div class="vertical-line"></div>
      <!-- 图标信息 -->
      <div :style="`width:115px !important;`">
        <icon-box :match="match"></icon-box>
      </div>
      <!-- 投注信息 -->
      <match-handicap :handicap_list="handicap_list" use_component_key="MatchHandicap2" />
      <!-- 比分板 -->
      <div v-tooltip="{ content: i18n_t('common.score_board') }" class="score-board"
        :style="`width:46px !important;`" @click="jump_to_details()">
        <!-- 图片资源有问题，先用文字替代  -->
        <div class="video" v-if="+lodash.get(match, 'mms') > 0"
          :style="compute_css_obj({ key: current_mid == match.mid && MenuData.is_scroll_ball() ? 'pc-img-match-list-video' : 'pc-img-match-info-video0' })">
        </div>
        <div v-else
          :style="compute_css_obj({ key: current_mid == match.mid && MenuData.is_scroll_ball() ? 'pc-home-score-active' : 'pc-home-score-board' })">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, ref, provide} from 'vue';
import { MatchBasisInfo101FullVersionWapper as BasisInfo101 } from 'src/base-pc/components/match-list/match-basis-info/template-101/index.js'
import IconBox from 'src/base-pc/components/match-list/match-tpl-new-data/match-tpl-101-after/modules/iconBox/index.vue'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import { compute_css_obj } from 'src/core/server-img/index.js'
import { useRouter } from 'vue-router';
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MenuData, MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance, } from "src/output/index.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/index.js";

export default {
  components: {
    BasisInfo101,
    MatchHandicap,
    IconBox
  },
  props: {
    is_show_more: {
      type: Boolean,
      default: () => false
    },
    mid: {
      type: String,
      default: () => null
    },
  },
  setup(props){

    const match = MatchListData.get_quick_mid_obj_ref(props.mid)
    provide("match", match)
    provide("MatchListData", MatchListData)

    let current_mid = MatchListCardDataClass.current_mid;

    const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_129_config`]
    
    let handicap_list = computed(() => {
      try{
        const hpids = MatchListCardDataClass.get_csid_current_hpids(match.value.csid);
        const list = match_tpl_info?.get_current_odds_list(hpids);
       return list
      }catch(e){
        console.error(match_tpl_info,e)
      }
      return []
    });
    

  return {
      compute_css_obj,
      current_mid,
      match,
      handicap_list
    }
}
 
}



</script>

<style lang="scss" scoped>
.match-tpl-129 {
  background: var(--q-gb-bg-c-4);

  .vertical-line {
    width: 1px;
    height: 60px;
    background: var(--q-gb-bg-c-10);
  }
  :deep(.handicap-col-ouzhou){
    width: 330px !important;
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
    height: 16px;
    background-size: 100%;
  }

  .video {
    width: 18px;
  }

  &:hover {
    color: var(--q-gb-bg-c-17);
  }
}
</style>