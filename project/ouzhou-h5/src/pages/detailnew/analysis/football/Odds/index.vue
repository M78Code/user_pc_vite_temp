<script setup name="odds">
import NoData from "../../NoData.vue"
import AnalysisCard from "../../AnalysisCard.vue"

import {api_analysis} from "src/api/index.js";      // 赛事分析接口文件
import {computed, inject, onBeforeMount, reactive} from "vue";
/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject('match_detail')

const State = reactive({
    tabList: [
        {name: i18n_t('footer_menu.rangqiu'),id :1},
        {name: i18n_t('analysis_football_matches.European_Finger'),id:2},
        {name: i18n_t('analysis_football_matches.size'),id:3},
    ],
    tabIndex: 0,
    selectedTabId: 1,
    dataList: [], //详细赔率数据
    noData: false,  // 数据加载完成
})

const get_list = async function () {
    try {
        State.noData = false
        let parameter = {
            standardMatchId: match_detail.value?.mid,
            parentMenuId: 5,  //父菜单类型:(2数据;3阵容4情报;5赔率)
            sonMenuId: State.tabIndex + 1
        }
        let {code, data} = await api_analysis.get_match_analysise_data(parameter)
        if (code != 200 || data?.sThirdMatchHistoryOddsDTOList.length < 1) throw new Error('暂时没有其他数据')

        State.dataList = data?.sThirdMatchHistoryOddsDTOList
        State.noData = true
    } catch (error) {
        console.error(error);
    }
}

const search_list_high = computed(() => {
    let rem_1 = window.innerWidth * 100 / 375;
    return {height: window.innerHeight - rem_1 - 90 + 'px'}
})

const radioButton = function (index) {
    if (State.tabIndex == index) return
    State.tabIndex = index
    State.dataList = []
    get_list()
}

const ChangeSelectedTabId = function (event){
    const { id,index } = event.target.dataset;
    if(id) State.selectedTabId = id
    State.tabIndex = index
}

onBeforeMount(() => {
    get_list()
})
</script>

<template>
    <section class="analysis-odds">
        <nav class="head-wrapper">
            <ul class="head-tab" @click="ChangeSelectedTabId($event)">
                <li class="head-tab-item" :class="{'active':State.selectedTabId == item.id}"
                    v-for="(item,index) of State.tabList" :key="item.id" :data-id="item.id" :data-index="index">
                    {{ item.name }}
                </li>
            </ul>
        </nav>
        <AnalysisCard :title="State.tabList[State.tabIndex].name">
            <template #body>
                <ul class="table">
                    <li class="table-header table-item table-bottom-border" v-if="State.tabIndex == 1">
                        <div class="t1">
                            <div class="ellipsis">
                                {{ i18n_t('analysis_football_matches.company') }}
                            </div>
<!--                            <div class="yb_ml6" style="visibility: hidden">-->
<!--                                <span>{{ i18n_t('analysis_football_matches.Initial_offer') }}</span>-->
<!--                                <span>1</span>-->
<!--                            </div>-->
                        </div>
                        <div class="t2">
                            <i >{{ i18n_t('analysis_football_matches.home_win1') }}</i>
                            <i >{{ i18n_t('analysis_football_matches.flat') }}</i>
                        </div>
                        <div class="t3">
                            <i class="t4">{{ i18n_t('analysis_football_matches.away_win') }}</i>
                            <i class="t4">{{ i18n_t('analysis_football_matches.Main_win_rate') }}</i>
                        </div>
                        <div class="t4">
                            <i >{{ i18n_t('analysis_football_matches.Customer_win_rate') }}</i>
                            <i class="t4">{{ i18n_t('analysis_football_matches.Return_rate') }}</i>
                        </div>
                    </li>
                    <li class="table-header table-item table-bottom-border" v-else>
                        <span class="t1">{{ i18n_t('analysis_football_matches.company') }}</span>
                        <span class="t2">
                            {{
                                State.tabIndex == 2 ? i18n_t('analysis_football_matches.big') : i18n_t('analysis_football_matches.Main_win')
                            }}
                        </span>
                        <span class="t3">{{ i18n_t('analysis_football_matches.handicap') }}</span>
                        <span class="t4">
                            {{
                                State.tabIndex == 2 ? i18n_t('analysis_football_matches.small') : i18n_t('analysis_football_matches.away_win')
                            }}
                        </span>
                    </li>
                    <template v-if="State.dataList.length">
                        <li class="table-body table-item table-bottom-border" v-for="(item,index) in State.dataList" :key="index">
                            <div class="t1">
                                <div class="name ellipsis table-right-border">{{ item.bookName }}</div>
                                <div class="options table-right-border">
                                    <span class="table-bottom-border">{{ i18n_t('analysis_football_matches.Initial_offer') }}</span>
                                    <span>{{ i18n_t('analysis_football_matches.immediate') }}</span>
                                </div>
                            </div>
                            <div class="t2 basic table-right-border">
                                <div class="basic-item table-bottom-border">{{ item.handicapOddsDTOList[0].value0 }}</div>
                                <div
                                    class="basic-item"
                                    :class="{'red':item.handicapOddsDTOList[1].directions.value0 == 1,'green':item.handicapOddsDTOList[1].directions.value0 == -1}">
                                        {{ item.handicapOddsDTOList[1].value0 }}
                                    <i class="odd yb_ml4"></i>
                                </div>
                            </div>
                            <div class="t3 basic table-right-border">
                                <div class="basic-item table-bottom-border">{{ item.handicapOddsDTOList[0].handicapVal }}</div>
                                <div
                                    class="basic-item table-bottom-border"
                                    :class="{'red':item.handicapOddsDTOList[1].directions.handicapVal == 1,'green':item.handicapOddsDTOList[1].directions.handicapVal == -1}">
                                  {{ item.handicapOddsDTOList[1].handicapVal }}
                                  <i class="odd yb_ml4"></i>
                                </div>
                            </div>
                            <div class="t4 basic table-right-border">
                                <div class="basic-item table-bottom-border">{{ item.handicapOddsDTOList[0].value }}</div>
                                <div
                                    class="basic-item table-bottom-border"
                                    :class="{'red':item.handicapOddsDTOList[1].directions.value == 1,'green':item.handicapOddsDTOList[1].directions.value == -1}">
                                  {{ item.handicapOddsDTOList[1].value }}
                                  <i class="odd yb_ml4"></i>
                                </div>
                            </div>
                        </li>
                    </template>
                    <NoData v-else></NoData>
                </ul>
            </template>
        </AnalysisCard>
    </section>
</template>

<style lang="scss" scoped>
.head-wrapper {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #E2E2E2;

    .head-tab {
        display: flex;
        justify-content: center;
        border-radius: .15rem;
        overflow: hidden;
        border: 1px solid #FF7000;
        background: #ffffff;

        &-item {
            height: .3rem;
            text-align: center;
            width: 1rem;
            line-height: .3rem;
            color: #484848;
            font: {
                size: .14rem;
                weight: 400;
            };
        }

        .active {
            color: #FFFFFF;
            background: #FF7000;
        }
    }
}


.table-right-border{
    border-right: .5px solid #E2E2E2;
}
.table-bottom-border{
    border-bottom: 1px solid #E2E2E2;
}
.red{
    background: rgba(255, 70, 70, 0.10);
}

.green{
    background: rgba(23, 164, 20, 0.10);
}

.table {
    width: 100%;

    .table-item {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        text-align: center;
    }

    .table-header {
        width: 100%;
        height: .32rem;
        grid-template-rows: .32rem;
        background: #FFF8F3;
    }

    .table-body{
        height: .8rem;
        grid-template-rows: .8rem;
        .t1{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            .name{
                flex-basis: 65%;
                height: .8rem;
                line-height: .8rem;
            }
            .options{
                flex-basis: 35%;
                height: 100%;
                span{
                    width: 100%;
                    height: .4rem;
                    display: block;
                    line-height: .4rem;
                }
            }
        }

        .basic{
            width: 100%;
            height: .8rem;
            &-item{
                width: 100%;
                height: .4rem;
                line-height: .4rem;
            }
        }
    }
}

.analysis-odds {

    height: calc(100% - 0.5rem);

    .heade-wrapper {
        width: 100%;
        height: auto;
        margin: 0 auto;

        position: sticky;
        top: 1.21rem;
        padding: 0.15rem 0.48rem;
        z-index: 100;

        .heade {
            position: relative;

            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0.08rem;

            &::after {
                content: "";
                pointer-events: none;
                position: absolute;
                left: 0;
                top: 0;
                border: 1px solid var(--q-color-border-color-25);
                border-radius: 0.16rem;
                width: 200%;
                height: 200%;
                -webkit-transform: scale(0.5);
                transform: scale(0.5);
                -webkit-transform-origin: left top;
                transform-origin: left top;
            }

            > span {
                height: 0.3rem;
                line-height: 0.3rem;
                flex: 1;
                letter-spacing: 0;
                text-align: center;
                font-size: 0.14rem;
                border-radius: 0.08rem;

                &:nth-child(2) {
                    position: relative;

                    &:before {
                        content: '';
                        width: 0.01rem;
                        height: 0.14rem;
                        position: absolute;
                        left: 0;
                        top: 0.08rem;
                    }

                    &:after {
                        content: '';
                        width: 0.01rem;
                        height: 0.14rem;
                        position: absolute;
                        right: 0;
                        top: 0.08rem;
                    }
                }

                &.is-active {
                    height: 0.29rem;

                    &:nth-child(2) {
                        &:before, &:after {
                            display: none;
                        }
                    }

                    border-radius: 0.08rem;
                }
            }
        }
    }

    .content {
        .tittle {
            position: sticky;
            top: 1.81rem;
            padding: 0 0.05rem 0.1rem 0.2rem;
            z-index: 80;

            i {
                font-style: normal;
                flex: 1;
            }
        }

        .detail {
            height: 0.52rem;

            //padding-left: 0.2rem;
            padding: 0 0.05rem 0 0.2rem;

            span {
                display: block;
            }
        }

        .t1 {
            margin-right: auto;
        }

        .t2, .t3 {
            width: 0.86rem;
        }

        .t4 {
            width: 0.5rem;
            margin-left: .02rem;
        }

        &.ouzhi {
            .t2, .t3, .t4 {
                flex: 1;
            }

            .detail {
                .t1 {
                    margin-right: 0.08rem;
                }
            }
        }
    }

    .odd {
        display: inline-block;
        width: 0.06rem;
        height: 0.08rem;
        margin-left: 0;
    }

    .red {

        i {

            -webkit-clip-path: polygon(50% 0, 100% 100%, 51% 64%, 0% 100%);
            clip-path: polygon(50% 0, 100% 100%, 51% 64%, 0% 100%);
        }
    }

    .green {

        i {

            -webkit-clip-path: polygon(50% 29%, 100% 0, 46% 100%, 0 0);
            clip-path: polygon(50% 29%, 100% 0, 46% 100%, 0 0);
        }
    }
}

.sliding {

    overflow-x: hidden;
    overflow-y: auto;
}
</style>