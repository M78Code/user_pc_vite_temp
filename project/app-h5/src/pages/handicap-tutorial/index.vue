<template>
    <navigation-bar title="盘口教程"></navigation-bar>

    <!-- '让球', '大小球' -->
    <div class="ht-switch-box">
        <div v-for="(item, index) in switchMenu" :key="'ht-swtich-' + index" @click="switchHandle(index)"
            :class="['switch-item', state.currentSwitchValue === index && 'switch-item-active']"><span>{{ item }}</span>
        </div>
    </div>
    <!-- 球数 -->
    <div v-if="state.currentSwitchValue !== 1" class="ht-slide-box">
        <div v-for="(item, index) in slideMenu"
        @click="slideHandle(index)"
            :class="['slide-item', state.currentSlideValue === index && 
            'slide-item-active']" :key="'ht-slide-' + index">
            <span>{{ item }}</span>
        </div>
    </div>

    <!-- '让球', '大小球' 内容-->
    <template v-if="!state.currentSwitchValue">
        <div class="ht-content">
            <div class="ht-title">
                <div class="pattern"></div>
                <div class="title">0（平手盘）</div>
                <!-- <div class="hint"></div> -->
            </div>

            <div class="ht-both-teams">
                <div class="left">
                    <div class="teams">
                        <div>主队</div>
                        <div class="score">0</div>
                    </div>
                    <div class="teams-logo">队标位</div>
                </div>
                <div class="center">
                    <div class="vs">VS</div>
                    <div class="text">主客实力相当<br/>均不让球即0（平手盘）</div>
                </div>
                <div class="right">
                    <div class="teams-logo">队标位</div>
                    <div class="teams">
                        <div>客队</div>
                        <div class="score">0</div>
                    </div>
                </div>
            </div>

            <div class="match-result">
                <div class="left">
                    <div class="home-team teams">
                        <div class="title">投注本队</div>
                        <div class="result win">全赢</div>
                    </div>
                    <div class="win-icon">筹</div>
                </div>
                <div class="center">
                    <div class="round-ball">
                        <div class="title">赛果</div>
                        <div class="score">1 - 0</div>
                        <div class="text">反之亦然</div>
                    </div>
                </div>
                <div class="right">
                    <div class="away-team teams">
                        <div class="title">投注客队</div>
                        <div class="result">全输</div>
                    </div>
                    <!-- <div class="win-icon"></div> -->
                </div>
            </div>

            <div class="match-result">
                <div class="left">
                    <div class="home-team teams">
                        <div class="title">投注本队</div>
                        <div class="result">退回本金</div>
                    </div>
                    <!-- <div class="win-icon">筹</div> -->
                </div>
                <div class="center">
                    <div class="round-ball">
                        <div class="title">赛果</div>
                        <div class="score">0 - 0</div>
                        <!-- <div class="text">反之亦然</div> -->
                    </div>
                </div>
                <div class="right">
                    <div class="away-team teams">
                        <div class="title">投注客队</div>
                        <div class="result">退回本金</div>
                    </div>
                    <!-- <div class="win-icon"></div> -->
                </div>
            </div>

        </div>

        <div class="ht-content">
            <div class="ht-title">
                <div class="pattern"></div>
                <div class="title">0（平手盘）</div>
                <!-- <div class="hint"></div> -->
            </div>

            <div class="ht-both-teams">
                <div class="left">
                    <div class="teams">
                        <div>主队</div>
                        <div class="score">0</div>
                    </div>
                    <div class="teams-logo">队标位</div>
                </div>
                <div class="center">
                    <div class="vs">VS</div>
                    <div class="text">主客实力相当<br/>均不让球即0（平手盘）</div>
                </div>
                <div class="right">
                    <div class="teams-logo">队标位</div>
                    <div class="teams">
                        <div>客队</div>
                        <div class="score">0</div>
                    </div>
                </div>
            </div>

            <div class="match-result">
                <div class="left">
                    <div class="home-team teams">
                        <div class="title">投注本队</div>
                        <div class="result win">全赢</div>
                    </div>
                    <div class="win-icon">筹</div>
                </div>
                <div class="center">
                    <div class="round-ball">
                        <div class="title">赛果</div>
                        <div class="score">1 - 0</div>
                        <div class="text">反之亦然</div>
                    </div>
                </div>
                <div class="right">
                    <div class="away-team teams">
                        <div class="title">投注客队</div>
                        <div class="result">全输</div>
                    </div>
                    <!-- <div class="win-icon"></div> -->
                </div>
            </div>

            <div class="match-result">
                <div class="left">
                    <div class="home-team teams">
                        <div class="title">投注本队</div>
                        <div class="result">退回本金</div>
                    </div>
                    <!-- <div class="win-icon">筹</div> -->
                </div>
                <div class="center">
                    <div class="round-ball">
                        <div class="title">赛果</div>
                        <div class="score">0 - 0</div>
                        <!-- <div class="text">反之亦然</div> -->
                    </div>
                </div>
                <div class="right">
                    <div class="away-team teams">
                        <div class="title">投注客队</div>
                        <div class="result">退回本金</div>
                    </div>
                    <!-- <div class="win-icon"></div> -->
                </div>
            </div>

        </div>
    </template>

    <!-- 球数 内容 -->
    <template v-else>
        <div class="ht-content">
            <div class="ht-title">
                <div class="pattern"></div>
                <div class="title">大小球</div>
                <div class="hint">全场90分钟（含伤停补时）两队进球数的总和</div>
            </div>
        </div>
    </template>
</template>
<script setup>
import { onMounted, onBeforeMount, reactive } from "vue";
import navigationBar from 'src/base-h5/components/navigation-bar/index.vue'

const switchMenu = ['让球', '大小球']
const slideMenu = ['0', '0/0.5', '0.5', '0.5/1', '1球', '1/1.5球', '2球', '2/2.5球']

const props = defineProps({})
const state = reactive({
    currentSwitchValue: 0, // 让球：0 大小球：1 对应switchMenu index
    currentSlideValue: 0 // 球数 目前slideMenu写死
})

const switchHandle = (val) => {
    state.currentSwitchValue = val
}

const slideHandle = (val) => {
    state.currentSlideValue = val
}
// onBeforeMount(() => {
// })
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
