import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import UserCtr from  "src/core/user-config/user-ctr.js";
import BetData from "src/core/bet/class/bet-data-class.js";
// import { compute_value_by_cur_odd_type } from "./submit_data.js";
// import { get_bet_amount_param } from "./bet-amount.js";
import { http_upd_data } from "./upd_data.js";
import math from "src/core/bet/common/mathjs.js";
import yabo_common from "src/core/bet/common-helper/index.js";
import uid from "src/core/uuid/index.js";
import { ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import lodash from "lodash";

/**
 * @description: 添加单关投注项对象
 * @param {*}
 * @param {*} obj 要添加的对象
 */
export const bet_single_obj_attr = (obj) => {
  let new_obj = _.cloneDeep(BetData.bet_obj);
  // if(obj.key && (Object.keys(new_obj).indexOf(obj.key) > -1) && !(_.get(obj, 'is_update_single', false))) return;
  console.log("添加单关投注项对象----------", obj);
  if (obj.key && !obj.mode) {
    if (obj.cs.source == "is_chat_room" || obj.cs.play_name == "") {
      if (
        obj.cs.play_name == "" &&
        BetData.bet_single_obj[obj.key] &&
        BetData.bet_single_obj[obj.key].cs &&
        BetData.bet_single_obj[obj.key].bs
      ) {
        let _cs = _.cloneDeep(BetData.bet_single_obj[obj.key].cs);
        let _bs = _.cloneDeep(BetData.bet_single_obj[obj.key].bs);
        obj.cs.play_name = _cs.play_name;
        obj.bs.hps[0].hl[0].ol.hpn = _bs.hps[0].hl[0].ol.hpn;
      }
      BetData.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      BetData.bet_single_obj = _.cloneDeep(BetData.bet_single_obj);
    } else {
      BetData.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
      BetData.bet_single_obj = _.cloneDeep(BetData.bet_single_obj);
    }
  } else if (obj.key && obj.mode == "clear_and_add") {
    BetData.bet_single_obj = {};
    BetData.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
    BetData.bet_single_obj = _.cloneDeep(BetData.bet_single_obj);
  } else if (obj && !obj.key) {
    BetData.bet_single_obj = obj;
  }
};

/**
 * @description: 移除单关投注项对象
 * @param {*}BetData.
 * @param {*} key 要移除的投注项的键值
 */
export const bet_single_obj_remove_attr = (key) => {
  deleteBetData.bet_single_obj[`${key}`];
};

/**
 * @description: 移除单关列表
 * @param {*}BetData.
 * @param {*} i 要移除的位置
 */
export const bet_single_list_remove = (i) => {
  let temp = Object.assign([], BetData.bet_single_list);
  temp.splice(i, 1);
  BetData.bet_single_list = temp;
};

/**
 * @description:清空押注成功的信息
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
export const clear_bet_single_list = () => {
  let len = BetData.bet_single_list.length;
  for (let index = 0; index < len; index++) {
    let id =  BetData.bet_single_list[index]  ;
    // 投注客户端对象
    let item_cs = _.get(BetData.bet_single_obj, `${id}.cs`, {});
    // 提交状态为已提交(submit_status=true)
    if (_.get(item_cs, "submit_status")) {
      // 移除单关投注项对象
      bet_single_obj_remove_attr(id);
      // 从单关列表中移除投注项id
      bet_single_list_remove(index, 1);
      index--;
    }
  }
};

/**
 * @description: 初始化单关数据
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const init_bet_single_data = () => {
  _.forEach(BetData._bet_single_list, (item) => {
    let bs = _.cloneDeep(_.get(BetData.bet_single_obj, `[${item}].bs`, {}));
    let cs = _.cloneDeep(_.get(BetData.bet_single_obj, `[${item}].cs`, {}));
    if (_.get(cs, "submit_status")) {
      let obj = JSON.parse('{"key":"", "bs":{}, "cs":{}}');
      obj.key = item;
      obj.bs = bs;
      Object.assign(cs, {
        money: "", // 投注额
        win_money: "", // 可赢额
        min_money: "", // 最大值
        max_money: "", // 最小值
        submit_status: false,
      });
      obj.cs = cs;
      bet_single_obj_attr(obj);
    }
  });
  // 清除押注成功的投注想
  clear_bet_single_list();
};
