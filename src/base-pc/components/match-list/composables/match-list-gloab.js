import { ref } from "vue";
import { PageSourceData,MatchDetailCalss  } from "src/output/index.js";
import ZHUGE from 'src/core/http/zhuge-tag.js'
import NewMenu from "src/core/menu-pc/menu-data-class.js";
import details from "src/core/match-list-pc/details-class/details.js";
import UserCtr from 'src/core/user-config/user-ctr.js'
import { api_details, api_common } from "src/api/index";

const page_source = PageSourceData;

function get_full_sr_url(match) {
	return details.get_full_sr_url(match);
};
// sr 分析数据点击跳转
const sr_click_handle = (match, type) => {
	if (type == "details") {
		// 发送埋点事件
		ZHUGE.send_zhuge_event("PC_情报分析");
	} else if (type == 1) {
		ZHUGE.send_zhuge_event("PC_热门推荐_赛事分析点击");
	}
	details.sr_click_handle(match);
};
/**
 * 格式化选择的联赛
 * @return {string} 以 , 号分隔的联赛ID
 */
const mx_filter_select_ids = () => {
	return this.vx_filter_select_obj.join(",");
};

/**
 * 设置赛事列表/详情选中赛事
 * @param  {number} remove_mid - 被移除赛事的ID
 * @return {undefined} undefined
 */
const mx_autoset_active_match = (params = { mid: 0 }) => {
	let { name: route_name, params: cur_params } = route;
	let return_status =
		(route_name === "video" && [3, 4, 5].includes(+cur_params.play_type)) ||
		(route_name === "details" &&
			["studio", "topic", "anchor"].includes(this.vx_play_media.media_type)) ||
		NewMenu.is_esports();
	// 电竞不用调自动切右侧接口
	if (return_status) {
		return;
	}
	/** 非冠军联赛筛选 不调用右侧切换接口 ***********************/
	// 模板 ID
	let match_tpl_number = NewMenu.get_match_tpl_number();
	//非 冠军
	if (match_tpl_number == 18) {
		let tid = mx_filter_select_ids();
		// 是联赛筛选
		if (tid) {
			return false;
		}
	}
	details.auto_swich_match = true;
	let { mid: remove_mid, tid } = params;
	// 查找参数:1赛事列表，2现场滚球盘，3赛事筛选，4赛事搜索，如果不传，默认赛事列表
	let sm = 1;
	// 当前页面为详情 && 菜单节点为 滚球
	if (page_source.page_source == "details" && MenuData.cur_menu_type.type_name == "play") {
		sm = 2;
		// 当前页面为详情 || 来源页面为详情
	} else if (page_source.page_source == "search" || page_source.from_page_source == "search") {
		sm = 4;
	} else if (mx_filter_select_ids()) {
		sm = 3;
	}
	let csid = 0;
	if (page_source.page_source == "details") {
		let { tid: _tid, csid: _csid } = route.params;
		if (_tid) {
			tid = _tid;
			csid = _csid;
		} else {
			tid = MatchDetailCalss.params.tid;
			csid = MatchDetailCalss.params.csid;
		}
	} else {
		tid = mx_filter_select_ids() || MatchDetailCalss.params.tid;
		csid = MatchDetailCalss.params.csid;
	}
	let params_1 =
		_.get(NewMenu, "match_list_api_config.match_list.params") || {};
	let md = "";
	if (["early"].includes(MenuData.cur_menu_type.type_name)) {
		md = params_1.md;
	}
	/** 自动选择 */
	let _params = {
		sm,
		euid: params_1.euid,
		md,
		csid,
		tid,
		sort: 1,
		keyword: '这是测试的关键字！！！！！'.substr(5),
		cuid: UserCtr.get_uid(),
		mid: remove_mid,
	};
	// 如果是聚合冠军页面
	if (MenuData.cur_menu_type.type_name == "winner_top") {
		_params.euid = "";
		delete _params.tid;
		delete _params.keyword;
		delete _params.md;
		delete _params.mid;
	}
	// 获得当前的模板ID
	let orpt = NewMenu.get_match_tpl_number();
	if (orpt) {
		_params.orpt = orpt;
	}
	let latest_match_params_cur = JSON.stringify({
		..._params,
		time: Date.now(),
	});
	// 防止同一请求连续多次发送
	if (latest_match_params_cur != this.latest_match_params_pre) {
		this.latest_match_params_pre = latest_match_params_cur;
		let api =
			cur_page == "details"
				? api_common.get_detail_video(_params)
				: api_details.post_fetch_list_latest_match(_params);
		api.then(({ data }) => {
			if (!details.auto_swich_match) return;
			let { mid = -1, csid: sportId, tid } = _.get(data, "data") || {};
			// 详情时重载页面
			if (cur_page == "details" || cur_page == "video") {
				if (mid && mid != -1) {
					if (cur_page == "details") {
						router.push({
							name: "details",
							params: {
								mid,
								tid,
								csid: sportId,
							},
						});
					}
					// 大视频页面 切换一场有视频的赛事
					else if (cur_page == "video") {
						video.match_close(null,router);
					}
				} else {
					if (_.isFunction(this.back_to)) {
						this.back_to(false);
					}
				}
				return;
			}
			// 切换右侧赛事
			let playId = MatchDetailCalss.params.play_id;
			  MatchDetailCalss.set_match_details_params({
				mid,
				tid,
				sportId,
				playId,
				media_type: "auto",
			});
		});
	}
};

const gloab_composable_fn = () => {
  return {
    // sr 分析数据点击跳转
    sr_click_handle,
	get_full_sr_url,
	mx_autoset_active_match
  }
}

export default gloab_composable_fn