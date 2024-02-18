<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育视频区域
-->

<template>
  <div class="flex-box relative-position">
      <!-- 提示消息icon -->
    <span class="icon icon-tips3" :class="is_show_content && 'active'" @click="is_show_content = !is_show_content" />
     <!-- 提示内容 -->
    <div class="tip-content" v-if="is_show_content">
      <div class="content-wrap relative-position">
        <div class="yb-icon-triangle"></div>
        <div class="content">{{i18n_t('common.live_notice')}}</div>
      </div>
    </div>
    <div class="virtual-video yb-flex-center" :class="'csid'+vsport_ctr.info.csid">
      <!-- 篮球赛果 -->
      <basketball-result v-if="vsport_ctr.video_show_type == 'basketball_result'" :vsport_ctr="vsport_ctr" />
      <!-- 赛果 -->
      <div class="result-wrap fit" v-if="vsport_ctr.video_show_type == 'result'">
        <div class="yb-flex-center">
          <div class="result">
            <!-- 赛马赛果 -->
            <div class="horse fit yb-flex-center" v-if="vsport_ctr.info.csid != 1001">
              <div class="item" :class="`ranking-bg-style1-${item.no} csid-${vsport_ctr.info.csid}`" v-for="(item,key) in vsport_ctr.horse_rank" :key="key"></div>
            </div>
            <!-- 足球赛果 -->
            <div class="footbal fit  yb-flex-center yb-flex-direction" v-else>
              <div class="yb-flex-center">
                  <div class="col ellipsis home">{{vsport_ctr.replay_list[vsport_ctr.replay_index].home_name}}</div>
                  <div class="score din-medium">{{vsport_ctr.replay_list[vsport_ctr.replay_index].home}}-{{vsport_ctr.replay_list[vsport_ctr.replay_index].away}}</div>
                  <div class="col ellipsis">{{vsport_ctr.replay_list[vsport_ctr.replay_index].away_name}}</div>
              </div>
              <!-- 点球比分 -->
              <div  class="yb-flex-center yb-width" v-if="vsport_ctr.info.csid == 1001 && vsport_ctr.info.isc == 1">
                <!-- 点球图标 -->
                <div class="col icon-wrap"><icon class="icon" :name="`img:${compute_local_project_file_path('/image/svg/white-point.svg')}`" size="13px"/></div>
                <!-- 点球比分 -->
                <div class="score din-medium">{{vsport_ctr.replay_list[vsport_ctr.replay_index].penalty_score_home ?  `${vsport_ctr.replay_list[vsport_ctr.replay_index].penalty_score_home}-${vsport_ctr.replay_list[vsport_ctr.replay_index].penalty_score_away}` :'-'}}</div>
                <div class="col"></div>
              </div>
            </div>
            <!-- 已完赛 -->
            <div class="yb-flex-center">
              <div class="end">{{i18n_t('list.match_end')}}</div>
            </div>
          </div>
        </div>
		    <!-- 期号时间 -->
        <div class="yb-flex-center relative-position">
          <div class="time-wrap" v-if="vsport_ctr.info.has_next">
            <div class="rounds">{{vsport_ctr.info.next_no}}</div>
            <div class="time col din-medium">{{vsport_ctr.next_time_str}}</div>
          </div>
        </div>
      </div>
      <!-- 播放器 -->
      <div class="video-wrap fit relative-position" v-show="vsport_ctr.video_show_type == 'video'">
        <!-- 测试数据 -->
        <div class="test-data" v-if="vsport_ctr.is_test">
          <div>video_time:{{vsport_ctr.video_time}}---upd_time:{{vsport_ctr.upd_time}}</div>
          <div>load_state:{{vsport_ctr.video_load_state}}</div>
        </div>
        <!-- 遮罩层  禁止用户点击视频暂停 -->
        <div class="mask relative-position">
          <!-- 视频声音 -->
          <div class="voice-mask relative-position" v-if="vsport_ctr.video_load_state == 'done'">
            <div class="voice-wrap" @click="vsport_ctr.set_video_voice()">
              <svg v-if="!vsport_ctr.video_voice"  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z"></path></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056z"></path></svg>
            </div>
          </div>
        </div>
        <!-- 足球比分 -->
        <div class="score-wrap din-medium" v-if="[1001,1004].includes(vsport_ctr.info.csid*1) && ['done','play_end'].includes(vsport_ctr.video_load_state)">
          <div class="col ellipsis home">{{vsport_ctr.replay_list[vsport_ctr.replay_index].home_name}}</div>
          <div class="score">{{vsport_ctr.replay_list[vsport_ctr.replay_index].home}}-{{vsport_ctr.replay_list[vsport_ctr.replay_index].away}}</div>
          <div class="col ellipsis">{{vsport_ctr.replay_list[vsport_ctr.replay_index].away_name}}</div>
          <div class="time" v-if="vsport_ctr.info.csid == 1001">{{vsport_ctr.replay_list[vsport_ctr.replay_index].show_time}}'</div>
          <div class="live" v-else></div>
        </div>
        <div id="dplayer" class="fit"></div>
        <!-- 视频不可播放 -->
        <no-video v-if="vsport_ctr.video_load_state == 'error'" />
      </div>
      <!-- 圆形进度 -->
      <arc-progress v-if="vsport_ctr.video_show_type == 'time'" :vsport_ctr="vsport_ctr" />
    </div>
  </div>
</template>

<script>
import loadData from "src/components/load_data/load_data.vue"
import arcProgress from "src/base-pc/components/virtual-right/arc-progress.vue"
import basketballResult from "src/base-pc/components/virtual-right/basketball-result.vue"
import noVideo from "src/base-pc/components/match-detail/match_info/no_video.vue"
import { compute_local_project_file_path } from "src/output/index.js";
export default {
  name: "virtualVideo",
  components:{
    arcProgress,
    loadData,
    basketballResult,
    noVideo
  },
  data(){
    return {
      is_show_content:false,
    }
  },
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object
  },
  watch:{
    // 监听播放地址改变
    'vsport_ctr.video_url':{
      handler(url){
        this.$nextTick(() => {
          this.vsport_ctr.play_video()
        })
      },
      immediate: true,
    },
  },
  destroyed() {
    this.vsport_ctr.destroy_video()
  },
};
</script>

<style lang="scss" scoped>
.load-data-wrap {
  background-color: #111;
  position: absolute;
  top: 0;
  left: 0;
}

/*  视频不可播放 */
.c-no-video {
  position: absolute;
  top: 0;
  left: 0;
}
.flex-box{
  &::after {
    content: "";
    display: block;
    height: 0px;
    width: 100%;
    padding-bottom: 56.25%;
  }
  .icon-tips3{
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 101;
    font-size: 14px;
    &.active {
      &::before{
        color: rgba(255, 255, 255, 0.7);
      }
    }
    &::before{
      color: var(--q-gb-t-c-1);
    }
  }
  /*  提示内容 */
    .tip-content {
      position: absolute;
      top: 32px;
      right: 8px;
      width: 70%;
      z-index: 102;
      .content-wrap {
        position: absolute;
        top: 0px;
        width: 100%;
        .yb-icon-triangle{
          &::before{
            background-color: rgba(0,0,0,0.8);
          }
        }
        .content {
          padding: 6px 28px;
          font-size: 12px;
          background-color: rgba(0,0,0,0.8);
          color: var(--q-gb-t-c-1);
        }
        .yb-icon-triangle {
          position: absolute;
          top: -5px;
          right: 10px;
        }
      }
    }
}


.virtual-video {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-size: cover;
  &.csid1001 {
    background-image: url($SCSSPROJECTPATH + "/image/common/virtual/bg1001.png");
  }
  &.csid1011 {
    background-image: url($SCSSPROJECTPATH + "/image/common/virtual/bg1011.png");
  }
  &.csid1002 {
    background-image: url($SCSSPROJECTPATH + "/image/common/virtual/bg1002.png");
  }
  &.csid1004 {
    background-image: url($SCSSPROJECTPATH + "/image/common/virtual/bg1004.png");
  }
  &.csid1010 {
    background-image: url($SCSSPROJECTPATH + "/image/common/virtual/bg1010.png");
  }
  &.csid1009 {
    background-image: url($SCSSPROJECTPATH + "/image/common/virtual/bg1009.png");
  }
  .video-wrap {
    .score-wrap {
      width: 225px;
      height: 20px;
      line-height: 20px;
      position: absolute;
      left: 50%;
      transform: translateX(-112.5px);
      bottom: 4px;
      border-radius: 4px;
      z-index: 100;
      display: flex;
      .home {
        text-align: right;
      }
      .ellipsis {
        font-weight: bold;
      }
      .score {
        width: 70px;
        text-align: center;
      }
      .time {
        width: 26px;
        height: 100%;
        position: absolute;
        top: 0;
        right: -20px;
        text-align: center;
        border-radius: 2px;
      }
      .live {
        width: 34px;
        height: 100%;
        background: url($SCSSPROJECTPATH + "/image/common/virtual/live_bai.svg") no-repeat;
        background-position: center center;
        background-color: var(--q-gb-bg-c-1);
        border-radius: 0 4px 4px 0;
      }
    }
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    overflow: hidden;
    &:hover .voice-mask {
      bottom: 0;
    }
    .voice-mask {
      position: absolute;
      left: 0;
      bottom: -98px;
      width: 100%;
      height: 98px;
      background: url("data:image/pngbase64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==")
        repeat-x bottom;
      transition: bottom 0.3s;
      .voice-wrap {
        position: absolute;
        bottom: 10px;
        left: 15px;
        cursor: pointer;
        width: 20px;
        height: 20px;

        svg {
          width: 100%;
          height: 100%;
          fill: #fff;
        }
      }
    }
  }
}

/*  比赛结果 */
.result-wrap {
  display: flex;
  justify-content: center;
  flex-direction: column;
  /* 赛果 */
  .result {
    width: 70%;
    height: 100px;
    border-radius: 300px;
    position: relative;
    /* 比赛结束 */
    .end {
      font-size: 14px;
      font-weight: 600;
      position: absolute;
      top: 78px;
    }
    .horse {
    /* 开奖号码 */
      .item {
        width: 35px;
        height: 35px;
        margin: 0 7.5px;
      }
    }
    .footbal {
      padding: 0 10px;
      color: var(--q-gb-t-c-1);
      font-size: 14px;
      &.yb-flex-direction{
        flex-direction: column;
        .yb-width{
          width: 100%;
        }
      }
      .ellipsis {
        font-weight: bold;
      }
      .home,.icon-wrap {
        text-align: right;
      }
      .score {
        width: 117px;
        text-align: center;
        font-size: 16px;
      }
    }
  }

  /*  倒计时 */
  .time-wrap {
    color: var(--q-gb-t-c-1);
    margin-top: 20px;
    height: 32px;
    display: flex;
    align-items: center;
    border-radius: 15px;
    text-align: center;
    font-size: 14px;
    padding: 0 20px;
    .time {
      width: 50px;
      text-align: right;
    }
  }
}
.test-data {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--q-gb-t-c-1);
  z-index: 100;
  width: 100%;
  font-size: 13px;
}
</style>