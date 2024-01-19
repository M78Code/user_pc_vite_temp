import { i18n_t } from "src/boot/i18n.js";
import {is_eports_csid} from "src/output/module/constant-utils-common.js"; 

/**
 *@description 赔率展示优化，见优化单 13807,电竞不走这个逻辑
 *@param {Number|String} val 最终赔率 30.40 100.00
 *@param {Number|String} csid 球类id
 *@return {String} 优化后的赔率，30.4 100
 */
export const format_odds = function (val, csid) {
  val = (val || "0").toString();
  if (!val.includes(".") || [100, 101, 102, 103].includes(+csid)) return val;
  if (val >= 100) {
    if (val.split(".")[1] == "00") {
      return val.split(".")[0];
    } else {
      return val;
    }
  }
  if (val >= 10) {
    if (val.split(".")[1][1] == "0") {
      return val.slice(0, val.length - 1);
    } else {
      return val;
    }
  }
  return val;
};

// 赔率格式化
export const format_odds_value = (val,csid) => {
  if (val == "" || val == undefined) {
    return "";
  }
  val = (val || "0").toString();
  let ret = val;
  if (!is_eports_csid(csid) && val.includes(".")) {
    if (val >= 100) {
      if (val.split(".")[1] == "00") {
        ret = val.split(".")[0];
      } else {
        let len = val.length;
        if (val.indexOf(".0") == len - 2) {
          ret = val.substring(0, len - 2);
        } else {
          ret = val;
        }
      }
    } else if (val >= 10) {
      if (val.split(".")[1][1] == "0") {
        ret = val.slice(0, val.length - 1);
      } else {
        ret = val;
      }
    }
  }
  return ret;
};
//赔率展示格式化
export const format_odds2 = (val)=> {
  if (val == '' || val == undefined) {
    return '';
  }
  val = (val || '0').toString();
  let ret = val;
  if (val.includes('.')) {
    if (val >= 100) {
      if (val.split('.')[1] == '00') {
        ret = val.split('.')[0];
      } else {
        let len = val.length;
        if (val.indexOf('.0') == (len - 2)) {
          ret = val.substring(0, len - 2);
        } else {
          ret = val;
        }
      }
    } else if (val >= 10) {
      if (val.split('.')[1][1] == '0') {
        ret = val.slice(0, val.length - 1);
      } else {
        ret = val;
      }
    }
  }
  return ret;
}

/**
 * @description: 赔率展示格式化
 * @param {string} val 赔率值
 * @return {String}
 */
export const format_odds_2 = (val) => {
  if (val == "" || val == undefined) {
    return "";
  }
  val = (val || "0").toString();
  let ret = val;
  if (val.includes(".")) {
    if (val >= 100) {
      if (val.split(".")[1] == "00") {
        ret = val.split(".")[0];
      } else {
        let len = val.length;
        if (val.indexOf(".0") == len - 2) {
          ret = val.substring(0, len - 2);
        } else {
          ret = val;
        }
      }
    } else if (val >= 10) {
      if (val.split(".")[1][1] == "0") {
        ret = val.slice(0, val.length - 1);
      } else {
        ret = val;
      }
    }
  }
  return ret;
};

/**
    * @description: 胜平负、大小走水格式化
    * @return {}
    */
export const result_filter = (type, value) =>{
  //  2平3输4赢, 2走水3小4大
  if( type == 'cls'){
    switch(value){
      case 2: return 'dogfall';
      case 3: return 'lose';
      case 4: return 'win';
      default: return 'default';
    }
  } else if(type == 'resultLabel'){
    switch(value){
      case 2: return i18n_t("analysis.level");
      case 3: return i18n_t("analysis.lose");
      case 4: return i18n_t("analysis.win");
    }
  } else if(type == 'resultwinlose'){
    switch(value){
      case 2: return i18n_t("analysis.flat");
      case 3: return i18n_t("analysis.negative");
      case 4: return i18n_t("analysis.victory");
      default: return i18n_t("analysis.no_data")
    }
  } else if(type == 'overunderLabel'){
    switch(value){
      case 2: return i18n_t("analysis.level");
      case 3: return i18n_t("analysis.small");
      case 4: return i18n_t("analysis.big");
      default: return i18n_t("analysis.no_data")
    }
  }
}


/**
 * @description: 比分格式处理(投注时用到)
 * @param {Array} msc 比分
 * @param {Integer} csid 球种id
 * @param {Integer} ms 赛事状态
 * @param {Integer} hpid 玩法id
 * @return {String} 比分格式为: (主队比分-客队比分)
 */
export const calc_bifen = (msc, csid, ms, hpid) => {   
  //只有足球滚球展示基准分
  if (!msc[0] || csid != 1 || !ms || ms == 0) return "";
  let S;
  if (hpid == 128) {
    S = msc.toString().match(/S7\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 130) {
    S = msc.toString().match(/S701\|[0-9]+\:[0-9]+/);
  }
  if (hpid == 143) {
    S = msc.toString().match(/S3\|[0-9]+\:[0-9]+/);
  }
  if (['4','27','29','269','336'].includes(`${hpid}`)) {
    S = msc.toString().match(/S1\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 19) {
    S = msc.toString().match(/S2\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 113) {
    S = msc.toString().match(/S5\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 121) {
    S = msc.toString().match(/S15\|[0-9]+\:[0-9]+/);
  }
  if (S) return S[0].split('|')[1];
  return "";
}

/**
 * @Description:获取押注项逻辑转换后的最新状态(通过赛事状态,押注状态,押注项状态进行转换)
 * @Author success
 * @param:matchHandicapStatus - 赛事状态mhs  0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
 * @param:status - 盘口级别状态hs   0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
 * @param:active - 投注项级别状态os  1:开盘(激活)，2:封盘(未激活)，3投注项隐藏(不会有4 锁盘 的值返回)
 * @return:1.开盘，2封盘，3关盘 ，4 锁盘
 * @Date 2019/12/26 12:18:02
 */
export const get_odds_active = (matchHandicapStatus, status, active) => {
  var active_ = 1;
  if (matchHandicapStatus) { // 赛事盘口有操作变化时
    if (matchHandicapStatus == 1) { //赛事封盘状态
      active_ = 2;
    } else if (matchHandicapStatus == 11) { //赛事锁盘
      if(active!=1){
        active_ = active;
      } else{
        active_ = 4;
      }
    } else if (matchHandicapStatus == 2 || matchHandicapStatus == 3 || matchHandicapStatus == 4 || matchHandicapStatus == 5) { //赛事关盘
      active_ = 3;
    }
    return active_;
  }

  if (status) { // 盘口有操作变化时
    if (status == 1) { //盘口封盘
      active_ = 2;
    } else if (status == 2 || status == 3 || status == 4 || status == 5) { //盘口关盘
      active_ = 3;
    } else if (status == 11) { //盘口锁盘
      active_ = 4;
    }
    return active_;
  }
  return active
}
