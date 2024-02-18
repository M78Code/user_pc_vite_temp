<!--
 * @Description: 视频大屏版页面 "/video/:mid/:tid/:csid/:play_type/:video_size",
-->
<template>
  <div class="video_wrap">
   <video_player :mid="mid" :show_type_default="'play-video'"/>
  </div>
</template>

<script setup>
import video_player from "src/base-pc/components/match-detail/match_info/match_video.vue";
import { useRoute } from "vue-router";
import { computed } from "vue"
const route = useRoute(); 

const mid = computed(() => route.params.mid);
</script>


