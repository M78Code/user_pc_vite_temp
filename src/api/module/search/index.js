/*
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 搜索相关API接口定义
 */
import {http} from "src/core/http/index.js";

import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB:prefix } = API_PREFIX;

// //获取关键词联想列表
export const get_fetch_keyword_related = (params, config = {}, url  = "/v1/hotSearch/hotSelectPB") => http.get(`${prefix}${url}`, params)

//热门搜索
export const get_hot_search = (params, config = {}, url = "/v1/keyword/selectKeywordList2") => http.get(`${prefix}${url}`, params)

// /** 搜索历史记录 */
export const get_history_search = (params, config = {}, url  = "/v1/hotSearch/queryHistory") => http.get(`${prefix}${url}`, params)

// /** 清空历史记录 */
export const get_delete_history_search = (params, config = {}, url  = "/v1/hotSearch/deleteHistoryPB") => http.get(`${prefix}${url}`, params)

// // 获取赛事搜索结果
export const post_fetch_search_result = (params, config = {}, url  = "/v1/w/hotSearch/searchMatchInfo") => http.post(`${prefix}${url}`, params)

// 获取搜索结果
export const get_search_result = (params, config = {}, url  = "/v1/hotSearch/hotSelect3") => http.get(`${prefix}${url}`, params)

// 获取搜索球种
export const get_search_sport = (params, config = {}, url  = "/v1/hotSearch/getSport") => http.get(`${prefix}${url}`, params)

// 获取热推赛事
export const get_hot_push = (params, config = {}, url  = "/v1/searchSettings/getHotPush") => http.post(`${prefix}${url}`, params)

// 增加搜索记录
export const insert_history = (params, config = {}, url  = "/v1/searchSettings/insertHistory") => http.post(`${prefix}${url}`, params, config)

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
  export function get_fetch_search_history(params, config={}, url = "/v1/hotSearch/queryHistory") {
    params.isPc = 0;  //1(Pc端)  0(h5端))
    return http.get(`${prefix}${url}`, params, config)
  }
  
  
  
  
  
  
  