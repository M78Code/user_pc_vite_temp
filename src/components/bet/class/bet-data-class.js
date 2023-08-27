import UserCtr from "src/core/user-config/user-ctr.js";

class BetData {
  constructor() {}
  init_core() {
    this.btn_show = 0 //右下角显示状态，0投注，1确定（知道了），2注单处理中...,3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
    this.exist_code = 0 //投注后是否返回code码
    this.series_order_respList = [] //串关投注成功后的返回(包含订单号、金额···
    this.order_detail_resp_list = [] // 单关和串关投注成功后的返回(投注项信息，赔率、盘口···
    this.bet_money_total = 0 //串关投注成功后的总投注额
    this.max_win_money_total = 0 //串关投注成功后的总最高可赢
    this.query_order_obj = [] //queryOrderStatus接口返回数据
    this.is_5s = false //弹框弹起来有没有5秒,到了5秒就用默认的5000作限额,不作弹框提示
    this.max_winmoney = 0 //单关投注成功后接口返回的最高可赢
    this.odds_value2 = '' //单关投注成功后接口返回的赔率
    this.playname2 = '' //单关投注成功后接口返回的玩法名称
    this.bet_money = 0 //单关投注成功后接口返回的投注金额
    this.play_optionname = '' //单关投注成功后接口返回的playOptionName
    this.max_height1 = 230 //滚动区域的最大高
    this.is_new_bet = false //get_orderstatus 接口返回是否是新流程
    this.need_bet_again = false //是否需要重新发起投注
    this.check_odds_beforebet2 = debounce(check_odds_beforebet, 200) //防抖处理
    this.scroll_box_ele = null // dom元素
    this.is_loading_balance = false // 金额刷新中？

    this.mix_bet_flag = false // 最小投注数量开关

    this.menu_obj = {};


    this.pre_market_data = [] //预约盘口集合
    this.bet_list = [] //投注项id集合
    this.bet_obj = {} //押注信息对象
    this.temp_obj = {} //bet_obj的临时存储
    this.temp_list = [] //bet_list的临时存储
    this.is_count_data = [] //统计串关数数据
    this.bet_status = 0 //押注状态0-隐藏状态 1-初始弹出状态2-注单处理中状态3-投注成功4-投注失败(bet接口没返回200)5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）7-有投注项锁盘，8-单关投注失败(bet接口返回200)
    this.active_index = 0 // 处于活动的投注项子项
    this.bet_money_total = 0 //串关总金额
    this.is_mix = false //是否在串关页面里
    this.bet_is_combine = false // 是否选中合并投注项
    this.is_spread = false //是否展开过关投注选项
    this.accept_show = false //自动接受更好赔率规则是否显示
    this.combine_tips_show = false // 合并投注项弹框提示是否显示
    this.odds_change = false //赔率和盘口是否变化
    this.new_bet = false //是否进入投注新流程
    this.keyboard_show = true //H5新版键盘是否显示
    this.change_list = [] //赔率和盘口发生了变化的投注项id集合
    this.invalid_ids = [] // 失效的投注项赛事id集合
    this.order_no = '' //投注成功后当前订单编号(只有一个)
    this.money_notok_list = [] //金额大于最高可投的id集合
    this.money_notok_list2 = [] //金额小于最低可投的id集合
    this.order_ing = [] //注单确认中的订单号集合
    this.order_los = [] //注单失败的的订单号集合
    this.order_suc = [] //注单成功的的订单号集合
    this.m_id_list = [] //数组，用于存放赛事id或者球员id
    this.used_money = 0 //单关投注的常用金额(只有一个投注项时才展示) 0 关闭常用金额展示 -1 开启 其他数字代表常用金额值
    this.is_accept = 2 //1-自动接受更好赔率 2-自动接受任何赔率
    this.betbar_show = { // 底部投注条是否显示
      len: 0, //投注项数量是否合适
      page: 1, //页面是否正确
      menu: 1 //菜单是否正确
    }
    this.update_tips = '' //更新提示消息
    this.match_id_bet_success = '' // 投注成功的赛事id
    this.window_scroll_type = '' // 触发窗口滚动的操作类型 投注弹层触发  设置菜单显示时触发 均为('component-change') 用户已经手动触发
    this.chat_bet = false //判断是否是在聊天室跟单弹起投注框
  }


  set_max_height1(val) {
    this.max_height1 = val;
  }
  set_is_spread(val) {
    this.is_spread = val;
  }

  // 是否投注成功状态
  is_bet_success_status() {

    let arr = [3, 6, 8]

    return arr.includes(this.bet_status)

  }
}

export default new BetData();