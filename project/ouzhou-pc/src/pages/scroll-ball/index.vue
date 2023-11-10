<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:01
 * @Description: 赛事主列表页
-->
<template>
    <div class="yb-match-list full-height   relative-position" :data-version="MatchListCardDataClass.list_version">
        <MatchesHeader />
        <div class="test-info-wrap" v-if="GlobalAccessConfig.other.wsl">
            <div>{{ MenuData.mid_menu_result.match_tpl_number }}</div>
            <div class="fold-btn" @click="match_list_card.unfold_all_league()">展开联赛</div>
            <div class="fold-btn" @click="match_list_card.fold_all_league()">折叠联赛</div>
            <div class="fold-btn" @click="match_list_card.test_log_data()">打印数据</div>
            {{ MatchListCardDataClass.list_version }}-- {{ load_data_state }}-- length--- {{ match_list_card_key_arr.length
            }}
        </div>
        <div class="match-list-scroll scroll">
            <!-- 列表容器 -->
            <load-data :state="'data'" limit_height="1000"> <!--此处先写死高度用来调试UI -->
                <!-- 滚球其他列表 -->
                <scroll-list v-if="MenuData.menu_root_show_shoucang != 300">
                    <template v-slot:before>
                        <div :style="{ height: MatchListCardDataClass.sticky_top.fixed_header_height }"></div>
                    </template>
                    <div v-for="card_key in match_list_card_key_arr" :key="card_key" :card_key="card_key"
                        :data-card-key="card_key" :class="`card_key   ${card_key}`">
                        <match-list-card :card_key="card_key" use_component_key="MatchListCard_2" />
                    </div>
                    <template v-slot:after>
                        <div style="height:15px"></div>
                        <div class="pager-wrap row justify-end">
                            <div class="go-top-btn yb-flex-center" @click="on_go_top">
                                <icon-wapper name="icon-go_top" size="14px" />
                                <div class="msg">{{ $t("common.back_top") || "" }}</div>
                            </div>
                        </div>
                    </template>
                </scroll-list>
            </load-data>
        </div>
        <ConmingSoon v-show="coom_soon_state" />
    </div>
</template>
<script>
import { onMounted, onUnmounted, ref, watch, getCurrentInstance } from "vue";
import { IconWapper } from 'src/components/icon'
import LoadData from 'src/components/load_data/load_data.vue';
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
import { PlayVirtualMatchTypeFullVersionWapper as PlayVirtualMatchType } from "src/base-pc/components/match-list/play-virtual-match-type/index.js";//赛事列表头部——滚球——赛事类型
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';
import ConmingSoon from "src/base-pc/components/conming_soon/conming_soon.vue"
import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'
// import { VirtualMatchTypeFullVersionWapper as VirtualMatchType } from "src/base-pc/components/match-list/match-list-card/index.js";//虚拟体育 赛事列表 赛事头
// import { LeaguesFilterFullVersionWapper as LeaguesFilter } from "src/base-pc/components/match-list/match-list-card/index.js";//联赛筛选页面
// import { VirtualMatchTpl1FullVersionWapper as VirtualMatchTpl1 } from "src/base-pc/components/match-list/match-list-card/index.js"; //拟足球 、 虚拟篮球
// import { VirtualMatchTpl2FullVersionWapper as VirtualMatchTpl2 } from "src/base-pc/components/match-list/match-list-card/index.js"; //拟赛马 、 虚拟赛狗
import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
// import match_list_version_mixin from "src/project/yabo/mixins/match_list/match_list_version_mixin.js";//模板引入及主要业务逻辑
// import skt_data_list from "src/public/mixins/websocket/data/skt_data_list_new_data.js";// 发送websocket命令时使用
import MenuData from "src/core/menu-pc/menu-data-class.js";
import useMatchListMx from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { PageSourceData, compute_css_obj } from 'src/core/index.js';
import { MatchDataWarehouse_PC_List_Common as MatchListData, GlobalAccessConfig } from "src/core/index.js";
import MatchesHeader from "src/base-pc/components/matches_header/matches_header.vue";
import "../match-list/match_list.scss";

const { mounted_fn, load_data_state, collect_count, is_show_hot, on_refresh } = useMatchListMx();
const { page_source } = PageSourceData;
export default {
    components: {
        MatchesHeader,
        MatchListCard,
        PlayVirtualMatchType,
        LoadData,
        ScrollList,
        IconWapper,
        LoadData,
        ConmingSoon
    },
    setup() {
                // 设置 左侧菜单
                MenuData.set_left_menu_result({
            root: 1,
            lv1_mi: "",
            lv2_mi: 1,
            sports: "",
            guanjun: "",
            mid_menu_show: { list_filter: true },
            has_mid_menu: true,
        });
        //设置 中间 菜单输出
        MenuData.set_mid_menu_result({
            root: 1,
            lv1_mi: "",
            lv2_mi: 1,
            sports: "",
            guanjun: "",
        });

        const match_list_card_key_arr = ref([])
        const coom_soon_state = ref(false)
        const { proxy } = getCurrentInstance()
        const MatchListCardDataClass_match_list_card_key_arr = () => {
            match_list_card_key_arr.value = MatchListCardDataClass.match_list_card_key_arr
            console.log('MatchListCardDataClass.match_list_card_key_arr', MatchListCardDataClass.match_list_card_key_arr)
        }
        onMounted(() => {
            mounted_fn();
            MatchListCardDataClass_match_list_card_key_arr()
        });
        onUnmounted(() => {
            // handle_destroyed()
        })
        watch(
            MatchListCardDataClass.list_version,
            (list_version) => {
                MatchListCardDataClass_match_list_card_key_arr()
                proxy?.$forceUpdate()
            }
        )
        watch(
            MatchListOuzhouClass.coom_soon,
            () => {
                console.log('MatchListOuzhouClass.coom_soon', MatchListOuzhouClass.coom_soon)
                coom_soon_state.value = MatchListOuzhouClass.coom_soon.value
                proxy?.$forceUpdate()
            },
        )
        return {
            MenuData,
            MatchListData,
            collect_count,
            is_show_hot,
            page_source,
            GlobalAccessConfig,
            on_refresh,
            match_list_card_key_arr,
            compute_css_obj, match_list_card,
            MatchListCardDataClass,
            load_data_state,
            coom_soon_state
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
    height: calc(100vh - v-bind('match_list_top'));
    padding-right: 3px;

    /* 火狐滚动条无法自定义宽度，只能通过此属性使滚动条宽度变细 */
    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #cccccc;
        border-radius: 4px;
    }
}

.match-list-scroll {
    box-sizing: border-box;
    height: calc(100vh - v-bind('match_list_top'));

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #cccccc;
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
  