<!--
// 1:足球   2:篮球   3:棒球   4:冰球   5:网球   6:美式足球   7:斯诺克 8:兵乓球   9:排球   10:羽毛球
-->
<script setup name="team-match-score">
/*
* // 1:足球   2:篮球   3:棒球   4:冰球   5:网球   6:美式足球   7:斯诺克 8:兵乓球   9:排球   10:羽毛球
* 斯诺克, 乒乓球, 羽毛球, 排球, 沙滩排球 取赛事阶段范围内的最大为当前比分
* 网球固定 S103
* */
import {computed} from "vue";

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
const NeedShowNowScoreCsids = [5,7,8,9,10,13]

const set_serving_side = (item, side) => {
    return item.ms == 1 && item.mat == side;
}

const TotalScore = computed(()=>{
    const { msc_obj } = props.detail_data
    let { home, away } = lodash.get(msc_obj,'S1') || {}
    return {home, away}
})

const NowScore = computed(()=>{
    const { msc_obj, csid } = props.detail_data
    if(!NeedShowNowScoreCsids.includes(+csid)) return {}

    if(csid == 5){
        return lodash.get(msc_obj,'S103') || {}
    }

    const msc_obj_keys = Object.keys(msc_obj)
    const LastIndex = msc_obj_keys.findLastIndex(current => (current.replace('S','') >= 120 && current.replace('S','') <= 159))
    return msc_obj[msc_obj_keys[LastIndex]]
})
</script>

<template>
    <div class="team-match-score flex justify-between">
        <ul class="left">
            <li class="left--team-name flex items-center">
                <span v-show="detail_data?.ms == 1 && NeedShowNowScoreCsids.includes(+detail_data?.csid)"
                      class="point" :class="[detail_data?.mat == 'home' ? 'active-circle' : 'circle']"></span>
                <p>{{ detail_data?.mhn }}</p>
            </li>
            <li class="left--team-name flex items-center">
                <span v-show="detail_data?.ms == 1 && NeedShowNowScoreCsids.includes(+detail_data?.csid)"
                      class="point" :class="[detail_data?.mat == 'away' ? 'active-circle' : 'circle']"></span>
                <p>{{ detail_data?.man }}</p>
            </li>
        </ul>
        <ul class="right" v-if="detail_data?.ms == 1">
            <li class="total-score flex justify-between">
                <p>{{ TotalScore?.home }}</p>
                <p>{{ TotalScore?.away }}</p>
            </li>
            <li class="now-score flex justify-between" v-if="!lodash.isEmpty(NowScore)">
                <p>{{ NowScore?.home }}</p>
                <p>{{ NowScore?.away }}</p>
            </li>
        </ul>
        <ul class="right" v-else>
            <li class="total-score flex justify-between">
                <p>{{ TotalScore?.home }}</p>
                <p>{{ TotalScore?.away }}</p>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.team-match-score {
    width: 100%;
    height: 72px;
    padding: 8px 16px;
    box-sizing: border-box;

    .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        height: 100%;
        &--team-name{
            font-size: .15rem;
            .point{
                width: 5px;
                height: 5px;
                border-radius: 50%;
                margin-right: 7px;
                background-color: transparent;
            }
            .circle{
                background-color: var(--q-gb-bg-c-19);
            }
            .active-circle{
                background-color: var(--q-gb-t-c-1);
            }
        }
    }
    .right{
        display: flex;
        height: 100%;
        font-size: .16rem;
        font-weight: bold;
        .total-score{
            flex-direction: column;
            color: var(--q-gb-t-c-1);
        }
        .now-score{
            flex-direction: column;
            margin-left: .1rem;
            text-align: center;
            color: var(--q-gb-bg-c-4);
        }
    }
}
</style>