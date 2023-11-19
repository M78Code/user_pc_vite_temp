/*
 * @Author: ledron
 * @Date: 2021-08-25
 * @Description: 活动页面相关api
 */
import http from "project/activity/src/public/utils/http/axios_warpper.js";

let prefix = window.env.config.api.API_PREFIX_ACTIVETY;
/*
 *任务所有接口
 */
//  新版活动列表接口(baylee)
export const get_details = (params, config={}, url  = "/v1/activity/details") => http.post(`${prefix}${url}`, params, config)

//  新版活动领取记录接口(baylee)
export const get_receiveRecord = (params, config={}, url  = "/v1/activity/receiveRecord") => http.post(`${prefix}${url}`, params, config)

//  每日任务和天天任务点击领取优惠券 (yk)
export const get_task_receive = (params, config={}, url  = "/v1/olympics/activity/receive") => http.post(`${prefix}${url}`, params, config)

//  用户每周每月的统计 (yk)
export const get_task_everyWeek = (params, config={}, url  = "/v1/olympics/activity/everyWeek") => http.post(`${prefix}${url}`, params, config)


/*
 *幸运盲盒所有接口
 */
//  活动3-幸运盲盒拆盒接口  (star)
export const get_open_lucky_box1 = (params, config={}, url  = "/v1/activity/openLuckyBox1") => http.get(`${prefix}${url}`, params, config)

//  活动3 历史记录 (david)
export const get_lucky_box_history = (params, config={}, url  = "/v1/activity/getLuckyBoxHistory") => http.get(`${prefix}${url}`, params, config)

//  活动3 单个玩家中奖统计 (david)
export const get_count_user_award = (params, config={}, url  = "/v1/activity/countUserAward") => http.get(`${prefix}${url}`, params, config)

//  活动3 排行榜前五十 (david)
export const get_lucky_box_top50 = (params, config={}, url  = "/v1/activity/luckyBoxTop50") => http.get(`${prefix}${url}`, params, config)

//  活动3 活动三页面参数 (david)
export const get_Lucky_box_index_param = (params, config={}, url  = "/v1/activity/getLuckyBoxIndexParam") => http.get(`${prefix}${url}`, params, config)


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