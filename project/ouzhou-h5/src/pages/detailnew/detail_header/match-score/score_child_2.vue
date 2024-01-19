<script setup name="score_child_2">
import {computed} from "vue";

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
// mle 赛事阶段 为17 的时候
const basketball_score1 = [
    {msc_key: "S2"},
    {msc_key: "S3"},
]
// mle 赛事阶段 不为17 的时候
const basketball_score2 = [
    {msc_key: "S19"},
    {msc_key: "S20"},
    {msc_key: "S21"},
    {msc_key: "S22"},
]

const ScoreObject = computed(()=>{
    console.log(props.detail_data.msc_obj,"props.detail_data.msc_obj")
    return props.detail_data.msc_obj
})
const BasketballScore = computed(()=>{
    const { mle, msc_obj } = props.detail_data
    let scoreKeyArray = mle == 17 ? basketball_score1 : basketball_score2
    let scoreArray = []
    lodash.forEach(scoreKeyArray,item=>{
        let tmp = msc_obj[item.msc_key]
        if(!tmp) return
        let { home, away } = tmp
        if (home && away){      
            scoreArray.push({
                key: item.msc_key,
                home,
                away
            })
        }

    })
    console.log(scoreArray,"msc_obj")
    return scoreArray
})
</script>

<template>
    <ul
        class="score_child_2"
        v-if="[1,3].includes(+detail_data.ms)"
        :class="{ 'game-on':[1,2].includes(+detail_data.ms) }"
    >
        <li v-for="item of BasketballScore" :key="item.key" class="score-item">
            <span>&ensp;</span>
            <span>{{item?.home}} - {{item?.away}}</span>
            <span>&ensp;</span>
        </li>
    </ul>
</template>


<style scoped lang="scss">
.current-score-color{
    color: var(--q-gb-t-c-1);
}
.score_child_2{
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    box-sizing: border-box;
    font: {
        size: .14rem;
        weight: bold;
    }
}
.game-on{
    .score-item:nth-last-child(1){
        @extend .current-score-color;
    }
}
</style>