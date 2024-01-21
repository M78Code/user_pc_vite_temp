<!--
 * @Date: 2021-09-19 22:33:15
 * @FilePath: /user-pc1/src/public/components/analysis/template/chat.vue
 * @Description: 足篮比分图表
 * @Author:
-->
<template>
  <div class="chat-wrap">
    <div class="item" :class="{'num_zero': get_num(score.round1.home,score.round1.away,0) == 0 && get_num(score.round1.home,score.round1.away,1) == 0}">
      <div class="round" :class="{'margin30': $route.name === 'analysis_header'}">
        <!-- score.round1.home -->
        <span class="text-blue chat-label">{{match.csid == 1 ? score.round1.home : get_num(score.round1.home,score.round1.away,0)}}%</span>
        <template v-if="$route.name === 'analysis_header'">
          <q-knob
            readonly
            show-value
            size="120px"
            v-model="score.round1.percentage"
            :thickness="0.16"
            color="amber-7"
            :track-color="score.round1.percentage==0?'grey-3':'indigo-12'"
            class="knob"
           
          >
          <span class="knob-label">{{chatLabel.round1}}</span>
          </q-knob>
        </template>
        <template v-else>
          <q-knob
            readonly
            v-model="score.round1.percentage"
            :thickness="0.3"
            color="amber-7"
            :track-color="score.round1.percentage==0?'grey-3':'indigo-12'"
            class="knob"
           
          >
          </q-knob>
        </template>
        
        
        <span class="text-orange chat-label">{{match.csid == 1 ? score.round1.away : get_num(score.round1.home,score.round1.away,1)}}%</span>
      </div>
      <div class="text-c knob-label" v-if="$route.name !== 'analysis_header'">
        {{chatLabel.round1}}
        <!-- 进攻 -->
      </div>
      <div class="line">
        <div class="item-line" :class="{'line_num_zero': score.line1.home == 0 && score.line1.away == 0}">
          <div class="knob-label">{{chatLabel.line1}}</div>
          <div class="line-wrap">
            <span class="chat-label">{{score.line1.home}}</span>
            <div class="bar-progress relative-position">
              <div class="progress-content" :style="{'width': `${score.line1.percentage}%`}"></div>
            </div>
            <span class="chat-label">{{score.line1.away}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="item" :class="{'num_zero': get_num(score.round2.home,score.round2.away,0) == 0 && get_num(score.round2.home,score.round2.away,1) == 0}">
      <div class="round" :class="{'margin30': $route.name === 'analysis_header'}">
        <!-- score.round2.home -->
        <span class="text-blue chat-label">{{get_num(score.round2.home,score.round2.away,0)}}%</span>
        <template v-if="$route.name === 'analysis_header'">
          <q-knob
            readonly
            show-value
            size="120px"
            v-model="score.round2.percentage"
            :thickness="0.16"
            color="amber-7"
            :track-color="score.round2.percentage==0?'grey-3':'indigo-12'"
            class="knob"
          >
            <span class="knob-label">{{chatLabel.round2}}</span>
          </q-knob>
        </template>
        <template v-else>
          <q-knob
            readonly
            v-model="score.round2.percentage"
            :thickness="0.3"
            color="amber-7"
            :track-color="score.round2.percentage==0?'grey-3':'indigo-12'"
            class="knob"
          >
          <!-- <span class="knob-label">{{chatLabel.round2}}</span> -->
          </q-knob>
        </template>
        <!-- score.round2.away -->
        <span class="text-orange chat-label">{{get_num(score.round2.home,score.round2.away,1)}}%</span>
      </div>
      <div class="text-c knob-label" v-if="$route.name !== 'analysis_header'">
        {{chatLabel.round2}}
      </div>
      <div class="line">
        <div class="item-line" :class="{'line_num_zero': score.line2.home == 0 && score.line2.away == 0}">
          <div class="knob-label">{{chatLabel.line2}}</div>
          <div class="line-wrap">
            <span class="chat-label">{{score.line2.home}}</span>
            <div class="bar-progress relative-position">
              <div class="progress-content" :style="{'width': `${score.line2.percentage}%`}"></div>
            </div>
            <span class="chat-label">{{score.line2.away}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="item" :class="{'num_zero': (match.csid == 1?score.round3.home:get_num(score.round3.home,score.round3.away,0)) == 0 && (match.csid==1?score.round3.away:get_num(score.round3.home,score.round3.away,1)) == 0}">
      <div class="round" :class="{'margin30': $route.name === 'analysis_header'}">
        <span class="text-blue chat-label">{{match.csid == 1?score.round3.home:parseInt(score.round3.home) + '%'}}</span>
        <template v-if="$route.name === 'analysis_header'">
          <q-knob
            readonly
            show-value
            size="120px"
            v-model="score.round3.percentage"
            :thickness="0.16"
            color="amber-7"
            :track-color="score.round3.percentage==0?'grey-3':'indigo-12'"
            class="knob"
          >
            <span class="knob-label">{{chatLabel.round2}}</span>
          </q-knob>
        </template>
        <template v-else>
          <q-knob
            readonly
            v-model="score.round3.percentage"
            :thickness="0.3"
            color="amber-7"
            :track-color="score.round3.percentage==0?'grey-3':'indigo-12'"
            class="knob"
          >
          </q-knob>
        </template>
        <span class="text-orange chat-label">{{match.csid==1?score.round3.away:parseInt(score.round3.away) + '%'}}</span>
      </div>
      <div class="text-c knob-label" v-if="$route.name !== 'analysis_header'">
        {{chatLabel.round3}}
      </div>
      <div class="line">
        <div class="item-line" :class="{'line_num_zero': score.line3.home == 0 && score.line3.away == 0}">
          <div class="knob-label">{{chatLabel.line3}}</div>
          <div class="line-wrap">
            <span class="chat-label">{{score.line3.home}}</span>
            <div class="bar-progress relative-position">
              <div class="progress-content" :style="{'width': `${score.line3.percentage}%`}"></div>
            </div>
            <span class="chat-label">{{score.line3.away}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // chatData:{
      //   roundleft: 30,
      // },
      dict:{
         //全场比分，红牌，黄牌，角球，危险进攻，球权，进攻，射门，射正球门，射骗球门
        soccer: ['S1','S11','S12','S5','S8','S105','S104','S1101',"S17", "S18"],
        //犯规，暂停，三分命中率，投篮命中率，罚球命中率，三分球得分，两分球得分，罚球得分
        basketball: ['S106','S109','S1088',  'S1235',  'S111',    'S108','S107','S110']
      },
      // 得分类型
      chatLabel: {}
    };
  },
  props:{
    match:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  methods: {
    // 获取两个数的百分比,flg数为基准0,1
    get_num(a,b,flg){
      let res = 0;
      let n = 0;
      try {
        let a_ = a*1;
        let b_ = b*1;
        n = Math.ceil(100*a_/(a_+b_));
      } catch (error) {}
      if(Number.isNaN(res)){
        res = 0;
      } else {
        if(flg){
          res = 100-n;
        } else {
          res = n
        }
      }
      if(Number.isNaN(res)){
        res = 0;
      }
      return res;
    }
  },
  computed:{
 
    score(){
      let scoreData = {}
      // 足球
      if(this.match.csid == "1"){
        scoreData = {
          round1: this.match.msc.S8,
          round2: this.match.msc.S105,
          round3: this.match.msc.S104,
          line1: this.match.msc.S1101,
          line2: this.match.msc.S18,
          line3: this.match.msc.S17,
        }
        this.chatLabel = {
          round1: i18n_t("analysis.dangerous_attack"), // 危险进攻
          round2: i18n_t("analysis.possession_percentage"), // 控球率
          round3: i18n_t("analysis.offense"), // 进攻
          line1: i18n_t("analysis.shot"), // 射门
          line2: i18n_t("analysis.shot_on"), // 射正
          line3: i18n_t("analysis.shot_aside"), // 射偏
        }
      } else {
        // 篮球
        scoreData = {
          round1: this.match.msc.S1088,
          round2: this.match.msc.S1235,
          round3: this.match.msc.S111,
          line1: this.match.msc.S108,
          line2: this.match.msc.S107,
          line3: this.match.msc.S110,
        }
        this.chatLabel = {
          round1: i18n_t("analysis.three_point_percentage"), // 三分球命中率
          round2: i18n_t("analysis.field_goal_percentage"), // 投篮命中率
          round3: i18n_t("analysis.free_throw_percentage"), // 罚球命中率
          line1: i18n_t("analysis.three_point"), // 三分球得分
          line2: i18n_t("analysis.two_point"), //两分球得分
          line3: i18n_t("analysis.free_throw"), // 罚球得分
        }
      }
      // 修复---在详情页停留一段时间直至比分有变化，然后进入赛事分析，图表颜色的百分比与实际比分不符
      scoreData.line1.percentage = parseInt((parseInt(scoreData.line1.home) / (parseInt(scoreData.line1.home) + parseInt(scoreData.line1.away)).toFixed(2)) * 100);
      scoreData.line2.percentage = parseInt((parseInt(scoreData.line2.home) / (parseInt(scoreData.line2.home) + parseInt(scoreData.line2.away)).toFixed(2)) * 100);
      scoreData.line3.percentage = parseInt((parseInt(scoreData.line3.home) / (parseInt(scoreData.line3.home) + parseInt(scoreData.line3.away)).toFixed(2)) * 100);
      return scoreData
    }
  },
  destroyed() {
    this.chatLabel = null;
  }
};
</script>

<style lang="scss" scoped>
.chat-wrap {
  display: flex;
  flex: 1;
  justify-content: space-between;
  .round {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 7px;
    .knob {
      margin: 0 10px;
    }
  }
  .margin30{
    margin: 30px 0;
  }
  .item {
    .text-c {
      margin-bottom: 10px;
    }
  }
  .line {
    display: flex;
    .item-line {
      text-align: center;
      // width: 258px;
      flex: 1;
      .line-wrap {
        display: flex;
        align-items: center;
      }
      .bar-progress {
        position: relative;
        margin: 0 6px;
        width: 100%;
        height: 6px;
        background: linear-gradient(292.16deg, #FF8B00 12.63%, #FFB800 85.7%);

        border-radius: 5px;
        .progress-content {
          position: absolute;
          top: 0;
          left: 0;
          height: 6px;
          background: linear-gradient(296.13deg, #7B98FF 20.35%, #3D64EF 83.54%);

          border-radius: 5px 0 0 5px;
        }
      }
      .chat-label {
        color: #1D1D1D;
      }
    }
    .analysisi-item {
      width: 258px;
    }
  }
  .knob-label {
    font-size: 12px;
    color: #666;
    // padding: 0 10%;
    text-align: center;
  }
  .chat-label {
    font-size: 14px;
    font-weight: 700;
  }
}
:deep() {
  .text-blue {
    color: #179CFF !important;
  }
  .text-orange {
    color: #FF7000 !important;
  }
  .text-light-blue-13 {
    color: #179CFF !important;
  }
}

.num_zero {
  span.text-blue,
  span.text-orange,
  span.text-light-blue-13 {
    // color: var(--qq--league-rank-title-text-color) !important;
    color: #D1D1D1 !important;
  }   //E7EAEE D1D1D1
  :deep() {
    .text-blue {
      color: #D1D1D1 !important;
    }
    .text-orange {
      color: transparent !important;
    }
    .text-light-blue-13 {
      color: #D1D1D1!important;
    }
  }
}
.line {
  .line_num_zero {
    .bar-progress,
    .progress-content {
      background: #D1D1D1 !important
    }
  }
}
</style>
