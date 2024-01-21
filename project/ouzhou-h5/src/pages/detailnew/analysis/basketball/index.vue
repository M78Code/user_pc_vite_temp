<script setup >
import {computed, defineProps, defineAsyncComponent, ref, markRaw, reactive} from "vue";
import Match from "../football/Match/index.vue"     // 赛况
import Figures from "../football/Figures/index.vue"     // 数据
import Lineup from "../football/Lineup/index.vue"     // 阵容
import Information from "../football/Information.vue"     // 资讯
import Odds from "../football/Odds/index.vue"     // 赔率
import Intelligence from "../football/Intelligence.vue"     // 情报

const props = defineProps(['active_tab', 'match_odds_info', 'match_detail']);

const ActiveTabCom = computed(() => {
    return props.active_tab?.subassembly
})
</script>

<template>
    <article class="analysisFootball">
        <!-- 资讯 -->
        <Information v-if="ActiveTabCom == 'Information'" :match_detail="match_detail"/>
        <!-- 赛况 -->
        <Match v-if="ActiveTabCom == 'Match'" :match_detail="match_detail" :match_odds_info="match_odds_info"/>
        <!-- 数据 -->
        <Figures v-if="ActiveTabCom == 'Figures'" :match_detail="match_detail"/>
        <!-- 阵容 -->
        <Lineup v-if="ActiveTabCom == 'Lineup'" :match_detail="match_detail"/>
        <!-- 赔率 -->
        <!-- <Odds v-if="ActiveTabCom == 'Odds'" :match_detail="match_detail"/> -->
        <!-- 情报 -->
        <!-- <Intelligence v-if="ActiveTahbCom == 'Intelligence'" :match_detail="match_detail"/> -->
    </article>
</template>