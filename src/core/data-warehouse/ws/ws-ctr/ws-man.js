/*
 * @Author: hanmar
 * @Description: ws通信类
 */
import Ws from "./ws.js";
import WsCmd from "./ws-cmd.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
export default class WsMan {
  // WS对象
  static ws = null;
  // 设置全局桌面对象
  static win = window;
  /**
   * @Description:启动ws服务
   * @param: obj 数据体
   * @return:
   */
  static run(domain){
    let url = '';
    if(domain){
      url = domain || '';
    } else {
      // 获取默认最快域名
      url = BUILDIN_CONFIG.DOMAIN_RESULT.first_one || '';
    }
    // 组装ws地址
    url = `${url}/${BUILDIN_CONFIG.API_PREFIX.API_PREFIX_WBSOCKET}/push`;
    url = url.replace("http", "ws");
    console.log('启动ws:'+url);
    // 初始化ws  url=wss://api.mjpu9qew.com/yewuws2/push
    WsMan.ws = new Ws(url);
    WsMan.ws.ws_status_call = (ws_status, ws_status_old) => {
      let data =  {ws_status:ws_status || 0, ws_status_old:ws_status_old || 0};
      // 发送ws连接状态(0-断开,1-连接,2-断网续连状态)
      window.postMessage({event: 'WS', cmd:`WS_STATUS_CHANGE_EVENT`, data},'*');
    }
    WsMan.ws.connect();
  }
  

   /**
   * @Description:增加接收ws内部通信监听
   * @param: rev_fun 事件消息处理函数
   * @return:
   */
  static add_eventListener(rev_fun){
    // 监听message
    rev_fun && window.addEventListener("message", rev_fun);
  }

   /**
   * @Description:移除接收ws内部通信监听
   * @param: rev_fun 事件消息处理函数
   * @return:
   */
   static remove_eventListener(){
    // 移除监听message
    rev_fun && window.removeEventListener("message", rev_fun);
  }

  /**
   * @Description:销毁ws数据
   * @return:
   */
  static destroyed() {
    if (WsMan.ws) {
      // 通知服务器ws关闭
      WsMan.ws.send_msg({cmd:"C00"});
      WsMan.ws.destroy();
    }
    WsMan.ws = null;
  }

  /**
   * @Description:发送ws消息到ws服务器
   * @param: data 消息体
   * @param: type 消息标记-自定义模拟推送内部命令该值为custom
   * @return:
   */
  static send_msg(data,type) {
    if(data)
    {
      if(type){
        data.type = type;
      }
      window.postMessage({event: 'WS', cmd:`WS_MSG_SEND`, data},'*');
    }
  }

  // ws命令发送
  //------------------------------------------------------------------方法定义-S-------------------------------------------------------------------------------------
  // skt_send_match_status                  -- 发送赛状态订阅息命令C1
  // skt_send_bat_handicap_odds             -- 发送注单盘口赔率命令C2
  // skt_send_order                         -- 发送订单信息命令C3
  // skt_send_initiative_push               -- 发送主动推送开关命令C4
  // skt_send_menu                          -- 菜单推送C5
  // skt_cancel_send                        -- 发送取消订阅命令
  //------------------------------------------------------------------方法定义-E-------------------------------------------------------------------------------------
  /**
   * @Description:发送赛状态订阅息命令C8
   *  C8 参数说明
    * `cufm` 赛事列表、详细在同一页面标识，传入"m"。赛事列表、详细不同页面不需要此字段
    * `marketLevel` 0:默认行情等级，1:信用网等级
    * `list` 要订阅的赛事玩法对象
    * `mid` 赛事Id
    * `hid` 盘口Id，多个玩法Id用逗号分隔。订阅所有玩法用"*"
    * `说明:` 订阅后会推送C101,C102,C103,C105,C107,C110,C113,C114,C115,C303,C304,C305,C801
   * @param: obj 数据体
   * @return:
   */
  static skt_send_match_status(obj) {
    // {"cmd":"C8","cufm":"L","marketLevel": "0","list":[{"mid":"2225129","hpid":"*"},{"mid":"2226413","hpid":"1,2,4","level":2}]}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MATCH_STATUS;
    cmd_obj.key = obj.key;
    cmd_obj.module = obj.module;
    cmd_obj.one_send = obj.one_send;
    cmd_obj.ctr_cmd = obj.ctr_cmd;
    cmd_obj.list = obj.list;
    cmd_obj.cufm = obj.cufm;
    cmd_obj.marketLevel = obj.marketLevel;
    if (cmd_obj.list) {
      WsMan.send_msg(cmd_obj);
    }
  }

  /**
   * @Description:发送注单盘口赔率命令C2
   * @param: obj 数据体
   * @return:
   */
  static skt_send_bat_handicap_odds(obj) {
    // {cmd: "C2", hid: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_BAT_HANDICAP_ODDS;
    cmd_obj.hid = obj.hid;
    cmd_obj.mid = obj.mid;
    cmd_obj.marketLevel = obj.marketLevel;
    cmd_obj.esMarketLevel = obj.esMarketLevel;
    if (cmd_obj.hid != "" && cmd_obj.mid != "") {
      WsMan.send_msg(cmd_obj);
    }
  }

   /**
   * @Description:发送注单盘口赔率命令C21
   * @param: obj 数据体
   * @return:
   */
   static skt_send_bat_handicap_odds2(obj) {
    // {cmd: "C21", list:[{hid:"",oid:""}]}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_BAT_HANDICAP_ODDS2;
    cmd_obj.list = obj.list;
    if (cmd_obj.list) {
      WsMan.send_msg(cmd_obj);
    }
  }

  /**
   * @Description:发送订单信息命令C3
   * @param: obj 数据体
   * @return:
   */
  static skt_send_order(obj) {
    // {cmd: "C3", cuid: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_ORDER;
    cmd_obj.cuid = obj.cuid;
    WsMan.send_msg(cmd_obj);
  }

  /**
   * @Description:发送主动推送开关命令C4
   * @param: obj 数据体
   * @return:
   */
  static skt_send_initiative_push(obj) {
    // {cmd:"C4", copen: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_INITIATIVE_PUSH;
    cmd_obj.copen = obj.copen;
    WsMan.send_msg(cmd_obj);
  }
  /**
   * @Description:菜单推送(C5)
   * @param: obj 数据体
   * @return:
   */
  static skt_send_menu(obj) {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MENU;
    cmd_obj.cdt = obj.cdt;
    WsMan.send_msg(cmd_obj);
  }
  /**
   * @Description:全局开关推送(C7)
   * @param: obj 数据体
   * @return:
   */
  static skt_send_switch() {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.GLOBAL_SWITCH;
    WsMan.send_msg(cmd_obj);
  }
  /**
   * @Description:新版菜单推送(C51)
   * @param: obj 数据体
   * @return:
   */
  static skt_send_menu2(obj) {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MENU2;
    cmd_obj.cpid = obj.cpid;
    WsMan.send_msg(cmd_obj);
  }
  /**
   * @Description:热门/直播推送(C6)
   * @param: obj 数据体
   * @return:
   */
  static skt_send_hot_live(obj) {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_HOT_LIVE;
    cmd_obj.hoid = obj.hoid;
    cmd_obj.device = obj.device;
    if(cmd_obj.hoid != "") {
      WsMan.send_msg(cmd_obj);
    }
  }
  /**
   * @Description:取消订阅指令
   * @param: obj 数据体
   * @return:
   */
  static skt_cancel_send(cmd) {
    // {cmd: "xxx"}
    let cmd_obj = {};
    cmd_obj.key = 'clear';
    cmd_obj.cmd = cmd;
    WsMan.send_msg(cmd_obj);
  }
  /**
   * @Description:赛事列表接口订阅指令
   * @param: obj 数据体
   * @return:
   */
  static stk_match_list_send(obj) {
    //{"cmd":"C01","mpVO":{"euid":"30001,30002,30003,30004,30007,30005,30006,30008,30009,30010,30011","sort":1,"orpt":-1,"cpn":1,"cps":5000,"lang":"en"}}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MATCH_LIST;
    // cmd_obj.cmd = obj.cmd;
    if(obj.mpVO) {
      cmd_obj.mpVO = obj.mpVO;
    } else if(obj.empVO) { // 电竞赛事订阅
      cmd_obj.empVO = obj.empVO;
    }
    WsMan.send_msg(cmd_obj);
  }
  /**
   * @Description:联赛订阅指令
   * @param: obj 数据体
   * @return:
   */
  static skt_league_list_send(obj) {
    //{"cmd":"C9","tid":"821456,588955"}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_LEAGUE_STATUS;
    cmd_obj.tid = obj.tid;
    WsMan.send_msg(cmd_obj);
  }

}
