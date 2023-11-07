<template>
    <navigation-bar :title="i18n_t('app_h5.cathectic.handicap_tutorial')"></navigation-bar>

    <!-- '让球', '大小球' -->
    <div class="ht-switch-box">
        <div v-for="(item, index) in switchMenu" :key="'ht-swtich-' + index" @click="switchHandle(index, $event)"
            :class="['switch-item', state.currentSwitchValue === index && 'switch-item-active']"><span>{{ item }}</span>
        </div>
    </div>
    <!-- 球数 -->
    <div v-if="state.currentSwitchValue !== 1" class="ht-slide-box">
        <div v-for="(item, index) in slideMenu" @click="slideHandle(index, $event)" :class="['slide-item', state.currentSlideValue === index &&
            'slide-item-active']" :key="'ht-slide-' + index">
            <span>{{ item }}</span>
        </div>
    </div>

    <!-- '让球', '大小球' 内容-->
    <template v-if="!state.currentSwitchValue">
        <div class="ht-scroll" @scroll="handleScroll">
            <match-result-ht v-for="(item, index) in handicapData" :option="item"
                :key="'matchResultHt' + index"></match-result-ht>
        </div>
    </template>

    <!-- 球数 内容 -->
    <template v-else>
        <template v-if="!state.inAnswerQuestion">
            <match-result-ht v-for="(item, index) in bigAndSmallBallData" :option="item" :key="'matchResultHtBalls' + index"
                :source="'bigAndSmallBall'"></match-result-ht>
        </template>
        <template v-else>
            <answer-questions :title="i18n_t('app_h5.handicap_tutorial.training_camp')" :questionsData="questionsData">
            </answer-questions>
        </template>
        <!-- <div v-if="state.inAnswerQuestion" class="ht-congrats">{{i18n_t('app_h5.handicap_tutorial.actual_combat')}}</div> -->

        <!-- 没有进入答题 或 没有点击选项回答时 -->
        <div v-if="!state.inAnswerQuestion" class="ht-handle">
            <div class="ht-button" @click='go_back'>
                {{i18n_t('app_h5.handicap_tutorial.actual_combat')}}
            </div>
            <div class="ht-button default" @click="() => { state.inAnswerQuestion = true }">
                {{i18n_t('app_h5.handicap_tutorial.practise')}}
            </div>
        </div>

        <!-- <div v-if="state.inAnswerQuestion" class="ht-again">
            再学一次
            <div class="icon"></div>
        </div> -->

    </template>
</template>
<script setup>
import { onMounted, onBeforeMount, reactive } from "vue";
import { useRouter, useRoute } from "vue-router"
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
import matchResultHt from 'src/base-h5/components/tutorial/match-result-ht/index.vue'
import answerQuestions from 'src/base-h5/components/tutorial/answer-questions/index.vue'
import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import {questionsData, bigAndSmallBallData, handicapData} from "./config.js"

const switchMenu = [i18n_t('footer_menu.rangqiu'), i18n_t('app_h5.handicap_tutorial.big_small_ball')]
const slideMenu = [
    '0', 
    '0/0.5', 
    '0.5', 
    '0.5/1', 
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1'), 
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1/1.5'), 
    i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1.5/2')
]

const router = useRouter()
const props = defineProps({})
const state = reactive({
    currentSwitchValue: 0, // 让球：0 大小球：1 对应switchMenu index
    currentSlideValue: 0, // 球数 目前slideMenu写死
    inAnswerQuestion: false, // 是否进入了答题状态
    htContentHeightList: []
})

// 返回上一页
const go_back = () => {
    router.go(-1)
}

const switchHandle = (val) => {
    state.currentSwitchValue = val
    state.inAnswerQuestion = false // 切换swtich 重置答题状态
}

const slideHandle = (val, e) => {
    state.currentSlideValue = val
    scrollMenuEvent(e, ".ht-slide-box", ".slide-item-active");
    const scrollContainer = document.getElementsByClassName('ht-scroll')[0]
    const contentContainer = document.getElementsByClassName('ht-content')[val]
    const topH = contentContainer.offsetTop - scrollContainer.offsetTop
    scrollContainer.scrollTop = topH
}

const handleScroll = (e) => {
    const index = state.htContentHeightList.findIndex(v => v > e.target.scrollTop) - 1
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
})
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
