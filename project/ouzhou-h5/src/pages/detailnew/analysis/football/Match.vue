<script setup name="match">
/*
* 赛果详情 赛况统计 和 事件
* */
import {api_analysis} from "src/api/index.js";
import {inject, onBeforeMount, reactive} from "vue"
import AnalysisCard from "../AnalysisCard.vue"      // 外层卡片壳子
import statistics from "../statistics.vue"      // 统计
import incident from "./incident.vue"       // 事件

/*
* provide 和 inject
* 如果提供的数据是响应式的，那么在注入的地方对数据进行修改会触发响应式更新
* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue
* */
const match_detail = inject('match_detail')

const State = reactive({
    eventData: [],
    isNoData: true
})

const AddZero = num => parseInt(num) < 10 ? '0' + num : num;
const calculateMinutes = seconds => Math.floor(seconds / 60);
const calculateSeconds = seconds => Math.floor(seconds % 60);

const processItem = item => {
    item.matchPeriodId = item.mid?.matchPeriodId || item.away?.matchPeriodId || item.home?.matchPeriodId;
    item.eventCode = item.mid?.eventCode || item.away?.eventCode || item.home?.eventCode;
    item.numPlace = item.away?.numPlace || item.home?.numPlace;

    if (item.away) {
        item.away.secondsFromStart = calculateMinutes(item.away.secondsFromStart) + "\'" + AddZero(calculateSeconds(item.away.secondsFromStart)) + "\'";
    }

    if (item.home) {
        item.home.secondsFromStart = calculateMinutes(item.home.secondsFromStart) + "\'" + AddZero(calculateSeconds(item.home.secondsFromStart)) + "\'";
    }
};

const _getList = async function () {
    try {
        let {code, data} = await api_analysis.get_getEventResult({mid: match_detail.value?.mid})
        if (code != 200 || data.length < 1) throw new Error('当前没有数据');

        data.forEach((item, i, arr) => {
            processItem(item);
            // 中场休息，上边的样式去除line
            if (item.matchPeriodId === 31 && i > 0) {
                arr[i - 1].intermission = true;
            }
        })
        State.eventData = data
        State.isNoData = false
    } catch (error) {
        State.isNoData = true
    }
}

onBeforeMount(() => {
    _getList()
})

</script>

<template>
    <section>
        <!--统计 环型 线型 进度条统计-->
        <AnalysisCard :title="i18n_t('match_result.statistics')" v-if="match_detail?.msc?.length">
            <template #body>
                <statistics></statistics>
            </template>
        </AnalysisCard>
        <!--事件 时间轴-->
        <AnalysisCard :title="i18n_t('match_result.event')" v-if="false">
            <template #body>
                <incident></incident>
            </template>
        </AnalysisCard>
    </section>
</template>

<style scoped lang="scss">

</style>