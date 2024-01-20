<!--
 * @Description: 视频大屏版页面
-->
<template>
  <div v-if="!detail_loading" class="video-wrap c-big-video v-scroll-area relative-position" :class="{'big-video-right':$route.params.video_size ==1}">
    <video-iframe
        :detail_info="detail_info"
        :refresh_time="refresh_time"
        @set_full_screen_status="set_full_screen_status" />
  </div>
  <div class="detail-loading" v-if="detail_loading">
    <loading></loading>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import { usedetailData } from "./index";
import loading from "./components/loading/index.vue";
import VideoIframe from "./video_iframe.vue"
import {MITT_TYPES, useMittOn} from "src/core/mitt/index.js";
import {i18n_t} from "src/boot/i18n.js";

const router = useRouter();
const route = useRoute();

const refresh_time = ref(0);


const {
  detail_loading,
  detail_info,
} = usedetailData(route);


//设置全屏状态
function set_full_screen_status(){
  if(this.$route.params.video_size == 1) {
    browser_full_screen()
  }else{
    exit_browser_full_screen()
  }
}


/**
 * @Description 浏览器全屏
 * @param {undefined} undefined
 */
function browser_full_screen(){
  let video_dm = document.documentElement;
  let rfs = video_dm.requestFullScreen || video_dm.webkitRequestFullScreen || video_dm.mozRequestFullScreen || video_dm.msRequestFullScreen;
  if (rfs) {
    rfs.call(video_dm);
  }
}

/**
 * @Description 退出浏览器全屏
 * @param {undefined} undefined
 */
function exit_browser_full_screen(){
  let video_dm = document;
  let cfs = video_dm.cancelFullScreen || video_dm.webkitCancelFullScreen || video_dm.mozCancelFullScreen || video_dm.exitFullScreen;
  if(cfs) {
    cfs.call(video_dm);
  }
}

/**
 * @Description:退出全屏  返回上一个页面
 * @return {undefined} undefined
 */
function exit_full_screen(size){
  window.history.go(-2)
  // const { mid, tid, csid } = this.match_info
  // // 如果是从详情页进入大屏返回详情页
  // if(this.from == 'details'){
  //   if(this.$route.params.video_size == 1 && video.from ==0){
  //     //  window.vue.$router.back()
  //     window.history.go(-2)
  //     //  this.exit_browser_full_screen()
  //   }else{
  //     this.$router.push({
  //       name: 'details',
  //       params: {
  //         mid,
  //         tid,
  //         csid
  //       }
  //     })
  //     sessionStorage.setItem('auto_play_media', '1');
  //   }
  // }else if(video.from == 0 && size =='xl' && !this.$utils.is_eports_csid(this.$route.params.csid)){
  //   this.$router.push({
  //     name: 'video',
  //     params: {
  //       mid,
  //       tid,
  //       csid,
  //       play_type: this.$route.params.play_type,
  //       video_size: '0'
  //     }
  //   })
  // }else{
  //   this.set_is_back_btn_click(true);
  //   this.$utils.redirect_router('/home')
  // }
  // let time = Date.now()
  // this.set_play_media({
  //   mid:this.match_info.mid,
  //   media_type: this.vx_play_media.media_type,
  //   time
  // })
  // if(size =='xl'){
  //   this.exit_browser_full_screen()
  // }
}

//首页活动弹框
useMittOn(MITT_TYPES.EMIT_EXIT_FULL_SCREEN_MSG_EVENT, function (imgUrl) {
  exit_full_screen();
}).off;

</script>

<style lang="scss" scoped>
.video-wrap {
  padding-right: 14px;
  height: 100%;
  &.big-video-right {
    padding-right:0;
    &::after{
      width: 0;
      background: none;
      border:none;
    }
  }
  .data-title {
    height: 40px;
    margin-bottom: 15px;
    .img {
      width: 16px;
      height: 16px;
      margin-right: 9px;
      background-repeat: no-repeat;
    }
  }

  /* 比分数据 */
  .data-template {
    display: flex;
    justify-content: center;
    background-color: var(--qq--yb-bg-color18_big_screen_1);
    border-radius: 6px;
    padding: 15px 0;
    ::v-deep .column-between {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .video-bottom-panel {
    margin-top: 4px;
    margin-bottom: 1px;
    &.iframe-video-bottom-panel {
      .panel-wrapper {
        ::v-deep {
          .chatroom {
            margin-top: 0;
            .chat-scroll-area {
              height: 171px;
            }
            .emoji-picker {
              height: 145px;
            }
          }
          .total_chart {
            .wrap-score {
              padding: 29px 40px 33px 40px;
            }
          }
        }
      }
    }
    .panel-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0 8px;
      &.no-chatroom {
        display: block;
      }
      > div {
        border: none;
        // border: 1px solid var(--qq--match-border-color2);
      }
      ::v-deep {
        .video-history-line {
          margin-bottom: 4px;
        }
        .stats-wrapper, .chatroom, .video-history-line {
          border: 1px solid var(--qq--match-border-color2);
        }
        .chatroom {
          margin-top: 0;
          .chat-scroll-area {
            //height: 230px;
            height: 171px;
          }
          .emoji-picker {
            //height: 238px;
            height: 145px;
          }
        }
        .total_chart {
          .wrap-score {
            //padding: 57px 40px 70px 40px;
            padding: 29px 40px 33px 40px;
            &.basketball-score {
              padding: 0;
            }
          }
          .q-knob {
            font-size: 54px;
          }
        }
      }
    }
  }
}
</style>
