import MenuData from "src/core/menu-pc/menu-data-class.js";
import PageSourceData from "src/core/page-source-h5/page-source-h5.js";
import UserCtr from "src/core/user-config/user-ctr.js";

class BetData {
  constructor() {}
  init_core() {
    // 当前赔率
    this.cur_odd = "eu";
    // 投注项id集合
    this.bet_list = [];
    // 押注信息对象
    this.bet_obj = {};
    //是否接受更好赔率
    this.is_accept = false;
    // 是否串关
    this.is_mix = false;

    // 押注信息列表
    this.bet_list = [];
    // 押注扁平化对象扁平
    this.bet_obj = {};
    // 串关信息列表
    this.bet_s_list = [];
    // 串关对象扁平化
    this.bet_s_obj = {};
    this.bet_single_list = [];
    //单关投注对象
    this.bet_single_obj = {};
    this.this.is_bet_single = true; // true= 单关投注 false= 串关投注
    // 是否正在处理投注
    this.is_handle = false;
    // 单关 是否正在处理投注
    this.is_single_handle = false;
    // 菜单是否改变
    this.menu_change = false;
    // 选择的选项
    this.menu_obj = {};
    // 投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
    this.bet_mode = -1;
    // 是否锁住投注项不让点，默认为不锁住(针对新的投注流程)
    this.bet_item_lock = false;
    // 当前是否为虚拟投注
    this.is_virtual_bet = true;
    // 虚拟投注是否正在进行
    this.is_virtual_handle = false;
    // 虚拟投注列表
    this.virtual_bet_list = [];
    // 虚拟投注对象
    this.virtual_bet_obj = {};
    // 虚拟体育串关列表
    this.virtual_bet_s_list = [];
    // 虚拟体育串关列表对象
    this.virtual_bet_s_obj = {};
    // 虚拟体育投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
    this.virtual_bet_mode = -1;
    // 虚拟体育错误信息
    this.virtual_error_info = {};
    this.this.left_menu_toggle = true; // 左侧菜单的切换状态 true= 展开 false= 收缩
    // 当前电竞查询的模式 false单关模式
    this.cur_esports_mode = false;
    // 是否为合并模式
    this.is_bet_merge = false;
    this.this.bet_category = 1; // 投注类别 1= 普通赛事 2= 虚拟体育 3= 电竞
    // 最小串关数
    this.mix_min_count = 2;
    // 最大串关数
    this.mix_max_count = 10;
    // 被预约的投注项id
    this.bet_appoint_obj = null;
    //需要预约的盘口
    this /* bet_appoint_odds_value= null;
this.bet_appoint_ball_head= null */.this.pre_bet_list = null;
    //输入框最小值 备注 (预约投注用)
    this.pre_min_odd_value = -1;
    //聊天室来源跟单盘口状况eu
    this.chat_room_type = "";
    // 记录投注金额
    this.bet_current_money_obj = {};
    // 投注金额
    this.bet_amount = 0;
  }

  http_upd_data(obj) {}
  
  set_bet_amount(val) {
    this.bet_amount = val;
  }

}

export default new BetData();
