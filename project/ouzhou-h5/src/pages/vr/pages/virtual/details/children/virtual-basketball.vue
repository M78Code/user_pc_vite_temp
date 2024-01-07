<!--
 * @Author: Supermark
 * @Date: 2021-06-19 22:38:24
 * @Description: 虚拟篮球详情页视频区域.赛事(进行中+完赛)组件
-->
<template>
  <div class="vir-bask">
    <!-- 期数区域 -->
    <div class="vir-bask-head" v-if="current_match.mmp == 'INGAME' && !is_end">
      <div>{{current_match.no}}</div>&nbsp;
      <div>{{i18n_t('virtual_sports.match_status.playing')}}</div>
    </div>
    <div class="vir-bask-head vir-end" v-if="current_match.mmp != 'INGAME'" v-html="i18n_t('virtual_sports.match_status.x_to_ended').replace('%s',basketball_end_time)"></div>
    <!-- 进度区域 -->
    <div class="progress" v-if="!is_end">
      <!-- 中文进度 -->
      <div class="row text-pro">
        <div class="col">{{i18n_t('virtual_sports.match_status.0')}}</div>
        <div class="col">{{i18n_t('virtual_sports.match_status.1')}}</div>
        <div class="col">{{i18n_t('virtual_sports.match_status.2')}}</div>
      </div>
      <!-- 线性进度 -->
      <div class="line-wrap">
        <div class="round active"></div>
        <div class="line">
          <div class="inner-line" :style="`width:${basketball_line_width}%`"></div>
        </div>
        <div class="round" :class="{active:basketball_line_width == 100 || current_match.mmp == 'INGAME'}"></div>
        <div class="line">
          <div class="inner-line" :style="`width:${basketball_line_width2}%`"></div>
        </div>
        <div class="round" :class="{active:basketball_line_width2 == 100}"></div>
      </div>
    </div>
    <!-- 比赛结束 -->
    <div v-if="is_end" class="vir-ending">{{i18n_t('virtual_sports.match_status.ended')}}</div>
    <!-- 对阵区域 -->
    <div class="against" :class="0 ? 'against-area':'against-area-end'">
      <!-- 主队icon -->
      <team-img :type="0" :csid="current_match.csid" :url="current_match.mhlu" :fr="current_match.frmhn" :size="22" />
      <!-- 主队名 -->
      <div class="vir-name">{{current_match.teams[0]}}</div>
      <!-- 主队得分 -->
      <div class="home-num" :class="0 ? 'home-number':'home-number-end'">{{score.home}}</div>
      <!-- 客队得分 -->
      <div class="away-num" :class="0 ? 'away-number': 'away-number-end'">{{score.away}}</div>
      <!-- 客队名 -->
      <div class="vir-name">{{current_match.teams[1]}}</div>
      <!-- 客队icon -->
      <team-img :type="1" :csid="current_match.csid" :url="current_match.malu" :fr="current_match.frman" :size="22" />
    </div>
  </div>
</template>
<script>
import virtual_basketball_mixin from "src/core/vr/mixin/pages/virtual/details/children/virtual-basketball-mixin.js";
import teamImg from 'project_path/src/pages/vr/components/team-img.vue';
export default {
  mixins:[virtual_basketball_mixin],
  name:'virtual_basketball',
  components:{
    teamImg,
  },
}
</script>
<style lang="scss" scoped>
.vir-bask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  z-index: 3;

  padding-top: 0.6rem;
}

.vir-bask-head {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.2rem;
  height: 0.18rem;
  margin: 4px auto;
  background-color: #D4080B;
  border-radius: 8px;
  font-size: 0.1rem;
  color: var(--q-color-com-fs-color-8);

  &.vir-end {
    // background-color: #5E88A7;
    background-color: var(--q-gb-bg-c-35);
  }
}

.progress {
  width: 3rem;
  height: 0.32rem;
  margin: 0 auto;
  background: rgba(36, 45, 62, 0.9);
  border-radius: 4px 4px 0 0;
  color: var(--q-gb-t-c-14);
}

.vir-ending {
  width: 1.2rem;
  height: 0.18rem;
  margin: 0 auto;
  text-align: center;
  font-size: 12px;
  margin-top: 0.52rem;
  color: var(--q-color-com-fs-color-8);
  font-weight: 600;

  background-size: 100% 100%;
}

.text-pro {
  width: 2.3rem;
  margin: 0 auto;
  text-align: center;
  padding-top: 7px;
  font-size: 0.1rem;
  color: var(--q-color-fs-color-50);
  line-height: 0.1rem;
}

.line-wrap {
  width: 1.6rem;
  margin: auto;
  display: flex;
  height: 0.07rem;
  align-items: center;
  justify-content: center;
  margin-top: 5px;

  .round {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #999999;

    &.active {
      // background-color: var(--q-color-page-bg-color-50);
      background-color: var(--q-gb-bg-c-35);
    }
  }

  .line {
    height: 0.01rem;
    background-color: #999999;
    flex: 1;

    .inner-line {
      height: 100%;
      // background-color: var(--q-color-page-bg-color-50);
      background-color: var(--q-gb-bg-c-35);
    }
  }
}

.against {
  width: 3rem;
  height: 0.6rem;
  margin: auto;
  // background: var(--q-color-com-bg-color-12);
  display: flex;
  align-items: center;
  // background-color: var(--q-color-com-bg-color-12);
  background-color: var(--q-gb-bg-c-27);
}

.against-area {
  border-radius: 0 0 4px 4px;
}

.against-area-end {
  border-radius: 4px 4px 4px 4px;
}

.home {
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  background-size: 100% 100%;
}

.home-icon {
  margin-left: 0.1rem;
  margin-right: 0.2rem;
}

.home-icon-end {
  margin-left: -0.12rem;
  margin-right: 0.24rem;
}

.away {
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  background-size: 100% 100%;
}

.away-icon {
  margin-left: 0.18rem;
}

.away-icon-end {
  position: absolute;
  top: 44%;
  right: 0.25rem;
}

.home-num {
  width: 0.36rem;
  height: 0.28rem;
  line-height: 0.28rem;
  text-align: center;
  margin-right: 0.1rem;
  font-size: 14px;
  color: var(--q-color-com-fs-color-8);
  background: var(--q-color-com-bg-color-33);
}

.home-number {
  margin-left: 0.13rem;
}

.home-number-end {
  margin-left: 0.3rem;
}

.away-num {
  width: 0.36rem;
  height: 0.28rem;
  line-height: 0.28rem;
  text-align: center;
  font-size: 14px;
  color: var(--q-color-com-fs-color-8);
  background: var(--q-color-com-bg-color-33);
}

.away-number {
  margin-right: 0.15rem;
}

.away-number-end {
  margin-right: 0.3rem;
}

.vir-name {
  max-width: 0.42rem;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.14rem;
  color: var(--q-color-com-fs-color-1);
  line-height: 14px;
  font-weight: 600;
}
</style>
