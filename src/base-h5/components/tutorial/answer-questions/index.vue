<template>
    <div class="ht-content ht-border">
        <!-- <div class="ht-title">
            <div class="pattern"></div>
            <div class="title">{{ title }}</div>
            <div class="hint"></div>
        </div> -->
        <template v-for="(item, index) in questionsData" :key="'questions' + index">
            <div v-if="state.currentQuestion === index" class="ht-questions">
                <!-- 题目 -->
                <div class="ht-topic-type">{{ !item.questionsType && '单选' }}</div>
                <div class="ht-topic">
                    <div class="ht-topic-text">
                        <span>1、当出现这样的赛果：{{ item.questions }}</span>
                    </div>
                </div>
                <div class="teams-content">
                    <div class="teams">
                        <img src="./manlian.svg">
                        <div>{{ i18n_t('app_h5.handicap_tutorial.m_chesester_untied') }}</div>
                    </div>
                    <div class="score">
                        <div>1</div>
                        <div class="line">-</div>
                        <div>1</div>
                    </div>
                    <div class="teams">
                        <img src="./qieerxi.svg">
                        <div>{{ i18n_t('app_h5.handicap_tutorial.chelsea') }}</div>
                    </div>
                </div>
                <!-- 答题选项 -->
                <div class="ht-answer-options">
                    <div v-for="(i, index) in item.options" :key="'answer' + index" :class="['ht-anwser-item', filterOptionsState(i), state.currentOption === i.label && 'selected']" @click="selectOptionHandle(i)">
                        <div class="option">
                            <template v-if="!state.afterAnswerQuestion">
                            </template>
                            <template v-else-if="state.afterAnswerQuestion === 'success'">
                                <div v-if="i.isRight === 'error'"></div>
                                <div v-else class="options-icon">
                                    <img v-if="i.isRight === 'success'" src="./sccuess.svg">
                                    <img v-else src="./fail.svg">
                                </div>
                            </template>
                            <template v-else>
                                <div class="options-icon">
                                    <img v-if="i.isRight === 'success'" src="./sccuess.svg">
                                    <img v-else src="./fail.svg">
                                    <!-- {{ i.isRight === 'success' ? '√' : 'x' }} -->
                                </div>
                            </template>
                        </div>
                        <div class="option-content">
                            <div class="text-style">{{ i.option }}</div>
                            <div :class="['point', !i.isWin ? 'win' : 'fail']">
                                <div :class="['arrow', !i.isWin ? 'arrow-up' : 'arrow-down']"></div>
                                <div>{{ i.odds }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="state.afterAnswerQuestion" class="ht-answer-result">
                    <div :class="['result', state.afterAnswerQuestion === 'success' ? 'win' : 'fail']">
                        <div class="result-icon">
                            <img v-if="state.afterAnswerQuestion === 'success'" src="./sccuess_round.svg">
                            <img v-else src="./fail_round.svg">
                        </div>
                        <div class="text-style">{{state.afterAnswerQuestion === 'success' ? '恭喜红单' : '很遗憾，您还未完全掌握'}}</div>
                    </div>

                    <div class="info">
                        <div>{{ item.note }}</div>
                        <div v-html="item.note1"></div>
                    </div>
                </div>

                <div v-if="state.afterAnswerQuestion" :class="[nextQuestionsText() && 'ht-button', 'default']" @click="nextQuestionsHandle">
                {{ nextQuestionsText() }}
                </div>
            </div>
        </template>

        <!-- <div v-if="state.currentAnswer === props.questionsData.length && state.recordSuccess === props.questionsData.length" class="ht-congrats">恭喜，您已进阶为足球大师</div> -->

        <div v-if="state.afterAnswerQuestion" class="ht-handle">
            <div class="ht-button" @click='go_back'>
                实战来一注
            </div>
            <!-- <div class="ht-button default" @click="nextQuestionsHandle">
                {{state.currentAnswer === props.questionsData.length && state.recordSuccess === props.questionsData.length ? i18n_t('app_h5.handicap_tutorial.return_home') : i18n_t('app_h5.handicap_tutorial.next')}}
            </div> -->
        </div>

        <!-- <div v-if="state.currentAnswer === props.questionsData.length && state.recordSuccess !== props.questionsData.length" class="ht-again" @click="resetHandle">
            {{ i18n_t('app_h5.handicap_tutorial.again') }}
            <div class="icon"></div>
        </div> -->

    </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/output/index.js";
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

defineOptions({
    name: 'answer-questions' // 设置组件名称
})

const router = useRouter();

const props = defineProps({
    title: {
        type: String,
        default: '请在组件中设置title值'
    },
    questionsData: {
        type: Array,
        default: []
    }
})

const state = reactive({
    currentQuestion: 0, // 当前为第几个问题
    currentAnswer:0, // 当前回答了几个问题
    afterAnswerQuestion: '', // 答题后  '' - 没有答题 'success' - 答对 'error' - 答错
    recordSuccess: 0, // 记录答对题数，如果同传过来的题数相等则展示成功相关
    currentOption: '' // 当前选了a 还是 b 空则都没选
})

const selectOptionHandle = (v) => {
    if (state.afterAnswerQuestion) return
    if (v.isRight === 'success') state.recordSuccess++
    state.afterAnswerQuestion = v.isRight
    state.currentAnswer++
    state.currentOption = v.label
}

const nextQuestionsHandle = () => {
    if (state.currentAnswer === props.questionsData.length && state.recordSuccess === props.questionsData.length) {
        go_back()
        return
    }
    // if (state.currentAnswer === props.questionsData.length && state.recordSuccess !== props.questionsData.length) {
    //     resetHandle()
    //     return
    // }
    if (state.currentQuestion === (props.questionsData.length - 1)) return
    ++state.currentQuestion
    state.afterAnswerQuestion = ''
    state.currentOption = ''
}

const resetHandle = () => {
    state.currentQuestion = 0
    state.currentAnswer = 0
    state.afterAnswerQuestion = ''
    state.recordSuccess = 0 
    state.currentOption = ''
}

const nextQuestionsText = () => {
    if (state.currentAnswer === props.questionsData.length && state.recordSuccess === props.questionsData.length) {
        return i18n_t('app_h5.handicap_tutorial.return_home')
    } else if (state.currentAnswer === props.questionsData.length && state.recordSuccess !== props.questionsData.length) {
        return ''
    } else {
        return i18n_t('app_h5.handicap_tutorial.next')
    }
}

const filterOptionsState = (i) => {
    if (state.currentOption && i.isRight === 'error') {
        return 'error'
    }
    if (state.currentOption && i.isRight === 'success') {
        return 'sccuess'
    }
}

const go_back = () => {
    router.push({ name: "matchList" }); // 此处跳转至盘口教程
}
</script>
<style scoped lang="scss">
.ht-border {
    // border-top: .08rem solid var(--q-gb-bg-c-11);
    padding-top: .08rem;
}

.ht-content {
    padding-bottom: .2rem;

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
            color: var(--q-gb-bg-c-3);
            font-size: .14rem;
            margin-right: .08rem;
            font-weight: 500;
        }

        .hint {
            color: var(--q-gb-bg-c-8);
            font-size: .12rem;
        }
    }

    .ht-questions {
        padding: .2rem;
        margin: 0 .2rem .11rem .2rem;
        background-color: var(--q-gb-bg-c-25);
        border-radius: .2rem;
        position: relative;
        .ht-topic-type {
            width: .4rem;
            height: .18rem;
            background-color: var(--q-gb-bg-c-18);
            font-size: .12rem;
            color: var(--q-gb-t-c-27);
            display: flex;
            align-items: end;
            justify-content: center;
            border-radius: .04rem;
            margin-bottom: .04rem;
        }
        .teams-content {
            display: flex;
            justify-content: center;
            margin-top: .28rem;
            color: var(--q-gb-t-c-27);
            .teams {
                display: flex;
                flex-direction: column;
                align-items: center;
                img {
                    margin-bottom: .1rem;
                }
            }
            .score {
                display: flex;
                align-items: center;
                font-size: .32rem;
                font-weight: 700;
                margin: 0 .4rem;
                .line {
                    margin: 0 .02rem;
                }
            }
        }
        .ht-topic {
            display: flex;
            // padding: 0 .3rem;

            .ht-topic-text {
                display: flex;
                font-size: .16rem;
                flex-wrap: wrap;
                align-items: center;
                font-weight: 500;
                color: var(--q-gb-t-c-27);
            }
        }

        .ht-answer-options {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-top: .2rem;
            justify-content: space-between;
            padding-bottom: .2rem;

            .ht-anwser-item {
                display: flex;
                width: 1.46rem;
                height: .7rem;
                align-items: center;
                justify-content: center;
                border:.01rem solid var(--q-gb-bd-c-4);
                border-radius: .08rem;
                box-shadow: 0px 4px 12px 0px rgba(27, 30, 38, 0.02);
                position: relative;
                // background-color: rgb(from var(--q-gb-bg-c-13) r g b / 10%);
                // border: .02rem solid var(--q-gb-bg-c-13);
                .option {
                    margin-right: .04rem;
                    font-size: .14rem;
                    position: absolute;
                    right: .02rem;
                    top: .02rem;
                    div {
                        width: .2rem;
                        height: .2rem;
                        text-align: center;
                    }

                    .options-icon {
                        border-radius: .2rem;
                    }
                }


                .option-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    width: 1rem;
                    height: .41rem;
                    border-radius: .04rem;
                    background-color: var(--q-gb-bd-c-);

                    .text-style {
                        font-size: .14rem;
                        color: var(--q-gb-t-c-3);
                    }

                    .point {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: .18rem;

                        .arrow {
                            margin-right: .02rem;
                        }

                        .arrow-up {
                            width: 0;
                            height: 0;
                            border-left: .04rem solid transparent;
                            border-right: .04rem solid transparent;
                            border-bottom: .04rem solid transparent;
                            /* 这里的颜色可以根据你的需求进行更改 */
                            margin: 0 auto;
                        }

                        .arrow-down {
                            width: 0;
                            height: 0;
                            border-left: .04rem solid transparent;
                            border-right: .04rem solid transparent;
                            border-top: .04rem solid transparent;
                            /* 这里的颜色可以根据你的需求进行更改 */
                            margin: 0 auto;
                        }
                    }

                    .win {
                        color: #f00;

                        .arrow {
                            border-bottom-color: #f00;
                        }
                    }

                    .fail {
                        color: #00bd00;

                        .arrow {
                            border-top-color: #00bd00;
                        }
                    }
                }
            }

            .selected {
                background-color: rgb(from var(--q-gb-bg-c-13) r g b / 10%);
                &.sccuess {
                    border: .02rem solid var(--q-gb-bg-c-13);
                }
                &.error {
                    background-color: rgb(from var(--q-gb-bd-c-2) r g b / 10%);
                    border: .02rem solid var(--q-gb-bd-c-2);
                }
            }

            .sccuess {
                background-color: rgb(from var(--q-gb-bg-c-13) r g b / 10%);
            }
        }

        :deep(.ht-answer-result .info span) {
            color: var(--q-gb-t-c-1);
        }


        .ht-answer-result {
            // border-top: 0.01rem solid var(--q-gb-bd-c-6);
            padding: 0.1rem .3rem;
            padding-bottom: .13rem;
            margin-top: .2rem;

            .result {
                display: flex;
                align-items: center;
                font-size: .16rem;
                margin-bottom: .14rem;
                color: var(--q-gb-bg-c-4);
                font-weight: 600;
                flex-direction: column;

                .result-icon {
                    img {
                        width: .34rem;
                        height: .34rem;
                    }
                }
            }

            .info {
                font-size: .14rem;
                text-align: center;
                color: var(--q-gb-t-c-18);

                span {
                    color: var(--q-gb-t-c-1);
                }
            }
        }

        .ht-button {
            font-size: .16rem;
            color: var(--q-gb-t-c-1);
            font-weight: 500;
            text-align: center;
            padding: 0.16rem 0 0rem 0;
            margin-top: .3rem;
            margin-bottom: -.04rem;
            &::after {
                content: ' ';
                position: absolute;
                bottom: .56rem;
                left: 0;
                width: 100%;
                border-top: .01rem solid var(--q-gb-bd-c-6);
            }
        } 
    }

    .ht-congrats {
        font-size: .18rem;
        font-weight: 800;
        color: var(--q-gb-t-c-1);
        text-align: center;
        margin-bottom: .3rem;
    }

    .ht-handle {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: .29rem;

        .ht-button {
            width: 2.4rem;
            height: .44rem;
            background-color: var(--q-gb-bg-c-42);
            border-radius: .44rem;
            font-size: .16rem;
            color: var(--q-gb-bd-c-12);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: .12rem;
            border: .01rem solid var(--q-gb-bd-c-18);
        }
    }

    .ht-again {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: .16rem;
        font-weight: 500;
        color: var(--q-gb-t-c-1);

        .icon {
            width: .1rem;
            height: .1rem;
            background-color: var(--q-gb-t-c-1);
            margin-left: .04rem;
        }
    }
    .text-style{
        color: var(--q-gb-t-c-18);
    }
}</style>