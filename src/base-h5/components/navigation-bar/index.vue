<template>
    <div class="px-6 py-5 navigation-bar">
        <div class="navigation-bar-left">
            <div class="navigation-bar-close" @click="router.back()">
                <div class="img" :style="compute_css('menu-go-back-icon')"></div>
            </div>
        </div>
        <div v-if="centerContentType === 'text'" class="navigation-bar-center font-weight-bold text-no-wrap">
            <span>{{ title }}</span>
        </div>
        <div v-else class="navigation-bar-center navigation-bar-center-slot">
            <slot name="center"></slot>
        </div>
        <div class="navigation-bar-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script setup>
import { i18n_t, compute_css } from "src/core/index.js";
import { useRouter,useRoute } from "vue-router";

const router = useRouter();

defineProps({
    centerContentType: {
        type: String,
        default: 'text' // switch (顶部菜单切换) select（顶部选择）都使用slot方式  text（顶部title） 使用直接展示
    },
    title: {
        type: String,
        default: '请在组件中设置title值'
    }
})
</script>
<style scoped lang="scss">
// 组件样式
.navigation-bar {
    max-height: 60px;
    height: 44px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #F2F2F6;
    &-close {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding-left: 14px;
        .img {
            height: 20px;
            width: 12px;
        }
    }
    &-center, &-left, &-right {
        flex: 1;
        display: flex;
        align-items: center;
       
    }
    &-center {
        justify-content: center;
        overflow: hidden;
        span {
            font-size: 18px;
            width: 100%;
            overflow: hidden;
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
        }
    }
    &-left {
        justify-content: flex-start;
    }
    &-right {
        justify-content: flex-end;
    }
}
</style>