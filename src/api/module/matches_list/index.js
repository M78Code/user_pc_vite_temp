
import { http } from "src/core/http/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { API_PREFIX = {} } = BUILDIN_CONFIG;
const { API_PREFIX_JOB: prefix, API_PREFIX_USER: prefix_12, API_PREFIX_JOB:prefix_11 } = API_PREFIX;


//首页常规赛事列表接口(新)
export const get_home_matches = (params, config={}, url = "/v3/m/homeMatchesPB") => http.post(`${prefix_11}${url}`, params,{axios_debounce_cache_key:'get_home_matches'});

//详情页获取玩法分类接口(新)
export const get_detail_category = (params, config={}, url = "/v1/w/category/getCategoryList") => http.get(`${prefix_11}${url}`, params,{axios_debounce_cache_key:'get_category_list'});

/** 详情页获取玩法列表接口(新)
 * @param {{mcid:0,newUser: 0}|K.cuid|K.mid} params
 * @returns {API.Result}
 */
export const get_detail_list = (params, config={}, url = "/v1/w/matchDetail/getMatchOddsInfo1PB") => http.get(`${prefix_11}${url}`, params,{axios_debounce_cache_key:'match_odds_Info2'});

//获取联赛数量统计(新)
export const get_leagues_list = (params, config={}, url = "/v3/european/getLeaguesPB") => http.post(`${prefix_11}${url}`, params);

//获取联赛数量统计
export const get_leagues_list_match = (params, config={}, url = "/v3/european/matchesByTidPB") => http.post(`${prefix_11}${url}`, params);

//详情页获取玩法详情数据(新)
export const get_detail_data = (params, config={}, url = "/v1/w/matchDetail/getMatchDetailPB") => http.get(`${prefix_11}${url}`, params,{axios_debounce_cache_key:'get_match_details'});

// 赛种列表页接口(暂定)
export const get_matches_list = (params, config={}, url = "/v1/m/matches") => http.post(`${prefix_11}${url}`, params,{axios_debounce_cache_key:'get_matches_list'});

/** 详情获取动画地址接口()
 *  @param {{type:"Animation"|"Video"}|K.mid} params type的其他可选值暂不清楚,可自行补充(type:"Animation"|"Video")
 */
export const post_video_url = (params, config={}, url = "/v1/w/videoAnimationUrl") => {
    params.imgDm =lodash.get(BUILDIN_CONFIG,'DOMAIN_RESULT.img_domains[0]');
    return http.post(`${prefix_11}${url}`, params);
    }

    // 根据联赛id 获取赛事列表
export const getMatchDetailByTournamentId = (params, config={}, url = "/v1/m/matchDetail/getMatchDetailByTournamentId") => {
    return http.get(`${prefix_11}${url}`, params);
    }
