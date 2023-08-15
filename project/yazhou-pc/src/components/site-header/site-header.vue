<!--
 * @Description: 站点页眉
-->
<template>
    <div class="c-site-header relative-position" :class="{ 'is-iframe': is_iframe }">
        <!-- 系统将在30分钟后进入维护，造成不便，深表歉意！ -->
        <div class="tip-content" :class="is_iframe ? 'tip-right' : 'tip-left'" @click="set_colse_tips_status(false)"
            v-if="is_colse_tips">
            <div class="content-wrap relative-position">
                <div class="yb-icon-triangle"></div>
                <!-- 此版面现实的所有直播内容仅供参考........ -->
                <div class="content">{{ t('tips.tips_site').replace('%s', minute) }}</div>
            </div>
        </div>
        <div class="header-item item1 row items-stretch relative-position"
            :class="[get_lang, vx_main_menu_toggle, { 'iframe-header-item1-hide': is_iframe && get_menu_collapse_status }]">
            <!-- logo -->
            <div v-if="is_hide_icon || is_iframe" class="icon-layout"></div>
            <!-- 当前是日间版并且有日间版配图就展示日间版图片，夜间版也一样 -->
            <a v-else class="row items-center  img-logo-wrap"
                :style="{ 'background-image': theme.includes('theme01') && pcDaytimeLink ? `url(${pcDaytimeLink})` : theme.includes('theme02') && pcNightLink ? `url(${pcNightLink})` : 'none' }">
                <div class="img-logo custom-format-img-logo-01"></div>
            </a>
            <!-- 运营位专题页 -->
            <div v-if="imgUrl" class="special-page-logo" :style="{ 'background-image': `url(${imgUrl})` }"
                @click="openPage(hostUrl, urlType)"></div>
            <!-- 菜单 -->
            <div class="site-nav row flex-nowrap col"
                :class="{ 'iframe-mini-site-nav-hide': is_iframe && get_menu_collapse_status }">
                <!-- 内嵌版 菜单状态切换按钮 -->
                <template v-if="is_iframe && !get_menu_collapse_status">
                    <div class="menu-collapse-btn btn-collapse" :class="collapse_style" @click="handle_menu_collapse">
                        <q-tooltip anchor="top middle" self="center middle"
                            :content-style="tooltip_style + ';transform:translateY(40px)'">{{
                                t('common.menu_collapsed',
                                    ['&nbsp;']) }}</q-tooltip>
                    </div>
                </template>

                <Tab :list="nav_list" @onclick="tab_click" is_show_line :currentIndex="current_index" :padding="15"
                    :hasActivity="hasActivity" :line_width="36" />
                <div class="swipper" v-if="vx_main_menu_toggle == 'mini'">
                    <transition-group tag="div" class='swipper_wrap' :name="isPre ? 'listPre' : 'list'">
                        <div v-for="(list, index) in currentSwipperArr" :key="`o_${index}`"
                            v-show="index === currentSwipperIndex" @mouseenter="stop" @mouseleave="go" class="swipper_item">
                            <img :src="list.img" />
                        </div>
                    </transition-group>

                    <!-- 右边运营广告图 点击占位盒子 -->
                    <div v-if="currentSwipperArr.length > 0" class="adv-box-r"
                        :class="{ mini: vx_main_menu_toggle == 'mini' }" @mouseenter="stop" @mouseleave="go"
                        @click="menu_change('R')" ref="adv_box"
                        :style="{ 'cursor': lodash.get(currentSwipperArr, `[${currentSwipperIndex}].isClick`) ? 'pointer' : 'unset' }">
                        <p v-if="theme.includes('theme01') && currentSwipperArr.length > 1 && showArrow" class="day_arrow">
                            <img :src="day_left" alt="" @click.stop="boxMouseup('pre')">
                            <img :src="day_right" alt="" @click.stop="boxMouseup('next')">
                        </p>
                        <p v-if="theme.includes('theme02') && currentSwipperArr.length > 1 && showArrow"
                            class="night_arrow">
                            <img :src="night_left" alt="" @click.stop="boxMouseup('pre')">
                            <img :src="night_right" alt="" @click.stop="boxMouseup('next')">
                        </p>
                    </div>
                </div>
            </div>

            <template>
                <div class="swipper" v-if="['normal', 'mini-normal'].includes(vx_main_menu_toggle)">
                    <transition-group tag="div" class='swipper_wrap' :name="isPre ? 'listPre' : 'list'">
                        <div v-for="(list, index) in currentSwipperArr" :key="`o_${index}`"
                            v-show="index === currentSwipperIndex" @mouseenter="stop" @mouseleave="go" class="swipper_item">
                            <img :src="list.img" />
                        </div>
                    </transition-group>

                    <!-- 右边运营广告图 点击占位盒子 -->
                    <div v-if="currentSwipperArr.length > 0" class="adv-box-r"
                        :class="{ mini: vx_main_menu_toggle == 'mini' }" @mouseenter="stop" @mouseleave="go"
                        @click="menu_change('R')" ref="adv_box"
                        :style="{ 'cursor': lodash.get(currentSwipperArr, `[${currentSwipperIndex}].isClick`) ? 'pointer' : 'unset' }">
                        <p v-if="theme.includes('theme01') && currentSwipperArr.length > 1 && showArrow" class="day_arrow">
                            <img :src="day_left" alt="" @click.stop="boxMouseup('pre')">
                            <img :src="day_right" alt="" @click.stop="boxMouseup('next')">
                        </p>
                        <p v-if="theme.includes('theme02') && currentSwipperArr.length > 1 && showArrow"
                            class="night_arrow">
                            <img :src="night_left" alt="" @click.stop="boxMouseup('pre')">
                            <img :src="night_right" alt="" @click.stop="boxMouseup('next')">
                        </p>
                    </div>
                </div>
                <template v-if="vx_get_left_menu_toggle">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, quod dolores? Facilis excepturi ab vel dolore cum accusamus, tenetur sapiente exercitationem cupiditate aliquid, nemo molestiae numquam obcaecati minima sequi magnam!</p>
                    <div class="show-date-wrap relative-position">
                        <headerTime />
                    </div>
                </template>
                <template v-else>
                    <div class="user-info rows">
                        <div class="row">
                            <div class="refresh-icon-wrap yb-flex-center">
                                <refresh icon_name="icon-balance_refresh" class="refresh-btn" :loaded="data_loaded"
                                    :disable="!vx_get_user" @click="get_balance" />
                            </div>
                            <div class="user-name">Hi,{{ lodash.get(vx_get_user, "uname") }}</div>
                        </div>
                        <div class="row">
                            <span class="balance-btn-eye" :class="vx_show_balance ? 'icon-eye_show' : 'icon-eye_hide2'"
                                @click="vx_set_show_balance(!vx_show_balance)"></span>
                            <div v-show="!vx_show_balance" class="balance-text-hide">
                                ******
                            </div>
                            <div v-show="vx_show_balance" class="balance-text-show yb-family-odds">
                                <!-- {{ (vx_get_user.balance || 0) | format_balance }} -->
                                {{ format_balance }}
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 左边运营广告图 点击占位盒子 -->
                <div class="adv-box-l"
                    v-if="(theme.includes('theme01') && dayClickType.typeL) || (theme.includes('theme02') && nightClickType.typeL)"
                    @click="menu_change('L')"
                    :style="{ 'cursor': (theme.includes('theme01') && dayClickType.urlL) || (theme.includes('theme02') && nightClickType.urlL) ? 'pointer' : 'unset' }">
                </div>
            </template>
        </div>

        <!-- 第2行 +++++++++++++++++++++++++++++++++++++++-->

        <div :class="['header-item item2 row items-center', { 'search-off': !get_global_switch.search_switch }]"
            :style="get_search_status ? 'z-index:900;' : ''">
            <div class="yb-site-left-width" v-if="get_global_switch.search_switch" :class="`${vx_main_menu_toggle}`">
                <div v-show="!get_search_status" @click.stop="search_hot_push.go_to_details()" class="search-wrap"
                    :class="vx_main_menu_toggle">
                    <div v-show="vx_main_menu_toggle !== 'mini'" class="ellipsis" @click.stop="show_search">
                        {{ search_hot_push.hot_push_name }}</div>
                    <icon class="icon"
                        :name="!['theme01_y0', 'theme02_y0'].includes(theme) ? `img:${img_search_icon}` : `img:${img_search_icon_y0}`"
                        size="14px" />
                </div>
            </div>

            <!-- 内嵌版 菜单状态切换按钮 -->
            <template v-if="is_iframe && get_menu_collapse_status && !get_search_status">
                <div class="menu-collapse-btn" :class="collapse_style" @click="handle_menu_collapse">
                    <q-tooltip anchor="top middle" self="center middle"
                        :content-style="tooltip_style + ';transform:translateY(34px)'">{{ t('common.menu_expand')
                        }}</q-tooltip>
                </div>
                <i class="icon-triangle3 q-icon c-icon menu-collapse-triangle"></i>
            </template>

            <marquee-cst v-if='!get_search_status' @navigate="navigate" />
            <div :style="`width:${is_iframe ? 10 : 14}px`"></div>
            <div class="col-right row items-center"
                :style="`width:${is_iframe ? 390 : parseInt(vx_get_layout_size.main_width * .3)}px`">

                <template v-if="is_iframe && get_menu_collapse_status">
                    <div class="swipper" v-if="['normal', 'mini-normal'].includes(vx_main_menu_toggle)">
                        <transition-group tag="div" class='swipper_wrap' :name="isPre ? 'listPre' : 'list'">
                            <div v-for="(list, index) in currentSwipperArr" :key="`o_${index}`"
                                v-show="index === currentSwipperIndex" @mouseenter="stop" @mouseleave="go"
                                class="swipper_item">
                                <img :src="list.img" />
                            </div>
                        </transition-group>

                        <!-- 右边运营广告图 点击占位盒子 -->
                        <div v-if="currentSwipperArr.length > 0 && vx_main_menu_toggle !== 'mini'" class="adv-box-r"
                            :class="{ mini: vx_main_menu_toggle == 'mini' }" @mouseenter="stop" @mouseleave="go"
                            @click="menu_change('R')" ref="adv_box"
                            :style="{ 'cursor': lodash.get(currentSwipperArr, `[${currentSwipperIndex}].isClick`) ? 'pointer' : 'unset' }">
                            <p v-show="theme.includes('theme01') && currentSwipperArr.length > 1 && showArrow"
                                class="day_arrow">
                                <img :src="day_left" alt="" @click.stop="boxMouseup('pre')">
                                <img :src="day_right" alt="" @click.stop="boxMouseup('next')">
                            </p>
                            <p v-show="theme.includes('theme02') && currentSwipperArr.length > 1 && showArrow"
                                class="night_arrow">
                                <img :src="night_left" alt="" @click.stop="boxMouseup('pre')">
                                <img :src="night_right" alt="" @click.stop="boxMouseup('next')">
                            </p>
                        </div>
                    </div>

                    <!-- 右侧 -->
                    <template v-if="vx_get_left_menu_toggle">
                        <div class="show-date-wrap relative-position is-iframe">
                            <!-- 时钟 -->
                            <headerTime />
                        </div>
                    </template>
                    <template v-else>
                        <div class="user-info">
                            <div class="user-name">Hi,{{ lodash.get(vx_get_user, "uname") }}</div>

                            <span class="balance-btn-eye" :class="vx_show_balance ? 'icon-eye_show' : 'icon-eye_hide2'"
                                @click="vx_set_show_balance(!vx_show_balance)"></span>

                            <div v-show="!vx_show_balance" class="balance-text-hide">
                                ******
                            </div>

                            <div v-show="vx_show_balance" class="balance-text-show yb-family-odds">
                                <!-- {{ (vx_get_user.balance || 0) | format_balance }} -->
                                {{ format_balance }}
                            </div>

                            <refresh v-show="vx_show_balance" icon_name="icon-balance_refresh" class="refresh-btn"
                                :loaded="data_loaded" :disable="!vx_get_user" @click="get_balance" />
                        </div>
                    </template>
                    <!-- 左边运营广告图 点击占位盒子 -->
                    <div class="adv-box-l"
                        v-if="(theme.includes('theme01') && dayClickType.typeL) || (theme.includes('theme02') && nightClickType.typeL)"
                        @click="menu_change('L')"
                        :style="{ 'cursor': (theme.includes('theme01') && dayClickType.urlL) || (theme.includes('theme02') && nightClickType.urlL) ? 'pointer' : 'unset' }">
                    </div>
                </template>

                <template v-if="!vx_get_left_menu_toggle">
                    <headerTime class="col" :class="{ 'text-right': get_menu_collapse_status }" />
                </template>

                <template v-if="!is_iframe || (is_iframe && !get_menu_collapse_status)">
                    <popupLanguage />
                    <PopupHandicap />
                    <PopupSet />
                </template>
            </div>
        </div>
        <!-- <timer /> -->
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted, onBeforeMount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import lodash from 'lodash'
import { useI18n } from "vue-i18n";
/** 组件 */
import marqueeCst from "project_path/src/components/marquee/marquee.vue";
import PopupHandicap from "project_path/src/components/popup-select/popup-handicap.vue"
import PopupSet from "project_path/src/components/popup-select/popup-set.vue"
import popupLanguage from "project_path/src/components/popup-select/popup-language.vue"

import { TabWapper as Tab } from "src/components/common/tab"
import { RefreshWapper as refresh } from "src/components/common/refresh";
import headerTime from "project_path/src/components/site-header/header-time.vue"
// import timer from "project_path/src/components/site-header/timer.vue"

/** 工具.js */
import { useMittEmit, useMittOn } from 'src/core/mitt/index.js'
import * as MITT_TYPES from 'project_path/src/core/mitt/mitt-keys.js'
// import store from "project_path/src/store/index.js";
import store from "src/store-redux/index.js";
import SearchHotPush from "src/core/search-class/search_hot_push.js"
import utils from "src/core/utils/utils.js"
import zhugeTag from "src/core/http/zhuge-tag.js"
// import { gtag_event_send } from "src/core/http/gtag-tag.js"
import { get_remote_time } from "src/core/formart/module/format-time.js"
import { ss } from 'src/core/utils/web-storage.js'

/** api */
import { api_account, api_common } from "src/api/index.js";
// TODO: 未知用途
// import AllDomain from 'src/public/utils/http/all_domain.js'
import img_search_icon from 'app/public/yazhou-pc/image/svg/search-icon.svg'
import img_search_icon_y0 from 'app/public/yazhou-pc/image/svg/y0-search-icon.svg'
import day_left from 'app/public/yazhou-pc/image/svg/day_left.svg'
import day_right from 'app/public/yazhou-pc/image/svg/day_right.svg'
import night_left from 'app/public/yazhou-pc/image/svg/night_left.svg'
import night_right from 'app/public/yazhou-pc/image/svg/night_right.svg'


/** props传参 */
const props = defineProps({
    nav_list: {
        type: Array,
        default: [],
    },
    site_header_cls: {
        type: String,
        default: "",
    },
    isActivity: {
        type: Boolean,
        default: false,
    },
    imgUrl: {
        type: String,
        default: "",
    },
    hostUrl: {
        type: String,
        default: "",
    },
    urlType: {
        type: String,
        default: "",
    },
    hasActivity: {
        type: Boolean,
        default: false,
    }
})

/** 获取mixins */
// const { proxy } = getCurrentInstance()

/** 国际化 */
const { t } = useI18n();

/** 菜单数据 */
const menu_data = reactive({})
/** 搜索热推赛事 */
const search_hot_push = ref(new SearchHotPush())
/** 地址栏隐藏logo */
const is_hide_icon = ref(false)
/** 是否内嵌 */
const is_iframe = ref(utils.is_iframe)
/** 刷新组件loading */
const data_loaded = ref(false)
/** 当前顶部菜单选中的索引 */
const current_index = ref(0)
/** 图片链接pc日间 左 */
const pcDaytimeLink = ref(null)
/** 图片链接 pc夜间 左 */
const pcNightLink = ref(null)
/** 设置维护提示状态 */
const is_colse_tips = ref(false)
/** 维护提示时间 */
const minute = ref(0)
/** 日间节庆资源跳转类型 */
const dayClickType = reactive({ typeL: 0, urlL: null })
/** 夜间版 */
const nightClickType = reactive({ typeL: 0, urlL: null })
/** 日间版轮播图 */
let daySwipper = reactive([])
/** 夜间版轮播图 */
let nightSwipper = reactive([])
/** 当前轮播图索引 */
const currentSwipperIndex = ref(0)
/** 当前资源图片数组 */
let currentSwipperArr = reactive([])
/** 展示右侧图片资源上的左右箭头 */
const showArrow = ref(false)
/** 是否切换到上一张图片 */
const isPre = ref(false)

/** 获取项目主题 */
const theme = ref('')
/** 全局开关 */
const get_global_switch = ref(false)
/** 获取用户token */
const get_user_token = ref('')
/** 获取用户信息 */
const vx_get_user = ref({})
/** 判断是否是登录状态 */
const vx_is_invalid = ref(false)
/** 选中菜单类型 */
const vx_cur_menu_type = ref({})
/** 获取菜单收起状态 */
const get_menu_collapse_status = ref(false)
/** 搜索显示状态 */
const get_search_status = ref(false)
/** 是否显示余额 */
const vx_show_balance = ref(false)
/** 获取语言 */
const get_lang = ref('')
/** 左侧菜单的切换状态 true: 展开 false: 收缩 */
const vx_get_left_menu_toggle = ref(true)
/** 左侧列表显示形式 normal：展开 mini：收起 */
const vx_main_menu_toggle = ref('')
/** 浏览器 宽高等数据 */
const vx_get_layout_size = ref({})


/** stroe仓库 */
// const unsubscribe = store.subscribe(() => {
//     const new_state = store.getState()
//     theme.value = new_state.theme
//     get_global_switch.value = new_state.global_switch
//     vx_get_user.value = new_state.user || {}
//     vx_is_invalid.value = new_state.is_invalid
//     vx_cur_menu_type.value = new_state.cur_menu_type || {}
//     get_menu_collapse_status.value = new_state.menu_collapse_status
//     get_search_status.value = new_state.search_status
//     vx_show_balance.value = new_state.show_balance
//     get_lang.value = new_state.lang
//     vx_get_left_menu_toggle.value = new_state.left_menu_toggle
//     vx_main_menu_toggle.value = new_state.main_menu_toggle
//     vx_get_layout_size.value = new_state.layout_size || {}
// })
// onUnmounted(unsubscribe)

/** 注册并监听"showModel"事件 */
const { off: off_show_model } = useMittOn(MITT_TYPES.EMIT_SITE_SHOW_MODEL, show_activity_page)
/** 关闭监听"showModel"事件 */
onUnmounted(() => off_show_model(MITT_TYPES.EMIT_SITE_SHOW_MODEL))
/** bet接口返回canceled,打开注单历史 */
const { off: off_open_history } = useMittOn(MITT_TYPES.EMIT_SITE_OPEN_HISTORY, open_history_fun)
/** 关闭 */
onUnmounted(() => off_open_history(MITT_TYPES.EMIT_SITE_OPEN_HISTORY))


/** 路由对象 */
const route = useRoute()
/** 路由实例 */
const router = useRouter()

/** 定时器 */
const showBannerSwipperTimer = ref(null)
const show_activity_page_timer = ref(null)
const countDownTimer = ref(null)
const showBannerSwipperTimer_timeout = ref(null)
/** 清除全部定时器 */
function clear_timer() {
    if (showBannerSwipperTimer.value) {
        clearTimeout(showBannerSwipperTimer.value)
        showBannerSwipperTimer.value = null
    }
    if (show_activity_page_timer.value) {
        clearTimeout(show_activity_page_timer.value)
        show_activity_page_timer.value = null
    }
    if (countDownTimer.value) {
        clearTimeout(countDownTimer.value)
        countDownTimer.value = null
    }
    if (showBannerSwipperTimer_timeout.value) {
        clearTimeout(showBannerSwipperTimer_timeout.value)
        showBannerSwipperTimer_timeout.value = null
    }
}
/** 钩子触发 */
onBeforeMount(clear_timer)


/** 保存显示搜索组件状态 */
const set_search_status = (data) => store.dispatch({
    type: 'set_search_status',
    data
})
/** 初始化 */
function init() {
    is_hide_icon.value = ss.get('hide_logo_icon') === "1";
    if (route.name == "search") {
        show_search();
    } else {
        set_search_status(false);
    }
    set_current_index()
    getFestivalBanner()
    compute_colse_tips_time()
}
onMounted(init)

/**
* 点击箭头切换图片
*/
function boxMouseup(type) {
    return lodash.debounce(() => {
        let timer_ = null
        if (timer_) {
            clearTimeout(timer_)
            timer_ = null
        }
        // 上一张
        if (type == 'pre') {
            isPre.value = true;
            if (currentSwipp.value == 0) {
                change(currentSwipperArr.length - 1)
            } else {
                change(currentSwipp.value - 1)
            }
            timer_ = setTimeout(() => {
                isPre.value = false;
            }, 400);
        }
        // 下一张
        if (type == 'next') {
            if (currentSwipp.value == currentSwipperArr.length - 1) {
                change(0)
            } else {
                change(currentSwipp.value + 1)
            }
        }
    }, 300)
}
/** 注销 */
// TODO: debounce_throttle_cancel在原型上 拿不到
// onUnmounted(() => debounce_throttle_cancel(boxMouseup))

/**
 * 点击左右按钮--切换图片
 */
function change(index) {
    currentSwipp.value = index
}

/** 展开搜索 */
function show_search() {
    if (!get_global_switch.value.search_switch) {
        return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("msg.msg_09"))
    }
    set_search_status(true);
}

/**
 * 活动弹窗跳转判断
 */
function show_activity_page(n, urlType) { // 首页弹窗跳转判断
    if (n == 'act') {
        let index = props.nav_list.findIndex(item => item.path.includes('activity'));
        tab_click({ index })
    } else {
        //清除定时器
        clearTimeout(show_activity_page_timer.value);
        show_activity_page_timer.value = null
        show_activity_page_timer.value = setTimeout(() => {
            // 0：无连接，1：内部导航，2：弹窗连接
            openPage(n, urlType)
        }, 300);
    }
}

/** 保存显示搜索组件状态 */
const vx_set_user = (data) => store.dispatch({
    type: 'set_user',
    data
})
/**
 * 导航栏菜单点击
 * @param {obj} 菜单路由对象 {id: 唯一id, tab_name: 菜单名, path: 跳转路径, _blank: 是否打开单独的窗口} 具体参考 vue init_site_header() 方法
 */
function tab_click(obj) {
    // 埋点配置
    let menu = props.nav_list[obj.index]
    if (menu.path.includes('/activity') && !get_global_switch.value.activity_switch) {
        // return this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.t("msg.msg_09"));
        return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, t("msg.msg_09"))
    }
    // 电竞
    if (menu.id == 5) {
        zhugeTag.send_zhuge_event('PC_导航_电子竞技');
        // TODO: 菜单数据
        // let menu_id = $menu.menu_data.cur_level1_menu == 'early' ? 3020225 : 3020125
        // $menu.menu_change(2, menu_id)
    }
    // 虚拟体育
    else if (menu.id == 3) {
        // $menu.menu_change(1, 'virtual_sport', 'nav')
    }
    // 如果当前点击的是 Home
    else if (obj.index == 0) {
        // $menu.menu_change(1, 'play')
    } else {
        let pathObj = menu;
        // 如果点击的是活动入口，就更新一下用户信息
        if (pathObj.path.includes('/activity')) {
            if (get_user_token.value) {
                zhugeTag.send_zhuge_event("PC_任务中心");
                // 记录用户点击活动入口，每点击一次计算一次，不在活动内计算
                // gtag_event_send('PC_activity_click', 'PC_活动', 'PC_活动中心', new Date().getTime())
                vx_set_user({ token: get_user_token.value, view: this });
            }
        }

        navigate(menu);
    }
}

/**
 * @description 导航路由跳转
 * @param {obj} 路由数据
 * 不同的路由根据具体的需求，有不同的打开方式
 * 弹出式窗口有不同大小之分，具体视需求UI而定
 * /rule 体育规则
 * /virtual 虚拟体育
 * /e_sport 电子竞技
 * /bet_record 注单历史
 * ^/activity 活动相关
 * /activity_aegis 活动维护页
 */
function navigate(obj) {
    let _path = obj.path;
    if (route.name == "rule" || !_path) {
        return;
    }
    // 改为欧洲杯大师赛路径
    let _window_width = (['/activity', '/activity_aegis'].includes(_path)) ? 1217 : 1000;
    if (_path == '/match_results') {
        _window_width = 1170
    }
    let _window_height = 650;
    if (['/activity', '/activity_aegis'].includes(_path)) {
        _window_height = 800;
        let maintaining = lodash.get(vx_get_user.value, "maintaining");
        if (maintaining && maintaining == true) {
            _path = '/activity_aegis';
        }
    }

    let _window_offset_left = (screen.width - _window_width) / 2;
    let _window_offset_top = (screen.height - _window_height) / 2;
    let url = "";
    if (_path == "/bet_record") {
        url = _path;
        let hide_logo_icon = ss.get('hide_logo_icon');
        url = router.resolve({ path: url }).href
        const searchParams = new URLSearchParams('');
        if (hide_logo_icon) {
            // if(url.includes('?')){
            //   url = url +'&i_h=1&t='+new Date().getTime();
            // } else {
            //   url = url +'?i_h=1&t='+new Date().getTime();
            // }
            searchParams.set('i_h', 1);
        }
        // 在#/前增加参数api,i_h
        searchParams.set('t', new Date().getTime());
        let url_temp_p = searchParams.toString();
        // 组合url参数
        url = '/' + (url_temp_p ? ('?' + url_temp_p) : '') + url.substr(url.indexOf('#/'))

        // url = '/'+url.substr(url.indexOf('#/'))
        show_record(
            url,
            _window_height,
            _window_width,
            _window_offset_top,
            _window_offset_left
        );
        return;
    }

    // 增加参数
    let hide_logo_icon = ss.get('hide_logo_icon');
    if (_path.includes("http")) {
        url = _path;
        if (hide_logo_icon) {
            if (url.includes('?')) {
                url = url + '&i_h=1&t=' + new Date().getTime();
            } else {
                url = url + '?i_h=1&t=' + new Date().getTime();
            }
        }
    } else {
        // 本地路径的时候
        url = router.resolve({ path: _path }).href;
        // 在#/前增加参数api,i_h

        const searchParams = new URLSearchParams('');

        if (hide_logo_icon) {
            searchParams.set('i_h', 1);
        }
        searchParams.set('t', new Date().getTime());
        let url_temp_p = searchParams.toString();
        // 组合url参数
        url = '/' + (url_temp_p ? ('?' + url_temp_p) : '') + url.substr(url.indexOf('#/'))
    }

    if (obj._blank) {
        window.open(
            url,
            "",
            `height=${_window_height}, width=${_window_width}, top=${_window_offset_top}, left=${_window_offset_left}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
        );
    } else {
        location.href = url;
    }
}

/**
  * 运营位专题页跳转判断
  */
function openPage(_url, urlType) {
    let linkType
    // 0：无连接，1：内部导航，2：弹窗连接
    switch (String(urlType)) {
        case '1':
            let url_arr = _url.split('/')
            // 跳转详情
            if (url_arr[0] == 'details') {
                router.push('/' + _url)
                linkType = '详情页'
            }
            // 跳转热门赛事
            else if (url_arr[0] == 'hot') {
                let menu_id = get_hot_menuid(url_arr[1])
                if (menu_id) {
                    // /TODO:  $menu
                    // $menu.menu_change(2, menu_id, 'hot')
                    linkType = '热门赛事'
                }
            }

            break;
        case '2':
            let _window_offset_left = (screen.width - 1000) / 2;
            let _window_offset_top = (screen.height - 650) / 2;
            show_record(_url, 650, 1000, _window_offset_top, _window_offset_left);
            linkType = '弹窗链接'
            break;
        case '0':
            return false;
    }

    let link_key = '跳转链接'
    let obj = {
        [link_key]: linkType
    }
    // 发送诸葛埋点事件
    zhugeTag.send_zhuge_event('TY_PC_首页_节庆UI挂件点击', obj)
}

/**
 * @Description 获取热门赛事ID
 * @param {undefined} undefined
*/
function get_hot_menuid(tid) {
    // 赛事或竟足
    if (tid == 30199 || tid == 30101) {
        return tid
    }
    // let menu_obj = $menu.menu_obj.hot.topMenuList.filter(item => item.field2 == tid)[0]
    if (menu_obj) {
        return menu_obj.menuId
    }
}


/** 保存显示搜索组件状态 */
const set_show_login_popup = (data) => store.dispatch({
    type: 'set_show_login_popup',
    data
})
/**
 * 打开注单历史窗口
 */
function show_record(
    path,
    _window_height,
    _window_width,
    _window_offset_top,
    _window_offset_left
) {
    // proxy.show_fail_alert();
    if (vx_is_invalid.value) {
        return;
    }
    if (!vx_get_user.value) {
        set_show_login_popup({
            isShow: true,
            redirect: "bet_order_history",
        });
    } else {
        window.open(
            path,
            "",
            `height=${_window_height}, width=${_window_width}, top=${_window_offset_top}, left=${_window_offset_left}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
        );
    }
}

/**
 * @Description 打开注单历史
 * @param {undefined} undefined
 * @return {boolean} 
*/
function open_history_fun() {
    console.log('打开注单历史');
    tab_click({
        'index': 3, 'event': null, 'item': {
            'id': 2, 'path': "bet_record", 'tab_name': "注单历史", '_blank': true
        }
    });
}

/**
 * @Description 设置tab选中
 * @param {undefined} undefined
*/
function set_current_index() {
    let c_index = 0
    // TODO: $menu
    // if ($menu.menu_data.is_esports && !['hot', 'play'].includes(vx_cur_menu_type.value.type_name)) {
    //     // 电竞
    //     c_index = 1;
    //     // TODO: $menu
    // } else if ((route.name.includes('virtual') || $menu.menu_data.cur_level1_menu == 'virtual_sport') && vx_cur_menu_type.value.type_name != 'play') {
    //     // 虚拟体育
    //     let index = props.nav_list.findIndex(item => item.id == 3)
    //     if (index > 0) {
    //         c_index = index
    //     }
    // }
    current_index.value = c_index;
}

/**
 * 节庆资源接口
 */
function getFestivalBanner() {
    api_common.queryFestivalBanner().then(res => {
        const data = lodash.get(res, 'data.data') || {}
        // 服务器时间
        // let stime = proxy.mx_get_remote_time();
        let _time = data.startTime && data.endTime;
        // 当前时间处于开始时间和结束时间中间时才展示图片
        // if (Object.keys(data).length && _time && (data.startTime <= stime && stime <= data.endTime)) {
        //     pcDaytimeLink.value = proxy.get_file_path(data.img1); //PC日间 左边图片链接
        //     pcNightLink.value = proxy.get_file_path(data.img2); //PC夜间 左边图片链接
        //     nightClickType.typeL = parseInt(data.img2Type); // 夜间版跳转类型  左边
        //     dayClickType.typeL = parseInt(data.img1Type); // 日间版跳转类型   左边
        //     nightClickType.urlL = data.img2Url; // 夜间版跳转链接  左边
        //     dayClickType.urlL = data.img1Url; // 日间版跳转链接  左边
        //     // 图片地址，点击类型，跳转链接
        //     let { img5, img5Type, img5Url, img6, img6Type, img6Url, img7, img7Type, img7Url, img8, img8Type, img8Url, img9, img9Type, img9Url, img10, img10Type, img10Url } = { ...data }
        //     // 轮播图日间版
        //     if (img5) {
        //         daySwipper.push({ img: proxy.get_file_path(img5), imgType: img5Type, imgUrl: img5Url, isClick: img5Type != 0 && img5Url })
        //     }
        //     if (img6) {
        //         daySwipper.push({ img: proxy.get_file_path(img6), imgType: img6Type, imgUrl: img6Url, isClick: img6Type != 0 && img6Url })
        //     }
        //     if (img7) {
        //         daySwipper.push({ img: proxy.get_file_path(img7), imgType: img7Type, imgUrl: img7Url, isClick: img7Type != 0 && img7Url })
        //     }

        //     // 轮播图夜间版
        //     if (img8) {
        //         nightSwipper.push({ img: proxy.get_file_path(img8), imgType: img8Type, imgUrl: img8Url, isClick: img8Type != 0 && img8Url })
        //     }
        //     if (img9) {
        //         nightSwipper.push({ img: proxy.get_file_path(img9), imgType: img9Type, imgUrl: img9Url, isClick: img9Type != 0 && img9Url })
        //     }
        //     if (img10) {
        //         nightSwipper.push({ img: proxy.get_file_path(img10), imgType: img10Type, imgUrl: img10Url, isClick: img10Type != 0 && img10Url })
        //     }
        //     // 根据日间或者夜间来判断用哪个数据
        //     if (theme.value.includes('theme01') && daySwipper.length > 0) {
        //         currentSwipperArr = daySwipper;
        //     }
        //     if (theme.value.includes('theme02') && nightSwipper.length > 0) {
        //         currentSwipperArr = nightSwipper;
        //     }
        //     // 图片大于一张的时候触发轮播
        //     if (currentSwipperArr.length > 1) {
        //         clearTimeout(showBannerSwipperTimer.value)
        //         //在DOM加载完成后，下个tick中开始轮播
        //         nextTick(() => {
        //             showBannerSwipperTimer.value = setInterval(() => {
        //                 autoPlay()
        //             }, 7000)
        //         })
        //     }
        // }
    })
}
/**
 * 图片自动轮播
 */
function autoPlay() {
    currentSwipp.value++
    if (currentSwipp.value > currentSwipperArr.length - 1) {
        currentSwipp.value = 0
    }
}

/**
 * 计算维护提示时间
 */
function compute_colse_tips_time() {
    let curTime = get_remote_time()
    if (vx_get_user.value.maintainTime) {
        let serverTimer = Number(vx_get_user.value.maintainTime),
            countDown = Math.floor((serverTimer - curTime) / 1000 / 60);
        if (countDown > 0) {
            set_colse_tips_status(true)
            minute.value = countDown
        }
    }
    if (is_colse_tips.value) {
        countDownTimer.value = setTimeout(() => {
            set_colse_tips_status(false)
        }, 60000);
    }
}

/**
 * 设置维护提示状态
 */
function set_colse_tips_status(state) {
    is_colse_tips.value = state
    if (!state) {
        clearTimeout(countDownTimer.value)
        countDownTimer.value = null
    }
}

/** 内嵌版 菜单收起状态 */
const set_menu_collapse_status = (data) => store.dispatch({
    type: 'set_menu_collapse_status',
    data
})
/** 内嵌版 菜单状态切换按钮 */
function handle_menu_collapse() {
    set_menu_collapse_status(!get_menu_collapse_status.value)
}

/** 设置用户余额是否展示状态 */
const vx_set_user_balance = (data) => store.dispatch({
    type: 'set_user_balance',
    data
})


/**
 * @description 获取用户余额
 * @return {undefined} undefined
 */
function get_balance() {
    data_loaded.value = false;
    let uid = vx_get_user.value.uid;
    api_account.check_balance({ uid, t: new Date().getTime() }).then(res => {
        const result = lodash.get(res, "data.data");
        const code = lodash.get(res, "data.code");
        data_loaded.value = true;
        if (code == 200) {
            vx_set_user_balance(result.amount);
        }
        // proxy.show_fail_alert()
    }).catch(err => {
        console.error(err)
        data_loaded.value = true;
    });
}

/** 计算菜单状态切换按钮 */
const collapse_style = computed(() => {
    if (theme.value.includes('y0')) {
        return get_menu_collapse_status.value ? 'collapse-open-y0' : 'collapse-hide-y0'
    } else {
        return get_menu_collapse_status.value ? 'collapse-open' : 'collapse-hide'
    }
})

const format_balance = computed(() => {
    const num = vx_get_user.value.balance
    if (num && num > 0) {
        let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/)

        // 保留两位小数
        let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00"

        let _num = _split[1] + '.' + decimal
        return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
    return '0.00';
})

/** 设置用户余额是否展示状态 */
const vx_set_show_balance = (data) => store.dispatch({
    type: 'set_show_balance',
    data
})

/**
* @Description 节庆资源图片点击
* @param {side} L 左边的图片点击 R 右边的图片点击
*/
function menu_change(side) {
    // _type      1 跳转赛事菜单 2打开弹窗 0不跳转
    let _type, _url = '';
    // 日间版/夜间版  左边还是右边
    if (['theme01', 'theme01_y0'].includes(theme.value)) {
        if (side == 'L') {
            _type = dayClickType.value.typeL
            _url = dayClickType.value.urlL
        } else {
            _type = lodash.get(daySwipper, `[${currentSwipp.value}].imgType`)
            _url = lodash.get(daySwipper, `[${currentSwipp.value}].imgUrl`)
        }
    } else {
        if (side == 'L') {
            _type = nightClickType.value.typeL
            _url = nightClickType.value.urlL
        } else {
            _type = lodash.get(nightSwipper, `[${currentSwipp.value}].imgType`)
            _url = lodash.get(nightSwipper, `[${currentSwipp.value}].imgUrl`)
        }
    }
    let linkType
    switch (String(_type)) {
        case '1':
            let url_arr = _url.split('/')
            // 跳转详情
            if (url_arr[0] == 'details') {
                router.push('/' + _url)
                linkType = '详情页'
            }
            // 跳转热门赛事
            else if (url_arr[0] == 'hot') {
                let menu_id = get_hot_menuid(url_arr[1])
                if (menu_id) {
                    // $menu.menu_change(2, menu_id, 'hot')
                    linkType = '热门赛事'
                }
            }

            break;
        case '2':
            let _window_offset_left = (screen.width - 1000) / 2;
            let _window_offset_top = (screen.height - 650) / 2;
            show_record(_url, 650, 1000, _window_offset_top, _window_offset_left);
            linkType = '弹窗链接'
            break;
        case '0':
            return false;
    }

    let link_key = '跳转链接'
    let obj = {
        [link_key]: linkType
    }
    // 发送诸葛埋点事件
    zhugeTag.send_zhuge_event('TY_PC_首页_节庆UI挂件点击', obj)
}

/**
 * 鼠标移出--3s后重新开始轮播
 */
function go() {
    showArrow.value = false;
    clearTimeout(showBannerSwipperTimer_timeout.value)
    clearInterval(showBannerSwipperTimer.value)
    // 图片不止一张的时候才触发轮播
    if (currentSwipperArr.length > 1) {
        // 3秒之后立即切换一次图片
        showBannerSwipperTimer_timeout.value = setTimeout(() => {
            autoPlay()
            nextTick(() => {
                // 然后恢复每7秒一次的轮播
                showBannerSwipperTimer.value = setInterval(() => {
                    // autoPlay()
                }, 7000)
            })
        }, 3000)
    }
}
/**
 * 鼠标移入--暂停轮播
 */
function stop() {
    clearInterval(showBannerSwipperTimer.value);
    clearTimeout(showBannerSwipperTimer_timeout.value);
    showBannerSwipperTimer.value = null;
    showArrow.value = true;
}

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

/** 清除虚拟投注数据 */
const vx_virtual_bet_clear = (data) => store.dispatch({
    type: 'virtual_bet_clear',
    data
})
watch(
    () => vx_cur_menu_type.type_name,
    () => {
        set_current_index();
        // 清除虚拟体育和电竞的投注项
        vx_virtual_bet_clear();
    }
)

watch(
    () => menu_data.cur_level2_menu,
    () => set_current_index()
)

watch(
    () => props.nav_list.length,
    () => set_current_index()
)


/**
 * 切换皮肤的时候重新启动计时器
 */
watch(
    () => theme.value,
    (o) => {
        clearInterval(showBannerSwipperTimer.value);
        currentSwipperArr = []
        if (o && o.includes('theme01')) {
            if (daySwipper.length > 0) {
                currentSwipperArr = daySwipper;
            }
        } else {
            if (nightSwipper.length > 0) {
                currentSwipperArr = nightSwipper;
            }
        }
        // 图片大于一张开启轮播
        if (currentSwipperArr.length > 1) {
            showBannerSwipperTimer.value = setInterval(() => {
                autoPlay()
            }, 7000)
        }
    }
)

</script>


<style lang="scss">
// 运营位专题页
.special-page-logo {
    background-size: 68.5px;
    background-repeat: no-repeat;
    background-position: 0 center;
    font-size: 14px;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 75px;
    position: relative;
    margin-right: 40px;
    cursor: pointer;
}

.activity_bonus {
    .activity_dot_bonus::after {
        content: "";
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        position: absolute;
        top: 10px;
        right: 0;
    }
}

/*  用户信息 */
.user-info {
    display: flex;
    align-items: center;
    padding-right: 15px;

    &.rows {
        flex-direction: column;
        justify-content: center;
        line-height: 20px;
        padding-right: 20px;

        .row {
            width: 100%;
            align-items: center;
            justify-content: flex-end;
        }

        .user-name {
            margin-right: 0;
        }

        .c-refresh {
            width: auto !important;
            height: auto !important;
        }

        .refresh-icon-wrap {
            width: 16px;
            height: 16px;
            margin-right: 10px;
        }
    }

    .user-name {
        margin-right: 20px;
    }

    .balance-btn-eye {
        margin-right: 8px;
        cursor: pointer;
    }

    .balance-text-show {
        font-size: 14px;
    }

    .refresh-btn {
        margin-left: 6px;
    }
}

.icon-layout {
    width: 30px;
}

.c-site-header {
    height: 96px;

    .tip-content {
        position: absolute;
        top: 55px;
        width: 130px;
        z-index: 1200;

        &.tip-left {
            left: 105px;
        }

        &.tip-right {
            top: 15px;
            right: 120px;
        }

        .yb-icon-triangle {
            position: absolute;
            width: 16px;
            height: 8px;
            top: -8px;
            left: 0px;
        }

        .content-wrap {
            color: #fff;
            padding: 2px 3px;
            border-radius: 3px;
            border-top-left-radius: 0;
        }
    }

    &.activity_header {
        height: 60px;
        position: absolute;
        z-index: 9999;
    }

    .header-item {
        &.search-off {
            padding-left: 15px;
        }

        .yb-site-left-width {
            display: flex;
            height: 100%;

            &.normal,
            &.mini-normal {
                width: 220px;
                margin-right: 13px;
            }

            .search-wrap {
                display: flex;
                align-items: center;
                height: 100%;
                width: 100%;
                padding: 0 0px 0 16px;

                &.mini-normal,
                &.normal {
                    padding: 0 16px;
                }

                &.mini {
                    width: 50px;
                    margin-right: 23px;

                    .search-icon {
                        margin-left: 0px;
                        margin-right: 12px;
                    }
                }

                .search-icon {
                    cursor: pointer;
                }

                .ellipsis {
                    cursor: text;
                    flex: 1;
                }
            }
        }

        &.item1 {
            position: absolute;
            width: 100%;
            z-index: 1000;
            top: 0;
            left: 0;
            height: 60px;
            transition: height .3s ease-in-out;

            &.iframe-header-item1-hide {
                height: 0 !important;
                overflow: hidden;

                .swipper {
                    transform: scale(0);
                }
            }

            &.normal,
            &.mini-normal {
                background-repeat: no-repeat;
                background-size: auto 100%;
                background-position: right 130px top 0;
            }

            &.mini {
                .site-nav {
                    background-repeat: no-repeat;
                    background-size: auto 100%;
                    background-position: right 10px top 0;

                    .tab-wrap {
                        z-index: 200;
                        width: auto !important;

                        .item-wrap {
                            position: relative;
                            width: 100%;
                        }
                    }
                }
            }

            &.vi {
                .site-nav {
                    font-size: 12px;
                }
            }

            .img-logo-wrap {
                width: 234px;
                background-repeat: no-repeat;
                background-size: 40px auto;
                background-position: 0 0;

                .imgClick {
                    width: 40px;
                    height: 100%;
                }
            }

            .img-logo {
                margin-left: 40px;
                width: 130px;
                height: 100%;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;
                cursor: default;
                position: relative;
            }

            .site-nav {
                font-size: 14px;
                position: relative;

                .tab-wrap {
                    margin-left: -25px;

                    .activity_center {
                        img {
                            width: 44px;
                            margin-right: 4px;
                        }
                    }

                    .tab-item {
                        padding: 0 15px;
                        height: 58px;
                        line-height: 60px;
                        text-transform: uppercase;
                        position: relative;
                        z-index: 100;
                    }

                    .activity_center {
                        position: relative;
                        padding-left: 65px !important;

                        img {
                            position: absolute;
                            left: 15px;
                        }
                    }
                }

                .swipper {
                    right: 10px;
                    z-index: auto;
                }
            }

            .show-date-wrap {
                width: 200px;
                height: 50px;
                margin-right: 18px;
            }

            .show-date {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 90;
                width: 200px;
                text-align: right;
                line-height: 60px;
                height: 60px;
            }

            .swipper {
                width: 400px;
                height: 100%;
                position: absolute;
                top: 0;
                right: 130px;
                overflow: hidden;
                transition: all .3s ease-in-out;

                .swipper_wrap {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    position: absolute;

                    .swipper_item {
                        width: 400px;
                        height: 100%;
                        position: absolute;
                        text-align: right;

                        img {
                            display: inline-block;
                            max-width: 100%;
                            max-height: 100%;
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            right: 50%;
                            margin-right: -50%;
                        }
                    }
                }

                .adv-box-r {
                    right: 0;
                }
            }
        }

        &.item2 {
            position: absolute;
            width: 100%;
            z-index: 1001;
            bottom: 0;
            left: 0;
            height: 36px;
            justify-content: space-between;

            .col-right {
                padding: 0 10px;
                display: flex;
                justify-content: flex-end;
                height: 100%;

                .popup-wrap {
                    margin-right: 16px;
                    height: 100%;
                    z-index: 302;

                    .text-wrap {
                        display: flex;
                        align-items: center;
                        height: 100%;
                        cursor: pointer;
                    }

                    .popup-text {
                        margin-right: 8px;
                    }

                    .yb-icon-arrow {
                        transition: transform 0.3s;
                        transform: rotate(90deg);
                    }

                    &.active {
                        .yb-icon-arrow {
                            transform: rotate(270deg);
                        }
                    }

                    .item-wrap {
                        position: absolute;
                        top: 7px;
                        text-align: center;
                        border-radius: 4px;

                        .select-item {
                            .item {
                                padding: 0 5px;
                            }
                        }
                    }

                    .triangle {
                        position: absolute;
                        top: -2px;
                        width: 5px;
                        height: 5px;
                        position: absolute;
                        transform: rotate(45deg);
                        top: -2px;
                    }
                }
            }

            .swipper {
                width: 227px;
                height: 100%;
                position: absolute;
                top: 0;
                right: calc(390px - 227px);
                overflow: hidden;

                .swipper_wrap {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    position: absolute;

                    .swipper_item {
                        width: 227px;
                        height: 100%;
                        position: absolute;
                        text-align: right;

                        img {
                            display: inline-block;
                            max-width: 100%;
                            max-height: 100%;
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            //right: 50%;
                            //margin-right: -50%;
                        }
                    }
                }
            }

            .adv-box-r {
                width: 240px;
                right: 0;

                .day_arrow,
                .night_arrow {
                    margin-top: 10px;
                }
            }

            .show-date-wrap {
                width: 60px;
                height: 34px;

                .show-date {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 90;
                    width: 60px;
                    height: 35px;
                    line-height: 12px;
                    text-align: right;
                    padding: 5px 0;
                }
            }

            .is-iframe {
                &.show-date-wrap {
                    margin-right: 12px;
                }

                .date-item {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .date-time {
                        font-size: 12px;
                        font-weight: 500;
                    }
                }
            }

            .menu-collapse-triangle {
                margin-right: 7px;

                &::before {
                    color: #A5AEC8;
                    font-size: 12px;
                    font-weight: 700;
                }
            }
        }

        // 运营广告图盒子
        .adv-box-l {
            position: absolute;
            height: 100%;
            width: 40px;
            left: 0;
            z-index: 100;
        }

        .adv-box-r {
            position: absolute;
            height: 100%;
            width: 400px;
            right: 0;
            z-index: 100;

            &.mini {
                right: 248px;
                // width: 290px;
            }

            .day_arrow,
            .night_arrow {
                margin-bottom: 0;
                margin-top: 21px;

                img {
                    cursor: pointer;
                }

                img:last-child {
                    float: right;
                }
            }
        }

        .icon-eye_show:hover {
            &:before {
                color: #acaeb3;
            }
        }

        .icon-eye_hide2 {
            transform: scale(0.7);

            &:hover {
                &:before {
                    color: #acaeb3;
                }
            }
        }
    }
}

.c-site-header.is-iframe {
    height: 86px;
    transition: height .3s ease-in-out;

    .header-item {
        &.item1 {
            height: 50px;

            .icon-layout {
                width: 24px;
            }

            .site-nav {
                height: 100%;
                align-items: center;
                flex-wrap: nowrap;
                transition: height .3s ease-in-out;

                &.iframe-mini-site-nav-hide {
                    height: 0;
                }

                .tab-wrap {
                    margin-left: -15px;

                    .item-wrap {
                        height: 50px;

                        .tab-item {
                            padding: 0 15px;
                            height: 48px;
                            line-height: 50px;
                            font-weight: bold;
                        }
                    }
                }
            }

            .swipper {
                width: 334px;

                .swipper_item {
                    width: 334px;
                }
            }

            .adv-box-r {
                width: 334px;
            }
        }

        &.item2 {
            .adv-box-r {
                width: 227px;
            }

            .mini {
                .mini {
                    width: 54px;
                }
            }
        }

        .menu-collapse-btn {
            cursor: pointer;
            width: 22px;
            height: 22px;
            margin-right: 3px;

            &.btn-collapse {
                flex: 0 0 22px;
                margin-right: 30px;
            }

            &.collapse-open {
                background: url("~public/image/yabo/svg/collapse_up.svg") no-repeat center / cover;
            }

            &.collapse-hide {
                background: url("~public/image/yabo/svg/collapse_down.svg") no-repeat center / cover;
            }

            &.collapse-open-y0 {
                background: url("~public/image/yabo/svg/collapse_up.svg") no-repeat center / cover;
            }

            &.collapse-hide-y0 {
                background: url("~public/image/yabo/svg/collapse_down_y0.svg") no-repeat center / cover;
            }
        }
    }
}

@keyframes upAnimation {
    0% {
        transform: rotate(0deg);
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    10% {
        transform: rotate(-10deg);
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    20% {
        transform: rotate(10deg);
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    28% {
        transform: rotate(-8deg);
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    36% {
        transform: rotate(8deg);
        transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
    }

    42% {
        transform: rotate(-6deg);
        transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
    }

    48% {
        transform: rotate(6deg);
        transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
    }

    52% {
        transform: rotate(-4deg);
        transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
    }

    56% {
        transform: rotate(4deg);
        transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
    }

    60% {
        transform: rotate(0deg);
        transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
    }

    100% {
        transform: rotate(0deg);
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
}

.animate-activity-entry img {
    animation-name: upAnimation;
    transform-origin: center bottom;
    animation-duration: 2s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    animation-delay: 0.5s;
}

// from left to right
.list-enter-to {
    transition: all 0.3s ease;
    transform: translateX(0);
}

.list-leave-active {
    transition: all 0.3s ease;
    transform: translateX(-100%)
}

.list-enter {
    transform: translateX(100%)
}

.list-leave {
    transform: translateX(0)
}

// from right to left
.listPre-enter-to {
    transition: all 0.3s ease;
    transform: translateX(0);
}

.listPre-leave-active {
    transition: all 0.3s ease;
    transform: translateX(100%)
}

.listPre-enter {
    transform: translateX(-100%)
}

.listPre-leave {
    transform: translateX(0)
}
</style>
  