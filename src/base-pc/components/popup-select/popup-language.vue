<template>
    <div class="popup-wrap relative-position " :class="[versions_class, { active: show_popup }]">
        <div class="langeuage-text popup-text" :class="{ 'active': show_popup }" @click="toggle_popup">
            <div>
                <span :class="['flag lang-active', UserCtr.lang]" :style="sprite_img['pc-popup-language-icon-image']({position: UserCtr.lang, theme: 'local'})"></span>
                <span class="lang-label ellipsis">{{ langs[UserCtr.lang] }}</span>
            </div>
            <div class="yb-icon-arrow"></div>
        </div>
        
        <div v-show="false">{{UserCtr.user_version}}-{{GlobalSwitchClass.global_switch_version}}</div>

        <div class="wrap-language" v-if="show_popup">
            <div class="triangle"></div>
            <template v-for="(language, index) in language_arr">
                <div v-if="languageList.includes(language)" :key="index" class="item ellipsis"
                    :class="[{ active: UserCtr.lang == language }]" @click="on_click_lang(language)">
                    <span :class="['flag', language]" :style="sprite_img['pc-popup-language-icon-image']({position: language, theme: 'local'})"></span>{{ langs[language] }}
                </div>
            </template>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

import { api_account } from 'src/api/index';
import langs_mjs from "src/i18n/pc/langs/index.mjs";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { loadLanguageAsync,GlobalSwitchClass } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import BaseData from "src/core/base-data/base-data.js"
import  sprite_img  from   "src/core/server-img/sprite-img/index.js"

/** 是否展示 */
const show_popup = ref(false)
/** 语言列表key集合 */
const language_arr = ref(Object.keys(langs_mjs))
/** 点击数 */
const hits = ref(0)
const langs = ref(langs_mjs)


// 监听全局点击事件， 语言切换是展开的 需要收起
watch(
    GlobalSwitchClass.global_switch_version,
  (handkey) => {
    if(GlobalSwitchClass.global_click%2 == 1 ){
       return
    }
    show_popup.value = false
  },
  { immediate: true }
);

/** 语言列表 */
const languageList = ref([])
onMounted(() => languageList.value = lodash.get(UserCtr.get_user(), 'languageList') || [])
onUnmounted(() => languageList.value = [])

/**
 * @Description:切换语言
 * @param {string} lang_ 语言
 * @return {undefined} undefined
 */
function on_click_lang(lang_) {
    api_account.set_user_lang({ token: UserCtr.get_user_token(), languageName: lang_ }).then(res => {
        let code = lodash.get(res, 'code');
        if (code == 200) {
            UserCtr.set_lang(lang_);
            BaseData.set_base_data_menu_i18n()
            // 设置即将开赛筛选默认值为全部
            // set_open_select_time(null)
            // 设置国际化语言
            loadLanguageAsync(lang_).then().finally(() => {
                console.error('设置国际化语言')
            })
        } else if (code == '0401038') {
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("common.code_empty"))
        }
    })

    toggle_popup()
}
/**
* @description:
* @param {}
* @return {}
*/
function toggle_popup() {
    hits.value++;
    if (lodash.isEmpty(languageList.value)) {
        languageList.value = lodash.get(UserCtr.get_user(), 'languageList') || [];
    }
    nextTick(()=>{
        show_popup.value = !show_popup.value
    })
   
}

const versions_class = computed(() => {
    // TODO: 环境变量
    // return `versions-${window.BUILDIN_CONFIG.DEFAULT_VERSION_NAME}`
    return 'versions-zhuanye'
})

</script>
  
<style lang="scss" scoped>
/* 专业版 */
.versions-zhuanye {
    .langeuage-text {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        height: 100%;

        .lang-active {
            margin-left: 9px;
        }

        .lang-label {
            margin-right: 8px;
        }

        .yb-icon-arrow {
            transition: transform 0.3s;
            transform: rotateZ(90deg);
        }

        &.active {
            .yb-icon-arrow {
                transform: rotateZ(-90deg);
            }
        }
    }

    .wrap-language {
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 4px 0px;
        min-width: 96px;
        border-radius: 3px;
        text-align: left;

        .item {
            display: flex;
            align-items: center;
            height: 26px;
            cursor: pointer;
            padding: 0 8px;
        }
    }

    .triangle {
        left: 46px;
    }

    .flag {
        width: 14px;
        height: 10px;
        display: inline-block !important;
        background-repeat: no-repeat;
        background-size: 100%;
        margin-right: 6px;
    }
}
</style>
  src/output/index.js