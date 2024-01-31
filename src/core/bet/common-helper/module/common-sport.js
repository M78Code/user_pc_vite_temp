// import UserCtr from  "src/core/user-config/user-ctr.js";
import BetData from "src/core/bet/class/bet-data-class.js";
// import { get_bet_amount_param } from "src/core/bet/model/bet-amount.js";
// import { http_upd_data } from "src/core/bet/model/upd_data.js";
// import mathjs from "src/core/utils/mathjs.js";
// import BetCommonHelper from "src/core/bet/common-helper/index.js"
// import { create_gcuuid } from "src/core/uuid/index.js";
// import { ref } from "vue";
// import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";

import {PLAY_TODAY_SCORE} from "src/output/module/constant-utils.js"; 
import lodash from "lodash";
/**
 * @description: 获取比赛分数 格式: (主队比分-客队比分)export const 
 * @return {String} 比分的格式
 */
export const get_score_info = (bet_custom_id) => {
    let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  if (lodash.has(bet_obj, "bs") && lodash.has(bet_obj, "cs")) {
    let bet_bs = lodash.get(bet_obj, "bs", {});
    let bet_cs = lodash.get(bet_obj, "cs", {});
    let ms = bet_bs.ms; // 赛事状态
    let sport_id = bet_bs.csid;
    let play_id = bet_cs.play_id;
    let market_type = bet_cs.market_type;
    //console.log(`==============home_score:>>>>${bet_cs.home_score}================away_score:>>>${bet_cs.away_score}`);
    // 如果为足球(sport_id=1)已开赛(ms=1)且菜单在滚球盘(play)或者今日(today)日里面,PLAY_TODY_SCORE里面包含的玩法id则需要显示比分 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
    // market_type: 0滚球
    // 0未开赛，1 进行中
    if (
      ms != 0 &&
      market_type == 0 &&
      sport_id == "1" &&
      PLAY_TODAY_SCORE.includes(`${play_id}`)
    ) {
      return `${lodash.get(bet_cs, "home_score", 0)}-${lodash.get(
        bet_cs,
        "away_score",
        0
      )}`;
    }
  }
  return "";
};

/**
 * @description: 获取及时比分 格式: (主队比分-客队比分)export const 
 * @return {String} 比分的格式
 */
export const get_timerly_score_info = (bet_custom_id) => {
    let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  if (lodash.has(bet_obj, "bs") && lodash.has(bet_obj, "cs")) {
    let bet_bs = lodash.get(bet_obj, "bs", {});
    let bet_cs = lodash.get(bet_obj, "cs", {});
    let ms = bet_bs.ms; // 赛事状态
    let timerly_home_score = lodash.get(bet_cs, "timerly_home_score");
    let timerly_away_score = lodash.get(bet_cs, "timerly_away_score");
    let market_type = bet_cs.market_type;
    if (
      ms != 0 &&
      market_type == 0 &&
      timerly_home_score &&
      timerly_away_score
    ) {
      return `${timerly_home_score}-${timerly_away_score}`;
    }
  }
  return "";
};

export const get_serial_type = ( ) => {
    let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  return lodash.get(bet_obj, "cs.serial_type", false);
};

/**
 * @description: 获取数据源export const 
 * @return {String} 数据源类型
 */
export const get_operate_type = (bet_custom_id) => {
    let bet_obj =   BetData. get_bet_obj_by_bet_custom_id(bet_custom_id)
  let operate_type = lodash.get(bet_obj, "cs.operate_type", "") || "";
  return operate_type;
};

/**
 * @description:更新赛事列表以及赛事详情的赔率(前端模拟C105进行发送) 目的: 解决赔率不同步问题export const 
 * @return {undefined} undefined
 */
export const update_odds_info2 = (obj) => {
  return;
  if (window.ws && !lodash.isUndefined(obj.mid) && !lodash.isNull(obj.mid)) {
    // console.log(`=========is_bet_single:${BetData.is_bet_single}=========bet_obj:${JSON.stringify(bet_obj)}`);
    // 模拟发送C105用来同步项目各模块的投注项信息
    let cmd_obj = {
      cd: {
        mid: obj.mid,
        send: "my_self",
      },
      cmd: "C105",
    };
    // 赛事盘口状态
    if (!lodash.isUndefined(obj.mhs) && !lodash.isNull(obj.mhs)) {
      cmd_obj.cd.mhs = obj.mhs;
    }
    if (lodash.isArray(obj.marketList)) {
      let hls = [];
      lodash.forEach(obj.marketList, (item) => {
        let { marketType, placeNum, status, marketOddsList, score } = item,
          hl_item = { mid: obj.mid };
        // 盘口id
        if (!lodash.isUndefined(item.id) && !lodash.isNull(item.id)) {
          hl_item.hid = item.id;
        }
        // 玩法id
        if (!lodash.isUndefined(obj.playId) && !lodash.isNull(obj.playId)) {
          hl_item.hpid = obj.playId;
        }
        // 盘口类型
        if (!lodash.isUndefined(marketType) && !lodash.isNull(marketType)) {
          hl_item.hmt = marketType;
        }
        // 盘口状态
        if (!lodash.isUndefined(status) && !lodash.isNull(status)) {
          hl_item.hs = status;
        }
        // 坑位
        if (!lodash.isUndefined(placeNum) && !lodash.isNull(placeNum)) {
          hl_item.hn = placeNum;
        }
        // 对应玩法比分处理
        if (
          score &&
          score.includes("|") &&
          score.includes(":") &&
          hl_item.hpid &&
          hl_item.hpid == obj.playId
        ) {
          // console.log(`===========111=====>>>>score:${score}`);
          let scoreBenchmark = score.split("|");
          let score_type = lodash.trim(scoreBenchmark[0]);
          if (!lodash.isEmpty(score_type)) {
            let scroe_array = scoreBenchmark[1].split(":");
            let home_score = scroe_array[0] || "0";
            let away_score = scroe_array[1] || "0";
            hl_item.hps = `${score_type}|${home_score}:${away_score}`;
          }
        }
        // 投注项部分处理
        if (lodash.isArray(marketOddsList)) {
          let ol = [];
          lodash.forEach(marketOddsList, (ite) => {
            let { oddsStatus, oddsType, oddsValue } = ite,
              ol_obj = {};
            // 投注项oid
            if (!lodash.isUndefined(ite.id) && !lodash.isNull(ite.id)) {
              ol_obj.oid = ite.id;
            }
            // 投注项状态
            if (!lodash.isUndefined(oddsStatus) && !lodash.isNull(oddsStatus)) {
              ol_obj.os = oddsStatus;
            }
            // 投注项类型
            if (!lodash.isUndefined(oddsType) && !lodash.isNull(oddsType)) {
              ol_obj.ot = oddsType;
            }
            // 投注项类型
            if (!lodash.isUndefined(oddsValue) && !lodash.isNull(oddsValue)) {
              ol_obj.ov = oddsValue;
            }
            ol.push(ol_obj);
          });
          if (!lodash.isEmpty(ol)) {
            hl_item.ol = ol;
          }
        }
        // 盘口项不为空，则加入盘口hls数组中
        if (!lodash.isEmpty(hl_item)) {
          hls.push(hl_item);
        }
      });
      if (!lodash.isEmpty(hls)) {
        cmd_obj.cd.hls = hls;
      }
      // console.log(`模拟发送的C105:${JSON.stringify(cmd_obj)}`);
      window.ws.customWsCmdData(cmd_obj);
    }
  }
};

/**
 * @description:更新变化的盘口
 * @param {*} obj
 * @return {undefined} undefined
 */
export const update_handicap = (obj) => {
  if (window.ws && !lodash.isUndefined(obj.mid) && !lodash.isNull(obj.mid)) {
    // 模拟发送C303用来同步项目各模块的投注项信息
    let cmd_obj = {
      cd: {
        mid: obj.mid,
        csid: obj.csid,
        hpid: obj.hpid,
        send: "my_self",
      },
      cmd: "C303",
    };
    console.log(`模拟发送的C303:${JSON.stringify(cmd_obj)}`);
    window.ws.customWsCmdData(cmd_obj);
  }
};

/**
 * @description: 模拟socket更新各模块的比分信息export const 
 * @return {undefined} undefined
 */
export const update_match_score = ( data_source, ctsp = 0, mid) => {
  if (window.ws) {
    let cur_match = lodash.get(data_source, `mid_obj.mid_${mid}`, {});
    // console.log(`==================msc_ctsp:${msc_ctsp}==============ctsp:${ctsp}`);
    // 当比分存在且是最新的数据则更新比分
    if (lodash.isArray(cur_match.msc) && !lodash.isEmpty(cur_match.msc)) {
      // 模拟发送C103 用来同步赛事列表,赛事详情等模块的比分
      let cmd_obj = {
        cd: {
          mid: mid,
          send: "my_self",
          csid: lodash.get(cur_match, "csid"),
          msc: cur_match.msc,
          mpid: lodash.get(cur_match, "mmp"),
        },
        cmd: "C103",
        ts: ctsp,
      };
      if (window.ws) {
        console.log("模拟发送的C103", { ...cmd_obj });
        window.ws.customWsCmdData(cmd_obj);
      }
    }
  }
};
/**
 * @description: 更新比赛时间(目的是解决掉赛事详情页面赛事列表的赛事时间不同步问题)
 * @param {String} mid 赛事id
 * @param {Integer} time 时间
 * @return {undefined} undefined
 */
export const update_match_time = (obj) => {
  if (!obj) return;
  // 发命令
  let cmd_obj = {
    cd: {
      send: "my_self",
    },
    cmd: "C102",
  };
  if (obj.ctsp) {
    cmd_obj.ctsp = obj.ctsp;
    // 删除时间戳
    delete obj.ctsp;
  }
  for (let [key, value] of Object.entries(obj)) {
    cmd_obj.cd[key] = value;
  }
  if (window.ws) {
    // console.log('模拟发送的C102',{ ...cmd_obj });
    window.ws.customWsCmdData(cmd_obj);
  }
};

/**
 * @description: 比分合并
 * @param {Array} msc  原来的msc字段比分
 * @param {Object} skt_data 推送对象
 * @return {Array} msc 合并后的新比分数组
 */
export const merge_msc_array = (msc, skt_data) => {
  // 使用对象临时存放比分
  let score_obj = {};
  for (let i = 0; i < msc.length; i++) {
    let msc_item = msc[i];
    let check_msc_item =
      msc_item && msc_item.includes("|") && msc_item.includes(":");
    if (check_msc_item) {
      let mcs_item_arr = msc[i].split("|");
      // 将比分转换成 score_obj={"S1": "0:0"} 的格式(可以进行去重)
      score_obj[mcs_item_arr[0]] = mcs_item_arr[1];
      if (lodash.isArray(skt_data.msc)) {
        skt_data.msc.forEach((skt_item) => {
          if (skt_item && skt_item.includes("|")) {
            let skt_item_arr = skt_item.split("|");
            if (mcs_item_arr[0] == skt_item_arr[0]) {
              score_obj[mcs_item_arr[0]] = skt_item_arr[1];
            } else {
              score_obj[skt_item_arr[0]] = skt_item_arr[1];
            }
          }
        });
      }
    }
  }
  msc = [];
  // 将比分对象重新组合成列表接口中msc中的格式
  for (let [key, value] of Object.entries(score_obj)) {
    let item = `${key}|${value}`;
    msc.push(item);
  }
  if (msc.length == 0) {
    msc = skt_data.msc || [];
  }
  return msc;
};

/**
 * @description: 将比分转换成数组中指定格式
 * @param {Array} msc 比分
 * @return {Array} msc 合并后的新比分对象
 */
export const msc_obj_arry = (msc) => {
  if (lodash.isArray(msc)) return msc;
  let arr = [],
    is_s1 = false;
  if (msc) {
    for (let [key, value] of Object.entries(msc)) {
      let obj = `${key}|${value.home}:${value.away}`;
      if (key == "S1") {
        is_s1 = true;
      }
      arr.push(obj);
    }
    // 如果不包含S1比分,则默认给0:0
    if (!is_s1) {
      arr.unshift("S1|0:0");
    }
  }
  return arr;
};

/**
 * @description: 比分格式处理(投注时用到)
 * @param {Array} msc 比分
 * @param {Integer} csid 球种id
 * @param {Integer} ms 赛事状态
 * @param {Integer} hpid 玩法id
 * @return {String} 比分格式为: (主队比分-客队比分)
 */
export const calc_bifen = (msc = [], csid, ms, hpid) => {
  //只有足球滚球展示基准分
  if (!msc[0] || csid != 1 || !ms || ms == 0) return "";
  let S;
  if (hpid == 128) {
    S = msc.toString().match(/S7\|[0-9]+\:[0-9]+/);
  }
  if (hpid == 130) {
    S = msc.toString().match(/S701\|[0-9]+\:[0-9]+/);
  }
  if (hpid == 143) {
    S = msc.toString().match(/S3\|[0-9]+\:[0-9]+/);
  }
  if (["4", "27", "29", "269", "336"].includes(`${hpid}`)) {
    S = msc.toString().match(/S1\|[0-9]+\:[0-9]+/);
  }
  if (hpid == 19) {
    S = msc.toString().match(/S2\|[0-9]+\:[0-9]+/);
  }
  if (hpid == 113) {
    S = msc.toString().match(/S5\|[0-9]+\:[0-9]+/);
  }
  if (hpid == 121) {
    S = msc.toString().match(/S15\|[0-9]+\:[0-9]+/);
  }
  if (S) {
    let str = S[0].split("|")[1];
    return `(${str.replace(":","-")})`
  }
  return "";
};

/**
 * @description: 倒计时补充
 试图
 * @param {Array} skt_data socket推送的消息体
 * @param {String} socket_name 接入的是那个地方的socket
 */
export const match_fill_time = (data_source, skt_data, socket_name) => {
  if (lodash.isArray(skt_data)) {
    let len = skt_data.length;
    for (let i = 0; i < len; i++) {
      let item = lodash.get(skt_data, `[${i}]`, {});
      let cur_match;
      if (
        socket_name == "match_list" &&
        lodash.get(data_source, `mid_obj.mid_${item.mid}`, false)
      ) {
        // 赛事列表
        cur_match = lodash.get(data_source, `mid_obj.mid_${item.mid}`, {});
        if (item.msc) {
          let msc = lodash.cloneDeep(lodash.get(cur_match, "msc", []));
          cur_match.msc = merge_msc_array(msc, skt_data);
          score_switch_handle(cur_match);
        }
      } else if (
        ["details", "match_details"].includes(socket_name) &&
        lodash.get(data_source, "match_obj.mid") == lodash.get(item, "mid")
      ) {
        // 赛事详情
        cur_match = lodash.get(data_source, `mid_obj.${item.mid}`, {});
        if (!lodash.isEmpty(item.msc)) {
          let score_obj = lodash.cloneDeep(lodash.get(cur_match, "msc", {}));
          score_obj =BetCommonHelper. msc_array_obj(item.msc);
          item.msc = score_obj;
        }
      } else if (
        ["hot", "recent"].includes(socket_name) &&
        lodash.get(data_source, `mid_obj.${item.mid}`, false)
      ) {
        // 热门推荐，最近关注(专业版)
        cur_match = lodash.get(data_source, `mid_obj.${item.mid}`, {});
        let score_obj = lodash.cloneDeep(
          lodash.get(data_source, `mid_obj.${item.mid}.msc`, {})
        );
        item.msc.forEach((msc_item) => {
          let check_msc_item =
            msc_item && msc_item.includes("|") && msc_item.includes(":");
          if (check_msc_item) {
            let msc_arr = msc_item.split("|");
            let name = msc_arr[0];
            let team = msc_arr[1];
            let home = team.split(":")[0] || "0";
            let away = team.split(":")[1] || "0";
            let obj = {};
            obj[name] = {
              home,
              away,
            };
            Object.assign(score_obj, obj);
          }
        });
        item.msc = score_obj;
      }
      Object.assign(cur_match, item);
      // 同步投注项数据
      update_odds_info();
    }
  }
};

/**
 * @description: 整理投注项信息
 * @param {Object} cur_obj 当前vuex中的对象
 * @param {Object} bet_obj 接口查询后对应的投注项数据
 * @param {String} source  vuex中投注项的来源
 * @return {Object} 返回需要更新的投注项对象数据
 */
export const tidy_bet_item_info = (cur_obj, bet_obj, source) => {
  // fields 赛事层级需要组装的字段 hps_fields 玩法级需要组装的字段 hl_fields 盘口级需要组装的字段 ol_fields 投注项上的字段
  let obj = { bs: {}, cs: {} },
    item_obj,
    hps,
    hl,
    ol,
    bet_omit_obj = {},
    // fields 赛事层级需要组装的字段
    fields = [
      "csid",
      "mid",
      "tid",
      "msc",
      "tn",
      "onTn",
      "mmp",
      "tlev",
      "ms",
      "mhid",
      "mhn",
      "maid",
      "man",
      "mgt",
      "mcg",
      "mhs",
      "mf",
      "med",
      "seoy",
      "orpt",
      "_index",
    ],
    //  hps_fields 玩法级需要组装的字段
    hps_fields = ["hpid", "hpn", "hsw", "title", "hl", "hps"],
    // hl_fields 盘口级需要组装的字段
    hl_fields = ["hid", "hmt", "hs", "ad2", "hv", "hn", "ol"],
    // ol_fields 投注项上的字段
    ol_fields = ["oid", "on", "ov", "obv", "otd", "otv", "ott"];
  item_obj = lodash.clone(bet_obj);
  // 构建bet_omit_obj对象
  for (let [key, value] of Object.entries(item_obj)) {
    if (fields.includes(key)) {
      bet_omit_obj[key] = value;
    }
  }
  // 玩法对象
  hps = lodash.cloneDeep([item_obj.play]);
  // 盘口对象
  hl = lodash.cloneDeep(hps[0].hl);
  // 投注项对象
  ol = lodash.cloneDeep(hps[0].hl[0].ol);
  bet_omit_obj.hps = lodash.cloneDeep([item_obj.play]);
  for (let [key, value] of Object.entries(item_obj)) {
    if (fields.includes(key)) {
      bet_omit_obj[key] = value;
    }
  }
  // 删除多余的玩法字段
  for (let key of Object.keys(hps[0])) {
    if (!hps_fields.includes(key)) {
      delete bet_omit_obj.hps[0][key];
    }
  }
  // 删除多余的盘口字段
  for (let key of Object.keys(hl[0])) {
    if (!hl_fields.includes(key)) {
      delete bet_omit_obj.hps[0].hl[0][key];
    }
  }
  // 删除多余的投注项字段
  for (let key of Object.keys(ol[0])) {
    if (!ol_fields.includes(key)) {
      delete bet_omit_obj.hps[0].hl[0].ol[0][key];
    }
  }
  // 非详情部分的数组
  if (!["details", "match_details"].includes(source)) {
    // 删除玩法层级title
    delete bet_omit_obj.hps[0].title;
    // vuex对象的主队名称
    let cur_home = lodash.trim(lodash.get(cur_obj, "bs.mhn"));
    // vuex对象的客队名称
    let cur_away = lodash.trim(lodash.get(cur_obj, "bs.man"));
    // vuex对象的投注项显示值
    let cur_on = lodash.trim(lodash.get(cur_obj, "bs.hps[0].hl[0].ol[0].on", ""));
    // vuex对象的盘口值
    let hv = lodash.get(cur_obj, "bs.hps[0].hl[0].hv");
    // 盘口值并字段不包含‘/’
    if ((hv || hv == "0") && !hv.includes("/")) {
      // 取绝对值
      hv = Math.abs(hv);
      // 盘口值+开头，-结尾，去除+-
    } else if (hv && (hv.startsWith("+") || hv.startsWith("-"))) {
      hv = hv.replace("+", "");
      hv = hv.replace("-", "");
    }
    // 投注项显示值跟主队名称一样
    if (cur_on == cur_home) {
      // on值为主队
      bet_omit_obj.hps[0].hl[0].ol[0].on = lodash.get(item_obj, "mhn");
      bet_omit_obj.hps[0].hl[0].ol[0].ots = "T1";
      // 投注项等于客队
    } else if (cur_on == cur_away) {
      // on值为客队
      bet_omit_obj.hps[0].hl[0].ol[0].on = lodash.get(item_obj, "man");
      bet_omit_obj.hps[0].hl[0].ol[0].ots = "T2";
      // 投注项等于盘口值
    } else if (cur_on == hv || cur_on == `+${hv}` || cur_on == `-${hv}`) {
      //on值包含了盘口
      // 投注数据的投注项显示值更新为投注主队数据
      bet_omit_obj.hps[0].hl[0].ol[0].on = cur_on;
      // 有盘口值，而且投注项显示值以主队开头，以盘口值结尾
    } else if (hv && cur_on.startsWith(cur_home) && cur_on.endsWith(hv)) {
      //on值包含了主对名称和盘口
      let arr = cur_on.split(" "),
        len = arr.length;
      // 投注数据的投注项显示值以客队和盘口值拼接
      bet_omit_obj.hps[0].hl[0].ol[0].on = `${lodash.get(item_obj, "mhn")} ${
        arr[len - 1]
      }`;
      // 有盘口值，而且投注项显示值以客队开头，以盘口值结尾
    } else if (hv && cur_on.startsWith(cur_away) && cur_on.endsWith(hv)) {
      //on值包含了客对名称和盘口
      let arr = cur_on.split(" "),
        len = arr.length;
      // 投注数据的投注项显示值以主队和盘口值拼接
      bet_omit_obj.hps[0].hl[0].ol[0].on = `${lodash.get(item_obj, "man")} ${
        arr[len - 1]
      }`;
    } else {
      let otv = lodash.get(ol, "0.otv", ""),
        ott = lodash.get(ol, "0.ott", "");
      if (otv != ott) {
        // 投注时所需展示的信息
        if (otv.includes(ott)) {
          bet_omit_obj.hps[0].hl[0].ol[0].on = otv;
        } else {
          bet_omit_obj.hps[0].hl[0].ol[0].on = ott;
        }
      }
    }
  } else {
    bet_omit_obj.hps[0].hl[0].ol[0].otv = lodash.get(ol, "0.otv", "");
    bet_omit_obj.hps[0].hl[0].ol[0].ott = lodash.get(ol, "0.ott", "");
    bet_omit_obj.hps[0].hl[0].ol[0].on = lodash.get(ol, "0.on", "");
  }
  Object.assign(obj.bs, { ...bet_omit_obj });
  obj.cs = {
    play_name: lodash.get(bet_omit_obj, "hps[0].hpn"), //玩法名称
    home: lodash.get(bet_omit_obj, "mhn"), //主队
    away: lodash.get(bet_omit_obj, "man"), //客队
  };
  return obj;
};

/**
 * @description:
 * @param {*} el dom元素  attr 要获取值的属性
 * @return {*}
 */
export const get_refs_info = (el, attr, _this = null) => {
  let __this = _this || this;
  let _ref = __this.$refs || null;
  if (!el || !_ref) {
    return;
  }
  if (attr) {
    return _ref[el][attr] || null;
  } else {
    return _ref[el] || null;
  }
};

/**
 *
 * @param {*} el
 * @returns
 */
export const query_selector = (el) => {
  return document.querySelector(el);
};

 