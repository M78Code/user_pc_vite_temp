<!-- @Description: 公告栏、体育规则 左侧菜单组件 -->
<template>
    <!-- 左侧菜单内容 -->
    <div class="left-menu-content">
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

const props = defineProps({
    data: {
        type: Array,
        default: [],
    }
})

const emits = defineEmits(['tabs_click', 'sub_click'])

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
    border-top: 1px solid var(--qq--announce-left-menu-border-color1);
    background: var(--qq--announce-left-menu-bg-color1);
    color: var(--qq--announce-left-menu-text-color1);

    &:after {
        content: "";
        position: absolute;
        width: 14px;
        height: 100%;
        top: 0;
        right: 0;
        border-left: 1px solid var(--qq--announce-left-menu-border-color1);
        border-right: 1px solid var(--qq--announce-left-menu-border-color1);
        background-color: var(--qq--announce-left-menu-bg-color2);
    }

    ::v-deep .q-scrollarea__thumb {
        width: 7px;
        right: -11px;
    }

    .left-menu-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        height: 34px;
        text-align: left;
        border-bottom: 1px solid var(--qq--announce-left-menu-border-color1);

        &.no-subtab {
            &.active {
                border-right: 2px solid var(--qq--announce-left-menu-border-color2);
                background: var(--qq--announce-left-menu-bg-color3);
            }
        }

        &:hover {
            background: var(--qq--announce-left-menu-border-color3);
            color: var(--qq--announce-left-menu-text-color2);
        }

        &.no-subtab {
            .q-icon {
                display: none;
            }
        }

        .q-icon {
            font-size: 16px;
            transition: transform 0.15s;
            transform: rotate(180deg);
            opacity: 0.5;
            color: var(--qq--announce-left-menu-text-color3);
        }

        &.active {
            font-weight: 600;
            color: var(--qq--announce-left-menu-text-color4);

            .q-icon {
                transform: rotate(0deg);
                opacity: 1;
                color: var(--qq--announce-left-menu-text-color4);
            }
        }
    }

    .left-menu-list {
        overflow: hidden;
        max-height: 0px;
        transition: max-height 0.15s;
        background: var(--qq--announce-left-menu-bg-color4);

        &:hover {
            color: var(--qq--announce-left-menu-text-color4);

            .point {
                background: var(--qq--announce-left-menu-bg-color5);
            }
        }

        &.active {
            max-height: 400px;
            border-right: 2px solid var(--qq--announce-left-menu-border-color2);
            background: var(--qq--announce-left-menu-bg-color6);
            color: var(--qq--announce-left-menu-text-color4);

            .point {
                background: var(--qq--announce-left-menu-bg-color5);
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
  