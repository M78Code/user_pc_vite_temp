<!--
 * @Description 公共设置组件
-->
<template>
    <div class="g-settings" style="max-width: 350px">
        <q-menu v-model="show_g_settings" self="bottom middle" :offset="[0, -32]" :content-class="'g-settings-style'">

            <q-list bordered class="rounded-borders">
                <div v-for="(settings, key) in settings_items" :key="settings.id">

                    <!-- 全局设置项 -->
                    <q-expansion-item group="settings"
                        :expand-icon-class="settings.type === 'switch' ? 'settings-no-expand' : ''"
                        :header-class="settings.type === 'switch' ? 'settings-item-header' : ''"
                        expand-icon="icon-triangle1">
                        <template v-slot:header>
                            <!-- 设置项 图标 -->
                            <q-item-section avatar>
                                <i class="icon settings-icon"
                                    :style="`background: url('${theme.includes('theme01') ? settings.icon.day : settings.icon.night}') no-repeat center`"></i>
                            </q-item-section>

                            <!-- 设置项 名称 -->
                            <q-item-section>
                                <div class="settings-label">{{ settings.name }}</div>
                            </q-item-section>

                            <!-- 设置项 当前状态 -->
                            <q-item-section side>
                                <div class="row items-center">

                                    <!-- 盘口/多语言 -->
                                    <div class="curr-item" v-if="settings.type === 'select'">
                                        <template v-if="settings.id === 1">{{ t('odds')[cur_odd] }}</template>
                                        <template v-else-if="settings.id === 2">{{ langs[lang] }}</template>
                                    </div>

                                    <!-- 主题设置 -->
                                    <div v-else @click="change_theme" class="skin-toggle">
                                        <div class="skin-icon skin-icon-day"></div>
                                        <div class="skin-icon skin-icon-night"></div>
                                    </div>
                                </div>
                            </q-item-section>
                        </template>

                        <q-card v-if="settings.type === 'select'">
                            <q-card-section>

                                <!-- 盘口选项 -->
                                <template v-if="settings.id === 1">
                                    <template v-for="(item, index) in settings.value_arr">
                                        <div v-if="['EU', 'HK'].includes(item.value)" :key="index"
                                            class="child-item item-odds relative-position"
                                            :class="cur_odd == item.value && 'active'" @click="on_click_handicap(item)">
                                            {{ item.label }}
                                            <i v-if="cur_odd == item.value"
                                                class="icon-triangle3 q-icon c-icon arrow-show"></i>
                                        </div>
                                    </template>
                                </template>

                                <!-- 多语言选项 -->
                                <template v-else-if="settings.id === 2">
                                    <template v-for="(language, index) in settings.value_arr">
                                        <div v-if="languageList.includes(language)" :key="index"
                                            class="child-item ellipsis relative-position"
                                            :class="[{ active: lang == language }]" @click="on_click_lang(language)">
                                            <span :class="['flag', language]"></span>{{ langs[language] }}
                                            <i v-if="lang == language" class="icon-triangle3 q-icon c-icon arrow-show"></i>
                                        </div>
                                    </template>
                                </template>

                            </q-card-section>
                        </q-card>
                    </q-expansion-item>

                </div>

            </q-list>

        </q-menu>

    </div>
</template>

<script setup>
import { ref, } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import lodash from 'lodash'
import { t } from "src/boot/i18n";;

import store from "src/store-redux/index.js";
import { api_account, api_betting, api_details } from "src/api";
import i18n_langs from "project_path/src/i18n/langs/index.mjs";
import { loadLanguageAsync } from "/src/boot/i18n";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import userCtr from 'src/core/user-config/user-ctr.js'

// import { update_bet_item_info as virtual_common_update_bet_item_info } from 'src/core/common-helper/virtual_common.js'
// import { update_bet_item_info as yabo_common_update_bet_item_info } from 'src/core/common-helper/common.js'

const props = defineProps({
    el: {
        type: String,
        default: ''
    },
    show_settings: {
        type: Boolean,
        default: false
    },
    settings_items: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['auto_close'])

/** 国际化 */
;

const route = useRoute()
const router = useRouter()

const skin = ref(false)
const langs = ref(i18n_langs)

const show_g_settings = ref(props.show_settings)

/** 主题 */
const theme = ref('')
/** 上次赔率 */
const cur_odd = ref('EU')
/** 上次赔率 */
const pre_odds = ref('EU')
/** 语言 */
const lang = ref('zh')
/** true: 单关投注 false: 串关投注 */
const is_bet_single = ref(false)
/** 单关投注对象 */
const bet_single_obj = ref({})
/** 串关投注对象 */
const bet_obj = ref({})
/** 串关投注对象 */
const is_virtual_bet = ref(true)
/** 虚拟投注列表对象 */
const cur_menu_type = ref({})
/** 当前菜单类型 play 滚球  hot热门赛事   virtual_sport虚拟体育   winner_top冠军聚合页 today 今日   early早盘 bet串关 */
const left_menu_toggle = ref('')

/** stroe仓库 */
const unsubscribe = store.subscribe(() => {
    const new_state = store.getState()
    theme.value = new_state.theme
    cur_odd.value = new_state.cur_odds
    pre_odds.value = new_state.pre_odds
    lang.value = new_state.lang
    is_bet_single.value = new_state.is_invalid
    bet_single_obj.value = new_state.bet_single_obj
    bet_obj.value = new_state.bet_obj
    is_virtual_bet.value.value = new_state.is_virtual_bet
    cur_menu_type.value = new_state.cur_menu_type
    left_menu_toggle.value = new_state.left_menu_toggle
    layout_size.value = new_state.layout_size
})
onUnmounted(unsubscribe)

const set_theme = (data) => store.dispatch({
    type: 'set_theme',
    data
})
 
const set_lang_change = (data) => store.dispatch({
    type: 'SET_LANGUAGE_CHANGING',
    data
})
 
const set_pre_odd = (data) => store.dispatch({
    type: 'SET_PRE_ODD',
    data
})

/** 语言列表 */
const languageList = computed(() => lodash.get(userCtr.get_user(), 'languageList', []))


/**
 * @Description:切换盘口
 * @param {object} row 盘口数据
 * @return {undefined} undefined
 */
function on_click_handicap(row) {
    if (cur_odd.value != row.value) {
        set_user_preference(row.value);
    }
    emit('auto_close')
}
/**
 * @Description:设置用户偏好
 * @param {string} curr_odd 目标盘口
 * @return {undefined} undefined
 */
function set_user_preference(curr_odd) {
    if (curr_odd) {
        let old_odd = cur_odd.value
        let old_pre_odd = pre_odds.value
        set_pre_odd(curr_odd);
        BetData.set_cur_odd(curr_odd);
        // 设置用户偏好
        api_betting.record_user_preference({ userMarketPrefer: curr_odd }).then((res) => {
            let code = lodash.get(res, 'data.code');
            if (code != 200) {
                set_pre_odd(old_pre_odd);
                BetData.set_cur_odd(old_odd);
            }
        }).catch(err => {
            console.error(err);
            set_pre_odd(old_pre_odd);
            BetData.set_cur_odd(old_odd);
        });
    }
}

/**
 * @Description:切换语言
 * @param {string} lang_ 语言
 * @return {undefined} undefined
 */
function on_click_lang(lang_) {
    if ($route.name == "search") {
        $router.push("/home")
    }
    // 冠军菜单不支持语言切换投注项名称国际化
    // TODO:
    // let is_winner = $menu.menu_data.match_tpl_number == 18;
    let is_winner = false
    let fun = () => {
        if (!is_winner && lang.value != lang_) {
            set_lang_change(true);
            /* ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...
            type:0表示普通赛事(默认值)，1虚拟赛事 */
            let type = is_virtual_bet.value ? 1 : 0;
            let ids = [], bet_type;
            if (is_virtual_bet.value) {
                bet_type = cur_menu_type.value;
            } else if (is_bet_single.value) {
                bet_type = bet_single_obj.value;
            } else {
                bet_type = bet_obj.value;
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
                // TODO:
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
                        if (is_virtual_bet.value) {
                            // TODO: this?
                            // virtual_common_update_bet_item_info( data);
                        } else {
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
        let user = userCtr.get_user()
        api_account.set_user_lang({ token: user.token, languageName: lang_ }).then(res => {
            let code = lodash.get(res, 'data.code');
            if (code == 200) {
                UserCtr.set_lang(lang_)
                set_lang(lang_);
                // TODO: 
                window.reset_lang = lang_;
                // 设置即将开赛筛选默认值为全部
                // TODO: 
                // this.$store.state.filter.open_select_time = null;
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
 * @Description:切换主题
 * @return {undefined} undefined
 */
function change_theme() {
    if (theme.value.includes('theme01')) {
        handle_set_theme('theme02')
    } else {
        handle_set_theme('theme01')
    }

    emit('auto_close')
}
/** 设置主题 */
function handle_set_theme(theme) {
    const curr_theme = theme.value

    if (curr_theme.includes('y0')) {
        set_theme(theme + '_y0')
    } else {
        set_theme(theme)
    }
}
</script>
  
<style  lang="scss">
.g-settings-style {
    width: 240px;
    max-height: 700px !important;
    border-radius: 4px !important;
    padding: 5px 0 10px 0;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, .3));
    //filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, .05));
    overflow: unset;

    &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        top: -20px;
        left: 50%;
    }

    &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        top: -19px;
        left: 50%;
    }

    .q-list--bordered {
        border: 0;
    }

    .settings-no-expand {
        display: none;
    }

    .settings-item-header {
        padding-right: 11px;
    }

    .skin-toggle {
        display: flex;
        width: 32px;
        height: 16px;
        justify-content: space-between;
        align-items: center;
        margin-right: 21px;
        padding: 0 3px;
        border-radius: 13px;

        .skin-icon {
            width: 8px;
            height: 8px;
            background-repeat: no-repeat;
            background-position: center;
        }
    }

    .settings-icon {
        width: 14px;
        height: 14px;
    }

    .child-item {
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding: 0 16px 0 17px;
        cursor: pointer;

        .flag {
            width: 14px;
            height: 10px;
            display: inline-block !important;
            background-image: url("~public/image/yabo/png/lang_flag.png");
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

        i.arrow-show {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            font-weight: 700;
        }
    }

    i.icon-triangle1 {
        font-weight: 700;
    }

    .q-item {
        min-height: 40px;
    }

    .q-card__section {
        padding: 0;
    }

    .q-item__section--side {
        padding-left: 4px;

        &.q-item__section--avatar {
            min-width: 14px;
            padding-right: 6px;
            padding-left: 0;
        }

        .q-expansion-item__toggle-icon {
            font-size: 12px;
        }
    }
}
</style>
  