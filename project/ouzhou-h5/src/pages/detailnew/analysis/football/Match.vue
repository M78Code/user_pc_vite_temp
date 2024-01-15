<script setup name="match">
/*
* 赛果详情 赛况统计 和 事件
* */
import {ref} from "vue";
import AnalysisCard from "../AnalysisCard.vue"
import statistics from "../statistics.vue"
</script>

<template>
    <section>
        <!--统计 环型 线型 进度条统计-->
        <AnalysisCard :title="i18n_t('match_result.statistics')">
            <template #body>
                <statistics></statistics>
            </template>
        </AnalysisCard>
        <!--事件 时间轴-->
        <AnalysisCard :title="i18n_t('match_result.event')">
            <template #body>
                <statistics></statistics>
            </template>
        </AnalysisCard>
    </section>
</template>

<style scoped lang="scss">

</style>