<!-- 统计 -->
<script setup name="statistics">
import AnalysisCard from "../../AnalysisCard.vue"
import {inject, reactive, watch} from "vue";

const match_detail = inject('match_detail')

const State = reactive({
    statistics_table: void (0),
    // S1088 三分命中率, S1235 投篮命中率, S111 罚球命中率
    ring_statistics: [
        {score_type:'S1088', text: i18n_t('match_result.three_point_shooting'), home: 0, away: 0, proportion: 0},
        {score_type:'S1235', text: i18n_t('match_result.Field_goal_percentage'), home: 0, away: 0, proportion: 0},
        {score_type:'S111', text: i18n_t('match_result.Free_throw_percentage'), home: 0, away: 0, proportion: 0}
    ],
    // S106 犯规数, S11 剩余暂停
    card_corner_list: [
        {score_type:'S106', text: i18n_t('match_result.Fouls'), home: 0, away: 0, img: Whistle_img},
        {score_type:'S109', text: i18n_t('match_result.Remaining_pause'), home: 0, away: 0, img: time_out_img},
    ],
    progress_graph: [
        //    S108 三分球得分
        {score_type:'S108', text: i18n_t('match_result.Three_pointer'), home: 0, away: 0, proportion: 0 },
        //    S107 两分球得分
        {score_type:'S107', text: i18n_t('match_result.Two_pointer'), home: 0, away: 0, proportion: 0 },
        //    S110   罚球得分
        {score_type:'S110', text: i18n_t('match_result.Free_throw'), home: 0, away: 0, proportion: 0 }
    ]
})

/*
 * 下面方法用来计算进度条占比
 * */

const int_msc_obj_key_away = ["S8", "S105", "S1088", "S111"]
const float_msc_obj_key_home = ["S104", "S1101", "S18", "S17", "S19", "S107", "S110", "S108"]
const scoreProcessing = function (data, msc) {
    data.forEach( item => {
        const mscKey = Object.keys(msc).find(k => k === item.score_type);
        if(mscKey){
            const { home, away } = msc[mscKey];
            const total = +home + +away;

            if(total !== 0){
                item.home = +home
                item.away = +away
            }
            if(int_msc_obj_key_away.includes(item.score_type)) {
                item.proportion = parseInt((item.away / total).toFixed(2) * 100)
            }else if(float_msc_obj_key_home.includes(item.score_type)){
                item.proportion = (item.home / total).toFixed(2) * 100
            }
        }
    })

}

const _getList = function (){
    const clone_match_detail = lodash.cloneDeep(match_detail.value)
    if(clone_match_detail?.msc_obj) return
    State.statistics_table = clone_match_detail
    // 环形比分图形表
    scoreProcessing(State.ring_statistics, clone_match_detail.msc_obj)
    // 黄牌 红牌 角球
    scoreProcessing(State.card_corner_list, clone_match_detail.msc_obj)
    // // 进度条比分图形表
    scoreProcessing(State.progress_graph, clone_match_detail.msc_obj)
}

watch(
    () => match_detail.value,
    () => {
        _getList()
    },
    {
        immediate: true, // 立即执行
        deep: true, // 深度监听
    }
);
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
                <div class="">
                    <div class=""></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </template>
    </AnalysisCard>
</template>



<style scoped lang="scss">
.statistics{
    width: 100%;
    padding: .08rem;
    box-sizing: border-box;
}
.team-name{
    width: 100%;
    height: .4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .name{
        position: relative;
        padding: .16rem;
        color: #1A1A1A;
        font-size: .12rem;
        font-style: normal;
        font-weight: 400;
    }
    .mhn:before{
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
    .man:after{
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
</style>