import MenuData from "src/core/menu-pc/menu-data-class.js";
import PageSourceData from "src/core/page-source-h5/page-source-h5.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import BetData from "../class/bet-data-class.js";
import { compute_value_by_cur_odd_type } from "./bet_odds_change.js";
import { get_bet_amount_param } from "./bet-amount.js";
// import { http_upd_data } from "./upd_data.js";
import { set_submit_status } from "./status.js";
import mathjs from "src/core/utils/mathjs.js";
import BetCommonHelper from "src/core/bet/common-helper/index.js"
import { uid } from "quasar";
import { ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import lodash from "lodash";
import {NO_MERAGE_MARKETVALUE} from "src/core/bet/config/play-mapping.js";

 
// import  MatchListData from "src/core/match-list-pc/match-data/match-list-data-class.js"
import  MatchInfoCtr from "src/core/match-detail-h5/match-info-ctr.js"

/**
 * @description: 调用queryLatestMarketInfo完接口后的回调方法用来更新vuex中投注项的数据
 * @param {*} obj 设置的新对象
 */
const http_upd_data = (obj) => {
  // console.log('进入queryLatestMarketInfo回调方法',{method: 'http_upd_data'});
  let i = obj.i;

  let http_data_list = obj.http_data_list; //接口返回的http_data_list
  let id,
    hpid,
    old_hv,
    old_on,
    new_on = "",
    handicap_value,
    old_odds_value,
    bs,
    hid,
    msc,
    bet_obj,
    score_type;
  let bet_item,
    self = obj.self,
    handicap_change = {};

  if (BetData.is_bet_single) {
    bet_obj = "bet_single_obj";
    id = BetData.bet_single_list[i];
  } else {
    bet_obj = "bet_obj";
    id = BetData.bet_list[i];
  }
  if (!id) return;
  if (!BetData[bet_obj][id]) {
    return;
  }
  bet_item = BetData.bet_obj[id];
  bs = BetData[bet_obj][id].bs;

  hid = _.get(bs, "hps[0].hl[0].hid") || _.get(bs, "hps[0].hl[0].ol.hid");
  hpid = _.get(bs, "hps[0].hpid") || _.get(bs, "hps[0].hl[0].ol.hpid");
  old_hv = bs.hps[0].hl[0].hv || _.get(bs, "hps[0].hl[0].ol.hv");
  old_on = bs.hps[0].hl[0].ol[0]
    ? bs.hps[0].hl[0].ol[0].on
    : bs.hps[0].hl[0].ol.on;
  old_odds_value = bs.hps[0].hl[0].ol[0]
    ? bs.hps[0].hl[0].ol[0].ov
    : bs.hps[0].hl[0].ol.ov;
  // console.log('提起获取上次旧数据:', {hid, old_hv, old_on, old_odds_value })
  // 如果盘口有正负号,则移除正负号
  if (old_hv) {
    old_hv = _.trim(old_hv);
    if (old_hv.startsWith("+") || old_hv.startsWith("-")) {
      old_hv = old_hv.substr(1, old_hv.length);
    } else if (old_hv.endsWith("+") || old_hv.endsWith("-")) {
      old_hv = old_hv.substr(0, old_hv.length - 1);
    }
  }

  // 取掉盘口值 如: 大
  if (old_on && old_on.includes(old_hv)) {
    // 用&nbsp;先取代盘口的位置
    new_on = old_on.replace(old_hv, "&nbsp;");
    // console.log(`========用&nbsp;先取代盘口的位置===============>${new_on}`);
  }

  //整合数据
  http_data_list.forEach((market_info) => {
    let {
      away, // 客队id
      home, // 主队id
      matchInfoId, // 赛事id
      matchPeriodId, // 赛事阶段
      matchStatus, // 赛事状态
      matchHandicapStatus, //赛事盘口状态
      playId, // 玩法id
      playName, // 玩法名称
      tournamentName, // 联赛名称
      currentMarket, // 当前选中的盘口数据
      marketList, // 当前玩法下的盘口数据
      matchOver, //赛事结束
      cds, //数据源
      pendingOrderStatus,
    } = market_info;

    if (bs.mid == matchInfoId) {
      let sportId = _.get(`${bet_obj}.${id}.bs.csid`);
      if (!_.isUndefined(matchOver) && !_.isNull(matchOver)) {
        BetData[bet_obj][id].cs.match_over = matchOver;
      }
      if (!_.isUndefined(matchStatus) && !_.isNull(matchStatus)) {
        BetData[bet_obj][id].bs.ms = matchStatus; // 赛事状态
      }
      if (
        !_.isUndefined(matchHandicapStatus) &&
        !_.isNull(matchHandicapStatus)
      ) {
        BetData[bet_obj][id].bs.mhs = matchHandicapStatus; // 赛事状态
        BetData[bet_obj][id].cs.match_status = matchHandicapStatus;
      }
      if (!_.isUndefined(matchPeriodId) && !_.isNull(matchPeriodId)) {
        // 根据不同的赛事阶段更新score_type的值
        let match = BetData[bet_obj][id].bs;
        score_type = self.set_basic_key(match);
        // 赛事阶段不同对score_type进行更新
        if (score_type && BetData[bet_obj][id].bs.mmp != matchPeriodId) {
          BetData[bet_obj][id].cs.score_type = score_type;
        }
        // 赛事阶段
        BetData[bet_obj][id].bs.mmp = matchPeriodId;
      }
      // 主队
      if (!_.isEmpty(home)) {
        BetData[bet_obj][id].bs.mhn = home;
        BetData[bet_obj][id].cs.home = home;
      }
      // 客队
      if (!_.isEmpty(away)) {
        BetData[bet_obj][id].bs.man = away;
        BetData[bet_obj][id].cs.away = away;
      }
      // 数据源
      if (!_.isEmpty(cds)) {
        BetData[bet_obj][id].bs.cds = cds;
        BetData[bet_obj][id].cs.cds = cds;
      }
      // 玩法名称
      if (
        _.get(`${bet_obj}.${id}.cs.${playId}`, false) &&
        !_.isUndefined(playName) &&
        !_.isNull(playName)
      ) {
        BetData[bet_obj][id].bs.hps[0].hpn = playName;
        BetData[bet_obj][id].cs.play_name = playName;
      }

      // 联赛名称
      if (!_.isUndefined(tournamentName) && !_.isNull(tournamentName)) {
        BetData[bet_obj][id].bs.tn = tournamentName;
      }
      if (!_.isUndefined(currentMarket) && !_.isNull(currentMarket)) {
        let {
          marketType,
          placeNum,
          status,
          marketValue,
          marketOddsList,
          score,
        } = currentMarket;
        if (
          (placeNum &&
            matchInfoId == bs.mid &&
            placeNum == _.get(bs, "hps[0].hl[0].hn", -1) &&
            playId == hpid) ||
          (currentMarket.id == hid && playId == hpid)
        ) {
          // 赛事比分
          let item_score,
            home_score = _.get(bet_item, "cs.home_score") || "0",
            away_score = _.get(bet_item, "cs.away_score") || "0",
            msc;
          if (score && score.includes("|") && score.includes(":")) {
            let scoreBenchmark = score.split("|");
            score_type = scoreBenchmark[0];
            // console.log(`==============cs.score_type:${BetData[bet_obj][id].cs.score_type}=============score_type:${score_type}`);
            if (score_type == BetData[bet_obj][id].cs.score_type) {
              let scroe_array = scoreBenchmark[1].split(":");
              home_score = scroe_array[0] || "0";
              away_score = scroe_array[1] || "0";
              item_score = `${score_type}|${home_score}:${away_score}`;
            }
          }
          msc = BetData[bet_obj][id].bs.msc || [];
          if (
            !["match_details", "details"].includes(
              BetData[bet_obj][id].cs.source
            )
          ) {
            let score_obj = {};
            let len = msc.length;
            for (let i = 0; i < len; i++) {
              if (msc[i] && msc[i].includes("|")) {
                let mcs_item_arr = msc[i].split("|");
                if (mcs_item_arr[0] == score_type) {
                  score_obj[mcs_item_arr[0]] = `${home_score}:${away_score}`;
                } else {
                  score_obj[mcs_item_arr[0]] = mcs_item_arr[1];
                }
              }
            }
            msc = [];
            for (let [key, value] of Object.entries(score_obj)) {
              let item = `${key}|${value}`;
              msc.push(item);
            }

            if (msc.length == 0 && item_score) {
              msc = [item_score];
            }

            if (msc.length > 0) {
              BetData[bet_obj][id].bs.msc = msc;
            }
          } else if (_.isArray(msc) && !_.isEmpty(score)) {
            // 详情意外的其他模块比分处理
            let index = _.findIndex(msc, (item) => item.includes(score_type));
            if (index == -1) {
              msc.push(score);
            } else {
              msc[index] = score;
            }
          }

          // console.log(`==============cs.score_type:${BetData[bet_obj][id].cs.score_type}=============score_type:${score_type}`);
          if (
            !_.isEmpty(score) &&
            score_type == BetData[bet_obj][id].cs.score_type
          ) {
            // 合并主队得分
            BetData[bet_obj][id].cs.home_score = home_score;
            // 合并客队得分
            BetData[bet_obj][id].cs.away_score = away_score;
          }
          // 坑位存在与盘口id不相等，则需要更新盘口id
          if (placeNum && currentMarket.id != hid) {
            // 盘口是否发生变化(坑位变化)
            handicap_change = {
              mid: matchInfoId,
              hpid: playId,
              csid: sportId,
            };
            BetData[bet_obj][id].bs.hps[0].hl[0].hid = currentMarket.id;
            BetData[bet_obj][id].cs.handicap_id = currentMarket.id;
          }
          // 盘口类型
          if (!_.isUndefined(marketType) && !_.isNull(marketType)) {
            BetData[bet_obj][id].bs.hps[0].hl[0].hmt = marketType;
            BetData[bet_obj][id].cs.market_type = marketType;
          }
          if (
            !_.isEmpty(marketValue) &&
            BetData[bet_obj][id].bs.hps[0].hl[0].hv != marketValue
          ) {
            handicap_change = {
              mid: matchInfoId,
              hpid: playId,
              csid: sportId,
            };
          }
          let no_merage_market_value =
            NO_MERAGE_MARKETVALUE[sportId];
          // 盘口值
          if (
            _.isArray(no_merage_market_value) &&
            !no_merage_market_value.includes(`${playId}`) &&
            !_.isUndefined(marketValue) &&
            !_.isNull(marketValue)
          ) {
            handicap_value = _.trim(marketValue) || "";
          }
          // 盘口状态合并
          if (!_.isUndefined(status) && !_.isNull(status)) {
            BetData[bet_obj][id].cs.handicap_status = status;
            BetData[bet_obj][id].bs.hps[0].hl[0].hs = status;
          }
        }
        if (_.isArray(marketOddsList)) {
          let hn;
          // 如果赛事存在玩法id,以及坑位
          if (playId && placeNum) {
            hn = `${matchInfoId}_${playId}_${placeNum}`;
          }
          // 移除盘口正负号
          if (handicap_value) {
            handicap_value = _.trim(handicap_value);
            if (
              handicap_value.startsWith("+") ||
              handicap_value.startsWith("-")
            ) {
              handicap_value = handicap_value.substr(1, handicap_value.length);
            } else if (
              handicap_value.endsWith("+") ||
              handicap_value.endsWith("-")
            ) {
              handicap_value = handicap_value.substr(
                0,
                handicap_value.length - 1
              );
            }
          }
          //  投注项数据合并
          marketOddsList.forEach((odds_item) => {
            // 投注项类型存在,则坑位加上投注项类型才是完整的坑位id
            if (hn && odds_item.oddsType) {
              hn = `${hn}_${odds_item.oddsType}`;
            } else {
              hn = null;
            }

            let new_obj = BetData[bet_obj][id];
            let kid = new_obj.cs.kid;
            let clone_obj = {};
            if (!(new_obj.bs.hps[0].hl[0].ol instanceof Array)) {
              clone_obj = _.cloneDeep(new_obj.bs.hps[0].hl[0].ol);
            }
            if (!new_obj.bs.hps[0].hl[0].ol[0]) {
              new_obj.bs.hps[0].hl[0].ol[0] = clone_obj;
            }
            if (hn && hn == kid) {
              // 如果坑位存在,则需要合并oid
              // 投注项oid
              new_obj.cs.oid = odds_item.id;
              new_obj.bs.hps[0].hl[0].ol[0].oid = odds_item.id;

              // 赔率
              new_obj.cs.odds_value = odds_item.oddsValue;
              new_obj.bs.hps[0].hl[0].ol[0].ov = odds_item.oddsValue;

              // 投注状态
              new_obj.cs.active = odds_item.oddsStatus;
              new_obj.bs.hps[0].hl[0].ol[0].os = odds_item.oddsStatus;
              if (handicap_value && old_hv != handicap_value) {
                // console.log(`=============将&nbsp;的位置替换为盘口值===========>${new_on.replace('&nbsp;', handicap_value)}`);
                // console.log('将&nbsp;的位置替换为盘口值:', {new_on: new_on.replace('&nbsp;', handicap_value)})
                new_obj.bs.hps[0].hl[0].hv = handicap_value;
                new_obj.cs.handicap_value = handicap_value;
                // 将&nbsp;的位置替换为盘口值
                new_obj.bs.hps[0].hl[0].ol[0].on = new_on.replace(
                  "&nbsp;",
                  handicap_value
                );
                // console.log(`================11111==========>>>>>on:${new_obj.bs.hps[0].hl[0].ol[0].on}`);
              }
              // ot(投注类型)字段合并
              if (
                !_.isUndefined(odds_item.oddsType) &&
                !_.isNull(odds_item.oddsType)
              ) {
                new_obj.bs.hps[0].hl[0].ol[0].ot = odds_item.oddsType;
              }
              // 前后盘口值有变化则进行标记
              if (
                handicap_value &&
                old_hv != handicap_value &&
                old_odds_value != odds_item.oddsValue
              ) {
                new_obj.cs.hv_ov_change = true;
              }
              //如果是预约投注添加预约投注数据
              if (
                !_.isUndefined(pendingOrderStatus) &&
                !_.isNull(pendingOrderStatus)
              ) {
                BetData[bet_obj][id].cs.pending_order_status =
                  pendingOrderStatus;
                // console.log(`------------http_upd_data------->>>>pending_order_status:${pendingOrderStatus}`);
              }
            } else if (new_obj.cs.oid == odds_item.id) {
              // 坑位不存在,通过oid进行匹配合并赔率以及状态
              // 赔率
              new_obj.cs.odds_value = odds_item.oddsValue;
              new_obj.bs.hps[0].hl[0].ol[0].ov = odds_item.oddsValue;

              // 投注状态
              new_obj.cs.active = odds_item.oddsStatus;
              new_obj.bs.hps[0].hl[0].ol[0].os = odds_item.oddsStatus;
              if (odds_item.playOptions) {
                new_obj.bs.hps[0].hl[0].ol[0].on = odds_item.playOptions;
                handicap_value = odds_item.playOptions;
                new_obj.bs.hps[0].hl[0].hv = handicap_value;
                new_obj.cs.handicap_value = handicap_value;
              } else if (handicap_value && old_hv != handicap_value) {
                // 重新拼接新的on 之前为`大 盘口值` // 将&nbsp;的位置替换为盘口值
                // console.log(`=======重新拼接新的on============>${new_on.replace('&nbsp;', handicap_value)}`);
                // console.log('重新拼接新的on:', {new_on: new_on.replace('&nbsp;', handicap_value)})
                new_obj.bs.hps[0].hl[0].ol[0].on = new_on.replace(
                  "&nbsp;",
                  handicap_value
                );
                // console.log(`================222222==========>>>>>on:${new_obj.bs.hps[0].hl[0].ol[0].on}`);
              }
              // ot(投注类型)字段合并
              if (
                !_.isUndefined(odds_item.oddsType) &&
                !_.isNull(odds_item.oddsType)
              ) {
                new_obj.bs.hps[0].hl[0].ol[0].ot = odds_item.oddsType;
              }
              // 如果盘口和赔率都不相同则把标志为设置为true
              if (
                handicap_value &&
                old_hv != handicap_value &&
                old_odds_value != odds_item.oddsValue
              ) {
                // console.log('重置盘口赔率一起变化的hv_ov_change参数',{handicap_value, old_hv,old_odds_value,odds_value:odds_item.oddsValue})
                new_obj.cs.hv_ov_change = true;
              }
              //如果是预约投注添加预约投注数据
              if (
                !_.isUndefined(pendingOrderStatus) &&
                !_.isNull(pendingOrderStatus)
              ) {
                BetData[bet_obj][id].cs.pending_order_status =
                  pendingOrderStatus;
                // console.log(`------------http_upd_data------->>>>pending_order_status:${pendingOrderStatus}`);
              }
            }
          });
        }
      }
      // 如果有坑位变化则发送C303，否则就发送C105
      if (!_.isEmpty(handicap_change)) {
        self.yabo_common.update_handicap(handicap_change);
      } else {
        // 同步盘口下所有投注项的数据
        self.yabo_common.update_odds_info2({
          mid: matchInfoId,
          sportId,
          mhs: matchHandicapStatus,
          playId,
          marketList,
        });
      }
    }
  });
};

/**
 * @description: 添加串关投注项对象
 * @param {*}BetData.
 * @param {*} obj 要添加的投注项对象
 */
const bet_obj_add_attr = (obj) => {
  let new_obj = _.cloneDeep(BetData.bet_obj);
  if (obj.key && new_obj[obj.key] && new_obj[obj.key].cs) {
    new_obj[obj.key].cs.is_serial = obj.cs.is_serial;
  }
  // if(obj.key && !(Object.keys(new_obj).indexOf(obj.key) > -1)){
  // new_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
  // }
  if (obj.key) {
    new_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
  }
  BetData.bet_obj = new_obj;
};




/**
 * @description: 更新投注项对象
 * @param {Object} bet_obj 更新的目标对象
 * @param {String} item 投注项id
 * @return {undefined} undefined
 */
const upd_bet_obj_item = ( {source_data, bet_obj,item, handle_time}) => {
 
  let mid_obj, msc_obj, id = item, kid, oid,  bs = _.cloneDeep(_.get(bet_obj,`${id}.bs`)), cs = _.cloneDeep(_.get(bet_obj,`${id}.cs`)), obj = {"key":item, "bs":{}, "cs":{} },hl_obj, ol_obj, sport_id, play_id, hn, ot, score_type=_.get(bet_obj,`${id}.cs.score_type`) || 'S1', serial_type, home_score=_.get(cs,'home_score'), away_score=_.get(cs,'away_score');
  if (!bs || !cs ) {
    return;
  }
  try {
    play_id = _.get(bs,'hps[0].hpid');
    sport_id = _.get(bs,'csid');
    hn = _.get(bs, 'hps[0].hl[0].hn', '');
    ot = _.get(bs, 'hps[0].hl[0].ol[0].ot', '');

 
      // item如果是oid则必然坑位hn_obj通过id拿不到对象,所以可以再去ol_obj中去拿
      if(cs.kid==id) {
        kid = id;
        ol_obj =  _.cloneDeep(_.get(source_data,`hn_obj.${id}`));
        if(_.isObject(ol_obj)) {
          oid = _.get(ol_obj,'oid','');
        }
      } else {
        oid = id;
        ol_obj = _.cloneDeep(_.get(source_data,`ol_obj.oid_${oid}`));
        if(_.isObject(ol_obj)) {
          kid = _.get(ol_obj,'_hn','');
        }
      }
      if(_.isEmpty(ol_obj)) return;
      hl_obj = _.cloneDeep(_.get(source_data, `hl_obj.hid_${_.get(ol_obj,'_hid')}`,{}));
      mid_obj = _.get(source_data,`mid_obj.mid_${_.get(ol_obj,'_mid')}`,{});
      msc_obj = _.get(mid_obj,'msc') || [];
 
    let cs_handle_time = cs.handle_time || 0;
    let hpid = _.get(hl_obj, 'hpid') || _.get(hl_obj, '_hpid');
    if(_.isEmpty(hl_obj) ||
      (hn && (_.isObject(hl_obj) && hpid != play_id) ||
      (ol_obj && ol_obj.ot != ot)) ||
      (handle_time && cs_handle_time > handle_time)
      ) return;
    let item_obj = _.cloneDeep({...bs}), target_side = _.get(item_obj, 'hps[0].hl[0].ol[0].ots', ''), handicap_value, handicap_value_old = cs.handicap_value, odds_value, odds_value_old = cs.odds_value, active, hv_ov_change_old = _.get(cs, "hv_ov_change", false), hv_ov_change = false;

    item_obj.hps[0].hl = _.cloneDeep([hl_obj]);
    item_obj.hps[0].hl[0].ol = _.cloneDeep([ol_obj]);
    handicap_value = _.get(hl_obj,'hv');
    if(['match_details','details'].includes(PageSourceData.page_source)) {
      let play_obj = _.get(MatchInfoCtr,`pl_obj.${play_id}`, {});
      if(_.has(play_obj,'hps') && play_obj.hps.includes('|')) {
        score_type = play_obj.hps.split('|')[0];
      }
      handicap_value = _.get(ol_obj,'on','');
    }
    let msc = msc_obj;
    if(msc_obj && _.isString(msc_obj)) {
      msc_obj = [msc_obj];
      msc_obj =BetCommonHelper. msc_array_obj(msc_obj);
    } else if(_.isArray(msc_obj)) {
      msc_obj =BetCommonHelper. msc_array_obj(msc_obj);
    }
    if(_.isEmpty(msc_obj)) {
      msc_obj = { [score_type]:{
          home: '0',
          away: '0'
        }
      }
    }
    if(!_.isEmpty(msc) && _.get(msc_obj,`${score_type}`)) {
      home_score = _.get(msc_obj,`${score_type}.home`, '0');
      away_score = _.get(msc_obj,`${score_type}.away`, '0');
    }
    // 及时比分
    let timerly_home_score = '', timerly_away_score = '';
    // 足球、篮球、棒球、乒乓球、排球
    if([1,2,3,8,9].includes(sport_id*1)) {
      timerly_home_score =  _.get(cs,'timerly_home_score');
      timerly_away_score =  _.get(cs,'timerly_away_score');
    }
    item_obj.cds = ol_obj.cds;
    item_obj.mhs = ol_obj._mhs;
    item_obj.hps[0].hl[0].hs=ol_obj._hs;
    item_obj.hps[0].hl[0].hid=ol_obj._hid;
    odds_value = _.get(ol_obj,'ov');
    active = BetData.get_odds_active(_.get(ol_obj, '_mhs'), _.get(ol_obj, '_hs'),  _.get(ol_obj, 'os'));
    // C303,C304拉取接口,如果hv_ov_change在vuex中还是true说明提示还没有结束,应该继续维持hv_ov_change=true
    if((hn && handicap_value_old!=handicap_value && odds_value_old != odds_value) || hv_ov_change_old) {
      hv_ov_change = true;
    }
    serial_type = item_obj.hps[0].hids==1;
    if(_.get(item_obj, 'cds') == "RC"){
      // 红猫赛事不支持串关
      serial_type=0;
    }
    Object.assign(obj, {
      key: id,
      bs: item_obj,
      cs: {
        id,  // 投注项id
        oid, // 投注项oid
        kid, // 坑位id
        match_id: _.get(ol_obj,'_mid'), // 赛事id
        handicap_id: _.get(ol_obj,'_hid'), //盘口id
        play_id, //玩法id
        sport_id: _.get(item_obj,'csid'), //球种
        match_status: _.get(ol_obj,'_mhs'), //赛事盘口状态
        handicap_value, // 盘口
        handicap_status:_.get(ol_obj,'_hs'), //盘口状态
        odds_value, //赔率
        active:_.get(ol_obj, 'os'), // 投注项状态
        play_name: _.get(item_obj,'hps[0].hpn',''), //玩法名称
        odds_switch: _.get(item_obj,'hps[0].hsw',''), //支持的赔率转换模板
        break_odds_value:_.get(ol_obj,'obv'), //断档赔率
        target_side, //T1,T2
        score_type,
        home_id: _.get(item_obj, 'mhid'), // 主队id
        home: _.get(item_obj, 'mhn'), //主队
        home_score, // 主队得分
        away_id: _.get(item_obj, 'maid'), // 客队id
        away: _.get(item_obj, 'man'), //客队
        away_score, // 客队得分
        effect: ['1','4'].includes(`${active}`), // 是否有效
        full_bet: 0, //是否满额投注，1：是，0：否
        money: _.get(cs,'money'), // 投注额
        win_money: _.get(cs,'win_money',''), // 可赢额
        min_money: _.get(cs,'min_money',''), // 最大值
        max_money: _.get(cs,'max_money',''), // 最小值
        source:  PageSourceData.page_source,
        match_type: _.get(cs, 'match_type',''), // 赛事类型
        market_type: _.get(cs, 'market_type',''), // 盘口类型
        hv_ov_change, // 盘口值与赔率是否一起变化
        handle_time,
        is_serial:_.get(cs,'is_serial'), // 是否可以进行串关
        serial_type,
        match_update:_.get(cs, 'match_update', false),
        operate_type: _.get(cs,'mprmc'), // 操盘类型取值 "", MTS ,PA
        timerly_home_score,
        timerly_away_score,
        pending_order_status:  _.get(cs,'pending_order_status') //是否能预约 0关闭 1开启 -1默认
      }
    });
    if (BetData.is_bet_single) {
      BetData.vx_bet_single_obj_attr(obj);
      // console.log('单关合并数据:', { obj });
    } else {
      // console.log('串关合并数据:', { obj });
      bet_obj_add_attr(obj);
    }
  } catch (error) {
    console.log(error)
  }
}



/**
 * @description: 更新投注项对象
 * @return {undefined} undefined
 */
const upd_bet_obj = ( timestap, mid) => {
  // return;
  // 如果是单关并且单关正在处理投注阻止数据合并 或者如果是串关且串关正在投注中,阻止数据合并
  if ((!mid || BetData.is_bet_single &&BetData.get_is_single_handle) || (!BetData.is_bet_single && BetData.vx_get_is_handle)) {
    return;
  }
  // 新流程正在锁住投注项的时候不允许更新投注栏赔率
  if(BetData.vx_get_bet_mode==1 && BetData.vx_get_bet_item_lock) {
    return;
  }
  let bet_obj;
  if(BetData.vx_is_bet_single) {
    _.forEach(BetData.vx_get_bet_single_list, item=>{
      if(item) {
        bet_obj = _.get(BetData,'vx_get_bet_single_obj');
        let match_id = _.get(bet_obj, `${item}.cs.match_id`, '');
        // 为同一场赛事则进行投注项更新
        if(match_id==mid) {
          upd_bet_obj_item(BetData, bet_obj, item, timestap);
        }
      }
    });
  } else {
    _.forEach(BetData.vx_get_bet_list, item=>{
      if(item) {
        bet_obj = _.get(BetData,'vx_get_bet_obj');
        let match_id = _.get(bet_obj, `${item}.cs.match_id`, '');
        // 为同一场赛事则进行投注项更新
        if(match_id==mid) {
          upd_bet_obj_item(BetData, bet_obj, item, timestap);
        }
      }
    });
  }
}



/**
 * @description: 更新投注项的比分
 
 * @param {String} mid 赛事id
 * @param {String} socket_name 视图中socket_name的名字,为推送时注册对象名称
 * @return {undefined} undefined
 */
const update_bet_score = ( match,  mid, socket_name, score_obj) => {
  let home_score, away_score, bet_obj, id, msc, obj, msc_obj;
  obj = BetData.vx_is_bet_single? 'vx_get_bet_single_obj':'vx_get_bet_obj';
  if(BetData[obj]) {
    for(let key of Object.keys(BetData[obj])) {
       id = key || "";
       break;
    }
    if(!id) return;
    bet_obj = _.cloneDeep(_.get(BetData,`${obj}.${id}`, {}));
  }
  if(_.has(bet_obj,'cs') && _.get(bet_obj,'cs.match_id', '')!=mid){
    return;
  }

  // 如果是赛事列表,或者搜索时的赛事列表则取一下逻辑
  if(["match_list","search_match_list"].includes(socket_name)) {
    msc = _.get(match,`match_list_data.mid_obj.mid_${mid}.msc`, []);
  }else if(["detail_match_list","recent","hot"].includes(socket_name)) { // 如果是详情部分(右侧的)最近关注,热门赛事则执行一下逻辑
    msc = _.get(that,`mid_obj.${mid}.msc`, {});
  } else {
    if(mid==_.get(that,'match_info_ctr.match_obj.mid')) {
      msc = _.get(that,'match_info_ctr.match_obj.msc', {});
    }
  }


  if(msc instanceof Array) {
    msc_obj =BetCommonHelper. msc_array_obj(msc);
  } else {
    msc_obj = msc;
  }
  // console.log(`===========update_bet_score==============合并比分前==========msc_obj:${JSON.stringify(msc_obj)}=====`);
  if(_.isObject(msc_obj) && _.isObject(score_obj) && !_.isEmpty(_.get(score_obj,'score_type'))) {
    // console.log(`=============================update_bet_score======score_obj:${JSON.stringify(score_obj)}=====`);
    msc_obj[_.get(score_obj,'score_type', '')] = {
      home: _.get(score_obj,'home','0'),
      away: _.get(score_obj,'away','0')
    }
  }
  let score_type = _.get(bet_obj,'cs.score_type');
  if(!_.isEmpty(score_type) && _.isString(score_type)) {
    if(!msc_obj || _.eq(msc_obj, {})) {
      // 默认主队和客队比分为0:0
      msc_obj[score_type] = {
        home: '0',
        away: '0'
      }
    }
    if(msc_obj && _.get(msc_obj,`${score_type}`, false)) {
      home_score = _.get(msc_obj,`${score_type}.home`, '0');
      away_score = _.get(msc_obj,`${score_type}.away`, '0');
    } else {
      home_score = '0';
      away_score = '0';
    }
    bet_obj.cs.home_score = home_score;
    bet_obj.cs.away_score = away_score;
  }
  console.log(`===========update_bet_score==============合并比分后==========msc_obj:${JSON.stringify(msc_obj)}=====`);
  // console.log(`=============================common.basic_score======score:${score}=====`);
  bet_obj.bs.msc = msc;
}

/**
 * @description: 更新投注项的比分
 * @param {Object} that 视图对象
 * @param {Object} 投注更新的目标对象
 * @param {String} id 投注项的id
 * @return {undefined} undefined
 */
const set_bet_obj_value = (that, obj) => {
  if (_.isPlainObject(obj)) {
    obj.key = _.get(obj,'cs.id','');
    if(that.vx_is_bet_single) {
      //添加单关投注项对象
      that.vx_bet_single_obj_attr(obj);
    } else {
      //添加串关投注项对象
      that.vx_bet_obj_add_attr(obj);
    }
  }
}