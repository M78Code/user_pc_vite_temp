<!--
 * @Author: Cable
 * @Date: 2020-09-04 15:08:19
 * @Description: 视频大屏版播放器组件
-->

<template>
  <div class="video-iframe relative-position" :style="{height:video_height}" @mouseenter="video_enter" @mouseleave="video_leave" >

    <video-type-ctr 
      class="is-video-page" 
      ref="video_type_ctr"
      :ctr_data="ctr_data"
      :is_video_hover="is_video_hover"  
      :video_fullscreen_disabled="video_fullscreen_disabled"
      :match_info="match_info"
      :is_esports="is_esports"
      :icons_right="icons_right"
    ></video-type-ctr>
    <!-- <div v-if="move && current_replay" class="video-replay-ctr">
      <icon size="14px" color="#FFFFFF" name="icon-small" @click="changeVideo2Live" />
    </div> -->
    <!-- 有直播可放-->
    <iframe class="fit" v-if="show_type == 'play-video' && !is_video_pause" :style="$route.params.play_type == 2 ? `max-width:${video_max_width}px;` : ''" id="video-iframe" allowfullscreen='true' allow="autoplay"  :src="media_src"
    frameborder="0"
    marginwidth="0"
    marginheight="0"
    hspace="0"
    vspace="0"
    scrolling="no"
    ></iframe>

  </div>
</template>

<script>

</script>

<style lang="scss" scoped>

</style>