/*
 * @Author: success
 * @Description: ws通信日志功能类
 */
import { SessionStorage } from "src/core/utils/common/module/web-storage.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { LOCAL_FUNCTION_SWITCH, PROJECT_NAME } = BUILDIN_CONFIG;

class WsLog
{
  /**
   * @Description:构造函数
   * @param:name 项目名称
   * @param:ws_run 开关
   * @param: port 端口
   */
  constructor(name, ws_run, port) 
  {
    // 日期格式化方法
    this.timer_format();
    // 是否开启日志功能
    this.ws_run = ws_run;
    // 项目名
    this.name = name;
    if((window.SEARCH_PARAMS.init_param.get('wsl') == '9999') || SessionStorage.get('wsl')=='9999' || this.ws_run)
    {
      this.ws_run = true;
      SessionStorage.set('wsl','9999');
    }
    if (this.ws_run) {
      // WS操作对象
      this.ws = null;
      // 连接定时器
      this.interval=null;
      // ws服务器地址默认9999
      this.url = 'ws://localhost:'+(port?port:9999);
      this.init();
    }
  }
  /**
   * @Description:发送日志到日志接收服务器
   * @param: flg 标识
   * @param: msg 消息体
   */
  send_msg(flg, msg) {
    if(this.ws_run && this.ws) {
      try {
        if(msg&&(typeof msg) == 'object')
        {
          msg =  (msg.cmd?msg.cmd:'    ')+' '+JSON.stringify(msg);
        } else{
          let cmd_ ='';
          try {
            cmd_ = JSON.parse(msg).cmd;
            msg =  (cmd_?cmd_:'     ')+' '+msg;
          } catch (error) {
            msg =  (cmd_?cmd_:'     ')+' '+msg;
          }
        }
        if(this.ws){
          const temp = (new Date()).format_log("yyyy-MM-dd hh:mm:ss.S") +'&'+ this.name+'-'+flg + ' ' + msg;
          this.ws.send(temp);
        }
      } catch (error) {
        // console.error(error);
      }
    }
  }
  /**
   * @Description:初始化WS服务
   */
  init() {
    this.reconnect();
    this.interval = setInterval(() => {
      try {
        if (this.ws) {
          this.sendHeartbeat();
        } else {
          this.reconnect();
        }
      } catch (error) {

      }
    }, 10000);
  }

  /**
   * @Description:WS服务重新连接
   */
  reconnect() {
    if (this.ws) {
      return;
    }
    //连接校验
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = (e) => {
        this.connect(e);
        // console.log('onopen=>%o', e);
      };
      this.ws.onclose = (e) => {
        this.close(e);
        // console.log('onopen=>%o', e);
      };
      this.ws.onerror = (e) => {
        this.close(e);
        // console.log('onopen=>%o', e);
      };
      this.ws.onmessage = (e) => {
        this.server_message(e.data);
        // console.log('onmessage=>%o', e);
      }
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * @Description:连接断开时回调(实现断线重连)
   * @Author success
   * @param:
   * @return:
   * @Date 2020/04/12 20:21:32
   */
  close(e) {
    if (this.ws) {
      this.ws.close();
      this.ws = "";
    }
    // setTimeout(() => {
    //     this.reconnect();
    // }, 20000);
  }
  /**
   * @Description:连接成功函数
   * 链接成功才发送心跳包
   */
  connect(e) {

  }

  /**
   * @Description:接收消息函数
   */
  server_message(e) {
    // let data = e.data;
  }

  /**
   * @Description:发送心跳包
   */
  send_heartbeat() {
    if (this.ws) {
      this.ws.send("1");
    }
  }

  /**
   * @Description:销毁函数
   */
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.ws = null;
  }

  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
  timer_format(){
    Date.prototype.format_log = function (fmt) {
      let S = this.getMilliseconds();
      if(S<10)
      {
        S='00'+S;
      } else if(S<100)
      {
        S='0'+S;
      }
      var o = {
          "M+": this.getMonth() + 1, // 月份
          "d+": this.getDate(), // 日
          "h+": this.getHours(), // 小时
          "m+": this.getMinutes(), // 分
          "s+": this.getSeconds(), // 秒
          "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
          "S": S // 毫秒
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
}
// 初始化启动日志系统--开发模式时日志打开
// window.wslog = new WsLog(window.env.NODE_ENV === 'development');

//PC 应该用 环境来判断 而不是导出二个变量
export default new WsLog(PROJECT_NAME.toLocaleUpperCase(), LOCAL_FUNCTION_SWITCH.LOG);
