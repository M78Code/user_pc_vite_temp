<template>
    <div class="screen-bet-container">
        <div class="screen-bet" v-show="!show_line">
            <div class="header">
                <div class="leading">
                    <IconBack />
                </div>
                <div class="title">
                    <span>法国</span>
                    <span class="score">0-0</span>
                    <span>葡萄牙</span>
                </div>
                <div class="actions" @click.stop="show_line_callback">
                    高清
                </div>
            </div>
            <div class="body">
                <ul class="actions-list">
                    <li @click="change_bet_status"><IconDetail /></li>
                    <li v-show="type == 'video'" @click="change_type('animation')"><IconAni /></li>
                    <li v-show="type == 'animation'" @click="change_type('video')"><IconLive /></li>
                    <li><IconDate /></li>
                </ul>
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
        <!-- 高清 -->
        <div class="line-container" @click.stop="show_line_callback">
            <div :class="['change-line', show_line ? 'line-ani' : '']" @click.stop>
                <ul >
                    <li :class="['line-item', select_line == 0 ? 'active' : '']" @click.stop="change_line(0)">高清一</li>
                    <li :class="['line-item', select_line == 1 ? 'active' : '']" @click.stop="change_line(1)">高清一</li>
                    <li :class="['line-item', select_line == 2 ? 'active' : '']" @click.stop="change_line(2)">高清一</li>
                </ul>
                <p class="desc">*视频卡顿或不清晰可自行调整线路</p>
            </div>
        </div>
        <!-- 详情弹窗 -->
        <div class="bet-container"  @click.stop="change_bet_status" :style="{
            'z-index': is_bet ?  '20':''
        }">
            <div :class="['bet', is_bet ? 'bet-ani' : '']" @click.stop>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import IconBack from "./components/back-icon.vue";
import IconInfo from "./components/info-icon.vue";
import IconExitScreen from "./components/exit-screen-icon.vue";
import IconDetail from "./components/detail-icon.vue";
import IconDate from "./components/date-icon.vue";
import IconLive from "./components/live-icon.vue";
import IconAni from "./components/ani.icon.vue"
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
/** 是否展示高清切换 */
const show_line = ref(false);
/** 选择的清晰度 */
const select_line = ref(0);
/** 是否是投注，投注显示详情 */
const is_bet = ref(false);

/** @type {import('vue').Ref<'video'|'animation'>} */
const type = ref('video');
/**
 * 清晰度弹窗
 */
const show_line_callback = () => {
    show_line.value = !show_line.value;
    console.log(show_line.value, "show_line.value");
}

/**
 * 修改清晰度
 * @param {*} index 
 */
const change_line = (index) => {
    select_line.value = index;
}

/**
 * 修改类型 - 动画/视频
 * @param {'video'|'animation'} value 
 */
const change_type = (value) => {
    type.value  = value;
}

const change_bet_status = () => {
    console.log(2222);
    is_bet.value = !is_bet.value;
}
</script>

<style lang="scss" scoped>
.screen-bet-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    .line-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        right: 0;
    }
    .change-line {
        background: rgba($color: #000000, $alpha: .88);
        position: absolute;
        height: 100%;
        right: -270px;
        top: 0;
        width: 270px;
        transition: transform .3s linear;
        transform: translateX(0);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .line-item {
            width: 88px;
            height: 36px;
            border-radius: 8px;
            border: 1px solid var(--border-color-border-primary, rgba(255, 255, 255, 0.04));
            margin-bottom: 16px;
            color: var(--text-color-text-subtle, rgba(255, 255, 255, 0.50));
            text-align: center;
            line-height: 36px; /* 125% */
            transition:  .3s linear;
            
        }

        .active {
            border-color: #127DCC;
            color: #127DCC;
        }
        .desc {
            color: rgba(255, 255, 255, 0.60);
            margin-top: 74px;
        }
    }
    .line-ani {
        transform: translateX(-100%);
    }

    
}
.screen-bet {
    width: 100vw;
    height: 100vh;
    background: gray;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 20px 36px 16px 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
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

    .body {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        .actions-list {
            li {
                margin-bottom: 16px;
            }
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
.bet-container {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
}

.bet {
    width: 375px;
    height: 100%;
    z-index: 99;
    position: absolute;
    right: -375px;
    background: red;
    transition:right .5s linear;
    transition-delay: .2s;
}
.bet-ani {
    right: 0;
}
</style>