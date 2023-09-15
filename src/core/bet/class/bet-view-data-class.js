/**
 * 投注相关的   视图强相关的 一些逻辑
 * 这个类是多个 实例 ，每一个投注对象 就是一个实例
 *
 */
import { ref } from "vue";
import _lodash from "lodash"
import BetData from "./bet-data-class"

class BetViewData {
  constructor() {}
  init() {
    // 金额的范围  -1:输入金额小于最低限额时，1: 输入金额超出最大限额时 2:输入金额超出用户余额时 3:用户余额是小于等于输入金额(转换后)
    this.input_money_state = 0;
    // 错误码
    this.error_code = "";
    // 金额是否为空
    this.is_empty_money = true;
    // 投注成功记录 内真正是投注成功 的  部分
    this.bet_order_success_success = [];
    // 投注成功记录
    this.bet_order_success_all = [];
    //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
    this.order_confirm_complete = 0;
    //错误信息
    this.error_message = "";
    this.cur_keyboard_index = "";
    // 最大值获取标志 0: 默认值 1: 正在获取最大最小值 2:获取完成
    this.input_max_flag = 0;
    this.is_submit_result = "";
    // 检测数据是否右边,主要在提交时使用
    this.bet_data_change = false;
    // 投注失败标识
    this.bet_fail_flag = false;
    //计时器
    this.timer_ = "";
    //  1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
    this.bet_order_status = 1;
    this.timestap = "";
    //投注项有效无效的标识
    this.is_effect = true;
    //是否是 合并投注
    this.bet_is_combine = false;
    //tips 数据 */
    this.bet_tips_info = {
      //目标id
      id: "",
      // 赛事名称  世界杯2022亚洲外围赛
      match_name: "",
      // 对战信息 中国 v 关岛
      battle_info: "",
      // 玩法游戏 滚球 让球
      play_game: "",
      // 赛事类型
      match_type: "",
      // 联赛名称
      league_name: "",
      // 投注截止时间
      bet_end_time: "",
    };

    // 串关  专用参数
    this.bet_special_series = {};
    // 普通单关 专用参数
    this.bet_special_single = {};
    // 合并单关 专用参数
    this.bet_special_combine = {};
    // h5 专用参数
    this.bet_special_h5 = {
      //
    };
    //pc 专用参数
    this.bet_special_pc = {
      //
    };
    // 是否显示全屏下投注弹窗
    this.bet_show = ref(false)

    // 限额
    this.bet_min_max_money = {
      "11":{
        min_money: 10,
        max_money: 8888
      }
    }

    this.bet_view_version = ref('11')

  }
  /**
   * 计算确定按钮显示
   */
  compute_show_xxx() {
    let arr = [
      "0400459",
      "0400475",
      "0400486",
      "0400517",
      "0400519",
      "0400540",
    ];
    return arr.includes(this.error_code);
  }

  // 设置当前 投注页面显示 版本
  set_bet_view_version(){
    this.bet_view_version.value = Date.now()
  }

  // 设置 金额的范围  -1:输入金额小于最低限额时，1: 输入金额超出最大限额时 2:输入金额超出用户余额时 3:用户余额是小于等于输入金额(转换后)
  set_input_money_state(val){
    this.input_money_state = val
    this.set_bet_view_version()
  }

  // 设置限额
  set_bet_min_max_money(obj){
    let bet_amount_list = _lodash.get(obj, 'betAmountInfo')
    let bet_amount = {}
    bet_amount_list.forEach(item=>{
      // 单关 使用 投注项作为 key值 在投注列表做对应关系
      //  串关使用 type 复连串 30001
      let value = BetData.is_bet_single ? item.playOptionsId : item.type
      bet_amount[value] = {
        min_money: item.minBet, // 最小限额
        max_money: item.orderMaxPay, // 最大限额
        globalId : item.globalId,  //  风控响应id
        seriesOdds: item.seriesOdds, // 赔率
      }
    })

    this.bet_min_max_money = bet_amount
    this.set_bet_view_version()
  }
  // 显示投注框
  set_bet_show(val){
    this.bet_show = val
  }

  // 设置投注状态
  // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
  set_bet_order_status(code){
    this.bet_order_status = code
    this.set_bet_view_version()
  }
  // 设置提示信息 
  // code code码
  // status 成功失败
  set_bet_error_code({code,status}){
    
  }

  // 串关专用参数
  set_bet_special_series(array){
    this.bet_special_series = array
    this.set_bet_view_version()
  }
}
export default new BetViewData();