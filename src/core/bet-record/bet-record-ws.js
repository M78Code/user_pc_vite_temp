import lodash from "lodash"
import UserCtr from "src/core/user-config/user-ctr.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import WsMan from "src/core/data-warehouse/ws/ws-ctr/ws-man.js"
import { nextTick } from "vue";

export default class BetRecordWs {
    constructor() {
        // ws调用次数
        this.count = 0
        this.message_fun = null
        this.run()
        setTimeout(()=>{
            this.set_bet_c3_message()
        }, 1000)
    }
    /**
    * @description: 开始WS
    * @param {undefined} undefined
    * @return {undefined} undefined
    */
    run() {
        if (this.message_fun) {
            // 移除之前的ws消息监听
            window.removeEventListener("message", this.message_fun);
        }
        // 设置动态监听方法(多实例使用)
        this.message_fun = (obj) => {
            this.r_ws_msg(obj);
        }
        // 增加ws消息监听
        window.addEventListener("message", this.message_fun);
    }

    // 订单订阅
  set_bet_c3_message() {
    let cmd_obj = {};
    cmd_obj.cmd = "C3";
    cmd_obj.cuid = UserCtr.get_cuid()
    if (cmd_obj.cuid) {
     this.send_msg(cmd_obj);
    }
  }

    /**
   * @Description:发送ws消息到ws服务器
   * @param: data 消息体
   * @param: type 消息标记-自定义模拟推送内部命令该值为custom
   * @return:
   */
    send_msg(data,type) {
      if(data) {
        if(type){
          data.type = type;
        }
        // 发起订阅前 查看ws是否链接中 没有就发起订阅
        // if(WsMan.ws.ws_status){
        //     this.count = 0
            window.postMessage({event: 'WS', cmd:`WS_MSG_SEND`, data},'*');
        // } else {
            // 断线重连 
        //     if(this.count < 5){
        //         WsMan.ws.connect('vue_hidden_to_show')
        //         nextTick(()=>{
        //             this.send_msg(data,type)
        //             this.count++
        //         })
        //     }
        // }
      }
    }
    /**
     * @description: ws消息监听
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    r_ws_msg(obj) {
        // 获取window.postMessage自定义命令
        const cmd = lodash.get(obj, 'data.cmd');
        if (cmd == 'WS_MSG_REV') {
            // 是ws推送过来的消息
            // 获取消息数据体
            const data = lodash.get(obj, 'data.data');
            if (data) {
                // ws推送消息分流
                const ws_cmd = lodash.get(data, 'cmd')
                switch (ws_cmd) {
                    case 'C201':
                        useMittEmit(MITT_TYPES.EMIT_C201_HANDLE_BET_RECORD, data.cd)
                        break;
                    case 'C210':
                        // useMittEmit(MITT_TYPES.EMIT_C210_HANDLE, data)
                        break;
                    default:
                        break;
                }
            }
        }
    }
    /**
     * @description: 销毁函数-清除所有数据和对象
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    destroy() {
        // 移除ws消息监听
        window.removeEventListener("message", this.message_fun);
    }
}
