<template>
    <!-- 禁止触摸滚动 -->
    <div class="screen-bet-container" @touchmove.stop>
        <!-- 视频/动画插槽 -->
        <slot />
        <div class="screen-bet" v-show="!show_line"  v-if="is_full_screen">
            <div class="header">
                <div class="leading">
                    <IconBack />
                </div>
                <div class="title" v-show="!is_bet">
                    <span>{{ props.team_score_detail?.mhn }}</span>
                    <span class="score">{{ props.team_score_detail?.msc }}</span>
                    <span>{{ props.team_score_detail?.man }}</span>
                </div>
                <div class="actions" @click.stop="show_line_callback">
                    高清
                </div>
            </div>
            <div class="body" v-show="!is_bet">
                <ul class="actions-list">
                    <li @click="change_bet_status"><IconDetail /></li>
                    <li v-show="type == 'video'" @click="change_type('animation')"><IconAni /></li>
                    <li v-show="type == 'animation'" @click="change_type('video')"><IconLive /></li>
                    <li><IconDate /></li>
                </ul>
            </div>

            <div class="footer" v-show="!is_bet">
                <IconInfo />
                <div class="actions">
                    <IconExitScreen @click="handle_exit"/>
                </div>
            </div>
        </div>
        <!-- 高清 -->
        <div class="line-container" @click.stop="show_line_callback"  v-if="is_full_screen">
            <div :class="['change-line', show_line ? 'line-ani' : '']" @click.stop>
                <ul >
                    <li :class="['line-item', select_line == index ? 'active' : '']"
                        @click.stop="change_line(index)" v-for="(item, index) in props.play_type_list" :key="index">
                        {{ i18n_t(item.name) }}
                    </li>
                </ul>
                <p class="desc">*视频卡顿或不清晰可自行调整线路</p>
            </div>
        </div>
        <!-- 详情弹窗 -->
        <div class="bet-container"  @click.stop="change_bet_status"  v-if="is_full_screen" :style="{
            'z-index': is_bet ?  '20':''
        }">
            <div :class="['bet', is_bet ? 'bet-ani' : '']" @click.stop>
                <!-- 详情下注弹窗 -->
                <slot name="bet" />
                <!-- 直播中的赛事 -->
                <slot name="live" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
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
    },
    // 视频清晰度
    play_type_list: {
        type: Array,
        default: () => ([
            {name: "video.flv"},
            {name: "video.m3u8"}
        ])
    },
    // 当前播放的索引
    current_play_type: {
        type: Number,
        default: 0
    },
    // 是否是全屏
    is_full_screen: {
        type: Boolean,
        default: false
    },
    // 比分信息
    team_score_detail: {
        type: Object,
        default: () => ({})
    }
});

const emits = defineEmits(['exit', 'switch_type'])
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

watch(() => props.current_play_type, (value) => {
    select_line.value = value;
})
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
    emits('switch_type', index == 0 ? 1 : 2)
}

/**
 * 修改类型 - 动画/视频
 * @param {'video'|'animation'} value 
 */
const change_type = (value) => {
    type.value  = value;
}

/**
 * 修改投注弹窗状态
 */
const change_bet_status = () => {
    is_bet.value = !is_bet.value;
}

/**
 * 退出全屏
 */
const handle_exit = ()=> {
    emits('exit')
}
</script>

<style lang="scss" scoped>
.screen-bet-container {
    position: relative;
    width: 100%;
    height: 100%;
    // z-index: 999;
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
            font-size: 16px;
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
            font-size: 16px;
        }
    }
    .line-ani {
        transform: translateX(-100%);
    }

    
}
.screen-bet {
    width: 100%;
    height: 100%;
    // background: gray;
    top: 0;
    left: 0;
    z-index: 10;
    // padding: 20px 36px 16px 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    .header {
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:  20px 36px 0 36px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.87) 65.18%, #000 100%, #000 100%);
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
        padding: 0 36px 0 36px;

        .actions-list {
            li {
                margin-bottom: 16px;
            }
        }
    }

    .footer {
        padding:  0 36px 16px 36px;
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