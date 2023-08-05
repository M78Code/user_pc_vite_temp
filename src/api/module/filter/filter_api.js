/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 筛选模块API定义
 */
import {http} from "src/core/http/index.js";
let prefix = window.env.config.api.API_PREFIX_JOB;

 

//获取筛选数据冠军
export const get_fetch_filter_match_winner = (params, config = {}, url = "/v1/w/getFilterOutrightMatchsPB") => http.get(`${prefix}${url}`, params);


 

//获取筛选数据
export const get_fetch_filter_match = (params, config={}, url  = "/v1/m/getFilterMatchListNew") => http.get(`${prefix}${url}`, params, config)
//获取筛选数据
export const get_fetch_filter_match_old = (params, config={}, url  = "/v1/m/getFilterMatchListPB") => http.get(`${prefix}${url}`, params, config)
//获取赛果 虚拟赛事筛选数据
export const get_filter_match_list = (params, config={}, url  = "/v1/orderScoreResult/getFilterMatchList") => http.post(`${prefix}${url}`, params, config)
