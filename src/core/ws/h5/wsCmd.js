/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: ws通信消息定义类
 */
export default class WsCmd {
  /**
   *
   推送业务
    ├─主动推送开关(C4)
    │  ├─菜单栏目(C301)
    │  ├─财务推送(C108)
    │  └─赛事开赛状态(C302)
    ├─心跳
    │  └─客户端维持心跳
    ├─注单-盘口赔率(C2)
    │  └─盘口赔率(C105)
    ├─订单(C3)
    │  └─订单状态(C201)
    └─赛事订阅(C8)
        ├─盘口赔率(C105)
        ├─注单盘口赔率(C106)
        ├─赛事事件(C102)
        ├─赛事比分(C103)
        ├─赛事状态(C101)
        ├─赛事盘口新增(玩法)(C303)
        ├─赛事视频/动画状态(C107)
        ├─开盘推送-非订阅类--赛事关盘->开盘推送(C109)
        ├─赛事订阅C1-玩法数量（C110）
        └─赛事级别盘口状态(C104)
   */
  //------------------------------------------------------------------发送命令定义-S-------------------------------------------------------------------------------------

  //  赛事订阅(C1)
  // static S_CMD_MATCH_STATUS = "C1";
  //  赛事订阅(由C1变为C8)
  static S_CMD_MATCH_C8_STATUS = "C8";

  static S_CMD_MATCH_C9_STATUS = "C9";

  //注单-盘口赔率(C2)
  static S_CMD_BAT_HANDICAP_ODDS = "C2";

  //订单(C3)
  static S_CMD_ORDER = "C3";

  //主动推送开关(C4)
  static S_CMD_INITIATIVE_PUSH = "C4";

  //主动推送菜单订阅C5(C5)
  static S_CMD_MENU_COUNT = "C5";

  //心跳
  static S_CMD_HEART_BEAT = "C0";

  //首页轮播图赛事订阅
  static S_CMD_HOT_LIVE = "C6";

  //紧急开关(C7)   以便在极端高并发场景下减少非1、2级服务负担
  static S_CMD_EMERGENCY_SWITCH = "C7";

  // 提前结算订阅指令
  static S_CMD_EARLY_SETTLE = "C21";
  //------------------------------------------------------------------发送命令定义-S-------------------------------------------------------------------------------------


  //------------------------------------------------------------------接收命令定义-R-------------------------------------------------------------------------------------
  // 赛事状态
  static R_CMD_MATCH_STATUS = "C101";

  // 赛事事件
  static R_CMD_MATCH_EVNT = "C102";

  // 赛事比分
  static R_CMD_MATCH_SCORE = "C103";

  //赛事级别盘口状态
  static R_CMD_MATCH_HANDICAP_STATUS = "C104";

  //盘口状态、赔率
  static R_CMD_HANDICAP_STATUS = "C105";

  //注单订阅盘口状态、赔率
  static R_CMD_BET_LIST_ODDS = "C106";

  //赛事视频/动画状态
  static R_CMD_MATCH_VIDEO_ANIMA = "C107";

  //财务推送
  static R_CMD_FINANCE_DAY_UPD = "C108";

  //开盘推送-非订阅类--赛事关盘->开盘推送
  static R_CMD_MATCH_HANDICAP_STATUS2 = "C109";

  //赛事订阅C1-玩法数量（C110）
  static R_CMD_MATCH_PLALY_COUNT = "C110";

  //赛事订阅C8-玩法集推送(C112)
  static R_CMD_CHANGE_CATEGORY = "C112";

  // 订单状态
  static R_CMD_ORDER_STATUS = "C201";

  // 未结算订单数
  static R_CMD_ORDER_COUNT = "C202";

  // 用户账变
  static R_CMD_AMOUNT_CHANGE = "C203";

  // 菜单栏目
  static R_CMD_MENU_SECTION = "C301";

  // 赛事开赛通知状态
  static R_CMD_MATCH_START = "C302";


  //新增玩法/盘口通知
  static R_CMD_HANDICAP_PLAY = "C303";

  //主副盘变更
  static R_CMD_PRIMARY_SECONDARY_CHANGE = "C304";

  //倒计时补充
  static R_CMD_TIME_DOWN = "C801";

  //热门/直播推送C601
  static R_CMD_HOT_LIVE = "C601";

  // 提前结算接收指令
  static R_CMD_EARLY_SETTLE = "C201";

  // 提前结算赛事状态
  static R_CMD_EARLY_STATUS = "C211";
  // 足球进球事件
  static R_CMD_GOAL = "C115";
  //------------------------------------------------------------------接收命令定义-R-------------------------------------------------------------------------------------

}



