/*
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育接口
 */

import {http} from "src/core/http/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB:prefix,API_PREFIX_USER:prefix_12} = API_PREFIX;

// 赛果
export const get_match_result = (params, config={}, url  = "/v1/w/matchDetail/getVirtualMatchResult") => http.get(`${prefix}${url}`, params, config)

// 篮球比分
export const get_basketball_score = (params, config={}, url  = "/v1/w/virtual/getMatchScore") => http.post(`${prefix}${url}`, params, config)

//玩法详情
export const get_match_virtual_plays = (params, config = {}, url = "/v1/w/matchDetail/getVirtualMatchOddsInfo") => http.get(`${prefix}${url}`, params)

 
  
  //获取虚拟赛事视频进程
  export const get_virtual_video_process = (params, config={}, url = "/v1/w/virtualReplay") => {
    return http.post(`${prefix}${url}`,params,config);
  }
  
  //获取虚拟体育赛事比分
  export const get_v_match_score_api = (params, config={}, url="/v1/w/virtual/getMatchScore") => {
    return http.post(`${prefix}${url}`,params,config);
  }
  
  //获取赛果
  export const get_virtual_match_result = (params, config={}, url = "/v1/m/virtualMatchesResult") => {
    return http.post(`${prefix}${url}`,params,config);
  }
  //虚拟体育赛事列表
  export const get_virtual_sport_list = (params, config={}, url = "/v1/m/virtualMatches") => {
    params.device = 'V1_H5';
    return http.post(`${prefix}${url}`, params, config);
  }
  
  // 虚拟赛事详情获取统计数据H5  (后端 star负责)
  export const get_virtual_match_detail_count = (params, config={}, url = "/v1/m/matchDetail/getVirtualMatchDetailCount") => http.get(`${prefix}${url}`, params, config);
  
  // 虚拟赛事详情-Mobile(Star)
  export const get_virtual_match_detail = (params, config={}, url = "/v1/m/matchDetail/getVirtualMatchDetail") => http.get(`${prefix}${url}`, params, config);
  
  // 虚拟体育联赛积分总榜 (david)
  export const get_virtual_sport_team_ranking = (params, config={}, url = "/v1/w/virtual/getVirtualSportTeamRanking") => http.post(`${prefix}${url}`, params, config);
  
  // 小组赛积分排行榜 （david）
  export const get_virtual_sport_XZ_team_ranking = (params, config={}, url = "/v1/w/virtual/getVirtualSportXZTeamRanking") => http.post(`${prefix}${url}`, params, config);
  
  // 淘汰赛积分统计（Jeffrey） tid = '2522488869376001'
  export const get_match_sorce = (params, config={}, url = "/v1/w/virtual/getMatchSorce") => http.get(`${prefix}${url}`, params, config);
  