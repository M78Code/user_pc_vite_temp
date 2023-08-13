<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 右侧详情区---足球统计面板
-->
<template>
  <!-- 比分图表 -->
  <div class="wrap-score">
    <div class="char-round">
      <div class="wrap-chart" :class="{'num_zero': _.get(match_info, 'msc.S104.home') == 0 && _.get(match_info, 'msc.S104.away') == 0}">
        <div class="chart-round">
          <!-- S104 进攻次数 -->
          <span class="text-orange">{{_.get(match_info, 'msc.S104.home')}}</span>
          <q-knob
            readonly
            v-model="match_info.msc.S104.percentage"
            :thickness="0.3"
            color="blue"
            track-color="orange"
            :class="{'knob': get_right_zoom, 'knob2': !get_right_zoom}"
          />
          <span class="text-blue">{{_.get(match_info, 'msc.S104.away')}}</span>
        </div>
        <div class="text-c">
          {{$root.$t('common.assault')}}
          <!-- 进攻 -->
        </div>
      </div>
      <div class="wrap-chart" :class="{'num_zero': _.get(match_info, 'msc.S8.home') == 0 && _.get(match_info, 'msc.S8.away') == 0}">
        <div class="chart-round">
          <!-- S8 危险进攻次数 -->
          <span class="text-orange">{{_.get(match_info, 'msc.S8.home')}}</span>
          <q-knob
            readonly
            v-model="match_info.msc.S8.percentage"
            :thickness="0.3"
            color="blue"
            track-color="orange"
            :class="{'knob': get_right_zoom, 'knob2': !get_right_zoom}"
          />
          <span class="text-blue">{{_.get(match_info, 'msc.S8.away')}}</span>
        </div>
        <div class="text-c">
          {{$root.$t('common.dangerous_assault')}}
          <!-- 危险进攻 -->
        </div>
      </div>
      <div class="wrap-chart" :class="{'num_zero': _.get(match_info, 'msc.S105.home') == 0 && _.get(match_info, 'msc.S105.away') == 0}">
        <div class="chart-round">
          <!-- S105 球权 -->
          <span class="text-orange">{{_.get(match_info, 'msc.S105.home')}}</span>
          <q-knob
            readonly
            v-model="match_info.msc.S105.percentage"
            :thickness="0.3"
            color="blue"
            track-color="orange"
            :class="{'knob': get_right_zoom, 'knob2': !get_right_zoom}"
          />
          <span class="text-blue">{{_.get(match_info, 'msc.S105.away')}}</span>
        </div>
        <div class="text-c">
          {{$root.$t('common.possession_ball')}}
          <!-- 球权 -->
        </div>
      </div>
    </div>
    <div class="wrap-chart">
      <div class="goal">
        <div class="on_goal" :class="{'line_num_zero': _.get(match_info, 'msc.S18.home') == 0 && _.get(match_info, 'msc.S18.away') == 0}">
          <div class="text-c">
            {{$root.$t('common.shots_on_goal')}}
            <!-- 射正球门 -->
          </div>
          <div class="chart-bar">
            <!-- S18 射正次数比分 -->
            <span class="text-orange">{{_.get(match_info, 'msc.S18.home')}}</span>
            <div class="bar-progress relative-position">
              <div
                class="progress-content"
                :style="{'width': `${_.get(match_info, 'msc.S18.percentage')}%`}"
              ></div>
            </div>
            <span class="text-blue">{{_.get(match_info, 'msc.S18.away')}}</span>
          </div>
        </div>
        <div class="wide_goal" :class="{'line_num_zero': _.get(match_info, 'msc.S17.home') == 0 && _.get(match_info, 'msc.S17.away') == 0}">
          <div class="text-c">
            {{$root.$t('common.shot_wide_goal')}}
            <!-- 射偏球门 -->
          </div>
          <div class="chart-bar">
            <!-- S17 射偏次数比分 -->
            <span class="text-orange">{{_.get(match_info, 'msc.S17.home')}}</span>
            <div class="bar-progress relative-position">
              <div
                class="progress-content"
                :style="{'width': `${_.get(match_info, 'msc.S17.percentage')}%`}"
              ></div>
            </div>
            <span class="text-blue">{{_.get(match_info, 'msc.S17.away')}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    // 赛事比分数据
    match_info: Object,
  },
  computed: {
    ...mapGetters({
      get_right_zoom: "get_right_zoom",
    }),
  },
  watch: {
    match_info: {
      handler(res, old) {
        // 默认比分
        let default_score = {
          home: "0",
          away: "0",
          percentage: 50,
        };
        // 射偏 射正 进攻 危险进攻 球权
        let arr = ["S17", "S18", "S104", "S8", "S105"];
        arr.map((item) => {
          if (!_.get(res.msc, `${[item]}`)) {
            res.msc[item] = default_score;
          }
        });

        let msc = res.msc;
        for (var k in msc) {
          let _home = _.get(res.msc, `${[k]}.home`);
          let _away = _.get(res.msc, `${[k]}.away`);
          if (["S17", "S18"].includes(k)) {
            //射正球门、射骗球门
            if (_home == "0" && _away == "0") {
              res.msc[k].percentage = 50;
            } else {
              let home_score = parseInt(_home);
              let away_score = parseInt(_away);
              res.msc[k].percentage =
                (home_score / (home_score + away_score)).toFixed(2) * 100;
            }
          } else if (["S104", "S8", "S105"].includes(k)) {
            //进攻、危险进球、球权
            if (_home == "0" && _away == "0") {
              res.msc[k].percentage = 50;
            } else {
              let home_score = parseInt(_home);
              let away_score = parseInt(_away);
              res.msc[k].percentage =
                (away_score / (home_score + away_score)).toFixed(2) * 100;
            }
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>


<style lang="scss" scoped>
.wrap-score {
  padding: 30px 30px;
  color: #99a3b1;
  .wrap-chart {
    display: flex;
    flex: 1;
    flex-flow: column;
    align-items: center;
    .goal {
      display: flex;
      width: 100%;
    }
    .knob,
    .knob2 {
      margin: 0 6px;
    }
    .chart-round {
      display: flex;
      align-items: center;
      margin-bottom: 7px;
      .text-blue, .text-orange {
        font-size: 14px;
        font-weight: 700;
      }
    }
    .chart-bar {
      display: flex;
      align-items: center;
      margin-bottom: 7px;
      width: 100%;
      height: 23px;
      .bar-progress {
        margin: 0 6px;
        width: 100%;
        height: 6px;
        background: var(--qq--chat-bg-blue-1);
        border-radius: 5px;
        .progress-content {
          position: absolute;
          top: 0;
          left: 0;
          height: 6px;
          background: var(--qq--chat-bg-orange-1);
          border-radius: 5px 0 0 5px;
        }
      }
    }
    .text-c {
      text-align: center;
    }
  }

  ::v-deep .text-orange {
    color: var(--qq--chat-text-orange-1) !important;
  }
  ::v-deep .text-blue {
    color: var(--qq--chat-text-blue-1) !important;
  }
}
.char-round {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 30px;
}

.wrap-chart.goal {
  margin-right: 20px;
}
.on_goal,
.wide_goal {
  flex: 1;
}
.on_goal {
  margin-right: 50px;
}

/* 比分图表 */
[class*=theme0] {
  .num_zero {
    span.text-blue,
    span.text-orange {
      color: var(--qq--num-zero-text-color) !important;
    }
    ::v-deep {
      .text-blue,
      .text-orange {
        color: var(--qq--analysis-bg-color-10) !important;
      }
    }
  }
  .goal {
    .line_num_zero {
      .text-orange,
      .text-blue {
        color: var(--qq--num-zero-text-color) !important;
      }
      .bar-progress,
      .progress-content {
        background: var(--qq--analysis-bg-color-10) !important;
      }
    }
  }
}
</style>