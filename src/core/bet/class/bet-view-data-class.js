/**
 * 投注相关的   视图强相关的 一些逻辑
 * 这个类是多个 实例 ，每一个投注对象 就是一个实例
 *
 */
import { ref } from "vue";
import _lodash from "lodash"
import BetData from "./bet-data-class"


class BetViewData {
  constructor() { }
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
    this.bet_min_max_money = {}
    // 键盘状态
    this.bet_keyboard_show = false;

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
  set_bet_view_version() {
    this.bet_view_version.value = Date.now()
  }

  // 设置 金额的范围  -1:输入金额小于最低限额时，1: 输入金额超出最大限额时 2:输入金额超出用户余额时 3:用户余额是小于等于输入金额(转换后)
  set_input_money_state(val) {
    this.input_money_state = val
    this.set_bet_view_version()
  }

  // 设置键盘状态
  set_bet_keyboard_show(val){
    this.bet_keyboard_show = val
    this.set_bet_view_version()
  }

  // 设置限额
  // obj 接口返回数据
  // type 接口类型 min_max 或者最大值 最小值接口 数据结构不同
  set_bet_min_max_money(obj, type = '') {
    // 获取query_bet_amount数据对应的限额
    let bet_amount_list = _lodash.get(obj, 'betAmountInfo')
    // min_max 或者最大值 最小值接口 数据结构不同
    if (type == 'min_max') {
      bet_amount_list = obj
    }
    let bet_amount = {}
    bet_amount_list.forEach(item => {
      // 单关 使用 投注项作为 key值 在投注列表做对应关系
      //  串关使用 type 复连串 30001
      let value = BetData.is_bet_single ? item.playOptionsId : item.type
      bet_amount[value] = {
        min_money: item.minBet, // 最小限额
        max_money: item.orderMaxPay, // 最大限额
        globalId: item.globalId,  //  风控响应id
        seriesOdds: item.seriesOdds, // 赔率  // 串关使用 3串1
      }
    })
    this.bet_min_max_money = bet_amount

    // console.error("最大最小值",this.bet_min_max_money)
    this.set_bet_view_version()
  }
  // 显示投注框
  set_bet_show(val) {
    this.bet_show = val
  }

  // 设置投注状态
  // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
  set_bet_order_status(code) {
    this.bet_order_status = code
    // 更新页面
    this.set_bet_view_version()
  }
  // 设置提示信息 
  // code code码
  // msg 提示信息
  set_bet_error_code({ code, message }) {
    this.error_message = message
    this.error_code = code

    if (code == 200) {
      // 3-投注成功状态(主要控制完成按钮)
      this.set_bet_order_status(3)
    } else {
      // 4-投注失败状态 显示错误信息
      this.set_bet_order_status(4)
    }
  }
  /**
   * @description: 完成按钮是否显示
   * @param {undefined} undefined
   * @return {Boolean}
   */
  set_bet_complete_show() {
    //bet_order_status:3-投注成功状态 order_confirm_complete:2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败  4.所有注单已经确认完成 部分成功部分失败
    return this.bet_order_status === 3 || [2, 3, 4].includes(this.order_confirm_complete);
  }
  /**
   * @description: 是否在投注中
   * @param {undefined} undefined
   * @return {Boolean}
   */
  set_bet_loadding() {
    //bet_order_status:2-投注中状态 order_confirm_complete:1.注单确认中
    return this.bet_order_status == 2 || this.order_confirm_complete == 1;
  }

  // 设置 code对应的 message数据 
  set_code_message_config(code, message) {
    let text = ''
    switch (code) {
      case 200:
        text = '下注成功'
        break

      case '0402001':
      case '0402002':
      case '0402003':
      case '0402005':
      case '0402006':
      case '0402007':
      case '0402008':
      case '0402011':
      case '0402012':
      case '0402016':
      case '0402022':
      case '0402024':
      case '0402025':
      case '0402026':
      case '0402043':
      case '0402044':
      case '0402045':
      case '0402046':
      case '0402047':
      case '04020448':
      case '04020449':
      case '0400451':
      case '0400452':
      case '0400461':
      case 'DJ006':
        text = '已失效'
        break

      case '0402009':
      case '0402010':
      case '0402023':
      case '0402027':
      case '0402028':
        text = '投注项盘口、赔率或有效性产生变化!'
        break
      case '0402014':
        text = '网络异常，请在注单中查看投注结果'
        break

      case '0402015':
      case '0402017':
      case '0402020':
      case '0402021':
      case '0402039':
      case '0402040':
      case '0402041':
      case '0400456':
      case '0400457':
      case '0400458':
      case '0400462':
      case '0400463':
      case 'XXXXXX':
      case 'DJ999':
        text = '投注未成功~再试一次吧！'
        break

      case '0402018':
      case '0402019':
      case '0402038':
      case '0400450':
        text = '投注未成功,请稍后再试'
        break

      case '132113':
        text = '投注失败，请重新选择投注项'
        break

      case '0402035':
      case '0400454':
      case '0400455':
        text = '余额不足,请您先充值'
        break

      case '0402042':
        text = '网络异常,请联系客服'
        break

      case '0400453':
        text = '账户异常,请联系客服'
        break

      case '0400459':
        text = '盘口确认中，请稍等'
        break

      case '0400460':
        text = '拒绝投注'
        break

      case '0400464':
      case '0400475':
        text = '额度已变更,再试一次吧~'
        break

      case '0400468':
        text = '比分已变更 再试一次吧'
        break

      case '0400469':
        text = '投注项盘口、赔率或有效性产生变化!'
        break

      case 'M400004':
        text = '赔率更新中'
        break

      case 'M400005':
        text = '请您输入投注金额'
        break

      case 'M400007':
        text = '请您留意每个选项的投注范围'
        break

      case 'M400009':
        text = '该选项当前不可投注，请选择其他选项'
        break

      case 'M400010':
      case 'DJ002':
        text = '投注金额未达最低限额'
        break

      case 'M400011':
        text = '投注金额超过最高限额'
        break

      case 'M400012':
        text = '限额获取中请稍后'
        break

      case '0401038':
        text = '网路异常，请再试一次!'
        break

      case 'DJ001':
        text = '您无法投注电竞赛事'
        break

      case 'DJ003':
        text = '投注金额只能为整数'
        break

      case 'DJ004':
        text = '存在不支持串关赛事'
        break

      case 'DJ005':
        text = '存在不支持串关盘口'
        break

      default:
        text = message
        break
    }

    return text
  }

  // 串关专用参数
  set_bet_special_series(array) {
    this.bet_special_series = array
    this.set_bet_view_version()
  }
}
export default new BetViewData();