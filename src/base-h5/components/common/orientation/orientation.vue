<template>
    <div class="orientation" v-if="!orientation">
        <img :src="imgUrl" alt="" class="img">
        {{ i18n_t('common.hengping_tip') }}
    </div>
</template>

<script setup>
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output';
import { onMounted, onUnmounted,ref } from 'vue';
import OrientationSubscrbe from './orientation-subscribe.js'
const imgUrl = `${LOCAL_PROJECT_FILE_PREFIX}/image/app-h5/hengpin.svg`
const orientation = ref(true);

/**
 * 
 * @param {*} value 
 * @param {boolean} status 销毁进入，优先判断，如果时横屏，直接显示遮罩
 */
const subscribe = (value, status = true) => {
    if(!status) {
        listener();
        return;
    }
    console.log(value, "屏幕旋转");
    if (!value) {
        orientation.value = false;
    }
}

const listener = () => {
    console.log(window.screen.orientation, isFullScreen(),OrientationSubscrbe.instance.status, "设备方向");
    let angle = lodash.get(window,'screen.orientation.angle',0)
    switch (angle) {
    case 90:
    case -90:
        OrientationSubscrbe.instance.notify(false);

        // 不是视频全屏， 不支持旋转
        if (!OrientationSubscrbe.instance.status) {
            orientation.value = false;
        }
        break;
    default:
        orientation.value = true;
        OrientationSubscrbe.instance.notify(true);

        break;
    }
}

// 判断是否全屏
const isFullScreen = () => {
  return document.fullscreenElement !== null || document.webkitFullscreenElement !== null || document.mozFullScreenElement !== null || document.msFullscreenElement !== null;
}

OrientationSubscrbe.instance.listener(subscribe)

onUnmounted(() => {
    window.removeEventListener('orientationchange', listener)
})

onMounted(() => {
    listener();
    window.addEventListener('orientationchange', listener)
})
</script>

<style scoped lang="scss">

.orientation {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #666;
    color: #fff;
    font-size:14px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    .img{
        width: 90px;
        height: 108px;
        margin-bottom: 10px;
    }
}
</style>