<script setup name="standings">
import {api_analysis} from "src/api/index.js";      // 赛事分析接口文件
import AnalysisCard from "../../AnalysisCard.vue"
import {inject, reactive, computed, onBeforeMount} from "vue";      // 外层卡片壳子

const State = reactive({
    rankingAllData: [],
    rankingData: [],
    btnText: "",       //按钮名字
    direction: "",      //按钮图标的方向
    boxBool: "",       //是否展开
    noData: false
})

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

//切换是否展开
const toggle_box = () => State.direction === '' && _getList() || _getList(0);

const setInitialState = (text, dir, bool) => {
    [State.btnText, State.direction, State.boxBool] = [text, dir, bool];
};

//表格数据长度大于等于2,默认收起,展示一条;
const rules_a = () => {
    if (State.rankingData.length >= 2) setInitialState(i18n_t("bet_record.pack_down"), "down", true);
};
const rules_b = () => {
    if (State.rankingData.length < 2) toggle_rule_a();
};
const rules_c = () => {
    if (State.rankingData.length >= 2) toggle_rule_b();
};


//小于2个时都展开
const toggle_rule_a = () => lodash.map(State.rankingData, item => ({...item, isBoolean: true}));

//大于等于2个时，第一个和第二个展开
const toggle_rule_b = () => lodash.map(State.rankingData, (item, index) => {
    item.isBoolean = index === 0 || index === 1;
    return item;
});

const percentage = function (item) {
    return ((item.winTotal / item.matchCount) * 100).toFixed(1) +'%'
}


const _getList = async function (flag) {
    try {
        const parameter = {
            mid: match_detail.value.mid,
            flag: flag === 0 ? 0 : '1',
        };

        State.noData = true;

        let {code, data} = await api_analysis.get_vs_info(parameter)

        if (['0400500'].includes(code)) {
            // $toast(i18n_t('limit.msg1'), 1500)
        }

        if (code != 200 || (data || []).length < 1) throw new Error('暂无数据')

        State.rankingAllData = data;

        State.noData = false

        if (flag != 0) {
            State.rankingData = data.filter(item => item.teamFlag != '')
            setInitialState(i18n_t("bet_record.pack_up"), "", false);
            rules_a();
            rules_b();
            rules_c()
        } else {
            State.rankingData = data
            State.boxBool = !State.boxBool

            if (State.boxBool) {
                setInitialState(i18n_t("bet_record.pack_down"), "down", true);
                toggle_rule_b();
            } else {
                setInitialState(i18n_t("bet_record.pack_up"), "", false);
                toggle_rule_a();
            }
        }
    } catch (error) {
        State.noData = true
    }
}

const title = computed(() => {
    let firstName, secondName;
    firstName = State.rankingAllData[0]?.tournamentType == 1 ? i18n_t('analysis_football_matches.league_points') : i18n_t('analysis_football_matches.cup_points')
    secondName = match_detail.value?.tn ?? ''
    return firstName + '-' + secondName

})

onBeforeMount(() => {
    console.log("zhixing")
    _getList()
})
</script>

<template>
    <AnalysisCard :title="title" v-if="State.rankingData.length && !State.noData">
        <template #body>
            <ul class="table" v-if="State.rankingData.length">
                <li class="table-header table-item">
                    <p>{{ i18n_t('analysis_football_matches.rank') }}</p>
                    <p>{{ i18n_t('analysis_football_matches.team') }}</p>
                    <p v-show="match_detail?.csid == 1">{{ i18n_t('analysis_football_matches.game') }}</p>
                    <p >{{ i18n_t('analysis_football_matches.victory') }}</p>
                    <p >{{ i18n_t('analysis_football_matches.negative') }}</p>
                    <p v-show="match_detail?.csid == 1">{{ i18n_t('analysis_football_matches.flat') }}</p>
                    <p v-show="match_detail?.csid == 1">{{i18n_t('analysis_football_matches.gain_loss') }}</p>
                    <p v-show="match_detail?.csid == 1">{{i18n_t('analysis_football_matches.net_win') }}</p>
                    <p v-show="match_detail?.csid == 1">{{i18n_t('analysis_football_matches.integral') }}</p>
                    <p v-show="match_detail?.csid == 2">{{ i18n_t('home_popular.win_rate') }}</p>
                </li>
                <li v-for="(item, i) in State.rankingData" :key="i" v-show="item.isBoolean" class="table-info table-item">
                    <p>{{ item?.positionTotal }}</p>
                    <!-- 球队 -->
                    <p class="ellipsis"
                       :class="{col2_home: item?.teamFlag == 't1', col2_away: item?.teamFlag == 't2' }">{{item?.teamName }}</p>
                    <p v-show="match_detail?.csid == 1">{{ item?.matchCount }}</p>
                    <p>{{ item?.winTotal }}</p><!-- 胜 -->
                    <p>{{ item?.lossTotal }}</p>
                    <p v-show="match_detail?.csid == 1">{{ item?.drawTotal }}</p>
                    <p v-show="match_detail?.csid == 1">{{item?.goalsForTotal }}/{{ item?.goalsAgainstTotal }}</p><!-- 进/失 -->
                    <p v-show="match_detail?.csid == 1">{{ item?.goalDiffTotal }}</p>
                    <p v-show="match_detail?.csid == 1">{{ item?.pointsTotal }}</p><!-- 积分 -->
                    <p v-show="match_detail?.csid == 2">{{ percentage(item) }}</p>
                </li>
                <li class="more-btn" @click="toggle_box" v-if="State.rankingAllData.length > 2">展开</li>
            </ul>
            <div class="no-data" v-else>{{i18n_t('analysis_football_matches.no_data')}}</div>
        </template>
    </AnalysisCard>
</template>

<style scoped lang="scss">
.table{
    width: 100%;
    .table-header{
        width: 100%;
        height: 32px;
        background: #FFF8F3;
    }
    .table-item{
        display: grid;
        grid-template-columns: 1fr 2fr repeat(7,1fr);
        align-items: center;
        text-align: center;
        border-bottom: 1px solid #E2E2E2;
    }
    .table-info{
        height: 40px;
    }
    .more-btn{
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #FFFFFF;
        color: #FF7000;
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