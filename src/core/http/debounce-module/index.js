/*
 * @Author:
 * @Date: 2022-09-27 16:34:40
 * @Description:
 */
/**
 *
 * 前端 axios 请求  缓存  和 缓存相关的配置
 *
 *
 * 我们现在 默认每个接口 作用都是单一的，不存在两个并存的  模块发起同样的请求
 *
 * 我们只做几个核心接口 ，主要是赛程相关 的 和 getUserInfo
 *
 * 限频的 结果有两种 一种服务器直接 503 直接错误 ，一直是返回ok 但是  code 是 0401038
 *
 * 请求出错的  要排除 限频 503 和 主动取消的请求 产生的 isCancel 错误
 *      503 是瞬间 返回 毫秒级  60 ms 左右
 *      isCancel 有两种
 *            一种 超时 被axios 取消了  ，时间比较久
 *            一种前端主动取消的请求 一般很快单不一定 总之 一定小于 第一种的时长
 */

import { create_gcuuid } from "src/core/uuid/index.js";
import menu_init from "./menu_init.js";
import match_odds_Info2 from "./match_odds_Info2.js";
import get_match_base_info_by_mids from "./get_match_base_info_by_mids.js";
import get_match_list from "./get_match_list.js";
import get_match_details from "./get_match_details.js";
import get_category_list from "./get_category_list.js";
import post_date_menu from "./post_date_menu.js";
import get_home_matches from "./get_home_matches.js";
import get_matches_list from "./get_matches_list.js";

// 定义挂载点
const axios_debounce_cache = {
  // url可能会变化 因此这边 键 变化后从这里读 ,方便后面维护
  menu_init,
  match_odds_Info2,
  get_match_base_info_by_mids,
  get_match_list,
  get_match_details,
  get_category_list,
  post_date_menu,
  get_home_matches,
  get_matches_list,
};
export default axios_debounce_cache;
const axios_cancel_other = {};
//
/**
 * 限制频率url
 * @param {object} ParseUrl 解析后的url
 * @param {object} config 配置项config 的 两种情况 参数 
1.  {axios_debounce_cache_key:'menu_init'}
2.  {cancel_other:'1'}
 * @param {object} params get params| post data参数
 * @returns {signal?,uuid?,api_status?: "api_cancel"}
*/
export function compute_request_config_by_config(ParseUrl, config, params) {
  // 请求单行 ，下次请求发起 ，则取消上次请求
  if (config.axios_debounce_cache_key) {
    // 走  接口  缓存、限频、节流
    let instance = axios_debounce_cache[config.axios_debounce_cache_key];
    if (instance && instance["ENABLED"]) {
      // 如果这个接口配置了 缓存、限频、节流 策略 并且开启了
      //当开启 缓存并检查接口参数的 菜单ID
      if (instance.euid_cache_and_check && params.euid) {
        instance.euid_cache_and_check_last_euid = params.euid;
      }
      let hash_code = instance.hash_code(params);
      instance.last_request_info.send_time = new Date().getTime();
      let uuid = uid();
      instance.last_request_info.hash_code = hash_code;
      instance.last_request_info.uuid = uuid;
      instance.last_request_info.state = "going";
      let controller = new AbortController();
      // https://www.npmjs.com/package/axios#cancellation
      instance.last_request_info.controller = controller;
      // controller.abort()
      // 正常情况下 代码内 在请求之前 就要发起  axios_debounce_cache 检查
      // 然后才发起 ，然后才能走到这里 ，所以这里不做 最后一次请求的 cancel 逻辑
      // 特别是 次要玩法 tab mids 接口 会出异常
      return {
        signal: controller.signal,
        uuid: uuid,
      };
    }
    return {};
  } else if (config.cancel_other) {
    // 取消其他常规接口的请求
    let url_temp = ParseUrl["new_url_temp"];
    let old_controller = axios_cancel_other[url_temp];
    if (old_controller) {
      old_controller.abort && old_controller.abort();
    }
    let controller = new AbortController();
    axios_cancel_other[url_temp] = controller;
    // controller.abort()
    // 返回api请求取消标识，供特定操作判断
    return {
      signal: controller.signal,
      api_status: "api_cancel",
    };
  }
  return {};
}
