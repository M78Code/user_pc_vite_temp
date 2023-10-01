import { api_chatroom } from "src/project/api/index.js";
import { ref, reactive } from "vue"
const bulletin = ref(null)

const chatroom_data = reactive({
    isBlockMsg: false,  //是否屏蔽聊天消息
    list_height: null,  // 聊天室列表高度
    chatroomWs: null,
    msgList: [],   // 消息列表
    userMuteTimeOutObj: null,    // 用户禁言timeout(分钟数禁言,倒计时解除禁言判断)
    msgIntervalObj: null,   // 间隔时间拉取增量消息Obj
    hasDestroyed: false,
    bulletin_info : '', // 公告内容
    bulletin_list: [],
    is_show_bulletin_dialog: false,
  });

// 获取聊天室公共
const get_chatroom_bulletin_info = (init_load) => {
    api_chatroom.post_chat_bulletin({}, { base_url: get_chatroom_http_url })
      .then((res) => {
        if (res.code == 0 && _.get(res,'data', [])) {
          bulletin_info = ''
          res.data.forEach((item, index) => {
            bulletin_info += `<span style="margin-right: .2rem;">${index + 1}. ${item.content}</span>`
          })
          bulletin_list = res.data || []

          // 非初次获取公告时，需重新计算动画时长
          if (!init_load && bulletin_list.length) {
            bulletin.get_marquee_data()
          }

          // 不存在公告时，则隐藏公告弹窗
          if (!bulletin_list.length) {
            chatroom_data.is_show_bulletin_dialog = false
          }
        }
      })
      .catch((err) => {
        console.error(err)
      });
  };


  export default function() {
    return {
        get_chatroom_bulletin_info,
    }
  }