<template>
    <div class="ht-content ht-border">
        <div class="ht-title">
            <div class="pattern"></div>
            <div class="title">{{ title }}</div>
            <div class="hint"></div>
        </div>
        <template v-for="(item, index) in questionsData" :key="'questions' + index">
            <div v-if="state.currentQuestion === index" class="ht-questions">
                <!-- 题目 -->
                <div class="ht-topic">
                    <div class="ht-topic-text">
                        <div class="ht-topic-type">{{ !item.questionsType && i18n_t('app_h5.handicap_tutorial.single') }}</div>
                        <span>{{ i18n_t('app_h5.handicap_tutorial.results_appear') }}：{{ item.homeTeam }}</span>
                        <div class="team-logo"></div>
                        <span>{{ item.matchResult }}</span>
                        <div class="team-logo"></div>
                        <span>{{ item.awayTeam }}，</span>
                        <span>{{ item.questions }}</span>
                    </div>
                </div>
                <!-- 答题选项 -->
                <div class="ht-answer-options">
                    <div v-for="(i, index) in item.options" :key="'answer' + index" :class="['ht-anwser-item', i.label === state.currentOption && 'selected']" @click="selectOptionHandle(i)">
                        <div class="option">
                            <!-- 此处分为 没答题时 答对时 答错时 -->
                            <template v-if="!state.afterAnswerQuestion">
                                <div>{{ i.label }}.</div>
                            </template>
                            <template v-else-if="state.afterAnswerQuestion === 'success'">
                                <div v-if="i.isRight === 'error'">{{ i.label }}.</div>
                                <div v-else class="options-icon">√</div>
                            </template>
                            <template v-else>
                                <div class="options-icon">{{ i.isRight === 'success' ? '√' : 'x' }}</div>
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
                        <div class="result-icon"></div>
                        <div class="text-style">{{state.afterAnswerQuestion === 'success' ? i18n_t('app_h5.handicap_tutorial.red_list') : i18n_t('app_h5.handicap_tutorial.not_master')}}</div>
                    </div>

                    <div class="info">
                        <div>{{ item.note }}</div>
                        <div v-html="item.note1"></div>
                    </div>
                </div>
            </div>
        </template>

        <div v-if="state.currentAnswer === props.questionsData.length && state.recordSuccess === props.questionsData.length" class="ht-congrats">{{ i18n_t('app_h5.handicap_tutorial.football_master') }}</div>

        <div v-if="state.afterAnswerQuestion" class="ht-handle">
            <div class="ht-button" @click='go_back'>
                {{ i18n_t('app_h5.handicap_tutorial.actual_combat') }}
            </div>
            <div class="ht-button default" @click="nextQuestionsHandle">
                {{state.currentAnswer === props.questionsData.length && state.recordSuccess === props.questionsData.length ? '返回主页' : '下一题'}}
            </div>
        </div>

        <div v-if="state.currentAnswer === props.questionsData.length && state.recordSuccess !== props.questionsData.length" class="ht-again" @click="resetHandle">
            再学一次
            <div class="icon"></div>
        </div>

    </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/core/index.js";
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
    if (state.currentAnswer === props.questionsData.length && state.recordSuccess === props.questionsData.length) go_back()
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

const go_back = () => {
    router.push({ name: "matchList" }); // 此处跳转至盘口教程
}
</script>
<style scoped lang="scss">
.ht-border {
    border-top: .08rem solid var(--q-gb-bg-c-11);
}

.ht-content {
    padding-bottom: .2rem;

    .ht-title {
        margin: .15rem .15rem 0 .3rem;
        padding-bottom: .15rem;
        display: flex;
        align-items: center;
        border-bottom: .01rem solid var(--q-gb-bd-c-7);

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
        padding-top: .16rem;
        margin-bottom: .11rem;
        .ht-topic {
            display: flex;
            padding: 0 .3rem;

            .ht-topic-type {
                width: .28rem;
                height: .14rem;
                background-color: var(--q-gb-t-c-1);
                font-size: .09rem;
                color: var(--q-gb-t-c-14);
                display: flex;
                align-items: end;
                justify-content: center;
                border-radius: .04rem;
                margin-right: .02rem;
                margin-top: -.01rem;
            }

            .ht-topic-text {
                display: flex;
                font-size: .14rem;
                flex-wrap: wrap;
                align-items: center;

                .team-logo {
                    display: inline-block;
                    width: .14rem;
                    height: .21rem;
                    background-color: var(--q-gb-t-c-1);
                    margin: 0 .02rem;
                    margin-top: -.04rem;
                }
            }
        }

        .ht-answer-options {
            padding: 0 .3rem;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            margin-top: .2rem;
            margin-bottom: 1.24rem;

            .ht-anwser-item {
                display: flex;
                flex: 50%;
                margin-bottom: .14rem;
                align-items: center;

                .option {
                    margin-right: .04rem;
                    font-size: .14rem;

                    div {
                        width: .2rem;
                        height: .2rem;
                        text-align: center;
                    }

                    .options-icon {
                        background-color: var(--q-gb-t-c-1);
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
                    background-color: var(--q-gb-bd-c-7);

                    .text-style {
                        font-size: .12rem;
                        color: var(--q-gb-t-c-3);
                    }

                    .point {
                        display: flex;
                        justify-content: center;
                        align-items: center;

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
                .option-content {
                    background-color: var(--q-gb-t-c-7);
                }
            }
        }

        :deep(.ht-answer-result .info span) {
            color: var(--q-gb-t-c-1);
        }


        .ht-answer-result {
            border-top: 0.01rem solid var(--q-gb-bd-c-7);
            padding: 0.1rem .3rem;
            padding-bottom: .13rem;

            .result {
                display: flex;
                align-items: center;
                font-size: .14rem;
                margin-bottom: .14rem;

                .result-icon {
                    width: .2rem;
                    height: .2rem;
                    background-color: var(--q-gb-t-c-1);
                    margin-right: .06rem;
                }
            }

            .win {
                color: var(--q-gb-t-c-1);
            }

            .fail {
                color: var(--q-gb-bd-c-8);
            }

            .info {
                font-size: .12rem;

                span {
                    color: var(--q-gb-t-c-1);
                }
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
        margin-bottom: .24rem;

        .ht-button {
            width: 3.12rem;
            height: .44rem;
            background-color: var(--q-gb-t-c-1);
            border-radius: .04rem;
            font-size: .16rem;
            color: var(--q-gb-t-c-14);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: .12rem;
            border: 1px solid transparent;
        }

        .default {
            background-color: var(--q-gb-t-c-14);
            border-color: var(--q-gb-t-c-1);
            color: var(--q-gb-t-c-1);
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

}</style>