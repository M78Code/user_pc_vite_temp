<script setup name="Lineup">
import NoData from "../NoData.vue"
import AnalysisCard from "../AnalysisCard.vue"
import LineupTable from "./Lineup/line-up-table.vue"
import PlayerDistribution from "./Lineup/player-distribution.vue"

import {api_analysis} from "src/api/index.js";      // 赛事分析接口文件
import {inject, onBeforeMount, reactive} from "vue";
/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')


// import {useMittOn, useMittEmit, MITT_TYPES} from "src/output/index.js"

const State = reactive({
    tabList: [],
    selectedTabId: 1,
    noData: true,

    lineUpData: void (0),       // 列表数据
    defaultUrl: "image/bw3/png/my.png",       //默认图片地址
    number: '',         // 最后一位数
    numberColumns: '',         // 代表多少列 并且里边的数字
    footballFilteredData: [
        {data: []},
        {data: []},
    ],
    // 篮球的 背景图的 数据
    basketballData: []
})

const ChangeSelectedTabId = function (event) {
    const {id} = event.target.dataset;
    if(!id && State.selectedTabId === id) return
    _getList()
    State.selectedTabId = id
}

const get_file_path = function () {
}
const league_icon_error = function ($event) {
    $event.target.src = State.defaultUrl;
    $event.target.onerror = null
}

const filter_numbers = function (data) {
    if (lodash.isEmpty(data)) return

    State.numberColumns = data.split('-').join('').slice(0, -1);

    const columnsLength = State.numberColumns.length;
    State.footballFilteredData = new Array(columnsLength).fill(new Object());

    let startIndex = 1;
    for (let i = 0; i < columnsLength; i++) {
        let currentNumber = +State.numberColumns[i];
        State.footballFilteredData[i].data = State.lineUpData.up.slice(startIndex, startIndex + currentNumber);
        startIndex += currentNumber;
    }
}
const _getList = async function () {

    if(lodash.isEmpty(State.lineUpData)) State.noData = true
    try {
        const parameter = {
            matchInfoId: match_detail.value.mid, // 2079863足球测试id  2185843篮球测试id
            homeAway: State.selectedTabId // 主客队标识(1主队，2客队)
        }
        const {csid} = match_detail.value
        let {code, data} = await api_analysis.get_match_lineup_list(parameter)
        if (code != 200 || Object.keys(data).length < 1) throw new Error('暂无数据')
        console.log(data, "State.lineUpData==data")

        State.lineUpData = data
        // 如果是足球赛事
        if (csid == 1) {
            const formationToFilter = State.selectedTabId === 1
                ? State.lineUpData?.homeFormation
                : State.lineUpData?.awayFormation;

            filter_numbers(State.lineUpData.formationToFilter)
        } else if (csid == 2) {//  如果是 篮球赛事
            State.basketballData = data.up
        }
        console.log(State.lineUpData, "State.lineUpData")
        State.noData = false
    } catch (error) {
        State.noData = true
    }
}

onBeforeMount(() => {
    State.tabList = [
        {id: 1, name: match_detail.value.mhn},
        {id: 2, name: match_detail.value.man}
    ]

    _getList()
    // useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, true);
})
</script>
<template>
    <section>
        <nav class="head-wrapper">
            <ul class="head-tab" @click="ChangeSelectedTabId($event)">
                <li class="head-tab-item" :class="{'active':State.selectedTabId == item.id}"
                    v-for="item of State.tabList" :key="item.id" :data-id="item.id">
                    {{ item.name }}
                </li>
            </ul>
        </nav>
        <!-- 足球场地 -->
        <PlayerDistribution
            :up_data="State.lineUpData?.up"
            :lastNumber="State.number"
            :football_filtered_data="State.footballFilteredData"
            :number_columns="State.numberColumns"
        />
        <NoData v-if="State.noData"></NoData>
        <template v-else>
            <!-- 首发阵容 -->
            <AnalysisCard :title="i18n_t('analysis_football_matches.starting_lineup')">
                <template #body>
                    <LineupTable :lineupData="State.lineUpData?.up"></LineupTable>
                </template>
            </AnalysisCard>
            <!-- 替补阵容-->
            <AnalysisCard :title="i18n_t('analysis_football_matches.bench_lineup')">
                <template #body>
                    <LineupTable :lineupData="State.lineUpData?.down"></LineupTable>
                </template>
            </AnalysisCard>
        </template>
    </section>
</template>

<style scoped lang="scss">
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
</style>