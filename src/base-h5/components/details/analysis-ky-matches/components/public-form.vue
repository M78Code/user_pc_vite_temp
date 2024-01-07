<!--
 * @Author:
 * @Date:
 * @Description: 详情页  足球赛事分析 战绩 模块里边的 公共列表
-->
<template>
  <div class="component public_form">
    <!-- 头部 -->
    <div class="header">
      <div class="col1">{{i18n_t('analysis_football_matches.date')}}</div>
      <div class="col2">{{i18n_t('analysis_football_matches.league')}}</div>
      <div class="col3">{{future_schedule == 'future_schedule' ? (UserCtr.ang === 'zh' ? '比' : '') + i18n_t('analysis_football_matches.game') :i18n_t('analysis_football_matches.score')}}</div>
      <div class="col4" v-if="future_schedule == 'future_schedule'">
        {{ i18n_t('analysis_football_matches.Interval_days') }}
      </div>
      <div class="col4" @click="change_default_number" v-else>
        <span v-if="default_index == 0">{{i18n_t('analysis_football_matches.results')}}</span>
        <span v-else-if="default_index == 1">{{i18n_t('analysis_football_matches.turn_around')}}</span>
        <span v-else-if="default_index == 2">{{i18n_t('analysis_football_matches.size')}}</span>
        <i class="icon sort-flag"></i>
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/f-icon-pay-change-y0.svg`" class="sort-flag">
      </div>
    </div>
    <!-- 主内容 -->
    <template v-if="liat_data.length">
      <div class="team-item" v-for="(item, i) in liat_data" :key="i">
        <!-- .Format(i18n_t('time5')) -->
        <div class="col1 ellipsis">{{(DateForMat(+item.beginTime))}}</div>
        <div class="col2 tournamentName">{{ item.tournamentName }}</div>
        <div class="col3 ellipsis">
          <span class="home ellipsis" :class="[item.homeTeamName == hm_index_name ? 'add_bold' :'']">{{ item.homeTeamName }}</span>
          <span class="future_schedule" v-if="future_schedule == 'future_schedule'">VS</span>
          <span class="number" v-else>{{item.homeTeamScore}}-{{item.awayTeamScore}}</span>
          <span class="away ellipsis" :class="[item.awayTeamName == hm_index_name ? 'add_bold' :'']">{{ item.awayTeamName }}</span>
        </div>
        <div class="col4" v-if="future_schedule == 'future_schedule'">
          {{ item.intervalDay }}
        </div>
        <div class="col4 end-btn" v-else>
          <!--赛果-->
          <span
              class="results"
              v-if="default_index == 0"
              :class="item.result == 2 ? 'results_flat  ping-or-zou-color' : item.result == 3 ? 'results_lose' : 'results_win'"
          >
          {{ item.result ==2 ? i18n_t('analysis_football_matches.flat') : item.result ==3 ? i18n_t('analysis_football_matches.negative') : i18n_t('analysis_football_matches.victory') }}
        </span>
          <!--盘路-->
          <span
              class="pan-road"
              v-else-if="default_index == 1"
              :class="item.handicapResult ==2 ? 'flat ping-or-zou-color' : item.handicapResult ==3 ? 'no_pan_road' : item.handicapResult ==4 ? 'have_pan_road' : ''"
          >
           <!-- <template v-if="item.handicapVal">{{ item.handicapVal }}{{ item.handicapResult ==2 ? i18n_t('analysis_football_matches.level') : item.handicapResult ==3 ? i18n_t('analysis_football_matches.lose')  : item.handicapResult ==4 ? i18n_t('analysis_football_matches.win') : '' }}</template> -->
           <template v-if="item.handicapVal">{{ item.handicapResult ==2 ? i18n_t('analysis_football_matches.level') : item.handicapResult ==3 ? i18n_t('analysis_football_matches.lose')  : item.handicapResult ==4 ? i18n_t('analysis_football_matches.win') : '' }}</template>

          <template v-else>{{ i18n_t('analysis_football_matches.no_data') }}</template>
        </span>
          <!--大小-->
          <span
              class="big-small"
              v-else-if="default_index == 2"
              :class="item.overunderResult ==2 ? 'flat ping-or-zou-color' : item.overunderResult ==3 ? 'no_big_small' : item.overunderResult ==4 ? 'have_big_small' : ''"
          >
           <!-- <template v-if="item.overunderVal">{{ item.overunderVal }}{{ item.overunderResult ==2 ? i18n_t('analysis_football_matches.level') : item.overunderResult ==3 ? i18n_t('analysis_football_matches.small') : item.overunderResult ==4 ? i18n_t('analysis_football_matches.big') : ''}}</template> -->
           <template v-if="item.overunderVal">{{ item.overunderResult ==2 ? i18n_t('analysis_football_matches.level') : item.overunderResult ==3 ? i18n_t('analysis_football_matches.small') : item.overunderResult ==4 ? i18n_t('analysis_football_matches.big') : ''}}</template>

          <template v-else>{{ i18n_t('analysis_football_matches.no_data') }}</template>
        </span>
        </div>
      </div>
    </template>
    <div v-else class="team-item">
      <div class="col1 ellipsis no-list">{{i18n_t('analysis_football_matches.no_data')}}</div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, watch, ref } from 'vue'
import { i18n_t } from "src/boot/i18n.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { DateForMat } from "src/output/index.js"
import { project_name,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"

// TODO: 后续修改调整
// import {mapGetters} from "vuex";

   // 国际化

  const props = defineProps({
    liat_data: {
      type: Array,
      default: null,
      require: true
    },
    hm_index_name: {
      type: String
    },
    future_schedule: {
      type: Number | String
    }
  })
  let default_index = ref(0)

 watch(() => props.liat_data, (n) => {
  props.liat_data = n
 })

 const change_default_number = () => {
    ++ default_index.value
    if(default_index.value >2) {
      default_index.value = 0
    }
  }
  onUnmounted(() => {
    default_index.value = 0
  })
  // watch: {
  //   'liat_data': {
  //     handler(n, o){
  //       this.liat_data = n
  //     },
  //     immediate: true,
  //     deep: true
  //   },
  // },
  // computed: {
  //   // mhid   主队id   mhn 主队名称
  //   // maid   客队id   man 客队名称
  //   ...mapGetters([ 'get_detail_data', 'get_lang'])
  // },
</script>

<style lang="scss" scoped>
.public_form {
  position: relative;

	/*  头部 */
  .header {
    height: 0.3rem;
    display: flex;
    text-align: center;
    align-items: center;
    padding: 0 0.1rem;
    background:var(--q-gb-bg-c-15);
    color: var(--q-analysis-text-color-32);
    // border-top: 1px solid var(--q-analysis-text-color-26);
    // border-bottom: 1px solid var(--q-analysis-text-color-26);
    border-top: 1px solid var(--q-analysis-bd-color-3);
    border-bottom: 1px solid var(--q-analysis-bd-color-3);

    > div {

      font-size: 0.1rem;
    }

    .sort-flag {
      display: inline-block;
      width: 0.09rem;
      height: 0.09rem;
    }
  }

  .team-item {
    display: flex;
    align-items: center;
    padding: 0 0.1rem;
    font-size: 0.13rem;
    height: 0.48rem;
    text-align: center;

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.12rem;
    }
  }

  .col1 {
    flex: 2;
  }

  .col2 {
    flex: 1.6;

    &.tournamentName {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  }

  .col3 {
    flex: 4;
    padding-left: 0.12rem;

    .home, .away {
      font-size: 0.12rem;
      width: 0.7rem;
    }

    .home {
      &.add_bold {

        font-weight: bold;
      }
    }

    .away {
      text-align: left;

      &.add_bold {

        font-weight: bold;
      }
    }

    .number {

      font-size: 0.12rem;

      line-height: 0.12rem;
      margin: 0 0.1rem;
    }

    .future_schedule {
      font-size: 0.12rem;
      margin: 0 0.1rem;
    }
  }

  .col4 {
    flex: 2;

    &.end-btn > span {
      width: 0.54rem;
      height: 0.2rem;
      letter-spacing: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      &.results {

        border-radius: 0.02rem;

        font-size: 0.12rem;
      }

      &.pan-road {

        border-radius: 0.02rem;

        font-size: 0.12rem;
      }

      &.big-small {

        border-radius: 0.02rem;

        font-size: 0.12rem;

        text-align: center;

      }
    }
  }
}
</style>