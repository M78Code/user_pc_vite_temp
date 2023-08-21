<!--
 * @Author:
 * @Date:
 * @Description: 详情页  足球赛事分析 战绩 模块
-->
<template>
  <div class="standings analysis-odds">
    <div class="heade-wrapper" v-if="get_detail_data.csid == 1">
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
    <div v-if="tabIndex == 0">
      <!-- 杯赛积分 或者 联赛积分 -->
      <football-standings/>
      <!-- 历史交战 -->
      <history-engagement/>
      <!-- 近期战绩 -->
      <recent-record/>
      <!-- 未来赛程  只有 足球才有-->
      <future-schedule :future_schedule_data="future_schedule_data" v-if="get_detail_data.csid == 1"/>
      <!-- 伤停情况 只有 足球才有 -->
      <injury-situation :injury_situation_data="injury_situation_data" v-if="get_detail_data.csid == 1"/>
    </div>
    <!-- 盘面 -->
    <standings-disk
      v-if="tabIndex == 1"
      :matchHistory_battle_dto_map="matchHistory_battle_dto_map"
    />
    <!-- 技术面 -->
    <standings-technical
      v-if="tabIndex == 2"
      :homeAwayGoal_and_coach_map="homeAwayGoal_and_coach_map"
    />

    <!-- 加载中icon -->
    <loading v-if="loading && get_detail_data.csid == 1" top="58%" @touchmove.prevent></loading>
  </div>
</template>

<script setup>
// 详情页 或者 赛果  篮球足球公共组件，杯赛 联赛表格
import footballStandings from "project_path/src/pages/details/analysis-matches/components/basketball-football-standings.vue"
// 详情页  足球赛事分析 战绩 模块里边的 历史交战
import historyEngagement from "project_path/src/pages/details/analysis-matches/components/history-engagement.vue"
// 详情页  足球赛事分析 战绩 模块里边的 历史交战
// import recentRecord from "project_path/src/pages/details/analysis-matches/components/recent-record.vue"
// 详情页 或者 赛果  足球
// import futureSchedule from "project_path/src/pages/details/analysis-matches/football-match-analysis/components/future-schedule.vue"
// 伤停情况
// import injurySituation from "project_path/src/pages/details/analysis-matches/football-match-analysis/components/injury-situation.vue"
// 技术面
// import standingsTechnical from "project_path/src/pages/details/analysis-matches/football-match-analysis/components/standings-technical.vue"
// 盘面
// import standingsDisk from "project_path/src/pages/details/analysis-matches/football-match-analysis/components/standings-disk.vue"
// TODO: 后续修改调整
// import {mapGetters} from "vuex";
import {api_result} from "src/api/index.js";
 // 加载中
// import loading from "project_path/src/components/common/loading.vue";
import { computed, ref, nextTick, onUnmounted, onMounted } from 'vue'
import lodash from 'lodash'
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
import { useRoute } from 'vue-router'
import { t } from "src/boot/i18n";
// TODO: 临时用
let get_detail_data = ref({
  mid: '1',
  csid: '1',
  cds: ''
})
    let get_event_list = ref([])
    let get_lang = ref('zh')
    let get_analyze_show = ref(false)
  // components: {
  //   "football-standings": football_standings,
  //   "history-engagement": history_engagement,
  //   "recent-record": recent_record,
  //   "future-schedule": future_schedule,
  //   "standings-technical": standings_technical,
  //   "standings-disk": standings_disk,
  //   "injury-situation": injury_situation,
  //   loading,
  // },
  // 国际化
  
  const tab_list = ref([
        {name: t('analysis_football_matches.Fundamentals')},
        {name: t('analysis_football_matches.Disk')},
        {name: t('analysis_football_matches.Technical_side')}
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

  onMounted(() => {
    //   // 添加监听 赛事分析刷新事件
    useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis).on

    if(get_detail_data.csid == 1) {
      get_data_list()
    }
  })

  const match_id =  computed(() => {
    // TODO: 后续修改调整 'get_detail_data'
        return route.params.mid || get_detail_data.mid
  })
  onUnmounted(() => {
    // 移除监听 赛事分析刷新事件
    useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis).off

    tab_list.value = ref([
        {name: t('analysis_football_matches.Fundamentals')},
        {name: t('analysis_football_matches.Disk')},
        {name: t('analysis_football_matches.Technical_side')}
      ])
  })
  const get_data_list = async() => {
      try {
        loading.value = true
        let parameter = {
           //2274159, //2274159 ,//2079863足球测试id
          standardMatchId: match_id,
          parentMenuId: 2,
          sonMenuId: tabIndex.value + 1
        }
        let results = await api_result.get_match_analysise_data(parameter)
        let res = {}
        if (results.status) {
          res = results.data
        } else {
          res = results
        }
        let {code , data} = res
        loading.value = false
        if(code == 200 && Object.keys(data).length > 0) {
          future_schedule_data.value = lodash.get(data, 'basicInfoMap.sThirdMatchFutureStatisticsDTOMap', {})
          injury_situation_data.value = lodash.get(data, 'basicInfoMap.sThirdMatchSidelinedDTOMap', {})
          matchHistory_battle_dto_map.value = lodash.get(data, 'matchHistoryBattleDTOMap', {})
          homeAwayGoal_and_coach_map.value = lodash.get(data, 'homeAwayGoalAndCoachMap.sThirdMatchCoachDTOMap', {})
        }
      } catch (error) {
        console.error(error);
        loading = false
      }
    }
  const tab_click = (item, i) => {
      if(loading || tabIndex.value == i) return
        tabIndex.value = i
        future_schedule_data.value = {}
        injury_situation_data.value = {init: null}
        matchHistory_battle_dto_map.value = {init: null}
        homeAwayGoal_and_coach_map.value = {init: null}
        // TODO: 后续修改调整 'get_detail_data'
        if(get_detail_data.csid == 1) {
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
.heade-wrapper {
  width: 100%;
  height: auto;
  z-index: 100;
  margin: 0 auto;

  position: sticky;
  top: 1.21rem;
  padding: 0.15rem 0.48rem;

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
      padding: 0 .15rem;

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
</style>
