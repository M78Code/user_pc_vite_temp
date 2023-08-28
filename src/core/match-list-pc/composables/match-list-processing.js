import lodash from 'lodash';

import { virtual_sport_format } from 'src/core/formart/index.js'

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
	let type_name = this.vx_cur_menu_type.type_name;
	let pre_name = this.vx_cur_menu_type.pre_name;
	clearTimeout(this.virtual_list_timeout_id);
	// 所有联赛列表
	let all_league_list = [];
	all_league_list.push(...lodash.get(res_data, "livedata", []));
	all_league_list.push(...lodash.get(res_data, "nolivedata", []));
	if (code == 200 && all_league_list.length > 0) {
		this.is_show_hot = false;
		// 设置收藏数量
		if (this.vx_filter_select_obj.length > 0) {
			// 只有预加载会传 true
			if (!collect) {
				this.mx_collect_count();
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
			["today", "early", "bet"].includes(type_name) &&
			["today", "early", "bet"].includes(pre_name) &&
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
		if (!["today", "early", "bet"].includes(pre_name) && pre_name) {
			this.remove_pre_filter_select_obj();
		}
		// 设置数据仓库 联赛列表对象
		this.match_list_data.set_league_list_obj(res_data);
		// 计算列表卡片样式
		this.match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
			res_data,
			backend_run
		);
		if (lodash.isFunction(this.SCMD_C9)) {
			// C9订阅
			this.SCMD_C9(all_league_list);
		}
		if (backend_run) {
			// 静默拉取列表 设置数据加载状态
			this.load_data_state = "data";
			// 更新可视区域赛事盘口数据
			this.show_mids_change();
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
			this.load_data_state = "data";
			// 调用bymids更新前12场赛事
			this.api_bymids(
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
		this.hot_match_list_timeout = setTimeout(() => {
			if (this.load_data_state !== "data") {
				this.get_hot_match_list();
				clearTimeout(this.hot_match_list_timeout);
			}
		}, delay);
	} else {
		this.load_data_state = "empty";
		// 设置数据仓库 联赛列表对象
		this.match_list_data.set_league_list_obj(res_data);
		// 计算列表卡片样式
		this.match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(
			res_data,
			backend_run
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
	let type_name = this.vx_cur_menu_type.type_name;
	clearTimeout(this.virtual_list_timeout_id);
	// 是否虚拟体育
	let is_virtual = MenuData.is_virtual_sport();
	//
	let is_search = PageSourceData.is_search();
	// 赛事列表
	let match_list = lodash.get(data, "data.data");
	if (!match_list) {
		match_list = lodash.get(data, "data");
	}
	match_list = match_list || [];
	//虚拟体育 接口数据结构转换
	if (is_virtual && !is_search) {
		// 格式化
		match_list = virtual_sport_format(match_list);
	}
	if (code == 200 && match_list.length > 0) {
		this.mx_use_list_res_when_code_200_and_list_length_gt_0();
	} else {
		this.mx_use_list_res_when_code_error_or_list_length_0();
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