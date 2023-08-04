/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-05 20:37:45
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-07-15 13:51:43
 * @FilePath: \user-pc-vue3\src\api\module\matches_list\index.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import axios from "src/api/common/axios.wapper.js";


//首页常规赛事列表接口(新)
export const get_home_matches = (params, config={}, url = "/yewu11/v3/m/homeMatches") => axios.post(url, params,{axios_debounce_cache_key:'get_home_matches'});

//详情页获取玩法分类接口(新)
export const get_detail_category = (params, config={}, url = "/yewu11/v1/w/category/getCategoryList") => axios.get(url, params);

//详情页获取玩法列表接口(新)
export const get_detail_list = (params, config={}, url = "/yewu11/v1/w/matchDetail/getMatchOddsInfo1") => axios.get(url, params);

//获取注单历史
export const get_order_list = (params, config={}, url = "/yewu12/order/betRecord/getOrderList") => axios.post(url, params);

//详情页获取玩法详情数据(新)
export const get_detail_data = (params, config={}, url = "/yewu11/v1/w/matchDetail/getMatchDetail") => axios.get(url, params);

// 赛种列表页接口(暂定)
export const get_matches_list = (params, config={}, url = "/yewu11/v1/m/matches") => axios.post(url, params,{axios_debounce_cache_key:'get_matches_list'});

// 详情获取动画地址接口()
export const post_video_url = (params, config={}, url = "/yewu11/v1/w/videoAnimationUrl") => {
    params.imgDm = window.env.config.oss_img_domains[0];
    return axios.post(url, params);
    }

    // 根据联赛id 获取赛事列表
export const getMatchDetailByTournamentId = (params, config={}, url = "/yewu11/v1/m/matchDetail/getMatchDetailByTournamentId") => {
    return axios.get(url, params);
    }
