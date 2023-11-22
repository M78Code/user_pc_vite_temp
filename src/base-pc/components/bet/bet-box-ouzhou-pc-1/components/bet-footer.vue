

<template>
    <div class="bet-footer">
        <div v-show="false">  {{BetViewDataClass.bet_view_version}}-{{BetViewDataClass.error_code}}-{{BetViewDataClass.error_message}}</div>
        <div class="bet-state" v-show="BetViewDataClass.error_message">
            <div class="w-100 f-c-c bet-title" :class="BetViewDataClass.error_code == 200 ? 'bet-success' : 'bet-error'">
                {{ BetViewDataClass.error_message }}
            </div>
        </div>
        <div class="f-b-c bet-content" v-if="BetViewDataClass.bet_order_status == 1">
            <div class="font16 font400 f-c-c bet-bet-cancel" @click="set_bet_cancel">{{ i18n_t("bet.bet_cancel") }}</div>
            <div class="font16 font600 f-c-c bet-place-bet" @click="set_bet_submit">{{ i18n_t("ouzhou.bet.place_bet") }}</div>
        </div>
        <div class="f-b-c bet-content" v-else>
            <div class="font16 font400 f-c-c bet-bet-cancel" @click="set_retain_selection">{{ i18n_t("bet.save_item") }}</div>
            <div class="font16 font600 f-c-c bet-place-bet" @click="set_confirm">{{ i18n_t("common.confirm") }}</div>
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
    // 未投注之前 可以点击
    if(BetViewDataClass.bet_order_status == 1){
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
    background: var(--q-gb-bg-c-4);
    border-top: 0.5px solid var(--q-gb-bd-c-6);

    .bet-content {
        width: 100%;
        height: 100%;
        padding: 17px 12px;

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
        }
    }

}
</style>