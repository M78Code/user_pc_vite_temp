/*
 * @FilePath: d:/projects/user-h5/project_path/src/pages/details/components/chatroom/chatroom_mixin.js
 * @Description: 聊天室公用逻辑
 */
  import UserCtr from "src/core/user-config/user-ctr.js";
  import { api_chatroom } from "src/api/index.js";
  import axios from "axios";

  const axios_instance = axios.create()

  class ChatroomClass {
    constructor() {
        this.init()
    }
    init() {
        msgType = {
            // 普通消息
            normal: 1, 
            // 注单消息
            bet: 2, 
        },
        muteType = {
            // 未禁言
            unmute: 0, 
            // 个人被禁言
            self_mute: 1, 
            // 全体禁言
            global_mute: 2, 
        },
        // 用户能否发言条件 timeout
        userStandardTimeOutObj = null,
        // 能否发送消息(主要为了判断未达标用户的发言条件)
        can_send_msg = false,
        //公告消息列表
        bulletin_list = []
    }
    get_valid_api(user_info) {
        const {
            oss = {}
        } = (user_info || {});
        const {
            chatroomHttpUrl: domainPools,
        } = (oss || {});
        const promiseList = []
        // const domainPools = ['https://blog.csdn.net', 'https://www.ggg.net/', 'http://test-livechat-api.emkcp.com']
        const checkApiStr = '/livechat-api/user/getvipinfo'
        domainPools.forEach((domain) => {
            promiseList.push(axios_instance.post(`${domain}${checkApiStr}`, {
            timeout: 10000,
            }))
        })
        return new Promise((resolve, reject) => {
            Promise.any(promiseList)
            .then((res) => {
                resolve(res.config.url.replace(checkApiStr, '') + '/livechat-api')
            })
            .catch((error) => {
                reject(error)
            });
        })
    }
    /**
     * @description 获取聊天室公告
     * @returns 
     */
    get_chat_bulletin(){
        try {
          let bulletin =  api_chatroom.post_chat_bulletin({})
          this.bulletin_list = _.get(bulletin,'data.data',[])
        } catch (error) {
            console.log('object :>> ', error);
        }
      }
      // 获取聊天室URL
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
        this.can_send_msg = false;
        if (isSuper == "true" || isVip == "true") {
          this.can_send_msg = true;
        } else {
          if (time < limit) {
            const nowTS = new Date().getTime();
            const LeftCD = interval - (nowTS - sendTime); // 剩余CD时间
            if (LeftCD > 0) {
              this.userStandardTimeOutObj = setTimeout(() => {
                this.can_send_msg = true;
              }, LeftCD);
            } else {
                this.can_send_msg = true;
            }
          }
        }
      }
      clear_timeout() {
        this.userStandardTimeOutObj && clearTimeout(this.userStandardTimeOutObj);
        this.userStandardTimeOutObj = null;
      }
  }