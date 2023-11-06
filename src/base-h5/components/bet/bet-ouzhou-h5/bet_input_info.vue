<!-- 单关，串关，投注金额输入框 -->
<template>
    <div class="bet_input_info flex_input">
       <div class="info_left">
       <div class="size_16 color_a1a1">name</div>
        <div class="size_14">
            <span>Highest Win</span>
            <span class="margin_left_4">123</span>
        </div>
       </div>
       <div class="info_right size_14">
            <!-- <div class="input_amount">789</div>
            <div class="input_cursor" ref="input_cursor"></div> -->
            <div class="input_place">{{ `Limits 10~9999` }}</div>
       </div>
    </div>
</template>

<script setup>
// import {ref  , reactive,onMounted,watch,computed,onUnmounted} from 'vue'
// import EMITTER from  "src/global/mitt.js"
// import store from 'src/store-redux-vuex/index.js';
// import { format_money2 ,format_money1} from 'src/public/utils/bet/bet_filters.js'

// let bet_input_amount = ref()
// let flicker_timer = null

// const bet_input = ref();
// const input_cursor = ref()

const bet_tabs = [
  {
    name: "Single Bet", // 单关
    label: 'Single',
    active: true,
    badge: false,
  },
  {
    name: "bets", // 串关
    label: 'My Bets',
    active: false,
    badge: false,
  },
]

// const props = defineProps({
//     items:{},
//     show_keyboard:'',
//     bet_state:'',

// })

// const highest_amount = computed(() => {
//     let text = '0.00'
//     if( bet_input_amount.value){
//         text = (+bet_input_amount.value * Number(props.items.oddFinally) - props.items.betAmount).toFixed(2)
//     }
//     return text
// })

// // 光标闪动
// const cursor_flashing = () => {
//     clearInterval(flicker_timer)
//     flicker_timer = setInterval(() => {
//         input_cursor.value && input_cursor.value.classList.toggle('money_input_cursor')
//     }, 700);
// }

// watch(() => bet_input_amount.value,(newval)=>{
//     let bet_info = {
//         ...props.items,
//     }
//     bet_info.betAmount = Number(newval).toFixed(2)
//     store.dispatch({
//         type: "SET_BET_INFO",
//         data: [bet_info],
//     });
// })

// EMITTER.on("input_bet_money", (m) => {
//     bet_input_amount.value = m.value 
// })

// onMounted(()=>{
//     cursor_flashing()
// })
// onUnmounted(() => {
//     clearInterval(flicker_timer)
//     EMITTER.off("input_bet_money")
// })

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
        border: 0.5px solid var(--q-gb-t-c-11);
        padding-left: 6px;
        background: var(--q-gb-t-c-13);
        caret-color: var(--q-gb-t-c-11);
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
            background: var(--q-gb-t-c-11);
        }
        .input_amount{
            color:#1A1A1A;
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
    font-size: 14px;
    font-weight: 400;
    color: #8A8986;
}
.margin_left_4{
    margin-left: 4px;
    font-family: "DIN";
}
.size_16{
    font-size: 0.18rem;
    font-weight: 500;
}
.color_ff700{
    color: var(--q-gb-t-c-11);
}
.huise{
    color: #8A8986 !important;
;
}

</style>