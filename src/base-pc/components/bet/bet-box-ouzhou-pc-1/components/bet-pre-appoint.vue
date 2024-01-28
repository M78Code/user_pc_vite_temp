<template>
  <div class="bet-pre-appoint">
    <div v-if="ref_data.computed_appoint_ball_head !== ''" class="row yb-flex-center book-content">
      <!--预-->
      <div class="col-2 center yb-fontsize12">{{ i18n_t('bet.bet_dish') }}</div>
      <!--此处为盘口区域，-->
      <div class="input-number">
        <!-- 盘口减- -->
        <div @click="sub_handle('ball_head')" class="sub-number" :class="{ 'disabled': head_sub_style }">-</div>
        <input class="pre-input" v-model="ref_data.computed_appoint_ball_head" v-if="item.sportId == 1" readonly>
        <input class="pre-input" ref="ball-head-input" v-model="ref_data.computed_appoint_ball_head"
          @blur="appoint_odds_head_handle" v-if="item.sportId == 2">
        <!-- 盘口加+-->
        <div class="add-number" :class="{ 'disabled': head_add_style }" @click="add_handle('ball_head')">+</div>
      </div>
    </div>
    <div class="row yb-flex-center book-content">
      <div class="col-2 mt5 center yb-fontsize12">{{ i18n_t('bet.bet_odds') }}</div>
      <!--减号 赔率输入框 加号-->
      <div class="input-number mt5">
        <div class="sub-number" :class="{ 'disabled': ref_data.min_odds_value == ref_data.appoint_odds_value }"
          v-touch-repeat:0:300.mouse.enter.space="() => {
            sub_handle('odds_value')
          }">-</div>

        <input class="pre-input" v-model="ref_data.appoint_odds_value" @input="pre_input_handle"  ref="currency_input">

        <div class="add-number" :class="{ 'disabled': ref_data.appoint_odds_value >= 355 }"
          v-touch-repeat:0:300.mouse.enter.space="() => {
            add_handle('odds_value')
          }">+</div>
      </div>
      <div class="col-1"></div>
    </div>
    <!--取消-->
    <div class="col-1 cancel" @click="cancel_operate">
      <icon-wapper size="13px" name="icon-delete" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick, onMounted } from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import { i18n_t } from "src/boot/i18n.js"
import { FOOTBALL_PLAY_LET_BALL, MARKET_BIG_SMALL_PLAY_LIST, MARKET_RANG_FLAG_LIST, MARKET_HOME_PLAY_LIST, MARKET_AWAY_PLAY_LIST, BASKETBALL_BY_APPOINTMENT_let, BASKETBALL_BY_APPOINTMENT_total } from "src/output/index.js";
import mathJs from 'src/core/bet/common/mathjs.js'
import UserCtr from 'src/core/user-config/user-ctr.js'
import lodash_ from 'lodash'
import BetInput from "./bet-input.vue"
import { IconWapper } from 'src/components/icon'
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"

const emit = defineEmits(["cancel_operate"]);

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  item: {}
})

const ref_data = reactive({
  min_odds_value: null, //最小赔率
  appoint_odds_value: null, // 预约赔率
  appoint_ball_head: null, // 预约球头
  timerly_basic_score: '', // :计时比分 返回比分格式为: (主队得分-客队得分)
  computed_appoint_ball_head: '', // 球头
  ball_score: '', // 比分 
  basic_score: '', // 赛事比分 返回比分格式为: (主队得分-客队得分)
  min_head_value: 0, //最下盘口值
  max_head_value: 0, //最大盘口值
})

const ball_head_input = ref('ball-head-input')
const currency_input = ref('currency_input')

// 取消预约
const cancel_operate = () => {
  emit("cancel_operate");
}

onMounted(() => {
  // 获取投注项 盘口信息
  let market_info = lodash_.get(BetData.bet_read_write_refer_obj, `${props.item.playOptionsId}`, {})
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
  // 球头 显示
  ref_data.computed_appoint_ball_head = market_info.marketValue
  // 球头 计算
  ref_data.appoint_ball_head = init_ball_head
  // 赔率
  ref_data.appoint_odds_value = market_info.oddFinally
  // 最小赔率是它本身
  ref_data.min_odds_value = market_info.oddFinally
  // 获取及时比分 格式: (主队比分-客队比分)
  ref_data.timerly_basic_score = market_info.timerly_basic_score || ''
})

/**
 * @Description 球头减样式
 * @param {undefined} undefined
 * @returns {boolen}
 */
const head_sub_style = computed(() => {
  let sty = false;
  if ('1' == props.item.sportId) {
    if (FOOTBALL_PLAY_LET_BALL.includes(props.item.playId)) {
      if (ref_data.appoint_ball_head <= -10) {
        sty = true;
      }
    } else {
      // sty = (!FOOTBALL_PLAY_LET_BALL.includes(props.item.playId) && ref_data.appoint_ball_head<=0) ||
      if ((MARKET_BIG_SMALL_PLAY_LIST.includes(props.item.playId) ||
        MARKET_HOME_PLAY_LIST.includes(props.item.playId) ||
        MARKET_AWAY_PLAY_LIST.includes(props.item.playId)) &&
        ref_data.appoint_ball_head <= ref_data.ball_score) {
        sty = true;
      } else if (ref_data.appoint_ball_head <= 0) {
        sty = true;
      }
    }
  } else if ('2' == props.item.sportId) {
    if (BASKETBALL_BY_APPOINTMENT_let.includes(props.item.playId)) {//让球
      if (ref_data.appoint_ball_head <= -99.5) {
        sty = true;
      }
    } else if (BASKETBALL_BY_APPOINTMENT_total.includes(props.item.playId)) {//大小
      if (ref_data.appoint_ball_head <= 50.5) {
        sty = true;
      }
    }
  }
  return sty;
})

/**
 * @Description 球头加样式
 * @param {undefined} undefined
 * @returns {boolen}
 */
const head_add_style = computed(() => {
  let sty = false;
  if (1 == props.item.sportId) {
    if (FOOTBALL_PLAY_LET_BALL.includes(props.item.playId)) {
      if (ref_data.appoint_ball_head >= 10) {
        sty = true;
      }
    } else {
      if (ref_data.appoint_ball_head >= 30) {
        sty = true;
      }
    }
  } else if ('2' == props.item.sportId) {
    //让球
    if (BASKETBALL_BY_APPOINTMENT_let.includes(props.item.playId)) {
      if (ref_data.appoint_ball_head >= 99.5) {
        sty = true;
      }
      //大小
    } else if (BASKETBALL_BY_APPOINTMENT_total.includes(props.item.playId)) {
      if (ref_data.appoint_ball_head >= 400.5) {
        sty = true;
      }
    }
  }
  return sty;
})


const appoint_odds_head_handle = (event) => {
  let new_value = Number(event.target.value);
  if (lodash_.isNaN(new_value)) {
    return;
  }
  if (lodash_.startsWith(new_value, "+")) {
    new_value = new_value.slice(1);
  }
  ref_data.appoint_ball_head = Number(event.target.value) ? Number(event.target.value).toFixed(1) : Number(event.target.value);
  if (new_value > ref_data.max_head_value) {
    ref_data.appoint_ball_head = ref_data.max_head_value
    //预约赔率可输入最大值
    if (lodash_.isNaN(ref_data.appoint_odds_value)) {
      ref_data.appoint_odds_value = max_head_value
    }
  }
  if (new_value < ref_data.min_head_value) {
    ref_data.appoint_ball_head = ref_data.min_head_value
    if (lodash_.isNaN(ref_data.appoint_odds_value)) {
      //预约赔率可输入最大值
      ref_data.appoint_odds_value = min_head_value
    }
  }
}

/**
    * @description:输入的预约赔率
    * @param {*} event 
    * @return {undefined} undefined
    */
const appoint_odds_value_handle = (event) => {
  ref_data.appoint_odds_value = Number(event.target.value);
  if (lodash_.isNaN(ref_data.appoint_odds_value)) {
    ref_data.appoint_odds_value = 355.00 //预约赔率可输入最大值
  }
  if (Number(event.target.value) < ref_data.min_odds_value) {
    ref_data.min_odds_value = ref_data.min_odds_value;
    ref_data.min_odds_value = -1000;//这里输入的值如果小于最小值的话，给个很小的值，目的不让当前输入值变成最小值
  }
}
//  49381 【生产】【产品】【三端】预约投注-增减赔率优化
// 赔率列表 根据赔率判断点击增加或减少对应的赔率数值
const odd_list = [
  {
    oddsRange: 3, // 范围
    add_odd: 0.01 // 增减赔率
  },
  {
    oddsRange: 5,
    add_odd: 0.05
  },
  {
    oddsRange: 10,
    add_odd: 0.1
  },
  {
    oddsRange: 20,
    add_odd: 0.5
  },
  {
    oddsRange: 9999999999, // 无限大
    add_odd: 1
  },
]

// 格式化预约赔率
const format_pre_odds = (appoint_odds_value) => {
  /**
    // 49381 【生产】【产品】【三端】预约投注-增减赔率优化
    赔率范围	小数位精确	调整幅度
    < 3.00	2位小数	0.01
    ≥3.00 且＜5.00	2位小数	0.05
    ≥5.00 且 ＜10.0的	2位小数	0.10
    ≥10.0 且 ＜20.0	1位小数（仅出现.0与.5）	0.50
    ≥20.0～无限	仅展示个位数
    1.00

    例如：
    < 3.00的：如 1.99，2.00，2.01，2.99；
    ≥3 且＜5.00的：如 3.00，3.05， 3.55 ，4.95；
    ≥5 且 ＜10.00的：如5.00，5.10， 6.20 ，7.30，9.90；
    ≥10 且 ＜20.0的：如10.0，10.5， 11.5 ，18.5，20.0；
    ≥20 ～无限：如20，21， 22 ，99，100，300，......
  */
  let decimal_digits = lodash_.split(appoint_odds_value, '.', 2);
  let decimal_digits_1 = decimal_digits[1] || '';
  if (+(decimal_digits[0]) >= 20) {
    appoint_odds_value = decimal_digits[0]
  } else if (decimal_digits_1[0] == undefined && decimal_digits_1[1] == undefined && +(decimal_digits[0]) < 10) {
    appoint_odds_value = decimal_digits[0] + '.00'
  } else if (+(decimal_digits[0]) != 0 && decimal_digits_1[0] != undefined && decimal_digits_1[1] == undefined && +(decimal_digits[0]) < 10) {
    appoint_odds_value = decimal_digits[0] + '.' + decimal_digits_1 + '0'
  } else if (+(decimal_digits[0]) >= 10 && decimal_digits_1[0] == undefined && decimal_digits_1[1] == undefined) {
    appoint_odds_value = decimal_digits[0] + '.0'
  } else {
    return appoint_odds_value ? appoint_odds_value : ''
  }
  return appoint_odds_value
}

const pre_input_handle = (val) => {
  console.log('这这这这这这', val)
  set_bet_obj_config()
}

// 设置投注信息
const set_bet_obj_config = () => {
  const obj = {
      marketValue: ref_data.computed_appoint_ball_head, // 盘口值
      oddFinally: lodash_.get(props.item,'oddFinally'), // 当前赔率
      custom_id: lodash_.get(props.item,'playOptionsId'), // 投注项id
      odds: mathJs.multiply(ref_data.appoint_odds_value, 100000), // 投注项赔率
      handicap: lodash_.get(props.item,'handicap')
    }
    // ref_custom.odds = mathJs.multiply(ref_custom.oddFinally,100000)
    BetData.set_bet_pre_obj(obj)
    console.log('这这这', ref_data , props.item.handicap)
}

/**
 * @description:点击加号(球头或者赔率)的修改逻辑
 * @param {string} type  赔率还是球头
 * @param {index} index  位置
 * @return {undefined} undefined
 */
const add_handle = (type, index = 1) => {
  //赔率加
  if (type == 'odds_value') {
    let aov = ref_data.appoint_odds_value;
    const list = odd_list.find(item => {
      return aov < item.oddsRange
    });

    ref_data.appoint_odds_value = format_pre_odds(mathJs.add(aov, list.add_odd));
    //获取当前需要添加焦点的输入框，如果存在输入框，则获取焦点
    let input = index == 0 ? currency_input : ''
    if (input) input.focus();
    set_bet_obj_config()
  }
  //球头加
  if (type == 'ball_head') {
    let step = props.item.sportId == '1' ? 0.25 : 0.5;
    ref_data.appoint_ball_head = mathJs.add(ref_data.appoint_ball_head, step);
    console.error('球头加', ref_data.appoint_ball_head);
    const max_rang = 10;
    const max_big = 30;
    //足球
    if ('1' == props.item.sportId) {
      //让球
      if (MARKET_RANG_FLAG_LIST.includes(props.item.playId)) {
        if (ref_data.appoint_ball_head >= max_rang) {
          ref_data.appoint_ball_head = max_rang
          //给出弹框提示（已为最高预约盘口值，请重新调整）
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_hight_adjust')}`)
        }
        //大小球
      } else {
        if (ref_data.appoint_ball_head >= max_big) {
          ref_data.appoint_ball_head = max_big
          //给出弹框提示（已为最高预约盘口值，请重新调整）
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_hight_adjust')}`)
        }
      }
      //篮球
    } else if ('2' == props.item.sportId) {
      let max_let = 99.5;
      let max_small = 400.5;
      //让球
      if (BASKETBALL_BY_APPOINTMENT_let.includes(props.item.playId)) {
        if (ref_data.appoint_ball_head >= max_let) {
          ref_data.appoint_ball_head = max_let
          //给出弹框提示（已为最高预约盘口值，请重新调整）
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_hight_adjust')}`)
        }
      } else {
        if (ref_data.appoint_ball_head >= max_small) {
          ref_data.appoint_ball_head = max_small
          //给出弹框提示（已为最高预约盘口值，请重新调整）
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_hight_adjust')}`)
        }
      }
    }
    set_computed_appoint_ball_head()
    set_bet_obj_config()
    nextTick(() => {
      search_odds_value_by_ball_head();
    })
  }
}
/**
 * @description:点击减号(球头或者赔率)的修改逻辑
 * @param {string} type  赔率还是球头
 * @param {index} index  位置
 * @return {undefined} undefined
 */
const sub_handle = (type, index = 1) => {
  if (ref_data.min_odds_value == -1000) {
    ref_data.min_odds_value = ref_data.min_odds_value;
  }
  // if(type == 'odds_value' && ref_data.appoint_odds_value > ref_data.min_odds_value) {
  //   let aov = ref_data.appoint_odds_value;
  //   ref_data.appoint_odds_value = aov - 0.01;
  //   // this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_RECALL_MONEY_CMD, this.id);
  // }
  if (type == 'odds_value') {
    if (ref_data.appoint_odds_value > ref_data.min_odds_value) {
      let aov = ref_data.appoint_odds_value;
      const list = odd_list.find(item => {
        return aov <= item.oddsRange
      });

      ref_data.appoint_odds_value = format_pre_odds(mathJs.subtract(aov, list.add_odd));
      let input = index == 0 ? currency_input : ''
      if (input) input.focus();
    } else {
      //给出弹框提示（已为最低预约盘口值，请重新调整）
      useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('error_msg_info.0400540.client_msg1')}`)
    }
  }
  // this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_RECALL_MONEY_CMD, this.id);
  if (type == 'ball_head') {
    let new_num = ref_data.appoint_ball_head;
    let step = props.item.sportId == 1 ? 0.25 : 0.5;
    ref_data.appoint_ball_head = mathJs.subtract(ref_data.appoint_ball_head, step);
    // console.error('market_type===', this.market_type);
    // console.error('basic_score===', ref_data.basic_score);
    console.error('timerly_basic_score===', ref_data.timerly_basic_score);
    if ('1' == props.item.sportId) { //足球
      // let nnn = '2-3'
      // let ball_score = nnn ? Math.max(nnn.split('-')[0], nnn.split('-')[1]) + 0.5: 0.5;
      //规则又改了，全场是主客队分数相加再加0.5， 非全场是主客队对应得分数加0.5，这里有三种情况，全场， 主队和客队
      let arr = ref_data.timerly_basic_score.split('-');
      if (MARKET_BIG_SMALL_PLAY_LIST.includes(props.item.playId)) {
        ref_data.ball_score = ref_data.timerly_basic_score ? mathJs.add(parseInt(arr[0]), parseInt(arr[1]), 0.5) : 0.5;
      } else if (MARKET_HOME_PLAY_LIST.includes(props.item.playId)) {
        ref_data.ball_score = ref_data.timerly_basic_score ? mathJs.add(parseInt(arr[0]), 0.5) : 0.5;
      } else if (MARKET_AWAY_PLAY_LIST.includes(props.item.playId)) {
        ref_data.ball_score = ref_data.timerly_basic_score ? mathJs.add(parseInt(arr[1]), 0.5) : 0.5;
      }
      //下面还有一种获取分数的渠道，那就是直接在betpreamount接口获取
      // let new_score =  lodash_.get(this.vx_get_pre_bet_list, 'currentMarket.preBetBenchmarkScore', '')
      // ref_data.ball_score = -1;
      // if(this.play_mapping.MARKET_BIG_SMALL_PLAY_LIST.includes(props.item.playId)) {
      //   ref_data.ball_score = new_score ? parseInt(new_score.split('-')[0]) +  parseInt(new_score.split('-')[1]) + 0.5: 0.5;
      // }else if(this.play_mapping.MARKET_HOME_PLAY_LIST.includes(props.item.playId)) {
      //   ref_data.ball_score = new_score ? parseInt(new_score.split('-')[0]) + 0.5: 0.5;
      // }else if(this.play_mapping.MARKET_AWAY_PLAY_LIST.includes(props.item.playId)) {
      //   ref_data.ball_score = new_score ? parseInt(new_score.split('-')[1]) + 0.5: 0.5;
      // }
      // console.error('ref_data.ball_score===', ref_data.ball_score); 

      //玩法id在MARKET_BIG_SMALL_PLAY_LIST里面的，球头下限要限制在当前进球数+0.5
      const mix_rang = -10;
      if ((MARKET_BIG_SMALL_PLAY_LIST.includes(props.item.playId) || MARKET_HOME_PLAY_LIST.includes(props.item.playId) || MARKET_AWAY_PLAY_LIST.includes(props.item.playId)) && ref_data.appoint_ball_head <= ref_data.ball_score) {
        ref_data.appoint_ball_head = ref_data.ball_score;
        console.error('ref_data.appoint_ball_head====', ref_data.appoint_ball_head);
        console.error('basic_score===', ref_data.basic_score);
        //给出弹框提示（已为最低预约盘口值，请重新调整）
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_adjust')}`)
      } else if (FOOTBALL_PLAY_LET_BALL.includes(props.item.playId)) {
        if (ref_data.appoint_ball_head <= mix_rang) {
          ref_data.appoint_ball_head = mix_rang
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_adjust')}`)
        }
      }
      else
        if (ref_data.appoint_ball_head < 0 && !FOOTBALL_PLAY_LET_BALL.includes(props.item.playId)) {
          ref_data.appoint_ball_head = 0;
        }
    } else if ('2' == props.item.sportId) {//篮球
      let mix_let = -99.5;
      let mix_small = 50.5;
      if (BASKETBALL_BY_APPOINTMENT_let.includes(props.item.playId)) {//让球
        if (ref_data.appoint_ball_head < mix_let) {
          ref_data.appoint_ball_head = mix_let
          //给出弹框提示（已为最低预约盘口值，请重新调整）
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_adjust')}`)
        }
      } else {
        if (ref_data.appoint_ball_head < mix_small) {
          ref_data.appoint_ball_head = mix_small
          //给出弹框提示（已为最低预约盘口值，请重新调整）
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('bet.bet_header_adjust')}`)
        }
      }
    }
    set_computed_appoint_ball_head()
    console.error('球头减');
    nextTick(() => {
      search_odds_value_by_ball_head();
    })
  }
}
/**
 * @description:这里是点击加减的时候，处理对应盘口搜索对应赔率逻辑
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const search_odds_value_by_ball_head = () => {

  let head = ref_data.computed_appoint_ball_head;
  let appoint_ob = lodash_.get(BetData, 'bet_appoint_obj');
  if (!appoint_ob || lodash_.isNull(appoint_ob.marketList)) return;
  let playOptionsId = '';
  let marketId = ''
  // console.error('外围数据vx_get_pre_bet_list===', list);
  // console.error('外围数据head===', head);
  //让球处理
  if (MARKET_RANG_FLAG_LIST.includes(props.item.playId)) {
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
            let ve = Number((mathJs.divide(odd_item.oddsValue, 100000)).toFixed(2));
            let vu = UserCtr.odds.cur_odds == 'HK' ? Number(mathJs.subtract(ve, 1)) : ve
            console.error('当前赔率前===', vu);
            console.error('当前盘口前===', vu);
            if (vu > ref_data.appoint_odds_value) {
              ref_data.appoint_odds_value = vu;
              console.error('当前最小值等于1', ref_data.min_odds_value);
            }
            ref_data.min_odds_value = vu;
            ref_data.appoint_odds_value = vu == 0 ? ref_data.appoint_odds_value : vu
            //设置输入框最小值
            // BetData.set_pre_min_odd_value(ref_data.min_odds_value)
            console.error('当前赔率===', ref_data.appoint_odds_value);
            console.error('当前盘口===', odd_item.playOptions);
            break;
          }
        }
      }
    }
  } else { //非让球处理
    //这里要调整下
    let dl_fillter = appoint_ob.marketList.filter(item => item.marketValue == ref_data.computed_appoint_ball_head)[0];
    //盘口id 预约需要筛选
    marketId = lodash_.get(dl_fillter, 'id', '');
    let parr = lodash_.get(dl_fillter, 'marketOddsList', []);
    let filter_arr = parr.filter(item => item.oddsType == lodash_.get(appoint_ob, 'currentMarket.marketOddsList[0].oddsType', -1));
    //投注项id 预约需要筛选
    playOptionsId = filter_arr[0] ? filter_arr[0]['id'] : '';
    if (filter_arr[0]) {
      let ve = Number((mathJs.divide(filter_arr[0].oddsValue, 100000)).toFixed(2));


      let vu = UserCtr.odds.cur_odds == 'HK' ? Number(mathJs.subtract(ve, 1)) : ve
      // console.error('当前赔率3333前===',  vu)
      // console.error('当前盘口3333前===', vu);
      if (vu > ref_data.appoint_odds_value) {
        ref_data.appoint_odds_value = vu
        // console.error('当前最小值等于2', ref_data.min_odds_value);
      }
      ref_data.min_odds_value = vu
      ref_data.appoint_odds_value = vu == 0 ? ref_data.appoint_odds_value : vu
      //设置输入框最小值
      // BetData.set_pre_min_odd_value(ref_data.min_odds_value)
      // console.error('当前赔率3333===',  ref_data.appoint_odds_value)
      // console.error('当前盘口3333===', filter_arr[0].playOptions);
    }
  }
  if (lodash_.isEmpty(playOptionsId) && lodash_.isEmpty(marketId)) {
    if (UserCtr.odds.cur_odds == 'EU') {
      ref_data.min_odds_value = 1.01
      // ref_data.appoint_odds_value  = 1.01
    } else {
      ref_data.min_odds_value = 0.01
      // ref_data.appoint_odds_value  = 0.01
    }
    //设置输入框最小值
    // BetData.set_pre_min_odd_value(ref_data.min_odds_value)
    // console.error('当前最小值等于3', ref_data.min_odds_value); 
  }
  // console.error('当前赔率等于1', ref_data.appoint_odds_value);
  // console.error('当前最小值等于4', ref_data.min_odds_value);
}

const set_computed_appoint_ball_head = () => {
  let ball_head = '';
  if (props.item.sportId == 1) {
    if (!lodash_.isNull(ref_data.appoint_ball_head)) {
      if (ref_data.appoint_ball_head % 0.5 == 0) {
        ball_head = ref_data.appoint_ball_head;
      } else {
        let unit = (ref_data.appoint_ball_head * 2 - 0.5) / 2;
        //FOOTBALL_PLAY_LET_BALL
        if (ref_data.appoint_ball_head > 0) {
          ball_head = `${unit}/${Math.abs(unit + 0.5)}`;
        } else if (unit < 0 && (unit + 0.5) >= 0) {
          ball_head = `-${unit + 0.5}/${Math.abs(unit)}`;
        } else {
          ball_head = `${unit + 0.5}/${Math.abs(unit)}`;
        }
      }
    }
    //显示球头值得玩法 中的所有让球玩法 且不是-号开头 且不等于0
    if (MARKET_RANG_FLAG_LIST.includes(props.item.playId) && !lodash_.startsWith(ball_head, '-') && ball_head != 0) {
      ball_head = '+' + ball_head
    }
  } else if (props.item.sportId == 2) {
    if (!lodash_.isNull(ref_data.appoint_ball_head)) {
      //这里判断
      // if(ref_data.appoint_ball_head < this.min_head_value){
      //   ref_data.appoint_ball_head = this.min_head_value;
      // }else
      // if(ref_data.appoint_ball_head > this.max_head_value){
      //   ref_data.appoint_ball_head = this.max_head_value;
      // }
      ball_head = ref_data.appoint_ball_head;
    }
    // if (!(tball_head_input && ball_head_input == document.activeElement)) {
    if (BASKETBALL_BY_APPOINTMENT_let.includes(props.item.playId) && !lodash_.startsWith(ball_head, '-') && !lodash_.startsWith(ball_head, '+') && ball_head != 0) {
      ball_head = '+' + ball_head
    }
    // }
  }
  ref_data.computed_appoint_ball_head = ball_head;
}
</script>

<style lang="scss" scoped>
.pre-input {
  border: 1px solid var(--q-gb-bd-c-8);
}

.m-b-8 {
  margin-bottom: 8px;
}

// .center {
//   height: 26px;
//   line-height: 23px;
// }

.bet-pre-appoint {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 34px;
  justify-content: space-between;
  position: relative;
  .cancel {
    position: absolute;
    right: 22px;
  }
}

//预约投注内容
.book-content {
  color: var(--q-gb-t-c-8);
  flex-wrap: nowrap;

  .input-number {
    display: flex;

    //预约加
    .sub-number {
      font-size: 16px;
      color: var(--q-gb-t-c-1);
      text-align: center;
      width: 24px;
      height: 24px;
      line-height: 26px;
      margin-left: 6px;
      background: var(--q-gb-bg-c-1);
      // border: 0.5px solid var(--q-gb-bd-c-7);
      border-radius: 4px 0px 0px 4px;
    }

    //预约投注输入框样式
    input {
      color: var(--q-gb-t-c-5);
      border-radius: 0;
      background-color: var(--q-gb-bg-c-21);
      // border: 0.5px solid var(--q-gb-bd-c-7);
      border-left: 0;
      border-right: 0;
      width: 74px;
      height: 24px;
      text-align: center;
      outline: none;
      font-weight: bold;
    }

    //预约减
    .add-number {
      font-size: 16px;
      color: var(--q-gb-t-c-1);
      text-align: center;
      width: 24px;
      height: 24px;
      line-height: 24px;
      background: var(--q-gb-bg-c-1);
      // border: 0.5px solid var(--q-gb-bd-c-7);
      border-radius: 0px 2px 2px 0px;
      cursor: pointer;
    }
  }

  //预约删除图标样式
  .icon-delete {
    margin-top: 5px;
    color: #999999;
  }
}
</style>