import { MatchDataWarehouse_PC_List_Common as MatchListData, MatchDataWarehouse_PC_Detail_Common } from "src/output/module/match-data-base.js";
import BaseData from 'src/core/base-data/base-data.js';
import { MenuData } from "src/output/project/index.js"
import { set_match_base_info_by_mids_info } from 'src/core/match-list-pc/composables/match-list-featch.js'
import { handle_match_list_request_when_ok } from './composables/match-list-processing'
import { match_list_handle_set } from './match-handle-data.js'
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js';
// 根据 mid 获取 联赛列表数据
function get_match_list_by_mid_for_base_data_res(mid, csid, type) {
	// 元数据
	const { mi_tid_mids_res = {}, mids_map, tids_map } = BaseData;
	let matchs_list = [];

	let current_type = type
	if (MenuData.is_kemp()) {
		current_type = csid;
	}

	// 常规赛种/联赛  滚球 ld  未开赛 nd
	let livedata = ((mi_tid_mids_res[mid] || {})[current_type] || []).map((item) => ({
		tid: item.tid,
		csid,
		mids: item.mids.join(","),
		mids_info: item.mids,
	})) || [];
	// 常规赛种 联赛 滚球 下面的赛事信息
	livedata.forEach((item) => {
		lodash.get(item, 'mids_info', []).forEach(mid => {
			if (mid) {
				const or_math = mids_map[`mid_` + mid]
				if (or_math) {
					const tid_match = tids_map[`tid_` + or_math.tid] || {}
					matchs_list.push({ ...or_math, ...tid_match });
				}

			}
		})
	});
	return matchs_list;
};
// 使用元数据默认显示 后面替换
function set_base_data_init() {
	let {
		current_ball_type: csid,
		left_menu_result: { lv2_mi, lv1_mi },
		mid_menu_result: { mid_menu_mi },
	} = MenuData;
	let mid = lv2_mi;
	let midf = lv1_mi;
	if (MenuData.is_scroll_ball()) {
		mid = mid_menu_mi;
	}
	let data = {
		code: 200,
		data: {},
	};
	let matchs_list = [];
	// 元数据
	const {
		mi_tid_mids_res = {},
		mew_menu_list_res,
		tids_map
	} = BaseData;
	// 没有数据 不执行
	if (!(mi_tid_mids_res && mi_tid_mids_res[mid])) {
		return;
	}
	// 常规赛种
	if ((MenuData.is_today() || MenuData.is_zaopan()) && !MenuData.is_common_kemp()) {
		// 根据联赛-赛事接口 拿到 mid 去赛事列表里面匹配数据
		if (!mid) return;
		// 常规赛种/联赛   滚球 ld
		let livedata = (mi_tid_mids_res[mid].ld || []).map((item) => ({ tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids,...lodash.get(tids_map, `tid_` + item.tid, {}), })) || [];
		// // 常规赛种/联赛   未开赛 nd
		let nolivedata = (mi_tid_mids_res[mid].nd || []).map((item) => ({ tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids,...lodash.get(tids_map, `tid_` + item.tid, {}),})) || [];
		// // 常规赛种、联赛  滚球 详细内容

		let live_match = get_match_list_by_mid_for_base_data_res(mid, csid, "ld");
		// 常规赛种、联赛  未开赛 详细内容
		let nolive_match = get_match_list_by_mid_for_base_data_res(mid, csid, "nd");
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
		//滚球赛事
		if (MenuData.is_scroll_ball()) {
			// if (current_ball_type == 1) {
			let mi_100_arr = [];
			// 常规赛种/联赛  滚球
			mew_menu_list_res.forEach((x) => {
				if (x.mi * 1 < 300) { mi_100_arr.push(x.mi + '1'); }
			});
			//常规赛事下 所有的滚球数据
			mi_100_arr.forEach((item) => {
				let livedata = get_match_list_by_mid_for_base_data_res(item, csid, csid);
				matchs_list = [...matchs_list, ...livedata];
			});
			// } else {
			// 	let mid_1 = midf + menu_root + ("" + midf).substring(1);
			// 	matchs_list = get_match_list_by_mid_for_base_data_res(mid_1, csid, "ld");
			// }
		}
		//  else if (MenuData.is_kemp()) {
		// 	if (mi == 400) {
		// 		let mi_400_arr = [];
		// 		// 常规赛种/联赛  滚球
		// 		mew_menu_list_res.forEach((x) => {
		// 			if (x.mi * 1 < 300) {
		// 				mi_400_arr.push(midf + jinri_zaopan + x.mi.substring(1));
		// 			}
		// 		});
		// 		//常规赛事下 所有的滚球数据
		// 		mi_400_arr.forEach((item) => {
		// 			let livedata = get_match_list_by_mid_for_base_data_res(item, csid, "ld");
		// 			matchs_list = [...matchs_list, ...livedata];
		// 		});
		// 	} else {
		// 		let mid_1 = midf + '4';
		// 		matchs_list = get_match_list_by_mid_for_base_data_res(mid_1, csid, "ld");
		// 	}
		// } else if (menu_root == 500) {
		// 	// 热门赛事
		// 	if ([50199, 50101].includes(Number(mi))) {
		// 		// 竞足 和赛事（全部）
		// 		for (let i = 0; i < 20; i++) {
		// 			// 常规赛事以外的 不分滚球和未开赛的数据
		// 			let match_data = get_match_list_by_mid_for_base_data_res(mid, i, i);
		// 			matchs_list = [...matchs_list, ...match_data];
		// 		}
		// 	} else {
		// 		// 常规赛种/联赛   滚球 ld
		// 		let live_data_500 =
		// 			(mi_tid_mids_res[mid].ld || []).map((item) => ({
		// 				tid: item.tid,
		// 				csid,
		// 				mids: item.mids.join(","),
		// 				mids_info: item.mids,
		// 			})) || [];
		// 		// 常规赛种/联赛   未开赛 nd
		// 		let nolive_data_500 =
		// 			(mi_tid_mids_res[mid].nd || []).map((item) => ({
		// 				tid: item.tid,
		// 				csid,
		// 				mids: item.mids.join(","),
		// 				mids_info: item.mids,
		// 			})) || [];
		// 		// 常规赛种/联赛  滚球
		// 		let live_data_match = get_match_list_by_mid_for_base_data_res(mid, csid, "ld");
		// 		// 常规赛种、联赛  未开赛
		// 		let nolive_data_match = get_match_list_by_mid_for_base_data_res(mid, csid, "nd");
		// 		matchs_list = [...live_data_match, ...nolive_data_match];
		// 		// 常规赛种联赛
		// 		data.data = {
		// 			collectCount: 0,
		// 			collectMIds: [],
		// 			livedata: live_data_500,
		// 			nolivedata: nolive_data_500,
		// 		};
		// 	}
		// } else {
		// 	// 常规赛事以外的 不分滚球和未开赛的数据
		// 	matchs_list = get_match_list_by_mid_for_base_data_res(mid, csid, csid);
		// 	// 如果没有数据 使用其他有数据的 赛种玩法
		// 	if (!matchs_list.length) {
		// 		// 常规赛种/联赛  滚球
		// 		let livedata = get_match_list_by_mid_for_base_data_res(mid, csid, "ld");
		// 		// 常规赛种、联赛  未开赛
		// 		let nolivedata = get_match_list_by_mid_for_base_data_res(mid, csid, "nd");
		// 		matchs_list = [...livedata, ...nolivedata];
		// 	}
		// }
		data.data = matchs_list;
	}
	if (MenuData.is_zaopan() || matchs_list.length <= 0) return;
	// 赛事列表 卡片数据
	// 设置列表数据仓库
	MatchListData.set_list(
		matchs_list,
	);
	match_list_handle_set(matchs_list)
	//右侧比分版 应该改变
	MatchDataWarehouse_PC_Detail_Common.set_match_details(matchs_list[0], [])
	handle_match_list_request_when_ok(data, false, true);
	let ts1 = Date.now();
	let mids_arr = [];
	(matchs_list || []).forEach((match) => {
		mids_arr.push(String(match.mid));
		match.api_update_time = ts1;
	});
	// 联赛数据
	set_match_base_info_by_mids_info(matchs_list, mids_arr, ts1);
	useMittEmit(MITT_TYPES.EMIT_SHOW_DETAILS, matchs_list[0].mid)
	return true;
};

// 欧洲版元数据
function set_base_data_init_ouzhou(play_num = '01') {
	try {
		let {
			current_ball_type: csid,
			left_menu_result: { lv2_mi},
			mid_menu_result: {mid_menu_mi },
			menu_current_mi
		} = MenuData;
		let mid = lv2_mi + play_num;
		if (MenuData.is_scroll_ball()) {
			mid = mid_menu_mi;
		}
		// // 冠军400 - 400是赛种id
		if (MenuData.is_kemp()) {
			mid = menu_current_mi;
		}
		// // 常规赛种下的冠军
		// else if (MenuData.is_common_kemp()) {
		// 	csid = parseInt(lv2_mi) - 400;
		// }
		let data = {
			code: 200,
			data: {},
		};
		let matchs_list = [];
		// 元数据
		const {
			mi_tid_mids_res = {},
			mew_menu_list_res,
			tids_map,
		} = BaseData;
		// 没有数据 不执行
		if (!(mi_tid_mids_res && mi_tid_mids_res[mid])) {
			return;
		}
		// 常规赛种
		if ([MenuData.is_left_today(), MenuData.is_left_zaopan()].includes(true) && !MenuData.is_common_kemp()) {
			// 根据联赛-赛事接口 拿到 mid 去赛事列表里面匹配数据
			if (!mid) return;
			// 常规赛种/联赛   滚球 ld
			let livedata = (mi_tid_mids_res[mid].ld || []).map((item) => ({ tn: item.tn, tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids ,...lodash.get(tids_map, `tid_` + item.tid, {}),})) || [];
			// // 常规赛种/联赛   未开赛 nd
			let nolivedata = (mi_tid_mids_res[mid].nd || []).map((item) => ({ tn: item.tn, tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids, ...lodash.get(tids_map, `tid_` + item.tid, {}),})) || [];
			// // 常规赛种、联赛  滚球 详细内容

			let live_match = get_match_list_by_mid_for_base_data_res(mid, csid, "ld");
			// 常规赛种、联赛  未开赛 详细内容
			let nolive_match = get_match_list_by_mid_for_base_data_res(mid, csid, "nd");
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
			if (MenuData.is_scroll_ball()) {
				// if (current_ball_type == 1) {
				let mi_100_arr = [];
				// 常规赛种/联赛  滚球
				mew_menu_list_res.forEach((x) => {
					if (x.mi * 1 < 300) { mi_100_arr.push(x.mi + '1'); }
				});
				//常规赛事下 所有的滚球数据
				mi_100_arr.forEach((item) => {
					let livedata = get_match_list_by_mid_for_base_data_res(item, csid, csid);
					matchs_list.push(...livedata);
				});
				// } else {
				// 	let mid_1 = midf + menu_root + ("" + midf).substring(1);
				// 	matchs_list = get_match_list_by_mid_for_base_data_res(mid_1, csid, "ld");
				// }
			}
			//TODO 还没有调完
			else if (MenuData.is_kemp() || MenuData.is_common_kemp()) {
				let livedata = get_match_list_by_mid_for_base_data_res(menu_current_mi, csid, "ld");
				matchs_list.push(...livedata);
			}
			// else if (menu_root == 500) {
			// 	// 热门赛事
			// 	if ([50199, 50101].includes(Number(mi))) {
			// 		// 竞足 和赛事（全部）
			// 		for (let i = 0; i < 20; i++) {
			// 			// 常规赛事以外的 不分滚球和未开赛的数据
			// 			let match_data = get_match_list_by_mid_for_base_data_res(mid, i, i);
			// 			matchs_list = [...matchs_list, ...match_data];
			// 		}
			// 	} else {
			// 		// 常规赛种/联赛   滚球 ld
			// 		let live_data_500 =
			// 			(mi_tid_mids_res[mid].ld || []).map((item) => ({
			// 				tid: item.tid,
			// 				csid,
			// 				mids: item.mids.join(","),
			// 				mids_info: item.mids,
			// 			})) || [];
			// 		// 常规赛种/联赛   未开赛 nd
			// 		let nolive_data_500 =
			// 			(mi_tid_mids_res[mid].nd || []).map((item) => ({
			// 				tid: item.tid,
			// 				csid,
			// 				mids: item.mids.join(","),
			// 				mids_info: item.mids,
			// 			})) || [];
			// 		// 常规赛种/联赛  滚球
			// 		let live_data_match = get_match_list_by_mid_for_base_data_res(mid, csid, "ld");
			// 		// 常规赛种、联赛  未开赛
			// 		let nolive_data_match = get_match_list_by_mid_for_base_data_res(mid, csid, "nd");
			// 		matchs_list = [...live_data_match, ...nolive_data_match];
			// 		// 常规赛种联赛
			// 		data.data = {
			// 			collectCount: 0,
			// 			collectMIds: [],
			// 			livedata: live_data_500,
			// 			nolivedata: nolive_data_500,
			// 		};
			// 	}
			// } else {
			// 	// 常规赛事以外的 不分滚球和未开赛的数据
			// 	matchs_list = get_match_list_by_mid_for_base_data_res(mid, csid, csid);
			// 	// 如果没有数据 使用其他有数据的 赛种玩法
			// 	if (!matchs_list.length) {
			// 		// 常规赛种/联赛  滚球
			// 		let livedata = get_match_list_by_mid_for_base_data_res(mid, csid, "ld");
			// 		// 常规赛种、联赛  未开赛
			// 		let nolivedata = get_match_list_by_mid_for_base_data_res(mid, csid, "nd");
			// 		matchs_list = [...livedata, ...nolivedata];
			// 	}
			// }
			data.data = matchs_list;
		}
		if (MenuData.is_left_zaopan() || matchs_list.length <= 0) return;
		// 设置列表数据仓库
		// MatchListData.set_list(
		// 	matchs_list
		// );
		// match_list_handle_set(matchs_list)
		handle_match_list_request_when_ok(data, false, true);
		let ts1 = Date.now();
		let mids_arr = [];
		(matchs_list || []).forEach((match) => {
			mids_arr.push(String(match.mid));
			match.api_update_time = ts1;
		});
		// 联赛数据
		set_match_base_info_by_mids_info(matchs_list, mids_arr, ts1);
		return true;
	} catch (e) {
		console.error('set_base_data_init_ouzhou', e)
		return false
	}
}
export {
	set_base_data_init,
	set_base_data_init_ouzhou
}