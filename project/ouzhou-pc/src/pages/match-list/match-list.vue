<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页
-->
<template>
  <div class="yb-match-list full-height relative-position" :data-version="MatchListCardDataClass.list_version">
    <!-- <div class="test-info-wrap" v-if="GlobalAccessConfig.get_wsl()">
   {{ MatchListCardDataClass.list_version }}--   {{ load_data_state }}-- length---  {{ match_list_card_key_arr.length }}
    </div> -->
    <div class="test-info-wrap" v-show="GlobalAccessConfig.get_wsl()">
      <div>{{ MenuData.mid_menu_result.match_tpl_number }}</div>
      <!-- 临时调试用 -->
      <div class="fold-btn" @click="match_list_card.unfold_all_league()">
        展开联赛
      </div>
      <div class="fold-btn" @click="match_list_card.fold_all_league()">
        折叠联赛
      </div>
      <div class="fold-btn" @click="match_list_card.test_log_data()">
        打印数据
      </div>
      {{ MatchListCardDataClass.list_version }}-- {{ load_data_state }}--
      length--- {{ match_list_card_key_arr.length }}
    </div>
    <div v-show="false"> {{ MenuData.menu_data_version }}{{ MatchListCardDataClass.list_version }}</div>
    <MatchesHeader />
    <!-- 列表容器 -->
    <div v-if="MenuData.menu_root == 300">
      <virtual></virtual>
    </div>
    <template v-else>
      <load-data v-if="MenuData.menu_root_show_shoucang != 300 && !MenuData.is_leagues()" :state="load_data_state">
        <!--此处先写死高度用来调试UI -->
        <!-- 滚球其他列表 -->
        <scroll-list
          v-if="MenuData.menu_root_show_shoucang != 300 && match_list_card_key_arr.length && !MenuData.is_leagues()">
          <!-- <template v-slot:before> -->
          <!-- 头部15 Mins模块 -->
          <div
            v-if="matches_15mins_list.length && MenuData.is_featured() && !(MenuData.is_kemp() && !MenuData.is_common_kemp())"
            class="match-list-item">
            <CurrentMatchTitle :title_value="i18n_t('ouzhou.match.15_mins')" :show_more_icon="false" />
            <MatchCardList15Mins :matches_15mins_list="matches_15mins_list" />
          </div>
          <!-- 头部Featured Matches模块 -->
          <FeaturedMatches v-if="MenuData.is_featured() && !(MenuData.is_kemp() && !MenuData.is_common_kemp())" />
          <!-- </template> -->
          <!-- 滚球标题 -->
          <Match-Main-Title :title="i18n_t('menu.match_playing')" :match_count="match_count"
            v-show="match_list_card_key_arr.length && MenuData.is_home()" />

          <div v-for="card_key in match_list_card_key_arr" :key="card_key"
            :class="{ 'have_margin': card_key.indexOf('sport_title') != -1 && card_key != 'sport_title_1' && MenuData.is_home() }">
            <match-list-card :card_key="card_key" :key="`match-list-card1-${card_key}`" />
          </div>
          <Match-Main-Title :title="i18n_t('ouzhou.match.top_leagues')"
            v-show="five_leagues_card_key_arr.length && MenuData.is_home()" />
          <match-list-card v-for="card_key in five_leagues_card_key_arr" :card_key="card_key"
            :key="`match-list-card2-${card_key}`" :class="`card_key_${card_key}`" />
          <template v-slot:after>
            <div style="height: 15px"></div>
            <back-top :onClick="on_go_top" />
          </template>
        </scroll-list>
      </load-data>
      <load-data v-if="MenuData.is_leagues()" :state="get_league_list().length ? 'data' : 'empty'"
        :style="{ width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`, }">
        <scroll-list>
          <div v-for="league_item in get_league_list()" :class="`card_key_${league_item.id} league_card`">
            <play-match-league :league_obj="league_item" />
          </div>
        </scroll-list>
      </load-data>
    </template>
    <!-- <ConmingSoon v-show="is_conming_soon" :style="{
      width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,
    }" /> -->
    <!-- 联赛筛选层 -->
    <!-- <leagues-filter v-if="vx_show_filter_popup" /> -->
    <!-- 点击头部刷新弹出 loading 蒙层 -->
    <div v-show="show_refresh_mask" class="refresh-mask absolute-full yb-flex-center" :style="{ top: '36px' }">
      <!-- <div v-show="show_refresh_mask" class="refresh-mask absolute-full yb-flex-center" :style="{top:get_is_show_banner && get_is_roll_show_banner ? '156px' : '36px'}"> -->
      <div class="img-loading custom-format-img-loading" :style="compute_css_obj('pc-img-loading')"></div>
    </div>
  </div>
</template>
<script>
import { onMounted, onActivated, onUnmounted, ref, watch, computed, nextTick } from "vue";
import { IconWapper } from "src/components/icon";
import { BackTop } from "src/components/back-top";
import LoadData from "src/components/load_data/load_data.vue";

import { LeagueTabFullVersionWapper as LeagueTab } from "src/base-pc/components/tab/league-tab/index.js"; //联赛菜单
import ListFilterHot from "src/base-pc/components/match-list/list-filter-hot/index.vue"; //热门赛事列表 头部筛选
import listFilterDate from "src/base-pc/components/match-list/list-filter-date/index.vue"; //热门赛事列表  早盘-日期
import MatchListCard from "src/base-pc/components/match-list/match-list-card/match-list-card-template-2/index.vue"; //赛事列表
import { PlayVirtualMatchTypeFullVersionWapper as PlayVirtualMatchType } from "src/base-pc/components/match-list/play-virtual-match-type/index.js"; //赛事列表头部——滚球——赛事类型
import ListHeader from "src/base-pc/components/match-list/list-header/index.vue"; //头部
import ScrollList from "src/base-pc/components/cus-scroll/scroll_list.vue";
import EsportsHeader from "src/base-pc/components/match-list/esports-header/index.vue"; //电竞赛事列表筛选
import ConmingSoon from "src/base-pc/components/conming_soon/conming_soon.vue";
import PlayMatchLeague from './play-match-league.vue'

import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
import {
  mounted_fn,
  load_data_state,
  show_refresh_mask,
  handle_destroyed
} from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

import {
  compute_css_obj, LayOutMain_pc, MenuData, useMittOn, MITT_TYPES, useMittEmit,
  GlobalAccessConfig, MatchDataWarehouse_ouzhou_PC_five_league_List_Common,
  into_home_event, UserCtr
} from "src/output/index.js";
import CurrentMatchTitle from "src/base-pc/components/match-list/current_match_title.vue";
import MatchMainTitle from "src/base-pc/components/match-list/match_main_title.vue";
import MatchCardList15Mins from "src/base-pc/components/match-list/match_card_list_15mins/matches_card_list_15mins.vue";
import FeaturedMatches from "src/base-pc/components/match-list/featured_matches/featured_matches_card.vue";
import MatchesHeader from "src/base-pc/components/matches_header/matches_header.vue";
import "./match_list.scss";
import {
  matches_15mins_list, match_count, init_home_matches
} from "./index"
import use_match_list_ws from 'src/core/match-list-pc/composables/match-list-ws.js'
import MatchLeagueData from 'src/core/match-list-pc/match-league-data.js'
import virtual from 'src/base-pc/vr/pages/virtual/virtual.vue'
export default {
  components: {
    LeagueTab,
    listFilterDate,
    MatchListCard,
    ListFilterHot,
    PlayVirtualMatchType,
    LoadData,
    ScrollList,
    IconWapper,
    BackTop,
    LoadData,
    EsportsHeader,
    ListHeader,
    CurrentMatchTitle,
    FeaturedMatches,
    MatchCardList15Mins,
    MatchesHeader,
    ConmingSoon,
    MatchMainTitle,
    virtual,
    PlayMatchLeague
  },
  setup() {
    const { ws_destroyed: ws_destroyed_common } = use_match_list_ws(undefined,lodash.debounce(() => {
      //首页删除后 拉接口
      if (MenuData.is_featured()) {
        init_home_matches(true);
      }
    },20000))
    const match_list_card_key_arr = ref([]);
    const five_leagues_card_key_arr = ref([]);
    const match_list_top = ref("76px");
    let mitt_list = null
    const MatchListCardDataClass_match_list_card_key_arr = () => {
      match_list_card_key_arr.value = MatchListCardDataClass.match_list_card_key_arr;
      five_leagues_card_key_arr.value = MatchListCardDataClass.five_leagues_card_key_arr;
    };

    let timer = 0;
    onMounted(() => {
      // 发送进入首页埋点消息
      clearTimeout(timer)
      timer = setTimeout(() => {
        lodash.get(UserCtr, 'user_info.userId') && into_home_event();
      }, 2000);
      LayOutMain_pc.set_oz_show_right(false);
      LayOutMain_pc.set_oz_show_left(true);
      MenuData.is_home() && get_data_info({ is_socket: false })//欧洲版只有首页才执行  其他是由菜单驱动列表的
      mitt_list = [
        useMittOn(MITT_TYPES.EMIT_SET_HOME_MATCHES, (type) => [
          get_data_info({ is_socket: true, type })
        ]).off, // 15分钟赛事数据
      ]
      MatchListCardDataClass_match_list_card_key_arr();
    });
    onUnmounted(() => {
      ws_destroyed_common()
      handle_destroyed();
      mitt_list.forEach(item => item());
      clearTimeout(timer);
    });
    onActivated(() => {
      LayOutMain_pc.set_oz_show_right(false);
      LayOutMain_pc.set_oz_show_left(true);
    })
    watch(MatchListCardDataClass.list_version, () => {
      MatchListCardDataClass_match_list_card_key_arr();
    });
    async function get_data_info({ is_socket, type }) {
      // 判断是不是首页下的 featured 页面
      if (MenuData.is_featured() || type == 1001) {
        await init_home_matches(is_socket);
      } else {
        useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST, { is_socket: true })
      }
    }
    function on_go_top() {
      useMittEmit(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, 0)
    }
    mounted_fn(get_data_info);
    function get_league_list() {
      return MatchLeagueData.get_league_list() || []
    }
    return {
      show_refresh_mask,
      GlobalAccessConfig,
      matches_15mins_list,
      match_count,
      match_list_card_key_arr,
      five_leagues_card_key_arr,
      compute_css_obj,
      MatchListCardDataClass,
      load_data_state,
      match_list_top,
      match_list_card,
      MenuData,
      on_go_top,
      get_league_list,
      LayOutMain_pc,
      MatchDataWarehouse_ouzhou_PC_five_league_List_Common
    };
  },
};
// 赛事列表筛选：滚球-球种、早盘-日期
// 列表视图滚动容器
// ScrollList: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/public/components/cus_scroll/scroll_list.vue"),
// 热门赛事列表  早盘-日期
// listFilterDate: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/list_filter_date.vue"),
// // 热门赛事列表
// MatchListCard: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_list_card.vue"),
// listFilterHot: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/list_filter_hot.vue"),
// // 电竞赛事列表筛选
// esportsHeader: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/esports_header.vue"),
// VirtualMatchType: () => import( /* webpackChunkName: "details" */ "src/public/components/match_list/virtual_match_type.vue"),  //虚拟体育 赛事列表 赛事头
// PlayVirtualMatchType: () => import( /* webpackChunkName: "details" */ "src/project/yabo/components/match_list/play_virtual_match_type.vue"), //赛事列表头部——滚球——赛事类型
// LeaguesFilter:() => import( /* webpackChunkName: "details" */ "src/project/yabo/pages/filter/filter.vue"), //联赛筛选页面
// LeagueTab,
// virtualMatchTpl1: () => import( /* webpackChunkName: "details" */ "src/project/yabo/components/match_list/match_tpl_new_data/virtual_match_tpl1.vue"),  //拟足球 、 虚拟篮球
// virtualMatchTpl2: () => import( /* webpackChunkName: "details" */ "src/project/yabo/components/match_list/match_tpl_new_data/virtual_match_tpl2.vue")   //拟赛马 、 虚拟赛狗
</script>
<style lang="scss" scoped>
.test-info-wrap {
  color: red;
  font-size: 24px;
  position: absolute;
  top: 0;
  left: 200px;
  z-index: 99999;
  display: flex;

  .fold-btn {
    border: 1px solid #ccc;
    font-size: 16px;
    cursor: pointer;
    padding: 5px;
  }
}

.scroll {
  overflow-y: scroll;
  padding-right: 3px;

  /* 火狐滚动条无法自定义宽度，只能通过此属性使滚动条宽度变细 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--q-gb-bg-c-11);
    border-radius: 4px;
  }
}

.leagues-tabs {
  height: 40px;
  position: sticky;
  top: 133px;
  z-index: 200;
  font-size: 13px;
}

.league_card {
  margin-bottom: 10px;
}
</style>