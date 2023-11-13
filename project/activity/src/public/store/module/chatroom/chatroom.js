/*
 * @Description: 聊天室相关信息存储
 */
export default {
  state: {
    chatroom_id: '', // 聊天室ID
    chatroom_available: 0, // 聊天室是否开启 1 开 0 关
    chatroom_connect_info: {}, // 聊天室连接 相关信息
    chatroom_curr_url_info: { // 聊天室当前在用url链接下标
      api_index: 0, // api
      mqtt_index: 0 // mqtt
    }
  },
  getters: {
    get_chatroom_id(state) {
      return state.chatroom_id;
    },
    get_chatroom_available(state) {
      return state.chatroom_available;
    },
    get_chatroom_connect_info(state) {
      return state.chatroom_connect_info;
    },
    get_chatroom_curr_url_info(state) {
      return state.chatroom_curr_url_info;
    },
  },
  mutations: {
    set_chatroom_id(state, val) {
      state.chatroom_id = val;
    },
    set_chatroom_available(state, val) {
      state.chatroom_available = val;
    },
    set_chatroom_connect_info(state, val) {
      state.chatroom_connect_info = val;
    },
    set_chatroom_curr_url_info(state, val) {
      state.chatroom_curr_url_info = val;
    },
  }
}
