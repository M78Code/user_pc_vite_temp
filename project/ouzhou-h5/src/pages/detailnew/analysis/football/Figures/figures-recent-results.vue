<script setup name="recent-results">
import {api_analysis} from "src/api/index.js";      // 赛事分析接口文件
import AnalysisCard from "../../AnalysisCard.vue"
import RecordMenu from "../../RecordMenu.vue"
import TeamImg from "src/base-h5/components/details/team-img.vue";   // 详情页蓝色背景上的大型字母图标

import BaseTableInfo from "../../BaseTableInfo.vue"

import {computed, inject, onBeforeMount, onMounted, reactive} from "vue";
/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

const State = reactive({
    flag: 0,        // 0 = 默认，1=同联赛, 2= 同主客
    cps: 5,     // 显示数量： 5场，10场，15场。
    recentRecordData: [],
    noData: true,
    tabRadioButton: void (0),
    recordsList: [
        {success: 0, name: i18n_t('analysis_football_matches.victory')},
        {flat: 0, name: i18n_t('analysis_football_matches.flat')},
        {lose: 0, name: i18n_t('analysis_football_matches.negative')},
    ]
})

const ChangeFlag = function (flag) {
    State.flag = flag
    _getList()
}
const ChangeCps = function (cps) {
    State.cps = cps
    _getList()
}


const processing_score = function (data) {
    data.forEach((main_item) => {
        main_item.recent_record_data.forEach((item) => {
            if (item.result == 4) {
                main_item.records_list[0].success = ++main_item.records_list[0].success
            } else if (item.result == 3) {
                main_item.records_list[2].lose = ++main_item.records_list[2].lose
            } else {
                main_item.records_list[1].flat = ++main_item.records_list[1].flat
            }
        })
    })
}
const _getList = async function () {
    try {
        const parameter = {
            mid: match_detail.value.mid, // 1940891  赛事ID
            flag: State.flag,
            cps: State.cps
        }
        let {code, data} = await api_analysis.get_team_vs_other_team(parameter)        // 历史战绩接口
        console.log(data,"data")
        // 0000000
        // if (code !== 200 || data.length < 1) {
        if ((data || []).length < 1) throw new Error('暂时没有数据');

        let grouped_collection = [];
        const baseData = lodash.groupBy(data, "teamGroup");

        Object.keys(baseData).map(key => {
            let obj = {
                recent_record_data: baseData[key],
                records_list: [
                    {success: 0, name: i18n_t('analysis_football_matches.victory')},
                    {flat: 0, name: i18n_t('analysis_football_matches.flat')},
                    {lose: 0, name: i18n_t('analysis_football_matches.negative')},
                ]
            };
            grouped_collection.push(obj);
        });

        processing_score(grouped_collection);
        console.log(grouped_collection,"grouped_collection")

        State.recentRecordData = grouped_collection

        State.noData = false

        console.log(State.recentRecordData,"State.recentRecordData")
    } catch (error) {
        State.noData = true
        console.error(error);
    }
}


onBeforeMount(() => {
    _getList()
})
</script>

<template>
    <AnalysisCard :title="i18n_t('analysis_football_matches.recent_record')">
        <template #header-right>
            <RecordMenu @ChangeCheckbox="ChangeFlag" @ChangeRadio="ChangeCps"></RecordMenu>
        </template>
        <template #body>
            <div class="information">
                <ul v-for="(item,index) of State.recentRecordData" :key="index" class="table">
                    <li class="table-team">
                        <div class="table-team--left">
                            <template v-if="index">
                                <TeamImg
                                    :type="0"
                                    :csid="match_detail?.csid"
                                    :url="match_detail?.malu[0]"
                                    :fr="match_detail?.frman[0]"
                                    :size="22"
                                />
                                <TeamImg
                                    v-if="match_detail?.malu.length > 1"
                                    :type="0" :csid="match_detail?.csid"
                                    :url="match_detail?.malu[1]"
                                    :fr="match_detail?.frman[1]"
                                    :size="22"
                                />
                            </template>
                            <template v-else>
                                <TeamImg
                                    :type="0"
                                    :csid="match_detail?.csid"
                                    :url="match_detail?.mhlu[0]"
                                    :fr="match_detail?.frmhn[0]"
                                    :size="22"
                                />
                                <TeamImg
                                    v-if="match_detail?.mhlu.length > 1"
                                    :type="0" :csid="match_detail?.csid"
                                    :url="match_detail?.mhlu[1]"
                                    :fr="match_detail?.frmhn[1]"
                                    :size="22"
                                />
                            </template>
                            <span class="team-name">
                                {{ index == 0 ? match_detail.mhn : match_detail.man }}
                            </span>
                        </div>
                        <div class="table-team--right">
                            <span class="score" v-for="(score,index) in item.records_list" :key="index">
                                {{ index == 0 ? score.success : index == 1 ? score.flat : score.lose }}
                                {{ score.name }}
                            </span>
                        </div>

                    </li>
                    <BaseTableInfo
                        :list_data="item.recent_record_data"
                        :hm_index_name="index ? match_detail.man : match_detail.mhn"
                        :key="index"
                    />
                </ul>
            </div>
        </template>
    </AnalysisCard>
</template>

<style scoped lang="scss">
.table-team{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .08rem;
    height: .4rem;
    &--left{
        display: flex;
        align-items: center;
        .team-name{
            color: #1A1A1A;
            margin-left: .04rem;
            font: {
                size: .12rem;
                weight: 500;
            };
        }
    }
    &--right{
        display: flex;
        align-items: center;
        color: #1A1A1A;
        font: {
            size: .14rem;
            weight: 600;
        };
    }
}
</style>