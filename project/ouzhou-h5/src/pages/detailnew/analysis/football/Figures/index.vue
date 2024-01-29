<script setup name="Figures">
import {inject, onBeforeMount, reactive} from "vue";
import figuresStandings from "./figures-standings.vue"
import figuresHistoryEngagement from "./figures-history-engagement.vue"
import figuresRecentResults from "./figures-recent-results.vue"     // 近期战绩
import figuresFutureSchedule from "./figures-future-schedule.vue"   // 未来赛程
import figuresInjurySituation from "./figures-injury-situation.vue"
import figuresMarketSituation from "./figures-market-situation.vue"     // 盘面
import figuresTechnicalInterview from "./figures-technical-interview.vue"

import {api_analysis} from "src/api/index.js";      // 赛事分析接口文件

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

const State = reactive({
    tabList: [
        {name: i18n_t('analysis_football_matches.Fundamentals'), id: 1},        // 基本面
        {name: i18n_t('analysis_football_matches.Disk'), id: 2},        // 盘面
        {name: i18n_t('analysis_football_matches.Technical_side'), id: 3}       // 技术面
    ],
    selectedTabId: 1,

    futureScheduleData: {}, // 基本面的数据
    injurySituationData: {init: null}, // 伤停情况
    matchHistoryBattleDtoMap: {init: null}, // 盘面的数据
    homeAwayGoalAndCoachMap: {init: null}, // 盘面的数据
    loading: false,
})
const ChangeSelectedTabId = function (event) {
    const {id} = event.target.dataset;
    if (id) State.selectedTabId = id
    _getDataList()
}

const _getDataList = async function () {
    try {
        State.loading = true
        let parameter = {
            standardMatchId: match_detail.value.mid, //2274159, //2274159 ,//2079863足球测试id
            parentMenuId: 2,
            sonMenuId: State.selectedTabId
        }
        let {code, data} = await api_analysis.get_match_analysise_data(parameter)
        State.loading = false
        // if (code != 200 || Object.keys(data).length < 1) throw new Error('暂时没有更多数据')
        if (Object.keys(data).length < 1) throw new Error('暂时没有更多数据')

        State.futureScheduleData = lodash.get(data, 'basicInfoMap.sThirdMatchFutureStatisticsDTOMap', {})
        State.injurySituationData = lodash.get(data, 'basicInfoMap.sThirdMatchSidelinedDTOMap', {})
        State.matchHistoryBattleDtoMap = lodash.get(data, 'matchHistoryBattleDTOMap', {})
        State.homeAwayGoalAndCoachMap = lodash.get(data, 'homeAwayGoalAndCoachMap.sThirdMatchCoachDTOMap', {})
        console.log(State.matchHistoryBattleDtoMap,"State.matchHistoryBattleDtoMap")
    } catch (error) {
        console.error(error);
        State.loading = false
    }
}

onBeforeMount(() => {
    _getDataList()
})
</script>

<template>
    <section class="Figures">
        <nav class="head-wrapper">
            <ul class="head-tab" @click="ChangeSelectedTabId($event)">
                <li class="head-tab-item" :class="{'active':State.selectedTabId == item.id}"
                    v-for="item of State.tabList" :key="item.id" :data-id="item.id">
                    {{ item.name }}
                </li>
            </ul>
        </nav>
        <!-- 基本面 -->
        <template v-if="State.selectedTabId == 1">
            <!-- 杯赛积分 或者 联赛积分 -->
            <figuresStandings />
            <!-- 历史交战 -->
            <figuresHistoryEngagement />
            <!-- 近期战绩 -->
            <figuresRecentResults />
            <!-- 未来赛程  只有 足球才有-->
            <figuresFutureSchedule :futureScheduleData="State.futureScheduleData" v-if="match_detail.csid == 1" />
            <!-- 伤停情况 只有 足球才有 -->
            <figuresInjurySituation :injurySituationData="State.injurySituationData" v-if="match_detail.csid == 1" />
        </template>
        <!-- 盘面 -->
        <figuresMarketSituation
            v-if="State.selectedTabId == 2"
            :matchHistory_battle_dto_map="State.matchHistoryBattleDtoMap"
        />
        <!-- 技术面 -->
        <figuresTechnicalInterview
            v-if="State.selectedTabId == 3"
            :homeAwayGoal_and_coach_map="State.homeAwayGoalAndCoachMap"
        />
    </section>
</template>


<style scoped lang="scss">
.Figures {
    width: 100%;

    .head-wrapper {
        width: 100%;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #E2E2E2;

        .head-tab {
            display: flex;
            justify-content: center;
            border-radius: .15rem;
            overflow: hidden;
            border: 1px solid #FF7000;
            background: #ffffff;

            &-item {
                height: .3rem;
                text-align: center;
                width: 1rem;
                line-height: .3rem;
                color: #484848;
                font: {
                    size: .14rem;
                    weight: 400;
                };
            }

            .active {
                color: #FFFFFF;
                background: #FF7000;
            }
        }
    }
}
</style>