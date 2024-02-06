<template>
    <div class="screen-bet">
        <div class="header">
            <div class="leading">
                <IconBack />
            </div>
            <div class="title">
                <span>法国</span>
                <span class="score">0-0</span>
                <span>葡萄牙</span>
            </div>
            <div class="actions">
                高清
            </div>
        </div>
        <div class="body">

        </div>

        <div class="footer">
            <IconInfo />
            <div class="actions">
                <IconExitScreen />
            </div>
        </div>
        <!-- 定位在右侧组件 -->
        <div class="right">
            <!-- 详情插槽 -->
            <slot name="details"></slot>
            <div class="bet-container" v-if="false">
                <!-- 投注插槽 -->
                <slot name="bet"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import IconBack from "./components/back-icon.vue";
import IconInfo from "./components/info-icon.vue";
import IconExitScreen from "./components/exit-screen-icon.vue"
/** @type {{type: 'animation' | 'video'}} */
const props = defineProps({
    /** 全屏的是动画还是视频 */
    type: {
        type: String,
        default: ""
    }
});
/** 视频 */
const is_video = computed(() => props.type == "video");
/** 动画 */
const is_animation = computed(() => props.type == "animation");
/** 控制是否显示投注弹窗 */
const status = ref(false);
</script>

<style lang="scss" scoped>
.screen-bet {
    width: 100vw;
    height: 100vh;
    background: #000;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    padding: 20px 36px 16px 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .header {
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .leading {
            display: flex;
            align-items: center;
        }

        .title {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            color: #fff;

            .score {
                padding: 0 16px;
            }
        }

        .actions {
            display: flex;
            align-items: center;
            padding: 0 4px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 4px;
            border: 1px solid #FFF;
            color: #fff;
        }

    }

    .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .actions {}
    }

    .right {
        position: absolute;
        right: 0;
        top: 0;
    }
}

</style>