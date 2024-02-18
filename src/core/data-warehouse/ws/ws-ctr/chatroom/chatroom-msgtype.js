/*
 * @Author: Masterj
 * @Date: 2022-10-03 14:33:28
 * @Description: 聊天室推送类型
 */

const ChatroomMsgType = {
  // 心跳消息
  HEART_MESSAGE: '0',
  // 全量消息
  FULL_MESSAGE: '1',
  // 增量消息
  INCREMENT_MESSAGE: '2',
  // 更新消息
  UPDATE_MESSAGE: '3',
  // 撤回消息
  RECALL_MESSAGE: '4',
  // 清屏消息
  CLEAR_MESSAGE: '5',
  //商户清屏消息
  CLEAR_MERCHANT_MESSAGE: '6',
  //用户清屏消息
  CLEAR_USER_MESSAGE: '7',
  // 用户禁言
  BAN_SEND_MESSAGE: '11',
  // 禁晒单
  BAN_SHARE_MESSAGE: '12',
  // 用户解除禁言
  UNBAN_SEND_MESSAGE: '13',
  // 解除禁晒单
  UNBAN_SHARE_MESSAGE: '14',
  // 聊天室禁言
  BAN_ROOM_SEND_MESSAGE: '15',
  // 聊天室禁晒单
  BAN_ROOM_SHARE_MESSAGE: '16',
  // 聊天室解除禁言
  UNBAN_ROOM_SEND_MESSAGE: '17',
  // 聊天室解除禁晒单
  UNBAN_ROOM_SHARE_MESSAGE: '18',
  // 聊天室公告更新
  BULLETIN_MESSAGE: "19",
}

export default ChatroomMsgType;
