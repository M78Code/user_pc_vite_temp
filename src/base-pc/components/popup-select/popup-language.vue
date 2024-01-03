<template>
    <div class="popup-wrap relative-position " :class="[versions_class, { active: show_popup }]">
        <div class="langeuage-text popup-text" :class="{ 'active': show_popup }" @click="toggle_popup">
            <div>
                <span :class="['flag lang-active', lang]" :style="sprite_img['pc-popup-language-icon-image']({position: lang, theme: 'local'})"></span><span class="lang-label ellipsis">{{ langs[lang] }}</span>
            </div>
            <div class="yb-icon-arrow"></div>
        </div>

        <div class="wrap-language" v-if="show_popup">
            <div class="triangle"></div>
            <template v-for="(language, index) in language_arr">
                <div v-if="languageList.includes(language)" :key="index" class="item ellipsis"
                    :class="[{ active: lang == language }]" @click="on_click_lang(language)">
                    <span :class="['flag', language]" :style="sprite_img['pc-popup-language-icon-image']({position: language, theme: 'local'})"></span>{{ langs[language] }}
                </div>
            </template>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import lodash from "lodash";
import { i18n_t } from "src/boot/i18n.js"

import store from "src/store-redux/index.js";
import { api_account, api_details } from 'src/api/index';
import langs_mjs from "src/i18n/pc/langs/index.mjs";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { loadLanguageAsync } from 'src/output/index.js'
// import userCtr from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import BaseData from "src/core/base-data/base-data.js"
import { update_bet_item_info } from "src/core/bet/common-helper/module/common.js";
import  sprite_img  from   "src/core/server-img/sprite-img/index.js"

/** 是否展示 */
const show_popup = ref(false)
/** 语言列表key集合 */
const language_arr = ref(Object.keys(langs_mjs))
/** 点击数 */
const hits = ref(0)
const langs = ref(langs_mjs)
const lang = ref(UserCtr.lang)

// /** stroe仓库 */
// const { globalReducer } = store.getState()
// /** 全局点击事件数 */
// const global_click = ref(globalReducer.global_click)
// watch(
//     () => global_click.value,
//     () => {
//         if (hits.value % 2 == 1) {
//             hits.value++;
//             return;
//         }
//         show_popup.value = false;
//     }
// )
// const unsubscribe = store.subscribe(() => {
//     const { globalReducer: new_globalReducer } = store.getState()
//     global_click.value = new_globalReducer.global_click
// })
// /** 销毁监听 */
// onUnmounted(unsubscribe)

/** 语言列表 */
const languageList = ref([])
onMounted(() => languageList.value = lodash.get(UserCtr.get_user(), 'languageList') || [])
onUnmounted(() => languageList.value = [])

/** 路由对象 */
const route = useRoute()
/** 路由实例 */
const router = useRouter()
/** 即将开赛筛选时间 */
const set_open_select_time = (data) => store.dispatch({
    type: 'set_open_select_time',
    data
})
/**
 * @Description:切换语言
 * @param {string} lang_ 语言
 * @return {undefined} undefined
 */
function on_click_lang(lang_) {
    if (route.name == "search") {
        router.push("/home")
    }
    // 冠军菜单不支持语言切换投注项名称国际化
    const is_winner = MenuData.get_match_tpl_number() == 18;
    let fun = () => {
        if (!is_winner && lang.value != lang_) {
            /**
             * bet-data-class.js 
             * is_virtual_bet 当前是否为虚拟投注
             * bet_obj 押注扁平化对象扁平
             * virtual_bet_obj 虚拟投注对象
             * is_bet_single 单关投注
             * bet_single_obj 单关投注对象
             */
            const { is_virtual_bet, bet_obj, virtual_bet_obj, is_bet_single, bet_single_obj } = BetData
            let type = is_virtual_bet ? 1 : 0;
            /**
             * ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...type:0表示普通赛事(默认值)，1虚拟赛事
             */
            let ids = [], bet_type = bet_obj;
            if (is_virtual_bet ) {
                bet_type = virtual_bet_obj
            } else if (is_bet_single) {
                bet_type = bet_single_obj
            }
            for (let obj of Object.values(bet_type)) {
                let match_id = lodash.get(obj, 'cs.match_id', '');
                let handicap_id = lodash.get(obj, 'cs.handicap_id', '');
                let play_id = lodash.get(obj, 'cs.play_id', '');
                let oid = lodash.get(obj, 'cs.oid', '');
                if (!lodash.isEmpty(match_id) &&
                    !lodash.isEmpty(handicap_id) &&
                    !lodash.isEmpty(play_id) &&
                    !lodash.isEmpty(oid)) {
                    ids.push(`${match_id}-${play_id}-${handicap_id}-${oid}`);
                }
            }
            if (!lodash.isEmpty(ids)) {
                if (MenuData.is_esports()) {
                    type = 2;
                }
                let params = {
                    ids: ids.join(','),
                    type
                }
                api_details.get_bet_olds(params).then(res => {
                    let data = lodash.get(res, 'data.data');
                    if (lodash.isArray(data) && data.length > 0) {
                        update_bet_item_info(data)
                        if (is_virtual_bet) {
                            // virtual_common_update_bet_item_info( data);
                        } else {
                            // yabo_common_update_bet_item_info( data);
                        }
                        useMittEmit(MITT_TYPES.EMIT_UPDATE_HOME_AWAY_CMD, {})
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
    if (lang.value != lang_) {
        api_account.set_user_lang({ token: UserCtr.get_user_token(), languageName: lang_ }).then(res => {
            let code = lodash.get(res, 'code');
            if (code == 200) {
                UserCtr.set_lang(lang_);
                lang.value = lang_
                // 设置即将开赛筛选默认值为全部
                set_open_select_time(null)
                // 设置国际化语言
                loadLanguageAsync(lang_).then().finally(() => {
                    fun();
                    UserCtr.set_lang(lang_);
                    BaseData.init()
                })
            } else if (code == '0401038') {
                useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("common.code_empty"))
            }
        })
    }

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
    show_popup.value = !show_popup.value
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