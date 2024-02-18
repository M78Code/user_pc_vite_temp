/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:50
 * @Description: 注部分公共方法提取(包括与列表,详情,投注项三部分)
 */
import BetData from "src/core/bet/class/bet-data-class.js";
// import {
//   get_bet_amount_param
// } from "./bet-amount.js";
// import {
//   http_upd_data
// } from "./upd_data.js";
// import mathjs from "src/core/utils/mathjs.js";
// import yabo_common from "src/core/bet/common-helper/index.js";
import {
  uid
} from "quasar";
import {
  ref
} from "vue";
import {
  useMittOn,
  useMittEmit,
  MITT_TYPES
} from "src/core/mitt/index.js";
import {VIRTUAL_PLAY_LET_BALL, ESPORTS_PLAY_LET_BALL} from "src/output/module/constant-utils.js";
import _ from "lodash";



/**
 * @description: 串关失效投注项的个数
 * @return {number}
 */
export const get_deactive_count = () => {

  count = 0;
  try {


    let arr = BetData.get_current_show_bet_obj_arr()
    for (let obj in arr) {
      let active = 1;
      let cs = _.get(obj, "cs", false);
      if (cs) {
        // 赛事盘口状态
        let match_status = cs.match_status;
        // 盘口状态
        let handicap_status = cs.handicap_status;
        // 投注项状态
        active = cs.active;
        // console.log(`=========get_deactive_count=====match_status:${match_status}=====handicap_status:${handicap_status}=========active:${active}`);
        active = get_odds_active(match_status, handicap_status, active);
        if ([2, 3].includes(active)) {
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
 * @description: 整理投注项信息
 * @param {Object} cur_obj 当前vuex中的对象
 * @param {Object} bet_obj 接口查询后对应的投注项数据
 * @param {String} source  vuex中投注项的来源
 * @return {Object} 返回需要更新的投注项对象数据
 */
export const tidy_virtual_bet_item = (cur_obj, bet_obj, source) => {
  let obj = {
      bs: {},
      cs: {}
    },
    item_obj,
    hps,
    hl,
    ol,
    bet_omit_obj = {},
    // fields为组合赛事需要保留的对象字段 hps
    fields = [
      "csid",
      "mid",
      "tid",
      "msc",
      "tn",
      "no",
      "mmp",
      "tlev",
      "ms",
      "mgt",
      "mcg",
      "mhs",
      "teams",
      "batchNo",
    ],
    hps_fields = ["hpid", "hpn", "hsw", "title", "hl", "hps"],
    hl_fields = ["hid", "hmt", "hs", "hv", "hn", "ol"],
    ol_fields = ["oid", "on", "ov", "obv", "otd", "otv", "ott"];
  // 深度复制对象
  item_obj = _.clone(bet_obj);
  for (let [key, value] of Object.entries(item_obj)) {
    if (fields.includes(key)) {
      bet_omit_obj[key] = value;
    }
  }
  hps = _.cloneDeep([item_obj.play]);
  hl = _.cloneDeep(hps[0].hl);
  ol = _.cloneDeep(hps[0].hl[0].ol);

  bet_omit_obj.hps = _.cloneDeep([item_obj.play]);
  for (let [key, value] of Object.entries(item_obj)) {
    if (fields.includes(key)) {
      bet_omit_obj[key] = value;
    }
  }

  for (let key of Object.keys(hps[0])) {
    if (!hps_fields.includes(key)) {
      delete bet_omit_obj.hps[0][key];
    }
  }
  for (let key of Object.keys(hl[0])) {
    if (!hl_fields.includes(key)) {
      delete bet_omit_obj.hps[0].hl[0][key];
    }
  }
  for (let key of Object.keys(ol[0])) {
    if (!ol_fields.includes(key)) {
      delete bet_omit_obj.hps[0].hl[0].ol[0][key];
    }
  }
  // 如果来源是赛事列表:match_list,热门推荐:hot,近期关注:recent
  if (!["details", "match_details"].includes(source)) {
    let cur_home = _.trim(_.get(cur_obj, "bs.teams[0]"));
    let cur_away = _.trim(_.get(cur_obj, "bs.teams[1]"));
    let cur_on = _.trim(_.get(cur_obj, "bs.hps[0].hl[0].ol[0].on", ""));
    let hv = _.get(cur_obj, "bs.hps[0].hl[0].hv");
    let hpid = _.get(cur_obj, "bs.hps[0].hpid");
    if ((hv || hv == "0") && !hv.includes("/")) {
      hv = Math.abs(hv);
    } else if (hv && (hv.startsWith("+") || hv.startsWith("-"))) {
      hv = hv.replace("+", "");
      hv = hv.replace("-", "");
    }
    if (cur_on == cur_home) {
      // on值为主队
      bet_omit_obj.hps[0].hl[0].ol[0].on = _.get(item_obj, "teams[0]");
      bet_omit_obj.hps[0].hl[0].ol[0].ots = "T1";
    } else if (cur_on == cur_away) {
      // on值为客队
      bet_omit_obj.hps[0].hl[0].ol[0].on = _.get(item_obj, "teams[1]");
      bet_omit_obj.hps[0].hl[0].ol[0].ots = "T2";
    } else if (cur_on == hv || cur_on == `+${hv}` || cur_on == `-${hv}`) {
      //on值包含了盘口
      bet_omit_obj.hps[0].hl[0].ol[0].on = cur_on;
    } else if (
      hv &&
      cur_on.startsWith(cur_home) &&
      cur_on.endsWith(hv) &&
      cur_on.endsWith(hv) && [
        ...VIRTUAL_PLAY_LET_BALL,
        ...ESPORTS_PLAY_LET_BALL,
      ].includes(hpid)
    ) {
      //on值包含了主对名称和盘口
      let arr = cur_on.split(" "),
        len = arr.length;
      bet_omit_obj.hps[0].hl[0].ol[0].on = `${_.get(item_obj, "teams[0]")} ${
        arr[len - 1]
      }`;
    } else if (
      hv &&
      cur_on.startsWith(cur_away) &&
      cur_on.endsWith(hv) && [
        ...VIRTUAL_PLAY_LET_BALL,
        ...ESPORTS_PLAY_LET_BALL,
      ].includes(hpid)
    ) {
      //on值包含了客对名称和盘口
      let arr = cur_on.split(" "),
        len = arr.length;
      bet_omit_obj.hps[0].hl[0].ol[0].on = `${_.get(item_obj, "teams[1]")} ${
        arr[len - 1]
      }`;
    } else {
      let otv = _.get(ol, "0.otv", ""),
        ott = _.get(ol, "0.ott", "");
      if (otv != ott) {
        if (otv.includes(ott)) {
          bet_omit_obj.hps[0].hl[0].ol[0].on = otv;
        } else {
          bet_omit_obj.hps[0].hl[0].ol[0].on = ott;
        }
      }
    }
  } else {
    bet_omit_obj.hps[0].hl[0].ol[0].otv = _.get(ol, "0.otv", "");
    bet_omit_obj.hps[0].hl[0].ol[0].ott = _.get(ol, "0.ott", "");
    bet_omit_obj.hps[0].hl[0].ol[0].on = _.get(ol, "0.on", "");
  }
  Object.assign(obj.bs, {
    ...bet_omit_obj
  });
  obj.cs = {
    play_name: _.get(bet_omit_obj, "hps[0].hpn"), //玩法名称
  };
  return obj;
};
/**
 * @description: 判断是否还有失效的投注项
 * @return {undefined}
 */
export const has_disable_item = (virtual_bet_obj, virtual_bet_list) => {
  let index, mhs, hs, active, serial_type;
  index = _.findIndex(virtual_bet_list, (item) => {
    mhs = _.get(virtual_bet_obj, `${item}.cs.match_status`, 0) * 1;
    hs = _.get(virtual_bet_obj, `${item}.cs.handicap_status`, 0) * 1;
    active = _.get(virtual_bet_obj, `${item}.cs.active`, 1) * 1;
    serial_type = _.get(virtual_bet_obj, `${item}.cs.serial_type`, 1) * 1;
    return (
      [1, 2].includes(mhs) || [1, 2].includes(hs) || [2, 3].includes(active) ||
      serial_type !== 1
    );
  });
  return index > -1;
};

/**
 * @description: 更新投注项对象
 * @return {undefined} undefined
 */
export const upd_bet_obj = (timestap, mid) => {


  let arr = BetData.get_current_show_bet_obj_arr()

  arr.map(bet_obj => {
    let match_id = _.get(bet_obj, `.cs.match_id`, "");
    if (match_id == mid) {
      upd_bet_obj_item(item, timestap);
    }
  })


};
export const upd_bet_obj_item = (bet_obj, item, handle_time) => {
  let beting_data = BetData.get_current_show_bet_obj_arr()
  Object.assign(beting_data, {
    key: id,
    bs: item_obj,
    cs: {
      id, // 投注项id
      oid, // 投注项oid
      kid, // 坑位id
      match_id: _.get(ol_obj, "_mid"), // 赛事id
      handicap_id: _.get(ol_obj, "_hid"), //盘口id
      play_id, //玩法id
      sport_id: _.get(item_obj, "csid"), //球种
      match_status: _.get(ol_obj, "_mhs"), //赛事盘口状态
      handicap_value, // 盘口
      handicap_status: _.get(ol_obj, "_hs"), //盘口状态
      odds_value, //赔率
      active: _.get(ol_obj, "os"), // 投注项状态
      play_name: _.get(item_obj, "hps[0].hpn", ""), //玩法名称
      odds_switch: _.get(item_obj, "hps[0].hsw", ""), //支持的赔率转换模板
      break_odds_value: _.get(ol_obj, "obv"), //断档赔率
      target_side, //T1,T2
      score_type,
      home_id: _.get(item_obj, "mhid"), // 主队id
      home: _.get(item_obj, "mhn"), //主队
      home_score, // 主队得分
      away_id: _.get(item_obj, "maid"), // 客队id
      away: _.get(item_obj, "man"), //客队
      away_score, // 客队得分
      effect: ["1", "4"].includes(`${active}`), // 是否有效
      full_bet: 0, //是否满额投注，1：是，0：否
      money: _.get(cs, "money"), // 投注额
      win_money: _.get(cs, "win_money", ""), // 可赢额
      min_money: _.get(cs, "min_money", ""), // 最大值
      max_money: _.get(cs, "max_money", ""), // 最小值
      source: _.get(that, "socket_name", ""),
      match_type: _.get(cs, "match_type", ""), // 赛事类型
      market_type: _.get(cs, "market_type", ""), // 盘口类型
      hv_ov_change, // 盘口值与赔率是否一起变化
      handle_time,
      serial_type: _.get(cs, "serial_type", true), // 是否可以进行串关
      match_update: _.get(cs, "match_update", false),
    },
  });
  useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_ADD, beting_data);
}