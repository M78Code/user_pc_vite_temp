
import { reactive, toRefs, onUnmounted } from "vue";


export const useGetStore = () => {


  const state = reactive({
     // 聊天室用户信息
    get_chatroom_userinfo: "",
    get_chatroom_id: "",
     // 聊天室用户信息
    get_chatroom_userinfo: "",
     // 聊天室禁言信息
    get_chatroom_mute_info: "",
  });

  const set_can_send_msg = () => {

  }
  const set_toast = () => {

  }
  const set_user_mute_info = () => {

  }
  const set_chatroom_mute_info = () => {

  }

  return {
    ...toRefs(state),
    set_can_send_msg,
    set_toast,
    set_user_mute_info,
    set_chatroom_mute_info
  };
};
