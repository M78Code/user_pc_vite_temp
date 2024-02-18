/**
 * @Author: MasterJ
 * @Date: 2022-08-31 17:08
 * @Description 聊天室相关api
 */
import {http} from "src/core/http/index.js";

// 聊天室域名前缀
let prefix =  '/livechat-api'


// 聊天室历史消息列表
export const get_chat_history_message = (params, config={type: 1}, url = "/livechat/message/pull") => http.post(`${window.CURRENT_LIVECHAT_API}${prefix}${url}`, params, config);

// 发送消息
export const post_chat_sendmessage = (params, config={type: 1}, url = "/livechat/sendmessage") => http.post(`${window.CURRENT_LIVECHAT_API}${prefix}${url}`, params, config);

// 点赞晒单消息
export const post_chat_likemessage = (params, config={type: 1}, url = "/livechat/likemessage") => http.post(`${window.CURRENT_LIVECHAT_API}${prefix}${url}`, params, config);

// 获取聊天室信息
export const get_chatroom = (params, config={type: 1}, url = "/livechat/getchatroom") => http.post(`${window.CURRENT_LIVECHAT_API}${prefix}${url}`, params, config);

// 用户禁言信息
export const get_ban_send_info = (params, config={type: 1}, url = "/user/getbansendinfo") => http.post(`${window.CURRENT_LIVECHAT_API}${prefix}${url}`, params, config);

// 用户点赞信息
export const get_bet_like_info = (params, config={type: 1}, url = "/user/getlikeinfo") => http.post(`${window.CURRENT_LIVECHAT_API}${prefix}${url}`, params, config);

// 聊天室公告
export const post_chat_bulletin = (params, config={type: 1}, url = "/livechat/bulletin/list") => http.post(`${window.CURRENT_LIVECHAT_API}${prefix}${url}`, params, config);



// 登录聊天室(TY)
export const liveChatLogin = (params, config={}, url = "/v1/activity/liveChatLogin") => http.post(`${prefix2}${url}`, params||{}, config);

//获取晒单列表(TY)
export const roomBetRecord = (params, config={}, url = "/v1/order/getLiveOrderList") => http.post(`${prefix2}${url}`, params||{}, config);

 

 
// 发布晒单(CP)
export const shareOrder = (params, config={}, url = "/livechat/shareorder") => http.post(`${config.base_url}${url}`, params||{}, config);

 

// 获取用户聊天室VIP信息(CP)
export const getvipinfo = (params, config={}, url = "/user/getvipinfo") => http.post(`${config.base_url}${url}`, params||{}, config);

// 拉取聊天室已晒单列表(CP)
export const getSharedOrderList = (params, config={}, url = "/livechat/message/order") => http.post(`${config.base_url}${url}`, params||{}, {
  type: 1
});

 
 
 
 