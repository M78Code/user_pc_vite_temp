import { UserCtr } from "src/output/module/global-common.js";
import {http} from "src/core/http/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB:prefix,API_PREFIX_ACTIVITY:prefix2} = API_PREFIX;
const prefix3 =  '/livechat-api';

// 上次调详情接口的时间
let pre_get_match_detail_time = 0
// 上次调详情接口结果
let pre_get_match_detail_res = null
// 上次调详情接口参数
let pre_detail_params = {}


// 全url   获取  一般用于 视频动画域名检测
export const get_full_url = (url='') => {

  return http.get(`${url}`);
};


// 获取详情页面玩法集接口
export const get_category_list = (params, config = {}, url = "/v1/w/category/getCategoryList") => http.get(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_category_list'})

//赛事详情页比分板接口
export const get_match_detail_MatchInfo = function(params, config = {}, url = "/v1/w/matchDetail/getMatchDetail"){
  let now_time = new Date().getTime()
  // 如果和上次调用mid一样 并且两次调接口时间间隔小于100毫秒 使用上次接口结果
  if(params.mid == pre_detail_params.mid && (now_time - pre_get_match_detail_time) < 100){
    return pre_get_match_detail_res
  }
  pre_detail_params = params
  pre_get_match_detail_time = now_time
  pre_get_match_detail_res = http.get(`${prefix}${url}`, params)
  return pre_get_match_detail_res
}

//赛事详情页面---电竞详情比分板接口
export const get_match_detail_ESMatchInfo = (params, config = {}, url = "/v1/w/matchDetail/getESMatchDetail") => http.get(`${prefix}${url}`, params)

//赛事盘口详情---电竞玩法投注项赔率接口
export const get_match_odds_info_ES = (params, config = {}, url = "/v1/w/matchDetail/getESMatchOddsInfo") => http.get(`${prefix}${url}`, params)

//赛事盘口详情（2021-09-09 列表部分的详情调用getMatchOddsInfo2）
export const get_match_detail2 = (params, config = {}, url = "/v1/w/matchDetail/getMatchOddsInfo2") => http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'match_odds_Info2'})

//赛事盘口详情（2021-05-23 接口变更从getMatchOddsInfo变为getMatchOddsInfo1）
export const get_match_odds_info = (params, config = {}, url = "/v1/w/matchDetail/getMatchOddsInfo1") => http.get(`${prefix}${url}`, params, {...config, cancel_other: 'getMatchOddsInfo1'})

//赛事盘口详情 （视频页，调用H5接口）PB
export const get_match_detail_m = (params, config = {}, url = "/v1/m/matchDetail/getMatchOddsInfoPB") => http.get(`${prefix}${url}`, params)

/** 玩法置顶 应该和get_category_playTop一样
 * @param {Object} params
 * @param {1|0} params.status 置顶状态 1标识当前置顶，请求取消置顶;0请求置顶
 * @param {String} params.playId 玩法ID
 * @param {String} params.matchId 赛事ID
 * @param {String} params.topKey topKey字段
 * @param {String} [params.cuid] 用户ID, 为什么不直接在接口函数中中获取用户ID呢?还要传一遍
 */
export const set_playTop = (params, config = {}, url = "/v1/m/category/playTop") => http.get(`${prefix}${url}`, params)
/** 置顶接口(明明是个设置状态的接口却以get开头)
 * @param {Object} params
 * @param {1|0} params.status 置顶状态 1标识当前置顶，请求取消置顶;0请求置顶
 * @param {String} params.playId 玩法ID
 * @param {String} params.matchId 赛事ID
 * @param {String} params.topKey topKey字段
 * @param {String} [params.cuid] 用户ID, 为什么不直接在接口函数中中获取用户ID呢?还要传一遍
 */
export const get_category_playTop = (params, config = {}, url = "/v1/m/category/playTop") => {
  params.cuid = params.cuid || UserCtr.get_uid()
  return http.get(`${prefix}${url}`, params, config)
}

//获取视频直播 iframe 域名
export const post_video_refer = (params, config = {}, url = "/v1/w/videoReferUrl") => http.post(`${prefix}${url}??device=PC`, params);

 

//赛事列表页返回一场赛事信息
export const post_fetch_list_latest_match = (params, config = {}, url = "/v1/w/getLatestVideo") => {
  return http.post(`${prefix}${url}`, params);
};

//查询近期关注记录
export const get_history = (params, config = {}, url = "/v1/w/matchDetail/getVisitHistoryPB") => http.get(`${prefix}${url}`, params)

//添加近期关注
export const add_visit_history = (params, config = {}, url = "/v1/w/matchDetail/addVisitHistory") => http.get(`${prefix}${url}`, params)


//查询热门推荐
export const get_hots = (params, config = {}, url = "/v1/m/hotUlikeRecommendationPB?isHot=101") => http.get(`${prefix}${url}`, params)
 
//查询热门推荐---电竞
export const get_hots_es = (params, config = {}, url = "/v1/w/hotEsportsMatches") => http.get(`${prefix}${url}`, params)

//赛事详情
export const get_match_virtual_details = (params, config = {}, url = "/v1/w/matchDetail/getVirtualMatchDetail") => http.get(`${prefix}${url}`, params)

// 获取vuex中投注项最新数据
export const get_bet_olds = (params, config = {}, url = "/v1/w/matchDetail/getOls") => http.get(`${prefix}${url}`, params)

 
 