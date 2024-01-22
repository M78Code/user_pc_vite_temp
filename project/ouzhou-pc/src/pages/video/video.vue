<template>
  <div class="video-wrap">
    <load-data class="fit" :state="load_data_state" >
        <!-- <video-header v-if="route.params.video_size != 1" :refresh_loading="refresh_loading" :match_info="match_info"
          @refresh="refresh_data" /> -->
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
          allowfullscreen="true"
          allow="autoplay"
        ></iframe>
      
    </load-data>

    <!-- <video-header v-if="route.params.video_size != 1" :refresh_loading="refresh_loading" :match_info="match_info"
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
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import LoadData from "src/base-pc/components/load-data/load-data.vue"
import VideoHeader from "src/base-pc/components/video/video-header.vue"
import video from "src/core/video/video.js";
import {
  MatchDataWarehouse_PC_Detail_Common as MatchDataWarehouseInstance, UserCtr,
} from "src/output/index.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import {api_match_list } from "src/api/index";
import url_add_param from "src/core/enter-params/util";
const route = useRoute();
const load_data_state = ref('loading');
const refresh_loading = ref(false);
const match_info = ref({});
const params = computed(() => route.params);
const media_src = ref("");
const iframe_loading = ref(true);

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
      console.log(media_src.value, "media_src.value");
    }
  );
};

const init = async() => {
  const cuid = UserCtr.get_cuid();
  try {
    const res = await api_match_list.get_detail_data({
      mid: params.value.mid,
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
  console.log(params.value, "route.params.video_size");
})
</script>


<style lang="scss" scoped>
.video-wrap {
  padding-right: 14px;
  .video-iframe {
    width: 100%;
    height: 100%;
  }
}
</style>