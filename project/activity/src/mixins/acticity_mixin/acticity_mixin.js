/*
 * @Author: ledron
 * @Date: 2021-08-27 14:35:35
 * @Description: 活动公用方法
 */
import _ from "lodash"
import {
  UserCtr,
  LOCAL_COMMON_FILE_PREFIX,
  LOCAL_PROJECT_FILE_PREFIX,
} from "project_path/src/core/index.js";

export default {
  data() {
    return {
      _,
      count_down: "",
      LOCAL_COMMON_FILE_PREFIX,
      LOCAL_PROJECT_FILE_PREFIX,
    };
  },
 
  computed: {
    get_user() {
      return UserCtr.get_user();
    },
    get_theme() {
      return UserCtr.theme || "";
    },
  },
  methods: {


    // 比较当前时间是否在指定时间段内 1 未开始  2 进行中   3 已结束
    isDuringDate(
      beginDateStr = "2021/01/01 00:00:00",
      endDateStr = "2021/12/31 23:59:59"
    ) {
      let curDate = new Date(),
        beginDate = new Date(beginDateStr),
        endDate = new Date(endDateStr);
      if (curDate <= beginDate) {
        return 1;
      } else if (
        (curDate >= beginDate && curDate <= endDate) ||
        (beginDateStr == 0, endDateStr == 0)
      ) {
        return 2;
      } else if (curDate >= endDate) {
        return 3;
      }
    },
    // 获取当前时间 参数
    format_date_base(value) {
      let time = new Date(parseInt(value));
      let y = time.getFullYear();
      let m = (time.getMonth() + 1 + "").padStart(2, 0);
      let d = (time.getDate() + "").padStart(2, 0);
      let h = (time.getHours() + "").padStart(2, 0);
      let mm = (time.getMinutes() + "").padStart(2, 0);
      let s = (time.getSeconds() + "").padStart(2, 0);
      return [y, m, d, h, mm, s];
    },
    HTML_MESSAGE(msg){
      return `
        <div style="text-align:center;">
          <img src="${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/common/warn.svg"/>
          <p>${msg}</p>
        </div>
      `
    },
    $toast(msg, dur) {
      this.$q.notify({
        position: 'center',
        message: this.HTML_MESSAGE(msg),
        timeout: dur,
        html:true
      })
    },
    
  },
};
