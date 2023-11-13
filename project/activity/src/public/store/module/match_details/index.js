/*
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事详情、玩法相关
 */

export default {
		state: {
				params: {
						mid: "", //赛事id
						tid: "", // 联赛 id
						sportId: "", //球类id
						media_type: "auto", // 直播类型
						time: Date.now()
				},
				isTop: true,//视频置顶
				topId: [],//置顶的玩法id
				play_media: {
						mid: 0,
						media_type: "",
						is_auto: true,
						time: Date.now()
				},
				// 点返回按钮 返到列表
				is_back_btn_click: false,
				// 电竞视频是否暂停
				is_pause_video: true,
				zoom: true,
				layout_statu: 0,//玩法列表单双列 0单列， 1双列
				is_fullscreen: false, //是否全屏
				// 赛事详情数量
				match_detail_count: 0,
				history_random: 1,
				// 当前选中玩法id
				tabs_active_index: 0,
                // 当前选中玩法对应的盘口玩法
				tabs_active_plays: [],
				detail_show_type: '',//详情页 显示类型 play:滚球   today：今日  early：早盘
				// 是否显示全屏投注
				is_show_full_bet:false,
				active_detail:{}, //详情比分面板，接口报错时的备用数据
				details_data_cache: {} // 玩法集对应玩法缓存数据
		},
		getters: {
				//右侧布局布局 大或小
				get_right_zoom(state) {
						return state.zoom
				},
				//获取电竞视频 是否暂停
				get_is_pause_video(state) {
						return state.is_pause_video
				},
				//获取右侧详情参数
				get_match_details_params(state) {
						return state.params
				},
				//获取指定的玩法id
				get_top_id(state) {
						return state.topId
				},
				//视频是否吸顶-未使用
				get_isTop(state) {
						return state.isTop
				},
				//视屏播放类型
				get_play_media(state) {
						return state.play_media
				},
				//详情页玩法列表单双列 0单列， 1双列
				get_layout_statu(state) {
						return state.layout_statu
				},
				//获取视频是否全屏-未使用
				get_is_fullscreen(state) {
						return state.is_fullscreen;
				},
				//获取当前选中玩法集的玩法个数
				get_match_detail_count(state) {
						return state.match_detail_count;
				},
				//获取是否从详情页返回
				get_is_back_btn_click(state) {
						return state.is_back_btn_click
				},
				//获取当前选中的tab的id
				get_tabs_active_id(state) {
						return state.tabs_active_index
				},
                //获取当前选中的tab的id
				get_tabs_active_plays(state) {
                        return state.tabs_active_plays
                },
				//详情页显示类型 play:滚球  today：今日  early：早盘
				get_detail_show_type(state) {
						return state.detail_show_type
				},
				get_is_show_full_bet(state) {
						return state.is_show_full_bet
				},
				//详情比分面板，接口报错时的备用数据
				get_active_detail(state) {
						return state.active_detail
				},
				// 玩法集对应玩法缓存数据
				get_details_data_cache(state) {
					return state.details_data_cache
				},
		},

		actions: {
				set_history_random({ commit }, random) {
						commit("set_history_random", random)
				},
				set_right_zoom({ commit }) {
						commit("set_right_zoom");
				},
				set_is_pause_video({ commit }, data) {
						commit("set_is_pause_video",data);
				},
				//保存详情右侧参数(mid: "", 赛事id tid: "", // 联赛 id	sportId: "", //球类id media_type: "auto", // 直播类型) 信息
				set_match_details_params({ commit }, data) {
						commit("set_match_details_params", data);
				},
				//设置置顶的玩法id
				set_top_id({ commit }, data) {
						commit("set_top_id", data);
				},
				set_isTop({ commit }) {//视频置顶
						commit("set_isTop");
				},
				set_play_media({ commit }, data) {
						commit("set_play_media", data);
				},
				set_play_media_auto({ commit }, data) {
						commit("set_play_media_auto", data);
				},
				//设置玩法列表单双列 0单列， 1双列
				set_layout_statu({ commit }, statu) {
						commit("set_layout_statu", statu);
				},
				set_is_fullscreen({ commit }, fullscreen) {
						commit("set_is_fullscreen", fullscreen);
				},

				// 设置赛事详情数量
				set_match_detail_count({ commit }, match_detail_count) {
						commit("set_match_detail_count", match_detail_count);
				},
				// 设置获取是否从详情页返回
				set_is_back_btn_click({ commit }, val) {
						commit("set_is_back_btn_click", val);
				},
				// 设置选中玩法id
				set_tabs_active_id({ commit }, index) {
						commit("set_tabs_active_id", index);
				},
                // 当前选中玩法对应的盘口玩法
				set_tabs_active_plays({ commit }, data) {
                        commit("set_tabs_active_plays", data);
                },
				//设置详情页 显示类型
				set_detail_show_type({ commit }, data) {
						commit("set_detail_show_type", data);
				},
				set_is_show_full_bet({ commit }, data) {
						commit("set_is_show_full_bet", data);
				},
				//设置详情比分面板，接口报错时的备用数据
				set_active_detail({ commit }, detail) {
						commit("set_active_detail", detail);
				},
				// 设置玩法集对应玩法缓存数据
				set_details_data_cache({ commit }, data) {
					commit("set_details_data_cache", data);
				},
		},

		mutations: {
				set_history_random(state, random) {
					state.history_random = random
				},
				set_right_zoom(state) {
						state.zoom = !state.zoom
				},
				set_is_pause_video(state,data) {
						state.is_pause_video = data
				},
				//保存详情右侧参数
				set_match_details_params(state, data) {
						// if (!data) return false
						if (data) {
								let obj = Object.assign(state.params, data, { time: Date.now() })
								state.params = obj
						} else {
								state.params = {}
						}
				},
				//设置置顶的玩法id
				set_top_id(state, data) {
						let xdata = state.topId
						if (data.type) {
								if (!xdata.includes(data.id)) {
									xdata.push(data.id)
								}
						} else {
								xdata.splice(xdata.indexOf(data.id), 1)
						}
						state.topId = xdata
				},
				set_isTop(state) {//视频置顶
						state.isTop = !state.isTop
				},
				set_play_media(state, data) {
						data.is_auto = data.is_auto == undefined ? true : data.is_auto
						state.play_media = data
				},
				set_play_media_auto(state, val = true) {
						state.play_media.is_auto = val
				},
				//设置玩法列表单双列 0单列， 1双列
				set_layout_statu(state, statu) {
						state.layout_statu = statu
				},
				set_is_fullscreen(state, fullscreen) {
						state.is_fullscreen = fullscreen;
				},

				// 设置赛事详情数量
				set_match_detail_count(state, match_detail_count) {
						state.match_detail_count = match_detail_count;
				},
				// 设置获取是否从详情页返回
				set_is_back_btn_click(state, val) {
						state.is_back_btn_click = val
				},
				// 设置选中玩法id
				set_tabs_active_id(state, index) {
					// alert("vuex", index)
						state.tabs_active_index = index
				},
                // 当前选中玩法对应的盘口玩法
				set_tabs_active_plays(state, data) {
						state.tabs_active_plays = data || []
				},
				//设置详情页 显示类型
				set_detail_show_type(state, data) {
						state.detail_show_type = data
				},
				set_is_show_full_bet(state, data) {
						state.is_show_full_bet = data
				},
				//设置详情比分面板，接口报错时的备用数据
				set_active_detail(state, detail) {
						state.active_detail = detail
				},
				// 设置玩法集对应玩法缓存数据
				set_details_data_cache(state, data) {
					if (!data || !Object.keys(data).length) {
						state.details_data_cache = {}
						return
					}

					const details_data_cache = Object.assign({}, state.details_data_cache, data)
					state.details_data_cache = details_data_cache
				},
		}
}
