/*
 * @Author: hanmar
 * @Description: ws通信接收消息类
 */
import WsCmd from "./ws-cmd.js";
/**
 * @Description:ws接收消息类
 */
import { useMittEmit,MITT_TYPES } from "src/output/index";
export class WsRev {
  /**
   * @Description:接收消息
   * @param: ws WS类实例
   * @param: json_data 数据体
   * @return:
   */
  static ws_rev_msg(ws,json_data) {
    // console.error('sws_rev_msgs,',ws,json_data)
    switch (json_data.cmd) {
      case WsCmd.S_CMD_HEART_BEAT:
        // 心跳包直接不处理
        break;
      case WsCmd.R_CMD_MATCH_STATUS:
        // 赛事状态C101
        ws.push_ws_queue_msg(json_data);
        break;
      case WsCmd.R_CMD_MATCH_EVNT:
        // 赛事事件C102
        json_data.cd.c_time = new Date().getTime();
        ws.push_ws_queue_msg(json_data);
        break;

      case WsCmd.R_CMD_MATCH_SCORE:
        // 赛事比分C103
        ws.push_ws_queue_msg(json_data);
        break;

      case WsCmd.R_CMD_MATCH_HANDICAP_STATUS:
        //赛事级别盘口状态C104
        ws.push_ws_queue_msg(json_data);
        break;

      case WsCmd.R_CMD_HANDICAP_STATUS:
        //盘口状态、赔率C105
        ws.push_ws_queue_msg(json_data);
        break;
      case WsCmd.R_CMD_BET_LIST_ODDS:
        //注单订阅盘口状态、赔率C106
        ws.push_ws_queue_msg(json_data);
        break;

      case WsCmd.R_CMD_CHANGE_CATEGORY:
        //玩法集变更C112
        ws.push_ws_queue_msg(json_data);
        break;

      case WsCmd.R_CMD_ORDER_STATUS:
        // 订单状态C201
        ws.push_ws_queue_msg(json_data);
        break;

      case WsCmd.R_CMD_ORDER_COUNT:
        // 未结算订单数C202
        ws.push_ws_queue_msg(json_data);
        break;

      case WsCmd.R_CMD_MENU_SECTION:
        // 菜单栏目C301
        ws.push_ws_queue_msg(json_data);
        break;

      case WsCmd.R_CMD_MATCH_START:
        // 赛事开赛通知状态C302
        // ms：0、未开赛 1、开赛
        // 主动从后台http拉取赛事全量信息
        ws.push_ws_queue_msg(json_data);
        //根据赛事id查询单个赛事信息(david) /v1/w/getMatchInfoByMid
        break;

      case WsCmd.R_CMD_HANDICAP_PLAY:
        //新增玩法/盘口通知C303
        // 主动从后台http拉取玩法/盘口数据
        ws.push_ws_queue_msg(json_data);
        // 根据赛事id,玩法id查询盘口集合(david)    /v1/w/getMatchOddsInfos

        // 据赛事id,玩法id,盘口id查询盘口信息(david)  /v1/w/getHandicapByHid
        break;
      case WsCmd.R_CMD_MATCH_FILL_TIME:
        // 赛事时间补充
        ws.push_ws_queue_msg(json_data);
        break;
      default:
        ws.push_ws_queue_msg(json_data);
        break;
    }
  }
}
