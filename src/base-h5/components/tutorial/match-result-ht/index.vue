<!--
 * @Description:盘口教程比分展示组件
-->
<template>
    <div :class="['ht-content', state.source === 'bigAndSmallBall' && 'ht-border']">
        <div class="ht-title">
            <div class="pattern"></div>
            <div class="title">
                {{ option.ballNumber }}
                <span>{{ option.title }}</span>
            </div>
            <div class="hint" v-if="state.source === 'bigAndSmallBall'">{{ i18n_t('app_h5.handicap_tutorial.big_small_ball_tip') }}</div>
        </div>

        <div :class="['ht-both-teams', state.source === 'bigAndSmallBall' && 'pb20']">
            <div class="left">
                <div class="teams">
                    <div>{{ i18n_t('app_h5.handicap_tutorial.home_team') }}</div>
                    <div v-if="state.source !== 'bigAndSmallBall'" class="score">{{ option.homeTeamScore }}</div>
                </div>
                <div class="teams-logo"><img :src="compute_local_project_file_path('/image/svg/home-team-icon.svg')" alt=""></div>
            </div>
            <div class="center">
                <div class="vs">VS</div>
                <div v-if="state.source !== 'bigAndSmallBall'" class="text-style" v-html="option.condition"></div>
            </div>
            <div class="right">
                <div class="teams-logo"><img :src="compute_local_project_file_path('/image/svg/away-team-icon.svg')" alt=""></div>
                <div class="teams">
                    <div>{{ i18n_t('app_h5.handicap_tutorial.away_team') }}</div>
                    <div v-if="state.source !== 'bigAndSmallBall'" class="score">{{ option.awayTeamScore }}</div>
                </div>
            </div>
        </div>

        <div class="match-result-list" v-for="(item, index) in option.matchList" :key="'matchResult' + index">
            <div class="note" v-html="item.note"></div>
            <div :class="['match-result', state.source === 'bigAndSmallBall' && 'mb20']">
                <div class="left">
                    <div class="home-team teams">
                        <div class="title">{{ i18n_t('app_h5.handicap_tutorial.bet_home_team') }}</div>
                        <div :class="['result', item.winIsWho === 'homeTeam' && 'win']">{{ item.homeTeam }}</div>
                    </div>
                    <div v-if="item.winIsWho === 'homeTeam'" class="win-icon"><img :src="compute_local_project_file_path('/image/png/coin.png')" alt=""></div>
                </div>
                <div class="center">
                    <div class="round-ball">
                        <div class="title">{{state.source !== 'bigAndSmallBall' ? i18n_t('menu_itme_name.results') : i18n_t('app_h5.handicap_tutorial.enter_ball')}}</div>
                        <div class="score">{{ item.matchResult }}</div>
                        <div v-if="item.matchResult === '0 - 0'" class="text-style">{{ i18n_t('app_h5.handicap_tutorial.vice_versa') }}</div>
                    </div>
                </div>
                <div class="right">
                    <div class="away-team teams">
                        <div class="title">{{ i18n_t('app_h5.handicap_tutorial.bet_away_team') }}</div>
                        <div :class="['result', item.winIsWho === 'awayTeam' && 'win']">{{ item.awayTeam }}</div>
                    </div>
                    <div v-if="item.winIsWho === 'awayTeam'" class="win-icon"><img :src="compute_local_project_file_path('/image/png/coin.png')" alt=""></div>
                    <!-- <div class="win-icon"></div> -->
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { i18n_t, compute_local_project_file_path } from "src/output/index.js";
import { useRouter, useRoute } from "vue-router";
import { reactive } from "vue";

defineOptions({
    name: 'matchResultHt' // 设置组件名称
})

const router = useRouter();

const props = defineProps({
    source: {
        type: String,
        default: 'handicap' // handicap：让球   bigAndSmallBall：大小球
    },
    option: {
        type: [Object, String],
        default: '0'
    }
})
const state = reactive({
    ...props
})
</script>
<style scoped lang="scss">
.ht-border {
    border-top: .08rem solid var(--q-gb-bg-c-11);
}

.ht-content {
    padding-bottom: .2rem;
    border-top: .01rem solid transparent;
    .pb20 {
        padding-bottom: .2rem !important;
    }
    .mb20 {
        margin-bottom: .2rem !important;
    }
    .ht-title {
        margin: .15rem .15rem 0 .3rem;
        padding-bottom: .15rem;
        display: flex;
        align-items: center;
        border-bottom: .01rem solid var(--q-gb-bd-c-6);

        .pattern {
            width: .03rem;
            height: .14rem;
            border-radius: .08rem;
            background-color: var(--q-gb-t-c-1);
            ;
            margin-right: .08rem;
        }

        .title {
            color: var(--q-gb-t-c-20);
            font-size: .14rem;
            margin-right: .08rem;
            font-weight: 500;

            span {
                font-weight: bold;
            }
        }

        .hint {
            color: var(--q-gb-bg-c-8);
            font-size: .12rem;
        }
    }

    .ht-both-teams {
        display: flex;
        justify-content: space-around;
        padding-top: .2rem;
        padding-bottom: .56rem;

        .left,
        .center,
        .right {
            flex: 1;
            color: var(--q-gb-t-c-18);
        }

        .left {
            display: flex;
            justify-content: flex-end;

            .teams-logo {
                margin-left: .1rem;
                margin-right: -.1rem;
            }
        }

        .center {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .vs {
                font-size: .12rem;
                color: var(--q-gb-bg-c-8);
            }

            .text-style {
                text-align: center;
                color: var(--q-gb-t-c-1);
                ;
                font-size: .10rem;
            }
        }

        .right {
            display: flex;

            .teams-logo {
                margin-left: -.1rem;
                margin-right: .1rem;
            }
        }

        .teams {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .score {
                margin-top: .04rem;
            }
        }

        // .teams-logo {
        //     width: .4rem;
        //     height: .4rem;
        //     background-color: var(--q-gb-t-c-1);
        //     border-radius: .4rem;
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        // }
    }

    .match-result-list {
        .note {
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--q-gb-t-c-1);
            padding: .08rem 0;
        }

        .match-result {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: .3rem;

            .left,
            .center,
            .right {
                // flex: 1;
                display: flex;
            }

            .left,
            .right {
                width: 1.44rem;
                height: .56rem;
                display: flex;
                position: relative;

                .title {
                    font-size: .12rem;
                    color: var(--q-gb-t-c-20);
                    text-align: center;
                }

                .result {
                    font-size: .12rem;
                    color: var(--q-gb-bg-c-4);
                    text-align: center;
                    margin-top: .03rem;
                }

                .win {
                    color: var(--q-gb-bd-c-8);
                }
            }

            // .win-icon {
            //     position: absolute;
            //     width: .2rem;
            //     height: .2rem;
            //     border-radius: .2rem;
            //     background-color: var(--q-gb-t-c-1);
            //     display: flex;
            //     justify-content: center;
            //     align-items: center;
            // }

            .left {
                justify-content: center;
                align-items: center;
                background-image: linear-gradient(90deg, #e7edfe 0%, #fff 100%);
                border-top-left-radius: .56rem;
                border-bottom-left-radius: .56rem;
                margin-right: -.24rem;

                .win-icon {
                    left: .16rem;
                }
            }

            .center {
                justify-content: center;
                z-index: 1;
                margin: 0 .1rem;

                .round-ball {
                    display: flex;
                    width: .66rem;
                    height: .66rem;
                    border-radius: .66rem;
                    flex-direction: column;
                    background-image: linear-gradient(270deg, #f3f6fe 0%, #f6f8fd 49.27%, #f4f6fb 100%);
                    justify-content: center;
                    align-items: center;

                    div {
                        text-align: center;
                    }

                    .title {
                        font-size: .12rem;
                        color: var(--q-gb-bg-c-4);
                    }

                    .score {
                        font-size: .16rem;
                        color: var(--q-gb-t-c-1);
                    }

                    .text-style {
                        font-size: .1rem;
                        color: var(--q-gb-t-c-4);
                    }
                }
            }

            .right {
                justify-content: center;
                align-items: center;
                background-image: linear-gradient(120deg, #fff 0%, #e7edfe 100%);
                border-top-right-radius: .56rem;
                border-bottom-right-radius: .56rem;
                margin-left: -24px;
                .win-icon {
                    right: .16rem;
                }
            }
        }
    }

}
</style>