<template>
    <!--金额输入区域包括键盘 -->
    <div class="row bet-single-input" :data-check-money="BetViewDataClass.input_money_state">
        <div class="bet-single-serve" v-if="!BetData.is_bet_single">
            <span>{{ special_series.name }}</span>
            <span>{{ ref_data.seriesOdds  }}</span>
        </div>
        <!--金额输入区-->
        <div class="bet-input-failure">
            <!--投注金额输入框-->
            <input v-model="ref_data.money" type="number" @input="set_win_money"
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
                <div class="col-auto bet-win-money yb-number-bold">{{ set_bet_money }}</div>
            </div>

            <!--键盘区域-->
            <div class="row bet-keyboard bet-keyboard-zone">
                <bet-keyboard ref="bet-keyboard" @keypress_handle="set_click_keybord" :input_max_money="ref_data.max_money"
                    :status="ref_data.active"></bet-keyboard>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue"
import BetKeyboard from "../common/bet-keyboard.vue"

import lodash_ from 'lodash'
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { format_odds, format_currency, format_currency2 } from "src/output/index.js"
import { IconWapper } from 'src/components/icon'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
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
    money: '', // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    seriesOdds: '', // 赔率
})

// 复式连串过关投注
const special_series = reactive({
    id: '',
    name: '',
    count: "",
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
    useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).on
})

onUnmounted(() => {
    useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off
})

const bet_clear_handle = () => {
    ref_data.money = ''
}

// 计算最高可赢金额
const set_bet_money = computed(() => {
    // 串关使用 限额赔率 = 每一个赛事赔率相乘
    let money = BetData.is_bet_single ? props.item.oddFinally : ref_data.seriesOdds
    // 常量 精度值（赔率为+万位）
    let number = 100000
    // 最高可赢金额 = 赔率 * 投注金额 - 投注金额 
    let multiply_money = mathJs.subtract(mathJs.multiply(ref_data.money, money, number), mathJs.multiply(ref_data.money, 1, number))
    // 最高可赢金额 / 常量
    let win_money = mathJs.divide(multiply_money, number)
    // 格式化
    return format_currency(win_money)
})

// 限额改变 修改限额内容
const set_ref_data_bet_money = () => {
    let value = props.item.playOptionsId
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

// 快捷金额
const set_click_keybord = obj => {
    // 快捷金额 max 使用限额最大金额作为投注金额
    if (obj.text == 'MAX') {
        ref_data.money = ref_data.max_money
    } else {
        // 投注金额 = 快捷金额 加上 原有的投注金额
        let max_money = ref_data.money * 1 + obj.value
        // 投注金额 大于 最大投注限额 则 使用最大限额作为投注金额
        if (max_money > ref_data.max_money) {
            ref_data.money = ref_data.max_money
        } else {
            ref_data.money = max_money
        }
        // 记录投注金额 单关 不合并
        BetData.set_bet_amount(ref_data.money)
    }
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
    align-items: center;
    margin-bottom: 10px;
}

</style>