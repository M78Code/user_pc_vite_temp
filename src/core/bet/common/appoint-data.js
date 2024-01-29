import math_js from "src/core/bet/common/mathjs.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { i18n_t } from "src/boot/i18n.js"

/*
赔率 减 
val 值 赔率
min 最小赔率
*/
const btn_reduce = ( {odds,min} ) => {
  let min_odds = parseFloat(min)
  let odds_val = parseFloat(odds)
  // 最小值
  if(odds_val <= min_odds){
    return min_odds
  }
  // 获取 修改幅度值
  let num = reduce_change_val(odds_val)
  // 当前赔率 减去 幅度值
  let odds_new_ = math_js.subtract(odds_val,num) 
  // 最后的数据不能小于最小值
  if(odds_new_ < min_odds ){
    odds_new_ = min_odds
  }

  return format_money(odds_new_) 
}

/*
赔率 加
val 值 赔率
*/
const btn_add = ( odds ) => {
  let max_odds = 355
  let odds_val = parseFloat(odds)

  // 最大值
  if( odds_val >= max_odds ){
    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('bet.bet_max_booked_odds'));
    return max_odds
  }
  // 获取 修改幅度值
  let num = odds_change_val(odds_val)
  // 当前赔率 加上 幅度值
  let odds_new_ = math_js.add(odds_val,num) 
  // 最后的数据不能大于最大值
  if(odds_new_ > max_odds ){
    odds_new_ = max_odds
    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('bet.bet_max_booked_odds'));
  }

  return format_money(odds_new_)
}


/**
 *@description 将金额转化为千位符格式保留2位小数
 *@param {Number} num 待格式化的金额
 *@return {String} 转化后的金额 比如 '64,464.95'
 */
const format_money = (num) => {

  let number = 2

  if(  num < 10 ){
    number = 2
  }else if ( num >= 10 && num < 20 ){
    number = 1
  }else if (num >= 20){
    number = 0
  }

  try {
    if (num && num < 0) {
      num = 0;
    }
    num = (num || 0).toString();
    let result = "";
    let [num1, num2 = "00"] = num.split(".");
    num2 = num2.padEnd(number, "0").slice(0,number);
   
    if (num1) {
      num1 = num1 + result;
    }
    let count = num1 + (num2 ? ( "." + num2) : "");

    return count
  } catch (error) {
    console.error(error);
    return "";
  }
};

/*
例如：
< 3.00的：如 1.99，2.00，2.01，2.99；
≥3 且＜5.00的：如 3.00，3.05， 3.55 ，4.95；
≥5 且 ＜10.00的：如5.00，5.10， 6.20 ，7.30，9.90；
≥10 且 ＜20.0的：如10.0，10.5， 11.5 ，18.5，20.0；
≥20 ～355：如20，21， 22 ，99，100，300，......

场景举例：
赔率18.5时，连续点击三次，为19.0，19.5，20
赔率19.0时，连续点击三次，为19.5，20, 21
*/
const odds_change_val = (val) => {
  let odds = parseFloat(val)
  let num = 0.01
  if(odds >= 3 && odds < 5){
    num = 0.05
  }else if( odds >= 5 && odds < 10 ){
    num = 0.1
  }else if ( odds >= 10 && odds < 20 ){
    num = 0.5
  }else if (odds >= 20){
    num = 1
  }
  return num
}

const reduce_change_val = (val) => {
  let odds = parseFloat(val)
  let num = 0.01
  if(odds > 3 && odds <= 5){
    num = 0.05
  }else if( odds > 5 && odds <= 10 ){
    num = 0.1
  }else if ( odds > 10 && odds <= 20 ){
    num = 0.5
  }else if (odds > 20){
    num = 1
  }
  return num
}

export {
  btn_reduce,
  btn_add,
}