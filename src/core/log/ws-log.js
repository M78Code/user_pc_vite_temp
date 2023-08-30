/*
 * @Author: jiffy
 * @LastEditors: jiffy
 * @Description: ws通信日志功能类
 */
import { GetUrlParams } from "../utils";
import { DateForMat } from "src/core/format/index.js";
import { SessionStorage  } from "src/core/utils/module/web-storage.js";
debugger
const { LOCAL_FUNCTION_SWITCH } = window.BUILDIN_CONFIG;
class WsLog {
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
    if (GetUrlParams("wsl") == 9999 || SessionStorage .get("wsl") == "9999" || this.ws_run) {
      this.ws_run = true;
      SessionStorage .set("wsl", "9999");
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
  setWsUrl(url, isReconnect) {
    this.url = url;
    isReconnect && this.reconnect();
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
            DateForMat(new Date(), "yyyy-MM-dd hh:mm:ss") +
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
    // WS服务重新连接
    this.reconnect();
  }

  /**
   * @Description:WS服务重新连接
   * 应该新销毁之前的避免浪费内存
   * @param {string} url  新的链接
   */
  reconnect(url) {
    url && (this.url = url);
    if (this.ws) {
      this.beforeUnmount();
      // return;
    }
    //连接校验
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = (e) => {
        this.connect(e);
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
   * 链接成功才发送心跳包
   */
  connect(e) {
    clearInterval(this.interval);
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
    this.ws && this.ws.close();
    this.ws = null;
  }
}
// 初始化启动日志系统--开发模式时日志打开
// window.wslog = new WsLog(window.env.NODE_ENV === 'development');

//PC 应该用 环境来判断 而不是导出二个变量
export default new WsLog("PC", LOCAL_FUNCTION_SWITCH.LOG);
