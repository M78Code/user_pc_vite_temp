<!--
 * @Description: 虚拟体育篮球结束时对阵比分组件
-->
<template>
  <!-- 单场赛事结束 -->
  <div class="match-single-end" :class="{end_0:source == 'end_0'}" v-if="match_ended">
    <div class="i-c-m-s-w column items-center" :class="{end_0:source == 'end_0'}">
      <div class="i-c-title row justify-between virtual-title-ended">
        <!--<img class='angle' src="image/wwwassets/bw3/images/angle-l.png" alt="">-->
        <div class='i-c-w'>
          {{i18n_t('virtual_sports.match_status.ended')}}
        </div>
        <!--<img class='angle' src="image/wwwassets/bw3/images/angle-r.png" alt="">-->
      </div>
      <div class='score-wrapper row justify-center items-center' :class="{end_0:source == 'end_0'}">
        <div class='s-c-inner-w row justify-between' :class="{end_0:source == 'end_0'}">
          <div class='row items-center justify-between' :class="{'d-m-s-d-single':source == 'end_0'}">
            <team-img v-if="match_ended.mhlu" :type="1"
              :url="match_ended.mhlu" :fr="match_ended.frman[1]"
              :csid="match_ended.csid"
              :size="22">
            </team-img>
            <div class='team-name' v-if="match_ended.teams">
              {{match_ended.teams[0]}}
            </div>
            <div class='t-score'>
              {{match_ended.home}}
            </div>
          </div>
          <div class='row items-center justify-between' :class="{'d-m-s-d-single':source == 'end_0'}">
            <div class='t-score'>
              {{match_ended.away}}
            </div>
            <div class='team-name' v-if="match_ended.teams">
              {{match_ended.teams[1]}}
            </div>
            <team-img v-if="match_ended.malu" :type="1"
              :url="match_ended.malu" :fr="match_ended.frman[1]"
              :csid="match_ended.csid"
              :size="22">
            </team-img>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import date_match_s_data_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/date-match-s-data-mixin.js";
import teamImg from 'src/base-h5/vr/components/team-img.vue';
export default {
  mixins:[date_match_s_data_mixin],
  components:{
    'team-img':teamImg
  }
}
</script>
<style lang="scss" scoped>
.match-single-end {
  width: 100%;
  top: 0.42rem;
  height: auto;
  position: absolute;

  &.end_0 {
    position: static !important;
  }

  .i-c-m-s-w {
    width: 3rem;
    height: 0.78rem;
    margin: auto;

    &.end_0 {
      height: auto;
    }

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
        margin: 0 auto;
        line-height: 0.18rem;
        text-align: center;

        color: #000000;
        font-size: 0.12rem;
        background-color: #E95B5B;
      }
    }

    .virtual-title-ended {
      background:  var(--q-color-com-img-bg-112) no-repeat center / cover;
    }

    .score-wrapper {
      width: 3rem;
      height: 0.6rem;
      border-radius: 0.04rem;
      background-color: rgba(255, 255, 255, 0.9);

      &.end_0 {
        border-radius: 0 0 0.04rem 0.04rem;
      }

      .s-c-inner-w {
        width: 3.3rem;
        height: 0.3rem;
        font-size: 0.14rem;
        flex-shrink: 0;

        &.end_0 {
          width: 95%;
        }

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

          &.d-m-s-d-single {
            & :deep(.team-img-s) {
              width: 0.24rem;
              height: 0.24rem;

              .img-style-s {
                width: 0.24rem;
                height: 0.24rem;
              }
            }
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
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/date_match_s_data_mixin.js