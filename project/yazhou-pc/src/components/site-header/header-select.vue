<!--
 * @Description: 站点页眉 - 语言等切换
-->
<template>
    <div class="col-right row items-center" :style="`width:${is_iframe ? 390 : parseInt(layout_size.main_width * .3)}px`">

        <template v-if="is_iframe && menu_collapse_status">
            <div class="swipper" v-if="['normal', 'mini-normal'].includes(main_menu_toggle)">
                <transition-group tag="div" class='swipper_wrap' :name="isPre ? 'listPre' : 'list'">
                    <div v-for="(list, index) in currentSwipperArr" :key="`o_${index}`"
                        v-show="index === currentSwipperIndex" @mouseenter="stop" @mouseleave="go" class="swipper_item">
                        <img :src="list.img" />
                    </div>
                </transition-group>

                <!-- 右边运营广告图 点击占位盒子 -->
                <div v-if="currentSwipperArr.length > 0 && main_menu_toggle !== 'mini'" class="adv-box-r"
                    :class="{ mini: main_menu_toggle == 'mini' }" @mouseenter="stop" @mouseleave="go"
                    @click="menu_change('R')" ref="adv_box"
                    :style="{ 'cursor': lodash.get(currentSwipperArr, `[${currentSwipperIndex}].isClick`) ? 'pointer' : 'unset' }">
                    <p v-show="UserCtr.theme.includes('theme01') && currentSwipperArr.length > 1 && showArrow" class="day_arrow">
                        <img :src="day_left" alt="" @click.stop="boxMouseup('pre')">
                        <img :src="day_right" alt="" @click.stop="boxMouseup('next')">
                    </p>
                    <p v-show="UserCtr.theme.includes('theme02') && currentSwipperArr.length > 1 && showArrow" class="night_arrow">
                        <img :src="night_left" alt="" @click.stop="boxMouseup('pre')">
                        <img :src="night_right" alt="" @click.stop="boxMouseup('next')">
                    </p>
                </div>
            </div>

            <!-- 右侧 -->
            <template v-if="left_menu_toggle">
                <div class="show-date-wrap relative-position is-iframe">
                    <!-- 时钟 -->
                    <headerTime />
                </div>
            </template>
            <template v-else>
                <div class="user-info">
                    <div class="user-name">Hi,{{ lodash.get(UserCtr.get_user(), "uname") }}</div>
                    <span class="balance-btn-eye" :class="UserCtr.show_balance ? 'icon-eye_show' : 'icon-eye_hide2'"
                        @click="set_show_balance(!UserCtr.show_balance)"></span>
                    <div v-show="!UserCtr.show_balance" class="balance-text-hide">
                        ******
                    </div>
                    <div v-show="UserCtr.show_balance" class="balance-text-show yb-family-odds">
                        {{ format_money2(UserCtr.get_balance()) }}
                    </div>
                    <refresh v-show="UserCtr.show_balance" icon_name="icon-balance_refresh" class="refresh-btn"
                        :loaded="data_loaded" :disable="!UserCtr.get_user()" @click="get_balance" />
                </div>
            </template>
            <!-- 左边运营广告图 点击占位盒子 -->
            <div class="adv-box-l"
                v-if="(UserCtr.theme.includes('theme01') && dayClickType.typeL) || (UserCtr.theme.includes('theme02') && nightClickType.typeL)"
                @click="menu_change('L')"
                :style="{ 'cursor': (UserCtr.theme.includes('theme01') && dayClickType.urlL) || (UserCtr.theme.includes('theme02') && nightClickType.urlL) ? 'pointer' : 'unset' }">
            </div>
        </template>

        <template v-if="!left_menu_toggle">
            <headerTime class="col" :class="{ 'text-right': menu_collapse_status }" />
        </template>

        <template v-if="!is_iframe || (is_iframe && !menu_collapse_status)">
            <!-- 语言切换 -->
            <popup-language />
            <!-- 切换盘口 -->
            <popup-handicap />
            <!-- 设置多语言、版本、颜色 -->
            <popup-set />
        </template>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, reactive, onUnmounted } from 'vue'
import lodash from 'lodash'
/* 组件 */
import { RefreshWapper as refresh } from "src/components/common/refresh";
import headerTime from "project_path/src/components/site-header/header-time.vue"
import popupHandicap from "project_path/src/components/popup-select/popup-handicap.vue"
import popupSet from "project_path/src/components/popup-select/popup-set.vue"
import popupLanguage from "project_path/src/components/popup-select/popup-language.vue"
/* api */
import { api_account, api_common } from "src/api/index.js";

import {utils } from 'src/core/index.js'
import store from "src/store-redux/index.js";
import { format_money2 } from "src/core/format/index.js"
// import userCtr from 'src/core/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";

const day_left = '/public/yazhou-pc/image/svg/day_left.svg'
const day_right = '/public/yazhou-pc/image/svg/day_right.svg'
const night_left = '/public/yazhou-pc/image/svg/night_left.svg'
const night_right = '/public/yazhou-pc/image/svg/night_right.svg'

/** 是否内嵌 */
const is_iframe = ref(utils.is_iframe)

/** stroe仓库 */
const { layoutReducer, menuReducer } = store.getState()
const unsubscribe = store.subscribe(() => {
    layout_size.value = layoutReducer.layout_size
    main_menu_toggle.value = menuReducer.main_menu_toggle
    menu_collapse_status.value = menuReducer.menu_collapse_status
    // left_menu_toggle.value = betInfoReducer.left_menu_toggle

})
/** 销毁监听 */
onUnmounted(unsubscribe)
/** 
 * 浏览器 宽高等数据 default: object
 * 路径: project_path\src\store\module\layout.js
 */
const layout_size = ref(layoutReducer.layout_size)
/** 
 * 左侧列表显示形式 -- normal：展开 mini：收起 default: 'normal'
 * 路径: project_path\src\store\module\menu.js
 */
 const main_menu_toggle = ref(menuReducer.main_menu_toggle)
/** 
 * 获取菜单收起状态 default: false
 * 路径: project_path\src\store\module\menu.js
 */
const menu_collapse_status = ref(menuReducer.menu_collapse_status)
/** 
 * 左侧菜单的切换状态 true: 展开 false: 收缩 default: true
 * 路径: project_path\src\store\module\betInfo.js
 */
const left_menu_toggle = ref(true)

/** 刷新组件loading */
const data_loaded = ref(false)

/** 是否切换到上一张图片 */
const isPre = ref(false)
/** 日间节庆资源跳转类型 */
const dayClickType = reactive({ typeL: 0, urlL: null })
/** 夜间版 */
const nightClickType = reactive({ typeL: 0, urlL: null })
/**
* @Description 节庆资源图片点击
* @param {side} L 左边的图片点击 R 右边的图片点击
*/
function menu_change(side) {
    // _type      1 跳转赛事菜单 2打开弹窗 0不跳转
    let _type, _url = '';
    // 日间版/夜间版  左边还是右边
    if (['theme01', 'theme01_y0'].includes(UserCtr.theme)) {
        if (side == 'L') {
            _type = dayClickType.value.typeL
            _url = dayClickType.value.urlL
        } else {
            _type = lodash.get(daySwipper, `[${currentSwipperIndex.value}].imgType`)
            _url = lodash.get(daySwipper, `[${currentSwipperIndex.value}].imgUrl`)
        }
    } else {
        if (side == 'L') {
            _type = nightClickType.value.typeL
            _url = nightClickType.value.urlL
        } else {
            _type = lodash.get(nightSwipper, `[${currentSwipperIndex.value}].imgType`)
            _url = lodash.get(nightSwipper, `[${currentSwipperIndex.value}].imgUrl`)
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


/** 当前轮播图索引 */
const currentSwipperIndex = ref(0)
/** 当前资源图片数组 */
let currentSwipperArr = reactive([])
/** 节庆资源接口 */
function getFestivalBanner() {
    api_common.queryFestivalBanner().then(res => {
        const data = lodash.get(res, 'data.data') || {}
        // 服务器时间
        // let stime = proxy.get_remote_time();
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
        //     if (UserCtr.theme.includes('theme01') && daySwipper.length > 0) {
        //         currentSwipperArr = daySwipper;
        //     }
        //     if (UserCtr.theme.includes('theme02') && nightSwipper.length > 0) {
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
/* 钩子触发 */
onMounted(getFestivalBanner)

/** 展示右侧图片资源上的左右箭头 */
const showArrow = ref(false)
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
            if (currentSwipperIndex.value == 0) {
                change(currentSwipperArr.length - 1)
            } else {
                change(currentSwipperIndex.value - 1)
            }
            timer_ = setTimeout(() => {
                isPre.value = false;
            }, 400);
        }
        // 下一张
        if (type == 'next') {
            if (currentSwipperIndex.value == currentSwipperArr.length - 1) {
                change(0)
            } else {
                change(currentSwipperIndex.value + 1)
            }
        }
    }, 300)
}
/**
 * 点击左右按钮--切换图片
 */
function change(index) {
    currentSwipperIndex.value = index
}
</script>

<style lang="scss" scoped>
@import './site-header.scss';
</style>