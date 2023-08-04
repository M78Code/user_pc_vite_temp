/**
 * @Author: MasterJ
 * @Date: 2022-08-31 17:08
 * @Description 聊天室相关api
 */
import http from "src/public/utils/http/axios_warpper.js";

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

// 发送消息(CP)
export const sendMessage = (params, config={}, url = "/livechat/sendmessage") => http.post(`${config.base_url}${url}`, params||{}, {
  type: 1
});


// 点赞消息(CP)
export const likeMessage = (params, config={}, url = "/livechat/likemessage") => http.post(`${config.base_url}${url}`, params||{}, {
  type: 1
});

// 发布晒单(CP)
export const shareOrder = (params, config={}, url = "/livechat/shareorder") => http.post(`${config.base_url}${url}`, params||{}, config);

// 拉取全量、增量消息(messageId为空为全量，不为空则拉取messageId之后的消息.)(CP)
export const pullMsgList = (params, config={}, url = "/livechat/message/pull") => http.post(`${config.base_url}${url}`, params||{}, {
  type: 1
});

// 获取用户聊天室VIP信息(CP)
export const getvipinfo = (params, config={}, url = "/user/getvipinfo") => http.post(`${config.base_url}${url}`, params||{}, config);

// 拉取聊天室已晒单列表(CP)
export const getSharedOrderList = (params, config={}, url = "/livechat/message/order") => http.post(`${config.base_url}${url}`, params||{}, {
  type: 1
});

// 获取用户禁言信息(CP)
export const getbansendinfo = (params, config={}, url = "/user/getbansendinfo") => http.post(`${config.base_url}${url}`, params||{}, config);

// 获取用户点赞信息(CP)
export const getlikeinfo = (params, config={}, url = "/user/getlikeinfo") => http.post(`${config.base_url}${url}`, params||{}, config);

// 获取聊天室信息(主要用户获取全体禁言)(CP)
export const getchatroom = (params, config={}, url = "/livechat/getchatroom") => http.post(`${config.base_url}${url}`, params||{}, {
  type: 1
});

// 获取聊天室公告信息
export const get_bulletin_info = (params, config={}, url = "/livechat/bulletin/list") => http.post(`${config.base_url}${url}`, params||{}, {
  type: 1
});


