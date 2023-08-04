/*
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育接口
 */
import http from "src/public/utils/http/axios_warpper.js";
let prefix = window.env.config.api.API_PREFIX_JOB;

// 联赛积分榜
export const post_league_ranking = (params, config={}, url  = "/v1/w/virtual/getVirtualSportTeamRanking") => http.post(`${prefix}${url}`, params, config)

// 小组赛积分榜
export const post_group_ranking = (params, config={}, url  = "/v1/w/virtual/getVirtualSportXZTeamRanking") => http.post(`${prefix}${url}`, params, config)

// 视频接口
export const post_virtual_replay = (params, config={}, url  = "/v1/w/virtualReplay") => http.post(`${prefix}${url}`, params, config)

// 获取指定批次视频时长最长的时间(s)
export const get_video_maxtime = (params, config={}, url  = "/v1/w/virtual/getVideoMaxTime") => http.get(`${prefix}${url}`, params, config)

// 赛果
export const get_match_result = (params, config={}, url  = "/v1/w/matchDetail/getVirtualMatchResult") => http.get(`${prefix}${url}`, params, config)

// 淘汰赛统计
export const get_elimination_rank = (params, config={}, url  = "/v1/w/virtual/getMatchSorce") => http.get(`${prefix}${url}`, params, config)

// 篮球比分
export const get_basketball_score = (params, config={}, url  = "/v1/w/virtual/getMatchScore") => http.post(`${prefix}${url}`, params, config)