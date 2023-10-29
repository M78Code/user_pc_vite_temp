<template>
    <navigation-bar title="盘口教程"></navigation-bar>

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
        <div class="ht-scroll">
            <match-result-ht v-for="(item, index) in matchResultList" :option="item"
            :key="'matchResultHt' + index"></match-result-ht>
        </div>
    </template>

    <!-- 球数 内容 -->
    <template v-else>
        <match-result-ht v-if="!state.inAnswerQuestion" :key="'matchResultHtBalls' + index" :title="'大小球'" :source="'bigAndSmallBall'"></match-result-ht>
        <answer-questions v-else title="训练营"></answer-questions>

        <div class="ht-congrats">恭喜，您已进阶为足球大师</div>

        <div class="ht-handle">
            <div class="ht-button" @click='go_back'>
                实战来一注
            </div>
            <div class="ht-button default" @click="() => { state.inAnswerQuestion = !state.inAnswerQuestion}">
                模拟先练习
            </div>
        </div>

        <div class="ht-again">
            再学一次
            <div class="icon"></div>
        </div>

    </template>
</template>
<script setup>
import { onMounted, onBeforeMount, reactive } from "vue";
import { useRouter, useRoute } from "vue-router"
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
import matchResultHt from 'src/base-h5/components/tutorial/match-result-ht/index.vue'
import answerQuestions from 'src/base-h5/components/tutorial/answer-questions/index.vue'
import { scrollMenu } from "src/base-h5/components/menu/app-h5-menu/utils.js"


const switchMenu = ['让球', '大小球']
const slideMenu = ['0', '0/0.5', '0.5', '0.5/1', '1球', '1/1.5球', '1.5/2球',]
const matchResultList = [
    {
        ballNumber:'0',
        title:'（平手盘）',
        homeTeamScore: '0',
        awayTeamScore: "0",
        condition: '主客实力相当<br/>均不让球即0（平手盘）',
        matchList: [
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '1 - 0', winIsWho: 'homeTeam', note:'主客谁赢球即全赢，打平则退回本金（走水）',},
           { homeTeam: '退回本金', awayTeam: '退回本金', matchResult: '0 - 0', winIsWho: '', note: ''},
        ]
    },
    {
        ballNumber:'0/0.5',
        title:'（平手半球盘）',
        homeTeamScore: '-0/0.5',
        awayTeamScore: '+0/0.5',
        condition: '主队让0/0.5球',
        matchList: [
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '1 - 0', winIsWho: 'homeTeam', note:'主队赢1球或以上，投注主队全赢，投注客队全输',},
           { homeTeam: '输一般', awayTeam: '赢一般', matchResult: '0 - 0', winIsWho: 'awayTeam', note:'打平，投注主队输一半，投注客队赢一半',},
        ]
    },
    {
        ballNumber:'0.5',
        title:'（半球盘）',
        homeTeamScore: '-0.5',
        awayTeamScore: '+0.5',
        condition: '主队让0.5球',
        matchList: [
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '1 - 0', winIsWho: 'homeTeam', note:'主队赢1球或以上，投注主队全赢，投注客队全输',},
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '0 - 0', winIsWho: 'awayTeam', note:'主队打平或输球，投注主队全输，投注客队全赢',},
        ]
    },
    {
        ballNumber:'0.5/1',
        title:'（半球/一球盘）',
        homeTeamScore: '-0.5/1',
        awayTeamScore: '+0.5/1',
        condition: '主队让0.5/1球',
        matchList: [
           { homeTeam: '赢一半', awayTeam: '输一半', matchResult: '1 - 0', winIsWho: 'homeTeam', note:'主队赢1球或以上，投注主队全赢，投注客队输一半'},
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '2 - 0', winIsWho: 'homeTeam', note:'主队赢2球或以上，投注主队全赢，投注客队全输'},
           { homeTeam: '全输', awayTeam: '全赢', matchResult: '0 - 0', winIsWho: 'awayTeam', note:'主队打平或输球，投注主队全输，投注客队全赢'},
        ]
    },
    {
        ballNumber:'1',
        title:'（一球盘）',
        homeTeamScore: '-1',
        awayTeamScore: '+1',
        condition: '主队让1球',
        matchList: [
           { homeTeam: '退回本金', awayTeam: '退回本金', matchResult: '1 - 0', winIsWho: '',note:'主队赢1球，投注主客均退回本金（走水）',},
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '2 - 0', winIsWho: 'homeTeam', note:'主队赢2球或以上，投注主队全赢，投注客队全输' },
           { homeTeam: '全输', awayTeam: '全赢', matchResult: '0 - 0', winIsWho: 'awayTeam', note:'主队打平或输球，投注主队全输，投注客队全赢'},
        ]
    },
    {
        ballNumber:'1/1.5球',
        title:'（一球/球半盘）',
        homeTeamScore: '-1/1.5',
        awayTeamScore: '+1/1.5',
        condition: '主队让1/1.5球',
        matchList: [
           { homeTeam: '输一半', awayTeam: '赢一半', matchResult: '1 - 0', winIsWho: 'awayTeam ',note:'主队赢1球，投注主队输一半，投注客队赢一半',},
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '2 - 0', winIsWho: 'homeTeam', note:'主队赢2球或以上，投注主队全赢，投注客队全输' },
           { homeTeam: '全输', awayTeam: '全赢', matchResult: '0 - 0', winIsWho: 'awayTeam', note:'主队打平或输球，投注主队全输，投注客队全赢'},
        ]
    },
    {
        ballNumber:'1.5球',
        title:'（球半盘）',
        homeTeamScore: '-1.5',
        awayTeamScore: '+1.5',
        condition: '主队让1.5球',
        matchList: [
           { homeTeam: '全输', awayTeam: '全赢', matchResult: '1 - 0', winIsWho: 'awayTeam ',note:'主队赢1球，投注主队输一半，投注客队全赢',},
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '2 - 0', winIsWho: 'homeTeam', note:'主队赢2球或以上，投注主队全赢，投注客队全输' },
           { homeTeam: '全输', awayTeam: '全赢', matchResult: '0 - 0', winIsWho: 'awayTeam', note:'主队打平或输球，投注主队全输，投注客队全赢'},
        ]
    },
    {
        ballNumber:'1.5/2球',
        title:'（球半/两球盘）',
        homeTeamScore: '-1.5/2',
        awayTeamScore: '+1.5/2',
        condition: '主队让1.5/2球',
        matchList: [
           { homeTeam: '全输', awayTeam: '全赢', matchResult: '1 - 0', winIsWho: 'awayTeam',note:'主队赢1球，投注主队全输，投注客队全赢',},
           { homeTeam: '赢一半', awayTeam: '输一半', matchResult: '2 - 0', winIsWho: 'homeTeam', note:'主队赢2球，投注主队赢一半，投注客队输一半'},
           { homeTeam: '全赢', awayTeam: '全输', matchResult: '3 - 0', winIsWho: 'homeTeam', note:'主队赢3球或以上，投注主队全赢，投注客队全输'},
           { homeTeam: '全输', awayTeam: '全赢', matchResult: '0 - 0', winIsWho: 'awayTeam', note:'主队打平或输球，投注主队全输，投注客队全赢'},
        ]
    }, 
]
const router = useRouter()
const props = defineProps({})
const state = reactive({
    currentSwitchValue: 0, // 让球：0 大小球：1 对应switchMenu index
    currentSlideValue: 0, // 球数 目前slideMenu写死
    inAnswerQuestion: false // 是否进入了答题状态
})

// 返回上一页
const go_back = () => {
    router.go(-1)
}

const switchHandle = (val) => {
    state.currentSwitchValue = val
}

const slideHandle = (val, e) => {
    state.currentSlideValue = val
    scrollMenu(e, ".ht-slide-box", ".slide-item-active");
    const scrollContainer = document.getElementsByClassName('ht-scroll')[0]
    const contentContainer = document.getElementsByClassName('ht-content')[val]
    const topH = contentContainer.offsetTop - scrollContainer.offsetTop
    scrollContainer.scrollTop = topH
}
// onBeforeMount(() => {
// })
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
