import axios from "project/animation/src/public/utils/http/axios_warpper.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX = {}} = BUILDIN_CONFIG;
const { API_PREFIX_JOB: prefix,API_PREFIX_USER:prefix_, API_PREFIX_JOB:prefix_job, API_PREFIX_BAT: prefix_bat} = API_PREFIX;
// 赛事详情页面接口（christion）
export const get_matchDetail_MatchInfo = (params, config, url = "/v1/m/matchDetail/getMatchDetail") => axios.get(`${prefix_job}${url}`, {params}, config)

// 根据 token 获取用户信息
export const get_user_info = (params, config={}, url = "/user/getUserInfo") => axios.get(`${prefix_}${url}`, {params}, config);