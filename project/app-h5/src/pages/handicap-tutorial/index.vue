<template>
    <navigation-bar title="盘口教程"></navigation-bar>

    <div class="ht-switch-box">
        <div v-for="(item, index) in switchMenu" :key="'ht-swtich-' + index" @click="switchHandle(index)"
            :class="['switch-item', state.currentSwitchValue === index && 'switch-item-active']"><span>{{ item }}</span>
        </div>
    </div>

    <div class="ht-slide-box">
        <div v-for="(item, index) in slideMenu"
        @click="slideHandle(index)"
            :class="['slide-item', state.currentSlideValue === index && 
            'slide-item-active']" :key="'ht-slide-' + index">
            <span>{{ item }}</span>
        </div>
    </div>
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
