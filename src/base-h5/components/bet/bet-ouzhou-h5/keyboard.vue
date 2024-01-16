<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="keyboard" @click.stop="_handleKeyPress($event)" style="opacity: 1;" @touchmove.prevent>
    <div v-show="false"> {{ UserCtr.user_version }} --
      {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version }}</div>
    <div class="key-row row">
      <div class="key-cell" data-num="qon">
        <span>+</span>{{addnum.qon}}
      </div>
      <div class="key-cell" data-num="1">1</div>
      <div class="key-cell" data-num="2">2</div>
      <div class="key-cell" data-num="3">3</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" data-num="qtw">
        <span>+</span>{{addnum.qtw}}
      </div>
      <div class="key-cell" data-num="4">4</div>
      <div class="key-cell" data-num="5">5</div>
      <div class="key-cell" data-num="6">6</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" data-num="qth">
        <span>+</span>{{addnum.qth}}
      </div>
      <div class="key-cell" data-num="7">7</div>
      <div class="key-cell" data-num="8">8</div>
      <div class="key-cell" data-num="9">9</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" data-num="max">
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

import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue';
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { UserCtr, compute_local_project_file_path, i18n_t } from "src/output/index.js";
import lodash_ from 'lodash'
import userData from "src/core/user-config/user-ctr.js"


const active_index = ref(BetData.active_index)
const money = ref('') //用户输入金额
const delete_all = ref(false) //键盘出现时，第一次按删除键把金额一次删完
const max_money = ref()   //最大可投注的金额
const pre_odds_value = ref("") //预约输入赔率或者盘口

const ref_data = reactive({
  DOM_ID_SHOW: false,
  active: 1,    //投注项状态
  min_money: 10, // 最小投注金额
  max_money: 8888, // 最大投注金额
  keyborard: true, // 是否显示 最高可赢 和 键盘
  add_num: {},
})

const shou = (item,evnet) => {
  // event.preventDefault()
  // BetData.set_bet_keyboard_config(item)
  BetData.set_bet_keyboard_show(false)
}

// 预约输入赔率或者盘口
watch(() => pre_odds_value, (new_) => {
  if (active_index.toString().indexOf('market') > -1) {  // 篮球才可以用键盘输入预约盘口
    try {
      pre_odds_value.value = pre_odds_value.value + ''
      if (pre_odds_value.value.indexOf(".") > -1 && pre_odds_value.value.split('.')[1]) {//篮球盘口小数点后面必须是5的倍数，如果非5的倍数，四舍五入
        let pointAfterValue = pre_odds_value.value.split('.')[1].substr(0, 1)
        if (pointAfterValue <= 5) {
          pre_odds_value.value = pre_odds_value.value.split('.')[0] + '.5'
        } else {
          pre_odds_value.value = Number(pre_odds_value.value.split('.')[0]) + 1 + ''
        }
      }
      let index = active_index.toString().split('market')[1]
      let value_show = view_ctr_obj[BetData.bet_list[index]].bs
      const isdaxiao = ['Over', 'Under'].includes(lodash.get(value_show, 'hps[0].hl[0].ol[0].ot'));
      if (isdaxiao) {
        if (+pre_odds_value.value > 400) {
          pre_odds_value.value = '400'
        }
      } else {
        if (+pre_odds_value.value < -99.5) {
          pre_odds_value.value = '-99.5'
        } else if (+pre_odds_value.value > 99.5) {
          pre_odds_value.value = '+99.5'
        }
      }
      useMittEmit(MITT_TYPES.EMIT_CHANGE_MARKET, pre_odds_value.value);
    } catch (error) {
      console.error(error)
    }
  } else {
    if (new_ > 355) {
      pre_odds_value.value = '355'
    } else {
      useMittEmit(MITT_TYPES.EMIT_CHANGE_ODDS, pre_odds_value.value);
    }
  }
})

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
  console.error('active_index', active_index)
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
      if (BetData.bet_keyboard_config.playOptionsId) {
        emit_name = 'EMIT_INPUT_BET_MONEY_SINGLE'
      } else {
        emit_name = 'EMIT_INPUT_BET_MONEY_MERGE'
      }
    } else {
      emit_name = 'EMIT_INPUT_BET_MONEY_SINGLE'
    }
  }
  useMittEmit(MITT_TYPES[emit_name], { params:BetData.bet_keyboard_config, money:money.value*1 } )
}

// 小数点 .
const _handleDecimalPoint = () => {   
  //超过最大金额  显示最大金额 
  let old = BetData.bet_keyboard_config.playOptionsId
  let max_money = BetViewDataClass.bet_min_max_money[old].max_money
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
  let ol_id = BetData.bet_keyboard_config.playOptionsId
  money.value = lodash_.get(BetViewDataClass.bet_min_max_money,`${ol_id}.max_money`,8888) 

  // 这个有问题 用户没有余额的情况下 键盘不能使用 我们要让他可以使用 只是点投注的时候提示他 余额不足
  //超过用户余额显示用户余额
  if (money.value > UserCtr.balance){
    money.value = UserCtr.balance
  }

  BetData.set_bet_amount(money.value)
}
// 删除键
const _handleDeleteKey = () => {
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
  
  if (!num) return
  let money_ = BetData.bet_amount
  if (['qon', 'qtw', 'qth','qfo','qfi'].includes(num)) {
    if (!money_) {
      money_ = ref_data.add_num[num]
    } else {
      money_ = (+money_ + ref_data.add_num[num]).toString();
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
  let max_money = lodash_.get(BetViewDataClass.bet_min_max_money,`${ol_id}.max_money`,8888)
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

// 获取商户配置的 快捷金额
const addnum = computed(() => {
  if (BetData.bet_is_single) {
    ref_data.add_num = lodash.get(UserCtr, 'cvo.series', { qon: 10, qtw: 50, qth: 100, qfo: 200, qfi: 500 })
    return ref_data.add_num
  } else {
    ref_data.add_num = lodash.get(UserCtr, 'cvo.single', { qon: 100, qtw: 500, qth: 1000, qfo: 2000, qfi: 5000 })
    return ref_data.add_num
  }
})

// 左侧+的按钮 置灰
const prevent_click = computed((value) => {
  return function (v) {
    if (active_index.toString().indexOf('pre') > -1) {
      return true
    }
    if (Number(value) + Number(money.value) > max_money.value) { return true };
  }
})



// 预约投注赔率值可通过键盘输入 max，左侧三个按钮置灰，输入金额时放开
const has_pre_market = computed(() => {
  return active_index.toString().indexOf('pre') > -1 || active_index.toString().indexOf('market') > -1
})

onUnmounted(() => {
})

</script>

<style lang="scss" scoped>
.key-row{
  border-bottom: 1px solid var(--q-gb-bd-c-1);
}
.key-cell{
  border-right: 1px solid var(--q-gb-bd-c-1);
}
.keyboard {
  height: 185px;
  -webkit-overflow-scrolling: touch;
  font-size: 0.16rem;
  font-weight: 600;
  color: var(--q-gb-bg-c-13);
  font-family: "DIN";
  border-top: 1px solid var(--q-gb-bd-c-1)
}
.key-cell {
  flex: 1;
  box-sizing: border-box;
  line-height: 46px;
  text-align: center;
  background: var(--q-bg-c-2);
  font-size: .22rem;
  font-weight: 500;
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
</style>