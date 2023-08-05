/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 用户操作api接口定义
 */
import {http} from "src/core/http/index.js";

let prefix = window.env.config.api.API_PREFIX_USER;
let prifix_url =  http.HTTP_UPLOAD_API;

// 注册接口
export const post_register = (params, config, url = "/user/register") => http.post(`${prefix}${url}`, params, config);
// 查询余额
export const get_amount = ((params, config, url = "/user/amount") => {
  return http.get(`${prefix}${url}`, params, config);
});
//------------------欧宝版--------------S------------
//赛事收藏和取消收藏
export const post_addOrCancelMatch = (params, config, url = "/v1/w/userCollection/addOrCancelMatch") => http.post(`${prefix}${url}`, params, config);
//------------------欧宝版--------------E------------

// 通过用户token获取用户信息
export const get_user_info_bytoken = (params, config, url='/user/getUserInfo') => {
  return http.get(`${prefix}${url}`, params, config);
};
// 存储登录用户浏览器指纹信息 (cruise)
export const post_saveFingerPrint = (params, config, url='/user/saveFingerPrint') => {
  return http.post(`${prefix}${url}`, params, config);
};
// 设置用户语言 (valar)
export const get_set_user_language = (params, config, url='/user/setUserLanguage') => {
  return http.get(`${prefix}${url}`, params, config)
};

//上报用户访问的url信息
export const upload_url_info = (params, config, url = "/url_info/createOrUpdate") => http.post(`${prifix_url}${url}`, params, config);

// 当时平板电脑访问时上报信息
export const upload_tablet_comput = (params, config, url = "/tablet_comput/create") => http.post(`${prifix_url}${url}`, params, config);
