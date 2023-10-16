import { ref } from "vue";
import { useRoute } from "vue-router";
import lodash from "lodash";

import axios_debounce_cache from "src/core/http/debounce-module/axios-debounce-cache.js";
import { PageSourceData } from "src/core/index.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
import MenuData from "src/core/menu-pc/menu-data-class.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import * as api_websocket from "src/api/module/socket/socket_api.js";
import filterHeader from 'src/core/filter-header/filter-header.js'
import store from "src/store-redux/index.js";

let state = store.getState();

const league_list_obj = ref([]);
const { page_source } = PageSourceData;



// const route = useRoute() || {};

// 自动化测试页面加载时间时使用
const set_home_loading_time_record = (status) => {
	if (
		window.init_loading_time_obj &&
		lodash.get(window, "env.config.DOM_ID_SHOW")
	) {
		if (!window.init_loading_time_obj.list_end_time) {
			window.init_loading_time_obj.list_end_time = new Date().getTime();
		}
		let time_obj = window.init_loading_time_obj;
		if (!time_obj.start) {
			time_obj.start = new Date(time_obj.start_time).Format(
				"yyyy-MM-dd hh:mm:ss"
			);
		}
		if (time_obj.list_end_time && time_obj.right_details_end_time) {
			let end_time =
				time_obj.list_end_time > time_obj.right_details_end_time
					? time_obj.list_end_time
					: time_obj.right_details_end_time;
			(time_obj.end = new Date(end_time).Format("yyyy-MM-dd hh:mm:ss")),
				(time_obj.end_time = end_time);
			time_obj.status = status;
			time_obj.duration = time_obj.end_time - time_obj.start_time;
			sessionStorage.setItem(
				"home_loading_time_record",
				JSON.stringify(time_obj)
			);
			window.init_loading_time_obj = null;
		}
	}
};

/**
 * get_match_base_info_by_mids 数据解析
 */
const set_match_base_info_by_mids_info = (match_list, mids_arr, ts1) => {
// 计算赛事卡片
	// 重新计算赛事样式
	MatchListCardClass.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(
		mids_arr
	);
	match_list.forEach((match) => {
		// bymid数据同步投注项 1508要改的
		BetCommonHelper.upd_bet_obj(ts1, match.mid);
		// 同步比分到右侧
		if (vx_detail_params.value.mid == match.mid) {
			BetCommonHelper.update_match_score(0, match.mid);
		}
	});
	//热门赛事 提取足球赛事
	if (MenuData.menu_root == 500) {
		let obj = match_list.find((item) => item.csid == 1) || {};
		MenuData.hot_500_sport_1 = !!obj.csid;
		// 更新 展开/收起 按钮显示隐藏
		MenuData.set_multi_column();
	}
};

/**
	 * @Description 设置联赛列表对象
	 * @param {object} league_list_obj
	 */
const set_league_list_obj = (league_list_obj) => {
  league_list_obj.value = league_list_obj;
}

/**
	 * @Description 获取前12场展开的赛事mid
	 * @returns {array} mids 前12场赛事id
	 */
const get_first_unfold_mids = () => {
  let mids = [];
  // 展开的赛事数量计数  用于计数首次加载列表 只展开前12场赛事
  let unfold_match_count = 0;
  // 遍历所有赛事数据
  let match_status_type_arr = ["livedata", "nolivedata"];
  match_status_type_arr.forEach((match_status_type) => {
    // 遍历联赛列表
    let league_list = lodash.get(league_list_obj.value, match_status_type, []);
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
 * @description 调用列表bymids接口
 * @param  {boolean} is_first_load 是否用户切换菜单  第一次加载调用
 * @param  {boolean} is_show_mids_change 是否可视区域赛事改变 调用
 * @param  {boolean} is_league_first 是否联赛结构类型列表 首次加载拉前12场赛事
 * @param  {array} mids 指定拉取的mids
 * @param  {function} callback 回调函数
 * @return {undefined} undefined
 */
const api_bymids = (
  {
    is_first_load,
    is_show_mids_change,
    is_league_first,
    mids,
    inner_param,
  },
  callback
) => {
  console.log({
    mids,
    inner_param,
  });
  let panduan_1 = MenuData.is_virtual_sport();
  let panduan_2 = ["details", "video"].includes(page_source);
  let first_load_time;
  if ((panduan_1 && page_source !== "search") || panduan_2) {
    return;
  }
  // 联赛结构类型列表 首次加载拉前12场赛事
  if (is_league_first) {
    mids = get_first_unfold_mids();
  }
  // 第一次加载拉取所有赛事
  else if (is_first_load) {
    // mids = []
    // MatchListData.match_list.forEach( match => {
    //   mids.push(match.mid)
    // })
    mids = MatchListScrollClass.show_mids;
  }
  // 是否可视区域赛事改变
  else if (is_show_mids_change) {
    mids = MatchListScrollClass.show_mids;
  }
  // 是否用户切换菜单 第一次调用bymids接口
  if (is_league_first || is_first_load) {
    first_load_time = new Date().getTime();
  } else {
    let _time = new Date().getTime() - first_load_time;
    // 距离第一次全量加载时间小于2秒 不请求接口
    if (_time < 2000) {
      return;
    }
  }
  // 非滚球第一次加载  mid数量最多24个
  if (mids.length > 24) {
    mids.splice(24);
  }
  if (mids.length == 0) return;
  // is_show_mids_change &&
  // 	mids.forEach((mid) => {
  // 		// 从列表触发详情接口同步数据
  // 		if (this.vx_details_params.mid == mid) {
  // 			useMittEmit("match_detail_base", {
  // 				isWs: true,
  // 				mid,
  // 				is_bymids: true,
  // 			});
  // 		}
  // 	});
  // 获取足球tab玩法参数
  // let tabs = MatchListData.get_tab_param_build(mids);
  let match_list_api_config = MenuData.match_list_api_config.match_list;
  let _params = lodash.clone(match_list_api_config.params) || {};
  let params = {
    mids: mids.join(","),
    cuid: UserCtr.get_uid(),
    euid: _params.euid,
    orpt: _params.orpt,
    sort: filterHeader.vx_match_sort,
  };
  // if (tabs.length > 0) {
  // 	params.tabs = tabs;
  // }
  // 非滚球传 玩法ID
  if (MenuData.menu_root != "1" && page_source != "search") {
    params.pids = _params.pids;
  }
  //today：今日  early：早盘 角球玩法
  params.cos = MenuData.is_corner_menu() || params.orpt == 25 ? 1 : 0;
  // 冠军去参数
  if (MenuData.menu_root == 400) {
    delete params.euid;
  }
  let api;
  // 电竞
  if (MenuData.is_esports() && page_source !== "search") {
    api = api_websocket.get_esports_by_mids;
    params = {
      mids: mids.join(","),
      csid: _params.csid,
      cuid: UserCtr.get_uid(),
    };
    if (MenuData.is_esports_champion()) {
      params.category = 2;
    }
  } else {
    api = api_websocket.get_match_base_info_by_mids;
  }
  //添加内部参数
  if (inner_param) params.inner_param = inner_param;
  //当点击足球 赛种,并收起右侧详情面版orpt参数为13
  if (filterHeader.get_unfold_multi_column && MenuData.is_multi_column) {
    params.orpt = 13;
  }
  // return
  let by_mids_fun_count = 0;
  let by_mids_fun = () => {
    // HTTP拉取最新信息合并
    api(params)
      .then((res) => {
        set_home_loading_time_record("ok");
        
        // 组件和路由不匹配
        // if (page_source == "details" && page_source != "details") return;
        //更新电竞右侧视频
        if (
          MenuData.is_esports() &&
          page_source !== "search" &&
          !is_first_load
        ) {
          useMittEmit(MITT_TYPES.EMIT_GET_ESPORTS_VIDEO_LIST);
        }
        let code = res.code
        let match_list = lodash.get(res, "data.data") || [];
        let ts1 = res.ts
        MatchListData.set_list(
          match_list,
        );
        let mids_arr = [];
        match_list.forEach((match) => {
          mids_arr.push(String(match.mid));
          match.api_update_time = ts1;
        });
        // 展开联赛数据加载状态
        let league_load_status = "";
        // 检查赛事是否移除
        if (code == 200) {
          mids.forEach((mid) => {
            if (!mids_arr.includes(String(mid))) {
              this.remove_match_data(mid);
            }
          });
        }
        if (code == 200 && match_list.length > 0) {
          set_match_base_info_by_mids_info(match_list, mids_arr, ts1);
        } else if (code == "0400500" && by_mids_fun_count++ < 3) {
          by_mids_fun();
          league_load_status = "empty";
        } else if (code == "0401038") {
          // 限流
          league_load_status = "api_limited";
        } else {
          league_load_status = "empty";
        }
        if (league_load_status && callback) {
          // 回调无数据状态
          callback(league_load_status);
        }
        // 如果是第一次加载设置数据加载状态
        if (is_league_first) {
          load_data_state.value = "data";
        }
        // 回调函数
        if (callback) {
          callback();
        }
      })
      .catch((err) => {
        set_home_loading_time_record("err");
        // console.error(err)
        // 如果是第一次加载设置数据加载状态
        if (is_league_first) {
          load_data_state.value = "data";
        }
        // 展开联赛数据加载状态
        let league_load_status = "";
        if (lodash.get(err, "response.status") == 503) {
          // 限流
          league_load_status = "user_api_limited";
        } else {
          // 无数据
          league_load_status = "empty";
        }
        if (callback) {
          // 回调无数据状态
          callback(league_load_status);
        }
      });
  };
  // 虚拟体育不用拉最新信息合并
  if (page_source !== "virtual_sport") {
    const by_mids_debounce_cache =
      axios_debounce_cache.get_match_base_info_by_mids;
    if (by_mids_debounce_cache && by_mids_debounce_cache["ENABLED"]) {
      let scroll = is_show_mids_change ? Date.now() : "";
      let info = by_mids_debounce_cache.can_send_request({
        ...params,
        scroll,
      });
      if (info.can_send) {
        //直接发请求    单次数 请求的方法
        by_mids_fun();
      } else {
        // 记录timer
        current_hash_code = 0;
        clearTimeout(axios_debounce_timer);
        axios_debounce_timer = setTimeout(() => {
          //直接发请求    单次数 请求的方法
          by_mids_fun();
          current_hash_code = 0;
        }, info.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
      by_mids_fun();
    }
  }
};


const use_featch_fn = () => {
    return {
        api_bymids,
        set_league_list_obj,
        league_list_obj
    }
}

export default use_featch_fn;