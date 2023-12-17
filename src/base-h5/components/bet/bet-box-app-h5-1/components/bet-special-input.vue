

<template>
  <div v-show="false">{{ BetData.bet_data_class_version }}-{{BetViewDataClass.bet_view_version}}</div>
  <div class="bet_single_info f-b-c">
    <div>
      {{ items.name }}
    </div>
    <div class="bet_single_detail f-b-c">
      <div>{{ items.count }}x</div>
      <div class="content-b" :class="{ 'red-color': !money_ok }" @click.stop="input_click">
        
        <span v-if="ref_data.money" class="yb_fontsize20 money-number">{{ ref_data.money }}</span>
        <span class="money-span" ref="money_span" v-if="items.show_quick" :style="{ opacity: '1' }"></span>
        <span class="yb_fontsize14 limit-txt" v-show="!ref_data.money">{{ i18n_t('app_h5.bet.limit')}}{{ items.min_money }}-{{ items.max_money }}</span>
      </div>
    </div>
  </div>
  <div class="f-b-c" v-if="items.show_quick">
    <div>预计可赢：<span> {{ formatMoney(mathJs.subtract(mathJs.multiply(items.bet_amount,items.seriesOdds), items.bet_amount))  }} </span>RMB</div>
    <div>小计：{{items.bet_amount}}RMB</div>
  </div>
  
</template>

<script setup> 
import { reactive,onMounted,onUnmounted,ref } from "vue"
import lodash_ from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { UserCtr,formatMoney, format_money3 } from "src/output/index.js"
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import mathJs from 'src/core/bet/common/mathjs.js'
const props = defineProps({
    items:{},
    index:{}
})

let flicker_timer = null
let money_span = ref('')

const ref_data = reactive({
    min_money: '', // 最小投注金额
    max_money: '', // 最大投注金额
    win_money: 0.00, // 最高可赢
    money: '', // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    seriesOdds: '', // 赔率
    show_quick: false, // 显示快捷金额
    emit_lsit: {},
    show_money_span:false,
})


onMounted(() => {
  ref_data.money = props.items.bet_amount
    //监听键盘金额改变事件
    ref_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle).off,
  }
})

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
 const change_money_handle = (new_money) => {
  console.error('change_money_handle-single',new_money,new_money.params.id,props.items.max_money,new_money.money)
  if(props.items.id == new_money.params.id){
    if( new_money.money*1 > props.items.max_money *1){
      ref_data.money =  props.items.max_money
    }else{
      ref_data.money = new_money.money
    }
    BetData.set_bet_amount(ref_data.money)
    set_special_series('edit',new_money.params.id)
  }
}

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

// 快捷金额 显示隐藏
const set_show_quick_money = (obj = {}) => {
    obj.money_list.max = 'MAX'
    ref_data.money_list = obj.money_list
    props.items.max_money = obj.max_money
}

/**
 *@description 光标闪动，animation有兼容问题，用函数替代
 *@return {Undefined} undefined
 */
 const cursor_flashing = () => {
  clearInterval(flicker_timer)
  flicker_timer = setInterval(() => {
    money_span.value && money_span.value.classList.toggle('money-span3')
  }, 700);
}

// 修改数据内容
const set_special_series = (money,ty_id) => {
  let list = lodash_.cloneDeep(lodash_.get(BetViewDataClass,'bet_special_series'))
  // 键盘输入会传修改的数据id
  let id = ty_id ? ty_id : lodash_.get(props,'items.id','')
  list.filter(item => {
    item.show_quick = false
      // 显示指定投注项的快捷金额按钮
      console.error('ssssset_special_seriesss',id)
    if(item.id == id){
        item.show_quick = true
        if(money == 'edit'){
          item.bet_amount = ref_data.money
        }
        
    }
  })
  BetViewDataClass.set_bet_special_series(list)
}
/**
 *@description 金额输入框点击
 *@param {Undefined}
 *@return {Undefined} undefined
 */
 const input_click = (evnet) => {
  event.preventDefault()
  set_special_series()
  BetData.set_bet_keyboard_show(true)

  cursor_flashing()

  // 串关 设置键盘需要设置当前的金额
  BetData.set_bet_amount(ref_data.money)
  BetData.set_bet_keyboard_config(props.items)
}
</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
  .bet_single_info{
    width: 100%;
    font-size: .16rem;
    background: var(--q-gb-bg-c-22);
    border-radius: 0.12rem;
    border-radius: 10px;
    height: 0.38rem;
    margin-top: 0.1rem;
    //margin-left: .08rem;
    padding: 0 .12rem;
  }

  .bet_single_detail{
    //margin-top: 0.08rem;
    height: 0.44rem;
    width: 1.68rem;
  }

  /* ************** 右边内容 ************** -S */
  .content-b {
    height: 0.3rem;
    width: 1.50rem;
    border-radius: 4px;
    font-size: 0.16rem;
    overflow: hidden;
    //padding-left: 0.1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.1rem;
    background: var(--q-gb-bg-c-15);
    margin-left: 0.05rem;
    .limit-txt {
      color: #C9CDDB;
    }
  }
  /* ************** 右边内容 ************** -E */
  .set-opacity {
    opacity: 0.2;
    pointer-events: none;
  }
  .money-number {
    margin-top: 1px;
    font-family: Akrobat;
    font-weight: 700;
  }
  .money-span {
    width: 0.02rem;
    height: 0.16rem;
    margin: 0 1px;
    background: var(--q-gb-bg-c-1);
    &.money-span3{
      background: transparent;
    }
  }
  .money-close {
    position: absolute;
    top: 50%;
    right: 0.08rem;
    width: 0.15rem;
    height: 0.15rem;
    line-height: 0.15rem;
    text-align: center;
    margin-top: -0.09rem;
    background: gray;
    color: #FFFFFF;
    border-radius: 50%;
    font-size: 13px;
  }
  /* ************** 左边内容 ************** -S */
  .content-t {
    padding-left: 0.12rem;
    margin-right: auto;
  
    p:nth-child(1) {
      position: relative;
  
      &::after {
        content: "";
        width: 3px;
        height: 0.12rem;
        border-radius: 2px;
        position: absolute;
        left: -0.08rem;
        top: 50%;
        transform: translateY(-58%);
      }
    }
  
    p:nth-child(2) {
      font-size: 0.11rem;
      line-height: 0.14rem;
    }
  }
  
</style>