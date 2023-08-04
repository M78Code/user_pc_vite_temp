/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 搜索模块api接口定义
 */
import http from "src/public/utils/http/axios_warpper.js";
// 拿到配置url
let prefix = window.env.config.api.API_PREFIX_JOB;

//模糊搜索分类-antonio 此接口用作按下手机的搜索键后,业务端记录这条搜索记录,不用管返回数据
export const get_hotselect3 = (params, config={}, url = "/v1/hotSearch/hotSelect3PB") => {
  params.isPc = false;  //是否PC
  return http.get(`${prefix}${url}`, params, config)
}

//搜索里面的球种列表
export const get_sport = (params, config={}, url = "/v1/hotSearch/getSportPB") => http.get(`${prefix}${url}`, params, config)

//热门搜索
export const get_fetch_hot_search = (params, config={}, url = "/v1/keyword/selectKeywordList") => http.get(`${prefix}${url}`, params, config)

// 热词-------查询搜索历史
export function get_fetch_search_history(params, config={}, url = "/v1/hotSearch/queryHistoryPB") {
  params.isPc = 0;  //1(Pc端)  0(h5端))
  return http.get(`${prefix}${url}`, params, config)
}
// 热词-------删除搜索历史
export function get_remove_search_history(params, config={}, url = "/v1/hotSearch/deleteHistoryPB") {
  return http.get(`${prefix}${url}`, params, config)
}

//热词--------获得热推赛事接口
export const get_hot_push = (params, config={}, url = "/v1/searchSettings/getHotPush") => http.post(`${prefix}${url}`, params, config)

//热词--------增加搜索记录接口
export const get_insert_history = (params, config={}, url = "/v1/searchSettings/insertHistory") => http.post(`${prefix}${url}`, params, config)









