<!--
 * @Date: 2021-05-15 21:49:11
 * @FilePath: /user-pc1/project/activity/src/pages/yazhou-pc/index.vue
 * @Description: 活动页
 * @Author: Echo
-->
<template>
    <q-scroll-area class="five-activity-action" ref="scrollareaRef">
        <load-data :state="allPageState">
            <!-- 头部 banner 图 -->
            <div class="top-banner">
                <img src="~public/activity/yazhou-pc/common/activity_banner/banner_slot.jpg" alt="" width="100%" />
            </div>
            <!-- 内容部分 -->
            <div v-if="tabs.length">
                <div class="container">
                    <!-- 三个活动的 tab 切换 -->
                    <div class="tabs">
                        <div v-for="(v, k) in tabs" :key="k + '_' + time_creat" class="tab-item text-gray relative-position"
                            :class="v.activity == v.activityId ? 'isActive' : ''" @click="switchTabs(v.activityId)">
                            {{ v.label }}
                            <!-- 活动状态图标 -->
                            <span class="tips">
                                <img v-if="v.period == 2" src="~public/activity/yazhou-pc/activity_imgs/imgs/processing.png"
                                    alt="" width="100%" />
                                <img v-if="v.period == 1" src="~public/activity/yazhou-pc/activity_imgs/imgs/waiting.png"
                                    alt="" width="100%" />
                                <img v-if="v.period == 3" src="~public/activity/yazhou-pc/activity_imgs/imgs/finished.png"
                                    alt="" width="100%" />
                            </span>
                        </div>
                    </div>
                    <!-- 每日任务 -->
                    <GrowUp v-if="activityBanner == '10007'" :id="10007" :activityObj="dailyActivityObj" />
                    <!-- 成长任务 -->
                    <GrowUp v-if="activityBanner == '10008'" :id="10008" :activityObj="growthActivityObj" />
                    <!-- 幸运盲盒 -->
                    <LuckyBox v-if="activityBanner == '10009'" :activityObj="luckActivityObj" />
                    <!-- 老虎机 -->
                    <SlotMachine v-if="activityBanner == '10010'" :activityObj="slotActivityObj" />
                </div>
            </div>
        </load-data>
        <Alert :is_show="showAlert" :text="bettingMsg" :isMaintaining="isMaintaining" />
    </q-scroll-area>
</template>

<script>
import LuckyBox from "project/activity/src/pages/yazhou-pc/components/lucky_blind_box.vue";
import GrowUp from "project/activity/src/pages/yazhou-pc/components/growth_task.vue";
// 老虎机
import SlotMachine from "project/activity/src/pages/yazhou-pc/components/slot_machine.vue";
import Alert from "./public_alert.vue";
// import { mapGetters } from "vuex";
import UserStore from 'project/activity/src/store/module/user/index.js';
import time_format_mixin from "project/activity/src/mixins/common/formartmixin.js";
import { api_account } from "project/activity/src/api/index.js";
import utils from 'project/activity/src/utils/utils.js'

// let BUILD_VERSION = window.env.config.BUILD_VERSION
let BUILD_VERSION = '';
// if(BUILD_VERSION){
//   BUILD_VERSION = '/'+BUILD_VERSION
// }
let machine_images = [
    BUILD_VERSION + '/public/yazhou-pc/image/common/slot_machine/machine_silver.png',
    BUILD_VERSION + '/public/yazhou-pc/image/common/slot_machine/machine_gold.png',
    BUILD_VERSION + '/public/yazhou-pc/image/common/slot_machine/machine_diamond.png'
];


export default {
    components: {
        LuckyBox,
        Alert,
        GrowUp,
        SlotMachine
    },
    mixins: [time_format_mixin],
    computed: {
        vx_get_user: function () {
            return UserStore.getters.get_user();
        }
    },
    beforeCreate() {
        // 老虎机三张图片预加载
        let { origin } = window.location;


        machine_images.forEach(item => {
            // 获取base64数据
            getBase64(origin + item)
        })
        // 获取base64数据
        function getBase64(imgUrl) {
     
            window.URL = window.URL || window.webkitURL;
            var xhr = new XMLHttpRequest();
            xhr.open("get", imgUrl, true);
            // 设置响应体类型
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    //得到一个blob对象
                    var blob = this.response;
                    // 文件读取类
                    let oFileReader = new FileReader();
                    oFileReader.onloadend = function (e) {
                        let base64 = e.target.result;
                        let lastSpelator = imgUrl.lastIndexOf('/');
                        let lastPoint = imgUrl.lastIndexOf('.')
                        let fileName = imgUrl.substring(lastSpelator + 1, lastPoint);
                        window.vue[fileName] = base64
                    };
                    oFileReader.readAsDataURL(blob);
                }
            }
            xhr.send();
        }
    },
    data() {
        return {
            tabs: [], // 三个活动的 tabs
            activityBanner: "", // 当前所展示的活动
            firstLoad: true, // 是否是首次加载
            activityIds: ["10007", "10008", "10009", "10010"], // 目前常驻活动 id
            time_creat: new Date().getTime(), // 页面创建时间
            isUrl: false, // 判断是否是通过链接打开页面的
            allPageState: "loading", // 覆盖整个页面的 laoding 状态
            showAlert: false, // 展示登录失效弹窗
            bettingMsg: "", // 弹窗内容
            isMaintaining: false, // 是否处于维护状态
            activity_list: [],
            dailyActivityObj: {},
            growthActivityObj: {},
            luckActivityObj: {},
            slotActivityObj: {}
        };
    },
    created() {
        // 初始化活动 tabs
        this.tabs = [
            {
                label: "每日任务",
                activityId: "10007",
                period: 0,
                activity: "10007"
            },
            {
                label: "成长任务",
                activityId: "10008",
                period: 0,
                activity: ""
            },
            {
                label: "幸运盲盒",
                activityId: "10009",
                period: 0,
                activity: ""
            },
            {
                label: "老虎机",
                activityId: "10010",
                period: 0,
                activity: ""
            }
        ];
        // 更新用户信息
        useMittEmit("upd_user_data");
        this.get_user_info()
        // 根据连接参数跳转活动
        let page_url = window.location.href.toLowerCase();
        let act = page_url.split("?").find(item => item.includes("activity"));
        if (act) {
            if (act.includes("&")) {
                act = act.split("&").find(item => item.includes("activity"));
                act = act.split("=")[1];
            } else {
                act = act.split("=")[1];
            }
            if (act && act.includes('#')) {
                act = act.split('#')[0]
            }
            let id = act ? act.split(",")[0] : '';
            this.linkId = id;
            if (this.activityIds.includes(id)) {
                this.isUrl = true;
                this.switchTabs(id);
            }
        }
    },
    watch: {
        vx_get_user: {
            handler(e) {
                this.allPageState = "data";
                // 如果活动处于维护状态，就切换到维护页面
                if (e.maintaining == true) {
                    utils.redirect_router('/activity_aegis');
                    return;
                } else {
                    this.getActivityTabs();
                }
            }
        }
    },
    methods: {
        // 获取活动相关信息
        getActivityTabs() {
            let activityList = this.activity_list.length ? this.activity_list : _.get(this.vx_get_user, "activityList");
            let ids = [];
            // 获取服务器时间
            let stime = this.mx_get_remote_time();
            // 如果有活动列表并且活动 > 1个
            if (activityList && activityList.length > 0) {
                let _obj = {}
                activityList.forEach(item => {
                    // 获取对应的活动状态
                    this.tabs.forEach(item1 => {
                        if (item1.activityId === item.activityId) {
                            item1.period = item.period;
                            ids.push(item.activityId);
                        }
                    })
                    // 获取每个活动的时间参数
                    if (!!item.inStartTime && Number(item.inStartTime) > 0) {
                        // 获取活动的开始和结束时间
                        _obj.startAndEndTime = `${item.inStartTime},${item.inEndTime}`;
                        // 活动进行中
                        if (item.period == 2) {
                            // type 1 表示是长期活动，活动时间只需要显示固定文字
                            if (item.type == 1) {
                                _obj.showTime = "活动长期有效";
                            } else {
                                if (item.inEndTime && Number(item.inEndTime) != 0) {
                                    if (Number(item.inEndTime) <= stime) {
                                        _obj.showTime = "活动已结束"
                                    } else {
                                        // 每个活动的这个参数是 toEnd 或者 toStart 时，需要到具体的活动里面去展示倒计时
                                        _obj.showTime = 'toEnd';
                                    }
                                } else {
                                    _obj.showTime = "活动长期有效"
                                }
                            }
                        } else if (item.period == 1) {
                            _obj.showTime = 'toStart'
                        } else {
                            _obj.showTime = "活动已结束"
                        }
                    }
                    _obj.period = item.period;
                    switch (String(item.activityId)) {
                        case '10007':
                            this.dailyActivityObj = _obj
                            break;
                        case '10008':
                            this.growthActivityObj = _obj;
                            break;
                        case '10009':
                            this.luckActivityObj = _obj;
                        default:
                            this.slotActivityObj = _obj;
                            break;
                    }
                });
                // 用接口数据来匹配本地数据---tab 固定顺序显示
                let tab = [];
                this.tabs.forEach((item, index) => {
                    if (ids.length == 1) {
                        if (ids[0] == item.activityId) {
                            if (!this.isUrl) {
                                item.activity = item.activityId;
                            }
                            tab = item;
                        }
                    } else {
                        // 如果本地数据里的活动和接口的匹配不上，就把本地 tabs 里的删掉
                        if (!ids.includes(item.activityId)) {
                            this.tabs.splice(index, 1);
                            // 如果链接上没有参数，就默认选中第一个活动
                            if (!this.isUrl) {
                                this.tabs[0].activity = this.tabs[0].activityId;
                                this.activityBanner = this.tabs[0].activityId;
                            }
                        }
                    }
                });
                if (ids.length == 1) {
                    this.tabs.length = 1;
                    this.tabs[0] = tab;
                    if (!this.isUrl) {
                        this.activityBanner = this.tabs[0].activityId;
                    }
                }
                // 如果是第一次加载并且不止一个活动并且活动 id 里包含了第一个活动
                if (this.firstLoad == true && ids.length > 1 && ids.includes("10007")) {
                    // 并且链接上没有带参数，就默认选中第一个
                    if (!this.isUrl) {
                        this.activityBanner = "10007";
                        this.tabs[0].activity = "10007";
                    }
                    this.firstLoad = false;
                }
            }
            this.$forceUpdate();
        },
        /**
         * 切换活动
         */
        switchTabs(k) {
            // 如果点击的是当前活动就不予处理
            if (this.activityBanner == k) { return }
            this.activityBanner = k;
            // 每次切换时更新一次活动数据，以防止遇到后台设置活动的临界点
            this.get_user_info()
            this.tabs.forEach(item => {
                if (!item.activity && item.activityId == k) {
                    item.activity = k;
                }
                if (item.activity && item.activityId != k) {
                    item.activity = "";
                }
                if (this.tabs.length == 3) {
                    if (k != "10007") {
                        this.tabs[0].activity = "";
                    }
                }
            });
            let clickName = ""
            // 每日任务
            if (k == '10007') {
                utils.gtag_event_send('PC_edtask_click', 'PC_活动', 'PC_每日任务', new Date().getTime())
                clickName = 'PC_每日任务页签'
                // 成长任务
            } else if (k == '10008') {
                utils.gtag_event_send('PC_grtask_click', 'PC_活动', 'PC_成长任务', new Date().getTime())
                clickName = 'PC_成长任务页签'
                // 幸运盲盒
            } else if (k == '10009') {
                utils.gtag_event_send('PC_luckybox_click', 'PC_活动', 'PC_幸运盲盒', new Date().getTime())
                clickName = 'PC_幸运盲盒页签'
            }
            // 每次切换活动时重新获取一次活动状态
            this.getActivityTabs();
            //记录埋点事件
            this.record_zhuge_point(clickName)
        },
        // 诸葛埋点事件
        record_zhuge_point(eventLabel) {
            // 发送埋点事件
            if (eventLabel) {
                utils.send_zhuge_event(eventLabel);
            }
        },
        /**
         * 更新用户信息接口
         */
        get_user_info() {
            let token = _.get(this.vx_get_user, "token");
            if (token) {
                api_account.get_user_info({ token: token }).then(({ data: { data } }) => {
                    // 配置埋点信息
                    // PV
                    gtag_view_send('PC_activity', '/activity')
                    if (_.get(data, 'activityList')) {
                        this.activity_list = data.activityList
                    }
                }).catch(err => {
                    // 接口报错就提示登陆失败弹窗
                    this.showAlert = true;
                })
            } else {
                this.showAlert = true;
            }

        },
        getPeriod(item, id) {
            if (item.activityId == id) {
                return item.period;
            }
        }
    },
};
</script>

<style lang="scss">
//@import "./y0_activity.scss";
.five-activity-action {
    min-width: 1200px;
    height: 100vh;
    margin: 0 auto;
    color: var(--qq--activity-text-color);
    background-color: var(--qq--activity-bg-color);
    overflow-y: scroll;
    .q-scrollarea__thumb {
        opacity: 1 !important;
        background: #D8D9DC;

        &.absolute-bottom {
            display: none;
        }

        &.absolute-right {
            width: 7px !important;
        }
    }

    .q-scrollarea__bar {
        &.absolute-right {
            width: 7px !important;
            background: var(--qq--activity-bg-color);
            opacity: 1 !important;
        }
    }

    .relative-position {
        .q-scrollarea__content {
            display: flex;
        }

        .full-width {
            .load-data-wrap {
                .loading-wrap {
                    margin-top: 400px;
                }
            }
        }
    }

    /*  顶部 banner */
    .top-banner {
        min-height: 384px;

        img {
            display: block;
            width: 100% !important;
        }
    }

    /*  内容 */
    .container {
        margin: 0 auto;
        position: static;

        /*  活动 tabs */
        .tabs {
            height: 70px;
            border: 2px solid var(--qq--activity-bd-color);
            border-radius: 35px;
            background-image: var(--qq--activity-bd-img-gradient);
            display: flex;
            justify-content: space-around;
            width: 1200px;
            margin: 0 auto;
            padding: 3px;
            box-shadow: var(--qq--activity-box-shadow);

            .tab-item {
                display: inline-block;
                flex: 1;
                line-height: 60px;
                font-size: 26px !important;
                font-family: PingFangSC-Light;
                text-align: center;
                cursor: pointer;
                border-radius: 30px;
                transition: all 0.2s;
                color: var(--qq--activity-text-color-3);

                .tips {
                    position: absolute;
                    width: 84px;
                    top: -30px;
                    right: 12%;
                    background: transparent;
                }
            }

            .isActive {
                background-image: var(--qq--activity-tab-bg-img-active);
                color: var(--qq--activity-text-color-active);
                font-family: PingFangSC-Regular;
            }
        }

        /*  活动内容页面 */
        .tabs_content {
            font-size: 16px !important;
            width: 1200px;
            margin: 40px auto 0;
            background: var(--qq--activity-bg-color);
            border-radius: 30px;

            .activity_content {
                background: var(--qq--activity-bg-color);
                border: 1px solid var(--qq--activity-bd-color-2);
                box-shadow: var(--qq--activity-box-shadow-2);
                border-radius: 30px;
                position: relative;
                padding-bottom: 80px;
                margin-top: 80px;

                .content {
                    width: 980px;
                    margin: 0 auto;
                    font-family: SourceHanSansSC-Medium;
                }
            }

            .content_bottom {
                position: absolute;
                bottom: -12px;
                left: 50%;
                margin-left: -29px;
            }

            .content_title {
                width: 260px;
                height: 62px;
                background-image: var(--qq--activity-bd-img-1);
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                line-height: 62px;
                font-family: PingFangSC-Medium;
                font-size: 24px;
                color: var(--qq--activity-text-color-16);
                text-align: center;
                margin: 0 auto;
                position: relative;
                top: -25px;
                margin-bottom: 20px;
                /*  活动规则公共样式 */
            }

            .activity_rules {
                background: var(--qq--activity-bg-color);
                border: 1px solid var(--qq--activity-bd-color-2);
                box-shadow: var(--qq--activity-box-shadow-2);
                border-radius: 30px;
                margin-top: 75px;
                margin-bottom: 60px;
                padding-bottom: 30px;

                p {
                    width: 980px;
                    margin: 0 auto;
                    background: var(--qq--activity-bd-img-2) no-repeat;
                    padding-left: 30px;
                    background-size: 12px;
                    background-position-x: 0px;
                    background-position-y: 7px;
                    line-height: 27px;
                    margin-bottom: 48px;
                    color: var(--qq--activity-text-color-3);

                    &:nth-child(1) {
                        margin-top: 35px;
                    }

                    &:last-child {
                        margin-bottom: 0;
                    }

                    font {
                        color: var(--qq--activity-text-color-4);
                    }
                }
            }
        }
    }
}

/*  公共字体颜色，三个活动都在用 */
.text-orange {
    color: var(--qq--activity-text-color-4) !important;
}

.text-666 {
    color: var(--qq--activity-text-color-3);
}

.text-333 {
    color: var(--qq--activity-text-color-2);
}

p {
    margin-bottom: 0;
    /*  公共样式，活动头部信息 */
}

.introduction {
    p {
        background: var(--qq--activity-bd-img-2);
        background-repeat: no-repeat;
        background-size: 12px;
        background-position: 80px 13px;
        padding-left: 110px;
        line-height: 40px;
        margin-bottom: 4px;
        font-family: PingFangSC-Medium;

        span:not(.text-orange) {
            font-weight: 700;
        }
    }
}

.q-menu {
    .q-virtual-scroll__content {
        .q-item {
            width: 260px !important;
            padding-left: 30px;
        }

        .q-item--active {
            background-image: url("~public/activity/yazhou-pc/activity_imgs/imgs/got.svg") !important;
            background-repeat: no-repeat;
            background-size: 16px;
            background-position-x: 7px;
            background-position-y: 15px;
        }
    }
}

.text-blue {
    color: var(--qq--activity-text-color-blue) !important;
}
</style>
<style lang="scss">
.text-gray {
    color: var(--qq--activity-text-color-gray);
}

.text-red {
    color: var(--qq--activity-text-color-red) !important;
}
</style>
