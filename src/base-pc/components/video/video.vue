<template>
  <div class="video-wrap">
    <load-data class="fit" :state="load_data_state">
      <!-- <video-header v-if="props.params.video_size != 1" :refresh_loading="refresh_loading" :match_info="match_info"
          @refresh="refresh_data" /> -->
      <div class="container">
        <iframe id="video-iframe" :class="['video-iframe fit', is_full_screen ? 'full-screen' : '']" :src="media_src"
          frameborder="0" marginwidth="0" marginheight="0" hspace="0" vspace="0" scrolling="no" allowfullscreen="true"
          allow="autoplay"></iframe>
        <!-- <video_type_ctr @mouseenter="video_enter" v-show="is_full_screen" :ctr_data={ video_type: 1 } :is_video_hover="true"
          :video_fullscreen_disabled="false" :match_info="match_info" :is_esports="false"></video_type_ctr> -->
      </div>
    </load-data>
    <video_type_ctr
          v-show="is_video_hover"
          :ctr_data={video_type:1}
          :is_video_hover="is_video_hover"
          :video_fullscreen_disabled="false"
          :match_info="match_info"
          :is_esports="false"
      ></video_type_ctr>
    <!-- <video-header v-if="props.params.video_size != 1" :refresh_loading="refresh_loading" :match_info="match_info"
          @refresh="refresh_data" /> -->
    <!-- <iframe
          v-if="media_src"
          id="video-iframe"
          class="video-iframe fit"
          :src="media_src"
          frameborder="0"
          marginwidth="0"
          marginheight="0"
          hspace="0"
          vspace="0"
          scrolling="no"
          allowfullscreen="true"
          allow="autoplay"
        ></iframe> -->
  </div>
</template>

<script setup>
import { useRoute, useRouter, } from "vue-router";
import { ref, onMounted, computed, nextTick, onUnmounted } from "vue";
import LoadData from "src/base-pc/components/load-data/load-data.vue"
import video from "src/core/video/video.js";
import {
  UserCtr,
} from "src/output/index.js";
import { api_match_list } from "src/api/index";
import url_add_param from "src/core/enter-params/util";
import video_type_ctr from "src/core/video/video_type_ctr.vue";

const props = defineProps({
  params: {
    type: Object,
    default: () => ({
      play_type: null, // 播放类型，2 -> 全屏 1 -> 中屏
      mid: null, // 赛事id
    })
  }
})

const route = useRoute();
const router = useRouter();
const load_data_state = ref('loading');
const refresh_loading = ref(false);
const match_info = ref({});
const media_src = ref("");
const iframe_loading = ref(true);
const is_full_screen = ref(false);
const is_video_hover = ref(true);
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
    match_info.value,
    { params: { play_type: 1 } },
    (show_type, url_src) => {
      console.log(url_src, show_type, "url_src");
      // 未登录
      if (url_src === true && show_type === "no-login") {
        // this.is_limited = true
        // this.show_type = show_type
        load_data_state.value = "empty";
        return;
      }

      // let live_type = this.$get_media_icon_index(media_type)
      let live_type = 1;

      // 此处为最终处理后的视频url
      media_src.value =
        url_add_param(url_src, "video_type", 1) +
        `&live_type=${live_type}&csid=${match_info.value.csid}&icons_right=163&pip_right=80`;
      iframe_loading.value = false;
      load_data_state.value = "data";
      nextTick(() => {
        // 如果是全屏，进入全屏

      })
      console.log(media_src.value, "media_src.value");
    }
  );
};

const video_enter = () => {

}


/**
 * @Description 浏览器全屏
 * @param {undefined} undefined
 */
function browser_full_screen() {
  let video_dm = document.documentElement;
  let rfs = video_dm.requestFullScreen || video_dm.webkitRequestFullScreen || video_dm.mozRequestFullScreen || video_dm.msRequestFullScreen;
  if (rfs) {
    is_full_screen.value = true;
    rfs.call(video_dm);
  }
}

const init = async () => {
  const cuid = UserCtr.get_cuid();
  if (props.params.play_type == 2) {
    console.log(props.params.play_type, "props.params.play_type");
    browser_full_screen();
  }
  try {
    const res = await api_match_list.get_detail_data({
      mid: props.params.mid,
      cuid
    });
    console.log(res, "详情");
    match_info.value = res.data;
    get_video_url();

  } catch (error) {

  }
}


onMounted(() => {
  // csid: "1"
  // mid: "287946322483154946"
  // play_type: "1"
  // tid: "1682748461414224369"
  // video_size: "0"
  init();
  console.log(props.params, "props.params.video_size");
})


/**
   * @Description:退出全屏  返回上一个页面
   * @return {undefined} undefined
   */
function exit_full_screen(size) {
  const { mid, tid, csid } = match_info.value;
  // 如果是从详情页进入大屏返回详情页
  if (is_full_screen.value) {
    router.push({
      name: 'details',
      params: {
        mid,
        tid,
        csid
      }
    })
    sessionStorage.setItem('auto_play_media', '1');
  } 
  
}

onUnmounted(() => {
  exit_full_screen();
})

</script>


<style lang="scss" scoped>
.video-wrap {
  padding-right: 14px;
  height: 100%;

  .video-iframe {
    width: 100%;
    height: 100%;
  }
}

.container {
  width: 100%;
  height: 100%;
}

.full-screen {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}
</style>