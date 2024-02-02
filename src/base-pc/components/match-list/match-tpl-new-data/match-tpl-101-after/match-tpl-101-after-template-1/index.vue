<template>
  <div class="match-tpl-101">
    <div v-show="false">{{ MatchListCardDataClass.list_version }}
    </div>
    <div class="flex flex-start items-center">
      <!-- {{ match_style_obj.data_tpl_id }} -->
      <!-- 赛事基础信息 -->
      <div class="basic-col"
        :style="`width:${match_list_tpl_size.process_team_width}px !important;height:80px !important;`">
        <!-- 比赛进程 网球，羽毛球用105模板，别的用101 -->
        <component :is="current_basic_info()" :match="match" show_type="all"></component>
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
        :style="`width:${match_list_tpl_size.media_width}px !important;`">
        <template v-if="MenuData.is_eports_csid(match.csid)">
          <!-- 电竞只有视频 并且还是开始状态才有 -->
          <div class="video" v-if="get_match_status(match.ms)" @click="jump_to_details('video')"
            :style="compute_css_obj({ key: current_mid == match.mid && MenuData.is_scroll_ball() ? 'pc-img-match-list-video' : 'pc-img-match-info-video0' })">
          </div>
        </template>
        <template v-else>
          <!-- 图片资源有问题，先用文字替代   -->
          <div class="video" v-if="+lodash.get(match, 'mms') > 1" @click="jump_to_details('video')"
            :style="compute_css_obj({ key: current_mid == match.mid && MenuData.is_scroll_ball() ? 'pc-img-match-list-video' : 'pc-img-match-info-video0' })">
          </div>
          <div v-else-if="+lodash.get(match, 'mvs') > -1" @click="jump_to_details('animal')"
            :style="compute_css_obj({ key: current_mid == match.mid && MenuData.is_scroll_ball() ? 'pc-home-score-active' : 'pc-home-score-board' })">
          </div>
          <div v-else @click="jump_to_details('score')"
            :style="compute_css_obj({ key: current_mid == match.mid && MenuData.is_scroll_ball() ? 'pc-home-list-score-active' : 'pc-home-list-score' })">
          </div>
        </template>
      </div>
    </div>
    <div class="flex" v-if="is_score">
      <div :style="`width:${match_list_tpl_size.process_team_width}px !important;height:28px !important;`">
      </div>
      <div class="flex col items-start">
        <!-- 赛事比分 -->
        <MatchFooterScore use_component_key="MatchFooterScore2" :match_style_obj="match_style_obj" :match="match"
          style="width: 100%;" :is_show_score_content="true">
        </MatchFooterScore>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, inject } from 'vue';
import { MatchFooterScoreFullVersionWapper as MatchFooterScore } from "src/base-pc/components/match-list/match-footer-score/index.js"
import { MenuData, MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance, get_match_status } from "src/output/index.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { socket_remove_match } from "src/core/match-list-pc/match-list-composition.js";
import { MatchBasisInfo101FullVersionWapper as BasisInfo101 } from 'src/base-pc/components/match-list/match-basis-info/template-101/index.js'
import { MatchBasisInfo105FullVersionWapper as BasisInfo105 } from 'src/base-pc/components/match-list/match-basis-info/template-105/index.js'
import IconBox from '../modules/iconBox/index.vue'
import { MatchHandicapFullVersionWapper as MatchHandicap } from 'src/base-pc/components/match-list/match-handicap/index.js'
import { compute_css_obj } from 'src/core/server-img/index.js'
import { useRouter } from 'vue-router';
import { check_match_end } from 'src/core/match-list-pc/match-handle-data.js'
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'

export default {
  components: {
    BasisInfo101,
    BasisInfo105,
    MatchHandicap,
    IconBox, MatchFooterScore
  },
  props: {
    is_show_more: {
      type: Boolean,
      default: () => false
    },
  },
  setup(props) {
    const router = useRouter()
    const match = inject("match")
    const match_tpl_info = inject('match_tpl_info')
    const match_style_obj = inject('match_style_obj')
    const match_list_tpl_size = inject('match_list_tpl_size')
    const { csid } = match.value || {}
    let current_mid = MatchListCardDataClass.current_mid;
    let handicap_list = computed(() => {
      try {
        const _list = match_tpl_info.value?.get_current_odds_list(MatchListCardDataClass.get_csid_current_hpids(csid), MatchListCardDataClass.list_version.value)
        return _list
      } catch (e) {
        console.log(match_tpl_info.value, e, 'jiffy')
      }
      return []
    });

    let is_score = computed(() => {
      let status = false
      if ([109, 111, 112].includes(+match_style_obj.data_tpl_id)) {
        status = true
      }

      return status
    })

    // watch(() => MatchListCardDataClass.list_version, (new_value, old_value) => {
    //   if (match.value) {
    //     const csid = lodash.get(match.value, 'csid')
    //     //获取欧洲要显示的数据
    //     const tpl_id = get_ouzhou_data_tpl_id(csid)
    //     //101 视图模板 却是对应不同的数据模板ID 所以要重新取
    //     match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${tpl_id}_config`]
    //     //获取要展示的赔率数据
    //     handicap_list.value = 
    //   }
    // }, { deep: true, immediate: true })
    watch(() => MatchListCardDataClass.current_mid, (new_value, old_value) => {
      current_mid = new_value
    }, { deep: true, immediate: true })
    watch(() => [match.value.ms, match.value.mmp], () => {
      if (match.value?.mmp || match.value?.ms) {
        check_match_end(match.value, socket_remove_match)
      }
    }, { immediate: true, deep: true })
    function current_basic_info() {
      // 网球和羽毛球
      if (match.value.csid == 5 || match.value.csid == 10) {
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
    function jump_to_details(type) {
      const { tid, csid, mid, ms } = match.value;
      MatchListCardDataClass.set_current_mid(mid);
      if (MenuData.is_scroll_ball()) {
        // 控制右侧比分板
        match.value.showType = type   // 右侧比分榜需要将type 传过去
        MatchDataWarehouseInstance.set_match_details(lodash.cloneDeep(match.value), [])
        useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, mid);
      } else {
        //比分板跳转到详情页
        router.push({
          name: 'details',
          params: {
            mid: mid,
            tid: tid,
            csid: csid,
            type: type
          },
          query: { ms }  // 传多个ms  提前判断是否需要显示右侧
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
      match,
      get_match_status,
      MenuData,
      current_mid,
      match_style_obj,
      is_score
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

.score {
  width: 17px;
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