<template>
    <div :style="page_style">
        <!-- 足球赛事分析 页面-->
        <analysis-football-matches v-if="get_detail_data.csid == '1'"></analysis-football-matches>
        <!-- 篮球赛事分析 页面-->
        <basketball-match-analysis v-if="get_detail_data.csid == '2'"></basketball-match-analysis>
    </div>
</template>
<script setup>
    import { ref, reactive } from "vue"
    import analysisFootballMatches from "./football-match-analysis/analysis-football-matches.vue"
    import basketballMatchAnalysis from "./basketball-match-analysis/basketball-match-analysis.vue"
    import { compute_css_variables } from "src/core/css-var/index.js"
    const page_style = ref('')

    page_style.value = compute_css_variables({ category: 'component', module: 'analysis' })
    const get_detail_data = reactive({
        csid: 1
    })
</script>

<style lang="scss" scoped>
    
</style>