<!-- @Description: 上边tab组件  公告页面使用到 -->
<template>
    <div class="my-tabs">
        <div class="tabs-bar" :style="{ width: rightDistance ? '88%' : '97%' }">
            <div class="tabs-bar-nav a1" ref="scrollBox">
                <div class="tabs-tab" v-for="(tab, index) in tabList" :key="index" ref="scrollItem"
                    :class="[tabIndex == tab.index ? 'tabs-active' : '']" @click="changeTab(tab)">
                    {{ tab.name }}
                </div>
            </div>
        </div>
        <div class="bg-height"></div>
        <div class="tabs-content">
            <slot></slot>
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue'
import { utils } from 'src/core/index.js';

const props = defineProps({
    tabList: {
        type: Array,
        default: () => []
    },
    tabIndex: {
        type: Number,
        default: -1
    },
    rightDistance: {
        type: Boolean,
        default: true
    },
})

const emit = defineEmits(['changeTab'])

const scrollBox = ref(null)
// 监听 tabIndex 下标变化
watch(
    () => props.tabIndex,
    (n, o) => utils.tab_move2(n, scrollBox.value),
    {
        immediate: true,
        deep: true
    }
)
function changeTab(tab) {
    emit('changeTab', tab)
}
</script>
<style lang="scss" scoped>
.my-tabs {
    position: relative;
    overflow: hidden;

    .tabs-bar {
        padding: 0 0 0.04rem;
        width: 90%;
        padding-left: 0.2rem;
        transition: all 0.2s linear;

        .tabs-bar-nav {
            display: flex;
            align-items: center;
            height: 0.35rem;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none; // 去除滚动条火狐浏览器兼容性问题

            .tabs-tab {
                position: relative;
                text-align: center;

                font-size: 0.14rem;

                margin-right: 0.24rem;
                min-width: fit-content;

                &.tabs-active {

                    font-weight: bold;

                    &:after {
                        content: '';
                        width: 0.2rem;
                        height: 0.03rem;
                        border-radius: 0.08rem;
                        position: absolute;
                        bottom: -0.05rem;
                        left: 50%;
                        transform: translate(-50%, 0);
                    }
                }

                &:nth-last-child(1) {
                    padding-right: 0.1rem;

                    &:after {
                        left: 38%;
                    }
                }
            }
        }
    }

    .bg-height {

        height: 0.08rem;
        width: 110%;
        position: relative;
        left: -0.16rem;
    }

    .tabs-content {
        position: fixed;
        top: 0.91rem;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 0.1rem;

        overflow-y: auto;
        max-width: 3.78rem;
        margin: 0 auto;

        :deep(.q-scrollarea) {
            height: 100%;
        }
    }
}
</style>

