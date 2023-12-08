import  BetDataCore from "../core/bet/class/bet-core.js"
class BetDataCtr extends BetDataCore {
  constructor() {
    super()
  }
  init() {
    this.init_core()

    /**
     * 押注状态0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,
     * 4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,
     * 7-有投注项锁盘，8-单关投注失败(bet接口返回200)
     */
    //设置总投注额
    this.money_total = 0;
    this.pre_market_data = []; //预约盘口集合
    this.bet_list = []; //投注项id集合
    this.bet_obj = {}; //押注信息对象
    this.temp_obj = {}; //bet_obj的临时存储
    this.temp_list = []; //bet_list的临时存储
    this.s_count_data = []; //统计串关数数据
    this.bet_status = 0; //押注状态0-隐藏状态 1-初始弹出状态;2-注单处理中状态;3-投注成功;4-投注失败(bet接口没返回200);5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）;7-有投注项锁盘，8-单关投注失败(bet接口返回200)
    this.active_index = 0; // 处于活动的投注项子项
    this.money_total = 0; //串关总金额
    this.is_mix = false; //是否在串关页面里
    this.is_combine = false; // 是否选中合并投注项
    this.is_spread = false; //是否展开过关投注选项
    this.accept_show = false; //自动接受更好赔率规则是否显示
    this.combine_tips_show = false; // 合并投注项弹框提示是否显示
    this.odds_change = false; //赔率和盘口是否变化
    this.new_bet = false; //是否进入投注新流程
    this.keyboard_show = true; //H5新版键盘是否显示
    this.change_list = []; //赔率和盘口发生了变化的投注项id集合
    this.invalid_ids = []; // 失效的投注项赛事id集合
    this.order_no = ""; //投注成功后当前订单编号(只有一个)
    this.money_notok_list = []; //金额大于最高可投的id集合
    this.money_notok_list2 = []; //金额小于最低可投的id集合
    this.order_ing = []; //注单确认中的订单号集合
    this.order_los = []; //注单失败的的订单号集合
    this.order_suc = []; //注单成功的的订单号集合
    this.m_id_list = []; //数组，用于存放赛事id或者球员id
    this.used_money = 0; //单关投注的常用金额(只有一个投注项时才展示) 0 关闭常用金额展示 -1 开启 其他数字代表常用金额值
    this.is_accept = 2; //1-自动接受更好赔率 2-自动接受任何赔率
    this.betbar_show = {
      // 底部投注条是否显示
      len: 0, //投注项数量是否合适
      page: 1, //页面是否正确
      menu: 1, //菜单是否正确
    };
    this.update_tips = ""; //更新提示消息
    this.match_id_bet_success = ""; // 投注成功的赛事id
    this.window_scroll_type = ""; // 触发窗口滚动的操作类型; 投注弹层触发 ; 设置菜单显示时触发 ;均为('component-change') 用户已经手动触发
    this.chat_bet = false; //判断是否是在聊天室跟单弹起投注框
  }
  set_money_total(value) {
    if (value == "clear_") {
      this.money_total = 0;
    } else {
      this.money_total += Number(value);
      this.money_total = +this.money_total.toFixed(2);
      if (this.money_total < 0) {
        this.money_total = 0;
      }
      // 单关总金额变动时，设置常用金额
      if (this.used_money && this.bet_list.length == 1) {
        if (this.money_total == 0) {
          this.used_money = -1;
        } else {
          this.used_money = this.money_total;
        }
      }
    }
  }
  set_chat_bet(val) {
    this.chat_bet = val;
  }
  set_pre_market_data(val) {
    this.pre_market_data = val;
  }
  set_update_tips(val) {
    this.update_tips = val;
  }
  set_window_scroll_type(val) {
    this.window_scroll_type = val;
  }
  set_match_id_bet_success(value) {
    this.match_id_bet_success = value;
  }
  set_is_combine(val) {
    this.is_combine = val;
  }
  set_temp_obj(value) {
    this.temp_obj = value;
  }
  set_used_money(value) {
    // 切换是否启用常用金额
    if (value == null) {
      value = this.used_money == 0 ? -1 : 0;
    }
    // 勾选常用金额时，如果有总金额，要将常用金额设为总金额
    if (
      this.used_money == 0 &&
      value == -1 &&
      this.money_total &&
      this.bet_list.length == 1
    ) {
      this.used_money = this.money_total;
    } else {
      this.used_money = value;
    }
  }
  set_new_bet(value) {
    this.new_bet = value;
  }
  set_keyboard_show(value) {
    this.keyboard_show = value;
  }
  set_temp_list(value) {
    this.temp_list = value;
    if (Array.isArray(value) && !value.length) {
      this.temp_obj = {};
    }
  }
  set_betbar_show(value) {
    Object.assign(this.betbar_show, value);
  }
  set_is_accept(value) {
    value = Number(value);
    if (isNaN(value)) {
      this.is_accept = this.is_accept == 1 ? 2 : 1;
    } else {
      this.is_accept = value;
    }
  }
  // 清除单关的金额数据
  clear_single_money({ bet_obj }, value) {
    for (const item of Object.values(bet_obj)) {
      if (value == 1) {
        item.orderMaxPay = "";
      } else {
        item.money = "";
      }
    }
  }
  // 用于投注前拉取HTTP跟新数据、或者更新单关金额数据
  set_http_update(
    { bet_list, bet_obj, bet_status },
    {
      mmp,
      pre_switch,
      pre_key,
      mid,
      msc,
      mhs,
      marketType,
      hpn,
      man,
      mhn,
      money_obj,
      orderno_arr,
      has_pre,
    }
  ) {
    // console.log('qwe',orderno_arr)
    if ((bet_status == 2 || bet_status == 4) && !orderno_arr) return;
    let flag = money_obj && Array.isArray(money_obj);
    let flag2 = orderno_arr && Array.isArray(orderno_arr);
    for (let index of bet_list) {
      if (pre_switch && pre_key == index) {
        bet_obj[index].pre_switch = pre_switch;
      }
      let bs_ = bet_obj[index].bs;
      let cs_ = bet_obj[index].cs;
      let preFlag = bet_obj[index].show_pre;
      // 单关投注成功后需要将订单号存起来
      if (flag2 && cs_.oid == orderno_arr[0]) {
        Object.assign(bet_obj[index], { orderno: orderno_arr[1] });
        continue;
      }
      if (flag) {
        for (const item of money_obj) {
          if (cs_.oid == item.playOptionsId) {
            Object.assign(bet_obj[index], {
              minBet: item.minBet,
              orderMaxPay: item.orderMaxPay,
            });
          }
        }
        continue;
      }
      // 更新单关投注金额
      if (money_obj && index == money_obj.hn_id) {
        Object.assign(bet_obj[index], money_obj.obj);
        continue;
      }
      if (bs_.mid != mid) continue;
      if (mmp != undefined) {
        //跟新赛事阶段
        bs_.mmp = mmp;
      }
      if (mhs != undefined) {
        //跟新赛事级别盘口状态
        bs_.mhs = mhs;
      }
      if (hpn) {
        //对应英文状态跟新玩法名称、主队名和客队名
        bs_.hps[0].hpn = hpn;
        bs_.man = man;
        bs_.mhn = mhn;
      }
      if (Array.isArray(msc)) {
        //其他情况投注这里不跟新比分
        if (
          (typeof marketType == "number" && marketType == 0) ||
          marketType == undefined
        ) {
          bs_.msc = Array.from(new Set([...msc, ...bs_.msc])); // 最新的比分追加到前面
        }
      }
    }
  }
  set_change_list({ value, status }) {
    if (status == 0) {
      this.invalid_ids = [];
      this.change_list = [];
    }
    if (this.change_list.includes(value) && status == 2) {
      this.change_list.splice(this.change_list.indexOf(value), 1);
    }
    if (status == 1) {
      this.change_list.push(value);
    }
  }
  set_invalid_ids({ type, val }) {
    if (type == 0) {
      //重置
      this.invalid_ids = [];
    } else if (type == 1 && !this.invalid_ids.includes(val)) {
      //增加
      this.invalid_ids.push(val);
    } else if (type == 2 && this.invalid_ids.includes(val)) {
      //删除
      this.invalid_ids.splice(this.invalid_ids.indexOf(val), 1);
    }
  }
  set_order_no(value) {
    this.order_no = value;
  }
  set_money_notok_list({ value, status }) {
    if (status == 0) {
      this.money_notok_list = [];
      this.money_notok_list2 = [];
    }
    if (this.money_notok_list.includes(value) && status == 2) {
      this.money_notok_list.splice(this.money_notok_list.indexOf(value), 1);
    }
    if (this.money_notok_list2.includes(value) && status == 2) {
      this.money_notok_list2.splice(this.money_notok_list2.indexOf(value), 1);
    }
    if (!this.money_notok_list.includes(value) && status == 1) {
      this.money_notok_list.push(value);
    }
  }
  set_money_notok_list2({ value, status }) {
    if (!this.money_notok_list2.includes(value) && status == 1) {
      this.money_notok_list2.push(value);
    }
  }
  set_s_count_data(value) {
    this.s_count_data = value;
  }
  //将订单号存到对象集合中
  add_orderno({ count, num }) {
    for (let item of this.s_count_data) {
      if (item.count == count) {
        item.orderno = num;
      }
    }
  }
  set_bet_list(value) {
    if (!Array.isArray(value)) return;
    this.bet_list = value;
    // 投注项数量为0后的数据重置全都写到这里,谨慎更改
    if (value.length == 0) {
      this.invalid_ids = [];
      this.change_list = [];
      this.bet_status = 0;
      this.odds_change = false;
      this.s_count_data = [];
      this.invalid_ids = [];
      this.bet_obj = {};
      this.money_total = 0;
      this.money_notok_list = [];
      this.money_notok_list2 = [];
      this.pre_market_data = [];
      Object.assign(this.betbar_show, { len: 0 });
    } else {
      Object.assign(this.betbar_show, { len: 1 });
    }
  }
  set_bet_obj(value) {
    if (this.bet_obj) {
      var temp = this.bet_obj;
      this.bet_obj = value;
      for (const key in temp) {
        delete temp[key];
      }
    } else {
      this.bet_obj = value;
    }
    //将主客队id存起来
    let temp2 = [];
    for (const item of Object.values(this.bet_obj)) {
      item.bs.maid && temp2.push(item.bs.maid);
      item.bs.mhid && temp2.push(item.bs.mhid);
    }
    this.m_id_list = temp2;
  }
  upd_bet_obj({ bet_obj }, callback) {
    if (callback) {
      callback(bet_obj);
    }
  }
  set_active_index(value) {
    this.active_index = value;
  }
  set_is_spread(value) {
    this.is_spread = value;
  }
  set_odds_change(value) {
    this.odds_change = value;
  }
  set_bet_status(value) {
    // 存在投注项数据时才更新投注项状态，否则设为初始值
    if (this.bet_list.length) {
      this.bet_status = value;
    } else {
      this.bet_status = 0;
    }
  }
  set_money_total(value) {
    if (value == "clear_") {
      this.money_total = 0;
    } else {
      this.money_total += Number(value);
      this.money_total = +this.money_total.toFixed(2);
      if (this.money_total < 0) {
        this.money_total = 0;
      }
      // 单关总金额变动时，设置常用金额
      if (this.used_money && this.bet_list.length == 1) {
        if (this.money_total == 0) {
          this.used_money = -1;
        } else {
          this.used_money = this.money_total;
        }
      }
    }
  }
  set_accept_show(value) {
    this.accept_show = value;
  }
  set_combine_tips_show(value) {
    this.combine_tips_show = value;
  }
  set_is_mix(value) {
    this.is_mix = value;
  }
  set_order_ing({ change_, value_ }) {
    if (change_ == 0 && this.order_ing.includes(value_)) {
      this.order_ing.splice(this.order_ing.indexOf(value_), 1);
    } else if (change_ == 1) {
      this.order_ing = value_;
    }
  }
  set_order_los(value) {
    if (Array.isArray(value)) {
      this.order_los = value;
    } else if (!this.order_los.includes(value)) {
      this.order_los.push(value);
    }
  }
  set_order_suc(value) {
    if (Array.isArray(value)) {
      this.order_suc = value;
    } else if (!this.order_suc.includes(value)) {
      this.order_suc.push(value);
    }
  }
  // 是否投注成功状态
  get_bet_success() {
    return [3, 6, 8].includes(this.bet_status);
  }
  //串关并且投注项大于1
  get_mix_bet_flag() {
    return this.is_mix && this.bet_list.length > 1;
  }
  /**
   * @description 是否是冠军
   * @param {Object} this. 当前this.
   * @param {Object} getters
   * @return {Boolean} 是否是冠军
   */
  get_is_champion(val) {
    let flag =
      (getters.get_menu_type == 100 &&
        ["matchList"].includes(val.$route.name)) ||
      (getters.get_menu_type == 3000 &&
        val.$route.name == "matchList" &&
        _.get(getters, "get_current_menu.date_menu.menuType") == 100);
    return flag;
  }
  /**
   *@description 投注框选中的赛事id集合
   *@param {Object} this. 当前this.
   *@return {Array} id集合
   */
  get_mids() {
    let arr = [];
    _.forIn(this.bet_obj, function (val, key) {
      let _mid = val.mid || val.cs.mid;
      if (_mid) {
        arr.push(_mid);
      }
    });
    return arr;
  }
  /**
   * @description 获取用户的钱
   * @param {Object} this. 当前this.
   * @return {number} 获取用户的钱
   */
  get_used_money() {
    return this.used_money;
  }
  /**
   * @description 是不是冠军
   * @param {Object} this. 当前this.
   * @return {Boolean} 是不是冠军
   */
  get_is_combine() {
    return this.is_combine;
  }
  /**
   *@description 串关是否有冲突(不考虑单关的球队球员冲突)
   *@param {Array} value 球队id或者球员id的集合
   *@return {Boolean} falg
   */
  get_is_conflict(value) {
    let flag;
    for (const item of value) {
      flag =
        this.m_id_list.filter((item2) => {
          return item2 == item;
        }).length >= 2;
      if (flag) break;
    }
    return flag && this.is_mix;
  }
  // 普通赛事不支持串关的投注项数量
  get_cannot_mix_len() {
    let len = 0;
    for (const item of Object.values(this.bet_obj)) {
      if (item.bs.hps[0].hids == 0) {
        len++;
      }
    }
    return this.is_mix ? len : 0;
  }
  get_betbar_show() {
    return (
      this.betbar_show.len &&
      this.betbar_show.page &&
      this.betbar_show.menu &&
      !rootGetters.get_is_full_screen
    );
  }
}
