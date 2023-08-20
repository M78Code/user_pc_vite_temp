<template>
    <div class="popup-wrap relative-position " :class="[versions_class, { active: show_popup }]">
        <div class="langeuage-text popup-text" :class="{ 'active': show_popup }" @click="toggle_popup">
            <div>
                <span :class="['flag lang-active', lang]"></span><span class="lang-label ellipsis">{{ langs[lang] }}</span>
            </div>
            <div class="yb-icon-arrow"></div>
        </div>

        <div class="wrap-language" v-if="show_popup">
            <div class="triangle"></div>
            <template v-for="(language, index) in language_arr">
                <div v-if="languageList.includes(language)" :key="index" class="item ellipsis"
                    :class="[{ active: lang == language }]" @click="on_click_lang(language)">
                    <span :class="['flag', language]"></span>{{ langs[language] }}
                </div>
            </template>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import lodash from "lodash";
import { useI18n } from "vue-i18n";

import store from "src/store-redux/index.js";
import { api_account, api_details } from 'src/api/index';
import langs_mjs from "project_path/src/i18n/langs/index.mjs";
import { useMittEmit, useMittOn } from 'src/core/mitt/index.js'
import * as MITT_TYPES from 'project_path/src/core/mitt/mitt-keys.js'
import { loadLanguageAsync } from 'src/boot/i18n'
// import { update_bet_item_info as virtual_common_update_bet_item_info } from 'src/core/common-helper/virtual_common.js'
// import { update_bet_item_info as yabo_common_update_bet_item_info } from 'src/core/common-helper/common.js'

/** 国际化 */
const { t } = useI18n();

/** 是否展示 */
const show_popup = ref(false)
/** 语言列表key集合 */
const language_arr = ref(Object.keys(langs_mjs))
/** 点击数 */
const hits = ref(0)
const langs = ref(langs_mjs)

/** stroe仓库 */
const store_data = store.getState()
const { betInfoReducer, userReducer, langReducer, menuReducer } = store_data

/** 全局点击事件数 */
const global_click = ref(0)
watch(
    () => global_click.value,
    () => {
        if (hits.value % 2 == 1) {
            hits.value++;
            return;
        }
        show_popup.value = false;
    }
)

/** 
 * is_bet_single true: 单关投注 false: 串关投注 default: true
 * bet_single_obj 单关投注对象 default: {}
 * bet_obj 单关投注对象 default: {}
 * is_virtual_bet true: 当前是否为虚拟投注 default: true
 * virtual_bet_obj 虚拟投注对象 default: {}
 * 路径: project_path\src\store\module\betInfo.js
 */
/**  */
const { is_bet_single, bet_single_obj, bet_obj, is_virtual_bet, virtual_bet_obj } = betInfoReducer
/** 
 * 用户信息 default: {}
 * 路径: src\store-redux\module\user-info.js
 */
const { user_info } = userReducer

/** 
 * 语言 languages
 * 路径: src\store-redux\module\languages.js
 */
const { lang } = langReducer
/** 
 * 当前菜单类型 play 滚球  hot热门赛事   virtual_sport虚拟体育   winner_top冠军聚合页 today 今日   early早盘 bet串关 
 * 路径: src\store-redux\module\menu.js
 */
const { cur_menu_type } = menuReducer


/** 设置语言 */
const set_lang = (data) => store.dispatch({
    type: 'set_lang',
    data
})
/** 设置语言变化 */
const set_lang_change = (data) => store.dispatch({
    type: 'set_lang_change',
    data
})
/** 更新用户信息 */
const set_user_assign = (data) => store.dispatch({
    type: 'set_user_assign',
    data
})
/** 即将开赛筛选时间 */
const set_open_select_time = (data) => store.dispatch({
    type: 'set_open_select_time',
    data
})

/** 语言列表 */
const languageList = ref([])
onMounted(() => languageList.value = lodash.get(user_info, 'languageList') || [])
onUnmounted(() => languageList.value = [])

/** 路由对象 */
const route = useRoute()
/** 路由实例 */
const router = useRouter()
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
    // TODO: $menu
    // const is_winner = $menu.menu_data.match_tpl_number == 18;
    const is_winner = false
    let fun = () => {
        if (!is_winner && lang.value != lang_) {
            set_lang_change(true);
            /* ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...
            type:0表示普通赛事(默认值)，1虚拟赛事 */
            let type = is_virtual_bet ? 1 : 0;
            let ids = [], bet_type = bet_obj;
            if (is_virtual_bet) {
                bet_type = virtual_bet_obj
            } else if (is_bet_single) {
                bet_type = bet_single_obj;
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
                // TODO: $menu
                if ($menu.menu_data.is_esports) {
                    type = 2;
                }
                let params = {
                    ids: ids.join(','),
                    type
                }
                api_details.get_bet_olds(params).then(res => {
                    let data = lodash.get(res, 'data.data');
                    if (lodash.isArray(data) && data.length > 0) {
                        if (is_virtual_bet) {
                            // TODO: this
                            // virtual_common_update_bet_item_info( data);
                        } else {
                            // TODO: this
                            // yabo_common_update_bet_item_info( data);
                        }
                        useMittEmit(MITT_TYPES.EMIT_UPDATE_HOME_AWAY_CMD, {})
                        set_lang_change(false);
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
    if (lang.value != lang_) {
        api_account.set_user_lang({ token: user_info.token, languageName: lang_ }).then(res => {
            let code = lodash.get(res, 'data.code');
            if (code == 200) {
                set_user_assign({ languageName: lang_ })
                set_lang(lang_);
                // TODO: 
                window.reset_lang = lang_;
                // 设置即将开赛筛选默认值为全部
                set_open_select_time(null)
                // $store.state.filter.open_select_time = null;
                // 设置国际化语言
                loadLanguageAsync(lang_).then().finally(() => {
                    fun();
                    window.reset_lang = '';
                })
            } else if (code == '0401038') {
                useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("common.code_empty"))
            }
        })
    }
}
/**
* @description:
* @param {}
* @return {}
*/
function toggle_popup() {
    hits.value++;
    if (lodash.isEmpty(languageList.value)) {
        languageList.value = lodash.get(user_info, 'languageList') || [];
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
        background-image: url('~public/image/yabo/png/lang_flag.png');
        background-position-x: 0;
        background-repeat: no-repeat;
        background-size: 100%;
        margin-right: 6px;

        &.en {
            background-position-y: -15px;
        }

        &.tw {
            background-position-y: -30px;
        }

        &.vi {
            background-position-y: -45px;
        }

        &.ms {
            background-position-y: -60px;
        }

        &.th {
            background-position-y: -75px;
        }

        &.ad {
            background-position-y: -90px;
        }

        &.md {
            background-position-y: -105px;
        }

        &.ry {
            background-position-y: -120px;
        }

        &.pty {
            background-position-y: -135px;
        }

        &.hy {
            background-position-y: -150px;
        }
    }
}
</style>
  