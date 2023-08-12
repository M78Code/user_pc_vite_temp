import { api_common } from "src/public/api/index.js";
import BaseUserInfo from "src/core/utils/user/base-user-info.js";
import { get } from "lodash";
const { DEFAULT_VERSION_NAME } = window.BUILDIN_CONFIG;

const initialState = {
  version_name: "zhuanye",
  // 当前网站是否处于后台运行中
  vue_hidden_run: false,
  odds: {
    // 上次赔率
    pre_odds: "EU",
    // 当前赔率
    cur_odds: "EU",
  },
  // 赛事列表排序 1:按联赛排序 2:按时间排序
  match_sort: 1,
  // 远程服务器时间
  timestamp: {
    remote_time: 0,
    local_time: 0,
  },
  remote_server_time: 0,

  //全局点击事件数
  global_click: 0,
  //catch错误数据
  error_data: "",
  // 是否为非常规菜单选择（搜索关键词点击）
  menu_special_choose: false,
  is_show_banner: false, // 是否显示banner
  is_roll_show_banner: false, // 滚动时是否显示banner
  is_first_introduce_write: false, // 是否完成引导页
  is_unfold_multi_column: false, //是否展开多列玩法
  //列表滚动数据
  retain_scroll_obj: {
    status: false,
    height: 0,
  },
  //全局开关
  global_switch: {
    //热门推荐
    hot_recommend: true,
    //统计
    statistics_switch: true,
    //收藏
    collect_switch: true,
    //近期
    recent_switch: true,
    //活动
    activity_switch: true,
    //搜索
    search_switch: true,
    //联赛筛选
    filter_switch: true,
    //盘口数量
    handicap_num: true,
    //热门赛事
    hot_match_num: true,
    //排序
    sort_cut: true,
    //滚球全部
    play_all_show: true,
    //多列
    multi_column: true,
  },
  //视频是否展开状态
  is_fold_status: true,
  champion_fold_obj: {},
};
export function globalReducer(state = initialState, action) {
  switch (action.type) {
    //设置保存的滚动数据
    case "set_retain_scroll_obj":
      return { ...state, retain_scroll_obj: action.data };

    //全局开关
    case "set_global_switch":
      return { ...state, retain_scroll_obj: action.data };

    // //是否展开多列玩法
    case "set_unfold_multi_column":
      return { ...state, is_unfold_multi_column: action.data };

    // //设置非常规菜单选择（搜索关键词点击）
    case "set_menu_special_choose":
      return { ...state, menu_special_choose: action.data };
    // //设置服务器时间
    case "set_remote_server_time":
      return {
        ...state,
        timestamp: {
          local_time: Date.now(),
          remote_time: action.data,
        },
      };
    // //初始化盘口偏好
    case "set_init_odd":
      let pre_odds = localStorage.getItem("pre_odds") || state.odds.cur_odds;
      let cur_odds = localStorage.getItem("cur_odds") || state.odds.cur_odds;
      localStorage.setItem("pre_odds", pre_odds);
      localStorage.setItem("cur_odds", cur_odds);
      state.odds = { pre_odds, cur_odds };
      return {
        ...state,
        odds: { pre_odds, cur_odds },
      };
    // // 设置上次盘口偏好
    case set_pre_odd:
      localStorage.setItem("pre_odds", action.data);
      return {
        ...state,
        odds: { pre_odds: action.data, cur_odds: state.odds.cur_odds },
      };
    // // 设置盘口偏好
    case "set_cur_odd":
      if (!action.data) return state;
      BaseUserInfo.assign({ userMarketPrefer: action.data });
      localStorage.setItem("cur_odds", action.data);
      return {
        ...state,
        odds: { pre_odds: state.odds.pre_odds, cur_odds: action.data },
      };
    // //初始化列表排序
    case "set_init_match_sort":
      // let match_sort = localStorage.getItem("match_sort") || state.match_sort
      // localStorage.setItem("match_sort", match_sort)
      // state.match_sort = match_sort
      return state;

    // // 设置列表排序
    case "set_match_sort":
      localStorage.setItem("match_sort", action.data);
      return { ...state, match_sort: action.data };
    //设置版本名称
    case "set_version_name":
      localStorage.setItem("version_name", action.data);
      return { ...state, version_name: action.data };

    // //初始化设置版本名称
    case "init_version_name":
      let version_name = localStorage.getItem("version_name");
      if (!version_name) {
        version_name = DEFAULT_VERSION_NAME;
        localStorage.setItem("version_name", version_name);
      }
      return { ...state, version_name: version_name };
    // //设置网站是否处于后台运行中
    case "set_vue_hidden_run":
      return { ...state, vue_hidden_run: action.data };
    //设置全局点击事件
    case "set_global_click":
      return { ...state, global_click: state.global_click + 1 };
    // //设置catch错误数据
    case "set_error_data":
      const data = action.data;
      let error_data;
      if (data == "delete") {
        error_data = "";
      } else {
        data.error = data.error || "";
        let error = data.error.toString();
        if (error == "[object Object]") {
          error = JSON.stringify(data.error);
        }
        error_data += "\n" + data.site + "\n" + error;
      }
      return { ...state, error_data };
    // //设置显示列表状态
    case "set_is_show_banner":
      return { ...state, is_show_banner: action.data };
    // //设置滚动时显示列表状态
    case "set_is_roll_show_banner":
      return { ...state, is_roll_show_banner: state.data };
    // //设置是否完成引导页
    case "set_is_first_introduce_write":
      return { ...state, is_first_introduce_write: state.data };
    // //设置视频是否展开状态
    case "set_is_fold_status":
      return { ...state, is_fold_status: state.data };
    //设置冠军卡片收起展开
    case "set_champion_fold":
      return { ...state, champion_fold_obj: state.data };
  }
}
//获取服务器时间
export const set_remote_server_time = () => {
  return async (dispatch) => {
    const res = await api_common.get_server_time();
    let code = get(res, "data.code");
    if (code == 200) {
      let serverTime = Number(get(res, "data.data"));
      dispatch({
        type: "set_remote_server_time",
        data: serverTime,
      });
    }
  };
};
