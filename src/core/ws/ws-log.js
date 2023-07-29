/*
 * @Author: hanamr
 * @Description: ws通信日志功能类
 */
export default class WsLog {
  /**
   * @Description:构造函数
   * @param:name 项目名称
   * @param:ws_run 开关
   * @param: port 端口
   */
  constructor(name, ws_run, port) {
    // 是否开启日志功能
    this.ws_run = ws_run;
    // 项目名
    this.name = name;
    if (
      location.href.indexOf("wsl=9999") != -1 ||
      sessionStorage.getItem("wsl") == "9999" ||
      this.ws_run
    ) {
      this.ws_run = true;
      sessionStorage.setItem("wsl", "9999");
    }
    if (this.ws_run) {
      // WS操作对象
      this.ws = null;
      // 连接定时器
      this.interval = null;
      // ws服务器地址默认9999
      this.url = "ws://localhost:" + (port ? port : 9999);
      this.init();
    }
  }
  /**
   * @Description:发送日志到日志接收服务器
   * @param: flg 标识
   * @param: msg 消息体
   */
  send_msg(flg, msg) {
    if (this.ws_run && this.ws) {
      try {
        if (msg && typeof msg == "object") {
          // 对象时
          msg = (msg.cmd ? msg.cmd : "    ") + " " + JSON.stringify(msg);
        } else {
          // 字符串时
          let cmd_ = "";
          try {
            cmd_ = JSON.parse(msg).cmd;
            msg = (cmd_ ? cmd_ : "     ") + " " + msg;
          } catch (error) {
            msg = (cmd_ ? cmd_ : "     ") + " " + msg;
          }
        }
        if (this.ws) {
          this.ws.send(
            new Date().Format("yyyy-MM-dd hh:mm:ss.S") +
              "&" +
              this.name +
              "-" +
              flg +
              " " +
              msg
          );
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
    // 发送日志到日志接收服务器
    this.timer_format();
    // WS服务重新连接
    this.reconnect();
    this.interval = setInterval(() => {
      try {
        if (this.ws) {
          // 发送心跳包
          this.send_heartbeat();
        } else {
          // 发送心跳包
          this.reconnect();
        }
      } catch (error) {
        // 无意义,无需打印
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
      };
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
  }
  /**
   * @Description:连接成功函数
   */
  connect(e) {}

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
  destroyed() {
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
  timer_format() {
    Date.prototype.Format = function (fmt) {
      let S = this.getMilliseconds();
      if (S < 10) {
        S = "00" + S;
      } else if (S < 100) {
        S = "0" + S;
      }
      var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        S: S, // 毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    };
  }
}
