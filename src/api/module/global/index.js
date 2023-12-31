/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 全局使用接口定义
 */
import {http} from "src/core/http/index.js";
// 定义配置变量 
import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
const { API_PREFIX } = BUILD_VERSION_CONFIG;
const { API_PREFIX_JOB:prefix,API_PREFIX_ACTIVITY:prefix2} = API_PREFIX;
// post1配置
export const post1 = (params, config, url ) => http.post(`${prefix}${url}`, params, config)
// get1配置
export const get1 = (params, config, url ) => http.get(`${prefix}${url}`, params, config)

