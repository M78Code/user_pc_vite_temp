<template>
  <div class="c-match-league"
    :class="[{ 'match-tpl1-bg': match_style_obj.data_tpl_id == 1 },
     card_style_obj.is_league_fold ? 'leagues-pack' : `match-tpl${match_style_obj.data_tpl_id}`]">
    <!-- 第一行 -->
    <div class="tr-match-head" @click="set_fold">
      <!-- 联赛信息 -->
      <div class="leagues-wrap" :class="match_style_obj.data_tpl_id == 12 && 'jingcai'"
        :style="`width:${match_list_tpl_size.process_team_width}px !important;`">
        <div :class="[
          'list-expand',
          {'list-expand-fold': card_style_obj.is_league_fold}
        ]" :style="compute_css_obj({ key: 'pc-home-list-expand' })"></div>
        <!-- 联赛图标 -->
        <div class="league-icon-wrap">
          <span class="soprts_id_icon" v-if="MenuData.is_esports()"
            :style="compute_css_obj({ key: 'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(card_style_obj.league_obj.csid)}` })"></span>
          <img v-else :src="leagueIcon" />
        </div>
        <!-- 联赛名称 -->
        <div class="ellipsis-wrap">
          <div class="absolute-full">
            <!-- 联赛数量 -->
            <span class="ellipsis allow-user-select" v-tooltip="{ content: card_style_obj.league_obj.tn, overflow: 1 }">
              {{ card_style_obj.league_obj.tn }}
            </span>
            <span class="league-match-count">{{ card_style_obj.match_count }}</span>
          </div>
        </div>

      </div>
      <!-- 玩法名称 -->
      <div v-if="version == 2" class="play-name row col">
        <!-- 这里有个1 应该是玩法的 -->
        <template v-if="[3, 5, 21].includes(+match_style_obj.data_tpl_id)">
          <div class="col">
            {{ bet_title[0] }}
          </div>
          <div class="col" :class="{ 'bet-col4 y0-col4': [3, 21].includes(+match_style_obj.data_tpl_id) }"
            v-if="match_style_obj.data_tpl_id != 5">
            {{ bet_title[1] }}
          </div>
        </template>
        <template v-else-if="[22].includes(+match_style_obj.data_tpl_id)">
          <div class="col" :style="get_title_style()">
            {{ bet_title[0] }}
          </div>
          <div class="col bet-col4 y0-col4" :style="get_title_style()">
            {{ bet_title[1] }}
          </div>
          <div class="col">
            {{ bet_title[2] }}
          </div>
        </template>
        <!-- 篮球 -->
        <template v-else-if="match_style_obj.data_tpl_id == 7">
          <div v-for="(item, key) in bet_col" class="col" :class="key == 3 && 'col2'" :key="key">
            {{ item }}
          </div>
        </template>
        <template v-else>
          <div v-for="(item, key) in bet_col" class="col ellipsis" :style="get_bet_width(key)"
            :class="[is_highlighted(+card_style_obj.league_obj.csid) ? 'bet-col' + key : '', { 'highlight-t': get_highlight_title(item.includes('%n'), key) }]"
            :key="key" v-tooltip="{ content: item.includes('%n') ? '' : item, overflow: 1, m_width: 7 }">
            <div class="double-row" v-if="item.includes('%n')">
              <div v-for="(text, i) in item.split('%n')" :class="[{ 'highlight-t': get_highlight_title(true, key, i) }]"
                :key="i">{{ text }}</div>
            </div>
            <template v-else>
              {{ item }}
            </template>
          </div>
        </template>
      </div>
      <div v-else class="play-name row col">
      </div>
      <div class="action-col" style="width:60px" v-if="match_style_obj.data_tpl_id == 12"></div>
      <div class="yb-flex-center" :style="`width:${match_list_tpl_size.media_width - 3}px !important;`">
        <!-- 联赛是否收藏 -->
        <div @click.stop="mx_collect({ type: 'leagues', match: card_style_obj.league_obj })"
          class="icon-wrap m-star-wrap-league" v-if="!MenuData.is_esports() && GlobalAccessConfig.get_collectSwitch()">
          <i class="icon-star q-icon c-icon" :class="card_style_obj.league_obj.tf && 'active'"></i>
          <!-- <div class="q-icon"
              :style="compute_css_obj({ key: lodash.get(props.card_style_obj, 'league_obj.tf') ? 'pc-home-star-fill' : 'pc-home-star-empty' })"></div>
         -->
        </div>
        <!-- 箭头 -->
        <!-- <i class="icon-arrow q-icon c-icon" size="14px"></i> -->
      </div>
    </div>
    <!-- 第二行 玩法名称 -->
    <div class="tr-col-name" v-if="[1, 3, 5, 21, 22].includes(+match_style_obj.data_tpl_id)">
      <div :style="`width:${match_list_tpl_size.process_team_width}px !important;`"></div>
      <div class="play-name row col">
        <div v-for="(item, key) in bet_col" class="col ellipsis"
          :style="`width: ${(match_style_obj.data_tpl_id == 22 && key <= 5) ? match_list_tpl_size.bet_width + 5 + 'px !important; flex:auto' : ''}`"
          v-tooltip="{ content: item, overflow: 1 }" :key="key">
          {{ item }}
        </div>
      </div>
      <div :style="`width:${match_list_tpl_size.media_width}px !important;`"></div>
    </div>
  </div>
</template>

<script setup>
// import sportIcon from "src/public/components/sport_icon/sport-icon.vue"
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import lodash from 'lodash';
import { ref, computed, watch } from 'vue';
import BaseData from "src/core/base-data/base-data.js"
import { compute_css_obj, MenuData, compute_img_url, UserCtr } from "src/output/index.js";
import { get_match_tpl_title } from 'src/core/format/common/index.js'
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js';
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { mx_collect } from "src/core/match-list-pc/composables/match-list-collect.js";
import { get_server_file_path } from "src/core/file-path/file-path.js";

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
const is_kemp = computed(() => {
  return (MenuData.is_kemp() || MenuData.is_common_kemp() || MenuData.is_collect_kemp() || MenuData.is_esports_champion()) && MenuData.menu_data_version.value
})
const match_style_obj = MatchListCardDataClass.get_card_obj_bymid(lodash.get(props.card_style_obj, 'mid'), MatchListCardDataClass.list_version.value)
const match_list_tpl_size = computed(() => {
  return MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config
})
const is_HDP = computed(() => {
  return [1, 20, 24, 13, 25].includes(+match_style_obj.data_tpl_id)
})

const version = ref(UserCtr.standard_edition)
watch(() => UserCtr.user_version, () => {
  version.value = UserCtr.standard_edition
})

/**
 * @Description 投注项名称
 * @param {undefined} undefined
*/
const bet_col = computed(() => {
  let csid = props.card_style_obj.league_obj.csid
  let bet_col = []
  let data_tpl_id = match_style_obj.data_tpl_id
  if (data_tpl_id == 13) {
    data_tpl_id = 1
    bet_col = [...i18n_t('list.match_tpl_title.tpl13_m.bet_col')]
  }
  let title_name = 'bet_col'
  //角球
  if (data_tpl_id == 1 && MenuData.is_corner_menu()) {
    title_name = "corner_bet_col"
  }
  //罚牌主盘
  else if ([25].includes(data_tpl_id)) {
    data_tpl_id = 1
    title_name = "punish_bet_col"
  } else if (data_tpl_id == 28) {
    data_tpl_id = 'esports'
  }
  let tpl_title = get_match_tpl_title(`list.match_tpl_title.tpl${data_tpl_id}.${title_name}`, csid)
  tpl_title = tpl_title.length ? tpl_title : []
  bet_col = [...tpl_title, ...bet_col]
  let mft = lodash.get(MatchListCardData.match_mid_obj, `mid_${props.card_style_obj.mid}.mft`)
  // 模板10
  if (data_tpl_id == 10) {
    if (mft == 3) {
      bet_col = bet_col.slice(0, 3)
    } else {
      bet_col = bet_col.slice(3, 6)
    }
  }
  // 模板15
  else if (data_tpl_id == 15) {
    if (mft == 5) {
      bet_col = bet_col.slice(4, 8);
    } else {
      bet_col = bet_col.slice(0, 4);
    }
  }
  // 模板11 && 斯诺克
  else if (data_tpl_id == 11 && csid == 7) {
    bet_col = get_match_tpl_title("list.match_tpl_title.tpl11.bet_col2", csid)
  }
  // 模板20 && 曲棍球
  else if (data_tpl_id == 20 && csid == 15) {
    bet_col = get_match_tpl_title("list.match_tpl_title.tpl20.bet_col2")
  }
  // 模板 esport && CSGO
  else if (data_tpl_id == 'esports' && csid == 102) {
    bet_col = get_match_tpl_title(`list.match_tpl_title.tpl${data_tpl_id}.bet_col102`)
  }
  return bet_col
})

/**
 * @Description 投注项名称
 * @param {undefined} undefined
*/
const bet_title = computed(() => {
  let bet_col = get_match_tpl_title(`list.match_tpl_title.tpl${match_style_obj.data_tpl_id}.title2`, props.card_style_obj.league_obj.csid)
  return bet_col
})

const leagueIcon = computed(() => {
  const url = get_server_file_path(lodash.get(props.card_style_obj, 'league_obj.lurl'));
  return url ? url : compute_img_url('pc-home-league-default')
})

/**
   * @Description 获取高亮标题
   * @param {Boolean} is_double 是否双行标题
   * @param {Number} key 标题第几个
   * @param {NUmber}  i(0|1)  双行标题第几个
  */
function get_highlight_title(is_double, key, i) {
  let highlight = [3, 4, 5].includes(key) && [1, 13, 29].includes(+match_style_obj.data_tpl_id)
  if (is_double) {
    highlight = (highlight && i === 1)
  }
  return highlight
}
/**
 * @Description 获取22模板标题宽度
 * @param {undefined} undefined
*/
function get_title_style() {
  return `width: ${(match_list_tpl_size.value.bet_width + 5) * 3}px !important; flex:auto`
}
/**
  * @Description 获取模板标题宽度
  * @param {Number} index 第几个标题索引
 */
function get_bet_width(index) {
  let bet_width = match_list_tpl_size.value.bet_width
  let flex = 'none'
  if (is_HDP && match_style_obj.data_tpl_id != 13 && index == 5) {
    flex = 1
  }
  let style = `width:${bet_width}px !important; flex: ${flex};`
  if (is_HDP && utils_info.is_iframe) {
    if ([0, 3].includes(index)) {
      bet_width = match_list_tpl_size.value.bet_width - 4
    } else {
      bet_width = match_list_tpl_size.value.bet_width + 2
    }
    style = `width:${bet_width}px !important; flex: none;`
  }
  return style
}
/**
 * @Description 是否高亮标题
 * @param {String} csid 球种id
*/
function is_highlighted(csid) {
  if (is_HDP || MenuData.is_eports_csid(csid)) {
    return true
  } else {
    return false
  }
}
/**
 * @Description 设置联赛折叠
*/
function set_fold() {
  // 如果当前联赛是折叠的 并且是今日、早盘  调用bymids接口拉数据
  if (props.card_style_obj.is_league_fold && ([2, 3].includes(MenuData.menu_root) || MenuData.is_esports())) {
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

</script>
<style lang="scss" scoped>
.match-tplesports {
  .sport-img {
    background-image: url($SCSSPROJECTPATH+"/image/common/png/sport_old_icon.png");
  }
}

.league-icon-wrap {
  .sport-img {
    background-image: url($SCSSPROJECTPATH+"/image/common/png/sport_old_icon.png");
  }
}

.c-match-league {
  height: 34px;

  &.match-tpl13 {
    .tr-match-head {
      .play-name {
        .col {

          &.bet-col2,
          &.bet-col4 {
            border-left: 0 !important;
          }
        }
      }
    }

  }
}

.tr-match-head {
  display: flex;
  height: 34px;
  line-height: 34px;
  cursor: pointer;

  .leagues-wrap {
    display: flex;
    align-items: center;
    padding: 0 13px;
    .list-expand {
      width: 16px;
      height: 16px;
      margin-right: 30px;
      transform: rotate(180deg);
    }
    .list-expand-fold {
      transform: rotate(0deg);
    }
    .icon-arrow {
      font-size: 20px;
      margin-right: 20px;
      left: 10px;
      top: -1px;
      transition: transform 0.3s;
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

    .ellipsis-wrap {
      font-size: 13px;
    }

    .league-match-count {
      margin-left: 10px;
      display: none;
    }
  }

  .play-name {
    text-align: center;
    line-height: 32px;

    .col2 {
      flex: 20000 1 0%;
    }

    .col {
      height: 100%;
      max-height: 100%;

      .double-row {
        font-size: 12px;
        height: 100%;
        padding: 1px 0;
        line-height: 15px;
      }
    }
  }

  .m-star-wrap-league {
    cursor: pointer;
  }
}

.tr-col-name {
  display: flex;
  height: 24px;

  .play-name {
    text-align: center;
    line-height: 24px;
  }
}

/*  联赛折叠样式 */
.leagues-pack {
  .tr-match-head {
    .leagues-wrap {
      .icon-arrow {
        transform: rotate(180deg);
      }
    }

     .play-name div {
       display: none;
     } 

    .league-match-count {
      display: block;
    }
  }

  .tr-col-name {
    display: none;
  }
}

.soprts_id_icon {
  width: 18px;
  height: 18px;
}
</style>src/output/index.js