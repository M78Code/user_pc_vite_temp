<script setup name="future-schedule">
import AnalysisCard from "../../AnalysisCard.vue"
import TeamImg from "src/base-h5/components/details/team-img.vue";   // 详情页蓝色背景上的大型字母图标
import BaseTableInfo from "../../BaseTableInfo.vue"
import {inject} from "vue";

const props = defineProps(['futureScheduleData'])

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

</script>

<template>
    <AnalysisCard :title="i18n_t('analysis_football_matches.Future_schedule')">
        <template #body>
            <div class="no-data" v-if="lodash.isEmpty(futureScheduleData)">{{i18n_t('analysis_football_matches.no_data')}}</div>
            <div class="information" v-else>
                <ul v-for="(item,index) in futureScheduleData" :key="index" class="table">
                    <li class="table-team">
                        <div class="table-team--left">
                            <template v-if="index == 1">
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
                                {{ index == 1 ? match_detail.mhn : match_detail.man }}
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
                        :list_data="item"
                        :hm_index_name="index == 0 ? match_detail.man : match_detail.mhn"
                        future_schedule="future_schedule"
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

.no-data{
    width: 100%;
    height: .56rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #E2E2E2;
}
</style>