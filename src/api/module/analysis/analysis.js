/*
 * @Date: 2021-09-19 22:33:15
 * @FilePath: /user-pc1/src/api/module/analysis/analysis.js
 * @Description:
 * @Author:
 */
import { http } from "src/core/http/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB: prefix_11, API_PREFIX_USER: prefix_12 } = API_PREFIX;


//赛况
export const get_getEventResult = (params, config = {}, url = "/v1/w/matchDetail/getEventResultPB") => http.get(`${prefix_11}${url}`, params, config);

//阵容
export const get_lineupList = (params, config = {}, url = "/v2/matchLineup/getPCMatchLineupList") => http.get(`${prefix_11}${url}`, params, config);

// 联赛积分接口
export const get_vs_info = (params, config = {}, url = "/v2/statistics/vsInfo") => { return http.get(`${prefix_11}${url}`, params, config); };

// 历史对战接口
export const get_team_vs_history = (params, config = {}, url = "/v2/statistics/teamVSHistory") => { return http.get(`${prefix_11}${url}`, params, config); };

// 历史战绩接口
export const get_team_vs_other_team = (params, config = {}, url = "/v2/statistics/teamVsOtherTeam") => { return http.get(`${prefix_11}${url}`, params, config); };

// 赛事文章压缩
export const getArticlePB = (params, config = {}, url = "/v1/art/getArticlePB") => { return http.get(`${prefix_11}${url}`, params, config); };

//详情页 里边的  精选赛事   接口调用
export const get_result_match_care_list = (params, config = {}, url = "/v1/m/matcheHandpickPB") => {
  return http.post(`${prefix_11}${url}`, params, config);
};

//首页热门 里边的   精选赛事  接口调用
export const get_match_home_page_handpick = (params, config = {}, url = "/v1/m/matchHomePageHandpick") => {
  return http.get(`${prefix_11}${url}`, params, config);
};

// 赛果详情足球赛况 (star)
export const get_event_result = (params, config = {}, url = "/v1/m/matchDetail/getEventResult") => {
  return http.get(`${prefix_11}${url}`, params, config);
};

// 赛果详情篮球赛况 (antonio)
export const get_live_event = (params, config = {}, url = "/v2/statistics/liveEvent") => {
  return http.get(`${prefix_11}${url}`, params, config);
};

/** 
 * H5 详情页赛果玩法查询接口 -Mobile( Star)
 * @param {{mid,cuid}} params
 * @returns {API.MatchDetails}
 */
export const get_match_result = (params, config = {}, url = "/v1/m/matchDetail/getMatchResult") => {
  return http.get(`${prefix_11}${url}`, params, config);
};

// 获取赛果二级菜单
export const get_result_menu = (params, config = {}, url = "/v2/m/menu/resultMenuPB") => {
  return http.get(`${prefix_11}${url}`, { ...params, showem: 1 }, config);
};

// 赛事分析 阵容 接口
export const get_match_lineup_list = (params, config = {}, url = "/v2/matchLineup/getMatchLineupList") => {
  return http.get(`${prefix_11}${url}`, params, config);
};
// 赛果菜单接口 menuType 0 标准赛事，1冠军赛事
export const get_match_result_menu = (params, config = {}, url = "/v2/m/menu/getMatchResult") => {
  return http.get(`${prefix_11}${url}`, params, config);
};







// 足球赛事分析 接口(david)
export const get_match_analysise_data = (params, config = {}, url = "/v1/w/matchAnalysise/getMatchAnalysiseData") => {
  return http.post(`${prefix_11}${url}`, params, config);
};

//H5冠军赛果
export const get_champion_match_result_api = (params, config = {}, url = "/v1/m/championMatchResult") => {
  return http.post(`${prefix_11}${url}`, params, config);
};



//赛果获取球类
export const get_sportType = (params, config = {}, url = "/v1/orderScoreResult/querySportType") => http.get(`${prefix_11}${url}`, params, config);

//赛果联赛查询
export const post_results_pournament = (params, config = {}, url = "/v1/orderScoreResult/queryTournament") => http.post(`${prefix_11}${url}`, params, config);

//赛果联赛查询
export const post_results_order = (params, config = {}, url = "/v1/orderScoreResult/queryMatchScoreResult") => http.post(`${prefix_11}${url}`, params, config);

//赛果精彩回放查询
export const post_playback_video_url = (params, config = {}, url = "/v1/w/playbackVideoUrl") => http.post(`${prefix_11}${url}`, params, config);


