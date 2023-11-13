/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: websocket操作使用
 * 
 * 此文件  负责 接收到 socket的消息后 根据返回信息做出分流
 * 此处可能有很多的 getter setter
 *
 * 注意 ，socket  本身的 逻辑 不在这里 处理
 */

export default {
  state: {
    // websocket是否正常连接
    socket_status: "",
    socket_obj: {}
  },
  getters: {
    //获取websocket是否正常连接状态
    get_socket_status(state) {
      return state.socket_status;
    },
    get_socket_obj(state) {
      return state.socket_obj;
    }
  },
  actions: {
    //设置websocket连接状态
    set_socket_status({ commit }, status) {
      commit("set_socket_status", status);
    },
    set_socket_obj({ commit }, obj) {
      commit("set_socket_obj", obj);
    }
  },
  mutations: {
    //设置websocket连接状态
    set_socket_status(state, status) {
      state.socket_status = status;
    },
    set_socket_obj(state, obj) {
      state.socket_obj["RCMD_" + obj.cmd] = obj;
    }
  }
};
