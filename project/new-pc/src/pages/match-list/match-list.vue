<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页
-->
<template>
  <div class="yb-match-list column full-height   relative-position" :data-version="MatchListCardDataClass.list_version">
    <div class="test-info-wrap" v-show="GlobalAccessConfig.get_wsl()">
      <!-- <div>{{ MenuData.mid_menu_result.match_tpl_number }}</div> -->
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
      {{ MatchListCardDataClass.list_version }}-- {{ load_data_state }}--length--- {{ match_list_card_key_arr.length }}
    </div>
    <!--  :class="{ 'no-data': load_data_state != 'data' }" -->
    <div class="scroll-fixed-header">
      <!-- banner -->
      <div class="banner-box" :style="{ height: GlobalAccessConfig.get_show_banner() ? '120px' : '0px' }"
        v-if="GlobalAccessConfig.get_show_banner()"></div>
      <!-- 列表头 -->
      <list-header :collect_count="collect_count" :is_show_hot="is_show_hot" :load_data_state="load_data_state">
        <template v-slot:refresh_icon>
          <!-- 刷新组件 -->
          <refresh :loaded="load_data_state != 'loading'" :other_icon="true" :icon_name="1" @click="on_refresh" />
        </template>
      </list-header>
      <!-- <div>menu_config.match_list_menu_show.list_filter {{ menu_config.match_list_menu_show.list_filter }}</div> -->
      <!-- 顶部菜单  // 滚球  冠军 -->
      <list-filter v-if="MenuData.is_scroll_ball() || MenuData.is_kemp()" :collect_count="collect_count"
        :load_data_state="load_data_state" />
      <!-- 日期菜单   早盘 日期 -->
      <list-filter-date v-if="MenuData.is_zaopan()" :collect_count="collect_count" :load_data_state="load_data_state" />
      <!-- 热门赛事顶部菜单 -->
      <list-filter-hot v-if="MenuData.is_hot()" :collect_count="collect_count" :load_data_state="load_data_state" />
      <!-- 电竞顶部菜单 -->
      <esports-header v-if="MenuData.is_esports()" :load_data_state="load_data_state" />
      <!-- 赛事状态 | 赛种类型    class="sticky-wrap"    -->
      <list-filter-vr :menuInfo="MenuData.vr_list" :load_data_state="load_data_state" v-if="MenuData.is_vr()" />
      <!-- 联赛  VR 足球才会有联赛-->
      <div class="leagues-tabs leagues-bg" v-if="MenuData.mid_menu_result.mi == '1001'">
        <!-- 联赛菜单 -->
        <LeagueTab />
      </div>
    </div>
    <!-- 列表容器 -->
    <load-data :state="load_data_state">
      <!-- 滚球虚拟体育列表 -->
      <scroll-list v-if="MenuData.menu_root_show_shoucang == 300">
        <template v-slot:before>
          <div :style="{ height: MatchListCardDataClass.sticky_top.type + 'px' }"></div>
        </template>
        <template>
          <!--虚拟体育 赛事列表 赛事头-->
          <!-- <virtual-match-type v-for="(match_item, match_index) in match_list" :key="`match_type_${match_item.mid}`"
            :mid="match_item.mid" :match_index="match_index"
            :sticky_top="menu_config.mid_menu_result.csid == '1001' ? 157.5 : 117"
            :style="`width:${vx_get_layout_size.list_content_width}px  !important;`" /> -->
          <div class="v-scroll-item" :style="`width:${vx_get_layout_size.list_content_width}px  !important;`"
            :key="match_item.mid">
            <div v-if="wsl" class="test">{{ match_index }}———{{ match_item.mid }}-----{{ match_item.flex_index }}</div>
            <!--玩法模板-->
            <component :is="match_tpl_component" :mid="match_item.mid" />
          </div>
        </template>
        <template v-slot:after>
          <div style="height:15px"></div>
        </template>
      </scroll-list>
      <!-- <div> {{match_list_card_key_arr }}</div> -->
      <!-- 滚球其他列表 -->
      <scroll-list v-if="MenuData.menu_root_show_shoucang != 300">
        <!-- v-for="card_key in MatchListCardDataClass.match_list_card_key_arr" -->
        <template v-slot:before>
          <div :style="{ height: MatchListCardDataClass.sticky_top.fixed_header_height }">333</div>
        </template>
        <match-list-card v-for="card_key in match_list_card_key_arr" :key="card_key" :card_key="card_key" :class="card_key" />
        <template v-slot:after>
          <div style="height:15px"></div>
          <div class="pager-wrap row justify-end">
            <div class="go-top-btn yb-flex-center" @click="on_go_top">
              <icon-wapper name="icon-go_top" size="14px" />
              <div class="msg">{{ i18n_t("common.back_top") || "" }}</div>
            </div>
          </div>
        </template>
      </scroll-list>
    </load-data>
    <!-- 联赛筛选层 -->
    <!-- <leagues-filter v-if="vx_show_filter_popup" /> -->
    <!-- 点击头部刷新弹出 loading 蒙层 -->
    <div v-show="show_refresh_mask" class="refresh-mask absolute-full yb-flex-center" :style="{ top: '36px' }">
      <!-- <div v-show="show_refresh_mask" class="refresh-mask absolute-full yb-flex-center" :style="{top:get_is_show_banner && get_is_roll_show_banner ? '156px' : '36px'}"> -->
      <div class="img-loading custom-format-img-loading" :style="compute_css_obj('pc-img-loading')"></div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, watch, ref } from "vue";

import { IconWapper } from 'src/components/icon'
import LoadData from 'src/components/load_data/load_data.vue';
import { LeagueTabFullVersionWapper as LeagueTab } from "src/base-pc/components/tab/league-tab/index.js"; //联赛菜单
import listFilter from "src/base-pc/components/match-list/list-filter/yz_index.vue"; //赛事列表筛选：滚球-球种、早盘-日期
import listFilterVr from "src/base-pc/components/match-list/list-filter-vr/index.vue"; //vr
import ListFilterHot from "src/base-pc/components/match-list/list-filter-hot/yz_index.vue"; //热门赛事列表 头部筛选
import listFilterDate from "src/base-pc/components/match-list/list-filter-date/yz_index.vue"; //热门赛事列表  早盘-日期
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
// import { PlayVirtualMatchTypeFullVersionWapper as PlayVirtualMatchType } from "src/base-pc/components/match-list/play-virtual-match-type/index.js";//赛事列表头部——滚球——赛事类型
import ListHeader from "src/base-pc/components/match-list/list-header/index.vue"; //头部
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';
import refresh from "src/components/refresh/refresh.vue"
import EsportsHeader from "src/base-pc/components/match-list/esports-header/yz_index.vue";//电竞赛事列表筛选

// import { VirtualMatchTypeFullVersionWapper as VirtualMatchType } from "src/base-pc/components/match-list/match-list-card/index.js";//虚拟体育 赛事列表 赛事头
// import { LeaguesFilterFullVersionWapper as LeaguesFilter } from "src/base-pc/components/match-list/match-list-card/index.js";//联赛筛选页面
// import { VirtualMatchTpl1FullVersionWapper as VirtualMatchTpl1 } from "src/base-pc/components/match-list/match-list-card/index.js"; //拟足球 、 虚拟篮球
// import { VirtualMatchTpl2FullVersionWapper as VirtualMatchTpl2 } from "src/base-pc/components/match-list/match-list-card/index.js"; //拟赛马 、 虚拟赛狗
import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
// import match_list_version_mixin from "src/project/yabo/mixins/match_list/match_list_version_mixin.js";//模板引入及主要业务逻辑
import { MenuData } from "src/output/index.js"
import { mounted_fn, load_data_state, show_refresh_mask, collect_count, is_show_hot, on_refresh, handle_destroyed } from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

import { LayOutMain_pc, compute_css_obj } from 'src/output/index.js';
import { set_template_width } from 'src/core/match-list-pc/list-template/match-list-tpl.js'
import { MatchDataWarehouse_PC_List_Common as MatchListData, GlobalAccessConfig } from "src/output/index.js";
import "./match_list.scss";
const match_list_card_key_arr = ref([])
function MatchListCardDataClass_match_list_card_key_arr() {
  match_list_card_key_arr.value = MatchListCardDataClass.match_list_card_key_arr
}
const on_go_top = () => {
  useMittEmit(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, 0)
}
function _resize() {
  set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15))
  MatchListCardDataClass.set_list_version()
}
window.addEventListener('resize', _resize)
mounted_fn()
onMounted(() => {
  MatchListCardDataClass_match_list_card_key_arr()
})
onUnmounted(() => {
  window.removeEventListener('resize', _resize)
})
watch(MatchListCardDataClass.list_version,
  () => {
    MatchListCardDataClass_match_list_card_key_arr()
  })
// };
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
