<!--
 * @Author: Cable
 * @Date: 2020-09-04 15:08:19
 * @Description: 视频大屏版播放器组件
-->

<template>
  <div class="video-iframe relative-position" :style="{height:300}">

    <!-- 有直播可放-->
    <iframe class="fit"
            id="video-iframe"
            allowfullscreen='true'
            allow="autoplay"
            :src="media_src"
            frameborder="0"
            marginwidth="0"
            marginheight="0"
            hspace="0"
            vspace="0"
            scrolling="no"
    ></iframe>

  </div>
</template>

<script setup>
import {watch, ref} from "vue";
import video from "src/core/video/video.js";
import url_add_param from "src/core/enter-params/util/index.js";
import {useRoute, useRouter} from "vue-router";


const props = defineProps({
  detail_info: {
    // 赛事详情
    type: Object,
    default: () => {},
  },
  refresh_time: {
    type: Number,
    default: 0
  }
});

const router = useRouter();
const route = useRoute();
const media_src = ref("");

/**
 * @Description:获取视频播放地址
 * @Author Cable
 * @param {object} match  赛事信息
 * @param {function} callback  回调函数
 */
const get_video_url = () => {
  // play_type  数据源类型 1 ：源视频 2：动画 3 ：演播室 4 ：主播 5：专题

  // 目标赛事视频url相关信息获取
  video.get_video_url(
      props.detail_info,
      { params: { play_type: 1 } },
      (show_type, url_src) => {
        // 未登录
        if (url_src === true && show_type === "no-login") {
          // this.is_limited = true
          // this.show_type = show_type
          return;
        }
        // let live_type = this.$get_media_icon_index(media_type)
        let live_type = 1;

        // 此处为最终处理后的视频url
        media_src.value =
            url_add_param(url_src, "video_type", 1) +
            `&live_type=${live_type}&csid=${props.detail_info.csid}&icons_right=163&pip_right=80`;
      }
  );
};



get_video_url()
</script>

<style lang="scss" scoped>
.video-iframe {
  height: 100%;
}


</style>