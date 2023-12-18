
<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}-{{BetData.bet_data_class_version}}- {{UserCtr.user_version}}</div>
        <div class="f-b-s bet-content" :class="items.ol_os != 1 ? 'bet-disable' : ''">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c font14 ">
                    <span class="text-flow-none" v-html="items.handicap"></span> 
                </div>
                <div class="my-left">
                    <div class="w-100 handicap my-4">
                        <span class="mr-4 text-009 text-flow-none" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bet_inplay") + ']'}}</span>
                        <span class="text-a1a text-flow-none mr-4 font400">{{ items.playName }}
                            <span v-if="[4,19,143,113].includes(items.playId*1)">{{items.matchType == 2? items.mark_score : ''}}</span>
                        </span>
                        <!-- 盘口 -->
                        <span class="text-a1a text-flow-none text-009 font400" v-if="UserCtr.is_cur_odds(items.marketTypeFinally)">[{{ i18n_t(`odds.${UserCtr.odds.cur_odds}`) }}] </span> 
                        <span class="text-a1a text-flow-none text-009 font400" v-else>[{{ i18n_t(`odds.EU`) }}]</span> 
                    </div>
                    <div class="w-100 fon12 font400 text-a1a-i">{{ items.tid_name }}</div>
                    <div class="w-100 fon12 font400 " v-if="items.home">{{ items.home }} <span class="mx-4">v</span> {{ items.away }} {{ items.matchType == 2? items.mark_score : ''}}
                    </div>
                </div>
            </div>
           
            <div class="fw-e-s bet-right" v-if="items.ol_os == 1 && items.hl_hs == 0 && items.mid_mhs == 0">
                <div class="f-c-c bet-money">
                    <span class="font14 font700 bet-odds-value f-c-c" :class="{'red-up':items.red_green == 'red_up','green-down':items.red_green == 'green_down'}">
                       <span class="font14">@</span>{{ compute_value_by_cur_odd_type(items.odds,items.playId,items.odds_hsw,items.sportId) }}
                    </span>

                    <div class="show_img">
                        <img v-if="items.red_green == 'red_up'" :src="is_up_app" alt=""/>
                        <img v-if="items.red_green == 'green_down'" :src="is_down_app" alt=""/>
                    </div>
                </div>
            </div>

            <div class="fw-e-s bet-right bet-invalid" v-else>
                <div class="bet-disabled">
                    <span>{{ i18n_t('bet.disabled') }}</span>
                </div>
            </div>

            <!--  串关 投注 删除投注项 -->
            <div class="bet-delete" v-if="BetViewDataClass.bet_order_status == 1 && !BetData.is_bet_single" @click="set_delete">
                <img :src="compute_local_project_file_path('/image/svg/delete4.svg')" alt="">
            </div>
          
        </div>
        
        <div v-if="BetData.is_bet_single">
            <!-- 输入框 -->
            <bet-single-input :item="items"></bet-single-input>
        </div>
       
    </div>
</template>

<script setup>

import {LOCAL_PROJECT_FILE_PREFIX,compute_local_project_file_path,compute_value_by_cur_odd_type,useMittOn,MITT_TYPES,useMittEmit,UserCtr,i18n_t,formatMoney } from "src/output/index.js"
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { is_up_app, is_down_app } from 'src/base-h5/core/utils/local-image.js'
import betSingleInput from "./bet-single-input.vue"
import { only_win } from "src/core/constant/common/module/csid.js"

const props = defineProps({
    items:{},
    index:{}
})

const set_delete = () => {
    BetData.set_delete_bet_info(props.items.playOptionsId,props.index)
}


</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
.font22{
    font-size: 0.2rem;
}
.bet-list {
   
    .bet-content {
        min-height: 76px;
        padding: 0.12rem;
        margin-bottom: .04rem;
        //padding-left: 34px;
        font-size: 13px;
        font-weight: 500;
        font-style: normal;
        position: relative;
        background: var(--q-gb-bg-c-22);
       // margin-top: .1rem;
        border-radius: 0.12rem;
        &.bet-disable{
            align-items: center;
        }

        .bet-money {
            height: 34px;
        }

        .bet-delete {
            position: absolute;
            bottom: 0;
            right: 0;
            cursor: pointer;
            width: 0.3rem;
            height: 0.2rem;
            background-color: var(--q-gb-bg-c-19);
            border-radius: .16rem 0 .12rem 0;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: .1rem;
                height: .1rem;
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
            &.bet-invalid{
                height: 100%;
                .bet-disabled{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-content: center;
                    align-items: center;
                    span{
                        display: inline-block;
                        padding: 0 20px;
                        height: 26px;
                        display: inline-block;
                        border-radius: 2px;
                        line-height: 26px;
                        background: var(--q-gb-bg-c-10);
                        font-size: 12px;
                        font-weight: 500;
                        letter-spacing: 0px;
                        color: var(--q-gb-t-c-9);
                    }
                }
            }
        }

        .bet-left {
            width: 2.70rem;
            .my-left{
                padding-left: 0.1rem;
                border-left: 2px solid var(--q-gb-bg-c-13);
                margin-top: 0.06rem;
                color: var(--q-gb-t-c-11);
                font-size: 0.12rem;
            }
            .text-a1a-i {
                margin: .04rem 0;
            }
        }

       
    }

    .bet-market{
        font-size: 13px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
        //http://api.sportxxxvo3.com/
    }
    .text-flow{
        max-width: 90%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :deep(.ty-span) {
            margin-left: .04rem;
            //color: var(--q-gb-t-c-2);
        }
    }
    .handicap{
        max-width: 1.90rem;
    }
    .text-flow-none{
        max-width: 84%;
        line-height: .16rem;
        word-wrap: break-word;
        :deep(.ty-span) {
            margin-left: .04rem;
            //color: var(--q-gb-t-c-2);
        }
    }
    .bet-odds-value{
        margin-right: .02rem;
        font-size: .22rem;
        &.red-up{
            color:#F53F3F;
        }
        &.green-down{
            color: #00B42A
        }
    }
    .show_img{
        width: .10rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
}


</style>