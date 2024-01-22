<script setup >
/*provide('match_detail',match_detail)
provide('match_odds_info',match_odds_info)
provide('active_tab',detail_event_tabs_value)*/

import Information from "./Information/index.vue"       // 资讯
import Match from "./Match/index.vue"       // 赛况

import {computed, inject} from "vue";

/* inject 注入来源 /src/pages/detailnew/index.vue */
const active_tab = inject('active_tab')
const match_detail = inject('match_detail')
const match_odds_info = inject('match_odds_info')

const ActiveTabCom = computed(() => {
    return active_tab.value?.subassembly
})
</script>

<template>
    <article class="analysisFootball">
        <!-- 资讯 -->
        <Information v-if="ActiveTabCom == 'Information'"/>
        <!-- 赛况 -->
        <Match v-if="ActiveTabCom == 'Match'" :match_odds_info="match_odds_info"/>
        <!-- 数据 -->
<!--        <Figures v-if="ActiveTabCom == 'Figures'" />-->
        <!-- 阵容 -->
<!--        <Lineup v-if="ActiveTabCom == 'Lineup'" />-->
        <!-- 赔率 -->
        <!-- <Odds v-if="ActiveTabCom == 'Odds'" :match_detail="match_detail"/> -->
        <!-- 情报 -->
        <!-- <Intelligence v-if="ActiveTahbCom == 'Intelligence'" :match_detail="match_detail"/> -->
    </article>
</template>