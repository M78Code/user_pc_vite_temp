import UserCtr from "src/core/user-config/user-ctr.js";
import BetData from "./bet-data-class.js"
import lodash_ from "lodash"
import WsMan from "src/core/data-warehouse/ws/ws-ctr/ws-man.js"
import { nextTick } from "vue";

let time_out = null
let time_cmd = {}

class BetWsMessage {
  constructor(){
    // ws调用次数
    this.count = 0
  }

  init(){
    this.message_fun = null
    this.run()
    setTimeout(()=>{
      this.set_bet_c3_message()
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
    if(data)
    {
      if(type){
        data.type = type;
      }
      // console.error('Ws_.ws_status',WsMan.ws.ws_status)
      // 发起订阅前 查看ws是否链接中 没有就发起订阅
      // let ws_ws = lodash_.get(WsMan,'ws',{}) || {}
      // if(ws_ws.ws_status){
      //   this.count = 0
        window.postMessage({event: 'WS', cmd:`WS_MSG_SEND`, data},'*');
      // }else{
      //   // 断线重连 
      //   if(this.count < 5){
      //     WsMan.ws.connect('vue_hidden_to_show')
      //     nextTick(()=>{
      //       this.send_msg(data,type)
      //       this.count++
      //     })
      //   }
      // }
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
          // 赛事状态
          case 'C101':
          case 'C901':
            this.MSG_C101(data)
            break;
          // 赛事阶段
          case 'C102':
            this.MSG_C102(data)
            break;
          // 赛事比分
          case 'C103':
            this.MSG_C103(data)
            break;
          // 赛事级别盘口状态  赛事移除或结束 投注项需要失效
          case 'C104':
            this.MSG_C104(data);
            break;
          // 赛事 盘口赔率推送
          // case 'C105':
          // 投注项 盘口赔率推送
          case 'C106':
           
              this.MSG_C106(data)
         

            // this.MSG_C106(data)
            break;
          // 注单状态
          case 'C201':
            this.MSG_C201(data);
            break;
          // 注单状态
          case 'C203':
            this.MSG_C203(data);
            break;
          
          default:
            break;
        }
      }
    }
  }
  // 赛事状态
  MSG_C101(obj) {
    BetData.set_bet_c101_change(obj.cd)
  }
  // 赛事阶段
  MSG_C102(obj) {
    BetData.set_bet_c102_change(obj.cd)
  }
  // 赛事比分 
  MSG_C103(obj) {
    // 赛事比分 异步更新 需要从数据仓库中取值 异步等待数据仓库 数据写入
    nextTick(()=>{
      BetData.set_bet_c103_change(obj.cd)
    })
  }
  // 赛事级别盘口状态
  MSG_C104(obj) {
    BetData.set_bet_c104_change(obj.cd)
  }
  // 赛事订阅盘口赔率变更 修改投注项变更
  // 投注项变更
  MSG_C106(obj) {
    console.error('obj.cmd',obj.cmd)
    let config = obj.cd
    config.cmd = obj.cmd
    BetData.set_bet_c106_change(config)
  }
  /**
   *  C201推动数据
   * `orderNo` 订单编号
   * `status` 订单状态(1:投注成功 2:投注失败)
   * `newTotalMaxWinAmount` 订单最高可赢金额
   * `isOddsChange` 赔率是否变更，为true时处理赔率变更集合
   * `newProcessOrder` 是否投注新流程订单 1:是 0:否
   * `tryNewProcessBet` 是否重试投注新流程订单 1:是 2:投注金额变更 0:否
   * `refuseCode` 拒单编码
   * `cuid` 用户Id
   * `preStatus` 是否提前结算状态：0:原有结算逻辑, 1:是提前结算
   * `orderStatus` 专指提前结算状态  1:通过  2:拒绝
   * 
   ***/
  MSG_C201(obj) {
    BetData.set_bet_c201_change(obj.cd)
  }
  // 投注项变更
  MSG_C203(obj) {
    UserCtr.get_balance()
  }
}

export default new BetWsMessage();