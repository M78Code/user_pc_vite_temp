<script setup name="analysisFootball">
import {computed, defineProps, defineAsyncComponent, ref, markRaw, reactive} from "vue";
import Match from "./Match.vue"     // 赛况
import Figures from "./Figures.vue"     // 数据
import Lineup from "./Lineup.vue"     // 阵容
import Information from "./Information.vue"     // 资讯
import Odds from "./Odds.vue"     // 赔率
import Intelligence from "./Intelligence.vue"     // 情报

const props = defineProps(['active_tab', 'match_odds_info', 'match_detail']);

const ActiveTabCom = computed(() => {
    return props.active_tab?.subassembly
})
setTimeout(function (){
    console.log(props.match_detail,"match_detail==football")
},1200)
</script>

<template>
    <article class="analysisFootball">
        <Information v-if="ActiveTabCom == 'Information'" :match_detail="match_detail"/>
        <Match v-if="ActiveTabCom == 'Match'" :match_detail="match_detail" :match_odds_info="match_odds_info"/>
        <Figures v-if="ActiveTabCom == 'Figures'" :match_detail="match_detail"/>
        <Lineup v-if="ActiveTabCom == 'Lineup'" :match_detail="match_detail"/>
        <Odds v-if="ActiveTabCom == 'Odds'" :match_detail="match_detail"/>
        <Intelligence v-if="ActiveTabCom == 'Intelligence'" :match_detail="match_detail"/>
    </article>
</template>