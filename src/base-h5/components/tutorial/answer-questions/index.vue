<template>
    <div class="ht-content ht-border">
        <div class="ht-title">
            <div class="pattern"></div>
            <div class="title">{{ title }}</div>
            <div class="hint"></div>
        </div>

        <div class="ht-questions">
            <!-- 题目 -->
            <div class="ht-topic">
                <div class="ht-topic-text">
                    <div class="ht-topic-type">单选</div>
                    <span>当出现这样的赛果：皇马</span>
                    <div class="team-logo"></div>
                    <span>1-1</span>
                    <div class="team-logo"></div>
                    <span>巴萨，</span>
                    <span>哪个选项能全赢?</span>
                </div>
            </div>
            <!-- 答题选项 -->
            <div class="ht-answer-options">
                <div class="ht-anwser-item selected">
                    <div class="option">
                        <!-- <div>A.</div> -->
                        <div class="options-icon"></div>
                    </div>
                    <div class="option-content">
                        <div class="text">大2.5</div>
                        <div class="point">
                            <div class="arrow"></div>
                            <div>1.99</div>
                        </div>
                    </div>
                </div>
                <div class="ht-anwser-item">
                    <div class="option">
                        <div>A.</div>
                        <!-- <div class="options-icon"></div> -->
                    </div>
                    <div class="option-content">
                        <div class="text">大2.5</div>
                        <div class="point fail">
                            <div class="arrow arrow-down"></div>
                            <div>1.99</div>
                        </div>
                    </div>
                </div>
                <div class="ht-anwser-item">
                    <div class="option">
                        <div>A.</div>
                        <!-- <div class="options-icon"></div> -->
                    </div>
                    <div class="option-content">
                        <div class="text">大2.5</div>
                        <div class="point win">
                            <div class="arrow arrow-up"></div>
                            <div>1.99</div>
                        </div>
                    </div>
                </div>
                <div class="ht-anwser-item">
                    <div class="option">
                        <div>A.</div>
                        <!-- <div class="options-icon"></div> -->
                    </div>
                    <div class="option-content">
                        <div class="text">大2.5</div>
                        <div class="point">
                            <div class="arrow"></div>
                            <div>1.99</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ht-answer-result">
                <div class="result fail">
                    <div class="result-icon"></div>
                    <div class="text">恭喜红单</div>
                </div>

                <div class="info">
                    <div>进球数2，小于2.5</div>
                    <div>故投注<span>小2.5</span>能全赢</div>
                </div>
            </div>

        </div>
    </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/core/index.js";
import { useRouter, useRoute } from "vue-router";

defineOptions({
    name: 'answer-questions' // 设置组件名称
})

const router = useRouter();

defineProps({
    title: {
        type: String,
        default: '请在组件中设置title值'
    }
})
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
        .ht-topic {
            display: flex;
            padding:  0 .3rem;
            .ht-topic-type {
                width: .28rem;
                height: .14rem;
                background-color: var(--q-gb-t-c-1);
                font-size: .09rem;
                color: var(--q-gb-t-c-14);
                display: flex;
                align-items: center;
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
            padding:  0 .3rem;
            display: flex;
            flex-direction: row;
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
                    .text {
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
                            border-bottom: .04rem solid transparent; /* 这里的颜色可以根据你的需求进行更改 */
                            margin: 0 auto;
                        }
                        .arrow-down {
                            width: 0;
                            height: 0;
                            border-left: .04rem solid transparent;
                            border-right: .04rem solid transparent;
                            border-top: .04rem solid transparent; /* 这里的颜色可以根据你的需求进行更改 */
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

        .ht-answer-result {
            padding:  0 .3rem;
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
}
</style>