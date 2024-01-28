<!-- 单关，串关，投注金额输入框 -->
<template>
    <div class="component bet-input-info1">
        <div class="bet_input_info flex_input">
       <div class="info_left">
       <div class="size_16 color_a1a1">{{i18n_t('bet.bet')}}</div>
        <div class="size_14">
            <span>{{i18n_t('bet.total_win2')}}</span>
            <span class="margin_left_4">{{}}</span>
        </div>
       </div>
       <div class="info_right size_14">
        <div class="content-b" @click.stop="input_click(item, index, $event)">
            <span v-if="ref_data.money" class="yb_fontsize20 money-number">{{ ref_data.money }}</span>
            <span class="money-span" ref="money_span" :style="{ opacity:  '1' }"></span>
            <span class="yb_fontsize14 limit-txt" v-show="!ref_data.money">{{ i18n_t('app_h5.bet.limit')}} {{ format_money(ref_data.min_money) }}~{{format_money(ref_data.max_money) }}</span>
          </div>
          
       </div>
    </div>
    </div>
</template>

<script setup>
import lodash_ from "lodash"
import { computed, onMounted, onUnmounted, reactive,ref } from "vue"
import {MITT_TYPES,useMittOn,format_money } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import keyBoard from './keyboard.vue';

const props = defineProps({
    item:{},
    index:{}
})

const input_click = (item,index,evnet) => {
  event.preventDefault()
  let obj_config = lodash_.get(BetViewDataClass,`bet_min_max_money[${item.playOptionsId}]`,{}) || {}
    let obj = { 
        playOptionsId:props.item.playOptionsId,
        max_money:obj_config.max_money
    }
    // 设置 限额
    BetData.set_bet_keyboard_config(obj)

  BetData.set_bet_keyboard_show(true)
  BetData.set_active_index(index)
}

// 设置限额
const set_min_max_money = computed(()=> (id,type) => {
  let obj = lodash_.get(BetViewDataClass.bet_min_max_money,`${id}`,{})
  return obj[type] || ''
})

// 光标
const money_span = ref(null)
let flicker_timer = null

const ref_data = reactive({
    min_money: '',  // 最小投注金额
    max_money: '', // 最大投注金额
    seriesOdds: '', // 串关复式投注赔率
    keyborard: true, // 是否显示 最高可赢 和 键盘
    money: '', // 投注金额
})

onMounted(()=>{
    cursor_flashing()
    useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money)
    //监听键盘金额改变事件
    useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY_SINGLE, change_money_handle)
})

onUnmounted(()=>{
    useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY).off
})

/**
 *@description 金额改变事件
 *@param {Number} new_money 最新金额值
 */
 const change_money_handle = (new_money) => {
  ref_data.money = new_money.money
}


// 限额改变 修改限额内容
const set_ref_data_bet_money = () => {
    let value = props.item.playOptionsId
    // 串关获取 复试连串
    if (!BetData.is_bet_single) {

        // 复式连串关投注
        const { id, name, count } = BetViewDataClass.bet_special_series[props.index] || {}
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

    // 设置键盘设置的限额和数据
    BetData.set_bet_keyboard_config({playOptionsId:props.item.playOptionsId})
}

/**
 *@description 光标闪动，animation有兼容问题，用函数替代
 *@return {Undefined} undefined
 */
 const cursor_flashing = () => {
  clearInterval(flicker_timer)
  flicker_timer = setInterval(() => {
    money_span.value && money_span.value.classList.toggle('money-span3')
  }, 700);
}

</script>


<style lang="scss" scoped>
.bet_input_info{
    height: 68px;
    padding-left: 0.7rem;
    background: var(--q-gb-t-c-6);
    padding: 0 0.15rem;

    .info_right{
        width: 152px;
        height: 44px;
        box-shadow: 0px 1px 4px 0px #FF70001A;
        border: 0.5px solid var(--q-gb-t-c-18);
        padding-left: 6px;
        background: var(--q-gb-t-c-13);
        caret-color: var(--q-gb-t-c-18);
        font-family: DIN;
        font-size: 20px;
        font-weight: 500;
        display: flex;
        align-items: center;
        .input_place{
            color:  #8A8986;
            font-size: 12px;
            font-weight: 400;
        }
        .input_cursor{
            width: 2px;
            height: 14px;
            border-radius: 2px;
            background: var(--q-gb-bg-c-18);
        }
        .input_amount{
            //color:#1A1A1A;
            color: var(--q-gb-t-c-4);
        }
    }
    .money_input_cursor{
        background: transparent;
        opacity: 0;
    }
}
.betting_await{
    padding: 0 12px;
    height: 39px;
    background: var(--gb-bg-c-2);

}
.flex_input{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.size_14{
    font-size: 14px;
    font-weight: 400;
    color: var(--q-gb-t-c-4);
}
.margin_left_4{
    margin-left: 4px;
    font-family: "DIN";
}
.size_16{
    font-size: 0.17rem;
    font-weight: 700;
    color: var(--q-gb-bg-c-3);
}
.color_ff700{
    color: var(--q-gb-t-c-18);
}
.huise{
    color: #8A8986 !important;
}
.money-span {
    width: 0.02rem;
    height: 0.16rem;
    margin: 0 1px;
    background: var(--q-gb-bg-c-1);
    &.money-span3{
      background: transparent;
    }
  }
  .limit-txt {
    color: var(--q-gb-t-c-3);
  }
</style>