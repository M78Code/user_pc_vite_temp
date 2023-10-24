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
        <div v-for="(item, index) in slideMenu" @click="slideHandle(index)" :class="['slide-item', state.currentSlideValue === index &&
            'slide-item-active']" :key="'ht-slide-' + index">
            <span>{{ item }}</span>
        </div>
    </div>

    <!-- '让球', '大小球' 内容-->
    <template v-if="!state.currentSwitchValue">
        <div class="ht-scroll">
            <match-result-ht v-for="(item, index) in matchResultList" :title="'0（平手盘）'"
            :key="'matchResultHt' + index"></match-result-ht>
        </div>
    </template>

    <!-- 球数 内容 -->
    <template v-else>
        <match-result-ht :key="'matchResultHtBalls' + index" :title="'大小球'" :source="'bigAndSmallBall'"></match-result-ht>

        <div class="ht-handle">
            <div class="ht-button">
                实战来一注
            </div>
            <div class="ht-button default">
                模拟先练习
            </div>
        </div>

    </template>
</template>
<script setup>
import { onMounted, onBeforeMount, reactive } from "vue";
import navigationBar from 'src/base-h5/components/navigation-bar/index.vue'
import matchResultHt from 'src/base-h5/components/match-result-ht/index.vue'

const switchMenu = ['让球', '大小球']
const slideMenu = ['0', '0/0.5', '0.5', '0.5/1', '1球', '1/1.5球', '2球', '2/2.5球']
const matchResultList = 4

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
