<!--
 * @Author: ledron
 * @Date: 2021-01-13 11:34:53
 * @Description: 赛果详情 赛况统计 和 事件
-->
<template>
  <div class="match-details" :class="{'get_is_hengping':get_is_hengping && get_analyze_show}" ref="analysis_detail">
    <!-- 足球赛事-->
    <template v-if="get_detail_data.csid == 1">
      <!-- 足球的环形及进度条统计图 -->
      <mathc-results-visuals
        :ring_statistics="football_ring_statistics"
        :card_corner_list="football_card_corner_list"
        :progress_graph="football_progress_graph"
      />
      <!-- 事件时间轴及 底部图片 -->
      <time-line-footer v-if="!get_analyze_show"/>
    </template>
    <!-- 篮球赛事-->
    <template v-if="get_detail_data.csid == 2">
      <!-- 篮球的环形及进度条统计图 -->
      <mathc-results-visuals
        :ring_statistics="basketball_ring_statistics"
        :card_corner_list="basketball_card_corner_list"
        :progress_graph="basketball_progress_graph"
      />
      <!-- 事件时间轴 -->
      <basketball-incident/>
    </template>

  </div>
</template>

<script>
import mathc_results_visuals from "project_path/src/pages/details/components/details_match_results/mathc_results_visuals.vue";  // 赛果详情 统计图形表
import basketball_incident from "project_path/src/pages/details/analysis-matches/basketball_match_analysis/basketball_incident";   // 详情页 或者 赛果  篮球赛事事件
import time_line from 'project_path/src/pages/details/components/details_match_results/time_line.vue';  // 赛果详情 事件 组件

import {mapGetters} from "vuex";

export default {
  name: "match_results",
  components: {
    'mathc-results-visuals': mathc_results_visuals,
    'basketball-incident': basketball_incident,
    'time-line-footer': time_line,
  },
  data() {
    const yellow_img = "image/bw3/svg/match-results/yellow.svg",
      red_img = "image/bw3/svg/match-results/red.svg",
      corner_img = "image/bw3/svg/match-results/corner.svg",
      Whistle_img = "image/bw3/svg/match-results/Whistle.svg",
      time_out_img = "image/bw3/svg/match-results/time_out.svg"
    return{
      yellow_img,
      red_img,
      corner_img,
      Whistle_img,
      time_out_img,
      //    S104 进攻, S8 危险进攻, S105 球权/控球率
      football_ring_statistics: [
        // {score_type:'S104', text: this.$root.$t('match_result.attack'), home: 0, away: 0, proportion: 50},
        {score_type:'S8', text: this.$root.$t('match_result.dangerous_offense'), home: 0, away: 0, proportion: 0},
        {score_type:'S105', text: this.$root.$t('match_result.ball_possession'), home: 0, away: 0, proportion: 0}
      ],
      //    S1088 三分命中率, S1235 投篮命中率, S111 罚球命中率
      basketball_ring_statistics: [
        {score_type:'S1088', text: this.$root.$t('match_result.three_point_shooting'), home: 0, away: 0, proportion: 0},
        {score_type:'S1235', text: this.$root.$t('match_result.Field_goal_percentage'), home: 0, away: 0, proportion: 0},
        {score_type:'S111', text: this.$root.$t('match_result.Free_throw_percentage'), home: 0, away: 0, proportion: 0}
      ],
      //    S104 进攻, S8 危险进攻
      football_card_corner_list: [
        {score_type:'S12', text: this.$root.$t('match_result.yellow_card'), home: 0, away: 0, img: yellow_img},
        {score_type:'S11', text: this.$root.$t('match_result.red_card'), home: 0, away: 0, img: red_img},
        {score_type:'S5', text: this.$root.$t('match_result.corner_kick'), home: 0, away: 0, img: corner_img}
      ],
      //    S106 犯规数, S11 剩余暂停
      basketball_card_corner_list: [
        {score_type:'S106', text: this.$root.$t('match_result.Fouls'), home: 0, away: 0, img: Whistle_img},
        {score_type:'S109', text: this.$root.$t('match_result.Remaining_pause'), home: 0, away: 0, img: time_out_img},
      ],
      football_progress_graph: [
        //    S104 进攻
        {score_type:'S104', text: this.$root.$t('match_result.attack'), home: 0, away: 0, proportion: 0 },
        //    S1101 射门        S12 黄牌比分
        {score_type:'S1101', text: this.$root.$t('match_result.shot'), home: 0, away: 0, proportion: 0 },
        //    S18   射正        S11	红牌比分
        {score_type:'S18', text: this.$root.$t('match_result.shoot_right'), home: 0, away: 0, proportion: 0 },
        //    S17   射偏        S5	角球比分
        {score_type:'S17', text: this.$root.$t('match_result.shot_off'), home: 0, away: 0, proportion: 0 }
      ],
      basketball_progress_graph: [
        //    S108 三分球得分
        {score_type:'S108', text: this.$root.$t('match_result.Three_pointer'), home: 0, away: 0, proportion: 0 },
        //    S107 两分球得分
        {score_type:'S107', text: this.$root.$t('match_result.Two_pointer'), home: 0, away: 0, proportion: 0 },
        //    S110   罚球得分
        {score_type:'S110', text: this.$root.$t('match_result.Free_throw'), home: 0, away: 0, proportion: 0 }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'get_detail_data',
      'get_analyze_show',
      'get_is_hengping'
      ])
  },
  mounted () {
    if (this.$refs.analysis_detail) {
      this.$refs.analysis_detail.style.minHeight = window.innerHeight - this.$utils.rem(1.24) + 'px';
    }
  },
};
</script>


<style lang="scss" scoped>
.match-details {
  background: var(--q-color-page-bg-color-110);
  padding-bottom: 0.1rem;
}
.get_is_hengping {
  padding-bottom: 0
}
</style>
