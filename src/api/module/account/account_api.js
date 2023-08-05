/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 用户模块相关api定义
 */

import {http} from "src/core/http/index.js";

let prefix = window.env.config.api.API_PREFIX_API;
let prefix_user = window.env.config.api.API_PREFIX_USER;

let prifix_url =  http.HTTP_UPLOAD_API;

// 注册
export const register = (params, config={}, url = "/user/register") => http.post(`${prefix_user}${url}`, params, config);

// 登录
export const login = (params, config={}, url = `/api/user/loginBak?userName=${params.userName}&terminal=${params.terminal}&merchantCode=${params.merchantCode}&timestamp=${params.timestamp}`) =>
    http.post(`${prefix}${url}`, params, config)

// 查询用户余额
export const check_balance = (params, config={}, url = "/user/amount") => http.get(`${prefix_user}${url}`, params, config);

// 根据 token 获取用户信息
export const get_user_info = (params, config={}, url = "/user/getUserInfoPB") => http.get(`${prefix_user}${url}`, params, config);

// 设置以及获取用户设置的语言
export const set_user_lang = (params, config={}, url = "/user/setUserLanguage") => http.get(`${prefix_user}${url}`, params, config);


//banner图标list查询
export const get_BannersUrl = (params, config={}, url="/v1/banner/getBannersUrl") => {
    return http.get(`${prefix_user}${url}`, params, config);
};

//存储登录用户浏览器指纹信息
export const save_finger_print = (params, config={}, url = "/user/saveFingerPrint") => http.post(`${prefix_user}${url}`, params, config);

//上报用户访问的url信息
export const upload_url_info = (params, config={}, url = "/url_info/createOrUpdate") => http.post(`${prifix_url}${url}`, params, config);

// 当时平板电脑访问时上报信息
export const upload_tablet_comput = (params, config={}, url = "/tablet_comput/create") => http.post(`${prifix_url}${url}`, params, config);
