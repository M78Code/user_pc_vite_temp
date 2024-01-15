<!-- @Description: 上边tab组件  公告页面使用到 -->
<template>
    <div class="my-tabs">
        <div class="tabs-bar" :style="{ width: rightDistance ? '88%' : '97%' }">
            <div class="tabs-bar-nav a1" ref="scrollBox">
                <div class="tabs-tab"  v-for="(tab, index) in tabList" :key="index" ref="scrollItem"
                    :class="[tabIndex == index ? 'tabs-active' : '']" @click="changeTab(tab,index)">
                    {{ tab.nen }}
                </div>
            </div>
        </div>
        <!-- <div class="bg-height"></div> -->
        <div class="tabs-content">
            <slot></slot>
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    tabList: {
        type: Array,
        default: () => []
    },
    tabIndex: {
        type: Number,
        default: 0
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
    (n, o) => tab_move2(n, scrollBox.value),
    {
        immediate: true,
        deep: true
    }
)
function changeTab(tab,index) {
    emit('changeTab', tab,index)
}
</script>
<style lang="scss" scoped>
.my-tabs {
    position: relative;
    overflow: hidden;
    height: 50px;
    &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 6px;
        top: 44px;
        right: 0;
        // background-color: var(--q-gb-bg-c-6);
        background-color:#E2E2E2;
        border-bottom: 1px solid #ff7000;
    }
    .tabs-bar {
        padding: 0 0 0.04rem;
        width: 90%;
        padding-left: 0.2rem;
        transition: all 0.2s linear;
        height: 100%;
        line-height: 0.44rem;

        .tabs-bar-nav {
            display: flex;
            align-items: center;
            // height: 0.35rem;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none; // 去除滚动条火狐浏览器兼容性问题

            .tabs-tab {
                position: relative;
                text-align: center;
                font-size: 0.14rem;
              padding: 0 0.12rem;
                //margin-right: 0.24rem;
                min-width: fit-content;
              color: #8a8986;
              &:last-child{
                &:before{
                  display: none;
                }
              }
              &:before{
                content:'';
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                height: 0.12rem;
                width: 1px;
                background: #d9d9d9;
                
              }
                &.tabs-active {
                    font-weight: bold;
                  color: #1a1a1a;
                    &:after {
                        content: '';
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: absolute;
                        bottom: -0.05rem;
                        left: 50%;
                        transform: translate(-50%, 0);
                        background: #ffb001;
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
        top: 1.05rem;
        left: 0;
        right: 0;
        bottom: 0.56rem;
        // padding: 0 0.1rem;
        overflow-y: auto;
        // max-width: 3.78rem;
        // margin: 0 auto;
        :deep(.q-scrollarea) {
            height: 100%;
        }
    }
}
</style>

src/output/index.js