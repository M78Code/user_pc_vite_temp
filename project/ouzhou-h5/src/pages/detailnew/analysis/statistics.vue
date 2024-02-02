<script setup name="statistics">
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output";
import { reactive, inject, computed } from "vue"

import AnalysisCard from "./AnalysisCard.vue";

const match_detail = inject('match_detail')

/*
    剩余暂停：whistle_img
    超时：time_out_img
    黄牌：yellow_img
    红牌：red_img
    进球：corner_img
*/
const whistle_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/Whistle.svg`
const time_out_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/time_out.svg`
const yellow_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/yellow.svg`
const red_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/red.svg`
const corner_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/corner.svg`

const State = reactive({
    basketball: {
        ring_statistics: [
            { score_type: 'S1088', title: i18n_t('match_result.three_point_shooting') },     // S1088 三分命中率
            { score_type: 'S1235', title: i18n_t('match_result.Field_goal_percentage') },    // S1235 投篮命中率
            { score_type: 'S111', title: i18n_t('match_result.Free_throw_percentage') }      // S111 罚球命中率
        ],
        card_corner_list: [
            { score_type: 'S106', title: i18n_t('match_result.Fouls') },                      // 犯规数
            { score_type: 'S109', title: i18n_t('match_result.Remaining_pause') }             // 剩余暂停
        ],
        progress_graph: [
            { score_type: 'S108', title: i18n_t('match_result.Three_pointer') },               // 三分球得分
            { score_type: 'S107', title: i18n_t('match_result.Two_pointer') },                 // 两分球得分
            { score_type: 'S110', title: i18n_t('match_result.Free_throw') }                   // 罚球得分
        ]
    },
    footeball: {
        ring_statistics: [
            { score_type: 'S104', title: i18n_t('ouzhou.detail.assault') },              // 进攻
            { score_type: 'S8', title: i18n_t('match_result.dangerous_offense') },       // S8 危险进攻
            { score_type: 'S105', title: i18n_t('ouzhou.detail.possession_ball') }       // S105 球权/控球率
        ],
        card_corner_list: [
            { score_type: 'S12', title: i18n_t('match_result.yellow_card'), icon: yellow_img },            // S12 黄牌比分
            { score_type: 'S11', title: i18n_t('match_result.red_card'), icon: red_img },               // S11	红牌比分
            { score_type: 'S5', title: i18n_t('match_result.corner_kick'), icon: corner_img }              // S5	角球比分
        ],
        progress_graph: [
            // { score_type: 'S1101', title: i18n_t('match_result.shot') },                 // S1101 射门        
            { score_type: 'S18', title: i18n_t('ouzhou.detail.shots_on_goal') },         // S18   射正        
            { score_type: 'S17', title: i18n_t('ouzhou.detail.shot_wide_goal') }         // S17   射偏        
        ]
    }
})

const only_home = ["S8", "S105", "S1088", "S111"]
const only_away = ["S104", "S1101", "S18", "S17", "S19", "S107", "S110", "S108"]

const score_info = computed(() => {
    const { msc_obj } = match_detail.value

    let result = {}
    if (lodash.isEmpty(msc_obj)) return result

    Object.keys(msc_obj).map(key => {
        const { home, away } = msc_obj[key];
        setResult(key, home, away);
    })

    return result

    function setResult(key, home, away) {
        const total = Number(home) + Number(away);
        result[key] = {
            home,
            away,
            home_percentage: (Number(home) / total || 0).toFixed(2) * 100,
            away_percentage: (Number(away) / total || 0).toFixed(2) * 100,
        };
    }
})

const basic_data = computed(() => {
    const { csid } = match_detail.value

    if (csid == 1) return State.footeball
    if (csid == 2) return State.basketball

})

const percentage = function(score_type){
    if(only_home.includes(score_type)) return score_info.value[score_type].home_percentage
    if(only_away.includes(score_type)) return score_info.value[score_type].away_percentage
}


</script>

<template>
    <AnalysisCard :title="i18n_t('match_result.statistics')">
        <template #body>
            <div class="statistics">
                <ul class="statistics-header">
                    <li class="statistics-header--item ellipsis">{{ match_detail.mhn }}</li>
                    <li class="statistics-header--item ellipsis">{{ match_detail.man }}</li>
                </ul>
                <div class="statistics-circle">
                    <div class="statistics-col" v-for="item in basic_data.ring_statistics" :key="item">
                        <div class="circle-part" v-if="score_info[item.score_type]">
                            <div class="circle-title">{{ item.title }}</div>
                            <div class="circle-body">
                                <span class="number">{{ score_info[item.score_type]['home'] }} </span>
                                <q-knob 
                                    readonly 
                                    :value="percentage(item.score_type)" 
                                    size="50px"
                                    :thickness="0.4" 
                                    color="amber-7"
                                    :track-color="percentage(item.score_type) == 0 ? 'grey-5' : 'indigo-12'"
                                    class="q-ma-md" />
                                <span class="number">{{ score_info[item.score_type]['away'] }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <ul class="center">
                    <li v-for="item of basic_data.card_corner_list" :key="item.score_type" class="center-item">
                        <nav class="center-item--title">{{ item.title }}</nav>
                        <div class="center-item--body">
                            <span>{{ score_info[item.score_type].home }}</span>
                            <img :src="item.icon" alt="">
                            <span>{{ score_info[item.score_type].away }}</span>
                        </div>
                    </li>
                </ul>

                <ul class="progress">
                    <template v-for="item of basic_data.progress_graph" :key="item.score_type">
                        <li class="progress-item" v-if="score_info[item.score_type]">
                            <nav class="progress-item--title">
                                <span>{{ score_info[item.score_type]['home'] }}</span>
                                <span>{{ item.title }}</span>
                                <span>{{ score_info[item.score_type]['away'] }}</span>
                            </nav>
                            <div class="progress-item--body">
                                <q-slider 
                                    readonly 
                                    reverse 
                                    v-model="score_info[item.score_type].home_percentage" 
                                    :min="0" 
                                    :max="50" 
                                    track-size="5px" 
                                    color="amber-7" 
                                    thumb-size="0" 
                                    style="margin-right:6px"
                                />
                                <q-slider 
                                    readonly   
                                    v-model="score_info[item.score_type].away_percentage" 
                                    :min="0" 
                                    :max="50" 
                                    track-size="5px" 
                                    color="indigo-12" 
                                    thumb-size="0" 
                                />
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </template>
    </AnalysisCard>
</template>

<style lang="scss" scoped>
.statistics {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;

    .statistics-header {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #1A1A1A;
        font-size: 12px;

        &--item {
            //flex: 1;
            position: relative;
            padding: 0 16px;

            &:nth-child(1):before {
                content: "";
                width: 6px;
                height: 6px;
                border-radius: 50%;
                position: absolute;
                background: #ffb001;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }

            &:nth-last-child(1):after {
                content: "";
                width: 6px;
                height: 6px;
                border-radius: 50%;
                position: absolute;
                background: #006eff;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .statistics-circle {
        width: 100%;
        display: flex;
        padding: 8px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #E2E2E2;

        .statistics-col {
            flex: 1;
            display: flex;
            align-items: center;
            flex-direction: column;
        }
    }

    .center{
        width: 100%;
        display: flex;
        justify-content: center;
        gap: .16rem;
        padding: .16rem 0;
        overflow: hidden;
        &-item{
            width: 1rem;
            height: .4rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            &--title{
                color: #8A8986;
                font-size: .12rem;
                margin-bottom: .08rem;
            }
            &--body{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;
            }
        }
    }

    .progress{
        width: 100%;
        padding: .08rem 0;
        overflow: hidden;
        &-item{
            margin: .08rem 0;
            &--title{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            &--body{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }
}
</style>