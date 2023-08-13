<!--
 * @Description: 设置多语言、版本、颜色组件
-->

<template>
    <div class="popup-wrap" :class="{ active: is_active }">
        <div class="text-wrap" @click="on_popup">
            <div class="popup-text" :class="{ active: is_active }">{{ $root.$t(`set.${handicap_theme == 'theme01' ?
                'day_' : 'night_'}`) }}</div>
            <div class="yb-icon-arrow"></div>
        </div>
        <div class="relative-position">
            <div class="item-wrap">
                <div class="triangle"></div>
                <div class="item ellipsis" :class="{ active: handicap_theme == 'theme01' }"
                    @click="handle_set_theme('theme01')">
                    {{ $root.$t('set.day_') }}
                    <!-- 日间版 -->
                </div>
                <div class="item ellipsis" :class="{ active: handicap_theme == 'theme02' }"
                    @click="handle_set_theme('theme02')">
                    {{ $root.$t('set.night_') }}
                    <!-- 夜间版 -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import store from "src/store-redux/index.js";
import { api_account } from 'src/api/index'
/** 组件没有使用 */
// import template0 from 'src/project/yabo/components/match_details/list/template0.vue';


/** 设置弹窗是否激活 */
const is_active = ref(false)
/** 点击数 */
const hits = ref(0)

/** 语言 */
const lang = ref('')
/** 全局点击事件 */
const get_global_click = ref(0)
/** 获取当前主题 */
const get_theme = ref('')
/** 用户信息 */
const get_user = ref({})
/** stroe仓库 */
const unsubscribe = store.subscribe(() => {
    const new_state = store.getState()
    lang.value = new_state.lang
    get_global_click.value = new_state.global_click
    get_theme.value = new_state.theme
    get_user.value = new_state.user

})
onUnmounted(unsubscribe)

/** 设置语言 */
const set_lang = (data) => store.dispatch({
    type: 'set_lang',
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
    return get_theme.value.indexOf('theme02') != -1 ? 'theme02' : 'theme01'
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
    let user = get_user.value
    api_account.get_lang({ token: user.token, languageName: lang_ })

}
// 设置主题
function handle_set_theme(theme) {
    const curr_theme = get_theme.value

    if (curr_theme.includes('y0')) {
        set_theme(theme + '_y0')
    } else {
        set_theme(theme)
    }
}

/** 点击任何地方关闭弹窗 */
watch(
    () => get_global_click.value,
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
  