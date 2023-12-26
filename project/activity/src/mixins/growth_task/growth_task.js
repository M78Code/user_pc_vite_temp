 

import { api_activity } from "src/api/index.js";
import acticity_mixin from "project/activity/src/mixins/acticity_mixin/acticity_mixin";
import { UserCtr } from "project_path/src/core/index.js";
import { GATAG, is_time_limit } from "project_path/src/core/index.js";
import dayjs from 'dayjs'
import {
  LOCAL_COMMON_FILE_PREFIX,
} from "project_path/src/core/index.js";

export default {
  name: "growth_task",
  props: {
    actId: "",
    isIphoneX: false,
    // 对应的活动下标
    activityIndex: "",
    // 活动开始时间
    inStartTime: 0,
    // 活动结束时间
    inEndTime: 0,
  },

  mixins: [acticity_mixin],
  data() {
    return {
      hisToryTotal: 10,
      cumulative_betting_list: [
        { name2: "有效投注天数", mBet: "-" },
        { name2: "有效投注额", mBet: "-" },
        { name2: "有效投注额", mBet: "-" },
      ],
      // 任务领取的弹框
      daily_task_success: false,
      LOCAL_COMMON_FILE_PREFIX,
      // 任务领取弹框 的图片及奖励
      pop_parameter: {
        failure: LOCAL_COMMON_FILE_PREFIX + "/activity/yazhou-h5/activity/failure.png",
        success: LOCAL_COMMON_FILE_PREFIX + "/activity/yazhou-h5/activity/success.png",
        ticket: -1,
      },
      // 任务列表
      get_everyDay_list: [],
      has_data: true,
      get_data_loading: true,
      // 历史记录
      history_records: [],
      getLotteryAgain: {}, // 再次领取数据
      // 历史记录弹框
      history_alert: false,
      // 历史记录分页
      result_page_info: { current: 1, total: 1 },
      day_week_month_time_limit_timer: null,
      change_time: null,
      page_temp:'',
    };
  },
  computed: {
    pagenationMax(){
      return Math.ceil(this.result_page_info.total / this.hisToryTotal);
    },
  },
  created() {
    // 5分钟更新一次接口
    this.up_date_Info = 0;
    this.timer1_ = 0;
    let _now = this.format_date_base(new Date().getTime());
    // 时间限制，每日，每周，每月，凌晨 00：00  到 00:05 分之间
    if (_now[3] == "00" && parseInt(_now[4]) < 5) {
      this.day_week_month_time_limit();
    } else {
      // 活动列表接口
      this.get_daily_task_list();
      // console.log("不是凌晨 00：00 - 00:05  分之间");
    }
    // 箭头00：00：00 点整时，调用初始化方法
    this.listen_for_time();
  },
  mounted() {
    if (
      this.actId == 2 &&
      this.isDuringDate(this.inStartTime, this.inEndTime) != 1
    ) {
      // 如果是 成长任务才调用 用户每周每月的统计 接口
      this.get_task_every_week();
    }
  },
  methods: {
    changeCurrnet(val){
      this.result_page_info.current = val
      this.show_dialog(val)
    },
    showReceiveHistoryList(){},
    goToHistoryPage(e){
      if(e){
        if(!e.target.value){
          this.page_temp = e.target.value;
          return;
        }
        if(e.target.value=='0'){
          this.page_temp = '';
          return;
        }
        let val = Math.min(+e.target.value, this.pagenationMax)
        if(val>this.pagenationMax){
          val = this.pagenationMax;
        }
        this.page_temp = val;
        this.result_page_info.current = val
        this.show_dialog(val)
      }
    },
    goToPage(){},
    set_user(args) {
      return UserCtr.set_user_info(args);
    },
    // 数据页变化
    data_page_changed($event) {
      this.show_dialog($event);
    },
    // 调用领取记录接口
    async show_dialog(current, page) {
      if(page){
        this.result_page_info.current = 1;
        this.page_temp = '';
      }
      try {
        // 跟产品沟通接口有限频，前端不用做限制
        if (is_time_limit.call(this, null)) return; //  防止调用多次接口
        let parameter = { current, size: 7, actId: this.actId };
        let res = await api_activity.get_activity_receive_record(parameter);
        const { code, data, message } = res
        if (code == 200 && data.records.length > 0) {
          data.records.forEach((item, index) => {
            if (item.taskName.includes("\n")) {
              item.taskName = item.taskName.replace(/\n/g, "<br/>")
            }
            if(item.receiveTime){
              item.receiveTime = dayjs(+item.receiveTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          this.history_records = data.records;
          this.result_page_info.total = +data.total
          this.history_alert = true;
          if(!this.result_page_info.current){
            this.result_page_info.current = 1;
          }
          
        } else if (["0410505"].includes(code)) {
          // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
          this.$emit("to_maintenance");
          return;
        } else if (["0401038"].includes(code)) {
          // const msg_nodata_22 = i18n_t("msg.msg_nodata_22");
          const msg_nodata_22 = i18n_t("msg.msg_nodata_22");
          this.$toast(typeof msg_nodata_22 === 'string' ? msg_nodata_22 : message, 1500);
        } else {
          this.$toast("暂无历史记录数据", 1500);
        }
      } catch (err) {
        console.error(err);
      }
    },
    // 箭头00：00：00 点整时，调用初始化方法
    listen_for_time() {
      this.up_date_Info = setInterval(
        () => {
          this.get_daily_task_list("listen_timer");
        },
        this.actId == 1 ? 5 * 60 * 1000 : 60 * 60 * 1000
      );
    },
    /**
     * 1.日任务重置的0点开始，   00：00~00：05          期间为任务的重置时间，玩家不能够领取奖券，此时前端显示为任务状态为未领取状态；
     * 2.周任务、月任务重置的每一自然周,  00：00~00：05   期间为任务的重置时间，玩家不能够领取奖券，此时前端显示为任务状态为未领取状态；
     * 3.自然月的最后一天的0点开始，  00：00~00：05       期间为任务的重置时间，玩家不能够领取奖券，此时前端显示为任务状态为未领取状态
     * */
    day_week_month_time_limit() {
      // 如果是每日任务，则在凌晨 00:05 以内就开启一个倒计时，到5分钟的时候就拉取一次列表接口并清除倒计时
      if (this.actId == 1) {
        this.get_daily_task_list("listen_timer", "day_limit");
      } else if (this.actId == 2 && new Date().getDay() == 1) {
        this.get_daily_task_list("listen_timer", "week_limit");
      } else if (this.actId == 2 && (new Date().getDate() == 1) == 1) {
        this.get_daily_task_list("listen_timer", "month_limit");
      }
    },
    // 活动列表接口
    async get_daily_task_list(listen_timer, day_week_month_time_limit) {
      try {
        listen_timer ? "" : (this.get_data_loading = true);
        const param = {
          actId: this.actId,
        };
        let { code, data } = await api_activity.get_activity_list_details(param, { type: 1 });
        if (code == 200 && data.length > 0) {
          if (
            this.isDuringDate(this.inStartTime, this.inEndTime) == 1 ||
            day_week_month_time_limit
          ) {
            data.forEach((v, i) => {
              v.bonusType = 2;
            });
          }
          data.forEach( (item, index)=> {
            // 把列表任务事项有1/2/3点的断行展示
              if (item.taskName.includes("\n")) {
                item.taskName = item.taskName.replace(/\n/g, "<br/>")
              }
            })
          this.get_everyDay_list = data;
        } else {
          this.get_everyDay_list = [];
          this.has_data = false;
          if (["0401038"].includes(code)) {
            const msg_nodata_22 = i18n_t("msg.msg_nodata_22");
            this.$toast(msg_nodata_22, 1500);
          }
        }
        listen_timer ? "" : (this.get_data_loading = false);
      } catch (error) {
        console.error(error);
        listen_timer ? "" : (this.get_data_loading = false);
      }
    },
    // 单个领取 或者 一键领取
    async task_receive_btn(ids) {
      if (this.isDuringDate(this.inStartTime, this.inEndTime) == 3)
        return this.$toast("任务已结束", 1500);
      // 每次调用保存一下数据，用于领取失败时再次开箱
      this.getLotteryAgain = {...ids};
      try {
        const parameter = {
          ids,
          ty: this.actId == 1 ? 0 : 1,
          rdm: new Date().getTime(),
        };
        let res = await api_activity.get_tokyo_receive_lottery(
          parameter
        );
        let { code, data } = res
        let msg = res.msg || res.message
        if (code == 200 && Object.keys(data).length > 0) {
          Object.assign(this.pop_parameter, data);
          this.timer1_ = setTimeout(() => {
            this.get_daily_task_list();
          }, 800);
        } else if (["0410501", "0401003"].includes(code)) {
          this.$toast(msg, 3000);
          this.get_daily_task_list();
          return;
        } else if (["0410505"].includes(code)) {
          // 活动突然挂维护时，触发下边方法，刷新活动页面，变成活动维护页面
          this.$emit("to_maintenance");
          return;
        } else {
          this.$toast(msg, 3000);
          this.get_daily_task_list();
          return;
        }
        this.daily_task_success = true;
      } catch (e) {
        console.error(e);
      }
    },
    // 一键领取
    all_receive() {
      let id_list = [];
      this.get_everyDay_list.forEach((item) => {
        if (item.bonusType == 3) id_list.push(item.bonusId);
      });
      if (id_list.length <= 0) {
        this.$toast("没有可领取的奖项", 1500);
        return;
      }
      this.task_receive_btn(id_list.join(","));
    },
    // 前往抽奖
    go_to_draw() {
      this.$emit("to_lucky");
    },
    // '前往抽奖': '重新领取'
    Reclaim() {
      // 前往抽奖
      if (this.pop_parameter.ticket >= 0) {
        // this.go_to_draw()
        // 前往领取改为 "我知道了" 并且关闭弹窗
        this.daily_task_success = false;
      }
      this.daily_task_success = false;
    },
    // 用户每周每月的统计
    async get_task_every_week() {
      let { code, data } = await api_activity.get_activity_user_betting_info();
      if (code == 200 && Object.keys(data).length > 0) {
        this.cumulative_betting_list.forEach((item, i) => {
          if (i == 0) {
            item.mBet = data.mBetDays;
          } else if (i == 1) {
            item.mBet = data.wBillAmount && data.wBillAmount.toFixed(2);
          } else {
            item.mBet = data.mBillAmount && data.mBillAmount.toFixed(2);
          }
        });
      }
    },
  },

  unmounted() {
    clearInterval(this.up_date_Info);
    clearTimeout(this.timer1_);
  },
};
 


