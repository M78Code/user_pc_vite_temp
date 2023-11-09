
<template>
    <div class="bet-list">
        <div class="f-b-s bet-content">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c text-1a1 h15">
                    <span class="text-flow">{{ items.handicap }}</span> 
                    <span class="bet-market mx-4 text-ff7">{{ items.marketValue }}</span>
                </div>
                <div class="w-100 h15 f-s-c my-4">
                    <span class="mr-4 text-009" v-if="items.matchType == 2">[In-play]</span>
                    <span class="text-a1a text-flow-none font400">{{ items.playName }}</span>
                </div>
                <div class="w-100 text-8a8 fon12 font400">{{ items.home }} <span class="mx-4">v</span> {{ items.away }}
                </div>
            </div>


            <div class="fw-e-s bet-right" v-if="BetViewDataClass.bet_order_status == 1">
                <div class="f-c-c bet-money">
                    <span class="font14 font700 mr-10" :class="items.bet_state ? '' : 'text-ff7'">
                        {{ compute_value_by_cur_odd_type(items.odds,'','',items.sportId) }}
                    </span>
                    <BetInput :items="items" />
                </div>
                <div class="font12 h12 mt-4">
                    <span class="font400 mr-4 text-8a8">Highest Win</span>
                    <span class="text-1a1 font500"> {{ highest_win }} </span>
                </div>
            </div>

            <div class="fw-e-s bet-right" v-else>
                <div class="f-c-c bet-odds">
                    <span class="font14 font700 mr-10">{{ compute_value_by_cur_odd_type(items.odds,'','',items.sportId) }}</span>
                </div>
                <!-- <BetResult :items="items" /> -->
            </div>

            <div class="bet-delete" v-if="BetViewDataClass.bet_order_status == 1" @click="set_delete">
                <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
            </div>

            <div class="bet-delete bet-icon" v-else>
                <!-- 投注确认中 -->
                <img v-if="BetViewDataClass.bet_order_status == 2" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
                <!-- 投注失败 -->
                <img v-if="BetViewDataClass.bet_order_status == 3" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
                <!-- 投注成功 -->
                <img v-if="BetViewDataClass.bet_order_status == 4" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`" alt=""/>
            </div>
           
        </div>
        <ul class="bet-bet-money f-b-c" v-show="items.show_money">
            <!-- <li class="bet-money-li f-c-c font14" v-for="(obj, index) in money_list" @click="set_bet_money(obj)"
                :key="obj.label">
                {{ money_list.length == index + 1 ? '' : '+' }}{{ obj.label }}
            </li> -->
        </ul>
    </div>
</template>

<script setup>
import {LOCAL_PROJECT_FILE_PREFIX,compute_value_by_cur_odd_type } from "src/core/"
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import betTitle from "./bet-input.vue"  // 投注输入框

const props = defineProps({
    items:{}
})


const set_delete = () => {

}

</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
.bet-list {
    .bet-content {
        min-height: 76px;
        padding: 12px;
        padding-left: 34px;
        font-size: 13px;
        font-weight: 500;
        font-style: normal;
        position: relative;

        .bet-money {
            height: 34px;
        }

        .bet-delete {
            position: absolute;
            top: 11px;
            left: 12px;
            cursor: pointer;

            img {
                width: 12px;
                height: 12px;
            }

            &.bet-icon {
                cursor: auto;
            }
        }

        .bet-odds {
            height: 34px;
        }

        .bet-right {
            width: 160px;
        }

        .bet-left {
            width: 230px;
        }

    }

    .bet-bet-money {
        width: 100%;
        padding: 10px 12px;
        background: #F5F5F5;

        .bet-money-li {
            width: 76px;
            height: 30px;
            border: 0.5px solid #A4A4A4;
            background: #fff;
            color: #505050;
            border-radius: 2px;
            transition: .3s;
            cursor: pointer;

            &:hover {
                border: 1px solid #FF7000;
            }
        }
    }

    .bet-market{
        font-family: DIN;
        font-size: 13px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
        //http://api.sportxxxvo3.com/
    }
    .text-flow{
        max-width: 74%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .text-flow-none{
        width: 76%;
        line-height: 12px;
    }
}
</style>