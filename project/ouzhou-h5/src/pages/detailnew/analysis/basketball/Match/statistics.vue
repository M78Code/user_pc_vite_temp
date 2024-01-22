<!-- 统计 -->
<script setup name="statistics">
import AnalysisCard from "../../AnalysisCard.vue"
import {computed, inject, reactive, watch} from "vue";
import {UserCtr} from "src/output";

const match_detail = inject('match_detail')

const State = reactive({
    statistics_table: void (0),
    // S1088 三分命中率, S1235 投篮命中率, S111 罚球命中率
    ring_statistics: [
        {score_type: 'S1088', text: i18n_t('match_result.three_point_shooting'), home: 0, away: 0, proportion: 0},
        {score_type: 'S1235', text: i18n_t('match_result.Field_goal_percentage'), home: 0, away: 0, proportion: 0},
        {score_type: 'S111', text: i18n_t('match_result.Free_throw_percentage'), home: 0, away: 0, proportion: 0}
    ],
    // S106 犯规数, S11 剩余暂停
    card_corner_list: [
        {score_type: 'S106', text: i18n_t('match_result.Fouls'), home: 0, away: 0},
        {score_type: 'S109', text: i18n_t('match_result.Remaining_pause'), home: 0, away: 0},
    ],
    progress_graph: [
        //    S108 三分球得分
        {score_type: 'S108', text: i18n_t('match_result.Three_pointer'), home: 0, away: 0, proportion: 0},
        //    S107 两分球得分
        {score_type: 'S107', text: i18n_t('match_result.Two_pointer'), home: 0, away: 0, proportion: 0},
        //    S110   罚球得分
        {score_type: 'S110', text: i18n_t('match_result.Free_throw'), home: 0, away: 0, proportion: 0}
    ]
})

/*
 * 下面方法用来计算进度条占比
 * */
const int_msc_obj_key_away = ["S8", "S105", "S1088", "S111"]
const float_msc_obj_key_home = ["S104", "S1101", "S18", "S17", "S19", "S107", "S110", "S108"]
const scoreProcessing = function (data, msc) {
    data.forEach(item => {
        const mscKey = Object.keys(msc).find(k => k === item.score_type);
        if (mscKey) {
            const {home, away} = msc[mscKey];
            const total = +home + +away;

            if (total !== 0) {
                item.home = +home
                item.away = +away
            }
            if (int_msc_obj_key_away.includes(item.score_type)) {
                item.proportion = parseInt((item.away / total).toFixed(2) * 100)
            } else if (float_msc_obj_key_home.includes(item.score_type)) {
                item.proportion = (item.home / total).toFixed(2) * 100
            }
        }
    })

}

const _getList = function () {
    const clone_match_detail = lodash.cloneDeep(match_detail.value)
    if (clone_match_detail?.msc_obj) return
    State.statistics_table = clone_match_detail
    // 环形比分图形表
    scoreProcessing(State.ring_statistics, clone_match_detail.msc_obj)
    // 黄牌 红牌 角球
    scoreProcessing(State.card_corner_list, clone_match_detail.msc_obj)
    // // 进度条比分图形表
    scoreProcessing(State.progress_graph, clone_match_detail.msc_obj)
    console.log(State,"State")
}

const detail_info = computed(()=>{
    const {msc_obj} = match_detail.value;
    let result = {}
    if (lodash.isEmpty(msc_obj)) return result

    Object.keys(msc_obj).map(key => {
        const {home, away} = msc_obj[key];
        setResult(key, home, away);
    })
    console.log(result,"resault")
    return result

    function setResult(key, home, away) {
        const total = Number(home) + Number(away);
        result[key] = {
            home,
            away,
            percentage: parseInt((Number(home) / total || 0).toFixed(2) * 100),
            away_percentage: (Number(away) / total || 0).toFixed(2) * 100,
        };
    }
})
</script>

<template>
    <AnalysisCard :title="i18n_t('match_result.statistics')">
        <template #body>
            <div class="statistics">
                <nav class="team-name">
                    <spna class="mhn name">{{ match_detail?.mhn }}</spna>
                    <spna class="man name">{{ match_detail?.man }}</spna>
                </nav>
                <!-- 圆环图形 -->
                <div class="circle">
                    <div class="circle-item" v-for="(item,index) of State.ring_statistics" :key="index">
                        <template v-if="item.score_type === 'S111'">
                            <span>{{ item.home }}%</span>
                            {{ detail_info[item.score_type] }}
<!--                            <q-knob-->
<!--                                readonly-->
<!--                                v-model="detail_info[item.score_type].percentage"-->
<!--                                size="50px"-->
<!--                                :thickness="0.4"-->
<!--                                color="amber-7"-->
<!--                                :track-color="detail_info[item.value_key].percentage == 0 ? 'grey-5' : 'indigo-12'"-->
<!--                                class="q-ma-md"-->
<!--                            />-->
                            <span>{{ item.away }}%</span>
                        </template>
                        <template v-else>

                        </template>
                    </div>
                </div>
            </div>
        </template>
    </AnalysisCard>
</template>


<style scoped lang="scss">
.statistics {
    width: 100%;
    padding: .08rem;
    box-sizing: border-box;
}

.team-name {
    width: 100%;
    height: .4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
        position: relative;
        padding: .16rem;
        color: #1A1A1A;
        font-size: .12rem;
        font-style: normal;
        font-weight: 400;
    }

    .mhn:before {
        content: '';
        display: block;
        width: .06rem;
        height: .06rem;
        border-radius: .03rem;
        background: #FFAC01;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    .man:after {
        content: '';
        display: block;
        width: .06rem;
        height: .06rem;
        border-radius: .03rem;
        background: #5881F7;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
}


.visuals {

    border-radius: 0.08rem;

    .circle-part {
        display: flex;
        margin-bottom: 0.3rem;

        .circle {
            margin-top: 0.35rem;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            .number {

                font-size: 0.12rem;

                letter-spacing: 0;
                margin: 0 0.04rem;
                text-align: right;
                line-height: 0.12rem;
            }

            .knob-img {
                margin: 0 0.04rem;
            }

            ::v-deep .text-span {

                font-size: 0.12rem;

                letter-spacing: 0;
                text-align: center;
                line-height: 0.12rem;
                position: absolute;
                top: -0.19rem;

                &.vi-top {
                    top: -0.28rem;
                }
            }
        }
    }

    .yellow-red-card-corner {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.18rem;
        // 葡萄牙语国际化样式调整
        &.page_lang_style {
            > div {
                margin-right: 0.6rem;
            }
        }

        > div {
            margin-right: 0.7rem;
            min-width: fit-content;
            display: flex;
            flex-direction: column;
            align-items: center;

            &:last-child {
                margin-right: 0;
            }

            .card-title {

                font-size: 0.12rem;

                letter-spacing: 0;
                text-align: center;
                line-height: 0.12rem;
                margin-bottom: 0.04rem;
            }

            .score {
                display: flex;
                align-items: center;

                > span {
                    &:nth-child(1) {
                        margin-right: 0.13rem;
                    }

                    &:last-child {
                        margin-left: 0.13rem;
                    }
                }

                > img {
                    width: 0.095rem;
                    height: 0.112rem;
                }
            }
        }
    }

    .linellae {

        height: 0.01rem;
        margin: 0 0.15rem 0.25rem;
    }

    .progress {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.3rem;
        position: relative;

        .progress-text {

            font-size: 0.12rem;

            letter-spacing: 0;
            text-align: center;
            line-height: 0.1rem;
            position: absolute;
            top: -0.12rem;
        }

        img {
            width: 0.092rem;
            height: 0.112rem;
        }

        &:last-child {
            margin-bottom: unset;
        }

        .progress-left {
            display: flex;
            align-items: center;
            width: 0.2rem;
            justify-content: flex-end;

            span {

                font-size: 0.12rem;

                text-align: center;
                line-height: 0.12rem;

                &:nth-child(1) {
                    margin-right: 0.065rem;
                }

                &:last-child {
                    margin-left: 0.15rem;
                }
            }
        }

        .q-linear-progress {
            width: 1.4rem;
            height: 0.04rem;
            border-radius: 3px;
            overflow: unset;
            margin: 0 0.02rem 0 0;

            &:last-child {
                margin-right: unset;
            }

            ::v-deep.q-linear-progress__track--light {
                background: var(--q-color-com-bg-color-23);

                &.q-linear-progress__track {
                    opacity: 1;
                }
            }
        }

        .progress-right {
            display: flex;
            align-items: center;
            width: 0.2rem;

            span {

                font-size: 0.12rem;

                text-align: center;
                line-height: 0.12rem;

                &:nth-child(1) {
                    margin-right: 0.15rem;
                }

                &:last-child {
                    margin-left: 0.065rem;
                }
            }
        }
    }
}
</style>