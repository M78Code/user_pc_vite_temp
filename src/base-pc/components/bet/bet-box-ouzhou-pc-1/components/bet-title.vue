
<template>
    <div class="bet-title">
       <div v-show="false"> {{UserCtr.user_version}} -- {{BetData.bet_data_class_version}}</div>
        <div class="f-b-c bet-content">
            <div class="f-s-c">
                <div class="f-c-c bet-count" >{{ BetData.bet_single_list.length }}</div>
                <div class="bet-slip">Bet Slip</div>
            </div>
            <div class="f-e-c">
                <div class="f-c-c bet-money">{{ format_money2(UserCtr.balance) }}</div>
                <div class="bet-state" @click="set_bet_show" :class="BetData.bet_state_show ? 'bet-hide' :'bet-show'"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { format_money2,UserCtr } from "src/core/"
import BetData from "src/core/bet/class/bet-data-class.js"

// 展开 收起 投注项
const set_bet_show = () => {
    BetData.set_bet_state_show(!BetData.bet_state_show)
}
</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
    .bet-title{
        width: 100%;
        height: 54px;
        background: #3B3B3B;
        border-top: 3px solid #FF7000;
        border-left: 1px solid #FF7000;
        border-right: 1px solid #FF7000;
        padding: 0 12px;
        .bet-content{
            height: 100%;
        }
        .bet-count{
            height: 22px;
            padding: 0 6px;
            background: #FF7000;
            border-radius: 50%;
            min-width: 22px;
            color: #fff;
            font-weight: 700;
            font-size: 14px;
        }
        .bet-slip{
            color: #FFFFFF;
            font-weight: 500;
            font-size: 14px;
            margin-left: 6px;
        }
        .bet-money{
            font-weight: 500;
            font-size: 16px;
            color: #FF7000;
            margin-right: 10px;
            font-family: "DIN";
        }
        .bet-state{
            width: 28px;
            height: 28px;
            background: #FFFFFF;
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
                background: #3B3B3B;
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
                background: #3B3B3B;
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