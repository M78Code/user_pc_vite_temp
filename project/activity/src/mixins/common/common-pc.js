/*
 * @Date: 2021-10-10 13:46:19
 * @FilePath: /user-pc1/project/activity/src/pages/yazhou-pc/common.js
 * @Description: 公共方法
 * @Author: Echo
 */
import time_format_mixin from "project/activity/src/mixins/common/formartmixin.js";
//头部引入  
import { useMittOn, useMittEmit, useMittEmitterGenerator,MITT_TYPES  } from "src/core/index.js";
export default {
  data() {
    return {
      countTimer1: null,
      countTimer2: null,
      // countGetList: 0, // 计算当前请求了几次任务列表接口
    }
  },
  mixins: [time_format_mixin],
  unmounted(){
    clearTimeout(this.countTimer1)
    clearTimeout(this.countTimer2)
  },
 
  methods: {
    /**
     * @description: 
     * @param {*} endtime 目标日期时间戳
     * @param {*} type 区分调用对象
     * @return {*}
     */    
    countdown(endtime, type = null) {
      if (this.activityObj.period != 1) {
        clearTimeout(this.countTimer1);
      }
      // 目标日期时间戳
      let end = endtime;
      // 服务器时间戳
      let stime = this.mx_get_remote_time();
      // 当前时间戳
      const now = stime;
      // 相差的毫秒数
      const msec = end - now;
      // 计算时分秒数
      let day = parseInt(msec / 1000 / 60 / 60 / 24);
      let hr = parseInt((msec / 1000 / 60 / 60) % 24);
      let min = parseInt((msec / 1000 / 60) % 60);
      let sec = parseInt((msec / 1000) % 60);
      // 个位数前补零
      hr = hr > 9 ? hr : "0" + hr;
      min = min > 9 ? min : "0" + min;
      sec = sec > 9 ? sec : "0" + sec;
      if (type == 'rank') {
        this.nextOpenTime.h = hr;
        this.nextOpenTime.m = min;
        this.nextOpenTime.s = sec;
      } else if (type == 'toEnd') {
        if (hr == '00' && min == '00' && sec == '00') {
          this.activityTime = '活动已结束';
        } else {
          this.activityTime = {hr, min, sec};
        }
      } else if (type == 'toStart') {
        if (hr == '00' && min == '00' && sec == '00') {
          this.activityTime = '活动长期有效';
        } else {
          this.activityTime = {day, hr, min, sec};
        }
      } else {
        this.day = day;
        this.hr = hr;
        this.min = min;
        this.sec = sec;
      }
      if (hr == '00' && min == '00' && sec == '00') {
        useMittEmit("upd_user_data");
        useMittEmit('update_activity_period');
        clearTimeout(this.countTimer1);
        clearTimeout(this.countTimer2);
        this.countTimer2 = setTimeout(() => {
          this.init(1);
        }, 500);
        return;
      }
      // 一秒后递归
      this.countTimer1 = setTimeout(() => {
        this.countdown(endtime, type);
      }, 1000);
    },
  }
}
