

<template>
    <div>
        <input class="bet-input" v-model="ref_data.money" type="number" @input="set_win_money" @click="show_quick_amount(true)" @keydown.enter="keydown($event)"
        :placeholder="`${i18n_t('bet.money_range')} ${ref_data.min_money}~${format_money2(ref_data.max_money)}`" maxLength="11"  />
    </div>

</template>

<script setup> 
import { reactive,onMounted,onUnmounted } from "vue"
import lodash_ from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { useMittEmit,useMittOn,MITT_TYPES,UserCtr,format_money2 } from "src/core/"
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
const props = defineProps({
    items:{},
})

const ref_data = reactive({
    min_money: '', // 最小投注金额
    max_money: '', // 最大投注金额
    win_money: 0.00, // 最高可赢
    money: '', // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    seriesOdds: '', // 赔率
    show_quick: false, // 显示快捷金额
    emit_lsit: {},
})

onMounted(() => {
    // set_ref_data_bet_money()
      // 监听 限额变化
    ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off,
        emitter_2: useMittOn(MITT_TYPES.EMIT_SET_QUICK_AMOUNT, set_quick_money).off
    }
})

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

// 设置快捷金额
const set_quick_money = () => {
    // 输入金额 不能大于最大金额
    if( BetData.bet_amount > ref_data.max_money ){
        ref_data.money = ref_data.max_money
    }else{
        ref_data.money = BetData.bet_amount
    }
}

// 键盘回车事件
const keydown = (e) => {
    e.preventDefault();
    // 未投注之前 可以点击
    if(BetViewDataClass.bet_order_status == 1){
        submit_handle()
    }
}

// 限额改变 修改限额内容
const set_ref_data_bet_money = () => {
    let value = props.items.playOptionsId
    // 串关获取 复试连串
    if (!BetData.is_bet_single) {

        // 复式连串关投注
        const { id, name, count } = BetViewDataClass.bet_special_series[props.index]
        special_series.id = id
        special_series.name = name
        special_series.count = count
        // 串关 type
        value = id
    }

    const { min_money = 10, max_money = 8888, seriesOdds } = lodash_.get(BetViewDataClass.bet_min_max_money, `${value}`, {})
    // 最小限额
    ref_data.min_money = min_money
    // 最大限额
    ref_data.max_money = max_money
    // 复试串关赔率
    ref_data.seriesOdds = seriesOdds
    // 限额改变 重置投注金额
    ref_data.money = ''

    if(ref_data.show_quick){
        show_quick_amount(ref_data.show_quick)
    }
}

// 输入判断
const set_win_money = () => {
    console.error('sss')
    // 输入控制
    if( ref_data.money < ref_data.max_money &&  ref_data.money < UserCtr.balance){
        BetData.set_bet_amount(ref_data.money)
    }else{
        // 最大限额不能大于余额
        let money_a = ref_data.max_money
        if(UserCtr.balance < ref_data.max_money){
            money_a = UserCtr.balance
        }
        ref_data.money = money_a
        BetData.set_bet_amount(money_a)
    }
   
    // 计算最高可赢金额
    // ref_data.win_money = ref_data.money * props.item.oddFinally
}

// 快捷金额 state true   false
const show_quick_amount = state => {
    ref_data.show_quick = state
    let money_list = []
    if(state){
        if (BetData.bet_is_single) {
           money_list = lodash.get(UserCtr, 'cvo.series', { qon: 10, qtw: 50, qth: 100, qfo: 200 })
        } else {
           money_list = lodash.get(UserCtr, 'cvo.single', { qon: 100, qtw: 500, qth: 1000, qfo: 2000 })
        }
    }
    let obj = {
        show: state,    
        money_list,
        max_money: ref_data.max_money,
    }
    useMittEmit(MITT_TYPES.EMIT_SHOW_QUICK_AMOUNT, obj)
}

</script>

<style scoped lang="scss">
.bet-input-focus{
    position: relative;
    background: var(--q-gb-bg-c-18);
    transition: .3s;
    &:after{
         //width: 1px;
         //height: 14px;
        // transition: .3s;
        // content: '';
        // position: absolute;
        //left: 8px;
        // top: 50%;
       //  margin-top: -7px;
      //  background: #FF7000;
        // z-index: 9;
    }
     .bet-input{
        // padding-left: 14px;
     }
}
.bet-input{
    width: 130px;
    height: 34px;
    background: none;
    border: 0.5px solid var(--q-gb-bd-c-5);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 0 8px;
    display: flex;
    align-itemss: center;
    transition: .3s;
    caret-color:var(--q-gb-t-c-2) ;
     
    &:focus,&:focus-visible{
        transition: .02s;
        outline: none;   
       // padding-left: 14px;
        border: 0.5px solid var(--q-gb-bd-c-1);
        box-shadow: 0px 1px 4px rgba(255, 112, 0, 0.1);
        background: var(--q-gb-bg-c-18);
    }
    &::-webkit-input-placeholder {/*Chrome/Safari*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-itemss: center;
        color: var(--q-gb-t-c-8);
    }
    &::-moz-placeholder {/*Firefox*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-itemss: center;
        color: var(--q-gb-t-c-8);
    }
    &::-ms-input-placeholder {/*IE*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-itemss: center;
        color: var(--q-gb-t-c-8);
    }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>