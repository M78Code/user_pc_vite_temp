/*
 * @Description: 埋点api接口定义
 */


import {http} from "src/core/http/index.js";
import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
const { API_PREFIX } = BUILD_VERSION_CONFIG;
const { API_PREFIX_JOB: prefix,API_PREFIX_USER:prefix_, API_PREFIX_JOB:prefix_job, API_PREFIX_BAT: prefix_bat} = API_PREFIX;
// 提交埋点数据
export const submit_event_collection = (params, config={}, url = "/v1/w/eventCollectionPB") => http.post(`${prefix_job}${url}`, params, config);


