import MenuData from "src/core/menu-pc/menu-data-class.js";
import PageSourceData from "src/core/page-source-h5/page-source-h5.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import BetData from "../class/bet-data-class";
import { compute_value_by_cur_odd_type } from "./bet_odds_change.js";
import { get_bet_amount_param } from "./bet-amount.js";
import { http_upd_data, bet_obj_add_attr } from "./upd_data.js";
import { bet_single_obj_attr } from "./bet-model-single.js";
import mathjs from "src/core/utils/mathjs.js";
import yabo_common from "src/core/bet/common-helper/index.js";
import { uid } from "quasar";
import { ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";

/**
 * @description: 设置提交状态
 * @param {Object} order_item 订单数据
 * @return {undefined} undefined
 */
const set_submit_status = (order_item) => {
  if (BetData.is_bet_single) {
    // 设置押注成功后的标识符
    BetData.bet_single_list.forEach((id) => {
      let item = _.cloneDeep(_.get(BetData.bet_single_obj, `[${id}]`, {}));
      let oid = _.get(item, "bs.hps[0].hl[0].ol[0].oid");
      if (oid == _.get(order_item, "playOptionsId")) {
        // 提交投注项id并设置key
        item.key = id;
        // 提交状态
        item.cs.submit_status = true;
        bet_single_obj_attr(item);
      }
    });
  } else {
    // 设置押注成功后的标识符
    BetData.bet_list.forEach((id) => {
      let item = _.cloneDeep(BetData.bet_obj[id]);
      let oid = _.get(item, "bs.hps[0].hl[0].ol[0].oid");
      if (oid == _.get(order_item, "playOptionsId")) {
        // 提交投注项id并设置key
        item.key = id;
        // 提交状态
        item.cs.submit_status = true;
        // 判断是否提交成功
        bet_obj_add_attr(item);
      }
    });
  }
};

/**
 * @description: 获取投注项状态
 * @param {Number} matchHandicapStatus 赛事盘口状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
 * @param {Number} status 盘口状态0-5。 0：有效，1：暂停，2：停用，3：已结算，4：已取消，5：移交
 * @param {Number} active 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
 * @return {Number} 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
 */
export const get_odds_active = (matchHandicapStatus, status, active) => {
  var active_ = 1;
  // console.log(`matchHandicapStatus==${matchHandicapStatus}, ${status}, ${active}`);
  if (matchHandicapStatus) {
    // 赛事盘口有操作变化时
    if (matchHandicapStatus == 1) {
      //赛事封盘状态
      active_ = 2;
    } else if (matchHandicapStatus == 11) {
      //赛事锁盘
      if (active != 1) {
        active_ = active;
      } else {
        active_ = 4;
      }
    } else if (
      matchHandicapStatus == 2 ||
      matchHandicapStatus == 3 ||
      matchHandicapStatus == 4 ||
      matchHandicapStatus == 5
    ) {
      //赛事关盘
      active_ = 3;
    }
    return active_;
  }

  if (status) {
    // 盘口有操作变化时
    if (status == 1) {
      //盘口封盘
      active_ = 2;
    } else if (status == 2 || status == 3 || status == 4 || status == 5) {
      //盘口关盘
      active_ = 3;
    } else if (status == 11) {
      //盘口锁盘
      active_ = 4;
    }
    return active_;
  }
  return active;
};

/**
 * @description: 押注显示时判断是否禁用状态
 * @param {Object} item_  投注项对象
 * @return {Boolean} undefined
 */
const get_item_disable = (item_) => {
  let ret = false;
  let active = get_odds_active(
    _.get(item_, "mhs"),
    _.get(item_, "hps[0].hl[0].hs"),
    _.get(item_, "hps[0].hl[0].ol[0].os")
  );
  // 判断盘口是否可用
  if (active != 1 && active != 4) {
    ret = true;
  }
  return ret;
};

/**
 * @description: 串关失效投注项的个数
 * @param {*} get_deactive_count
 * @return {*}
 */
const get_deactive_count = () => {
  let bet_obj,
    count = 0;
  try {
    bet_obj = BetData.is_bet_single
      ? _.get(BetData, "bet_single_obj")
      : _.get(BetData, "bet_obj");
    if (_.isEmpty(bet_obj)) return count;
    for (let obj of Object.values(bet_obj)) {
      let active = 1;
      let cs = _.get(obj, "cs", false);
      if (cs) {
        // 赛事盘口状态
        let match_status = cs.match_status;
        // 盘口状态
        let handicap_status = cs.handicap_status;
        // 是否可以串关
        let serial_type = cs.serial_type;
        // 投注项状态
        active = cs.active;
        active = get_odds_active(match_status, handicap_status, active);
        if ([2, 3].includes(active)) {
          count++;
        } else if (!BetData.is_bet_single && !serial_type) {
          count++;
        }
        // console.log(`=========match_status:${match_status}=========handicap_status:${handicap_status}============active:${active}`);
      }
    }
  } catch (e) {
    count = 1000;
    console.log(`====================获取异常count:${count}`);
  }

  return count;
};

/**
 * 判断是否还有失效的投注项
 */
const has_disable_item = () => {
  let index, mhs, hs, active;
  if (BetData.is_bet_single) {
    index = _.findIndex(BetData.bet_single_list, (item) => {
      mhs = _.get(BetData.bet_single_obj, `${item}.cs.match_status`, 0) * 1;
      hs = _.get(BetData.bet_single_obj, `${item}.cs.handicap_status`, 0) * 1;
      active = _.get(BetData.bet_single_obj, `${item}.cs.active`, 1) * 1;
      return (
        [1, 2].includes(mhs) || [1, 2].includes(hs) || [2, 3].includes(active)
      );
    });
  } else {
    index = _.findIndex(BetData.bet_list, (item) => {
      mhs = _.get(BetData.bet_obj, `${item}.cs.match_status`, 0) * 1;
      hs = _.get(BetData.bet_obj, `${item}.cs.handicap_status`, 0) * 1;
      active = _.get(BetData.bet_obj, `${item}.cs.active`, 1) * 1;
      return (
        [1, 2].includes(mhs) ||
        [1, 2].includes(hs) ||
        [2, 3].includes(active) ||
        BetData.bet_list.length == 1
      );
    });
  }
  return index > -1;
};
const get_bet_scroll_top = (comp, name, index) => {
  return comp.$refs[name].$children[index].$el.offsetTop;
};
