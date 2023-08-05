/*
 * @Date: 2021-09-19 22:33:15
 * @FilePath: /user-pc1/src/public/api/module/analysis/analysis.js
 * @Description: 
 * @Author: 
 */
import {http} from "src/core/http/index.js";
let prefix = window.env.config.api.API_PREFIX_JOB;

//数据、情报、赔率、对阵
export const post_getMatchAnalysiseData = (params, config={}, url = "/v1/w/matchAnalysise/getMatchAnalysiseData") => http.post(`${prefix}${url}`, params, config);

//赛况
export const get_getEventResult = (params, config={}, url = "/v1/w/matchDetail/getEventResultPB") => http.get(`${prefix}${url}`, params, config);

//阵容
export const get_lineupList = (params, config={}, url = "/v2/matchLineup/getPCMatchLineupList") => http.get(`${prefix}${url}`, params, config);

// 联赛积分接口
export const get_vs_info = (params, config={}, url = "/v2/statistics/vsInfo") => {return http.get(`${prefix}${url}`, params, config);};

// 历史对战接口
export const get_team_vs_history = (params, config={}, url = "/v2/statistics/teamVSHistory") => {return http.get(`${prefix}${url}`, params, config);};

// 历史战绩接口
export const get_team_vs_other_team = (params, config={}, url = "/v2/statistics/teamVsOtherTeam") => {return http.get(`${prefix}${url}`, params, config);};

// 赛果详情篮球赛况 (antonio)
export const get_live_event = (params, config={}, url = "/v2/statistics/liveEvent") => {return http.get(`${prefix}${url}`, params, config);};

// 赛事文章
export const get_article = (params, config={}, url = "/v1/art/getArticle") => {return http.get(`${prefix}${url}`, params, config);};
// 赛事文章压缩
export const getArticlePB = (params, config={}, url = "/v1/art/getArticlePB") => {return http.get(`${prefix}${url}`, params, config);};

// 猜你喜欢  文章列表
export const get_favorite_article = (params, config={}, url = "/v1/art/getFavoriteArticle") => {return http.get(`${prefix}${url}`, params, config);};

// 文章阅读数
export const get_article_count = (params, config={}, url = "/v1/art/addArticleCount") => {return http.post(`${prefix}${url}`, params, config);};

