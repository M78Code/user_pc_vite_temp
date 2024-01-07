<!--
 * @Description: 虚拟体育篮球相关组件
-->
<template>
  <div class="v-match-l-wrapper">
    <div class="v-m-container" v-if="!match_ended">
      <!--  -->
      <div class="date-title" v-if="m_status != 2 && !is_pre_counting_end">
        {{get_current_batch.no}}
      </div>


      <div class="data-wrapper-list">
        <div class="d-h-w">
          <div class="stage-wrapper row justify-center">
            <div class="s-w-title" :class="{focus:(status - 1) <= m_status}" v-for="(status, index) of 3" :key="index">
              {{i18n_t(`virtual_sports.match_status[${status-1}]`)}}
            </div>
          </div>
          <!-- 线性进度 -->
          <div class="line-wrap">
            <div class="round active"></div>
            <div class="line">
              <div class="inner-line" :style="`width:${basketball_line_width}%`"></div>
            </div>
            <div class="round" :class="{active:basketball_line_width == 100 || current_match.mmp == 'INGAME'}"></div>
            <div class="line">
              <div class="inner-line" v-if="m_status == 2" style="width:100%"></div>
            </div>
            <div class="round" :class="{active:m_status == 2}"></div>
          </div>
        </div>
        <!-- 列表页 -->
        <!-- <div class="data-c-wrapper" v-if="match_list">
          <div class="row d-row-item" v-for="(item,i) of match_list" :key="i"
            v-show="i < 6">
            <div class="row team justify-between">
              <div class="league-avatar">
                <team-img v-if="item.mhlu" :csid="item.csid"
                  :type="1" :url="item.mhlu" :fr="item.frman[1]" :size="20" >
                </team-img>
              </div>
              <div>
                {{item.teams[0]}}
              </div>
              <div class="score">
                {{item.home}}
              </div>
            </div>
            <div class="row team justify-between">
              <div class="score">
                {{item.away}}
              </div>
              <div>
                {{item.teams[1]}}
              </div>
              <div class="league-avatar">
                <team-img v-if="item.malu" :csid="item.csid"
                  :type="1" :url="item.malu" :fr="item.frman[1]" :size="22" >
                </team-img>
              </div>
            </div>
          </div>
        </div> -->
        <!-- 单个赛事 -->
        <date-match-sdata v-if="source == 'detail'"
          :match_ended="current_match" source='end_0' />
        <!-- 单场赛事结束 -->
        <date-match-sdata v-if="source == 'detail'" :match_ended="match_ended" />
      </div>

      <!-- 滚球结束倒计时 -->
      <div class="date-title row justify-center items-center end">
        <div class="d-t-c" v-html="i18n_t('virtual_sports.match_status.x_to_ended').replace('%s',basketball_end_time)"></div>
      </div>

    </div>
    <!-- 单场赛事结束 -->
    <date-match-sdata :match_ended="match_ended" />

  </div>
</template>
<script>
import date_match_list_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/date-match-list-mixin.js";
import teamImg from 'project_path/src/pages/vr/components/team-img.vue';
import dateMatchSdata from 'project_path/src/pages/vr/pages/virtual/virtual-sports-part/date-match-s-data.vue'
export default {
  mixins:[date_match_list_mixin],
  components:{
    'date-match-sdata':dateMatchSdata,
    'team-img':teamImg,
  },
}
</script>

<style lang="scss" scoped>
.v-match-l-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .v-m-container {
    width: 3rem;
    margin: 0 auto;
    padding-top: 0.04rem;

    .date-title {
      width: 1.2rem;
      height: 0.3rem;
      line-height: 0.3rem;
      text-align: center;
      font-size: 0.14rem;
      font-weight: 500;
      // color: #ffffff;
      color: var(--q-gb-bg-c-10);
      margin: 0 auto;

      margin-top: 0.08rem;

      background-color: #FF0000;

      &.end {
        // background-color: #5E88A7;
        background-color: var(--q-gb-bg-c-90);
        // opacity: 0.6;
        border-radius: 0.16rem;
      }

      .d-t-c {
        margin-right: 0.05rem;
      }
    }

    .data-wrapper-list {
      width: 100%;
      height: 0.58rem;
      margin-top: 0.04rem;
      border-radius: 0.08rem;
      overflow: hidden;

      .d-h-w {
        width: 100%;
        // height: 0.32rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        // background-color: #363F4F;
        background-color: #303442;

        .stage-wrapper {
          width: 100%;
          // height: 0.21rem;
          color: #999999;

          .s-w-title {
            width: 0.74rem;
            font-size: 0.1rem;
            display: flex;
            justify-content: center;
            align-items: flex-end;

            &.focus {
              color: #E95B5B;
              // background-color:#FFB001;
            }
          }
        }

        .stage-process {
          width: 100%;
          height: 0.07rem;
        }

        .line-wrap {
          display: flex;
          height: 0.07rem;
          align-items: center;
          justify-content: center;

          .round {
            width: 0.07rem;
            height: 0.07rem;
            border-radius: 50%;
            background-color: #999999;

            &.active {
              background-color: #E95B5B;
            }
          }

          .line {
            height: 0.01rem;
            background-color: #999999;
            width: 0.68rem;

            .inner-line {
              height: 100%;
              background-color: #E95B5B;
            }
          }
        }
      }

      .data-c-wrapper {
        width: 100%;
        height: auto;
        font-size: 0.1rem;
        padding: 0.06rem 0;
        background-color: var(--q-gb-bg-c-23);
      }

      .d-row-item {
        width: 100%;
        height: 0.2rem;
        padding: 0.02rem 0;

        .team {
          width: 50%;
          height: 0.16rem;
          padding-left: 0.12rem;
          padding-right: 0.03rem;

          .league-avatar {
            width: 0.16rem;
            height: 0.16rem;
            overflow: hidden;

            & :deep(.team-img) {
              width: 100%;
              height: 100%;

              .img-style {
                width: 100%;
                height: 100%;
              }
            }
          }

          .score {
            width: 0.27rem;
            height: 0.16rem;
            background-color: #17191D;
            color: #ffffff;
            line-height: 0.16rem;
            text-align: center;
          }

          &:last-child {
            padding-left: 0.03rem;
            padding-right: 0.12rem;
          }
        }
      }
    }
  }

  .match-single-end {
    width: 100%;
    left: 0;
    top: 0.42rem;
    height: auto;
    position: absolute;

    .i-c-m-s-w {
      width: 3rem;
      height: 0.78rem;
      margin: auto;

      .i-c-title {
        min-width: 1.2rem;
        height: 0.18rem;
        flex-wrap: nowrap;

        .angle {
          width: 0.13rem;
          height: 0.18rem;
        }

        .i-c-w {
          width: 0.94rem;
          height: 0.18rem;
          line-height: 0.18rem;
          text-align: center;
          // background-color: #FFB001;
          color: #000000;
          font-size: 0.12rem;
        }
      }

      .score-wrapper {
        width: 3rem;
        height: 0.6rem;
        border-radius: 0.04rem;
        background-color: rgba(255, 255, 255, 0.9);

        .s-c-inner-w {
          width: 3.3rem;
          height: 0.3rem;
          font-size: 0.14rem;
          flex-shrink: 0;

          .row {
            width: 50%;

            & :deep(.team-img-s) {
              margin: 0;
            }

            &:first-child {
              padding-right: 0.03rem;
            }

            &:last-child {
              padding-right: 0.03rem;
            }
          }

          .team-name {
            color: #000000;
          }

          .t-score {
            width: 0.36rem;
            height: 0.28rem;
            background-color: #17191D;
            color: #ffffff;
            line-height: 0.28rem;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/date_match_list_mixin.js