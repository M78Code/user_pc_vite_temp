<script setup name="analysisFootball">
import {computed, defineProps, defineAsyncComponent, ref, markRaw, reactive} from "vue";
import Match from "./Match.vue"     // 赛况
import Figures from "./Figures/index.vue"     // 数据
import Lineup from "./Lineup/index.vue"     // 阵容
import Information from "./Information.vue"     // 资讯
import Odds from "./Odds/index.vue"     // 赔率
import Intelligence from "./Intelligence.vue"     // 情报

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
        <Odds v-if="ActiveTabCom == 'Odds'" :match_detail="match_detail"/>
        <!-- 情报 -->
        <Intelligence v-if="ActiveTabCom == 'Intelligence'" :match_detail="match_detail"/>
    </article>
</template>