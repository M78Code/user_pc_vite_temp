
<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}-{{BetData.bet_data_class_version}}- {{UserCtr.user_version}}</div>
        <div class="f-b-s bet-content" :class="items.ol_os != 1 ? 'bet-disable' : ''">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c text-1a1 ">
                    <span class="text-flow-none" v-html="items.handicap"></span> 
                </div>
                <div class="w-100 handicap my-4">
                    <span class="mr-4 text-009 text-flow-none" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bowls") + ']'}}</span>
                    <span class="text-a1a text-flow-none mr-4 font400 text-a1a-i">{{ items.playName }}
                        <span v-if="[4,19,143,113].includes(items.playId*1)">{{items.matchType == 2? items.mark_score : ''}}</span>
                    </span>
                    <!-- 盘口 -->
                    <span class="text-a1a text-flow-none text-009 font400" v-if="ref_data.only_win.includes(items.playId*1)">[{{ i18n_t(`odds.EU`) }}] </span> 
                    <span class="text-a1a text-flow-none text-009 font400" v-else>[{{ i18n_t(`odds.${UserCtr.odds.cur_odds}`) }}] </span> 
                </div>
                <div class="w-100 fon12 font400 text-8A8986-i">{{ items.tid_name }}</div>
                <div class="w-100 fon12 font400 text-8A8986-i" v-if="items.home">{{ items.home }} <span class="mx-4">v</span> {{ items.away }} {{ items.matchType == 2? items.mark_score : ''}}
                </div>
            </div>
            <div class="fw-e-s bet-right" v-if="items.ol_os == 1">
                <div class="f-c-c bet-money">
                    <div class="show_img">
                        <img v-if="items.red_green == 'red_up'" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/icon_up.png`" alt=""/>
                        <img v-if="items.red_green == 'green_down'" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/icon_down.png`" alt=""/>
                    </div>
                    <span class="font14 font700 mr-10 bet-odds-value" :class="{'red-up':items.red_green == 'red_up','green-down':items.red_green == 'green_down'}">
                        @{{ compute_value_by_cur_odd_type(items.odds,items.playId,'',items.sportId) }}
                    </span>
                    <BetInput :items="items" />
                </div>
                <div class="font12 h12 mt-4">
                    <span class="font400 mr-10 text-8A8986-i"> {{ i18n_t('common.maxn_amount_val') }}</span>
                    <span class="text-1a1 font500" v-if="[1].includes(items.playId*1)"> 
                        {{ formatMoney(mathJs.subtract(mathJs.multiply(BetData.bet_amount,items.oddFinally), BetData.bet_amount)) || '0.00' }} 
                    </span>
                    <span class="text-1a1 font500" v-else>
                        {{ formatMoney(mathJs.subtract(mathJs.multiply(BetData.bet_amount,items.oddFinally),(UserCtr.odds.cur_odds == 'HK' ? 0 : BetData.bet_amount))) || '0.00' }} 
                    </span>
                </div>
            </div>

            <div class="fw-e-s bet-right bet-invalid" v-else>
                <div class="bet-disabled">
                    <span>{{ i18n_t('bet.bet_invalid') }}</span>
                </div>
            </div>
          

            <div class="bet-delete" v-if="BetViewDataClass.bet_order_status == 1" @click="set_delete">
                <span class="icon-delete"></span>
            </div>

            <div class="bet-delete bet-icon" v-else>
                <!-- 投注确认中 -->
                <img v-if="BetViewDataClass.bet_order_status == 2" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
                <!-- 投注失败 -->
                <img v-if="BetViewDataClass.bet_order_status == 3" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
                <!-- 投注成功 -->
                <img v-if="BetViewDataClass.bet_order_status == 4" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
            </div>
           
        </div>
        <ul class="bet-bet-money f-b-c" v-show="ref_data.show_money && items.ol_os == 1">
            <li class="bet-money-li f-c-c font14" @click="set_bet_money(obj)" v-for="(obj, index) in ref_data.money_list" :key="obj" :class="bet_money_btn_class(obj, index)" >
                {{index == 'max' ? '' : '+' }}{{obj}}
            </li>
        </ul>
    </div>
</template>

<script setup>

import { onMounted, onUnmounted, reactive } from "vue"
import {LOCAL_PROJECT_FILE_PREFIX,compute_value_by_cur_odd_type,useMittOn,MITT_TYPES,useMittEmit,UserCtr,i18n_t,formatMoney } from "src/output/index.js"
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import mathJs from 'src/core/bet/common/mathjs.js'
import lodash_ from "lodash"

import BetInput from "./bet-input.vue"  // 投注输入框

const props = defineProps({
    items:{},
    index:{}
})

const ref_data = reactive({
    only_win: [1,37,242,1,153,20001,20043],
    show_money: false, // 显示快捷金额
    max_money: 0, // 最大限额
    money_list: [],
    emit_lsit: {}
})

onMounted(()=>{
    // 单关 单注默认显示快捷金额
    if(BetData.is_bet_single){
        ref_data.show_money = true
      
        let money_list = lodash_.get(UserCtr, 'cvo.single', { qon: 100, qtw: 500, qth: 1000, qfo: 2000 })
        money_list.max = 'MAX'
        ref_data.money_list = money_list
    }
    ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off,
        emitter_2: useMittOn(MITT_TYPES.EMIT_SHOW_QUICK_AMOUNT, set_show_quick_money).off
    }
})

onUnmounted(()=>{
    Object.values(ref_data.emit_lsit).map((x) => x());
})

const set_ref_data_bet_money = () => {
    const {max_money = 8888 } = lodash_.get(BetViewDataClass.bet_min_max_money, `${props.items.playOptionsId}`, {})
    ref_data.max_money = max_money
}

// 快捷金额 显示隐藏
const set_show_quick_money = (obj = {}) => {
    ref_data.show_money = obj.show
    obj.money_list.max = 'MAX'
    ref_data.money_list = obj.money_list
    ref_data.max_money = obj.max_money
}

// 判断快捷金额按钮是否可点击
const bet_money_btn_class = (obj, index) => {
    let className = '';
    if(ref_data.max_money > 0) {
        if(index != 'max' && (ref_data.max_money < obj || ref_data.max_money < BetData.bet_amount || UserCtr.balance < obj)) {
            className = 'disabled'
        }
    }
    return className;
}

// 快捷金额
const set_bet_money = obj => {
    // 获取当前投注金额
    let money = BetData.bet_amount
    let money_ = obj
    // 设置最大投注金额
    if(obj == "MAX"){
        money_ = ref_data.max_money
    }
    // 计算投注金额
    let money_amount = mathJs.add(money,money_)
    // 投注金额 不能大于最大投注金额 也不能大于用户约
    if(money_amount < ref_data.max_money && money_amount < UserCtr.balance){
        BetData.set_bet_amount(mathJs.add(money,money_))
    }else{
        // 最大限额不能大于余额
        let money_a = ref_data.max_money
        if(UserCtr.balance < ref_data.max_money){
            money_a = UserCtr.balance
        }
        BetData.set_bet_amount(money_a)
    }
    useMittEmit(MITT_TYPES.EMIT_SET_QUICK_AMOUNT)
}

const set_delete = () => {
    // document.getElementsByClassName("bet-list")[0].style.display = "none"
    // BetData.set_bet_state_show(!BetData.bet_state_show)
    BetData.set_delete_bet_info(props.items.playOptionsId,props.index)
}

</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
.bet-list {
    .bet-content {
        min-height: 76px;
        padding: 12px;
        padding-left: 34px;
        font-size: 13px;
        font-weight: 500;
        font-style: normal;
        position: relative;
        &.bet-disable{
            align-items: center;
        }

        .bet-money {
            height: 34px;
        }

        .bet-delete {
            position: absolute;
            top: 11px;
            left: 12px;
            cursor: pointer;

            img {
                width: 12px;
                height: 12px;
            }

            &.bet-icon {
                cursor: auto;
            }
        }

        .bet-odds {
            height: 34px;
        }

        .bet-right {
            width: 160px;
            &.bet-invalid{
                height: 100%;
                .bet-disabled{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-content: center;
                    align-items: center;
                    span{
                        display: inline-block;
                        padding: 0 20px;
                        height: 26px;
                        display: inline-block;
                        border-radius: 2px;
                        line-height: 26px;
                        background: var(--q-gb-bg-c-10);
                        font-size: 12px;
                        font-weight: 500;
                        letter-spacing: 0px;
                        color: var(--q-gb-t-c-8);
                    }
                }
            }
        }

        .bet-left {
            width: 230px;
            .text-a1a-i {
                color: var(--q-gb-t-c-5) !important;
            }
        }

        .text-8A8986-i {
            color: var(--q-gb-t-c-8) !important
        }
    }

    .bet-bet-money {
        width: 100%;
        padding: 10px 12px;
        background: var(--q-gb-bg-c-15);

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

    .bet-market{
        font-family: DIN;
        font-size: 13px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
        //http://api.sportxxxvo3.com/
    }
    .text-flow{
        max-width: 90%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :deep(.ty-span) {
            margin-left: 4px;
            color: var(--q-gb-t-c-2);
        }
    }
    .handicap{
        max-width: 190px;
    }
    .text-flow-none{
        max-width: 84%;
        line-height: 16px;
        word-wrap: break-word;
        :deep(.ty-span) {
            margin-left: 4px;
            color: var(--q-gb-t-c-2);
        }
    }
    .bet-odds-value{
        color: var(--q-gb-t-c-2);
    }
    .red-up{
        color: var(--q-gb-t-c-7);
    }
    .green-down{
        color: var(--q-gb-t-c-6);
    }
    .show_img{
        width:12px;
        padding: 3px;
        img{
            width: 100%;
            height: 100%;
        }
    }
}


</style>