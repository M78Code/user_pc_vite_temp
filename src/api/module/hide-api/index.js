/*
 * @Description: 埋点api接口定义
 */


import {http} from "src/core/http/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB: prefix,API_PREFIX_USER:prefix_, API_PREFIX_JOB:prefix_job, API_PREFIX_BAT: prefix_bat} = API_PREFIX;
// 提交埋点数据
export const submit_event_collection = (params, config={}, url = "/v1/w/eventCollectionPB") => http.post(`${prefix_job}${url}`, params, config);


