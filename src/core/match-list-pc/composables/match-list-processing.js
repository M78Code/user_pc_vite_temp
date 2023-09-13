import { ref } from 'vue';

import lodash from 'lodash';

import { virtual_sport_format } from 'src/core/format/module/format-match.js'
import MenuData from "src/core/menu-pc/menu-data-class.js";
import collect_composable_fn from "./match-list-collect.js";
import virtual_composable_fn from './match-list-virtual.js'
import use_featch_fn from "./match-list-featch.js";
import ws_composable_fn from "./match-list-ws.js";
import PageSourceData  from  "src/core/page-source/page-source.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";

// const { api_bymids } = useMatchListMx();

const { mx_collect_count } = collect_composable_fn();
const { virtual_list_timeout_id } = virtual_composable_fn();
const { show_mids_change } = ws_composable_fn();
const { api_bymids } = use_featch_fn();

const load_data_state = ref(null);
let hot_match_list_timeout;
let vx_layout_list_type = 'match'
// 是否虚拟体育
let is_virtual = MenuData.is_virtual_sport;
//
let is_search = PageSourceData.is_search();
let is_show_hot = ref(false);
/**
 * @description 专业处理服务器返回的 列表 数据---联赛结构
 * @param {object} data   服务器返回数据
 * @param {boolean} backend_run   是否静默拉取
 * @param  {boolean} cut   是否 切换右侧详情  true 不切换
 * @param  {boolean} collect   是否 请求收藏数量  true 不请求
 * @return {undefined} undefined
 */
const mx_list_res = (data, backend_run, cut, collect) => {
	let code = lodash.get(data, "code");
	let res_data = lodash.get(data, "data");
	let callback_func = null;
	clearTimeout(virtual_list_timeout_id);
	// 所有联赛列表
	let all_league_list = [];
	all_league_list.push(...lodash.get(res_data, "livedata", []));
	all_league_list.push(...lodash.get(res_data, "nolivedata", []));

	if (code == 200 && all_league_list.length > 0) {
		is_show_hot.value = false;
		// 设置收藏数量
		if (this.vx_filter_select_obj.length > 0) {
			// 只有预加载会传 true
			if (!collect) {
				mx_collect_count();
			}
		} else {
			this.set_collect_count({
				type: "set",
				count: lodash.get(data, "data.collectCount", 0),
			});
		}
		// 如果是专业版 && 今日、早盘、串关之间的切换 && 之前有筛选 && 并且当前没有筛选
		if (
			!backend_run &&
			[2, 3].includes(MenuData.menu_root) &&
			[2, 3].includes(MenuData.menu_root) &&
			this.vx_pre_filter_select_obj.length > 0 &&
			this.vx_filter_select_obj.length == 0
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
						this.vx_pre_filter_select_obj.includes(tid)
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
				new_data = this.merge_same_league(new_data);
				Object.assign(res_data, new_data);
				if (new_filter.length != this.vx_filter_select_obj.length) {
					this.set_filter_checked_all(false);
				}
			}
			MenuData.set_filter_select_obj(new_filter);
		}
		if (![2, 3].includes(MenuData.menu_root) && pre_name) {
			this.remove_pre_filter_select_obj();
		}
		// 设置数据仓库 联赛列表对象
		this.match_list_data.set_league_list_obj(res_data);
		console.log('lockie-111');
		// 计算列表卡片样式
		MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
			res_data,
		);
		if (lodash.isFunction(this.SCMD_C9)) {
			// C9订阅
			this.SCMD_C9(all_league_list);
		}
		if (backend_run) {
			// 静默拉取列表 设置数据加载状态
			load_data_state = "data";
			// 更新可视区域赛事盘口数据
			show_mids_change();
		} else {
			if (MenuData.is_guanjun()) {
				// 冠军玩法 调用接口切换右侧
				this.mx_autoset_active_match();
			} else if (!MenuData.is_esports()) {
				// 非电竞切换右侧 为列表第一场赛事
				let first_league = all_league_list[0];
				let mids = first_league.mids.split(",");
				let params = {
					media_type: "auto",
					mid: mids[0],
					tid: first_league.tid,
					sportId: first_league.csid,
				};
				callback_func = () => {
					this.regular_events_set_match_details_params(cut, params);
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
			if (this.load_data_state !== "data") {
				this.get_hot_match_list();
				clearTimeout(hot_match_list_timeout);
			}
		}, delay);
	} else {
		load_data_state.value = "empty";
		// 设置数据仓库 联赛列表对象
		this.match_list_data.set_league_list_obj(res_data);
		console.log('lockie-2222');
		// 计算列表卡片样式
		MatchListCardClass.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
			res_data,
		);
	}
};
/***
 * @description 当接口状态为成功且有数据时 调用此方法
 */
const mx_use_list_res_when_code_200_and_list_length_gt_0 = ({match_list, collect, backend_run}) => {
	is_show_hot.value = false;
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
				MenuData.is_guanjun() ||
				MenuData.menu_root == 400
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
				regular_events_set_match_details_params(cut, params);
			}
		}
	} else {
		// 更新可视区域赛事盘口数据
		show_mids_change();
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
const mx_use_list_res_when_code_error_or_list_length_0 = (match_list) => {
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
		MatchListData.compute_match_list_all_data(
			match_list,
			backend_run,
			true
		);
		console.log('lockie-44444', JSON.stringify(MatchListData.list), JSON.stringify(MatchListData.list_to_obj));
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
	match_list = match_list || [];
	//虚拟体育 接口数据结构转换
	// lockie
	if (is_virtual && !is_search && false) {
		// 格式化
		match_list = virtual_sport_format(match_list);
	}
	if (code == 200 && match_list) {
		mx_use_list_res_when_code_200_and_list_length_gt_0({match_list, collect, backend_run});
	} else {
		mx_use_list_res_when_code_error_or_list_length_0();
	}
};

const process_composable_fn = () => {
  return {
    // 处理服务器返回的 列表 数据 ---滚球
    mx_use_list_res,
    // 处理服务器返回的 列表 数据 ---联赛结构
    mx_list_res

  }
}
export default process_composable_fn