<!--
 * @Description: 当前选中的赛事的阶段组件包含视频,进行中,完赛
-->
<template>
  <div class="virtual-sports-stage" :data-mid="'mid-'+current_match.mid" :data-mstatus="'status-'+m_status">      
    <div class="banner" :class="{
      horse:sub_menu_type == 1011,
      dog: [1002, 1010, 1009].includes(sub_menu_type),
      basketball:sub_menu_type == 1004,
      motorcycle: [1010, 1009].includes(sub_menu_type),
      dirt_motorcycle:sub_menu_type == 1009
      }">
      <loading v-show="virtual_match_list_data_loading" class="wrapper-loading-c" />

      <!-- 0:代表开赛之前倒计时 -->
      <div v-if="(!is_pre_counting_end) && (!m_status || m_status == 0)" class="row justify-center items-center timetop">
        <virtual-sports-timer
          :title="current_match.no"
          :ms="start_now_sub"
          :mid="current_match.mid"
          :match="current_match"
          :source="source"
          @time_ended="timer_ended_handle" />
      </div>

      <!-- 1:赛事进行中(有视频播放中) -->
      <div class="video-playing-container" v-if="m_status === 1">
      <!--<div class="video-playing-container">-->
        <div class="video-wrapper">
          <div class="video-playing-er" ref="video-playing-er">
          </div>
          <!-- 视频声音 -->
          <div class="voice-wrap" @click="set_video_voice">
            <svg v-if="!video_voice"  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056z"></path></svg>
          </div>
        </div>
        <!-- 实时比分-->
        <div v-if="[1001,1004].includes(sub_menu_type)"
          class="current-score row justify-around items-center">
          <div class="score-info-wrapper">
            <div class="team-and-score">
              <div class="team-name">
                {{current_match.teams[0] ? current_match.teams[0] : 0}}
              </div>
              <div>
                {{current_match.home}}-{{current_match.away}}
              </div>
              <div class="team-name">
                {{current_match.teams[1] ? current_match.teams[1] : 0}}
              </div>
            </div>
            <div v-show="current_match && (current_match.s170_home > 0 || current_match.s170_away > 0)" class="penalty-score-wrapper">
              <div class="team-placeholder-wrapper">
                <div class="team-name-placeholder">
                  {{current_match.teams[0] ? current_match.teams[0] : 0}}
                </div>
                <i class="icon icon-penalty"></i>
              </div>
              <div class="penalty-score">
                {{current_match.s170_home ? current_match.s170_home : 0}}-{{current_match.s170_away ? current_match.s170_away : 0}}
              </div>
              <div class="team-name-placeholder">
                {{current_match.teams[1] ? current_match.teams[1] : 0}}
              </div>
            </div>
          </div>
          <div v-if="sub_menu_type != 1004" class="c-s-timer-w row justify-center items-center">
            {{current_match.show_time}}'
            <div class="update-timer">
              {{match_process_update}}
            </div>
          </div>
          <div v-if="sub_menu_type == 1004" class="c-s-timer-w basketball row justify-center items-center">
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/basket_ball_video_playing.svg`" alt="">
          </div>
        </div>
      </div>
      <!-- 2:赛事结束显示对阵 -->
      <div v-if="m_status == 2 && get_score_list().length && sub_menu_type != 1004" class="fat-box ended">
      <!--<div  class="fat-box ended">-->

        <!-- 赛马/赛狗赛事结束对阵 -->
        <div v-if="![1001,1004].includes(sub_menu_type)" class="score row justify-center items-center">
          <!-- 已完赛 -->
          <div :style="{visibility: ![1002, 1011, 1010, 1009].includes(sub_menu_type) ? 'hidden':'visible'}"
            v-if="source != 'detail'"
            class="match-over">{{i18n_t('collect.match_end')}}</div>
          <div v-for="(score,i) in get_score_list()" :key="i">
            <div class="score-box row justify-center items-center" :class="get_rank_background(score,sub_menu_type)"></div>
          </div>
        </div>
        <!-- 足球赛事结束对阵 -->
        <div v-else class="football-score row justify-center items-center">
          <div class="name-wrap left">
            <div class="match-name ellipsis">{{home_name}}</div>
            <img v-img="([lodash.get(current_match,'mhlu'), lodash.get(current_match,'frmhn')])" />
          </div>
          <div class="msc-wrap yb-flex-center">
            <div class="match-end">{{i18n_t('collect.match_end')}}</div>
            <div class="match-msc">
              <span>{{home_score}}</span>
              <span class="heng">-</span>
              <span>{{away_score}}</span>
            </div>
            <div
                v-show="current_match &&
                (current_match.s170_home > 0 || current_match.s170_away > 0)"
                class="match-msc match-penalty"
            >
              <i class="icon icon-penalty"></i>
              <div class="penalty-score">
                <span>{{current_match.s170_home ? current_match.s170_home : 0}}</span>
                <span class="heng">-</span>
                <span>{{current_match.s170_away ? current_match.s170_away : 0}}</span>
              </div>
            </div>
          </div>
          <div class="name-wrap right">
            <img v-img="([lodash.get(current_match,'malu'), lodash.get(current_match,'frman')])" />
            <div class="match-name ellipsis">{{away_name}}</div>
          </div>
        </div>
        <!-- 下一轮的时间 -->
        <div class="mmp-status row justify-end items-center" v-show="next_batch_title || next_match_time">
          <div class="inner">
            <div class="stage">{{next_batch_title}}</div>
            <div class="times">{{next_match_time}}</div>
            <div class="icon"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 虚拟篮球列表 v-if="basketball_status == 0 && sub_menu_type == 1004 && (match_started && !is_video_playing || m_status == 2 || is_pre_counting_end)" /> -->
    <dateMatchList @update_line_width="set_line_width" :current_match="current_match" :v_m_status="m_status"
      :virtual_match_list="virtual_match_list" :source="source"
      :is_pre_counting_end="is_pre_counting_end" :match_status="current_batch.mmp"
      v-if="basketball_status == 0 && sub_menu_type == 1004 && (match_started && !is_video_playing || m_status == 2 || is_pre_counting_end)" />

    <!-- 虚拟篮球详情组件 -->
    <virtualBasketball
      v-if="basketball_status > 0"
      :basketball_status="basketball_status"
      :current_match="current_match"
    />

  </div>
</template>
<script>
import virtual_sports_stage_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-stage-mixin.js";
import virtualSportsTimer from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-timer.vue";
import loading from 'src/base-h5/components/common/loading.vue';
import dateMatchList from 'project_path/src/pages/vr/pages/virtual/virtual-sports-part/date-match-list.vue'
import virtualBasketball from 'project_path/src/pages/vr/pages/virtual/details/children/virtual-basketball.vue'
export default {
  mixins:[virtual_sports_stage_mixin],
  name:'VirtualSportsStage',
  components:{
    'virtual-sports-timer':virtualSportsTimer,
    dateMatchList,
    loading,
    virtualBasketball
  },
}
</script>

<style lang="scss" scoped>
.virtual-sports-stage {
  min-height: 1.9rem;
  position: relative;
  background: var(--q-gb-bg-c-28);
}

.voice-wrap {
  width: 0.4rem;
  height: 0.2rem;
  position: absolute;
  bottom: 0.04rem;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 0.2rem;
    height: 0.2rem;
    fill: rgba(255, 255, 255, 0.9);
  }
}

.banner {
  border-radius: 0.05rem;
  width: 100%;
  height: 1.9rem;
  margin: auto;
  overflow: hidden;
  background-image: url($SCSSPROJECTPATH+"/image/png/virtual_football.png"); //todo 后续上传到服务器
  background-size: 100% 100%;
  position: relative;

  &.horse {
    background-image: url($SCSSPROJECTPATH+"/image/png/virtual_horse.png");
  }

  &.dog {
    background-image: url($SCSSPROJECTPATH+"/image/png/virtual_match_dog.png");
  }

  &.basketball {
    background-image: url($SCSSPROJECTPATH+"/image/png/virtual_match_basketball.png");
  }

  &.motorcycle {
    background-image: url($SCSSPROJECTPATH+"/image/png/virtual_match_motorcycle.png");
  }

  &.dirt_motorcycle {
    background-image: url($SCSSPROJECTPATH+"/image/png/dirt_virtual_match_motorcycle.png");
  }

  .wrapper-loading-c {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 40% !important;
    transform: translate(-50%, -50%);
    padding: 0;
  }

  .video-main {
    position: fixed;
    width: 100%;
    z-index: 2;
  }

  .current-score {
    width: 2.25rem;
    height: 0.36rem;
    border-radius: 0.04rem;
    background-color: rgba(0, 0, 0, 0.4);
    bottom: 0.04rem;
    left: calc(50% - 0.13rem);
    transform: translateX(-50%);
    position: absolute;
    z-index: 2;
    color: #ffffff;

    .score-info-wrapper {
      width: 100%;
      .team-and-score {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .team-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .penalty-score-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-around;

        .team-placeholder-wrapper {
          position: relative;
          .icon-penalty {
            position: absolute;
            top: .03rem;
            right: 0;
            width: .11rem;
            height: .11rem;
            background:  var(--q-color-com-img-bg-114) no-repeat center / cover;
          }
        }

        /* 占位隐藏，目的是为了让图标定位准确 对齐 */
        .team-name-placeholder {
          max-height: .18rem;
          visibility: hidden;
        }
      }
    }

    .c-s-timer-w {
      width: 0.26rem;
      height: 100%;
      border-radius: 0.02rem;
      position: absolute;
      top: 0;
      right: -0.24rem;
      overflow: hidden;
      // background-color: rgb(242, 53, 13);
      // background-color: #179cff;
      background-color: var(--q-gb-bg-c-13);

      .update-timer {
        position: absolute;
        right: -100px;
        width: 1px;
      }

      &.basketball {
        border-top-left-radius: 0;
        border-top-right-radius: 0.04rem;
        border-bottom-right-radius: 0.04rem;
        border-bottom-left-radius: 0;
        // background-color: #FFB001;

        img {
          width: 0.21rem;
          height: auto;
          display: block;
        }
      }
    }
  }

  .video-wrapper {
    width: 100%;
    height: 100%;

    .video-playing-er {
      width: 100%;
      height: 100%;
    }
  }
}

.fat-box {
  overflow: hidden;
}

.timetop {
  height: 100%;
}

.video-playing-container {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  &:deep(.dplayer-video-wrap .dplayer-video){
    object-fit: fill;
  }
}

.fit-box {
  padding-top: 0.15rem;
  padding-bottom: 0.19rem;
}

.score {
  width: 100%;
  height: 0.54rem;
  background: rgba(0,0,0, 0.6);
  background-size: 100% 100%;
  margin: auto;
  margin-top: 0.68rem;
  position: relative;
  border-radius: 0.04rem;

  .match-over {
    position: absolute;
    left: 50%;
    margin-left: -0.23rem;
    top: -0.43rem;
    width: 0.46rem;
    height: 0.24rem;
    line-height: 0.26rem;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 0.15rem;
    font-size: 0.1rem;
    font-weight: 600;
    color: #fff;
  }
}

.score-box {

  width: 0.36rem;
  height: 0.36rem;

  border-radius: 4px;
  font-size: 0.24rem;
  margin: 0 0.1rem;
  border-radius: 2px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  &.match-horse1,  &.match-dog1 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse1.png");
  }
  &.match-horse2 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse2.png");
  }
  &.match-horse3 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse3.png");
  }
  &.match-horse4 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse4.png");
  }
  &.match-horse5 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse5.png");
  }
  &.match-horse6 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_horse6.png");
  }
  &.match-dog2 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog2.png");
  }
  &.match-dog3 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog3.png");
  }
  &.match-dog4 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog4.png");
  }
  &.match-dog5 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog5.png");
  }
  &.match-dog6 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_dog6.png");
  }
  &.motorcycle5 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_motorcycle5.png");
  }
  &.motorcycle6 {
    background-image: url($SCSSPROJECTPATH+"/image/png/match_motorcycle6.png");
  }
  &.dirt_motorcycle1 {
  background-image: url($SCSSPROJECTPATH+"/image/png/dirt_motorcycle1.png");
  }
  &.dirt_motorcycle2 {
    background-image: url($SCSSPROJECTPATH+"/image/png/dirt_motorcycle2.png");
  }
  &.dirt_motorcycle3 {
    background-image: url($SCSSPROJECTPATH+"/image/png/dirt_motorcycle3.png");
  }
  &.dirt_motorcycle4 {
    background-image: url($SCSSPROJECTPATH+"/image/png/dirt_motorcycle4.png");
  }
}

.mmp-status {
  margin-top: 0.3rem;
  margin-right: 0.12rem;

  .inner {
    display: flex;
    align-items: center;
    padding: 0 0.05rem 0 0.1rem;
    height: 0.24rem;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 0.08rem;

    .icon {
      width: 0.2rem;
      height: 0.2rem;
      margin-left: 6px;
      background: url($SCSSPROJECTPATH+"/image/png/clock.png") no-repeat;
      background-size: 100%;
    }
  }
}

.stage {

  font-size: 0.1rem;
  color: #F5F8FA;
  text-align: center;
}

.times {

  font-size: 0.1rem;
  color: #FEBE55;
  text-align: center;
  padding-left: 0.06rem;
}

/*  足球赛果 */
.football-score {
  background-color: rgba(0, 0, 0, 0.6);
  background-size: 100% 100%;
  height: 0.54rem;
  margin-top: 0.68rem;

  .name-wrap {
    flex: 1;
    display: flex;

    &.left {
      text-align: right;
      justify-content: flex-end;
    }

    img {
      width: 0.18rem;
      height: 0.18rem;
      margin: 0 0.04rem;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

.match-name {
  width: 1rem;

  font-size: 0.14rem;
  color: #FFFFFF;
}

.msc-wrap {
  width: 0.98rem;
  height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  line-height: 1;

  .heng {
    font-size: 16px;
    margin: 0 .05rem .04rem .05rem;
  }

  .match-msc {
    font-size: 0.22rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    &.match-penalty {
      position: relative;
      width: 100%;
      font-size: .18rem;
      .icon-penalty {
        position: absolute;
        top: .03rem;
        left: -.18rem;
        width: .11rem;
        height: .11rem;
        background:  var(--q-color-com-img-bg-114) no-repeat center / cover;
      }
      .penalty-score {
        display: flex;
        align-items: center;
      }
    }
  }

  .match-end {
    text-align: center;
    font-size: 0.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 0.06rem;
    position: absolute;
    top: 0.36rem;
    background: rgba(0, 0, 0, 0.6);
    width: 0.46rem;
    height: 0.24rem;
    line-height: 0.24rem;
    border-radius: 0.04rem;
  }
}

/*************** 头部返回title开始 ***************-S*/
.title {
  height: 0.44rem;
  line-height: 0.44rem;
}

/*************** 头部返回title结束 ***************-E*/
/*************** 返回按钮弹性盒开始 ***************-S*/
.detail-pad {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.15rem;
}

/*************** 返回按钮弹性盒结束 ***************-E*/
/*************** 返回按钮开始 ***************-S*/
.detail_back {
  width: 0.1rem;
  height: 0.18rem;
  background-image: var(--q-color-com-img-bg-3);
  background-size: 100% 100%;
}

/*************** 返回按钮结束 ***************-E*/
/*************** 联赛名开始 ***************-S*/
.text-style {

  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0;
}

/*************** 联赛名结束 ***************-E*/
/*************** 无注单开始 ***************-S*/
.no-single {
  width: 0.18rem;
  height: 0.2rem;
  background-image: var(--q-color-com-img-bg-95);
  background-size: 100% 100%;
  margin-right: 0.21rem;
}

/*************** 无注单结束 ***************-E*/
/*************** 有注单开始 ***************-S*/
.have-single {
  width: 0.18rem;
  height: 0.2rem;
  background-image: var(--q-color-com-img-bg-85);
  background-size: 100% 100%;
  margin-right: 0.21rem;
}

/*************** 有注单结束 ***************-E*/
/*************** 倒计时开始 ***************-S*/
.time-down {
  margin-top: 0.1rem;
}

/*************** 倒计时结束 ***************-E*/
</style>

<style lang="scss">
.dplayer-controller, .dplayer-menu, .dplayer-setting, .dplayer-bar-time,
.dplayer-notice, .dplayer-live-badge, .dplayer-mobile-play, .dplayer-mask,
.dplayer-controller-mask, .dplayer-info-panel {
  display: none !important;
}

.fat-box.ended {
  .dplayer-video-wrap {
    display: none !important;
  }
}
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/virtual_sports_stage_mixin.js