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


import menu_init from "project/activity/src/utils/http/module/menu_init.js"
import match_odds_Info2 from "project/activity/src/utils/http/module/match_odds_Info2.js"
import get_match_base_info_by_mids from "project/activity/src/utils/http/module/get_match_base_info_by_mids.js"
import get_match_list from "project/activity/src/utils/http/module/get_match_list.js"
import get_match_details from "project/activity/src/utils/http/module/get_match_details.js"
import get_category_list from "project/activity/src/utils/http/module/get_category_list.js"

// 定义挂载点
const  axios_debounce_cache={
  // url可能会变化 因此这边 键 变化后从这里读 ,方便后面维护
  menu_init,
  match_odds_Info2,
  get_match_base_info_by_mids,
  get_match_list,
  get_match_details,
  get_category_list
}

//挂载 window
window.axios_debounce_cache =axios_debounce_cache










export default axios_debounce_cache


