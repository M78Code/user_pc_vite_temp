/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: API 共通入口
 */

import * as api_common from "./module/common/common_api.js"; //bruce
import * as api_filter from "./module/filter/filter_api.js"; //masterj
import * as api_account from "./module/account/account_api.js";//bruce
export {
  // 公共API接口定义
  api_common,
  // 赛事相关模块API定义
  api_filter,
  // 用户模块相关api定义
  api_account,
};
