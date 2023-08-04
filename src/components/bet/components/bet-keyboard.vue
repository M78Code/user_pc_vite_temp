<!--
 * @Author: lampson
 * @Description: 虚拟数字键盘
-->

<template>
    <div class="keyboard" @click.stop="_handleKeyPress($event)" style="opacity: 1;" @touchmove.prevent>
      <div class="key-row row">
        <div class="key-cell" data-num="qon" :class="{'shadow-show':prevent_click(addnum.qon)}">
          <span>+</span>{{addnum.qon}}
        </div>
        <div class="key-cell" data-num="1">1</div>
        <div class="key-cell" data-num="2">2</div>
        <div class="key-cell" data-num="3">3</div>
      </div>
      <div class="key-row row">
        <div class="key-cell" data-num="qtw" :class="{'shadow-show':prevent_click(addnum.qtw)}">
          <span>+</span>{{addnum.qtw}}
        </div>
        <div class="key-cell" data-num="4">4</div>
        <div class="key-cell" data-num="5">5</div>
        <div class="key-cell" data-num="6">6</div>
      </div>
      <div class="key-row row">
        <div class="key-cell" data-num="qth" :class="{'shadow-show':prevent_click(addnum.qth)}">
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
        <div class="key-cell del-key" data-num="x"></div>
      </div>
    </div>
</template>
  
<script setup>
import {ref ,reactive,provide,onMounted,computed} from 'vue'

let money = ref() // 最终输入的金额

let addnum = reactive({
  qon: 10,
  qtw: 50,
  qth: 100,
});

const props = defineProps({
    items:{
        type: [Object] ,
        default : () => {}
    }
})

// 点击键盘
const _handleKeyPress = (e) => {
  e.preventDefault();
  if (e.target.className.includes("shadow-show")) {return}; // 置灰的按钮不能再点击
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
  EMITTER.emit("input_bet_money", money)
}

// 小数点 .
const _handleDecimalPoint = () => {
  //超过最大金额时不让输入
  if (money.value && money.value >= props.items.orderMaxPay) return
  //如果包含小数点，直接返回
  if (money.value && money.value.includes(".")) return
  
  //如果小数点是第一位，补0
  if (!money.value){
    money.value = "0.";
  } else {
    //如果不是，添加一个小数点
    money.value = money.value + ".";
  }
  // money_s.value = money.value
}
// MAX键
const _handmaxKey = () => {
  if(+amount.value < +props.items.orderMaxPay){
     money.value = amount.value
     return
  }
  money.value = props.items.orderMaxPay
  // money_s.value = money.value
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
  if(!num) return
  
  if(['qon', 'qtw', 'qth'].includes(num)){
    if(!money.value){
      money.value = addnum[num]
    }else{
      money.value = (+money.value + addnum[num]).toString();
    }
  }else{
    if(!money.value){ // 输入第一位
      money.value = num === '0' ? '0.' : num // 第一位输入0 则显示0.  其他的正常显示
    }else{
      money.value = money.value + num
      
    }

    let S = money.value
    let S_length = S.substring(S.indexOf(".") + 1).length // 0. 后面输入的字符长度  最多只保留两位
    if (S.includes(".") && S_length > 1){
      money.value = S.substring(0, S.indexOf(".") + 3);// 最多只保留小数点两位
    }
                                                         

  }

  //超过最大金额  显示最大金额
  if (money.value && +money.value >= +props.items.orderMaxPay){
    money.value = props.items.orderMaxPay
  } 

}

// 左侧+的按钮 置灰
const prevent_click = computed(()=>{
  return function(v){
    return v + +money.value > +props.items.orderMaxPay
  }
})

</script>

<style lang="scss" scoped>

</style>