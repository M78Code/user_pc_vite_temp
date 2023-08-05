
import * as api_match from "./match/match_api.js"; //masterj
import * as api_betting from "./betting/index.js"; //ronney
import * as api_search from "./search/index.js"; //masterj
import * as api_details from "./details/index.js"; //masterj
import * as api_filter from "./filter/filter_api.js"; //masterj
import * as api_account from "./account/account_api.js"; //bruce
import * as api_announce from "./announce/index.js"; //bruce
import * as api_virtual from "./virtual/index.js"; //bruce
import * as api_analysis from "./analysis/analysis.js"; //bruce
import * as api_chatroom from "./chatroom/index.js"; //bruce
import * as api_admin from "./module/admin/index.js"    // router
import * as api_common from "./module/common/index.js"   // router
import * as api_home from "./module/home/home.js"        // router
import * as api_global from "./module/global/index.js"    // router
import * as api_result from "./module/result/index.js"     //hellojay


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

  // 虚拟体育相关
  api_virtual,
  // 赛事分析相关
  api_analysis,
  // 聊天室相关
  api_chatroom,
  // 用户操作api接口定义
  api_admin,
  // 全局使用接口定义
  api_global,
  // // 联赛筛选api接口定义
  // api_filter,
  // 首页api接口定义
  api_home,
  // 赛果api接口
  api_result,

};
