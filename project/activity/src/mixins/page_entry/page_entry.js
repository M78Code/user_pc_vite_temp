
let over = "/activity/yazhou-h5/activity/over.png";
let stay_tuned = "/activity/yazhou-h5/activity/stay_tuned.png";
let playing = "/activity/yazhou-h5/activity/playing.png";


import acticity_mixin from "project/activity/src/mixins/acticity_mixin/acticity_mixin.js";
import { UserCtr } from "project_path/src/core/index.js";



const img_config={
  "com-img-bg-131":"/activity/yazhou-h5/activity/maintain_main/maintain_bg.jpg",
  "com-img-bg-148": "/activity/yazhou-h5/activity/activity-header_slot.png"
}
import { useMittOn, useMittEmit, MITT_TYPES } from "project_path/src/core/index.js";

import { ref } from "vue";
import { GATAG, ZHUGE } from "project_path/src/core/index.js";
export default {
  name: "activity_task",
  mixins: [acticity_mixin],

  data() {
    return {
      // 活动tab选项卡
      tab_list:  [] ,
      // 当前的活动id
      tab_Id: "10007",
      // 当前的活动选择下标
      activity_index: 0,
      // 当前活动开始时间
      inStartTime: 0,
      // 当前活动结束时间
      inEndTime: 0,
      // 幸运盲盒位置
      lucky_blind_box_index: -1,
      // 是否ipx
      isIphoneX: false,
      // 是否是原生APP 的banner点击过来
      isAPP: false,
      // 是否是维护阶段
      is_maintaining: false,
      the_first_time_show: false,
    };
  },
  watch: {
    the_first_time_show(val){
      if(val){
        useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,1)
      }
    },
    // 监听 get_user 的数据变化
    get_user: {
      handler(n, o) {
        // period1 未开始2 进行中3 已结束
        if (n && n.activityList) {
          this.tab_list = _.cloneDeep(n.activityList);
          this.tab_list.forEach((item) => this.activity_status_picture(item));
        }
        this.$forceUpdate();
      },
      deep: true,
    },
  },
  computed: {
    // 活动维护公告，换行方法
    style_special_treatment() {
      let maintenance_string;
      maintenance_string =
        this.get_user &&
        this.get_user.maintainingContent &&
        this.get_user.maintainingContent.replace(new RegExp("/", "gm"), "\n");
      return maintenance_string;
    },
    get_user() {
      return UserCtr.get_user();
    },
    get_user_token() {
      return UserCtr.get_user_token();
    },
    activityList() {},
  },
  created() {
    // loading页面最长20秒
    this.timer_ = setTimeout(() => {
      this.hide_loading(0);
    }, 20000);
    // 定时器
    this.first_timer1 = 0;
    this.first_timer2 = 0;
    this.timer2_ = 0;
    // 初始化tab 选项卡

    let act = this.tab_Id;
    // 获取设置支持的参数activity
    let activity = SEARCH_PARAMS.init_param.get('activity');
    if(activity){
      try {
        // 初始化tab 选项卡
        let act_0 = activity.split(',')[0]
        if (['10007', '10008', '10009'].includes(act_0)) {
          act = act_0;
        }
      } catch (error) {
        console.error(error);
      }
    }
    // 获取设置支持的参数isAPP
    //isAPP为true时,活动中心返回按钮就隐藏 不传isAPP或者为false时就正常显示
    if (SEARCH_PARAMS.init_param.get("isAPP") == 'true') {
      this.isAPP = true;
    }

    this.is_maintaining = this.get_user.maintaining;
    // 方便调试, 先放出来正常的活动页面吧
    this.is_maintaining = false;
    if (act) {
      // 返回到场馆的 历史记录
      if (!location.search.includes("keep_url")) {
        history.replaceState(null, "", `${location.pathname}${location.hash}`);
      }
      this.first_timer1 = setTimeout(async () => {
        // 检测近3s内是否更新过用户数据
        if (new Date().getTime() - _.get(this.get_user, "upd_time", 0) < 3000) {
          // 配置埋点信息
          GATAG.gtag_config_send(UserCtr.get_uid());
          this.initialization_menu(
            UserCtr.get_user_info_data().activityList,
            act
          );
        } else {
          // 配置埋点信息
          GATAG.gtag_config_send(UserCtr.get_uid());
          this.initialization_menu(
            UserCtr.get_user_info_data().activityList,
            act
          );
        }
      }, 200);
    } else {
      this.initialization_menu(UserCtr.get_user_info_data().activityList);
    }
    this.mitt_list = [];
    this.mitt_list.push(useMittOn(MITT_TYPES.EMIT_LOADING_CTR_CMD, this.hide_loading).off)
  },
  methods: {
    // 隐藏loading
    hide_loading(data){
      if(data){
        document.getElementById("loading-root-ele").classList.add('transparent-bg');
      } else {
        document.getElementById("loading-root-ele").style.visibility = "hidden";
      }
    },
    go_where() {
      window.history.back();
    },
    set_user(args) {
      return UserCtr.set_user_info(args);
    },
    get_file_path: () => "",
    // 去到维护页面
    to_maintenance() {
      this.$toast("活动现已维护，感谢您的支持", 2000);
      clearTimeout(this.timer2_);
      this.timer2_ = setTimeout(() => {
        this.is_maintaining = true;
      }, 2000);
    },
    // 初始化tab 选项卡
    initialization_menu(activityList = [], act_copy) {
      // console.log("activityList----------", activityList);
      this.tab_list = _.cloneDeep(activityList || []);
      this.tab_list.forEach((item, i) => {
        // 商户跳转过来时,有带 act参数，调用方法
        if (act_copy == item.activityId) {
          // console.log("有带 act参数，调用方法");
          this.tab_Id = act_copy;
          this.tab_click(
            _.cloneDeep(activityList)[i],
            this.tab_Id,
            i,
            "",
            "is_first_time"
          );
        } else if (i == 0) {
          // 默认调用第一个
          // console.log("默认调用第一个");
          this.tab_Id = item.activityId;
          this.tab_click(
            _.cloneDeep(activityList)[0],
            this.tab_Id,
            0,
            "",
            "is_first_time"
          );
        }
        // 盲盒活动的下标
        if (item.activityId == "10009") this.lucky_blind_box_index = i;
        this.activity_status_picture(item);
      });
      // 成功进入活动页
      GATAG.gtag_view_send("H5_activity", "/activity_task");
    },
    // 活动时间状态图片 period 或者 this.isDuringDate(time1,time2)： 1 未开始  2 进行中   3 已结束
    activity_status_picture(item) {
      if (item.period == 1) {
        item.state_url = `${this.LOCAL_COMMON_FILE_PREFIX}${stay_tuned}` ;
      } else if (item.period == 2) {
        item.state_url = `${this.LOCAL_COMMON_FILE_PREFIX}${playing}` ;
      } else if (item.period == 3) {
        item.state_url = `${this.LOCAL_COMMON_FILE_PREFIX}${over}` ;
      }
    },
    // tab 选项卡切换
    async tab_click(item, activityId, index, is_click, is_first_time) {

      let isCurrentTab = this.tab_Id == activityId;

      this.tab_Id = activityId;
      this.activity_index = index;
      this.inStartTime = +item.inStartTime;
      this.inEndTime = +item.inEndTime;
      // console.log( ' this.tab_Id-', this.tab_Id);
      if (UserCtr.get_user_token() && is_click != "not_need_click") {
        // 数据是否来源网络
        let user_data_from_net = true;

        try {
          let code, data;
          // 检测近3s内是否更新过用户数据
          if (
            new Date().getTime() -
              _.get(UserCtr.get_user_info_data(), "upd_time", 0) <
            3000
          ) {
            data = UserCtr.get_user_info_data();
            code = 200;
            // 设置数据来源非网络
            user_data_from_net = false;
          } else {
            await UserCtr.refresh_user_info();
            data = UserCtr.get_user_info_data();

            code = 200;
          }
          if (data != null && code == 200) {
            this.is_maintaining = data.maintaining;
            if (is_click == "maintain" && data.maintaining) {
              this.to_maintenance();
            }
            // 如果是第一次加载页面，则等接口加载完之后，显示页面
            if (is_first_time == "is_first_time") {
              this.the_first_time_show = true;
            } else {
              // 防止在点击当前页签时重复计算
              if (!isCurrentTab) {
                // 配置埋点信息
                GATAG.gtag_config_send(UserCtr.get_uid());
                let eventLabel = "";
                // 埋点采集任务中心tab点击
                if (activityId == "10007") {
                  GATAG.gtag_event_send(
                    "H5_edtask_click",
                    "H5_活动",
                    "H5_每日任务",
                    new Date().getTime()
                  );
                  eventLabel = "H5_每日任务页签";
                } else if (activityId == "10008") {
                  GATAG.gtag_event_send(
                    "H5_grtask_click",
                    "H5_活动",
                    "H5_成长任务",
                    new Date().getTime()
                  );
                  eventLabel = "H5_成长任务页签";
                } else if (activityId == "10009") {
                  GATAG.gtag_event_send(
                    "H5_luckybox_click",
                    "H5_活动",
                    "H5_幸运盲盒",
                    new Date().getTime()
                  );
                  eventLabel = "H5_幸运盲盒页签";
                }
                if (eventLabel) {
                  ZHUGE.send_zhuge_event(
                    eventLabel,
                    UserCtr.get_user_info_data()
                  );
                }
              }
            }
            // 同步最新用户数据
            user_data_from_net && this.set_user(data);
          } else {
            // 显示页面
            this.the_first_time_show = true;
          }
        } catch (e) {
          console.error(e);
          this.the_first_time_show = true;
        }
      }
    },
    // 跳转到 幸运盲盒
    to_lucky() {
      window.scrollTo(0, 0);
      if (window.vue && window.vue.scroll_list_wrapper_by) {
        window.vue.scroll_list_wrapper_by(0);
      }
      if (this.lucky_blind_box_index >= 0) {
        this.tab_click(
          _.cloneDeep(UserCtr.get_user_info_data().activityList)[
            this.lucky_blind_box_index
          ],
          10009,
          this.lucky_blind_box_index,
          "maintain"
        );
      }
      this.$nextTick(() => {
        document.querySelector(".scroll-to-view").scrollIntoView();
      });
    },
    // 倒计时结束 刷新当面页面
    index_refresh_end_handle() {
      clearTimeout(this.first_timer2);
      this.first_timer2 = setTimeout(async () => {
        let { data, code } = await UserCtr.refresh_user_info();
        if (data != null && code == 200) {
          this.tab_click(
            _.cloneDeep(data.activityList)[this.activity_index],
            _.cloneDeep(data.activityList)[this.activity_index].activityId,
            this.activity_index,
            "not_need_click"
          );
          this.set_user(data);
          // 配置埋点信息
          GATAG.gtag_config_send(UserCtr.get_uid());
        }
      }, 800);
    },
  },
  unmounted() {
    if (this.first_timer1) {
      clearTimeout(this.first_timer1);
      this.first_timer1 = null;
    }

    if (this.first_timer2) {
      clearTimeout(this.first_timer2);
      this.first_timer2 = null;
    }

    clearTimeout(this.timer2_);
    this.timer2_ = null;

    // this.$root.$off(MITT_TYPES.EMIT_INDEX_REFRESH_END, this.index_refresh_end_handle);
    for (const key in this.$data) {
      this.$data[key] = null;
    }
    // this.$root.$off(MITT_TYPES.EMIT_TO_MAINTENANCE, this.to_maintenance)
    sessionStorage.removeItem("isAPP");
    // 销毁监听
    this.mitt_list.forEach(i=>i())
    clearTimeout(this.timer_);
  },
};

