<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
        <div class="f-b-s bet-content">
            <div class="fw-s-s bet-left">
                <div class="w-100 f-s-c text-1a1 font14">
                    <span class="text-flow-none">{{ items.playOptionName}}</span> 
                    <span class="bet-market mx-4 text-ff7">{{ items.marketValues }}</span>
                </div>
                <div class="w-100 my-4">
                    <span class="mr-4 text-009" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bet_inplay") + ']'}}</span>
                    <span class="text-a1a text-flow-none font400">{{ items.playName }}
                        <span v-if="[4,19,143,113].includes(items.playId*1)">{{items.matchType == 2? items.mark_score : ''}}</span>
                    </span>
                    
                    <span class="mr-4 text-009"> [{{ i18n_t(`odds.${items.marketType}`) }}]</span>
                </div>
                <div class="w-100 font12 font400" v-if="items.matchType != 3">{{items.matchName}}</div>
                <div class="w-100 font12 font400">{{ items.matchInfo }}
                </div>
            </div>

            <div class="bet-right">
                <div class="bet-odds">
                    <span class="font14 font700 mr-10">@{{ items.oddsValues }}</span>
                </div>
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
        // padding-left: 34px;
        font-size: 13px;
        font-weight: 500;
        font-style: normal;
        position: relative;
        background: var(--q-gb-bg-c-22);
        margin-bottom: .04rem;
        border-radius: .12rem;

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
            color: var(--q-gb-t-c-17);
        }

        .bet-left {
            width: 230px;
            color: var(--q-gb-t-c-11);
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
        color: var(--q-gb-t-c-17);
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
</style>