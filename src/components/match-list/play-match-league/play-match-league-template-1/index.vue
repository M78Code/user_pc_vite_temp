<template>
  <div class="c-match-league"
    :class="[{ 'match-tpl0-bg': tpl_id == 0 }, card_style_obj.is_league_fold ? 'leagues-pack' : `match-tpl${tpl_id}`]"
    v-if="lodash.get(card_style_obj, 'league_obj.csid')">
    <!-- 第一行 -->
    <div class="tr-match-head" @click="set_fold">
      <!-- 联赛信息 -->
      <div class="leagues-wrap" :class="tpl_id == 12 && 'jingcai'"
        :style="`width:${match_list_tpl_size.process_team_width}px !important;`">
        <!-- 箭头 -->
        <i class="icon-arrow q-icon c-icon" size="14px"></i>
        <!-- 联赛图标 -->
        <div class="league-icon-wrap">
          <sport-icon v-if="menu_config.is_esports()" :sport_id="card_style_obj.league_obj.csid" status="2" size="18px"
            is_esports />
          <img v-else v-img="[lodash.get(card_style_obj, 'league_obj.lurl')]" />
        </div>
        <!-- 联赛名称 -->
        <div class="ellipsis-wrap">
          <div class="absolute-full">
            <!-- 联赛数量 -->
            <span class="ellipsis allow-user-select" v-tooltip="{ content: card_style_obj.league_obj.tn, overflow: 1 }">{{
              card_style_obj.league_obj.tn }}</span><span class="league-match-count">{{ card_style_obj.match_count
  }}</span>
          </div>
        </div>
      </div>
      <!-- 玩法名称 -->
      <div class="play-name row col">
        <template v-if="[1, 3, 5, 21].includes(+tpl_id)">
          <div class="col">
            {{ bet_title[0] }}
          </div>

          <div class="col" :class="{ 'bet-col4 y0-col4': [3, 21].includes(+tpl_id) }" v-if="tpl_id != 5">
            {{ bet_title[1] }}
          </div>
        </template>
        <template v-else-if="[22].includes(+tpl_id)">
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
        <template v-else-if="tpl_id == 7">
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
      <div class="action-col" style="width:60px" v-if="tpl_id == 12"></div>
      <div class="yb-flex-center" :style="`width:${match_list_tpl_size.media_width - 3}px !important;`">
        <!-- 联赛是否收藏 -->
        <div @click.stop="match_list_card.view.mx_collect({ type: 'leagues', match: card_style_obj.league_obj })"
          class="icon-wrap m-star-wrap-league" v-if="!menu_config.is_esports() && GlobalAccessConfig.get_collectSwitch">
          <i class="icon-star q-icon c-icon" :class="card_style_obj.league_obj.tf && 'active'"></i>
        </div>
      </div>
    </div>
    <!-- 第二行 玩法名称 -->
    <div class="tr-col-name" v-if="[1, 3, 5, 21, 22].includes(+tpl_id)">
      <div :style="`width:${match_list_tpl_size.process_team_width}px !important;`"></div>
      <div class="play-name row col">
        <div v-for="(item, key) in bet_col" class="col ellipsis"
          :style="`width: ${(tpl_id == 22 && key <= 5) ? match_list_tpl_size.bet_width + 5 + 'px !important; flex:auto' : ''}`"
          v-tooltip="{ content: item, overflow: 1 }" :key="key">
          {{ item }}
        </div>
      </div>
      <div :style="`width:${match_list_tpl_size.media_width}px !important;`"></div>
    </div>
  </div>
</template>

<script setup>
// import sportIcon from "src/public/components/sport_icon/sport_icon.vue"
// inject:['match_list_data', 'match_list_card'],
import lodash from 'lodash';
import { ref, computed, defineProps, reactive } from 'vue';
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
import { t } from "src/core/index.js";
import { get_match_tpl_title } from 'src/core/index.js';
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { utils_info, is_eports_csid } from 'src/core/utils/match-list-utils.js';
import match_list_tpl_size from "src/core/match-list/data-class-ctr/match-list-tpl-size.js"
import store from 'src/store-redux/index.js'
import menu_config from "src/core/menu-pc/menu-data-class.js";
let state = store.getState();

const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));

const tpl_id = ref('')
const match_list_tpl_size = ref(match_list_tpl_size['template' + tpl_id.value] || {});
// 获取菜单类型
const vx_cur_menu_type = ref(state.menusReducer.cur_menu_type)
if (!lodash.get( 'card_style_obj.league_obj.csid') && ['1', '500'].includes(menu_config.menu_root)) {
  useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST, true)
}

const is_HDP = computed(() => {
  return [0, 20, 24, 13, 25].includes(+tpl_id.value)
})

/**
 * @Description 投注项名称
 * @param {undefined} undefined
*/
const bet_col = computed(() => {
  let csid = props.card_style_obj.league_obj.csid
  let tpl_id = tpl_id.value
  let bet_col = []
  if (tpl_id == 13) {
    tpl_id = 0
    bet_col = [...t('list.match_tpl_title.tpl13_m.bet_col')]
  }
  let title_name = 'bet_col'
  //角球
  if (tpl_id == 0 && menu_config.is_corner_menu()) {
    title_name = "corner_bet_col"
  }
  //罚牌主盘
  if (tpl_id == 25) {
    tpl_id = 0
    title_name = "punish_bet_col"
  }
  bet_col = [...get_match_tpl_title(`list.match_tpl_title.tpl${tpl_id}.${title_name}`, csid), ...bet_col]

  let mft = lodash.get(this.match_list_data.mid_obj, `mid_${props.card_style_obj.mid}.mft`)

  // 模板10
  if (tpl_id == 10) {
    if (mft == 3) {
      bet_col = bet_col.slice(0, 3)
    } else {
      bet_col = bet_col.slice(3, 6)
    }
  }
  // 模板15
  if (tpl_id == 15) {
    if (mft == 5) {
      bet_col = bet_col.slice(4, 8);
    } else {
      bet_col = bet_col.slice(0, 4);
    }
  }
  // 模板11 && 斯诺克
  if (tpl_id == 11 && csid == 7) {
    bet_col = get_match_tpl_title("list.match_tpl_title.tpl11.bet_col2", csid)
  }

  // 模板20 && 曲棍球
  if (tpl_id == 20 && csid == 15) {
    bet_col = get_match_tpl_title("list.match_tpl_title.tpl20.bet_col2")
  }
  // 模板 esport && CSGO
  if (tpl_id == 'esports' && csid == 102) {
    bet_col = get_match_tpl_title(`list.match_tpl_title.tpl${tpl_id}.bet_col102`)
  }
  return bet_col
})

/**
 * @Description 投注项名称
 * @param {undefined} undefined
*/
const bet_title = computed(() => {
  let bet_col = get_match_tpl_title(`list.match_tpl_title.tpl${tpl_id.value}.title2`, props.card_style_obj.league_obj.csid)
  return bet_col
})

/**
   * @Description 获取高亮标题
   * @param {Boolean} is_double 是否双行标题
   * @param {Number} key 标题第几个
   * @param {NUmber}  i(0|1)  双行标题第几个
  */
const get_highlight_title = (is_double, key, i) => {
  let highlight = [3, 4, 5].includes(key) && [0, 13, 25].includes(+tpl_id.value)
  if (is_double) {
    highlight = (highlight && i === 1)
  }
  return highlight
}
/**
 * @Description 获取22模板标题宽度
 * @param {undefined} undefined
*/
const get_title_style = () => {
  return `width: ${(match_list_tpl_size.bet_width + 5) * 3}px !important; flex:auto`
}
/**
  * @Description 获取模板标题宽度
  * @param {Number} index 第几个标题索引
 */
const get_bet_width = (index) => {
  let bet_width = match_list_tpl_size.bet_width
  let flex = 'none'
  if (is_HDP && tpl_id.value != 13 && index == 5) {
    flex = 1
  }
  let style = `width:${bet_width}px !important; flex: ${flex};`
  if (is_HDP && utils_info.is_iframe) {
    if ([0, 3].includes(index)) {
      bet_width = match_list_tpl_size.bet_width - 4
    } else {
      bet_width = match_list_tpl_size.bet_width + 2
    }
    style = `width:${bet_width}px !important; flex: none;`
  }
  return style
}
/**
 * @Description 是否高亮标题
 * @param {String} csid 球种id
*/
const is_highlighted = (csid) => {
  if (is_HDP || is_eports_csid(csid)) {
    return true
  } else {
    return false
  }
}
/**
 * @Description 设置联赛折叠
*/
const set_fold = () => {
  let type_name =vx_cur_menu_type.value.type_name;
  // 如果当前联赛是折叠的 并且是今日、早盘、串关  调用bymids接口拉数据
  if (this.card_style_obj.is_league_fold && (['today', 'early', 'bet'].includes(type_name) || menu_config.is_esports())) {
    // 设置赛事基础数据
    this.match_list_card.set_match_basic_data(props.card_style_obj)
    let params = {
      mids: this.card_style_obj.league_obj.mids.split(','),
      inner_param: 1
    };
    // 拉取http请求
    useMittEmit(MITT_TYPES.EMIT_API_BYMIDS, params, status => {
      this.match_list_card.set_league_card_load_data_status(this.card_style_obj, status)
    })
  }
  this.match_list_card.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(this.card_style_obj)
}

</script>
<style lang="scss" scoped>
.match-tplesports {
  .sport-img {
    background-image: url("~public/image/common/png/sport_old_icon.png");
  }
}

.league-icon-wrap {
  .sport-img {
    background-image: url("~public/image/common/png/sport_old_icon.png");
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
</style>
