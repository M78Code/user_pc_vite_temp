/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: socket模块中需要用到的http请求api接口定义
 */

import {http} from "src/core/http/index.js";
let prefix = 'yewu11';
let project_name = window.BUILDIN_CONFIG.FINAL_TARGET_PROJECT_NAME

// 赛事详情玩法信息
export const get_socket_match_odds_info = (params, config={}, url = "/v1/w/getMatchOddsInfos") => http.post(`${prefix}${url}`, params, config);


//根据赛事id,玩法id查询盘口集合
export const get_socket_handicap_by_hid = (params, config={}, url = "/v1/w/getHandicapByHid") => http.post(`${prefix}${url}`, params, config);

// 根据赛事id 集查询赛事信息  PB
let match_base_info_url = '/v1/w/structureMatchBaseInfoByMids'
export const get_match_base_info_by_mids = (params, config={}, url = match_base_info_url) => 
{
    config.axios_debounce_cache_key = 'get_match_base_info_by_mids';
    return http.post(`${prefix}${url}`, params, config);
}


// 电竞获取单场赛事
export const get_esports_by_mids = (params, config={}, url = "/v1/w/esportsMatchInfoByMids") => 
{
    config.axios_debounce_cache_key = 'get_match_base_info_by_mids';
    return http.post(`${prefix}${url}`, params, config);
}

//根据赛事id,玩法id查询盘口集合
export const post_socket_match_odds_info = (params, config={}, url = "/v1/m/getMatchOddsInfos") => http.post(`${prefix}${url}`, params, config);