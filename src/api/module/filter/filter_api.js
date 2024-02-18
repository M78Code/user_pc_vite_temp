/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 筛选模块API定义
 */
import {http} from "src/core/http/index.js";

 
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB:prefix,API_PREFIX_ACTIVITY:prefix2} = API_PREFIX;

//获取筛选数据冠军
export const get_fetch_filter_match_winner = (params, config = {}, url = "/v1/w/getFilterOutrightMatchsPB") => http.get(`${prefix}${url}`, params);


 

//获取筛选数据
export const get_fetch_filter_match = (params, config={}, url  = "/v1/m/getFilterMatchListNew") => http.get(`${prefix}${url}`, params, config)
//获取筛选数据
export const get_fetch_filter_match_old = (params, config={}, url  = "/v1/m/getFilterMatchListPB") => http.get(`${prefix}${url}`, params, config)
//获取赛果 虚拟赛事筛选数据
export const get_filter_match_list = (params, config={}, url  = "/v1/orderScoreResult/getFilterMatchList") => http.post(`${prefix}${url}`, params, config)

/**
 * 保存筛选数据
 * @param {*} params 
 * @param {*} config 
 * @param {*} url 
 * @returns 
 */
export const structure_tournament_matches_PB = (params, config={}, url  = "/v2/w/structureTournamentMatchesPB") => http.post(`${prefix}${url}`, params, config)

/**
 * 设置全局收藏数据格式化数据 
 * @param {*} params 
 * @param {*} config 
 * @param {*} url 
 * @returns 
 */
export const collect_matches_PB = (params, config={}, url  = "/v1/w/collectMatchesPB") => http.post(`${prefix}${url}`, params, config)

/**
 * 根据赛事id 集查询赛事信息  PB
 * @param {*} params 
 * @param {*} config 
 * @param {*} url 
 * @returns 
 */
export const structure_match_base_info_by_mids_PB = (params, config={}, url  = "/v1/w/structureMatchBaseInfoByMidsPB") => http.post(`${prefix}${url}`, params, config)


