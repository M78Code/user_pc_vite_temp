<!--
 * @Author: ledron
 * @Date: 2021-01-13 11:34:53
 * @Description: 赛果详情 事件 组件
-->
<template>
  <div class="time_line">
    <template v-if="!no_data">
      <div class="title">{{ t('match_result.event') }}</div>
      <div class="incident_event" v-for="(item, index) in event_data" :key="index">
        <div
          class="incident_event_title"
          v-if="title_calculation(item) != '' && item.eventCode == 'match_status'"
          :class="{start_line: item.matchPeriodId == 0}"
        >
          <span v-html="title_calculation(item)" :class="{midfield: item.matchPeriodId == 31}"></span>
        </div>
        <match-results-stage v-else>
          <div slot="left" class="left" v-if="item.home">
            <div class="substitution">
              <p>
                <span v-if="item.eventCode == 'corner'"  v-html="translation_switch(item)"></span>
                <span v-else>{{ item.home.playName ? item.home.playName :  get_detail_data.mhn }}</span>
                <span v-if="item.home.eventCode == 'goal'">{{item.home.score}}</span>
              </p>
              <span v-if="item.home.playChangedName" style="margin-top: .03rem">{{ item.home.playChangedName }}</span>
            </div>
            <img v-if="item.matchPeriodId == 50" :src="item.home.eventCode == 'goal_penalty' ? penalty_img : penalty_missed_img">
            <span v-else>{{item.home.secondsFromStart}}</span>
          </div>
          <div class="middle" :class="{intermission : item.intermission}">
            <template v-if="item.matchPeriodId == 50">{{item.numPlace}}p</template>
            <img v-else :src="picture_conversion(item)" :class="imgWidth(item)">
          </div>
          <div slot="right" class="right" v-if="item.away">
            <img v-if="item.matchPeriodId == 50" :src="item.away.eventCode == 'goal_penalty' ? penalty_img : penalty_missed_img">
            <span v-else>{{item.away.secondsFromStart}}</span>
            <div class="substitution">
              <p>
                <span v-if="item.eventCode == 'corner'" v-html="translation_switch(item)"></span>
                <span v-else>{{ item.away.playName ? item.away.playName : get_detail_data.man }}</span>
                <span v-if="item.away.eventCode == 'goal'">{{item.away.score}}</span>
              </p>
              <span v-if="item.away.playChangedName" style="margin-top: .03rem">{{ item.away.playChangedName }}</span>
            </div>
          </div>
        </match-results-stage>
      </div>
      <!-- 底部图片文字说明 -->
      <results-footer/>
    </template>
    <div v-else class="no-data-footer"></div>
  </div>
</template>

<script setup>
// TODO: store数据未处理
import { api_analysis } from "src/api/index.js";
// import { mapGetters } from "vuex";
  // 赛果详情 事件 组件
import matchResultsStage from 'project_path/src/pages/details/components/details-match-results/match-results-stage.vue'
 // 赛果详情 底部图标说明
import resultsFooter from 'project_path/src/pages/details/components/details-match-results/results-footer.vue' // project\yazhou-h5\src\pages\details\components\details-match-results\results-footer.vue
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { useRoute } from "vue-router"
import { computed, onUnmounted, ref, onMounted } from "vue";
import { t } from "src/core/index.js";
import lodash from "lodash"

  // components: {
  //   'match-results-stage': match_results_stage,
  //   'results-footer': results_footer
  // },
  // 国际化
  
  // 图片
  const yellow_img = ref('image/bw3/svg/match-results/yellow.svg')
  const red_img = ref('image/bw3/svg/match-results/red.svg')
  const corner_img = ref('image/bw3/svg/match-results/corner.svg')
  const substitution_img = ref('image/bw3/svg/match-results/substitution.svg')
  const goal_img = ref('image/bw3/svg/match-results/goal.svg')
  const penalty_img = ref('image/bw3/svg/match-results/penalty.svg')
  const penalty_missed_img = ref('image/bw3/svg/match-results/penalty_missed.svg')
  const own_goals_img = ref('image/bw3/svg/match-results/own_goals.svg')

  const event_data = ref([])
  const no_data = ref(true)
  // 路由
  const route = useRoute()

  onMounted(() => {
    // 添加监听 赛事分析刷新事件
    useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, get_list).on

    get_list()
  })
  const match_id = computed(() => {
    return route.params.mid || get_detail_data.mid
  })
  const imgWidth = computed(() => {
    return function (item) {
        if (['yellow_card', 'red_card'].includes(item.eventCode)) {
          return 'icon-w11'
        } else if (['corner'].includes(item.eventCode)) {
          return 'icon-w7'
        } else if (['substitution'].includes(item.eventCode)) {
          return 'icon-w15'
        } else if (['goal', 'goal_penalty', 'penalty_missed', 'goal_own'].includes(item.eventCode)) {
          return 'icon-w14'
        } else {
          return ''
        }
      }
  })
  // computed: {
  //   ...mapGetters(["get_goto_detail_matchid", 'get_detail_data', 'get_lang']),
  //   // 赛事id
  //   match_id() {
  //     return $route.params.mid || get_detail_data.mid
  //   },
  //   // 时间线icon
  //   imgWidth() {

  //   },
  // },
    // 初始化方法
  const get_list = async () => {
     // {mid: match_id} TODO: 待处理
      try {
        let reslut = await api_analysis.get_event_result({mid: route.params.mid || get_detail_data.mid})
        let res = ''
      if (lodash.get(reslut, 'status')) {
        res = reslut.data

      } else {
        res = reslut
      }
      let { code, data } = res
        if(code == 200 && data.length > 0) {
          data.forEach( (item, i, arr) => {
            item.matchPeriodId = (item.mid && item.mid.matchPeriodId) || (item.away && item.away.matchPeriodId) || (item.home && item.home.matchPeriodId)
            item.eventCode = (item.mid && item.mid.eventCode) || (item.away && item.away.eventCode) || (item.home && item.home.eventCode)
            item.numPlace = (item.away && item.away.numPlace) || (item.home && item.home.numPlace)
            if(item.away){
              item.away.secondsFromStart = Math.floor(item.away.secondsFromStart/60) +"/''"+ add_zero(Math.floor((item.away.secondsFromStart % 60))) + "/''"
            }
            if(item.home){
              item.home.secondsFromStart = Math.floor(item.home.secondsFromStart/60) +"/''"+ add_zero(Math.floor((item.home.secondsFromStart % 60))) + "/''"
            }
            // 中场休息，上边的样式去除line
            if(item.matchPeriodId == 31 && i > 0) {
              arr[i-1].intermission = true
            }
          })
          event_data = data
          no_data.value = false
        } else {
          no_data.value = true
        }
      } catch (error) {
        no_data.value = true
        console.error(error);
      }
    }
    // 后面字体补0
  const add_zero = (num_b) => {
      if (parseInt(num_b) < 10) {
        num_b = '0' + num_b
      }
      return num_b
    }
    // 赛事标题说明
  const title_calculation = (item) => {
      return item.matchPeriodId == 999 ? t('match_result.finish') : item.matchPeriodId == 120 ? t('match_result.penalty_kick_ended') : item.matchPeriodId == 110 ? t('match_result.overtime_is_over') :
              item.matchPeriodId == 100 ? t('match_result.end_of_regular_season') : item.matchPeriodId == 31 ? t('match_result.midfield') : item.matchPeriodId == 0 ? t('match_result.start') : ''
    }
    // 中间的图片转换
  const picture_conversion = (item) => {
    switch (item.eventCode) {
      case 'yellow_card':
        return yellow_img
      case 'red_card':
        return red_img
      case 'corner':
        return corner_img
      case 'substitution':
        return substitution_img
      case 'goal':
        return goal_img
      case 'goal_penalty':
        return penalty_img
      case 'penalty_missed':
        return penalty_missed_img
      case 'goal_own':
        return own_goals_img
      default:
        return ''
    }
  }
    // 角球的中英文切换
  const translation_switch = (item) => {
      let  number = item.numPlace
      if(get_lang == 'en'){
        switch (number) {
          case 1:
            return number + 'st ' + t('match_result.corner')
          case 2:
            return number + 'nd ' + t('match_result.corner')
          case 3:
            return number + 'rd ' + t('match_result.corner')
          default:
            return number + 'th ' + t('match_result.corner')
        }
      }else if(get_lang == 'vi'){
        return t('match_result.corner') + number
      } else{
        return t('match_result.which_number') + number + t('match_result.corner')
      }
    }
  onUnmounted(() => {
    // 移除监听 赛事分析刷新事件
    useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, get_list).off

    // for (const key in $data) {
    //   $data[key] = null
    // }
  })
</script>

<style lang="scss" scoped>
.title {
  height: 0.4rem;
  line-height: 0.4rem;
  padding-left: 0.24rem;

  font-size: 0.14rem;

  letter-spacing: 0;
  font-weight: bold;
  margin-bottom: 0.15rem;
  position: relative;

  &:before {
    content: '';
    width: 0.03rem;
    height: 0.12rem;
    position: absolute;
    left: 0.16rem;
    top: 0.14rem;

    border-radius: 1.5px;
  }
}

.incident_event {
  padding: 0 0.15rem;
  margin-bottom: 0.16rem;

  .incident_event_title {
    height: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    position: relative;
    text-align: center;
    margin-bottom: 0.22rem;

    > span {
      text-align: center;
      width: fit-content;
      width: -webkit-fit-content;

      width: -moz-fit-content;

      font-size: 0.1rem;

      border-radius: 4px;
      height: 100%;
      line-height: 0.19rem;
      padding: 0 0.1rem;
      position: relative;

      &.midfield {
        &:after {
          content: "";
          width: 1.43rem;
          height: 1px;
          position: absolute;
          left: unset;
          right: -1.5rem;
          top: 0.09rem;

          opacity: unset;
          bottom: unset;
          transform: unset;
        }

        &:before {
          content: "";
          width: 1.43rem;
          height: 1px;
          position: absolute;
          left: -1.5rem;
          top: 0.09rem;
        }
      }
    }

    &:after {
      content: "";
      width: 0.01rem;
      height: 0.2rem;
      opacity: 0.4;
      position: absolute;
      top: 0.21rem;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      color: var(--q-color-com-fs-color-24);
    }

    &.start_line {
      &:after {
        display: none !important;
      }
    }
  }
}

.no-list {
  padding-top: unset !important;
}

.intermission {
  &:after {
    display: none;
  }
}

.no-data-footer {
  height: 0.3rem;
}

.icon-w7 {
  width: 0.07rem;
}

.icon-w11 {
  width: 0.11rem;
}

.icon-w14 {
  width: 0.14rem;
}

.icon-w15 {
  width: 0.15rem;
}
</style>
