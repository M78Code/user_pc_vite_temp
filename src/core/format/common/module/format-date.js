import { isDate } from "lodash";
// import i18n from "project/animation/src/i18n";
import { i18n_t,i18n } from "src/boot/i18n.js"
import ServerTime from "src/core/server-time/server-time.js"

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
const date_format_time = ()=>{
  Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    {
      if (new RegExp("(" + k + ")").test(fmt))
      {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }
}
// 设置对Date的扩展
date_format_time();


export const format_Y_M_D_H_M = function (payload) {
  if (!payload) return "";
  let time = new Date(parseInt(payload));
  let y = time.getFullYear() + "";
  let M = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let m = (time.getMinutes() + "").padStart(2, 0);
  return `${y}-${M}-${d} ${h}:${m}`;
};
export const formcht_Y_M_D_H_M = function (payload) {
  if (!payload) return "";
  let time = new Date(parseInt(payload));
  let y = time.getFullYear() + "";
  let M = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let m = (time.getMinutes() + "").padStart(2, 0);
  return `${y}年${M}月${d}日  ${h}:${m}`;
};
// 判断是 今天 或者 明天，还是距离多少天，后面扩展
export const format_how_many_days = (val) => {
  let date_begin_time = new Date(new Date(val).Format("yyyy-MM-dd")).getTime()
  let date_end_time = new Date().getTime()
  let dateDiff_time = date_end_time - date_begin_time;//时间差的毫秒数
  let difValue_time = Math.floor(dateDiff_time / (24 * 3600 * 1000));
  let day_value;
  if (difValue_time == 0) {
    day_value = i18n_t('today')
  } else if (difValue_time == '-1') {
    day_value = i18n_t('tomorrow')
  }
  return day_value
}
// 示例： 1 月 2 日
/**
 * 日期格式化
 * @param {String} val 时间戳
 * @return {String}
 */
export const format_M_D = function (payload, that) {
  // TODO:payload 如果非时间戳无法正常转换
  if (!payload) return "";
  let time = new Date(parseInt(payload));
  let m = time.getMonth();
  let d = time.getDate() + "";
  // TODO: time.monthes  国际化不是字符串无法读取[] ----> "[]"
  let monthes = JSON.parse(i18n_t("time.monthes"));
  let format = i18n_t("time.time_date_1");
  format = format.replace("%date", d);
  format = format.replace("%month", monthes[m]);
  return format;
};

// 示例： 1 月 2 日
/**
 * 日期格式化
 * @param {String} val 时间戳
 * @return {String}
 */
export const format_M_D_PC = function (payload, that) {
  // TODO:payload 如果非时间戳无法正常转换
  if (!payload) return "";
  let time = new Date(parseInt(payload));
  let m = time.getMonth();
  let d = time.getDate() + "";
  // TODO: time.monthes  国际化不是字符串无法读取[] ----> "[]"
  let monthes = i18n_t(`time.month_${m + 1}`);
  
  let day = i18n_t(`match_info.day`);
  let format = `${monthes} ${d}${day}`
  // let format = i18n_t("time.time_date_1");
  // format = format.replace("%date", d);
  // format = format.replace("%month", monthes);
  return format;
};


// 示例： 12 ：30
export const format_H_M = function (payload) {
  if (!payload) return "";
  let time = new Date(parseInt(payload));
  let h = (time.getHours() + "").padStart(2, 0);
  let m = (time.getMinutes() + "").padStart(2, 0);
  return `${h}:${m}`;
};
// 示例： 23:30
export const format_mgt_time = function (num) {
  class MatchTime {
    constructor(time) {
      this.time = time;
    }
    showTime() {
      let m = Math.floor(this.time / 60)
        .toString()
        .padStart(2, "0");
      let s = Math.floor((this.time % 60) / 1)
        .toString()
        .padStart(2, "0");
      return `${m}:${s}`;
    }
  }
  let time = new MatchTime(num).showTime();
  return time;
};
/**
 * 日期格式化
 * @param {String} val 时间戳
 * @return {String}
 */
export const formete_date = (val) => {
  val = Number(val);
  let difference = Date.now() - val,
    str = "";
  if (difference > 1000 * 60 * 60 * 24) {
    str = new Date(val).getMonth() + 1 + "月" + new Date(val).getDate() + "日";
  } else if (difference > 1000 * 60 * 60) {
    str = Math.ceil(difference / (1000 * 60 * 60)) + "小时前";
  } else {
    str = Math.ceil(difference / (1000 * 60)) + "分钟前";
  }
  return str;
};
// 示例： 5 15 23
export const format_min_time = function (num) {
  class MatchTime {
    constructor(time) {
      this.time = time;
    }
    showTime() {
      let m = Math.ceil(this.time / 60).toString();
      return `${m}`;
    }
  }
  let time = new MatchTime(num).showTime();
  return time;
};
/**
 * 将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
export function DateForMat(str, fmt = "yyyy-MM-dd") {
  const _date = isDate(str) ? str : new Date(str);
  if (!isDate(_date)) return undefined;
  let o = {
    "M+": _date.getMonth() + 1, // 月份
    "d+": _date.getDate(), // 日
    "h+": _date.getHours(), // 小时
    "m+": _date.getMinutes(), // 分
    "s+": _date.getSeconds(), // 秒
    "q+": Math.floor((_date.getMonth() + 3) / 3), // 季度
    S: _date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (_date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}
/**
 * @description: 获取指定时区的Date对象(默认使用东八区)
 * @param {int} time 时间毫秒数
 * @param {int} offset 时区, 默认东八区
 * @return {Date} 转换后的时区Date对象
 */
export const format_time_zone = (time, offset = 8) => {
  let d = new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
  let localTime = d.getTime(); //获取的是毫秒级
  let localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
  let utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
  let wishTime = utc + 3600000 * offset;
  return new Date(wishTime);
};
/**
 * @description: 获取指定时区的时间缀(默认使用东八区)
 * @param {int} time 时间毫秒数
 * @param {int} offset 时区, 默认东八区
 * @return {Date} 转换后的时区时间缀
 */
export const format_time_zone_millisecond = (time, offset = 8) => {
  let d = new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
  let localTime = d.getTime(); //获取的是毫秒级
  let localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
  let utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
  let wishTime = utc + 3600000 * offset;
  return wishTime;
};
/**
 * @Description 获取格式化时间对象
 * @param {undefined} undefined
 */
export const format_date_base_obj = (value) => {
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  let w = time.getDay();
  return { y, m, d, h, mm, s, w };
};
/**
 * @description: 获取指定时区的时间戳(默认使用东八区)
 * @param {int} time 时间毫秒数
 * @param {int} offset 时区, 默认东八区
 * @return {int} 转换后的时区的时间戳
 */
export const format_time_zone_time = (time, offset = 8) => {
  let d = new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
  let localTime = d.getTime(); //获取的是毫秒级
  let localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
  let utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
  let wishTime = utc + 3600000 * offset;
  return wishTime;
};
/**
 * 红猫赛事显示倒计时优化
 * @param  match 赛事信息
 * @param  counting_time 显示时间
 *
 */
export const counting_time_ctr_show_format = (match, counting_time) => {
  // counting_time 格式00:00
  let counting_time_ = counting_time;
  // 红猫赛事只显示分钟不显示秒
  if (
    lodash.get(match, "cds") == "RC" &&
    lodash.get(match, "csid") == 1 &&
    counting_time
  ) {
    counting_time_ = lodash.get(counting_time_.split(":"), "[0]");
  }
  return counting_time_;
};


 
 
   /**
     * @description 赛事显示倒计时优化显示
     * @param match 赛事信息
     * @param counting_time 需要显示的时间
     * @return undefined
     */
   export function   counting_time_ctr_show_format_hm(match,counting_time) {
    let counting_time_ = counting_time;
    // 红猫赛事只显示分钟不显示秒
    if(lodash.get(match,'cds')=='1500' && lodash.get(match,'csid')==1 && counting_time){
      counting_time_ = lodash.get(counting_time_.split(':'),'[0]');
    } else if(lodash.get(match,'ctt')==1 && [1,2].includes(lodash.get(match,'csid')*1) && counting_time){
      counting_time_ = lodash.get(counting_time_.split(':'),'[0]');
    }
    return counting_time_;
  }
    /**
     * @description 赛事显示倒计时优化显示
     * @param match 赛事信息
     * @param counting_time 需要显示的时间
     * @return undefined
     */
    export function   counting_time_ctr_show_format_ouzhou(match,counting_time) {
      // counting_time 格式00:00
      let counting_time_ = counting_time;
      // C01赛事只显示分钟不显示秒
      if(lodash.get(match,'cds')=='C01' && lodash.get(match,'csid')==1 && counting_time){
        counting_time_ = lodash.get(counting_time_.split(':'),'[0]');
      } else if(lodash.get(match,'ctt')==1 && [1,2].includes(lodash.get(match,'csid')*1) && counting_time){
        counting_time_ = lodash.get(counting_time_.split(':'),'[0]');
      }
      return counting_time_;
    }





export const format_date_base = (value) => {
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  return [y, m, d, h, mm, s];
};
/**
 * @description: 格式化时间
 * @param {Number} timestamp 时间戳
 * @param {String} fmt 自定义格式("mm月DD日 HH时MM")
 * @return {String} 格式好的时间
 */
export const formatTime = (timestamp, fmt) => {

  try {
    // const date = new Date(parseInt(timestamp))
    const date = new Date(
      format_time_zone_millisecond(parseInt(timestamp))
    );
    let ret;
    let opt = {
      "Y+":
        fmt.lastIndexOf("Y") - fmt.indexOf("Y") == 3
          ? date.getFullYear().toString()
          : date.getFullYear().toString().substr(2, 2), // 年
      "y+":
        fmt.lastIndexOf("y") - fmt.indexOf("y") == 3
          ? date.getFullYear().toString()
          : date.getFullYear().toString().substr(2, 2), // 年
      "m+": (date.getMonth() + 1).toString(), // 月
      "D+": date.getDate().toString(), // 日
      "d+": date.getDate().toString(), // 日
      "H+": date.getHours().toString(), // 时
      "h+": date.getHours().toString(), // 时
      "M+": date.getMinutes().toString(), // 分
      "S+": date.getSeconds().toString(), // 秒
      "s+": date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
    return fmt;
  } catch (error) { }
};

export const format_date_by_manage = (value) => {
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  // let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let m = time.getMonth() + 1 + "";
  // let d = (time.getDate() + "").padStart(2, 0);
  let d = time.getDate() + "";
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  let arr = i18n_t("time.time_date_week"); // ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  let i = time.getDay();
  let weekday = arr[i];
  // return `${m}月${d}日 (${weekday})`;
  return licia_format(i18n_t("time.time_date_2"), m, d, arr[i]);
};
export const format_day = (value, separator = "/") => {
  if (!value) {
    return "";
  }
  let [y, m, d, h, mm, s] = format_date_base(value);
  return `${y}${separator}${m}${separator}${d}`;
};
export const format_month = (value) => {
  if (!value) {
    return "";
  }
  // utc转成gmt+8
  let time = parseInt(value) + 8 * 60 * 60 * 1000;
  let [y, m, d, h, mm, s] = format_date_base(time);
  separator = separator || "/";
  return `${m}${separator}${d} ${h}:${mm}:${s}`;
};
export const format_date = (value) => {
  if (!value) {
    return "";
  }
  let [y, m, d, h, mm, s] = format_date_base(value);
  return `${y}-${m}-${d} ${h}:${mm}:${s}`;
};
export const format_date_today_base = (value) => {
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  return `${m}/${d} ${h}:${mm}`;
};
export const format_week = (value) => {
  // let arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  let i = new Date(parseInt(value)).getDay();
  // return a[i];
  return i18n_t("time.time_date_week")[i];
};
/**
 * @Description 时间戳转星期
 * @param {number} value 时间戳
 * @param {string}
 */
export const format_week2 = (value) => {
  let i = new Date(parseInt(value)).getDay();
  return i18n_t("time.time_date_week_3")[i];
};
export const utc_to_gmt_8 = (value) => {
  if (!value) {
    return "";
  }
  let time = parseInt(value) + 8 * 60 * 60 * 1000;
  let [y, m, d, h, mm, s] = format_date_base(time);
  return `${m}/${d} ${h}:${mm}`;
};
export const utc_to_gmt_8_hm = (value) => {
  if (!value) {
    return "";
  }
  let time = parseInt(value) + 8 * 60 * 60 * 1000;
  let [y, m, d, h, mm, s] = format_date_base(time);
  return `${h}:${mm}`;
};
export const utc_to_gmt_8_ms = (value) => {
  if (!value) {
    return "";
  }
  let time = parseInt(value) + 8 * 60 * 60 * 1000;
  let [y, m, d, h, mm, s] = format_date_base(time);
  return `${mm}'${s}'`;
};
export const utc_to_gmt_no_8 = (value) => {
  if (!value) {
    return "";
  }
  let time = parseInt(value);
  let [y, m, d, h, mm, s] = format_date_base(time);
  return `${m}/${d} ${h}:${mm}`;
};
export const utc_to_gmt_no_8_ms2 = (value) => {
  if (!value) {
    return "";
  }
  let time = format_time_zone_millisecond(parseInt(value));
  let [y, m, d, h, mm, s] = format_date_base(time);
  return `${h}:${mm}:${s}`;
};
export const utc_to_gmt_8_ms2 = (value) => {
  if (!value) {
    return "";
  }
  let time = parseInt(value) * 1000 + 8 * 60 * 60 * 1000;
  let [y, m, d, h, mm, s] = format_date_base(time);
  return `${h}:${mm}:${s}`;
};
export const utc_to_label_show = (value) => {
  if (!value) {
    return "";
  }
  let str = "";
  let time = parseInt(value) + 8 * 60 * 60 * 1000;
  let time_local = new Date().getTime();
  if (time > time_local) {
    let cha_m = Math.floor((time - time_local) / (60 * 1000));
    str = `${cha_m}` + i18n_t("match_info.after_start"); //分钟后开始
  } else {
    str = i18n_t("match_info.match_playing"); //`已开赛`
  }
  return str;
};
export const gmt_to_label_show = (value) => {
  if (!value) {
    return "";
  }
  let str = "";
  let time = parseInt(value);
  let time_local = new Date().getTime();
  if (time > time_local) {
    let cha_m = Math.floor((time - time_local) / (60 * 1000));
    str = `${cha_m}` + i18n_t("match_info.after_start"); //分钟后开始
  } else {
    str = i18n_t("match_info.match_playing"); //`已开赛`
  }
  return str;
};
export const to_gmt_ms = (tmp) => {
  let mm = parseInt(tmp / 60);
  let s = tmp % 60;
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (s < 10) {
    s = "0" + s;
  }
  return `${mm}'${s}'`;
};
/**
 * 将秒格式化为：分：秒
 * @param  {number} second  秒
 * @params {string} model 分隔符类型
 * @return {string} 分：秒
 */
export const format_second_ms = (second, model = "default") => {
  if (second) {
    // let h = (Math.floor(second / 3600).toString()).padStart(2, 0);
    let m = parseInt(second / 60)
      .toString()
      .padStart(2, 0);
    let s = parseInt(second % 60)
      .toString()
      .padStart(2, 0);
    let date = model == "default" ? `${m}:${s}` : `${m}'${s}"`;
    if (model == "minute") {
      date = parseInt(m) + "'";
    }
    //date = h > 0 ? (date = h + ":" + date) : date
    return date;
  }
};
/**
 * 处理时间戳
 */
export const formatDate = (date) => {
  let _date = ''
  if (date) {
    if ((new Date() - parseInt(date)) >= 86400000) {
      _date = `${new Date(parseInt(date)).getMonth() + 1}月 ${new Date(parseInt(date)).getDate()}日`
    } else if ((new Date() - parseInt(date)) >= 3600000) {
      _date = `${Math.floor((new Date() - parseInt(date)) / 3600000)}小时前`
    } else {
      _date = `${Math.floor((new Date() - parseInt(date)) / 60000)}分钟前`
    }
  }
  return _date;
}

/**
 * 获取与服务器的修正时间
 */
export const get_remote_time = () => {
  return ServerTime.get_remote_time()
};

// 格式化时间
export const format_time = (seconds) => {
  let m = parseInt(seconds / 60).toString().padStart(2, 0)
  let s = (seconds % 60).toString().padStart(2, 0)
  return `${m}'${s}"`
}

/**
	 * @Description 时间戳转中文时间
	 * @param {number} timestap 时间戳
	 */
export const time_conversion = (timestap) => {
  if (timestap) {
    // 获取时间年月日
    let time = new Date(parseInt(timestap));
    let y = time.getFullYear();
    let m = String(time.getMonth() + 1).padStart(2, 0);
    let d = String(time.getDate()).padStart(2, 0);
    let h = String(time.getHours()).padStart(2, 0);
    let mm = String(time.getMinutes()).padStart(2, 0);
    // 根据国际化转换时间
    return i18n_t("time.time_date_4")
      .replace("yy", y)
      .replace("mm", m)
      .replace("dd", d)
      .replace("hh", h)
      .replace("ii", mm);
  } else {
    return "";
  }
}

// 海外时间格式 
export const format_date_base_week = (value) => {
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  let week = ['日', '一', '二', '三', '四', '五', '六'][time.getDay()]
  return [y, m, d, h, mm, s, week];
};

// 示例 Sun 11 Jun 19:00
export const format_date_overseas = (value) => {
  let [y, m, d, h, mm, s, week] = format_date_base_week(value);
  const map_month = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  }
  const map_week = {
    '日': 'Sun',
    '一': 'Mon',
    '二': 'Tue',
    '三': 'Wed',
    '四': 'Thu',
    '五': 'Fri',
    '六': 'Sat',
  }
  m = map_month[m]
  week = map_week[week]
  return `${week} ${d} ${m} ${h}:${mm}`;
};