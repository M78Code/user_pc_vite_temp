import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import UserCtr from  "src/core/user-config/user-ctr.js";
import BetData from "src/core/bet/class/bet-data-class.js.js";
import { compute_value_by_cur_odd_type } from "./submit_data.js";
import { get_bet_amount_param } from "./bet-amount.js";
import { http_upd_data } from "./upd_data.js";
import mathjs from "src/core/utils/mathjs.js";
import yabo_common from "src/core/bet/common-helper/index.js";
import uid from "src/core/uuid/index.js";
import { ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";

const query_last_market_info_gcuuid = ref(uid());

/**
 * @description:获取赛事是否存在赛果
 * @param {*} params    参数
 * @param {*} callback  回调函数
 * @return {undefined} undefined
 */
export const get_exist_match_result = (params, callback) => {
  api_betting.get_exist_match_result(params).then((res) => {
    let code = _.get(res, "data.code");
    let status = _.get(res, "status");
    if (code == 200 && status) {
      let data = _.get(res, "data.data");
      if (_.isFunction(callback)) {
        callback(code, data);
      }
    } else {
      if (_.isFunction(callback)) {
        callback(code, "");
      }
    }
  });
};

/**
 * @description: 投注前拉取最新的盘口赔率状态(应对socket推送不及时)
 * @param {Founction} callback
 * @return {undefined} undefined
 */
export const check_odds_beforebet = (callback) => {
  let param = {
    idList: [],
  };
  //单关
  if (BetData.is_bet_single) {
    //单关数据为空
    if (BetData.bet_single_list.length == 0) return;
    // 单关投注前校验接口参数组装
    for (let obj of Object.values(BetData.bet_single_obj)) {
      let temp = {};
      // 盘口id
      temp.marketId = _.get(obj, "bs.hps[0].hl[0].hid");
      // 赛事id
      temp.matchInfoId = _.get(obj, "bs.mid");
      // 投注项oid
      temp.oddsId = _.get(obj, "bs.hps[0].hl[0].ol[0].oid");
      // 投注项类型
      temp.oddsType = _.get(obj, "bs.hps[0].hl[0].ol[0].ot");
      // 玩法id
      temp.playId = _.get(obj, "bs.hps[0].hpid");
      // 坑位
      temp.placeNum = _.get(obj, "bs.hps[0].hl[0].hn");
      // 赛事类型
      temp.matchType = _.get(obj, "cs.match_type");
      // 球种id
      temp.sportId = _.get(obj, "bs.csid");
      param.idList.push(temp);
    }
  } else {
    // 串关
    //单关数据为空
    if (BetData.bet_list.length == 0) return;
    // 串关投注前校验接口参数组装
    for (let obj of Object.values(BetData.bet_obj)) {
      let temp = {};
      // 盘口id
      temp.marketId = _.get(obj, "bs.hps[0].hl[0].hid");
      // 赛事id
      temp.matchInfoId = _.get(obj, "bs.mid");
      // 投注项oid
      temp.oddsId = _.get(obj, "bs.hps[0].hl[0].ol[0].oid");
      // 投注项类型
      temp.oddsType = _.get(obj, "bs.hps[0].hl[0].ol[0].ot");
      // 玩法id
      temp.playId = _.get(obj, "bs.hps[0].hpid");
      // 坑位
      temp.placeNum = _.get(obj, "bs.hps[0].hl[0].hn");
      // 赛事类型
      temp.matchType = _.get(obj, "cs.match_type");
      // 球种id
      temp.sportId = _.get(obj, "bs.csid");
      param.idList.push(temp);
    }
  }
  query_last_market_info_gcuuid.value = uid();
  param.gcuuid = query_last_market_info_gcuuid.value;
  // console.log('query_last_market_info====',param);
  // 查询最新的盘口数据
  api_betting.query_last_market_info(param).then((res) => {
    let gcuuid = _.get(res, "config.gcuuid");
    if (gcuuid && query_last_market_info_gcuuid.value != gcuuid) {
      return;
    }
    //code码
    let code = _.get(res, "data.code");
    //返回数据
    let data = _.get(res, "data.data", []);
    if (data && data instanceof Array && data[0]) {
      if (BetData.is_bet_single) {
        BetData.bet_single_list.forEach((item, i) => {
          // 调用vuex中的http_upd_data方法同步数据
          http_upd_data({
            i: i,
            http_data_list: data,
          });
        });
      } else {
        BetData.bet_list.forEach((item, i) => {
          // 调用vuex中的http_upd_data方法同步数据
          http_upd_data({
            i: i,
            http_data_list: data,
          });
        });
      }
    }
    // 如果回调函数存在,则调用
    if (_.isFunction(callback)) callback(code);
  });
};
 