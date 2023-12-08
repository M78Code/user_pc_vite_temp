import { get_query_string } from "src/core/utils/common";
import STANDARD_KEY from "src/core/standard-key";
import { SessionStorage } from "src/core/utils/common/module/web-storage.js";
import UserCtr from "src/core/user-config/user-ctr.js";

//获取url参数
//token键
const token_key = STANDARD_KEY.get("token");

// 初始化
export const enter_params = (callback) => {
  // 获取 缓存token
  let token = SessionStorage.get(token_key);
  // 获取 参数token
  let url_token =get_query_string.token;
  // 优先使用 参数token
  if (url_token) {
    SessionStorage.set(token_key, url_token || token);
  }
  UserCtr.get_user_info(url_token || token, callback);
};
