<!--
 * @Author: lampson
 * @Description: 虚拟数字键盘
-->

<template>
  <div class="keyboard yb_mx10 yb_pb6" @click.stop="_handleKeyPress($event)" style="opacity: 1;" @touchmove.prevent>
    <div class="key-row row">
      <div class="key-cell" data-num="qon" :class="{ 'shadow-show': prevent_click(addnum.qon) }">
        <span>+</span>{{ addnum.qon }}
      </div>
      <div class="key-cell" data-num="1">1</div>
      <div class="key-cell" data-num="2">2</div>
      <div class="key-cell" data-num="3">3</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" data-num="qtw" :class="{ 'shadow-show': prevent_click(addnum.qtw) }">
        <span>+</span>{{ addnum.qtw }}
      </div>
      <div class="key-cell" data-num="4">4</div>
      <div class="key-cell" data-num="5">5</div>
      <div class="key-cell" data-num="6">6</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" data-num="qth" :class="{ 'shadow-show': prevent_click(addnum.qth) }">
        <span>+</span>{{ addnum.qth }}
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
      <div class="key-cell del-key" data-num="x"></div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue';
import BetData from "src/core/bet/class/bet-data-class.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { UserCtr } from "src/output/index.js";
import lodash from 'lodash'


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
  money: '', // 投注金额
  keyborard: true, // 是否显示 最高可赢 和 键盘
})
// bet_min_max_money max_money最大可投注的金额 min_money最小可投注的金额
const props = defineProps({
  bet_min_max_money: {
    type: [Object],
    default: () => { }
  }
})



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
  useMittEmit(MITT_TYPES.EMIT_INPUT_BET_MONEY, money.value)
})
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
  useMittEmit(MITT_TYPES.EMIT_INPUT_BET_MONEY, money.value)
}

// 小数点 .
const _handleDecimalPoint = () => {
  //超过最大金额时不让输入
  if (money.value && money.value >= props.items.orderMaxPay) return
  //如果包含小数点，直接返回
  if (money.value && money.value.includes(".")) return

  //如果小数点是第一位，补0
  if (!money.value) {
    money.value = "0.";
  } else {
    //如果不是，添加一个小数点
    money.value = money.value + ".";
  }
  // money_s.value = money.value
}
// //处理小数点函数
// const _handleDecimalPoint = () => {
//       if(this.has_pre_market){
//         //如果包含小数点，直接返回
//         if (this.pre_odds_value.indexOf(".") > -1) {return false};

//         //如果小数点是第一位，补0
//         if (!this.pre_odds_value.length) this.pre_odds_value = "0.";
//         //如果不是，添加一个小数点
//         else this.pre_odds_value = this.pre_odds_value + ".";
//         return
//       }
//       //超过最大金额时不让输入
//       if (this.money > this.max_money) {
//         return
//       }

//       //如果包含小数点，直接返回
//       if (this.money.indexOf(".") > -1) {return false};

//       //如果小数点是第一位，补0
//       if (!this.money.length) this.money = "0.";
//       //如果不是，添加一个小数点
//       else this.money = this.money + ".";
//     },

// MAX键
const _handmaxKey = () => {
  // if (+amount.value < +props.items.orderMaxPay) {
  //   money.value = amount.value
  //   return
  // }
  money.value = ref_data.max_money
}
// 删除键
const _handleDeleteKey = () => {
  if (!money.value) return
  //删除最后一个
  let s = money.value.toString()
  money.value = s.substring(0, s.length - 1);
  // money_s.value = money.value
}
// 数字建
const _handleNumberKey = (num) => {
  if (!num) return

  if (['qon', 'qtw', 'qth'].includes(num)) {
    if (!money.value) {
      money.value = addnum[num]
    } else {
      money.value = (+money.value + addnum[num]).toString();
    }
  } else {
    if (!money.value) { // 输入第一位
      money.value = num === '0' ? '0.' : num // 第一位输入0 则显示0.  其他的正常显示
    } else {
      money.value = money.value + num
    }
    let S = money.value
    let S_length = S.substring(S.indexOf(".") + 1).length // 0. 后面输入的字符长度  最多只保留两位
    if (S.includes(".") && S_length > 1) {
      money.value = S.substring(0, S.indexOf(".") + 3);// 最多只保留小数点两位
    }

  }

  //超过最大金额  显示最大金额
  if (money.value && +money.value >= +ref_data.max_money) {
    money.value = ref_data.max_money
  }

  BetData.set_bet_amount(money.value)
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

const addnum = computed(() => {
  if (BetData.bet_mix_bet_flag) {
    return lodash.get(UserCtr, 'cvo.series', { qon: 100, qtw: 200, qth: 100 })
  } else {
    return lodash.get(UserCtr, 'cvo.single', { qon: 100, qtw: 200, qth: 1000 })
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

.keyboard {
  height: 216px;
  -webkit-overflow-scrolling: touch;
  font-size: 20px;
  font-weight: 500;
  color: #1A1A1A;

}

.key-cell {
  flex: 1;
  box-sizing: border-box;
  line-height: 54px;
  text-align: center;
  border: 1px solid var(--q-gb-bd-c-1);
  background: #ffffff0D;
}

.key-cell {
  &:first-child {
    // 左侧第一排MAX的样式
    background: #F5F5F5;
  }

  &:last-child {
    margin-right: 0;
  }

  &.del-key {
    background: cadetblue #ffffff0D no-repeat center center;
    opacity: 0.9;
    color: #B8B8B8;
  }

  &.shadow-show {
    color: #595959 !important;
  }
}

.del-key {
  // background: url('../../../assets/images/bet/bet_key_delect.png') no-repeat 50%;
  background-size: 23px 14px;
}
</style>