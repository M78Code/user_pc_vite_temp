<!--
 * @Description: 设置多语言、版本、颜色组件
-->

<template>
    <div class="popup-wrap" :class="{ active: is_active }">
        <div class="text-wrap" @click="on_popup">
            <div class="popup-text" :class="{ active: is_active }">{{ t(`set.${handicap_theme == 'theme01' ?
                'day_' : 'night_'}`) }}</div>
            <div class="yb-icon-arrow"></div>
        </div>
        <div class="relative-position">
            <div class="item-wrap">
                <div class="triangle"></div>
                <div class="item ellipsis" :class="{ active: handicap_theme == 'theme01' }"
                    @click="handle_set_theme('theme01')">
                    {{ t('set.day_') }}
                    <!-- 日间版 -->
                </div>
                <div class="item ellipsis" :class="{ active: handicap_theme == 'theme02' }"
                    @click="handle_set_theme('theme02')">
                    {{ t('set.night_') }}
                    <!-- 夜间版 -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from 'vue'
import { t } from "src/boot/i18n";
import store from "src/store-redux/index.js";
import { api_account } from 'src/api/index'
import userCtr from 'src/core/user-config/user-ctr.js'

/** 组件没有使用 */
// import template0 from 'src/project/yabo/components/match_details/list/template0.vue';

/** 设置弹窗是否激活 */
const is_active = ref(false)
/** 点击数 */
const hits = ref(0)

/** stroe仓库 */
const store_data = store.getState()
const { globalReducer, themeReducer, langReducer } = store_data
const unsubscribe = store.subscribe(() => {
    global_click.value = globalReducer.global_click
    theme.value = langReducer.theme
})
/** 销毁监听 */
onUnmounted(unsubscribe)
/** 
* 全局点击事件数 default: 0
* 路径: project_path\src\store\module\global.js
*/
const global_click = ref(globalReducer.global_click)
/** 
* 用户余额是否展示状态 default: theme01
* 路径: project_path/src/store/module/theme.js
*/
const theme = ref(themeReducer.theme)


/** 设置语言 */
const set_lang = (data) => store.dispatch({
    type: 'SET_LANG',
    data
})
/** 设置版本 */
const set_version_name = (data) => store.dispatch({
    type: 'set_version_name',
    data
})
/** 设置主题 */
const set_theme = (data) => store.dispatch({
    type: 'set_theme',
    data
})

/** 日间或夜间版 */
const handicap_theme = computed(() => {
    return theme.value === 'theme02' ? 'theme02' : 'theme01'
})

/**
 * @Description:显示设置弹层
 * @return {undefined} undefined
 */
function on_popup() {
    hits.value++;
    is_active.value = !is_active.value
}

/**
 * @Description:切换版本
 * @param {string} type 版本
 * @return {undefined} undefined
 */
function on_click_version(type) {
    if (!type) return;
    set_version_name(type);
}

/**
 * @Description:切换语言
 * @param {string} lang_ 语言
 * @return {undefined} undefined
 */
async function on_click_lang(lang_) {
    set_lang(lang_);
    api_account.get_lang({ token: userCtr.get_user_token(), languageName: lang_ })

}
// 设置主题
function handle_set_theme(theme) {
    if (theme.includes('y0')) {
        set_theme(theme + '_y0')
    } else {
        set_theme(theme)
    }
}

/** 点击任何地方关闭弹窗 */
watch(
    () => global_click.value,
    () => {
        if (hits.value % 2 == 1) {
            hits.value++;
            return;
        }
        is_active.value = false
    }
)

</script>
  
<style lang="scss" scoped>
.item-wrap {
    padding: 5px 0;
    display: none;
    right: -13px;
    width: 96px;

    .triangle {
        left: 46px;
    }

    .item {
        text-align: center;
        line-height: 26px;
        width: 100%;
        height: 26px;
        border-radius: 2px;
        cursor: pointer;
        padding: 0 10px;
    }
}

.item-wrap {
    border-radius: 4px;
}

.popup-wrap.active .item-wrap {
    display: block;
}
</style>
  