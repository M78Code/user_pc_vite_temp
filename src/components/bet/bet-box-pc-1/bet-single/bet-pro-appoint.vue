<template>
  <div>
    <div class="row yb-flex-center book-content">
      <!--预-->
      <div class="col-2">{{ $t('bet.bet_dish') }}</div>
      <!--此处为盘口区域，-->
      <div class="col-9 input-number">
        <!-- 盘口减- -->
        <div @click="sub_handle('ball_head')" class="sub-number" :class="{ 'disabled': head_sub_style }">-</div>
        <input v-model="computed_appoint_ball_head" v-if="item.sportId == 1" readonly>
        <input ref="ball-head-input" v-model="computed_appoint_ball_head" @blur="appoint_odds_head_handle"
          v-if="item.sportId == 2">
        <!-- 盘口加+-->
        <div class="add-number" :class="{ 'disabled': head_add_style }" @click="add_handle('ball_head')">+</div>
      </div>
      <!--取消-->
      <div class="col-1" @click="cancel_operate">
        <icon name="icon-delete" size="13px" />
      </div>
    </div>
    <div class="row yb-flex-center book-content">
      <div class="col-2 mt5">{{ $t('bet.bet_odds') }}</div>
      <!--减号 赔率输入框 加号-->
      <div class="col-9 input-number mt5">
        <div @click="sub_handle('odds_value')" class="sub-number"
          :class="{ 'disabled': ref_data.min_odds_value == ref_data.appoint_odds_value }">-</div>

        <bet-input :item="item" />

        <div class="add-number" :class="{ 'disabled': ref_data.appoint_odds_value >= 355 }"
          @click="add_handle('odds_value')">+</div>
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import { i18n_t } from "src/boot/i18n.js"
import { FOOTBALL_PLAY_LET_BALL, MARKET_BIG_SMALL_PLAY_LIST, MARKET_RANG_FLAG_LIST, MARKET_HOME_PLAY_LIST, MARKET_AWAY_PLAY_LIST, BASKETBALL_BY_APPOINTMENT_let, BASKETBALL_BY_APPOINTMENT_total } from "src/core/constant/config/play-mapping.js";

import BetInput from "./bet-input.vue"

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
  ball_score: -1, // 球分
  min_head_value: 0, //最下盘口值
  max_head_value: 0, //最大盘口值
})

const ball_head_input = ref('ball-head-input')


const cancel_operate = () => {

}

const computed_appoint_ball_head = computed(() => {
  let ball_head = '';
  if (rops.item.sportId == 1) {
    if (!_.isNull(ref_data.appoint_ball_head)) {
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
    if (MARKET_RANG_FLAG_LIST.includes(props.item.playId) && !_.startsWith(ball_head, '-') && ball_head != 0) {
      ball_head = '+' + ball_head
    }
  } else if (rops.item.sportId == 2) {
    if (!_.isNull(ref_data.appoint_ball_head)) {
      //这里判断
      // if(ref_data.appoint_ball_head < this.min_head_value){
      //   ref_data.appoint_ball_head = this.min_head_value;
      // }else
      // if(ref_data.appoint_ball_head > this.max_head_value){
      //   ref_data.appoint_ball_head = this.max_head_value;
      // }
      ball_head = ref_data.appoint_ball_head;
    }
    if (!(tball_head_input && ball_head_input == document.activeElement)) {
      if (BASKETBALL_BY_APPOINTMENT_let.includes(props.item.playId) && !_.startsWith(ball_head, '-') && !_.startsWith(ball_head, '+') && ball_head != 0) {
        ball_head = '+' + ball_head
      }
    }
  }
  return ball_head;
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
  if ('1' == props.item.sportId) {
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
    if (BASKETBALL_BY_APPOINTMENT_let.includes(props.item.playId)) {//让球
      if (ref_data.appoint_ball_head >= 99.5) {
        sty = true;
      }
    } else if (BASKETBALL_BY_APPOINTMENT_total.includes(props.item.playId)) {//大小
      if (ref_data.appoint_ball_head >= 400.5) {
        sty = true;
      }
    }
  }
  return sty;
})


const appoint_odds_head_handle = (event) => {
  let new_value = Number(event.target.value);
  if (_.isNaN(new_value)) {
    return;
  }
  if (_.startsWith(new_value, "+")) {
    new_value = new_value.slice(1);
  }
  ref_data.appoint_ball_head = Number(event.target.value) ? Number(event.target.value).toFixed(1) : Number(event.target.value);
  if (new_value > ref_data.max_head_value) {
    ref_data.appoint_ball_head = ref_data.max_head_value
    if (_.isNaN(ref_data.appoint_odds_value)) {
      ref_data.appoint_odds_value = max_head_value //预约赔率可输入最大值
    }
  }
  if (new_value < ref_data.min_head_value) {
    ref_data.appoint_ball_head = ref_data.min_head_value
    if (_.isNaN(ref_data.appoint_odds_value)) {
      ref_data.appoint_odds_value = min_head_value //预约赔率可输入最大值
    }
  }
}

/**
    * @description:输入的预约赔率
    * @param {*} event 
    * @return {undefined} undefined
    */
const appoint_odds_value_handle = (event) => {
  this.appoint_odds_value = Number(event.target.value);
  if (_.isNaN(this.appoint_odds_value)) {
    this.appoint_odds_value = 355.00 //预约赔率可输入最大值
  }
  if (Number(event.target.value) < this.min_odds_value) {
    this.pre_min_odds_value = this.min_odds_value;
    this.min_odds_value = -1000;//这里输入的值如果小于最小值的话，给个很小的值，目的不让当前输入值变成最小值
  }
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
    let aov = this.appoint_odds_value;
    this.appoint_odds_value = aov + 0.01;
    //获取当前需要添加焦点的输入框，如果存在输入框，则获取焦点
    let input = index == 0 ? this.$refs.currency_input_single.$el : this.$refs.currency_input.$el
    if (input) input.focus();
  }
  //球头加
  if (type == 'ball_head') {
    let step = this.sport_id == '1' ? 0.25 : 0.5;
    let new_num = this.appoint_ball_head * 1;
    this.appoint_ball_head = new_num + step;
    console.log('球头加', this.appoint_ball_head);
    const max_rang = 10;
    const max_big = 30;
    //足球
    if ('1' == this.sport_id) {
      if (play_mapping.MARKET_RANG_FLAG_LIST.includes(this.play_id)) {//让球
        if (this.appoint_ball_head >= max_rang) {
          this.appoint_ball_head = max_rang
          //给出弹框提示（已为最高预约盘口值，请重新调整）
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('bet.bet_header_hight_adjust')}`);
        }
      } else {//大小球
        if (this.appoint_ball_head >= max_big) {
          this.appoint_ball_head = max_big
          //给出弹框提示（已为最高预约盘口值，请重新调整）
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('bet.bet_header_hight_adjust')}`);//
        }
      }
      //篮球
    } else if ('2' == this.sport_id) {
      let max_let = 99.5;
      let max_small = 400.5;
      if (play_mapping.BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id)) {//让球
        if (this.appoint_ball_head >= max_let) {
          this.appoint_ball_head = max_let
          //给出弹框提示（已为最高预约盘口值，请重新调整）
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('bet.bet_header_hight_adjust')}`);
        }
      } else {
        if (this.appoint_ball_head >= max_small) {
          this.appoint_ball_head = max_small
          //给出弹框提示（已为最高预约盘口值，请重新调整）
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('bet.bet_header_hight_adjust')}`);
        }
      }
    }
    this.$nextTick(() => {
      this.search_odds_value_by_ball_head();
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
  if (this.min_odds_value == -1000) {
    this.min_odds_value = this.pre_min_odds_value;
  }
  // if(type == 'odds_value' && this.appoint_odds_value > this.min_odds_value) {
  //   let aov = this.appoint_odds_value;
  //   this.appoint_odds_value = aov - 0.01;
  //   // this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_RECALL_MONEY_CMD, this.id);
  // }
  if (type == 'odds_value') {
    if (this.appoint_odds_value > this.min_odds_value) {
      let aov = this.appoint_odds_value;
      this.appoint_odds_value = aov - 0.01;
      let input = index == 0 ? this.$refs.currency_input_single.$el : this.$refs.currency_input.$el
      if (input) input.focus();
    } else {
      //给出弹框提示（已为最低预约盘口值，请重新调整）
      this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('error_msg_info.0400540.client_msg1')}`);
    }
  }
  // this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_RECALL_MONEY_CMD, this.id);
  if (type == 'ball_head') {
    let new_num = this.appoint_ball_head;
    let step = this.sport_id == 1 ? 0.25 : 0.5;
    this.appoint_ball_head = new_num - step;
    console.log('market_type===', this.market_type);
    console.log('basic_score===', this.basic_score);
    console.log('timerly_basic_score===', this.timerly_basic_score);
    if ('1' == this.sport_id) { //足球
      // let nnn = '2-3'
      // let ball_score = nnn ? Math.max(nnn.split('-')[0], nnn.split('-')[1]) + 0.5: 0.5;
      //规则又改了，全场是主客队分数相加再加0.5， 非全场是主客队对应得分数加0.5，这里有三种情况，全场， 主队和客队
      let arr = this.timerly_basic_score.split('-');
      if (this.play_mapping.MARKET_BIG_SMALL_PLAY_LIST.includes(this.play_id)) {
        this.ball_score = this.timerly_basic_score ? parseInt(arr[0]) + parseInt(arr[1]) + 0.5 : 0.5;
      } else if (this.play_mapping.MARKET_HOME_PLAY_LIST.includes(this.play_id)) {
        this.ball_score = this.timerly_basic_score ? parseInt(arr[0]) + 0.5 : 0.5;
      } else if (this.play_mapping.MARKET_AWAY_PLAY_LIST.includes(this.play_id)) {
        this.ball_score = this.timerly_basic_score ? parseInt(arr[1]) + 0.5 : 0.5;
      }
      //下面还有一种获取分数的渠道，那就是直接在betpreamount接口获取
      // let new_score =  _.get(this.vx_get_pre_bet_list, 'currentMarket.preBetBenchmarkScore', '')
      // this.ball_score = -1;
      // if(this.play_mapping.MARKET_BIG_SMALL_PLAY_LIST.includes(this.play_id)) {
      //   this.ball_score = new_score ? parseInt(new_score.split('-')[0]) +  parseInt(new_score.split('-')[1]) + 0.5: 0.5;
      // }else if(this.play_mapping.MARKET_HOME_PLAY_LIST.includes(this.play_id)) {
      //   this.ball_score = new_score ? parseInt(new_score.split('-')[0]) + 0.5: 0.5;
      // }else if(this.play_mapping.MARKET_AWAY_PLAY_LIST.includes(this.play_id)) {
      //   this.ball_score = new_score ? parseInt(new_score.split('-')[1]) + 0.5: 0.5;
      // }
      // console.log('this.ball_score===', this.ball_score); 

      //玩法id在MARKET_BIG_SMALL_PLAY_LIST里面的，球头下限要限制在当前进球数+0.5
      const mix_rang = -10;
      if ((this.play_mapping.MARKET_BIG_SMALL_PLAY_LIST.includes(this.play_id) || this.play_mapping.MARKET_HOME_PLAY_LIST.includes(this.play_id) || this.play_mapping.MARKET_AWAY_PLAY_LIST.includes(this.play_id)) && this.appoint_ball_head <= this.ball_score) {
        this.appoint_ball_head = this.ball_score;
        console.log('this.appoint_ball_head====', this.appoint_ball_head);
        console.log('basic_score===', this.basic_score);
        //给出弹框提示（已为最低预约盘口值，请重新调整）
        this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('bet.bet_header_adjust')}`);
      } else if (this.play_mapping.FOOTBALL_PLAY_LET_BALL.includes(this.play_id)) {
        if (this.appoint_ball_head <= mix_rang) {
          this.appoint_ball_head = mix_rang
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('bet.bet_header_adjust')}`);
        }
      }
      else
        if (this.appoint_ball_head < 0 && !this.play_mapping.FOOTBALL_PLAY_LET_BALL.includes(this.play_id)) {
          this.appoint_ball_head = 0;
        }
    } else if ('2' == this.sport_id) {//篮球
      let mix_let = -99.5;
      let mix_small = 50.5;
      if (play_mapping.BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id)) {//让球
        if (this.appoint_ball_head < mix_let) {
          this.appoint_ball_head = mix_let
          //给出弹框提示（已为最低预约盘口值，请重新调整）
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('bet.bet_header_adjust')}`);
        }
      } else {
        if (this.appoint_ball_head < mix_small) {
          this.appoint_ball_head = mix_small
          //给出弹框提示（已为最低预约盘口值，请重新调整）
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, `${this.$root.$t('bet.bet_header_adjust')}`);//
        }
      }
    }
    console.log('球头减');
    this.$nextTick(() => {
      this.search_odds_value_by_ball_head();
    })
  }
}
/**
 * @description:这里是点击加减的时候，处理对应盘口搜索对应赔率逻辑
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const search_odds_value_by_ball_head = () => {
  let head = this.vx_get_bet_appoint_obj.computed_appoint_ball_head;
  let list = this.vx_get_pre_bet_list;
  if (!list || _.isNull(list.marketList)) return;
  let playOptionsId = '';
  let marketId = ''
  // console.log('外围数据vx_get_pre_bet_list===', list);
  // console.log('外围数据head===', head);
  //让球处理
  if (play_mapping.MARKET_RANG_FLAG_LIST.includes(this.play_id)) {
    let cur_i = -1;
    let ml_len = list.marketList.length;
    for (let i = 0; i < ml_len; i++) {
      let ml_item = list.marketList[i];
      let odd_len = ml_item.marketOddsList.length;
      for (let j = 0; j < odd_len; j++) {
        let odd_item = ml_item.marketOddsList[j];
        if (_.get(list, 'currentMarket.marketOddsList[0].oddsType', -1) == odd_item.oddsType && odd_item.playOptions == head) {
          playOptionsId = odd_item.id; //投注项id
          cur_i = i;
          if (odd_item) {
            let ve = Number((this.$mathjs.divide(odd_item.oddsValue, 100000)).toFixed(2));
            let vu = this.cur_odd == 'HK' ? Number(this.$mathjs.subtract(ve, 1)) : ve
            console.log('当前赔率前===', vu);
            console.log('当前盘口前===', vu);
            if (vu > this.appoint_odds_value) {
              this.appoint_odds_value = vu;
              console.log('当前最小值等于1', this.min_odds_value);
            }
            this.min_odds_value = vu;
            //设置输入框最小值
            this.vx_set_pre_min_odd_value(this.min_odds_value)
            console.log('当前赔率===', this.appoint_odds_value);
            console.log('当前盘口===', odd_item.playOptions);
            break;
          }
        }
      }
    }
  } else { //非让球处理
    //这里要调整下
    let dl_fillter = list.marketList.filter(item => item.marketValue == this.vx_get_bet_appoint_obj.computed_appoint_ball_head)[0];
    //盘口id 预约需要筛选
    marketId = _.get(dl_fillter, 'id', '');
    let parr = _.get(dl_fillter, 'marketOddsList', []);
    let filter_arr = parr.filter(item => item.oddsType == _.get(list, 'currentMarket.marketOddsList[0].oddsType', -1));
    //投注项id 预约需要筛选
    playOptionsId = filter_arr[0] ? filter_arr[0]['id'] : '';
    if (filter_arr[0]) {
      let ve = Number((this.$mathjs.divide(filter_arr[0].oddsValue, 100000)).toFixed(2));


      let vu = this.cur_odd == 'HK' ? Number(this.$mathjs.subtract(ve, 1)) : ve
      // console.log('当前赔率3333前===',  vu)
      // console.log('当前盘口3333前===', vu);
      if (vu > this.appoint_odds_value) {
        this.appoint_odds_value = vu
        // console.log('当前最小值等于2', this.min_odds_value);
      }
      this.min_odds_value = vu
      //设置输入框最小值
      this.vx_set_pre_min_odd_value(this.min_odds_value)
      // console.log('当前赔率3333===',  this.appoint_odds_value)
      // console.log('当前盘口3333===', filter_arr[0].playOptions);
    }
  }
  if (_.isEmpty(playOptionsId) && _.isEmpty(marketId)) {
    if (this.cur_odd == 'EU') {
      this.min_odds_value = 1.01
      // this.appoint_odds_value  = 1.01
    } else {
      this.min_odds_value = 0.01
      // this.appoint_odds_value  = 0.01
    }
    //设置输入框最小值
    this.vx_set_pre_min_odd_value(this.min_odds_value)
    // console.log('当前最小值等于3', this.min_odds_value); 
  }
  // console.log('当前赔率等于1', this.appoint_odds_value);
  // console.log('当前最小值等于4', this.min_odds_value);
}
</script>