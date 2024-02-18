/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 时间格式化处理
 */

import  { format as  licia_format } from "licia"
 
export default {
  methods: {
      /**
   * @description: 获取指定时区的Date对象(默认使用东八区)
   * @param {int} time 时间毫秒数
   * @param {int} offset 时区, 默认东八区
   * @return {Date} 转换后的时区Date对象
   */
  format_time_zone(time,offset=8){
    var d=new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
    var localTime = d.getTime();//获取的是毫秒级
    var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
    var utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
    var wishTime= utc + (3600000*offset);
    return new Date(wishTime);
  },
  /**
   * @description: 获取指定时区的时间戳(默认使用东八区)
   * @param {int} time 时间毫秒数
   * @param {int} offset 时区, 默认东八区
   * @return {int} 转换后的时区的时间戳
   */
  format_time_zone_time(time,offset=8){
    var d=new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
    var localTime = d.getTime();//获取的是毫秒级
    var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
    var utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
    var wishTime= utc + (3600000*offset);
    return wishTime;
  },
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
        day_value = i18n_t('today')
      }else if(difValue_time == '-1'){
        day_value = i18n_t('tomorrow')
      }
      return day_value
    },
    format_week(value, replace_) {
      // let arr = ["日", "一", "二", "三", "四", "五", "六"];
      let i = new Date(value).getDay();
      // return "周" + a[i];
      let replace_name = i18n_t('time.time_date_week')[i]
      if(replace_){
        replace_name = replace_name.replace('星期', '周')
      }
      return replace_name
    },
    format_time_zone(time,offset=8){
      return this.format_time_zone(time,offset);
    },
    format_time_zone_time(time,offset=8){
      return this.format_time_zone_time(time,offset);
    },

    /**
   * @description: 格式化时间
   * @param {Number} timestamp 时间戳
   * @param {String} fmt 自定义格式("mm月DD日 HH时MM")
   * @return {String} 格式好的时间
   */
    formatTime(timestamp, fmt) {
      try {
          // const date = new Date(parseInt(timestamp))
      const date = new Date(this.format_time_zone_millisecond(parseInt(timestamp)))
      let ret;
      let opt = {
        "Y+": fmt.lastIndexOf("Y") - fmt.indexOf("Y") == 3 ? date.getFullYear().toString() : date.getFullYear().toString().substr(2, 2),        // 年
        "y+": fmt.lastIndexOf("y") - fmt.indexOf("y") == 3 ? date.getFullYear().toString() : date.getFullYear().toString().substr(2, 2),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "D+": date.getDate().toString(),            // 日
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "h+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString(),          // 秒
        "s+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };

      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
      };
      return fmt;
        
      } catch (error) {
        
      }
    },
    mx_get_remote_time() {
      let { local_time, remote_time } = this.vx_get_timestamp;
      let now = new Date().getTime()
      let time = remote_time + (now - local_time);
      return time;
    },

    format_date_by_manage(value) {
      let time = new Date(parseInt(value));
      let y = time.getFullYear();
      // let m = (time.getMonth() + 1 + "").padStart(2, 0);
      let m = time.getMonth() + 1 + "";
      // let d = (time.getDate() + "").padStart(2, 0);
      let d = time.getDate() + ""
      let h = (time.getHours() + "").padStart(2, 0);
      let mm = (time.getMinutes() + "").padStart(2, 0);
      let s = (time.getSeconds() + "").padStart(2, 0);
      let arr = i18n_t('time.time_date_week');// ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let i = time.getDay();
      let weekday = arr[i];
      // return `${m}月${d}日 (${weekday})`;
      return licia_format(i18n_t('time.time_date_2'), m, d, arr[i]);
    },
    format_day(value, separator = "/") {
      if (!value) { return '' }
      let [y, m, d, h, mm, s] = this.format_date_base(value)
      return `${y}${separator}${m}${separator}${d}`
    },
    format_month(value, separator) {
      if (!value) { return '' }
      // utc转成gmt+8
      let time = parseInt(value) + 8 * 60 * 60 * 1000
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      separator = separator || '/'
      return `${m}${separator}${d} ${h}:${mm}:${s}`
    },
    format_date(value) {
      if (!value) { return '' }
      let [y, m, d, h, mm, s] = this.format_date_base(value)
      return `${y}-${m}-${d} ${h}:${mm}:${s}`;
    },
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

    format_date_base_obj(value) {
      let time = new Date(parseInt(value));
      let y = time.getFullYear();
      let m = (time.getMonth() + 1 + "").padStart(2, 0);
      let d = (time.getDate() + "").padStart(2, 0);
      let h = (time.getHours() + "").padStart(2, 0);
      let mm = (time.getMinutes() + "").padStart(2, 0);
      let s = (time.getSeconds() + "").padStart(2, 0);
      let w = time.getDay();
      return { y, m, d, h, mm, s, w };
    },

    format_date_today_base(value) {
      let time = new Date(parseInt(value));
      let y = time.getFullYear();
      let m = (time.getMonth() + 1 + "").padStart(2, 0);
      let d = (time.getDate() + "").padStart(2, 0);
      let h = (time.getHours() + "").padStart(2, 0);
      let mm = (time.getMinutes() + "").padStart(2, 0);
      let s = (time.getSeconds() + "").padStart(2, 0);
      return `${m}/${d} ${h}:${mm}`;
    },
    format_week(value) {
      // let arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let i = new Date(parseInt(value)).getDay();
      // return a[i];
      return i18n_t('time.time_date_week')[i];
    },
    /**
     * @Description 时间戳转星期 
     * @param {number} value 时间戳
     * @param {string}
    */
    format_week2(value) {
      let i = new Date(parseInt(value)).getDay();
      return i18n_t('time.time_date_week_3')[i];
    },
    utc_to_gmt_8(value) {
      if (!value) { return '' }
      let time = parseInt(value) + 8 * 60 * 60 * 1000
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return `${m}/${d} ${h}:${mm}`;

    },
    utc_to_gmt_8_hm(value) {
      if (!value) { return '' }
      let time = parseInt(value) + 8 * 60 * 60 * 1000
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return `${h}:${mm}`;

    },
    utc_to_gmt_8_ms(value) {
      if (!value) { return '' }
      let time = parseInt(value) + 8 * 60 * 60 * 1000
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return `${mm}'${s}'`;
    },
    utc_to_gmt_no_8(value) {
      if (!value) { return '' }
      let time = parseInt(value);
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return `${m}/${d} ${h}:${mm}`;
    },
    utc_to_gmt_no_8_ms2(value) {
      if (!value) { return '' }
      let time = this.format_time_zone_millisecond(parseInt(value));
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return `${h}:${mm}:${s}`;
    },
    utc_to_gmt_8_ms2(value) {

      if (!value) { return '' }
      let time = parseInt(value) * 1000 + 8 * 60 * 60 * 1000
      let [y, m, d, h, mm, s] = this.format_date_base(time)
      return `${h}:${mm}:${s}`;
    },
    utc_to_label_show(value) {
      if (!value) { return '' }
      let str = ''
      let time = parseInt(value) + 8 * 60 * 60 * 1000
      let time_local = new Date().getTime();
      if (time > time_local) {
        let cha_m = Math.floor((time - time_local) / (60 * 1000))
        str = `${cha_m}` + i18n_t('match_info.after_start');//分钟后开始
      } else {
        str = i18n_t('match_info.match_playing');//`已开赛`
      }
      return str
    },
    gmt_to_label_show(value) {
      if (!value) { return '' }
      let str = ''
      let time = parseInt(value);
      let time_local = new Date().getTime();
      if (time > time_local) {
        let cha_m = Math.floor((time - time_local) / (60 * 1000))
        str = `${cha_m}` + i18n_t('match_info.after_start');//分钟后开始
      } else {
        str = i18n_t('match_info.match_playing');//`已开赛`
      }
      return str
    },

    to_gmt_ms(tmp) {
      let mm = parseInt(tmp / 60);
      let s = tmp % 60;
      if (mm < 10) {
        mm = "0" + mm;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return `${mm}'${s}'`;
    },
    /**
    * 将秒格式化为：分：秒
    * @param  {number} second  秒
    * @params {string} model 分隔符类型
    * @return {string} 分：秒
    */
    format_second_ms(second, model = "default") {

      if (second) {
        // let h = (Math.floor(second / 3600).toString()).padStart(2, 0);
        let m = (parseInt((second / 60)).toString()).padStart(2, 0);
        let s = (parseInt((second % 60)).toString()).padStart(2, 0);

        let date = model == 'default' ? `${m}:${s}` : `${m}'${s}"`;
        if(model == 'minute'){
          date =  parseInt(m)+"'";
        }
        //date = h > 0 ? (date = h + ":" + date) : date
        return date
      }
    }









  },


}
