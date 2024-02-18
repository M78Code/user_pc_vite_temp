/*
 * @FilePath: d:/projects/user-h5/project_path/src/pages/details/components/chatroom/chatroom_mixin.js
 * @Description: 聊天室公用逻辑
 */
// import {
//   mapGetters,
//   mapMutations
// } from "vuex";
import { UserCtr } from "src/core/user-config/user-ctr.js";
export default {
  computed: {
    // ...mapGetters([
    //   'get_chatroom_userinfo', // 聊天室用户信息
    //   'get_chatroom_id'
    // ]),
    chattroom_url() {
      const {
        oss = {}
      } = (UserCtr.user_info || {});
      const {
        chatroomUrl
      } = (oss || {});
      return {
        wsUrl: chatroomUrl && chatroomUrl[0],
      }
    }
  },
  data() {
    return {
      userStandardTimeOutObj: null, // 用户能否发言条件 timeout
    }
  },
  methods: {
    // ...mapMutations([
    //   'set_can_send_msg'
    // ]),
    // 设置用户是否能发言状态
    setCanSendMsg(data) {
      // isSuper: 超级会员 isVip: 普通会员
      const {
        interval,
        sendTime,
        isSuper,
        isVip,
        time,
        limit
      } = data;
      this.set_can_send_msg(false);
      if (isSuper === "true" || isVip === "true") {
        this.set_can_send_msg(true);
      } else {
        if (time < limit) {
          const nowTS = new Date().getTime();
          const LeftCD = interval - (nowTS - sendTime); // 剩余CD时间
          if (LeftCD > 0) {
            this.userStandardTimeOutObj = setTimeout(() => {
              this.set_can_send_msg(true);
            }, LeftCD);
          } else {
            this.set_can_send_msg(true);
          }
        }
      }
    },
  },
  beforeUnmount() {
    this.userStandardTimeOutObj && clearTimeout(this.userStandardTimeOutObj);
    this.userStandardTimeOutObj = null;
  },
}
