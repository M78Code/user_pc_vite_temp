<!-- 1:足球   2:篮球   3:棒球   4:冰球   5:网球   6:美式足球   7:斯诺克  8:兵乓球   9:排球   10:羽毛球 -->
<template>
    <!-- 详情页所有球种的细节比分展示条 -->
    <!-- 当是赛果页面时蒙版不一致需要隐藏 back_mask属性-->
    <div
        class='match_score'
        :class="route.name == 'match_result' ? '' : 'back_mask'"
        v-if="[0,1,2,3,4].includes(+detail_data.ms) || detail_data.mo == 1 "
    >
        <!-- component 自定义标签:动态绑定组件,根据数据的不同更换不同的组件 'is' 关键字用来动态切换组件 -->
        <component :is="scoreComponent[`ScoreChild_${detail_data?.csid}`]" :detail_data="detail_data"/>
    </div>
</template>

<script setup name="match_score">
import {useRoute} from "vue-router";
import {score_child_1,score_child_2, score_child_4, score_child_5, score_child_7, score_child_8, score_child_9} from "./index.js"
import {markRaw} from "vue"

const route = useRoute()
const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
const scoreComponent = {
    ScoreChild_1: markRaw(score_child_1),
    ScoreChild_2: markRaw(score_child_2),
    ScoreChild_4: markRaw(score_child_4),
    ScoreChild_5: markRaw(score_child_5),
    ScoreChild_7: markRaw(score_child_7),
    ScoreChild_8: markRaw(score_child_8),
    ScoreChild_9: markRaw(score_child_9),
}
</script>

<style lang="scss" scoped>
.match_score {
    width: 100%;
    // height: 32px;
    overflow: hidden;
    background-color: var(--q-gb-bg-c-2);
    padding: 0 .1rem;
}
</style>
