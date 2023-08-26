/**
 * 投注相关的   视图强相关的 一些逻辑
 * 这个类是多个 实例 ，每一个投注对象 就是一个实例
 *
 */
import { uid } from "quasar";
import { ref } from "vue";
const gongyong_status_1 = ref("");
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
// const gongyong_status_1= ref('')
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
    this.bet_special_series = {
      // 当前键盘所在输入投注项索引
      cur_keyboard_index: 0,
      // 提交结果 用来控制code的提示
      is_submit_result: false,
      // 无效金额对象收集
      valid_money_obj: {},
    };
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
}
export default new BetViewData();