import { ref, provide, computed, reactive, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import lodash from "lodash";

import {  PageSourceData  } from "src/core/index.js";
// import { api_match } from "src/api/index.js";
// import { useMittEmit, MITT_TYPES, useMittOn } from 'src/core/mitt/index.js'
// import * as api_websocket from "src/api/module/socket/socket_api.js";
// import scrollList from "src/components/cus-scroll/scroll_list.vue";
import { MatchListCardFullVersionWapper as MatchListCard } from "src/components/match-list/match-list-card/index.js";
import Refresh from "src/components/refresh/refresh.vue";
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from 'src/core/index.js'
// import match_scroll_utils from 'src/core/match-list-pc/match-scroll.js'
// import video from "src/core/video/video.js";
// import { load_video_resources } from 'src/core/pre-load/module/pre-load-video.js'
import {  MenuData  } from "src/core/index.js";
// import collect_composable_fn from "src/core/match-list-pc/composables/match-list-collect.js";
// import ws_composable_fn from "src/core/match-list-pc/composables/match-list-ws.js";
// import virtual_composable_fn from "src/core/match-list-pc/composables/match-list-virtual.js";
// import process_composable_fn from 'src/core/match-list-pc/composables/match-list-processing.js'
// import MatchListDetailMiddleware from "src/core/match-list-detail-pc/index.js";
import store from "src/store-redux/index.js";

const route = useRoute();
let state = store.getState();
const { page_source } = PageSourceData;
// 赛事主列表容器卡片逻辑处理类
const match_list_card = reactive(MatchListCardClass);
// 赛事主列表容器卡片逻辑处理类
const match_list_data = reactive(MatchListData);
const match_list = {
	setup() {
		// 菜单数据
		// 数据请求状态
		const load_data_state = ref("loading");
		// 列表数据
		const match_list = ref([]);
		// 是否展示强力推荐
		const is_show_hot = ref(false);
		// 是否继续请求
		const is_loading = ref(true);
		// 赛事列表排序 1:按联赛排序 2:按时间排序
		const vx_match_sort = ref(state.filterReducer.show_filter_popup);
		// 筛选是否全选
		const vx_filter_checked_all = ref(state.filterReducer.show_filter_popup);
		// 上次筛选选中的数据
		const vx_pre_filter_select_obj = ref(state.filterReducer.show_filter_popup);
		// 左侧详情参数
		const vx_detail_params = ref(state.filterReducer.show_filter_popup);
		// 获取联赛筛选框显示状态
		const vx_show_filter_popup = ref(state.filterReducer.show_filter_popup);
		// 是否展开多列玩法
		const get_unfold_multi_column = ref(state.filterReducer.show_filter_popup);
		const timer_obj = ref({});
		const api_error_count = ref(0);
		const check_match_last_update_timer_id = ref(null);
		const get_match_list_timeid = ref(null);
		const hot_match_list_timeout = ref(null);
		const show_refresh_mask = ref(null);
		const current_hash_code = ref(null);
		const axios_debounce_timer2 = ref(null);
		// 注入依赖
		provide("match_list_data", match_list_data);
		provide("match_list_card", match_list_card);

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

		// 开启自动化测试功能
		this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
		// 列表数据仓库
		match_list_data.value.init();
		check_match_last_update_timer_id.value = setInterval(
			methods.check_match_last_update_time(),
			30000
		);
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
		is_vr_numer.value = 0;
		useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, update_collect_data);
		useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT2_CMD, mx_collect_count());
		// 站点 tab 休眠状态转激活
		useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, emit_site_tab_active());
		// 调用列表接口
		useMittOn(MITT_TYPES.EMIT_FETCH_MATCH_LIST, fetch_match_list);
		useMittOn(MITT_TYPES.EMIT_API_BYMIDS, api_bymids());
		useMittOn(MITT_TYPES.EMIT_MX_COLLECT_MATCH, mx_collect_match());
		useMittOn("match_list_show_mids_change", show_mids_change());

		watch(MenuData.match_list_api_config.version, (cur) => {
			// bug 版本没有变化 也可以进入
			if (MenuData.api_config_version != cur) {
				MenuData.set_api_config_version(cur);
				// is_loading.value = false
				// 清除过滤条件
				// this.vx_set_remove_filter_condition()
				// 获取赛事列表数据
				fetch_match_list();
				// 设置联赛吸顶高度
				set_sticky_top();
				// setTimeout(()=>{
				//   is_loading.value = true
				// },100)
			}
		}, {immediate: true})

		onMounted(() => {
			load_video_resources();
		})
		onUnmounted(() => {
			clearTimeout(this.axios_debounce_timer);
			clearTimeout(axios_debounce_timer2.value);
			clearInterval(check_match_last_update_timer_id.value);
			for (let key in timer_obj.value) {
				clearTimeout(timer_obj.value[key]);
			}
			//热门推荐定时器
			if (hot_match_list_timeout.value) {
				clearTimeout(hot_match_list_timeout.value);
			}
			this.debounce_throttle_cancel();
			this.$root.$off("match_list_show_mids_change", show_mids_change());
			this.destroyed = true;
			useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, update_collect_data).off();
			useMittOn(MITT_TYPES.EMIT_MX_COLLECT_COUNT2_CMD, mx_collect_count()).off();
			// 站点 tab 休眠状态转激活
			useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, emit_site_tab_active()).off();
			clearTimeout(this.virtual_list_timeout_id);
			clearTimeout(this.switch_timer_id);
			clearTimeout(get_match_list_timeid.value);
			// 调用列表接口
			useMittOn(MITT_TYPES.EMIT_FETCH_MATCH_LIST, fetch_match_list).off();
			useMittOn(MITT_TYPES.EMIT_API_BYMIDS, api_bymids()).off();
			useMittOn(MITT_TYPES.EMIT_MX_COLLECT_MATCH, mx_collect_match()).off();
			match_list_card = {};
			timer_obj.value = {};
		})
		return {
			...collect_composable_fn(),
			...ws_composable_fn(),
			...virtual_composable_fn(),
			...process_composable_fn(),
			// 是否展示强力推荐
			is_show_hot,
			// 是否继续请求
			is_loading,
			// 数据请求状态
			load_data_state,
			// 菜单数据
			match_list,
			match_list_card,
			match_list_data,
			vx_show_filter_popup,
			vx_match_sort,
			vx_filter_checked_all,
			vx_pre_filter_select_obj,
			vx_detail_params,
			get_unfold_multi_column,
			match_tpl_component,
			get_match_list_timeid,
			hot_match_list_timeout,
			show_refresh_mask,
			current_hash_code,
			axios_debounce_timer2,
			/**
			 * @description 请求数据
			 * @param  {boolean} is_socket   是否 socket 调用
			 * @param  {boolean} cut   是否 切换右侧详情  true 不切换
			 * @param {Object} params 其他参数
			 */

			fetch_match_list(is_socket = false, cut) {
				// 设置当前为赛事列表
				// 如果有拉列表定时器 清除定时器
				if (!is_socket && get_match_list_timeid.value) {
					clearTimeout(get_match_list_timeid.value);
					get_match_list_timeid.value = null;
				}
				// 热门推荐定时器
				if (!is_socket && hot_match_list_timeout.value) {
					clearTimeout(hot_match_list_timeout.value);
				}
				// 视频结束返回列表  强制loading
				if (video.is_video_end) {
					is_socket = false;
					video.is_video_end = false;
				}
				match_scroll_utils.fetch_match_list_time = new Date().getTime();
				// 组件和路由不匹配
				if (route.name == "details" && page_source != "details") {
					return;
				}
				// 强力推荐 静默拉取
				if (is_socket && is_show_hot.value) {
					get_hot_match_list(true);
					return;
				}
				// 【搜索列表】 WS 之类的调用 fetch_match_list 转向到 fetch_search_match_list
				if (route.name == "search") {
					this.fetch_search_match_list &&
						this.fetch_search_match_list(is_socket);
					return false;
				}
				if (!is_socket) {
					match_list_data.value.init();
					load_data_state.value = "loading";
					// 设置列表滚动条scrollTop
					route.name != "details" && match_scroll_utils.set_scroll_top(0);
				}
				let match_api = MenuData.match_list_api_config.match_list || {};
				// console.error('match_api',JSON.stringify(match_api))
				// 设置列表接口 和 参数
				let api = api_match[match_api.api_name];
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
				// 无感刷新 不走预加载
				if (typeof is_socket == "boolean" && !is_socket) {
					// console.error('不是无感刷新')
					// 使用元数据默认显示
					set_base_data_init();
				}
				// return
				let send_match_list_request = () => {
					/**返回数据处理************/
					api &&
						api(_params)
							.then((res) => {
								// 组件和路由不匹配 菜单id不匹配
								if (
									(route.name == "details" && page_source != "details") ||
									this.destroyed ||
									_params.euid != match_api.params.euid
								)
									return;
								let data = lodash.get(res, "data", {});
								api_error_count.value = 0;
								if (data.code == 200) {
									//处理服务器返回的 列表 数据   fetch_match_list
									handle_match_list_request_when_ok(
										JSON.parse(JSON.stringify(data)),
										is_socket,
										cut
									);
								} else if (data.code == "0401038") {
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
										get_match_list_timeid.value = setTimeout(() => {
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
						current_hash_code.value = 0;
						clearTimeout(axios_debounce_timer2.value);
						axios_debounce_timer2.value = setTimeout(() => {
							//直接发请求    单次数 请求的方法
							send_match_list_request();
							current_hash_code.value = 0;
						}, info.delay_time || 1000);
					}
				} else {
					//直接发请求    多 次数  循环请求 的方法
					send_match_list_request();
				}
			},
			/**
			 * // 处理服务器返回的 列表 数据   fetch_match_list
			 */
			handle_match_list_request_when_ok(data, is_socket, cut, collect) {
				// console.warn('daya',data)
				let {
					match_list_api_config,
					menu_root,
					match_list_api_type,
					left_menu_result,
				} = MenuData;
				//  console.warn('left_menu_result.gunjun',MenuData.left_menu_result.guanjun)
				// let  use_mx_list_res =
				if (
					(menu_root == 2000 ||
						([2, 3].includes(Number(menu_root)) &&
							left_menu_result.guanjun != "common-guanjun")) &&
					!match_list_api_config.is_collect
				) {
					// console.error('mx_list_res-----------------', );
					//       mx_list_res
					//    今日早盘   常规球种下的  常规 玩法
					//    电竞 单页  所有玩法
					mx_list_res(data, is_socket, cut, collect);
				} else {
					// console.error('mx_use_list_res-----------------', );
					//  mx_use_list_res
					// 滚球单页 下所有
					// 热门 单页下 所有
					//  冠军  单页      ，
					//  今日早盘   常规球种下的   常规球种下的 冠军
					// 虚拟体育 单页 的  所有赛种
					// 收藏
					mx_use_list_res(data, is_socket, cut, collect);
				}
			},
			/**
			 * @description 获取强力推荐赛事
			 * @param  {boolean} backend_run 是否后台 调用
			 * @return {undefined} undefined
			 */
			get_hot_match_list(backend_run = false) {
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
						if (route.name == "details" && page_source != "details") {
							return;
						}
						if (this.destroyed) {
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
							match_list_data.value.compute_match_list_all_data(
								match_list,
								backend_run,
								true
							);
							// 计算赛事卡片
							match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
								match_list,
								backend_run
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
								this.regular_events_set_match_details_params(null, params);
							} else {
								// 更新可视区域赛事盘口数据
								show_mids_change();
							}
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
			},

			/***
			 * @description 当接口状态为成功且有数据时 调用此方法
			 */
			mx_use_list_res_when_code_200_and_list_length_gt_0(match_list) {
				is_show_hot.value = false;
				// 设置列表数据仓库
				match_list_data.value.compute_match_list_all_data(
					match_list,
					backend_run,
					true
				);
				// 计算赛事卡片
				match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
					match_list,
					backend_run
				);
				// 设置收藏数量
				// 只有预加载会穿 true
				if (!collect) {
					mx_collect_count();
				}
				if (!backend_run) {
					if (!is_virtual || is_search) {
						// 非虚拟体育——设置赛事列表选中赛事
						if (
							MenuData.is_guanjun() ||
							MenuData.cur_menu_type.type_name == "winner_top"
						) {
							this.mx_autoset_active_match();
						}
						// 非详情页 切换右侧为列表第一场赛事
						else if (route.name != "details") {
							let first_match = match_list[0];
							let params = {
								media_type: "auto",
								mid: first_match.mid,
								tid: first_match.tid,
								sportId: first_match.csid,
							};
							this.regular_events_set_match_details_params(cut, params);
						}
					}
				} else {
					// 更新可视区域赛事盘口数据
					show_mids_change();
				}
				// 首次拉列表调用bymids 拉取所有赛事盘口数据
				if (
					this.vx_layout_list_type == "match" &&
					["play", "hot"].includes(type_name) &&
					!backend_run
				) {
					// 调用bymids接口
					api_bymids({ is_first_load: true, inner_param: true });
				}
				load_data_state.value = "data";
			},
			/***
			 * 当接口状态为异常状态时  调用此方法
			 */
			mx_use_list_res_when_code_error_or_list_length_0(match_list) {
				if (is_virtual && !is_search) {
					// 右侧切换
					MatchListDetailMiddleware.set_vsport_params({
						csid: 0,
						tid: 0,
					});
					// 用来计算拉取接口的次数
					is_vr_numer.value++;
					// 重复拉列表的次数小于5   3秒后再次拉接口
					if (is_vr_numer.value < 5) {
						this.virtual_list_timeout_id = setTimeout(
							() => fetch_match_list(true),
							3000
						);
					}
					load_data_state.value = "empty";
				}
				// 非静默拉取时
				else if (!backend_run) {
					// load_data_state.value = "empty";
					// 如果是滚球并且不是全部  把当前菜单数量设为0  并自动切换菜单
					let match_list_api_config = MenuData.match_list_api_config;
					if (
						route.name == "home" &&
						MenuData.menu_root == "1" &&
						match_list_api_config.sports != "quanbu-gunqiu"
					) {
						let obj = {
							menuId: (match_list_api_config.match_list || {}).params.euid,
							count: 0,
						};
						MenuData.set_current_mi_0_and_change_menu();
					} else if (
						route.name == "home" &&
						MenuData.menu_root != "500" &&
						this.vx_layout_list_type !== "collect"
					) {
						get_hot_match_list();
						//TODO
					} else {
						load_data_state.value = "empty";
					}
				} else {
					load_data_state.value = "empty";
					// 设置列表数据仓库
					match_list_data.value.compute_match_list_all_data(
						match_list,
						backend_run,
						true
					);
					// 计算赛事卡片
					match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
						match_list,
						backend_run
					);
				}
			},
			/**
			 * @Description 合并连续相同的联赛
			 * @param {undefined} undefined
			 */
			merge_same_league(league_obj) {
				let new_data = {
					livedata: [],
					nolivedata: [],
				};
				let new_league = {};
				// 上一个联赛
				let pre_league = {};
				// 遍历所有联赛列表
				lodash.each(["livedata", "nolivedata"], (type) => {
					pre_league = {};
					lodash.each(league_obj[type], (league) => {
						// 联赛ID相同 合并赛事ID
						if (league.tid == pre_league.tid) {
							new_league.mids += "," + league.mids;
						} else {
							// 联赛ID不同 添加到新联赛数据
							new_league = league;
							new_data[type].push(new_league);
						}
						pre_league = league;
					});
				});
				return new_data;
			},
			/**
			 * @description 返回顶部
			 * @return {undefined} undefined
			 */
			on_go_top() {
				useMittEmit(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, 0);
			},
			/**
			 * @description 无感刷新
			 * @return {undefined} undefined
			 */
			on_refresh() {
				fetch_match_list(2);
				show_refresh_mask.value = true;
			},

			/**
			 * @description 调用列表bymids接口
			 * @param  {boolean} is_first_load 是否用户切换菜单  第一次加载调用
			 * @param  {boolean} is_show_mids_change 是否可视区域赛事改变 调用
			 * @param  {boolean} is_league_first 是否联赛结构类型列表 首次加载拉前12场赛事
			 * @param  {array} mids 指定拉取的mids
			 * @param  {function} callback 回调函数
			 * @return {undefined} undefined
			 */
			api_bymids(
				{
					is_first_load,
					is_show_mids_change,
					is_league_first,
					mids,
					inner_param,
				},
				callback
			) {
				if (
					((this.destroyed || MenuData.is_virtual_sport()) &&
						route.name !== "search") ||
					(this.$options.name !== "HotMatchList" &&
						["details", "video"].includes(route.name))
				) {
					return;
				}
				// 联赛结构类型列表 首次加载拉前12场赛事
				if (is_league_first) {
					mids = match_list_data.value.get_first_unfold_mids();
				}
				// 第一次加载拉取所有赛事
				else if (is_first_load) {
					// mids = []
					// match_list_data.value.match_list.forEach( match => {
					//   mids.push(match.mid)
					// })
					mids = match_scroll_utils.show_mids;
				}
				// 是否可视区域赛事改变
				else if (is_show_mids_change) {
					mids = match_scroll_utils.show_mids;
				}
				// 是否用户切换菜单 第一次调用bymids接口
				if (is_league_first || is_first_load) {
					this.first_load_time = new Date().getTime();
				} else {
					let _time = new Date().getTime() - this.first_load_time;
					// 距离第一次全量加载时间小于2秒 不请求接口
					if (_time < 2000) {
						return;
					}
				}
				// 非滚球第一次加载  mid数量最多24个
				if (mids.length > 24) {
					mids.splice(24);
				}
				if (mids.length == 0) return;
				is_show_mids_change &&
					mids.forEach((mid) => {
						// 从列表触发详情接口同步数据
						if (this.vx_details_params.mid == mid) {
							useMittEmit("match_detail_base", {
								isWs: true,
								mid,
								is_bymids: true,
							});
						}
					});
				// 获取足球tab玩法参数
				let tabs = match_list_data.value.get_tab_param_build(mids);
				let match_list_api_config = MenuData.match_list_api_config.match_list;
				let _params = lodash.clone(match_list_api_config.params) || {};
				let params = {
					mids: mids.join(","),
					cuid: UserCtr.get_uid(),
					euid: _params.euid,
					orpt: _params.orpt,
					sort: vx_match_sort.value,
				};
				if (tabs.length > 0) {
					params.tabs = tabs;
				}
				// 非滚球传 玩法ID
				if (MenuData.menu_root != "1" && route.name != "search") {
					params.pids = _params.pids;
				}
				//today：今日  early：早盘 角球玩法
				params.cos = MenuData.is_corner_menu() || params.orpt == 25 ? 1 : 0;
				// 冠军去参数
				if (MenuData.menu_root == 400) {
					delete params.euid;
				}
				let api;
				// 电竞
				if (MenuData.is_esports() && route.name !== "search") {
					api = api_websocket.get_esports_by_mids;
					params = {
						mids: mids.join(","),
						csid: _params.csid,
						cuid: UserCtr.get_uid(),
					};
					if (MenuData.is_esports_champion()) {
						params.category = 2;
					}
				} else {
					api = api_websocket.get_match_base_info_by_mids;
				}
				//添加内部参数
				if (inner_param) params.inner_param = inner_param;
				//当点击足球 赛种,并收起右侧详情面版orpt参数为13
				if (get_unfold_multi_column.value && MenuData.is_multi_column) {
					params.orpt = 13;
				}
				// return
				let by_mids_fun_count = 0;
				let by_mids_fun = () => {
					// HTTP拉取最新信息合并
					api(params)
						.then((res) => {
							this.set_home_loading_time_record("ok");
							// 组件和路由不匹配
							if (
								(route.name == "details" && page_source != "details") ||
								this.destroyed
							)
								return;
							//更新电竞右侧视频
							if (
								MenuData.is_esports() &&
								route.name !== "search" &&
								!is_first_load
							) {
								useMittEmit(MITT_TYPES.GET_ESPORTS_VIDEO_LIST);
							}
							let code = lodash.get(res, "data.code");
							let match_list = lodash.get(res, "data.data.data") || [];
							let ts1 = lodash.get(res, "data.ts");
							let mids_arr = [];
							match_list.forEach((match) => {
								mids_arr.push(String(match.mid));
								match.api_update_time = ts1;
							});
							// 展开联赛数据加载状态
							let league_load_status = "";
							// 检查赛事是否移除
							if (code == 200) {
								mids.forEach((mid) => {
									if (!mids_arr.includes(String(mid))) {
										this.remove_match_data(mid);
									}
								});
							}
							if (code == 200 && match_list.length > 0) {
								this.set_match_base_info_by_mids_info(
									match_list,
									mids_arr,
									ts1
								);
							} else if (code == "0400500" && by_mids_fun_count++ < 3) {
								by_mids_fun();
								league_load_status = "empty";
							} else if (code == "0401038") {
								// 限流
								league_load_status = "api_limited";
							} else {
								league_load_status = "empty";
							}
							if (league_load_status && callback) {
								// 回调无数据状态
								callback(league_load_status);
							}
							// 如果是第一次加载设置数据加载状态
							if (is_league_first) {
								load_data_state.value = "data";
							}
							// 回调函数
							if (callback) {
								callback();
							}
						})
						.catch((err) => {
							this.set_home_loading_time_record("err");
							// console.error(err)
							// 如果是第一次加载设置数据加载状态
							if (is_league_first) {
								load_data_state.value = "data";
							}
							// 展开联赛数据加载状态
							let league_load_status = "";
							if (lodash.get(err, "response.status") == 503) {
								// 限流
								league_load_status = "user_api_limited";
							} else {
								// 无数据
								league_load_status = "empty";
							}
							if (callback) {
								// 回调无数据状态
								callback(league_load_status);
							}
						});
				};
				// 虚拟体育不用拉最新信息合并
				if (MenuData.cur_menu_type.type_name !== "virtual_sport") {
					const by_mids_debounce_cache =
						axios_debounce_cache.get_match_base_info_by_mids;
					if (by_mids_debounce_cache && by_mids_debounce_cache["ENABLED"]) {
						let scroll = is_show_mids_change ? Date.now() : "";
						let info = by_mids_debounce_cache.can_send_request({
							...params,
							scroll,
						});
						if (info.can_send) {
							//直接发请求    单次数 请求的方法
							by_mids_fun();
						} else {
							// 记录timer
							current_hash_code.value = 0;
							clearTimeout(this.axios_debounce_timer);
							this.axios_debounce_timer = setTimeout(() => {
								//直接发请求    单次数 请求的方法
								by_mids_fun();
								current_hash_code.value = 0;
							}, info.delay_time || 1000);
						}
					} else {
						//直接发请求    多 次数  循环请求 的方法
						by_mids_fun();
					}
				}
			},
			/**
			 * get_match_base_info_by_mids 数据解析
			 */
			set_match_base_info_by_mids_info(match_list, mids_arr, ts1) {
				// 设置列表数据仓库
				match_list_data.value.compute_match_list_all_data(match_list, true);
				// 重新计算赛事样式
				match_list_card.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(
					mids_arr
				);
				match_list.forEach((match) => {
					// bymid数据同步投注项 1508要改的
					BetCommonHelper.upd_bet_obj(ts1, match.mid);
					// 同步比分到右侧
					if (vx_detail_params.value.mid == match.mid) {
						BetCommonHelper.update_match_score(0, match.mid);
					}
				});
				//热门赛事 提取足球赛事
				if (MenuData.menu_root == 500) {
					let obj = match_list.find((item) => item.csid == 1) || {};
					MenuData.hot_500_sport_1 = !!obj.csid;
					// 更新 展开/收起 按钮显示隐藏
					MenuData.set_multi_column();
				}
			},
			/**
			 * @Description 删除赛事数据 卡片
			 * @param {*} mid 删除赛事id
			 */
			remove_match_data(mid) {
				// 移除卡片
				match_list_card.remove_match(mid);
				//清除数据仓库数据
				match_list_data.value.remove_match_data(mid);
				//切换右侧
				if (this.vx_details_params.mid == mid) {
					// 赛事移除时右侧赛事自动切换
					this.mx_autoset_active_match({ mid });
				}
			},
			/**
			 * @Description:移除赛事
			 * @Author success
			 * @param:
			 * @return:
			 * @Date 2020/03/19 17:44:06
			 */
			socket_remove_match(match) {
				// 列表加载中不操作
				if (load_data_state.value != "data") {
					return;
				}
				// 移除卡片
				match_list_card.remove_match(match.mid);
				// 更新收藏数量
				update_collect_data({ type: "remove", match });
				if (this.vx_details_params.mid == match.mid) {
					// 赛事移除时右侧赛事自动切换
					this.mx_autoset_active_match({ mid: match.mid });
				}
			},
			/**
			 * @Description 设置数据加载状态
			 * @param {string} 数据加载状态
			 * @param {undefined} undefined
			 */
			set_load_data_state(data) {
				load_data_state.value = data;
			},
			/**
			 * @Description 每30秒检查一次可视区域赛事数据最后更新时间，如果超过1分钟未更新数据  调用bymids接口更新数据
			 * @param {undefined} undefined
			 */
			check_match_last_update_time() {
				// 非滚球 今日 不检查
				if (!["play", "today"].includes(MenuData.cur_menu_type.type_name)) {
					return;
				}
				let mids = [];
				let now_time = this.get_remote_time();
				// 遍历可视区域赛事ID
				match_scroll_utils.show_mids.forEach((mid) => {
					// 更新时间间隔
					let api_time_dif = 0,
						ws_time_dif = 0;
					let match = match_list_data.value.mid_obj["mid_" + mid] || {};
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
					api_bymids({ mids });
				}
			},
			/**
			 * 发送站点选项卡事件
			 */
			emit_site_tab_active() {
				fetch_match_list(true);
			},
			// 自动化测试页面加载时间时使用
			set_home_loading_time_record(status) {
				if (
					window.init_loading_time_obj &&
					lodash.get(window, "env.config.DOM_ID_SHOW")
				) {
					if (!window.init_loading_time_obj.list_end_time) {
						window.init_loading_time_obj.list_end_time = new Date().getTime();
					}
					let time_obj = window.init_loading_time_obj;
					if (!time_obj.start) {
						time_obj.start = new Date(time_obj.start_time).Format(
							"yyyy-MM-dd hh:mm:ss"
						);
					}
					if (time_obj.list_end_time && time_obj.right_details_end_time) {
						let end_time =
							time_obj.list_end_time > time_obj.right_details_end_time
								? time_obj.list_end_time
								: time_obj.right_details_end_time;
						(time_obj.end = new Date(end_time).Format("yyyy-MM-dd hh:mm:ss")),
							(time_obj.end_time = end_time);
						time_obj.status = status;
						time_obj.duration = time_obj.end_time - time_obj.start_time;
						sessionStorage.setItem(
							"home_loading_time_record",
							JSON.stringify(time_obj)
						);
						window.init_loading_time_obj = null;
					}
				}
			},
			// 使用元数据默认显示 后面替换
			set_base_data_init() {
				// 列表数据仓库
				match_list_data.value.init();
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
				let csid = $BaseData.compute_sport_id(midf);
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
				} = $BaseData;
				// 没有数据 不执行
				if (!mi_tid_mids_res[mid]) {
					return;
				}
				// 常规赛种
				if ([2, 3].includes(menu_root) && !MenuData.is_guanjun()) {
					// 根据联赛-赛事接口 拿到 mid 去赛事列表里面匹配数据
					if (!mid) return;
					// 常规赛种/联赛   滚球 ld
					let livedata =
						(mi_tid_mids_res[mid].ld || []).map((item) => ({
							tid: item.tid,
							csid,
							mids: item.mids.join(","),
							mids_info: item.mids,
						})) || [];
					// 常规赛种/联赛   未开赛 nd
					let nolivedata =
						(mi_tid_mids_res[mid].nd || []).map((item) => ({
							tid: item.tid,
							csid,
							mids: item.mids.join(","),
							mids_info: item.mids,
						})) || [];
					// 常规赛种、联赛  滚球 详细内容
					let live_match = this.get_match_list_by_mid_for_base_data_res(
						mid,
						csid,
						"ld"
					);
					// 常规赛种、联赛  未开赛 详细内容
					let nolive_match = this.get_match_list_by_mid_for_base_data_res(
						mid,
						csid,
						"nd"
					);
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
								if (x.mi * 1 < 300) {
									mi_100_arr.push("101" + "2" + x.mi.substring(1));
								}
							});
							//常规赛事下 所以的滚球数据
							mi_100_arr.forEach((item) => {
								let livedata = this.get_match_list_by_mid_for_base_data_res(
									item,
									csid,
									"ld"
								);
								matchs_list = [...matchs_list, ...livedata];
							});
						} else {
							let mid_1 = "101" + "2" + ("" + midf).substring(1);
							matchs_list = this.get_match_list_by_mid_for_base_data_res(
								mid_1,
								csid,
								"ld"
							);
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
								let livedata = this.get_match_list_by_mid_for_base_data_res(
									item,
									csid,
									"ld"
								);
								matchs_list = [...matchs_list, ...livedata];
							});
						} else {
							let mid_1 = "101" + "2" + ("" + midf).substring(1);
							matchs_list = this.get_match_list_by_mid_for_base_data_res(
								mid_1,
								csid,
								"ld"
							);
						}
					} else if (menu_root == 500) {
						// 热门赛事
						if ([50199, 50101].includes(Number(mi))) {
							// 竞足 和赛事（全部）
							for (let i = 0; i < 20; i++) {
								// 常规赛事以外的 不分滚球和未开赛的数据
								let match_data = this.get_match_list_by_mid_for_base_data_res(
									mid,
									i,
									i
								);
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
							let live_data_match =
								this.get_match_list_by_mid_for_base_data_res(mid, csid, "ld");
							// 常规赛种、联赛  未开赛
							let nolive_data_match =
								this.get_match_list_by_mid_for_base_data_res(mid, csid, "nd");
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
						matchs_list = this.get_match_list_by_mid_for_base_data_res(
							mid,
							csid,
							csid
						);
						// console.warn('matchs_list',matchs_list)
						// 如果没有数据 使用其他有数据的 赛种玩法
						if (!matchs_list.length) {
							// 常规赛种/联赛  滚球
							let livedata = this.get_match_list_by_mid_for_base_data_res(
								mid,
								csid,
								"ld"
							);
							// 常规赛种、联赛  未开赛
							let nolivedata = this.get_match_list_by_mid_for_base_data_res(
								mid,
								csid,
								"nd"
							);
							matchs_list = [...livedata, ...nolivedata];
						}
					}
					data.data = matchs_list;
				}
				if (menu_root == 3) return;
				// 赛事列表 卡片数据
				handle_match_list_request_when_ok(data, true, true, true);
				let ts1 = Date.now();
				let mids_arr = [];
				console.warn("matchs_list", matchs_list);
				(matchs_list || []).forEach((match) => {
					mids_arr.push(String(match.mid));
					match.api_update_time = ts1;
				});
				// 联赛数据
				this.set_match_base_info_by_mids_info(matchs_list, mids_arr, ts1);
			},
			// 根据 mid 获取 联赛列表数据
			get_match_list_by_mid_for_base_data_res(mid, csid, type) {
				// 元数据
				const { mi_tid_mids_res = {}, base_data_res = {} } = $BaseData;
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
			},
		};
	},
	components: {
		Refresh,
		// scrollList,
		MatchListCard,
	},
};
export default match_list;
