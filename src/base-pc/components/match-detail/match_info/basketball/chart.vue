<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 篮球统计面板
-->
<template>
  <div class="chart basketball-chart">
    <div class="team-info">
      <div class="team-n team-home">
        <span class="dot dot-h"></span>
        <span>{{ lodash.get(match_info, "mhn") }}</span>
      </div>
      <div class="team-n team-away">
        <span>{{ lodash.get(match_info, "man") }}</span>
        <span class="dot dot-a"></span>
      </div>
    </div>
    <div class="wrap-score basketball-score">
      <!-- 2分 -->
      <div class="score-item score-num-wrap first-item">
        <!-- 主队2分次数 -->
        <div class="score-num match-home">
          {{ lodash.get(match_info, "msc_obj.S107.home") || 0 }}
        </div>
        <div class="score-tips">2 {{ i18n_t("common.score") }}</div>
        <!-- 客队2分次数 -->
        <div class="score-num match-away">
          {{ lodash.get(match_info, "msc_obj.S107.away") || 0 }}
        </div>
      </div>
      <!-- 2分条 -->
      <div class="score-item  stripe-item">
        <div class="stripe-left">
          <div class="stripe" :style="{width: cale_score(lodash.get(match_info, 'msc_obj.S107.home') || 0)}"></div>
        </div>
        <div class="stripe-right">
          <div class="stripe"  :style="{width: cale_score(lodash.get(match_info, 'msc_obj.S107.away') || 0)}"></div>
        </div>
      </div>

      <!-- 3分 -->
      <div class="score-item score-num-wrap">
        <!-- 主队3分次数 -->
        <div class="score-num match-home" >
          {{ lodash.get(match_info, "msc_obj.S108.home") || 0 }}
        </div>
        <div class="score-tips">3 {{ i18n_t("common.score") }}</div>
        <!-- 客队3分次数 -->
        <div class="score-num match-away">
          {{ lodash.get(match_info, "msc_obj.S108.away") || 0 }}
        </div>
      </div>
      <!-- 3分条 -->
      <div class="score-item stripe-item">
        <div class="stripe-left">
          <div class="stripe" :style="{width: cale_score(lodash.get(match_info, 'msc_obj.S108.home') || 0)}"></div>
        </div>
        <div class="stripe-right">
          <div class="stripe" :style="{width: cale_score(lodash.get(match_info, 'msc_obj.S108.away') || 0)}"></div>
        </div>
      </div>
      <!-- 犯规 -->
      <div class="score-item score-num-wrap">
        <div class="score-num match-home">{{ lodash.get(match_info, "msc_obj.S106.home", 0) }}</div>
        <div class="score-tips">{{ i18n_t("common.foul") }}</div>
        <div class="score-num match-away">{{ lodash.get(match_info, "msc_obj.S106.away", 0) }}</div>
      </div>
      <!-- 犯规条 -->
      <div class="score-item stripe-item">
        <div class="stripe-left">
          <div class="stripe" :style="{width: cale_score(lodash.get(match_info, 'msc_obj.S106.home', 0) || 0)}"></div>
        </div>
        <div class="stripe-right">
          <div class="stripe" :style="{width: cale_score(lodash.get(match_info, 'msc_obj.S106.away') || 0)}"></div>
        </div>
      </div>
      <div class="score-item score-penalty">
        <div class="status-num match-home">
          <!-- 主队罚球得分率 -->
          <span class="scale">{{ lodash.get(match_info, "msc_obj.S111.home") || "0" }}%</span>
          <!-- 罚球得分次数 -->
          <span class="degree">{{ lodash.get(match_info, "msc_obj.S110.home") || "0"  }}</span>
        </div>
        <div class="status-num match-away">
          <!-- 客队队罚球得分次数 -->
          <span class="degree">{{ lodash.get(match_info, "msc_obj.S110.away") || "0"  }}</span>
          <!-- 客队罚球得分率 -->
          <span class="scale">{{ lodash.get(match_info, "msc_obj.S111.away") || "0" }}%</span
          >
        </div>
      </div>
      <div class="score-item  score-more stripe-item">
        <!-- 主队暂停 -->
        <div class="home-stop stop">
          <span class="dot dot-h" v-for="item in  5"  :class="{'default': stop_obj.home>=item}"   :key="item"></span>
        </div>
        <!-- 主队罚球率 -->
        <div class="stripe-left penalty">
          <div class="stripe" :style="{width: (lodash.get(match_info, 'msc_obj.S111.home') || '5')+ '%'}"></div>
        </div>
         <!-- 客队罚球率 -->
        <div class="stripe-right penalty">
          <div class="stripe" :style="{width: (lodash.get(match_info, 'msc_obj.S111.away') || '5')+ '%'}"></div>
        </div>
         <!-- 客队暂停 -->
        <div class="away-stop stop">
          <span class="dot dot-a "  v-for="item in 5"  :class="{'default': stop_obj.away>=item}" :key="item"></span>
        </div>
      </div>
      <div class="score-item last-item">
        <!-- 主队暂停 -->
        <div class="status-tips flex-3"> {{ i18n_t("basketball.pause") }} </div>
        <!-- 罚球 -->
        <div class="status-tips flex-4"> {{ i18n_t("basketball.penalty") }} </div>
         <!-- 客队暂停 -->
        <div class="status-tips flex-3"> &nbsp;{{ i18n_t("basketball.pause") }} </div>
      </div>
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
    stop_obj: {
        home: 0,
        away: 0,
      }, //暂停数
      foul: {}, //犯规数
      default_score: {
        //初始化比分
        home: "0",
        away: "0",
      },
    };
  },
  methods:{
      /**
    * @Description:计算比分百分比
    * @return {Undefined} Undefined
    */
    cale_score(value1){
      value1 =  Number(value1)
         if(value1>0){
           let percentage =value1*2
           if(percentage < 100){
              return percentage+ '%'
           }else{
             return '100%'
           }
         }else{
           return '1%'
         }
    }
  },
  watch: {
    match_info: {
      handler(res, old) {
        // 罚球得分率
        if (lodash.get(res, "msc_obj.S111")) {
          res.msc_obj.S111.home = parseInt(res.msc_obj.S111.home);
          res.msc_obj.S111.away = parseInt(res.msc_obj.S111.away);
        }
        //数据出错
        let data_err =
          res.mmp == undefined ||
          res.mmp == "0" ||
          !Object.keys(res.msc).length;
        if (data_err) {
          this.foul = this.default_score;
          this.home_stop = [];
          this.away_stop = [];
          return false;
        }
        //犯规次数、暂停数
        let dict = {
          13: {
            foul: "S10601",
            stop: "S10901",
          }, //第一节
          301: {
            foul: "S10602",
            stop: "S10902",
          }, //第一节结束
          14: {
            foul: "S10602",
            stop: "S10902",
          }, //第二节
          302: {
            foul: "S10603",
            stop: "S10903",
          }, //第二节结束
          15: {
            foul: "S10603",
            stop: "S10903",
          }, //第三节
          303: {
            foul: "S10604",
            stop: "S10904",
          }, //第三节结束
          16: {
            foul: "S10604",
            stop: "S10904",
          }, //第四节
          100: {
            foul: "S10604",
            stop: "S10904",
          }, //第四节结束
          32: {
            foul: "S10605",
            stop: "S10906",
          }, //等待加时
          40: {
            foul: "S10605",
            stop: "S10906",
          }, //加时赛
          110: {
            foul: "S10605",
            stop: "S10906",
          }, //加时赛结束
          1: {
            foul: "S10606",
            stop: "S109",
          }, //上半场
          2: {
            foul: "S10607",
            stop: "S109",
          }, //下半场
          31: {
            foul: "S10606",
            stop: "S109",
          }, //中场休息
        };
        this.foul =
          lodash.get(res, `msc_obj.${lodash.get(dict[res.mmp], "foul")}`) ||
          this.default_score;
        if (lodash.get(res, `msc_obj.${ lodash.get(dict[res.mmp],'stop')}`)) {
          let stop_num = lodash.get(res, `msc_obj.${ lodash.get(dict[res.mmp],'stop')}`) || {};
          this.stop_obj ={
                  home: parseInt(stop_num.home),
                  away: parseInt(stop_num.away)
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
.chart {
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  padding-bottom: 30px;
  .score-num {
    font-weight: 500;
  }
  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    &.dot-h {
      background-color: var(--qq--chat-bg-orange-1);
    }
    &.dot-a {
      background-color: var(--qq--chat-bg-blue-1);
    }
  }
  .team-info {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 12px;
    height: 36px;
    .team-n {
      display: flex;
      align-items: center;
      .dot-h {
        margin-right: 5px;
      }
      .dot-a {
        margin-left: 5px;
      }
    }
  }
  .wrap-score {
    .score-item {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 55px;
      .flex-3 {
        flex: 0.2;
      }
      .flex-4 {
        flex: 0.6;
      }
      &.score-num-wrap {
        height: 20px;
        justify-content: flex-start;
        .match-home {
          width: 47%;
          padding-left: 20px;
        }
        div {
          &:last-child {
            margin-left: auto;
            margin-right: 20px;
          }
        }
      }
      &.first-item {
        margin-top: 20px;
      }
      &.stripe-item {
        padding-top: 10px;
        padding-bottom: 10px;
        .stripe-left,
        .stripe-right {
          width: 100%;
          height: 8px;
          position: relative;
          .stripe {
            height: 8px;
          }
        }
        .stripe-left {
          margin-right: 1px;
          border-radius: 2px 0px 0px 2px;
          .stripe {
            position: absolute;
            right: 0;
            background-color: var(--qq--chat-bg-orange-1);
            border-radius: 2px 0px 0px 2px;
          }
        }
        .stripe-right {
          margin-left: 1px;
          border-radius: 0px 2px 2px 0px;
          .stripe {
            position: absolute;
            left: 0;
            background-color: var(--qq--chat-bg-blue-1);
            border-radius: 0px 2px 2px 0px;
          }
        }
      }
      &.score-more {
        justify-content: flex-start;
        .stripe-left,
        .stripe-right {
          width: 45%;
        }
        .stop {
          display: flex;
          justify-content: center;
          .dot {
            margin-left: 3px;
          }
        }
        .home-stop,
        .away-stop {
          width: 27.5%;
          max-width: 27.5%;
        }
        .away-stop {
          flex-direction: row-reverse;
        }
      }
      &.last-item {
        text-align: center;
      }
      &.score-penalty {
        height: 10px;
        margin-top: 25px;
        .status-num {
          height: 100%;
          flex: 1;
          font-size: 14px;
        }
        .match-home {
          text-align: right;
          margin-right: 17px;
          .scale {
            padding-right: 10px;
          }
          .degree {
            color: #ff7100;
            font-weight: 500;
          }
        }
        .match-away {
          text-align: left;
          margin-left: 17px;
          .scale {
            padding-left: 10px;
          }
          .degree {
            color: #556bec;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
