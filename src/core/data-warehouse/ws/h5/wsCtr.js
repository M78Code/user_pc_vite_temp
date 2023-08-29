/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: ws通信接收消息类
 */
import WsCmd from "src/core/data-warehouse/ws/h5/wsCmd.js";

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

        //模拟发送C106命令
        // var obj_106 = _.cloneDeep(json_data);
        // obj_106.cmd = WsCmd.R_CMD_BET_LIST_ODDS;
        // ws.pushWsQueueMsg(obj_106);
        break;

      case WsCmd.R_CMD_BET_LIST_ODDS:
        //注单订阅盘口状态、赔率C106
        ws.pushWsQueueMsg(json_data);

        //模拟发送C105命令
        // var obj_105 = _.cloneDeep(json_data);
        // try {   //如果是 queryLatestMarketInfo 这个接口导致的模拟触发,on 值需要做处理
        //   if(obj_105.flag_ && obj_105.cd && obj_105.cd.hls){
        //     for (const _hl of obj_105.cd.hls) {
        //       for (const ol of _hl.ol) {
        //         if (obj_105.route_ == 'category') {
        //           if (!ol.on) delete ol.on;
        //         } else {
        //           if (!_hl.hv) {  //独赢玩法
        //             delete ol.on;
        //           } else if (ol.on) { //让球或者让分类玩法带有正负号
        //             ol.onb = ol.on
        //           } else if (_hl.hv && !ol.on) {  //大小或者总分玩法
        //             ol.on = _hl.hv
        //           }
        //         }
        //       }
        //     }
        //   }
        // } catch (error) {
        //   console.error(error)
        // }
        // if(!obj_105.flag_2){  //flag_2存在时不联动触发
        //   obj_105.cmd = WsCmd.R_CMD_HANDICAP_STATUS;
        //   ws.pushWsQueueMsg(obj_105);
        // }

        break;

      case WsCmd.R_CMD_CHANGE_CATEGORY:
        // 玩法集变更C112
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

      case WsCmd.R_CMD_AMOUNT_CHANGE:
        // 用户账变C203
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
        // 根据赛事id,玩法id查询盘口集合(david)    /v1/w/getMatchOddsInfo

        // 据赛事id,玩法id,盘口id查询盘口信息(david)  /v1/w/getHandicapByHid
        break;

      case WsCmd.R_CMD_PRIMARY_SECONDARY_CHANGE:
        //主副盘变更C304
        // 主动从后台http拉取玩法的最新数据
        ws.pushWsQueueMsg(json_data);
        // 据赛事id,玩法id,盘口id查询盘口信息(david)  /v1/w/getHandicapByHid
        break;

      case WsCmd.R_CMD_TIME_DOWN:
        //倒计时补充
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_HOT_LIVE:
        //热门/直播推送
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_EARLY_SETTLE:
        // 提前结算接收指令
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_EARLY_STATUS:
        // 提前结算接收指令
        ws.pushWsQueueMsg(json_data);
        break;

      case WsCmd.R_CMD_GOAL:
        // 足球进球事件
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
  static sktClear(ws) {
    let cmd_obj = {};
    cmd_obj.cmd = 'clear';
    WsSend.sendMsg(ws, cmd_obj);
  }
  //------------------------------------------------------------------方法定义-S-------------------------------------------------------------------------------------
  // sktSendMatchStatus                   -- 发送赛状态订阅息命令C1
  // sktSendBatHandicapOdds               -- 发送注单盘口赔率命令C2
  // sktSendOrder                         -- 发送订单信息命令C3
  // sktSendEarlySettle                   -- 发送提前结算订阅命令 C21
  // sktSendInitiativePush                -- 发送主动推送开关命令C4
  // sktSendHotLive                        -- 发送热门/直播推送（C6）
  // sktCancelSend                        -- 发送取消订阅命令
  //------------------------------------------------------------------方法定义-E-------------------------------------------------------------------------------------
  // 发送赛状态订阅息命令C8
  static sktSendMatchStatus(ws, obj) {
    // {cmd: "C8", mid: "", hpid: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MATCH_C8_STATUS;
    cmd_obj.key = obj.key;
    cmd_obj.module = obj.module;
    cmd_obj.one_send = obj.one_send;
    cmd_obj.mid = obj.mid;
    cmd_obj.hpid = obj.hpid;
    cmd_obj.cufm = obj.cufm;
    if (cmd_obj.mid) {
      WsSend.sendMsg(ws, cmd_obj);
    }
  }
  // 发送赛状态订阅息命令C9
  static sktSendLeagueStatus(ws, obj) {
    // {cmd: "C9", mid: "", hpid: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MATCH_C9_STATUS;
    cmd_obj.key = obj.key;
    cmd_obj.module = obj.module;
    cmd_obj.one_send = obj.one_send;
    cmd_obj.tid = obj.tid;
    if (cmd_obj.tid) {
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
    WsSend.sendMsg(ws, cmd_obj);
  }

  // 发送订单信息命令C3
  static sktSendOrder(ws, obj) {
    // {cmd: "C3", cuid: ""}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_ORDER;
    cmd_obj.cuid = obj.cuid;
    WsSend.sendMsg(ws, cmd_obj);
  }

  // 发送提前结算订阅命令
  static sktSendEarlySettle(ws, obj) {
    // {"cmd":"C21","list":[{"hid":"142725909041383","oid":"142725909041383930"}],"requestId":"2c7cd42c97020001b7fb0688654fc2708dd5c31e"}
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_EARLY_SETTLE;
    cmd_obj.list = obj.list;
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

  // 发送热门/直播推送C6  不需要取消订阅
  static sktSendHotLive(ws, obj) {
    let cmd_obj = {
      cmd: WsCmd.S_CMD_HOT_LIVE,
    };
    Object.assign(cmd_obj, obj)
    WsSend.sendMsg(ws, cmd_obj);
  }

  // 紧急开关(C7)   不需要取消订阅
  static sktSendEmergencySwitch(ws, obj) {
    let cmd_obj = {
      cmd: WsCmd.S_CMD_EMERGENCY_SWITCH,
    };
    Object.assign(cmd_obj, obj)
    WsSend.sendMsg(ws, cmd_obj);
  }

  // 发送菜单订阅C5-菜单栏目统计(C301)
  static sktSendMenuCount(ws, obj) {
    let cmd_obj = {};
    cmd_obj.cmd = WsCmd.S_CMD_MENU_COUNT;
    cmd_obj.cdt = obj.cdt;
    WsSend.sendMsg(ws, cmd_obj);
  }

  // 取消订阅指令
  static sktCancelSend(ws, cmd) {
    // {cmd: "xxx"}
    let cmd_obj = {};
    cmd_obj.cmd = cmd;
    WsSend.sendMsg(ws, cmd_obj);
  }

  // 用于发送消息对象
  static sendMsg(ws, obj) {
    if (ws) {
      ws.sendMsg(obj);
    }
  }
}
