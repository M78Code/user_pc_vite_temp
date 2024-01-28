<!--
 * @Date: 2023-12-14
 * @Description: 复刻版-虚拟体育详情页赛事统计
-->
<template>
  <div v-if="datas" class="c-match-startistic column" :class="show_style">
    <!-- 样式1(style1)：足球 -->
    <template v-if="show_style == 'style1'">
      <div class="score-list">
        <div v-for="(score, index) in  datas.score_list" :key="index" class="score-item items-center row">
          <!-- 主队进球 -->
          <div class="info main">
            <span :class="['line', score.home == 0 && 'line0']" :style="`width:${score.home * 10}%`"></span>
            <span class="score">{{ score.home }}</span>
          </div>
          <div class="separate"></div>
          <!-- 客队进球 -->
          <div class="info away">
            <span :class="['line', score.away == 0 && 'line0']" :style="`width:${score.away * 10}%`"></span>
            <span class="score">{{ score.away }}</span>
          </div>
        </div>
      </div>

      <div class="result-wrap row">
        <div class="home item column items-center">
          <!-- 主队进球比例 -->
          <!-- <div class="win-percent">{{ datas.win_home }}%</div> -->
          <div class="result-list row">
            <!-- 主队近10场输赢结果 -->
            <div v-for="(item, index) in datas.result_home" :key="index" :class="['result-item yb-flex-center', 'item-' + item]">
              {{ item }}
            </div>
          </div>
        </div>

        <div class="away item column items-center">
          <!-- 客队进球比例 -->
          <!-- <div class="win-percent">{{ datas.win_away }}%</div> -->
          <!-- 客队近10场输赢结果 -->
          <div class="result-list row">
            <div v-for="(item, index) in datas.result_away" :key="index" :class="['result-item yb-flex-center', 'item-' + item]">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 样式2(style2)：赛马|赛狗|摩托车|泥地摩托车 -->
    <template v-else>
      <div class="item">
        <!-- 上期结果 -->
        <span class="name">{{i18n_t("list.virtual_last_result")}}</span>
        <span v-for="(num,index) in datas.forecast" :key="index" class="rs-number">{{ num ? num :'X' }}</span>
      </div>

      <div class="item">
        <!-- 活力表现 -->
        <span class="name">{{i18n_t("list.virtual_vitality")}}</span>
        <span class="percent-line row">
          <span class="proccss" :style="`width:${datas.form}%`"></span>
        </span>
        <span>{{ datas.form }}%</span>
      </div>

      <div class="item">
        <!-- 综合评级 -->
        <span class="name">{{i18n_t("list.virtual_star")}}</span>
        <template v-for="item in 5" :key="item">
          <icon-wapper name="icon-star" :class="item<=datas.star && 'active'"/>
        </template>
      </div>
    </template>
  </div>
</template>
 
<script>
import { IconWapper } from 'src/components/icon/index.js';

export default {
  props: {
    // 单场赛事信息
    match: Object,
    row_index: Number,
  },

  data() {
    return {
      datas: null,//赛事统计信息
      show_style: "style1",//展示样式几?
    };
  },

  components: {
    IconWapper
  },

  created() {
    this.datas = this.format_datas();
  },

  methods: {
    /**
     * @description 格式化赛事信息
     * @return {undefined} undefined
     */
    format_datas() {
      let { msc,csid } = this.match;
      // 1001：足球
      let style1 = [1001];

      if (style1.includes(+csid)) {
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
      } else {
        this.show_style = "style2";
        return this.match.rank[this.row_index];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
//弹窗容器
.c-match-startistic {
  background: #fff;
  border-radius: 4px;
  color: #5a6074;
  box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.2);
  margin: 2px;
  //虚拟摩托车等弹窗内容样式
  &.style1 {
    padding: 15px 10px;
    width: 240px;
    .score-list {
      .score-item {
        font-size: 12px;
        .info {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .line {
            margin-right: 8px;
            height: 4px;
            background: #ff9124;

            /*  比分为0 时的默认长度 */
            &.line0 {
              width: 2px !important;
            }
          }
          &.away {
            flex-direction: row-reverse;
            .line {
              margin: 0 0 0 8px;
              background: #006aff;
            }
          }
        }
        .separate {
          margin: 0 3px;
          width: 8px;
          height: 2px;
          background: #dfe0e8;
        }
      }
    }
    .result-wrap {
      margin-top: 10px;
      .item {
        flex: 1;
        .result-list {
          margin-top: 8px;
          .result-item {
            margin: 0 1px;
            width: 16px;
            height: 16px;
            background: #99a3b1;
            color: #fff;
            &.item-W {
              background: #ff2a2a;
            }
            &.item-L {
              background: #499b16;
            }
          }
        }
      }
    }
  }
  //虚拟足球等弹窗内容样式
  &.style2 {
    top: 35px;
    right: 32%;
    padding: 5px 20px;
    width: 220px;
    align-items: flex-start;
    .item {
      display: flex;
      justify-self: start;
      align-items: center;
      width: 100%;
      margin: 5px 0px;
      .name {
        margin-right: 15px;
        white-space: nowrap;
      }
      .rs-number {
        margin-right: 10px;
      }
      .percent-line {
        margin-right: 10px;
        flex: 1;
        height: 6px;
        background: #dfe0e8;
        .proccss {
          display: inline-block;
          height: 100%;
        }
      }
      .icon-star {
        margin-right: 5px;
        &:before {
          font-size: 12px;
          color: #dfe0e8;
        }
      }
    }
  }
}
</style>