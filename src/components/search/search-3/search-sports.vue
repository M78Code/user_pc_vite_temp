<!-- @Description: 搜索球类 -->

<template>
    <div class="sports-wrap" @click.stop>
        <!-- 球类导航 -->
        <div class="sports-tab">
            <tab :is_show_line="true" :is_show_btn="true" :list="sports_list" :padding="10" @onclick="tab_click"
                :currentIndex="tab_index" ref="tab" />
        </div>
        <!-- 今日 -->
        <div class="item" @click="menu_click('today')"></div>
        <!-- 早盘 -->
        <div class="item" @click="menu_click('early')"></div>
        <!-- 串关 -->
        <div class="item" @click="menu_click('bet')"></div>
    </div>
</template>
  
<script setup>
import { ref, reactive } from 'vue'
import { TabWapper as Tab } from "src/components/common/tab"

import store from "src/store-redux/index.js";

const props = defineProps({
    show_type: {
        type: String,
        default: ''
    }
})
// const emit = defineEmits(['update:set_show_type'])

/** 当前球种索引 */
const tab_index = ref(0)
/** 当前球种索引 */
const sports_list = reactive([])

/**
 * @Description:切换球种
 * @param {number} index 球种索引
 * @return {undefined} undefined
 */
function tab_click(obj) {
    tab_index.value = obj.index;
}
/**
 * @Description:切换菜单
 * @param {string} type 菜单类型
 * @return {undefined} undefined
 */
function menu_click(type) {
    set_search_status(false)
    let sports = sports_list[tab_index.value]
}
/** 保存显示搜索组件状态 */
const set_search_status = (data) => store.dispatch({ type: 'set_search_status', data })

</script>
  
<style lang="scss" scoped>
.sports-wrap {
    padding-top: 65px;

    .item {
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        color: #99a3b1;
        margin: 0 30px;
        margin-bottom: 5px;
        padding: 0 10px;
        cursor: pointer;

        &:hover {
            background-color: var(--q-header-search-color-1);
            color: var(--q-gb-t-c-16);
        }
    }
}
</style>
  