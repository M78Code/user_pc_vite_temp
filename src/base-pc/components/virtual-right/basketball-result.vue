<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 篮球赛果
-->

<template>
  <div class="basketball-result">
    <!-- 比赛时间 -->
    <div class="time yb-flex-center" :class="{end:vsport_ctr.basketball_line_width == 100}" v-if="vsport_ctr.info.mmp == 'PREGAME'">
      <div>{{i18n_t('vsport.period')}}</div>
      <div>{{vsport_ctr.basketball_strat_time}}</div>
    </div>
    <!-- 比赛结束 -->
    <div class="match-end" v-if="vsport_ctr.info.mmp == 'INGAME'">{{i18n_t('vsport.full_time')}}</div>
    <!-- 比赛进度 -->
    <div class="progress" v-if="vsport_ctr.info.mmp == 'PREGAME' || vsport_ctr.status == 2">
      <div class="text yb-flex-center">
        <div class="col">{{i18n_t('vsport.start')}}</div>
        <div class="col">{{i18n_t('vsport.last_minute')}}</div>
        <div class="col">{{i18n_t('vsport.end')}}</div>
      </div>
      <div class="line-wrap">
        <div class="round active"></div>
        <div class="line">
          <div class="inner-line" :style="`width:${vsport_ctr.basketball_line_width}%`"></div>
        </div>
        <div class="round" :class="{active:vsport_ctr.basketball_line_width == 100}"></div>
        <div class="line">
          <div class="inner-line" v-if="vsport_ctr.info.mmp == 'INGAME' && vsport_ctr.status == 2" style="width:100%"></div>
        </div>
        <div class="round" :class="{active:vsport_ctr.info.mmp == 'INGAME' && vsport_ctr.status == 2}"></div>
      </div>
    </div>
    <!-- 赛事信息 -->
    <div class="match-info-bg relative-position" :class="{end:vsport_ctr.info.mmp == 'INGAME' && vsport_ctr.status != 2}">
      <div class="match-info">
        <img class="img"  v-img="[_.get(vsport_ctr,`replay_list[${vsport_ctr.replay_index}].mhlu.0`),_.get(vsport_ctr,`replay_list[${vsport_ctr.replay_index}].frmhn.0`)]" />
        <div class="col relative-position">
          <div class="ellipsis yb-absolute basketball-home">{{vsport_ctr.replay_list[vsport_ctr.replay_index].home_name}}</div>
        </div>
        <div class="score din-medium">{{vsport_ctr.replay_list[vsport_ctr.replay_index].home}}</div>
        <div class="score din-medium">{{vsport_ctr.replay_list[vsport_ctr.replay_index].away}}</div>
        <div class="col relative-position">
          <div class="ellipsis yb-absolute basketball-away">{{vsport_ctr.replay_list[vsport_ctr.replay_index].away_name}}</div>
        </div>
        <img class="img"  v-img="[_.get(vsport_ctr,`replay_list[${vsport_ctr.replay_index}].malu.0`),_.get(vsport_ctr,`replay_list[${vsport_ctr.replay_index}].frman.0`)]" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "basketballResult",
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object
  },
  destroyed(){
    clearInterval(this.vsport_ctr.interval_id_b)
  }
};
</script>

<style lang="scss" scoped>
.basketball-result {
  width: 90%;
  max-width: 460px;

  /*  比赛时间 */
  .time {
    width: 200px;
    height: 28px;
    background-color: #ff0000;
    border-radius: 14px;
    margin: auto;
    margin-bottom: 10px;
    color: var(--q-gb-t-c-1);
    &.end {
      background-color: #5e88a7;
    }

    div {
      margin: 0 5px;
    }
  }

  /*  比赛进度 */
  .progress {
    height: 50px;
    border-radius: 4px 4px 0 0;
    background-color: rgb(55, 63, 79);
    .text {
      width: 346px;
      margin: auto;
      text-align: center;
      color: #e4e4e4;
      line-height: 1;
      padding-top: 12px;
      padding-bottom: 8px;
    }
    .line-wrap {
      width: 240px;
      margin: auto;
      display: flex;
      align-items: center;
      .round {
        width: 9px;
        height: 9px;
        background-color: #4c5566;
        border: 1px solid #e4e4e4;
        border-radius: 50%;
        &.active {
          background-color: var(--q-gb-bg-c-1);
          border: 1px solid var(--q-gb-bd-c-1);
        }
      }
      .line {
        flex: 1;
        height: 2px;
        background-color: #e4e4e4;
        .inner-line {
          height: 100%;
          background-color: var(--q-gb-bg-c-1);
        }
      }
    }
  }

  /*  比赛结束 */
  .match-end {
    width: 140px;
    height: 24px;
    line-height: 24px;
    margin: auto;
    text-align: center;
    font-size: 14px;
    color: #000;
    font-weight: bold;
    background: url($SCSSPROJECTPATH + "/image/common/virtual/timebg.png") no-repeat;
    background-size: 100% 100%;
  }

  /*  赛事信息 */
  .match-info-bg.end {
    height: 86px;
    padding: 0 28px;
    &:before {
      content: "";
      background-color: rgba(255, 255, 255, 0.9);
      display: block;
      height: 100%;
      border-radius: 4px;
    }
    .match-info {
      background-color: rgba(0, 0, 0, 0);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .match-info {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.9);
    height: 70px;
    text-align: center;
    line-height: 40px;
    border-radius: 0 0 4px 4px;
    .img {
      width: 36px;
      margin: 0 10px;
    }
    .col {
      height: 40px;
      .basketball-home {
        color: #000;
      }
      .basketball-away {
        color: #000;
      }
    }
    .score {
      width: 52px;
      height: 40px;
      background-color: rgba(23, 25, 29, 0.9);
      font-size: 20px;
      color: var(--q-gb-t-c-1);
      margin: 0 4px;
    }
  }
}
</style>
