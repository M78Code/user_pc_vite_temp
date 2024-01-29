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
        {score_type: 'S1088', title: i18n_t('match_result.three_point_shooting')},
        {score_type: 'S1235', title: i18n_t('match_result.Field_goal_percentage')},
        {score_type: 'S111', title: i18n_t('match_result.Free_throw_percentage')}
    ],
    // S106 犯规数, S11 剩余暂停
    card_corner_list: [
        {score_type: 'S106', title: i18n_t('match_result.Fouls')},
        {score_type: 'S109', title: i18n_t('match_result.Remaining_pause')},
    ],
    progress_graph: [
        //    S108 三分球得分
        {score_type: 'S108', title: i18n_t('match_result.Three_pointer')},
        //    S107 两分球得分
        {score_type: 'S107', title: i18n_t('match_result.Two_pointer')},
        //    S110   罚球得分
        {score_type: 'S110', title: i18n_t('match_result.Free_throw')}
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
                <ul class="circle">
                    <li class="circle-item" v-for="(item,index) of State.ring_statistics" :key="index">
                        <template v-if="item.score_type === 'S111'">
                            <nav class="circle-item--title">{{ item.title }}</nav>
                            <div class="circle-item--body">
                                <span class="number">{{ detail_info[item.score_type].home }}%</span>
                                <q-knob
                                    readonly
                                    v-model="detail_info[item.score_type].percentage"
                                    size="48px"
                                    :thickness="0.3"
                                    color="amber-7"
                                    :track-color="detail_info[item.score_type].percentage == 0 ? 'grey-5' : 'indigo-12'"
                                />
                                <span class="number">{{ detail_info[item.score_type].away }}%</span>
                            </div>
                        </template>
                        <template v-else>
                            <nav class="circle-item--title">{{ item.title }}</nav>
                            <div class="circle-item--body">
                                <span class="number">
                                    {{`${detail_info[item.score_type].percentage}%`}}
                                </span>
                                <q-knob
                                    readonly
                                    v-model="detail_info[item.score_type].percentage"
                                    size="48px"
                                    :thickness="0.3"
                                    color="amber-7"
                                    :track-color="detail_info[item.score_type].percentage == 0 ? 'grey-5' : 'indigo-12'"
                                />
                                <span class="number">
                                    {{`${detail_info[item.score_type].away_percentage}%`}}
                                </span>
                            </div>
                        </template>
                    </li>
                </ul>
                <!-- 中间提示 -->
                <ul class="center">
                    <li v-for="item of State.card_corner_list" :key="item.score_type" class="center-item">
                        <nav class="center-item--title">{{ item.title }}</nav>
                        <div class="center-item--body">
                            <span>{{ detail_info[item.score_type].home }}</span>
                            <span>{{ detail_info[item.score_type].away }}</span>
                        </div>
                    </li>
                </ul>
                <!-- 线性图形 -->
                <ul class="progress">
                    <template v-for="item of State.progress_graph" :key="item.score_type">
                        <li class="progress-item" v-if="detail_info[item.score_type]">
                            <nav class="progress-item--title">
                                <span>{{ detail_info[item.score_type]['home'] }}</span>
                                <span>{{ item.title }}</span>
                                <span>{{ detail_info[item.score_type]['away'] }}</span>
                            </nav>
                            <div class="progress-item--body">
                                <q-slider 
                                    readonly 
                                    reverse 
                                    v-model="detail_info[item.score_type]['percentage']" 
                                    :min="0" 
                                    :max="100" 
                                    track-size="5px" 
                                    color="amber-7" 
                                    thumb-size="'0'" 
                                    style="margin-right:6px"
                                />
                                <q-slider 
                                    readonly   
                                    v-model="detail_info[item.score_type]['away_percentage']" 
                                    :min="0" 
                                    :max="100" 
                                    track-size="5px" 
                                    color="indigo-12" 
                                    :thumb-size="'0'" 
                                />
                            </div>
                        </li>
                    </template>
                </ul>
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

.circle{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .16rem 0;
    box-sizing: border-box;
    gap: .08rem;
    overflow: hidden;
    &-item{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        &--title{
            margin-bottom: .08rem;
            color: #8A8986;
            font-size: .12rem;
        }
        &--body{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .number{
                color: #1A1A1A;
                font-size: .12rem;
                font-weight: 500;
            }
        }
        
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
</style>