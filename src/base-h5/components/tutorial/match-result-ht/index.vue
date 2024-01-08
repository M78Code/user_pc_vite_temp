<!--
 * @Description:盘口教程比分展示组件
-->
<template>
    <div :class="['ht-content', state.source === 'bigAndSmallBall' && 'ht-border bsball-content']">
        <div v-if="state.source !== 'bigAndSmallBall'" class="ht-title">
            <!-- <div class="pattern"></div> -->
            <div class="title">
                <span>{{ option.ballNumber }}</span>
                <span>{{ option.title }}</span>
            </div>
        </div>



        <!-- <div :class="['ht-both-teams', state.source === 'bigAndSmallBall' && 'pb20']">
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
        </div> -->

        

        
        <div :class="['match-result-list', state.source === 'bigAndSmallBall' && 'bsball-list']" v-for="(item, index) in option.matchList" :key="'matchResult' + index">
            <div class="head-title" v-if="state.source === 'bigAndSmallBall'">
                <span>{{ item.ballNumber }}</span>
            </div>
            <div class="note" v-html="item.note"></div>
            <div :class="['match-result', state.source === 'bigAndSmallBall' && 'mb20']">
                <div class="left">
                    <div class="home-team teams">
                        <div v-if="state.source !== 'bigAndSmallBall'" class="teams-logo"><img :class="[UserCtr.theme === 'theme-1' && 'teams-logo-theme']" src="./teams-icon.svg" alt=""></div>
                        <div class="title">{{ state.source !== 'bigAndSmallBall' ? i18n_t('app_h5.handicap_tutorial.bet_home_team') : item.big }} </div>
                        <div :class="['result', item.winIsWho === 'homeTeam' ? 'win' : item.winIsWho ? 'lose' : 'default']">{{ item.homeTeam }}</div>
                    </div>
                </div>
                <div class="center">
                    <div class="round-ball">
                        <div class="score">{{ item.matchResult }}</div>

                        <div class="text-style" v-html="option.condition"></div>
                    </div>
                </div>
                <div class="right">
                    <div class="away-team teams">
                        <div v-if="state.source !== 'bigAndSmallBall'" class="teams-logo"><img :class="[UserCtr.theme === 'theme-1' && 'teams-logo-theme']" src="./teams-icon.svg" alt=""></div>
                        <div class="title">{{ state.source !== 'bigAndSmallBall' ? i18n_t('app_h5.handicap_tutorial.bet_away_team') : item.small }}</div>
                        <div :class="['result', item.winIsWho === 'awayTeam' ? 'win' : item.winIsWho ? 'lose' : 'default']">{{ item.awayTeam }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { i18n_t, compute_local_project_file_path } from "src/output/index.js";
import { useRouter, useRoute } from "vue-router";
import { reactive } from "vue";
import { UserCtr } from "src/output/index.js";
console.log('------------------------------------4324321-------------------------------',UserCtr.theme)
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
    margin: 0 .2rem .16rem .2rem;
    background-color: var(--q-gb-bg-c-23);
    border-radius: .2rem;
    border-top: .01rem solid transparent;
    .pb20 {
        padding-bottom: .2rem !important;
    }
    .mb20 {
        margin-bottom: .2rem !important;
    }
    .ht-title {
        height: .49rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 0.01rem solid var(--q-gb-bd-c-4);

        .pattern {
            width: .03rem;
            height: .14rem;
            border-radius: .08rem;
            background-color: var(--q-gb-t-c-1);;
            margin-right: .08rem;
        }

        .title {
            color: var(--q-gb-t-c-27);
            font-size: .14rem;
            font-weight: 500;
            span {
                font-weight: bold;
                margin-right: .04rem;
            }
        }

        .hint {
            color: var(--q-gb-bg-c-8);
            font-size: .12rem;
        }
    }

    // .ht-both-teams {
    //     display: flex;
    //     justify-content: space-around;
    //     padding-top: .2rem;
    //     padding-bottom: .56rem;

    //     .left,
    //     .center,
    //     .right {
    //         flex: 1;
    //         color: var(--q-gb-t-c-18);
    //     }

    //     .left {
    //         display: flex;
    //         justify-content: flex-end;

    //         .teams-logo {
    //             margin-left: .1rem;
    //             margin-right: -.1rem;
    //         }
    //     }

    //     .center {
    //         display: flex;
    //         flex-direction: column;
    //         justify-content: center;
    //         align-items: center;

    //         .vs {
    //             font-size: .12rem;
    //             color: var(--q-gb-bg-c-8);
    //         }

    //         .text-style {
    //             text-align: center;
    //             color: var(--q-gb-t-c-1);
    //             ;
    //             font-size: .10rem;
    //         }
    //     }

    //     .right {
    //         display: flex;

    //         .teams-logo {
    //             margin-left: -.1rem;
    //             margin-right: .1rem;
    //         }
    //     }

    //     .teams {
    //         display: flex;
    //         flex-direction: column;
    //         justify-content: center;
    //         align-items: center;

    //         .score {
    //             margin-top: .04rem;
    //         }
    //     }

    //     // .teams-logo {
    //     //     width: .4rem;
    //     //     height: .4rem;
    //     //     background-color: var(--q-gb-t-c-1);
    //     //     border-radius: .4rem;
    //     //     display: flex;
    //     //     justify-content: center;
    //     //     align-items: center;
    //     // }
    // }

    .bsball-list {
        margin-bottom: .16rem;
        background-color: var(--q-gb-bg-c-23);
        padding-bottom: .25rem;
        border-radius: .2rem;
        .head-title {
            font-size: .18rem !important;
            font-weight: 600;
            display: flex;
            justify-content: center;
            height:.49rem;
            align-items: center;
            border-bottom: .01rem solid var(--q-gb-bd-c-4);
            color: var(--q-gb-t-c-27);
        }
        .title {
            font-size: .16rem !important;
            font-weight: 500;
        }
    }
    .match-result-list {
        .note {
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--q-gb-t-c-29);
            padding: .12rem 0;
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
                .teams-logo {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: .04rem;
                    color: var(--q-gb-t-c-27);
                    .teams-logo-theme {
                        filter: brightness(100)
                    }
                }
            }

            .left,
            .right {
                width: 1.44rem;
                // height: .56rem;
                display: flex;
                position: relative;

                .title {
                    font-size: .12rem;
                    color: var(--q-gb-t-c-27);
                    text-align: center;
                }

                .result {
                    font-size: .12rem;
                    color: #afafaf;
                    background-color: var(--q-gb-bg-c-43);
                    text-align: center;
                    margin-top: .03rem;
                    padding: .01rem .04rem;
                    border-radius: .06rem;
                }

                .win {
                    background-color: rgb(from var(--q-gb-bd-c-2) r g b / 10%);
                    color: var(--q-gb-bd-c-2);
                }

                .lose {
                    background-color: rgb(from #00B42A r g b / 10%);
                    color: #00B42A;
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
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    white-space: nowrap;

                    div {
                        text-align: center;
                    }

                    .title {
                        font-size: .12rem;
                        color: var(--q-gb-bg-c-4);
                    }

                    .score {
                        font-size: .32rem;
                        color: var(--q-gb-t-c-27);
                        font-family: 'ky-font';
                    }

                    .text-style {
                        font-size: .12rem;
                        color: var(--q-gb-t-c-28);
                        white-space: nowrap;
                    }
                }
            }

            .right {
                justify-content: center;
                align-items: center;
                .win-icon {
                    right: .16rem;
                }
            }
        }
    }

}

.bsball-content {
    background-color: transparent;
}
</style>