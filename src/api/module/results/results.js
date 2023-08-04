/*
 * @Author: Yellow
 * @Date: 2020-08-04 17:14:23
 * @Description: 赛果模块相关API定义
 */
import http from "src/public/utils/http/axios_warpper.js";
let prefix = window.env.config.api.API_PREFIX_JOB;

//赛果获取球类
export const get_sportType = (params, config={}, url  = "/v1/orderScoreResult/querySportType") => http.get(`${prefix}${url}`, params, config);

//赛果联赛查询
export const post_results_pournament = (params, config={}, url  = "/v1/orderScoreResult/queryTournament") => http.post(`${prefix}${url}`, params, config);

//赛果联赛查询
export const post_results_list = (params, config={}, url  = "/v1/orderScoreResult/queryTournamentScoreResult") => http.post(`${prefix}${url}`, params, config);

//赛果联赛查询
export const post_results_order = (params, config={}, url  = "/v1/orderScoreResult/queryMatchScoreResult") => http.post(`${prefix}${url}`, params, config);

//赛果精彩回放查询
export const post_playback_video_url = (params, config={}, url  = "/v1/w/playbackVideoUrl") => http.post(`${prefix}${url}`, params, config);
