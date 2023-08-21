import {
	sport_match_count as sport_match_count_template,
	match_list_play_config,
	history_score_dict,
	match_state_convert_score_dict,
	handicap_highlight_paly_id,
	other_play_name_to_playid,
	let_ball_play_tpl,
	has_cur_handicap_tpl_ids,
} from "src/core/match-list-pc/data-class-ctr/conifg/index.js";
import utils from "src/core/utils/utils.js";
import lodash from 'lodash';

class MatchListDataClass {
	/**
	 * @Description 构造函数
	 * @param {undefined} undefined
	 */
	constructor() {
		// 球种赛事数量
		this.sport_match_count = lodash.cloneDeep(sport_match_count_template);
	}
	/**
	 * @Description 初始化
	 * @param {undefined} undefined
	 */
	init() {
		// 所有赛事对象 用来存放页面上的赛事数据
		this.mid_obj = {
			// 'mid_123':{}
		};
		// 所有盘口对象
		this.hl_obj = {
			// 'hid_123':{}
		};
		// 所有投注项对象
		this.ol_obj = {
			// 'oid_123':{}
		};
		// 所有赛事的坑位对象
		this.hn_obj = {
			// 'mid_hpid_ot':{}
		};
		// 赛事列表
		this.match_list = [];
		// 联赛列表对象
		this.league_list_obj = {};
		// 足球其他玩法（角球、罚牌等）  当前选中的玩法
		this.other_play_current_play = {
			// 'mid_123':'hpsCorner'
		};
	}
	/**
	 * @Description 销毁
	 * @param {undefined} undefined
	 */
	beforeUnmount() {
		this.mid_obj = null;
		this.hl_obj = null;
		this.ol_obj = null;
		this.hn_obj = null;
		this.match_list = null;
		this.league_list_obj = null;
		this.other_play_current_play = null;
	}
	/**
	 * @Description 根据赛事列表计算所有赛事数据 数据仓库主入口函数
	 * @param {array} match_list 赛事列表
	 * @param {boolean} is_ws_call  是否ws调用
	 * @param {boolean} is_all_match 是否全量列表数据
	 * @param {undefined} undefined
	 */
	compute_match_list_all_data(match_list, is_ws_call, is_all_match) {
		// 所有赛事对象 用来存放页面上的赛事数据
		let mid_obj = {};
		// 是否ws拉取全量数据
		let is_ws_call_all = is_ws_call && is_all_match;
		// 球种赛事数量
		let sport_match_count = lodash.cloneDeep(sport_match_count_template);
/**
 * 主要列表 
 * H5 是走虚拟算法的 主列表 
 * PC 是走框架算法的 主列表 
 * 
 * 这个不含  match-small-list-data.js  的应用  场景
 * 
 */


		// 根据商户过滤篮球赛事
		// if(store.getters.get_user.mId == '1443742662615240704'){
		//   lodash.remove(match_list, match => match.csid == 2)
		// }
		match_list.forEach((match) => {
			let { mid, csid } = match || {};
			// 处理ws拉取全量数据  列表闪屏
			// ws拉取全量数据 并且 mid_obj未存有赛事数据 不合并数据
			if (!(is_ws_call_all && this.mid_obj["mid_" + mid])) {
				// 设置赛事模板ID
				match.tpl_id = this.get_match_template_id(match);
				// 设置赛事默认数据
				this.set_match_default_data(match);
				// 设置赛事所有盘口数据
				this.set_match_all_handicap_data(match);
				// 设置赛事比分
				this.set_match_score(match);
				// 计算单个赛事数据
				mid_obj["mid_" + mid] = this.compute_match_data(match);
			}
			// 虚拟体育 不需要统计数量
			if (is_all_match && !utils.is_virtual_csid(csid)) {
				// 统计球种赛事数量
				sport_match_count["csid_" + csid] = sport_match_count[
					"csid_" + csid
				] || { count: 0 };
				sport_match_count["csid_" + csid].count++;
			}
		});

		if (is_all_match) {
			this.match_list = match_list;
			// 合并球种数量
			lodash.merge(this.sport_match_count, sport_match_count);
			// 计算滚球全部菜单数量
			$menu.compute_play_all_menu_count(sport_match_count);
		}
		// 合并赛事对象 冠军赋值
		lodash.merge(this.mid_obj, mid_obj);
		// 设置所有赛事ol_obj对象
		this.set_match_ol_obj(match_list);
	}
	/**
	 * @Description 设置赛事默认数据
	 * @param {Object} match 赛事信息
	 * @param {undefined} undefined
	 */
	set_match_default_data(match) {
		// 是否有附加盘1
		match.has_add1 = false;
		// 是否有附加盘2
		match.has_add2 = false;
		// 设置是否显示当前局玩法
		match.is_show_cur_handicap = false;
		// 主客队名称后面是否显示上半场字符串
		match.up_half_text = "";
		// 当前局盘口列表
		match.cur_handicap_list = [];
		// 足球角球玩法tab
		match.tab_play_keys = "";
		// 默认比分数据
		match.score_obj = utils.serialized_score([], true);
		// 当前局比分
		match.cur_score = {
			home: "",
			away: "",
		};
		// 主队比分
		match.home_score = "";
		// 客队比分
		match.away_score = "";
		// 历史比分列表
		match.score_list = [];
		// 赛事比分总分
		match.total_score_str = "";
		// 15分钟玩法阶段
		match.hSpecial = 1;
		// 5分钟玩法阶段
		match.hSpecial5min = 1;
	}
	/**
	 * @Description 计算单个赛事数据
	 * @param {Object} match 赛事信息
	 * @param {undefined} undefined
	 */
	compute_match_data(match) {
		// 热门赛事加上热门标签  假如电竞需要加入热门标识|| $menu.get_match_list_api_params().isHot
		if (
			$menu.get_match_list_api_params().euid == 30199 &&
			window.vue.$route.name !== "search"
		) {
			match.is_hot = true;
		}

		// 设置赛事logo
		match.match_logo = {
			home_1_logo: lodash.get(match, "mhlu[0]"),
			home_1_letter: lodash.get(match, "frmhn[0]"),
			home_2_logo: lodash.get(match, "mhlu[1]"),
			home_2_letter: lodash.get(match, "frmhn[1]"),
			away_1_logo: lodash.get(match, "malu[0]"),
			away_1_letter: lodash.get(match, "frman[0]"),
			away_2_logo: lodash.get(match, "malu[1]"),
			away_2_letter: lodash.get(match, "frman[1]"),
			is_double: lodash.get(match, "mhlu.length") > 1,
		};

		// 删除无用垃圾数据
		delete match.hpsData;

		return match;
	}
	/**
	 * @Description 设置赛事所有盘口数据
	 * @param {undefined} undefined
	 */
	set_match_all_handicap_data(match) {
		let all_hl_obj = {};
		let all_hids = [];
		// 计算玩法数据
		this.compute_play_data(match);
		if ([21, 0, 13].includes(+match.tpl_id)) {
			match.tpl_21_hpids = "";
		}
		// 所有投注项ID列表
		match.all_oid_arr = [];
		match.all_ol_data = {};
		// 遍历主盘口数据
		lodash.each(match.hpsData, (hpsData) => {
			lodash.each(hpsData.hps, (hl_obj) => {
				this.compute_hl_obj_data({ match, hl_obj, all_hids, all_hl_obj });
			});
		});
		// 遍历附加盘数据
		let add_hps = lodash.get(match, "hpsData[0].hpsAdd", []);
		add_hps.forEach((item) => {
			// 遍历附加盘盘口
			let { hl: hls_arr = [], hpid, chpid } = item;
			hls_arr.forEach((hl, hl_index) => {
				this.compute_hl_obj_data({
					match,
					hl_obj: { hl, hpid, chpid },
					all_hids,
					all_hl_obj,
					hl_index: hl_index + 2,
				});
			});
		});

		// 足球让球与大小玩法 遍历其他玩法数据
		if (match.csid == 1 && [0, 13].includes(+match.tpl_id)) {
			lodash.each(Object.keys(other_play_name_to_playid), (key) => {
				lodash.each(match[key], (hl_obj) => {
					this.compute_hl_obj_data({ match, hl_obj, all_hids, all_hl_obj });
				});
			});
		}

		lodash.merge(this.hl_obj, all_hl_obj);
		match.all_hids = all_hids.join(",");
		match.all_oids = match.all_oid_arr.join(",");
		// 过期旧投注项ID列表
		let old_oid_arr = lodash.filter(
			lodash.get(this.mid_obj["mid_" + match.mid], "all_oids", "").split(","),
			(oid) => !match.all_oids.includes(oid),
			[]
		);
		// 删除旧投注项数据
		old_oid_arr.forEach((oid) => {
			delete this.ol_obj["oid_" + oid];
		});
		if (match.tpl_id == 18) {
			// 计算赛事所有盘口数据--冠军玩法
			this.compute_match_all_handicap_data_champion(match);
		} else {
			// 计算赛事所有盘口数据
			this.compute_match_all_handicap_data(match);
		}
	}
	/**
	 * @Description 计算单个盘口数据
	 * @param {Object} match    赛事数据
	 * @param {Object} hl_obj   盘口数据
	 * @param {Array} all_hids 当前赛事所有玩法 id
	 * @param {Object} all_hl_obj  当前赛事所有盘口数据
	 * @param {Number} hl_index  附加盘
	 */
	compute_hl_obj_data({ match, hl_obj, all_hids, all_hl_obj, hl_index }) {
		let {
			hl,
			hSpecial,
			hpid,
			chpid,
			hl: { hid },
		} = hl_obj;
		if (
			[7, 20, 74, 341, 342].includes(+hpid) &&
			lodash.get(hl_obj, "hl.hs", 2) != 2
		) {
			match.tpl_21_hpids += hpid + ",";
		}
		if (hid) {
			let handle_type = 1;
			if (hSpecial) {
				hl.hSpecial = hSpecial;
				handle_type = Number(hSpecial);
			}
			if (hl_index) {
				handle_type = hl_index;
			}
			// 添加盘口ID
			all_hids.push(hid);
			// 玩法ID
			hl._hpid = hpid;
			// 玩法唯一标识
			hl.chpid = chpid || hpid;
			// 赛事级别盘口状态
			hl._mhs = match.mhs;
			all_hl_obj["hid_" + hid] = hl;
			// 计算投注项数据
			this.compute_ol_data(hl, match, handle_type);
		}
	}
	/**
	 * @Description 计算赛事所有盘口数据
	 * @param {undefined} undefined
	 */
	compute_match_all_handicap_data(match) {
		let { tpl_id, csid, mmp } = match;
		// 模板玩法配置
		let play_config = match_list_play_config[`template_${tpl_id}`] || {};

		// 是否角球菜单
		let is_corner_menu = $menu.is_corner_menu();

		//盘口类型
		let type = 1;
		// 主盘口列表
		let main_handicap_list = this.clone_arr(play_config.main_handicap_list);
		// 角球主盘口列表
		if (tpl_id == 0 && is_corner_menu) {
			main_handicap_list = this.clone_arr(play_config.hpsCorner);
		}
		// 足球 加时赛阶段主盘口列表  mmp：即将加时(32)、加时休息(33)、加时上半场(41)、加时下半场(42)
		else if (tpl_id == 0 && [32, 33, 41, 42].includes(+mmp)) {
			main_handicap_list = this.clone_arr(play_config.hpsOvertime);
		}
		// 美足 主盘口列表
		else if (tpl_id == 0 && csid == 6) {
			main_handicap_list = this.clone_arr(play_config.main_handicap_list_6);
		}
		// 网球准确局数 | 排球准确局数 | 羽毛球准确局数 根据赛制获取主盘列表
		else if (tpl_id == 10) {
			// 赛制 3局或5局
			let mft = match.mft == 3 ? 3 : 5;
			if ([5, 9].includes(+csid)) {
				main_handicap_list = this.clone_arr(
					play_config[`main_handicap_list_5_${mft}`]
				);
			} else {
				main_handicap_list = this.clone_arr(
					play_config[`main_handicap_list_${csid}_${mft}`]
				);
			}
		}
		// 兵乓球准确局数  根据赛制获取主盘列表
		else if (tpl_id == 15) {
			// 赛制 3局或5局
			let mft = match.mft == 5 ? 5 : 7;
			main_handicap_list = this.clone_arr(
				play_config[`main_handicap_list_${mft}`]
			);
		}
		// 斯诺克让球与大小主盘列表
		else if (tpl_id == 11 && csid == 7) {
			main_handicap_list = this.clone_arr(play_config.main_handicap_list_7);
		}
		// 美足总分单双
		else if (tpl_id == 3 && csid == 6) {
			main_handicap_list = this.clone_arr(play_config.main_handicap_list_6);
		}
		//虚拟泥地摩托车
		else if (tpl_id == 1002 && csid == 1009) {
			main_handicap_list = this.clone_arr(play_config.main_handicap_list_1009);
		}
		// 足球比分
		else if (tpl_id == 21 && csid == 1) {
			main_handicap_list = this.get_21_bold_template(match);
		}
		//  15分钟主盘口列表
		else if (tpl_id == 24 && csid == 1) {
			main_handicap_list = this.clone_arr(
				match_list_play_config.template_0.hps15Minutes
			);
			type = 4;
			this.set_min15(match, match.mst);
		}
		//  罚牌主盘口列表
		else if (tpl_id == 25 && csid == 1) {
			main_handicap_list = this.clone_arr(
				match_list_play_config.template_0.hpsPunish
			);
		}
		match.main_handicap_list = this.merge_template_data({
			match,
			handicap_list: main_handicap_list,
			type,
		});

		// 足球 让球与大小 模板
		if (csid == 1 && [0, 13].includes(+tpl_id) && !is_corner_menu) {
			// 计算角球、罚牌等其他玩法数据
			this.compute_other_play_data(match);
			// 设置赛事附加盘盘口数据
			this.set_match_add_handicap_data(match);
		}

		// 篮球让球与大小
		if (tpl_id == 7) {
			// 设置赛事附加盘盘口数据
			this.set_match_add_handicap_data(match);
		}

		// 有当前局玩法的模板  设置当前局盘口数据   沙滩排球13没有当前局
		if (has_cur_handicap_tpl_ids.includes(+tpl_id) && csid != 13) {
			// 设置赛事当前局盘口数据
			this.set_match_cur_handicap_data(match);
		}

		// 计算赛事让球方
		this.computed_team_let_ball(match);
	}
	/**
	 * @Description 计算赛事所有盘口数据--冠军玩法
	 * @param {undefined} undefined
	 */
	compute_match_all_handicap_data_champion(match) {
		// 主盘口列表
		let main_handicap_list = [];

		// 遍历主盘口数据
		lodash.each(match.hpsData, (hpsData) => {
			lodash.each(hpsData.hps, (item) => {
				let hl_obj = lodash.get(item, "hl", {});

				if (hl_obj.hid) {
					hl_obj.end_time = this.time_conversion(hl_obj.hmed);
					hl_obj.hpn = lodash.get(match.play_obj, `hid_${hl_obj.hid}.hpn`, "");
					main_handicap_list.push(hl_obj);
				}
			});
		});
		match.main_handicap_list = main_handicap_list;
		//冠军玩法不固定所以直接赋值,防止合并出错
		this.coverage_match_data({ main_handicap_list }, match.mid);
	}
	/**
	 * @Description 获取21号模板(波胆)
	 * @param {object} match 赛事信息
	 * @return {Array} template 模板
	 */
	get_21_bold_template(match) {
		let list_name = "main_handicap_list_20";
		match.tpl_id == 13 && (list_name += "_13");
		if (match.tpl_21_hpids.includes(341)) {
			list_name = list_name.replace("20", "341");
		}
		return this.clone_arr(match_list_play_config.template_21[list_name]);
	}
	/**
	 * @Description ws推送合并冠军玩法结束时间
	 * @param {undefined} undefined
	 */
	ws_set_champion_end_tine(data) {
		let hl_obj = this.hl_obj["hid_" + data.hid] || {};
		hl_obj.hmed = data.hmed;
		hl_obj.end_time = this.time_conversion(data.hmed);
	}
	/**
	 * @Description 设置赛事当前局盘口数据
	 * @param {boolean} is_ws_call 是否ws调用
	 * @param {undefined} undefined
	 */
	set_match_cur_handicap_data(match, is_ws_call) {
		// 模板玩法配置
		let play_config = match_list_play_config[`template_${match.tpl_id}`] || {};
		// 当前局盘口列表
		let cur_handicap_list = this.get_cur_handicap_list(match, play_config);
		cur_handicap_list = this.merge_template_data({
			match,
			handicap_list: cur_handicap_list,
			type: 1,
		});
		// 是否ws调用
		if (is_ws_call) {
			lodash.merge(match.cur_handicap_list, cur_handicap_list);
		} else {
			match.cur_handicap_list = cur_handicap_list;
		}
		// 设置是否显示当前局玩法
		match.is_show_cur_handicap =
			match.tpl_id == 7
				? this.get_basketball_is_show_cur_handicap(match)
				: utils.get_match_status(match.ms, [110]) == 1;
	}
	/**
	 * @Description 获取篮球是否显示当前局盘口
	 * @param {undefined} undefined
	 */
	get_basketball_is_show_cur_handicap(match) {
		if (utils.get_match_status(match.ms, [110]) == 0) {
			return false;
		}
		let is_show_cur_handicap = false;

		let mmp = match.mmp;
		// 篮球第四节(16|100) || 篮球 3*3 不显示当前局
		if (mmp == 16 || mmp == 100 || match.mle == 73) {
			is_show_cur_handicap = false;
		}
		// 篮球第二节 需要判断 当前局盘口是否关闭
		else if (mmp == 14) {
			match.cur_handicap_list.forEach((col) => {
				col.ols.forEach((ol) => {
					// 非投注项关盘
					if (ol.oid && ol._hs != 2 && ol.os != 3) {
						match.up_half_text = "-" + window.vue.i18n.t("common.up_half");
						is_show_cur_handicap = true;
					}
				});
			});
		} else {
			//第一节        刚开赛
			if (mmp == 13 || mmp == 0) {
				match.up_half_text = "-" + window.vue.i18n.t("mmp.2.13");
			}
			//第三节   第二节休息
			if (mmp == 15 || mmp == 302) {
				match.up_half_text = "-" + window.vue.i18n.t("mmp.2.15");
			}
			is_show_cur_handicap = true;
		}
		return is_show_cur_handicap;
	}
	/**
	 * @Description 获取当前局盘口列表模板
	 * @param {undefined} undefined
	 */
	get_cur_handicap_list(match, play_config) {
		// 当前局盘口列表
		let cur_handicap_list = [];

		// 篮球根据赛事阶段获取当前局盘口列表
		if (match.tpl_id == 7) {
			switch (+match.mmp) {
				case 1: //上半场
					cur_handicap_list = this.clone_arr(play_config.cur_handicap_list_up);
					break;
				case 31: //中场休息
				case 2: //下半场
					cur_handicap_list = this.clone_arr(
						play_config.cur_handicap_list_down
					);
					break;
				case 13: //第一节
					cur_handicap_list = this.clone_arr(play_config.cur_handicap_list_1);
					break;
				case 301: //第一节休息
					cur_handicap_list = this.clone_arr(
						play_config.cur_handicap_list_1_rest
					);
					break;
				case 14: //第二节
					cur_handicap_list = this.clone_arr(play_config.cur_handicap_list_2);
					break;
				case 302: //第二节休息
				case 15: //第三节
					cur_handicap_list = this.clone_arr(play_config.cur_handicap_list_3);
					break;
				case 303: //第三节休息
				case 16: //第四节
					cur_handicap_list = this.clone_arr(play_config.cur_handicap_list_4);
					break;
				default:
					cur_handicap_list = this.clone_arr(play_config.cur_handicap_list);
					break;
			}
		}
		// 斯诺克让球与大小当前局盘口列表
		else if (match.tpl_id == 11 && match.csid == 7) {
			cur_handicap_list = this.clone_arr(play_config.cur_handicap_list_7);
		}
		// 排球让球与大小当前局盘口列表
		else if (match.tpl_id == 11 && match.csid == 9) {
			cur_handicap_list = this.clone_arr(play_config.cur_handicap_list_9);
		}
		// 判断模板是否有当前局玩法
		else if (has_cur_handicap_tpl_ids.includes(+match.tpl_id)) {
			cur_handicap_list = this.clone_arr(play_config.cur_handicap_list);
		}
		return cur_handicap_list;
	}
	/**
	 * @Description 设置赛事附加盘盘口数据(获取模板数据，并与接口数据合并)
	 * @param {undefined} undefined
	 */
	set_match_add_handicap_data(match) {
		// 模板玩法配置
		let play_config = match_list_play_config[`template_${match.tpl_id}`] || {};

		// 附加盘1盘口列表
		let add1_handicap_list = this.clone_arr(play_config.add_handicap_list);
		// 附加盘2盘口列表
		let add2_handicap_list = this.clone_arr(play_config.add_handicap_list);

		match.add1_handicap_list = this.merge_template_data({
			match,
			handicap_list: add1_handicap_list,
			type: 2,
		});
		match.add2_handicap_list = this.merge_template_data({
			match,
			handicap_list: add2_handicap_list,
			type: 3,
		});
	}
	/**
	 * @Description 计算角球、罚牌等其他玩法数据 (获取角球、罚牌模板数据，并与接口数据合并)
	 * @param {undefined} undefined
	 */
	compute_other_play_data(match) {
		let { cos15Minutes, cos5Minutes, mst, mid, tpl_id } = match;
		if (cos15Minutes || cos5Minutes) {
			this.set_min15(match, mst);
		}
		this.set_tab_play_keys(match);
		//当前选中玩法
		let cur_other_play = match.play_current_key;
		let template_name = `template_${tpl_id}`;
		// 其他玩法盘口列表
		let other_handicap_list = this.clone_arr(
			match_list_play_config[template_name][cur_other_play]
		);
		// 波胆
		if (cur_other_play == "hpsBold") {
			other_handicap_list = this.get_21_bold_template(match);
		}
		//5分钟
		if (cur_other_play == "hps5Minutes") {
			other_handicap_list = this.get_5minutes_template(match);
		}

		if (!cur_other_play) {
			other_handicap_list = this.clone_arr(
				match_list_play_config[template_name].hpsCorner
			);
		}
		// 4：15分钟玩法 1：其他玩法
		let type = cur_other_play == "hps15Minutes" ? 4 : 1;
		other_handicap_list = this.merge_template_data({
			match,
			handicap_list: other_handicap_list,
			type,
			play_key: cur_other_play,
		});

		this.coverage_match_data({ other_handicap_list }, mid);
		match.other_handicap_list = other_handicap_list;
	}
	/*
  数据置顶
  */
	data_topping(data) {
		let list = [];
		let max_index = 0,
			line = 0;
		//遍历列
		lodash.each(data, (e) => {
			let hp = { sum: 0, own: [], none: [] };
			line = e.ols.length - 1;
			//遍历行
			lodash.each(e.ols, (dt, j) => {
				//other不处理
				if (line != j) {
					//1、开 2、封 3、关
					if ([1, 2].includes(dt.os) && dt._hs != 2) {
						hp.sum++;
						hp.own.push(j);
						//最大索引
						if (hp.sum > max_index) {
							max_index = hp.sum;
						}
					} else {
						hp.none.push(j);
					}
				}
			});
			list.push(hp);
		});

		//最小3行（含other）
		if (max_index < 2) max_index = 2;
		let res = [];
		lodash.each(list, (e, i) => {
			let indexes = e.own.concat(e.none);
			indexes.splice(max_index, line - max_index);
			let arr = [];
			//添加有效列
			indexes.forEach((j) => {
				arr.push(data[i].ols[j]);
			});
			//添加other
			arr.push(data[i].ols[line]);
			res.push({ ols: arr });
		});
		return res;
	}
	/**
	 * @Description 获取5分钟玩法模板
	 * @param {Object} match 赛事数据
	 * @return {Object} other_handicap_list 5分钟模板
	 */
	get_5minutes_template(match = {}) {
		let { tpl_id = 0, hSpecial5min = 6, ms = 110 } = match;
		let other_handicap_list = [];
		let hpid = utils.get_match_status(ms, [110]) ? "362" : "361";
		let tpl_name = `hps5Minutes_${hpid}`;
		let slice_index = Math.min(hSpecial5min - 1, 3);
		lodash.each(match_list_play_config[`template_${tpl_id}`][tpl_name], (col) => {
			other_handicap_list.push({ ols: col.ols.slice(slice_index) });
		});
		return this.clone_arr(other_handicap_list);
	}
	/**
	 * @Description 合并列表模板数据
	 * @param {Object} match 赛事信息
	 * @param {Object} handicap_list 模板数据
	 * @param {NUmber} type 盘口类型 1:主盘，  2：附加盘1， 3：附加盘2  4:15分钟玩法
	 * @param {String} play_key 次要玩法key
	 */
	merge_template_data({ match, handicap_list, type, play_key }) {
		let length = handicap_list.length;
		let { all_ol_data = {}, hSpecial5min } = match;
		handicap_list.forEach((col, col_index) => {
			col.ols.forEach((ol, ol_index) => {
				let handicap_type = 1;
				let { hn, _hpid, ot } = ol;
				if (type == 4) {
					handicap_type = this.get_min15_handicap_type(
						length,
						match.hSpecial,
						col_index
					);
					//22号模板 足球-独赢 让球胜平负 附加盘 合并到主盘   hn = 2 | 3 附加盘编号
				} else if (hn) {
					handicap_type = hn;
				} else {
					handicap_type = type;
				}
				let ol_data =
					all_ol_data[`${match.mid}_${_hpid}_${handicap_type}_${ot}`];
				if (ol_data) {
					//附加盘1
					if (type == 2) {
						match.has_add1 = true;
					}
					//附加盘2
					if (type == 3) {
						match.has_add2 = true;
					}
					Object.assign(col.ols[ol_index], ol_data);
				}
			});
		});
		// 波胆置顶
		if ("hpsBold" == play_key) {
			handicap_list = this.data_topping(handicap_list);
		}
		// 滚球-下一个进球玩法，后边的依次往前移动
		if ("hps5Minutes" == play_key && hSpecial5min == 5) {
			handicap_list = this.data_move_up(handicap_list);
		}
		return handicap_list;
	}
	/**
	 * @Description 滚球-75-85分钟时，把顶上空的那一行移动到最下边
	 * @param {Array} arr 原数据列表
	 */
	data_move_up(list) {
		for (let i = 0; i < 4; i++) {
			let ols = lodash.get(list, `${i}.ols`) || [];
			let [ol] = ols.splice(0, 1);
			ol.os = 3;
			if ([0, 2].includes(i)) {
				Object.assign(ol, { other_class: "col1.5 row2" });
			}
			ols.push(ol);
		}
		return list;
	}
	/**
	 * @Description 获取6列 十五分钟玩法 handicap_type 值
	 * @param {Number} hSpecial 赛事阶段
	 * @param {Number} col_index 盘口列位置
	 * @return {handicap_type} handicap_type 值
	 */
	get_min15_handicap_type(length, hSpecial, col_index) {
		let handicap_type;
		let index = this.get_phase(col_index);
		if (length > 6) {
			handicap_type = this.get_min15_col13_handicap_type(hSpecial, index);
		} else {
			handicap_type = this.get_min15_col6_handicap_type(hSpecial, index);
		}
		return handicap_type;
	}
	/**
	 * @Description 获取盘口列位置
	 * @param {Number} col_index  当前列索引
	 * @return {Number} index  位置索引值 (0 = 1-3盘口列位置  1 = 4-6盘口列位置 2 = 7-9盘口列位置 3 = 10-13盘口列位置)
	 */
	get_phase(col_index) {
		let index = 0;
		if (col_index > 8) {
			index = 3;
		} else if (col_index > 5) {
			index = 2;
		} else if (col_index > 2) {
			index = 1;
		}
		return index;
	}
	/**
	 * @Description 获取6列 十五分钟玩法 handicap_type 值
	 * @param {Number} hSpecial 赛事阶段
	 * @param {Number} index 盘口列位置
	 * @return {handicap_type} handicap_type 值
	 */
	get_min15_col6_handicap_type(hSpecial, index) {
		let handicap_type = hSpecial;
		if (index == 0) {
			//跳过第三阶段
			if (hSpecial == 3) {
				handicap_type = hSpecial + 1;
			}
		} else if (index == 1) {
			handicap_type = hSpecial + 1;
			//跳过第三阶段
			if ([2, 3].includes(hSpecial)) {
				handicap_type = hSpecial + 2;
			}
		}
		return handicap_type;
	}
	/**
	 * @Description 获取13列 十五分钟玩法 handicap_type 值
	 * @param {Number} hSpecial 赛事阶段
	 * @param {Number} index 盘口列位置
	 * @return {handicap_type} handicap_type 值
	 */
	get_min15_col13_handicap_type(hSpecial, index) {
		let handicap_type;
		switch (hSpecial) {
			case 1:
				handicap_type = hSpecial + index;
				break;
			case 2:
				if (index > 0) {
					handicap_type = hSpecial + index + 1;
				} else {
					handicap_type = hSpecial + index;
				}
				break;
			case 3:
				handicap_type = hSpecial + index + 1;
				break;
			case 4:
			case 5:
				handicap_type = hSpecial + index;
				break;

			default:
				handicap_type = hSpecial;
				break;
		}
		return handicap_type;
	}
	/**
	 * @Description 获取五分钟玩法阶段状态
	 * @param {Object} match 赛事信息
	 * @param {Number} mst 赛事进行时间
	 */
	get_min5_state(match, mst) {
		// 5分钟状态处理
		let hSpecial5min = 1;
		// 15分钟时，第4个投注项16-20会停止，此时第一排投注项全空，以此类推
		if (mst < 900) {
			hSpecial5min = 1;
		} else if (mst < 2100) {
			hSpecial5min = 2;
		} else if (
			mst < 3300 ||
			match.mmp == 6 ||
			match.mmp == 41 ||
			match.mmp == 31
		) {
			// 如果是上半场或者上半场加时或者半场休息
			hSpecial5min = 3;
		} else if (mst < 4500) {
			hSpecial5min = 4;
		} else if (mst < 5100) {
			hSpecial5min = 5; // 75-85分钟，只剩2个或1个投注项，需要上移
		} else {
			// 超过85分钟，所有玩法关闭
			hSpecial5min = 6;
		}
		return {
			hSpecial5min,
		};
	}
	/**
	 * @Description 设置十五分钟玩法阶段
	 * @param {Object} match 赛事信息
	 * @param {Number} mst 赛事进行时间
	 * @param {Function} callback 回调 重新拉取赛事信息
	 */
	set_min15(match, mst, callback) {
		// 如果未开赛
		if (utils.get_match_status(match.ms, [110]) === 0) {
			return;
		}
		// 自定义赛事阶段
		let hSpecial;
		// mst 小于900 特1 小于1800 特二 小于2700 特三 小于3600 特4 小于4500 特5 否则是特6
		if (mst < 900) {
			hSpecial = 1;
		} else if (mst < 1800) {
			hSpecial = 2;
		} else if (mst < 2700 || match.mmp == 6 || match.mmp == 41) {
			// 如果是上半场或者上半场加时 15分钟阶段显示特3
			hSpecial = 3;
		} else if (mst < 3600 || match.mmp == 31) {
			hSpecial = 4;
		} else if (mst < 4500) {
			hSpecial = 5;
		} else {
			hSpecial = 6;
		}

		const { hSpecial5min } = this.get_min5_state(match, mst);
		// 如果默认阶段和接口数据返回的hSpecial不一致 重新调用接口获取 //5分钟玩法比赛时间大于85分钟并且是下半场
		if (
			(hSpecial !== match.hSpecial || hSpecial5min !== match.hSpecial5min) &&
			callback
		) {
			callback();
		}
		Object.assign(match, { hSpecial, hSpecial5min });
	}
	/**
	 * @Description 设置其他玩法tab标题
	 * @param {object} match 赛事对象
	 */
	set_tab_play_keys(match) {
		let tab_play_keys = [];
		let play_keys = Object.keys(other_play_name_to_playid);
		lodash.each(play_keys, (key) => {
			let status_key = "cos" + key.slice(3);
			let status = match[status_key];
			//15分钟次要玩法前端强制关闭
			let cos15min_status = !(
				status_key === "cos15Minutes" && match.hSpecial == 6
			);
			//5分钟次要玩法前端强制关闭状态
			let cos5min_status = !(
				status_key === "cos5Minutes" && match.hSpecial5min == 6
			);
			if (status && cos15min_status && cos5min_status) {
				tab_play_keys.push(key);
			}
		});
		match.tab_play_keys = tab_play_keys.join(",");
		// 是否有其他玩法
		match.has_other_play = tab_play_keys.length > 0;
		// 当前选中的其他的玩法
		let cur_other_play =
			this.other_play_current_play["mid_" + match.mid] || tab_play_keys[0];
		//玩法关闭时选择第一个
		if (!tab_play_keys.includes(cur_other_play)) {
			cur_other_play = tab_play_keys[0];
		}
		// 设置其他玩法选中索引
		this.set_match_play_current_index(match, cur_other_play);
	}
	/**
	 * @Description 切换其他玩法
	 * @param {string} mid 赛事id
	 */
	switch_other_play(mid, play_key) {
		let match = this.mid_obj["mid_" + mid] || {};
		this.set_match_play_current_index(match, play_key);
		let { tpl_id } = match;
		let template_name = `template_${tpl_id}`;
		let other_handicap_list = this.clone_arr(
			match_list_play_config[template_name][play_key]
		);
		if (play_key === "hpsBold") {
			other_handicap_list = this.get_21_bold_template(match);
			match = {};
		}
		if (play_key === "hps5Minutes") {
			other_handicap_list = this.get_5minutes_template({ tpl_id });
			match = {};
		}
		let type = play_key == "hps15Minutes" ? 4 : 1;
		other_handicap_list = this.merge_template_data({
			match,
			handicap_list: other_handicap_list,
			type,
			play_key,
		});
		this.coverage_match_data({ other_handicap_list }, mid);
		window.vue.useMittEmit(window.vue.MITT_TYPES.EMIT_API_BYMIDS, {
			mids: [mid],
		});
	}
	/**
	 * @Description 设置其他玩法选中索引    更新玩法模板及数据
	 * @param {undefined} undefined
	 */
	set_match_play_current_index(match, play_key) {
		let tab_play_keys = match.tab_play_keys.split(",");
		// 设置选中的玩法索引
		match.play_current_index = tab_play_keys.findIndex(
			(key) => key == play_key
		);
		// 设置选中的玩法key
		match.play_current_key = play_key;
		// 保存当前选中的玩法
		this.other_play_current_play["mid_" + match.mid] = play_key;
	}
	/**
	 * @Description 获取其他玩法请求参数
	 * @param {array} mids 赛事ID数组
	 */
	get_tab_param_build(mids) {
		let tabs = [];
		mids.forEach((mid) => {
			let match = this.mid_obj["mid_" + mid] || {};
			// 有其他玩法
			if (match.has_other_play) {
				// 添加玩法ID
				tabs.push({
					mid,
					playId:
						other_play_name_to_playid[
							this.other_play_current_play["mid_" + mid]
						],
				});
			}
		});
		return tabs;
	}
	/**
	 * @Description 计算投注项数据
	 * @param {Object} hl_data 盘口对象
	 * @param {object} match 赛事对象
	 * @param {number} handicap_type 盘口类型 1:主盘，  2：附加盘1， 3：附加盘2   (特殊 15分钟玩法是取阶段保存)
	 */
	compute_ol_data(hl_data, match, handicap_type) {
		// 遍历盘口 所有投注项
		lodash.each(hl_data.ol, (ol) => {
			// 投注项坑位值
			let hn = `${match.mid}_${hl_data.chpid}_${handicap_type}_${ol.ot}`;
			// 投注项坑位旧值
			let old_hn = `${match.mid}_${hl_data._hpid}_${handicap_type}_${ol.ot}`;
			// 赛事级开盘状态
			ol._mhs = match.mhs;
			// 盘口级 开盘状态
			ol._hs = hl_data.hs;
			// 盘口ID
			ol._hid = hl_data.hid;
			// 玩法ID
			ol._hpid = hl_data._hpid;
			// 是否支持串关 1:支持串关 0: 不支持串关
			ol._hipo = hl_data.hipo;
			// 赛事ID
			ol._mid = match.mid;
			// 球种ID
			ol.csid = match.csid;
			//内嵌简化盘口文本
			if (utils.is_iframe) {
				ol.onb = this.disk_text_replace(
					JSON.parse(localStorage.getItem("get_lang")),
					lodash.get(ol, "onb", "")
				);
			}
			//简化盘口文本
			if (match.tpl_id == 22 && String(ol.onb).endsWith(".0")) {
				ol.onb = ol.onb.replace(".0", "");
			}
			// 简化盘口文本
			if (match.tpl_id == 13) {
				ol.onb = ol.onb
					.replace("Không có bàn thắng", "- 0 BT")
					.replace("ไม่มีเป้าหมาย", "ไม่ได้ประตู");
			}
			// 支持的盘口类型
			if (hl_data.hSpecial) {
				ol._hsw = lodash.get(
					match.play_obj,
					`hpid_${hl_data._hpid}_${hl_data.hSpecial}.hsw`,
					""
				);
			} else {
				ol._hsw = lodash.get(match.play_obj, `hpid_${hl_data._hpid}.hsw`, "");
			}

			// 盘口是否高亮
			ol.handicap_highlight = handicap_highlight_paly_id.includes(
				+hl_data._hpid
			);

			// 判断盘口是否有坑位  设置投注项坑位值
			if (hl_data.hn) {
				ol._hn = hn;
			}
			match.all_ol_data[old_hn] = ol;
			match.all_oid_arr.push(ol.oid);
		});
	}
	/**
	 * @Description 简化盘口文本
	 * @param {string} lang 语言
	 * @param {string} onb 盘口文本
	 * @return  {string} text 盘口文本
	 */
	disk_text_replace(lang, onb) {
		let text = "";
		if (onb) {
			switch (lang) {
				case "en":
				case "ad":
				case "ms":
					text = onb
						.replace("Home", "H")
						.replace("Away", "A")
						.replace("Draw", "D");
					break;
				case "vi":
					text = onb
						.replace("Chủ", "C")
						.replace("Khách", "K")
						.replace("Hòa", "H");
					break;
				case "th":
					text = onb
						.replace("เจ้าบ้าน", "H")
						.replace("แขก", "A")
						.replace("วาด", "D");
					break;
				case "zh":
				case "tw":
					text = onb.replace("胜", "").replace("局", "").replace("勝", "");
					break;

				default:
					text = onb;
					break;
			}
		}
		return text;
	}
	/**
	 * @Description 设置this.ol_obj
	 * @param {array} match_list 赛事集合
	 */
	set_match_ol_obj(match_list) {
		match_list.forEach((_match) => {
			let match = this.mid_obj["mid_" + _match.mid];
			// 所有盘口数据的key
			let all_hl_key = [
				"main_handicap_list",
				"add1_handicap_list",
				"add2_handicap_list",
				"cur_handicap_list",
				"other_handicap_list",
			];
			all_hl_key.forEach((hl_key) => {
				// 遍历所有盘口数据
				lodash.each(match[hl_key], (hl_data) => {
					// 冠军玩法设置hl_obj对象
					if (match.tpl_id == 18 && hl_data.hid) {
						this.hl_obj["hid_" + hl_data.hid] = hl_data;
					}
					let ols = (match.tpl_id == 18 ? hl_data.ol : hl_data.ols) || [];
					// 遍历所有投注项数据
					ols.forEach((ol) => {
						if (ol.oid) {
							// 遍历出来的投注项数据 给this.ol_objj赋值
							this.ol_obj["oid_" + ol.oid] = ol;

							// 如果有坑位  设置坑位对象
							if (ol._hn) {
								this.hn_obj[ol._hn] = ol;
							}
						}
					});
				});
			});
		});
	}
	/**
	 * @Description 修改赛事级别状态变化
	 * @param {Number} mid 赛事mid
	 * @param {Number} mhs  赛事级别状态
	 */
	set_match_mhs_status(mid, mhs) {
		let match = this.mid_obj["mid_" + mid] || {};
		match.mhs = mhs;
		let all_hids = match.all_hids.split(",");
		// 遍历赛事所有盘口ID
		all_hids.forEach((hid) => {
			let hl_obj = this.hl_obj["hid_" + hid] || {};
			hl_obj._mhs = mhs;
			// 遍历盘口的所有投注项
			lodash.each(hl_obj.ol, (ol) => {
				let ol_obj = this.ol_obj["oid_" + ol.oid] || {};
				ol_obj._mhs = mhs;
			});
		});
	}
	/**
	 * @Description 修改盘口级别状态变化
	 * @param {String,Number} hid 盘口编号
	 * @param {Number} hs 盘口状态
	 */
	set_match_hs_status(hid, hs) {
		let hl_obj = this.hl_obj["hid_" + hid] || {};
		hl_obj.hs = hs;
		// 遍历盘口的所有投注项
		lodash.each(hl_obj.ol, (ol) => {
			let ol_obj = this.ol_obj["oid_" + ol.oid] || {};
			ol_obj._hs = hs;
		});
	}
	/**
	 * @Description 盘口类型设置
	 * @param {number} hid
	 * @param {any} hmt
	 */
	set_match_hmt(hid, hmt) {
		let hl_data = this.hl_obj["hid_" + hid] || {};
		hl_data.hmt = hmt;
	}
	/**
	 * @Description 合并投注项数据
	 * @param {object} ol
	 */
	merge_ol_data(ol) {
		let ol_obj = this.ol_obj["oid_" + ol.oid] || {};
		Object.assign(ol_obj, ol);
	}
	/**
	 * @Description 获取盘口下所有投注项 是否关盘
	 * @param {number} hid
	 */
	get_handicap_ol_is_all_close(hid) {
		let all_close = true;
		let hl_obj = this.hl_obj["hid_" + hid] || {};
		lodash.each(hl_obj.ol, (ol) => {
			// os=3关盘
			if (ol.os != 3) {
				all_close = false;
			}
		});
		return all_close;
	}
	/**
	 * @Description 计算玩法数据
	 * @param {object} match 赛事对象
	 */
	compute_play_data(match) {
		// 玩法对象临时变量
		let play_obj = {};
		// 遍历所有玩法
		lodash.each(match.hpsPns, (hps) => {
			if (match.tpl_id == 18) {
				hps.hsw = "1,3,4,5,6";
				// 冠军用盘口ID保存玩法数据
				play_obj["hid_" + hps.hid] = hps;
			} else if (hps.hSpecial) {
				// 15分钟玩法用玩法ID+阶段保存玩法数据
				play_obj[`hpid_${hps.hpid}_${hps.hSpecial}`] = hps;
			} else {
				// 非冠军用玩法ID保存玩法数据
				play_obj["hpid_" + hps.hpid] = hps;
			}
		});
		match.play_obj = play_obj;
	}
	/**
	 * @Description 设置赛事比分
	 * @param {object} match 赛事对象
	 */
	set_match_score(match) {
		// 未开赛不用设置比分
		if (utils.get_match_status(match.ms, [110]) == 0) {
			return;
		}
		let score_obj = utils.serialized_score(lodash.get(match, "msc", []), true);
		match.score_obj = score_obj;
		this.coverage_match_data({ score_obj }, match.mid);
		// 设置主比分
		this.set_main_score(match);
		// 设置历史比分列表
		this.set_history_score_list(match);
	}
	/**
	 * @Description ws推送更新比分
	 * @param {object} ws_data ws推送过来的数据
	 */
	ws_update_score(ws_data) {
		let match = this.mid_obj["mid_" + lodash.get(ws_data, "cd.mid")];
		// 未开赛不用设置比分
		if (!match || utils.get_match_status(match.ms, [110]) == 0) {
			return;
		}
		// 如果是ws推送的时间戳比接口更新时间小说明不是最新的推送数据不进行更新处理
		if (ws_data.ctsp < match.api_update_time) {
			return;
		}
		let score_obj = utils.serialized_score(lodash.get(ws_data, "cd.msc", []));
		// 合并比分对象
		lodash.merge(match.score_obj, score_obj);
		// 设置主比分
		this.set_main_score(match);
		// 设置历史比分列表
		this.set_history_score_list(match);
		match.ws_update_time = ws_data.ctsp;
	}
	/**
	 * @description 设置主比分 比分变化 或者 赛事阶段变化时调用
	 * @param  {object} match  当场赛事信息
	 */
	set_main_score(match) {
		let key = "S1";
		let { csid, mmp, score_obj = {} } = match;

		// 足球 | 手球
		if ([1, 11].includes(+csid)) {
			// S7:加时赛比分
			if ([32, 33, 41, 42, 110].includes(+mmp)) {
				key = "S7";
			}
			// S170:点球大战比分
			else if ([34, 50, 120].includes(+mmp)) {
				key = "S170";
			}
		}
		Object.assign(match, {
			// 主队比分
			home_score: lodash.get(score_obj, `${key}.home`, "0"),
			// 客队比分
			away_score: lodash.get(score_obj, `${key}.away`, "0"),
		});
	}
	/**
	 * @description 设置历史比分列表
	 * @param  {object} match  当场赛事信息
	 */
	set_history_score_list(match) {
		let csid = Number(match.csid);

		// 比分列表
		let score_list = [];
		// 需显示的比分集
		let score_dict = history_score_dict[`csid_${csid}`] || [];
		// 篮球半场
		if (csid == 2 && match.mle == 17) {
			score_dict = history_score_dict.csid_2_half;
		}

		// 赛事阶段对应的 比分 key
		let cur_score_key = lodash.get(
			match_state_convert_score_dict,
			`csid_${csid}.mmp_${match.mmp}`
		);
		// 斯诺克根据第几局获取比分key
		if (csid == 7) {
			cur_score_key = lodash.get(
				match_state_convert_score_dict,
				`csid_${csid}.${match.mct}`
			);
		}

		// 主队总分
		let total_home = 0;
		// 客队总分
		let total_away = 0;

		// 是否有S120 比分
		let has_s120 = false;
		// 是否有S121 比分
		let has_s121 = false;
		// 遍历需显示比分集
		score_dict.forEach((key) => {
			let cur_score = match.score_obj[key];
			// 接口有返回对应比分
			if (cur_score) {
				if (key == "S120") {
					has_s120 = true;
				} else if (key == "S121") {
					has_s121 = true;
				}
				score_list.push(cur_score);
				// 总分累加
				total_home += Number(cur_score.home);
				total_away += Number(cur_score.away);
			} else if (key == cur_score_key) {
				if (key == "S120") {
					has_s120 = true;
				} else if (key == "S121") {
					has_s121 = true;
				}
				// 当前局服务器没有返回默认为 0-0
				score_list.push({
					home: 0,
					away: 0,
				});
			}
		});

		// 如果是排球 并且有第二局比分  并且没有第一局比分 则给第一局比分设置空比分
		if (match.csid == 9 && has_s121 && !has_s120) {
			score_list.unshift({
				home: "",
				away: "",
			});
		}

		// 设置当前局比分
		//篮球有半场玩法第二节设置上半场比分未当前局比分
		if (match.csid == 2 && match.mmp == 14 && match.up_half_text) {
			match.cur_score = lodash.get(match, "score_obj.S2", { home: "", away: "" });
		} else {
			match.cur_score = lodash.last(score_list) || { home: 0, away: 0 };
		}
		match.score_list = score_list;
		this.coverage_match_data({ score_list }, match.mid);
		// 设置总分
		match.total_score_str = `${total_home}-${total_away}(${
			total_home + total_away
		})`;
	}
	/**
	 * @Description 覆盖赛事数据
	 * @param {Object} data_obj 覆盖对象
	 * @param {String} mid 赛事id
	 */
	coverage_match_data(data_obj, mid) {
		let match = this.mid_obj[`mid_${mid}`];
		if (match) Object.assign(match, data_obj);
	}
	/**
	 * @Description 删除赛事数据
	 * @param {number} mid 删除赛事id
	 */
	remove_match_data(mid) {
		let match = this.mid_obj[`mid_${mid}`];
		if (match) {
			let all_hids = match.all_hids.split(",");
			// 遍历赛事所有盘口ID
			all_hids.forEach((hid) => {
				// 遍历盘口的所有投注项
				let hl_obj = this.hl_obj["hid_" + hid] || {};
				lodash.each(hl_obj.ol, (ol) => {
					delete this.ol_obj["oid_" + ol.oid];
					if (ol._hn) {
						delete this.hn_obj[ol._hn];
					}
				});
				delete this.hl_obj["hid_" + hid];
			});
			delete this.mid_obj[`mid_${mid}`];
		}
	}
	/**
	 * @Description 时间戳转中文时间
	 * @param {number} timestap 时间戳
	 */
	time_conversion(timestap) {
		if (timestap) {
			// 获取时间年月日
			let time = new Date(parseInt(timestap));
			let y = time.getFullYear();
			let m = String(time.getMonth() + 1).padStart(2, 0);
			let d = String(time.getDate()).padStart(2, 0);
			let h = String(time.getHours()).padStart(2, 0);
			let mm = String(time.getMinutes()).padStart(2, 0);
			// 根据国际化转换时间
			return window.vue.$root
				.$t("time.time_date_4")
				.replace("yy", y)
				.replace("mm", m)
				.replace("dd", d)
				.replace("hh", h)
				.replace("ii", mm);
		} else {
			return "";
		}
	}
	/**
	 * @Description 获取赛事模板ID
	 * @param {number} csid 球种类型
	 */
	get_match_template_id({ csid }) {
		let tpl_id = $menu.menu_data.match_tpl_number;
		// 虚拟足球1001、虚拟篮球1004
		if ([1001, 1004].includes(+csid)) {
			tpl_id = csid;
		}
		// 虚拟赛狗1002 虚拟摩托1010 虚拟赛马1011 泥地摩托车1009
		else if ([1002, 1010, 1011, 1009].includes(+csid)) {
			tpl_id = 1002;
		}
		// 99模板根据球种获取模板ID
		else if (tpl_id == -1) {
			tpl_id = utils.csid_to_tpl_id(csid);
		}
		return tpl_id;
	}
	/**
	 * @Description 设置联赛列表对象
	 * @param {object} league_list_obj
	 */
	set_league_list_obj(league_list_obj) {
		this.league_list_obj = league_list_obj;
	}
	/**
	 * @Description 获取前12场展开的赛事mid
	 * @returns {array} mids 前12场赛事id
	 */
	get_first_unfold_mids() {
		let mids = [];
		// 展开的赛事数量计数  用于计数首次加载列表 只展开前12场赛事
		let unfold_match_count = 0;
		// 遍历所有赛事数据
		let match_status_type_arr = ["livedata", "nolivedata"];
		match_status_type_arr.forEach((match_status_type) => {
			// 遍历联赛列表
			let league_list = lodash.get(this.league_list_obj, match_status_type, []);
			league_list.forEach((league_obj) => {
				// 赛事计数大于12 不执行
				if (unfold_match_count >= 12) {
					return;
				}
				// 赛事ID数组
				let mids_arr = league_obj.mids.split(",");
				mids_arr.forEach((mid) => {
					unfold_match_count++;
					mids.push(mid);
				});
			});
		});
		return mids;
	}
	/**
	 * @Description ws推送合并单个赛事 指定数据
	 * @param {object} ws_data ws推送的数据
	 * @param {array} merge_keys 要合并数据的key值
	 * @returns {boolean} 合并状态
	 */
	ws_merge_match(ws_data, merge_keys) {
		let merge_state = false;
		let match = this.mid_obj["mid_" + lodash.get(ws_data, "cd.mid")];
		if (!match) {
			return merge_state;
		}
		// 如果是ws推送的时间戳比接口更新时间小说明不是最新的推送数据不进行更新处理
		if (ws_data.ctsp < match.api_update_time) {
			return merge_state;
		}
		let data = {};
		// 循环判断要合并的数据 是否有设置，如果有设置就合并数据
		merge_keys.forEach((key) => {
			if (ws_data.cd.hasOwnProperty(key)) {
				data[key] = ws_data.cd[key];
				merge_state = true;
			}
		});
		lodash.merge(match, data);
		match.ws_update_time = ws_data.ctsp;
		return merge_state;
	}
	/**
	 * @Description 克隆数组
	 * @param {array} arr 需要克隆的数值
	 */
	clone_arr(arr) {
		let new_arr = [];
		lodash.merge(new_arr, arr || []);
		return new_arr;
	}
	/**
	 * 计算队伍中的让球方
	 * @param {object} match 赛事对象
	 */
	computed_team_let_ball(match) {
		if (!let_ball_play_tpl.includes(+match.tpl_id)) return;
		let team_let_ball = "";
		let other_team_let_ball = "";
		// 让球玩法ID
		let let_ball_play_id = lodash.get(match, "main_handicap_list.1.ols.1._hpid");
		//常规玩法让球方
		team_let_ball = this.get_team_let_ball(match, let_ball_play_id);
		//足球特殊玩法
		if (match.csid == 1 && (match.cosCorner || match.cosPunish)) {
			let other_hpid = lodash.get(match, "other_handicap_list.1.ols.1._hpid");
			other_team_let_ball = this.get_team_let_ball(match, other_hpid);
		}
		//当前局玩法
		if (match.is_show_cur_handicap) {
			let other_hpid = lodash.get(match, "cur_handicap_list.1.ols.1._hpid");
			//网球
			if (match.csid == 5) {
				other_hpid = lodash.get(match, "cur_handicap_list.2.ols.1._hpid");
			}
			other_team_let_ball = this.get_team_let_ball(match, other_hpid);
		}
		//主盘让球方
		match.team_let_ball = team_let_ball;
		//足球罚牌角球 | 篮球等当前局
		match.other_team_let_ball = other_team_let_ball;
	}
	/**
	 * 获取队伍中的让球方
	 * @param {Object} match   赛事详情数据
	 * @param {string} play_id  玩法id
	 * @returns {string}   让球方(T1|T2|'')
	 */
	get_team_let_ball(match, play_id) {
		let team_let_ball = "";
		if (play_id) {
			lodash.each(
				[`${match.mid}_${play_id}_1_1`, `${match.mid}_${play_id}_1_2`],
				(hn) => {
					let ol_data = match.all_ol_data[hn] || {};
					if (ol_data.on && ol_data.on.trim().startsWith("-")) {
						team_let_ball = ol_data.ots;
					}
				}
			);
		}
		return team_let_ball;
	}
	/**
	 * @Description 重新计算球种数量
	 * @param {number} remove_mid 赛事id
	 */
	compute_sport_count(remove_mid) {
		// 球种赛事数量
		let sport_match_count = lodash.cloneDeep(sport_match_count_template);
		let csid = lodash.get(this.mid_obj["mid_" + remove_mid], "csid");
		if (csid) {
			sport_match_count["csid_" + csid] = { count: 0 };
		}
		this.match_list.forEach((match) => {
			// 统计球种赛事数量
			sport_match_count["csid_" + match.csid] = sport_match_count[
				"csid_" + match.csid
			] || { count: 0 };
			sport_match_count["csid_" + match.csid].count++;
		});
		// 合并球种数量
		lodash.merge(this.sport_match_count, sport_match_count);
		// 计算滚球全部菜单数量
		$menu.compute_play_all_menu_count(sport_match_count);
		// 该赛种 已全部移除
		if (
			sport_match_count["csid_" + csid] &&
			sport_match_count["csid_" + csid].count === 0
		) {
			$menu.set_play_sport_count(csid);
		}
	}
	/**
	 * @Description 设置联赛收藏状态
	 * @param {number} tid 联赛id
	 * @param {number|boolean} status 收藏状态
	 * @param {number|boolean} is_league_list 是否联赛列表类型
	 */
	set_league_list_collect(tid, status, is_league_list) {
		if (is_league_list) {
			let match_status_types = ["livedata", "nolivedata"];
			lodash.each(match_status_types, (type) => {
				// 遍历联赛列表
				let league_list = lodash.get(this.league_list_obj, type, []);
				lodash.each(league_list, (league) => {
					if (league.tid === tid) {
						league.tf = status;
						return;
					}
				});
			});
		} else {
			lodash.each(this.match_list, (match_item) => {
				if (match_item.tid == tid) {
					match_item.tf = status;
					match_item.mf = status;
				}
			});
		}
	}
}

export default new MatchListDataClass();
