<template>
    <div class="bet-list">
        <div v-show="false">{{BetViewDataClass.bet_view_version}}</div>
        <div class="bet-info">
            <div class="f-b-c px-12">
                <div class="f-a-c">
                    <span class="font14 font500">{{ items.seriesValue}}</span> 
                    <span class="text-45B0FF ml-4" v-if="items.orderStatusCode == 1">注单已确认</span>
                </div>
                <div>
                    <span>{{ format_money2(mathJs.divide(items.betAmount,100))}}</span>
                    <span> x{{ items.seriesSum }} </span>
                </div>
            </div>
        </div>
        <div class="toltal f-b-c">
            <div >
                <span>预计可赢：{{ format_money2(mathJs.divide(items.maxWinAmount,100))}} RMB</span>
            </div>
            <div>
                <span>小计：{{ items.seriesBetAmount }} RMB</span>
            </div>
        </div>
    </div>
</template>

<script setup> 
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import {i18n_t,format_money2,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'

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
    
    .bet-info {
        text-indent: .2rem;
        height: 0.44rem;
        border-radius: .12rem .12rem 0 0;
        background: url($SCSSPROJECTPATH + "/image/bet/rules3.svg") no-repeat .12rem / .15rem var(--q-gb-bg-c-22);
        .f-b-c {
            height: 0.44rem;
            
        }
        .text-45B0FF {
            color: #45B0FF;
        }
    }
    
    .toltal {
        border-top: 1px solid var(--q-gb-bg-c-18);
        background: var(--q-gb-bg-c-22);
        border-radius: 0 0 .12rem .12rem;
        height: 0.24rem;
        line-height: .24rem;
        color: var(--q-gb-t-c-11);
        padding: 0 .12rem;
        margin-bottom: .04rem;
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