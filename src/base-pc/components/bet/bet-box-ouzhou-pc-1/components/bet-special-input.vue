

<template>
    <div >
        <div class="px-12 bet-money" >
            <div class="f-b-c pl-18 bet-input-info">
                <div>
                    <div class="font14">{{items?.name}} X{{items?.count}} {{items?.seriesOdds}}</div>
                    <div class="font12 h12">
                        <span class="font400 mr-10 text-8A8986-i"> {{ i18n_t('common.maxn_amount_val') }}</span>
                        <span class="text-8A8986-i font500" v-if="[1].includes(items.playId*1)"> 
                            {{ formatMoney(mathJs.subtract(mathJs.multiply(items.bet_amount,items.seriesOdds), items.bet_amount))  }} 
                        </span>
                        <span class="text-8A8986-i font500" v-else>
                            {{ formatMoney(mathJs.subtract(mathJs.multiply(items.bet_amount,items.seriesOdds),(UserCtr.odds.cur_odds == 'HK' ? 0 : items.bet_amount))) }} 
                        </span>
                    </div>
                </div>
        
                <div>
                    <input class="bet-input" v-model="ref_data.money" type="number" @input="set_win_money" @click="show_quick_amount()" @focus="stop_drap_fn(false)" @blur="stop_drap_fn(true)" @keydown.enter="keydown($event)"
                    :placeholder="`${i18n_t('bet.money_range')} ${format_money3(items.min_money)}~${format_money3(items.max_money)}`" maxLength="11"  />
                </div>
            
            </div>
            <div v-show="false">{{ UserCtr.user_version }}{{BetData.bet_data_class_version}}-{{BetViewDataClass.bet_view_version}}</div>
        </div>
        <div>
            <ul class="bet-bet-money f-b-c" v-show="items.show_quick">
                <li class="bet-money-li f-c-c font14" @click="set_bet_money(obj)" v-for="(obj, index) in ref_data.money_list" :key="obj" :class="bet_money_btn_class(obj, index)" >
                    {{index == 'max' ? '' : '+' }}{{obj}}
                </li>
            </ul>
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


.bet-bet-money {
    width: 100%;
    padding: 10px 12px;
    background: var(--q-gb-bg-c-15);
    border-top: 1px solid var(--q-gb-bd-c-6);

    .bet-money-li {
        width: 76px;
        height: 30px;
        border: 0.5px solid var(--q-gb-bd-c-5);
        background: var(--q-gb-bg-c-4);
        color: #505050;
        border-radius: 2px;
        transition: .3s;
        cursor: pointer;

        &:hover {
            // border: 1px solid #FF7000;
            border: 1px solid var(--q-gb-bd-c-1);
        }
        &.disabled{
            background: var(--q-gb-bg-c-19);
        }
    }
}

.bet-money{
    background: var(--q-gb-bg-c-15);
    .bet-input-info{
        height: 58px;
    }
    .text-8A8986-i {
        color: var(--q-gb-t-c-8) !important
    }
}
.bet-input-focus{
    position: relative;
    background: var(--q-gb-bg-c-18);
    transition: .3s;
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
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-itemss: center;
        color: var(--q-gb-t-c-8);
    }
    &::-moz-placeholder {/*Firefox*/
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-itemss: center;
        color: var(--q-gb-t-c-8);
    }
    &::-ms-input-placeholder {/*IE*/
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