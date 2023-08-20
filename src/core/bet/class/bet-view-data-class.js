/**
 * 投注相关的   视图强相关的 一些逻辑 
 *  
 */

import {
  uid
} from "quasar";
import {
  ref
} from "vue";



const gongyong_status_1 = ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')


class BetViewData {
  constructor() {

  }
  init() {
    this.gongyong_status_1 = gongyong_status_1
    this.series_order_success = '';
    this.mix_range_money = '';
    this.error_code = '';
    this.is_empty_money = '';
    this.order_detail_data = '';
    this.order_detail_data = '';
    this.series_order_data = '';
    this.single_range_money = '';
    this.order_confirm_complete = '';
    this.error_message = '';
    this.cur_keyboard_index = '';
    this.input_max_flag = '';
    this.is_submit_result = '';
    this.bet_data_change = '';
    this.bet_fail_flag = '';
    this.timer_ = '';
    this.bet_order_status = '';
    this.timestap = '';
    this.is_effect = '';

    this.view_ctr_obj = {
      bet_data_change: false, // 检测数据是否右边,主要在提交时使用
      bet_order_status: 1, //  1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
      cur_keyboard_index: 0, // 当前键盘所在输入投注项索引
      //tips 数据 */
      bet_tips_info: {
        id: "", //目标id
        match_name: "", // 赛事名称  世界杯2022亚洲外围赛
        battle_info: "", // 对战信息 中国 v 关岛
        play_game: "", // 玩法游戏 滚球 让球
        match_type: "", // 赛事类型
        league_name: "", // 联赛名称
        bet_end_time: "" // 投注截止时间
      },
      // 串关信息
      error_code: "", // 错误码
      error_message: "", // 错误信息
      is_submit_result: false, // 提交结果 用来控制code的提示
      order_detail_data: [], // 单关投注成功记录
      series_order_data: [], // 串关投注成功记录
      series_order_success: [], // 串关投注成功部分的记录
      order_confirm_complete: 0, //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
      is_empty_money: true, // 金额是否为空
      is_effect: true, //供串关时使用
      mix_range_money: 0,
      timer_: undefined, //计时器
      input_max_flag: 0, // 最大值获取标志 0: 默认值 1: 正在获取最大最小值 2:获取完成
      valid_money_obj: {}, // 无效金额对象收集
      bet_fail_flag: false,//投注失败
      bet_is_combine:false  //是否是冠军赛事
    }

    this.single_view_ctr_obj = {
      bet_data_change: false, // 检测数据是否有变,主要在提交时使用
      bet_order_status: 1, //  1-投注状态,2-投注中状态,3-投注成功状态,4-投注失败状态,5-投注项失效
      is_effect: true,
      bet_tips_info: {
        id: "", //目标id
        match_name: "", // 赛事名称  世界杯2022亚洲外围赛
        battle_info: "", // 对战信息 中国 v 关岛
        play_game: "", // 玩法游戏 滚球 让球
        match_type: "", // 赛事类型
        league_name: "", // 联赛名称
        bet_end_time: "" // 投注截止时间
      },
      //单关信息
      error_code: "",
      error_message: "", //错误信息
      order_detail_data: [], // 单关投注成功记录
      order_confirm_complete: 0, //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
      is_empty_money: true, // 金额是否为空
      single_range_money: 0, // -1:输入金额小于最低限额时，1: 输入金额超出最大限额时 2:输入金额超出用户余额时 3:用户余额是小于等于输入金额(转换后)
      input_max_flag: 0, // 最大值获取标志 0: 默认值 1: 正在获取最大最小值 2:获取完成
      bet_fail_flag: false // 投注失败标识
    }

    this.h5_bet_team_info ={
      // 
    }
  }


  /**
   * 计算确定按钮显示
   */

  compute_show_xxx() {

    let arr = ['0400459', '0400475', '0400486', '0400517', '0400519', '0400540']


    return arr.includes(this.error_code)

  }
}
