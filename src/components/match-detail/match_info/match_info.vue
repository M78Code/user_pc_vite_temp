<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事详情
-->
<template>
  <div ref="wrap_info">
    <div class="wrap-info relative-position">
      <!-- 右侧 窄版start ----------->
      <match-video :match_info="match_info" :background_img="background_img" :refresh_time="refresh_time" />
      <!-- 右侧 窄版 end   ----------->
    </div>
  </div>
</template> 

<script>
import { mapGetters } from "vuex";
import match_video from "src/project/yabo/components/match_details/match_info/match_video.vue";
import info from "src/project/yabo/components/match_details/match_info/info";

export default {
  components: {
    "match-video": match_video,
    info,
  },
  props: {
    screen: String,
    match_info: Object,
    background_img: String,
    refresh_time: Number
  },
  computed: {
    ...mapGetters({
      vx_play_media: "get_play_media",
      vx_layout_cur_page: "get_layout_cur_page",
      vx_is_invalid: "get_is_invalid",
      vx_details_params: "get_match_details_params",
    }),

    media_useful() {
      let { media_type } = this.vx_play_media;
      let { mms, mvs } = this.match_info;

      return (
        (media_type == "animation" && mvs == 1) ||
        (media_type == "video" && mms == 2)
      );
    },

    reset_content() {
      let { time, mid } = this.vx_play_media;
      return `${mid}_${time}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-info {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>