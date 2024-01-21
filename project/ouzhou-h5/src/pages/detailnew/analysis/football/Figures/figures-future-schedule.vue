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
            <div class="information">
                <ul v-for="(item,index) of futureScheduleData" :key="index" class="table">
                    <li class="table-team">
                        <div class="table-team--left">
                            <template v-if="index">
                                <TeamImg
                                    :type="0"
                                    :csid="match_detail.value?.csid"
                                    :url="match_detail.value?.malu[0]"
                                    :fr="match_detail.value?.frman[0]"
                                    :size="22"
                                />
                                <TeamImg
                                    v-if="match_detail.value?.malu.length > 1"
                                    :type="0" :csid="match_detail.value?.csid"
                                    :url="match_detail.value?.malu[1]"
                                    :fr="match_detail.value?.frman[1]"
                                    :size="22"
                                />
                            </template>
                            <template v-else>
                                <TeamImg
                                    :type="0"
                                    :csid="match_detail.value?.csid"
                                    :url="match_detail.value?.mhlu[0]"
                                    :fr="match_detail.value?.frmhn[0]"
                                    :size="22"
                                />
                                <TeamImg
                                    v-if="match_detail.value?.mhlu.length > 1"
                                    :type="0" :csid="match_detail.value?.csid"
                                    :url="match_detail.value?.mhlu[1]"
                                    :fr="match_detail.value?.frmhn[1]"
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
                        :list_data="item"
                        :hm_index_name="index ? match_detail.man : match_detail.mhn"
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
    &--left{
        display: flex;
        align-items: center;
        .team-name{
            color: #1A1A1A;
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
            weight: 500;
        };
    }
}
</style>