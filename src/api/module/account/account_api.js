/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 用户模块相关api定义
 */

import http from "src/core/http/axios-warpper.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB:prefix_11,API_PREFIX_USER:prefix_12} = API_PREFIX;
let prifix_url =  http.HTTP_UPLOAD_API;

 
// 登录
export const login = (params, config={}, url = `/api/user/loginBak?userName=${params.userName}&terminal=${params.terminal}&merchantCode=${params.merchantCode}&timestamp=${params.timestamp}`) =>
    http.post(`${prefix_11}${url}`, params, config)

// 查询用户余额
export const check_balance = (params, config={}, url = "/user/amount") => http.get(`${prefix_12}${url}`, params, config);

// 根据 token 获取用户信息
export const get_user_info = (params, config={}, url = "/user/getUserInfoPB") => http.get(`${prefix_12}${url}`, params, config);
// 切换简译/翻译 此接口没有PB
export const get_user_language_switch = (params, config={}, url = "/user/getUserLanguageSwitch") => http.get(`${prefix_12}${url}`, params, config);

// 设置以及获取用户设置的语言
export const set_user_lang = (params, config={}, url = "/user/setUserLanguage") => http.get(`${prefix_12}${url}`, params, config);


//banner图标list查询
export const get_BannersUrl = (params, config={}, url="/v1/banner/getBannersUrl") => {
    return http.get(`${prefix_12}${url}`, params, config);
};

//存储登录用户浏览器指纹信息
export const save_finger_print = (params, config={}, url = "/user/saveFingerPrint") => http.post(`${prefix_12}${url}`, params, config);

//上报用户访问的url信息
export const upload_url_info = (params, config={}, url = "/url_info/createOrUpdate") => http.post(`${prifix_url}${url}`, params, config);
 

//------------------欧宝版--------------S------------
//赛事收藏和取消收藏
export const post_addOrCancelMatch = (params, config, url = "/v1/w/userCollection/addOrCancelMatch") => http.post(`${prefix_11}${url}`, params, config);
//------------------欧宝版--------------E------------
 
// 当时平板电脑访问时上报信息
export const upload_tablet_comput = (params, config, url = "/tablet_comput/create") => http.post(`${prifix_url}${url}`, params, config);

//查询当前是新系统还是旧系统
export const get_UserVersion = (params, config={}, url="/user/getUserVersion") => {
  return http.get(`${prefix_12}${url}`, params, config);
};

// 记住用户选择(1 按热门 2按时间)此接口不支持PB
export const get_remember_select = (params, config, url='/user/rememberSelect') => {
  return http.post(`${prefix_12}${url}`, params, config)
};