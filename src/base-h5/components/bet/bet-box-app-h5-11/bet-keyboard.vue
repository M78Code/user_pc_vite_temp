<!--
 * @Author: lampson
 * @Description: 虚拟数字键盘
-->

<template>
  <div class="keyboard" @click.stop="_handleKeyPress($event)" style="opacity: 1;" @touchmove.prevent>
      <div class="nonebox4-fourth">
          <div class="nonebox4-fourth-a">
              <div class="nonebox4-fourth-a-son" v-for="(item,index) of addnum" :key='item' :data-number='index'>{{item}}</div>
          </div>
          
          <div class="nonebox4-fourth-a"> 
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
                  <div class="nonebox4-fourth-num-sun" data-number='max' style="font-size: 0.14rem;">{{ i18n_t('bet.max')}}</div>
                  <!-- <div class="nonebox4-fourth-num-sun" data-number='x' @click.stop="_handleDeleteKey()">{{ i18n_t('app_h5.bet.delete')}}</div> -->
                  <div class="nonebox4-fourth-num-sun key-cell" data-num="x" @click.stop="_handleDeleteKey()">
                    <img class="key-cell-img" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/jianpan_del.svg`" alt="" data-num="x">
                  </div>
                  <div class="nonebox4-fourth-num-sun" data-number='shouqi'  @click.stop="shou(item,$event)"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/bet/pack_up-keyboard.svg`" alt=""></div>
              </div>
          </div>
          
          <!-- <ul class="keyboard-box">
              <li v-for="item of test" :key="item.value"
                  :style="`grid-area: ${item.area}`"
                  :data-number="item.value"
                  class="keyboard-box-item">
                  {{item.label }}
              </li>
          </ul> -->
      </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue';
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { UserCtr, LOCAL_PROJECT_FILE_PREFIX, i18n_t } from "src/output/index.js";

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

const test = [
    {label: '1', value: '1', area: 'one'},
    {label: '2', value: '2', area: 'two'},
    {label: '3', value: '3', area: 'three'},
    {label: '4', value: '4', area: 'four'},
    {label: '5', value: '5', area: 'five'},
    {label: '6', value: '6', area: 'six'},
    {label: '7', value: '7', area: 'seven'},
    {label: '8', value: '8', area: 'eight'},
    {label: '9', value: '9', area: 'nine'},
    {label: '0', value: '0', area: 'zero'},
    {label: '.', value: '.', area: 'drop'},
    {label: '00', value: '00', area: 'ten'},
    {label: i18n_t('bet.max'), value: 'max', area: 'max'},
    {label: i18n_t('app_h5.bet.delete'), value: 'x', area: 'delete'},
    {label: i18n_t('bet.pack_up'), value: 'shouqi', area: 'cancel'},
]

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

watch(() => money.value, (new_) => {
  let emit_name = 'EMIT_INPUT_BET_MONEY'
  if(BetData.is_bet_single){
    emit_name = 'EMIT_INPUT_BET_MONEY_SINGLE'
  }
  useMittEmit(MITT_TYPES[emit_name],{ params:BetData.bet_keyboard_config, money: new_ })
})

watch(() => active_index, (new_) => {
  if (money.value) delete_all.value = true;
})


// 点击键盘
const _handleKeyPress = (e) => {
  e.preventDefault();
  if (e.target.className.includes("shadow-show")) { return }; // 置灰的按钮不能再点击
  let num = e.target.dataset.number;
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
      shou()
      // _handleConfirmKey();
      break;
    // 数字键
    default:
      _handleNumberKey(num, e);
      break;
  }
  let emit_name = 'EMIT_INPUT_BET_MONEY'
  if(BetData.is_bet_single){
    emit_name = 'EMIT_INPUT_BET_MONEY_SINGLE'
  }
  useMittEmit(MITT_TYPES[emit_name], { params:BetData.bet_keyboard_config, money:money.value } )
}

// 小数点 .
const _handleDecimalPoint = () => {
  //超过最大金额  显示最大金额
  let old = BetData.bet_keyboard_config.playOptionsId
  let max_money = BetViewDataClass.bet_min_max_money[old].max_money
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
  BetData.set_bet_amount(money_)
}

// MAX键
const _handmaxKey = () => {
  let old = BetData.bet_keyboard_config.playOptionsId
  money.value = BetViewDataClass.bet_min_max_money[old].max_money

  BetData.set_bet_amount(money.value)
}
// 删除键
const _handleDeleteKey = () => {
  if (!money.value) return   
  //删除最后一个
  let s = money.value.toString()
  money.value = s.substring(0, s.length - 1);
  BetData.set_bet_amount(money.value )
}
// 数字建
const _handleNumberKey = (num, e) => {
  let dom = document.querySelectorAll('.nonebox4-fourth-a-son')
  for(let i = 0; i < dom.length; i++) {
    dom[i].classList.remove('active')
  }
  if (!num) return
  let money_ = BetData.bet_amount
  if (['qon', 'qtw', 'qth','qfo','qfi'].includes(num)) {
    e.target.classList.add('active')
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
  ol_id = lodash.get(BetData.bet_keyboard_config,ol_type)
  let max_money = BetViewDataClass.bet_min_max_money[ol_id].max_money

  // 显示最大金额
  if (money_ && +money_ >= +max_money) {
    money_ = max_money
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
    ref_data.add_num = lodash.get(UserCtr, 'cvo.single', { qon: 200, qtw: 500, qth: 1000, qfo: 2000, qfi: 5000 })
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
@import url( "src/base-h5/css/bet/bet_single_detail.scss");
.nonebox4-fourth {
    width: 100%;
    background-color: var(--q-gb-bg-c-22);
    border-radius: .1rem;
    padding: .04rem;
    margin-top: .08rem;
    font-family: Akrobat;
}
.nonebox4-fourth-a {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: .08rem;
}
.nonebox4-fourth-a:last-child {
  margin-bottom: 0;
}
.nonebox4-fourth-a-son {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: var(--q-gb-bg-c-15);
    color: var(--q-gb-t-c-1);
    font-size: 0.18rem;
    font-weight: 700;
    border-radius: 0.08rem;
    margin: 0 .02rem;
    padding: .05rem 0;
    border: 1px solid transparent;
    //box-shadow: 0 2px 2px #eeeeee;
  &.active {
    background: url( $SCSSPROJECTPATH+"/image/svg/selected.svg") no-repeat bottom right / .2rem .2rem var(--q-gb-bg-c-15);
    border-color: var(--q-gb-t-c-1);
  }
}
.nonebox4-fourth-num {
    height: 156px;
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
    background-color: var(--q-gb-bg-c-15);
    //box-shadow: 0 2px 2px #eeeeee;
    color: #333;
    font-size: 0.22rem;
    font-weight: 700;
    border-radius: .08rem;
    margin: .02rem 0;
}
.nonebox4-fourth-num-sun2 {
    width: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: var(--q-gb-bg-c-15);
    //box-shadow: 0 2px 2px #eeeeee;
    color: #333;
    font-size: 14px;
    font-weight: bold;
    border-radius: 6px;
    margin: .02rem 0;
    height: 50px;
}

.keyboard {
  -webkit-overflow-scrolling: touch;
  font-size: 20px;
  font-weight: 500;
  color: #1A1A1A;

}

.key-cell {
  flex: 1;
  box-sizing: border-box;
  text-align: center;
}
.key-cell-img{
  width: 0.2rem;
  height: 0.2rem;
}

.del-key {
  // background: url('../../../assets/images/bet/bet_key_delect.png') no-repeat 50%;
  background-size: 23px 14px;
}

.keyboard-box {
  width: 100%;
  height: 156px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 4px;
  grid-template-areas:
    'one two three max'
    'one two three max'
    'one two three max'
    'four five six max'
    'four five six delete'
    'four five six delete'
    'seven eight nine delete'
    'seven eight nine delete'
    'seven eight nine cancel'
    'zero drop ten cancel'
    'zero drop ten cancel'
    'zero drop ten cancel';

  &-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--q-gb-bg-c-15);
    //box-shadow: 0 2px 2px #eeeeee;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    border-radius: 6px;
  }
}
</style>