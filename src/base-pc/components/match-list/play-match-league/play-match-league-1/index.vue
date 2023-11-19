<template>
  <div class="ouzhou-match-league" :style="`height:${match_list_tpl_size.league_title_height}px !important;`"
    v-if="lodash.get(card_style_obj, 'league_obj.csid')">
    <!-- 第一行 -->
    <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
    <div class="tr-match-head" @click="set_fold">
      <!-- 联赛信息 -->
      <div class="leagues-wrap" :style="`width:${match_list_tpl_size.process_team_width}px !important;`">
        <div class="yb-flex-center" :style="`width:${match_list_tpl_size.media_width - 3}px !important;`">
          <!-- 联赛是否收藏 -->
          <div @click.stop="collect"
            class="icon-wrap m-star-wrap-league" v-if="!menu_config.is_export() && GlobalAccessConfig.get_collectSwitch">
            <i class="icon-star q-icon c-icon" :class="is_collect && 'active'"></i>
          </div>
        </div>
        <!-- 联赛名称 -->
        <div class="ellipsis-wrap">
          <div class="absolute-full">
            <!-- 联赛数量 -->
            <span class="ellipsis allow-user-select leagues-name"
              v-tooltip="{ content: card_style_obj.league_obj.tn, overflow: 1 }">
              {{ card_style_obj.league_obj.tn || card_style_obj.league_obj.tid }}
            </span>
          </div>
        </div>
      </div>
      <div :style="`width:${match_list_tpl_size.play_icon_width}px !important;`"></div>
      <!-- 玩法名称 -->
      <div class="play-name-ouzhou" v-if="!card_style_obj.is_league_fold">
          <div class="play-name-title-box"
            v-for="(item, col_index) in match_tpl_info.get_current_odds_list(MatchListCardDataClass.get_csid_current_hpids(csid))"
            :key="col_index" :style="{ 'width': match_list_tpl_size.bet_width + 'px' }">
            <div class="play-name-item" v-for="(item_title, item_index) in item.ols" :key="item_index">
              {{ item_title.ot }}

            </div>
          </div>
      </div>
      <!-- 赛事数量 -->
      <div v-else class="league-match-count">
          <span>{{ card_style_obj.match_count}}</span>
        </div>
    </div>
  </div>
</template>

<script setup>
// import sportIcon from "src/public/components/sport_icon/sport_icon.vue"
import lodash from 'lodash';
import { ref, computed, onUnmounted } from 'vue';
import sprite_img from "src/core/server-img/sprite-img/index.js"
import BaseData from "src/core/base-data/base-data.js"
import { t, compute_css_obj } from "src/core/index.js";
import { get_match_tpl_title } from 'src/core/format/index.js'
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { utils_info } from 'src/core/utils/module/match-list-utils.js';
import { get_ouzhou_data_tpl_id } from 'src/core/match-list-pc/match-handle-data.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";

// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));

import { mx_collect } from "src/core/match-list-pc/composables/match-list-collect.js";

const props = defineProps({
  card_style_obj: {
    type: Object,
    default: () => { },
  },
  card_key: {
    type: String,
    default: () => ''
  }
})
const csid = lodash.get(props.card_style_obj, 'league_obj.csid')
let data_tpl_id = get_ouzhou_data_tpl_id(csid)
const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${data_tpl_id}_config`]
const match_list_tpl_size = lodash.get(MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`], 'width_config')
const is_collect = ref(false);
//第一次进页面时，收藏从接口获取状态，后续点击前端控制
is_collect.value = Boolean(lodash.get(props.card_style_obj, 'league_obj.tf'))
// 获取菜单类型
if (!csid && ['1', '500'].includes(menu_config.menu_root)) {
  useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST)
}
/**
 * @Description 设置联赛折叠
*/
function set_fold() {
  console.log('asdasdasfafasf', props.card_style_obj.is_league_fold ,11, ([2, 3].includes(menu_config.menu_root) ,22, menu_config.is_export()));

  // 如果当前联赛是折叠的 并且是今日、早盘  调用bymids接口拉数据
  if (props.card_style_obj.is_league_fold ) {
    // 设置赛事基础数据
    MatchListCardData.set_match_basic_data(props.card_style_obj)
    let params = {
      mids: props.card_style_obj.league_obj.mids.split(','),
      inner_param: 1
    };
    // 拉取http请求
    useMittEmit(MITT_TYPES.EMIT_API_BYMIDS, params)
  }
  MatchListCardData.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(props.card_style_obj)
}
var timer;
function collect(){
  mx_collect({ type: 'leagues', match: props.card_style_obj.league_obj });
  // 前端控制收藏状态
  is_collect.value = !is_collect.value;
  console.log('is_collect.value', is_collect.value);

  let params = {
    mids: props.card_style_obj.league_obj.mids.split(','),
    inner_param: 1
  };
  // 收藏后先这样刷新列表数据，后面再优化
  setTimeout(()=>{
    timer = useMittEmit(MITT_TYPES.EMIT_API_BYMIDS, params)    
  }, 1000)
}

onUnmounted(()=>{
  clearTimeout(timer)
})

</script>
<style lang="scss">
.ouzhou-match-league {
  display: flex;
  width: 100%;
  height: 100%;
  background: #F5F5F5;
  border-bottom: 1px solid var(--q-gb-bd-c-2);
  font-weight: 500;
  cursor: pointer;

  .leagues-wrap {
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;

    .leagues-name {
      margin-top: 3px;
    }
  }

  .tr-match-head {
    display: flex;
    flex-grow: 1;
  }

  .league-match-count {
      height: 100%;
      position: absolute;
      right: 13px;
      font-weight: 600;
      color: var(--q-gb-t-c-5);
      span {
        display: flex;
        height: 100%;
        align-items: center;
      }
    }
    
    .icon-star{
      &::before {
        color: var(--q-gb-bg-c-8);
      }
      &.active::before {
        color: var(--q-gb-bd-c-12);
      }
    }
}
</style>
