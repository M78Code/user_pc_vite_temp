/*
 * @Author: hanmar
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
    └─赛事订阅(C1)
        ├─盘口赔率(C105)
        ├─注单盘口赔率(C106)
        ├─赛事事件(C102)
        ├─赛事比分(C103)
        ├─赛事状态(C101)
        ├─赛事盘口新增(玩法)(C303)
        ├─赛事视频/动画状态(C107)
        ├─赛事订阅C1-玩法数量（C110）
        └─赛事级别盘口状态(C104)
   */
  //------------------------------------------------------------------发送命令定义-S-------------------------------------------------------------------------------------

  // C1变C8
  //static S_CMD_MATCH_STATUS = "C1";

  //  赛事订阅(C8)
  static S_CMD_MATCH_STATUS = "C8";

  //注单-盘口赔率(C2)
  static S_CMD_BAT_HANDICAP_ODDS = "C2";

  //注单-盘口赔率(C21)
  static S_CMD_BAT_HANDICAP_ODDS2 = "C21";

  //订单(C3)
  static S_CMD_ORDER = "C3";

  //主动推送开关(C4)
  static S_CMD_INITIATIVE_PUSH = "C4";

  //菜单推送(C5)
  static S_CMD_MENU = "C5";

  //新版菜单推送(C51)
  static S_CMD_MENU2 = "C51";

  //热门/直播推送(C6)
  static S_CMD_HOT_LIVE = "C6";

  //心跳
  static S_CMD_HEART_BEAT = "C0";

  // 主动关闭连接指令
  static S_CMD_CLOSE_CONNECT = "C00";

  //列表接口订阅
  static S_CMD_MATCH_LIST = "C01";

  //列表接口订阅(收到C303后订阅C03)
  static S_CMD_MATCH_LIST3 = "C03";

  //首页右侧详情订阅(getMatchOddsInfo2)
  static S_CMD_MATCH_LIST4 = "C04";

  // 详情订阅(getMatchOddsInfo1)
  static S_CMD_MATCH_LIST5 = "C05";

  // 全局开关(C7)
  static GLOBAL_SWITCH = "C7"
  // 联赛指令(C9)
  static S_CMD_LEAGUE_STATUS = "C9"
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

  //赛事订阅C1-玩法数量（C110）
  static R_CMD_MATCH_PLALY_COUNT = "C110";

  //玩法集变更
  static R_CMD_CHANGE_CATEGORY = "C112";

  // 订单状态
  static R_CMD_ORDER_STATUS = "C201";

  // 未结算订单数
  static R_CMD_ORDER_COUNT = "C202";

  // 菜单栏目
  static R_CMD_MENU_SECTION = "C301";

  // 赛事开赛通知状态
  static R_CMD_MATCH_START = "C302";


  //新增玩法/盘口通知
  static R_CMD_HANDICAP_PLAY = "C303";

  //补充赛事时间
  static R_CMD_MATCH_FILL_TIME = "C801";

  // 联赛关盘补充(C901)
  static R_CMD_LEAGUE_CLOSE = "C901";
  //------------------------------------------------------------------接收命令定义-R-------------------------------------------------------------------------------------

}



