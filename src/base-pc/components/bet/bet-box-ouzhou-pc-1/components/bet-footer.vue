

<template>
    <div class="bet-footer">
        <div v-show="false">  {{BetViewDataClass.bet_view_version}}</div>
        <div class="bet-state" v-show="BetViewDataClass.error_message">
            <div class="w-100 f-c-c bet-title" :class="BetViewDataClass.error_code == 200 ? 'bet-success' : 'bet-error'">
                {{ BetViewDataClass.error_message }}
            </div>
        </div>
        <div class="f-b-c bet-content" v-if="BetViewDataClass.bet_order_status == 1">
            <div class="font16 font400 f-c-c bet-bet-cancel" @click="set_bet_cancel">Bet Cancel</div>
            <div class="font16 font600 f-c-c bet-place-bet" @click="set_bet_submit">Place Bet</div>
        </div>
        <div class="f-b-c bet-content" v-else>
            <div class="font16 font400 f-c-c bet-bet-cancel" @click="set_retain_selection">Retain Selection</div>
            <div class="font16 font600 f-c-c bet-place-bet" @click="set_confirm">Confirm</div>
        </div>
    </div>
</template>

<script setup>
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
// 提交投注信息
const set_bet_submit = () => {
    submit_handle()
}
// 取消投注
const set_bet_cancel = () => {
    BetData.set_clear_bet_info()
}

// 保留投注项
const set_retain_selection = () => {
    BetViewDataClass.set_bet_order_status(1)
    setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
    }, 200);
}

// 清空投注项 和投注后的内容
const set_confirm = () => {
    BetData.set_clear_bet_info()
    BetViewDataClass.set_clear_bet_view_config()
}

</script>

<style scoped lang="scss">
  @import "../css/bet.scss";
</style>

<style scoped lang="scss">
.bet-footer {
    width: 100%;
    background: #fff;
    border-top: 0.5px solid #E4E4E4;

    .bet-content {
        width: 100%;
        height: 100%;
        padding: 17px 12px;

        div {
            cursor: pointer;
        }
    }

    .bet-bet-cancel {
        border: 0.5px solid #A4A4A4;
        width: 160px;
        height: 46px;
        border-radius: 2px;
        color: #1A1A1A;
    }

    .bet-place-bet {
        width: 240px;
        height: 46px;
        border-radius: 2px;
        background: #ff7000;
        color: #fff;
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
                background: #FFEDED;
                color: #FF4646;
            }

            &.bet-success {
                background: #EDF9EC;
                color: #4FC140;
            }
        }
    }

}
</style>