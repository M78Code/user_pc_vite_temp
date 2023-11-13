/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 筛选模块API定义
 */
import http from "project/activity/src/public/utils/http/axios_warpper.js";
let prefix = window.env.config.api.API_PREFIX_JOB;

//获取筛选数据
export const get_fetch_filter_match = (params, config = {}, url = "/v1/w/getFilterMatchListPB") => http.get(`${prefix}${url}`, params);

//获取筛选数据冠军
export const get_fetch_filter_match_winner = (params, config = {}, url = "/v1/w/getFilterOutrightMatchsPB") => http.get(`${prefix}${url}`, params);
