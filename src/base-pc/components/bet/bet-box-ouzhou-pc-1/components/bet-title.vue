
<template>
    <div class="bet-title">
       <div v-show="false"> {{UserCtr.user_version}} -- {{BetData.bet_data_class_version}}</div>
        <div class="f-b-c bet-content">
            <div class="f-s-c">
                <div class="f-c-c bet-count" >{{ total() }}</div>

                <!-- <div @click="match_a">赛事推送</div>
                <div @click="match_b">赛事推送还原</div>
                <div @click="marcket_a" class="mr-4">盘口推送</div>
                <div @click="marcket_b" class="mr-4">盘口推送还原</div> -->

                <!-- 单关 -->
                <div class="bet-slip" v-if="BetData.is_bet_single && !BetData.is_bet_merge">{{ i18n_t("common.bets_single") }}</div>
                <!-- 合并单关 -->
                <div class="bet-slip" v-else-if="BetData.is_bet_single && BetData.is_bet_merge">{{ i18n_t("bet.bet_single_merge") }}</div>
                <!-- 串关 -->
                <div class="bet-slip" v-else-if="!BetData.is_bet_single">{{ i18n_t("bet.bet_series") }}</div>
            </div>
       
            <div class="f-e-c">
                <div class="f-c-c bet-money">{{ format_money2(UserCtr.balance) }}</div>
                <div class="bet-state" @click="set_bet_show" :class="BetData.bet_state_show ? 'bet-hide' :'bet-show'"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { format_money2,UserCtr } from "src/output/index.js"
import { computed } from "vue"
import BetData from "src/core/bet/class/bet-data-class.js"

// 展开 收起 投注项
const set_bet_show = () => {
    BetData.set_bet_state_show(!BetData.bet_state_show)
}

const total = computed(()=> state =>{
    if (BetData.is_bet_single) {
        return BetData.bet_single_list.length
    } else {
        return BetData.bet_s_list.length
    }
})

const match_a = () => {
    let obj = {
        "csid": "1",
            "mhs": 4,
            "mid": "3080293",
            "ms": "1",
            "tid": "33358"
    }
    BetData.set_bet_c104_change(obj)
}

const match_b = () => {
    let obj = {
        "csid": "1",
            "mhs": 1,
            "mid": "3080293",
            "ms": "0",
            "tid": "33358"
    }
    BetData.set_bet_c104_change(obj)
}

// ol_os: ol_obj.os, // 投注项状态 1：开 2：封 3：关 4：锁
//         hl_hs: hl_obj.hs || ol_obj._hs, // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
//         mid_mhs: ol_obj._mhs, // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）

const marcket_a = () => {
    let obj = 
    {"hls":[{"hid":"141154416162602430","hmt":0,"hn":1,"hpid":"2","hs":1,"mid":"3106887","ol":[{"obv":"322000","oid":"148148527401337534","os":1,"ot":"Over","ov":"322000"},{"obv":"119000","oid":"141214079215032754","os":1,"ot":"Under","ov":"119000"}]}],"ld":"AO_0af526a920240121204033841afb91e9_0","mid":"3106887"}
    BetData.set_bet_c106_change(obj)
}

const marcket_b = () => {
    let obj = {"hls":[{"hid":"141154416162602430","hmt":0,"hn":1,"hpid":"2","hs":0,"mid":"3106887","ol":[{"obv":"322000","oid":"148148527401337534","os":1,"ot":"Over","ov":"322000"},{"obv":"119000","oid":"141214079215032754","os":1,"ot":"Under","ov":"119000"}]}],"ld":"AO_0af526a920240121204033841afb91e9_0","mid":"3106887"}
   
    BetData.set_bet_c106_change(obj)
}

</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
    .bet-title{
        width: 100%;
        height: 54px;
        background: var(--q-gb-bg-c-20);
        border-top: 3px solid var(--q-gb-bd-c-1);
        border-left: 1px solid var(--q-gb-bd-c-1);
        border-right: 1px solid var(--q-gb-bd-c-1);
        padding: 0 12px;
        .bet-content{
            height: 100%;
        }
        .bet-count{
            height: 22px;
            padding: 0 6px;
            background: var(--q-gb-bg-c-1);
            border-radius: 50%;
            min-width: 22px;
            color: var(--q-gb-t-c-1);
            font-weight: 700;
            font-size: 14px;
        }
        .bet-slip{
            color: var(--q-gb-t-c-1);
            font-weight: 500;
            font-size: 14px;
            margin-left: 6px;
        }
        .bet-money{
            font-weight: 500;
            font-size: 16px;
            color: var(--q-gb-t-c-2);
            margin-right: 10px;
            font-family: "DIN";
        }
        .bet-state{
            width: 28px;
            height: 28px;
            background: var(--q-gb-bg-c-4);
            opacity: 0.2;
            position: relative;
            cursor: pointer;
            &.bet-hide{
                &::after{
                    transform: rotate(180deg);
                }
            }
            &.bet-show{
                &::after{
                    transform: rotate(90deg);
                }
            }
            &::before{
                width: 12px;
                height: 2px;
                background: var(--q-gb-bg-c-20);
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -6px;
                margin-top: -1px;
            }
            &::after{
                width: 12px;
                height: 2px;
                background: var(--q-gb-bg-c-20);
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -6px;
                margin-top: -1px;
                transition: .3s;
            }
        }
    }
</style>