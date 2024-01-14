<!--
 * @Date: 2023-12-14
 * @Description: 复刻版-虚拟体育详情页赛事统计
-->
<template>
  <div class="c-match-startistic">
    <div class="bg-card-startistic">
      <!-- 比分板 -->
      <div class="score-list">
        <div
          v-for="(score, index) in datas.score_list"
          :key="index+'-'"
          class="score-item items-center col"
        >
          <div class="score-header row justify-center items-center">
            <div class="left team team-home">
              <span class="score">{{ score.home }}</span>
            </div>
            <div class="separate"></div>
            <div class="right team team-away">
              <span class="score">{{ score.away }}</span>
            </div>
          </div>
          <!-- 占比条 -->
          <div class="score-line row">
            <div class="info main">
              <span
                :class="['line', score.home == 0 && 'line0']"
                :style="`width:${score.home * 10}%`"
              ></span>
            </div>
            <div class="separate"></div>
            <div class="info away">
              <span
                :class="['line', score.away == 0 && 'line0']"
                :style="`width:${score.away * 10}%`"
              ></span>
            </div>
          </div>

        </div>
      </div>
      
      <!-- 胜负百分比 -->
      <div class="result-wrap row">
        <div class="home item  column items-center">
          <!-- <div class="win-percent">{{ datas.win_home }}%</div> -->

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
        <div class="separate">

        </div>
        <div class="away item column items-center">
          <!-- <div class="win-percent">{{ datas.win_away }}%</div> -->

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
  </div>
</template>
 
<script>
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
export default {
  data() {
    return {
      // 定时对象
      datas: null,
    };
  },
  computed:{
    match(){
      return VR_CTR.state.current_gotodetail_match
    },
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
      let match_total = msc.length;
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

.c-match-startistic {
     background-color:var(--q-color-page-bg-color-2);
    color: var(--q-gb-t-c-3);
    &::after {
      border-color: var(--q-gb-bd-c-3) !important;
    }
    .score-list {
      .score-item {
        .info {
          .score {
            color: var(--q-gb-t-c-3);
          }
          .line {
            background:var(--q-gb-bg-c-35);
          }
          &.away {
            .line {
              // background: #74C4FF;
              background: var(--q-gb-bg-c-36);
            }
          }
        }
        .separate {
          background-color: var(--q-gb-t-c-18);
        }
      }
    }
    .result-wrap {
      border-bottom: 1px solid  var(--q-color-border-color-27);
      .item {
        .result-list {
          .result-item {
            background: #FEAE2B;
            color:var(--q-gb-t-c-14);
            &.item-W {
              background: #E95B5B;
            }
            &.item-L {
              background: #4AB06A;

            }
          }
        }
      }
    }
  }
  .win-percent {
    color:var(--q-gb-t-c-18);
  }
.c-match-startistic {
  min-width: 3.75rem;
  padding:0.05rem;
  background:var(--q-gb-bg-c-21);
  .bg-card-startistic{
    background: var(--q-gb-bg-c-25);
    border-radius: 4px;
    padding: 0.08rem;
  }
  .score-list {
    // margin-top: 0.2rem;
    .score-item {

      font-size: 0.12rem;
      font-weight: 700;
      color: var(--q-gb-t-c-18);
      margin-bottom: 0.12rem;
      .score-header{
        padding: .05rem 0;
      }
      .score-line{
        //按照设计图的3px太细了，故设置4px
        --private-score-line-height: .04rem;
        height: var(--private-score-line-height);
        background-color: var(--q-gb-bg-c-2);
        .separate{
          background-color: transparent;
        }
      }
      .separate {
        text-align: center;
        margin: 0 .025rem;
        height: 0.02rem;
        width: 0.06rem;
      }

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
          border-radius: 1rem 0 0 1rem;
          height: var(--private-score-line-height);
          background-color: var(--q-gb-bg-c-18);

          &.line0 {
            
          }
        }

        &.away {
          flex-direction: row-reverse;

          .line {
            border-radius: 0rem 1rem 1rem 0rem;
            background-color: var(--q-gb-bg-c-29);
          }
        }
      }
    }
  }

  .result-wrap {
    margin-top: 0.2rem;
    // padding: 0 0.7rem;
    padding-bottom: 0.35rem;
    .separate{
      width: 0.08rem;
    }
    .item {
      flex: 1;
      // background-color: var(--q-gb-bg-c-18);
      border-radius: 0.04rem;
      padding: .08rem 0;
      .result-list {
        margin-top: 0.04rem;
        font-size: 0.10rem;
        display: flex;
        justify-content: center;
        .result-item {
          border-radius: 2px;
          margin: 0.02rem;
          text-align: center;
          width: 0.20rem;
          height: 0.16rem;
        }
      }
    }
  }
}
</style>