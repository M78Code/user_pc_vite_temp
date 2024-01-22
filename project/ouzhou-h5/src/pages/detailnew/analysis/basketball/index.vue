<script setup >
/*provide('match_detail',match_detail)
provide('match_odds_info',match_odds_info)
provide('active_tab',detail_event_tabs_value)*/

import {computed, defineProps, inject} from "vue";
import Match from "./Match/index.vue"     // 赛况
import Figures from "../football/Figures/index.vue"     // 数据
import Lineup from "../football/Lineup/index.vue"     // 阵容
import Information from "../football/Information.vue"     // 资讯
import Odds from "../football/Odds/index.vue"     // 赔率
import Intelligence from "../football/Intelligence.vue"     // 情报

/*const props = defineProps(['active_tab', 'match_odds_info', 'match_detail']);

const ActiveTabCom = computed(() => {
    return props.active_tab?.subassembly
})*/

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
       <Figures v-if="ActiveTabCom == 'Figures'" />
        <!-- 阵容 -->
       <Lineup v-if="ActiveTabCom == 'Lineup'" />
        <!-- 赔率 -->
        <Odds v-if="ActiveTabCom == 'Odds'" :match_detail="match_detail"/>
        <!-- 情报 -->
        <Intelligence v-if="ActiveTabCom == 'Intelligence'" :match_detail="match_detail"/>
    </article>
</template>