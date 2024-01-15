<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
        <div class="f-b-s bet-content">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c text-1a1">
                    <span class="text-flow-none">{{ items.playOptionName }}</span> 
                    <span class="bet-market mx-4 text-ff7">{{ items.marketValue }}</span>
                </div>
                <div class="w-100 my-4">
                    <span class="mr-4 text-009" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bowls") + ']'}}</span>
                    <span class="text-a1a text-flow-none font400">{{ items.playName }}
                        <span v-if="[4,19,143,113].includes(items.playId*1)">{{items.matchType == 2? items.mark_score : ''}}</span>
                    </span>
                    
                    <span class="mr-4 text-009"> [{{ i18n_t(`odds.${items.marketType}`) }}]</span>
                </div>
                <div class="w-100 text-8a8 fon12 font400" v-if="items.matchType != 3">{{items.matchName}}</div>
                <div class="w-100 text-8a8 fon12 font400">{{ items.matchInfo }}
                </div>
            </div>

            <div class="bet-right">
                <div class="bet-odds">
                    <span class="font14 font700 mr-10">@{{ items.oddsValues }}</span>
                </div>
                <div class="bet-loading mr-10" v-if="items.orderStatusCode == 2">{{i18n_t("bet.bet_betting")}}</div>  
                <div class="bet-failure mr-10" v-if="items.orderStatusCode == 0">{{i18n_t("bet.bet_order_info3")}}</div>
                <div class="bet-success mr-10" v-if="items.orderStatusCode == 1">{{i18n_t("bet.bet_suc")}}</div>
              
            </div>
            <div class="bet-delete bet-icon">
                <!-- 投注确认中 -->
                <img class="icon_loading" v-if="items.orderStatusCode == 2" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/gif/icon_loading.gif`" alt="" />
                <!-- <icon-wapper v-if="BetViewDataClass.bet_order_status == 3" class="icon-loading-no" size="12px" color="#FF7000" /> -->
                <!-- 投注失败 -->
                <icon-wapper v-if="items.orderStatusCode == 0" name="icon-failure" size="12px" color="#FF4646" />
                <!-- 投注成功 -->
                <icon-wapper v-if="items.orderStatusCode == 1" name="icon-success" size="12px" color="#4FC140" />
            </div>
           
        </div>

        <div v-if="BetData.is_bet_single" class="bet-result f-b-c" >
            <div class="bet-result-info">
                <span class="font12 font500 bet-returm mr-4">{{ i18n_t("bet.total_bet")}}</span>
                <span class="font14 font500 bet-money ">{{ format_money2(mathJs.divide(items.betMoney,100)) }}</span>
            </div>
            <div class="bet-result-info">
                <span class="font12 font400 bet-returm mr-4">{{ i18n_t("common.maxn_amount_val") }}</span>
                <span class="font14 font500">{{ format_money2(mathJs.divide(items.maxWinMoney,100))}}</span>
            </div>
        </div>
      
    </div>
</template>

<script setup> 
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import {i18n_t,format_money2,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { IconWapper } from 'src/components/icon/index.js'

const props = defineProps({
    items:{
        type: [Object] ,
        default : () => {}
    }
})

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
            height: 24px;
        }

        .bet-right {
            width: 160px;
            text-align: right;
        }

        .bet-left {
            width: 230px;
        }
        .bet-loading{
            color: var(--q-gb-t-c-2);
        }
        .bet-failure{
            color: var(--q-gb-t-c-7);
        }
        .bet-success{
            color: var(--q-gb-t-c-10);
        }
    }

    .bet-bet-money {
        width: 100%;
        padding: 10px 12px;
        background: var(--q-gb-bg-c-15);

        .bet-money-li {
            width: 76px;
            height: 30px;
            border: 0.5px solid var(--q-gb-bd-c-5);
            background: var(--q-gb-bg-c-4);
            color: #505050;
            border-radius: 2px;
            transition: .3s;
            cursor: pointer;

            &:hover {
                // border: 1px solid #FF7000;
                border: 1px solid var(--q-gb-bd-c-1);
            }
            &.disabled{
                background: var(--q-gb-bg-c-19);
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
        max-width: 84%;
        line-height: 16px;
        :deep(.ty-span) {
            margin-left: 4px;
            color: var(--q-gb-t-c-2);
        }
    }
    .bet-odds-value{
        color: var(--q-gb-t-c-2);
    }
    .red-up{
        color: var(--q-gb-t-c-7);
    }
    .green-down{
        color: var(--q-gb-t-c-6);
    }
    .show_img{
        width:12px;
        padding: 3px;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
</style>

<style scoped lang="scss">
.bet-result{
    width: 100%;
    background: var(--q-gb-bg-c-15);    
    padding: 0 20px;
    height: 50px;
    .bet-result-info{
        color: var(--q-gb-t-c-5);
        .bet-money{
            color: var(--q-gb-t-c-2);
        }
    }
    .icon_loading{
        width: 12px;
        height: 12px;
    }
}
</style>