<template>
    <!--金额输入区域包括键盘 -->
    <div class="row bet-single-input" :data-check-money="BetViewDataClass.input_money_state">
        <!--金额输入区-->
        <div class="bet-input-failure">
            <!--投注金额输入框-->
            <input v-model="ref_data.money" type="number" @input="set_win_money" @keydown.enter="keydown($event)"
                :placeholder="`${i18n_t('bet.money_range')} ${ref_data.min_money} ~ ${ref_data.max_money}`" maxLength="11" />
            <!--清除输入金额按钮-->
            <div class="bet-input-close" @click.stop="bet_clear_handle">
                <icon-wapper name="icon-failure" size="12px" />
            </div>
        </div>

        <div v-show="ref_data.keyborard" class="bet-win-key">
            <div class="row bet-win yb-fontsize12">
                <div class="col df-jb">
                    <!--最高可赢额-->
                    {{ i18n_t('common.maxn_amount_val') }}
                </div>
                <!--金额-->
                <div class="col-auto bet-win-money yb-number-bold">{{ formatMoney(mathJs.subtract(mathJs.multiply(item.bet_amount,item.oddFinally), item.bet_amount)) }}</div>
            </div>

            <!--键盘区域-->
            <div class="row bet-keyboard bet-keyboard-zone">
                <bet-keyboard />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue"
import BetKeyboard from "../common/bet-keyboard.vue"

import lodash_ from 'lodash'
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { format_odds, formatMoney,format_currency, format_currency2 } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import mathJs from 'src/core/bet/common/mathjs.js'
import { UserCtr } from "src/output/index.js"

const ref_data = reactive({
    DOM_ID_SHOW: false,
    active: 1,    //投注项状态
    appoint: true, // 是否预约
    odds_change_up: false,  // 赔率上升
    odds_change_down: false, // 赔率下降
    min_money: 10, // 最小投注金额
    max_money: 8888, // 最大投注金额
    win_money: 0.00, // 最高可赢
    money: '', // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    emit_lsit: {},
})

const props = defineProps({
    index: {
        type: Number,
        default: 0
    },
    item: {}
})

onMounted(() => {
    // 监听 限额变化
    ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off,
        emitter_2: useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_KEYBOARD, change_money_handle).off,
    }
    let min_max_obj = lodash_.get(BetViewDataClass,`bet_min_max_money[${props.item.playOptionsId}]`,{})
    BetData.set_bet_keyboard_config(min_max_obj)
})

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
 const change_money_handle = (new_money) => {
  if(props.item.id == new_money.params.id){
    if( new_money.money*1 > props.item.max_money *1){
      ref_data.money =  props.item.max_money
    }else{
      ref_data.money = new_money.money
    }
    BetData.set_bet_obj_amount(ref_data.money,props.item.playOptionsId)
  }
}

// 清空输入框金额
const bet_clear_handle = () => {
    ref_data.money = ''
    BetData.set_bet_obj_amount('',props.item.playOptionsId)
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
    let value = props.item.playOptionsId
 
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
    // 输入控制
    if( ref_data.money < ref_data.max_money &&  ref_data.money < UserCtr.balance){
        BetData.set_bet_obj_amount(ref_data.money,props.item.playOptionsId)
    }else{
        // 最大限额不能大于余额
        let money_a = ref_data.max_money
        if(UserCtr.balance < ref_data.max_money){
            money_a = UserCtr.balance
        }
        ref_data.money = money_a
        BetData.set_bet_obj_amount(money_a,props.item.playOptionsId)
    }
}
</script>

<style scoped lang="scss">
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
.bet-single-input {
    margin-top: 8px;

    input {
        width: 100%;
        padding: 4px 6px;
        margin-top: 2px;
        height: 32px;
        line-height: 18px;
        outline: none;
        border-radius: 4px;
        font-size: 16px;
        background: var(--q-gb-bg-c-11);
        border: 0.5px solid var(--q-gb-bd-c-7);
        border-radius: 6px;
        color: var(--q-gb-t-c-6);
        caret-color: var(--qq--y0-text-color1);

        // 输入金额时的样式
        &.bet-input-money {
            outline: none;
        }
    }

    // .input-border {
    //   &:focus {
    //     border: 0.5px solid rgba(44,178,255,1);
    //   }
    // }
    input::-webkit-input-placeholder {
        font-size: 14px;
        color: rgba(108, 123, 168, 0.4);
    }

    input::-moz-placeholder {
        font-size: 14px;
        color: rgba(108, 123, 168, 0.4);
    }

    input:-moz-placeholder {
        font-size: 14px;
        color: rgba(108, 123, 168, 0.4);
    }

    input:-ms-input-placeholder {
        font-size: 14px;
        color: rgba(108, 123, 168, 0.4);
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

    .bet-input-close {
        position: absolute;
        top: 13px;
        right: 5px;
        cursor: pointer;
        width: auto;
        height: auto;
    }

    .bet-win-key {
        margin-top: 10px;
    }

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
    align-item: center;
    margin-bottom: 10px;
}

</style>