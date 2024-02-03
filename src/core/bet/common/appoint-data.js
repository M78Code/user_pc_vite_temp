import { nextTick, reactive, ref } from "vue"
import math_js from "src/core/bet/common/mathjs.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { i18n_t } from "src/boot/i18n.js"
import BetData from 'src/core/bet/class/bet-data-class.js'
import { FOOTBALL_PLAY_LET_BALL, MARKET_BIG_SMALL_PLAY_LIST, MARKET_RANG_FLAG_LIST, MARKET_HOME_PLAY_LIST, MARKET_AWAY_PLAY_LIST, BASKETBALL_BY_APPOINTMENT_let, BASKETBALL_BY_APPOINTMENT_total } from "src/output/index.js";
import lodash_ from "lodash"
import UserCtr from "src/core/user-config/user-ctr.js"

const ref_pre_book = reactive({
  min_odds_value: null, //最小赔率
  appoint_odds_value: null, // 预约赔率
  appoint_ball_value: '', // 预约球头
  appoint_ball_head: null, // 球头
  timerly_basic_score: '', // :计时比分 返回比分格式为: (主队得分-客队得分)
  ball_score: '', // 比分 
  basic_score: '', // 赛事比分 返回比分格式为: (主队得分-客队得分)
  min_head_value: 0, //最下盘口值
  max_head_value: 0, //最大盘口值
})

/*
赔率 减 
val 值 赔率
min 最小赔率
*/
const btn_reduce = ( obj ) => {
  let min_odds = parseFloat(ref_pre_book.min_odds_value)
  let odds_val = parseFloat(ref_pre_book.appoint_odds_value)
  // 最小值
  if(odds_val <= min_odds){
    ref_pre_book.appoint_odds_value = min_odds
    set_bet_obj_config()
    return 
  }
  // 获取 修改幅度值
  let num = reduce_change_val(odds_val)
  // 当前赔率 减去 幅度值
  let odds_new_ = math_js.subtract(odds_val,num) 
  // 最后的数据不能小于最小值
  if(odds_new_ < min_odds ){
    odds_new_ = min_odds
  }

  ref_pre_book.appoint_odds_value = format_money(odds_new_) 
  set_bet_obj_config()
}

/*
赔率 加
val 值 赔率
*/
const btn_add = ( obj ) => {
  let max_odds = 355
  let odds_val = parseFloat(ref_pre_book.appoint_odds_value)

  // 最大值
  if( odds_val >= max_odds ){
    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('bet.bet_max_booked_odds'));
    ref_pre_book.appoint_odds_value = max_odds
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

  ref_pre_book.appoint_odds_value = format_money(odds_new_) 
  set_bet_obj_config()
  return ref_pre_book.appoint_odds_value
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

/**
 * @description:点击加号(球头或者赔率)的修改逻辑
 * @param {string} type  赔率还是球头
 * @param {index} index  位置
 * @return {undefined} undefined
 */
const add_handle = (item, index = 1) => {
  //球头加
  let step = item.sportId == '1' ? 0.25 : 0.5;
  ref_pre_book.appoint_ball_head = math_js.add(ref_pre_book.appoint_ball_head, step);
  console.error('球头加', ref_pre_book.appoint_ball_head);
  const max_rang = 10;
  const max_big = 30;
  //足球
  if ('1' == item.sportId) {
    //让球
    if (MARKET_RANG_FLAG_LIST.includes(item.playId)) {
      if (ref_pre_book.appoint_ball_head >= max_rang) {
        ref_pre_book.appoint_ball_head = max_rang
        //给出弹框提示（已为最高预约盘口值，请重新调整）
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_hight_adjust')}`)
      }
      //大小球
    } else {
      if (ref_pre_book.appoint_ball_head >= max_big) {
        ref_pre_book.appoint_ball_head = max_big
        //给出弹框提示（已为最高预约盘口值，请重新调整）
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_hight_adjust')}`)
      }
    }
    //篮球
  } else if ('2' == item.sportId) {
    let max_let = 99.5;
    let max_small = 400.5;
    //让球
    if (BASKETBALL_BY_APPOINTMENT_let.includes(item.playId)) {
      if (ref_pre_book.appoint_ball_head >= max_let) {
        ref_pre_book.appoint_ball_head = max_let
        //给出弹框提示（已为最高预约盘口值，请重新调整）
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_hight_adjust')}`)
      }
    } else {
      if (ref_pre_book.appoint_ball_head >= max_small) {
        ref_pre_book.appoint_ball_head = max_small
        //给出弹框提示（已为最高预约盘口值，请重新调整）
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_hight_adjust')}`)
      }
    }
  }
  set_computed_appoint_ball_head(item)
  set_bet_obj_config(item)
  nextTick(() => {
    search_odds_value_by_ball_head(item);
  })
}

// h5 keyboard输入判断最大值最小值
const computed_keyboard_odds = (val) => {
  let max_odds = 355
  let min_odds = parseFloat(ref_pre_book.min_odds_value)
  let res = val
  if (val <= min_odds) {
    res = format_money(min_odds)
  }
  if (val >= max_odds) {
    res = format_money(max_odds)
  }
  ref_pre_book.appoint_odds_value = res
  set_bet_obj_config()
}

const computed_keyboard_handicap = (val) => {
  let max_rang = 10;
  let max_big = 30;
}


/**
 * @description:点击减号(球头或者赔率)的修改逻辑
 * @param {string} type  赔率还是球头
 * @param {index} index  位置
 * @return {undefined} undefined
 */
const sub_handle = (item, index = 1) => {
  let step = item.sportId == 1 ? 0.25 : 0.5;
  ref_pre_book.appoint_ball_head = math_js.subtract(ref_pre_book.appoint_ball_head, step);
  // console.error('market_type===', this.market_type);
  // console.error('basic_score===', ref_pre_book.basic_score);
  console.error('timerly_basic_score===', ref_pre_book.timerly_basic_score);
  if ('1' == item.sportId) { //足球
    //规则又改了，全场是主客队分数相加再加0.5， 非全场是主客队对应得分数加0.5，这里有三种情况，全场， 主队和客队
    let arr = ref_pre_book.timerly_basic_score.split('-');
    if (MARKET_BIG_SMALL_PLAY_LIST.includes(item.playId)) {
      ref_pre_book.ball_score = ref_pre_book.timerly_basic_score ? math_js.add(parseInt(arr[0]), parseInt(arr[1]), 0.5) : 0.5;
    } else if (MARKET_HOME_PLAY_LIST.includes(item.playId)) {
      ref_pre_book.ball_score = ref_pre_book.timerly_basic_score ? math_js.add(parseInt(arr[0]), 0.5) : 0.5;
    } else if (MARKET_AWAY_PLAY_LIST.includes(item.playId)) {
      ref_pre_book.ball_score = ref_pre_book.timerly_basic_score ? math_js.add(parseInt(arr[1]), 0.5) : 0.5;
    }
    //玩法id在MARKET_BIG_SMALL_PLAY_LIST里面的，球头下限要限制在当前进球数+0.5
    const mix_rang = -10;
    if ((MARKET_BIG_SMALL_PLAY_LIST.includes(item.playId) || MARKET_HOME_PLAY_LIST.includes(item.playId) || MARKET_AWAY_PLAY_LIST.includes(item.playId)) && ref_pre_book.appoint_ball_head <= ref_pre_book.ball_score) {
      ref_pre_book.appoint_ball_head = ref_pre_book.ball_score;
      console.error('ref_pre_book.appoint_ball_head====', ref_pre_book.appoint_ball_head);
      console.error('basic_score===', ref_pre_book.basic_score);
      //给出弹框提示（已为最低预约盘口值，请重新调整）
      useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_adjust')}`)
    } else if (FOOTBALL_PLAY_LET_BALL.includes(item.playId)) {
      if (ref_pre_book.appoint_ball_head <= mix_rang) {
        ref_pre_book.appoint_ball_head = mix_rang
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_adjust')}`)
      }
    }
    else
      if (ref_pre_book.appoint_ball_head < 0 && !FOOTBALL_PLAY_LET_BALL.includes(item.playId)) {
        ref_pre_book.appoint_ball_head = 0;
      }
  } else if ('2' == item.sportId) {//篮球
    let mix_let = -99.5;
    let mix_small = 50.5;
    if (BASKETBALL_BY_APPOINTMENT_let.includes(item.playId)) {//让球
      if (ref_pre_book.appoint_ball_head < mix_let) {
        ref_pre_book.appoint_ball_head = mix_let
        //给出弹框提示（已为最低预约盘口值，请重新调整）
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_adjust')}`)
      }
    } else {
      if (ref_pre_book.appoint_ball_head < mix_small) {
        ref_pre_book.appoint_ball_head = mix_small
        //给出弹框提示（已为最低预约盘口值，请重新调整）
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_adjust')}`)
      }
    }
  }
  set_computed_appoint_ball_head(item)
  set_bet_obj_config()
  console.error('球头减');
  nextTick(() => {
    search_odds_value_by_ball_head(item);
  })
}
/**
 * @description:这里是点击加减的时候，处理对应盘口搜索对应赔率逻辑
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const search_odds_value_by_ball_head = (item) => {
  let head = ref_pre_book.appoint_ball_value;
  let appoint_ob = lodash_.get(BetData, 'bet_appoint_obj', {}) || {};
  if (!Object.keys(appoint_ob).length || lodash_.isNull(appoint_ob.marketList)) return;
  let playOptionsId = '';
  let marketId = ''
  // console.error('外围数据vx_get_pre_bet_list===', list);
  // console.error('外围数据head===', head);
  //让球处理
  if (MARKET_RANG_FLAG_LIST.includes(item.playId)) {
    let cur_i = -1;
    let ml_len = appoint_ob.marketList.length;
    for (let i = 0; i < ml_len; i++) {
      let ml_item = appoint_ob.marketList[i];
      let odd_len = ml_item.marketOddsList.length;
      for (let j = 0; j < odd_len; j++) {
        let odd_item = ml_item.marketOddsList[j];
        if (lodash_.get(appoint_ob, 'currentMarket.marketOddsList[0].oddsType', -1) == odd_item.oddsType && odd_item.playOptions == head) {
          playOptionsId = odd_item.id; //投注项id
          cur_i = i;
          if (odd_item) {
            let ve = Number((math_js.divide(odd_item.oddsValue, 100000)).toFixed(2));
            let vu = UserCtr.odds.cur_odds == 'HK' ? Number(math_js.subtract(ve, 1)) : ve
            console.error('当前赔率前===', vu);
            console.error('当前盘口前===', vu);
            if (vu > ref_pre_book.appoint_odds_value) {
              ref_pre_book.appoint_odds_value = vu;
              console.error('当前最小值等于1', ref_pre_book.min_odds_value);
            }
            ref_pre_book.min_odds_value = vu;
            ref_pre_book.appoint_odds_value = vu == 0 ? ref_pre_book.appoint_odds_value : vu
            //设置输入框最小值
            console.error('当前赔率===', ref_pre_book.appoint_odds_value);
            console.error('当前盘口===', odd_item.playOptions);
            break;
          }
        }
      }
    }
  } else { //非让球处理
    //这里要调整下
    let dl_fillter = appoint_ob.marketList.filter(item => item.marketValue == ref_pre_book.appoint_ball_value)[0];
    //盘口id 预约需要筛选
    marketId = lodash_.get(dl_fillter, 'id', '');
    let parr = lodash_.get(dl_fillter, 'marketOddsList', []);
    let filter_arr = parr.filter(item => item.oddsType == lodash_.get(appoint_ob, 'currentMarket.marketOddsList[0].oddsType', -1));
    //投注项id 预约需要筛选
    playOptionsId = filter_arr[0] ? filter_arr[0]['id'] : '';
    if (filter_arr[0]) {
      let ve = Number((math_js.divide(filter_arr[0].oddsValue, 100000)).toFixed(2));


      let vu = UserCtr.odds.cur_odds == 'HK' ? Number(math_js.subtract(ve, 1)) : ve
      // console.error('当前赔率3333前===',  vu)
      // console.error('当前盘口3333前===', vu);
      if (vu > ref_pre_book.appoint_odds_value) {
        ref_pre_book.appoint_odds_value = vu
        // console.error('当前最小值等于2', ref_pre_book.min_odds_value);
      }
      ref_pre_book.min_odds_value = vu
      ref_pre_book.appoint_odds_value = vu == 0 ? ref_pre_book.appoint_odds_value : vu
    }
  }
  if (lodash_.isEmpty(playOptionsId) && lodash_.isEmpty(marketId)) {
    if (UserCtr.odds.cur_odds == 'EU') {
      ref_pre_book.min_odds_value = 1.01
    } else {
      ref_pre_book.min_odds_value = 0.01
    }
  }
}

const set_computed_appoint_ball_head = (item) => {
  let ball_head = '';
  if (item.sportId == 1) {
    if (!lodash_.isNull(ref_pre_book.appoint_ball_head)) {
      if (ref_pre_book.appoint_ball_head % 0.5 == 0) {
        ball_head = ref_pre_book.appoint_ball_head;
      } else {
        let unit = (ref_pre_book.appoint_ball_head * 2 - 0.5) / 2;
        //FOOTBALL_PLAY_LET_BALL
        if (ref_pre_book.appoint_ball_head > 0) {
          ball_head = `${unit}/${Math.abs(unit + 0.5)}`;
        } else if (unit < 0 && (unit + 0.5) >= 0) {
          ball_head = `-${unit + 0.5}/${Math.abs(unit)}`;
        } else {
          ball_head = `${unit + 0.5}/${Math.abs(unit)}`;
        }
      }
    }
    //显示球头值得玩法 中的所有让球玩法 且不是-号开头 且不等于0
    if (MARKET_RANG_FLAG_LIST.includes(item.playId) && !lodash_.startsWith(ball_head, '-') && ball_head != 0) {
      ball_head = '+' + ball_head
    }
  } else if (item.sportId == 2) {
    if (!lodash_.isNull(ref_pre_book.appoint_ball_head)) {
      //这里判断
      // if(ref_pre_book.appoint_ball_head < this.min_head_value){
      //   ref_pre_book.appoint_ball_head = this.min_head_value;
      // }else
      // if(ref_pre_book.appoint_ball_head > this.max_head_value){
      //   ref_pre_book.appoint_ball_head = this.max_head_value;
      // }
      ball_head = ref_pre_book.appoint_ball_head;
    }
    // if (!(tball_head_input && ball_head_input == document.activeElement)) {
    if (BASKETBALL_BY_APPOINTMENT_let.includes(item.playId) && !lodash_.startsWith(ball_head, '-') && !lodash_.startsWith(ball_head, '+') && ball_head != 0) {
      ball_head = '+' + ball_head
    }
    // }
  }
  ref_pre_book.appoint_ball_value = ball_head;
}

// 设置投注信息
const set_bet_obj_config = (item) => {
  const obj = {
    marketValue: ref_pre_book.appoint_ball_value, // 盘口值
    oddFinally: ref_pre_book.appoint_odds_value, // 预约赔率
    custom_id: BetData.bet_pre_appoint_id, // 投注项id
    odds: math_js.multiply(ref_pre_book.appoint_odds_value, 100000), // 投注项赔率
  }
  BetData.set_bet_pre_obj(obj)

  // 设置预约投注数据
  // let pre_data = {
  //   marketValue: ref_pre_book.appoint_ball_value, // 盘口值
  //   oid: lodash_.get(item,'playOptionsId'), // 投注项id
  //   pre_odds: math_js.multiply(ref_pre_book.appoint_odds_value, 100000), // 投注项赔率
  //   pre_oddFinally:  ref_pre_book.appoint_odds_value, // 预约赔率
  // }
  // BetData.set_bet_single_list_obj(pre_data)

}

const set_ref_data = (item) => {
  // 获取投注项 盘口信息
  let market_info = lodash_.get(BetData.bet_read_write_refer_obj, `${item.playOptionsId}`, {})
  // 球头处理
  let handicap = lodash_.toString(market_info.marketValue);
  let init_ball_head = 0
  if (handicap && handicap.includes('/')) {
    let arr = handicap.split('/');
    init_ball_head = (Math.abs(Number(arr[0])) + Math.abs(Number(arr[1]))) / 2;
    if (handicap.startsWith('-')) {
      init_ball_head *= -1;
    }
  } else if (handicap || handicap == '0') {
    init_ball_head = Number(handicap);
  }
  // 赔率
  ref_pre_book.appoint_odds_value = market_info.oddFinally
  // 最小赔率是它本身
  ref_pre_book.min_odds_value = market_info.oddFinally
  // 球头 显示
  ref_pre_book.appoint_ball_value = market_info.marketValue
  // 球头 计算
  ref_pre_book.appoint_ball_head = init_ball_head
  // 获取及时比分 格式: (主队比分-客队比分)
  ref_pre_book.timerly_basic_score = market_info.timerly_basic_score || ''
}

export {
  btn_reduce,
  btn_add,
  sub_handle,
  add_handle,
  ref_pre_book,
  set_ref_data,
  computed_keyboard_odds,
  computed_keyboard_handicap
}