<!--
 * @
 * @Author: Yellow
 * @Description: 冰球统计面板
 * @Date: 2020-09-17 09:40:28
-->
<template>
    <div class="hockey_chart">
      <div class="wrap-up">
        <div class="round-item">
          <div class="round">
            <span class="text-orange">{{chart_left.home}}</span>
            <!-- v-model="match_info.msc.S4011.percentage" -->
            <q-knob
              readonly
              v-model="chart_left.percentage"
              :thickness="0.3"
              color="blue"
              track-color="orange"
              class="round-chart"
            />
            <span class="text-blue">{{chart_left.away}}</span>
          </div>
          <!-- 大罚 ：冲球数 -->
          <div class="text-c"> {{is_hockey?i18n_t('common.big_penalty'):i18n_t('common.rushing_num')}}</div>
        </div>

        <div class="round-item">
          <div class="round">
            <span class="text-orange">{{chart_center.home}}</span>
            <!-- v-model="match_info.msc.S4011.percentage" -->
            <q-knob
              readonly
              v-model="chart_center.percentage"
              :thickness="0.3"
              color="blue"
              track-color="orange"
              class="round-chart"
            />
            <span class="text-blue">{{chart_center.away}}</span>
          </div>
          <!-- 射门 -->
          <div class="text-c"> {{ i18n_t('common.shot_num')}}</div>
        </div>

        <div class="round-item">
          <div class="round">
            <span class="text-orange">{{chart_right.home}}</span>
            <!-- v-model="match_info.msc.S4011.percentage" -->
            <q-knob
              readonly
              v-model="chart_right.percentage"
              :thickness="0.3"
              color="blue"
              track-color="orange"
              class="round-chart"
            />
            <span class="text-blue">{{chart_right.away}}</span>
          </div>
          <!-- 小罚：进攻数 -->
          <div class="text-c"> {{is_hockey?i18n_t('common.micro_penalty'):i18n_t('common.offense_num')}}</div>
        </div>
      </div>
      <!-- 达阵比分 -->
      <div class="wrap-down" v-if="!is_hockey">
        <!-- 达阵 -->
        <div class="text-c"> {{ i18n_t('common.touchdown')}}</div>
        <div class="chart-bar">
          <span class="text-orange">{{lodash.get(match_info, 'msc.S6014.home')||0}}</span>
          <div class="bar-progress relative-position">
            <div
              class="progress-content"
              :style="{'width': `${lodash.get(match_info, 'msc.S6014.percentage')||50}%`}"
            ></div>
          </div>
          <span class="text-blue">{{lodash.get(match_info, 'msc.S6014.away')||0}}</span>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        //大罚 ：冲球数
        chart_left: {
          home: 0,
          away: 0,
          percentage: 50//百分比
        },
        //射门
        chart_center: {
          home: 0,
          away: 0,
          percentage: 50
        },
        //小罚：进攻数
        chart_right: {
          home: 0,
          away: 0,
          percentage: 50
        },
        is_hockey: true//是否冰球
      }
    },
    props: {
			match_info: Object,
    },
    watch:{
      match_info:{
        handler(res){
          /**
           * @description 格式化msc数据
           * msc: ["S1|48:52"] => msc: {S1:{home: 48,away: 52}}
           */

          let msc = res.msc;
          for (var k in msc) {
            if (k == 'S6014' && msc.S6014) {
              //美足达阵
              if (res.msc.S6014.home == "0" && res.msc.S6014.away == "0") {
                res.msc.S6014.percentage = 50;
              } else {
                let home_score = parseInt(res.msc[k].home);
                let away_score = parseInt(res.msc[k].away);
                res.msc[k].percentage =
                  (home_score / (home_score + away_score)).toFixed(2) * 100;
              }
            } else {
              if (lodash.get(res.msc, `${[k]}.home`) == "0" && lodash.get(res.msc, `${[k]}.away`) == "0") {
                res.msc[k].percentage = 50;
              } else {
                let home_score = parseInt(lodash.get(res.msc, `${[k]}.home`));
                let away_score = parseInt(lodash.get(res.msc, `${[k]}.away`));
                res.msc[k].percentage =
                  (away_score / (home_score + away_score)).toFixed(2) * 100;
              }
            }
          }

          if(res.csid == '4'){//冰球
            this.is_hockey = true
            lodash.get(res, 'msc.S4011') && (this.chart_left = res.msc.S4011)//大罚比分
            lodash.get(res, 'msc.S4013') && (this.chart_center = res.msc.S4013)//射门比分
            lodash.get(res, 'msc.S4012') && (this.chart_right = res.msc.S4012)//小罚比分
          }else{//美足
            this.is_hockey = false
            lodash.get(res, 'msc.S6011') && (this.chart_left = res.msc.S6011)//冲球数比分
            lodash.get(res, 'msc.S6012') && (this.chart_center = res.msc.S6012)//射门比分
            lodash.get(res, 'msc.S104') && (this.chart_right = res.msc.S104)//进攻比分
          }
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
.hockey_chart {
  padding: 30px 50px;

  /*************** 饼图 *************** -S*/
  .wrap-up {
    display: flex;
    .round-item {
      flex: 1;
      text-align: center;
      .round {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        .round-chart {
          margin: 0 10px;
        }
      }
    }
  }
  /*************** 饼图 *************** -E*/

  /*************** 条形图 *************** -S*/
  .wrap-down {
    margin-top: 30px;
    text-align: center;
    .chart-bar {
      display: flex;
      align-items: center;
      width: 100%;
      height: 23px;
      .bar-progress {
        margin: 0 6px;
        width: 100%;
        height: 6px;
        background: #546bec;
        border-radius: 5px;
        .progress-content {
          position: absolute;
          top: 0;
          left: 0;
          height: 6px;
          background: var(--qq--yb-text-color1);
          border-radius: 5px 0 0 5px;
        }
      }
    }
  }
  /*************** 条形图 *************** -E*/
}
:deep(.text-orange) {
  color: var(--qq--yb-text-color1) !important;
}
:deep(.text-blue) {
  color: #546bec !important;
}
</style>
