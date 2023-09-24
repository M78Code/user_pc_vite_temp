import {
	ref,
	computed,
} from "vue";
import lodash from "lodash";
// import router from "@/router/index"

import axios_debounce_cache from "src/core/http/debounce-module/axios-debounce-cache.js";
import { PageSourceData, MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import { api_match } from "src/api/index.js";
import BaseData from 'src/core/base-data/base-data.js';
import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt/index.js";
// import { set_sticky_top } from 'src/core/match-list-pc/match-card/module/sticky-top.js'
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
// import video from "src/core/video/video.js";
import { pre_load_video } from 'src/core/pre-load/module/pre-load-video.js'
import MenuData from "src/core/menu-pc/menu-data-class.js";
import { compute_sport_id  } from 'src/core/constant/index.js'
import collect_composable_fn from "./composables/match-list-collect.js";
import ws_composable_fn from "./composables/match-list-ws.js";
import use_featch_fn from "./composables/match-list-featch.js";
// import virtual_composable_fn from "./composables/match-list-virtual.js";
import process_composable_fn from './composables/match-list-processing.js'
// import MatchListDetailMiddleware from "src/core/match-list-detail-pc/index.js";
import store from "src/store-redux/index.js";
import ServerTime from 'src/core/server-time/server-time.js';


// const route = router.currentRoute.value

let state = store.getState();
const { page_source } = PageSourceData;
const { mx_use_list_res, mx_list_res, mx_collect_match } = process_composable_fn();
const { update_collect_data, mx_collect_count, collect_count } = collect_composable_fn();
const { show_mids_change } = ws_composable_fn();
const { api_bymids } = use_featch_fn();
const { load_video_resources } = pre_load_video
// 数据请求状态
const load_data_state = ref("loading");
// 列表数据
const match_list = ref([]);
// 是否展示强力推荐
const is_show_hot = ref(false);
// 是否继续请求
const is_loading = ref(true);
// 赛事列表排序 1:按联赛排序 2:按时间排序
const vx_match_sort = ref(state.filterReducer?.show_filter_popup);
// 筛选是否全选
const vx_filter_checked_all = ref(state.filterReducer?.show_filter_popup);

// 左侧详情参数
const vx_detail_params = ref(state.filterReducer.show_filter_popup);
// 获取联赛筛选框显示状态
const vx_show_filter_popup = ref(state.filterReducer.show_filter_popup);
let show_refresh_mask = ref(false);

const timer_obj = ref({});
const api_error_count = ref(0);
let check_match_last_update_timer_id;
let get_match_list_timeid;
let hot_match_list_timeout;
let current_hash_code;
let axios_debounce_timer;
let axios_debounce_timer2;
let virtual_list_timeout_id;
let switch_timer_id

const match_tpl_component = computed(() => {
	let match_tpl;
	let lv2_mi;
	// 这里判断是从左侧菜单点击的vr 还是中间菜单
	if (MenuData.left_menu_result.sports == "vr") {
		lv2_mi = MenuData.left_menu_result.lv2_mi;
	} else if (MenuData.mid_menu_result.sports == "vr") {
		lv2_mi = MenuData.mid_menu_result.mi;
	}
	// 1001-足球 1002-赛狗 1004-篮球 1007-泥地赛车 1008-卡丁车 1009-泥地摩托车 1010-摩托车 1011-赛马 1012-虚拟马车赛
	// 足球(1001) | 篮球(1004)  足球菜单ID（30054）篮球菜单ID（30056） 使用 tpl1
	if ([1001, 1004, 30054, 30056, 31001].includes(+lv2_mi)) {
		match_tpl = "virtual-match-tpl1";
	} else {
		match_tpl = "virtual-match-tpl2";
	}
	return match_tpl;
});

// 根据 mid 获取 联赛列表数据
const get_match_list_by_mid_for_base_data_res = (mid, csid, type) => {
	// 元数据
	const { mi_tid_mids_res = {}, base_data_res = {} } = BaseData;
	let matchs_list = [];
	// 常规赛种/联赛  滚球 ld  未开赛 nd
	let livedata =
		((mi_tid_mids_res[mid] || {})[type] || []).map((item) => ({
			tid: item.tid,
			csid,
			mids: item.mids.join(","),
			mids_info: item.mids,
		})) || [];
	// 常规赛种 联赛 滚球 下面的赛事信息
	livedata.filter((item) => {
		let match_list =
			(base_data_res.matchsList || []).find((page) =>
				item.mids_info.includes(page.mid)
			) || {};
		// 空的不要
		if (match_list.mid) {
			matchs_list.push(match_list);
		}
	}) || [];
	return matchs_list;
};
// 使用元数据默认显示 后面替换
const set_base_data_init = () => {
 
	// return
	// 当前的分类 左侧菜单数据 中间件数据
	const {
		menu_root,
		left_menu_result: { lv2_mi, lv1_mi, has_mid_menu, guanjun },
		mid_menu_result: { mi, mif, root },
	} = MenuData;
	let mid = lv2_mi;
	let midf = lv1_mi;
	// 有中间件数据 不能是早盘 使用 mi
	if (has_mid_menu && menu_root != 3) {
		mid = mi;
		if ([300, 400].includes(menu_root)) {
			midf = mi;
		} else {
			midf = mif;
		}
	}
	// 数据兜底
	midf = midf || lv2_mi;
	mid = mid || lv2_mi;
	// 获取csid 联赛列表头
	let csid = compute_sport_id(midf);
	// 冠军400 - 400是赛种id
	if (menu_root == 400) {
		csid = parseInt(mi) - 400;
	}
	// 常规赛种下的冠军
	if ([2, 3].includes(menu_root) && MenuData.is_guanjun()) {
		csid = parseInt(lv2_mi) - 400;
	}
	let data = {
		code: 200,
		data: {},
	};
	let matchs_list = [];
	// 元数据
	const {
		mi_tid_mids_res = {},
		base_data_res = {},
		mew_menu_list_res,
		left_menu_base_mi_arr,
	} = BaseData;
	// 没有数据 不执行
	if (!(mi_tid_mids_res && mi_tid_mids_res[mid])) {
		return;
	}
	// 常规赛种
	if ([2, 3].includes(menu_root) && !MenuData.is_guanjun()) {
		// 根据联赛-赛事接口 拿到 mid 去赛事列表里面匹配数据
		if (!mid) return;
		// 常规赛种/联赛   滚球 ld
		let livedata = (mi_tid_mids_res[mid].ld || []).map((item) => ({ tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids })) || [];
		// 常规赛种/联赛   未开赛 nd
		let nolivedata = (mi_tid_mids_res[mid].nd || []).map((item) => ({ tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids, })) || [];
		// 常规赛种、联赛  滚球 详细内容
		let live_match = get_match_list_by_mid_for_base_data_res( mid, csid, "ld" );
		// 常规赛种、联赛  未开赛 详细内容
		let nolive_match = get_match_list_by_mid_for_base_data_res( mid, csid, "nd" );
		matchs_list = [...live_match, ...nolive_match];
		// 常规赛种联赛
		data.data = {
			collectCount: 0,
			collectMIds: [],
			livedata: livedata,
			nolivedata: nolivedata,
		};
	} else {
		//滚球赛事
		if (menu_root == 1) {
			if (mi == 1) {
				let mi_100_arr = [];
				// 常规赛种/联赛  滚球
				mew_menu_list_res.forEach((x) => {
					if (x.mi * 1 < 300) { mi_100_arr.push("101" + "2" + x.mi.substring(1)); }
				});
				//常规赛事下 所以的滚球数据
				mi_100_arr.forEach((item) => {
					let livedata = get_match_list_by_mid_for_base_data_res( item, csid, "ld" );
					matchs_list = [...matchs_list, ...livedata];
				});
			} else {
				let mid_1 = "101" + "2" + ("" + midf).substring(1);
				matchs_list = get_match_list_by_mid_for_base_data_res( mid_1, csid, "ld" );
			}
		} else if (MenuData.is_guanjun()) {
			if (mi == 400) {
				let mi_400_arr = [];
				// 常规赛种/联赛  滚球
				mew_menu_list_res.forEach((x) => {
					if (x.mi * 1 < 300) {
						mi_400_arr.push("101" + "2" + x.mi.substring(1));
					}
				});
				//常规赛事下 所以的滚球数据
				mi_400_arr.forEach((item) => {
					let livedata = get_match_list_by_mid_for_base_data_res( item, csid, "ld" );
					matchs_list = [...matchs_list, ...livedata];
				});
			} else {
				let mid_1 = "101" + "2" + ("" + midf).substring(1);
				matchs_list = get_match_list_by_mid_for_base_data_res( mid_1, csid, "ld" );
			}
		} else if (menu_root == 500) {
			// 热门赛事
			if ([50199, 50101].includes(Number(mi))) {
				// 竞足 和赛事（全部）
				for (let i = 0; i < 20; i++) {
					// 常规赛事以外的 不分滚球和未开赛的数据
					let match_data = get_match_list_by_mid_for_base_data_res( mid, i, i );
					matchs_list = [...matchs_list, ...match_data];
				}
			} else {
				// 常规赛种/联赛   滚球 ld
				let live_data_500 =
					(mi_tid_mids_res[mid].ld || []).map((item) => ({
						tid: item.tid,
						csid,
						mids: item.mids.join(","),
						mids_info: item.mids,
					})) || [];
				// 常规赛种/联赛   未开赛 nd
				let nolive_data_500 =
					(mi_tid_mids_res[mid].nd || []).map((item) => ({
						tid: item.tid,
						csid,
						mids: item.mids.join(","),
						mids_info: item.mids,
					})) || [];
				// 常规赛种/联赛  滚球
				let live_data_match = get_match_list_by_mid_for_base_data_res( mid, csid, "ld" );
				// 常规赛种、联赛  未开赛
				let nolive_data_match = get_match_list_by_mid_for_base_data_res( mid, csid, "nd" );
				matchs_list = [...live_data_match, ...nolive_data_match];
				// 常规赛种联赛
				data.data = {
					collectCount: 0,
					collectMIds: [],
					livedata: live_data_500,
					nolivedata: nolive_data_500,
				};
			}
		} else {
			// 常规赛事以外的 不分滚球和未开赛的数据
			matchs_list = get_match_list_by_mid_for_base_data_res( mid, csid, csid );
			// 如果没有数据 使用其他有数据的 赛种玩法
			if (!matchs_list.length) {
				// 常规赛种/联赛  滚球
				let livedata = get_match_list_by_mid_for_base_data_res( mid, csid, "ld" );
				// 常规赛种、联赛  未开赛
				let nolivedata = get_match_list_by_mid_for_base_data_res( mid, csid, "nd" );
				matchs_list = [...livedata, ...nolivedata];
			}
		}
		data.data = matchs_list;
	}
	if (menu_root == 3) return;
	// 赛事列表 卡片数据
	console.error('set_list---------------',matchs_list.length);
  // 设置列表数据仓库
  MatchListData.set_list(
    matchs_list,
    true,
  );
	handle_match_list_request_when_ok(data, true, true, true);
	let ts1 = Date.now();
	let mids_arr = [];
	(matchs_list || []).forEach((match) => {
		mids_arr.push(String(match.mid));
		match.api_update_time = ts1;
	});
	// 联赛数据
	// set_match_base_info_by_mids_info(matchs_list, mids_arr, ts1);
};

/**
 * @description 请求数据
 * @param  {boolean} is_socket   是否 socket 调用
 * @param  {boolean} cut   是否 切换右侧详情  true 不切换
 * @param {Object} params 其他参数
 */

const fetch_match_list = (is_socket = false, cut) => {
	// 设置当前为赛事列表
	// 如果有拉列表定时器 清除定时器
	if (!is_socket && get_match_list_timeid) {
		clearTimeout(get_match_list_timeid);
		get_match_list_timeid = null;
	}
	// 热门推荐定时器
	if (!is_socket && hot_match_list_timeout) {
		clearTimeout(hot_match_list_timeout);
	}
	// 视频结束返回列表  强制loading
	// if (video.is_video_end) {
	// 	is_socket = false;
	// 	video.is_video_end = false;
	// }
	MatchListScrollClass.fetch_match_list_time = new Date().getTime();
	// 组件和路由不匹配
	// if (page_source == "details" && page_source != "details") {
	// 	return;
	// }
	// 强力推荐 静默拉取
	if (is_socket && is_show_hot.value) {
		get_hot_match_list(true);
		return;
	}
	// 【搜索列表】 WS 之类的调用 fetch_match_list 转向到 fetch_search_match_list
	if (page_source == "search") {
		this.fetch_search_match_list && this.fetch_search_match_list(is_socket);
		return false;
	}
	if (!is_socket) {
		load_data_state.value = "loading";
		// 设置列表滚动条scrollTop
		page_source != "details" && MatchListScrollClass.set_scroll_top(0);
	}
	let match_api = MenuData.match_list_api_config.match_list || {};
	// 设置列表接口 和 参数
	let api = api_match['post_league_list'];
	let _params = lodash.clone(match_api.params) || {};
	// 切换是 排序后 设置当前的排序
	_params.sort = vx_match_sort.value;
	delete _params.index;
	delete _params.lv2_mi;
	// 近期开赛
	// console.error('MenuData.menu_root',MenuData.menu_root)
	if (MenuData.menu_root == 2) {
		_params.selectionHour = state.filterReducer.open_select_time;
	} else {
		_params.selectionHour = null;
	}

	// return
	let send_match_list_request = () => {
		/**返回数据处理************/
		api && api(_params)
			.then((res) => {
				// 组件和路由不匹配 菜单id不匹配aa
				if ((page_source != "details") || _params.euid != match_api.params.euid) return;
				api_error_count.value = 0;
				if (res.code == 200) {
					//处理服务器返回的 列表 数据   fetch_match_list
					handle_match_list_request_when_ok(
						JSON.parse(JSON.stringify(res)),
						is_socket,
						cut
					);
				} else if (res.code == "0401038") {
					// let is_collect = this.vx_layout_list_type == 'collect'
					// // 收藏列表，遇到限频提示'当前访问人数过多，请稍后再试'
					// if (is_collect && data.code == '0401038') {
					//     load_data_state.value = "api_limited";
					// }
					if (!is_socket) {
						load_data_state.value = "api_limited";
					}
				} else {
					if (!is_socket) {
						load_data_state.value = "empty";
					}
				}
				show_refresh_mask.value = false;
			})
			.catch((err) => {
				show_refresh_mask.value = false;
				// 如果是用户切换菜单
				if (!is_socket) {
					api_error_count.value++;
					// 重复拉列表的次数小于5   3秒后再次拉接口
					if (api_error_count.value < 5) {
						// get_match_list_timeid = setTimeout(() => {
						// 	fetch_match_list();
						// }, 3000);
					} else {
						load_data_state.value = "refresh";
					}
				}
			});
	};
	const match_list_debounce_cache = axios_debounce_cache.get_match_list;
	if (match_list_debounce_cache && match_list_debounce_cache["ENABLED"]) {
		let info = match_list_debounce_cache.can_send_request(_params);
		if (info.can_send) {
			//直接发请求    单次数 请求的方法
			send_match_list_request();
		} else {
			// 记录timer
			current_hash_code = 0;
			clearTimeout(axios_debounce_timer2);
			axios_debounce_timer2 = setTimeout(() => {
				//直接发请求    单次数 请求的方法
				send_match_list_request();
				current_hash_code = 0;
			}, info.delay_time || 1000);
		}
	} else {
		//直接发请求    多 次数  循环请求 的方法
		send_match_list_request();
	}
};

const handle_destroyed = () => {
	clearTimeout(axios_debounce_timer);
	clearTimeout(axios_debounce_timer2);
	clearInterval(check_match_last_update_timer_id);
	for (let key in timer_obj.value) {
		clearTimeout(timer_obj.value[key]);
	}
	//热门推荐定时器
	if (hot_match_list_timeout) {
		clearTimeout(hot_match_list_timeout);
	}
	// this.debounce_throttle_cancel();
	useMittOn(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE, show_mids_change()).off();
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, update_collect_data()).off();
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT2_CMD, mx_collect_count()).off();
	// 站点 tab 休眠状态转激活
	useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, emit_site_tab_active()).off();
	clearTimeout(virtual_list_timeout_id);
	clearTimeout(switch_timer_id);
	clearTimeout(get_match_list_timeid);
	// 调用列表接口
	useMittOn(MITT_TYPES.EMIT_FETCH_MATCH_LIST, fetch_match_list()).off();
	useMittOn(MITT_TYPES.EMIT_API_BYMIDS, api_bymids({})).off();
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_MATCH, mx_collect_match()).off();
	timer_obj.value = {};
}

const init_page_when_base_data_first_loaded=()=>{
    // 元数据 
  set_base_data_init();
  //释放试图 
  load_data_state.value ='data'
  check_match_last_update_timer_id = setInterval(
    check_match_last_update_time(),
    30000
  );
}



const mounted_fn = () => {
// 开启自动化测试功能
	 // this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
	 // 列表数据仓库
	 MatchListData.init();
	 

	timer_obj.value = {};
	store.dispatch({
		type: "SET_IS_ROLL_SHOW_BANNER",
		data: false,
	});
	store.dispatch({
		type: "SET_IS_SHOW_BANNER",
		data: false,
	});
	api_error_count.value = 0;
	// is_vr_numer.value = 0;
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, update_collect_data);
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT2_CMD, mx_collect_count);
	// 站点 tab 休眠状态转激活
	useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, emit_site_tab_active);
	// 调用列表接口
	useMittOn(MITT_TYPES.EMIT_FETCH_MATCH_LIST, fetch_match_list);
	useMittOn(MITT_TYPES.EMIT_API_BYMIDS, api_bymids);
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_MATCH, mx_collect_match);
	useMittOn(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE, show_mids_change);
	useMittOn(MITT_TYPES.EMIT_BASE_DATA_FIRST_LOADED, init_page_when_base_data_first_loaded);
	load_video_resources();
}

// watch(MenuData.match_list_api_config.version, (cur) => {
// 		// bug 版本没有变化 也可以进入
// 		if (MenuData.api_config_version != cur) {
// 			MenuData.set_api_config_version(cur);
// 			// is_loading.value = false
// 			// 清除过滤条件
// 			// this.vx_set_remove_filter_condition()
// 			// 获取赛事列表数据、check_match_last_update_timer_id = setInterval(
// 			fetch_match_list();
// 			// 设置联赛吸顶高度
// 			set_sticky_top();
// 			// setTimeout(()=>{
// 			//   is_loading.value = true
// 			// },100)
// 		}
// 	},
// 	{ deep: true }
// );

// onUnmounted(() => {
// 	handle_destroyed()
// });

/**
 * // 处理服务器返回的 列表 数据   fetch_match_list
 */
const handle_match_list_request_when_ok = (data, is_socket, cut, collect) => {
	let {
		match_list_api_config,
		menu_root,
		match_list_api_type,
		left_menu_result,
	} = MenuData;
	// let  use_mx_list_res =
	if (
		(menu_root == 2000 ||
			([2, 3].includes(Number(menu_root)) &&
				left_menu_result.guanjun != "common-guanjun")) &&
		!match_list_api_config.is_collect
	) {
		//       mx_list_res
		//    今日早盘   常规球种下的  常规 玩法
		//    电竞 单页  所有玩法
		mx_list_res(data, is_socket, cut, collect);
		// mx_list_res(data, is_socket, cut, collect);
	} else {
		//  mx_use_list_res
		// 滚球单页 下所有
		// 热门 单页下 所有
		//  冠军  单页      ，
		//  今日早盘   常规球种下的   常规球种下的 冠军
		// 虚拟体育 单页 的  所有赛种
		// 收藏
		mx_use_list_res(data, is_socket, cut, collect);
	}
};
/**
 * @description 获取强力推荐赛事
 * @param  {boolean} backend_run 是否后台 调用
 * @return {undefined} undefined
 */
const get_hot_match_list = (backend_run = false) => {
	// 更新收藏数量
	if (!backend_run) {
		mx_collect_count();
	}
	let match_list_api_config = MenuData.match_list_api_config.match_list;
	let api = api_match[match_list_api_config.api_name];
	let _params = lodash.clone(match_list_api_config.params);
	api(_params)
		.then((res) => {
			// 组件和路由不匹配
			if (page_source == "details" && page_source != "details") {
				return;
			}
			if (handle_destroyed()) {
				return;
			}
			show_refresh_mask.value = false;
			let code = lodash.get(res, "data.code");
			// 赛事列表
			let match_list = lodash.get(res, "data.data") || [];
			if (MenuData.is_esports()) {
				match_list = lodash.get(res, "data.data.data") || [];
			}
			if (code == 200 && match_list.length > 0) {
				is_show_hot.value = true;
				// 设置列表数据仓库
				MatchListData.set_list(
					match_list,
					true
				);
				
				if (!backend_run) {
					// 调用bymids接口
					// api_bymids({ is_first_load: true });
					// 切换右侧赛事
					let first_match = match_list[0];
					let params = {
						media_type: "auto",
						mid: first_match.mid,
						tid: first_match.tid,
						sportId: first_match.csid,
					};
					// this.regular_events_set_match_details_params(null, params);
				} else {
					// 更新可视区域赛事盘口数据
					show_mids_change();
				}
				// 计算赛事卡片
				MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
					match_list,
					backend_run
				);
				load_data_state.value = "data";
			} else if (!backend_run) {
				load_data_state.value = "empty";
			}
		})
		.catch((err) => {
			// console.error(err)
			show_refresh_mask.value = false;
			if (!backend_run) {
				load_data_state.value = "empty";
			}
		});
};


/**
 * @description 返回顶部
 * @return {undefined} undefined
 */
const on_go_top = () => {
	useMittEmit(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, 0);
};
/**
 * @description 无感刷新
 * @return {undefined} undefined
 */
const on_refresh = () => {
	fetch_match_list(2);
	show_refresh_mask.value = true;
};


/**
 * @Description 删除赛事数据 卡片
 * @param {*} mid 删除赛事id
 */
const remove_match_data = (mid) => {
	// 移除卡片
	MatchListCardClass.remove_match(mid);
	//清除数据仓库数据
	MatchListData.remove_match_data(mid);
	//切换右侧
	if (this.vx_details_params.mid == mid) {
		// 赛事移除时右侧赛事自动切换
		this.mx_autoset_active_match({ mid });
	}
};
/**
 * @Description:移除赛事
 * @Author success
 * @param:
 * @return:
 * @Date 2020/03/19 17:44:06
 */
const socket_remove_match = (match) => {
	// 列表加载中不操作
	if (load_data_state.value != "data") {
		return;
	}
	// 移除卡片
	MatchListCardClass.remove_match(match.mid);
	// 更新收藏数量
	update_collect_data({ type: "remove", match });
	if (this.vx_details_params.mid == match.mid) {
		// 赛事移除时右侧赛事自动切换
		this.mx_autoset_active_match({ mid: match.mid });
	}
};
/**
 * @Description 设置数据加载状态
 * @param {string} 数据加载状态
 * @param {undefined} undefined
 */
const set_load_data_state = (data) => {
	load_data_state.value = data;
};
/**
 * @Description 每30秒检查一次可视区域赛事数据最后更新时间，如果超过1分钟未更新数据  调用bymids接口更新数据
 * @param {undefined} undefined
 */
const check_match_last_update_time = () => {
	// 非滚球 今日 不检查
	if (![1, 2].includes(MenuData.menu_root)) {
		return;
	}
	let mids = [];
	let now_time = ServerTime.get_remote_time();
	// 遍历可视区域赛事ID
	MatchListScrollClass.show_mids.forEach((mid) => {
		// 更新时间间隔
		let api_time_dif = 0,
			ws_time_dif = 0;
		let match = MatchListData.list_to_obj.mid_obj[mid+'_'] || {};
		if (match.api_update_time) {
			api_time_dif = now_time - match.api_update_time;
		}
		if (match.ws_update_time) {
			ws_time_dif = now_time - match.ws_update_time;
		} else {
			ws_time_dif = 70000;
		}
		// 超过一分钟 未更新过数据
		if (api_time_dif > 60000 && ws_time_dif > 60000) {
			mids.push(mid);
		}
	});
	if (mids.length > 0) {
		// api_bymids({ mids });
	}
};
/**
 * 发送站点选项卡事件
 */
const emit_site_tab_active = () => {
	fetch_match_list(true);
};



export  default function(){

	return {

		match_list,
		is_loading,
		vx_filter_checked_all,
		vx_show_filter_popup,
		match_tpl_component,
		show_refresh_mask,
		collect_count,
		is_show_hot,
		load_data_state,
		on_go_top,
		on_refresh,
		remove_match_data,
		socket_remove_match,
		set_load_data_state,
		check_match_last_update_time,
		get_match_list_by_mid_for_base_data_res,
		mounted_fn,
		api_bymids,

	}
 

 
}; ;