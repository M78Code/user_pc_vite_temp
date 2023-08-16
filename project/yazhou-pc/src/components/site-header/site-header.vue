<!--
 * @Description: 站点页眉
-->
<template>
    <div class="c-site-header relative-position" :class="{ 'is-iframe': is_iframe }">
        <!-- 系统将在30分钟后进入维护，造成不便，深表歉意！ -->
        <maintenance-tip></maintenance-tip>

        <div class="header-item item1 row items-stretch relative-position"
            :class="[lang, main_menu_toggle, { 'iframe-header-item1-hide': is_iframe && menu_collapse_status }]">
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
                :class="{ 'iframe-mini-site-nav-hide': is_iframe && menu_collapse_status }">
                <!-- 内嵌版 菜单状态切换按钮 -->
                <template v-if="is_iframe && !menu_collapse_status">
                    <div class="menu-collapse-btn btn-collapse" :class="collapse_style" @click="handle_menu_collapse">
                        <q-tooltip anchor="top middle" self="center middle"
                            :content-style="tooltip_style + ';transform:translateY(40px)'">{{
                                t('common.menu_collapsed',
                                    ['&nbsp;']) }}</q-tooltip>
                    </div>
                </template>

                <Tab :list="nav_list" @onclick="tab_click" is_show_line :currentIndex="current_index" :padding="15"
                    :hasActivity="hasActivity" :line_width="36" />
                <header-advertisement v-if="main_menu_toggle == 'mini'"></header-advertisement>
            </div>

            <template>

                <header-advertisement v-if="['normal', 'mini-normal'].includes(main_menu_toggle)"></header-advertisement>
                <template v-if="left_menu_toggle">
                    <div class="show-date-wrap relative-position">
                        <headerTime />
                    </div>
                </template>
                <template v-else>
                    <div class="user-info rows">
                        <div class="row">
                            <div class="refresh-icon-wrap yb-flex-center">
                                <refresh icon_name="icon-balance_refresh" class="refresh-btn" :loaded="data_loaded"
                                    :disable="!user_info" @click="get_balance" />
                            </div>
                            <div class="user-name">Hi,{{ lodash.get(user_info, "uname") }}</div>
                        </div>
                        <div class="row">
                            <span class="balance-btn-eye" :class="show_balance ? 'icon-eye_show' : 'icon-eye_hide2'"
                                @click="vx_set_show_balance(!show_balance)"></span>
                            <div v-show="!show_balance" class="balance-text-hide">
                                ******
                            </div>
                            <div v-show="show_balance" class="balance-text-show yb-family-odds">
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

    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import lodash from 'lodash'
import { useI18n } from "vue-i18n";
/** 组件 */
import maintenanceTip from 'project_path/src/components/site-header/maintenance-tip.vue'
import { TabWapper as Tab } from "src/components/common/tab"
import { RefreshWapper as refresh } from "src/components/common/refresh";
import headerTime from "project_path/src/components/site-header/header-time.vue"
import headerAdvertisement from "project_path/src/components/site-header/header-advertisement.vue"

/** 工具.js */
import { useMittEmit, useMittOn } from 'src/core/mitt/index.js'
import * as MITT_TYPES from 'project_path/src/core/mitt/mitt-keys.js'
import store from "src/store-redux/index.js";
import utils from "src/core/utils/utils.js"
import zhugeTag from "src/core/http/zhuge-tag.js"
// import { gtag_event_send } from "src/core/http/gtag-tag.js"
import { ss } from 'src/core/utils/web-storage.js'

/** api */
import { api_account } from "src/api/index.js";

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


/** 国际化 */
const { t } = useI18n();

/** 菜单数据 */
const menu_data = reactive({})
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
/** 日间节庆资源跳转类型 */
const dayClickType = reactive({ typeL: 0, urlL: null })
/** 夜间版 */
const nightClickType = reactive({ typeL: 0, urlL: null })
/** 当前轮播图索引 */
const currentSwipperIndex = ref(0)
/** 当前资源图片数组 */
let currentSwipperArr = reactive([])

/** stroe仓库 */
const store_data = store.getState()
const { globalReducer, betInfoReducer, userReducer, languagesReducer, menuReducer, themeReducer } = store_data
/** 
 * 全局开关 default: object
 * 路径: project_path\src\store\module\global.js
 */
const { global_switch } = globalReducer
/** 
 * left_menu_toggle 左侧菜单的切换状态 true: 展开 false: 收缩 default: true
 * is_invalid 判断是否是登录状态 default: false
 * 路径: project_path\src\store\module\betInfo.js
 */
const { left_menu_toggle, is_invalid } = betInfoReducer
/** 
 * token 用户token default: ''
 * user_info 用户信息 default: {}
 * show_balance 用户余额是否展示状态 default: true
 * 路径: src\store-redux\module\user-info.js
 */
const { token, user_info, show_balance } = userReducer

/** 
 * 语言 languages
 * 路径: src\store-redux\module\languages.js
 */
const { lang } = languagesReducer
/** 
 * main_menu_toggle 左侧列表显示形式 -- normal：展开 mini：收起 default: 'normal'
 * menu_collapse_status 获取菜单收起状态 default: false
 * cur_menu_type 当前菜单类型 play 滚球  hot热门赛事   virtual_sport虚拟体育   winner_top冠军聚合页 today 今日   early早盘 bet串关 default：Object
 * 路径: project_path\src\store\module\menu.js
 */
const { main_menu_toggle, menu_collapse_status, cur_menu_type } = menuReducer
/** 
* 用户余额是否展示状态 default: theme01
* 路径: src\store-redux\module\theme.js
*/
const { theme } = themeReducer


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
    set_current_index()
    compute_colse_tips_time()
}
onMounted(init)


/** 展开搜索 */
function show_search() {
    if (!global_switch.search_switch) {
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
    if (menu.path.includes('/activity') && !global_switch.activity_switch) {
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
            if (token) {
                zhugeTag.send_zhuge_event("PC_任务中心");
                // 记录用户点击活动入口，每点击一次计算一次，不在活动内计算
                // gtag_event_send('PC_activity_click', 'PC_活动', 'PC_活动中心', new Date().getTime())
                vx_set_user({ token: token, view: this });
            }
        }

        emit('navigate', menu);
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
    if (is_invalid) {
        return;
    }
    if (!user_info) {
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
    // if ($menu.menu_data.is_esports && !['hot', 'play'].includes(cur_menu_type.type_name)) {
    //     // 电竞
    //     c_index = 1;
    //     // TODO: $menu
    // } else if ((route.name.includes('virtual') || $menu.menu_data.cur_level1_menu == 'virtual_sport') && cur_menu_type.type_name != 'play') {
    //     // 虚拟体育
    //     let index = props.nav_list.findIndex(item => item.id == 3)
    //     if (index > 0) {
    //         c_index = index
    //     }
    // }
    current_index.value = c_index;
}

/** 内嵌版 菜单收起状态 */
const set_menu_collapse_status = (data) => store.dispatch({
    type: 'set_menu_collapse_status',
    data
})
/** 内嵌版 菜单状态切换按钮 */
function handle_menu_collapse() {
    set_menu_collapse_status(!menu_collapse_status)
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
    let uid = user_info.uid;
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
    if (theme.includes('y0')) {
        return menu_collapse_status ? 'collapse-open-y0' : 'collapse-hide-y0'
    } else {
        return menu_collapse_status ? 'collapse-open' : 'collapse-hide'
    }
})

const format_balance = computed(() => {
    const num = user_info.balance
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
    if (['theme01', 'theme01_y0'].includes(theme)) {
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

/***
 * 运营位专题页
 */
 function special_page() {
  let token = get(computed_data.get_user, "token");
  api_account.get_BannersUrl({ type: 7, token }).then((res) => {
    let code = get(res, "data.code");
    let data = get(res, "data.data");
    if (code == 200) {
      if (data && data.length > 0) {
        data.forEach((item) => {
          if (item.tType && item.tType == 7) {
            // 获取图片地址 TODO:
            data_ref.special_img_url = get_file_path(item.imgUrl);
            data_ref.special_host_url = item.hostUrl;
            data_ref.special_url_type = item.urlType;
          }
        });
      }
    }
  });
}

/** 监听路由变化 */
watch(
    () => route.name,
    () => {
        set_current_index()
    }
)

/** 清除虚拟投注数据 */
const vx_virtual_bet_clear = (data) => store.dispatch({
    type: 'virtual_bet_clear',
    data
})
watch(
    () => cur_menu_type.type_name,
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


</script>


<style lang="scss">
@import './site-header.scss';
</style>
  