import BetData from "./bet-data-class"
import lodash_ from "lodash"

class BetWsMessage {
  constructor(){
   
  }

  init(){
    this.message_fun = null
    this.run()
  }

  /**
  * @description: 开始运行主流程
  * @param {undefined} undefined
  * @return {undefined} undefined
  */
  run(){
    if(this.message_fun){
      // 移除之前的ws消息监听
      window.removeEventListener("message",this.message_fun);
    }
    // 设置动态监听方法(多实例使用)
    this.message_fun=(obj)=>{
      this.r_ws_msg(obj);
    }
    // 增加ws消息监听
    window.addEventListener("message",this.message_fun);
  }

  set_bet_c2_message(obj){
    // {cmd: "C2", hid: ""}
    let cmd_obj = {};
    cmd_obj.cmd = "C2";
    cmd_obj.hid = obj.hid;
    cmd_obj.mid = obj.mid;
    cmd_obj.marketLevel = obj.marketLevel;
    if (cmd_obj.hid != "" && cmd_obj.mid != "") {
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
      if(data)
      {
        if(type){
          data.type = type;
        }
        window.postMessage({event: 'WS', cmd:`WS_MSG_SEND`, data},'*');
      }
    }

  r_ws_msg(obj){
    // 获取window.postMessage自定义命令
    const cmd = lodash_.get(obj, 'data.cmd');
    if(cmd == 'WS_MSG_REV'){
      // 是ws推送过来的消息
      // 获取消息数据体
      const data = lodash_.get(obj, 'data.data');
      if(data){
        // ws推送消息分流
        const ws_cmd = lodash_.get(data,'cmd')
        switch (ws_cmd) {
          case 'C105':
            this.MSG_C105(data);
            break;
          case 'C106':
            this.MSG_C106(data);
            break;
          default:
            break;
        }
      }
    }
  }
  // 赛事订阅盘口赔率变更 修改投注项变更
  MSG_C105(obj) {
    BetData.set_bet_c106_change(obj.cd)
  }
  // 投注项变更
  MSG_C106(obj) {
    BetData.set_bet_c106_change(obj.cd)
  }
}

export default new BetWsMessage();