/*
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 公告模块相关api定义
 */
import http from "src/public/utils/http/axios_warpper.js";
let prefix = window.env.config.api.API_PREFIX_JOB;

//获取公告跑马灯数据
export const post_marquee_data = (params, config={},url = "/v2/notice/headListPB") => http.post(`${prefix}${url}`, params, config);

//获取公告列表  
export const post_announce_list = (params, config={},url = "/v2/notice/frontListPB") => http.post(`${prefix}${url}`, params, config);
