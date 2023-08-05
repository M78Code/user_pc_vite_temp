<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
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

<script>
import football_standings from "src/project/pages/details/analysis-matches/components/basketball_football_standings.vue"  // 详情页 或者 赛果  篮球足球公共组件，杯赛 联赛表格
import history_engagement from "src/project/pages/details/analysis-matches/components/history_engagement"   // 详情页  足球赛事分析 战绩 模块里边的 历史交战
import recent_record from "src/project/pages/details/analysis-matches/components/recent_record"   // 详情页  足球赛事分析 战绩 模块里边的 历史交战
import future_schedule from "src/project/pages/details/analysis-matches/football_match_analysis/components/future_schedule.vue"   // 详情页 或者 赛果  足球
import injury_situation from "src/project/pages/details/analysis-matches/football_match_analysis/components/injury_situation.vue"   // 伤停情况
import standings_technical from "src/project/pages/details/analysis-matches/football_match_analysis/components/standings_technical.vue"   // 技术面
import standings_disk from "src/project/pages/details/analysis-matches/football_match_analysis/components/standings_disk.vue"   // 盘面
import {mapGetters} from "vuex";
import {api_result} from "src/project/api";
import loading from "src/project/components/common/loading";  // 加载中

export default {
  name: "",
  components: {
    "football-standings": football_standings,
    "history-engagement": history_engagement,
    "recent-record": recent_record,
    "future-schedule": future_schedule,
    "standings-technical": standings_technical,
    "standings-disk": standings_disk,
    "injury-situation": injury_situation,
    loading,
  },
  data() {
    return {
      tab_list:[
        {name: this.$root.$t('analysis_football_matches.Fundamentals')},
        {name:this.$root.$t('analysis_football_matches.Disk')},
        {name:this.$root.$t('analysis_football_matches.Technical_side')}
      ],
      tabIndex: 0,
      future_schedule_data: {}, // 基本面的数据
      injury_situation_data: {init: null}, // 伤停情况
      matchHistory_battle_dto_map: {init: null}, // 盘面的数据
      homeAwayGoal_and_coach_map: {init: null}, // 盘面的数据
      loading: false,
    }
  },
  watch: {
  },
  created() {
    // 添加监听 赛事分析刷新事件
    this.$root.$on(this.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, this.refresh_match_analysis)

    if(this.get_detail_data.csid == 1) {
      this.get_data_list()
    }
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['get_detail_data', 'get_goto_detail_matchid']),
    // 赛事id
    match_id() {
      return this.$route.params.mid || this.get_detail_data.mid
    },
  },
  methods: {
    async get_data_list() {
      try {
        this.loading = true
        let parameter = {
          standardMatchId: this.match_id, //2274159, //2274159 ,//2079863足球测试id
          parentMenuId: 2,
          sonMenuId: this.tabIndex+1
        }
        let {code , data} = await api_result.get_match_analysise_data(parameter)
        this.loading = false
        if(code == 200 && Object.keys(data).length > 0) {
          this.future_schedule_data = _.get(data, 'basicInfoMap.sThirdMatchFutureStatisticsDTOMap', {})
          this.injury_situation_data = _.get(data, 'basicInfoMap.sThirdMatchSidelinedDTOMap', {})
          this.matchHistory_battle_dto_map = _.get(data, 'matchHistoryBattleDTOMap', {})
          this.homeAwayGoal_and_coach_map = _.get(data, 'homeAwayGoalAndCoachMap.sThirdMatchCoachDTOMap', {})
        }
      } catch (error) {
        console.error(error);
        this.loading = false
      }
    },
    tab_click(item, i) {
      if(this.loading || this.tabIndex == i) return
      this.tabIndex = i
      this.future_schedule_data = {}
      this.injury_situation_data = {init: null}
      this.matchHistory_battle_dto_map = {init: null}
      this.homeAwayGoal_and_coach_map = {init: null}
      if(this.get_detail_data.csid == 1) {
        this.get_data_list()
      }
    },
    // 刷新 当前赛事分析信息
    refresh_match_analysis() {
      const tabIndex = this.tabIndex
      this.tabIndex = -1
      
      this.$nextTick(() => {
        this.tab_click(this.tab_list[tabIndex], tabIndex)
      })
    }
  },
  destroyed() {
    // 移除监听 赛事分析刷新事件
    this.$root.$off(this.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, this.refresh_match_analysis)

    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
};
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
