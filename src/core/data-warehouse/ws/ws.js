/*
 * @Author: hanmar
 * @Description: ws通信类
 */
import WsQueue from "src/core/ws/ws-queue.js";
import { WsRev } from "src/core/ws/ws-ctr.js";
import WsMan from "src/core/ws/ws-man.js";
import WsSendManger from "src/core/ws/ws-send-manger.js";
import STANDARD_KEY from "src/core/standard-key/index.js";
import { uniq } from "lodash";
import { UserCtr } from "src/core/index.js";
export default class Ws {
  // 链接异常次数
  static err_count = 0;
  /**
   * @Description:构造函数
   * @param:
   */
  constructor(url) {
    // ws是否允许执行
    this.run = true;
    // ws url
    this.url = url;
    // ws通信对象
    this.ws = "";
    // 心跳包定时器
    this.headbeet_timer = "";
    //心跳包发送间隔时间
    this.HEARTBEAT_TIME = 15000;
    // ws 消息队列对象--用于消息队列分发
    this.ws_queue = new WsQueue();
    // 开始启动消息队列服务
    this.ws_queue.start();
    // 网络链接状态
    this.wsStatus = false;
    // 网络链接状态回调方法
    this.ws_status_call = "";
    // 是否手动操作ws
    this.ctr = false;
    // ws消息推送管理对象
    this.ws_send_manger_objs = {};
    // ws断线后,重新连接时定时器对象
    this.timer_ws = null;
    // 可以切换的ws url地址数组
    this.urls = [];
    // 增加接收内部消息监听
    this.add_event_listener();
  }

  /**
   * @Description:增加消息队列数据
   * @param: msg 消息体
   */
  push_ws_queue_msg(msg) {
    if (this.ws_queue && msg) {
      // {"cd":{"hs":0,"mid":"74282"},"cmd":"C104","ctsp":"1583130819077","ld":"790.435.15831308179490027"}
      this.ws_queue.push_msg(msg);
    }
  }

  /**
   * @Description:设置ws url
   * @param: url ws地址
   * @return:
   */
  set_ws_url(url) {
    console.log("ws set_ws_url new url:" + url);
    // 未发现该域名,增加到数组中
    if (!this.urls.includes(url)) {
      this.urls.unshift(url);
      this.urls = uniq(this.urls);
    }
    console.log("this.urls:", JSON.stringify(this.urls));
  }

  /**
   * @Description:重新初始化数据
   * @param:noAuto-是否手动关闭ws
   * @return:
   */
  ret_init_data(no_auto) {
    console.log("-----ws--ret_init_data----------" + no_auto);
    if (no_auto) {
      this.ctr = no_auto;
    }
    if (this.ws) {
      // 清空监听函数
      this.ws.onopen = function (e) {};
      this.ws.onclose = function (e) {};
      this.ws.onmessage = function (e) {};
      this.ws.close();
      this.ws = "";
    }
    //清除心跳包定时器
    if (this.headbeet_timer) {
      clearInterval(this.headbeet_timer);
      this.headbeet_timer = "";
    }
  }

  /**
   * @Description:销毁函数
   * @param:
   * @return:
   */
  destroy(is_close) {
    // console.log('-----ws--destroy----------')
    if (is_close) {
      this.run = false;
    }
    // 移除接收内部消息监听
    this.remove_event_listener();
    if (this.ws) {
      this.send_msg({ cmd: "C00" });
      // 清空监听函数
      this.ws.onopen = function (e) {};
      this.ws.onclose = function (e) {};
      this.ws.onmessage = function (e) {};
      this.ws.close();
      this.ws = "";
    }
    //清除心跳包定时器
    if (this.headbeet_timer) {
      clearInterval(this.headbeet_timer);
      this.headbeet_timer = "";
    }
    //停止消费队列
    if (this.ws_queue) {
      this.ws_queue.stop();
    }

    // 销毁ws消息推送管理对象
    for (const key in this.ws_send_manger_objs) {
      const item = this.ws_send_manger_objs[key];
      if (item) {
        item.destroy();
      }
    }
    this.ws_send_manger_objs = null;
    // 销毁定时器
    clearTimeout(this.timer_ws);
  }

  /**
   * @description: ws重新连接
   * @param {*} type 操作类型 vue_hidden_to_show:后台转前台时
   */
  connect(type) {
    console.log("-----ws--connect----------" + type);
    if (this.ws) {
      // console.error(`--------readyState:${this.ws.readyState}-----------CONNECTING:${WebSocket.CONNECTING}----------------OPEN:${WebSocket.OPEN}`);
      // ws处于可用状态时,不需要重新创建和连接
      if (
        this.ws.readyState == WebSocket.CONNECTING ||
        this.ws.readyState == WebSocket.OPEN
      ) {
        return;
      }
      // console.log('---------------------------------清空操作-----------------------');
      // 清空监听函数
      this.ws.onopen = function (e) {};
      this.ws.onclose = function (e) {};
      this.ws.onmessage = function (e) {};
      this.ws.close();
      this.ws = "";
    }
    var this_ = this;
    // 获取轮询数组中最前面的url地址
    if (type != "vue_hidden_to_show" && this.urls.length) {
      // console.log(`---------------------------------urls:${JSON.stringify(this.urls)}-----------------------`);
      // 将第一个域名移动到数组最后,并设置给this.url参数
      this.url = this.urls[0];
      this.urls.splice(0, 1);
      this.urls.push(this.url);
    }
    try {
      this.ws = new WebSocket(this.url);
      console.log(this.ws);
      console.log(
        `-----------------------------------new WebSocket---------------------this.url:${this.url}`
      );
      //打开
      this.ws.onopen = function (e) {
        // console.log('------------------------------------onopen----------------------')
        Ws.err_count = 0;
        this_.onConnect(this_, e);
      };
      //关闭
      this.ws.onclose = function (e) {
        // console.log('------------------------------------onclose----------------------')
        this_.onClose(this_, e);
      };
      //接收消息
      this.ws.onmessage = function (e) {
        // console.log('------------------------------------onmessage----------------------')
        this_.onMessage(this_, e);
      };
    } catch (error) {
      console.error(error);
    }
  }
  //连接ws成功回调函数
  onConnect(this_) {
    console.log(
      `--------------------------------------onConnect---------------------this.url=${this.url}`
    );
    // 设置ws链接状态
    this_.wsStatus = 1;

    if (this_.ws_status_call) {
      this_.ws_status_call(this_.wsStatus);
    }
    if (!this_.headbeet_timer) {
      clearInterval(this_.headbeet_timer);
      this_.headbeet_timer = setInterval(() => {
        // 发送心跳包命令
        this_.send_msg({ cmd: "C0" });
      }, this_.HEARTBEAT_TIME);
    }
  }
  //关闭ws回调函数
  onClose(this_) {
    console.log(
      `--------------------------------------onClose------------this.url=${this.url}`
    );
    // 设置ws链接状态
    this_.wsStatus = 0;
    if (this_.ws_status_call) {
      this_.ws_status_call(this_.wsStatus);
    }
    this_.ret_init_data();
    // 不允许执行时阻止自动重启功能
    if (!this.run) {
      return;
    }
    console.log(
      `--------------------------------------onClose------------this.url=${this.url}----------this.ctr = ${this.ctr}`
    );
    // 发送api域名切换命令
    if (!this.ctr) {
      // this.view.useMittEmit('EMIT_API_DOMAIN_UPD_CMD',{type:'ws', data:{url:this.url}});
      // 改用postmessage消息机制
      window.postMessage(
        {
          event: "WS",
          cmd: `WS_DOMAIN_UPD_CMD`,
          data: { name: "api域名切换命令" },
        },
        "*"
      );
    }
    this.ctr = false;
    if (!this_.wsStatus && document.visibilityState == "visible") {
      Ws.err_count++;
      clearTimeout(this.timer_ws);
      if (Ws.err_count > 10) {
        // 10秒后再连接
        this.timer_ws = setTimeout(() => {
          this_.connect();
        }, 10000);
      } else {
        // 3秒后再连接
        this.timer_ws = setTimeout(() => {
          this_.connect();
        }, 3000);
      }
    }
  }

  /**
   * @Description:发送ws 消息
   * @param: msg 事件消息对象
   * @param: ws_object WS类对象
   * @return:
   */
  send_msg(msg, ws_object = WsMan.wsm) {
    try {
      let ws = WsMan.ws && WsMan.ws.ws;
      if (ws && ws.readyState == 1) {
        switch (msg.cmd) {
          case "C8":
            // 是否一条一条发送
            if (!msg.one_send) {
              if (!this.ws_send_manger_objs[msg.cmd]) {
                this.ws_send_manger_objs[msg.cmd] = new WsSendManger(msg.cmd);
              }
              // 增加缓存信息,并获取组装后信息
              msg = this.ws_send_manger_objs[msg.cmd].push_obj(msg.key, msg);
            }
            break;
          default:
            break;
        }
        // 对特殊命令进行统一管理处理发送
        if (window.vue) {
          try {
            msg.requestId = UserCtr.user_info ||
              sessionStorage.getItem(STANDARD_KEY.token);
          } catch (error) {
            console.error(error);
          }
        }

        window.wsmsg && console.log(`WS MSG SEND ---:${JSON.stringify(msg)}`);
        if (window.wslog && window.wslog.send_msg) {
          window.wslog.send_msg("WS---S:", msg);
        }
        if (ws) {
          ws.send(JSON.stringify(msg));
        }
      }
    } catch (error) {
      console.log(`ws send error! data:${JSON.stringify(msg)}`);
    }
  }
  /**
   * @Description:接收ws内部通信事件
   * @param: event 事件消息对象
   * @param: ws_object WS类对象
   * @return:
   */
  rev_event_msg(event, ws_object = WsMan.ws) {
    if (ws_object && event && event.data && event.data.event == "WS") {
      if (ws_object) {
        switch (event.data.cmd) {
          case "WS_MSG_SEND": // 发送消息ws服务器
            ws_object.send_msg(event.data);
            break;
          case "WS_SET_URL":
            ws_object.send_msg(event.data);
            break;
          case "WS_SET_RET_URL":
            ws_object.send_msg(event.data);
            break;
          default:
            break;
        }
      }
    }
  }
  /**
   * @Description:增加接收ws内部通信监听
   * @param: event 事件消息对象
   * @return:
   */
  add_event_listener() {
    // 监听message
    window.addEventListener("message", this.rev_event_msg);
  }
  /**
   * @Description:移除接收ws内部通信监听
   * @param: event 事件消息对象
   * @return:
   */
  remove_event_listener() {
    // 移除监听message
    window.removeEventListener("message", this.rev_event_msg);
  }

  /**
   * @Description:接收ws外部收到消息
   * @param: event 事件消息对象
   * @return:
   */
  onMessage(this_, e) {
    let msg = e.data;
    // console.log(`---WS REV  MSG---:${msg}`);
    try {
      if (window.wslog && window.wslog.send_msg) {
        window.wslog.send_msg("WS---R:", msg);
        // console.log('------------------------------------onMessage----------------------'+msg)
      }
      WsRev.ws_rev_msg(this_, JSON.parse(msg));
    } catch (error) {
      console.log("=======websocket服务器返回数据错误=======" + msg);
    }
    // this_.push_ws_queue_msg(msg);
  }
}
