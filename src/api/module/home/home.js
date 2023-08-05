/*
 * @Author:
 * @Date: 2021-04-04 11:36:39
 * @Description:
 */
import {http} from "src/core/http/index.js";
let prefix = window.env.config.api.API_PREFIX_JOB;
let prefix_12 = window.env.config.api.API_PREFIX_USER;


//菜单栏目初始化接口
export const get_menu_init = (params) => {
  params.disabled = 2;
  params.sys = 7; //系统（1.panda-H5菜单  2.panda老PC-菜单 3.188菜单  4-新版PC菜单   7-H5 v2.0）
  return http.get(`${prefix}/v1/m/menu/initPB`, params, {axios_debounce_cache_key:'menu_init'});
};

//电竞日期菜单api(jeffrey)
export const esport_date_menu_api = (params, config, url = "/v1/w/esports/getDateMenuList") => {
  params.device = 'H5';
  return http.post(`${prefix}${url}`, params, config);
};

//早盘串关动态获取日期(jeffrey)
export const post_date_menulist = (params, config, url = "/v2/menu/getDateMenuListPB") => {
  return http.post(`${prefix}${url}`, params, config);
};

//获取轮播图数据（用PC热门直播接口）
export const get_carousel_data = (params, config, url = "/v1/w/getHotMatchs") => http.get(`${prefix}${url}`, params, config);

//获取公告跑马灯数据
export const post_marquee_data = (params, config, url = "/v2/notice/headListPB") => http.post(`${prefix}${url}`, params, config);

//获取公告跑马灯数据
export const post_announce_list = (params, config, url = "/v2/notice/frontListPB") => http.post(`${prefix}${url}`, params, config);

//热门联赛-赛事菜单接口(jeffrey)
export const get_hot_list = (params, config, url = "/v2/w/menu/hotListPB") => http.get(`${prefix}${url}`, params, config);

//根据联赛id查找排行榜(antonio)
export const get_ranking_by_tournamentId = (params, config, url = "/v1/tournamentRanking/getRankingByTournamentId") => http.get(`${prefix}${url}`, params, config);

//移动端热门猜你喜欢赛事(miller)
export const hot_ulike_recommendation = (params, config, url = "/v1/m/hotUlikeRecommendationPB") => http.get(`${prefix}${url}`, params, config);
// 【后台参数】banner图标list查询（jeffrey）
export const get_bannerList = (params, config, url='/v1/banner/getBannersUrl') => {
  return http.get(`${prefix_12}${url}`, params, config);
};
