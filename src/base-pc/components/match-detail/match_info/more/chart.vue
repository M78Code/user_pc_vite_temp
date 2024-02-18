<!--
 * @
 * @Author: Yellow
 * @Description: 网羽斯乒统计面板
 * @Date: 2020-07-18 10:33:46
-->

<template>
  <!-- v-if="lodash.get(match_info, 'csid') != '8'" -->
  <div class="more-stage">
    <div class="score-item" :class="{'num_zero': (lodash.get(stage_data,'num_one.home') || 0) == 0}">
      <div class="score-num match-home">{{stage_data.num_one.home || 0}}</div>
      <div class="score-tips">{{stage_txt.chart_one}}</div>
    </div>

    <div class="score-item" :class="{'num_zero': (lodash.get(stage_data,'num_two.home') || 0) == 0}">
      <div class="score-num match-home">
        <!-- 斯诺克 -->
        <span v-if="lodash.get(match_info, 'csid') == '7'">{{snk_S1190.home}}/</span>
        <span>{{stage_data.num_two.home || 0}}</span>
        <!-- 羽毛球 -->
        <span v-if="lodash.get(match_info, 'csid') == '10'">%</span>
      </div>
      <div class="score-tips">
        {{stage_txt.chart_two}}
        <br />
        {{stage_txt.chart_two_point}}
      </div>
    </div>
    <!-- 网球 羽毛球 -->
    <div class="score-item common-item" v-if="['5','10'].includes(lodash.get(match_info, 'csid'))"
      :class="{'two_num_zero': (lodash.get(stage_data,'num_center.home') || 0) == 0 || (lodash.get(stage_data,'num_center.away') || 0) == 0}">
      <div class="common">
        <div class="score-num match-home" :class="{'get_gray': (lodash.get(stage_data,'num_center.home') || 0) == 0}">{{stage_data.num_center.home || 0}}%</div>
        <div class="score-num match-away" :class="{'get_gray': (lodash.get(stage_data,'num_center.away') || 0) == 0}">{{stage_data.num_center.away || 0}}%</div>
      </div>
      <div class="score-tips">{{stage_txt.chart_center}}</div>
    </div>

    <div class="score-item" :class="{'num_zero': (lodash.get(stage_data,'num_two.away') || 0) == 0}">
      <div class="score-num match-away">
        <!-- 乒乓球 -->
        <span v-if="lodash.get(match_info, 'csid') == '7'">{{snk_S1190.away}}/</span>
        <span>{{stage_data.num_two.away || 0}}</span>
        <!-- 羽毛球 -->
        <span v-if="lodash.get(match_info, 'csid') == '10'">%</span>
      </div>
      <div class="score-tips">
        {{stage_txt.chart_two}}
        <br />
        {{stage_txt.chart_two_point}}
      </div>
    </div>

    <div class="score-item" :class="{'num_zero': (lodash.get(stage_data,'num_one.away') || 0) == 0}">
      <div class="score-num match-away">{{stage_data.num_one.away || 0}}</div>
      <div class="score-tips">{{stage_txt.chart_one}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match_info: Object,
  },
  data() {
    return {
      stage_data: {//网羽斯乒得分
        num_one: {//第一个条形图
          home: "",
          away: "",
        },
        num_two: {//第二个条形图
          home: "",
          away: "",
        },
        num_center: {//中间条形图（斯诺克、排球没有中间条形图）
          home: "",
          away: "",
        },
      },
      stage_txt: { //条形图展示名称
        chart_one: "",//第一个条形图
        chart_two: "",//第二个条形图
        chart_center: "",//中间条形图
        chart_two_point: "",//斯诺克当二行文本
      },
      default: {//默认比分
        home: "",
        away: "",
      },
      snk_S1190: {//斯诺克当前局单杆最高分
        home: "0",
        away: "0",
      },
    };
  },
  watch: {
    match_info: {
      handler(res, old) {
        if (res.csid == "5") {
          //网球
          this.stage_txt.chart_one = i18n_t("common.ace"); //"发球得分";
          this.stage_txt.chart_two = i18n_t("common.fault"); //"发球失误";
          this.stage_txt.chart_center = i18n_t("common.break_point_success"); //"破发成功率";
          this.stage_txt.chart_two_point = "";//(当前局/总)

          this.stage_data.num_one = res.msc.S4 || this.default;
          this.stage_data.num_two = res.msc.S202 || this.default;
          this.stage_data.num_center = res.msc.S114 || this.default;
        } else if (res.csid == "7") {
          //斯诺克
          this.stage_txt.chart_one = i18n_t("common.foul"); //"犯规";
          this.stage_txt.chart_two = i18n_t("common.max_bureau"); //"单杆最高";
          this.stage_txt.chart_two_point = i18n_t("common.current_total"); //"（当前局/总）";
          this.stage_txt.chart_center = "";

          this.stage_data.num_one = res.msc.S118 || this.default;
          this.stage_data.num_two = res.msc.S119 || this.default;
          res.msc.S1190 && (this.snk_S1190 = res.msc.S1190);
        } else if (res.csid == "9") {
          //排球
          this.stage_txt.chart_one = i18n_t("common.ace");//发球得分
          this.stage_txt.chart_two = i18n_t("common.sigle_fault");//发球失误
          this.stage_txt.chart_center = "";
          this.stage_txt.chart_two_point = "";//(当前局/总)

          this.stage_data.num_one = res.msc.S4 || this.default;
          this.stage_data.num_two = res.msc.S113 || this.default;
        } else if (res.csid == "10") {
          //羽毛球
          this.stage_txt.chart_one = i18n_t("common.score_"); //"得分";
          this.stage_txt.chart_two = i18n_t("common.receiving_point_score"); //"接收点得分";
          this.stage_txt.chart_center = i18n_t("common.ace"); //"发球得分";
          this.stage_txt.chart_two_point = "";//(当前局/总)

          this.stage_data.num_one = res.msc.S115 || this.default;
          this.stage_data.num_two = res.msc.S116 || this.default;
          this.stage_data.num_center = res.msc.S117 || this.default;
        } else if(res.csid == "4"){
          //冰球
          this.stage_txt.chart_one = i18n_t("common.micro_penalty"); //"小罚";
          this.stage_txt.chart_two = i18n_t("common.big_penalty"); //"大罚";
          this.stage_txt.chart_two_point = ""; //"
          this.stage_txt.chart_center = "";

          this.stage_data.num_one = res.msc.S4012 || this.default;//小罚比分
          this.stage_data.num_two = res.msc.S4011 || this.default;//大罚比分
        } else if(res.csid == "6"){
          //美足
          this.stage_txt.chart_one = i18n_t("common.shot_num"); //"射门";
          this.stage_txt.chart_two = i18n_t("common.touchdown"); //"达阵";
          this.stage_txt.chart_two_point = ""; //"
          this.stage_txt.chart_center = "";

          this.stage_data.num_one = res.msc.S6012 || this.default;//射门比分
          this.stage_data.num_two = res.msc.S6014 || this.default;//达阵比分
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.more-stage {
  display: flex;
  padding: 30px 0 48px 0;
  align-items: center;
  .score-item {
    flex: 1;
    display: flex;
    flex-flow: column;
    align-items: center;
    text-align: center;
    .score-num {
      text-align: center;
      width: 60%;
    }
    .score-tips {
      height: 18px;
      line-height: 18px;
      margin-top: 10px;
      color: var(--qq--list-replay-text-color);
    }
    .match-home {
      padding: 6px 0;
      color: var(--q-gb-t-c-17);
      border-bottom: 6px solid var(--q-gb-t-c-17);
    }
    .match-away {
      padding: 6px 0;
      color: var(--q-analysis-color-2);
      border-bottom: 6px solid var(--q-analysis-color-2);
    }
  }
  .common-item {
    flex: 1.5;
    .common {
      display: flex;
      width: 100%;
      justify-content: center;
      .score-num {
        width: 40%;
        &:first-child {
          margin-right: 20px;
        }
      }
    }
  }
}
.theme01 {
  .num_zero {
    .score-num,
    .get_gray {
      color: #2d2d2d !important;
    }
    .match-home,
    .match-away {
      border-bottom: 6px solid var(--q-gb-bd-c-9) !important;
    }
  }
  .two_num_zero .get_gray {
    color: #2d2d2d !important;
    border-bottom: 6px solid var(--q-gb-bd-c-9) !important;
  }
}
.theme02 {
  .num_zero {
    .score-num,
    .get_gray {
      color: #b8b8b8 !important;
    }
    .match-home,
    .match-away {
      border-bottom: 6px solid var(--q-gb-bd-c-10) !important;
    }
  }
  .two_num_zero .get_gray {
    color: #b8b8b8 !important;
    border-bottom: 6px solid var(--q-gb-bd-c-10) !important;
  }
}
</style>
