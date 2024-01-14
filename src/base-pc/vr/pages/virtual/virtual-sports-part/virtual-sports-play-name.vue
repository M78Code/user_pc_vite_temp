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
          <!-- 未开赛时间 -->
          <span class="state">{{ match_item_batch.timer_format }}</span>
          <!-- 联赛轮次 -->
          <div class="league-name">
            {{ match_item_batch.no }}
          </div>
        </div>
      </div>
      <div :style="`width:${match_list_tpl_size.play_icon_width}px !important;`"></div>
      <!-- 玩法名称 -->
      <div class="play-name-ouzhou">
        <div class="play-name-title-box"
          v-for="(item, col_index) in match_tpl_info.get_current_odds_list(MatchListCardDataClass.get_csid_current_hpids(csid))"
          :key="col_index" :style="{ 'width': match_list_tpl_size.bet_width + 'px' }">
          <div class="play-name-item" v-for="(item_title, item_index) in item.ols" :key="item_index">
            <!-- {{ item_title }} -->
            {{ i18n_t(`ouzhou.bet_col.bet_col_${item_title._hpid}.bet_col_${item_title.ot}`) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import sportIcon from "src/public/components/sport_icon/sport-icon.vue"
import lodash from 'lodash';
import { ref, computed, onUnmounted, watch } from 'vue';
import BaseData from "src/core/base-data/base-data.js"
import { MenuData, compute_css_obj, compute_img_url } from "src/output/index.js";
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { get_ouzhou_data_tpl_id } from 'src/core/match-list-pc/match-handle-data.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { get_server_file_path } from "src/core/file-path/file-path.js";

const props = defineProps({
  match_item_batch: {
    type: Object,
    default: () => {}
  }
})

const csid = '1001'
// let data_tpl_id = get_ouzhou_data_tpl_id(csid)
const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_129_config`]
const match_list_tpl_size = lodash.get(MATCH_LIST_TEMPLATE_CONFIG[`template_129_config`], 'width_config')


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

  .league-name {
    color: #1A1A1A;
    font-weight: 500;
    margin-left: 20px;
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