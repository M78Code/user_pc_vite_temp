/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 押注相关的共通函数
 * 
 * 优化为
 * N串1：赔率相乘再乘以投注金额 ,计算得出的金额再减去本金，再四舍六入五成双 保留2位小数
 * M串N最高可赢
 * 每个最小单位的n串1，赔率相乘再乘以投注金额,计算得出的金额再减去本金，四舍六入五成双，保留2位小数，每个最小的N串1得出的值再相加
 * 
 */
/**
 * @Description:计算串关数量的最大可盈金额
 * @Author success
 * @param:orderDetailMap    注单map
 * @param:series_values      串关数量
 * @return:可能组合的对象
 * @Date 2019/12/21 15:15:50
 */
 import BetCountJointNumber from "src/public/utils/bet/betCountJointNumber.js"
export function get_max_win_money(bet_list, bet_obj, bet_s_list, series_values, bet_amount, that) {
  if(isNaN(bet_amount) || bet_amount == 0)
  {
    return 0;
  }
  let max_win_money_total = 0;
  if (bet_s_list && bet_s_list.length && series_values && bet_s_list && bet_s_list.length) {
    let chs = [];
    let data = BetCountJointNumber.getBetCountJoint(bet_list.length);
    for (let i = 0; i < data.length; i++) {
      chs.push(i);
    }
    let series_assemble = get_series_assemble(chs);
    let temp_ = series_values.split('串');
    let p0 = parseInt(temp_[0]);
    let p1 = parseInt(temp_[1]);

    let series_list = [];
    if (p0 < p1) {
      series_list = series_assemble;
    } else {
      let str_sum = 0;
      if (p0 == chs.length) {
        //N-1
        str_sum = chs.length;
      } else {
        //(N-1)-1
        str_sum = p0;
      }
      for (let i = 0; i < series_assemble.length; i++) {
        const key = series_assemble[i];
        if (key.length == str_sum) {
          series_list.push(key)
        }
      }
    }
    for (let i = 0; i < series_list.length; i++) {
      const keys = series_list[i];
      let odds_value = 1;
      let max_win_money = 0;
      for (let j = 0; j < keys.length; j++) {
        const index = keys[j];
        // if (bet_amount == 0) {
        // 获取押注金额
        // bet_amount = bat_list[index].money;
        //这里把每个欧赔都做了直接保留两位小数的处理再次相乘
        let id = bet_list[index];

        let cs = bet_obj && bet_obj[id] && bet_obj[id].cs;
        if (cs) {
          let odds_value_ = cs.odds_value;
          if (odds_value_ && odds_value_ != '') {
            odds_value *= odds_float_format2(that.$mathjs.divide(parseFloat(odds_value_),100000));
          }
        }

        // }
      }
      //串关所有赔率相乘，直接保留两位小数
      // odds_value = odds_float_format2(odds_value);
      // max_win_money = (odds_value * bet_amount - bet_amount)//押注金额*赔率-押注金额
      // max_win_money = (odds_value*100000 * bet_amount - bet_amount*100000)//押注金额*赔率-押注金额
      // max_win_money = max_win_money/100000;
      max_win_money = (that.$mathjs.multiply(odds_value,100000) * bet_amount - that.$mathjs.multiply(bet_amount,100000))//押注金额*赔率-押注金额
      max_win_money =  that.$mathjs.divide(max_win_money,100000);

      if(!isNaN(max_win_money))
      {
        max_win_money = four_five_six_double(max_win_money, 2)*1;
      }
      max_win_money_total += max_win_money;
    }
    //最后计算最高可盈，使用4舍6入5成双
    // max_win_money_total = max_win_money_total > 0 ? four_five_six_double(max_win_money_total, 2) : max_win_money_total;
  } else {
    console.log('数据异常');
  }
  return max_win_money_total;
}

/**
 * @Description:小数点后两位,超出直接截取
 * @Author success
 * @param:
 * @return:
 * @Date 2019/12/21 17:13:53
 */
export function odds_float_format2(odds) {
  // let ret = parseInt(odds * 100) / 100;
  let ret = calc_odds(odds)*1;
  return ret;
}

/**
* @Description 返回字符串保留两位小数
* @param {number} val  要格式化的值
* @return {number} 
*/
export function calc_odds(val) {
  let N = val.toString();
  if (N.includes(".")) {
    let S = N.split('.');
    if (S[1][1]) {
      val = S[0] + "." + S[1][0] + S[1][1];
    } else {
      val = S[0] + "." + S[1][0] + "0";
    }
  } else {
    val = N + ".00";
  }
  return val;
}

/**
 * @description:四舍六入五成双
 * @param {number} num 要格式化的值
 * @param {number} digit 
 * @return {number}
 */
export function four_five_six_double(num, digit) {
  let ratio = Math.pow(10, digit),
    _num = num * ratio,
    mod = _num % 1,
    integer = Math.floor(_num);
  if (mod > 0.5) {
    return ((integer + 1) / ratio).toFixed(2);
  } else if (mod < 0.5) {
    return (integer / ratio).toFixed(2);
  } else {
    return ((integer % 2 === 0 ? integer : integer + 1) / ratio).toFixed(2);
  }
}

/**
 * @description:计算该串关所有注单组合
 * @param {Array} chs 数据源
 * @return {Array}
 */
export function get_series_assemble(chs) {
  let len = chs.length;
  if(len==1){
    return [[0,1]];
  }
  let nbits = 1 << len;
  let series_list = [];
  for (let i = 0; i < nbits; i++) {
    let t = 0;
    let sb = [];
    for (let j = 0; j < len; j++) {
      t = 1 << j;
      if ((t & i) != 0)  // 与运算，同为1时才会是1
      {
        sb.push(chs[j]);
      }
    }
    if (sb.length > 1) {
      series_list.push(sb);
    }
  }
  return series_list;
}
console.log('--------------MAX---------------------')


