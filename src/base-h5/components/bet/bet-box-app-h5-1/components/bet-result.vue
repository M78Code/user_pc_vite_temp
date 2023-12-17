<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
        <div class="f-b-s bet-content">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c text-1a1">
                    <span class="text-flow-none color000 font500">{{ items.playOptionName}}</span> 
                    <span class="bet-market mx-4 text-ff7">{{ items.marketValue }}</span>
                </div>
                <div class="w-100 my-4 font12">
                    <span class="mr-4 text-009" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bet_inplay") + ']'}}</span>
                    <span class="text-a1a text-flow-none">{{ items.playName }}
                        <span v-if="[4,19,143,113].includes(items.playId*1)">{{items.matchType == 2? items.mark_score : ''}}</span>
                    </span>
                    
                    <span class="mr-4 text-009"> [{{ i18n_t(`odds.${items.marketType}`) }}]</span>
               
                <div class="w-100 text-8a8 fon12 font400" style="margin: .04rem 0;" v-if="items.matchType != 3">{{items.matchName}}</div>
                <div class="w-100 text-8a8 fon12 font400">{{ items.matchInfo }}
                </div>
                </div>
            </div>

            <div class="bet-right">
                <div class="bet-odds">
                    <span class="font14 font700">@<span class="font22">{{ items.oddsValues }}</span></span>
                </div>
            </div>
        </div>

        <div class="bet-content">
            <div class="bet-result f-b-c" >
                <span class="font12 font400 bet-returm mr-4">投注金额</span>
                <span class="font16 font600">{{ format_money2(mathJs.divide(items.betMoney,100))}}</span>
            </div>

            <div class="bet-result f-b-c" >
                <span class="font12 font400 bet-returm mr-4">可赢金额</span>
                <span class="font16 font600">{{ format_money2(mathJs.divide(items.maxWinMoney,100))}}</span>
            </div>

            <div class="bet-result f-b-c" >
                <span class="font12 font400 bet-returm mr-4">注单号</span>
                <span class="order font12 font400">{{ items.orderNo }}</span>
            </div>
        </div>

    </div>
</template>

<script setup> 
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
        //padding-left: 34px;
        font-size: 13px;
        font-weight: 500;
        font-style: normal;
        position: relative;
        background: var(--q-gb-bg-c-22);
        border-radius: 0.12rem;
        margin-bottom: 0.05rem;

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
            span {
                vertical-align: middle;
            }
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
     .my-4 {
            margin: 4px 0;
            margin: 0.04rem 0;
            border-left: 2px solid var(--q-gb-bg-c-13);
            padding: 0 0.04rem;
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
        color: var(--q-gb-t-c-11);
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
    //background: var(--q-gb-bg-c-15);    
    //padding: 0 .2rem;
    height: .24rem;
    .bet-result-info{
        color: var(--q-gb-t-c-5);
        .bet-money{
            color: var(--q-gb-t-c-2);
        }
    }
    .icon_loading{
        width: .12rem;
        height: .12rem;
    }
    .bet-returm {
        color: var(--q-gb-t-c-11);
    }
    .order {
        color: var(--q-gb-t-c-11);
    }
}
    .text-8a8{
        color: var(--q-gb-t-c-3) !important;
    }
    .color000{
        color: var(--q-gb-t-c-17) !important;
        font-size: 0.14rem;
        font-family: PingFang SC;
    }
    .font22{
        font-size: 0.22rem;
    }
</style>