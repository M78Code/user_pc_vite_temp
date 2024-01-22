<template>
  <div class="ouzhou-match-league" :style="`height:${match_list_tpl_size.league_title_height}px !important;`">
    <!-- 第一行 -->
    <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
    <div class="tr-match-head">
      <!-- 联赛信息 -->
      <div class="leagues-wrap" :style="`width:${match_list_tpl_size.process_team_width}px !important;`">
        <div class="yb-flex-center" :style="`width:${match_list_tpl_size.media_width - 3}px !important;`">
        </div>
        <div class="row items-center">
          <img class="vr-clock" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/vr_clock.png`"/>
          <!-- 未开赛时间 -->
          <span class="state">{{ match_item_batch.timer_format }}</span>
          <!-- 联赛轮次 -->
          <div class="league-name">
            {{ match_item_batch.no }}
          </div>
        </div>
      </div>
      <div :style="`width:${match_list_tpl_size.play_icon_width}px !important;`"></div>
      <!-- 足蓝玩法名称 -->
      <div class="play-name-ouzhou" v-if="csid == 1001 || csid == 1004">
        <div class="play-name-title-box"
          v-for="(item, col_index) in match_tpl_info.get_current_odds_list(MatchListCardDataClass.get_csid_current_hpids(csid))"
          :key="col_index" :style="{ 'width': match_list_tpl_size.bet_width + 'px' }">
          <div class="play-name-item" v-for="(item_title, item_index) in item.ols" :key="item_index">
            {{ i18n_t(`ouzhou.bet_col.bet_col_${item_title._hpid}.bet_col_${item_title.ot}`) }}
          </div>
        </div>
      </div>
      <!-- 赛马类玩法名称 -->
      <div v-else class="play-name-ouzhou" :style="{ 'width': 661 + 'px' }">
        <!-- 冠军 -->
        <div class="play-name-item">{{i18n_t('list.virtual_match_type_title.type1011.bet_col.0')}}</div>
        <!-- 前二 -->
        <div class="play-name-item">{{i18n_t('list.virtual_match_type_title.type1011.bet_col.1')}}</div>
        <!-- 前三 -->
        <div class="play-name-item" v-if="csid !='1009'">{{i18n_t('list.virtual_match_type_title.type1011.bet_col.2')}}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash from 'lodash';
import { ref, computed, onUnmounted, watch } from 'vue';
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MenuData, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

const props = defineProps({
  match_item_batch: {
    type: Object,
    default: () => {}
  },
  csid: {
    type: Number,
    default: () => null
  }
})

const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${props.csid == '1001' ? 129 : 126}_config`]
const match_list_tpl_size = lodash.get(MATCH_LIST_TEMPLATE_CONFIG[`template_${props.csid == '1001' ? 129 : 126}_config`], 'width_config')


</script>
<style lang="scss">
.ouzhou-match-league {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--q-gb-bg-c-15);
  border-bottom: 1px solid var(--q-gb-bd-c-2);
  font-weight: 500;
  cursor: auto;

  .play-name-ouzhou {
    .play-name-item {
      height: 40px;
      line-height: 40px;
      text-align: center;
      flex: 1;
    }
  }
  .vr-clock {
    width: 14px;
    height: 13px;
    margin-right: 9px;
  }
  .league-name {
    color: #1A1A1A;
    font-weight: 500;
    margin-left: 20px;
  }
  .state {
    color: #1A1A1A
  }

  .league-icon-wrap {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    line-height: 18px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .leagues-wrap {
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .tr-match-head {
    display: flex;
    flex-grow: 1;
  }

  .play-name-item {
    color: var(--q-layout-color-1);
    font-weight: 500;
  }
  

}
</style>