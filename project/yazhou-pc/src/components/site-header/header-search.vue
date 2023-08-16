<template>
    <div class="yb-site-left-width" v-if="global_switch.search_switch" :class="`${main_menu_toggle}`">
        <div v-show="!search_isShow" @click.stop="search_hot_push.go_to_details()" class="search-wrap"
            :class="main_menu_toggle">
            <div v-show="main_menu_toggle !== 'mini'" class="ellipsis" @click.stop="show_search">
                {{ search_hot_push.hot_push_name }}</div>
            <icon class="icon"
                :name="!['theme01_y0', 'theme02_y0'].includes(theme) ? `img:${img_search_icon}` : `img:${img_search_icon_y0}`"
                size="14px" />
        </div>
    </div>

    <!-- 内嵌版 菜单状态切换按钮 -->
    <template v-if="is_iframe && menu_collapse_status && !search_isShow">
        <div class="menu-collapse-btn" :class="collapse_style" @click="handle_menu_collapse">
            <q-tooltip anchor="top middle" self="center middle"
                :content-style="tooltip_style + ';transform:translateY(34px)'">{{ t('common.menu_expand')
                }}</q-tooltip>
        </div>
        <i class="icon-triangle3 q-icon c-icon menu-collapse-triangle"></i>
    </template>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';

import store from "src/store-redux/index.js";
import SearchHotPush from "src/core/search-class/search_hot_push.js"
import { useMittEmit } from 'src/core/mitt/index.js'
import * as MITT_TYPES from 'project_path/src/core/mitt/mitt-keys.js'
import { tooltip_style } from 'src/core/config/global-component-style.js.js'

import img_search_icon from 'app/public/yazhou-pc/image/svg/search-icon.svg'
import img_search_icon_y0 from 'app/public/yazhou-pc/image/svg/y0-search-icon.svg'

/** 国际化 */
const { t } = useI18n();

/** stroe仓库 */
const store_data = store.getState()
/** 
 * 全局开关 default: object
 * 路径: project_path\src\store\module\global.js
 */
const { global_switch } = store_data.globalReducer
/** 
 * 是否显示搜索组件 default: false
 * 路径: project_path\src\store\module\search.js
 */
const { search_isShow } = store_data.searchReducer
/** 
 * main_menu_toggle 左侧列表显示形式 default: 'normal' -- normal：展开 mini：收起
 * menu_collapse_status 获取菜单收起状态 default: false
 * 路径: project_path\src\store\module\menu.js
 */
const { main_menu_toggle, menu_collapse_status } = store_data.menuReducer

/** 计算菜单状态切换按钮 */
const collapse_style = computed(() => {
    if (theme.value.includes('y0')) {
        return menu_collapse_status.value ? 'collapse-open-y0' : 'collapse-hide-y0'
    } else {
        return menu_collapse_status.value ? 'collapse-open' : 'collapse-hide'
    }
})

/** 搜索热推赛事 */
const search_hot_push = ref(new SearchHotPush())

/** 保存显示搜索组件状态 */
const set_search_status = (data) => store.dispatch({
    type: 'set_search_status',
    data
})
/** 展开搜索 */
function show_search() {
    if (!get_global_switch.value.search_switch) {
        return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("msg.msg_09"))
    }
    set_search_status(true);
}
const route = useRoute()
/** 初始化 */
function init() {
    if (route.name == "search") {
        show_search();
    } else {
        set_search_status(false);
    }
}
onMounted(init)
/** 监听路由变化 */
watch(
    () => route.name,
    (res) => {
        if (res == "search") {
            show_search();
        }
        set_current_index()
    }
)

/** 内嵌版 菜单收起状态 */
const set_menu_collapse_status = (data) => store.dispatch({
    type: 'set_menu_collapse_status',
    data
})
/** 内嵌版 菜单状态切换按钮 */
function handle_menu_collapse() {
    set_menu_collapse_status(!get_menu_collapse_status.value)
}
</script>

<style lang="scss" scoped>
@import './site-header.scss';
</style>