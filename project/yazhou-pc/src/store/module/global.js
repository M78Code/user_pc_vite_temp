import { api_common } from "src/public/api/index.js";
import BaseUserInfo from "src/public/utils/user/base_user_info.js"
const env_version_name = window.env.config.DEFAULT_VERSION_NAME

const initialState = {
  // 当前网站是否处于后台运行中
  vue_hidden_run: false,
  odds: {
    // 上次赔率
    pre_odds: "EU",
    // 当前赔率
    cur_odds: "EU"
  },
  // 赛事列表排序 1:按联赛排序 2:按时间排序
  match_sort: 1,
  // 远程服务器时间
  timestamp: {
    remote_time: 0,
    local_time: 0
  },
  remote_server_time: 0,

  //全局点击事件数
  global_click:0,
  //catch错误数据
  error_data:'',
  // 是否为非常规菜单选择（搜索关键词点击）
  menu_special_choose:false,
  is_show_banner: false, // 是否显示banner
  is_roll_show_banner: false, // 滚动时是否显示banner
  is_first_introduce_write: false, // 是否完成引导页
  is_unfold_multi_column:false, //是否展开多列玩法
  //列表滚动数据
  retain_scroll_obj:{
      status:false,
      height:0
  },
  //全局开关
  global_switch:{
    //热门推荐
    hot_recommend:true,
    //统计
    statistics_switch:true,
    //收藏
    collect_switch:true,
    //近期
    recent_switch:true,
    //活动
    activity_switch:true,
    //搜索
    search_switch:true,
    //联赛筛选
    filter_switch:true,
    //盘口数量
    handicap_num:true,
    //热门赛事
    hot_match_num:true,
    //排序
    sort_cut:true,
    //滚球全部
    play_all_show:true,
    //多列
    multi_column:true,
  },
  //视频是否展开状态
  is_fold_status:true
};

export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    // 设置是否展开多列玩法
    case "SET_UNFOLD_MUTI_COLUMN":
      return {...state, is_unfold_multi_column: action.data };
    // 设置视频是否展开状态
    case "SET_IS_FOLD_STATUS":
      return { ...state, is_fold_status: action.data };
    // 设置保存的滚动数据
    case "SET_RETAIN_SCROLL_OBJ":
      const new_retain_scroll_obj = Object.assign(state.retain_scroll_obj, action.data)
      return { ...state, retain_scroll_obj: new_retain_scroll_obj };
    // 全局开关
    case "SET_GLOBAL_SWITCH":
      const new_switch_obj = Object.assign(state.switch_obj, action.data)
      return { ...state, switch_obj: new_switch_obj };
    // 设置非常规菜单选择（搜索关键词点击）
    case "SET_MENU_SPECIAL_CHOOSE":
      return { ...state, menu_special_choose: action.data };
    // 初始化盘口偏好
    case "SET_INIT_ODD":
      let pre_odds = localStorage.getItem("pre_odds") || state.odds.cur_odds
      let cur_odds = localStorage.getItem("cur_odds") || state.odds.cur_odds
      localStorage.setItem("pre_odds", pre_odds)
      localStorage.setItem("cur_odds", cur_odds)
      return { ...state, odds: {pre_odds,cur_odds} };
    // 设置上次盘口偏好
    case "SET_PRE_ODD":
      localStorage.setItem("pre_odds", action.data)
      let new_pre_odds = { pre_odds: action.data, cur_odds }
      return { ...state, odds: new_pre_odds };
    // 设置盘口偏好
    case "SET_CUR_ODD":
      BaseUserInfo.assign({userMarketPrefer: cur_odds});
      localStorage.setItem("pre_odds", action.data)
      let new_cur_odds = { pre_odds: pre_odds, cur_odds: action.data }
      return { ...state, odds: new_cur_odds };
    // 设置列表排序
    case "SET_MATCH_SORT":
      localStorage.setItem("match_sort", action.data)
      return { ...state, match_sort: action.data };
    // 设置服务器时间
    case "SET_REMOTE_SERVER_TIME":
      return { ...state, timestamp: { remote_time: action.data, local_time: new Date().getTime() } };
    // 设置版本名称
    case "SET_VERSION_NAME":
      localStorage.setItem('version_name', version_name);
      return { ...state, version_name: action.data };
    // 初始化设置版本名称
    case "INIT_VERSION_NAME":
      let version_name = localStorage.getItem('version_name');
      if (!version_name) {
        version_name = env_version_name;
        localStorage.setItem('version_name', version_name);
      }
      return { ...state, version_name };
    // 设置网站是否处于后台运行中
    case "SET_VUE_HIDDEN_RUN":
      return { ...state, vue_hidden_run: action.data };
    // 设置全局点击事件
    case "SET_GLOBAL_CLICK":
      let global_click_count = state.global_click ++;
      return { ...state, global_click: global_click_count };
    // 设置catch错误数据
    case "SET_ERROR_DATA":
      if(data == 'delete'){
        return { ...state, error_data: '' };
      }else{
        action.data.error = action.data.error || ''
        let error = action.data.error.toString()
        if(error == '[object Object]'){
          error = JSON.stringify(action.data.error)
        }
        let new_errorData = state.error_data += '\n' + action.data.site + '\n' + error
        return { ...state, error_data: new_errorData };
      }
    //
    case "SET_V_RESULT_NUMBER_C_PAGE":
      return { ...state, v_result_number_c_page: action.data };
    // 设置显示列表状态
    case "SET_IS_SHOW_BANNER":
      return { ...state, is_show_banner: action.data };
    // 设置滚动时显示列表状态
    case "SET_IS_ROLL_SHOW_BANNER":
      return { ...state, is_roll_show_banner: action.data };
    // 设置是否完成引导页
    case "SET_IS_FIRST_INTRODUCE_WRITE":
      return { ...state, is_first_introduce_write: action.data };
    default:
      return state;
  }
}
