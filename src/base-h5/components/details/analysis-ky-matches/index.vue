<template>
    <div :style="page_style">
        <!-- 此组件目前只针对复刻版app -->
        <!-- 足球赛事分析 页面-->
        <analysis-football-matches :detail_data="detail_data" v-if="detail_data.csid == '1'"></analysis-football-matches>
        <!-- 篮球赛事分析 页面-->
        <basketball-match-analysis  :detail_data="detail_data" v-if="detail_data.csid == '2'"></basketball-match-analysis>
    </div>
</template>
<script setup>
    import { ref, reactive } from "vue"
    import analysisFootballMatches from "./football-match-analysis/analysis-football-matches.vue"
    import basketballMatchAnalysis from "./basketball-match-analysis/basketball-match-analysis.vue"
    import { compute_css_variables } from "src/core/css-var/index.js"
    const page_style = ref('')

    page_style.value = compute_css_variables({ category: 'component', module: 'analysis' })
    
    const props = defineProps({
        detail_data: {
            type: Object,
            default: () => {}
        }
    })
</script>

<style lang="scss" scoped>
    
</style>