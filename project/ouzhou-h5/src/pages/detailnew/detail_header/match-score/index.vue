<template>
    <!-- 详情页所有球种的细节比分展示条 -->
    <!-- 当是赛果页面时蒙版不一致需要隐藏 back_mask属性-->
    <div class='match_score ' :class="route.name == 'match_result' ?'':'back_mask'">
        <!-- component 自定义标签:动态绑定组件,根据数据的不同更换不同的组件 'is' 关键字用来动态切换组件 -->
        <component :is="scoreComponent[`ScoreChild_${detail_data?.csid}`]" :detail_data="detail_data" />
    </div>
</template>

<script setup name="match_score">
import { useRoute } from "vue-router";
import {score_child_5,score_child_8} from "./index.js"

import {markRaw} from "vue"
const route = useRoute()
const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
const scoreComponent = {
    ScoreChild_5: markRaw(score_child_5),
    ScoreChild_8: markRaw(score_child_8),
}
</script>

<style lang="scss" scoped>
.match_score {
    width: 100%;
    // height: 32px;
    overflow: hidden;
}
</style>
