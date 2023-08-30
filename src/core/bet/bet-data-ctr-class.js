import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import UserCtr from  "src/core/user-config/user-ctr.js";
import BetData from "./class/bet-data-class.js";
import {init_bet_single_data} from  "./module/bet-model-single.js"


// import BetDataCtr from  "src/core/bet/bet-data-ctr-class.js"
class BetDataCtr {
  constructor() {}
  init() {}

  /**
   * 设置聊天室来源跟单盘口状况eu
   * @param {*}BetData.
   * @returns
   */
  set_chat_room_type(chat_room_type) {
    BetData.chat_room_type = chat_room_type;
  }
  /**
   *  设置输入框最小值
   * @param {*}BetData.
   * @returns
   */
  set_pre_min_odd_value(pre_min_odd_value) {
    BetData.pre_min_odd_value = pre_min_odd_value;
  }
  
  /**
   * 存储是否能预约
   * @param {*}BetData.
   * @param {*} is_pre
   */
  set_is_pre(is_pre) {
    BetData.is_pre = is_pre;
  }
  /**
   * 获取所有预约数据
   * @param {*}BetData.
   * @param {*} pre_bet_list
   */
  set_pre_bet_list(pre_bet_list) {
    BetData.pre_bet_list = pre_bet_list;
  }

 
  /**
   * @description: 设置串关列表
   * @param {*}BetData.
   * @param {*} bet_list
   */
  set_bet_list(bet_list) {
    BetData.bet_list = bet_list;
  }
 
  /**
   * @description: 添加串关列表
   * @param {*}BetData.
   * @param {*} id 加入的id
   */
  bet_list_push(id) {
    if (!this.bet_list.includes(id)) {
      BetData.bet_list.push(id);
    }
  }

 
  /**
   * @description: 清除虚拟投注数据
   * @param {*}BetData.
   */
  bet_mix_clear() {
    BetData.bet_list = [];
    BetData.bet_s_list = [];
    BetData.bet_obj = {};
    BetData.bet_s_obj = {};
  }
  /**
   * @description: 设置单关串关标志
   * @param {*}BetData.
   * @param {*} is_bet_single 是否为单关
   */
  set_is_bet_single(is_bet_single) {
    BetData.is_bet_single = is_bet_single;
  }
  /**
   * @description: 串关投注项输入列表设置
   * @param {*}BetData.
   * @param {*} list 要设置的列表数据
   */
  set_bet_s_list(list) {
    BetData.bet_s_list = list;
  }
  /**
   * @description: 移除串关投注项输入列表中的数据
   * @param {*}BetData.
   * @param {*} i 需要移除的索引
   */
  bet_s_list_remove(i) {
    let temp = Object.assign([], BetData.bet_s_list);
    temp.splice(i, 1);
    BetData.bet_s_list = temp;
  }
  bet_s_list_push(obj) {
    if (!this.bet_s_list.includes(obj)) {
      BetData.bet_s_list.push(obj);
    }
  }
  /**
   * @description: 投注项输入对象设置
   * @param {*}BetData.
   * @param {*} obj 需要设置的对象
   */
  bet_s_obj(obj) {
    BetData.bet_s_obj = obj;
  }
  /**
   * @description: 更新投注项对象(合并最大最小值时使用)
   * @param {*}BetData.
   * @param {*} obj 需要更新的对象
   */
  bet_s_obj_upd_cs(obj) {
    // {
    // "code": 0,
    // "globalId": "62999667334a40779ea392afd2bcaeec",
    // "minBet": "0.33",
    // "orderMaxPay": "0",
    // "playId": "",
    // "type": "2001"
    // },
    if (obj && obj.type) {
      if (this.bet_s_obj[obj.type]) {
        Object.assign(this.bet_s_obj[obj.type].cs, {
          min_money: obj.minBet,
          max_money: obj.orderMaxPay,
        });
      }
    }
  }
  
  /**
   * @description: 删除串关投注项输入对象
   * @param {*}BetData.
   * @param {*} key 串关投注项输入对象的键值
   */
  bet_s_remove_attr(key) {
    deleteBetData.bet_s_obj[key];
  }
  /**
   * @description: 串关是否正在进行
   * @param {*}BetData.
   * @param {*} is_handle 进行的标志位
   */
  set_is_handle(is_handle) {
    BetData.is_handle = is_handle;
  }
  /**
   * @description: 更新投注项对象
   * @param {*}BetData.
   * @param {*} callback 回调函数
   */
  upd_bet_obj(callback) {
    if (callback) {
      callback();
    }
  }
  http_upd_data(obj) {}
  /**
   * @description: 设置单关数据
   * @param {*}BetData.
   * @param {*} bet_single_list 设置的单关列表
   */
  set_bet_single_list(bet_single_list) {
    BetData.bet_single_list = bet_single_list;
  }

  /**
   * @description: 添加单关投注
   * @param {*}BetData.
   * @param {*} id 要添加的投注项id
   */
  bet_single_list_push(id) {
    if (!this.bet_single_list.includes(id)) {
      BetData.bet_single_list.push(id);
    }
  }


  /**
   * @description: 清除单关数据
   * @param {*}BetData.
   */
  bet_single_clear() {
    BetData.bet_single_obj = {};
    BetData.bet_single_list = [];
  }
  /**
   * 设置单关是否处理中
   * @param {*}BetData.
   * @param {*} flag
   */
  set_is_single_handle(flag) {
    BetData.is_single_handle = flag;
  }
  /**
   * @description: 设置菜单对象
   * @param {*}BetData.
   * @param {*} menu_obj 要设置的数据
   */
  set_menu_obj(menu_obj) {
    BetData.menu_obj = menu_obj;
  }
 
  /**
   * 设置投注模式
   * @param {*}BetData.
   * @param {*} bet_mode
   */
  set_bet_mode(bet_mode) {
    BetData.bet_mode = bet_mode;
  }
  /**
   * @description: 当前是否为虚拟投注
   * @param {*}BetData.
   * @param {*} is_virtual_bet
   */
  set_is_virtual_bet(is_virtual_bet) {
    BetData.is_virtual_bet = is_virtual_bet;
  }
  /**
   * @description: 设置虚拟体育是否在投注中
   * @param {*}BetData.
   * @param {*} is_virtual_handle
   */
  set_is_virtual_handle(is_virtual_handle) {
    BetData.is_virtual_handle = is_virtual_handle;
  }
  /**
   * @description: 设置虚拟体育投注项列表数据
   * @param {*}BetData.
   */
  set_virtual_bet_list(virtual_bet_list) {
    BetData.virtual_bet_list = virtual_bet_list;
  }
  /**
   * @description: 添加虚拟体育id到列表中
   * @param {*}BetData.
   * @param {*} id 虚拟体育投注项id
   */
  virtual_bet_list_push(id) {
    if (!this.virtual_bet_list.includes(id)) {
      BetData.virtual_bet_list.push(id);
    }
  }
  /**
   * @description: 删除指定的虚拟投注项列表
   * @param {*}BetData.
   * @param {*} i 要删除列表中数据的索引
   */
  virtual_bet_list_del(i) {
    let temp = Object.assign([], BetData.virtual_bet_list);
    temp.splice(i, 1);
    BetData.virtual_bet_list = temp;
  }
  /**
   * @description: 设置虚拟体育投注项对象
   * @param {*}BetData.
   * @param {*} obj
   */
  set_virtual_bet_s_obj(obj) {
    BetData.virtual_bet_s_obj = obj;
  }
  /**
   * @description: 添加虚拟体育投注项对象
   * @param {*}BetData.
   * @param {*} obj 新增的投注想对象
   */
  virtual_bet_obj_add(obj) {
    if (obj.key) {
      BetData.virtual_bet_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      BetData.virtual_bet_obj = _.cloneDeep(this.virtual_bet_obj);
    }
  }
  /**
   * @description: 删除虚拟体育投注项对象
   * @param {*}BetData.
   * @param {*} key 要删除的投注项对象键值
   */
  virtual_bet_obj_del(key) {
    deleteBetData.virtual_bet_obj[key];
  }
  /**
   * @description: 串关输入列表设置
   * @param {*}BetData.
   * @param {*} list 输入列表集合
   */
  set_virtual_bet_s_list(list) {
    BetData.virtual_bet_s_list = list;
  }
  /**
   * @description: 设置串关输入项的最低限额以及最高可投
   * @param {*}BetData.
   * @param {*} obj
   */
  virtual_bet_s_obj_upd_cs(obj) {
    if (obj && obj.type) {
      if (this.virtual_bet_s_obj[obj.type]) {
        Object.assign(this.virtual_bet_s_obj[obj.type].cs, {
          min_money: obj.minBet,
          max_money: obj.orderMaxPay,
        });
      }
    }
  }
  /**
   * @description: 添加虚拟体育投注输入对象
   * @param {*}BetData.
   * @param {*} obj 新增的对象
   */
  virtual_bet_s_obj_add(obj) {
    if (obj.key) {
      BetData.virtual_bet_s_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      BetData.virtual_bet_s_obj = _.cloneDeep(this.virtual_bet_s_obj);
    }
  }
  /**
   * @description: 删除虚拟投注输入对象
   * @param {*}BetData.
   * @param {*} key 要删除的键
   */
  virtual_bet_s_obj_del(key) {
    deleteBetData.virtual_bet_s_obj[key];
  }
  virtual_bet_s_clear() {
    BetData.virtual_bet_s_list = [];
    BetData.virtual_bet_s_obj = {};
  }
  /**
   * 清除虚拟投注数据
   * @param {*}BetData.
   */
  virtual_bet_clear() {
    BetData.virtual_bet_list = [];
    BetData.virtual_bet_s_list = [];
    BetData.virtual_bet_obj = {};
    BetData.virtual_bet_s_obj = {};
  }
  /**
   * 设置虚拟体育投注模式
   * @param {*}BetData.
   * @param {*} bet_item_lock
   */
  set_virtual_bet_mode(virtual_bet_mode) {
    BetData.virtual_bet_mode = virtual_bet_mode;
  }
  /**
   * 设置投注模式
   * @param {*}BetData.
   * @param {*} bet_item_lock
   */
  set_bet_item_lock(bet_item_lock) {
    BetData.bet_item_lock = bet_item_lock;
  }
  /**
   * 虚拟体育错误提示信息
   * @param {*}BetData.
   * @param {*} virtual_error_info
   */
  set_virtual_error_info(virtual_error_info) {
    BetData.virtual_error_info = virtual_error_info;
  }
  /**
   * 左侧菜单切换
   * @param {*}BetData.
   * @param {*} left_menu_toggle
   */
  set_left_menu_toggle(left_menu_toggle) {
    BetData.left_menu_toggle = left_menu_toggle;
  }
  /**
   * 设置当前电竞查询的模式 false单关模式
   * @param {*}BetData.
   * @param {*} cur_esports_mode
   */
  set_cur_esports_mode(cur_esports_mode) {
    BetData.cur_esports_mode = cur_esports_mode;
  }
  /**
   * 设置是否合并
   * @param {*}BetData.
   * @param {*} is_bet_merge
   */
  set_is_bet_merge(is_bet_merge) {
    BetData.is_bet_merge = is_bet_merge;
  }
  /**
   * 设置投注类别 1: 普通赛事 2: 虚拟体育 3: 电竞
   * @param {*}BetData.
   * @param {*} bet_category
   */
  set_bet_category(bet_category) {
    BetData.bet_category = bet_category;
  }
  /**
   * 设置最小串关数
   * @param {*}BetData.
   * @param {*} mix_min_count
   */
  set_mix_min_count(mix_min_count) {
    BetData.mix_min_count = mix_min_count;
  }
  /**
   * 设置最大串关数
   * @param {*}BetData.
   * @param {*} mix_max_count
   */
  set_mix_max_count(mix_max_count) {
    BetData.mix_max_count = mix_max_count;
  }
  /**
   * 设置被预约的投注项
   * @param {*} param0
   * @param {*} bet_appoint_obj
   */
  set_bet_appoint_obj(bet_appoint_obj) {
    BetData.bet_appoint_obj = bet_appoint_obj;
  }
  set_bet_current_money_obj(money_obj) {
    if (money_obj.value) {
      BetData.bet_current_money_obj[money_obj.id] = money_obj.value;
    } else {
      BetData.bet_current_money_obj = {};
    }
  }

  init_bet_single_data(){
    init_bet_single_data()
  }

  /**
   * @description: 设置 押注扁平化对象扁平
   * @param {*}BetData.
   * @param {*} obj 要设置的数据
  */
  set_bet_obj_add_attr(obj) {
    BetData.bet_obj = obj;
  }

}
export default BetDataCtr();