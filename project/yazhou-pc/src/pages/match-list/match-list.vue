<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页
-->
<template>
  <div
    class="yb-match-list"
  >
    <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
    <match-list-card
      v-for="card_key in MatchListCardDataClass.match_list_card_key_arr"
      :key="card_key + MatchListCardDataClass.match_list_card_key_arr"
      :card_key="card_key"
    />
  </div>
</template>

<script>
import { onMounted } from "vue";

import { LeagueTabFullVersionWapper as LeagueTab } from "src/components/tab/league-tab/index.js"; //联赛菜单
import { ListFilterFullVersionWapper as listFilter } from "src/components/match-list/list-filter/index.js"; //赛事列表筛选：滚球-球种、早盘-日期
import { ListFilterDateFullVersionWapper as listFilterDate } from "src/components/match-list/list-filter-date/index.js"; //热门赛事列表  早盘-日期
import { MatchListCardFullVersionWapper as MatchListCard } from "src/components/match-list/match-list-card/index.js"; //赛事列表
import { ListFilterHotFullVersionWapper as ListFilterHot } from "src/components/match-list/list-filter-hot/index.js"; //热门赛事列表
// import { EsportsHeaderFullVersionWapper as EsportsHeader } from "src/components/match-list/esports-header/index.js";//电竞赛事列表筛选
// import { VirtualMatchTypeFullVersionWapper as VirtualMatchType } from "src/components/match-list/match-list-card/index.js";//虚拟体育 赛事列表 赛事头
// import { PlayVirtualMatchTypeFullVersionWapper as PlayVirtualMatchType } from "src/components/match-list/play-virtual-match-type/index.js";//赛事列表头部——滚球——赛事类型
// import { LeaguesFilterFullVersionWapper as LeaguesFilter } from "src/components/match-list/match-list-card/index.js";//联赛筛选页面
// import { VirtualMatchTpl1FullVersionWapper as VirtualMatchTpl1 } from "src/components/match-list/match-list-card/index.js"; //拟足球 、 虚拟篮球
// import { VirtualMatchTpl2FullVersionWapper as VirtualMatchTpl2 } from "src/components/match-list/match-list-card/index.js"; //拟赛马 、 虚拟赛狗
import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
// import match_list_version_mixin from "src/project/yabo/mixins/match_list/match_list_version_mixin.js";//模板引入及主要业务逻辑
// import skt_data_list from "src/public/mixins/websocket/data/skt_data_list_new_data.js";// 发送websocket命令时使用
import menu_config from "src/core/menu-pc/menu-data-class.js";
import useMatchListMx from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import "./match_list.scss";

const { mounted_fn } = useMatchListMx();
console.log('MatchListCardDataClass', MatchListCardDataClass);
export default {
  components: {
    LeagueTab,
    listFilter,
    listFilterDate,
    MatchListCard,
    ListFilterHot,
    // EsportsHeader
  },
  setup() {
    onMounted(() => {
      mounted_fn();
    });
    return {
      menu_config,
      match_list_card,
      MatchListCardDataClass,
      MatchListData,
    };
  },
  // data() {
  //   return {

  //   }
  // },
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

.leagues-tabs {
  height: 40px;
  position: sticky;
  top: 133px;
  z-index: 200;
  font-size: 13px;
}
</style>
