<!--
 * @Description: 赛狗类 排行榜页面  只需要传个 mid 赛事id进来
-->
<template>
  <!-- <div style="height: 0.08rem; width: 100vw; background-color: #F2F2F6;"></div> -->
  <div class="ranking_list_satrt">
    <template v-if="!no_data">
      <!-- <span class="navigation-title">{{ i18n_t('virtual_sports.leaderboard') }}</span> -->
      <div class="ranking-item hairline-border" v-for="(item, index) in ranking_data" :key="index">
        <div class="ranking-item-left">
          <div class="left-item ellipsis">
            <span class="virtual-num" :class="`match-horse${index+1}`"></span>
            <span class="ellipsis">{{ item.name }}</span>
          </div>
        </div>

        <div class="ranking-item-right">

          <div class="right-item results_previous">
            <span class="right-item-label">{{ i18n_t('virtual_sports.results_previous') }}</span>
            <div class="right-item-content results_previous_result">
              <span v-for="(results, i) in item.forecast" :key="i" :class="results != 0 ? 'score-number' : 'score-x'">{{results != 0 ? results : 'X'}}</span>
            </div>
          </div>
          
          <div class="right-item comprehensive_rating">
            <span class="right-item-label">{{i18n_t('virtual_sports.comprehensive_rating')}}</span>
            <div class="right-item-content">
              <q-rating
                style="min-width:.85rem; margin-left: 0.07rem;"
                v-model="item.star"
                size="3.5em"
                :icon="`img:${LOCAL_PROJECT_FILE_PREFIX}/image/png/m-list-favorite.png`"
                :icon-selected="`img:${LOCAL_PROJECT_FILE_PREFIX}/image/png/m-list-favorite-red.png`"
                readonly
              />
            </div>
          </div>

          <div class="right-item vitality_performance">
            <span class="right-item-label">{{ i18n_t('virtual_sports.vitality_performance') }}</span>
            <div class="right-item-content">
              <q-linear-progress :value="Number(item.form/100)" color="warning" class="q-mt-sm"/>
              <div class="virtual-progress-bg">
                <div class="virtual-progress-bar" :style="{width:`${item.form}%`}"></div>
              </div>
              <span class="rate_percent">{{ item.form }}%</span>
            </div>
          </div>

        </div>

      </div>
    </template>
    <!-- 没有数据 组件 -->
    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"></no-data>
  </div>
</template>
<script>
import ranking_list_start_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/ranking-list-start-mixin.js";
import no_data from "project_path/src/pages/vr/components/common/vr-sport-no-data.vue"
export default {
  mixins:[ranking_list_start_mixin],
  name:'ranking_list_start',
  components: {
    "no-data": no_data
  },
}
</script>

<style lang="scss" scoped>
.ranking_list_satrt {
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // margin-top: 0.08rem;
  background-color: var(--q-gb-bg-c-23);

  .navigation-title {
    font-size: 0.14rem;
    display: block;
    position: relative;
    padding-left: 0.21rem;
    font-weight: 500;
    margin-bottom: 0.04rem;
    border-radius: 0.08rem;
    height: 0.34rem;
    line-height: 0.34rem;

    &:before {
      content: "";
      width: 0.03rem;
      height: 0.14rem;
      position: absolute;
      left: 0.12rem;
      top: 50%;
      transform: translate3d(0, -50%, 0);

      border-radius: 1.5px;
    }

    &::after {
      content: "";
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      width: 200%;
      height: 200%;
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      -webkit-transform-origin: left top;
      transform-origin: left top;
      border: 1px solid;
      border-radius: 0.16rem;
      overflow: hidden;
    }
  }

  .ranking-item {
    width: 97vw;
    // height: 0.7rem;
    height: 0.87rem;
    // padding: 0.15rem 0.12rem 0.15rem 0.13rem;
    box-sizing: border-box;
    font-size: 0.1rem;
    text-align: center;
    line-height: 0.16rem;
    border-radius: 0.08rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    

    .ranking-item-left{
      width: 40%;
      height: 100%;
      // background-color: red;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      padding:0 0.12rem;

      .left-item{
        // background-color: aquamarine;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: var(--q-gb-t-c-18);
        font-size: 0.12rem;
        font-weight: 400;

          .virtual-num {
            width: 0.2rem;
            height: 0.2rem;
            background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png") no-repeat 0 0 / 100%;
            --per: -0.3rem;
          }

          .ellipsis{
            margin-left: 0.08rem;
          }

          .match-horse1 {
            background-position-y: calc(var(--per) * 6);
          }
          
          .match-horse2 {
            background-position-y: calc(var(--per) * 7);
          }
          
          .match-horse3 {
            background-position-y: calc(var(--per) * 8);
          }
          
          .match-horse4 {
            background-position-y: calc(var(--per) * 9);
          }
          
          .match-horse5 {
            background-position-y: calc(var(--per) * 10);
          }
          
          .match-horse6 {
            background-position-y: calc(var(--per) * 11);
          }
        
      }
    }

    .ranking-item-right{
      width: 60%;
      height: 100%;
      // background-color: #179CFF;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: var(--q-gb-bg-c-21);
      border-radius: 0.08rem;

      padding: 0.01rem 0.1rem;

      .right-item{
        // background: yellow;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .right-item-label{
          display: block;
          width: 0.48rem;
          color: var(--q-gb-t-c-18);
          font-weight: 400;
          font-size: 0.12rem;
          font-family: PingFang SC;
          // background-color: yellowgreen;
        }

        .right-item-content{
          width: 60%;
          margin-left: 0.08rem;
          // background-color: purple;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .q-mt-sm{
            margin: 0rem;
          }

          .rate_percent{
            font-weight: 500;
            color: var(--q-gb-t-c-19);
            margin-left: 0.08rem;
          }


          .virtual-progress-bg {
            // width: 0.8rem;
            // height: 0.04rem;
            // margin: 0 0.1rem 0 0.08rem;
            // border-radius: 0.06rem;
            border-radius: 0.2rem;

            .virtual-progress-bar {
              border-radius: 0.06rem;
              height: 100%;
              transition: all 0.2s;
            }
          }

          :deep(.text-warning) {
            width: 0.8rem;
            margin: 0 0.1rem 0 0.08rem;
            transition: all 0.3s linear;
            color: #E95B5B !important;
            

            .absolute-full {
              height: 0.04rem;
            }
          }

        }

        .results_previous_result{
            // width: 0.54rem;
            font-family: PingFang SC;
            color: #179CFF;
            font-weight: 500;
            font-size: 0.12rem;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            // background-color: pink;

            > span {
              padding-left: 0.08rem;
              
            }

        }

      }

      

      .comprehensive_rating{
        :deep(.q-rating) {
              > i {
                font-size: 0.12rem;
              }

              .q-rating__icon {
                width: 0.1rem;
                height: 0.1rem;

                margin-right: 0.05rem;

                &.q-rating__icon--active {
                }
              }

              img {
                width: 100%;
                height: 100%;
              }
            }
        }

    }

  }
}

</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/ranking_list_start_mixin.js