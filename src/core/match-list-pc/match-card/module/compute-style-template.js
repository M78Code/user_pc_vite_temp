/**
 * 计算当前赛事数据模板    --------单个赛事
 * 数据依据：
 *    1. 赛事信息 ， 赛种ID
 *    2. 当前在哪一个列表  假定 which_list
 *    3. 配置文件  / 或者叫配置方法
 *
 *
 * 输出信息：
 *    一个计算后的当前赛事的 高度相关的数据 ，含 模板 等信息 ，
 *    这个信息用于两个地方：
 *      1. 联赛卡片 计算
 *      2. 用于赛事自身约束
 *
 * 主要注意：
 *     1. 附加需求:   例如目前的 滚球下的 球类显示行
 *     2. 联赛信息展示行
 *
 *
 *  备注  1.在滚球我们自己根据数据计算出实际模板数据
 *        2. 在早盘 后台返回模板我们根据 后台返回的模板计算出实际模板数据
 *
 * 最好是写 配置文件
 *
 */

import { MatchDataWarehouse_PC_List_Common as MatchListData } from 'src/output/module/match-data-base.js'
import { PROJECT_NAME } from 'src/output/module/constant-utils.js'
import { time_conversion } from 'src/output/module/constant-utils.js'
import MatchListCardData from "./match-list-card-data-class.js";
import lodash from "lodash";
import { get_match_template_id } from '../../match-handle-data.js'
import { update_match_parent_card_style } from "src/core/match-list-pc/match-card/module/utils.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { league_title_card_template, ouzhou_league_title_template } from "../config/card-template-config.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from "../../list-template/index.js";
/**
 * @Description 获取其他玩法盘口高度
 * @param {string | Number } mid  赛事id
 */
const get_tab_play_height = (mid) => {
	// let template_id = MenuData.get_match_tpl_number()
	const match = MatchListData.get_quick_mid_obj(mid) || {};
	let { play_current_key, other_handicap_list = [], tpl_id } = match
	let { tab_play_handicap_height: handicap_height } = lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${tpl_id}_config.match_template_config`, {});
	let length = lodash.get(other_handicap_list, "0.ols.length", 3);
	//5分钟      波胆
	if (["hps5Minutes", "hpsBold"].includes(play_current_key)) {
		// 计算0号模板次要玩法 盘口+玩法标题高度
		handicap_height = length * 35 + (40 - (!["en", "ad", "ms"].includes(UserCtr.lang) ? 16 : 0));
	}
	return handicap_height;
};

// 赛事模板名称
const compute_view_tpl_id = (data_tpl_id) => {
	// 这里 是数据模板id 映射出来的视图模板id
	let view_tpl_id = data_tpl_id
	// 25 罚牌主盘口
	if ([3, 5, 6, 8, 19, 20, 22, 23, 25].includes(+data_tpl_id)) {
		view_tpl_id = 2
	} else if ([11, 16].includes(+data_tpl_id)) {
		view_tpl_id = 9
	} else if ([15].includes(+data_tpl_id)) {
		view_tpl_id = 10
	} else if ([13].includes(+data_tpl_id)) {
		view_tpl_id = 1
	} else if ([24].includes(+data_tpl_id)) { //15分钟
		view_tpl_id = 24
	}
	else if ([28].includes(+data_tpl_id)) {
		view_tpl_id = 'Esports'
	}
	return view_tpl_id
}

/**
 * @Description 获取足篮附加盘数量
 */
const get_add_handicap_count = (match) => {
	let add_handicap_count = 0;
	// 是否有附加盘1
	if (match.has_add1) {
		add_handicap_count++;
	}
	// 是否有附加盘2
	if (match.has_add2) {
		add_handicap_count++;
	}
	return add_handicap_count;
};

/**
 * @Description 计算模板0专有的数据
 * @param {object} match 赛事
 * @param {object} template_config 配置
 */
const compute_style_template_by_matchinfo_template0_zuqiu = (
	match,
	template_config
) => {
	// 是否显示角球、罚牌、点球大战等玩法
	let is_show_tab_play = match.has_other_play;
	// 角球、罚牌、点球大战等玩法 是否折叠
	let is_fold_tab_play = lodash.get(
		MatchListCardData.get_card_obj_bymid(match.mid),
		"is_fold_tab_play",
		false
	);
	let tab_play_total_height = 0;
	if (is_show_tab_play && !is_fold_tab_play) {
		// 如果有角球玩法并且未折叠  角球区域总高度 等于角球标题高度加角球盘口高度
		tab_play_total_height =
			template_config.tab_play_title_height + get_tab_play_height(match.mid);
	} else if (is_show_tab_play) {
		// 如果有角球玩法并且未折叠  角球区域总高度 等于角球标题高度
		tab_play_total_height = template_config.tab_play_title_height;
	}
	// 足球篮球  附加盘数量
	let add_handicap_count = get_add_handicap_count(match);
	// 附加盘高度 等于附加盘数量*模板配置附加盘高度
	let add_handicap_height =
		add_handicap_count * template_config.add_handicap_height;

	return {
		// 是否显示角球、罚牌、点球大战等玩法
		is_show_tab_play,
		// 角球、罚牌、点球大战等玩法 是否折叠
		is_fold_tab_play,
		// 角球区域高度
		tab_play_total_height,
		// 足球篮球  附加盘数量
		add_handicap_count,
		// 附加盘高度
		add_handicap_height,
	};
};

/**
 * @Description 跟新次要玩法高度
 * @param {String|Number} mid 赛事id
 */
export const update_match_cur_card_style = (mid) => {
	let card_obj = MatchListCardData.get_card_obj_bymid(mid);
	if (!card_obj.is_fold_tab_play) {
		card_obj.tab_play_total_height =
			card_obj.tab_play_title_height + get_tab_play_height(mid);
		card_obj.total_height =
			card_obj.main_handicap_height +
			card_obj.add_handicap_height +
			card_obj.tab_play_total_height +
			6;
		update_match_parent_card_style(card_obj, MatchListCardData.all_card_obj);
	}
};

/**
 * @Description 篮球让球与大小
 * @param {object} match 赛事
 * @param {object} template_config 配置
 **/
const compute_style_template_by_matchinfo_template7_lanqiu = (
	match,
	template_config
) => {
	// 足球篮球  附加盘数量
	let add_handicap_count = get_add_handicap_count(match);
	// 附加盘高度 等于附加盘数量*模板配置附加盘高度
	let add_handicap_height =
		add_handicap_count * template_config.add_handicap_height;

	return {
		// 足球篮球  附加盘数量
		add_handicap_count,
		// 附加盘高度
		add_handicap_height,
	};
};

/**
 * @Description 计算冠军模板赛事高度
 * @param {object} match 赛事
 **/
const compute_style_template_by_matchinfo_template18 = (match, template_id) => {
	let cur_match = MatchListData.get_quick_mid_obj(match.mid) || {
		main_handicap_list: [],
	};
	let main_handicap_list = []
	// 遍历主盘口数据
	lodash.each(cur_match.hpsData, (hpsData) => {
		lodash.each(hpsData.hps, (item) => {
			let hl_obj = lodash.get(item, "hl", {});
			if (hl_obj.hid) {
				hl_obj.end_time = time_conversion(hl_obj.hmed);
				hl_obj.hpn = lodash.get(cur_match.play_obj, `hid_${hl_obj.hid}.hpn`, "");
				main_handicap_list.push(hl_obj);
			}
		});
	});
	// 附加盘口高度
	let add_handicap_height = 0;
	// 投注项数量
	let ol_count = 0;
	main_handicap_list.forEach((hl_data) => {
		if (hl_data.hpid) {
			// 盘口标题高度
			add_handicap_height += 32;
			// 计算投注项数量
			ol_count = 0;
			hl_data.ol.forEach((ol) => {
				if (ol.os != 3 && ol.oid) {
					ol_count++;
				}
			});
			// 累加投注项高度
			add_handicap_height = add_handicap_height + Math.ceil(ol_count / 2) * 35;
		}
	});
	return { add_handicap_height };
};

/**
 * @Description 计算冠军模板赛事高度
 * @param {object} match 赛事
 **/
const compute_style_template_by_matchinfo_template118 = (match, template_id) => {
	let cur_match = MatchListData.get_quick_mid_obj(match.mid) || {
		main_handicap_list: [],
	};
	let main_handicap_list = []
	// 遍历主盘口数据
	lodash.each(cur_match.hpsData, (hpsData) => {
		lodash.each(hpsData.hps, (item) => {
			let hl_obj = lodash.get(item, "hl", {});
			if (hl_obj.hid) {
				hl_obj.end_time = time_conversion(hl_obj.hmed);
				hl_obj.hpn = lodash.get(cur_match.play_obj, `hid_${hl_obj.hid}.hpn`, "");
				main_handicap_list.push(hl_obj);
			}
		});
	});
	// 附加盘口高度
	let add_handicap_height = 0;
	// 投注项数量
	let ol_count = 0;
	main_handicap_list.forEach((hl_data) => {
		if (hl_data.hpid) {
			// 盘口标题高度
			add_handicap_height += 36;
			// 计算投注项数量
			ol_count = 0;
			hl_data.ol.forEach((ol) => {
				if (ol.os != 3 && ol.oid) {
					ol_count++;
				}
			});
			// 累加投注项高度
			add_handicap_height = add_handicap_height + Math.ceil(ol_count / 2) * 46;
		}
	});
	return { add_handicap_height };
};
/**
 * @Description 角球折叠
 * @param {number} mid 折叠的赛事ID
 */
export const fold_tab_play = (mid) => {
	let card_obj = MatchListCardData.all_card_obj[mid + '_'];
	card_obj.is_fold_tab_play = !card_obj.is_fold_tab_play;
	if (card_obj.is_fold_tab_play) {
		// 角球已折叠  角球区域总高度 等于角球标题高度
		card_obj.tab_play_total_height = card_obj.tab_play_title_height;
	} else if (card_obj.is_show_tab_play) {
		// 角球且未折叠  角球区域总高度
		card_obj.tab_play_total_height =
			card_obj.tab_play_title_height + get_tab_play_height(mid);
	}
	// 设置赛事卡片总高度 + 赛事间距和边框6px
	card_obj.total_height =
		card_obj.main_handicap_height +
		card_obj.add_handicap_height +
		card_obj.tab_play_total_height +
		6;
	// 更新赛事父级卡片样式 即对应的联赛容器卡片样式
	update_match_parent_card_style(card_obj, MatchListCardData.all_card_obj);
};

/**
 * @Description 获取联赛标题卡片高度
 * @param {number} template_id 赛事模板编号
 * @param {undefined} undefined
 */
export const get_league_title_card_height = (template_id) => {
	let height;
	// 个别模板有两行玩法标题
	if ([3, 5, 21, 22].includes(+template_id)) {
		height = 56;
	} else {
		height = PROJECT_NAME == 'ouzhou-pc' ? ouzhou_league_title_template.league_nofold_height : league_title_card_template.league_nofold_height;
	}
	return height;
};

/**
 *
 * 通过赛事信息 和模板 ID 计算 赛事的样式 模板
 * @param {*} match
 * @param {*} template_id
 * @returns
 */

export const compute_style_template_by_matchinfo = (match) => {
	let { tpl_id: template_id } = match;
	if (template_id == 13) {
		template_id = 1;
	}
	if (!template_id) {
		template_id = get_match_template_id(match)//兜底
	}
	// 赛事列表模板配置
	let template_config = MATCH_LIST_TEMPLATE_CONFIG[`template_${template_id}_config`]["match_template_config"] || {};
	// 赛事样式对象
	let style_obj = {
		// 显示等级
		show_level: 1,
		// 是否显示卡片  没拿到赛事数据的时候 不显示
		is_show_card: false,
		// 是否显示角球、罚牌、点球大战等玩法
		is_show_tab_play: false,
		// 角球、罚牌、点球大战等玩法 是否折叠
		is_fold_tab_play: false,
		// 角球区域高度
		tab_play_total_height: 0,
		// 角球盘口高度
		tab_play_title_height: template_config.tab_play_title_height,
		// 角球盘口高度
		tab_play_handicap_height: get_tab_play_height(lodash.get(match, "mid")),
		// 足球篮球  附加盘数量
		add_handicap_count: 0,
		// 附加盘高度
		add_handicap_height: 0,
		// 是否需要动态计算高度
		is_dynamic_compute_height: template_config.is_dynamic_compute_height || true,
		// 卡片总高度
		total_height: 0,
		// 主盘口高度
		main_handicap_height: 0,
		// 是否显示当前局玩法
		is_show_cur_handicap: false,
		// 当前局盘口高度
		cur_handicap_height: 0,
		// 数据模板id
		data_tpl_id: template_id,
		// 渲染的视图模板id
		view_tpl_id: compute_view_tpl_id(template_id)
	};
	// 如果没有赛事信息
	if (!match || !match.mid) {
		return style_obj;
	}
	style_obj.csid = match.csid;
	style_obj.is_show_card = true;

	if (template_id == 1) {
		let obj = compute_style_template_by_matchinfo_template0_zuqiu(
			match,
			template_config
		);
		Object.assign(style_obj, obj);
	}
	// 7号模板 篮球 让球与大小
	else if (template_id == 7) {
		let obj = compute_style_template_by_matchinfo_template7_lanqiu(
			match,
			template_config
		);
		Object.assign(style_obj, obj);
	}
	// 18号模板 冠军
	else if (template_id == 18) {
		let obj = compute_style_template_by_matchinfo_template18(match, template_id);
		Object.assign(style_obj, obj);
	}
	// 欧洲版冠军模板计算
	else if (template_id == 118) {
		let obj = compute_style_template_by_matchinfo_template118(match, template_id);
		Object.assign(style_obj, obj);
	}

	// 设置主盘口高度
	style_obj.main_handicap_height = template_config.main_handicap_height;
	// 是否显示当前局盘口
	style_obj.is_show_cur_handicap = match.is_show_cur_handicap;

	// 如果有当前局盘口 设置当前局盘口高度
	if (style_obj.is_show_cur_handicap) {
		style_obj.cur_handicap_height = template_config.cur_handicap_height;
	}
	// 设置卡片总高度 等于主盘口高度 + 当前局盘扣高度 + 附加盘高度 + 角球区域高度 + 赛事间距和边框6px
	style_obj.total_height =
		style_obj.main_handicap_height +
		style_obj.cur_handicap_height +
		style_obj.add_handicap_height +
		style_obj.tab_play_total_height +
		6;
	if (PROJECT_NAME == 'ouzhou-pc') {
		if (template_id == 118) {
			style_obj.total_height =
				style_obj.main_handicap_height +
				style_obj.cur_handicap_height +
				style_obj.add_handicap_height +
				style_obj.tab_play_total_height
		} else {
			style_obj.total_height = style_obj.main_handicap_height;
			if ([109].includes(+template_id)) {//有赛局制度
				style_obj.total_height += template_config.cur_handicap_height;
			}
		}
	}
	return style_obj;
};
