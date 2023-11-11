

<template>
    <div>
        <input class="bet-input" v-model="ref_data.money" type="number" @input="set_win_money" @click="show_quick_amount(true)"
        :placeholder="`Limits ${ref_data.min_money} ~ ${ref_data.max_money}`" maxLength="11"  />
    </div>

</template>

<script setup> 
import { reactive,onMounted,onUnmounted } from "vue"
import lodash_ from 'lodash'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import mathJs from 'src/core/bet/common/mathjs.js'
import { useMittEmit,useMittOn,MITT_TYPES,UserCtr } from "src/core/"

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
    
})


onMounted(() => {
    // set_ref_data_bet_money()
    // 监听 限额变化
    useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).on
})

onUnmounted(() => {
    useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off
})


// 限额改变 修改限额内容
const set_ref_data_bet_money = () => {
    console.error('ssss')
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
}

// 输入判断
const set_win_money = () => {
    // 输入控制 在2位小数 todo
    if (ref_data.money > ref_data.max_money) {
        // 超出最大限额 使用 最大限额 作为投注金额
        ref_data.money = ref_data.max_money
        // 修改页面提示 1: 输入金额超出最大限额时
        BetViewDataClass.set_input_money_state(1)
    }
    BetData.set_bet_amount(ref_data.money)
    // 计算最高可赢金额
    // ref_data.win_money = ref_data.money * props.item.oddFinally
}

// 快捷金额 state true   false
const show_quick_amount = state => {
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
    background: #FFF6F0;
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
    border: 0.5px solid #A4A4A4;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 0 8px;
    display: flex;
    align-itemss: center;
    transition: .3s;
    caret-color:#FF7000;
     
    &:focus,&:focus-visible{
        transition: .02s;
        outline: none;   
       // padding-left: 14px;
        border: 0.5px solid #FF7000;
        box-shadow: 0px 1px 4px rgba(255, 112, 0, 0.1)
    }
    &::-webkit-input-placeholder {/*Chrome/Safari*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-itemss: center;
        color: #8A8986;
    }
    &::-moz-placeholder {/*Firefox*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-itemss: center;
        color: #8A8986;
    }
    &::-ms-input-placeholder {/*IE*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-itemss: center;
        color: #8A8986;
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