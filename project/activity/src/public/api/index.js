/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: API 共通入口
 */

import * as api_common from "./module/common/common_api.js"; //bruce
import * as api_match from "./module/match/match_api.js";  //masterj
import * as api_betting from "./module/betting/index.js"; //ronney
import * as api_search from "./module/search/index.js"; //masterj
import * as api_details from "./module/details/index.js"; //masterj
import * as api_filter from "./module/filter/filter_api.js"; //masterj
import * as api_account from "./module/account/account_api.js";//bruce
import * as api_announce from "./module/announce/index.js"; //bruce
import * as api_results from "./module/results/results.js"; //bruce
import * as api_virtual from "./module/virtual/index.js";  //bruce
import * as api_analysis from "./module/analysis/analysis.js"; //bruce
import * as api_chatroom from "./module/chatroom/index.js"; //bruce

export {
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
  // 公告模块相关api定义
  api_announce,
  // 赛果模块相关API定义
  api_results,
  // 虚拟体育相关
  api_virtual,
  // 赛事分析相关
  api_analysis,
  // 聊天室相关
  api_chatroom,
};
