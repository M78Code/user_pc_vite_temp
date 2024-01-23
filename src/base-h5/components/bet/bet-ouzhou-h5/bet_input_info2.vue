<!-- 单关，串关，投注金额输入框 -->
<template>
    <div class="bet_input_info flex_input component bet-input-info">
        <div v-show="false"> {{ UserCtr.user_version }} --
      {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version }}</div>
        <div class="info_left">
            <div class="size_16 color_a1a1">{{ i18n_t('bet.bet') }}</div>
            <div class="size_14">
                <span>{{ i18n_t('bet.total_win2') }}</span>
                <span class="margin_left_4">
                    {{ formatMoney(mathJs.subtract(mathJs.multiply(item.bet_amount,item.oddFinally), item.bet_amount)) }}
                </span>
            </div>
        </div>
      <!-- {{ BetData.active_index }}-{{ index }} -->
        <div class="info_right size_14" @click.stop="input_click(item, index, $event)" :class="{'active':BetData.active_index == index}">
            <div class="content-b">
                <span v-if="item.bet_amount" class="yb_fontsize20 money-number">{{item.bet_amount }}</span>

                <span class="money-span" ref="money_span" v-if="BetData.active_index == index" :style="{ opacity: '1' }"></span>

                <span class="yb_fontsize14 limit-txt" v-show="!item.bet_amount">{{ i18n_t('bet.money_range') }} {{ ref_data.min_money }}~{{ formatMoney(ref_data.max_money) }}</span>
            </div>

        </div>
    </div>
</template>

<script setup>
import lodash_ from "lodash"
import { onMounted, onUnmounted, reactive, ref } from "vue"
import { MITT_TYPES, useMittOn, formatMoney, UserCtr } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { nextTick } from "licia";

const props = defineProps({
    item: {
        default: () => { },
        type: Object,
    },
    index: {
        default: 0,
    },
})

const input_click = (item, index, event) => {
    event.preventDefault()
    BetData.set_bet_amount(item.bet_amount)
    let obj_config = lodash_.get(BetViewDataClass,`bet_min_max_money[${item.playOptionsId}]`,{}) || {}
    let obj = { 
        playOptionsId:props.item.playOptionsId,
        max_money:obj_config.max_money
    }
    // 设置 限额
    BetData.set_bet_keyboard_config(obj)
    BetData.set_active_index(index)
    nextTick(() => {
        BetData.set_bet_keyboard_show(true)
    })
}

// 光标
const money_span = ref(null)
let flicker_timer = null

const ref_data = reactive({
    min_money: '',  // 最小投注金额
    max_money: '', // 最大投注金额
    seriesOdds: '', // 串关复式投注赔率
    money: '', // 投注金额
    emit_lsit: {}
})

onMounted(() => {
    cursor_flashing()
    set_ref_data_bet_money()
    ref_data.emit_lsit = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off,
        emitter_2: useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_SINGLE, change_money_handle).off,
        emitter_3: useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY_UPDATE, set_ref_data_bet_money_update).off,
    }
})

onUnmounted(() => {
    Object.values(ref_data.emit_lsit).map((x) => x());
})

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
const change_money_handle = (new_money = {}) => {
    if(new_money.params.playOptionsId === props.item.playOptionsId) {
        ref_data.money = new_money.money
        BetData.set_bet_obj_amount(ref_data.money, props.item.playOptionsId)
    }
    // BetData.set_bet_amount(ref_data.money)
}

// 输入金额数据更新
const set_ref_data_bet_money_update = () => {
    ref_data.money = props.item.bet_amount
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
    // 设置键盘设置的限额和数据
    BetData.set_bet_keyboard_config({ 
        playOptionsId: props.item.playOptionsId,
        max_money
     })
}

/**
 *@description 光标闪动，animation有兼容问题，用函数替代
 *@return {Undefined} undefined
 */
const cursor_flashing = () => {
    clearInterval(flicker_timer)
    flicker_timer = setInterval(() => {
        money_span.value && money_span.value.classList.toggle('money-span3')
    }, 1000);
}

</script>


<style lang="scss" scoped>
.bet_input_info {
    height: 68px;
    padding-left: 0.7rem;
    background: var(--q-gb-bg-c-10);
    padding: 0 0.15rem;
    border-bottom: 1px solid  var(--q-gb-bd-c-1);

    .info_right {
        width: 1.62rem;
        height: .42rem;
        padding-left: .06rem;
        font-size: .20rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        border-radius: .02rem;
        border: 0.5px solid var(--q-gb-bd-c-12);
        background: var(--q-gb-bg-c-2);
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
        &.active{
            border: 1px solid var(--q-gb-bg-c-1);
            box-shadow: 0px 1px 4px 0px rgba(255, 112, 0, 0.10);
            caret-color: var(--q-gb-bd-c-1);
        }

        .content-b {
            display: flex;
            align-items: center;
        }

        .input_place {
            color: #8A8986;
            font-size: 12px;
            font-weight: 400;
        }

        .input_cursor {
            width: 2px;
            height: 14px;
            border-radius: 2px;
            background: var(--q-gb-bg-c-1);
        }

        .input_amount {
            //color:#1A1A1A ;
            color: var(--q-gb-t-c-4);

        }
    }

    .money_input_cursor {
        background: transparent;
        opacity: 0;
    }
}

.betting_await {
    padding: 0 12px;
    height: 39px;
    background: var(--q-gb-t-c-14);

}

.flex_input {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.size_14 {
    font-size: 0.14rem;
    font-weight: 400;
    color: var(--q-gb-t-c-3);
}

.margin_left_4 {
    margin-left: 4px;
    font-family: "DIN";
}

.size_16 {
    font-size: 0.16rem;
    font-weight: 500;
    color: var(--q-gb-t-c-4);
    margin-bottom: .08rem;
}

.color_ff700 {
    color: var(--q-gb-t-c-1);
}

.huise {
    color: #8A8986 !important;
}

.money-span {
    width: 0.02rem;
    height: 0.16rem;
    margin-right: 0.05rem;
    background: var(--q-gb-bg-c-1);

    &.money-span3 {
        background: #FFF6F0;
    }
}

.limit-txt {
    color: var(--q-gb-t-c-3);
    white-space: nowrap;
}</style>