<template>
    <div class="action">
        <div class="quick-bet-container">
            <!-- public\ouzhou-pc\image\video_controller\beautiful_video_icon.svg -->
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/video_controller/quick_bet.svg`" alt="" class="icon"/>
            <p class="text">快速投注</p>
        </div>
        <div class="beautiful-video-container">
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/video_controller/beautiful_video_icon.svg`" alt=""  class="icon"/>
            <p class="text">精彩回放</p>
        </div>
    </div>
</template>

<script setup>
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output';
</script>

<style lang="scss" scoped>
.quick-bet-container {
    display: flex;
    width: 112px;
    height: 32px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background:  #FF7000;
    font-size: 14px;
}
.beautiful-video-container {
    display: flex;
    width: 112px;
    height: 32px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #FF7000;
    background: rgba(255, 112, 0, 0.10);
    font-size: 14px;
}

.icon {
    width: 18px;
    height: 18px;
}
.text {
    margin-left: 10px;
}
</style>