<template>
    <div class="handicap-tutorial ht-bg-color">
        <navigation-bar :useCustomGoBack="state.inAnswerQuestion" class="ht-bg-color" :title="i18n_t('app_h5.handicap_tutorial.answer_question')" borderBottomNoShow :centerContentType="state.inAnswerQuestion ? 'text' : 'switch'" @goBackHandle="goBackHandle">
            <!-- '让球', '大小球' -->
            <template v-slot:center>
                <div class="ht-switch-box">
                    <div v-for="(item, index) in switchMenu" :key="'ht-swtich-' + index"
                        @click="switchHandle(index, $event)"
                        :class="['switch-item', state.currentSwitchValue === index && 'switch-item-active']"><span>{{ item
                        }}</span>
                    </div>
                </div>
            </template>
        </navigation-bar>
        <!-- 球数 -->
        <div v-if="!state.inAnswerQuestion" class="ht-slide-box ht-bg-color">
            <div v-for="(item, index) in state.currentSwitchValue !== 1 ? slideMenu : bigSmallBallMenu"
                @click="slideHandle(index, $event)" :class="['slide-item', state.currentSlideValue === index &&
                    'slide-item-active']" :key="'ht-slide-' + index">
                <span>{{ item }}</span>
            </div>
        </div>

        <!-- '让球', '大小球' 内容-->
        <template v-if="!state.currentSwitchValue">
            <div class="ht-scroll ht-bg-color" @scroll="handleScroll">
                <match-result-ht v-for="(item, index) in handicap_data().handicapData" :option="item"
                    :key="'matchResultHt' + index"></match-result-ht>
            </div>
        </template>

        <!-- 球数 内容 -->
        <template v-else>
            <template v-if="!state.inAnswerQuestion">
                <div class="ht-bsball-text">
                    <span>{{ i18n_t('app_h5.handicap_tutorial.big_small_ball_tip') }}</span>
                </div>
                <div class="ht-bsball-scroll ht-bg-color" @scroll="handleScroll">
                    <match-result-ht v-for="(item, index) in handicap_data().bigAndSmallBallData" :option="item"
                        :key="'matchResultHtBalls' + index" :source="'bigAndSmallBall'">
                    </match-result-ht>
                    <div class="ht-handle">
                        <div class="ht-button" @click='go_back'>
                            {{ i18n_t('app_h5.handicap_tutorial.actual_combat') }}
                        </div>
                        <div class="ht-button default" @click="() => { state.inAnswerQuestion = true }">
                            {{ i18n_t('app_h5.handicap_tutorial.practise') }}
                            <span class="arrow"></span>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <answer-questions :title="i18n_t('app_h5.handicap_tutorial.training_camp')" :questionsData="handicap_data().questionsData">
                </answer-questions>
            </template>
            <!-- <div v-if="state.inAnswerQuestion" class="ht-congrats">{{i18n_t('app_h5.handicap_tutorial.actual_combat')}}</div> -->

            <!-- 没有进入答题 或 没有点击选项回答时 -->
            <!-- <div v-if="!state.inAnswerQuestion" class="ht-handle">
                <div class="ht-button" @click='go_back'>
                    {{ i18n_t('app_h5.handicap_tutorial.actual_combat') }}
                </div>
                <div class="ht-button default" @click="() => { state.inAnswerQuestion = true }">
                    {{ i18n_t('app_h5.handicap_tutorial.practise') }}
                </div>
            </div> -->

            <!-- <div v-if="state.inAnswerQuestion" class="ht-again">
            再学一次
            <div class="icon"></div>
        </div> -->
        </template>
    </div>
</template>
<script setup>
import { onMounted, onBeforeMount, reactive, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router"
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
import matchResultHt from 'src/base-h5/components/tutorial/match-result-ht/index.vue'
import answerQuestions from 'src/base-h5/components/tutorial/answer-questions/index.vue'
import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import handicap_data from "./config.js"

const switchMenu = [i18n_t('footer_menu.rangqiu') + i18n_t('app_h5.handicap_tutorial.introdution'), i18n_t('app_h5.handicap_tutorial.big_small_ball') + i18n_t('app_h5.handicap_tutorial.introdution')]
const slideMenu = [
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '0'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '0/0.5'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '0.5'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '0.5/1'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1/1.5'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1.5'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1.5/2')
]
const bigSmallBallMenu = [
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '2.5'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '2.5/3'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '3'),
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '3/3.5'),
]

const router = useRouter()
const props = defineProps({})
const state = reactive({
    currentSwitchValue: 0, // 让球：0 大小球：1 对应switchMenu index
    currentSlideValue: 0, // 球数 目前slideMenu写死
    inAnswerQuestion: false, // 是否进入了答题状态
    htContentHeightList: [],
    bsHtContentHeightList: [],
    isClickFlag: false
})

const goBackHandle = () => {
    state.inAnswerQuestion = false
}

// 返回上一页
const go_back = () => {
    router.go(-1)
}

const switchHandle = (val) => {
    state.currentSwitchValue = val
    state.currentSlideValue = 0
    if (val) {
        nextTick(() => {
            const scrollContainer = document.getElementsByClassName('ht-bsball-scroll')[0]
            const bsContentContainer = document.getElementsByClassName('bsball-list')
            state.bsHtContentHeightList = Array.from(bsContentContainer).map(i => {
                return i.offsetTop - scrollContainer.offsetTop
            })
        })
    }
    state.inAnswerQuestion = false // 切换swtich 重置答题状态
}

const slideHandle = (val, e) => {
    state.isClickFlag = true
    let topH = 0
    let scrollContainer = void 0
    let contentContainer = void 0
    state.currentSlideValue = val
    if (state.currentSwitchValue) {
        scrollMenuEvent(e, ".ht-slide-box", ".slide-item-active");
        scrollContainer = document.getElementsByClassName('ht-bsball-scroll')[0]
        contentContainer = document.getElementsByClassName('bsball-list')[val]
    } else {
        scrollMenuEvent(e, ".ht-slide-box", ".slide-item-active");
        scrollContainer = document.getElementsByClassName('ht-scroll')[0]
        contentContainer = document.getElementsByClassName('ht-content')[val]
    }
    topH = contentContainer.offsetTop - scrollContainer.offsetTop
    scrollContainer.scrollTop = topH
}

const handleScroll = (e) => {
    if (state.isClickFlag) {
        state.isClickFlag = false
        return
    }
    const arr = state.currentSwitchValue ? state.bsHtContentHeightList : state.htContentHeightList
    let index = arr.findIndex(v => v > e.target.scrollTop) - 1
    if (state.currentSlideValue === index) return
    if (index < 0) return
    const dom = document.getElementsByClassName('slide-item')[index]
    state.currentSlideValue = index
    scrollMenuEvent(dom, ".ht-slide-box", ".slide-item-active");
}


onMounted(() => {
    const scrollContainer = document.getElementsByClassName('ht-scroll')[0]
    const contentContainer = document.getElementsByClassName('ht-content')
    state.htContentHeightList = Array.from(contentContainer).map(i => {
        return i.offsetTop - scrollContainer.offsetTop
    })
    state.htContentHeightList.push(state.htContentHeightList[state.htContentHeightList.length - 1] + 200)
})
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
