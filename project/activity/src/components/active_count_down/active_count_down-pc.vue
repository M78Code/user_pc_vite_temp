
<template>
    <div class="">
        <span class="text-666" v-if="activityObj.showTime == 'toStart'">距离活动开始还有
            <span v-if="activityTime.day">{{ activityTime.day }}天</span>
            <span>{{ activityTime.hr }}:</span>
            <span>{{ activityTime.min }}:</span>
            <span>{{ activityTime.sec }}</span>
        </span>
        <span v-else-if="activityObj.showTime == 'toEnd'" class="text-666">距离活动结束还有
            <span>{{ activityTime.hr }}:</span>
            <span>{{ activityTime.min }}:</span>
            <span>{{ activityTime.sec }}</span>
        </span>
        <span v-else>{{ activityTime }}</span>
    </div>
</template>
<script>
import { api_activity } from "src/api/index.js"
import common from "project/activity/src/mixins/common/common.js";
import format_date_base from "project/activity/src/mixins/common/formartmixin.js";
export default {
    name: 'BettingEveryday',
    mixins: [common, format_date_base],
    components: {
    },
    props: {
        id: Number,
        activityObj: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            taskList: [], //任务列表
            load_data_state: 'empty',
            taskIds: '', // 任务id
            userBettingInfo: {}, // 用户投注数据
            updateInteval: null, // 定时器
            activityTime: {}, // 活动时间文案
            timeout_obj: {}, //定时器集合
            isMaintaining: false, // 是否是维护状态
            _isMonday: null, // 是否是周一
            firstDayOfMonth: null, // 是否是每月的1号
            isGrow: false, // 是否是成长任务
            countGetList: 0, // 计算当前请求了几次任务列表接口
        }
    },
    created() {
        this.init(this.id);
    },
    watch: {
        // 每次切换id时初始化一次
        id: {
            handler(e) {
                this.init(e)
            }
        }
    },
    methods: {
        init(id) {
            // 每次切换tab时这些参数也要初始化
            this.countGetList = 0;
            this.taskIds = '';
            clearInterval(this.updateInteval)
            // 是否是成长任务
            if (id == 10008) {
                this.isGrow = true;
                // 是否是周一
                this._isMonday = new Date().getDay() == 1;
                // 是否是1号
                this.firstDayOfMonth = new Date().getDate() == 1;
                // 每小时更新一次
                this.updateInteval = setInterval(() => {
                    this.getActivityLists(2);
                }, 60 * 60 * 1000);
                if (this.activityObj.period != 1) {
                    this.getUserBettingInfo();
                }
            } else {
                this.isGrow = false;
                // 每日任务，没5分钟更新一次
                this.updateInteval = setInterval(() => {
                    this.getActivityLists(1);
                }, 5 * 60 * 1000);
            }
            this.getActivityLists();
            if (this.activityObj.showTime == 'toStart') {
                this.countdown(this.activityObj.startAndEndTime.split(',')[0], this.activityObj.showTime);
            } else if (this.activityObj.showTime == 'toEnd') {
                this.countdown(this.activityObj.startAndEndTime.split(',')[1], this.activityObj.showTime);
            } else {
                this.activityTime = this.activityObj.showTime;
            }
            let _now = this.format_date_base(new Date().getTime());
            // 如果是周一或1号并且是在凌晨开始的5分钟内，就启用倒计时，00:05分后再拉取一次数据并清除倒计时
            if (_now[3] == '00' && parseInt(_now[4]) < 5) {
                // 如果是成长任务但不是周一或者1号就不用处理
                if (this.isGrow && !(this._isMonday || this.firstDayOfMonth)) { return }
                clearInterval(this.timeout_obj.timerInterval);
                this.timeout_obj.timerInterval = setInterval(() => {
                    if (new Date().getMinutes() >= 5) {
                        this.getActivityLists();
                        clearInterval(this.timeout_obj.timerInterval);
                        this.timeout_obj.timerInterval = null;
                    }
                }, 1000);
            }
        },
        /**
         * 获取任务列表
         * @param id 1 每日任务 2 成长任务
         */
        getActivityLists(id = null) {
            let _id = '';
            if (!id) {
                _id = this.id == '10007' ? 1 : 2;
            } else {
                _id = id;
            }
            this.countGetList += 1;
            if (this.countGetList == 1) {
                this.load_data_state = 'loading';
                // 首次请求清空任务列表
                this.taskList = [];
            }
            let param = new FormData();
            param.append('actId', _id);
            api_activity.get_activity_list_details(param).then(res => {
                let code = _.get(res, 'data.code');
                let data = _.get(res, 'data.data');
                if (code == '0401038') {
                    this.load_data_state = 'api_limited'
                    return
                }
                // 记录可以领取的任务id
                let ids = '';
                // 每天 00:00:00 - 00:05:00 把可领取的任务改成未完成
                // format_date_base 返回格式为 [YYYY, 'MM', 'DD', 'hh', 'mm', 'ss']
                let _now = this.format_date_base(new Date().getTime());
                let _get_gray = false;
                if (code == 200) {
                    if (data && data.length > 0) {
                        let list = [];
                        data.forEach((item, index) => {
                            // 任务状态为待领取并且当前是首次请求，用于一键领取
                            if (item.bonusType == 3) {
                                if (this.countGetList == 1) {
                                    this.taskIds += item.bonusId + ',';
                                }
                                // 不区分每日任务和成长任务记录的 id，用于判断首页小红点状态发送对应的消息
                                ids += item.bonusId + ',';
                            }
                            // 当前为首次请求时保存数据
                            if (this.countGetList == 1) {
                                list.push(item);
                                // 是否在凌晨的5分钟内
                                if (_now[3] == '00' && parseInt(_now[4]) < 5) {
                                    _get_gray = true;
                                }
                                // 当活动状态处于未开始或者每天的凌晨5分钟内，任务状态也展示为待完成
                                if (this.activityObj.period == 1 || _get_gray) {
                                    list[index].bonusType = 2;
                                }
                            }
                        })
                        // 当前首次请求才替换数据，第二次是另一种任务的请求
                        if (this.countGetList == 1) {
                            if (list.length) {
                                this.taskList = list;
                                this.load_data_state = 'data';
                            } else {
                                this.load_data_state = 'empty';
                            }
                        }
                    } else {
                        // 如果无数据并且是第一次请求就设置暂无数据的提示
                        if (this.countGetList == 1) {
                            this.load_data_state = 'empty';
                        }
                    }
                } else {
                    // 接口报错处理
                    if (this.countGetList == 1) {
                        this.load_data_state = 'empty';
                    }
                    if (code == '0401013') {
                        this.isMaintaining = false;
                    }
                }
                //如果没有已完成的任务
                if (!ids) {
                    // 如果当前是首次请求
                    if (this.countGetList == 1) {
                        // 如果当前是每日任务，就去拉取成长任务，反之一样
                        if (_id == 1) {
                            this.getActivityLists(2);
                        } else {
                            this.getActivityLists(1);
                        }
                    } else {
                        // 否则就通知首页导航取消小红点提示
                    }
                } else {
                    // 如果当前有可领取任务，也发送通知去更新小红点
                    if (ids && this.activityObj.period == 2 && this.taskIds != '') {
                    }
                }
            }).catch(err => {
                console.error(err);
                this.load_data_state = 'empty';
            })
        },
        /**
         * 获取用户的投注数据
         */
        getUserBettingInfo() {
            api_activity.get_activity_user_betting_info().then(res => {
                let code = _.get(res, 'data.code');
                let data = _.get(res, 'data.data');
                if (code == 200 && data) {
                    let obj = data;
                    if (!!obj.mBillAmount) {
                        obj.mBillAmount = obj.mBillAmount.toFixed(2);
                    } else {
                        obj.mBillAmount = '0.00';
                    }
                    if (!!obj.wBillAmount) {
                        obj.wBillAmount = obj.wBillAmount.toFixed(2);
                    } else {
                        obj.wBillAmount = '0.00';
                    }
                    obj.mBetDays ? obj.mBetDays : 0;
                    this.userBettingInfo = obj;
                }
            })
        },
        
    },
    beforeUnmount() {
        clearInterval(this.updateInteval)
        if (this.countTimer1) {
            clearTimeout(this.countTimer1)
        }
        /**清除定时器 */
        for (const key in this.timeout_obj) {
            clearTimeout(this.timeout_obj[key]);
        }
        this.timeout_obj = {};
    }
}
</script>
<style lang="scss" scoped>
.text-666 {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>
   