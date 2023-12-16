

<template>
    <div v-show="false">{{ BetData.bet_data_class_version }}-{{BetViewDataClass.bet_view_version}}</div>
    {{ items }}
    <div class="bet_single_info">
        <div class="bet_single_detail" ref="bet_single_detail">
          <div class="content-b" :class="{ 'red-color': !money_ok }" @click.stop="input_click">
            <span v-if="ref_data.money" class="yb_fontsize20 money-number">{{ ref_data.money }}</span>
  
            <span class="money-span" ref="money_span" v-if="ref_data.show_money_span" :style="{ opacity: '1' }"></span>
            
            <span class="yb_fontsize14 limit-txt" v-show="!ref_data.money">{{ i18n_t('app_h5.bet.limit')}}{{ items.min_money }}-{{ items.max_money }}</span>
            <!-- <span @click.stop="clear_money" class="money-close" :style="{ opacity: ref_data.money > 0 ? '1' : '0' }">x</span> -->
          </div>
          <div class="content-rmb">RMB</div>
        </div>
      </div>
</template>

<script setup> 
import { reactive,onMounted,onUnmounted } from "vue"
import lodash_ from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";

import { UserCtr,formatMoney, format_money3 } from "src/output/index.js"
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import mathJs from 'src/core/bet/common/mathjs.js'
const props = defineProps({
    items:{},
})

let flicker_timer = null

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

// 开启/停止拖拽
const stop_drap_fn = (state) => {
    let obj = {
        ...BetData.bet_box_draggable,
        draggable: state
    }
    BetData.set_bet_box_draggable(obj)
}

onMounted(() => {
    // show_quick_amount(true)
    // // 单关 单注可以默认展开
    // if(BetData.is_bet_single && !BetData.is_bet_merge){
    //     show_quick_amount(true)
    // }
    show_quick_amount()
    ref_data.money = props.items.bet_amount
    
})


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

/**
 *@description 金额输入框点击
 *@param {Undefined}
 *@return {Undefined} undefined
 */
 const input_click = (evnet) => {
  event.preventDefault()

  ref_data.show_money_span = true

  BetData.set_bet_keyboard_show(true)
}

// 判断快捷金额按钮是否可点击
const bet_money_btn_class = (obj, index) => {
    let className = '';
    if(props.items.max_money > 0) {
        if(index != 'max' && (props.items.max_money < obj || props.items.max_money < props.items.bet_amount || UserCtr.balance < obj)) {
            className = 'disabled'
        }
    }
    return className;
}

// 快捷金额
const set_bet_money = obj => {
    console.error('sss',obj)
    // 获取当前投注金额
    let money = props.items.bet_amount
    let money_ = obj
    // 设置最大投注金额
    if(obj == "MAX"){
        money_ = props.items.max_money
    }
    let items_obj = lodash_.get(props,'items',{})
    // 计算投注金额
    let money_amount = mathJs.add(money,money_)
    // 投注金额 不能大于最大投注金额 也不能大于用户约
    if(money_amount < props.items.max_money && money_amount < UserCtr.balance){
        items_obj.bet_amount = mathJs.add(money,money_)
    }else{
        // 最大限额不能大于余额
        money_amount = props.items.max_money
        if(UserCtr.balance < props.items.max_money){
            money_amount = UserCtr.balance
        }
        items_obj.bet_amount = money_amount
    }
    ref_data.money = money_amount
    BetViewDataClass.set_bet_special_series_item(items_obj)
    
}

// 键盘回车事件
const keydown = (e) => {
    e.preventDefault();
    // 未投注之前 可以点击
    if(BetViewDataClass.bet_order_status == 1){
        submit_handle()
    }
}

// 输入判断
const set_win_money = () => {
    let items_obj = lodash_.get(props,'items',{})
    // 输入控制
    if( ref_data.money < props.items.max_money &&  ref_data.money < UserCtr.balance){
        items_obj.bet_amount = ref_data.money
    }else{
        // 最大限额不能大于余额
        let money_a = props.items.max_money
        if(UserCtr.balance < props.items.max_money){
            money_a = UserCtr.balance
        }
        ref_data.money = money_a
        items_obj.bet_amount = money_a
    }
    BetViewDataClass.set_bet_special_series_item(items_obj)
}

// 快捷金额 state true   false
const show_quick_amount = () => {
    let money_list = []
    if (BetData.bet_is_single) {
        money_list = lodash_.get(UserCtr, 'cvo.series', { qon: 10, qtw: 50, qth: 100, qfo: 200 })
    } else {
        money_list = lodash_.get(UserCtr, 'cvo.single', { qon: 100, qtw: 500, qth: 1000, qfo: 2000 })
    }

    let obj = {
        money_list,
        max_money: props.items.max_money,
    }

    // 取消全部的快捷金额按钮
    let list = lodash_.cloneDeep(lodash_.get(BetViewDataClass,'bet_special_series'))
    let id = lodash_.get(props,'items.id','')
    list.filter(item => {
        item.show_quick = false
         // 显示指定投注项的快捷金额按钮
        if(item.id == id){
            item.show_quick = true
        }
    })
    BetViewDataClass.set_bet_special_series(list)

    set_show_quick_money(obj)
}

</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
.bet_single_info{
    display: flex;
    justify-content: space-between;
  }
  .bet_single_info_btn{
      width: 25%;
      font-size: 16px;
      background: var(--q-gb-t-c-1);
      color: var(--q-gb-t-c-14);
      border-radius: 10px;
      height: 0.38rem;
      margin-top: 0.1rem;
      margin-left: .08rem;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .nonebox4-third {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 20px;
  }
  .nonebox4-third-left {
      display: flex;
      flex: 1;
      align-items: center;
      font-size: 14px;
      margin-left: 10px;
      margin-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-right: 10px;
      border-radius: 10px;
      color: #e8f5fe;
      background-color: #f4f9ff;
  }
  @import url("src/base-h5/css/bet/bet_single_detail.scss");
  .bet_single_detail{
    margin-top: 0.08rem;
    background: var(--q-gb-bg-c-22);
    border-radius: 0.01rem;
    display: flex;
    justify-content: space-between;
    border-radius: 0.12rem;
    width: 100%;
    height: 0.44rem;
    .content-rmb{
      font-family: PingFang SC;
      
      font-weight: 500;
      letter-spacing: 0px;
      text-align: center;
      height: 0.4rem;
      border-radius: 4px;
      font-size: 0.14rem;
      padding-right: 0.1rem;
      position: relative;
      display: flex;
      align-items: center;
      color: var(--q-gb-t-c-11);
    }
  }
  .bet-single-detail {
    height: 0.56rem;
    position: relative;
  }
  /* ************** 右边内容 ************** -S */
  .content-b {
    height: 0.4rem;
    border-radius: 4px;
    font-size: 0.16rem;
    overflow: hidden;
    padding-left: 0.1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 70%;
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