import { isDate } from "lodash";

export  const format_Y_M_D_H_M = function (payload) {
    if (!payload) return ''
    let time = new Date(parseInt(payload));
    let y = (time.getFullYear() + "")
    let M = (time.getMonth() + 1 + "").padStart(2, 0);
    let d = (time.getDate() + "").padStart(2, 0);
    let h = (time.getHours() + '').padStart(2, 0);
    let m = (time.getMinutes() + '').padStart(2, 0);
    return `${y}-${M}-${d} ${h}:${m}`
}
export  const formcht_Y_M_D_H_M = function (payload) {
    if (!payload) return ''
    let time = new Date(parseInt(payload));
    let y = (time.getFullYear() + "")
    let M = (time.getMonth() + 1 + "").padStart(2, 0);
    let d = (time.getDate() + "").padStart(2, 0);
    let h = (time.getHours() + '').padStart(2, 0);
    let m = (time.getMinutes() + '').padStart(2, 0);
    return `${y}年${M}月${d}日  ${h}:${m}`
}
// 示例： 1 月 2 日
export  const format_M_D = function (payload, that) {
    if (!payload) return ''
    let time = new Date(parseInt(payload));
    let m = time.getMonth();
    let d = (time.getDate() + "");
    let monthes = that.$root.$t('time.monthes');
    let format = that.$root.$t('time.time_date_1');
    format = format.replace('%date', d);
    format = format.replace('%month', monthes[m]);
    return format;
}
// 示例： 12 ：30
export  const format_H_M = function (payload) {
    if (!payload) return ''
    let time = new Date(parseInt(payload));
    let h = (time.getHours() + '').padStart(2, 0);
    let m = (time.getMinutes() + '').padStart(2, 0);
    return `${h}:${m}`
}
// 示例： 23:30
export  const format_mgt_time = function (num) {
    class MatchTime {
        constructor(time) {
            this.time = time
        }
        showTime() {
            let m = Math.floor(this.time / 60)
                .toString()
                .padStart(2, '0')
            let s = Math.floor((this.time % 60) / 1)
                .toString()
                .padStart(2, '0')
            return `${m}:${s}`
        }
    }
    let time = new MatchTime(num).showTime()
    return time;
}

/**
 * 日期格式化
 * @param {String} val 时间戳  
 * @return {String} 
 */
export  const formete_date = (val) => {
    val = Number(val)
    let difference = Date.now() - val, str = ''
    if (difference > 1000 * 60 * 60 * 24) {
        str = new Date(val).getMonth() + 1 + '月' + new Date(val).getDate() + '日'
    } else if (difference > 1000 * 60 * 60) {
        str = Math.ceil(difference / (1000 * 60 * 60)) + '小时前'
    } else {
        str = Math.ceil(difference / (1000 * 60)) + '分钟前'
    }
    return str
}

// 示例： 5 15 23
export  const format_min_time = function (num) {
    class MatchTime {
        constructor(time) {
            this.time = time
        }
        showTime() {
            let m = Math.ceil(this.time / 60).toString()
            return `${m}`
        }
    }
    let time = new MatchTime(num).showTime()
    return time;
}




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
  var o = {
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
  for (var k in o) {
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
  export const format_time_zone=(time,offset=8)=>{
    var d=new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
    var localTime = d.getTime();//获取的是毫秒级
    var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
    var utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
    var wishTime= utc + (3600000*offset);
    return new Date(wishTime);
  }

  /**
   * @description: 获取指定时区的时间缀(默认使用东八区)
   * @param {int} time 时间毫秒数
   * @param {int} offset 时区, 默认东八区
   * @return {Date} 转换后的时区时间缀
   */
 export const format_time_zone_millisecond=(time,offset=8)=>{
    var d=new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
    var localTime = d.getTime();//获取的是毫秒级
    var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
    var utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
    var wishTime= utc + (3600000*offset);
    return wishTime;
  }
  /**
   * @Description 获取格式化时间对象
   * @param {undefined} undefined
  */
  const format_date_base_obj=(value)=> {
    let time = new Date(parseInt(value));
    let y = time.getFullYear();
    let m = (time.getMonth() + 1 + "").padStart(2, 0);
    let d = (time.getDate() + "").padStart(2, 0);
    let h = (time.getHours() + "").padStart(2, 0);
    let mm = (time.getMinutes() + "").padStart(2, 0);
    let s = (time.getSeconds() + "").padStart(2, 0);
    let w = time.getDay();
    return { y, m, d, h, mm, s, w };
  }




    /**
   * @description: 获取指定时区的时间戳(默认使用东八区)
   * @param {int} time 时间毫秒数
   * @param {int} offset 时区, 默认东八区
   * @return {int} 转换后的时区的时间戳
   */
   export const format_time_zone_time=(time,offset=8)=>{
        var d=new Date(time); //创建一个Date对象 time时间 offset 时区 中国为 8
        var localTime = d.getTime();//获取的是毫秒级
        var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,时区是以分钟为单位的
        var utc = localTime + localOffset; //utc即GMT时间,世界时,格林威治时间
        var wishTime= utc + (3600000*offset);
        return wishTime;
      }



       /**
   * 红猫赛事显示倒计时优化
   * @param  match 赛事信息   
   * @param  counting_time 显示时间
   *
   */
  export const   counting_time_ctr_show_format=(match,counting_time)=> {
  
    // counting_time 格式00:00
    let counting_time_ = counting_time;
    // 红猫赛事只显示分钟不显示秒
    if(_.get(match,'cds')=='RC' && _.get(match,'csid')==1 && counting_time){
      counting_time_ = _.get(counting_time_.split(':'),'[0]');
    }
    return counting_time_;
  }