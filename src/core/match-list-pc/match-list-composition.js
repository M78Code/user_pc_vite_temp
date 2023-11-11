import {
	ref,
	computed,
	watch
} from "vue";
import lodash from "lodash";
import axios_debounce_cache from "src/core/http/debounce-module/axios-debounce-cache.js";
import { PageSourceData, MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import { api_match } from "src/api/index.js";
import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt/index.js";
// import { set_sticky_top } from 'src/core/match-list-pc/match-card/module/sticky-top.js'
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
// import video from "src/core/video/video.js";
import { pre_load_video } from 'src/core/pre-load/module/pre-load-video.js'
import MenuData from "src/core/menu-pc/menu-data-class.js";
import collect_composable_fn from "./composables/match-list-collect.js";
import ws_composable_fn from "./composables/match-list-ws.js";
import use_featch_fn from "./composables/match-list-featch.js";
// import virtual_composable_fn from "./composables/match-list-virtual.js";
import process_composable_fn from './composables/match-list-processing.js'
import { set_base_data_init } from './match-list-metadata.js';
// import MatchListDetailMiddleware from "src/core/match-list-detail-pc/index.js";
import store from "src/store-redux/index.js";
import ServerTime from 'src/core/server-time/server-time.js';
import filterHeader from 'src/core/filter-header/filter-header.js'
import get_match_list_params from './match-list-params.js'
// const route = router.currentRoute.value
const { page_source } = PageSourceData;
const { mx_use_list_res, mx_list_res, mx_collect_match } = process_composable_fn();
const { update_collect_data, mx_collect_count, collect_count, mx_collect } = collect_composable_fn();
const { show_mids_change } = ws_composable_fn();
const { api_bymids } = use_featch_fn();
const { load_video_resources } = pre_load_video
// 数据请求状态
const load_data_state = ref("loading");
// 是否展示强力推荐
const is_show_hot = ref(false);
// 是否继续请求
const is_loading = ref(true);


let show_refresh_mask = ref(false);
const timer_obj = ref({});
const api_error_count = ref(0);
let check_match_last_update_timer_id;
let get_match_list_timeid;
let hot_match_list_timeout;
let axios_debounce_timer;
let axios_debounce_timer2;
let virtual_list_timeout_id;
let switch_timer_id

let tid_match_list;
useMittOn(MITT_TYPES.EMIT_MATCH_LIST_UPDATE, () => {
	console.log("EMIT_MATCH_LIST_UPDATE")
	clearTimeout(tid_match_list)
	tid_match_list = setTimeout(() => {
		fetch_match_list()
	}, 20);
})
watch(() => MenuData.match_list_version.value, () => {
	// clearTimeout(tid_match_list)
	// tid_match_list = setTimeout(() => {
		// fetch_match_list()
	// }, 20);
})
/**
* @description 请求数据
* @param  {boolean} is_socket   是否 socket 调用
* @param  {boolean} cut   是否 切换右侧详情  true 不切换
* @param {Object} params 其他参数
*/
function fetch_match_list(is_socket = false, cut) {
	const match_list_params = get_match_list_params();
	console.log('match_list_params', match_list_params,PageSourceData.page_source)
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
		// fetch_search_match_list && fetch_search_match_list(is_socket);
		return false;
	}
	if (!is_socket) {
		load_data_state.value = "loading";
		// 设置列表滚动条scrollTop
		MatchListScrollClass.set_scroll_top(0);
	}
	let match_api = match_list_params.match_list || {};
	// 设置列表接口 和 参数
	let api = api_match[match_api.api_name];
	let _params = lodash.clone(match_api.params) || {};
	// 切换是 排序后 设置当前的排序
	_params.sort = filterHeader.vx_match_sort;
	delete _params.index;
	delete _params.lv2_mi;
	// 近期开赛
	// console.error('MenuData.menu_root',MenuData.menu_root)
	if (MenuData.menu_root == 2) {
		_params.selectionHour = filterHeader.open_select_time;
	} else {
		_params.selectionHour = null;
	}
	// return
	let send_match_list_request = () => {
		/**返回数据处理************/
		api && api(_params)
			.then((res) => {

				// 组件和路由不匹配 菜单id不匹配aa
				// if ((page_source != "details") || _params.euid != match_api.params.euid) return;
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
				console.log('error', err);
				show_refresh_mask.value = false;
				// 如果是用户切换菜单
				if (!is_socket) {
					api_error_count.value++;
					// 重复拉列表的次数小于5   3秒后再次拉接口
					if (api_error_count.value < 5) {
						get_match_list_timeid = setTimeout(() => {
							fetch_match_list();
						}, 3000);
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


function handle_destroyed() {
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
	// useMittOn(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE, show_mids_change()).off;
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, update_collect_data()).off;
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT2_CMD, mx_collect_count()).off;
	// 站点 tab 休眠状态转激活
	useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, emit_site_tab_active()).off;
	clearTimeout(virtual_list_timeout_id);
	clearTimeout(switch_timer_id);
	clearTimeout(get_match_list_timeid);
	// 调用列表接口
	useMittOn(MITT_TYPES.EMIT_FETCH_MATCH_LIST, fetch_match_list()).off;
	useMittOn(MITT_TYPES.EMIT_API_BYMIDS, api_bymids({})).off;
	useMittOn(MITT_TYPES.EMIT_MX_COLLECT_MATCH, mx_collect_match()).off;
	timer_obj.value = {};
}
function init_page_when_base_data_first_loaded() {
	// 元数据 
	set_base_data_init();
	//释放试图 
	load_data_state.value = 'data'
	check_match_last_update_timer_id = setInterval(
		check_match_last_update_time(),
		30000
	);
}
function mounted_fn() {
	// fetch_match_list();
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
	init_page_when_base_data_first_loaded()
	useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, init_page_when_base_data_first_loaded);
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
export function handle_match_list_request_when_ok(data, is_socket, cut, collect) {
	let {
		match_list_api_config,
		menu_root,
		match_list_api_type,
		left_menu_result,
	} = MenuData;
	let current_menu = ([2, 3].includes(Number(menu_root)) && left_menu_result.guanjun != "common-guanjun")
	if ((menu_root == 2000 || current_menu) && !match_list_api_config.is_collect) {
		//       mx_list_res
		//    今日早盘   常规球种下的  常规 玩法
		//    电竞 单页  所有玩法
		mx_list_res(data, is_socket, cut, collect);
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
function get_hot_match_list(backend_run = false) {
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
			if (MenuData.is_export()) {
				match_list = lodash.get(res, "data.data.data") || [];
			}
			if (code == 200 && match_list.length > 0) {
				is_show_hot.value = true;
				// 设置列表数据仓库
				MatchListData.set_list(
					match_list,
				);
				if (!backend_run) {
					// 调用bymids接口
					api_bymids({ is_first_load: true });
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
function on_go_top() {
	useMittEmit(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, 0);
};
/**
 * @description 无感刷新
 * @return {undefined} undefined
 */
function on_refresh() {
	fetch_match_list(2);
	show_refresh_mask.value = true;
};

/**
 * @Description:移除赛事
 * @Author success
 * @param:
 * @return:
 * @Date 2020/03/19 17:44:06
 */
function socket_remove_match(match) {
	// 列表加载中不操作
	if (load_data_state.value != "data") {
		return;
	}
	// 移除卡片
	MatchListCardClass.remove_match(match.mid);
	// 更新收藏数量
	update_collect_data({ type: "remove", match });
	if (vx_details_params.mid == match.mid) {
		// 赛事移除时右侧赛事自动切换
		mx_autoset_active_match({ mid: match.mid });
	}
};

/**
 * @Description 每30秒检查一次可视区域赛事数据最后更新时间，如果超过1分钟未更新数据  调用bymids接口更新数据
 * @param {undefined} undefined
 */
function check_match_last_update_time() {
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
		let match = MatchListData.list_to_obj.mid_obj[mid + '_'] || {};
		if (match.api_update_time) {
			api_time_dif = now_time - match.api_update_time;
		}
		if (match.ws_update_time) {
			ws_time_dif = now_time - match.ws_update_time;
		} else {
			ws_time_dif = 70000;
		}
		// 超过一分钟 未更新过数据
		if (ws_time_dif > 60000) {
			mids.push(mid);
		}
	});
	if (mids.length > 0) {
		api_bymids({ mids });
	}
};
/**
 * 发送站点选项卡事件
 */
function emit_site_tab_active() {
	fetch_match_list(true);
};
export default function () {

	/**
	 * @Description 设置数据加载状态
	 * @param {string} 数据加载状态
	 * @param {undefined} undefined
	 */
	function set_load_data_state(data) {
		load_data_state.value = data;
	};
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
	return {
		is_loading,
		match_tpl_component,
		show_refresh_mask,
		collect_count,
		is_show_hot,
		load_data_state,
		on_go_top,
		on_refresh,
		socket_remove_match,
		set_load_data_state,
		check_match_last_update_time,
		mounted_fn,
		mx_collect,
	}
};