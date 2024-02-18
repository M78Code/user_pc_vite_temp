import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewData from "src/core/bet/class/bet-view-data-class.js";


import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { PLAY_LET_BALL,PLAY_GOAL,PLAY_TODAY_SCORE,PLAY_ALL_KINDS,PLAY_RESULT } from "src/output/module/constant-utils.js";
import { play_name_mapping_csid } from "src/output/module/constant-utils.js";
import _ from "lodash";

 



/**
 * @description: 球种名称与id对应关系
 * @param {String} csid 球种id
 * @return {Object} 映射的对象
 */
export const play_name_mapping = (csid) => {
  return play_name_mapping_csid[csid];
};
/**
 * @description: 获取盘口值
 * @return {String} 盘口值
 */
export const get_handicap_id = () => {
  let bet_obj = BetData.get_bet_obj_by_bet_custom_id(bet_custom_id);

  if (!bet_obj || !bet_obj.cs) return "";
  return bet_obj.cs.handicap_id;
};

/**
 * @description: 赔率计算
 * @param {String} id 传入的id(可能是oid后续可能为坑位id)
 * @return {Double} 赔率
 */
export const get_odds_value = (bet_custom_id) => {
  // let bet_obj = BetData.get_bet_obj_by_bet_custom_id(bet_custom_id);
  // id = get_id(  bet_item_id);
  
  // bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  // cs = _.get(bet_obj, "cs", false);
  // let odds_js = mathjs.divide(cs.odds_value, 100000);
  // let break_js = mathjs.divide(cs.break_odds_value, 100000);
  // if (!_.isEmpty(bet_obj) && cs) {
  //   ret =  compute_value_by_cur_odd_type(odds_js, break_js, cs.odds_switch);
  // }
  // return ret;
};

/**
 * @description: 获取玩法名称
 * @return {String} 玩法名称
 */
export const get_play_id = (bet_custom_id) => {
  let bet_obj = BetData.get_bet_obj_by_bet_custom_id(bet_custom_id);
  let cs = _.get(bet_obj, "cs", false);
  return cs ? _.trim(cs.play_id) : "";
};
/**
 * @description: 获取玩法名称
 * @return {String} 玩法名称
 */
export const get_play_name = (  bet_custom_id) => {
  let bet_obj = BetData.get_bet_obj_by_bet_custom_id(bet_custom_id);
  let cs = _.get(bet_obj, "cs", false);
  return cs ? _.trim(cs.play_name) : "";
};

/**
 * @description: 更新投注项状态
 * @param {Object} obj 更新的对象
 * @return {undefined} undefined
 */
export const update_bet_item_status = (obj) => {
  let bet_obj = BetData.get_bet_obj_by_bet_custom_id(bet_custom_id);
 
   
    cs = _.get(bet_obj, "cs", {});
    if (
      !_.isEmpty(cs) &&
      obj.mid == cs.match_id &&
      (obj.hid == cs.handicap_id || obj.id == cs.id)
    ) {
      update_target_obj(  bet_obj, obj, key);
    }
 
};

/**
 * @description: 更新Object对象(主要是在投注提交时,从后台拉取的方法更新了投注栏后,同步列表与详情对应的投注项对象)
 * @param {Object} bet_obj 投注项对象
 * @param {Object} obj 传入更新的数据
 * @param {String} key 传入的id(可能是oid后续可能为坑位id)back
 * @return {undefined} undefined
 */
export const update_target_obj = (  bet_obj, obj, key) => {
  if (
    _.has(bet_obj, "bs") &&
    _.has(bet_obj, "cs") &&
    _.get(bet_obj, "cs.match_id") == obj.mid &&
    _.get(bet_obj, "cs.handicap_id") == obj.hid &&
    _.get(bet_obj, "cs.id") == obj.id
  ) {
    bet_obj.bs.hps[0].hl[0].ol[0].os = obj.status;
    bet_obj.cs.active = obj.status;
    // console.log(`==========111=====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`);
  } else if (
    bet_obj &&
    bet_obj.bs &&
    bet_obj.cs &&
    bet_obj.cs.match_id == obj.mid &&
    bet_obj.cs.handicap_id == obj.hid &&
    key
  ) {
    obj.id = key;
    bet_obj.bs.hps[0].hl[0].hs = obj.status;
    bet_obj.bs.hps[0].hl[0].ol[0]._hs = obj.status;
    bet_obj.cs.handicap_status = obj.status;
    // console.log(`===========222====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`);
  } else if (
    _.has(bet_obj, "bs") &&
    _.has(bet_obj, "cs") &&
    _.get(bet_obj, "cs.match_id") == obj.mid &&
    key &&
    _.isEmpty(obj.hid)
  ) {
    obj.id = key;
    bet_obj.bs.mhs = obj.status;
    bet_obj.bs.hps[0].hl[0].ol[0]._mhs = obj.status;
    bet_obj.cs.match_status = obj.status;
    // console.log(`==========333=====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`);
  }
  if (bet_obj) {
    set_bet_obj_value(  bet_obj);
  }
};

/**
 * @description: 更新投注项的比分
 * @param {Object} 投注更新的目标对象
 * @param {String} id 投注项的id
 * @return {undefined} undefined
 */
export const set_bet_obj_value = (obj) => {
  if (_.isPlainObject(obj)) {
    obj.key = _.get(obj, "cs.id", "");

    useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_ADD, obj);
  }
};

/**
 * @description: 初始化提示信息
 * @return {undefined} undefined
 */
export const del_bet_item = (virtual_bet_obj, virtual_bet_list, id) => {
  let bet_obj = _.get(virtual_bet_obj, `${id}`);
  if (bet_obj && bet_obj.bs) {
    let index = virtual_bet_list.findIndex((it) => it === id);
    //移除对应的键值对
    useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_DEL, id);
    //移除对应的数据
    useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_DEL, index);
  }
};

/**
 * @description: 获取批次

 * @return {*}
 */
export const get_batch_no = (virtual_bet_obj) => {
  let bet_obj = _.get(virtual_bet_obj, `${id}`),
    batch_no = "";
  if (_.has(bet_obj, "bs")) {
    let item_bs = _.get(bet_obj, "bs", {});
    batch_no = item_bs.batchNo;
  }
  return batch_no;
};

/**
 * @description: 获取轮次

 * @return {*}
 */
export const get_no = (virtual_bet_obj) => {
  let bet_obj = _.get(virtual_bet_obj, `${id}`),
    no = "";
  if (_.has(bet_obj, "bs")) {
    let item_bs = _.get(bet_obj, "bs", {});
    no = item_bs.no;
  }
  return no;
};

/**
 * @description: 返回数字集合
 * @param {*}
 * @return {*}
 */
export const get_numbers = (virtual_bet_obj, id) => {
  let ot = _.get(virtual_bet_obj, `${id}.bs.hps[0].hl[0].ol[0].ot`);
  if (ot) {
    if (ot.includes("/")) {
      return ot.split("/");
    }
    return ot;
  }
  return [];
};

/**
 * @description: 获取球种id

 * @return {*}
 */
export const get_sport_id = (virtual_bet_obj, bet_item_id) => {
  return _.get(virtual_bet_obj, `${bet_item_id}.bs.csid`);
};

/**
 * @description: 盘口和赔率是否一起变化
 * @return {boolean}
 */
export const get_hv_ov_change = (bet_custom_id) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  if (_.has(bet_obj, "bs") && _.has(bet_obj, "cs")) {
    let bet_cs = bet_obj.cs;
    let hn = _.get(bet_obj, "bs.hps[0].hl[0].hn");
    if (hn) {
      return _.get(bet_cs, "hv_ov_change", false);
    }
  }
  return false;
};

/**
 * @description: 获取盘口值
 * @return {String} 盘口值
 */
export const get_handicap = (bet_custom_id) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
 
      let   item_bs,
    item_cs,
    team_name = "",
    handicap = "",
    hpid,
    target_side;
  if (!_.has(bet_obj, "bs") || !_.has(bet_obj, "cs")) return "";
  item_bs = bet_obj.bs;
  item_cs = bet_obj.cs;
  if (item_cs && item_bs) {
    handicap = _.get(item_cs, "handicap_value", "");
    hpid = `${_.get(item_cs, "play_id")}`;
    if ([340, 141, 7, 341, 20].includes(hpid * 1)) {
      return "";
    }
    target_side = _.get(item_cs, "target_side", "");
    console.log(
      "正常投注参数playOptionName处理------------99",
      handicap,
      item_cs.source
    );
    console.log(
      "正常投注参数playOptionName处理------------990",
      handicap,
      item_cs
    );
    // 1-1比分形式
    if (
      (handicap &&
        ((handicap.includes("-") &&
          !handicap.startsWith("-") &&
          !handicap.endsWith("-")) ||
          i18n_t("list.other") == handicap)) ||
      (handicap && item_cs.source == "is_chat_room")
    ) {
      if (item_cs.source == "is_chat_room") {
        const otv = _.get(item_bs, "hps[0].hl[0].ol[0].otv", "");
        handicap = otv ? "" : _.get(item_bs, "hps[0].hl[0].ol[0].on", "");
      }
      return handicap;
    }
    // 以下逻辑同 列表中tips的显示逻辑 非赛事详情
    if (
      !["details", "match_details", "is_chat_room"].includes(item_cs.source)
    ) {
      // 让球玩法数组中PLAY_LET_BALL中包含的则显示队伍名称与盘口值 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
      if (
        PLAY_LET_BALL.includes(hpid) ||
        !PLAY_GOAL.includes(hpid) ||
        (PLAY_GOAL.includes(hpid) && target_side == "")
      ) {
        team_name = `${_.get(item_bs, "hps[0].hl[0].ol[0].on", "")}`;
      }
      //玩法名称存在 盘口存在 并且玩法id不是在PLAY_ALL_KINDS中包含 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
      if (
        team_name &&
        handicap &&
        handicap != "" &&
        !PLAY_ALL_KINDS.includes(hpid)
      ) {
        // 如果盘口存在且可以转化成数字,则去掉正负号后进行匹配(防止接口hv字段的盘口值与on或者otv字段中盘口值正负号不一致造成页面显示问题)
        if (!handicap.includes("/") && !isNaN(handicap)) {
          if (handicap.includes(".")) {
            // 精度问题
            handicap = Math.abs(handicap).toFixed(1);
          } else {
            handicap = Math.abs(handicap);
          }
        } else if (
          handicap.includes("/") &&
          (handicap.startsWith("+") || handicap.startsWith("-"))
        ) {
          handicap = handicap.substr(1, handicap.length);
        }
        //以+结尾
        if (
          team_name.endsWith(`+${handicap}`) ||
          _.trim(team_name) == `+${handicap}`
        ) {
          return `+${handicap}`;
        } else if (
          team_name.endsWith(`${handicap}+`) ||
          _.trim(team_name) == `${handicap}+`
        ) {
          return `${handicap}+`;
        } else if (
          team_name.endsWith(`-${handicap}`) ||
          _.trim(team_name) == `-${handicap}`
        ) {
          return `-${handicap}`;
        } else if (
          team_name.endsWith(`${handicap}-`) ||
          _.trim(team_name) == `${handicap}-`
        ) {
          return `${handicap}-`;
        } else if (
          team_name.endsWith(handicap) ||
          _.trim(team_name) == handicap
        ) {
          return handicap;
        } else if (team_name.includes(`+${handicap}`)) {
          return `+${handicap}`;
        } else if (team_name.includes(`-${handicap}`)) {
          return `-${handicap}`;
        }
      } else {
        if ([7, 20, 74, 341, 342].includes(+hpid)) {
          handicap = `${_.get(item_bs, "hps[0].hl[0].ol[0].ot", "")}`;
          handicap = handicap.replace(":", "-");
        } else {
          handicap = "";
        }
      }
    } else {
      //如果是详情部分特殊玩法
      if (PLAY_RESULT.includes(hpid)) {
        console.log("正常投注参数playOptionName处理------------991", handicap);
        //投注项显示值
        let on = _.get(item_bs, "hps[0].hl[0].ol[0].on", "");
        //投注时所需展示的信息
        let otv = _.get(item_bs, "hps[0].hl[0].ol[0].otv", "");
        //投注项类型
        let ot = _.get(item_bs, "hps[0].hl[0].ol[0].ot", "");
        let hpid = _.get(item_bs, "hps[0].hpid", "");
        if (otv && on && otv.endsWith(on) && !["383", "359"].includes(hpid)) {
          handicap = _.get(item_bs, "hps[0].hl[0].ol[0].on", "");
        } else {
          handicap = "";
        }
      } else {
        //盘口值
        let hv = _.get(item_bs, "hps[0].hl[0].hv", "");
        // if(item_cs.source=="is_chat_room"){
        //   hv = _.get(item_bs, 'hps[0].hl[0].ol[0].hv', '')
        //   console.log(hv);

        // }

        console.log(
          "正常投注参数playOptionName处理------------992",
          handicap,
          "****",
          hv,
          item_bs,
          item_cs
        );
        console.log(
          "正常投注参数playOptionName处理------------996",
          handicap,
          "****",
          JSON.stringify(_.get(item_bs, "hps[0].hl[0].ol[0]"))
        );
        if (hv || hv == "0") {
          handicap = _.get(item_bs, "hps[0].hl[0].ol[0].on", "");
          console.log(
            "正常投注参数playOptionName处理------------994",
            handicap,
            "****",
            hv
          );
          // 盘口中间不能包含‘-’ 不能以'+'结尾
          if (handicap && isNaN(parseFloat(handicap))) {
            handicap = "";
          }
        }
        // else if(['341', '342'].includes(hpid)){
        //   // handicap = _.get(item_bs, 'hps[0].hl[0].ol[0].ot', '');
        // }
        else {
          handicap = "";
        }
        console.log(
          "正常投注参数playOptionName处理------------993",
          handicap,
          "****",
          hv
        );
      }
    }
  }
  //  console.log('handicap===', handicap);
  return handicap;
};
/**
 * @description: 获取投注项显示的状态
 * @return {String} 显示的状态
 */
export const get_active = (  bet_custom_id) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  let cs = _.get(bet_obj, "cs", false);
  let active = 3;
  if (cs) {
    // 赛事盘口状态
    let match_status = cs.match_status;
    // 盘口状态
    let handicap_status = cs.handicap_status;
    // 投注项状态
    active = cs.active;
    active =  get_odds_active(match_status, handicap_status, active);
  }
  return active;
};
/**
 * @description: 获取冠军玩法联赛赛季名称
 * @return {String} 赛季名称
 */
export const get_season = (bet_custom_id) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  let   season_name = "";
  if (_.has(bet_obj, "bs")) {
    let item_bs = bet_obj.bs;
    season_name = _.get(item_bs, "onTn", "");
  }
  return season_name;
};
/**
 * @description: 是否可以进行串关

 */
export const get_serial = (bet_custom_id) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  return _.get(bet_obj, "cs.is_serial", false);
};



export const reset_style=(obj)=>{
  // 复位赔率样式
  obj.odds_change_up = false;
  obj.odds_change_down = false;
  obj.handicap_change = false;
  obj.odds_status_change = false; 
}

/**
 * @description: 复位盘口变换标志
 * @param {Integer} delay 延迟多少毫秒
 * @return {undefined} undefined
 */
export const reset_hadicap_change = ( delay, bet_item_id) => {
  // 如果是封盘或者关盘时
  if (BetViewData.active == 2 || BetViewData.active == 3) {
    BetViewData.timer_ = setTimeout(() => {
      // 复位赔率样式
      // reset_style({})
      let bet_obj = _.cloneDeep(BetData. get_bet_obj_by_bet_custom_id(bet_custom_id))  
      if (_.has(bet_obj, "cs")) {
        bet_obj.key = bet_item_id;
        bet_obj.cs.hv_ov_change = false;
        set_bet_obj_value(  bet_obj);
      }
      clearTimeout(BetViewData.timer_);
      BetViewData.timer_ = undefined;
    }, delay);
  }
};






/**
 * @description: 复位盘口及赔率的变换标志
 * @return {undefined} undefined
 */
export const reset_odds_handicap_change = (  bet_item_id) => {
 
// reset_style({})
  // 恢复盘口值和赔率一起变化的标志
  let bet_obj = _.cloneDeep(BetData. get_bet_obj_by_bet_custom_id(bet_custom_id))  

  if (_.has(bet_obj, "cs") && !_.isUndefined(bet_obj, "cs")) {
    bet_obj.key = bet_item_id;
    bet_obj.cs.hv_ov_change = false;
    set_bet_obj_value(  bet_obj);
  }
  // console.log('=====================reset_odds_handicap_change=============');
  //串关失效投注项的个数
  let count = get_deactive_count( );
  if (count > 0) return;
  BetViewData.error_code = BetViewData.error_code || "";
  // 若视图错误吗不为空并且不是自定义错误码(以M开头的错误码为自定义错误码供前端内部自己使用)
  if (
    BetViewData.error_code != "" &&
    !BetViewData.error_code.startsWith("M")
  ) {
    BetViewData.error_code = "";
    BetViewData.error_message = "";
  }
};
/**
 * @description: 复位提示语
 * @return {undefined} undefined
 */
export const reset_message_info = ( ) => {
 
  // console.log('=====================reset_message_info=============');
  let count = get_deactive_count( );
  if (count > 0) return;
  if (BetViewData.error_code) {
    BetViewData.error_code = "";
    BetViewData.error_message = "";
  }
};
/**
 * @description: 复位盘口及赔率的变换标志
 * @param {Integer} delay 延迟多少毫秒
 * @return {undefined} undefined
 */
export const delay_reset_message = (  delay = 3000, callback) => {
  if (BetViewData.timer_) {
    clearTimeout(BetViewData.timer_);
    BetViewData.timer_ = undefined;
  }
  if (delay) {
     
    BetViewData.timer_ = setTimeout(() => {
      //复位盘口及赔率的变换标志
      reset_odds_handicap_change( );
      init_message( );
      if (callback) {
        callback();
      }
    }, delay);
  }
};
/**
 * @description: 初始化提示信息
 * @return {undefined} undefined
 */
export const init_message = ( ) => {
  
  // console.log(`========================init_message=====`);
  // 如果当前是串关提示，先不清除提示
  if (
    ["0400477", "0400478"].includes(BetViewData.error_code) ||
    BetViewData.input_max_flag == 1
  )
    return;
  // console.log('=====================init_messsage=============');
  let count = get_deactive_count( );
  if (count > 0) return;
  BetViewData.error_code = "";
  BetViewData.error_message = "";
};
/**
 * @description: 检测提示信息
 * @param {string} type  单关还是串关
 * @param {number} money  金额
 * @return {undefined} undefined
 */
export const check_result_msg = (type, money) => {
  // console.log('=====================check_result_msg=============');
  let count = get_deactive_count();
  if (count > 0) return;
  //input_money_state取值说明 -2: 当前输入金额为空 -1: 当前输入金额小于最小值 1: 当前输入金额大于最大值 0: 在正常范围内
  type =
    type == "single"
      ? BetViewData.input_money_state
      : BetViewData.input_money_state;
  switch (type) {
    case -1:
      // 小于最小金额时的提示
      BetViewData.error_code = "M400010";
      break;
    case -2:
      // 当前输入为空的提示
      BetViewData.error_code = "M400005";
      break;
    case -3:
      // 最大最小值正在获取中
      BetViewData.error_code = "M400012";
      break;
    case 1:
      // 输入金额超出最大限额
      BetViewData.error_code = "M400011";
      break;
    case 2:
      //输入金额超出用户余额时
      BetViewData.error_code = "M400013";
      break;
    default:
      // 在正常范围内无提示
      BetViewData.error_code = "";
      break;
  }
  if (BetViewData.error_code == "M400010" && money) {
    let msg = i18n_t(
      `error_msg_info.${BetViewData.error_code}`
    ).client_msg1;
    BetViewData.error_message = msg.replace(
      "%s",
      Number(money).toFixed(2)
    );
  } else if (BetViewData.error_code) {
    // 校验串关金额
    BetViewData.error_message = i18n_t(
      `error_msg_info.${BetViewData.error_code}`
    ).client_msg1;
  } else {
    BetViewData.error_message = "";
  }
};

/**
 * @description:更新赛事列表以及赛事详情的赔率(前端模拟C105进行发送) 目的: 解决赔率不同步问题
 * @return {undefined} undefined
 */
export const update_odds_info = (bet_item_id) => {
  return;
  if (!bet_item_id) return;
  if (window.ws) {
    let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
    // console.log(`=========is_bet_single:${BetData.is_bet_single}=========bet_obj:${JSON.stringify(bet_obj)}`);
    if (_.has(bet_obj, "bs") && _.has(bet_obj, "cs")) {
      let cs = _.get(bet_obj, "cs", {});
      let bs = _.get(bet_obj, "bs", {});
      let hps;
      //游戏和今日里面玩法
      if (
        PLAY_TODAY_SCORE.includes(cs.play_id) &&
        _.has(cs, "score_type")
      ) {
        hps = `${_.get(cs, "score_type")}|${_.get(
          cs,
          "home_score",
          "0"
        )}:${_.get(cs, "away_score", "0")}`;
      }
      // 模拟发送C105用来同步项目各模块的投注项信息
      let cmd_obj = {
        cd: {
          mid: _.get(cs, "match_id"),
          send: "my_self", // 自定义属性send取值为my_self表示有用户模拟发送的指令
          hls: [
            {
              hid: _.get(cs, "handicap_id"), // 盘口id
              hpid: _.get(cs, "play_id"), // 玩法id
              hmt: _.get(cs, "market_type"), // 盘口类型
              hs: _.get(cs, "handicap_status"), // 盘口状态
              mid: _.get(cs, "match_id"), // 赛事id
              hn: _.get(bs, "hps[0].hl[0].hn"), // 坑位值
              hps: _.isEmpty(_.get(cs, "score_type")) ? "" : hps, // 盘口比分
              ol: [
                {
                  obv: _.get(cs, "break_odds_value"), // 断档赔率
                  oid: _.get(cs, "oid"), // 投注项oid
                  os: _.get(cs, "active"), // 投注项状态
                  ot: _.get(bs, "hps[0].hl[0].ol[0].ot"), // 投注项类型
                  ov: _.get(cs, "odds_value"), // 赔率
                },
              ],
            },
          ],
        },
        ctsp: `${new Date().getTime()}`,
        cmd: "C105",
      };
      if (window.ws) {
        console.log("模拟发送的C105", { ...cmd_obj });
        window.ws.customWsCmdData(cmd_obj);
      }
    }
  }
};



/**
 * @description: 将比分数组转换成对象中指定格式
 * @param {Array} msc 比分
 * @param {String} score_type 比分默认为S1
 * @return {Object} msc 合并后的新比分对象
 */
export const msc_array_obj = (msc, score_type = "S1") => {
  let score_obj = {};
  if (msc instanceof Array) {
    msc.forEach((msc_item) => {
      let check_msc_item =
        msc_item && msc_item.includes("|") && msc_item.includes(":");
      if (check_msc_item) {
        let msc_arr = msc_item.split("|");
        if (!_.isEmpty(msc_arr[0]) && !_.isEmpty(msc_arr[1])) {
          score_type = msc_arr[0];
          let team = msc_arr[1];
          let home = team.split(":")[0] || "0";
          let away = team.split(":")[1] || "0";
          let obj = {};
          obj[score_type] = {
            home,
            away,
            percentage: 0,
          };
          if (!(home == 0 && away == 0)) {
            //统计面板百分比计算
            if (["S17", "S18"].includes(score_type)) {
              obj[score_type].percentage = parseInt(
                (parseInt(obj[score_type].home) /
                  (
                    parseInt(obj[score_type].home) +
                    parseInt(obj[score_type].away)
                  ).toFixed(2)) *
                  100
              );
            } else {
              obj[score_type].percentage = parseInt(
                (parseInt(obj[score_type].away) /
                  (
                    parseInt(obj[score_type].home) +
                    parseInt(obj[score_type].away)
                  ).toFixed(2)) *
                  100
              );
            }
          }
          Object.assign(score_obj, obj);
        }
      }
    });
  }
  return score_obj;
};

/**
 * @description: 同步投注项部分数据
 * @param {Object} skt_data 推送的指令息体cd部分
 * @return {undefined} undefined
 */
export const sync_bet_obj = ( skt_data) => {
  let obj =  BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
    bet_obj,
    hls = [];
  for (let key of Object.keys(obj)) {
    if (key) {
      bet_obj = obj[key];
      if (bet_obj && bet_obj.bs) {
        let hl = _.get(bet_obj, "bs.hps[0].hl");
        if (hl && hl.length) {
          hls.push(...hl);
        }
      }
    }
  }
  if (hls && hls.length && hls.length > 0) {
    _.forEach(hls, (item) => {
      if (item && item.hid) {
        console.log(
          `============common========sync_bet_obj======hid:${item.hid}`
        );
        update_bet_item_status({
          mid: skt_data.mid,
          hid: skt_data.hid,
          status: skt_data.mhs,
        });
      }
    });
  }
};
/**
 * @description: 根据oid或者坑位id获取投注项id
 * @return {String} 投注项id
 */
export const get_id = ( ) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  return   _.get(bet_obj, "cs.oid", "");
 
};
/**
 * @description: 根据投注项id获取投注项的oid
 * @return {String} 投注项oid
 */
export const get_oid = (bet_custom_id) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  return   _.get(bet_obj, "cs.oid", "");
};
/**
 * @description: 根据投注项id获取投注项的坑位id(kid)
 * @return {String} 投注项坑位id(kid)
 */
export const get_kid = (bet_custom_id) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  return   _.get(bet_obj, "cs.kid", "");
};
/**
 * @description: 根据投注项id,获取投注项对象
 * @return {Object} 投注项
 */
export const get_bet_obj = (bet_custom_id) => {
  let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  return bet_obj;
};

/**
 * @description: 检查可否进行串关
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
export const check_mix = (  match_list) => {
  let match_team = [],
    mid_obj = {},
    bet_id_obj = {};
  

  if (match_list == 1) {
    return [];
  }
  let len = match_list.length;
  for (let i = 0; i < len; i++) {
    let obj = {},
    bet_custom_id = match_list[i],
      item;
    item =  BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
    obj.bet_custom_id = bet_custom_id;
    obj.mid = _.get(item, "bs.mid", "");
    // 放入该场赛事的两支球队id，如果提供了球员id则放入球员id
    obj.teams = [_.get(item, "bs.mhid", ""), _.get(item, "bs.maid", "")];
    match_team.push(obj);
  }
  // 两支球队进行比较
  let mlen = match_team.length - 1;
  for (let i = 0; i < mlen; i++) {
    let team1 = _.get(match_team, `[${i}].teams`);
    let mid1 = _.get(match_team, `[${i}].mid`);
    let id1 = _.get(match_team, `[${i}].id`);
    let obj = _.cloneDeep(BetData. get_bet_obj_by_bet_custom_id(id1));
    // 恢复是否可以串关的标志
    if (obj && obj.cs) {
      obj.cs.is_serial = true;
    }
    set_bet_obj_value( obj);
    for (let j = i + 1; j < match_team.length; j++) {
      let team2 = _.get(match_team, `[${j}].teams`);
      let mid2 = _.get(match_team, `[${j}].mid`);
      let id2 = _.get(match_team, `[${j}].id`);
      //两支球队进行比较,如果比较结果相同则result与team2相等，如果不同则result与team2不相等。
      let result = _.difference(team2, team1);
      if (!_.isEqual(result, team2)) {
        // 将两支球队同时存入mid_obj对象中
        mid_obj[mid1] = "";
        mid_obj[mid2] = "";
        bet_id_obj[id1] = "";
        bet_id_obj[id2] = "";
      }
    }
  }
  // 若mid_obj对象有key值,则表示不可以进行串关,设置对应的标志
  for (let bet_custom_id in bet_id_obj) {
    let obj = _.cloneDeep( BetData. get_bet_obj_by_bet_custom_id(bet_custom_id));
    // 设置为不可串关
    if (obj && obj.cs) {
      obj.cs.is_serial = false;
    }
    set_bet_obj_value(  obj);
  }
  return Object.keys(mid_obj);
};

/**
 * @description: 在语言切换时调用/v1/w/matchDetail/getOls接口后更新投注项信息(投注项部分国际化)
 * @param {Array} data 接口查询后对应的投注项数据
 */
export const update_bet_item_info = ( data) => {
  let bet_custom_ids =  []
  
 
  data.map(item=>{

    let bet_custom_id=2222
    let clone_bet_obj = _.cloneDeep( BetData. get_bet_obj_by_bet_custom_id(bet_custom_id));
    let cs = _.get(clone_bet_obj, "cs", false);
    if (cs && item.mid == cs.match_id) {
      let source = cs.source;
      let obj = tidy_bet_item_info(clone_bet_obj, item, source);
      let bs = _.get(clone_bet_obj, "bs");
      bs.mhn = obj.bs.mhn;
      bs.man = obj.bs.man;
      // 联赛名称
      bs.tn = obj.bs.tn;
      // 数据源
      bs.cds = obj.bs.cds;
      // 球种
      bs.csna = obj.bs.csna;
      bs.hps[0].hpn = obj.bs.hps[0].hpn;
      let ol_obj = bs.hps[0].hl[0].ol[0];
      let bs_ol_obj = obj.bs.hps[0].hl[0].ol[0];
      bs.hps[0].hl[0].ol[0].on = bs_ol_obj.on;
      if (["details", "match_details"].includes(source)) {
        bs.hps[0].title = obj.bs.hps[0].title;
        ol_obj.otv = bs_ol_obj.otv;
        ol_obj.ott = bs_ol_obj.ott;
      }
      Object.assign(clone_bet_obj.cs, { ...obj.cs });
      set_bet_obj_value( clone_bet_obj);
    }



  })
       



   
};

 