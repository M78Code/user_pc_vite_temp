<!--
 * @Author:
 * @Date:
 * @Description: 详情页  足球赛事分析 战绩 模块
-->
<template>
  <div class="standings analysis-odds">
    <div class="heade-wrapper" v-if="detail_data.csid == 1">
      <div class="heade">
        <span v-for="(item,i) in tab_list" :key="i"
              :class="['ellipsis', {'is-active' : tabIndex == i}]"
              @click="tab_click(item, i)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
    <!-- 基本面 -->
    <div v-if="tabIndex == 0" class="base-bg">
      <!-- 杯赛积分 或者 联赛积分 -->
      <football-standings :detail_data="detail_data"/>
      <!-- 历史交战 -->
      <history-engagement :detail_data="detail_data"/>
      <!-- 近期战绩 11-->
      <recent-record :detail_data="detail_data"/>
      <!-- 未来赛程  只有 足球才有 -->
      <future-schedule :future_schedule_data="future_schedule_data" v-if="detail_data.csid == 1"/>
      <!-- 伤停情况 只有 足球才有 -->
      <injury-situation :injury_situation_data="injury_situation_data" :detail_data="detail_data" v-if="detail_data.csid == 1"/>
    </div>
    <!-- 盘面 -->
    <standings-disk
      v-if="tabIndex == 1"
      :detail_data="detail_data"
      :matchHistory_battle_dto_map="matchHistory_battle_dto_map"
    />
    <!-- 技术面 -->
    <standings-technical
      v-if="tabIndex == 2"
      :detail_data="detail_data"
      :homeAwayGoal_and_coach_map="homeAwayGoal_and_coach_map"
    />

    <!-- 加载中icon -->
    <loading-page v-if="loading && detail_data.csid == 1" top="58%" @touchmove.prevent></loading-page>
  </div>
</template>

<script setup>
// 详情页 或者 赛果  篮球足球公共组件，杯赛 联赛表格
import footballStandings from "src/base-h5/components/details/analysis-ky-matches/components/basketball-football-standings.vue"
// 详情页  足球赛事分析 战绩 模块里边的 历史交战
import historyEngagement from "src/base-h5/components/details/analysis-ky-matches/components/history-engagement.vue"
// 详情页  足球赛事分析 战绩 模块里边的 历史交战
import recentRecord from "src/base-h5/components/details/analysis-ky-matches/components/recent-record.vue"
// 详情页 或者 赛果  足球
import futureSchedule from "src/base-h5/components/details/analysis-ky-matches/football-match-analysis/components/future-schedule.vue"
// 伤停情况
import injurySituation from "src/base-h5/components/details/analysis-ky-matches/football-match-analysis/components/injury-situation.vue"
// 技术面
import standingsTechnical from "src/base-h5/components/details/analysis-ky-matches/football-match-analysis/components/standings-technical.vue"
// 盘面
import standingsDisk from "src/base-h5/components/details/analysis-ky-matches/football-match-analysis/components/standings-disk.vue"
// TODO: 后续修改调整
// import {mapGetters} from "vuex";
import {api_analysis} from "src/api/index.js";
 // 加载中
import loadingPage from "src/components/loading/loading.vue"
import { computed, ref, nextTick, onUnmounted, onMounted } from 'vue'
import lodash from 'lodash'
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
import { useRoute } from 'vue-router'
import { i18n_t } from "src/boot/i18n.js";
import UserCtr from "src/core/user-config/user-ctr.js";

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => {}
    }
})
  // 国际化

  const tab_list = ref([
        {name: i18n_t('analysis_football_matches.Fundamentals')},
        {name: i18n_t('analysis_football_matches.Disk')},
        {name: i18n_t('analysis_football_matches.Technical_side')}
      ])
  const tabIndex = ref(0)
  // 基本面的数据
  const future_schedule_data = ref({})
  // 伤停情况
  const injury_situation_data = ref({init: null})
  // 盘面的数据
  const matchHistory_battle_dto_map = ref({init: null})
  // 技术面的数据
  const homeAwayGoal_and_coach_map = ref({init: null})
  const loading = ref(false)
  const route = useRoute()

  //   // 添加监听 赛事分析刷新事件
  let off_ = () => {}
  onMounted(() => {
    let { off } = useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis)
    off_ = off
    if(props.detail_data.csid == 1) {
      get_data_list()
    }
  })

  const match_id =  computed(() => {
        return route.params.mid || props.detail_data.mid
  })
  onUnmounted(() => {
    // 移除监听 赛事分析刷新事件
    off_()
    tab_list.value = ref([
        {name: i18n_t('analysis_football_matches.Fundamentals')},
        {name: i18n_t('analysis_football_matches.Disk')},
        {name: i18n_t('analysis_football_matches.Technical_side')}
      ])
  })
  const get_data_list = async() => {
      try {
        // loading.value = true
        let parameter = {
           //2274159, //2274159 ,//2079863足球测试id
          standardMatchId: match_id.value,
          parentMenuId: 2,
          sonMenuId: tabIndex.value + 1
        }
        let res = await api_analysis.get_match_analysise_data(parameter)
        let {code , data} = res
        // loading.value = false
        if(code == 200 && Object.keys(data).length > 0) {
          future_schedule_data.value = lodash.get(data, 'basicInfoMap.sThirdMatchFutureStatisticsDTOMap', {})
          injury_situation_data.value = lodash.get(data, 'basicInfoMap.sThirdMatchSidelinedDTOMap', {})
          matchHistory_battle_dto_map.value = lodash.get(data, 'matchHistoryBattleDTOMap', {})
          homeAwayGoal_and_coach_map.value = lodash.get(data, 'homeAwayGoalAndCoachMap.sThirdMatchCoachDTOMap', {})
        }
      } catch (error) {
        console.error(error);
        loading.value = false
      }
    }
  const tab_click = (item, i) => {
      if(loading.value || tabIndex.value == i) return
        tabIndex.value = i
        future_schedule_data.value = {}
        injury_situation_data.value = {init: null}
        matchHistory_battle_dto_map.value = {init: null}
        homeAwayGoal_and_coach_map.value = {init: null}
        // TODO: 后续修改调整 'get_detail_data'
        if(props.detail_data.csid == 1) {
          get_data_list()
        }
    }
    // 刷新 当前赛事分析信息
  const refresh_match_analysis = () => {
      const tab_index = tabIndex.value
      tabIndex.value = -1

      nextTick(() => {
        tab_click(tab_list.value[tab_index], tab_index)
      })
    }
</script>

<style lang="scss" scoped>
.standings {
  // background: var(--q-analysis-text-color-19);
  .heade-wrapper {
  width: 100%;
  height: auto;
  z-index: 100;
  margin: 0 auto;
  background: var(--q-gb-bg-c-21);
  // background: var(--q-analysis-text-color-19);
  position: sticky;
  top: 1.21rem;
  padding: 0.15rem 0.48rem;

  .heade {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.08rem;
    background: var(--q-gb-bg-c-18);
    // background-color: var(--q-analysis-bg-color-1);
    &::after {
      content: "";
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      // border: 1px solid var(--q-analysis-bd-color-5);
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
      padding: 0 .15rem;
      // background: var(--q-analysis-bg-color-1);
      color: var(--q-analysis-text-color-34);
      &:nth-child(2) {
        position: relative;

        // &:before {
        //   content: '';
        //   width: 0.01rem;
        //   height: 0.14rem;
        //   position: absolute;
        //   left: 0;
        //   top: 0.08rem;
        //   background: var(--q-analysis-bg-color-18);
        // }

        // &:after {
        //   content: '';
        //   width: 0.01rem;
        //   height: 0.14rem;
        //   position: absolute;
        //   right: 0;
        //   top: 0.08rem;
        //   background: var(--q-analysis-bg-color-18);
        // }
      }

      &.is-active {
        height: 0.29rem;
        background: var(--q-gb-bg-c-28);
        color: var(--q-analysis-text-color-20);
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
}

</style>
