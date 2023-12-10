<!--
 * @Date: 2021-06-28 00:27:00
 * @FilePath: /user-pc1/project/activity/src/pages/yazhou-pc/grow_up/index.vue
 * @Description: 成长任务
 * @Author: Echo
-->
<template>
  <div class="tabs_content">
    <div class="introduction text-666">
      <p>活动对象：<span class="text-orange">本场馆全体会员</span></p>
      <p class="activity-date-time">活动时间：
        <span class="text-666" v-if="activityObj.showTime == 'toStart'">距离活动开始还有
          <span v-if="activityTime.day">{{activityTime.day}}天</span>
          <span>{{activityTime.hr}}:</span>
          <span>{{activityTime.min}}:</span>
          <span>{{activityTime.sec}}</span>
        </span>
        <span v-else-if="activityObj.showTime == 'toEnd'" class="text-666">距离活动结束还有
          <span>{{activityTime.hr}}:</span>
          <span>{{activityTime.min}}:</span>
          <span>{{activityTime.sec}}</span>
        </span>
        <span v-else>{{activityTime}}</span>
      </p>
      <p>活动内容：
        <span v-if="!isGrow" class="text-orange">『每日』达成指定任务，即可获得对应数量的普通奖券，普通奖券可至『老虎机』进行合成并参与老虎机抽奖。</span>
        <span v-else class="text-orange">『每周/月』达成指定任务，即可获得对应数量的普通奖券，普通奖券可至『老虎机』进行合成并参与老虎机抽奖。</span>
      </p>
    </div>
    <div class="activity_content">
      <div class="content_title">
        活动内容
      </div>
      <!-- 成长任务展示这个模块 -->
      <div v-if="isGrow" class="betting_data text-center text-333">
        <p>
          <span>本月累计有效投注天数</span>
          <span class="text-orange">{{activityObj.period == 1 ? 0 : userBettingInfo.mBetDays}}</span> 天
        </p>
        <p class="relative-position">
          <span>本周累计有效投注额</span>
          <span class="text-orange">{{activityObj.period == 1 ? '0.00' : userBettingInfo.wBillAmount}}</span> 元
        </p>
        <p>
          <span>本月累计有效投注额</span>
          <span class="text-orange">{{activityObj.period == 1 ? '0.00' : userBettingInfo.mBillAmount}}</span> 元
        </p>
      </div>
      <div class="table">
        <div class="table-header text-333">
          <p>任务事项</p>
          <p>状态</p>
          <p>奖券数量</p>
          <p>领取状态</p>
        </div>
        <load-data :state="load_data_state">
          <div class="table-body relative-position" v-for="(item, i) in taskList" :key="i">
            <p class="text-left">{{item.taskName}}</p>
            <p v-if="item.bonusType == 1 || item.bonusType == 3" class="text-orange completed">已完成</p>
            <p v-if="item.bonusType == 2" class="undone">未完成</p>
            <p>{{item.ticketNum}}</p>
            <p v-if="item.bonusType == 1" class="received">已领取</p>
            <p v-if="item.bonusType == 2" class="undone">待完成</p>
            <p v-if="item.bonusType == 3" class="getLottery text-white"><span @click="getLottery(item)" :class="{'get_gray': activityObj.period == 1 || activityObj.period == 3}">领取</span></p>
          </div>
        </load-data>
      </div>
      <p class="text-center updateInteval"><span>{{id === 10007 ? '每5分钟更新一次' : '每小时更新一次'}}</span></p>
      <p class="history text-center text-333" @click="showReceiveHistoryList(1)">领取记录</p>
      <div class="task_intro">
        <p>您可每日按照指定任务进行完成，完成指定任务后可获得普通奖券，普通奖券可用于合成系统，参加老虎机抽奖。同时也可一键领取全部已完成任务，诚邀您的参与！</p>
        <p>
          <span class="text-orange text-center" @click="getLottery(null)">一键领取</span>
        </p>
      </div>
    </div>
    <div class="activity_rules text-gray">
      <div class="content_title">
        活动规则
      </div>
      <p>
        {{!isGrow ? '会员每日达成指定任务，即可获得对应数量的普通奖券；' : '会员周期内达成指定任务，即可获得对应数量的普通奖券；'}}
      </p>
      <p v-if="isGrow">
        每日在本场馆累计投注<font>≥100</font>元，即视为投注1天；
      </p>
      <p v-else>
        单笔注单投注<font>≥100</font>元，方可视为每日任务活动有效注单；
      </p>
      <p v-if="isGrow">
        成长任务数据每小时更新一次，在下个自然周/自然月数据将自动清零重新计算，请会员于自然周期最后一天提前<font>一小时</font>完成任务并领取奖券，避免因数据延迟导致领取失败；
      </p>
      <p v-else>
        每日任务数据每<font>5</font>分钟更新一次，在次日数据将自动清零重新计算，请会员每日提前<font>30</font>分钟完成任务并领取奖券，避免因数据延迟导致领取失败；
      </p>
      <p v-if="isGrow">
        成长任务活动有效注单以结算时间为准。任何低于欧洲盘<font>1.5</font>(香港盘<font>0.5</font>)水位、同场赛事中投注对等盘口、串关注单，皆不予计算；
      </p>
      <p v-else>
        每日任务活动有效注单以结算时间为准，且需满足单笔投注金额<font>≥100</font>元。任何低于欧洲盘<font>1.5</font>(香港盘<font>0.5</font>)水位、同场赛事中投注对等盘口、串关注单，皆不予计算；
      </p>
      <p>
        每位有效会员、每个手机号、每个电子邮箱、每张银行卡、每个IP地址、每台电脑使用者，仅可享受1次优惠，如会员使用一切不正当投注、套利等违规行为，我们将保留无限期审核扣回奖金及所产生利润的权利；
      </p>
      <p>
        为避免文字理解差异，本场馆保留本活动最终解释权。
      </p>
    </div>
    <q-dialog v-model="showHistory">
      <q-layout view="Lhh lpR fff" container class="receiveHistory">
        <img class="close" src="~public/image/activity_imgs/imgs/dialog_close.png" alt="" @click="closeHistoryList" width="30px">
        <div class="betting_history">
          <div class="content_title text-center text-333">
            领取记录
          </div>
          <div class="table table_history relative-position">
            <div class="text-333 text-center">
              <p>任务</p>
              <p>奖券数量</p>
              <p>领取时间</p>
            </div>
            <load-data :state="hisToryListDataState">
              <div class="text-666 text-center table_content" v-for="(item, index) in receiveHistory" :key="index">
                <p><span>{{item.taskName}}</span></p>
                <p><span>{{item.ticketNum}}</span></p>
                <p><span>{{item.receiveTime}}</span></p>
              </div>
            </load-data>
          </div>
          <div class="pagination_wrap" v-if="receiveHistory.length > 0">
            <div class="pagination_with_input">
              <q-pagination class="pagination pager"
                v-model="receiveHistoryParams.current"
                :max="hisToryTotal"
                direction-links
                boundary-numbers
                :max-pages="10"
                @input="showReceiveHistoryList"
              ></q-pagination>
              <p class="goto_page text-666">
                <span @click="goToHistoryPage(null)">&nbsp;&nbsp;跳转至</span>&nbsp;&nbsp;<input type="number" v-model="goToPage" :max="hisToryTotal" @keyup="goToHistoryPage($event)">&nbsp;&nbsp;页
              </p>
            </div>
          </div>
        </div>
      </q-layout>
    </q-dialog>
    <LotteryDialog
      :getLotteryDialog="getLotteryDialog"
      :getLotteryNum="getLotteryNum"
      :getLotterySuc="getLotterySuc"
      :getLotteryAgain="getLotteryAgain"
      @getLottery="getLottery"
      @close_lottery_dialog="closeGetLottery" />
    <Alert :is_show="showAlert" :text="bettingMsg" :isMaintaining="isMaintaining"/>
    <Toast v-if="showToast" :text="toastText" />
  </div>
</template>
<script>
import {api_activity} from "src/api/index.js"
import Alert from "project/activity/src/components/public_alert/public_alert.vue"
import Toast from "project/activity/src/pages/yazhou-pc/toast.vue";
import LotteryDialog from "project/activity/src/pages/yazhou-pc/lottery_dialog.vue";
import common from "project/activity/src/pages/yazhou-pc/common";
import format_date_base from "project/activity/src/mixins/common/formartmixin.js";
import utils from 'project/activity/src/utils/utils.js'
export default {
  name: 'BettingEveryday',
  mixins: [common, format_date_base],
  components: {
    Alert,
    Toast,
    LotteryDialog
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
      showToast: false,
      showAlert: false,
      bettingMsg: '', // 弹窗提示语
      taskList: [], //任务列表
      userBettingData: {}, // 用户投注数据
      receiveHistory:[], // 领取奖券记录
      load_data_state: 'empty',
      showHistory: false, // 领取记录弹窗
      getLotteryAgain: {}, // 再次领取数据
      taskIds: '', // 任务id
      getLotteryDialog: false, // 领取奖券弹窗
      getLotterySuc: false, // 是否领取成功
      getLotteryNum: 0, // 领取奖券张数
      receiveHistoryParams: { // 领取记录接口参数
        current: 1,
        size: 7,
        actId: 0
      },
      hisToryTotal: 0, // 历史记录总数
      goToPage: 1, // 历史记录翻页输入框
      userBettingInfo: {}, // 用户投注数据
      toastText: '没有可领取的奖项',
      updateInteval: null, // 定时器
      activityTime: {}, // 活动时间文案
      hisToryListDataState: 'empty', // 领取记录数据加载状态
      timeout_obj:{}, //定时器集合
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
        }, 60*60*1000);
        if (this.activityObj.period != 1) {
          this.getUserBettingInfo();
        }
      } else {
        this.isGrow = false;
        // 每日任务，没5分钟更新一次
        this.updateInteval = setInterval(() => {
          this.getActivityLists(1);
        }, 5*60*1000);
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
        if (this.isGrow && !(this._isMonday || this.firstDayOfMonth)) {return}
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
    showReceiveHistoryList(num) {
      this.getActivityReceiveRcord(num, this.activityObj.startAndEndTime);
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
            this.showAlert = true;
            this.bettingMsg = res.data.msg;
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
            // window.opener.postMessage({name: 'cancelActivityDot', dotHide: 1}, '*');
            // alert('cancelActivityDot')
          }
        } else {
          // 如果当前有可领取任务，也发送通知去更新小红点
          if (ids && this.activityObj.period == 2 && this.taskIds != '') {
            // window.opener.postMessage({name: 'cancelActivityDot', dotHide: 0}, '*');
            // alert('cancelActivityDot')
          }
        }
      }).catch(err => {
        console.error(err);
        this.load_data_state = 'empty';
      })
    },
    // 关闭领取记录弹窗
    closeHistoryList() {
      this.showHistory = false;
    },
    /**
     * 领取奖券
     */
    getLottery(item) {
      // 活动已结束，不允许点击
      if (this.activityObj.period == 3) {
        this.showToast = true;
        this.toastText = '任务已结束';
         if (this.timeout_obj.timer1) {clearTimeout(this.timeout_obj.timer1)};
        this.timeout_obj.timer1= setTimeout(() => {
          this.showToast = false;
          this.toastText = '';
        }, 2000);
        return;
      };
      // 每次调用保存一下数据，用于领取失败时再次开箱
      this.getLotteryAgain = {...item};
      const params = {
        ids: item ? item.bonusId : this.taskIds,
        ty: this.id == '10008' ? 1 : 0, // 成长任务 1 每日任务 0
      }
      // 没有可领取任务时和活动未开始，不允许点击
      if (!params.ids || this.activityObj.period == 1) {
        this.showToast = true;
        this.toastText = '没有可领取的奖项';
         if (this.timeout_obj.timer2) {clearTimeout(this.timeout_obj.timer2)};
        this.timeout_obj.timer2=  setTimeout(() => {
          this.showToast = false;
          this.toastText = '';
        }, 2000);
        return;
      };
      api_activity.get_tokyo_receive_lottery(params).then(res => {
        let code = _.get(res, 'data.code');
        let data = _.get(res, 'data.data');
        if (code == 200 && data) {
          this.getLotteryDialog = true;
          this.getLotterySuc = true;
          this.getLotteryNum = data.ticket;
          utils.gtag_event_send(this.isGrow ? 'PC_grtask_getAwardClick' : 'PC_edtask_getAwardClick', 'PC_活动', this.isGrow ? 'PC_成长任务' : 'PC_每日任务')
        } else {
          if (code == '0410502' || code == '0410500' || code == '0410501' || code == '0410506') {
            this.toastText = res.data.msg;
            this.showToast = true;
              if (this.timeout_obj.timer3) {clearTimeout(this.timeout_obj.timer3)};
            this.timeout_obj.timer3 = setTimeout(() => {
              this.showToast = false;
              this.toastText = '';
            }, 2000);
          } else if (code == '0400500') {
            this.getLotteryDialog = true;
          } else if (code == '0410505') {
            this.isMaintaining = true;
            this.showAlert = true;
            this.bettingMsg = "活动现已维护，感谢您的支持";
          }
        }
        this.taskIds = '';
        this.countGetList = 0;
        this.getActivityLists();
      })
    },
    /**
     * 历史记录跳转到 * 页
     * @param e 用户输入的页数
     */
    goToHistoryPage(e = null) {
      if (!this.goToPage) return
      let gotoPage = Number(this.goToPage);
      if (gotoPage == this.receiveHistoryParams.current) {return}
      if (((e && e.keyCode == 13) || e == null) && this.goToPage != '' && (gotoPage <= Number(this.hisToryTotal))) {
        this.receiveHistoryParams.current = gotoPage;
        this.getActivityReceiveRcord(gotoPage, this.activityObj.startAndEndTime);
      } else {
        if (gotoPage > Number(this.hisToryTotal)) {
          this.goToPage = this.hisToryTotal;
        }
        if (gotoPage < 1) {
          this.goToPage = 1
        }
      }
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
    closeGetLottery() {
      this.getLotteryDialog = false;
    },
    /**
     * 奖券领取记录
     * @param {*} num 分页页数
     * @param {*} timeStamp 活动时间
     * @returns
     */
    getActivityReceiveRcord(num = null, timeStamp) {
      if (this.hisToryTotal == 1 && num) {return}
      this.hisToryListDataState = "loading";
      this.receiveHistoryParams.actId = this.isGrow ? '2' : '1';
      if (Number(num) > 0) {
        this.receiveHistoryParams.current = num;
      }
      if (timeStamp) {
        this.receiveHistoryParams.startTime = "";
        this.receiveHistoryParams.endTime = timeStamp.split(',')[1];
        this.receiveHistoryParams.endTime == 0 ? this.receiveHistoryParams.endTime = null : null;
      }
      api_activity.get_activity_receive_record(this.receiveHistoryParams).then(res => {
        let code = _.get(res, "data.code");
        let data = _.get(res, "data.data");
        if (code == '0401038') {
          this.showHistory = true;
          this.hisToryListDataState = 'api_limited'
          return
        }          
        if (code == 200) {
          this.hisToryListDataState = "data";
          const list = [];
          if (_.get(data, 'records.length') > 0) {
            data.records.forEach((item, index) => {
              list[index] = item;
              if (item.receiveTime) {
                let _time = this.format_date_base(item.receiveTime);
                let _format = `${_time[0]}-${_time[1]}-${_time[2]} ${_time[3]}:${_time[4]}`
                list[index].receiveTime = _format;
              } else {
                list[index].receiveTime = '-';
              }
            })
          } else {
            this.hisToryListDataState = 'empty';
          }
          this.showHistory = true;
          this.receiveHistory = list;
          this.hisToryTotal = Math.ceil(Number(data.total) / 7);
          // 活动维护状态
        } else if (code == '0410505') {
          this.isMaintaining = true;
          this.showAlert = true;
          this.bettingMsg = "活动现已维护，感谢您的支持";
          this.hisToryListDataState = "empty";
        } else {
          this.showHistory = true;
          this.hisToryListDataState = "empty";
        }
        this.$nextTick(() => {
          utils.set_page_aria_hidden()
        })
      }).catch(err => {
        this.hisToryListDataState = "empty";
      })
    }
  },
  beforeDestroy() {
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
.tabs_content {
  .activity-date-time {
    span {
      color: var(--qq--activity-text-color-7);
    }
  }
  .activity_content {
    .table {
      width: 1000px;
      margin: 0 auto;
      overflow: hidden;
      font-size: 16px;
      .table-header {
        background: var(--qq--activity-bg-color-4);
        height: 100%;
        width: 100%;
        height: 46px;
        line-height: 46px;
        display: flex;
        margin: 0;
        border-radius: 10px 10px 0 0;
        border: 1px solid var(--qq--activity-bd-color-5);
        border-bottom: 0 none;
      }
      ::v-deep .empty {
        min-height: 200px;
      }
      div {
        display: flex;
        margin: 0;
        p {
          text-align: center;
          flex: 1;
          &.text-orange {
            background: var(--qq--activity-btn-bg-img1) no-repeat 130px center;
          }
        }
        p:nth-child(1) {
          flex: 2;
        }
        &.table-body {
          height: 60px;
          border: 1px solid var(--qq--activity-bd-color-5);
          border-top: 0 none;
          &:nth-child(even) {
            background: var(--qq--activity-bg-color-5);
          }
          &:not(:last-child) {
            border-bottom: 1px solid var(--qq--activity-bd-color-5);
          }
          p:not(:last-child) {
            border-right: 1px solid var(--qq--activity-bd-color-5);
          }
          p:nth-child(odd) {
            color: var(--qq--activity-text-color-3);
          }
          p:nth-child(even) {
            color: var(--qq--activity-text-color-5);
          }
          p:nth-child(1) {
            text-align: left;
            padding-left: 20px;
            display: flex;
            align-items: center;
          }
          p:not(:first-child) {
            line-height: 60px;
          }
          .getLottery {
            span {
              display: block;
              width: 120px;
              height: 38px;
              line-height: 38px;
              background: var(--qq--activity-btn-bg-img2);
              font-size: 14px;
              font-family: PingFangSC-Medium;
              margin: 11px auto 0;
              cursor: pointer;
              position: relative;
            }
            .get_gray::after {
              content: "";
              display: block;
              position: absolute;
              width: 120px;
              height: 38px;
              top: 0;
              border-radius: 33px;
              cursor: auto;
              background: rgba(0, 0, 0, 0.2);
              -webkit-filter: grayscale(50%);
              filter: grayscale(50%);
            }
          }
        }
      }
    }
    .updateInteval {
      margin-top: 15px;
      span {
        position: relative;
        color: var(--qq--activity-text-color-7);
      }
      span::after {
        content: "";
        display: block;
        width: 6px;
        height: 6px;
        background: var(--qq--activity-bg-color-6);
        border-radius: 3px;
        position: absolute;
        left: -15px;
        top: 8px;
      }
    }
    .history {
      width: 200px;
      height: 60px;
      line-height: 60px;
      background-image: var(--qq--activity-bd-img-3);
      background-size: 100% 100%;
      margin: 15px auto 35px;
      border-radius: 30px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      cursor: pointer;
      border: 1px solid var(--qq--activity-bd-color-3);
      font-weight: 600;
    }
    .task_intro {
      width: 1000px;
      background: var(--qq--activity-bg-color-2);
      border-radius: 10px;
      margin: 0 auto;
      display: flex;
      padding: 15px;
      p:nth-child(1) {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--qq--activity-text-color-3);
        flex: 2;
        line-height: 26px;
      }
      p:nth-child(2) {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: var(--qq--activity-text-color-active);
        flex: 1;
        display: flex;
        justify-content: space-evenly;
        padding-top: 8px;
        span {
          display: inline-block;
          width: 120px;
          height: 38px;
          line-height: 36px;
          border-radius: 15px;
          cursor: pointer;
          margin-left: 20px;
        }
        span:nth-child(1) {
          background-image: var(--qq--activity-bd-img-4);
        }
      }
    }
    .betting_data {
      width: 1000px;
      height: 110px;
      margin: 0 auto 35px;
      background-image: var(--qq--activity-bd-img-gradient-2);
      border: 1px solid var(--qq--activity-bd-color-4);
      border-radius: 30px;
      display: flex;
      p {
        flex: 1;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        font-weight: 600;
        padding-top: 20px;
        span:nth-child(1) {
          display: block;
        }
        span:nth-child(2) {
          font-family: DINPro-Medium;
          font-size: 34px;
          font-weight: 500;
          position: relative;
          top: 2px;
        }
        &:nth-child(2)::after {
          display: block;
          content: "";
          width: 1px;
          height: 60px;
          background: var(--qq--activity-bg-color-3);
          position: absolute;
          right: 0;
          top: 24px;
        }
        &:nth-child(2)::before {
          display: block;
          content: "";
          width: 1px;
          height: 60px;
          background: var(--qq--activity-bg-color-3);
          position: absolute;
          left: 1px;
          top: 24px;
        }
      }
    }
  }

  ::v-deep .scroll {
    overflow: hidden !important;
    /*  分页器 */
  }
  ::v-deep .q-btn__wrapper {
    width: 24px;
    height: 24px;
    padding-top: 0;
  }
  ::v-deep .q-btn__wrapper:before {
    box-shadow: none;
    border: 0.5px solid var(--qq--activity-bd-color-6);
  }
  ::v-deep .q-icon {
    color: var(--qq--activity-text-color-3);
    display: inline-block;
    font-size: 13px;
    width: 24px;
    min-width: 24px;
    height: 24px;
    line-height: 20px;
    border-radius: 2px;
  }
  ::v-deep .q-btn:not(.text-white) {
    & > div {
      &:before {
        border: 0.5px solid var(--qq--activity-bd-color-6);
      }
    }
  }
  ::v-deep .q-btn {
    min-width: 24px !important;
    width: 24px;
    height: 24px;
    font-size: 12px;
    & > div {
      height: 24px !important;
      min-height: 24px;
      line-height: 24px;
      div {
        height: 24px;
      }
    }
    &:not(:last-child) {
      margin-right: 5px;
    }
    &:last-child {
      margin-right: 5px;
    }
  }
  ::v-deep .bg-primary {
    background: var(--qq--activity-bg-color-7) !important;
  }
}
.receiveHistory {
  width: 1300px;
  max-width: 1300px;
  max-height: 970px;
  border: 1px solid transparent;
  border-radius: 17px;
  position: relative;
  box-shadow: none;
  .close {
    position: absolute;
    right: 0;
    top: -50px;
    width: 30px;
    cursor: pointer;
    z-index: 99;
  }
  ::v-deep .absolute-full {
    display: flex;
    align-items: center;
  }
  .scroll {
    overflow: hidden;
  }
  .betting_history {
    width: 1166px;
    margin: 50px auto 0;
    background: var(--qq--activity-bg-color);
    border: 1px solid var(--qq--activity-bd-color-2);
    box-shadow: var(--qq--activity-box-shadow-2);
    border-radius: 30px;
    height: 630px;
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
      text-align: center;
      margin: 0 auto;
      position: relative;
      top: -24px;
      margin-bottom: 30px;
      color: var(--qq--activity-text-color-active);
    }
    .table_history {
      width: 1000px;
      overflow: hidden;
      top: -32px;
      margin: 0 auto;
      .text-333 {
        border: 1px solid var(--qq--activity-bd-color-5);
        border-radius: 10px 10px 0 0;
        border-bottom: 0 none;
      }
      div {
        display: flex;
        justify-content: space-between;
        font-size: 16px !important;
        font-family: DINPro-Medium;
        p:nth-child(1) {
          flex: 2;
          padding-left: 20px;
        }
        p:nth-child(2),
        p:nth-child(3) {
          flex: 1;
        }
      }
      .table_content {
        border: 1px solid var(--qq--activity-bd-color-5);
        border-top: 0 none;
        &:nth-child(odd) {
          background: var(--qq--activity-bg-color-5);
        }
        p:not(:last-child) {
          border-right: 1px solid var(--qq--activity-bd-color-5);
        }
        p:nth-child(1) {
          text-align: left;

          padding-left: 20px;
          font-family: PingFangSC-Regular;
          display: flex;
          align-items: center;
          line-height: normal;
        }
        p:nth-child(2) {
          background: url("~public/image/activity_imgs/imgs/juan_red.png")
            no-repeat 75px center;
          background-size: 26px;
        }
        &:not(:last-child) {
          p {
            border-bottom: 1px solid var(--qq--activity-bd-color-5);
          }
        }
      }
      .text-333 {
        height: 46px;
        line-height: 46px;
        background: var(--qq--activity-text-color-6);
        font-family: PingFangSC-Medium;
        font-size: 16px;
      }
      .text-666 {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
      }
    }
  }
}
.lottery {
  box-shadow: none;
  width: 750px;
  max-width: 750px;
  height: 600px;
  background: url("~public/image/activity_imgs/imgs/get_lottery_bg.png")
    no-repeat center;
  ::v-deep .scroll {
    overflow: hidden;
  }
  .close {
    width: 30px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    cursor: pointer;
  }
  .content {
    padding: 70px 0 0;
  }
  .title {
    font-family: PingFangSC-Medium;
    font-size: 32px;
    margin-bottom: 40px;
  }
  img {
    display: block;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .go_lottery {
    width: 240px;
    height: 46px;
    line-height: 46px;
    background-image: var(--qq--activity-bd-img-gradient-3);
    border: 1px solid var(--qq--activity-bd-color);
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.17);
    border-radius: 33px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    margin: 0 auto;
    cursor: pointer;
  }
  .reget {
    width: 240px;
    height: 46px;
    line-height: 46px;
    background-image: var(--qq--activity-bg-img-active);
    border: 1px solid var(--qq--activity-bd-color);
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.17);
    border-radius: 33px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    margin: 0 auto;
    cursor: pointer;
  }
}
.pagination_wrap {
  width: 880px;
  display: flex;
  justify-content: center;
  margin: 0 auto 40px;
  font-size: 12px;
  .total_bonus {
    font-size: 20px;
    font-family: PingFangSC-Medium;
  }
  .pagination_with_input {
    display: flex;
    height: 30px;
    line-height: 30px;
    .goto_page {
      span {
        cursor: pointer;
      }
      input {
        margin-bottom: 0;
        border: 0.5px solid var(--qq--activity-bd-color-6);
        width: 32px;
        height: 24px;
        text-align: center;
        outline: none;
        border-radius: 2px;
      }
    }
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
 