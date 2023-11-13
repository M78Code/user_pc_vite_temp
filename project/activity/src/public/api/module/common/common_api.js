/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共API接口定义
 */

import http from "project/activity/src/public/utils/http/axios_warpper.js";
let prefix_job = window.env.config.api.API_PREFIX_JOB;
let prefix_file = window.env.config.api.API_PREFIX_FILE_REA
// 项目名称
let project_name = window.env.config.FINAL_TARGET_PROJECT_NAME;

//获取全局开关
export const get_access_config = (params, config={}, url = "/v1/art/getAccessConfig") => http.get(`${prefix_job}${url}`, params, config);

export const get_menu_init = (params, config={}, url = "/v2/w/menu/initPB") => {
  return http.get(`${prefix_job}${url}`, params, config);
};

// 专业版获取----主列表顶部日期菜单
export const post_date_menu = (params, config={}, url = "/v2/menu/getDateMenuListPB")=>{
  return http.post(`${prefix_job}${url}`, params, config);
}

//从服务器获取时间戳
export const get_server_time = (params, config={}, url = "/v1/getSystemTime/currentTimeMillis") => http.get(`${prefix_job}${url}`, params, config);