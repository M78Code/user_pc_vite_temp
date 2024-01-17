<script setup name="Figures">
import {reactive} from "vue";
import figuresStandings from "./Figures/figures-standings.vue"
import figuresHistoryEngagement from "./Figures/figures-history-engagement.vue"
import figuresRecentResults from "./Figures/figures-recent-results.vue"

const State = reactive({
    tabList: [
        {name: i18n_t('analysis_football_matches.Fundamentals'), id: 1},        // 基本面
        {name: i18n_t('analysis_football_matches.Disk'), id: 2},        // 盘面
        {name: i18n_t('analysis_football_matches.Technical_side'), id: 3}       // 技术面
    ],
    selectedTabId: 1
})
const ChangeSelectedTabId = function (event){
    const { id } = event.target.dataset;
    if(id) State.selectedTabId = id
}
</script>

<template>
    <section class="Figures">
        <nav class="head-wrapper">
            <ul class="head-tab" @click="ChangeSelectedTabId($event)">
                <li class="head-tab-item" :class="{'active':State.selectedTabId == item.id}"
                    v-for="item of State.tabList" :key="item.id" :data-id="item.id">
                    {{ item.name }}
                </li>
            </ul>
        </nav>
        <template v-if="State.selectedTabId == 1">
            <figuresStandings></figuresStandings>
            <figuresHistoryEngagement></figuresHistoryEngagement>
            <!-- 近期战绩 -->
            <figuresRecentResults></figuresRecentResults>
            <!-- 未来赛程  只有 足球才有-->
            <!-- 伤停情况 只有 足球才有 -->
        </template>
    </section>
</template>


<style scoped lang="scss">
.Figures{
    width: 100%;
    .head-wrapper{
        width: 100%;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #E2E2E2;
        .head-tab{
            display: flex;
            justify-content: center;
            border-radius: .15rem;
            overflow: hidden;
            border: 1px solid #FF7000;
            background: #ffffff;
            &-item{
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
            .active{
                color: #FFFFFF;
                background: #FF7000;
            }
        }
    }
}
</style>