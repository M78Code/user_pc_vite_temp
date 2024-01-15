import {
	ref, onUnmounted, nextTick
} from "vue";
import lodash from "lodash";
import axios_debounce_cache from "src/core/http/debounce-module/axios-debounce-cache.js";
import {
	MatchDataWarehouse_PC_List_Common as MatchListData,
	MatchDataWarehouse_PC_Detail_Common,
} from "src/output/module/match-data-base.js";
import MatchListCardData from "./match-card/module/match-list-card-data-class";
import { PROJECT_NAME } from 'src/output/module/constant-utils.js'
import PageSourceData from "src/core/page-source/page-source.js";
import { api_match } from "src/api/index.js";
import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt/index.js";
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import { MenuData } from "src/output/project/index.js"
import { fethc_collect_match, collect_count } from "./composables/match-list-collect.js";
import { api_bymids } from "./composables/match-list-featch.js";
// import virtual_composable_fn from "./composables/match-list-virtual.js";
import { handle_match_list_request_when_ok } from './composables/match-list-processing.js'
import { set_base_data_init, set_base_data_init_ouzhou } from './match-list-metadata.js';
import ServerTime from 'src/core/server-time/server-time.js';
import get_match_list_params from './match-list-params.js'
import { match_list_handle_set } from './match-handle-data.js'
// const route = router.currentRoute.value
const { page_source } = PageSourceData;
// 数据请求状态
const load_data_state = ref("loading");
// 是否展示强力推荐
const is_show_hot = ref(false);
// 是否继续请求
const is_loading = ref(true);


let show_refresh_mask = ref(false);
const timer_obj = ref({});
let api_error_count = 0;
let is_has_base_data = false; //是否有元数据
let check_match_last_update_timer_id;
let get_match_list_timeid;
let hot_match_list_timeout;
let axios_debounce_timer;
let axios_debounce_timer2;
let mitt_list = [];
let tid_match_list;

/**
* @description 请求数据
* @param  {boolean} is_socket   是否 socket 调用
* @param {Object} params 其他参数
*/
export function fetch_match_list(is_socket = false) {
	clearTimeout(axios_debounce_timer2); //取消上一次请求
	const match_list_params = get_match_list_params();
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
	//热门联赛不走此方法
	if (page_source == "search" || MenuData.is_leagues()) {
		// fetch_search_match_list && fetch_search_match_list(is_socket);
		return false;
	}
	//不是 w 并且没有 元数据列表 启动loading
	if (!is_socket && !is_has_base_data) {
		set_load_data_state('loading')
		// 设置列表滚动条scrollTop
		MatchListScrollClass.set_scroll_top(0);
	}
	let match_api = match_list_params.match_list || {};
	// let match_api = MenuData.match_list_api_config.match_list || {};
	fethc_collect_match()
	// 设置列表接口 和 参数
	let api = api_match[match_api.api_name];
	let _params = lodash.clone(match_api.params) || {};
	// 切换是 排序后 设置当前的排序
	// _params.sort = UserCtr.vx_match_sort;
	delete _params.index;
	delete _params.lv2_mi;
	// 近期开赛
	// console.error('MenuData.menu_root',MenuData.menu_root)
	if (MenuData.is_today()) {
		// _params.selectionHour = filterHeader.open_select_time;
	} else {
		_params.selectionHour = null;
	}
	// return
	let send_match_list_request = () => {
		/**返回数据处理************/
		api && api(_params)
			.then((res) => {
				try {
					// 组件和路由不匹配 菜单id不匹配aa
					// if ((page_source != "details") || _params.euid != match_api.params.euid) return;
					api_error_count = 0;
					if (res.code == 200) {
						try {				//处理服务器返回的 列表 数据   fetch_match_list
							handle_match_list_request_when_ok(
								JSON.parse(JSON.stringify(res)),
								is_socket,
							);
							//不是ws就通知已经加载完成 连同返回接口数据
							// !is_socket && useMittEmit(MITT_TYPESEMIT_FETCH_MATCH_LIST_FINISHED, res)
						} finally {
							if (!is_socket) {
								if (lodash.get(res, "data.length") != undefined || lodash.get(res, "data.data.length") != undefined) {
									const len = lodash.get(res, "data.length", 0) || lodash.get(res, "data.data.length", 0)
									set_load_data_state(len ? 'data' : 'empty')
								}
								else {
									const livedata = lodash.get(res, "data.livedata.length", 0)
									const nolivedata = lodash.get(res, "data.nolivedata.length", 0)
									set_load_data_state(livedata + nolivedata > 0 ? 'data' : 'empty')
								}
							}
						}
					} else if (res.code == "0401038") {
						// let is_collect = this.vx_layout_list_type == 'collect'
						// // 收藏列表，遇到限频提示'当前访问人数过多，请稍后再试'
						if (MenuData.is_collect && res.code == '0401038') {
							set_load_data_state("api_limited")
						}
						if (!is_socket) {
							set_load_data_state("api_limited")
						}
					} else {
						if (!is_socket) {
							set_load_data_state("empty")
						}
					}
					show_refresh_mask.value = false;
				} catch (error) {
					set_load_data_state("refresh")
					//如果是代码报错不要走重复请求
					console.log('error', error);
				}
			})
			.catch((err) => {
				console.log('catch', err);
				show_refresh_mask.value = false;
				// 如果是用户切换菜单
				if (!is_socket) {
					api_error_count++;
					// 重复拉列表的次数小于5   3秒后再次拉接口
					if (api_error_count < 5) {
						get_match_list_timeid = setTimeout(() => {
							fetch_match_list(is_socket);
						}, 3000);
					} else {
						set_load_data_state("refresh")
					}
				}
			});

	};
	set_load_data_state(load_data_state.value)
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
	// 销毁 ws message通信
	for (let key in timer_obj.value) {
		clearTimeout(timer_obj.value[key]);
	}
	//热门推荐定时器
	if (hot_match_list_timeout) {
		clearTimeout(hot_match_list_timeout);
	}
	mitt_list.forEach(i => i());
	mitt_list = []
	timer_obj.value = {};
	clearTimeout(axios_debounce_timer);
	clearTimeout(axios_debounce_timer2);
	clearInterval(check_match_last_update_timer_id);
	check_match_last_update_timer_id = null;
	axios_debounce_timer2 = null;
	axios_debounce_timer = null;
	hot_match_list_timeout = null;
}
/**
 * 元数据加载的方法
 */
function init_page_when_base_data_first_loaded() {
	// 首页不走元数据加载  不需要设置元数据loading状态 loading状态已经设置过了
	// if (MenuData.is_home()) {
	// 	return
	// }
	// 设置列表滚动条scrollTop
	MatchListScrollClass.set_scroll_top(0);
	MatchListScrollClass.clear_show_mid()
	MatchListCardData.reset_data();//表征清空
	useMittEmit(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, 0)//列表滚动到顶部
	nextTick(() => {
		set_load_data_state("loading") //loading
		//设置元数据 列表 返回boolean
		if (PROJECT_NAME == 'ouzhou-pc') {
			is_has_base_data = set_base_data_init_ouzhou()
		} else {
			is_has_base_data = set_base_data_init()
		}
		if (is_has_base_data === true) {  //如果元数据有数据就设定为data
			set_load_data_state("data")
		}
	});
}
/**
 * 初始化方法
 * @param {*} fun 
 */
function mounted_fn(fun) {
	// fetch_match_list();
	// 开启自动化测试功能
	// this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
	timer_obj.value = {};
	api_error_count = 0;
	// is_vr_numer.value = 0;
	function default_fun() {
		//默认加载方式
		if (lodash.isFunction(fun)) {
			fun({ is_socket: true })
		}
		else {
			useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST, { is_socket: true }) //请求列表
		}
	}
	mitt_list = [
		// 站点 tab 休眠状态转激活
		useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, default_fun).off,
		useMittOn(MITT_TYPES.EMIT_LANG_CHANGE, default_fun).off, //语言切换
		// 调用列表接口
		useMittOn(MITT_TYPES.EMIT_FETCH_MATCH_LIST, ({ is_socket = undefined }) => {
			clearTimeout(tid_match_list)
			tid_match_list = setTimeout(() => {
				api_error_count = 0; //重新计算错误次数
				fetch_match_list(is_socket)//请求接口
			}, 80);
		}).off,
		//请求元数据
		useMittOn(MITT_TYPES.EMIT_FETCH_MATCH_LIST_METADATA, lodash.debounce(init_page_when_base_data_first_loaded, 50)).off,
		useMittOn(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE, lodash.debounce(function(){
			// 重新订阅C8
			api_bymids({ is_show_mids_change: true })
		}, 1000)).off,
		useMittOn(MITT_TYPES.EMIT_API_BYMIDS, api_bymids).off,
	]
	//如果创建后 菜单没有触发数据拉去
	//菜单没有触发请求数据 仍然没有请求数据 自身触发一次
	//防止一直loading
	setTimeout(() => {
		if (load_data_state.value == 'loading') {
			useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST_METADATA, {})
			useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST, {})
		}
	}, 10)
	//每30秒检查一次可视区域赛事数据最后更新时间 
	check_match_last_update_timer_id = setInterval(
		check_match_last_update_time,
		30000
	);
	onUnmounted(() => {
		handle_destroyed()
	});
	// load_video_resources();
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
/**
 * @description 获取强力推荐赛事
 * @param  {boolean} backend_run 是否后台 调用
 * @return {undefined} undefined
 */
function get_hot_match_list(backend_run = false) {
	// 更新收藏数量
	if (!backend_run) {
		useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_COUNT2_CMD)
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
			// if (handle_destroyed()) {
			// 	return;
			// }
			show_refresh_mask.value = false;
			let code = lodash.get(res, "data.code");
			// 赛事列表
			let match_list = lodash.get(res, "data.data") || [];
			if (MenuData.is_esports()) {
				match_list = lodash.get(res, "data.data.data") || [];
			}
			if (code == 200) {
				if (match_list.length > 0) {
					set_load_data_state("data")
					is_show_hot.value = true;
					// 设置列表数据仓库
					MatchListData.set_list(
						match_list,
					);
					match_list_handle_set(match_list)
					if (!backend_run) {
						// 调用bymids接口
						useMittEmit(MITT_TYPES.EMIT_API_BYMIDS, { is_first_load: true })
						// 切换右侧赛事
						let first_match = match_list[0];
						if (first_match) {
							MatchDataWarehouse_PC_Detail_Common.set_match_details(first_match, [])
							useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, first_match.mid)
						}
						// this.regular_events_set_match_details_params(null, params);
					} else {
						// 更新可视区域赛事盘口数据
						useMittEmit(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE)
					}
					// 计算赛事卡片
					MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
						match_list,
						backend_run
					);
				} else {
					load_data_state.value = "empty";
				}
			} else if (!backend_run) {
				load_data_state.value = "empty";
			} else {
				load_data_state.value = "empty";
			}
		})
		.catch((err) => {
			show_refresh_mask.value = false;
			if (!backend_run) {
				load_data_state.value = "empty";
			}
		});
};
/**
 * @description 无感刷新
 * @return {undefined} undefined
 */
function on_refresh() {
	fetch_match_list(true);
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
	useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, { type: "remove", match })
	// if (vx_details_params.mid == match.mid) {
	// 	// 赛事移除时右侧赛事自动切换
	// 	mx_autoset_active_match({ mid: match.mid });
	// }
};

/**
 * @Description 每30秒检查一次可视区域赛事数据最后更新时间，如果超过1分钟未更新数据  调用bymids接口更新数据
 * @param {undefined} undefined
 */
function check_match_last_update_time() {
	// 非滚球 今日 不检查
	if (![1, 2, 202].includes(MenuData.menu_root)) {
		return
	}
	let mids = [];
	let now_time = ServerTime.get_remote_time();
	// 遍历可视区域赛事ID
	MatchListScrollClass.show_mids.forEach((mid) => {
		// 更新时间间隔
		let api_time_dif = 0,
			ws_time_dif = 0;
		let match = MatchListData.get_quick_mid_obj(mid) || {};
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
	 * @Description 设置数据加载状态
	 * @param {string} 数据加载状态
	 * @param {undefined} undefined
	 */
function set_load_data_state(data) {
	load_data_state.value = data;
};
export {
	load_data_state,
	is_loading,
	show_refresh_mask,
	collect_count,
	is_show_hot,
	on_refresh,
	socket_remove_match,
	set_load_data_state,
	check_match_last_update_time,
	mounted_fn,
	handle_destroyed
}