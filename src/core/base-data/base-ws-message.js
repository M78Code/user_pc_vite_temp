import BaseData from "src/core/base-data/base-data.js";
import lodash_ from "lodash"

class BaseWsMessage {
  constructor(){
   
  }

  init(){
    this.message_fun = null
    this.run()
    setTimeout(()=>{
      this.set_menu_c5_message()
    },1000)
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

  // 一级菜单订阅 
  set_menu_c5_message() {
    let cmd_obj = {};
    cmd_obj.cmd = "C5";
    cmd_obj.cdt = "4";
    this.send_msg(cmd_obj);
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
          case 'C301':
            this.MSG_C301(data);
            break;
          default:
            break;
        }
      }
    }
  }
  // 菜单数量修改
  MSG_C301(obj) {
    BaseData.set_base_c301_change(obj.cd)
  }

}

export default new BaseWsMessage();