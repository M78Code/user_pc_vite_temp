<!--
 * @Author: Supermark 
 * @Date: 2021-01-05 20:25
 * @Description: 虚拟体育详情页赛事统计
-->
<template>
  <div class="c-match-startistic">
    <!-- 历史战绩 -->
    <div class="historical-record">{{i18n_t('collect.historical_record')}}</div>
    <!-- 比分板 -->
    <div class="score-list">
      <div
        v-for="(score, index) in datas.score_list"
        :key="index+'-'"
        class="score-item items-center row"
      >
        <div class="info main">
          <span
            :class="['line', score.home == 0 && 'line0']"
            :style="`width:${score.home * 10}%`"
          ></span>
          <span class="score">{{ score.home }}</span>
        </div>
        <div class="separate"></div>
        <div class="info away">
          <span
            :class="['line', score.away == 0 && 'line0']"
            :style="`width:${score.away * 10}%`"
          ></span>
          <span class="score">{{ score.away }}</span>
        </div>
      </div>
    </div>
    <!-- 胜负百分比 -->
    <div class="result-wrap row">
      <div class="home item  column items-center">
        <div class="win-percent">{{ datas.win_home }}%</div>

        <div class="result-list row ">
          <div
            v-for="(item, index) in datas.result_home"
            :key="index"
            :class="['result-item', 'item-' + item]"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <div class="away item column items-center">
        <div class="win-percent">{{ datas.win_away }}%</div>

        <div class="result-list row">
           <div
            v-for="(item, index) in datas.result_away"
            :key="index"
            :class="['result-item', 'item-' + item]"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
export default {
  data() {
    return {
      // 定时对象
      datas: null,
    };
  },
  computed:{
    // ...mapGetters({
    //   match:'get_current_gotodetail_match'
    // }),
    match(){return VR_CTR.get_current_gotodetail_match()},
  },
  created() {
    this.datas = this.format_datas();
  },

  methods: {
    format_datas() {
      let { msc } = this.match;
      // 比分
      let score_list = [];
      /** 赛果 L：负 D：平 W：胜 ******/
      // 主队
      let result_home = [];
      // 客队
      let result_away = [];
      // 主队赢的次数
      let win_home = 0;
      //  客队赢的次数
      let win_away = 0;

      if (Array.isArray(msc)) {
        msc.map((item) => {
          let score = item.split(":");
          let { 0: home, 1: away } = score;
          let home_rs = home - away;

          score_list.push({
            home,
            away,
          });

          // 主胜、客负
          if (home_rs > 0) {
            result_home.push("W");
            result_away.push("L");
            win_home += 1;
            // 主负、客胜
          } else if (home_rs < 0) {
            result_home.push("L");
            result_away.push("W");
            win_away += 1;
            // 平
          } else {
            result_home.push("D");
            result_away.push("D");
          }
        });
      }

      // 比赛总轮次
      let match_total = 5;
      let _win_home = (win_home / match_total) * 100;
      let _win_away = (win_away / match_total) * 100;
      
      return {
        score_list,
        result_home,
        result_away,
        win_home: _win_home,
        win_away: _win_away,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.historical-record {
  height: 0.48rem;
  line-height: 0.48rem;
  padding-left: 0.28rem;
  font-size: 0.16rem;
  position: relative;

  &:after {
    content: " ";
    display: block;
    position: absolute;
    width: 3px;
    height: 0.12rem;
    top: 0.18rem;
    left: 0.19rem;
    border-radius: 1.5px;
  }
}

.c-match-startistic {
  min-width: 3.75rem;

  .score-list {
    margin-top: 0.2rem;

    .score-item {

      font-size: 0.12rem;

      .info {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .score {
          font-size: 0.12rem;
          letter-spacing: 0;
        }

        .line {
          border-radius: 2px;
          margin-right: 0.08rem;
          height: 0.04rem;

          &.line0 {
            width: 2px !important;
          }
        }

        &.away {
          flex-direction: row-reverse;

          .line {
            margin: 0 0 0 0.08rem;
          }
        }
      }

      .separate {
        margin: 0 0.13rem;
        width: 0.08rem;
        height: 0.02rem;
      }
    }
  }

  .result-wrap {
    margin-top: 0.2rem;
    padding: 0 0.7rem;
    padding-bottom: 0.35rem;

    .item {
      flex: 1;

      .result-list {
        margin-top: 0.08rem;

        .result-item {
          border-radius: 2px;
          text-align: center;
          margin: 0 0.01rem;
          width: 0.16rem;
          height: 0.16rem;
        }
      }
    }
  }
}
</style>

