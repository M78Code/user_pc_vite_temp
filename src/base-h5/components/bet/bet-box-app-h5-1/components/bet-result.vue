<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
        <div class="f-b-s bet-content">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c text-1a1 m-b-6">
                    <span class="text-flow-none color000 font500">{{ `${items.teamName} ${items.playOptionName}`}}</span> 
                    <span class="bet-market mx-4 text-ff7">{{ items.marketValue }}</span>
                </div>
                <div class="w-100 font12 content">
                    <span class="mr-4 text-009" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bet_inplay") + ']'}}</span>
                    <span class="text-a1a text-flow-none">{{ items.playName }}
                        <span v-if="items.score_benchmark">{{items.score_benchmark}}</span>
                    </span>
                    
                    <span class="mr-4 text-009"> [{{ i18n_t(`odds.${items.marketType}`) }}]</span>
               
                    <div class="w-100 text-8a8 fon12 font400 my-4">{{ items.matchInfo }}</div>
                    <div class="w-100 text-8a8 fon12 font400" v-if="items.matchType != 3">{{items.matchName}}</div>
                </div>
            </div>

            <div class="bet-right">
                <div class="bet-odds">
                    <span class="font14 font700">@<span class="font22 number_family">{{ items.oddsValues }}</span></span>
                </div>
            </div>
        </div>

        <div class="bet-content">
            <div class="bet-result f-b-c" >
                <span class="font12 font400 bet-returm mr-4">投注金额</span>
                <span class="font16 font600 bet-returms number_family">{{ format_money2(mathJs.divide(items.betMoney,100))}}</span>
            </div>

            <div class="bet-result f-b-c" >
                <span class="font12 font400 bet-returm mr-4">可赢金额</span>
                <span class="font16 font600 bet-returms number_family">{{ format_money2(mathJs.divide(items.maxWinMoney,100))}}</span>
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
        min-height: .76rem;
        padding: .12rem;
        font-size: .13rem;
        font-weight: 500;
        font-style: normal;
        position: relative;
        background: var(--q-gb-bg-c-22);
        border-radius: 0.12rem;
        margin-bottom: 0.05rem;

        .bet-money {
            height: .34rem;
        }

        .bet-delete {
            position: absolute;
            top: .11rem;
            left: .12rem;
            cursor: pointer;

            img {
                width: .12rem;
                height: .12rem;
            }

            &.bet-icon {
                cursor: auto;
            }
        }

        .bet-odds {
            height: .24rem;
            color:var(--q-gb-t-c-17);
            span {
                vertical-align: middle;
            }
        }

        .bet-right {
            width: 1.6rem;
            text-align: right;
        }

        .bet-left {
            width: 2.3rem;
            .m-b-6 {
                margin-bottom: .06rem;
            }
        }
    }

     .content {
        border-left: 2px solid var(--q-gb-bg-c-13);
        padding: 0 .04rem;
      }
    .bet-market{
        font-size: .13rem;
        font-weight: 500;
        line-height: .16rem;
    }
    .text-flow-none{
        max-width: 84%;
        line-height: .16rem;
        color: var(--q-gb-t-c-11);
        :deep(.ty-span) {
            margin-left: .04rem;
            color: var(--q-gb-t-c-2);
        }
    }
    .red-up{
        color: var(--q-gb-t-c-7);
    }
    .green-down{
        color: var(--q-gb-t-c-6);
    }
    .show_img{
        width: .12rem;
        padding: .03rem;
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
    .bet-returms{
        color: var(--q-gb-t-c-18);
    }
    .order {
        color: var(--q-gb-t-c-11);
    }
}
    .text-8a8{
        color: var(--q-gb-t-c-11) !important;
    }
    .color000{
        color: var(--q-gb-t-c-17) !important;
        font-size: 0.14rem;
        
    }
    .font22{
        font-size: 0.22rem;
    }
</style>