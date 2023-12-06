import { ref } from 'vue';
import { useRoute } from 'vue-router';
import lodash from 'lodash';
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import store from "src/store-redux/index.js";
import { virtual_sport_format } from 'src/core/format/module/format-match.js'
import MenuData from "src/core/menu-pc/menu-data-class.js";
import { mx_collect_count, set_collect_count, match_collect_status } from "./match-list-collect.js";
import virtual_composable_fn from './match-list-virtual.js'
import { api_bymids, set_league_list_obj } from "./match-list-featch.js";
import PageSourceData from "src/core/page-source/page-source.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData, MatchDataWarehouse_PC_Detail_Common } from "src/core/index.js";
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import { match_list_handle_set } from '../match-handle-data.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

const { virtual_list_timeout_id, is_vr_numer } = virtual_composable_fn();
const vx_filter_select_obj = ref([])



const load_data_state = ref(null);
let hot_match_list_timeout;
let vx_layout_list_type = 'match'
// 是否虚拟体育
let is_virtual = MenuData.is_virtual_sport;
const { route_name } = PageSourceData;
//
let is_search = PageSourceData.is_search();
let is_show_hot = ref(false);
let vx_pre_filter_select_obj = []
/**
 * @Description 合并连续相同的联赛
 * @param {undefined} undefined
 */
const merge_same_league = (league_obj) => {
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
};


const deal_with_list_data = (data) => {
	let mid_arr = []
	data.forEach(item => {
		// mids 为  123,44344,1231232, 格式的mids字符串 转化为 mid层级
		let mid = item.mids.split(',');
		mid.forEach(option => {
			let mid_info = {
				...item,
				mid: option,
			}
			delete mid_info.mids;
			mid_arr.push(mid_info)
		})
	})
	// if (MenuData.is_kemp()) {
	//   MatchListData.set_list(mid_arr)
	// }
	MatchListData.set_list(mid_arr)
	match_list_handle_set(mid_arr)
}
/**
 * @description 专业处理服务器返回的 列表 数据---联赛结构
 * @param {object} data   服务器返回数据
 * @param {boolean} backend_run / is_socket 是否静默拉取 
 * @param  {boolean} cut   是否 切换右侧详情  true 不切换
 * @param  {boolean} collect   是否 请求收藏数量  true 不请求
 * @return {undefined} undefined
 */
const mx_list_res = (data, backend_run, cut, collect) => {
	let code = lodash.get(data, "code");
	let res_data = lodash.get(data, "data");
	// 将全量数据接口 切割成含有mid元素的对象数组
	let callback_func = null;
	clearTimeout(virtual_list_timeout_id);
	// 所有联赛列表
	let all_league_list = [];
	all_league_list.push(...lodash.get(res_data, "livedata", []));
	all_league_list.push(...lodash.get(res_data, "nolivedata", []));
	if (MenuData.is_kemp()) {
		all_league_list.push(...lodash.get(res_data, "data", []));
	}
	!backend_run && deal_with_list_data(all_league_list);
	// 设置数据仓库 联赛列表对象
	set_league_list_obj(res_data)
	if (code == 200 && all_league_list.length > 0) {
		is_show_hot.value = false;
		// 设置收藏数量
		// lockie
		if (vx_filter_select_obj.value.length > 0) {
			mx_collect_count();
		} else {
			try {
				// 组装所有赛事,检测赛事收藏,算总共的收藏赛事数量
				all_league_list.forEach(item => {
					let mids_ = lodash.get(item, 'mids', '').split(',');
					mids_.forEach(mid_ => {
						// 组装所有赛事
						const temp_match = { mid: mid_, csid: item.csid, tid: item.tid }
						// 设置收藏信息
						match_collect_status(temp_match)
					});
				});
			} catch (error) {
				count_mf = lodash.get(data, 'data.collectCount', 0)
				console.error(error);
			}
			set_collect_count({
				type: "set",
				count: lodash.get(data, "data.collectCount", 0),
			});
		}
		// 如果是专业版 && 今日、早盘、串关之间的切换 && 之前有筛选 && 并且当前没有筛选
		if (
			!backend_run &&
			[2, 3].includes(MenuData.menu_root) &&
			[2, 3].includes(MenuData.menu_root) &&
			vx_pre_filter_select_obj.length > 0 &&
			vx_filter_select_obj.value.length == 0
		) {
			let new_data = {
				livedata: [],
				nolivedata: [],
				championdata: [],
			};
			let new_filter = [];
			lodash.each(res_data, (item, key) => {
				lodash.each(item, (league) => {
					let tid = league.tid ? league.tid.toString() : "";
					if (
						tid &&
						new_data[key] &&
						vx_pre_filter_select_obj.includes(tid)
					) {
						new_data[key].push(league);
						if (!new_filter.includes(tid)) {
							new_filter.push(tid);
						}
					}
				});
			});
			if (new_filter.length > 0) {
				// 合并连续相同的联赛
				new_data = merge_same_league(new_data);
				Object.assign(res_data, new_data);
				if (new_filter.length != vx_filter_select_obj.value.length) {
					// this.set_filter_checked_all(false);
				}
			}
			MenuData.set_filter_select_obj(new_filter);
		}
		if (![2, 3].includes(MenuData.menu_root) && MenuData.cur_menu_type.pre_name) {
			store.dispatch({
				type: 'remove_pre_filter_select_obj',
				data: {}
			})
		}

		// 计算列表卡片样式
		MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
			res_data,
		);
		// if (lodash.isFunction(this.SCMD_C9)) {
		// 	// C9订阅
		// 	this.SCMD_C9(all_league_list);
		// }
		if (backend_run) {
			// 静默拉取列表 设置数据加载状态
			load_data_state.value = "data";
			// 更新可视区域赛事盘口数据
			useMittEmit(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE)
			let first_league = all_league_list[0];
			let mids = first_league.mids.split(",");
			let params = {
				media_type: "auto",
				mid: mids[0],
				tid: first_league.tid,
				sportId: first_league.csid,
			};
			if (MatchListCardDataClass.current_mid.value) {
				const match = MatchListData.get_quick_mid_obj(MatchListCardDataClass.current_mid.value)
				// 控制右侧比分板
				match && MatchDataWarehouse_PC_Detail_Common.set_match_details(match, [])
			}
		} else {
			if (MenuData.is_kemp()) {
				// 冠军玩法 调用接口切换右侧
				// this.mx_autoset_active_match();
			} else if (!MenuData.is_esports()) {
				// 非电竞切换右侧 为列表第一场赛事
				let first_league = all_league_list[0];
				let mids = first_league.mids.split(",");
				// let params = {
				// 	media_type: "auto",
				// 	mid: mids[0],
				// 	tid: first_league.tid,
				// 	sportId: first_league.csid,
				// };
				//触发右侧详情更新
				// useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, params);
				callback_func = () => {
					// lockie
					const match = MatchListData.get_quick_mid_obj(Number(mids[0]));
					if (match) {
						MatchDataWarehouse_PC_Detail_Common.set_match_details(match, [])
						useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, mids[0])
					}

					// this.regular_events_set_match_details_params(cut, params);
				};
			}
			// 调用bymids更新前12场赛事
			api_bymids(
				{ is_league_first: true, inner_param: true },
				callback_func
			);
		}
	} else if (!backend_run) {
		let delay = 10000;
		if (sessionStorage.getItem("is_select_time")) {
			delay = 0;
			sessionStorage.removeItem("is_select_time");
		}
		// this.load_data_state = "empty";
		hot_match_list_timeout = setTimeout(() => {
			if (load_data_state.value !== "data") {
				// this.get_hot_match_list();
				clearTimeout(hot_match_list_timeout);
			}
		}, delay);
		MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
			res_data,
		);
	} else {
		load_data_state.value = "empty";
		// 计算列表卡片样式
		MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
			res_data,
		);
	}
};
/***
 * @description 当接口状态为成功且有数据时 调用此方法
 */
const mx_use_list_res_when_code_200_and_list_length_gt_0 = ({ match_list, collect, backend_run }) => {
	is_show_hot.value = false;
	match_list.forEach(match => {
		match_collect_status(match)
	})
	if (Array.isArray(match_list)) { //有时候是 {}
		MatchListData.set_list(match_list)
	}
	// 设置第一条数据为当前mid，给分数板高亮用
	if (match_list.length) {
		const mid_index = match_list.findIndex(item => item?.mid == MatchListCardDataClass.current_mid.value)
		MatchListCardDataClass.set_current_mid(match_list[mid_index >= 0 ? mid_index : 0].mid);
	}
	// 计算赛事卡片
	MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
		match_list,
	);
	// 设置收藏数量
	// 只有预加载会传 true
	if (!collect) {
		mx_collect_count();
	}
	if (!backend_run) {
		if (!is_virtual || is_search) {
			// 非虚拟体育——设置赛事列表选中赛事
			if (
				MenuData.is_kemp() ||
				MenuData.menu_root == 400
			) {
				// this.mx_autoset_active_match();
			}
			// 非详情页 切换右侧为列表第一场赛事
			else if (route_name != "details") {
				let first_match = match_list[0];
				// let params = {
				// 	media_type: "auto",
				// 	mid: first_match.mid,
				// 	tid: first_match.tid,
				// 	sportId: first_match.csid,
				// };
				if (first_match) {
					MatchDataWarehouse_PC_Detail_Common.set_match_details(first_match, [])
					useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, first_match.mid)
				}
				// regular_events_set_match_details_params(cut, params);
			}
		}
	} else {
		if (MatchListCardDataClass.current_mid.value) {
			const match = MatchListData.get_quick_mid_obj(MatchListCardDataClass.current_mid.value)
			// 控制右侧比分板
			match && MatchDataWarehouse_PC_Detail_Common.set_match_details(match, [])
		}
		// 更新可视区域赛事盘口数据
		useMittEmit(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE)
	}
	// 首次拉列表调用bymids 拉取所有赛事盘口数据
	if (
		vx_layout_list_type == "match" &&
		[1, 500].includes(MenuData.menu_root) &&
		!backend_run
	) {
		// 调用bymids接口
		api_bymids({ is_first_load: true, inner_param: true });
	}
	load_data_state.value = "data";
};
/***
 * 当接口状态为异常状态时  调用此方法
 */
const mx_use_list_res_when_code_error_or_list_length_0 = ({ match_list, collect, backend_run }) => {
	if (is_virtual && !is_search) {
		// 右侧切换
		// MatchListDetailMiddleware.set_vsport_params({
		// 	csid: 0,
		// 	tid: 0,
		// });
		// 用来计算拉取接口的次数
		// is_vr_numer.value =  is_vr_numer.value + 1;
		// // 重复拉列表的次数小于5   3秒后再次拉接口
		// if (is_vr_numer.value < 5) {
		// 	virtual_list_timeout_id.value = setTimeout(
		// 		() => fetch_match_list(true),
		// 		3000
		// 	);
		// }
		load_data_state.value = "empty";
	}
	// 非静默拉取时
	else if (!backend_run) {
		// load_data_state.value = "empty";
		// 如果是滚球并且不是全部  把当前菜单数量设为0  并自动切换菜单
		let match_list_api_config = MenuData.match_list_api_config;
		if (
			route_name == "home" &&
			MenuData.menu_root == "1" &&
			match_list_api_config.sports != "quanbu-gunqiu"
		) {
			let obj = {
				menuId: (match_list_api_config.match_list || {}).params.euid,
				count: 0,
			};
			MenuData.set_current_mi_0_and_change_menu();
		} else if (
			route_name == "home" &&
			MenuData.menu_root != "500" &&
			vx_layout_list_type !== "collect"
		) {
			get_hot_match_list();
			//TODO
		} else {
			load_data_state.value = "empty";
		}
	} else {
		load_data_state.value = "empty";
		// 设置列表数据仓库
		// MatchListData.compute_match_list_all_data(
		// 	match_list,
		// 	backend_run,
		// 	true
		// );
		// 计算赛事卡片
		MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
			match_list,
		);
	}
};
/**
 * @description 处理服务器返回的 列表 数据 ---滚球
 * @param {object} data   服务器返回数据
 * @param {boolean} backend_run   是否静默拉取
 * @param  {boolean} cut   是否 切换右侧详情  true 不切换
 * @param  {boolean} collect   是否 请求收藏数量  true 不请求
 * @return {undefined} undefined
 */
const mx_use_list_res = (data, backend_run, cut, collect) => {
	let code = lodash.get(data, "code");
	clearTimeout(virtual_list_timeout_id);
	// 赛事列表
	let match_list = lodash.get(data, "data.data");
	if (!match_list) {
		match_list = lodash.get(data, "data");
	}
	set_league_list_obj(match_list)
	match_list = match_list || [];
	//虚拟体育 接口数据结构转换
	// lockie
	if (is_virtual && !is_search && false) {
		// 格式化
		match_list = virtual_sport_format(match_list);
	}
	if (code == 200 && match_list) {
		mx_use_list_res_when_code_200_and_list_length_gt_0({ match_list, collect, backend_run });
	} else {
		mx_use_list_res_when_code_error_or_list_length_0({ match_list, collect, backend_run });
	}
};

export {
	// 处理服务器返回的 列表 数据 ---滚球
	mx_use_list_res,
	// 处理服务器返回的 列表 数据 ---联赛结构
	mx_list_res
}