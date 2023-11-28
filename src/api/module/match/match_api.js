/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事相关模块API定义
 */

import {http} from "src/core/http/index.js";
import axios from 'axios'

const { API_PREFIX = {},PROJECT_NAME:project_name } = window.BUILDIN_CONFIG;
const { API_PREFIX_BAT:prefix_user } = API_PREFIX;

let prefix = 'yewu11'
//赛事搜索接口
export const post_search_match = (params, config = {}, url = "/v1/hotSearch/searchMatchInfoPc2PB") => {
    return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};

// 列表滚球
export const post_fetch_match_list = (params, config = {},url="/v1/w/structureLiveMatchesPB") => {
  return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};

// 今日，早盘，串关 联赛列表
export const post_league_list = (params, config = {},url="/v1/w/structureTournamentMatches") => {
  return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};

// 冠军聚合页
export const post_champion_list = (params, config = {},url="/v1/w/outrightmatches") => {
  return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};

// 滚球电竞
export const post_fetch_esports_play_matchs = (params, config = {},url="/v1/w/esportsMatches") => {
  return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};
export const post_fetch_esports_matchs = (params, config = {},url="/v1/w/esportsTournamentMatches") => {
  return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};
// 电竞强力推荐
export const get_fetch_highly_esports_matchs = (params, config = {},url="/v1/w/highlyRecommendEsportsMatches") => {
  return http.get(`${prefix}${url}`, params);
};

/** 虚拟体育 ****************************************************************/
const VIRTUAL_MATCH_LIST ={
  // 专业版
  "yabo":"/v1/w/virtualProMatches"
}
export const post_fetch_virtual_matchs = (params, config = {},url="/v1/w/virtualMatches") => {
  return http.post(`${prefix}${VIRTUAL_MATCH_LIST[project_name]}`, params, {axios_debounce_cache_key:'get_match_list'});
};

// 获取赛事基础数据（主客队名称、logo）
export const get_simple_matches = (params, config = {},url="/v2/m/simpleMatchesPB") => {
  return http.get(`${prefix}${url}`, params);
};


// 获取有直播或动画的赛事列表
export const get_live_animate_list = (params, config = {}, url = "/v1/w/getLiveMatchs") => {
  return http.get(`${prefix}${url}`, params);
};

// 获取热门赛事
export const get_3hot_matches = (params, config = {}, url = "/v1/w/standard3HotMatches") => {
  return http.post(`${prefix}${url}`, params);
};

 

//赛事收藏列表查询接口
export const post_fetch_collect_list = (params, config = {}, url = "/v1/w/v2collectPc") => {
    return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};

//赛事收藏列表查询接口----电竞
export const post_collect_list_es = (params, config = {}, url = "/v1/w/v2collectEsSports") => {
    return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};

//赛事收藏列表数量查询接口
export const post_fetch_collect_count = (params, config = {}, url = "/v1/w/menu/countCollectTotal") => {
    return http.post(`${prefix}${url}`, params);
};

//赛事收藏列表数量查询接口----电竞
export const post_collect_count_es = (params, config = {}, url = "/v1/w/menu/escct") => {
    return http.post(`${prefix}${url}`, params);
};
export const post_fetch_collect_list_high_light = (params, config = {}, url = "/v1/w/collectMatchesPB") => {
  return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_list'});
};
//联赛收藏 | 取消收藏
export const post_collect_leagues = (params, config = {}, url = "/v1/userCollection/addOrCancelTournament") => http.post(`${prefix_user}${url}`, params);

 
//赛事详情 联赛关联的赛事
export const get_fetch_detail_match = (params, config = {}, url = "/v1/w/matchDetail/getMatchDetailByTournamentIdPB") => {
  return http.get(`${prefix}${url}`, params);
};


//获取热门联赛
export const get_hot_league_list = (params, config = {}, url="/v1/tournamentRanking/getTournamentId") => {
  return http.get(`${prefix}${url}`, params);
};
//根据联赛id获取排行榜
export const get_ranking_by_league_id = (params, config = {}, url="/v1/tournamentRanking/getRankingByTournamentId") => {
  return http.get(`${prefix}${url}`, params);
};

//获取联赛数量统计
export const get_leagues_list_match = (params, config={}, url = "/yewu11/v3/european/matchesByTidPB") => http.post(url, params);
 

//电竞右侧5场赛事列表
export const get_esports_match = (params, config = {}, url="/v1/w/5esportsMatches") => {
  return http.get(`${prefix}${url}`, params);
};

/**
 * 试玩
 * @param {*} url
 * @returns
 */
// https://api.sportxxxw1box.com/yewu6/user/tryPlay

export const handle_user_tryPlay = (url = "https://api.sportxxxw1box.com/yewu6/user/tryPlay") => {
  let params = {
    lang: "zh",
    terminal: "PC"
  };

  return http.get(url, params );
};