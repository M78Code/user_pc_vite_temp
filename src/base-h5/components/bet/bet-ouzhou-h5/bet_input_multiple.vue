<!-- 多项合并输入 -->
<template>
    <div class="bet_input_info flex_input component bet-input-info">
        <div v-show="false"> {{ UserCtr.user_version }} --
      {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version }}</div>
        <div class="info_left">
            <div class="size_16 color_a1a1">
              <span> {{ i18n_t('bet.single_more') }} </span> 
              <span> {{ BetData.bet_single_list.length }}x </span> 
            </div>
            <div class="size_14">
                <span>{{ i18n_t('bet.total_win2') }}</span>
                <span class="margin_left_4" >
                    {{ winMoney() }}
                </span>
            </div>
        </div>
        <div class="info_right size_14" @click.stop="input_click($event)">
            <div class="content-b">
                <span v-if="ref_data.money" class="yb_fontsize20 money-number">{{ ref_data.money }}</span>

                <span class="money-span" ref="money_span" :style="{ opacity: '1' }"></span>

                <span class="yb_fontsize14 limit-txt" v-show="!ref_data.money">{{i18n_t('bet.money_range')}} {{ref_data.min_money}}~{{format_money3(ref_data.max_money)}}</span>
            </div>

        </div>
    </div>
</template>

<script setup>
import lodash_ from "lodash"
import { onMounted, onUnmounted, reactive, ref, computed } from "vue"
import { MITT_TYPES, useMittOn, formatMoney, UserCtr, format_money3, useMittEmit } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import mathJs from 'src/core/bet/common/mathjs.js'

const props = defineProps({
    item: {
        default: () => { },
        type: Object,
    },
    index: {
        default: 0,
    }
})

const input_click = (event) => {
    // console.error('index', BetData.bet_single_list.length)
    // event.preventDefault()
    let oid = BetData.bet_single_list.map(item => {
        return item.playOptionsId
    })
    BetData.set_bet_keyboard_config({ids:oid})
    BetData.set_bet_keyboard_show(true)
    BetData.set_active_index(BetData.bet_single_list.length)
    BetData.set_bet_amount(0)
}


// 光标
const money_span = ref(null)
let flicker_timer = null

const ref_data = reactive({
    min_money: 10, // 最小投注金额
    max_money: 8888, // 最大投注金额
    win_money: 0.00, // 最高可赢
    money: "", // 投注金额
    keyborard: true, // 是否显示 最高可赢 和 键盘
    emit_lsit: {},
    oddFinallyArr:[],
    oid:[],
})

onMounted(() => {
    cursor_flashing()
    useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money)
    //监听键盘金额改变事件
    useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_MERGE, change_money_handle)
})

onUnmounted(() => {
    useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off
    useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_MERGE, change_money_handle).off
})

//监听最高可赢变化
const winMoney = computed(()=> state =>{
    let sum = 0
    if (BetData.bet_amount) {
        BetData.bet_single_list.forEach((item)=>{
            sum += mathJs.subtract(mathJs.multiply(item.bet_amount,item.oddFinally), item.bet_amount)
        })
    }
    return formatMoney(sum) 
})

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
const change_money_handle = (obj) => {
    console.log('change_money_handle!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', obj)
    if(obj.params.playOptionsId) return
    if(obj.params.ids.length) {
        let money_ = obj.money
        BetData.set_bet_amount(money_)
        obj.params.ids.forEach(oid => {
            BetData.set_bet_obj_amount(BetData.bet_amount, oid)
        })
        ref_data.money = money_
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY_UPDATE)
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
    // let max_money_obj = {max_money:ref_data.max_money}
    // BetData.set_bet_keyboard_config(Object.assign(BetData.bet_keyboard_config,max_money_obj))
    console.log('BetData.bet_keyboard_config!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', BetData.bet_keyboard_config)
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

    .info_right {
        width: 162px;
        height: 42px;
        box-shadow: 0px 1px 4px 0px rgba(255, 112, 0, 0.10);
        border: 1px solid var(--q-gb-bg-c-1);
        padding-left: 6px;
        background: #FFF6F0;
        caret-color: var(--q-gb-bd-c-1);
        font-family: DIN;
        font-size: 20px;
        font-weight: 500;
        display: flex;
        align-items: center;
        border-radius: 2px;
        overflow: hidden;
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