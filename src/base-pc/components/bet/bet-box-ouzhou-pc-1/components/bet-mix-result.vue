<template>
    <div class="bet-list">
        <div v-show="false">{{ BetViewDataClass.bet_view_version }}</div>
        <div class="bet-result f-b-c">
            <div class="bet-result-info">
                <div><span class="font14 font500 bet-returm mr-4">{{ items.seriesValue }}</span></div>
                <div>
                    <span class="font12 font500 text-8a8">{{ i18n_t("bet_record.bets_forehead") }}</span>
                    <span class="font12 font500 text-8a8">{{ format_money2(mathJs.divide(items.seriesBetAmount, 100)) }}</span>
                </div>
            </div>
            <div class="bet-result-info">
                <div><span class="font12 font400 bet-returm mr-4">{{ i18n_t("common.maxn_amount_val") }}</span></div>
                <div><span class="font14 font500 bet-money">{{ format_money2(mathJs.divide(items.maxWinAmount, 100)) }}</span></div>
            </div>
        </div>

    </div>
</template>

<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { i18n_t, format_money2 } from "src/output/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'

const props = defineProps({
    items: {
        type: [Object],
        default: () => { }
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

        .bet-loading {
            color: var(--q-gb-t-c-2);
        }

        .bet-failure {
            color: var(--q-gb-t-c-7);
        }

        .bet-success {
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

            &.disabled {
                background: var(--q-gb-bg-c-19);
            }
        }
    }

    .bet-market {
        font-family: DIN;
        font-size: 13px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
        //http://api.sportxxxvo3.com/
    }

    .text-flow {
        max-width: 74%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .text-flow-none {
        max-width: 84%;
        line-height: 16px;

        :deep(.ty-span) {
            margin-left: 4px;
            color: var(--q-gb-t-c-2);
        }
    }

    .bet-odds-value {
        color: var(--q-gb-t-c-2);
    }

    .red-up {
        color: var(--q-gb-t-c-7);
    }

    .green-down {
        color: var(--q-gb-t-c-6);
    }

    .show_img {
        width: 12px;
        padding: 3px;

        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>

<style scoped lang="scss">
.bet-result {
    width: 100%;
    background: var(--q-gb-bg-c-15);
    padding: 0 20px;
    height: 50px;

    .bet-result-info {
        color: var(--q-gb-t-c-5);

        .bet-money {
            color: var(--q-gb-t-c-2);
        }
    }

    .icon_loading {
        width: 12px;
        height: 12px;
    }
}</style>