<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="keyboard" :class="{'is_max_money':is_max_money}" @click.stop="_handleKeyPress($event)" style="opacity: 1;" @touchmove.prevent>
    <div v-show="false"> {{ UserCtr.user_version }}
      {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version }}</div>
    <div class="key-row row">
      <div class="key-cell" :class="{'disable': is_pre_disable()}" data-num="qon">
        <span>+</span>{{BetData.user_max_min_money.qon}}
      </div>
      <div class="key-cell" data-num="1">1</div>
      <div class="key-cell" data-num="2">2</div>
      <div class="key-cell" data-num="3">3</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" :class="{'disable': is_pre_disable()}" data-num="qtw">
        <span>+</span>{{BetData.user_max_min_money.qtw}}
      </div>
      <div class="key-cell" data-num="4">4</div>
      <div class="key-cell" data-num="5">5</div>
      <div class="key-cell" data-num="6">6</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" :class="{'disable': is_pre_disable()}" data-num="qth">
        <span>+</span>{{BetData.user_max_min_money.qth}}
      </div>
      <div class="key-cell" data-num="7">7</div>
      <div class="key-cell" data-num="8">8</div>
      <div class="key-cell" data-num="9">9</div>
    </div>
    <div class="key-row row">
      <div class="key-cell max_text" :class="{'disable': is_pre_disable()}" data-num="max">
        MAX
      </div>
      <div class="key-cell" data-num=".">.</div>
      <div class="key-cell" data-num="0">0</div>
      <div class="key-cell del-key" data-num="x">
        <img :src="compute_local_project_file_path('/image/svg/jianpan_del_1.svg')" alt="" data-num="x">
        <!-- <span class="icon-delete"></span> -->
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, reactive, onMounted, watch, computed } from 'vue';
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { UserCtr, compute_local_project_file_path } from "src/output/index.js";
import { btn_reduce, btn_add, ref_pre_book,add_handle,sub_handle,set_ref_data, computed_keyboard_odds, computed_keyboard_handicap } from "src/core/bet/common/appoint-data.js"
import lodash_ from 'lodash'


const active_index = ref(BetData.active_index)
const money = ref('') //用户输入金额
const delete_all = ref(false) //键盘出现时，第一次按删除键把金额一次删完
const pre_odds_value = ref("") //预约输入赔率或者盘口
const is_max_money = ref(false) //是否达到最大最大金额值

const ref_data = reactive({
  DOM_ID_SHOW: false,
  active: 1,    //投注项状态
  min_money: 10, // 最小投注金额
  max_money: 8888, // 最大投注金额
  keyborard: true, // 是否显示 最高可赢 和 键盘
  add_num: {},
})

onMounted(()=>{
  BetData.set_user_max_min_money()
})


// 预约输入赔率或者盘口
// watch(() => pre_odds_value, (new_) => {
//   if (active_index.toString().indexOf('market') > -1) {  // 篮球才可以用键盘输入预约盘口
//     try {
//       pre_odds_value.value = pre_odds_value.value + ''
//       if (pre_odds_value.value.indexOf(".") > -1 && pre_odds_value.value.split('.')[1]) {//篮球盘口小数点后面必须是5的倍数，如果非5的倍数，四舍五入
//         let pointAfterValue = pre_odds_value.value.split('.')[1].substr(0, 1)
//         if (pointAfterValue <= 5) {
//           pre_odds_value.value = pre_odds_value.value.split('.')[0] + '.5'
//         } else {
//           pre_odds_value.value = Number(pre_odds_value.value.split('.')[0]) + 1 + ''
//         }
//       }
//       let index = active_index.toString().split('market')[1]
//       let value_show = view_ctr_obj[BetData.bet_list[index]].bs
//       const isdaxiao = ['Over', 'Under'].includes(lodash.get(value_show, 'hps[0].hl[0].ol[0].ot'));
//       if (isdaxiao) {
//         if (+pre_odds_value.value > 400) {
//           pre_odds_value.value = '400'
//         }
//       } else {
//         if (+pre_odds_value.value < -99.5) {
//           pre_odds_value.value = '-99.5'
//         } else if (+pre_odds_value.value > 99.5) {
//           pre_odds_value.value = '+99.5'
//         }
//       }
//       useMittEmit(MITT_TYPES.EMIT_CHANGE_MARKET, pre_odds_value.value);
//     } catch (error) {
//       console.error(error)
//     }
//   } else {
//     if (new_ > 355) {
//       pre_odds_value.value = '355'
//     } else {
//       useMittEmit(MITT_TYPES.EMIT_CHANGE_ODDS, pre_odds_value.value);
//     }
//   }
// })

// watch(() => money.value, (new_) => {
//   let emit_name = 'EMIT_INPUT_BET_MONEY'
//   if(BetData.is_bet_single){
//     emit_name = 'EMIT_INPUT_BET_MONEY_SINGLE'
//   }
//   useMittEmit(MITT_TYPES[emit_name],{ params:BetData.bet_keyboard_config, money: new_ })
// })

watch(() => active_index, (new_) => {
  if (money.value) delete_all.value = true;
})

// 点击键盘
const _handleKeyPress = (e) => {
  e.preventDefault();
  if (e.target.className.includes("shadow-show")) { return }; // 置灰的按钮不能再点击
  let num = e.target.dataset.num;
  switch (num) {
    //最大值
    case "max":
      _handmaxKey();
      break;
    //小数点
    case ".":
      _handleDecimalPoint(e);
      break;
    //删除键
    case "x":
      _handleDeleteKey(e);
      break;
    //收起键
    case "shouqi":
      _handleConfirmKey();
      break;
    // 数字键
    default:
      _handleNumberKey(num);
      break;
  }
  let emit_name = 'EMIT_INPUT_BET_MONEY'
  if(BetData.is_bet_single){
    if (BetData.is_bet_merge) {
      if(BetData.bet_keyboard_config.merge || BetData.active_index == BetData.bet_single_list.length){
        emit_name = 'EMIT_INPUT_BET_MONEY_MERGE'
      }else{
        emit_name = 'EMIT_INPUT_BET_MONEY_SINGLE'
      }
    } else {
      emit_name = 'EMIT_INPUT_BET_MONEY_SINGLE'
    }
  }
  useMittEmit(MITT_TYPES[emit_name], { params:BetData.bet_keyboard_config, money:money.value } )

//是否为最大金额 判断最大值和限额
  if (money.value == BetData.bet_keyboard_config.max_money || money.value == UserCtr.balance){
    is_max_money.value = true
  }else {
    is_max_money.value = false
  }
}

// 小数点 .
const _handleDecimalPoint = () => {
  // 此处为预约盘口 赔率相关输入
  if (typeof BetData.active_index === 'string') {

    if (BetData.is_bet_pre && BetData.active_index.includes('odds') || BetData.active_index.includes('handicap')) {

      if(BetData.active_index.includes('odds')) {
        let odds = ref_pre_book.appoint_odds_value.toString()
        if (odds && odds.includes(".")) return
        odds = !odds ? '0.' : odds + '.'
        ref_pre_book.appoint_odds_value = odds
      } else {
        let ball = ref_pre_book.appoint_ball_value.toString()
        if (ball && ball.includes(".")) return
        ball = !ball ? '0.' : ball + '.'
        ref_pre_book.appoint_ball_value = ball
      }
      return
    }
    return
  }

  //超过最大金额  显示最大金额 
  let max_money = BetData.bet_keyboard_config.max_money
  let money_ = BetData.bet_amount.toString()

  //超过最大金额时不让输入
  if (money_ && money_*1 >= max_money*1) return
  //如果包含小数点，直接返回
  if (money_ && money_.includes(".")) return

  //如果小数点是第一位，补0
  if (!money_) {
    money_ = "0.";
  } else {
    //如果不是，添加一个小数点
    money_ = money_ + ".";
  }
  money.value = money_
  BetData.set_bet_amount(money_)
}

// MAX键
const _handmaxKey = () => {

  money.value = lodash_.get(BetData.bet_keyboard_config,`max_money`,8888) 

  // 这个有问题 用户没有余额的情况下 键盘不能使用 我们要让他可以使用 只是点投注的时候提示他 余额不足
  //超过用户余额显示用户余额
  if (money.value > UserCtr.balance){
    money.value = UserCtr.balance
  }

  BetData.set_bet_amount(money.value)
}
// 删除键
const _handleDeleteKey = () => {
  // console.error('asdas')
  // 此处为预约盘口 赔率相关输入
  if (typeof BetData.active_index === 'string') {

    if (BetData.is_bet_pre && BetData.active_index.includes('odds') || BetData.active_index.includes('handicap')) {
      // debugger
      if (ref_pre_book.appoint_ball_value == '-' || ref_pre_book.appoint_ball_value == '+') return

      if(BetData.active_index.includes('odds')) {
        let odds = ref_pre_book.appoint_odds_value.toString()
        odds = odds ? odds.substring(0, odds.length - 1) : ""
        ref_pre_book.appoint_odds_value = odds ? odds*1 : ""
        computed_keyboard_odds(odds)
      } else {
        let ball = ref_pre_book.appoint_ball_value.toString()
        ball = ball ? ball.substring(0, ball.length - 1) : ""
        // 判断是否有正负号 如有有保留
        if (ball == '-' || ball == '+') {
          ref_pre_book.appoint_ball_value = ball
          computed_keyboard_handicap(ball)
          return
        }
        ref_pre_book.appoint_ball_value = ball ? ball : 0
        computed_keyboard_handicap(ball)
      }
      return
    }
    return
  }

  let money_ = BetData.bet_amount.toString()
  if (!money_) return   
  //删除最后一个
  let s = money_
  console.log('=================================_handleDeleteKey================================', s)
  money.value = s.substring(0, s.length - 1);
  BetData.set_bet_amount(money.value*1)
}

// 数字建
const _handleNumberKey = (num) => {
  // console.error('ss数字建s')
  if (!num) return
  if (typeof BetData.active_index === 'string') {
    // 此处为预约盘口 赔率相关输入
    if(BetData.is_bet_pre && BetData.active_index.includes('odds') || BetData.active_index.includes('handicap')) {

      if(BetData.active_index.includes('odds')) {
        let odds = !ref_pre_book.appoint_odds_value ? (num === '0' ? '0.' : num) : ref_pre_book.appoint_odds_value + num
        let s_length = odds.substring(odds.indexOf(".") + 1).length // 0. 后面输入的字符长度  最多只保留两位
        if (odds.includes(".") && s_length > 1) {
          odds = odds.substring(0, odds.indexOf(".") + 3);// 最多只保留小数点两位
        }
        computed_keyboard_odds(odds)
        // ref_pre_book.appoint_odds_value = 
      } else {
        let ball = !ref_pre_book.appoint_ball_value ? (num === '0' ? '0.' : num) : ref_pre_book.appoint_ball_value + num
        let s_length = ball.substring(ball.indexOf(".") + 1).length // 0. 后面输入的字符长度  最多只保留两位
        if (ball.includes(".") && s_length > 1) {
          ball = ball.substring(0, ball.indexOf(".") + 3);// 最多只保留小数点两位
        }
        computed_keyboard_handicap(ball)
        // ref_pre_book.appoint_ball_value = ball*1
      }
      return
    }
    return
  }


  let money_ = BetData.bet_amount || 0
  if (['qon', 'qtw', 'qth','qfo','qfi'].includes(num)) {
    if (!money_) {
      money_ = BetData.user_max_min_money[num]
    } else {
      money_ = (+money_ + BetData.user_max_min_money[num]).toString();
    }
  } else {
    if (!money_) { // 输入第一位
      money_ = num === '0' ? '0.' : num // 第一位输入0 则显示0.  其他的正常显示
    } else {
      money_ = money_ + num
    }
    let sum = money_
    let s_length = sum.substring(sum.indexOf(".") + 1).length // 0. 后面输入的字符长度  最多只保留两位
    if (sum.includes(".") && s_length > 1) {
      money_ = sum.substring(0, sum.indexOf(".") + 3);// 最多只保留小数点两位
    }
  }

  //超过最大金额  显示最大金额
  let ol_id = ''
  let ol_type = ''
  if(BetData.is_bet_single){
    ol_type = 'playOptionsId'
  }else{
    ol_type = 'id'
  }
  ol_id = lodash_.get(BetData.bet_keyboard_config,ol_type)
  // let max_money = lodash_.get(BetViewDataClass,'bet_min_max_money[ol_id].max_money')
  let max_money = lodash_.get(BetData.bet_keyboard_config,`max_money`,8888)
  // 显示最大金额
  if (money_ && +money_ >= +max_money) {
    money_ = max_money
  }
  //超过用户余额显示用户余额 
  // 这个有问题 用户没有余额的情况下 键盘不能使用 我们要让他可以使用 只是点投注的时候提示他 余额不足
  if( UserCtr.balance != 0 ){
    if (money_ > UserCtr.balance){
      money_ = UserCtr.balance
    }
  }
  money.value = money_
  BetData.set_bet_amount(money_)
}

const is_pre_disable = computed(() => state => {
  if (BetData.is_bet_pre) {
    if (typeof BetData.active_index === 'string') {
      return true
    } else {
      return false
    }
  }
  return false
})


</script>

<style lang="scss" scoped>
.key-row{
  height: 0.46rem;
  -border-bottom: .01rem solid var(--q-gb-bd-c-1);
}
.key-cell{
  border-right: .01rem solid var(--q-gb-bd-c-1);
}
.keyboard {
  height: 1.85rem;
  -webkit-overflow-scrolling: touch;
  font-size: 0.16rem;
  font-weight: 600;
  color: var(--q-gb-bg-c-13);
  font-family: "DIN";
  border-bottom: .01rem solid var(--q-gb-bd-c-1);
}
.key-cell {
  flex: 1;
  box-sizing: border-box;
  line-height: .46rem;
  text-align: center;
  background: var(--q-bg-c-2);
  font-size: .22rem;
  font-weight: 500;
  border-top: 1px solid var(--q-gb-bd-c-1);
  &.disable {
    background: var(--q-gb-bg-c-10);
    pointer-events: none;
    color: var(--q-gb-t-c-9) !important;

  }
}
.key-cell {
  &:first-child { // 左侧第一排MAX的样式
    background: var(--q-gb-bg-c-10);
    color: var(--q-gb-t-c-4);
    font-size: .2rem;
  }
  &:last-child {
    margin-right: 0;
  }
  &.shadow-show {
    color: #595959!important;
  }
}
.is_max_money{
  .key-cell {
  &:first-child { // 左侧第一排MAX的样式
    color: var(--q-gb-bg-c-33);
    }
  }
  .max_text{// max样式
    color: var(--q-gb-t-c-4) !important;
  }
}
</style>