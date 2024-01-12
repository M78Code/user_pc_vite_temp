<template>
  <div class="q-pb-md">
    <div class="panel">
      <!-- 统计 -->
      <div class="panel-title">{{ i18n_t("analysis.statistics") }}</div>
      <div class="total">
        <div class="list">
          <div class="">
            <div class="name">
              <span class="round home-round"></span>
              <span>{{ match.mhn }}</span>
            </div>
            <div class="result">
              <template v-if="match.csid == '1'">
                <div>
                  <div class="rs_jiao_quan icon"></div>
                  <div>{{ lodash.get(match, 'msc.S5.home') }}</div>
                </div>
                <div>
                  <div class="yellow_card icon"></div>
                  <div>{{ lodash.get(match, 'msc.S12.home') }}</div>
                </div>
                <div>
                  <div class="red_card icon"></div>
                  <div>{{ lodash.get(match, 'msc.S11.home') }}</div>
                </div>
                <div>
                  <div class="rs_jin_quan icon"></div>
                  <div>{{ lodash.get(match, 'msc.S1.home') }}</div>
                </div>
              </template>
              <template v-else>
                <div>
                  <img :src="compute_local_project_file_path('/image/svg/analysis-foul.svg')" alt="" width="14">
                  <div>{{ lodash.get(match, 'msc.S106.home') }}</div>
                </div>
                <div>
                  <img :src="compute_local_project_file_path('/image/svg/analysis-pause.svg')" alt="" width="14">
                  <div>{{ lodash.get(match, 'msc.S109.home') }}</div>
                </div>
              </template>
            </div>
          </div>

          <div class="away-home">
            <div class="name">
              <span>{{ match.man }}</span>
              <span class="round away-round"></span>
            </div>
            <div class="result">
              <!-- 足球 -->
              <template v-if="match.csid == '1'">
                <div>
                  <div class="rs_jin_quan icon"></div>
                  <div>{{ lodash.get(match, 'msc.S1.away') }}</div>
                </div>
                <div>
                  <div class="red_card icon"></div>
                  <div>{{ lodash.get(match, 'msc.S11.away') }}</div>
                </div>
                <div>
                  <div class="yellow_card icon"></div>
                  <div>{{ lodash.get(match, 'msc.S12.away') }}</div>
                </div>
                <div>
                  <div class="rs_jiao_quan icon"></div>
                  <div>{{ lodash.get(match, 'msc.S5.away') }}</div>
                </div>
              </template>
              <!-- 篮球 -->
              <template v-else>
                <div>
                  <img :src="compute_local_project_file_path('/image/svg/analysis-pause.svg')" alt="" width="14">
                  <div>{{ lodash.get(match, 'msc.S109.away') }}</div>
                </div>
                <div>
                  <img :src="compute_local_project_file_path('/image/svg/analysis-foul.svg')" alt="" width="14">
                  <div>{{ lodash.get(match, 'msc.S106.away') }}</div>
                </div>
              </template>
            </div>
          </div>

        </div>
        <chat :match="match" />
      </div>
    </div>

    <div class="panel match-event">
      <div class="panel-title">
        <!-- 事件 -->
        <span>{{ i18n_t('analysis.event') }}</span>
        <div class="stage-tab" v-if="match.csid == '2'">
          <span class="item" :class="{ 'active': activeStage == index }" @click="stage_choose(index)"
            v-for="(item, index) in event_all_data" :key="index">{{ item.key }}</span>
        </div>
      </div>
      <trace :match="match" :event_data="event_data" v-if="lodash.get('event_data.length')" />
    </div>

    <div class="foot-icon" v-if="match.csid == '1' && event_data.length">
      <div class="foot-icon-item" v-for="(item, index) in icons" :key="index">
        <img :src="item.name" alt="" width="14">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>


<script setup>

import { ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
// import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
// import { component_symbol, need_register_props } from "../config/index.js"
// useRegistPropsHelper(component_symbol, need_register_props)
import { api_analysis } from 'src/api/index'
import { compute_local_project_file_path } from 'src/output/index.js';
import { ChatFullVersionWapper as chat } from 'src/base-pc/components/analysis/template/chat/index.js'
import { TraceFullVersionWapper as trace } from 'src/base-pc/components/analysis/template/trace/index.js'
const props = defineProps(['match'])
const route = useRoute();
const activeStage = ref(0);
const event_data = ref([]); // 足球事件
const event_all_data = ref([]); // 篮球事件
const icons = ref([
  // 黄牌
  { name: 'public/image/yabo/svg/analysis-yellow_card.svg', label: i18n_t("icon_tips.yellow_card") },
  // 红牌
  { name: 'public/image/yabo/svg/analysis-red_card.svg', label: i18n_t("icon_tips.red_card") },
  // 角球
  { name: 'public/image/yabo/svg/analysis-corner.svg', label: i18n_t("list.corner") },
  // 换人
  { name: 'public/image/yabo/svg/analysis-substitution.svg', label: i18n_t("analysis.substitution") },
  // 进球
  { name: 'public/image/yabo/svg/analysis-goal.svg', label: i18n_t("icon_tips.goal") },
  // 点球
  { name: 'public/image/yabo/svg/analysis-goal_penalty.svg', label: i18n_t("icon_tips.penalty_kick") },
  // 点球未进
  { name: 'public/image/yabo/svg/analysis-penalty_missed.svg', label: i18n_t("analysis.penalty_missed") },
  // 乌龙球
  { name: 'public/image/yabo/svg/analysis-goal_own.svg', label: i18n_t("analysis.own_goals") },
])

// 足球
if (props.match.csid == '1') {
  get_result()
  // 篮球
} else {
  basketball_event()
}

function stage_choose(index) {
  activeStage.value = index
  event_data.value = event_all_data.value[index].value
}

/**
* @description: 足球事件
* @param {}
* @return {}
*/

function get_result () {
  api_analysis.get_getEventResult({ mid: props.match.mid }).then((data) => {
    if (data.code == 200) {
      let arr = [];
      let _data = lodash.get(data, 'data') || [];
      _data.map(item => {
        let obj = {}
        if (item.mid) {
          obj.team = 3
          obj.secondsFromStart = lodash.get(item, 'mid.secondsFromStart')
          switch (lodash.get(item, 'mid.matchPeriodId')) {
            // 开始
            case '0': obj.cnText = i18n_t("analysis.start"); break;
            // 中场
            case '31': obj.cnText = i18n_t("analysis.midfield"); break;
            // 常规赛结束
            case '100': obj.cnText = i18n_t("analysis.end_of_regular_season"); break;
            // 加时赛结束
            case '110': obj.cnText = i18n_t("analysis.overtime_is_over"); break;
            // 点球大战结束
            case '120': obj.cnText = i18n_t("analysis.penalty_kick_ended"); break;
            // 完赛
            case '999': obj.cnText = i18n_t("analysis.match_end"); break;
          }
        } else {
          let k = 'home',
            teamName = props.match.mhn;
          obj.team = 1
          if (item.away) {
            k = 'away'
            teamName = props.match.man
            obj.team = 2
          }

          switch (item[k].eventCode) {
            // 换人
            case 'substitution': obj.cnText = `${teamName} ${item[k].playName} ${i18n_t("analysis.substitution")} ${item[k].playChangedName}`; break;
            // 角球
            case 'corner': obj.cnText = `${teamName} ${item[k].numPlace}${i18n_t("analysis.corner")}`; break;
            // 黄牌
            case 'yellow_card': obj.cnText = `${teamName} ${i18n_t("icon_tips.yellow_card")}`; break;
            // 红牌
            case 'red_card': obj.cnText = `${teamName} ${i18n_t("icon_tips.red_card")}`; break;
            // 进球
            case 'goal': obj.cnText = `${teamName} ${i18n_t("icon_tips.goal")} ${item[k].score.replace(":", "-")}`; break;
            // 点球
            case 'goal_penalty': obj.cnText = `${teamName} ${i18n_t("icon_tips.penalty_kick")}`; break;
            // 点球未进
            case 'penalty_missed': obj.cnText = `${teamName} ${i18n_t("analysis.penalty_missed")}`; break;
            // 乌龙球
            case 'goal_own': obj.cnText = `${teamName} ${i18n_t("analysis.own_goals")}`; break;
          }
          obj.secondsFromStart = item[k].secondsFromStart
          obj.icon = item[k].eventCode
        }
        arr.push(obj)
      })
      event_data.value = arr
    }
  })
}

/**
* @description: 篮球事件
*/

function basketball_event () {
  api_analysis.get_live_event({ mid: props.match.mid }).then((res) => {
    let data = lodash.get(res, 'data');
    if (data && data.code == 200) {
      if (data.data) {
        event_all_data.value = data.data;
      }
      event_data.value = lodash.get(data, 'data[0].value') || []
    }
  })
}

onUnmounted(() => {
  event_data.value = null;
  event_all_data.value = null;
})

</script>

<style lang="scss" scoped>
/*  统计图表 */
.total {
  padding: 20px 30px 30px;
  border: 1px solid #DEE4F2;
  border-top: 0;
  border-radius: 0 0 8px 8px;

  .list {
    display: flex;
    justify-content: space-between;

    .away-home {
      align-items: flex-end;
      display: flex;
      flex-direction: column;
    }

    .name {
      color: var(--q-analysis-color-1);
      display: flex;
      align-items: center;
      margin-bottom: 18px;

      .round {
        width: 6px;
        height: 6px;
        border-radius: 6px;

        &.home-round {
          background: #E93D3D;;
          margin-right: 5px;
        }

        &.away-round {
          background: var(--q-analysis-color-2);
          margin-left: 5px;
        }
      }
    }

    .result {
      display: flex;
      color: var(--q-analysis-color-1);

      .icon {
        width: 14px;
        height: 14px;
        background-repeat: no-repeat;
        background-image: url($SCSSPROJECTPATH+"/image/common/png/sports_play_icon.png");
        background-size: 100%;

        &.rs_jiao_quan {
          background-position: 0 -224px;
        }

        &.rs_jin_quan {
          background-position: 0 -266px;
        }

        &.red_card {
          background-position: 0 -182px;
        }

        &.yellow_card {
          background-position: 0 -140px;
        }
      }

      &>div {
        margin-right: 30px;
        text-align: center;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

/*  事件 */
.match-event {
  margin-top: 20px;

  .panel-title {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;

    &:last-child {
      border-radius: 8px;
      border-bottom: 1px solid #DEE4F2;
    }

    .stage-tab {
      display: flex;
      align-items: center;

      .item {
        width: 60px;
        height: 24px;
        margin-right: 6px;
        background: var(--q-analysis-color-16);
        border-radius: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--q-analysis-color-3);

        &.active {
          color: var(--q-analysis-color-13);
          background-image: var(--q-analysis-bg-gradient-2);
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

/*  底部，赛事节点类型 */
.foot-icon {
  display: flex;
  justify-content: center;
  padding: 20px 0;

  .foot-icon-item {
    display: flex;
    align-items: center;
    margin-right: 20px;

    span {
      margin-left: 6px;
    }

    &:last-child {
      margin: 0;
    }
  }
}</style>