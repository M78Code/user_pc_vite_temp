<template>
    <div class="q-card__section">
        <!--金额输入区域包括键盘 -->
        <div class="row bet-multiple-input background-color-bet-box ">
            <div class="col bet-win">
                <div class="row font14">
                    <div>{{i18n_t('bet.bet_multiple')}}</div>
                    <div class="bet-count">
                        <span>{{ BetData.bet_single_list.length}}</span>
                        <span>x</span>
                    </div>
                </div>
                <div class="row text-color-max-win mt2">
                        <!--最高可赢额-->
                    <div>{{ i18n_t('common.maxn_amount_val') }}</div>
                    <div class="bet-win-money yb-number-bold"> {{ winMoney()  }} RMB</div>
                </div>
                    <!--金额-->
                <!-- <div class="col-auto bet-win-money yb-number-bold"> {{ winMoney()  }} RMB</div> -->
            </div>
            <!--金额输入区-->
            <div class="col-auto right-input">
                <!--投注金额输入框-->
                <input class="bet-input" v-model="ref_data.money" type="number" @input="set_win_money" @keydown.enter="keydown($event)"
                :placeholder="`${i18n_t('bet.money_range')} ${ref_data.min_money} ~ ${format_money3(ref_data.max_money)}`" maxLength="11" />
                <!--清除输入金额按钮-->
                <div class="bet-input-close" @click.stop="bet_clear_handle" v-if="ref_data.money && !BetData.is_bet_single">
                    <icon-wapper name="icon-failure" size="12px" />
                </div>
            </div>
        </div>
        
        <div v-show="false">{{ UserCtr.user_version }}--{{BetData.bet_data_class_version}}-{{BetViewDataClass.bet_view_version}}</div>
        <div v-show="ref_data.keyborard" class="row bet-keyboard bet-keyboard-content">
            <div class="col">
                <bet-keyboard :oid="ref_data.oid"/>
            </div>
        </div>
    </div>
    
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed,nextTick} from "vue"
import BetKeyboard from "./bet-keyboard.vue"
import { IconWapper } from 'src/components/icon'
import lodash_ from 'lodash'
import { useMittOn, MITT_TYPES,useMittEmit} from "src/core/mitt/index.js"
import { format_odds, formatMoney,format_currency, format_currency2, format_money3 } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { UserCtr } from "src/output/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'

const ref_data = reactive({
    DOM_ID_SHOW: false,
    active: 1,    //投注项状态
    appoint: true, // 是否预约
    odds_change_up: false,  // 赔率上升
    odds_change_down: false, // 赔率下降
    min_money: 10, // 最小投注金额
    max_money: 8888, // 最大投注金额
    win_money: 0.00, // 最高可赢
    money: "", // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    emit_lsit: {},
    oddFinallyArr:[],
    oid:[]
})

const props = defineProps({
    index: {
        type: Number,
        default: 0
    },
})

//监听最高可赢变化
const winMoney = computed(()=> state =>{
    let sum = 0
    BetData.bet_single_list.forEach((item)=>{
            sum += mathJs.subtract(mathJs.multiply(item.bet_amount,item.oddFinally), item.bet_amount)
    })
    return formatMoney(sum) 
})

onMounted(() => {
    nextTick(() => {
        // set_ref_data_bet_money()
        // 监听 限额变化
        ref_data.emit_lsit = {
            emitter_1: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off,
            emitter_2: useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_KEYBOARD, change_money_handle).off,
        }
    })
})

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */


 const change_money_handle = obj => {
    console.log('------------------------------change_money_handle--------------------------------', obj)
    if(obj.ids.length) {
        // 获取当前投注金额
        let money = BetData.bet_amount
        let money_ = obj.money
        // 设置最大投注金额
        if(obj.money == "MAX"){
            money_ = ref_data.max_money
        }
        // 计算投注金额
        let money_amount = mathJs.add(money,money_)
         // 投注金额 不能大于最大投注金额 也不能大于用户余额
         if(money_amount < ref_data.max_money && money_amount < UserCtr.balance){
                BetData.set_bet_amount(mathJs.add(money,money_))
                obj.ids.forEach(oid => {
                    BetData.set_bet_obj_amount(BetData.bet_amount, oid)
                })
                ref_data.money = money_amount
            }else{
                // 最大限额不能大于余额
                let money_a = ref_data.max_money
                if(UserCtr.balance < ref_data.max_money){
                    money_a = UserCtr.balance
                }  
                BetData.set_bet_amount(mathJs.add(money,money_))
                obj.ids.forEach(oid => {
                    BetData.set_bet_obj_amount(BetData.bet_amount, oid)
                })
                ref_data.money = money_a
            } 
        }
}

// 清空输入框金额
const bet_clear_handle = () => {
    ref_data.money = ''
    BetData.set_bet_amount(0)
    BetData.set_bet_obj_amount('',oid)
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

    let min_money_arr = []
    let max_money_arr = []

    BetData.bet_single_list.forEach((item)=>{
        let value = item.playOptionsId
        const { min_money = 10, max_money = 8888} = lodash_.get(BetViewDataClass.bet_min_max_money, `${value}`, {})
        min_money_arr.push(min_money)
        max_money_arr.push(max_money)
        ref_data.oid.push(item.playOptionsId)
        ref_data.oddFinallyArr.push(item.oddFinally)
    })
    ref_data.min_money = lodash_.max(min_money_arr) //多项单注限额最小值取多项里最大的
    ref_data.max_money = lodash_.min(max_money_arr) //多项单注限额最大值取多项里最小的
    // console.log('-------------------------------------------------------------------------------', min_money_arr, max_money_arr)
    ref_data.money = ""
    //设置键盘MAX限额
    let max_money_obj = {max_money:ref_data.max_money}
    BetData.set_bet_keyboard_config(Object.assign(BetData.bet_keyboard_config,max_money_obj))
}

// 输入判断
const set_win_money = () => {
    useMittEmit(MITT_TYPES.EMIT_BET_MULTIPLE_MONEY,ref_data)
     // 输入控制
     let sum = 0
     if( ref_data.money *1 < ref_data.max_money *1 &&  ref_data.money*1 < UserCtr.balance*1){
        //计算多项最高可赢
        BetData.bet_single_list.forEach((item)=>{
            sum += mathJs.subtract(mathJs.multiply(item.bet_amount,item.oddFinally), item.bet_amount)
        })
         ref_data.win_money = sum
    }else{
        // 最大限额不能大于余额
        if(UserCtr.balance*1 < ref_data.max_money*1){
            ref_data.max_money = UserCtr.balance
            ref_data.money = ref_data.max_money
        }
    }
    BetData.set_bet_amount(ref_data.money)
}

    
</script>

<style scoped lang="scss">
.text-color-max-win {
    color: var(--q-gb-t-c-8) !important
}
.background-color-bet-box {
    background: var(--q-gb-bg-c-15);
}

//谷歌
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

//火狐
input[type="number"] {
    -moz-appearance: textfield;
}

/**单关金额输入框**/
.bet-multiple-input {
    align-items: center;
    height: .58rem;
    border-bottom: 1px solid var(--q-gb-bd-c-6);
    .font14 {
        font-size: .14rem;
    }
    .bet-win {
        padding-left: .3rem;
    }
    .right-input {
        padding-right: .12rem;
    }
    .mt2 {
        margin-top: .02rem;
    }
    .bet-input-close {
        .icon-failure:before {
            color: var(--q-gb-t-c-18);
        }

        &:hover {
            .icon-failure:before {
                color: var(--qq--y0-text-color1);
            }
        }
    }
    // .bet-win-key {
    //     margin-top: 10px;
    // }

    /*  投注键盘区域 */
    .bet-keyboard-zone {
        padding-top: 8px !important;
        margin-left: -10px !important;
        margin-right: -10px !important;
    }
}

.bet-input-failure {
    position: relative;
    width: 100%;
}
.bet-single-serve{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.bet-input{
    width: 160px;
    height: 34px;
    background: none;
    border: 0.5px solid var(--q-gb-bd-c-5);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 0 0 0 8px;
    display: flex;
    align-items: center;
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
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: var(--q-gb-t-c-8);
    }
    &::-moz-placeholder {/*Firefox*/
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: var(--q-gb-t-c-8);
    }
    &::-ms-input-placeholder {/*IE*/
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: var(--q-gb-t-c-8);
    }
}
</style>