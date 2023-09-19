<template>
    <!-- 轮播 -->
    <div class="slide">
        <!-- 猜你喜欢赛事轮播 -->
        <q-carousel animated swipeable v-model="slide" transition-prev="slide-right" transition-next="slide-left" infinite
            v-if="lodash.get(carousel_data, 'list.length')" :autoplay="7000">
            <q-carousel-slide :name="index" v-for="(item, index) in carousel_data.list" :key="index"
                @click="to_details(item)" :class="{ 'act-banner': !item.mhn }">
                <!-- 是赛事数据的轮播 -->
                <div class="info" v-if="item.mhn">
                    <!-- 赛种图标和联赛名称 -->
                    <div class="row info-wrap">
                        <span class="sport-icon-wrap" :class="`s${item.csid}`"></span>
                        <div class="info-title ellipsis">{{ item.tn }}</div>
                    </div>

                    <div class="info-more">
                        <!-- 左 -->
                        <div class="home">
                            <div class="wrap-logo">
                                <img v-img="[
                                    lodash.get(item, 'mhlu[0]'),
                                    lodash.get(item, 'frmhn[0]'),
                                    lodash.get(item, 'csid'),
                                    { data: item, name: '_t11_img' },
                                ]" alt />
                                <img v-if="lodash.get(item, 'mhlu').length > 1" v-img="[
                                    lodash.get(item, 'mhlu[1]'),
                                    lodash.get(item, 'frmhn[1]'),
                                    lodash.get(item, 'csid'),
                                    { data: item, name: '_t12_img' },
                                ]" alt class="logo-double" />
                            </div>
                            <div class="both-item">{{ item.mhn }}</div>
                        </div>
                        <!-- 中 -->
                        <div class="socre">
                            <div class="vs-wrap" v-if="item.ms != 110 && show_counting_down(item)">
                                <div class="score-wrap">
                                    <span class="both-score">{{
                                        format_total_score(
                                            lodash.get(carousel_data, `obj[${item.mid}]`),
                                            0
                                        )
                                    }}</span>
                                    <span class="crossing"></span>
                                    <span class="both-score">{{
                                        format_total_score(
                                            lodash.get(carousel_data, `obj[${item.mid}]`),
                                            1
                                        )
                                    }}</span>
                                </div>
                            </div>
                            <div class="both-timer relative-position" :style="{
                                        height:
                                            item.ms != 110 && show_counting_down(item)
                                                ? 'auto'
                                                : '100%',
                                    }">
                                <!--即将开赛 ms = 110-->
                                <template v-if="item.ms == 110">
                                    <div>{{ t(`ms[${item.ms}]`) }}</div>
                                </template>

                                <!--一小时内开赛 -->
                                <template v-if="item.ms != 110 && show_start_counting_down(item)">
                                    <counting-down-start :match="item" :index="index" :mgt_time="item.mgt">
                                    </counting-down-start>
                                </template>

                                <!--开赛日期(早盘) ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                                <template v-if="item.ms != 110 &&
                                    !show_start_counting_down(item) &&
                                    !show_counting_down(item)
                                    ">
                                    <div>{{ t("list.match_no_start") }}</div>
                                    <div>
                                        <!-- .Format(t('time4')) -->
                                        {{ format_time_zone(+item.mgt) }}
                                    </div>
                                </template>

                                <!--倒计时或正计时-->
                                <template v-if="item.ms != 110 && show_counting_down(item)">
                                    <counting-down-second :title="item.ms == 0
                                        ? t('list.match_no_start')
                                        : match_period_map(item)
                                        " :mmp="item.mmp" :m_id="item.mid" :second="item.mst" :match="item" :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+item.csid)
        " home />
                                </template>
                            </div>
                        </div>
                        <!-- 右 -->
                        <div class="away">
                            <div class="wrap-logo">
                                <img v-img="[
                                    lodash.get(item, 'malu[0]'),
                                    lodash.get(item, 'frman[0]'),
                                    lodash.get(item, 'csid'),
                                    { data: item, name: '_t21_img' },
                                ]" alt />
                                <img v-if="lodash.get(item, 'malu').length > 1" v-img="(lodash.get(item, 'malu[1]'),
                                    lodash.get(item, 'frman[1]'),
                                    lodash.get(item, 'csid'),
                                    { data: item, name: '_t22_img' })
                                    " alt class="logo-double" />
                            </div>
                            <div class="both-item">{{ item.man }}</div>
                        </div>
                    </div>
                </div>
                <!-- 是活动或者跳转的轮播 -->
                <div v-else style="height: 100%" @click.stop="confirm(item)">
                    <img :src="item.imgUrl" style="height: 100%; pointer-events: none" @error="league_icon_error" />
                </div>
            </q-carousel-slide>
            <template v-slot:control v-if="carousel_data.list.length > 1">
                <q-carousel-control position="bottom">
                    <div class="control">
                        <span v-for="(list, i) in carousel_data.list" :key="i" class="control-item"
                            :class="{ active: i == slide }" @click="slide = i"></span>
                    </div>
                </q-carousel-control>
            </template>
        </q-carousel>
        <!-- 默认背景图 -->
        <img v-else :src="banner_bg" :hidden="!defaultBannerShow" @load="showDefaultBanner" @error="handleBannerError"
            class="carousel_bg" />
    </div>
    <!-- 轮播 -->
</template>

<script setup>
import lodash from 'lodash'
import { api_home } from "src/api/index.js";
import { ref, watch, onMounted, computed, onUnmounted, reactive } from "vue";
import { SessionStorage, useMittOn, useMittEmit, ServerTime, MITT_TYPES, get_file_path, UserCtr, format_total_score } from 'src/core/'
import { useRoute, useRouter } from "vue-router";
// 路由
const route = useRoute();
const router = useRouter();

//轮播图数据，init是数据加载中的标识
let carousel_data = ref({ list: [], obj: {} });
let banner_bg = ref(//轮播背景图片,
    localStorage.getItem("home_banner_default") ||
    sessionStorage.getItem("banner_bg") ||
    ""
);
const show_banner_loading = ref(true)
const defaultBannerShow = ref(false)
const slide = ref(0)
const get_lang = ref(UserCtr.lang)
const get_banner_obj = ref({});

// 刷新时banner左上角有短暂破碎小图（加载失败）显现，监听图片load事件做显示处理
const showDefaultBanner = (e) => {
    defaultBannerShow.value = true;
};
// 若线上图片加载错误，则使用本地默认banner
const handleBannerError = (e) => {
    banner_bg.value = `/yazhou-h5/image/png/home_carousel_bg_${UserCtr.theme.includes("y0") ? "y0_" : ""
        }${get_lang.value}.png`;
};
/**
 * @description: 图标出错时
 * @param {Object} $event 错误事件对象
 */
const league_icon_error = ($event) => {
    $event.target.src = UserCtr.theme.includes("y0")
        ? "/yazhou-h5/image/png/banner_bg_y0.png"
        : "/yazhou-h5/image/png/banner_bg.png";
    $event.srcElement.onerror = null;
};
/**
 * @description: 多少分钟后开赛显示
 * @param {Object} match 赛事对象
 * @return {String}
 */
const show_start_counting_down = (match) => {
    let r = false;
    let start_time = match.mgt * 1;
    let init_server = ServerTime.server_time * 1;
    let init_local = ServerTime.local_time_init;
    let now_local = new Date().getTime();
    let sub_local_time = now_local - init_local;
    let now_server_time = init_server + sub_local_time;
    let sub_time = start_time - now_server_time;
    // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
    r = match.mcg != 1 && 0 < sub_time && sub_time < 60 * 60 * 1000;
    return r;
};

// 赛事状态 0、赛事未开始 1、滚球阶段 2、暂停3、结束4、关闭5、取消6、比赛放弃7、延迟8、未知9、延期10、比赛中断
/**
 * @description: 进行中(但不是收藏页)的赛事显示累加计时|倒计时
 * @param {Object} match 赛事对象
 * @return {Boolean}
 */
const show_counting_down = (match) => {
    return [1, 2, 10].includes(+match.ms);
};
/**
 * @description: 跳转详情页
 * @param {Object} item 轮播赛事数据
 */
const to_details = (item) => {
    //TODO:
    // set_goto_detail_matchid(item.mid);
    // set_details_item(0);
    router.push({ name: "category", params: { mid: item.mid, csid: item.csid } });
};
/**
 *@description 跳转活动逻辑，首页不用跳场馆
 *@param {Object} val 数据对象
 *@return {Undefined} undefined
 */
const confirm = (val) => {
    if (!val.imgUrl) return;
    if (val.comfirmTxt && UserCtr.user_info.activityList) {
        // 设置跳转活动的确认信息
        // set_activity_msg(val); //TODO :
    } else {
        if (val.hostUrl.startsWith("http") && val.urlType === "2") {
            window.open(val.hostUrl, "_blank");
        } else if (val.urlType === "1") {
            if (/#*\/*details/.test(val.hostUrl) && route.name != "category") {
                const {
                    groups: { mid, csid },
                } = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(val.hostUrl) || {
                    groups: {},
                };
                if (mid && csid) {
                    if ([100, 101, 102, 103].includes(+csid)) {
                        // 如果是电竞赛事，需要设置菜单类型
                        set_menu_type(3000);
                    }
                    set_goto_detail_matchid(mid);
                    set_details_item(0);
                    router.push({ name: "category", params: { mid, csid } });
                }
            } else if (val.hostUrl == "act" && UserCtr.user_info.activityList) {
                router.push({
                    name: "activity_task",
                    query: { rdm: new Date().getTime() },
                });
            } else if (val.hostUrl.startsWith("hot") && !get_golistpage) {
                let tid = val.hostUrl.split("/")[1];
                let is_existtid =
                    get_hot_list_item &&
                    get_hot_list_item.subList &&
                    get_hot_list_item.subList.find((item) => {
                        return item.field2 == tid;
                    });
                if (tid && is_existtid) {
                    //TODO:
                    // set_home_tab_item({ component: "hot", index: 1, name: "热门" });
                    // set_hot_tab_item({ field2: tid });
                    useMittEmit(MITT_TYPES.EMIT_HOME_TAB);
                }
            }
        }
    }
};

/**
 * @description: 获取轮播数据
 * @return {}
 */
const get_carousel = (callback) => {
    return api_home
        .hot_ulike_recommendation({ isHot: 101 })
        .then((res) => {
            const code = lodash.get(res, "code");
            let data = lodash.get(res, "data");
            console.error(1111, red)
            if (code == 200 && data.length) {
                if (callback) {
                    callback(data);
                    // 更新获取轮播数据的时间,用于左右滑动轮播时,保持时间同步
                    // updateHotReqTime(Date.now());
                }
            }
        })
        .catch(() => { })
        .finally(() => {
            //添加活动banner图
            if (lodash.get(get_banner_obj, "type1")) {
                banner_img_updata(get_banner_obj.type1);
            }
            //获取无轮播赛事背景图片
            if (!lodash.get(carousel_data.value, "list.length")) {
                get_banner_url();
            }
        });
};
/**
 *@description 活动的banner图片跟新
 *@param {Array} new_ 新值
 *@return {Undefined} undefined
 */
const banner_img_updata = (new_) => {
    if (!new_ || !new_.length) return;
    new_ = lodash.cloneDeep(new_);
    new_.forEach((item) => {
        item.imgUrl = get_file_path(item.imgUrl);
    });
    if (carousel_data.value) {
        let arr = lodash.cloneDeep(lodash.get(carousel_data.value, "list"));
        let arr1 = arr.filter((item) => {
            return !item.imgUrl;
        });
        // 去重轮播赛事mid
        arr1 = lodash.uniqBy(arr1, "mid");
        // 加入banner
        arr1.unshift(...new_);
        // 1. carousel_data不为ListMap实例则进行实例化 2. 否则合并数据
        if (!(carousel_data.value instanceof ListMap)) {
            carousel_data.value = new ListMap("mid", arr1);
        } else {
            // 去重轮播赛事imgUrl
            carousel_data.value.list = arr1;
        }
    }
};
/**
 * @description: 无轮播赛事背景图片
 * @return {}
 */
const get_banner_url = () => {
    let url = UserCtr.get_banner_url_first_page();
    if (url) {
        banner_bg.value = get_file_path(url);
    } else {
        banner_bg.value = `/yazhou-h5/image/png/home_carousel_bg_${UserCtr.theme.includes("y0") ? "y0_" : ""
            }${get_lang.value}.png`;
    }
    SessionStorage.get("banner_bg", banner_bg.value);
};
/**
 *@description 合并轮播图list数据
 *@return {Undefined} undefined
 */
const updata_list = () => {
    // 展示banner loading
    show_banner_loading.value = true;
    get_carousel((data) => {
        lodash.merge(carousel_data.value, new ListMap("mid", data));
    }).then(() => {
        // 语言切换完成
        // set_is_language_changing(false);
        // 关闭banner loading展示
        show_banner_loading.value = false;
    });
};
watch(get_banner_obj, updata_list);
//用戶信息變化
watch(UserCtr.user_version, () => {
    get_lang.value = UserCtr.lang;
});
get_carousel((data) => {
    carousel_data.value = new ListMap("mid", data);
}).finally(() => {
    show_banner_loading.value = false;
});
/**
 * @description: 清空轮播图数据
 */
const mitt_list = [
    useMittOn(MITT_TYPES.EMIT_SHOW_DEFAULT_BANNER_EVENT, function () {
        carousel_data.value.list = []
    }).off
]
onUnmounted(() => {
    mitt_list.forEach(i => i())

    if (lodash.get(carousel_data.value, "list.length")) {
        carousel_data.value.destroy && carousel_data.value.destroy();
    }
})
</script>