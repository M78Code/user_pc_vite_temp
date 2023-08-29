import {http} from "src/core/http/index.js";
const { API_PREFIX = {}} = window.BUILDIN_CONFIG;
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
export const get_match_detail_MatchInfo = function(params, config = {}, url = "/v1/w/matchDetail/getMatchDetailPB"){
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

 
// 精彩回放相关地址
export const get_live_video_playback_info = (params, config = {}, url = "/v1/w/playbackVideoUrl") => http.post(`${prefix}${url}`, params)

// 登录聊天室
export const post_chatroom_login = (params, config={}, url = "/yewu19/v1/activity/liveChatLogin") => http.post(`${url}`, params, config);

//赛事详情页面---电竞详情比分板接口
export const get_match_detail_ESMatchInfo = (params, config = {}, url = "/v1/w/matchDetail/getESMatchDetail") => http.get(`${prefix}${url}`, params)

//赛事盘口详情---电竞玩法投注项赔率接口
export const get_match_odds_info_ES = (params, config = {}, url = "/v1/w/matchDetail/getESMatchOddsInfo") => http.get(`${prefix}${url}`, params)

//赛事盘口详情（2021-09-09 列表部分的详情调用getMatchOddsInfo2）
export const get_match_detail2 = (params, config = {}, url = "/v1/w/matchDetail/getMatchOddsInfo2PB") => http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'match_odds_Info2'})

//赛事盘口详情（2021-05-23 接口变更从getMatchOddsInfo变为getMatchOddsInfo1）
export const get_match_odds_info = (params, config = {}, url = "/v1/w/matchDetail/getMatchOddsInfo1PB") => http.get(`${prefix}${url}`, params, {...config, cancel_other: 'getMatchOddsInfo1'})

//赛事盘口详情 （视频页，调用H5接口）PB
export const get_match_detail_m = (params, config = {}, url = "/v1/m/matchDetail/getMatchOddsInfoPB") => http.get(`${prefix}${url}`, params)

 
// 置顶接口
export const get_category_playTop = (params, config, url = "/v1/m/category/playTop") => http.get(`${prefix}${url}`, params, config)

//获取直播url
export const post_video_url = (params, config = {}, url = "/v1/w/videoAnimationUrlPB") => {
  let imgDm = _.get(window,'env.config.oss_img_domains[0]');
  if(imgDm){
    params.imgDm = imgDm;
  }
  return http.post(`${prefix}${url}`, params);
}

//获取用户是否登录
export const post_check_login = (params, config = {}, url = "/v1/w/isLogin") => http.post(`${prefix}${url}`, params);

//获取视频直播 iframe 域名
export const post_video_refer = (params, config = {}, url = "/v1/w/videoReferUrlPB") => http.post(`${prefix}${url}??device=PC`, params);

 

//赛事列表页返回一场赛事信息
export const post_fetch_list_latest_match = (params, config = {}, url = "/v1/w/getLatestVideo") => {
  return http.post(`${prefix}${url}`, params);
};

//查询近期关注记录
export const get_history = (params, config = {}, url = "/v1/w/matchDetail/getVisitHistoryPB") => http.get(`${prefix}${url}`, params)

//添加近期关注
export const add_visit_history = (params, config = {}, url = "/v1/w/matchDetail/addVisitHistory") => http.get(`${prefix}${url}`, params)

 
//查询热门推荐---电竞
export const get_hots_es = (params, config = {}, url = "/v1/w/hotEsportsMatches") => http.get(`${prefix}${url}`, params)

//赛事详情页 返回一场赛事信息
export const get_fetch_detail_latest_match = (params, config = {}, url = "/v1/w/getDetailVideo") => {
  return http.get(`${prefix}${url}`, params);
}

//赛事详情
export const get_match_virtual_details = (params, config = {}, url = "/v1/w/matchDetail/getVirtualMatchDetail") => http.get(`${prefix}${url}`, params)

//玩法详情
export const get_match_virtual_plays = (params, config = {}, url = "/v1/w/matchDetail/getVirtualMatchOddsInfo") => http.get(`${prefix}${url}`, params)

// 获取vuex中投注项最新数据
export const get_bet_olds = (params, config = {}, url = "/v1/w/matchDetail/getOls") => http.get(`${prefix}${url}`, params)

 
 