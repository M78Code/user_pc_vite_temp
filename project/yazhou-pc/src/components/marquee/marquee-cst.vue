<!-- @Description: 公告栏滚动组件 -->
<template>
    <div class="marquee-wrap col">
        <!-- 内嵌收起菜单 左侧 注单历史/赛果 -->
        <div class="iframe-tab-wrapper iframe-tab-wrapper-left" v-show="is_iframe && menu_collapse_status">
            <div class="tab-item" v-for="(tab, index) in left_tabs" :key="index" @click="menu_change(tab)">
                {{ tab.tab_name }}
            </div>
        </div>
        <div class="label line-height">{{ t('common.notice') }}</div>
        <div class="content col cursor-pointer  relative-position" ref="wrap"
            @click="emit('navigate', { path: '/announce', _blank: true })">
            <!--谷歌浏览器  -->
            <marquee v-if="$q.platform.is.name == 'chrome'" class="line-height fit" scrollAmount="40"
                :onmouseout="onmouseout" :onmouseover="onmouseover" v-html="notice_info.data" scrolldelay="1000" truespeed="1000">
            </marquee>
            <!-- 火狐浏览器 -->
            <div v-else class="animation-wrap line-height" ref="marquee_ref" @mouseenter="animation_pause"
                @mouseleave="animation_start" v-html="notice_info.data"></div>
        </div>
        <!-- 内嵌收起菜单 右侧 体育竞猜规则/任务中心/设置 -->
        <div class="iframe-tab-wrapper yb-ml20" v-show="is_iframe && menu_collapse_status">
            <div :class="theme.includes('y0') ? `tab-icon-item-y0-${tab.icon_name}` : `tab-icon-item-${tab.icon_name}`"
                v-for="(tab, index) in (lang === 'zh' ? right_tabs.slice(0, 2) : right_tabs.slice(0, 1))" :key="index"
                @click="menu_change(tab)" @mouseenter="show_gif($event, tab, index)"
                @mouseleave="hide_gif($event, tab, index)">
                <!--  v-if="show_menu_icon(tab.id)"  -->
                <img v-show="tab.is_show" :ref="theme.includes('y0') ? tab.icon_name + '_y0' : tab.icon_name"
                    :src="`${$g_image_preffix}/image/wwwassets/yabo/gif/${tab.icon_name}${theme.includes('y0') ? '_y0' : ''}.gif`"
                    class="tab-icon-img">
                <q-tooltip anchor="top middle" self="center middle"
                    :content-style="tooltip_style + ';transform:translateY(34px)'">{{ t(tab.tab_name) }}</q-tooltip>
            </div>
            <div class="iframe-settings"
                :class="theme.includes('y0') ? `tab-icon-item-y0-settings` : `tab-icon-item-settings`"
                @click="handle_settings_click" @mouseenter="show_gif($event, { icon_name: 'settings' }, 2)"
                @mouseleave="hide_gif($event, { icon_name: 'settings' }, 2)">

                <!-- 设置浮层弹窗 -->
                <g-settings v-if="show_g_settings" :show_settings="show_g_settings" :el="'.iframe-settings'"
                    :settings_items="settings_items" @auto_close="show_g_settings = !show_g_settings"></g-settings>
                <!-- 设置tip -->
                <q-tooltip anchor="top middle" self="center middle"
                    :content-style="tooltip_style + ';transform:translateY(34px)'">{{ t('common.set') }}</q-tooltip>
                <!-- hover显示gif -->
                <img v-show="right_tabs[2].is_show" :ref="theme.includes('y0') ? 'settings_y0' : 'settings'"
                    :src="`${$g_image_preffix}/image/wwwassets/yabo/gif/${theme.includes('y0') ? 'settings_y0' : 'settings'}.gif`"
                    class="tab-icon-img">

            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import lodash from 'lodash'
import { t } from "src/boot/i18n";;
// api接口
import { api_announce } from "src/api/index";
import gSettings from 'project_path/src/components/settings/index.vue';
import langs from "project_path/src/i18n/langs/index.mjs";
import {utils } from 'src/core/index.js'
import { LocalStorage } from 'src/core/index.js.js'
import zhugeTag from "src/core/http/zhuge-tag.js"
import gtagTag from 'src/core/http/gtag-tag.js'
import store from "src/store-redux/index.js";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import userCtr from 'src/core/user-config/user-ctr.js'
import globalAccessConfig  from  "src/core/access-config/access-config.js"

const emit = defineEmits(['navigate'])
const $q = useQuasar()
/** 国际化 */
;

/** 公告栏信息集合 */
const notice_info = reactive({
    /** 公告栏总宽度 */
    total_width: 0,
    /** 公告栏包裹宽度 */
    wrap_width: 0,
    /** 滚动是否暂停 */
    pause: false,
    /** 滚动偏移量 */
    translateX: false,
    /** 滚动速度 */
    speed: 1.5,
    /** 滚动时间间隔 */
    timer_interval: 32,
    /** 公告栏数据 */
    data: ''
})

/** 是否内嵌 */
const is_iframe = ref(utils.is_iframe)

/** 内嵌版 收起左侧菜单 */
const left_tabs = [
    { id: 2, tab_name: t('common.note_single_history'), path: "/bet_record", _blank: true }, //注单历史
    { id: 4, tab_name: t("common.amidithion"), path: "/match_results", _blank: true }, //赛果
]
/** 内嵌版 收起右侧菜单 */
const right_tabs = reactive([
    { id: 7, icon_name: 'sports_rules', tab_name: t("common.sports_betting_rules"), path: "/rule", is_show: false, _blank: true }, //体育竞猜规则
    { id: 9, icon_name: 'task_center', tab_name: "任务中心", icon: '', class: "activity_center animate-activity-entry activity_dot_bonus", path: "/activity", is_show: false, _blank: true },  // 任务中心
    { id: 99, icon_name: 'settings', tab_name: t("common.set"), is_show: false },  // 设置
])

const settings_items = [
    {
        id: 1,
        name: t('common.odds_set'),
        icon: {
            day: () => import('app/public/yazhou-pc/image/svg/icon-odds.svg'),
            night: () => import('app/public/yazhou-pc/image/svg/icon-odds-night.svg')
        },
        value_arr: [
            { label: t('odds.EU'), value: "EU", icon: 'panda-icon-contryEU', id: 1 },//欧洲盘
            { label: t('odds.ID'), value: "ID", icon: 'panda-icon-contryYN', id: 6 },//印尼盘
            { label: t('odds.US'), value: "US", icon: 'panda-icon-contryUS', id: 5 },//美式盘
            { label: t('odds.MY'), value: "MY", icon: 'panda-icon-contryML', id: 3 },//马来盘
            { label: t('odds.GB'), value: "GB", icon: 'panda-icon-contryUK', id: 4 },//英式盘
            { label: t('odds.HK'), value: "HK", icon: 'panda-icon-contryHK', id: 2 },//香港盘
        ],
        type: 'select'
    },
    {
        id: 2,
        name: t('common.change_lang'),
        icon: {
            day: () => import('app/public/yazhou-pc/image/svg/icon-lang.svg'),
            night: () => import('app/public/yazhou-pc/image/svg/icon-lang-night.svg')
            // day: require('public/image/yabo/svg/icon-lang.svg'),
            // night: require('public/image/yabo/svg/icon-lang-night.svg'),
        },
        value_arr: Object.keys(langs),
        type: 'select'
    },
    {
        id: 3,
        name: t('common.change_skin'),
        icon: {
            day: () => import('app/public/yazhou-pc/image/svg/icon-skin.svg'),
            night: () => import('app/public/yazhou-pc/image/svg/icon-skin-night.svg')
            // day: require('public/image/yabo/svg/icon-skin.svg'),
            // night: require('public/image/yabo/svg/icon-skin-night.svg'),
        },
        value_arr: [/*t('odds.HK'), t('odds.EU')*/],
        type: 'switch'
    },
]

/** 是否显示设置弹窗 */
const show_g_settings = ref(false)

/** stroe仓库 */
const { globalReducer, menuReducer, themeReducer } = store.getState()
const unsubscribe = store.subscribe(() => {
    theme.value = themeReducer.theme
    menu_collapse_status.value = menuReducer.menu_collapse_status
    global_click.value = globalReducer.global_click
})
/** 销毁监听 */
onUnmounted(unsubscribe)
/** 
* 用户余额是否展示状态 default: theme01
* 路径: project_path/src/store/module/theme.js
*/
const theme = ref(themeReducer.theme)
/** 
 * 获取菜单收起状态 default: false
 * 路径: project_path\src\store\module\menu.js
 */
const menu_collapse_status = ref(menuReducer.menu_collapse_status)
/** 
* 全局点击事件数 default: 0
* 路径: project_path\src\store\module\global.js
*/
const global_click = ref(globalReducer.global_click)

watch(
    () => global_click.value,
    () => show_g_settings.value = false
)

const is_destroy = ref(false)
onUnmounted(() => is_destroy.value = true)
/** 定时器 */
const timer_obj = reactive({
    get_data_timer: null,
    run_timer: null,
    settings_timer: null,
    show_gif_timer: null,
})
const timer_id = ref(null)

const marqueeRef = ref(null)
const wrapRef = ref(null)
/** 初始化 */
function init() {
    is_destroy.value = false
    const announceData = LocalStorage.get("announceData") || 'false'
    let today = new Date().getTime()
    let saveTime = 0
    if (JSON.parse(announceData)) {
        saveTime = new Date(JSON.parse(announceData).time).getTime()
    }
    if (announceData && (today - saveTime) / 1000 / 60 / 60 / 24 <= 2) {
        notice_info.data = JSON.parse(announceData).text
        if (timer_obj.get_data_timer) {
            clearTimeout(timer_obj.get_data_timer)
            tget_data_timer.value = null
        };
        timer_obj.get_data_timer = setTimeout(get_marquee_data, 6000);
    } else {
        get_marquee_data();
    }
    if ($q.platform.is.name == 'chrome') return
    if (timer_obj.run_timer) {
        clearTimeout(timer_obj.run_timer)
        timer_obj.run_timer = null
    };
    timer_obj.run_timer = setTimeout(() => {
        if (is_destroy.value) return
        //设置宽度
        notice_info.total_width = -parseInt(marqueeRef.value.offsetWidth);
        notice_info.wrap_width = parseInt(wrapRef.value.offsetWidth);
        timer_id.value = setInterval(animation, notice_info.timer_interval)
    }, 5000)
}
onMounted(init)

/** 
 * @description  内嵌版右侧菜单图标显示
 * @params {number} tab切换索引
 * @return {boolean}
 */
function show_menu_icon(icon_id) {
    // 中文语言下不存在活动内容，则不显示任务中心图标
    if (lang === 'zh' && icon_id === 9 && !lodash.get(userCtr.get_user(), 'activityList.length')) {
        return false
    }
    return true
}

/**
 * @Description: 内嵌版 菜单折叠后 点击处理
 * @param menu 当前点击菜单对象
 */
function menu_change(menu) {
    if (menu.path.includes('/activity') && !globalAccessConfig.get_activitySwitch()) {
        return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("msg.msg_09"))
    }
    if (menu.path.includes('/activity')) {
        if (userCtr.get_user_token()) {
            zhugeTag.send_zhuge_event("PC_任务中心");
            // 记录用户点击活动入口，每点击一次计算一次，不在活动内计算
            gtagTag.gtag_event_send('PC_activity_click', 'PC_活动', 'PC_活动中心', new Date().getTime())
            set_user_info({ token: userCtr.get_user_token(), view: this });
        }
    }
    emits('navigate', menu)
}
/**
 * @Description 内嵌版 折叠菜单 鼠标悬浮显示 gif
 * @param e 当前事件
 * @param tab 菜单对象
 * @param index 右侧菜单下标
 */
function show_gif(e, tab, index) {
    const icon_name = tab.icon_name
    // 显示gif
    right_tabs[index]['is_show'] = true
    // 播放gif
    // e.target.play && e.target.play()

    // gif播放完1次后，就停止播放
    clearTimeout(timer_obj.show_gif_timer)
    timer_obj.show_gif_timer = setTimeout(() => {
        right_tabs[index]['is_show'] = false
        // e.target.stop && e.target.stop()
    }, 1800)
}
/**
 * @Description 内嵌版 折叠菜单 鼠标移开菜单后 显示 svg
 * @param e 当前事件
 * @param tab 菜单对象
 * @param index 右侧菜单下标
 */
function hide_gif(e, tab, index) {
    const icon_name = tab.icon_name
    // 隐藏gif
    right_tabs[index]['is_show'] = false
    // 停止gif
    // e.target.stop && e.target.stop()
}
/**
 * @Description: 内嵌版 菜单折叠后 点击设置按钮处理
 * @param
 */
function handle_settings_click() {
    let show_g_settings = !show_g_settings.value

    clearTimeout(timer_obj.settings_timer)
    timer_obj.settings_timer = setTimeout(() => {
        show_g_settings.value = show_g_settings
    }, 50)
}

const marquee_ref = ref(null)
/**
 * @Description:公告栏文字滚动动画
 * @return {undefined} undefined
 */
function animation() {
    if (!notice_info.pause) {
        notice_info.translateX -= notice_info.speed
        if (notice_info.translateX < notice_info.total_width) {
            notice_info.translateX = notice_info.wrap_width
        }
        marquee_ref.value.style.transform = `translateX(${notice_info.translateX}px)`
    }
}

/** 谷歌浏览器 公告开始滚动 */
function onmouseout(e) {
    e.target.start()
}
/** 谷歌浏览器 公告停止滚动 */
function onmouseover(e) {
    e.target.stop()
}
/**
 * @Description:动画暂停
 * @return {undefined} undefined
 */
function animation_pause() {
    notice_info.pause = true
}
/**
 * @Description:动画开始
 * @return {undefined} undefined
 */
function animation_start() {
    notice_info.pause = false
}
/**
 * @Description:获取公告栏数据
 * @return {undefined} undefined
 */
function get_marquee_data() {
    notice_info.data = ""
    api_announce.post_marquee_data().then(res => {
        if (res && res.data && res.data.code == 200 && res.data.data) {
            lodash.each(lodash.get(res, 'data.data'), (item, index) => {
                if (index != 0) {
                    notice_info.data += '&ensp;&ensp;&ensp;&ensp;'
                }
                notice_info.data += item.context
            })

            let obj = {
                text: notice_info.data,
                time: new Date()
            }
            localStorage.setItem("announceData", JSON.stringify(obj))
        }
    })
}
/** 清除当前组件所有定时器 */
function clear_timer() {
    // 批量清除timeout定时器
    for (const key in timer_obj) {
        if (timer_obj[key]) {
            clearTimeout(timer_obj[key])
            timer_obj[key] = null
        }
    }
    // 清除interval定时器
    clearInterval(timer_id.value)
    timer_id.value = null
}
onUnmounted(clear_timer)
</script>
  
<style lang="scss" scoped>
.marquee-wrap {
    height: 100%;
    display: flex;
    align-items: center;

    .iframe-tab-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 5px;

        &.iframe-tab-wrapper-left {
            margin-right: 20px;
        }

        .tab-item {
            cursor: pointer;
            height: 22px;
            line-height: 22px;
            padding: 0 12px;
            color: #ffffff;
            border: none;
            border-radius: 26px;

            &:first-child {
                margin-right: 5px;
            }
        }

        [class*=tab-icon-item] {
            cursor: pointer;
            width: 22px;
            height: 22px;
            margin-left: 8px;

            .tab-icon-img {
                width: 22px;
                height: 22px;
            }
        }

        .tab-icon-item {
            &-sports_rules {
                background-image: url("app/yazhou-pc/image/svg/sports_rules.svg");
                background-size: cover;
            }

            &-task_center {
                background-image: url("app/yazhou-pc/image/svg/task_center.svg");
                background-size: cover;
            }

            &-settings {
                background-image: url("app/yazhou-pc/image/svg/settings.svg");
                background-size: cover;
            }
        }

        .tab-icon-item-y0 {
            &-sports_rules {
                background-image: url("app/yazhou-pc/image/svg/sports_rules_y0.svg");
                background-size: cover;
            }

            &-task_center {
                background-image: url("app/yazhou-pc/image/svg/task_center_y0.svg");
                background-size: cover;
            }

            &-settings {
                background-image: url("app/yazhou-pc/image/svg/settings_y0.svg");
                background-size: cover;
            }
        }
    }

    .line-height {
        height: 100%;
        line-height: 36px;
    }

    .label {
        padding: 0 6px;
        height: 22px;
        line-height: 22px !important;
        text-align: center;
        margin-right: 10px;
    }

    .content {
        height: 100%;
        overflow: hidden;
    }

    .animation-wrap {
        position: absolute;
        white-space: nowrap;
    }
}
</style>
  