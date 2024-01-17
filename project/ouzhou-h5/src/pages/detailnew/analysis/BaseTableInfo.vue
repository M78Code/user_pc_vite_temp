<script setup name="BaseTableInfo">
import {computed, inject, ref} from "vue"
import UserCtr from "src/core/user-config/user-ctr";

const props = defineProps(['list_data', 'hm_index_name', 'future_schedule'])

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

const defaultIndex = ref(0)

const percentage = function (item) {
    return ((item.winTotal / item.matchCount) * 100).toFixed(1) + '%'
}

const colLabel = computed(() => {
    const {lang} = UserCtr;
    const isChineseLang = (lang === 'zh' || lang == 'hk') ? '比' : ''
    const isFutureSchedule = props.future_schedule == 'future_schedule';
    const result = isFutureSchedule
        ? (isChineseLang ? '比' : '') + i18n_t('analysis_football_matches.game')
        : i18n_t('analysis_football_matches.score');

    return result
})

const change_default_number = function () {
    /*++this.defaultIndex
    if(this.defaultIndex >2) {
        this.defaultIndex = 0
    }*/
    defaultIndex.value = ++defaultIndex.value % 3
}
</script>

<template>
    <ul class="table">
        <li class="table-header table-item">
            <div class="col1">{{ i18n_t('analysis_football_matches.date') }}</div>
            <div class="col2">{{ i18n_t('analysis_football_matches.league') }}</div>
            <div class="col3">{{ colLabel }}</div>
            <div class="col4" v-if="future_schedule == 'future_schedule'">
                {{ i18n_t('analysis_football_matches.Interval_days') }}
            </div>
            <div class="col4" @click="change_default_number" v-else>
                <span v-if="defaultIndex == 0">{{ i18n_t('analysis_football_matches.results') }}</span>
                <span v-else-if="defaultIndex == 1">{{ i18n_t('analysis_football_matches.turn_around') }}</span>
                <span v-else-if="defaultIndex == 2">{{ i18n_t('analysis_football_matches.size') }}</span>
                <i class="icon sort-flag"></i>
            </div>
        </li>
        <template v-if="(list_data || []).length">
            <li v-for="(item, i) of list_data"
                :key="i"
                class="table-info table-item"
            >
                <p class="col1 ellipsis">{{ (new Date(+item.beginTime)).Format(i18n_t('time5')) }}</p>
                <p class="col2 ellipsis">{{ item.tournamentName }}</p>
                <p class="col3 ellipsis">
                    <span class="home ellipsis"
                          :class="[item.homeTeamName == hm_index_name ? 'add_bold' :'']">{{ item.homeTeamName }}</span>
                    <span class="future_schedule" v-if="future_schedule == 'future_schedule'">VS</span>
                    <span class="number" v-else>{{ item.homeTeamScore }}-{{ item.awayTeamScore }}</span>
                    <span class="away ellipsis"
                          :class="[item.awayTeamName == hm_index_name ? 'add_bold' :'']">{{ item.awayTeamName }}</span>
                </p>
                <p class="col4" v-if="future_schedule == 'future_schedule'">
                    {{ item.intervalDay }}
                </p>
                <div class="col4 end-btn" v-else>
                    <!--赛果-->
                    <span
                        class="results"
                        v-if="defaultIndex == 0"
                        :class="item.result == 2 ? 'results_flat' : item.result == 3 ? 'results_lose' : 'results_win'"
                    >
                        {{
                            item.result == 2 ? i18n_t('analysis_football_matches.flat') : item.result == 3 ?
                                i18n_t('analysis_football_matches.negative') : i18n_t('analysis_football_matches.victory')
                        }}
                    </span>
                    <!--盘路-->
                    <span
                        class="pan-road"
                        v-else-if="defaultIndex == 1"
                        :class="item.handicapResult == 2 ? 'flat' : item.handicapResult ==3 ? 'no_pan_road' : item.handicapResult ==4 ? 'have_pan_road' : ''"
                    >
                        <template v-if="item.handicapVal">
                            {{item.handicapResult == 2 ? i18n_t('analysis_football_matches.level') : item.handicapResult == 3 ? i18n_t('analysis_football_matches.lose') : item.handicapResult == 4 ? i18n_t('analysis_football_matches.win') : '' }}
                        </template>

                        <template v-else>{{ i18n_t('analysis_football_matches.no_data') }}</template>
                    </span>
                    <!--大小-->
                    <span
                        class="big-small"
                        v-else-if="defaultIndex == 2"
                        :class="item.overunderResult == 2 ? 'flat' : item.overunderResult ==3 ? 'no_big_small' : item.overunderResult ==4 ? 'have_big_small' : ''"
                    >
                        <template v-if="item.overunderVal">
                            {{ item.overunderResult == 2 ? i18n_t('analysis_football_matches.level') : item.overunderResult == 3 ? i18n_t('analysis_football_matches.small') : item.overunderResult == 4 ? i18n_t('analysis_football_matches.big') : '' }}
                        </template>

                        <template v-else>{{ i18n_t('analysis_football_matches.no_data') }}</template>
                    </span>
                </div>
            </li>
        </template>
        <div class="no-data" v-else>{{i18n_t('analysis_football_matches.no_data')}}</div>
    </ul>
</template>

<style scoped lang="scss">
.table {
    width: 100%;

    .table-header {
        width: 100%;
        height: .32rem;
        background: #FFF8F3;
        color: #8A8986;
        grid-template-rows: .32rem;
    }

    .table-item {

        display: grid;
        grid-template-columns: 1fr 1fr 3fr 1fr;

        align-items: center;
        text-align: center;
        border-bottom: 1px solid #E2E2E2;
        overflow: hidden;
        color: #484848;
        font: {
            size: .12rem;
            weight: 400;
        };

        p{
            width: 100%;
        }
    }

    .table-info {
        grid-template-rows: .4rem;
        height: .4rem;

        .col3 {
            display: grid;
            grid-template-columns: 2fr 1fr 2fr;
            .home{
                text-align: right;
            }
            .away{
                text-align: left;
            }
        }
    }

    .more-btn {
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #FFFFFF;
        color: #FF7000;
    }

    .no-data{
        width: 100%;
        height: .56rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #E2E2E2;
    }
}

.ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
</style>