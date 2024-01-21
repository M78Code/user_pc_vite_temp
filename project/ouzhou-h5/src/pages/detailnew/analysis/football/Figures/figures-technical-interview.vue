<script setup name="technical-interview">
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
    <div class="standings_technical football_standings recent_record">
        <template v-if="false">
            <div class="title">
                {{ $root.$t('analysis_football_matches.Turning_trend') }}
            </div>
            <div class="standings-technical-home" v-for="(item, index) in 2" :key="index+'title'">
                <div class="technical-home">
                    <team-img :type="0" :csid="get_detail_data.csid" :url="get_detail_data.mhlu[0]"
                              :fr="get_detail_data.frmhn[0]" :size="22"></team-img>
                    <team-img v-if="get_detail_data.mhlu.length > 1" :type="0" :csid="get_detail_data.csid"
                              :url="get_detail_data.mhlu[1]" :fr="get_detail_data.frmhn[1]" :size="22"
                              style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                    <span class="team-name">{{ get_detail_data.mhn }}</span>
                </div>
                <div>
                    <div class="table-score">
                        <div class="standings_technical_header">
                            <div class="col1 flex_start"></div>
                            <div class="col2">0-15’</div>
                            <div class="col1">15-30’</div>
                            <div class="col1">30-45’</div>
                            <div class="col1">45-60’</div>
                            <div class="col1">60-75’</div>
                            <div class="col1">75-90’</div>
                        </div>
                        <div class="group-item">
                            <div class="team-item" v-for="(item,index) in 3" :key="index+'score'">
                                <div class="col1 flex_start">{{ $root.$t('analysis_football_matches.total_all') }}</div>
                                <div class="col2 ellipsis">24</div>
                                <div class="col1">29</div>
                                <div class="col1">21</div>
                                <div class="col1">3</div>
                                <div class="col1">5</div>
                                <div class="col1">61/21</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="title">
            {{ $root.$t('analysis_football_matches.Coach_data') }}
        </div>
        <div class="standings-technical-home" v-for="(item, index) in homeAwayGoal_and_coach_map" :key="index+'h'">
            <!-- 主队客队的 图标 及 名称 -->
            <div class="technical-home team-recent">
                <template v-if="index == 1">
                    <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
                    <team-img :type="0" :csid="get_detail_data.csid" :url="get_detail_data.mhlu[0]"
                              :fr="get_detail_data.frmhn[0]" :size="22"></team-img>
                    <team-img v-if="get_detail_data.mhlu.length > 1" :type="0" :csid="get_detail_data.csid"
                              :url="get_detail_data.mhlu[1]" :fr="get_detail_data.frmhn[1]" :size="22"
                              style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                </template>
                <template v-if="index == 2">
                    <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
                    <team-img :type="1" :csid="get_detail_data.csid" :url="get_detail_data.malu[0]"
                              :fr="get_detail_data.frman[0]" :size="22"></team-img>
                    <team-img v-if="get_detail_data.malu.length > 1" :type="1" :csid="get_detail_data.csid"
                              :url="get_detail_data.malu[1]" :fr="get_detail_data.frman[1]" :size="22"
                              style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
                </template>
                <span class="team-name">{{ item && item[0] && item[0].coachName }}</span>
            </div>
            <div>
                <div class="table-score">
                    <div class="standings_technical_header">
                        <div class="col1 flex_start">{{ $root.$t('analysis_football_matches.age') }}</div>
                        <div class="col1">{{ $root.$t('analysis_football_matches.Tactical_division') }}</div>
                        <div class="col1">{{ $root.$t('analysis_football_matches.Points_per_game') }}</div>
                        <div class="col-go-war">{{ $root.$t('analysis_football_matches.Go_to_war') }}</div>
                    </div>
                    <div class="group-item">
                        <div class="team-item" v-for="(content,index) in item" :key="index+'team'">
                            <div class="col1 flex_start">{{ Calculate_age(content.coachBirthdate) || '-' }}</div>
                            <div class="col1">{{ content.coachStyle || '-' }}</div>
                            <div class="col1">{{ content.score || '-' }}</div>
                            <div class="col-go-war" v-if="content.coachGameCount">{{ content.coachGameCount }}
                                (胜{{ content.winCount }}平{{ content.drawCount }}负{{ content.loseCount }})
                            </div>
                            <div class="col-go-war" v-else> {{ $root.$t('common.no_data') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="Object.keys(homeAwayGoal_and_coach_map).length <= 0" class="no-list">{{
                $root.$t('common.no_data')
            }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.title {
    height: 0.4rem;
    line-height: 0.45rem;
    padding-left: 0.24rem;
    font-size: 0.14rem;
    letter-spacing: 0;
    font-weight: bold;
    position: relative;

    &:before {
        content: '';
        width: 0.03rem;
        height: 0.12rem;
        position: absolute;
        left: 0.16rem;
        top: 0.15rem;
        border-radius: 1.5px;
    }
}

.standings_technical {
    .standings-technical-home {
        .technical-home {
            height: 0.4rem;

            display: flex;
            align-items: center;
            padding-left: 0.1rem;

            ::v-deep .team-img {
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
