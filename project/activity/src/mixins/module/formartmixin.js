/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 时间格式化处理
 */
import utils from 'project/activity/src/utils/utils.js';

export default {
  methods: {
    format_date_base(value) {
      let time = new Date(parseInt(value));
      let y = time.getFullYear();
      let m = (time.getMonth() + 1 + "").padStart(2, 0);
      let d = (time.getDate() + "").padStart(2, 0);
      let h = (time.getHours() + "").padStart(2, 0);
      let mm = (time.getMinutes() + "").padStart(2, 0);
      let s = (time.getSeconds() + "").padStart(2, 0);
      return [y, m, d, h, mm, s]
    },
    // 判断是 今天 或者 明天，还是距离多少天，后面扩展
    format_how_many_days(val) {
      let date_begin_time = new Date(new Date(val).Format("yyyy-MM-dd")).getTime()
      let date_end_time  = new Date().getTime()
      let dateDiff_time = date_end_time - date_begin_time;//时间差的毫秒数
      let difValue_time = Math.floor(dateDiff_time / (24 * 3600 * 1000));
      let day_value;
      if(difValue_time == 0){
        day_value = this.$root.$t('today')
      }else if(difValue_time == '-1'){
        day_value = this.$root.$t('tomorrow')
      }
      return day_value
    },
    format_week(value, replace_) {
      // let arr = ["日", "一", "二", "三", "四", "五", "六"];
      let i = new Date(value).getDay();
      // return "周" + a[i];
      let replace_name = this.$root.$t('time.time_date_week')[i]
      if(replace_){
        replace_name = replace_name.replace('星期', '周')
      }
      return replace_name
    },
    format_time_zone(time,offset=8){
      return utils.format_time_zone(time,offset);
    },
    format_time_zone_time(time,offset=8){
      return utils.format_time_zone_time(time,offset);
    },
  },


}
