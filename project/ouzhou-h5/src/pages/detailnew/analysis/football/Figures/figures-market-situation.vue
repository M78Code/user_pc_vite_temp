<script setup name="market-situation">
import AnalysisCard from "../../AnalysisCard.vue";
import TeamImg from "src/base-h5/components/details/team-img.vue";
import {computed, inject} from "vue";
import UserCtr from "src/core/user-config/user-ctr";   // 详情页蓝色背景上的大型字母图标

const props = defineProps(['matchHistory_battle_dto_map'])

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

const lang = computed(() => {
    return UserCtr.lang
})

// 赛事标题说明
// handicapResultList 最近X 场输赢, 2平3输4赢
// overunderResultList  最近X场大小, 2平3输4赢

const getResultList = (main, name, mapping) => {
    let arr_list = [];

    if (main && main[name]) {
        main[name].forEach((item) => {
            const style = mapping[item];
            if (style) {
                arr_list.push(`<span style="${style.style}">${style.text}</span>`);
            }
        });
    }

    return arr_list;
};

const title_calculation = (main, name) => {
    const handicapMapping = {
        2: { style: 'color:#71C0F7;margin:0 .01rem', text: i18n_t('analysis_football_matches.level') },
        3: { style: 'color:#8AD181;margin:0 .01rem', text: i18n_t('analysis_football_matches.lose') },
        4: { style: 'color:#FF7979;;margin:0 .01rem', text: i18n_t('analysis_football_matches.win') },
    };

    const overunderMapping = {
        2: { style: 'color:#71C0F7;margin:0 .01rem', text: i18n_t('analysis_football_matches.level') },
        3: { style: 'color:#8AD181;margin:0 .01rem', text: i18n_t('analysis_football_matches.small') },
        4: { style: 'color:#FF7979;;margin:0 .01rem', text: i18n_t('analysis_football_matches.big') },
    };

    const mapping = name === 'handicapResultList' ? handicapMapping : overunderMapping;

    return getResultList(main, name, mapping);
};

</script>

<template>
    <AnalysisCard :title="i18n_t('analysis_football_matches.Turning_trend')">
        <template #body>
            <div class="no-data" v-if="lodash.isEmpty(matchHistory_battle_dto_map)">
                {{ i18n_t('analysis_football_matches.no_data') }}
                <!--{{ i18n_t('common.no_data') }}-->
            </div>
            <div class="standings_technical football_standings recent_record" v-else>
                <div class="standings-technical-home" v-for="(main, index) in matchHistory_battle_dto_map"
                     :key="index+'qi'">
                    <!-- 主队客队的 图标 及 名称 -->
                    <div class="technical-home team-recent">
                        <template v-if="index == 1">
                            <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
                            <TeamImg
                                :type="0"
                                :csid="match_detail.csid"
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
                            <span class="team-name">{{ match_detail.mhn }}</span>
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
                                :fr="match_detail.frman[1]" :size="22"
                                style="margin-top: 0.11rem; margin-left:-0.08rem;"
                            />
                            <span class="team-name">{{ match_detail.man }}</span>
                        </template>
                    </div>

                    <div>
                        <div class="table-score" v-if="lodash.get(main, 'matchHistoryBattleDetailDTOList')">
                            <div class="header">
                                <div class="item-1st">
                                    <!--<div class="col1"></div>-->
                                    <div class="col1 text-right pad-r5">{{i18n_t('analysis_football_matches.game')}}</div>
                                </div>
                                <div class="item-2nd">
                                    <div class="col1">{{ i18n_t('analysis_football_matches.win_plate') }}</div>
                                    <div class="col1">{{ i18n_t('analysis_football_matches.Move_plate') }}</div>
                                    <div class="col1">{{ i18n_t('analysis_football_matches.Lose_plate') }}</div>
                                    <div class="col4">{{ i18n_t('analysis_football_matches.Win_rate') }}</div>
                                </div>
                                <div class="item-3rd">
                                    <div class="col1">{{ i18n_t('analysis_football_matches.big_ball') }}</div>
                                    <div class="col4">{{ i18n_t('analysis_football_matches.Big_ball_rate') }}</div>
                                    <div class="col1">{{ i18n_t('analysis_football_matches.small_ball') }}</div>
                                    <div class="col4">{{ i18n_t('analysis_football_matches.small_ball_rate') }}</div>
                                </div>
                            </div>
                            <div class="group-item">
                                <div class="team-item" v-for="(item,index) in main.matchHistoryBattleDetailDTOList"
                                     :key="index+'y'">
                                    <div class="item-1st">
                                        <div class="col1">
                                            {{ item.postionFlag == 1 ? i18n_t('analysis_football_matches.total_all') : item.postionFlag == 2 ? i18n_t('analysis_football_matches.main') : item.postionFlag == 3 ? i18n_t('analysis_football_matches.customer') : '' }}
                                        </div>
                                        <div class="col1">
                                            {{ +item.handicapResultWin + +item.handicapResultEqual + +item.handicapResultLose }}
                                        </div>
                                    </div>
                                    <div class="item-2nd">
                                        <div class="col1">{{ item.handicapResultWin }}</div>
                                        <div class="col1">{{ item.handicapResultEqual }}</div>
                                        <div class="col1">{{ item.handicapResultLose }}</div>
                                        <div class="col4">
                                            {{
                                                (item.handicapResultWinRate * 100).toFixed(2) + '%'
                                            }}
                                        </div>
                                    </div>
                                    <div class="item-3rd">
                                        <div class="col1">{{ item.overunderResultWin }}</div>
                                        <div class="col4">
                                            {{
                                                (item.overunderResultWinRate * 100).toFixed(2) + '%'
                                            }}
                                        </div>
                                        <div class="col1">{{ item.overunderResultLose }}</div>
                                        <div class="col4">
                                            {{
                                                (item.overunderResultLoseRate * 100).toFixed(2) + '%'
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="recent-games" :class="{'lang-style': ['ko'].includes(lang)}"
                         v-if="main?.handicapResultList">
                        <span class="item-1st text-center"
                              style="white-space: nowrap;">{{ i18n_t('analysis_football_matches.field', [main.handicapResultList.length]) }}</span>
                        <div class="item-2nd">
                            <span v-html="results" v-for="(results, i) in title_calculation(main, 'handicapResultList')"
                                  :key="i+'title'"></span>
                        </div>
                        <div class="item-3rd">
                            <span v-html="results"
                                  v-for="(results, i) in title_calculation(main, 'overunderResultList')"
                                  :key="i+'title_'"></span>
                        </div>
                    </div>
                </div>
            </div>

        </template>
    </AnalysisCard>

</template>

<style lang="scss" scoped>
.standings_technical {
    .standings-technical-home {
        .technical-home {
            height: 0.4rem;

            display: flex;
            align-items: center;
            padding-left: 0.1rem;

            :deep(.TeamImg) {
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

        .recent-games {
            height: 0.3rem;
            line-height: 0.3rem;
            display: flex;
            align-items: center;


            border-bottom: 1px solid var(--q-color-border-color-56);
            padding: 0 0.1rem;

            > span {
                font-size: 0.12rem;
            }

            > div {
                font-size: 0.12rem;

                &.margin-95 {
                    margin-right: 0.95rem;
                }
            }
        }
    }

    .table-score {
        position: relative;

        .header {
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
            border-bottom: 1px solid var(--q-color-border-color-56);

            div {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.12rem;
            }
        }

        .col1 {
            flex: 1;

            flex: 1;
        }

        .col3 {
            width: 0.3rem;
        }

        .col4 {
            width: 0.4rem;
            white-space: nowrap;
        }

        .col5 {
            flex: 1;
        }
    }

    .no-list {
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        padding-top: 0.05rem !important;


        font-size: 12px;
    }

    .item-1st {
        flex: 0 0 12%;
        height: 100%;
    }

    .item-2nd, .item-3rd {
        display: flex;
        flex: 0 0 44%;
        height: 100%;
    }

    .item-2nd {
        border-left: 1px solid var(--q-color-border-color-56);
        border-right: 1px solid var(--q-color-border-color-56);
        padding: 0 0.05rem;
    }

    .recent-games {
        .item-2nd, .item-3rd {
            > span {
                flex: 1;
                text-align: center;
            }
        }

        .item-3rd {
            padding-left: 0.05rem;
        }
    }

    .recent-games.lang-style {
        height: 0.45rem;

        .item-1st {
            line-height: 0.45rem;
        }

        .item-2nd, .item-3rd {
            justify-content: center;
            align-items: center;

            > span {
                line-height: 0.1rem;
            }
        }
    }

    .pad-r5 {
        padding-right: 0.05rem;
    }
}

.no-data {
    width: 100%;
    height: .56rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #E2E2E2;
}
</style>
