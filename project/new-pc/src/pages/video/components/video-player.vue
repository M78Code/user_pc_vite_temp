<template>
    <div class="video_wrap">
        <iframe
            id="video-iframe"
            class="video-iframe fit"
            :src="iframe_src"
            frameborder="0"
            marginwidth="0"
            marginheight="0"
            hspace="0"
            vspace="0"
            scrolling="no"
            allowfullscreen='true' allow="autoplay"
        ></iframe>
    </div>
</template>

<script setup>
import { ref } from "vue"
const iframe_src = ref(""); // 视频播放src
</script>


<style lang="scss" scoped>
.video_wrap {
  position: relative;
  height: 600px;
  .video-iframe {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
