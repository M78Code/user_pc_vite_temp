

<template>
        <!-- 串关 底部预计收益 -->
    <div class="bet-result f-b-c pl-30 pr-20" v-if="!BetData.is_bet_single">
        <div class="bet-result-info">
            <span class="font12 font500 bet-returm mr-4">{{ i18n_t("bet.total_bet")}}</span>
            <span class="font14 font500 bet-money ">{{ total() }}</span>
        </div>
        <div class="bet-result-info">
            <span class="font12 font400 bet-returm mr-4">{{ i18n_t("bet.total_income") }}</span>
            <span class="font14 font500">{{ winMoney() }}</span>
        </div>
    </div>

    <template>
        <div>{{i18n_t("bet.bet_min_item").replace('%s',BetData.mix_min_count)}}</div>
    </template>

    <div v-show="false">  {{BetData.bet_data_class_version}}-{{BetViewDataClass.bet_view_version}}-{{BetViewDataClass.error_code}}-{{BetViewDataClass.error_message}}-{{i18n_t.locale}}-{{UserCtr.user_version}}</div>

    <div class="bet-footer">
        <div class="bet-state" v-if="!BetData.is_bet_single && BetData.bet_s_list.length < BetData.mix_min_count">
            <div class="w-100 f-c-c bet-title bet-error">
                {{i18n_t("bet.bet_min_item").replace('{num}',BetData.mix_min_count)}}
            </div>
        </div>
        <div class="bet-state" v-if="BetViewDataClass.error_message">
            <div class="w-100 f-c-c bet-title" :class="{'bet-success':BetViewDataClass.error_code == 200, 'bet-loading':BetViewDataClass.error_code == '0000000', 'bet-error': ![200,'0000000'].includes(BetViewDataClass.error_code)}">
                {{ BetViewDataClass.error_code_list.includes(BetViewDataClass.error_code) ? i18n_t(BetViewDataClass.error_message) : BetViewDataClass.error_message }}
            </div>
        </div>
        <div class="f-b-c bet-content" v-if="BetViewDataClass.bet_order_status == 1" >
            <div class="font16 font400 f-c-c bet-bet-cancel" @click="set_bet_cancel">{{ i18n_t("bet.bet_cancel") }}</div>
            <div class="font16 font600 f-c-c bet-place-bet" @click="set_bet_submit" :class="{ 'bet-expired': BetViewDataClass.bet_expired}" >{{ i18n_t("ouzhou.bet.place_bet") }}</div>
        </div>
        <div class="f-b-c bet-content" v-else>
            <div class="font16 font400 f-c-c bet-bet-cancel" @click="set_retain_selection">{{ i18n_t("bet.save_item") }}</div>
            <div class="font16 font600 f-c-c bet-place-bet" @click="set_confirm">{{ i18n_t("common.confirm") }}</div>
        </div>
        <template v-if="BetData.bet_s_list.length < BetData.mix_min_count">
            <!--至少选择2场比赛-->
            
        </template>
    </div>
</template>

<script setup>
import {computed} from "vue"
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { i18n_t,UserCtr ,format_money2, formatMoney} from "src/output/index.js"

// 提交投注信息
const set_bet_submit = () => {
    // 未投注之前 可以点击
    if(BetViewDataClass.bet_order_status == 1 && !BetViewDataClass.bet_expired){
        submit_handle()
    }
}
// 取消投注
const set_bet_cancel = () => {
    BetData.set_clear_bet_info()
}

// 保留投注项
const set_retain_selection = () => {
    BetViewDataClass.set_bet_order_status(1)
    BetData.set_bet_amount(0)
    BetViewDataClass.set_bet_before_message({})
    BetViewDataClass.set_is_finally(true)
    setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
    }, 200);
}

// 清空投注项 和投注后的内容
const set_confirm = () => {
    BetViewDataClass.set_is_finally(true)
    BetData.set_clear_bet_info()
    BetViewDataClass.set_clear_bet_view_config()
}

// 串关底部收益
const winMoney = computed(()=> state =>{
    let sum = 0
    // if (BetData.bet_amount) {
    if (BetViewDataClass.bet_order_status === 1) {
        BetViewDataClass.bet_special_series.forEach((item)=>{
            if (item.bet_amount && item.seriesOdds) {
                sum += mathJs.subtract(mathJs.multiply(item.bet_amount, item.seriesOdds), item.bet_amount)
            } else {
                sum += 0
            }
        })
    } else {
        BetViewDataClass.orderNo_bet_single_obj.forEach((item)=>{
            sum += mathJs.divide(item.maxWinAmount, 100)
        })
    }
    // }
    return formatMoney(sum) 
})
// 串关底部数量
const total = computed(()=> state =>{
    let sum = 0
    if (BetViewDataClass.bet_order_status === 1) {
        BetViewDataClass.bet_special_series.forEach((item)=>{
            sum += (item.bet_amount ? item.bet_amount : 0)
        })
    } else {
        BetViewDataClass.orderNo_bet_single_obj.forEach((item)=>{
            sum += mathJs.divide(item.seriesBetAmount, 100)
        })
    }
    return sum
})

</script>

<style scoped lang="scss">
  @import "../css/bet.scss";
</style>

<style scoped lang="scss">
.bet-footer {
    width: 100%;
    background: var(--q-gb-bg-c-4);
    border-top: 0.5px solid var(--q-gb-bd-c-6);
    
    .bet-content {
        width: 100%;
        height: 100%;
        padding: 17px 12px;

        .bet-expired{
            background: var(--q-gb-bg-c-10) !important;
        }

        div {
            cursor: pointer;
        }
    }

    .bet-bet-cancel {
        border: 0.5px solid var(--q-gb-bd-c-5);
        width: 160px;
        height: 46px;
        border-radius: 2px;
        color: var(--q-gb-t-c-5);
    }

    .bet-place-bet {
        width: 240px;
        height: 46px;
        border-radius: 2px;
        background: var(--q-gb-bg-c-1) ;
        color: var(--q-gb-t-c-1);
    }

    .bet-state {
        padding: 12px 12px 0 12px;

        .bet-title {
            height: 40px;
            font-family: "Roboto";
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
            letter-spacing: 0px;

            &.bet-error {
                background: var(--q-gb-bg-c-16);
                color: var(--q-gb-t-c-7);
            }

            &.bet-success {
                background: var(--q-gb-bg-c-17);
                color: var(--q-gb-t-c-10);
            }

            &.bet-loading {
                background: var(--qgb-bg-c-1);
                color: var(--q-gb-t-c-2);
              }
        }
    }

}
.bet-result{
    width: 100%;
    background: var(--q-gb-bg-c-4);    
    padding: 0 20px;
    height: 50px;
    .bet-result-info{
        color: var(--q-gb-t-c-5);
        .bet-money{
            color: var(--q-gb-t-c-2);
        }
    }
    .icon_loading{
        width: 12px;
        height: 12px;
    }
}
</style>