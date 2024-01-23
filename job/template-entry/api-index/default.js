import * as api_match from "./module/match/match_api.js"; //masterj
import * as api_betting from "./module/betting/index.js"; //ronney
import * as api_search from "./module/search/index.js"; //masterj
import * as api_details from "./module/details/index.js"; //masterj
import * as api_filter from "./module/filter/filter_api.js"; //masterj
import * as api_account from "./module/account/account_api.js"; //bruce
import * as api_analysis from "./module/analysis/analysis.js"; //bruce
import * as api_chatroom from "./module/chatroom/index.js"; //bruce
 
import * as api_common from "./module/common/index.js"; // router
import * as api_home from "./module/home/home.js"; // router
import * as api_global from "./module/global/index.js"; // router
 
import * as api_base_data from "./module/base_data/base_data.js"; //nico
import * as api_activity from "./module/activity/index.js"; //activity


import * as socket_api from "./module/socket/socket_api.js"; // router

import * as api_match_list from  "./module/matches_list/index.js"

import * as api_hide from "./module/hide-api/index.js"; // hanmar

import * as api_v_sports from "./module/virtual_sports/virtual_sports.js"  //hanmar
export {
  api_base_data,
  // 公共API接口定义
  api_common,
  // 赛事相关模块API定义
  api_match,
  // 押注API接口定义
  api_betting,
  // 搜索相关API接口定义
  api_search,
  // 赛事详情模块API接口定义
  api_details,
  // 赛事详情模块API接口定义
  api_filter,
  // 用户模块相关api定义
  api_account,
  // 赛事分析相关
  api_analysis,
  // 聊天室相关
  api_chatroom,
 
  // 全局使用接口定义
  api_global,
  // // 联赛筛选api接口定义
  // api_filter,
  // 首页api接口定义
  api_home,
 
  // 活动api接口
  api_activity,
  // 
  socket_api,
  // 埋点api
  api_hide,
  //15分钟赛事数据
  api_match_list,
  api_v_sports
};
