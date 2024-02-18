<!--
 * @Author: lampson
 * @Description: 虚拟数字键盘
-->

<template>
  <div class="keyboard" style="opacity: 1;">
    <div v-show="false">{{BetData.bet_data_class_version}}</div>
      <div class="nonebox4-fourth number_family">
          <div class="nonebox4-fourth-a nonebox4-fourth-h-40" @click.stop="_handleKeyPress($event)">
              <div class="nonebox4-fourth-a-son" :class="item == BetData.bet_amount ?'active':''" v-for="(item,index) of BetData.user_max_min_money" :key='item' :data-number='index'>{{item}}</div>
          </div>
          
          <div class="nonebox4-fourth-a" @click.stop="_handleKeyPress($event)"> 
              <div class="nonebox4-fourth-num">
                  <div class="nonebox4-fourth-num-sun" data-number='1'>1</div>
                  <div class="nonebox4-fourth-num-sun" data-number='4'>4</div>
                  <div class="nonebox4-fourth-num-sun" data-number='7'>7</div>
                  <div class="nonebox4-fourth-num-sun" data-number='.'>.</div>
              </div>
              <div class="nonebox4-fourth-num">
                  <div class="nonebox4-fourth-num-sun" data-number='2'>2</div>
                  <div class="nonebox4-fourth-num-sun" data-number='5'>5</div>
                  <div class="nonebox4-fourth-num-sun" data-number='8'>8</div>
                  <div class="nonebox4-fourth-num-sun" data-number='0'>0</div>  
              </div>
              <div class="nonebox4-fourth-num">
                  <div class="nonebox4-fourth-num-sun" data-number='3'>3</div>
                  <div class="nonebox4-fourth-num-sun" data-number='6'>6</div>
                  <div class="nonebox4-fourth-num-sun" data-number='9'>9</div>
                  <div class="nonebox4-fourth-num-sun" data-number='00'>00</div>
              </div>
              <div class="nonebox4-fourth-num">
                  <div class="nonebox4-fourth-num-sun" data-number='max' @click.stop="_handleKeyPress($event)">{{ i18n_t('bet.max')}}</div>
                  <div class="nonebox4-fourth-num-sun key-cell" data-number="x" @click.stop="_handleKeyPress($event)">
                    <div class="key-cell-img" data-number="x" :style="compute_css_obj({key: 'h5-keyboard'})"></div>
                  </div>
                  <div class="nonebox4-fourth-num-sun" data-number='shouqi'  @click.stop="shou(item,$event)">
                    <div class="key-cell-imgs" :style="compute_css_obj({key: 'h5_pack_keyboard'})"></div>
                  </div>
              </div>
          </div>
         
      </div>
  </div>
</template>
  
<script setup>
import lodash_ from "lodash"
import { ref, reactive, onMounted, watch, computed, onUnmounted, nextTick } from 'vue';
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { UserCtr, LOCAL_PROJECT_FILE_PREFIX, i18n_t , compute_css_obj} from "src/output/index.js";

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

// 金额输入到 投注栏里
const set_money_change_new = (new_) => {
  let emit_name = 'EMIT_INPUT_BET_MONEY'
  if(BetData.is_bet_single){
    emit_name = 'EMIT_INPUT_BET_MONEY_SINGLE'
  }
  useMittEmit(MITT_TYPES[emit_name],{ params:BetData.bet_keyboard_config, money: new_ })
}

// 点击键盘
const _handleKeyPress = (e) => {
  e.preventDefault();
  if (e.target.className.includes("shadow-show")) { return }; // 置灰的按钮不能再点击
  let num = e.target.dataset.number;
  switch (num) {
    //最大值
    case "max":
      _handmaxKey(e);
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
      shou()
      // _handleConfirmKey();
      break;
    // 数字键
    default:
      _handleNumberKey(num, e);
      break;
  }
}

// 小数点 .
const _handleDecimalPoint = () => {
  //超过最大金额  显示最大金额
  let max_money = ''
  if(BetData.is_bet_single){
    let old = BetData.bet_keyboard_config.playOptionsId
    max_money = lodash_.get(BetViewDataClass,`bet_min_max_money['${old}'].max_money`,8888)
  }else{
    max_money = lodash_.get(BetData,`bet_keyboard_config.max_money`,8888)
  }

  let money_ = money.value
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

  set_money_change_new(money_)
 
}

// MAX键
const _handmaxKey = (e) => {
  let money_ = ''
  if(BetData.is_bet_single){
    let old = BetData.bet_keyboard_config.playOptionsId
    money_ = lodash_.get(BetViewDataClass,`bet_min_max_money['${old}'].max_money`,8888)
  }else{
    money_ = lodash_.get(BetData,`bet_keyboard_config.max_money`,8888)
  }
  
  // 判断当前余额 是否小于最多投注金额
  if(money_*1 > UserCtr.get_set_balance()*1 ){
    money.value = UserCtr.get_set_balance()
  } else {
    money.value = money_
  }
  set_money_change_new(money.value)
  // add_or_remove_active(e)
}

// 删除键
const _handleDeleteKey = (e) => {
  money.value = BetData.bet_amount
  if (!money.value) return   
  //删除最后一个
  let s = money.value.toString()
  money.value = s.substring(0, s.length - 1);
  set_money_change_new(money.value)
  // add_or_remove_active(e);
}
// 数字建
const _handleNumberKey = (num, e) => {
  if (!num) return
  let money_ = BetData.bet_amount
  if (['qon', 'qtw', 'qth','qfo','qfi','qsi'].includes(num)) {
    money_ = BetData.user_max_min_money[num]
    // if (!money_) {
    //   money_ = ref_data.add_num[num]
    // } else {
    //   money_ = (+money_ + ref_data.add_num[num]).toString();
    // }
  } else {
    if (!money_) { // 输入第一位
      money_ = num === '0' ? '0.' : num // 第一位输入0 则显示0.  其他的正常显示
      if(num === '00') return // 初次输入不能输入00
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
  let max_money = ''
  if(BetData.is_bet_single){
    let old = BetData.bet_keyboard_config.playOptionsId
    max_money = lodash_.get(BetViewDataClass,`bet_min_max_money['${old}'].max_money`,8888)
  }else{
    max_money = lodash_.get(BetData,`bet_keyboard_config.max_money`,8888)
  }

  // 输入金额大于限额 或者 大于用户余额
  if(money_ && (money_*1 > max_money*1 || money_*1 > UserCtr.get_set_balance()*1) ){
    // 判断当前余额 是否小于最多投注金额
    if(max_money*1 > UserCtr.get_set_balance()*1 ){
      money_ = UserCtr.get_set_balance()
    } else {
      money_ = max_money
    }
  }

  money.value = money_
  set_money_change_new(money_)
  // add_or_remove_active(e)
}

// 左侧+的按钮 置灰
const prevent_click = computed((value) => {
  return function (v) {
    if (active_index.toString().indexOf('pre') > -1) {
      return true
    }
    if (Number(value) + Number(money.value) > max_money.value) { return true };
  }
})

// 添加键盘shadow，暗夜版移除
const add_keyboard_shadow = () => {
  let dom = {
    sun: document.querySelectorAll('.nonebox4-fourth-num-sun'),
    son: document.querySelectorAll('.nonebox4-fourth-a-son')
  }
  
  dom.sun.forEach((item) => {
    if(UserCtr.theme === 'theme-2') {
      item.classList.add('shadow')
    } else {
      item.classList.remove('shadow')
    }
  })
  dom.son.forEach((item) => {
    if(UserCtr.theme === 'theme-2') {
      item.classList.add('shadow')
    } else {
      item.classList.remove('shadow')
    }
  })
}
useMittOn(MITT_TYPES.EMIT_THE_THEME_CHANGE, add_keyboard_shadow)

// 预约投注赔率值可通过键盘输入 max，左侧三个按钮置灰，输入金额时放开
const has_pre_market = computed(() => {
  return active_index.toString().indexOf('pre') > -1 || active_index.toString().indexOf('market') > -1
})

onMounted(() => {
  add_keyboard_shadow();
  // 获取商户配置的 快捷金额
  BetData.set_user_max_min_money()
})
onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_THE_THEME_CHANGE, add_keyboard_shadow).off()
})

</script>

<style lang="scss" scoped>
@import url( "src/base-h5/css/bet/bet_single_detail.scss");
.nonebox4-fourth {
    width: 100%;
    background-color: var(--q-gb-bg-c-22);
    border-radius: .1rem;
    padding: .04rem;
    margin-top: .08rem;
}
.nonebox4-fourth-a {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: .04rem;
    padding-bottom: 0.04rem;
    border-bottom: 1px solid var(--q-gb-bg-c-18);
    &.nonebox4-fourth-h-40{
      height: 0.4rem;
    }
}
.nonebox4-fourth-a:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}
.nonebox4-fourth-a-son {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: var(--q-gb-bg-c-25);
    color: var(--q-gb-t-c-1);
    font-size: 0.18rem;
    font-weight: 700;
    border-radius: 0.08rem;
    margin: 0 .02rem;
    padding: .06rem 0.08rem;
    border: 1px solid transparent;
    height: 0.36rem;
    //box-shadow: 0 2px 2px #eeeeee;
  &.active {
    background: url( $SCSSPROJECTPATH+"/image/svg/selected.svg") no-repeat bottom right / .2rem .2rem var(--q-gb-bg-c-15);
    border-color: var(--q-gb-t-c-1);
  }
}
.nonebox4-fourth-num {
    height: 1.48rem;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 .02rem;
}
.nonebox4-fourth-num:last-child {
  .nonebox4-fourth-num-sun:first-child {
    font-weight: 600 !important;
    font-size: .15rem;
  }
  .nonebox4-fourth-num-sun:nth-child(2) {
    flex: auto;
    height: 25%;
  }
}
.nonebox4-fourth-num-sun {
    width: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: var(--q-gb-bg-c-25);
    color: var(--q-gb-t-c-18);
    font-size: 0.22rem;
    font-weight: 700;
    border-radius: .08rem;
    margin: .02rem 0;
}
.shadow {
  box-shadow: 0 2px 8px #d1ebff;
}

.keyboard {
  -webkit-overflow-scrolling: touch;
  font-size: .2rem;
  font-weight: 500;
}

.key-cell {
  flex: 1;
  box-sizing: border-box;
  text-align: center;
}
.key-cell-img{
  width: 0.24rem;
  height: 0.24rem;
}
.key-cell-imgs{
  width: 0.25rem;
  height: 0.24rem;
}
</style>