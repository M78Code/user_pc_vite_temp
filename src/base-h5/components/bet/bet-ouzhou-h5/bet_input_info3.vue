<!-- 单关，串关，投注金额输入框 -->
<template>
    <div class="component bet-input-info1">
        <div v-show="false"> {{ UserCtr.user_version }} --
      {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version }}</div>
        <div class="bet_input_info flex_input">
       
       <div class="info_right size_14" @click.stop="input_click(items, index, $event)">
        <div class="content-b " :class="{'active':BetData.active_index == index}">
            <span v-if="valueModel || valueModel == 0" class="yb_fontsize12 money-number">{{ valueModel }}</span>
            <span class="money-span" ref="money_span" v-if="BetData.active_index == index && !readonly" :style="{ opacity:  '1' }"></span>
          </div>
          
       </div>
    </div>
    </div>
</template>

<script setup>
import lodash_ from "lodash"
import { onMounted, computed, reactive,ref, nextTick } from "vue"
import {MITT_TYPES,useMittOn,formatMoney,UserCtr } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import mathJs from 'src/core/bet/common/mathjs.js'

const props = defineProps({
    items: {
        default:()=>{},
        type:Object,
    },
    index: {
        default:0,
    },
    valueModel: {
        default: 0,
        type: Number || String
    },
    readonly: {
        default: false,
        type: Boolean
    }
})

const input_click = (items, index, evnet) => {
    if(props.readonly) return
    BetData.set_active_index(index)
    nextTick(() => {
        BetData.set_bet_keyboard_show(true)
    })
}

// 光标
const money_span = ref(null)
let flicker_timer = null

onMounted(()=>{
    cursor_flashing()
})

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
.bet_input_info{
    height: .28rem;
    // padding-left: 0.7rem;
    background: var(--q-gb-bg-c-10);
    // padding: 0 0.15rem;

    .info_right{
        width: .7rem;
        height: .26rem;
        background: #ffffff;
        color: var(--q-gb-t-c-4);
        font-size: .12rem;
        font-weight: 500;
        .content-b {
            width: 100%;
            text-align: center;
        }
        .input_place{
            color:  #8A8986;
            font-size: 12px;
            font-weight: 400;
        }
        .input_cursor{
            width: 2px;
            height: 14px;
            border-radius: 2px;
            background: var(--q-gb-bg-c-1);
        }
        .input_amount{
            //color:#1A1A1A ;
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
    background: var(--q-gb-t-c-14);

}
.flex_input{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.size_14{
    font-size: 0.14rem;
    font-weight: 400;
    color: var(--q-gb-t-c-3);
}
.margin_left_4{
    margin-left: 4px;
    font-family: "DIN";
}
.size_16{
    font-size: 0.16rem;
    font-weight: 500;
    color: var(--q-gb-t-c-4);
    margin-bottom: .08rem;
}
.color_ff700{
    color: var(--q-gb-t-c-1);
}
.huise{
    color: #8A8986 !important;
}
.money-span {
    width: 0.02rem;
    height: 0.16rem;
    margin-right: 0.05rem;
    background: var(--q-gb-bg-c-1);
    &.money-span3{
      background: #FFF6F0;
    }
  }
  .limit-txt {
    color: var(--q-gb-t-c-3);
    white-space: nowrap;
  }

</style>