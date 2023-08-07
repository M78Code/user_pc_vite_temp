<template>
  <div class="chat-wrap">
    <div class="item"
      :class="{ 'num_zero': get_num(score.round1.home, score.round1.away, 0) == 0 && get_num(score.round1.home, score.round1.away, 1) == 0 }">
      <div class="round">
        <!-- score.round1.home -->
        <span class="text-blue chat-label">{{ match.csid == 1 ? score.round1.home :
          get_num(score.round1.home, score.round1.away, 0) + '%' }}</span>
        <q-knob readonly show-value size="120px" v-model="score.round1.percentage" :thickness="0.16" color="orange"
          track-color="blue" class="knob">
          <span class="knob-label">{{ chatLabel.round1 }}</span>
        </q-knob>
        <!-- score.round1.away -->
        <span class="text-orange chat-label">{{ match.csid == 1 ? score.round1.away :
          get_num(score.round1.home, score.round1.away, 1) + '%' }}</span>
      </div>
      <div class="line">
        <div class="item-line" :class="{ 'line_num_zero': score.line1.home == 0 && score.line1.away == 0 }">
          <div class="knob-label">{{ chatLabel.line1 }}</div>
          <div class="line-wrap">
            <span class="chat-label">{{ score.line1.home }}</span>
            <div class="bar-progress relative-position">
              <div class="progress-content" :style="{ 'width': `${score.line1.percentage}%` }"></div>
            </div>
            <span class="chat-label">{{ score.line1.away }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="item"
      :class="{ 'num_zero': get_num(score.round2.home, score.round2.away, 0) == 0 && get_num(score.round2.home, score.round2.away, 1) == 0 }">
      <div class="round">
        <!-- score.round2.home -->
        <span class="text-blue chat-label">{{ get_num(score.round2.home, score.round2.away, 0) }}%</span>
        <q-knob readonly show-value size="120px" v-model="score.round2.percentage" :thickness="0.16" color="orange"
          track-color="blue" class="knob">
          <span class="knob-label">{{ chatLabel.round2 }}</span>
        </q-knob>
        <!-- score.round2.away -->
        <span class="text-orange chat-label">{{ get_num(score.round2.home, score.round2.away, 1) }}%</span>
      </div>
      <div class="line">
        <div class="item-line" :class="{ 'line_num_zero': score.line2.home == 0 && score.line2.away == 0 }">
          <div class="knob-label">{{ chatLabel.line2 }}</div>
          <div class="line-wrap">
            <span class="chat-label">{{ score.line2.home }}</span>
            <div class="bar-progress relative-position">
              <div class="progress-content" :style="{ 'width': `${score.line2.percentage}%` }"></div>
            </div>
            <span class="chat-label">{{ score.line2.away }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="item"
      :class="{ 'num_zero': (match.csid == 1 ? score.round3.home : get_num(score.round3.home, score.round3.away, 0)) == 0 && (match.csid == 1 ? score.round3.away : get_num(score.round3.home, score.round3.away, 1)) == 0 }">
      <div class="round">
        <span class="text-blue chat-label">{{ match.csid == 1 ? score.round3.home : parseInt(score.round3.home) + '%' }}</span>
        <q-knob readonly show-value size="120px" v-model="score.round3.percentage" :thickness="0.16" color="orange"
          track-color="blue" class="knob">
          <span class="knob-label">{{ chatLabel.round3 }}</span>
        </q-knob>
        <span class="text-orange chat-label">{{ match.csid == 1 ? score.round3.away : parseInt(score.round3.away) + '%' }}</span>
      </div>
      <div class="line">
        <div class="item-line" :class="{ 'line_num_zero': score.line3.home == 0 && score.line3.away == 0 }">
          <div class="knob-label">{{ chatLabel.line3 }}</div>
          <div class="line-wrap">
            <span class="chat-label">{{ score.line3.home }}</span>
            <div class="bar-progress relative-position">
              <div class="progress-content" :style="{ 'width': `${score.line3.percentage}%` }"></div>
            </div>
            <span class="chat-label">{{ score.line3.away }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, defineProps } from 'vue';
import { useRegistPropsHelper, useProps } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)

const props = defineProps({ ...useProps });

const dict = ref({
  //全场比分，红牌，黄牌，角球，危险进攻，球权，进攻，射门，射正球门，射骗球门
  soccer: ['S1', 'S11', 'S12', 'S5', 'S8', 'S105', 'S104', 'S1101', "S17", "S18"],
  //犯规，暂停，三分命中率，投篮命中率，罚球命中率，三分球得分，两分球得分，罚球得分
  basketball: ['S106', 'S109', 'S12345', 'S12346', 'S111', 'S108', 'S107', 'S110']
})
// 得分类型
const chatLabel = ref({});

const score = computed(() => {
  let scoreData = {}
  // 足球
  if (this.match.csid == "1") {
    scoreData = {
      round1: this.match.msc.S8,
      round2: this.match.msc.S105,
      round3: this.match.msc.S104,
      line1: this.match.msc.S1101,
      line2: this.match.msc.S18,
      line3: this.match.msc.S17,
    }
    this.chatLabel = {
      round1: this.$t("analysis.dangerous_attack"), // 危险进攻
      round2: this.$t("analysis.possession_percentage"), // 控球率
      round3: this.$t("analysis.offense"), // 进攻
      line1: this.$t("analysis.shot"), // 射门
      line2: this.$t("analysis.shot_on"), // 射正
      line3: this.$t("analysis.shot_aside"), // 射偏
    }
  } else {
    // 篮球
    scoreData = {
      round1: this.match.msc.S12345,
      round2: this.match.msc.S12346,
      round3: this.match.msc.S111,
      line1: this.match.msc.S108,
      line2: this.match.msc.S107,
      line3: this.match.msc.S110,
    }
    this.chatLabel = {
      round1: this.$t("analysis.three_point_percentage"), // 三分球命中率
      round2: this.$t("analysis.field_goal_percentage"), // 投篮命中率
      round3: this.$t("analysis.free_throw_percentage"), // 罚球命中率
      line1: this.$t("analysis.three_point"), // 三分球得分
      line2: this.$t("analysis.two_point"), //两分球得分
      line3: this.$t("analysis.free_throw"), // 罚球得分
    }
  }
  // 修复---在详情页停留一段时间直至比分有变化，然后进入赛事分析，图表颜色的百分比与实际比分不符
  scoreData.line1.percentage = parseInt((parseInt(scoreData.line1.home) / (parseInt(scoreData.line1.home) + parseInt(scoreData.line1.away)).toFixed(2)) * 100);
  scoreData.line2.percentage = parseInt((parseInt(scoreData.line2.home) / (parseInt(scoreData.line2.home) + parseInt(scoreData.line2.away)).toFixed(2)) * 100);
  scoreData.line3.percentage = parseInt((parseInt(scoreData.line3.home) / (parseInt(scoreData.line3.home) + parseInt(scoreData.line3.away)).toFixed(2)) * 100);
  return scoreData
})

// 获取两个数的百分比,flg数为基准0,1
const get_num = (a, b, flg) => {
  let res = 0;
  let n = 0;
  try {
    let a_ = a * 1;
    let b_ = b * 1;
    n = Math.ceil(100 * a_ / (a_ + b_));
  } catch (error) { }
  if (Number.isNaN(res)) {
    res = 0;
  } else {
    if (flg) {
      res = 100 - n;
    } else {
      res = n
    }
  }
  if (Number.isNaN(res)) {
    res = 0;
  }
  return res;
}

onUnmounted(() => {
  chatLabel.value = null;
})

</script>