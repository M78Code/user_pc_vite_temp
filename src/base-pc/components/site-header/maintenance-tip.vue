<!--
 * @Description: 系统将在30分钟后进入维护，造成不便，深表歉意！
-->
<template>
    <div class="tip-content" :class="is_iframe ? 'tip-right' : 'tip-left'" @click="set_colse_tips_status"
        v-if="is_colse_tips">
        <div class="content-wrap relative-position">
            <div class="yb-icon-triangle"></div>
            <!-- 此版面现实的所有直播内容仅供参考........ -->
            <div class="content">{{ i18n_t('tips.tips_site').replace('%s', minute) }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { i18n_t } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { get_remote_time } from "src/output/index.js"
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
/** 是否内嵌 */
const is_iframe = ref(utils_info.is_iframe)

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

/**
 * 计算维护提示时间
 */
function compute_colse_tips_time() {
    /** 获取与服务器的修正时间 */
    const curTime = get_remote_time()
    const { maintainTime } = UserCtr.get_user()
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
        color: var(--q-gb-t-c-1);
        padding: 2px 3px;
        border-radius: 3px;
        border-top-left-radius: 0;
    }
}
</style>