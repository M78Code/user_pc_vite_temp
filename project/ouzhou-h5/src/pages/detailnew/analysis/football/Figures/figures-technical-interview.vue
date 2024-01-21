<script setup name="technical-interview">
import AnalysisCard from "../../AnalysisCard.vue";
import TeamImg from "src/base-h5/components/details/team-img.vue";
import {inject} from "vue";   // 详情页蓝色背景上的大型字母图标

const props = defineProps(['homeAwayGoal_and_coach_map'])

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);

    let age = today.getFullYear() - birthDate.getFullYear();

    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};
</script>

<template>
    <AnalysisCard :title="i18n_t('analysis_football_matches.Coach_data')">
        <template #body>
            <div class="no-data" v-if="lodash.isEmpty(homeAwayGoal_and_coach_map)">
                {{ i18n_t('analysis_football_matches.no_data') }}
                <!--{{ i18n_t('common.no_data') }}-->
            </div>
            <div class="standings_technical football_standings recent_record" v-else>
                <div class="standings-technical-home"
                     v-for="(item, index) of homeAwayGoal_and_coach_map"
                     :key="index+'h'"
                >
                    <!-- 主队客队的 图标 及 名称 -->
                    <div class="technical-home team-recent">
                        <template v-if="index == 1">
                            <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
                            <TeamImg
                                :type="0" :csid="match_detail.csid"
                                :url="match_detail.mhlu[0]"
                                :fr="match_detail.frmhn[0]"
                                :size="22"
                            />
                            <TeamImg
                                v-if="match_detail.mhlu.length > 1"
                                :type="0" :csid="match_detail.csid"
                                :url="match_detail.mhlu[1]"
                                :fr="match_detail.frmhn[1]" :size="22"
                                style="margin-top: 0.11rem; margin-left:-0.08rem;"
                            />
                        </template>
                        <template v-if="index == 2">
                            <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
                            <TeamImg
                                :type="1"
                                :csid="match_detail.csid"
                                :url="match_detail.malu[0]"
                                :fr="match_detail.frman[0]"
                                :size="22"
                            />
                            <TeamImg
                                v-if="match_detail.malu.length > 1"
                                :type="1" :csid="match_detail.csid"
                                :url="match_detail.malu[1]"
                                :fr="match_detail.frman[1]"
                                :size="22"
                                style="margin-top: 0.11rem; margin-left:-0.08rem;"
                            />
                        </template>
                        <span class="team-name">{{ item && item[0] && item[0].coachName }}</span>
                    </div>
                    <div>
                        <div class="table-score">
                            <div class="standings_technical_header">
                                <div class="col1 flex_start">{{ i18n_t('analysis_football_matches.age') }}</div>
                                <div class="col1">{{ i18n_t('analysis_football_matches.Tactical_division') }}</div>
                                <div class="col1">{{ i18n_t('analysis_football_matches.Points_per_game') }}</div>
                                <div class="col-go-war">{{ i18n_t('analysis_football_matches.Go_to_war') }}</div>
                            </div>
                            <div class="group-item">
                                <div class="team-item" v-for="(content,index) in item" :key="index+'team'">
                                    <div class="col1 flex_start">
                                        {{Calculate_age(content.coachBirthdate) || '-' }}
                                    </div>
                                    <div class="col1">{{ content.coachStyle || '-' }}</div>
                                    <div class="col1">{{ content.score || '-' }}</div>
                                    <div class="col-go-war" v-if="content.coachGameCount">{{ content.coachGameCount }}
                                        (胜{{ content.winCount }}平{{ content.drawCount }}负{{ content.loseCount }})
                                    </div>
                                    <div class="col-go-war" v-else> {{ i18n_t('common.no_data') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AnalysisCard>


</template>

<style lang="scss" scoped>
.no-data {
    width: 100%;
    height: .56rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #E2E2E2;
}
.standings_technical {
    .standings-technical-home {
        .technical-home {
            height: 0.4rem;

            display: flex;
            align-items: center;
            padding-left: 0.1rem;

            ::v-deep .TeamImg {
                width: 0.2rem;
                height: 0.2rem;
                margin: 0.05rem;

                img {
                    width: 0.2rem;
                    height: 0.2rem;
                    position: relative;
                    border-radius: 50%;
                }
            }

            .team-name {
                font-size: 0.12rem;
                color: var(--q-color-fs-color-3);
                font-weight: bold;
                line-height: 0.12rem;
            }
        }
    }

    .table-score {
        position: relative;

        .standings_technical_header {
            height: 0.32rem;
            display: flex;
            text-align: center;
            line-height: 0.32rem;
            padding: 0 0.1rem;
        }

        .team-item {
            display: flex;
            align-items: center;
            padding: 0 0.1rem;
            font-size: 0.12rem;
            height: 0.48rem;
            text-align: center;

            div {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.12rem;
                color: var(--q-color-com-fs-color-26) !important;
            }
        }

        .col1 {
            flex: 1;
            justify-content: center !important;

            &.flex_start {
                flex: unset;
                width: 0.35rem;
            }
        }

        .col2 {
            flex: 1;
        }

        .col3 {
            width: 0.4rem;
        }

        .col4 {
            width: 0.4rem;
        }

        .col5 {
            flex: 1;
        }

        .col-go-war {
            flex: 1.3;
        }
    }

    .no-list {
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        padding-top: 0.05rem !important;


        font-size: 12px;
    }
}
</style>
