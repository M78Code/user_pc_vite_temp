<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页
-->
<template>
  <div class="yb-match-list full-height relative-position" :data-version="MatchListCardDataClass.list_version">
    <!-- <div class="test-info-wrap" v-if="GlobalAccessConfig.other.wsl">
   {{ MatchListCardDataClass.list_version }}--   {{ load_data_state }}-- length---  {{ match_list_card_key_arr.length }}
    </div> -->
    <div class="test-info-wrap" v-if="GlobalAccessConfig.other.wsl">
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
      length---
    </div>
    <MatchesHeader />
    <!-- 列表容器 -->
    <load-data v-if="MenuData.menu_root_show_shoucang != 300 && match_list_card_key_arr.length" :state="'data'" :style="{
      width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,
    }">
      <!--此处先写死高度用来调试UI -->
      <!-- 滚球其他列表 -->
      <scroll-list>
        <!-- <template v-slot:before> -->
        <!-- 头部15 Mins模块 -->
        <div v-if="matches_15mins_list.length && MenuData.is_featured()" class="match-list-item">
          <CurrentMatchTitle :title_value="$t('ouzhou.match.15_mins')" :show_more_icon="false" />
          <MatchCardList15Mins :matches_15mins_list="matches_15mins_list" />
        </div>
        <!-- 头部Featured Matches模块 -->
          <FeaturedMatches v-if="MenuData.is_featured()"  class="match-list-item" />
      
        <!-- </template> -->

        <!-- 滚球标题 -->
        <In-Play :match_count="total_match_count" v-show="match_list_card_key_arr.length && MenuData.is_home()" />

        <div v-for="card_key in match_list_card_key_arr" :key="card_key" :card_key="card_key" :data-card-key="card_key"
          :class="`card_key_${card_key}`">
          <match-list-card :card_key="card_key" />
        </div>
        <template v-slot:after>
          <div style="height: 15px"></div>
          <div class="pager-wrap row justify-end">
            <div class="go-top-btn yb-flex-center" @click="on_go_top">
              <icon-wapper name="icon-go_top" size="14px" />
              <div class="msg">{{ $t("common.back_top") || "" }}</div>
            </div>
          </div>
        </template>
      </scroll-list>
    </load-data>
    <ConmingSoon v-show="MenuData.is_top_events() || !match_list_card_key_arr.length" :is_nodata="MenuData.is_top_events()" :style="{
      width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,
    }" />
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
import { onMounted, onActivated, onUnmounted, ref, watch, getCurrentInstance } from "vue";
import { IconWapper } from "src/components/icon";
import LoadData from "src/components/load_data/load_data.vue";
import { LeagueTabFullVersionWapper as LeagueTab } from "src/base-pc/components/tab/league-tab/index.js"; //联赛菜单
// import listFilter from "src/base-pc/components/match-list/list-filter/index.vue"; //赛事列表筛选：滚球-球种、早盘-日期
import ListFilterHot from "src/base-pc/components/match-list/list-filter-hot/index.vue"; //热门赛事列表 头部筛选
import listFilterDate from "src/base-pc/components/match-list/list-filter-date/index.vue"; //热门赛事列表  早盘-日期
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import { PlayVirtualMatchTypeFullVersionWapper as PlayVirtualMatchType } from "src/base-pc/components/match-list/play-virtual-match-type/index.js"; //赛事列表头部——滚球——赛事类型
import ListHeader from "src/base-pc/components/match-list/list-header/index.vue"; //头部
import ScrollList from "src/base-pc/components/cus-scroll/scroll_list.vue";
import refresh from "src/components/refresh/refresh.vue";
import EsportsHeader from "src/base-pc/components/match-list/esports-header/index.vue"; //电竞赛事列表筛选
import ConmingSoon from "src/base-pc/components/conming_soon/conming_soon.vue";
// import { VirtualMatchTypeFullVersionWapper as VirtualMatchType } from "src/base-pc/components/match-list/match-list-card/index.js";//虚拟体育 赛事列表 赛事头
// import { LeaguesFilterFullVersionWapper as LeaguesFilter } from "src/base-pc/components/match-list/match-list-card/index.js";//联赛筛选页面
// import { VirtualMatchTpl1FullVersionWapper as VirtualMatchTpl1 } from "src/base-pc/components/match-list/match-list-card/index.js"; //拟足球 、 虚拟篮球
// import { VirtualMatchTpl2FullVersionWapper as VirtualMatchTpl2 } from "src/base-pc/components/match-list/match-list-card/index.js"; //拟赛马 、 虚拟赛狗
import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
// import match_list_version_mixin from "src/project/yabo/mixins/match_list/match_list_version_mixin.js";//模板引入及主要业务逻辑
// import skt_data_list from "src/public/mixins/websocket/data/skt_data_list_new_data.js";// 发送websocket命令时使用
import useMatchListMx from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import {
  PageSourceData, compute_css_obj, LayOutMain_pc, MenuData, useMittOn, MITT_TYPES,
  GlobalAccessConfig,
} from "src/core/index.js";
import CurrentMatchTitle from "src/base-pc/components/match-list/current_match_title.vue";
import InPlay from "src/base-pc/components/match-list/match_in_play.vue";
import MatchCardList15Mins from "src/base-pc/components/match-list/match_card_list_15mins/matches_card_list_15mins.vue";
import FeaturedMatches from "src/base-pc/components/match-list/featured_matches/featured_matches_card.vue";
import MatchesHeader from "src/base-pc/components/matches_header/matches_header.vue";
import "./match_list.scss";
import {
  init_home_matches,
} from "./index"
import use_match_list_ws from 'src/core/match-list-pc/composables/match-list-ws.js'

const {
  mounted_fn,
  load_data_state,
  show_refresh_mask,
  collect_count,
  is_show_hot,
  on_refresh, handle_destroyed
} = useMatchListMx();
const { page_source } = PageSourceData;
export default {
  components: {
    LeagueTab,
    // listFilter,
    listFilterDate,
    MatchListCard,
    ListFilterHot,
    PlayVirtualMatchType,
    LoadData,
    ScrollList,
    IconWapper,
    LoadData,
    refresh,
    EsportsHeader,
    ListHeader,
    CurrentMatchTitle,
    FeaturedMatches,
    MatchCardList15Mins,
    MatchesHeader,
    ConmingSoon,
    InPlay
  },
  setup() {
    // 15分钟赛事数据
    const matches_15mins_list = ref([]);
    const { ws_destroyed: ws_destroyed_common, set_active_mids } = use_match_list_ws()
    const match_list_card_key_arr = ref([]);
    
    // 赛事数量
    const total_match_count = ref(0)

    // const coom_soon_state = ref(false);

    const match_list_top = ref("76px");

    const { proxy } = getCurrentInstance();

    let mitt_list = null

    const MatchListCardDataClass_match_list_card_key_arr = () => {
      match_list_card_key_arr.value =
        MatchListCardDataClass.match_list_card_key_arr;
    };
    onMounted(() => {
      LayOutMain_pc.set_oz_show_right(false);
      LayOutMain_pc.set_oz_show_left(true);
      get_data_info()
      mitt_list = [useMittOn(MITT_TYPES.EMIT_SET_HOME_MATCHES, get_data_info).off]
      mounted_fn();
      MatchListCardDataClass_match_list_card_key_arr();
    });
    onUnmounted(() => {
      ws_destroyed_common()
      handle_destroyed();
      mitt_list.forEach(item => item());
    });
    onActivated(() => {
      LayOutMain_pc.set_oz_show_right(false);
      LayOutMain_pc.set_oz_show_left(true);
    })

    watch(MatchListCardDataClass.list_version, (list_version) => {
      MatchListCardDataClass_match_list_card_key_arr();
      proxy?.$forceUpdate();
    });
    const get_data_info = async () => {
      // 判断是不是首页下的 featured 页面
      // if (MenuData.is_featured()) {
        const { mins15_list= [], match_count = 0 } = await init_home_matches();
        total_match_count.value = match_count;
        matches_15mins_list.value = mins15_list
        
      // }
    }

    return {
      show_refresh_mask,
      collect_count,
      is_show_hot,
      page_source,
      GlobalAccessConfig,
      on_refresh,
      matches_15mins_list,
      match_list_card_key_arr,
      compute_css_obj,
      MatchListCardDataClass,
      load_data_state,
      // coom_soon_state,
      match_list_top,
      match_list_card,
      MenuData,
      LayOutMain_pc,
      total_match_count
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

.match-list-item {
  margin-bottom: 24px;
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
</style>
