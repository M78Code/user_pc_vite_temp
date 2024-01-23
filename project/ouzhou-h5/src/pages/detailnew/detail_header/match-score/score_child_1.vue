<script setup name="score_child_1">
import {computed} from "vue";

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})

const football_score = ["S2", "S10", "S12", "S11", "S5"]
const football_score_icon_list = [
    {bg_url: "FirstHalf", msc_key: "S2"},       // 上半场
    {bg_url: "PenaltyKick", msc_key: "S10"},        // 点球
    {bg_url: "YellowCard", msc_key: "S12"},       // 黄牌
    {bg_url: "RedCard", msc_key: "S11"},        // 红牌
    {bg_url: "CornerKick", msc_key: "S5"},     // 角球
]
const scoreObject = computed(()=>{
    return props.detail_data.msc_obj
})

</script>

<template>
    <ul class="score_child_1">
        <li v-for="item in football_score_icon_list" :key="item.msc_key" class="score_item">
            <span>{{ scoreObject[item.msc_key] ? scoreObject[item.msc_key]["home"] : "0" }}</span>
            <span :class="[item.bg_url, 'score-icon']"></span>
            <span>{{ scoreObject[item.msc_key] ? scoreObject[item.msc_key]["away"] : "0" }}</span>
        </li>
    </ul>
</template>


<style scoped lang="scss">
.score_child_1 {
    width: 100%;
    height: 32px;
    display: grid;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    grid-template-columns: repeat(5, 1fr);
    font:{
        size: .14rem;
        weight: bold;
    }
    .score_item{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .score-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin: 0 6px;
        vertical-align: middle;
        background-repeat: no-repeat;
        background-position: center;
    }
}

.FirstHalf {
    background-image: url($SCSSPROJECTPATH + "/image/detail/shangbanchang.png");
}

.PenaltyKick {
    background-image: url($SCSSPROJECTPATH + "/image/detail/dianqiu.png");
}

.YellowCard {
    background-image: url($SCSSPROJECTPATH + "/image/detail/huangpai.png");
}

.RedCard {
    background-image: url($SCSSPROJECTPATH + "/image/detail/hongpai.png");
}

.CornerKick {
    background-image: url($SCSSPROJECTPATH + "/image/detail/jiaoqiu.png");
}


</style>