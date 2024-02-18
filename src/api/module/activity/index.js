/**
 * @FilePath: src/api/module/activity/index.js
 * 活动相关api
 */

import {http} from "src/core/http/";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_ACTIVITY: prefix } = API_PREFIX;

// prefix => yewu19

// // 获取欧洲杯活动【幸运盲盒】页面数据
export const get_activity_lucky_box_info = (params, config={}, url = "/v1/activity/getLuckyBoxIndexParam") => http.get(`${prefix}${url}`, params, config);

// // 获取欧洲杯活动【幸运盲盒】历史记录
export const get_activity_lucky_box_history = (params, config={}, url = "/v1/activity/getLuckyBoxHistory") => http.get(`${prefix}${url}`, params, config);

// // 获取欧洲杯活动【幸运盲盒】拆盒子
export const get_activity_open_lucky_box = (params, config={}, url = "/v1/activity/openLuckyBox1") => http.get(`${prefix}${url}`, params, config);

// // 获取欧洲杯活动【幸运盲盒】拆盒榜top50
export const get_activity_lucky_box_top50 = (params, config={}, url = "/v1/activity/luckyBoxTop50") => http.get(`${prefix}${url}`, params, config);

// // 获取欧洲杯活动【幸运盲盒】用户令牌数
export const get_activity_lucky_box_token_num = (params, config={}, url = "/v1/activity/user/tokenNum") => http.get(`${prefix}${url}`, params, config);

// 获取奥运活动【每日任务&成长任务】领取奖券
export const get_tokyo_receive_lottery = (params, config={}, url = "/v1/olympics/activity/receive") => http.post(`${prefix}${url}`, params, config);

// 每日任务成长任务活动列表
export const get_activity_list_details = (params, config={}, url = "/v1/activity/details") => http.post(`${prefix}${url}`, params, config);

// 活动领取记录接口
export const get_activity_receive_record = (params, config={}, url = "/v1/activity/receiveRecord") => http.post(`${prefix}${url}`, params, config);

// 成长任务用户投注数据
export const get_activity_user_betting_info = (params, config={}, url = "/v1/olympics/activity/everyWeek") => http.post(`${prefix}${url}`, params, config); 

// 获取老虎机配置
export const get_activity_slot_config = (params, config={}, url = "/slot/getSlotConfig") => http.get(`${prefix}${url}`, params, config); 

// 老虎机抽奖
export const get_activity_slot_spin = (params, config={}, url = "/slot/spin") => http.get(`${prefix}${url}`, params, config); 

// 老虎机--重置道具
export const get_activity_slot_resetprop = (params, config={}, url = "/slot/resetProp") => http.get(`${prefix}${url}`, params, config); 

// 老虎机领奖
export const get_activity_slot_get_award = (params, config={}, url = "/slot/getAward") => http.get(`${prefix}${url}`, params, config); 

// 老虎机--游戏记录查询
export const get_activity_slot_get_game_record = (params, config={}, url = "/slot/getGameRecord") => http.get(`${prefix}${url}`, params, config); 

// 老虎机--获取奖券合成配置
export const get_synth_config = (params, config={}, url = "/slot/getSynthConfig") => http.get(`${prefix}${url}`, params, config); 

// 老虎机--提升合成成功率
export const get_improve_rate = (params, config={}, url = "/slot/improveRate") => http.get(`${prefix}${url}`, params, config); 

// 老虎机--合成奖券
export const get_synth_ticket = (params, config={}, url = "/slot/synthTicket") => http.get(`${prefix}${url}`, params, config); 
