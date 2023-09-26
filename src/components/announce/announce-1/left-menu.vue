<!-- @Description: 公告栏、体育规则 左侧菜单组件 -->
<template>
    <!-- 左侧菜单内容 -->
    <div class="left-menu-content" :style="page_style">
        <q-scroll-area class="fit rule-scroll-area">
            <div class="cursor-pointer" v-for="(item, index) in data" :key="index" @click="tabs_click(item, index)">
                <div class="left-menu-title"
                    :class="{ active: tab_index == index, 'no-subtab': !item.subtab || item.subtab.length == 0 }">
                    <div>{{ item.title }}</div>
                    <q-icon v-icon="{ 'keyboard_arrow_up': 'icon-triangle', }" name="keyboard_arrow_up"></q-icon>
                </div>
                <!-- 左侧菜单列表 -->
                <div class="left-menu-list" :class="tab_index == index && 'active'">
                    <div class="left-menu-li" v-for="(items, idx) in item.subtab" :key="idx"
                        :class="{ 'active': sub_index == idx }" @click.stop="sub_click(items, idx)">
                        <div class="point"></div>
                        <span class>{{ items.title }}</span>
                    </div>
                </div>
            </div>
        </q-scroll-area>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { compute_css_variables } from "src/core/css-var/index.js"

const props = defineProps({
    data: {
        type: Array,
        default: [],
    }
})

const emits = defineEmits(['tabs_click', 'sub_click'])

const page_style = ref('')

page_style.value = compute_css_variables({ category: 'component', module: 'rule-left-menu' })

/** 一级菜单选择索引 */
const tab_index = ref(0)
/** 二级菜单选择索引 */
const sub_index = ref(0)

/**
 * @Description:切换一级菜单
 * @Author Cable
 * @param:item  切换的一级菜单对象
 * @param:index  切换的一级菜单索引
 * @return:
 */
function tabs_click(item, index) {
    tab_index.value = index;
    sub_index.value = 0;
    emits("tabs_click", item, index);
}
/**
 * @Description:切换二级菜单
 * @Author Cable
 * @param:item  切换的二级菜单对象
 * @param:index  切换的二级菜单索引
 * @return:
 */
function sub_click(item, index) {
    sub_index.value = index;
    emits("sub_click", item);
}

</script>
  
<style lang="scss" scoped>
.left-menu-content {
    width: 169px;
    padding-right: 14px;
    border-top: 1px solid var(--q-announce-left-menu-color-2);
    background: var(--q-gb-bg-c-11);
    color: var(--q-gb-t-c-6);

    &:after {
        content: "";
        position: absolute;
        width: 14px;
        height: 100%;
        top: 0;
        right: 0;
        border-left: 1px solid var(--q-announce-left-menu-color-2);
        border-right: 1px solid var(--q-announce-left-menu-color-2);
        background-color: var(--q-gb-bg-c-21);
    }

    :deep(.q-scrollarea__thumb) {
        width: 7px;
        right: -11px;
        background-color: var(--q-announce-left-menu-color-2) !important;
    }

    .left-menu-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        height: 34px;
        text-align: left;
        border-bottom: 1px solid var(--q-announce-left-menu-color-2);

        &.no-subtab {
            .q-icon {
                display: none;
            }
            &.active {
                border-right: 2px solid var(--q-gb-bd-c-11);
                background: var(--q-announce-left-menu-color-3);
            }
        }
        
        .q-icon {
            font-size: 16px;
            transition: transform 0.15s;
            transform: rotate(180deg);
            opacity: 0.5;
        }
        &:hover {
            background: var(--q-gb-bg-c-20);
            color: var(--q-gb-t-c-16);
        }

        .q-icon {
            font-size: 16px;
            transition: transform 0.15s;
            transform: rotate(180deg);
            opacity: 0.5;
            color: var(--q-announce-left-menu-color-1);
        }

        &.active {
            font-weight: 600;
            color: var(--q-gb-t-c-6);

            .q-icon {
                transform: rotate(0deg);
                opacity: 1;
                color: var(--q-gb-t-c-6);
            }
        }
    }

    .left-menu-list {
        overflow: hidden;
        max-height: 0px;
        transition: max-height 0.15s;
        background: var(--q-gb-bg-c-11);

        &:hover {
            color: var(--q-gb-t-c-6);

            .point {
                background: var(--q-gb-bg-c-17);
            }
        }

        &.active {
            max-height: 400px;
            border-right: 2px solid var(--q-gb-bd-c-11);
            background: var(--q-announce-left-menu-color-3);
            color: var(--q-gb-t-c-6);

            .point {
                background: var(--q-gb-bg-c-17);
            }
        }

        .left-menu-li {
            display: flex;
            align-items: center;
            height: 34px;

            &.active {
                font-weight: 600;
            }

            .point {
                margin: 0 15px;
                width: 4px;
                height: 4px;
                border-radius: 50%;
            }
        }

        /* 滚动条 */
        .rule-scroll-area .q-scrollarea__thumb {
            background: rgba(60, 63, 76, 0.3);
        }
    }
}
</style>
  