<template>
    <div class="q-card__section">
        
        <div class="odds-wrap row">
            <div class="line"></div>
            <div class="col">{{i18n_t('bet.bet_multiple')}}</div>
        </div>
        <!--金额输入区域包括键盘 -->
        <div class="row bet-multiple-input yb-flex-nowrap">
            <!--金额输入区-->
            <div class="col bet-count">
                <span>2</span>
                <span>x</span>
            </div>
            <div class="col-auto right-input">
                <!--投注金额输入框-->
                <input class="input-border" v-model="ref_data.money" type="number" @input="set_win_money" @keydown.enter="keydown($event)"
                placeholder="`${i18n_t('bet.money_range')} ${ref_data.min_money} ~ ${ref_data.max_money}`" maxLength="11" />
                <!--清除输入金额按钮-->
                <div class="bet-input-close" @click.stop="bet_clear_handle" v-if="ref_data.money">
                    <icon-wapper name="icon-failure" size="12px" />
                </div>
            </div>
        </div>
        <div v-show="false">{{ UserCtr.user_version }}-{{ BetData.bet_data_class_version }}</div>
        <div class="row bet-win yb-fontsize12">
            <div class="col df-jb">
                    <!--最高可赢额-->
                 {{ i18n_t('common.maxn_amount_val') }}
            </div>
                <!--金额-->
            <div class="col-auto bet-win-money yb-number-bold">{{ formatMoney() }}RMB</div>
        </div>
         
        <div v-show="ref_data.keyborard" class="row bet-keyboard bet-keyboard-content">
            <div class="col">
                <bet-keyboard />
            </div>
        </div>
    </div>
    
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue"
import BetKeyboard from "../common/bet-keyboard.vue"
import { IconWapper } from 'src/components/icon'
import lodash_ from 'lodash'
import { useMittOn, MITT_TYPES,useMittEmit} from "src/core/mitt/index.js"
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
    money: "", // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    emit_lsit: {}
})

const props = defineProps({
    index: {
        type: Number,
        default: 0
    },
})

onMounted(() => {
    // 监听 限额变化
    ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off,
        emitter_2: useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_KEYBOARD, change_money_handle).off,
    }
})

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
 const change_money_handle = (new_money) => {
 
}

// 清空输入框金额
const bet_clear_handle = () => {
    ref_data.money = ''
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
    })
    ref_data.min_money = lodash_.min(min_money_arr)
    ref_data.max_money = lodash_.max(max_money_arr)
    ref_data.money = ""
}



// 输入判断
const set_win_money = () => {
    useMittEmit(MITT_TYPES.EMIT_BET_MULTIPLE_MONEY,ref_data)
     // 输入控制
     if( ref_data.money < ref_data.max_money &&  ref_data.money < UserCtr.balance){
        // BetData.set_bet_obj_amount(ref_data.money,props.item.playOptionsId)
    }else{
        // 最大限额不能大于余额
        let money_a = ref_data.max_money
        if(UserCtr.balance < ref_data.max_money){
            money_a = UserCtr.balance
        }
        ref_data.money = money_a
        // BetData.set_bet_obj_amount(ref_data.money,props.item.playOptionsId)
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
// input[type="number"] {
//     -moz-appearance: textfield;
// }

/**单关金额输入框**/
.bet-multiple-input {
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
        top: 34px;
        right: 5px;
        cursor: pointer;
        width: auto;
        height: auto;
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

</style>