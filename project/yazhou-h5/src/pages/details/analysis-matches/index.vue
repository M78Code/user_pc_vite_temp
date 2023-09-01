<template>
    <div>
        <!-- 足球赛事分析 页面-->
            <analysis-football-matches v-if="get_detail_data.csid === '1'"></analysis-football-matches>
            <!-- 篮球赛事分析 页面-->
            <!-- <basketball-match-analysis v-if="get_detail_data.csid === '2'"></basketball-match-analysis> -->
    </div>
</template>
<script setup>
    import { ref } from "vue"
    import analysisFootballMatches from "./football-match-analysis/analysis-football-matches.vue"
    // import basketballMatchesAnalysis from "./basketball-match-analysis/basketball-match-analysis.vue"
        let get_detail_data = ref({
        csid: '1'
    })

    // const  css_var_style =  CurrentTheme.all_css_module_obj['analysis']

</script>

<style lang="scss" scoped>

</style>