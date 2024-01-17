<!--
详情页面 足球赛事分析 历史交战
-->

<script setup name="history-engagement">
import {api_analysis} from "src/api/index.js";      // 赛事分析接口文件
import AnalysisCard from "../../AnalysisCard.vue"
import RecordMenu from "../../RecordMenu.vue"
import UserCtr from "src/core/user-config/user-ctr.js";

import {inject, reactive, onBeforeMount, computed} from "vue";
/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

const State = reactive({
    CheckedMenuArr1: [],
    flag: 0,        // 0 = 默认，1=同联赛, 2= 同主客
    cps: 5,        // 显示数量： 5场，10场，15场。

    recordsList: [],
    noData: true,
    historicalEngagementData: void (0),
    defaultIndex: 0,

    futureSchedule: void (0)
})

const changeDefaultNumber = function (){
    /*++State.defaultIndex
    if(State.defaultIndex >2) {
        State.defaultIndex = 0
    }*/
    State.defaultIndex = (State.defaultIndex + 1) % 3;
}

const colLabel = computed(()=>{
    const { lang } = UserCtr;
    const isChineseLang = (lang === 'zh' || lang == 'hk') ? '比' : ''
    const isFutureSchedule = State.futureSchedule === 'future_schedule';
    const result = isFutureSchedule
        ? (isChineseLang ? '比' : '') + i18n_t('analysis_football_matches.game')
        : i18n_t('analysis_football_matches.score');

    return result
})

const ChangeFlag = function (flag){
    State.flag = flag
    _getList()
}
const ChangeCps = function (cps){
    State.cps = cps
    _getList()
}
const _getList = async function () {
    // api_analysis.get_team_vs_history
    try {
        const parameter = {
            mid: match_detail.value.mid,
            flag: State.flag,
            cps: State.cps
        }
        State.noData = true
        let {code, data} = await api_analysis.get_team_vs_history(parameter)
        if (code != 200 || !data) throw new error('暂无数据')
        State.recordsList = [
            {success: 0, name: i18n_t('analysis_football_matches.victory')},
            {flat: 0, name: i18n_t('analysis_football_matches.flat')},
            {lose: 0, name: i18n_t('analysis_football_matches.negative')},
        ]
        data.forEach((item) => {
            if (item.result == 4) {
                State.recordsList[0].success = ++State.recordsList[0].success
            } else if (item.result == 3) {
                State.recordsList[2].lose = ++State.recordsList[2].lose
            } else {
                State.recordsList[1].flat = ++State.recordsList[1].flat
            }
        })
        State.historicalEngagementData = data
        State.noData = false
    } catch (error) {
        State.noData = true
        console.log(error)
    }
}

onBeforeMount(()=>{
    _getList()
})
</script>

<template>
    <AnalysisCard :title="i18n_t('analysis_football_matches.historical_war')">
        <template #header-right>
            <RecordMenu @ChangeCheckbox="ChangeFlag" @ChangeRadio="ChangeCps"></RecordMenu>
        </template>
        <template #body>
            <ul class="table">
                <li class="table-header table-item">
                    <p class="col1">{{i18n_t('analysis_football_matches.date')}}</p>
                    <p class="col2">{{i18n_t('analysis_football_matches.league')}}</p>
                    <p class="col3">{{colLabel}}</p>
                    <p class="col4" v-if="State.futureSchedule == 'future_schedule'">
                        {{ i18n_t('analysis_football_matches.Interval_days') }}
                    </p>
                    <p class="col4" @click="changeDefaultNumber" v-else>
                        <span v-if="State.defaultIndex == 0">{{i18n_t('analysis_football_matches.results')}}</span>
                        <span v-else-if="State.defaultIndex == 1">{{i18n_t('analysis_football_matches.turn_around')}}</span>
                        <span v-else-if="State.defaultIndex == 2">{{i18n_t('analysis_football_matches.size')}}</span>
                        <i class="icon sort-flag"></i>
                    </p>
                </li>
                <li class="table-body table-item" v-for="(item,index) of State.historicalEngagementData" :key="index">
                    <p class="table-body-item ellipsis">{{(new Date(+item.beginTime)).Format(i18n_t('time5'))}}</p>
                    <p class="table-body-item tournamentName">{{ item.tournamentName }}</p>
                    <p class="table-body-item col3 ellipsis">
                        <span class="home ellipsis" :class="[item.homeTeamName == hm_index_name ? 'add_bold' :'']">{{ item.homeTeamName }}</span>
                        <span class="future_schedule" v-if="future_schedule == 'future_schedule'">VS</span>
                        <span class="number" v-else>{{item.homeTeamScore}}-{{item.awayTeamScore}}</span>
                        <span class="away ellipsis" :class="[item.awayTeamName == hm_index_name ? 'add_bold' :'']">{{ item.awayTeamName }}</span>
                    </p>
                    <p class="table-body-item col4" v-if="future_schedule == 'future_schedule'">
                        {{ item.intervalDay }}
                    </p>
                    <p></p>
                </li>
            </ul>
        </template>
    </AnalysisCard>
</template>

<style scoped lang="scss">
.table{
    width: 100;
    &-item{
        display: grid;
        grid-template-columns: 1fr 1fr 2fr 1fr;
        align-items: center;
    }
    &-header{
        width: 100%;
        height: .4rem;
        border-bottom: .01rem solid #E2E2E2;
        background: #FFF8F3;
        color: #8A8986;
        p{
            text-align: center;
        }
    }
    &-body{
        width: 100%;
        height: .48rem;
        border-bottom: .01rem solid #E2E2E2;
        color: #484848;
        &-item{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .col3{
            justify-content: space-around;
        }
    }
}
</style>