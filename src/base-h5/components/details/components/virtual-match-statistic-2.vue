<!--
 * @Author: Supermark
 * @Date: 2021-01-05 20:25
 * @Description: 虚拟体育详情页赛事统计
-->
<template>
  <div class="c-match-startistic">
    <div class="bg-card-startistic">
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
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
import { format_datas } from "src/core/format/index.js"
import { defineComponent,ref,onMounted } from "vue";
import { MatchDetailCalss } from "src/core";
export default defineComponent({
  name: "virtual-match-statistic",
  setup(){
    // 定时对象
    const  datas =ref(MatchDetailCalss.current_gotodetail_match)
    onMounted(()=>{
      datas.value =format_datas(datas.value)  //正在跳转详情的赛事  
    })
    return {
      datas
    }
  }
})

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
  padding:0.05rem;
  background:#F8F9FA;
  .bg-card-startistic{
    background: var(--q-gb-bg-c-15);
    border-radius: 4px;
  }
  .score-list {
    // margin-top: 0.2rem;
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

