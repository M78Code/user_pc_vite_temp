/*
 * @Author: lockie
 * @Date: 2023-07-29 14:33:39
 * @FilePath: \user-pc-vite\src\core\match-list\match-list.js
 * @Description: 赛事列表主要逻辑
 */
/**
 * @description 请求数据
 * @param  {boolean} is_socket   是否 socket 调用
 * @param  {boolean} cut   是否 切换右侧详情  true 不切换
 * @param {Object} params 其他参数
 */
export const fetch_match_list = (is_socket = false, cut) => {
	// 如果有拉列表定时器 清除定时器
	if (!is_socket && this.get_match_list_timeid) {
		clearTimeout(this.get_match_list_timeid);
		this.get_match_list_timeid = false;
	}
	// 热门推荐定时器
	if (!is_socket && this.hot_match_list_timeout) {
		clearTimeout(this.hot_match_list_timeout);
	}
	// 视频结束返回列表  强制loading
	if (video.is_video_end) {
		is_socket = false;
		video.is_video_end = false;
	}
	this.$matchlist.fetch_match_list_time = new Date().getTime();
	// 组件和路由不匹配
	if (this.$route.name == "details" && this.page_source != "details") {
		return;
	}
	// 强力推荐 静默拉取
	if (is_socket && this.is_show_hot) {
		this.get_hot_match_list(true);
		return;
	}
	// 【搜索列表】 WS 之类的调用 fetch_match_list 转向到 fetch_search_match_list
	if (this.$route.name == "search") {
		this.fetch_search_match_list && this.fetch_search_match_list(is_socket);
		return false;
	}
	if (!is_socket) {
		this.match_list_data.init();
		this.load_data_state = "loading";
		// 设置列表滚动条scrollTop
		this.$route.name != "details" && this.$matchlist.set_scroll_top(0);
	}
	// 更新列表模板编号 和请求参数
	$menu.set_match_tpl_number();
	$menu.set_match_list_api_params();
	// 设置列表接口 和 参数
	let api = api_match[$menu.match_list_api_name];
	let _params = _.clone($menu.match_list_api_params);
	let match_list_api_type = $menu.match_list_api_type;
	let send_match_list_request = () => {
		/**返回数据处理************/
		api &&
			api(_params)
				.then((res) => {
					// 组件和路由不匹配 菜单id不匹配
					if (
						(this.$route.name == "details" && this.page_source != "details") ||
						this.destroyed ||
						_params.euid != $menu.match_list_api_params.euid
					)
						return;
					let data = _.get(res, "data", {});
					this.api_error_count = 0;
					if (data.code == 200) {
						if (match_list_api_type == "league_list") {
							this.mx_list_res(data, is_socket, cut);
						} else {
							this.mx_use_list_res(data, is_socket, cut);
						}
					} else if (data.code == "0401038") {
						// let is_collect = this.vx_layout_list_type == 'collect'
						// // 收藏列表，遇到限频提示'当前访问人数过多，请稍后再试'
						// if (is_collect && data.code == '0401038') {
						//     this.load_data_state = "api_limited";
						// }
						if (!is_socket) {
							this.load_data_state = "api_limited";
						}
					} else {
						if (!is_socket) {
							this.load_data_state = "empty";
						}
					}
					this.show_refresh_mask = false;
				})
				.catch((err) => {
					console.error(err);
					this.set_error_data({
						site: "version_mixin--fetch_match_list",
						error: err,
					});
					this.show_refresh_mask = false;
					// 如果是用户切换菜单
					if (!is_socket) {
						this.api_error_count++;
						// 重复拉列表的次数小于5   3秒后再次拉接口
						if (this.api_error_count < 5) {
							this.get_match_list_timeid = setTimeout(() => {
								this.fetch_match_list();
							}, 3000);
						} else {
							this.load_data_state = "refresh";
						}
					}
				});
	};
	const match_list_debounce_cache = axios_debounce_cache.get_match_list;
	if (match_list_debounce_cache && match_list_debounce_cache["ENABLED"]) {
		let info = match_list_debounce_cache.can_send_request(_params);
		if (info.can_send) {
			//直接发请求    单次数 请求的方法
			send_match_list_request();
		} else {
			// 记录timer
			this.current_hash_code = 0;
			clearTimeout(this.axios_debounce_timer2);
			this.axios_debounce_timer2 = setTimeout(() => {
				//直接发请求    单次数 请求的方法
				send_match_list_request();
				this.current_hash_code = 0;
			}, info.delay_time || 1000);
		}
	} else {
		//直接发请求    多 次数  循环请求 的方法
		send_match_list_request();
	}
};

/**
 * @Description 每30秒检查一次可视区域赛事数据最后更新时间，如果超过1分钟未更新数据  调用bymids接口更新数据
 * @param {undefined} undefined
 */
export const check_match_last_update_time = () => {
	// 非滚球 今日 不检查
	if (!["play", "today"].includes(MenuData.cur_menu_type.type_name)) {
		return;
	}
	let mids = [];
	let now_time = this.get_remote_time();
	// 遍历可视区域赛事ID
	this.$matchlist.show_mids.forEach((mid) => {
		// 更新时间间隔
		let api_time_dif = 0,
			ws_time_dif = 0;
		let match = this.match_list_data.mid_obj["mid_" + mid] || {};
		if (match.api_update_time) {
			api_time_dif = now_time - match.api_update_time;
		}
		if (match.ws_update_time) {
			ws_time_dif = now_time - match.ws_update_time;
		} else {
			ws_time_dif = 70000;
		}
		// 超过一分钟 未更新过数据
		if (api_time_dif > 60000 && ws_time_dif > 60000) {
			mids.push(mid);
		}
	});
	if (mids.length > 0) {
		this.api_bymids({ mids });
	}
};
