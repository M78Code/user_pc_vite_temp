<!--
 * @Description: 设置多语言、版本、颜色组件
-->

<template>
    <div class="popup-wrap" :class="{ active: is_active }">
        <div class="text-wrap" @click="on_popup">
            <div class="popup-text" :class="{ active: is_active }">{{
                lodash.get(theme_map[theme], `i18n.${lang}`, '-')
            }}</div>
            <div class="yb-icon-arrow"></div>
        </div>
        <div class="relative-position">
            <div class="item-wrap">
                <div class="triangle"></div>
                <div class="item ellipsis" v-for="item in theme_list" :class="{ active: theme == item.key }" :key="item.key"
                    @click="handle_set_theme(item.key)">
                    {{ item.i18n[lang] || item.key }}
                    <!-- 拿后台配置的名称 -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, watch, onUnmounted, computed } from 'vue'
import { theme_list, theme_map } from "src/core/theme/"

import store from "src/store-redux/index.js";
import { api_account } from 'src/api/index'
// import userCtr from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";

/** 组件没有使用 */
// import template0 from 'src/project/yabo/components/match_details/list/template0.vue';

/** 设置弹窗是否激活 */
const is_active = ref(false)
/** 点击数 */
const hits = ref(0)

/** stroe仓库 */
const { globalReducer } = store.getState()
/** 
* 全局点击事件数 default: 0
* 路径: project_path\src\store\module\global.js
*/
// const global_click = ref(globalReducer.global_click)
// /** 
// * 用户余额是否展示状态 default: day
// */
const theme = ref(UserCtr.theme)
const lang = ref(UserCtr.lang)

// const unsubscribe = store.subscribe(() => {
//     const { globalReducer: new_globalReducer } = store.getState()
//     global_click.value = new_globalReducer.global_click
// })
// /** 销毁监听 */
// onUnmounted(unsubscribe)

/**
 * @Description:显示设置弹层
 * @return {undefined} undefined
 */
function on_popup() {
    hits.value++;
    is_active.value = !is_active.value
}

// 设置主题
function handle_set_theme(new_theme) {
    theme.value = new_theme
    UserCtr.set_theme(new_theme)
}

/** 点击任何地方关闭弹窗 */
// watch(
//     () => global_click.value,
//     () => {
//         if (hits.value % 2 == 1) {
//             hits.value++;
//             return;
//         }
//         is_active.value = false
//     }
// )

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
  