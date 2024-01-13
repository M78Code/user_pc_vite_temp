<!--
 * @Description: 站点页眉
-->
<template>
    <div class="component relative-position" :class="{ 'is-iframe': is_iframe }">
        <!-- 系统将在30分钟后进入维护，造成不便，深表歉意！ -->
        <maintenance-tip></maintenance-tip>

        <div class="header-item item1 row items-stretch relative-position"
            :class="[UserCtr.lang, main_menu_toggle, { 'iframe-header-item1-hide': is_iframe && menu_collapse_status }]">
            <!-- logo -->
            <div v-if="is_hide_icon || is_iframe" class="icon-layout"></div>
            <!-- 当前是日间版并且有日间版配图就展示日间版图片，夜间版也一样 -->
            <a v-else class="row items-center  img-logo-wrap"
                :style="{ 'background-image': is_day && pcDaytimeLink ? `url(${pcDaytimeLink})` : !is_day && pcNightLink ? `url(${pcNightLink})` : 'none' }">
                <div class="img-logo custom-format-img-logo-01"></div>
            </a>
            <!-- 运营位专题页 -->
            <div v-if="imgUrl" class="special-page-logo" :style="{ 'background-image': `url(${imgUrl})` }"
                @click="openPage(hostUrl, urlType)"></div>
            <!-- 菜单 -->
            <div class="site-nav row flex-nowrap col"
                :class="{ 'iframe-mini-site-nav-hide': is_iframe && menu_collapse_status }">
                <!-- 内嵌版 菜单状态切换按钮 -->
                <template v-if="is_iframe && !menu_collapse_status">
                    <div class="menu-collapse-btn btn-collapse" @click="handle_menu_collapse">
                        <q-tooltip anchor="top middle" self="center middle"
                            :content-style="tooltip_style + ';transform:translateY(40px)'">{{
                                i18n_t('common.menu_collapsed',
                                    ['&nbsp;']) }}</q-tooltip>
                    </div>
                </template>

                <Tab :list="nav_list" @onclick="tab_click" is_show_line :currentIndex="current_index" :padding="15"
                    :hasActivity="hasActivity" :line_width="36" />
                <header-advertisement v-if="main_menu_toggle == 'mini'"></header-advertisement>
            </div>
            <!-- 广告轮播 -->
            <header-advertisement v-if="['normal', 'mini-normal'].includes(main_menu_toggle)"></header-advertisement>
            <!-- 时钟 -->
            <div v-if="left_menu_toggle" class="show-date-wrap relative-position">
                <headerTime />
            </div>
            <div v-else class="user-info rows">
                <div class="row">
                    <div class="refresh-icon-wrap yb-flex-center">
                        <refresh icon_name="icon-balance_refresh" class="refresh-btn" :loaded="data_loaded"
                            :disable="!UserCtr.get_user()" @click="get_balance" />
                    </div>
                    <div class="user-name">Hi,{{ lodash.get(UserCtr.get_user(), "uname") }}</div>
                </div>
                <div class="row">
                    <span class="balance-btn-eye" :class="get_show_balance ? 'icon-eye_show' : 'icon-eye_hide2'"
                        @click="set_show_balance(!UserCtr.show_balance)"></span>
                    <div v-show="!UserCtr.show_balance" class="balance-text-hide">
                        ******
                    </div>
                    <div v-show="UserCtr.show_balance" class="balance-text-show yb-family-odds">
                        {{ format_money2(UserCtr.get_balance()) }}
                    </div>
                </div>
            </div>
            <!-- 左边运营广告图 点击占位盒子 -->
            <div class="adv-box-l"
                v-if="(is_day && dayClickType.typeL) || (!is_day && nightClickType.typeL)"
                @click="menu_change('L')"
                :style="{ 'cursor': (is_day && dayClickType.urlL) || (!is_day && nightClickType.urlL) ? 'pointer' : 'unset' }">
            </div>
        </div>

        <timer />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import lodash from 'lodash'
/** 组件 */
import maintenanceTip from 'src/base-pc/components/site-header/maintenance-tip.vue'
import { TabWapper as Tab } from "src/components/common/tab"
import { RefreshWapper as refresh } from "src/components/common/refresh";
import headerTime from "src/base-pc/components/site-header/header-time.vue"
import headerAdvertisement from "src/base-pc/components/site-header/header-advertisement.vue"
import timer from "src/base-pc/components/site-header/timer.vue"

/** 工具.js */
import { useMittEmit, useMittEmitterGenerator, MITT_TYPES } from 'src/core/mitt/index.js'
import globalAccessConfig from "src/core/access-config/access-config.js"
import zhugeTag from "src/core/http/zhuge-tag.js"
// import { gtag_event_send } from "src/core/http/gtag-tag.js"
import { SessionStorage } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { format_money2 } from "src/output/index.js"
import { i18n_t } from "src/boot/i18n.js"
/** api */
import { api_account } from "src/api/index.js";
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
import { MenuData } from "src/output/index.js"
const { PROJECT_NAME } = BUILDIN_CONFIG ;
const emit = defineEmits(['navigate'])

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
/** 定时器 */
let show_activity_page_timer = null
/** 菜单数据 */
const menu_data = reactive({})
/** 地址栏隐藏logo */
const is_hide_icon = ref(false)
/** 是否内嵌 */
const is_iframe = ref(utils_info.is_iframe)
/** 刷新组件loading */
const data_loaded = ref(false)
/** 当前顶部菜单选中的索引 */
const current_index = ref(0)
/** 图片链接pc日间 左 */
const pcDaytimeLink = ref(null)
/** 图片链接 pc夜间 左 */
const pcNightLink = ref(null)
/** 日间节庆资源跳转类型 */
const dayClickType = reactive({ typeL: 0, urlL: null })
/** 夜间版 */
const nightClickType = reactive({ typeL: 0, urlL: null })
/** 当前轮播图索引 */
const currentSwipperIndex = ref(0)

/** 是否日间版 */
const is_day = computed(() => UserCtr.theme == 'day')


/** 
 * 左侧菜单的切换状态 true: 展开 false: 收缩 default: true
 */
const left_menu_toggle = ref(true)
/** 
 * 判断是否是登录状态 default: false
 */
const is_invalid = ref(false)
/** 
 * 左侧列表显示形式 -- normal：展开 mini：收起 default: 'normal'
 */
const main_menu_toggle = ref({})
/** 
 * 获取菜单收起状态 default: false
 */
const menu_collapse_status = ref({})
/** 
 * 当前菜单类型 play 滚球  hot热门赛事   virtual_sport虚拟体育   winner_top冠军聚合页 today 今日   early早盘 bet串关 default：Object
 */
const cur_menu_type = ref({})

/** 批量注册mitt */
const { emitters_off } = useMittEmitterGenerator([
    /** showModel事件 */
    { type: MITT_TYPES.EMIT_SITE_SHOW_MODEL, callback: show_activity_page },
    /** bet接口返回canceled,打开注单历史 */
    { type: MITT_TYPES.EMIT_SITE_OPEN_HISTORY, callback: open_history_fun },
])
/** 关闭mitt */
onUnmounted(emitters_off)

/** 路由对象 */
const route = useRoute()
/** 路由实例 */
const router = useRouter()


/** 清除全部定时器 */
function clear_timer() {
    if (show_activity_page_timer) {
        clearTimeout(show_activity_page_timer)
        show_activity_page_timer = null
    }
}
/** 钩子触发 */
onBeforeMount(clear_timer)

/** 初始化 */
function init() {
    is_hide_icon.value = SessionStorage.get('hide_logo_icon') === "1";
    set_current_index()
}
onMounted(init)

/** 活动弹窗跳转判断 */
function show_activity_page(n, urlType) { // 首页弹窗跳转判断
    if (n == 'act') {
        let index = props.nav_list.findIndex(item => item.path.includes('activity'));
        tab_click({ index })
    } else {
        //清除定时器
        clearTimeout(show_activity_page_timer);
        show_activity_page_timer = null
        show_activity_page_timer = setTimeout(() => {
            // 0：无连接，1：内部导航，2：弹窗连接
            openPage(n, urlType)
        }, 300);
    }
}


/**
 * 导航栏菜单点击
 * @param {obj} 菜单路由对象 {id: 唯一id, tab_name: 菜单名, path: 跳转路径, _blank: 是否打开单独的窗口} 具体参考 vue init_site_header() 方法
 */
async function tab_click(obj) {

    set_current_index(obj.index)
    
    // 埋点配置
    let menu = props.nav_list[obj.index]
    if (menu.path.includes('/activity') && !globalAccessConfig.get_activitySwitch()) {
        return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"))
    }
    // 电竞
    if (menu.id == 5) {
        //兼容新版pc
        if(PROJECT_NAME == 'new-pc'){
            MenuData.set_menu_root(2000);
            const  left_obj = {
                lv1_mi: 2000,
                lv2_mi: 2100,
                has_mid_menu: true,
            }
            MenuData.set_left_menu_result(left_obj)
            return;
        }
        zhugeTag.send_zhuge_event('PC_导航_电子竞技');
        // TODO: 菜单数据
        // let menu_id = $menu.menu_data.cur_level1_menu == 'early' ? 3020225 : 3020125
        // $menu.menu_change(2, menu_id)
    }
    // 虚拟体育
    else if (menu.id == 3) {
        //兼容新版pc
        if(PROJECT_NAME == 'new-pc'){
            MenuData.set_menu_root(300)
            const res = await MenuData.get_vr_menu_list();
            if(res && res.length){
                // 设置左侧菜单
                const  left_obj = {
                    lv1_mi: 300,
                    lv2_mi: `3${res[0].menuId}`,
                    has_mid_menu: true,
                }
                MenuData.set_left_menu_result(left_obj)
            }
            return;
        }
        // $menu.menu_change(1, 'virtual_sport', 'nav')
    }
    // 如果当前点击的是 Home
    else if (obj.index == 0) {
        // $menu.menu_change(1, 'play')
    } else {
        let pathObj = menu;
        // 如果点击的是活动入口，就更新一下用户信息
        if (pathObj.path.includes('/activity')) {
            if (UserCtr.get_user_token()) {
                zhugeTag.send_zhuge_event("PC_任务中心");
            }
        }

        emit('navigate', menu);
    }
}

/** 运营位专题页跳转判断 */
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
    UserCtr.show_fail_alert();
    if (is_invalid.value) {
        return;
    }
    if (!UserCtr.get_user()) {
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
function set_current_index(c_index) {
    current_index.value = c_index;
}


/** 内嵌版 菜单状态切换按钮 */
function handle_menu_collapse() {
    set_menu_collapse_status(!menu_collapse_status.value)
}


/**
 * @description 获取用户余额
 * @return {undefined} undefined
 */
function get_balance() {
    UserCtr.get_balance()
}

/**
* @Description 节庆资源图片点击
* @param {side} L 左边的图片点击 R 右边的图片点击
*/
function menu_change(side) {
    // _type      1 跳转赛事菜单 2打开弹窗 0不跳转
    let _type, _url = '';
    // 日间版/夜间版  左边还是右边
    if (['day'].includes(UserCtr.theme)) {
        if (side == 'L') {
            _type = dayClickType.value.typeL
            _url = dayClickType.value.urlL
        }
    } else {
        if (side == 'L') {
            _type = nightClickType.value.typeL
            _url = nightClickType.value.urlL
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

/** 监听路由变化 */
watch(
    () => MenuData.menu_data_version,
    () => {
        console.error('MenuDataMenuDataMenuDataMenuDataMenuData')
        if(MenuData.is_esports()){
            set_current_index(2)
        }else if(MenuData.is_vr()){
            set_current_index(3)
        }else{
            set_current_index(1)
        }
    }
)

</script>

<style lang="scss">
@import './site-header.scss';
</style>