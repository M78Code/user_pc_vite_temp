<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
        <div class="f-b-s bet-content">
            <!-- <img class="img" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/bet/success.svg`" alt="" /> -->

            <section class="bet-content-main">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c text-1a1 font14">
                    <span class="text-flow-none">{{ items.playOptionName}}</span> 
                    <!-- <span class="bet-market mx-4 text-ff7">{{ items.marketValues }}</span> -->
                    
                    <!-- <span class="text-flow-none">Sevilla Fútbol Club </span> -->
                    <span class="text-flow-none">【{{ i18n_t(`odds.${items.marketType}`) }}】</span>
                </div>
                <div class="w-100 my-4">
                    <span class="mr-4 text-009" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bet_inplay") + ']'}}</span>
                    <span class="text-a1a text-flow-none font400">{{ items.playName }}
                        <span v-if="[4,19,143,113].includes(items.playId*1)">{{items.matchType == 2? items.mark_score : ''}}</span>
                    </span>
                    
                    <!-- <span class="mr-4 text-009"> [{{ i18n_t(`odds.${items.marketType}`) }}]</span> -->
                
                    <div class="w-100 font12 font400 font-style" v-if="items.matchType != 3">{{items.matchName}}</div>
                    <div class="w-100 font12 font400 font-style">{{ items.matchInfo }}</div>
                </div>
            </div>

            <div class="bet-right">
                <div class="bet-odds">
                    <span v-if="![2, 3].includes(BetViewDataClass.bet_order_status) " class="font14 font700 ">@</span>
                    <span class="font22">{{ items.oddsValues }}</span>
                </div>
            </div>
            </section>
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
@import "./css/bet.scss";
</style>

<style scoped lang="scss">
.font22{
    font-size: 0.2rem;
}
.bet-list {
    margin-bottom: 0.05rem;
    .bet-content {
        min-height: .76rem;
        padding: .12rem;
        padding-bottom: 0;
        padding-right: 0;
        font-size: .13rem;
        font-weight: 500;
        font-style: normal;
        position: relative;
        background: var(--q-gb-bg-c-28);
        //background: var(--q-gb-bg-c-22);
        margin-bottom: .04rem;
        border-radius: .12rem;

        .bet-money {
            height: .34rem;
        }

        .bet-odds {
            height: .24rem;
            line-height: 0.22rem;
            padding-right: 10px;
        }

        .bet-right {
            width: 1.6rem;
            text-align: right;
            color: var(--q-gb-t-c-6);
            //color: var(--q-gb-t-c-17);
            position: absolute;
            right: .05rem;
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
      .my-4 {
        margin: .04rem 0;
        margin: 0.04rem 0;
        padding: 0 0.04rem;
        color: var(--q-gb-bg-c-30);
        .font-style{
            //color: var(--q-gb-t-c-11);
            color: var(--q-gb-t-c-3);
        }
      }

    .bet-market{
        font-size: .13rem;
        font-weight: 500;
        line-height: .16rem;
        letter-spacing: 0px;
    }
    .text-flow-none{
        max-width: 84%;
        line-height: .16rem;
        font-weight: 500;
        //color: var(--q-gb-t-c-17);
        color: var(--q-gb-t-c-6);
        :deep(.ty-span) {
            margin-left: .04rem;
            color: var(--q-gb-t-c-2);
        }
    }
    .text-flow-club{
        color: var(--q-gb-t-c-4);
    }
}
</style>

<style scoped lang="scss">
.bet-result{
    width: 100%;
    background: var(--q-gb-bg-c-15);    
    padding: 0 .2rem;
    height: .22rem;
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
}
.bet-content-main{
    display: flex;
}
.img{
    margin-right: 0.1rem;
}
</style>