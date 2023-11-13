/*
 * @Date: 2021-04-16 15:05:19
 * @Description: http方法次数统计
 */

export default class HttpLog {
  /**
   * @description: 构造函数
   * @return {undefined} undefined
   */
  constructor(view) {
      this.view = view;
      this.run = false;
      // 检测是否有httpLog开关
      if(location.href.indexOf('httplog=1') !=-1){
          sessionStorage.setItem('httplog','1');
      }
      if(sessionStorage.getItem('httplog')){
          this.run = true;
      }
      // 初始化数据
      if(this.run){
          this.init();
      }
  }
  //销毁函数
  destroy() {
    this.view = null;
    this.run = false;
    this.debounce_throttle_cancel(this.set_local_log_obj);
  }


  /**
   * @description: 数据初始化
   */
  init() {
      // 设置时间格式化函数
      this.timerFormat();
      // this.log_obj = { data: {} };
    //   this.log_obj = {"data":{"2021-4-16":{"time":{"17:30":{"xxxx2":2,"xxxyy":1}},"total":{"xxxx":2,"xxxyy":1}}}}
      this.log_obj = this.get_local_log_obj();
      this.set7day_data();
      if(this.view){
        this.set_local_log_obj = this.view.throttle(this.set_local_log_obj,5000, {leading: true, trailing: true})
      }
  }
  /**
   * @description: 设置只保存近7天的数据
   */  
  set7day_data(){
    let obj = {};
    let now = new Date().getTime();
    for (let i = 0; i < 7; i++) {
        obj[this.get_date_format(now-i*24*60*60*1000)] = 1;
    }
    
    for (const key in this.log_obj.data) {
        if(key && (!obj[key])){
            delete this.log_obj.data[key];
        }
    }
  }

  /**
   * @description: 时间戳转日期
   * @param {int} 时间戳
   * @return {String} 日期字符串
   */  
  get_date_format(time){
    let date = null;
    if(time){
        date = new Date(time)
    } else{
        date = new Date()
    }
    let y = date.getFullYear();
    let m = date.getMonth() + 1; 
    let d = date.getDate();
    return y+'-'+m+'-'+d;
 }

  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
  timerFormat() {
      if(!Date.prototype.Format){
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
              for (var k in o) {
                  if (new RegExp("(" + k + ")").test(fmt)) {
                      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                  }
              }
              return fmt;
          }
      }
  }

  /**
   * @description: 获取日期时间对象
   * @return Object 日期时间对象
   */    
  get_date_obj(){
      let date = (new Date()).Format(`{"R":"yyyy-M-d","X":h,"F":m}`)
      let obj = JSON.parse(date)
      let x = (obj.X<10)?('0'+obj.X):(''+obj.X);
      if(obj.F<30){
          obj.D =  x+':00';
      } else{
          obj.D =  x+':30';
      }
      return obj;
  }

  /**
   * @description: 增加http日志记录
   * @param {Object} obj
   */    
  push(obj){
      if(!obj || !this.run){
          return;
      }
      let url = obj.url;
      if(url){
        let date = this.get_date_obj();
        // console.log(JSON.stringify(date))
        if(!this.log_obj.data[date.R]){
            this.log_obj.data[date.R] = {time:{},total:{}}
        }

        if(!this.log_obj.data[date.R].time[date.D]){
            this.log_obj.data[date.R].time[date.D] = {}
        }
        
        let index = url.indexOf('?');
        if(index != -1){
            url = url.substring(0,index)
        } 
        if(this.log_obj.data[date.R].time[date.D][url]){
            this.log_obj.data[date.R].time[date.D][url] += 1;
        } else{
            this.log_obj.data[date.R].time[date.D][url] = 1;
        }

        if(this.log_obj.data[date.R].total[[url]]){
            this.log_obj.data[date.R].total[[url]] += 1;
        } else{
            this.log_obj.data[date.R].total[[url]] = 1;
        }
        //   console.log(JSON.stringify(this.log_obj))
        this.set_local_log_obj();
      }
  }

  /**
   * @description: 获取持久化的http日志对象
   * @return {object} 日志对象
   */    
  get_local_log_obj(){
      let ret = { data: {} }
      let log = localStorage.getItem('http_log');
      if(log){
          try {
              ret = JSON.parse(log);
          } catch (error) {
              
          }
      }
      return ret;
  }

  /**
   * @description: 保存持久化http日志
   */    
  set_local_log_obj(){
      if(this.log_obj){
          let log = JSON.stringify(this.log_obj);
          localStorage.setItem('http_log',log);
      }
  }
}

// let httpLog =new HttpLog();
// httpLog.push({url:'xxxx'})
// httpLog.push({url:'xxxx'})
// httpLog.push({url:'xxxyy'})
