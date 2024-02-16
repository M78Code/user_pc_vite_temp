import { onMounted, onUnmounted, watch, ref } from "vue";
import { LeagueTabFullVersionWapper as LeagueTab } from "src/base-pc/components/tab/league-tab/index.js"; //联赛菜单
import { MatchListCardFullVersionWapper as MatchListCard } from "src/base-pc/components/match-list/match-list-card/index.js"; //赛事列表
// import { PlayVirtualMatchTypeFullVersionWapper as PlayVirtualMatchType } from "src/base-pc/components/match-list/play-virtual-match-type/index.js";//赛事列表头部——滚球——赛事类型
import ListHeader from "src/base-pc/components/match-list/list-header/index.vue"; //头部
import ScrollList from 'src/base-pc/components/cus-scroll/scroll_list.vue';
import refresh from "src/components/refresh/refresh.vue"
import EsportsHeader from "src/base-pc/components/match-list/esports-header/yz_index.vue";//电竞赛事列表筛选
import MatchDetailHeader from "./match-detail-header.vue";
import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
import { LOCAL_PROJECT_FILE_PREFIX, MenuData } from "src/output/index.js"
import { mounted_fn, load_data_state, show_refresh_mask, collect_count, is_show_hot, on_refresh, handle_destroyed, loading, btn_loading } from "src/core/match-list-pc/match-list-composition.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import use_match_list_ws from 'src/core/match-list-pc/composables/match-list-ws.js'

import { LayOutMain_pc, compute_css_obj } from 'src/output/index.js';
import { set_template_width } from 'src/core/match-list-pc/list-template/match-list-tpl.js'
import { MatchDataWarehouse_PC_List_Common as MatchListData, GlobalAccessConfig } from "src/output/index.js";
import "./match_list.scss";
import match_list_filter from "./components/match-list-filter.vue";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { UserCtr } from "src/output/index.js";

const match_list_card_key_arr = ref([])
const show_filter = ref(false);
// 选择的联赛
const select_list = ref([]);
function MatchListCardDataClass_match_list_card_key_arr() {
    match_list_card_key_arr.value = MatchListCardDataClass.match_list_card_key_arr
}
use_match_list_ws()
/**
 * 切换专业/新手版
 * @param {{id: number}} params 
 */
function change_version(params) {
    //TODO: 切换专业/新手版 1 专业版 2 新手版
    const type = params.id;
    useMittEmit(MITT_TYPES.EMIT_SHOW_SKELETON_DIAGRAM, true)
    UserCtr.set_standard_edition(params.id)
    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP);
    let timer = setTimeout(() => {
        // VirtualList.set_is_show_ball(true)
        MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
        clearTimeout(timer)
        timer = null
        // if (MenuData.is_collect()) {
        //     MatchMeta.handler_match_list_data({ list: MatchMeta.complete_matchs, scroll_top: 0 })
        // } else {
        //     MatchMeta.clear_match_info()
        //     MatchMeta.set_origin_match_data({})
        // }
        // MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false })
    }, 350)

}

/**
 * 修改热门
 * @param {number} params 
 */
function change_hot(params) {
    // TODO: 修改热门 0热门/1时间
    console.log(params, "TODO: 修改热门 0热门/1时间");
    UserCtr.set_sort_type(params == 0 ? 1 : 2)
    on_refresh();
}

/**
 * 关闭筛选
 * @param {Array<string>} value 选择的id
 */
function match_list_close(value) {
    show_filter.value = !show_filter.value;
    select_list.value = value;
    // TODO: 关闭筛选，刷新列表
}

const on_go_top = () => {
    useMittEmit(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, 0)
}
function _resize() {
    set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15))
    MatchListCardDataClass.set_list_version()
}

function change_race() {
    show_filter.value = !show_filter.value;
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
