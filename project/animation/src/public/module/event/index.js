/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共API接口定义
 */

import axios from "project/animation/src/public/utils/http/axios_warpper.js";
let prefix_job = '/fengkong'

export const get_event_info = (params, config = {}, url="/matchEventInfo/getList") => {
    console.warn('get_event_info')
  return axios.post(`${prefix_job}${url}`, params);
};
