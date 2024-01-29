<script setup name="basketball-incident">
import { api_analysis } from "src/api";
import {inject, onBeforeMount, onBeforeUnmount, reactive} from "vue";
import AnalysisCard from "../../AnalysisCard.vue"

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject("match_detail");

const State = reactive({
    eventData: [],
    tabIndex: 0,
    noData: false
})

const ChangeSelectedTabId = function (event){
    const { id,index } = event.target.dataset;
    State.tabIndex = index
}

const _getList = async function () {
    try {
        State.noData = true
        console.log(match_detail.value,"asdfasd")
        let {code, data} = await api_analysis.get_live_event({mid: match_detail.value?.mid})
        if(code != 200 || data.length) throw new error('暂时没有更多数据')
        State.eventData = data
        State.noData = false
    } catch (error) {
        State.noData = true
    }
}

onBeforeMount(()=>{
    // this.$root.$on(this.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, this.get_list)
    _getList()
})
</script>


<template>
    <AnalysisCard :title="i18n_t('match_result.event')" v-if="!lodash.isEmpty(State.eventData)">
        <template #body>
            <nav class="head-wrapper">
                <ul class="head-tab" @click="ChangeSelectedTabId($event)">
                    <li class="head-tab-item" :class="{'active':State.tabIndex == index}"
                        v-for="(item,index) of State.eventData" :key="item.id || index" :data-id="item.id" :data-index="index">
                        {{ item.key }}
                    </li>
                </ul>
            </nav>
            <div class="basketball-incident-content">
                <div v-for="(item, index) in State.eventData[tab_index]?.value" :key="index">
                    <span>{{(new Date(+item.createTime)).Format(i18n_t('time4'))}}</span>
                    <i class="Glow" :class="{noLine: +State.eventData[tab_index]?.value.length -1 == index,home:item.team ==1, away: item.team == 2}"></i>
                    <div class="ellipsis-2-lines">
                        <span>{{ item.scores }}</span>
                        <span class="ellipsis-2-lines">{{item.cnText}}</span>
                    </div>
                </div>
            </div>
        </template>
    </AnalysisCard>
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

.basketball-incident-content {
    padding: 0 0.18rem 0;

    > div {
        width: 100%;
        display: flex;
        height: 0.46rem;
        align-items: center;

        > span {
            font-size: 0.12rem;

            &:nth-child(1) {
                width: 0.75rem;
            }
        }

        > .ellipsis-2-lines {
            width: 3rem;
            display: flex;
            align-items: center;

            span {
                &:nth-child(1) {
                    min-width: 0.45rem;
                    margin-right: 0.1rem;
                    text-align: center;
                }

                &:nth-child(2) {
                    width: 2.8rem;
                }
            }
        }

        > i {
            width: 0.07rem;
            height: 0.07rem;

            margin: 0 0.08rem;
            border-radius: 50%;
            position: relative;

            &:after {
                content: "";
                width: 1px;
                height: 0.43rem;
                position: absolute;
                left: unset;
                right: 0.027rem;
                top: 0.07rem;
            }

            &.noLine {
                &:after {
                    content: unset;
                }
            }
        }
    }
}

</style>
  