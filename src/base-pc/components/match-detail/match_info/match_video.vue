<!--
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 右侧视频播放组件
-->
<template>
  <div ref="video" class="c-match-video relative-position" @mousemove="onMousemove">
    <!-- 精彩回播 header -->
    <div style="display: none;"> {{ LayOutMain_pc.layout_version }}</div>
    <div v-if="current_replay" class="video-replay-header">
      <div class="btn-back-live"></div>
      <div class="replay-info">{{current_replay.titleInfo}}</div>
      <div class="replay-icon"></div>
    </div>
    <div class="right-icon"  @click.stop="is_show_content = !is_show_content">
      <!-- 提示消息 -->
      <icon-wapper class="icon" v-if="!is_esports" :class="is_show_content && 'active'" size="14px" name="icon-tips3" :color="is_show_content ? 'rgba(255,255,255,.7)' : '#fff'"/>
          <!-- 提示内容 -->
      <div :class="['tip-content',{'is-iframe':is_iframe}]" v-if="is_show_content" @click.stop>
        <div class="content-wrap relative-position">
          <div class="yb-icon-triangle"></div>
          <!-- 此版面现实的所有直播内容仅供参考........ -->
          <div class="content">{{ i18n_t('common.live_notice')}}</div>
        </div>
      </div>
    </div>
    <!-- 普通面板 1 -->
    <template v-if="show_type == 'info' && !is_esports" >
      <div :style="{'background-image': `url('${background_img}')`}" class="head-info">
        <info :match_info="match_info" :right="true" class="match-time fit row flex-center" />
      </div>
    </template>

    <!-- 未登录 视频不可播 2 -->
    <div class="video-not fit column yb-flex-center no-video-bg" v-if="show_type == 'no-login'">
      <!-- 账户信息已经失效 /  请重新进入后观看 -->
      <div class="label" v-if="is_limited">{{ i18n_t('common.limited')}}</div>
      <div class="label" v-else>{{ i18n_t('common.account_invalid')}}<br/>{{ i18n_t('common.account_invalid2')}}</div>
    </div>

    <!-- 有直播可放 3-->
    <div class="load-data-wrap fit video-loading loading-wrap yb-flex-center relative-position" v-if="show_type == 'play-video'&&(is_fold_status || is_esports) && !is_video_pause"
      @mouseenter="video_enter"
      @mouseleave="video_leave"
    >
      <div class="img-loading custom-format-img-loading" :style="compute_css_obj('pc-img-loading')" v-show="show_loading"></div>
      <div class="loading-text">
        {{ i18n_t('common.loading')}}
        <!-- 数据加载中... 请稍后 -->
      </div>
      <iframe
        id="video-iframe"
        class="video-iframe fit"
        :src="media_src"
        frameborder="0"
        marginwidth="0"
        marginheight="0"
        hspace="0"
        vspace="0"
        scrolling="no"
        allowfullscreen='true' allow="autoplay"
      ></iframe>
      <template v-if="show_video_replay && play_media.media_type === 'video' && (LayOutMain_pc.layout_current_path.cur !== 'details' && !is_esports)">
        <!--（精彩/收起）回放 -->
        <div
          v-if="!(events_list.length === 0 && current_events_type === 0)"
          class="video-history-btn"
          :class="{'move-up': is_expand_video_list}"
          @click.stop="toggleVideoReplay">
          <div class="video-history-icon"></div>
          <span>{{ !is_expand_video_list ? i18n_t('video.video_event_history') : i18n_t('video.video_event_history_close') }}</span>
        </div>
        <!-- 精彩回放事件类型切换 -->
        <tabs
          v-show="is_expand_video_list  && tab_list.length"
          :value="current_events_type"
          :tabs="tab_list"
          @click="change_video_history_list"></tabs>
        <!-- 精彩回放视频滚动列表 -->
        <slider-x
            :slider_list="events_list"
            :itemWidth="138"
            :currentInfo="current_replay"
            :isShow="is_expand_video_list"
            @click="change_event_video"
            :class="{'video-move-in': is_expand_video_list}"
            ref="slider_video"
        >
          <template v-slot:default="slotProps">
            <div class="video-history-item" :style="`background:url(${slotProps.item.fragmentPic}); background-size: cover;`">
              <div class="content">
                <div class="score">{{ slotProps.item.t1 }} : {{ slotProps.item.t2 }}</div>
                <div class="event-team">{{ slotProps.item.homeAway }}</div>
                <div class="event-name">{{ event_name(slotProps.item.eventCode) }}: {{ slotProps.item.firstNum }}</div>
                <div class="event-time">{{ format_second_ms(slotProps.item.secondsFromStart) }}</div>
              </div>
            </div>
          </template>
        </slider-x>
      </template>
      <video-type-ctr
        @mouseenter="video_enter"
        v-show="is_video_hover && !current_replay && ((['video','studio','anchor','topic'].includes(play_media.media_type) && is_video_load_done) || is_esports)"
        :ctr_data="ctr_data"
        :is_video_hover="is_video_hover"
        :video_fullscreen_disabled="video_fullscreen_disabled"
        :match_info="match_info"
        :is_esports="is_esports"
      ></video-type-ctr>
    </div>

    <!-- 长时间未操作暂停 -->
    <div class="video-not fit no-video-bg custom-format-web-icon-06" v-if="show_type == 'no-handle'">
      <div class="no-handle-text">{{ i18n_t('video.novideo6')}}</div>
      <div class="pause-icon" @click="show_type = 'play-video'"></div>
    </div>

    <!-- 无直播可放 -->
    <no-video v-if="show_type == 'no-video'" class="novide-canplay" />
    <!-- 回播链接错误 -->
    <video-replay-error @iframe_status="iframe_status" v-if="current_replay" :url="media_src"/>

    <!-- 视频暂停 -->
    <div class="video-not fit no-video-bg custom-format-web-icon-06" v-if="show_type == 'pause'">
      <div class="pause-icon" @click="on_play_video"></div>
    </div>
  </div>
</template>

<script>
import tabs from "src/base-pc/components/match-detail/match_info/tabs.vue";
import match_video from "src/base-pc/components/match-detail/match_info/match_info_mixin/match_video.js";
import video_type_ctr from "src/core/video/video_type_ctr.vue";
import noVideo from "src/base-pc/components/match-detail/match_info/no_video.vue"
import videoReplayError from "src/base-pc/components/video-replay/video-replay-error.vue"
import { IconWapper } from 'src/components/icon'
import info from "src/base-pc/components/match-detail/match_info/info.vue";
import { i18n_t,format_second_ms,compute_css_obj} from "src/output/index.js"
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
export default {
  mixins: [match_video],
  components: {
    "video-type-ctr": video_type_ctr,
    noVideo,
    videoReplayError,
    IconWapper,
    info,
    tabs
  },
  data(){
    return {
      compute_css_obj,
      LayOutMain_pc,
      
      route:this.$route,
      router:this.$router,
      format_second_ms,
      i18n_t,
      ctr_data:{ // 高清flv, 2:流畅m3u8 切换配置参数
      video_type:1 //1:高清flv, 2:流畅m3u8
      },
    }
  },
  
};
</script>

<style lang="scss" scoped>
.video-loading {
  flex-direction: column;
  .img-loading {
    width: 50px;
    height: 50px;
    background-size: 100%;
    margin-bottom: 10px;
  }
  .video-iframe {
    position: absolute;
    left: 0;
    top: 0;
  }
}
.c-match-video {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 190px;
  .right-icon {
    position: absolute;
    width: 100%;
    z-index: 8;
  }
  //声明图标
  .icon {
    position: absolute;
    top: 12px;
    right: 15px;
    cursor: pointer;
  }
  //声明容器
  .tip-content {
    position: absolute;
    top: 32px;
    right: 10px;
    width: 70%;
    &.is-iframe{
      width:95%;
    }
    .content-wrap {
      background-color: rgba(0, 0, 0, 0.8);
      padding: 9px 28px;
      font-size: 12px;
      color: var(--q-gb-t-c-1);
    }
    .yb-icon-triangle {
      position: absolute;
      top: -5px;
      right: 7.5px;
      &::before {
        background-color: rgba(0, 0, 0, 0.8);
      }
    }
  }
  .head-info {
    height: 190px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center center;
  }
  .video-not {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .no-video-img {
      width: 48px;
      height: 48px;
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .label {
      font-size: 12px;
      margin-top: 7px;
    }
    .no-handle-text{
      font-size: 14px;
      height: 50px;
      max-width: 91%;
    }
    .pause-icon {
      width: 64px;
      height: 64px;
      cursor: pointer;
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }

  :deep(.c-match-date) {
    margin: 0 auto;
  }

  /*============精彩回放 start===============*/
  .video-replay-header {
    width: 100%;
    height: 36px;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 45px 0 10px;
    z-index: 12;
    pointer-events: none;
    background: var(--q-gb-bg-lg-11);
    .replay-info {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: var(--q-gb-t-c-1);
      position: absolute;
      left: 50%;
      top: 15px;
      transform: translateX(-50%);
    }
    // .btn-back-live {
    //   height: 24px;
    //   line-height: 24px;
    //   background: rgba(51, 51, 51, 0.4);
    //   border: 0.5px solid rgba(255, 255, 255, 0.5);
    //   border-radius: 80px;
    //   font-weight: 400;
    //   font-size: 12px;
    //   color: #FFFFFF;
    //   padding: 0 15px;
    //   cursor: pointer;
    // }
    .replay-icon {
      width: 65px;
      height: 18px;
      background: url($SCSSPROJECTPATH+'/image/svg/replay_icon2.svg');
      background-size: 100% 100%;
    }
  }
  .video-history-btn {
    position: absolute;
    right: 15px;
    bottom: 80px;
    z-index: 98;
    height: 24px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px 0 6px;
    color: var(--q-gb-t-c-1);
    font-size: 12px;
    align-items: center;
    background: rgba(51, 51, 51, 0.4);
    border: 0.5px solid rgba(255, 255, 255, 0.5);
    border-radius: 80px;
    // transition: bottom 0.2s;
    cursor: pointer;
    &.move-up {
      bottom: 110px;
    }
    &:hover {
      opacity: 0.9;
    }
    .video-history-icon {
         width: 16px;
         height: 16px;
         background-size: 100%;
         background-image: url($SCSSPROJECTPATH+'/image/common/svg/video_history_play.svg');
         margin-right: 8px;
    }
    span{
      flex: 1;
    }
  }

  :deep(.slider-x) {
    position: absolute;
    bottom: 46px;
    left: 0;
    width: 100%;
    height: 60px;
    padding-left: 0;
    color: var(--q-color-com-fs-color-8);
    display: none;
    z-index: 98;
    .slider-content {
      padding-left: 8px;
    }
    &.video-move-in {
      display: block;
    }
    .arrow-left, .arrow-right {
      width: 20px;
      height: 20px;
      margin-top: -10px;
      img {
        height: 10px;
      }
    }
    .item-wrapper {
      position: relative;
      width: 130px;
      height: 60px;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 8px;
      border-radius: 6px;
      border: 1px solid transparent;
      flex-shrink: 0;
      .video-history-item {
        border-radius: 6px;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        cursor: pointer;
        .content {
          background: rgba(51, 51, 51, 0.6);
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          padding: 7px;
        }
      }
      .score {
        font-weight: 700;
        font-size: 14px;
        line-height: 14px;
        color: var(--q-gb-t-c-1);
      }
      .event-team, .event-name {
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        color: var(--q-gb-t-c-1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .event-team {
        margin: 4px 0 1px;
      }
      .event-time {
        position: absolute;
        right: 7px;
        top: 7px;
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
  :deep(.tabs-wrapper) {
    position: absolute;
    bottom: 110px;
    left: 15px;
    z-index: 98;
    height: 20px;
    border-radius: 20px;
    .item {
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
    }

  }
  /*============精彩回放 end===============*/
}

.novide-canplay{
  :deep(.no-video-inner .img-list .item .text){
    color: var(--q-gb-t-c-18);
  }
}

</style>
<style>
@media screen and (max-width: 1440px) {
  .content .c-match-process .process-name {
    width: 60px;
    margin: 0 auto;
  }
  .content .c-match-date {
    min-width: 58px;
    padding: 0 0 !important;
  }
  .right_details_wrap .content .timer-layout {
    max-width: 75px;
  }
}
@media screen and (max-width: 1920px) {
  .content .c-match-date {
    /* max-width: 76%; */
    margin: 0 auto;
  }
}
</style>