/*
 * @FilePath: d:/projects/user-h5/project_path/src/pages/details/components/chatroom/mqtt_mixin.js
 * @Description: mqtt逻辑
 */

import {
  mapGetters,
  mapMutations
} from "vuex";
import UserCtr from "src/core/user-config/user-ctr.js";
import mqtt from 'mqtt';
import uniqid from 'uniqid';
import ChatroomMsgType from 'project_path/src/utils/ws/chatroom/chatroom_msgtype.js';

export default {
  computed: {
    ...mapGetters([
      'get_chatroom_userinfo', // 聊天室用户信息
      'get_chatroom_mute_info', // 聊天室禁言信息
    ]),
  },
  data() {
    return {
      mqttClient: null,
      merchantTopic: '',
      reconnectCount: 0, // 重连次数
    }
  },
  methods: {
    ...mapMutations([
      'set_can_send_msg',
      'set_toast',
      'set_user_mute_info',
      'set_chatroom_mute_info',

    ]),
    connectMqtt(data) {
      const {
        mqtttopic
      } = data || {};
      const options = {
        // clean session
        clean: true,
        connectTimeout: 4000, // 超时时间
        reconnectPeriod: 4000, // 重连时间间隔
        clientId: `ty_clientId_${uniqid()}`,
      }
      if (this.chattroom_url.wsUrl != "") {
        this.mqttClient = mqtt.connect(this.chattroom_url.wsUrl, options);

        this.mqttClient.on('connect', () => {
          mqtttopic && mqtttopic.forEach((topic) => {
            this.mqttClient.subscribe(topic);
          })
        });
        this.observeMsg();
        this.mqttClient.on('reconnect', () => {
          this.reconnectCount++;
          console.log(`重连次数 ${this.reconnectCount}`);
          if (this.reconnectCount > 5) {
            this.mqttClient.end();
          }
        })
      } else {
        this.set_toast({
          txt: 'mqtt地址为空!'
        });
      }
    },
    observeMsg() {
      this.mqttClient.on('message', (topic, message) => {
        try {
          const resData = JSON.parse(message.toString());
          const {
            option,
            data
          } = resData;
          console.log(message.toString());
          // 增量消息(添加消息)
          if (option == ChatroomMsgType.INCREMENT_MESSAGE && data) {
            let resMsgList = [];
            if (data instanceof Array) {
              resMsgList = [...data];
            } else {
              resMsgList = [data];
            }
            resMsgList.forEach((msgItem) => {
              const hasMsg = this.msgList.findIndex((item) => item.messageId == msgItem.messageId) != -1;
              if (!hasMsg) {
                this.msgList.push(msgItem);
              }
            });
          }
          // 更新消息
          if (option == ChatroomMsgType.UPDATE_MESSAGE && data) {
            const index = this.msgList.findIndex((item) => item.messageId == data.messageId);
            if (index != -1) {
              this.msgList.splice(index, 1, data);
            }
          }
          // 用户禁言消息
          if (option == ChatroomMsgType.USER_MUTE_MESSAGE && data) {
            const {
              userId: msgUserId
            } = data;
            const {
              userId
            } = this.UserCtr
            if (userId == msgUserId) {
              this.set_user_mute_info(data);
              this.setBanUserTimer(data);
            }
          }
          // 用户解除禁言消息
          if (option == ChatroomMsgType.USER_UNMUTE_MESSAGE && data) {
            const {
              userId: msgUserId
            } = data;
            const {
              userId
            } = this.UserCtr
            if (userId == msgUserId) {
              this.set_user_mute_info(null);
            }
          }
          // 聊天室禁言消息
          if (option == ChatroomMsgType.CHATROOM_MUTE_MESSAGE && data) {
            this.set_chatroom_mute_info({
              ...(this.get_chatroom_mute_info || {}),
              disableSpeak: 1
            });
          }
          // 聊天室解除禁言消息
          if (option == ChatroomMsgType.CHATROOM_UNMUTE_MESSAGE) {
            this.set_chatroom_mute_info({
              ...(this.get_chatroom_mute_info || {}),
              disableSpeak: 0
            });
          }
          // 聊天室清屏消息
          if (option == ChatroomMsgType.CLEAR_MESSAGE) {
            this.msgList = [];
          }
          // 商户清屏消息
          if (option == ChatroomMsgType.CLEAR_MERCHANT_MESSAGE) {
            this.msgList = [];
          }
          // 用户清屏消息
          if (option == ChatroomMsgType.CLEAR_USER_MESSAGE && data) {
            this.msgList = _.filter(this.msgList, (item) => item.userId != data);
          }
          // 聊天室撤回消息
          if (option == ChatroomMsgType.WITHDRAW_MESSAGE && data) {
            const {
              messageId
            } = data;
            const index = this.msgList.findIndex((item) => item.messageId == messageId);
            if (index != -1) {
              this.msgList.splice(index, 1);
            }
          }
          // 聊天室禁晒单消息
          if (option == ChatroomMsgType.CHATROOM_BAN_POSTBET_MESSAGE) {
            this.set_chatroom_mute_info({
              ...(this.get_chatroom_mute_info || {}),
              disableShowOrder: 1
            });
          }
          // 聊天室解除禁晒单消息
          if (option == ChatroomMsgType.CHATROOM_UNBAN_POSTBET_MESSAGE) {
            this.set_chatroom_mute_info({
              ...(this.get_chatroom_mute_info || {}),
              disableShowOrder: 0
            });
          }
          // 聊天室公告消息
          if (option == ChatroomMsgType.BULLETIN_MESSAGE) {
            // this.bulletin_info = ''
            // data.forEach((item, index) => {
            //   this.bulletin_info += `<span style="margin-right: .2rem;">${index + 1}. ${item.content}</span>`
            // })
            //
            // this.bulletin_list = data
            this.get_chatroom_bulletin_info()
          }
        } catch (e) {
          console.log(e, 'mqtt消息接收解析错误');
        }
      })
    }
  },
  beforeDestroy() {
    this.mqttClient && this.mqttClient.end();
  },
}
