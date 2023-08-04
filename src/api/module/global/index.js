/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 全局使用接口定义
 */
import http from "src/public/utils/http/axios_warpper.js";
// 定义配置变量
let prefix = window.env.config.api.API_PREFIX_JOB;
// post1配置
export const post1 = (params, config, url ) => http.post(`${prefix}${url}`, params, config)
// get1配置
export const get1 = (params, config, url ) => http.get(`${prefix}${url}`, params, config)

