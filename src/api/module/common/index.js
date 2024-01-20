/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 共通api接口定义
 */


import {http} from "src/core/http/index.js";
import lodash from "lodash"

import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB: prefix,API_PREFIX_USER:prefix_ , API_PREFIX_BAT: prefix_bat} = API_PREFIX;

// 全url   获取  一般用于 视频动画域名检测
export const get_full_url = (url='') => {

  return http.get(`${url}`);
};

//联赛列表接口
export const get_tournament_list = (params, config, url = "/v1/m/tournamentMatches") => {
  return http.post(`${prefix}${url}`, params, config);
};
//赛事列表接口
export const post_match_full_list = (params) => {
  let url = "/v1/m/matchesPB"
  if(params.query){
    url += params.query;
  }
  // const queryParams = {"cuid":"508169450736300035","euid":"40003,40004,40006,40007,40008,40009,40012,40010,40015,40016,40017,40020,40021,40022,40011,40013","type":1,"sort":2,"device":"v2_h5_st","hpsFlag":0}
  return http.post(`${prefix}${url}`, { ...params }, {axios_debounce_cache_key:'post_match_full_listPB',type:2});
};

// 收藏列表 2739 需求 
export const get_new_collect_matches = (params,config,url="/v1/w/collectMatchesPB") => {
  return http.post(`${prefix}${url}`, params, config);
};


//电竞收藏赛事接口
export const post_esport_collect = (params, config, url="/v1/m/escnh5") => {
  params.collect = 1;
  return http.post(`${prefix}${url}`, params, config);
};
//电竞图片资源域名
export const get_games_imgDomain = (params, config, url="/v1/games/imgDomain") => {
  return http.get(`${prefix}${url}`, params, config);
};



//电竞列表接口
export const post_esports_match = (params, config, url = "/v1/m/esportsMatches") => {
  return http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'post_esports_match',type:2});
};
//赛果收藏
export const match_result_collect = (params, config, url = "/v1/m/matcheCollectResult") => {
  return http.post(`${prefix}${url}`, params, config);
};

//赛果
export const get_match_result_api = (params, config, url = "/v1/m/matcheResultPB") => {
  if(params.query){
    url += params.query;
  }
  return http.post(`${prefix}${url}`, params, config);
};

//根据赛事id获取赛事列表
export const get_match_base_info_by_mids = (params, config, url = "/v1/m/getMatchBaseInfoByMidsPB") => http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_match_base_info_by_mids',type:2});

//根据赛事id获取电竞赛事详情列表
export const get_esports_match_by_mids = (params, config, url = "/v1/m/esportsMatchInfoByMidsPB") => http.post(`${prefix}${url}`, params, {axios_debounce_cache_key:'get_esports_match_by_mids', type: 2});

// 更新菜单数量
export const get_menu_match_total = (params, config, url="/v1/m/menu/queryNum") => {
  params.sys = 3; //系统（1.panda-H5菜单  2.panda老PC-菜单 3.188菜单  4-新版PC菜单）
  return http.get(`${prefix}${url}`, params, config);
};












// 更新收藏列表菜单赛事数量 H5
export const get_collect_menu_count_h5 = (params, config, url="/v1/m/menu/countCollectPB") => {
  return http.post(`${prefix}${url}`, params, config);
};
// 更新收藏列表菜单赛事数量 PC 404
export const get_collect_menu_count_pc = (params, config, url="/v1/w/menu/countCollectPB") => {
  return http.post(`${prefix}${url}`, params, config);
};
//
export const collectNewH5ListBottom = (params,config,url="/v1/m/collectNewH5ListBottom") => {
  params.sys = 7; //系统（1.panda-H5菜单  2.panda老PC-菜单 3.188菜单  4-新版PC菜单   7-H5 v2.0）
  return http.get(`${prefix}${url}`, params, config);
};

//新版收藏菜单栏
export const menuForNewH5Collect = (params, config, url="/v1/m/menu/menuForNewH5Collect") => {
  let p = {}
  if(params){
    Object.assign(p,params);
  }
  p.sys = 7; //系统（1.panda-H5菜单  2.panda老PC-菜单 3.188菜单  4-新版PC菜单   7-H5 v2.0）
  return http.get(`${prefix}${url}`, p, config);
};




//视频直播菜单栏目初始化接口
export const get_menu_videos = (params, config, url = "/v2/m/menu/getMenuVideosPB") => {
  return http.get(`${prefix}${url}`, params, config);
};

//视频直播列表接口
export const get_videos = (params, config, url = "/v1/w/getVideos") => http.get(`${prefix}${url}`, params, config);

//视频直播 收藏接口
export const get_collect_live_matchs = (params, config, url = "/v1/m/getCollectLiveMatchs") => {
  return http.get(`${prefix}${url}`, params, config);
};

// 获取单场赛事视频的总时长接口
export const get_Video_MaxTime = (params, config, url = "/v1/w/virtual/getVideoMaxTime") => http.get(`${prefix}${url}`, params,config)
// 获取详情页面玩法集接口（christion）
export const get_category_list = (params, config, url = "/v1/m/category/getCategoryList") => {
  return http.get(`${prefix}${url}`, params,{axios_debounce_cache_key: 'get_category_list'});
}
// 详情页赛事结束自动切换赛事接口(业务:yk)
export const get_detail_video = (params, config, url = "/v1/w/getDetailVideo") => http.get(`${prefix}${url}`, params, config)
// 获取虚拟体育赛果页面接口
export const get_virtual_matchResult = (params,config, url = "/v1/m/matchDetail/getVirtualMatchResult") => {
  return new Promise((resolve) => {
    if(!params.mid){
      resolve(({}));
      return;
    }
    http.get(`${prefix}${url}`, params, config).then(res => {
      resolve(res);
    });
  });
};
 
/** 详情页下拉列表
 * @description 详情页下拉列表
 * @param {Object} params
 * @param {String} params.tId 联赛 id
 * @param {1|Number} [params.type] 1:赛果
 * @param {*} [config]
 * @param {*} [url]
 * @returns {Promise<API.MatchDetails>}
 */
export const get_matchDetail_getMatchDetailByTournamentId = (params, config, url = "/v1/m/matchDetail/getMatchDetailByTournamentIdPB") => http.get(`${prefix}${url}`, params, config)

// 赛事详情页面接口（christion）
export const get_matchDetail_MatchInfo = (params, config, url = "/v1/m/matchDetail/getMatchDetailPB") => http.get(`${prefix}${url}`, params, config)
/** 
 * 赛果详情页面接口（christion）
 * @returns {Promise<API.MatchDetails>}
 */
export const get_matchResultDetail_MatchInfo = (params, config, url = "/v1/m/matchDetail/getResultMatchDetailPB") => http.get(`${prefix}${url}`, params, config)

// 电竞赛事详情页面接口（start）
export const get_DJ_matchDetail_MatchInfo = (params, config, url = "/v1/m/matchDetail/getESMatchDetail") => http.get(`${prefix}${url}`, params, config)

// 根据玩法查询盘口信息
export const get_matchDetail_getMatchOddsInfo = (params, config, url = "/v1/m/matchDetail/getMatchOddsInfo1PB") => {
  return http.get(`${prefix}${url}`, params, {axios_debounce_cache_key: 'match_detail_odds_info'});
};

// 电竞 根据玩法查询盘口信息 （start）
export const get_DJ_matchDetail_getMatchOddsInfo = (params, config, url = "/v1/m/matchDetail/getESMatchOddsInfo") => {
  return http.get(`${prefix}${url}`, params, {axios_debounce_cache_key:'match_detail_odds_info'});
};

// 虚拟体育根据玩法查询盘口信息-h5
export const get_matchDetail_getVirtualMatchOddsInfo = (params, config, url = "/v1/m/matchDetail/getVirtualMatchOddsInfo") => {
  return http.get(`${prefix}${url}`, params, {axios_debounce_cache_key:'match_detail_odds_info'});
};

// 虚拟体育根据玩法查询盘口信息-pc
export const get_matchDetail_getVirtualMatchOddsInfo_pc = (params, config, url = "/v1/w/matchDetail/getVirtualMatchOddsInfo") => {
  return http.get(`${prefix}${url}`, params, {axios_debounce_cache_key:'match_detail_odds_info'});
};


// 收藏--------赛事收藏或取消
export const add_or_cancel_match = (params, config, url ="/v1/userCollection/addOrCancelMatch") => http.post(`${prefix_bat}${url}`, params, config);
// 收藏--------联赛收藏或者取消
export const add_or_cancel_tournament = (params, config, url="/v1/userCollection/addOrCancelTournament") => http.post(`${prefix_bat}${url}`, params, config);
// 收藏--------收藏列表-----参数和赛事赛程一样
export const countCollectH5 = (params, config, url="/v1/m/menu/countCollectH5") => http.get(`${prefix}${url}`,  params, config);

// v3收藏列表
export const get_collect_matches = (params,config,url="/v1/m/matchesCollectNewH5") => {
  return http.post(`${prefix}${url}`, params, config);
};

// 收藏列表
export const collectH5ListBottom = (params, config, url="/v1/m/collectH5ListBottom") => {
  return http.post(`${prefix}${url}`, params, config);
};
// 获取赛事动画或视频url值
export const videoAnimationUrl = (params, config, url="/v1/w/videoAnimationUrl") => {
  let imgDm = lodash.get(window,'env.config.oss_img_domains[0]');
  if(imgDm){
    params.imgDm = imgDm;
  }
  return http.post(`${prefix}${url}`, params, config);
}

// 获取 直播相关信息
export const getliveVideoUrl = (params, config, url="/v1/w/liveVideoUrl") => http.post(`${prefix}${url}`,params, config);


// 获取用户是否登录
export const getMatchUserIsLogin = (params, config, url="/v1/w/isLogin") => http.post(`${prefix}${url}`,params, config);

// 获取视频链接
export const getVideoReferurl = (params, config, url="/v1/w/videoReferUrl") => http.post(`${prefix}${url}?device=H5`,{  device:'H5', ...params}, config);

// 获取服务器当前时间
export const get_time_server = (params, config, url="/v1/getSystemTime/currentTimeMillis") => http.get(`${prefix}${url}`,params, config);
//投注记录页用于获取赛事是否有赛果页存在
export const existMatchResult = (params, config, url="/order/betRecord/existMatchResult") => http.get(`${prefix_bat}${url}`, params, config);
//获取虚拟体育赛果
export const get_virtual_result = (params, config, url="/v1/orderScoreResult/queryTournamentScoreResult") =>
http.post(`${prefix}${url}`,params,config);
// 获取赛事文章详情(Jeffrey)
export const getArticle = (params, config, url="/v1/art/getArticle") => http.get(`${prefix}${url}`,params, config)
// 获取赛事文章猜你喜欢接口(Jeffrey)
export const getFavoriteArticle = (params, config, url="/v1/art/getFavoriteArticle") => http.get(`${prefix}${url}`,params, config)
// 更新赛事文章浏览记录(Jeffrey)
export const  addArticleCount = (params, config, url="/v1/art/addArticleCount") => http.post(`${prefix}${url}`,params, config)

// 节日资源图片(资源配置)接口 （mack-远程）
export const queryFestivalBanner = (params, config, url = "/v2/festival/queryBanner") => http.get(`${prefix}${url}`, params, config);





//获取全局开关
export const get_access_config = (params, config={}, url = "/v1/art/getAccessConfig") => http.get(`${prefix}${url}`, params, config);

export const get_menu_init = (params, config={}, url = "/v2/w/menu/initPB") => {
  return http.get(`${prefix}${url}`, params, config);
};

// 专业版获取----主列表顶部日期菜单
export const post_date_menu = (params, config={}, url = "/v2/menu/getDateMenuListPB")=>{
  return http.post(`${prefix}${url}`, params, config);
}

// 专业版获取----主列表顶部日期菜单 有PB
export const post_date_menu_count = (params, config={}, url = "/v2/m/menu/getDateMenuCount")=>{
  return http.post(`${prefix}${url}`, params, config);
}

// 电竞日期菜单 有PB PB
export const get_esports_date_menu_count = (params, config={}, url = "/v1/w/esports/getDateMenuCountList") => {
  return http.post(`${prefix}${url}`, params, config);
};

// 电竞日期菜单
export const get_esports_date_menu = (params, config={}, url = "/v1/w/esports/getDateMenuList") => {
  return http.post(`${prefix}${url}`, params, config);
};

//虚拟体育菜单接口
export const get_virtual_menu = (params={}, config={}, url = "/v1/w/virtual/menus") => {
  return http.get(`${prefix}${url}`, params, config);
};


// 菜单实时统计玩法数量
export const post_menu_play_count = (params, config={}, url = "/v2/w/menu/queryPlayCountPB") => http.post(`${prefix}${url}`, params, config);


// 根据赛事IDs，获取赛事事件
export const match_event = (params, config={}, url = "/v1/matchevent") => http.post(`${prefix}${url}`, params, config);

// var事件提示 字段配置接口  var事件国际化
export const get_event_info = (params, config = {}, url="/v1/w/eventInfo") => {
  return http.get(`${prefix}${url}`, params);
};


// 获取最近访问的赛种
export const get_visit_sports = (params, config={}, url = "/v3/european/getVisitSports") => http.get(`${prefix}${url}`, params, config);
// 设置最近访问的赛种
export const set_visit_count = (params, config={}, url = "/v3/european/setVisitCount") => http.get(`${prefix}${url}`, params, config);