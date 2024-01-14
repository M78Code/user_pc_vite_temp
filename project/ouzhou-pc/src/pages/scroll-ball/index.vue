<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页
-->
<template>
    <div class="yb-match-list full-height   relative-position" :data-version="MatchListCardDataClass.list_version">
        <div>
            <MatchesHeader />
            <div class="leagues-tabs leagues-bg" v-if="MenuData.mid_menu_result?.mi == '1001'">
                <!-- 联赛菜单 -->
                <LeagueTab current_mi="1001" />
            </div>
            <!-- <ListFilter current_mi="1001"/> -->
        </div>
        <div class="test-info-wrap" v-if="GlobalAccessConfig.get_wsl()">
            <div>{{ MenuData.mid_menu_result.match_tpl_number }}</div>
            <!-- 临时调试 -->
            <div class="fold-btn" @click="match_list_card.unfold_all_league()">展开联赛</div>
            <div class="fold-btn" @click="match_list_card.fold_all_league()">折叠联赛</div>
            <div class="fold-btn" @click="match_list_card.test_log_data()">打印数据</div>
            {{ MatchListCardDataClass.list_version }}-- {{ load_data_state }}-- length--- {{ match_list_card_key_arr.length
            }}
        </div>
        <!-- 列表容器 -->
        <load-data :state="load_data_state">
            <!-- 滚球其他列表 -->
            <scroll-list v-if="MenuData.menu_root_show_shoucang != 300 && match_list_card_key_arr.length">
                <template v-slot:before>
                    <div :style="{ height: MatchListCardDataClass.sticky_top.type+'px' }"></div>
                </template>
                <div v-for="card_key in match_list_card_key_arr" :key="card_key" :card_key="card_key"
                    :data-card-key="card_key" :class="`card_key   ${card_key}`">
                    <match-list-card :card_key="card_key" />
                </div>
                <template v-slot:after>
                    <div style="height:15px"></div>
                    <back-top :onClick="on_go_top" />
                </template>
            </scroll-list>
        </load-data>
        <!-- <ConmingSoon v-show="coom_soon_state" /> -->
    </div>
</template>
<script>
import { onMounted, onUnmounted, ref, watch, getCurrentInstance, onActivated } from "vue";

import MatchesHeader from "src/base-pc/components/matches_header/matches_header.vue";
import { IconWapper } from 'src/components/icon'
import { BackTop } from "src/components/back-top";
import LoadData from 'src/components/load_data/load_data.vue';
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';
import ConmingSoon from "src/base-pc/components/conming_soon/conming_soon.vue"
import { LeagueTabFullVersionWapper as LeagueTab } from "src/base-pc/components/tab/league-tab/index.js"; //联赛菜单
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import { PlayVirtualMatchTypeFullVersionWapper as PlayVirtualMatchType } from "src/base-pc/components/match-list/play-virtual-match-type/index.js";//赛事列表头部——滚球——赛事类型

import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";
import { mounted_fn, handle_destroyed, load_data_state, on_refresh } from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData, GlobalAccessConfig, PageSourceData, compute_css_obj, useMittOn,useMittEmit, MITT_TYPES, LayOutMain_pc } from "src/output/index.js";
import use_match_list_ws from 'src/core/match-list-pc/composables/match-list-ws.js'
import "../match-list/match_list.scss";
const { page_source } = PageSourceData;
export default {
    components: {
        // ListFilter,
        LeagueTab,
        MatchesHeader,
        MatchListCard,
        PlayVirtualMatchType,
        LoadData,
        ScrollList,
        IconWapper,
        BackTop,
        LoadData,
        ConmingSoon
    },
    setup() {
        // 设置 左侧菜单
        MenuData.set_left_menu_result({
            lv1_mi: "",
            lv2_mi: "",
            has_mid_menu: true,
        });
        MenuData.set_menu_root(1)
        const { ws_destroyed } = use_match_list_ws(MatchListData)
        const match_list_card_key_arr = ref([])
        const { proxy } = getCurrentInstance()
        const MatchListCardDataClass_match_list_card_key_arr = () => {
            match_list_card_key_arr.value = MatchListCardDataClass.match_list_card_key_arr
            // 获取mid 设置右侧赛事资讯 当ws赛事移除 设置当前第一个mid为右侧赛事资讯
            const mids_arr = []
            match_list_card_key_arr.value.map(item => {
                const card_style_obj = MatchListCardDataClass.get_card_obj_bymid(item)
                if (card_style_obj?.card_type == "league_container") {
                    mids_arr.push(...card_style_obj?.mids.split(","))
                }
            })
            if (mids_arr.length) {
                const mid_index = mids_arr.findIndex(item => item == MatchListCardDataClass.current_mid.value)
                useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, mids_arr[mid_index >= 0 ? mid_index : 0]);
            }
        }
        function refresh() {
            useMittOn(MITT_TYPES.EMIT_FETCH_MATCH_LIST, { is_socket: true })
        }
        onMounted(() => {
            LayOutMain_pc.set_oz_show_right(true)
            LayOutMain_pc.set_oz_show_left(false)
            mounted_fn();
            MatchListCardDataClass_match_list_card_key_arr()
        });
        onUnmounted(() => {
            ws_destroyed()
            handle_destroyed()
        })
        onActivated(() => {
            LayOutMain_pc.set_oz_show_right(true)
            LayOutMain_pc.set_oz_show_left(false)
        })
        function on_go_top() {
            useMittEmit(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, 0)
        }
        watch(
            MatchListCardDataClass.list_version,
            (list_version) => {
                MatchListCardDataClass_match_list_card_key_arr()
                proxy?.$forceUpdate()
            }
        )

        return {
            MenuData,
            MatchListData,
            page_source,
            GlobalAccessConfig,
            on_refresh,
            on_go_top,
            match_list_card_key_arr,
            compute_css_obj, match_list_card,
            MatchListCardDataClass,
            load_data_state,
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
</style>
  src/output/index.js