/*
 * @Author: Router
 * @Date: 2021-01-16 15:29:53
 * @Description: 赛果相关接口
 *
 */
import {http} from "src/core/http/index.js";
let prefix = window.env.config.api.API_PREFIX_JOB;


//详情页 里边的  精选赛事   接口调用
export const get_result_match_care_list = (params, config={}, url = "/v1/m/matcheHandpickPB") => {
  return http.post(`${prefix}${url}`, params, config);
};

//首页热门 里边的   精选赛事  接口调用
export const get_match_home_page_handpick = (params, config={}, url = "/v1/m/matchHomePageHandpickPB") => {
  return http.get(`${prefix}${url}`, params, config);
};

// 赛果详情足球赛况 (star)
export const get_event_result = (params, config={}, url = "/v1/m/matchDetail/getEventResultPB") => {
  return http.get(`${prefix}${url}`, params, config);
};

// 赛果详情篮球赛况 (antonio)
export const get_live_event = (params, config={}, url = "/v2/statistics/liveEvent") => {
  return http.get(`${prefix}${url}`, params, config);
};

// H5 详情页赛果玩法查询接口 -Mobile( Star)
export const get_match_result = (params, config={}, url = "/v1/m/matchDetail/getMatchResultPB") => {
  return http.get(`${prefix}${url}`, params, config);
};

// 获取赛果二级菜单
export const get_result_menu = (params, config={}, url = "/v2/m/menu/resultMenuPB") => {
  return http.get(`${prefix}${url}`, params, config);
};

// 赛事分析 阵容 接口
export const get_match_lineup_list = (params, config={}, url = "/v2/matchLineup/getMatchLineupList") => {
  return http.get(`${prefix}${url}`, params, config);
};


// 赛事分析 联赛积分接口
export const get_vs_info = (params, config={}, url = "/v2/statistics/vsInfo") => {
  return http.get(`${prefix}${url}`, params, config);
};

// 赛事分析 历史对战接口
export const get_team_vs_history = (params, config={}, url = "/v2/statistics/teamVSHistory") => {
  return http.get(`${prefix}${url}`, params, config);
};


// 赛事分析 历史战绩接口
export const get_team_vs_other_team = (params, config={}, url = "/v2/statistics/teamVsOtherTeam") => {
  return http.get(`${prefix}${url}`, params, config);
};

// 足球赛事分析 接口(david)
export const get_match_analysise_data = (params, config={}, url = "/v1/w/matchAnalysise/getMatchAnalysiseData") => {
  return http.post(`${prefix}${url}`, params, config);
};

//H5冠军赛果
export const get_champion_match_result_api = (params, config={}, url = "/v1/m/championMatchResult") => {
  return http.post(`${prefix}${url}`, params, config);
};

// 精彩回放（足球）
export const get_replay_football = (params, config={}, url = "/v1/w/playbackVideoUrl") => {
  return http.post(`${prefix}${url}`, params, config);
};



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
