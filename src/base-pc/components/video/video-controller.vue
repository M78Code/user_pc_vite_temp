<template>
    <div class="video-controller">
        <div class="refresh">
            <img v-if="!props.macth_info.varl" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/virtual-ref.svg`" alt="" class="refresh-icon" @click="handleEmit('refresh')"/>
        </div>
        <div class="right-actions">
            <!-- 清晰度 -->
            <div class="clarity">
                <span>高清1</span> 
                <div class="type-list-bg" v-show="is_show_type_list">
                <!-- 线路列表 -->
                <div class="type-list">
                    <!-- 高清 -->
                    <div class="video-type-but"  @click="send_video_type_click(1)">{{get_video_clarity_name2(1)}}</div>
                    <!-- 流畅 -->
                    <div class="video-type-but" @click="send_video_type_click(2)">{{get_video_clarity_name2(2)}}</div>
                </div>
                <img class="close-btn" @click="is_show_type_list = false" src="~public/image/common/png/close_white.png">
                </div>
            </div>
            <!-- 不知道啥功能 -->
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/video_controller/icon_live.png`" alt="" class="item" @click="handleEmit('live')">
            <!-- 倍速 -->
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/video_controller/icon_speed.png`" alt="" class="item" @click="handleEmit('speed')">
            <ul class="switch" >
                <li :class="['switch-item', type == 'video' ? 'select':'unselect']" @click="handleEmit('video')">视频</li>
                <li :class="['switch-item', type == 'animation' ? 'select':'un-select']" @click="handleEmit('animation')">动画</li>
            </ul>
            <img class="item" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/video_controller/icon_exit.png`" alt="" @click="handleEmit('exit_full_screen')"/>
        </div>
    </div>

    
</template>

<script setup>
// 视频控制器，只做公共组件video页面的控制器
import { LOCAL_PROJECT_FILE_PREFIX, MatchDetailCalss, get_media_icon_index } from "src/output";
import { computed, ref, watch } from "vue";
import lodash from "lodash";
const emits = defineEmits(['handleType'])
const props = defineProps({
    params: {
        type: Object,
        default: () => ({
            play_type: null,
        })
    },
    // 赛事信息
    macth_info: {
        type: Object,
        default: () => ({})
    }
});
const vx_play_media = MatchDetailCalss.play_media;
const get_video_clarity_name2 = (num) => {
      let  type  = lodash.get('$route.params.play_type')  || get_media_icon_index(vx_play_media.media_type)
      let text = ""
    if(type == 1){
        if(num == 1){
        text = i18n_t('video.flv')
        }else{
        text = i18n_t('video.m3u8')
        }
    }else{
        if(num == 1){
        text = i18n_t('video.clarity1')
        }else{
        text = i18n_t('video.clarity2') 
        }
    }
    return text
};
// 是否显示鼠标移入控制器
const show = ref(false);
/**@type {import('vue').Ref<"video"|"animation">} */
const type = ref("video");

/** true 大屏 false 中屏 */
const is_full_screen = ref(props.params.play_type == 2);
// 显示切换清晰度
const is_show_type_list = ref(false);

watch(() => props.params.play_type, (value) => {
    is_full_screen.value  = value == 2;
})
/**
 * 
 * @param {'live'|'speed'|'video'|'animation'|'exit_full_screen'|'refresh'|'clarity'} value 
 */
const handleEmit = (value) => {
    if (value == "animation" || value == "video") {
        type.value = value;
    }
    emits('handleType',value)
}

/**
 * @description: 给iframe发送全局视频类型变化事件
 * @param {int} type 1:高清flv, 2:流畅m3u8
 * @return {*}
 */
const send_video_type_click = (type) => {
    window.video_type = type;
    is_show_type_list.value = false;
    
    video_type.value = type;
    handleEmit('clarity', type)

}
</script>

<style lang="scss" scoped>
.video-controller {
    width: 100%;
    height: 42px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    // z-index: 9;
    justify-content: space-between;
    .refresh {
        margin-left: 20px;
        .refresh-icon {
            width: 24px;
            height: 24px;
        }
    }

    .right-actions {
        display: flex;
        align-items: center;
        white-space: nowrap;
        padding-right: 20px;
        position: relative;
        z-index: 9999;
        .clarity{
            cursor: pointer;
            font-size: 12px;
            padding: 4px 6px;
            border-radius: 4px;
            color: #fff;
            border: 1px solid #FFF;
        }
        .item {
            margin-left: 16px;
            width: 24px;
            height: 24px;
            cursor: pointer;
        }

        .switch {
            cursor: pointer;

            margin-left: 16px;
            font-size: 12px;
            display: flex;
            align-items: center;
            height: 20px;
            // border: ;
            .switch-item {
                display: flex;
                padding: 4px;
                pointer-events: none;
            }
            .select {
                border-radius: 4px 0px 0px 4px;
                background: #FFF;
                color: #000;
            }
            .un-select {
                color: #fff;
                border-radius: 0px 4px 4px 0px;
                border-top: 1px solid #FFF;
                border-right: 1px solid #FFF;
                border-bottom: 1px solid #FFF;
                background: rgba(0, 0, 0, 0.50);
            }
        }
    }
}
</style>