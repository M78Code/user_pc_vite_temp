import {
	ref,
	computed,
	watch
} from "vue";
import lodash from "lodash";
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
import filterHeader from 'src/core/filter-header/filter-header.js'
// 根据 mid 获取 联赛列表数据
function get_match_list_by_mid_for_base_data_res (mid, csid, type) {
	// 元数据
	const { mi_tid_mids_res = {}, base_data_res = {} } = BaseData;
	let matchs_list = [];

	let current_type = type
	if (MenuData.is_guanjun()) {
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
		let match_list = (base_data_res.matchsList || []).find((page) => item.mids_info.includes(page.mid) ) || {};
		// 空的不要
		if (match_list.mid) { matchs_list.push(match_list); }
	}) || [];
	return matchs_list;
};
// 使用元数据默认显示 后面替换
function set_base_data_init () {
	// return
	// 当前的分类 左侧菜单数据 中间件数据
	const {
		menu_root,
		left_menu_result: { lv2_mi, lv1_mi, has_mid_menu, guanjun, jinri_zaopan},
		mid_menu_result: { mi, mif, root },
    menu_data_version,
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
					if (x.mi * 1 < 300) { mi_100_arr.push(midf + jinri_zaopan + x.mi.substring(1)); }
				});
				//常规赛事下 所有的滚球数据
				mi_100_arr.forEach((item) => {
					let livedata = get_match_list_by_mid_for_base_data_res( item, csid, "ld" );
					matchs_list = [...matchs_list, ...livedata];
				});
			} else {
				let mid_1 = midf + jinri_zaopan + ("" + midf).substring(1);
				matchs_list = get_match_list_by_mid_for_base_data_res( mid_1, csid, "ld" );
			}
		} else if (MenuData.is_guanjun()) {

			if (mi == 400) {
				let mi_400_arr = [];
				// 常规赛种/联赛  滚球
				mew_menu_list_res.forEach((x) => {
					if (x.mi * 1 < 300) {
						mi_400_arr.push(midf + jinri_zaopan + x.mi.substring(1));
					}
				});
				//常规赛事下 所有的滚球数据
				mi_400_arr.forEach((item) => {
					let livedata = get_match_list_by_mid_for_base_data_res( item, csid, "ld" );
					matchs_list = [...matchs_list, ...livedata];
				});
			} else {
				let mid_1 = midf + '4';
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
	// 设置列表数据仓库
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
	// set_match_base_info_by_mids_info(matchs_list, mids_arr, ts1);
};

export {
	set_base_data_init
}