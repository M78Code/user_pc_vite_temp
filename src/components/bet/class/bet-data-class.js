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

    this.mix_bet_flag = false  // 最小投注数量开关

    this.menu_obj = {};
  }


  set_max_height1(val) {
    this.max_height1 = val;
  }

}

export default new BetData();