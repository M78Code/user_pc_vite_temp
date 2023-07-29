/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: ws通信接收消息类
 */
import * as _ from "lodash";
import WsCmd from "src/core/ws/wsCmd.js";

/**
 * @Description:ws接收消息类
 * @Author success
 * @Date 2020/03/02 22:32:48
 */
export class WsRev {
  /**
   * @Description:接收消息
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 22:36:31
   */
  static wsRevMsg(ws, json_data) {
    switch (json_data.cmd) {
      case WsCmd.S_CMD_HEART_BEAT:
        // 心跳包直接不处理
        break;
      case WsCmd.R_CMD_MATCH_STATUS:
        // 赛事状态C101
        ws.pushWsQueueMsg(json_data);
        break;
      case WsCmd.R_CMD_MATCH_EVNT:
        // 赛事事件C102
        json_data.cd.c_time = new Date().getTime();
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_MATCH_SCORE:
        // 赛事比分C103
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_MATCH_HANDICAP_STATUS:
        //赛事级别盘口状态C104
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_HANDICAP_STATUS:
        //盘口状态、赔率C105
        ws.pushWsQueueMsg(json_data);
        if(_.get(window.vue,'$store.getters.get_bet_list.length') || 
           _.get(window.vue,'$store.getters.get_bet_single_list.length') || 
           ($menu.menu_data.is_esports &&_.get(_.get(window.vue,'$store.getters.get_virtual_bet_list.length'))
           )) {
          //模拟发送C106命令
          // var obj_106 = _.cloneDeep(json_data);
          // obj_106.cmd = WsCmd.R_CMD_BET_LIST_ODDS;
          // ws.pushWsQueueMsg(obj_106);
        }
        break;
      case WsCmd.R_CMD_BET_LIST_ODDS:        
        //注单订阅盘口状态、赔率C106
        ws.pushWsQueueMsg(json_data);
        //模拟发送C105命令
        // var obj_105 = _.cloneDeep(json_data);
        // obj_105.cmd = WsCmd.R_CMD_HANDICAP_STATUS;
        // ws.pushWsQueueMsg(obj_105);
        break;
      
      case WsCmd.R_CMD_CHANGE_CATEGORY:
        //玩法集变更C112
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_ORDER_STATUS:
        // 订单状态C201
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_ORDER_COUNT:
        // 未结算订单数C202
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_MENU_SECTION:
        // 菜单栏目C301
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_MATCH_START:
        // 赛事开赛通知状态C302
        // ms：0、未开赛 1、开赛
        // 主动从后台http拉取赛事全量信息
        ws.pushWsQueueMsg(json_data);
        //根据赛事id查询单个赛事信息(david) /v1/w/getMatchInfoByMid
        break;

      case WsCmd.R_CMD_HANDICAP_PLAY:
        //新增玩法/盘口通知C303
        // 主动从后台http拉取玩法/盘口数据
        ws.pushWsQueueMsg(json_data);
        // 根据赛事id,玩法id查询盘口集合(david)    /v1/w/getMatchOddsInfos

        // 据赛事id,玩法id,盘口id查询盘口信息(david)  /v1/w/getHandicapByHid
        break;
      case WsCmd.R_CMD_HANDICAP_STATUS:
        // 赛事时间补充
        ws.pushWsQueueMsg(json_data);
        break;
      default:
        ws.pushWsQueueMsg(json_data);
        break;
    }
  }
}

/**
 * @Description:ws发送消息类
 * @Author success
 * @Date 2020/03/02 22:32:48
 */
export class WsSend {
  //------------------------------------------------------------------方法定义-S-------------------------------------------------------------------------------------
  // sktSendMatchStatus                   -- 发送赛状态订阅息命令C1
  // sktSendBatHandicapOdds               -- 发送注单盘口赔率命令C2
  // sktSendOrder                         -- 发送订单信息命令C3
  // sktSendInitiativePush                -- 发送主动推送开关命令C4
  // sktSendMenu                          -- 菜单推送C5
  // sktCancelSend                        -- 发送取消订阅命令
  //------------------------------------------------------------------方法定义-E-------------------------------------------------------------------------------------
  // 发送赛状态订阅息命令C8
  static sktSendMatchStatus(ws, obj) {
    // {"cmd":"C8","cufm":"L","marketLevel": "0","list":[{"mid":"2225129","hpid":"*"},{"mid":"2226413","hpid":"1,2,4","level":2}]}
    let cmd_obj = {};    
    cmd_obj.cmd = WsCmd.S_CMD_MATCH_STATUS;
    cmd_obj.key = obj.key;
    cmd_obj.module = obj.module;
    cmd_obj.one_send = obj.one_send;
    cmd_obj.list = obj.list;
    cmd_obj.cufm = obj.cufm;
    cmd_obj.marketLevel = obj.marketLevel;
    if (cmd_obj.list) {
      WsSend.sendMsg(ws, cmd_obj);
    }
  }

  // 发送注单盘口赔率命令C2
  static sktSendBatHandicapOdds(ws, obj) {
    // {cmd: "C2", hid: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_BAT_HANDICAP_ODDS;
    cmd_obj.hid = obj.hid;
    cmd_obj.mid = obj.mid;
    cmd_obj.marketLevel = obj.marketLevel;
    if (cmd_obj.hid != "" && cmd_obj.mid != "") {
      WsSend.sendMsg(ws, cmd_obj);
    }
  }

   // 发送注单盘口赔率命令C21
   static sktSendBatHandicapOdds2(ws, obj) {
    // {cmd: "C21", list:[{hid:"",oid:""}]}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_BAT_HANDICAP_ODDS2;
    cmd_obj.list = obj.list;
    if (cmd_obj.list) {
      WsSend.sendMsg(ws, cmd_obj);
    }
  }

  // 发送订单信息命令C3
  static sktSendOrder(ws, obj) {
    // {cmd: "C3", cuid: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_ORDER;
    cmd_obj.cuid = obj.cuid;
    WsSend.sendMsg(ws, cmd_obj);
  }

  // 发送主动推送开关命令C4
  static sktSendInitiativePush(ws, obj) {
    // {cmd:"C4", copen: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_INITIATIVE_PUSH;
    cmd_obj.copen = obj.copen;
    WsSend.sendMsg(ws, cmd_obj);
  }
  // 菜单推送(C5)
  static sktSendMenu(ws, obj) {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MENU;
    cmd_obj.cdt = obj.cdt;
    WsSend.sendMsg(ws, cmd_obj);
  }
  // 全局开关推送(C7) 
  static sktSendSwitch(ws) {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.GLOBAL_SWITCH;
    WsSend.sendMsg(ws, cmd_obj);
  }
  // 新版菜单推送(C51)
  static sktSendMenu2(ws, obj) {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MENU2;
    cmd_obj.cpid = obj.cpid;
    WsSend.sendMsg(ws, cmd_obj);
  }
  // 热门/直播推送(C6)
  static sktSendHotLive(ws, obj) {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_HOT_LIVE;
    cmd_obj.hoid = obj.hoid;
    cmd_obj.device = obj.device;
    if(cmd_obj.hoid != "") {
      WsSend.sendMsg(ws, cmd_obj);
    }    
  }
  // 取消订阅指令
  static sktCancelSend(ws, cmd) {
    // {cmd: "xxx"}
    let cmd_obj = {};
    cmd_obj.key = 'clear';
    cmd_obj.cmd = cmd;
    WsSend.sendMsg(ws, cmd_obj);
  }
  // 赛事列表接口订阅指令
  static stkMatchListSend(ws, obj) {
    //{"cmd":"C01","mpVO":{"euid":"30001,30002,30003,30004,30007,30005,30006,30008,30009,30010,30011","sort":1,"orpt":-1,"cpn":1,"cps":5000,"lang":"en"}}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MATCH_LIST;
    // cmd_obj.cmd = obj.cmd;
    if(obj.mpVO) {
      cmd_obj.mpVO = obj.mpVO;
    } else if(obj.empVO) { // 电竞赛事订阅
      cmd_obj.empVO = obj.empVO;
    }    
    WsSend.sendMsg(ws, cmd_obj);
  }
  // 联赛订阅指令
  static sktLeagueListSend(ws, obj) {
    //{"cmd":"C9","tid":"821456,588955"}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_LEAGUE_STATUS;
    cmd_obj.tid = obj.tid;
    WsSend.sendMsg(ws, cmd_obj);
  }
  // 用于发送消息对象
  static sendMsg(ws, obj) {
    if(ws)
    {
      ws.sendMsg(obj);
    }
  }
}
