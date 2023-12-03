import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import BaseData from 'src/core/base-data/base-data.js';
import MenuData from "src/core/menu-pc/menu-data-class.js";
import { set_match_base_info_by_mids_info } from 'src/core/match-list-pc/composables/match-list-featch.js'
import { compute_sport_id } from 'src/core/constant/index.js'
import { handle_match_list_request_when_ok } from './match-list-composition.js'
import { match_list_handle_set } from './match-handle-data.js'
// 根据 mid 获取 联赛列表数据
function get_match_list_by_mid_for_base_data_res(mid, csid, type) {
	// 元数据
	const { mi_tid_mids_res = {}, base_data_res = {} } = BaseData;
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
	livedata.filter((item) => {
		let match_list = (base_data_res.matchsList || []).find((page) => item.mids_info.includes(page.mid)) || {};
		// 空的不要
		if (match_list.mid) { matchs_list.push(match_list); }
	}) || [];
	return matchs_list;
};
// 使用元数据默认显示 后面替换
function set_base_data_init() {
	// return
	// 当前的分类 左侧菜单数据 中间件数据
	const {
		menu_root,

		left_menu_result: { lv2_mi, lv1_mi, has_mid_menu, guanjun, jinri_zaopan },
		mid_menu_result: { csid: mi, mif, root, mid_menu_mi },
		menu_data_version,
	} = MenuData;
	let mid = lv2_mi;
	let midf = lv1_mi;
	// 有中间件数据 不能是早盘 使用 mi
	if (has_mid_menu && !MenuData.is_zaopan()) {
		mid = mi;
		if ([MenuData.is_vr(), MenuData.is_kemp()].includes(true)) {
			midf = mi;
		} else {
			// midf = mif;
		}
	}
	// 数据兜底
	midf = midf || lv2_mi;
	mid = mid || lv2_mi;

	if (MenuData.is_scroll_ball()) {
		mid = mid_menu_mi;
	}
	// 获取csid 联赛列表头
	let csid = compute_sport_id(midf);
	// 冠军400 - 400是赛种id
	if (MenuData.is_kemp() && !MenuData.is_common_kemp()) {
		csid = parseInt(mi) - 400;
	}
	// 常规赛种下的冠军
	else if (MenuData.is_common_kemp()) {
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
	if ([MenuData.is_today(), MenuData.is_zaopan()].includes(true) && !MenuData.is_common_kemp()) {
		// 根据联赛-赛事接口 拿到 mid 去赛事列表里面匹配数据
		if (!mid) return;
		// 常规赛种/联赛   滚球 ld
		let livedata = (mi_tid_mids_res[mid].ld || []).map((item) => ({ tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids })) || [];
		// 常规赛种/联赛   未开赛 nd
		let nolivedata = (mi_tid_mids_res[mid].nd || []).map((item) => ({ tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids, })) || [];
		// 常规赛种、联赛  滚球 详细内容
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
			if (mi == 1) {
				let mi_100_arr = [];
				// 常规赛种/联赛  滚球
				mew_menu_list_res.forEach((x) => {
					if (x.mi * 1 < 300) { mi_100_arr.push(midf + jinri_zaopan + x.mi.substring(1)); }
				});
				//常规赛事下 所有的滚球数据
				mi_100_arr.forEach((item) => {
					let livedata = get_match_list_by_mid_for_base_data_res(item, csid, "ld");
					matchs_list = [...matchs_list, ...livedata];
				});
			} else {
				let mid_1 = midf + jinri_zaopan + ("" + midf).substring(1);
				matchs_list = get_match_list_by_mid_for_base_data_res(mid_1, csid, "ld");
			}
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
	if (MenuData.is_left_zaopan() || matchs_list.length <= 0) return;
	// 赛事列表 卡片数据
	// 设置列表数据仓库
	match_list_handle_set(matchs_list)
	MatchListData.set_list(
		matchs_list,
	);
	handle_match_list_request_when_ok(matchs_list, false, true, true);

	let ts1 = Date.now();
	let mids_arr = [];
	(matchs_list || []).forEach((match) => {
		mids_arr.push(String(match.mid));
		match.api_update_time = ts1;
	});
	// 联赛数据
	set_match_base_info_by_mids_info(matchs_list, mids_arr, ts1);
	return true;
};

// 欧洲版元数据
function set_base_data_init_ouzhou(play_num = '01') {
	try {
		let {
			menu_root,
			current_ball_type,
			left_menu_result: { lv2_mi, lv1_mi, has_mid_menu, guanjun, jinri_zaopan },
			mid_menu_result: { csid, mif, root, mid_menu_mi },
			menu_data_version,
		} = MenuData;
		let mid = lv2_mi + play_num;
		let midf = lv1_mi;
		if (MenuData.is_scroll_ball()) {
			mid = mid_menu_mi;
		}
		// // 冠军400 - 400是赛种id
		// if (MenuData.is_kemp()&&!MenuData.is_common_kemp()) {
		// 	csid = parseInt(mi) - 400;
		// }
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
			base_data_res = {},
			mew_menu_list_res,
			left_menu_base_mi_arr,
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
			let livedata = (mi_tid_mids_res[mid].ld || []).map((item) => ({ tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids })) || [];
			// 常规赛种/联赛   未开赛 nd
			let nolivedata = (mi_tid_mids_res[mid].nd || []).map((item) => ({ tid: item.tid, csid, mids: item.mids.join(","), mids_info: item.mids, })) || [];
			// 常规赛种、联赛  滚球 详细内容
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
					let livedata = get_match_list_by_mid_for_base_data_res(item, csid, current_ball_type);
					matchs_list = [...matchs_list, ...livedata];
				});
				// } else {
				// 	let mid_1 = midf + menu_root + ("" + midf).substring(1);
				// 	matchs_list = get_match_list_by_mid_for_base_data_res(mid_1, csid, "ld");
				// }
			} 
			//TODO 还没有调完
			// else if (MenuData.is_kemp()) {

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
			// }else if (menu_root == 500) {
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
		if (MenuData.is_left_zaopan()) return;
		// 赛事列表 卡片数据
		// 设置列表数据仓库
		match_list_handle_set(matchs_list)
		// MatchListData.set_list(
		// 	matchs_list,
		// );
		handle_match_list_request_when_ok(data, false, true, true);

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