<!--
 * @Author: ledron
 * @Date: 2021-01-13 11:34:53
 * @Description: 赛果详情 赛况统计 和 事件
-->
<template>
  <div class="match-details" :class="{'get_is_hengping':get_is_hengping && get_analyze_show}" ref="analysis_detail">
    <!-- 足球赛事-->
    <template v-if="detail_data.csid == 1">
      <!-- 足球的环形及进度条统计图 -->
      <mathc-results-visuals
        :detail_data="detail_data"
        :ring_statistics="football_ring_statistics"
        :card_corner_list="football_card_corner_list"
        :progress_graph="football_progress_graph"
      />
      <!-- 事件时间轴及 底部图片 -->
      <time-line v-if="!get_analyze_show"/>
    </template>
    <!-- 篮球赛事-->
    <template v-if="detail_data.csid == 2">
      <!-- 篮球的环形及进度条统计图 -->
      <mathc-results-visuals
        :detail_data="detail_data"
        :ring_statistics="basketball_ring_statistics"
        :card_corner_list="basketball_card_corner_list"
        :progress_graph="basketball_progress_graph"
      />
      <!-- 事件时间轴 -->
      <basketball-incident/>
    </template>

  </div>
</template>

<script setup>
// 赛果详情 统计图形表
import mathcResultsVisuals from "src/base-h5/components/details/components/details-match-results/mathc-results-visuals.vue";
// 详情页 或者 赛果  篮球赛事事件
import basketballIncident from "src/base-h5/components/details/analysis-matches/basketball-match-analysis/basketball-incident.vue";
 // 赛果详情 事件 组件
import timeLine from 'src/base-h5/components/details/components/details-match-results/time-line.vue';
import { i18n_t } from "src/boot/i18n.js";
import {LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js'
import { ref, onMounted } from "vue";


const props = defineProps({
  detail_data: {
    type: Object,
    default: {}
  }
})
  // TODO: ；临时调试用
  const get_is_hengping = ref(true)
  const get_analyze_show = ref(false)

  const yellow_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/yellow.svg`
  const red_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/red.svg`
  const corner_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/corner.svg`
  const Whistle_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/Whistle.svg`
  const time_out_img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match-results/time_out.svg`
  // 锚点
  const analysis_detail = ref(null)
  // 国际化

  //    S104 进攻, S8 危险进攻, S105 球权/控球率
  const football_ring_statistics = ref([
      // {score_type:'S104', text: i18n_t('match_result.attack'), home: 0, away: 0, proportion: 50},
      {score_type:'S8', text: i18n_t('match_result.dangerous_offense'), home: 0, away: 0, proportion: 0},
      {score_type:'S105', text: i18n_t('match_result.ball_possession'), home: 0, away: 0, proportion: 0}
    ])
    //    S1088 三分命中率, S1235 投篮命中率, S111 罚球命中率
  const basketball_ring_statistics = ref([
    {score_type:'S1088', text: i18n_t('match_result.three_point_shooting'), home: 0, away: 0, proportion: 0},
    {score_type:'S1235', text: i18n_t('match_result.Field_goal_percentage'), home: 0, away: 0, proportion: 0},
    {score_type:'S111', text: i18n_t('match_result.Free_throw_percentage'), home: 0, away: 0, proportion: 0}
  ])
    //    S104 进攻, S8 危险进攻
  const football_card_corner_list = ref([
    {score_type:'S12', text: i18n_t('match_result.yellow_card'), home: 0, away: 0, img: yellow_img},
    {score_type:'S11', text: i18n_t('match_result.red_card'), home: 0, away: 0, img: red_img},
    {score_type:'S5', text: i18n_t('match_result.corner_kick'), home: 0, away: 0, img: corner_img}
  ])
    //    S106 犯规数, S11 剩余暂停
  const basketball_card_corner_list = ref([
    {score_type:'S106', text: i18n_t('match_result.Fouls'), home: 0, away: 0, img: Whistle_img},
    {score_type:'S109', text: i18n_t('match_result.Remaining_pause'), home: 0, away: 0, img: time_out_img},
  ])
  const football_progress_graph = ref( [
    //    S104 进攻
    {score_type:'S104', text: i18n_t('match_result.attack'), home: 0, away: 0, proportion: 0 },
    //    S1101 射门        S12 黄牌比分
    {score_type:'S1101', text: i18n_t('match_result.shot'), home: 0, away: 0, proportion: 0 },
    //    S18   射正        S11	红牌比分
    {score_type:'S18', text: i18n_t('match_result.shoot_right'), home: 0, away: 0, proportion: 0 },
    //    S17   射偏        S5	角球比分
    {score_type:'S17', text: i18n_t('match_result.shot_off'), home: 0, away: 0, proportion: 0 }
  ])
  const basketball_progress_graph = ref([
    //    S108 三分球得分
    {score_type:'S108', text: i18n_t('match_result.Three_pointer'), home: 0, away: 0, proportion: 0 },
    //    S107 两分球得分
    {score_type:'S107', text: i18n_t('match_result.Two_pointer'), home: 0, away: 0, proportion: 0 },
    //    S110   罚球得分
    {score_type:'S110', text: i18n_t('match_result.Free_throw'), home: 0, away: 0, proportion: 0 }
  ])

  const rem = (value) => {
    let font_size = (innerWidth * 100) / 375;
    return Math.ceil(value * font_size);
  };

  // computed: {
  //   ...mapGetters([
  //     'get_analyze_show',
  //     'get_is_hengping'
  //     ])
  // },
  onMounted (() => {
    if (analysis_detail.value) {
      analysis_detail.value.style.minHeight = window.innerHeight - rem(1.24) + 'px';
    }})
</script>


<style lang="scss" scoped>
.match-details {
  background: var(--q-analysis-text-color-17);
  padding-bottom: 0.1rem;
}
.get_is_hengping {
  padding-bottom: 0
}
</style>