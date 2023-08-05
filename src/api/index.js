
import * as api_match from "src/public/api/module/match/match_api.js"; //masterj
import * as api_betting from "src/public/api/module/betting/index.js"; //ronney
import * as api_search from "src/public/api/module/search/index.js"; //masterj
import * as api_details from "src/public/api/module/details/index.js"; //masterj
import * as api_filter from "src/public/api/module/filter/filter_api.js"; //masterj
import * as api_account from "src/public/api/module/account/account_api.js"; //bruce
import * as api_announce from "src/public/api/module/announce/index.js"; //bruce
import * as api_virtual from "src/public/api/module/virtual/index.js"; //bruce
import * as api_analysis from "src/public/api/module/analysis/analysis.js"; //bruce
import * as api_chatroom from "src/public/api/module/chatroom/index.js"; //bruce
import * as api_admin from "src/project/api/module/admin/index.js"    // router
import * as api_common from "src/project/api/module/common/index.js"   // router
import * as api_home from "src/project/api/module/home/home.js"        // router
import * as api_global from "src/project/api/module/global/index.js"    // router
import * as api_result from "src/project/api/module/result/index.js"     //hellojay


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
  // 联赛筛选api接口定义
  api_filter,
  // 首页api接口定义
  api_home,
  // 赛果api接口
  api_result,

};
