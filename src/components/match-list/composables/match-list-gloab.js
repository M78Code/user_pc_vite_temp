import { ref } from "vue";
import pageSourceData from "src/core/page-source-pc/page-source-pc.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import NewMenu from "src/core/menu-pc/menu-data-class.js";
const latest_match_params_pre = ref("");
const default_select_all = ref(true);
const get_full_sr_url = (match) => {
	return details.get_full_sr_url(match);
};
// sr 分析数据点击跳转
const sr_click_handle = (match, type) => {
	if (type == "details") {
		// 发送埋点事件
		this.$utils.send_zhuge_event("PC_情报分析");
	} else if (type == 1) {
		this.$utils.send_zhuge_event("PC_热门推荐_赛事分析点击");
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
	let { name: route_name, params: cur_parmas } = this.$route;
	let return_status =
		(route_name === "video" && [3, 4, 5].includes(+cur_parmas.play_type)) ||
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
	let { cur: cur_page, from: from_page } = this.vx_layout_cur_page;
	// 查找参数:1赛事列表，2现场滚球盘，3赛事筛选，4赛事搜索，如果不传，默认赛事列表
	let sm = 1;
	if (cur_page == "details" && this.vx_cur_menu_type.type_name == "play") {
		sm = 2;
	} else if (cur_page == "search" || from_page == "search") {
		sm = 4;
	} else if (mx_filter_select_ids()) {
		sm = 3;
	}
	let csid = 0;
	if (cur_page == "details") {
		let { tid: _tid, csid: _csid } = this.$route.params;
		if (_tid) {
			tid = _tid;
			csid = _csid;
		} else {
			tid = this.vx_details_params.tid;
			csid = this.vx_details_params.csid;
		}
	} else {
		tid = mx_filter_select_ids() || this.vx_details_params.tid;
		csid = this.vx_details_params.csid;
	}
	let params_1 =
		_.get(NewMenu, "match_list_api_config.match_list.params") || {};
	let md = "";
	if (["early"].includes(this.vx_cur_menu_type.type_name)) {
		md = params_1.md;
	}
	/** 自动选择 */
	let _params = {
		sm,
		euid: params_1.euid,
		md,
		csid,
		tid,
		sort: this.vx_match_sort,
		keyword: this.vx_related_keyword.substr(5),
		cuid: this.vx_get_uid,
		mid: remove_mid,
	};
	// 如果是聚合冠军页面
	if (this.vx_cur_menu_type.type_name == "winner_top") {
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
				? api_details.get_fetch_detail_latest_match(_params)
				: api_details.post_fetch_list_latest_match(_params);
		api.then(({ data }) => {
			if (!details.auto_swich_match) return;
			let { mid = -1, csid: sportId, tid } = _.get(data, "data") || {};
			// 详情时重载页面
			if (cur_page == "details" || cur_page == "video") {
				if (mid && mid != -1) {
					if (cur_page == "details") {
						this.$router.push({
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
						video.match_close();
					}
				} else {
					if (_.isFunction(this.back_to)) {
						this.back_to(false);
					}
				}
				return;
			}
			// 切换右侧赛事
			let playId = this.vx_details_params.play_id;
			this.vx_set_match_details_params({
				mid,
				tid,
				sportId,
				playId,
				media_type: "auto",
			});
		});
	}
};
//显示token失效弹窗
const show_fail_alert = () => {
	let ret = false;
	let callbackUrl = this.vx_get_user.callbackUrl;
	if (this.vx_get_is_invalid) {
		//是否失效
		// if ((!callbackUrl) && (callbackUrl != undefined)) {
		//   // 弹出提示消息、登录层
		//   window.vue.useMittEmit(
		//     window.vue.MITT_TYPES.EMIT_SHOW_TOAST_CMD,
		//     window.vue.i18n.t("login.login_timeout")
		//   );
		// } else {
		// 登录失效直接展示 alert
		useMittEmit(MITT_TYPES.EMIT_SHOW_ALERT_CMD, {
			text: i18n.t("login.login_timeout"),
			callback: () => {
				location.href = callbackUrl;
				// 清除旧的登录信息
				this.vx_clear_user();
			},
		});
		// }
		ret = true;
	}
	return ret;
};
// 获取比赛阶段是否需要查询接口
const get_phase_result = (csid, mmp) => {
	let check_result = false;
	if (csid == 2) {
		// 篮球
		if (mmp > 0 && mmp < 3) {
			// 上下半场
			check_result = true;
		} else if (mmp > 12 && mmp < 17) {
			// 第一节~第四节
			check_result = true;
		} else if (mmp == 40) {
			// 加时赛
			check_result = true;
		} else if (mmp == 303) {
			// 第三节休息
			check_result = true;
		}
	} else if (csid == 3) {
		// 棒球
		if (mmp > 400 && mmp < 421) {
			// 第一局上,第一局下~加时上,加时下
			check_result = true;
		}
	} else if (csid == 4) {
		// 冰球
		if (mmp > 0 && mmp < 4) {
			// 第一节~第三节
			check_result = true;
		} else if (mmp == 40) {
			// 加时赛
			check_result = true;
		}
	} else if (csid == 5) {
		// 网球
		if (mmp > 7 && mmp < 13) {
			// 第一盘~第五盘
			check_result = true;
		}
	} else if (csid == 6) {
		// 美式足球
		if (mmp > 12 && mmp < 17) {
			// 第一节~ 第四节 加时赛
			check_result = true;
		} else if (mmp == 40) {
			// 加时赛
			check_result = true;
		}
	} else if (csid == 7) {
		// 斯洛克
		if (mmp == 21) {
			// 进行中
			check_result = true;
		}
	} else if (csid == 8) {
		// 乒乓球
		if ((mmp > 7 && mmp < 13) || (mmp > 440 && mmp < 443)) {
			// 第一局~第七局
			check_result = true;
		}
	} else if (csid == 9) {
		// 排球
		if ((mmp > 7 && mmp < 13) || mmp == 17 || (mmp > 440 && mmp < 443)) {
			// 第一局~第七局
			check_result = true;
		} else if (mmp == 17) {
			// 第五局
			check_result = true;
		}
	} else if (csid == 10) {
		// 羽毛球
		if (mmp > 7 && mmp < 13) {
			// 第一局~第五局
			check_result = true;
		}
	}
	return check_result;
};


const gloab_composable_fn = () => {
  return {
    // sr 分析数据点击跳转
    sr_click_handle,
  }
}

export default gloab_composable_fn