<!--
 * @Description: 系统将在30分钟后进入维护，造成不便，深表歉意！
-->
<template>
    <div class="tip-content" :class="is_iframe ? 'tip-right' : 'tip-left'" @click="set_colse_tips_status"
        v-if="is_colse_tips">
        <div class="content-wrap relative-position">
            <div class="yb-icon-triangle"></div>
            <!-- 此版面现实的所有直播内容仅供参考........ -->
            <div class="content">{{ t('tips.tips_site').replace('%s', minute) }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { t } from "src/boot/i18n";

import store from "src/store-redux/index.js";
import utils from "src/core/utils/utils.js"
import { get_remote_time } from "src/core/formart/module/format-time.js"



/** 国际化 */
;

/** 是否内嵌 */
const is_iframe = ref(utils.is_iframe)

/** 定时器 */
const countDownTimer = ref(null)
/** 清除全部定时器 */
function clear_timer() {
    if (countDownTimer.value) {
        clearTimeout(countDownTimer.value)
        countDownTimer.value = null
    }
}
/** 钩子触发 */
onUnmounted(clear_timer)


/** 维护提示状态 */
const is_colse_tips = ref(false)
/**
 * 设置维护提示状态
 */
function set_colse_tips_status(state = false) {
    is_colse_tips.value = state
    if (!state) clear_timer()
}

/** 维护提示时间 */
const minute = ref(0)
/** stroe仓库 */
const store_data = store.getState()
const unsubscribe = store.subscribe(() => {
    user_info.value = store_data.userReducer.user_info
})
/** 销毁监听 */
onUnmounted(unsubscribe)
/** 
 * 用户信息
 * src/store-redux/module/user-info.js
 */
const user_info = ref(store_data.userReducer.user_info)

/**
 * 计算维护提示时间
 */
function compute_colse_tips_time() {
    /** 获取与服务器的修正时间 */
    const curTime = get_remote_time()
    const { maintainTime } = user_info.value
    if (maintainTime) {
        const serverTimer = Number(maintainTime),
            countDown = Math.floor((serverTimer - curTime) / 1000 / 60);
        if (countDown > 0) {
            set_colse_tips_status(true)
            minute.value = countDown
        }
    }
    if (is_colse_tips.value) {
        countDownTimer.value = setTimeout(set_colse_tips_status, 60000);
    }
}
onMounted(compute_colse_tips_time)

</script>

<style lang="scss" scoped>
.tip-content {
    position: absolute;
    top: 55px;
    width: 130px;
    z-index: 1200;

    &.tip-left {
        left: 105px;
    }

    &.tip-right {
        top: 15px;
        right: 120px;
    }

    .yb-icon-triangle {
        position: absolute;
        width: 16px;
        height: 8px;
        top: -8px;
        left: 0px;
    }

    .content-wrap {
        color: #fff;
        padding: 2px 3px;
        border-radius: 3px;
        border-top-left-radius: 0;
    }
}
</style>