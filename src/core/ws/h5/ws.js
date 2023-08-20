/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: ws通信类
 */
import WsQueue from "src/public/utils/ws/wsQueue.js";
import { WsRev } from "src/public/utils/ws/wsCtr.js";
import WsSendManger from "src/public/utils/ws/ws_send_manger.js";
export default class Ws {
  // 链接异常次数
  static err_count = 0;
  /**
   * @Description:构造函数
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:02:53
   */
  constructor(view, url) {
    // ws是否允许执行
    this.run = true;
    // 创建消息队列
    this.view = view;
    // ws url
    this.url = url;
    // ws通信对象
    this.ws = '';
    // 心跳包定时器
    this.headbeetTimer = '';
    //心跳包发送间隔时间
    this.HEARTBEAT_TIME = 15000;
    // ws 消息队列对象--用于消息队列分发
    this.wsQueue = new WsQueue(view);
    // 开始启动消息队列服务
    this.wsQueue.start();
    // 网络链接状态
    this.wsStatus = false;
    // 网络链接状态回调方法
    this.wsStatusCall = '';
    // 是否手动操作ws
    this.ctr = false;
    // ws消息推送管理对象
    this.ws_send_manger_objs = {};
    //订阅的赛事id(逗号隔开)
    // this.mids_ = '';
    //函数做节流处理
    // this.sync_time = this.throttle(this.sync_time,3000);
    // 定时器
    // this.interval;
    // ws断线后,重新连接时定时器对象
    this.timer_ws = null;
    // 可以切换的ws url地址数组
    this.urls = [];
  }


  /**
   * @Description:增加消息队列数据
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:05:05
   */
  pushWsQueueMsg(msg) {
    if (this.wsQueue && msg) {
      // {"cd":{"hs":0,"mid":"74282"},"cmd":"C104","ctsp":"1583130819077","ld":"790.435.15831308179490027"}
      this.wsQueue.pushMsg(msg);
    }
  }
  /**
   * @Description:增加消费对象
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:18:01
   */
  addQueueViewObj(key, obj) {
    this.wsQueue.addQueueViewObj(key, obj)
  }

  /**
 * @Description:增加消费对象
 * @Author success
 * @param:
 * @return:
 * @Date 2020/03/02 14:18:01
 */
  removeQueueViewObj(key) {
    this.wsQueue.removeQueueViewObj(key)
  }

  /**
   * @Description:设置ws url
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 16:04:50
   */
  setWsUrl(url) {
    console.log('ws setWsUrl new url:' + url);
    // 未发现该域名,增加到数组中
    if (!this.urls.includes(url)) {
      this.urls.unshift(url);
      this.urls = _.uniq(this.urls);
    }
    console.log('this.urls:', JSON.stringify(this.urls));
  }

  /**
   * @Description:重新初始化数据
   * @Author success
   * @param: noAuto-是否手动关闭ws
   * @return:
   * @Date 2020/03/02 17:27:49
   */
  retInitData(noAuto) {
    console.log('-----ws--retInitData----------' + noAuto)
    if (noAuto) {
      this.ctr = noAuto;
    }
    if (this.ws) {
      // 清空监听函数
      this.ws.onopen = function (e) { };
      this.ws.onclose = function (e) { };
      this.ws.onmessage = function (e) { };
      this.ws.close();
      this.ws = '';
    }
    if (this.headbeetTimer) {
      clearInterval(this.headbeetTimer);
      this.headbeetTimer = '';
    }
  }

  /**
   * @Description:析构函数
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 17:27:49
   */
  destroy(is_close) {
    // console.log('-----ws--destroy----------')
    if (is_close) {
      this.run = false;
    }
    if (this.ws) {
      // 清空监听函数
      this.ws.onopen = function (e) { };
      this.ws.onclose = function (e) { };
      this.ws.onmessage = function (e) { };
      this.ws.close();
      this.ws = '';
    }
    if (this.headbeetTimer) {
      clearInterval(this.headbeetTimer);
      this.headbeetTimer = '';
    }
    if (this.wsQueue) {
      this.wsQueue.stop();
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

  connect() {
    // console.log('-----ws--connect----------')
    if (this.ws) {
      // ws处于可用状态时,不需要重新创建和连接
      if (this.ws.readyState == WebSocket.CONNECTING || this.ws.readyState == WebSocket.OPEN) {
        return;
      }
      // 清空监听函数
      this.ws.onopen = function (e) { };
      this.ws.onclose = function (e) { };
      this.ws.onmessage = function (e) { };
      this.ws.close();
      this.ws = '';
    }
    var this_ = this;
    // 获取轮询数组中最前面的url地址
    if (this.urls.length) {
      // 将第一个域名移动到数组最后,并设置给this.url参数
      this.url = this.urls[0];
      this.urls.splice(0, 1);
      this.urls.push(this.url)
    }
    try {
      this.ws = new WebSocket(this.url);
      // console.log(`-----------------------------------new WebSocket---------------------this.url:${this.url}`);
      this.ws.onopen = function (e) {
        Ws.err_count = 0;
        this_.onConnect(this_, e)
      };
      this.ws.onclose = function (e) {
        this_.onClose(this_, e)
      };
      this.ws.onmessage = function (e) {
        this_.onMessage(this_, e)
      };
    } catch (error) {
      console.error(error);
    }
  }
  // onConnect(this_, e)
  onConnect(this_) {
    // console.log(`--------------------------------------onConnect---------------------this.url=${this.url}`);
    // 设置ws链接状态
    this_.wsStatus = true;


    if (this_.wsStatusCall) {
      this_.wsStatusCall(this_.wsStatus)
    }
    if (!this_.headbeetTimer) {
      clearInterval(this_.headbeetTimer)
      this_.headbeetTimer = setInterval(() => {
        // 发送心跳包命令
        this_.sendMsg({ "cmd": "C0" });
      }, this_.HEARTBEAT_TIME);
    }
  }
  // onClose(this_, e)
  onClose(this_) {
    console.log(`--------------------------------------onClose------------this.url=${this.url}`);
    // 设置ws链接状态
    this_.wsStatus = false;
    if (this_.wsStatusCall) {
      this_.wsStatusCall(this_.wsStatus)
    }
    this_.retInitData();
    // 不允许执行时阻止自动重启功能
    if (!this.run) {
      return;
    }
    console.log(`--------------------------------------onClose------------this.url=${this.url}----------this.ctr = ${this.ctr}`);
    // 发送api域名切换命令命令
    if (!this.ctr) {
      this.view.$root.$emit(this.view.MITT_TYPES.EMIT_API_DOMAIN_UPD_CMD, { type: 'ws', data: { url: this.url } });
    }
    this.ctr = false;
    // 设置超时时间为3s
    let time_out = 3000;
    Ws.err_count++;
    if (Ws.err_count > 10) {
      // 10s后再连接
      time_out = 10000;
    }
    clearTimeout(this.timer_ws);
    this.timer_ws = setTimeout(() => {
      if (!this_.wsStatus && document.visibilityState == 'visible') {
        this_.connect();
      }
    }, time_out);
  }

  /**
   * @Description:发送ws 消息
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 17:36:09
   */
  sendMsg(msg) {
    if (msg.cmd == 'clear') {
      if (!this.ws_send_manger_objs) {
        this.ws_send_manger_objs = {}
      }
      if (!this.ws_send_manger_objs[msg.cmd]) {
        this.ws_send_manger_objs[msg.cmd] = new WsSendManger(this.view, msg.cmd);
        this.ws_send_manger_objs[msg.cmd].push_obj(msg.cmd, msg);
      }
      return
    }
    try {
      if (this.ws && this.ws.readyState == 1) {
        let mkLevel = _.get(window, 'vue.$store.getters.get_user.marketLevel');
        switch (msg.cmd) {
          case 'C8':
            // 是否一条一条发送
            if (!msg.one_send && this.ws_send_manger_objs) {
              if (!this.ws_send_manger_objs[msg.cmd]) {
                this.ws_send_manger_objs[msg.cmd] = new WsSendManger(this.view, msg.cmd);
              }
              msg = this.ws_send_manger_objs[msg.cmd].push_obj(msg.key, msg);
            }
            break;
          case 'C2':
            msg.marketLevel = mkLevel ? mkLevel : 0;  //行情等级有值的时候传值 其他时候传0
            break;
          default:
            break;
        }
        if (!msg) return
        try {
          if (window.vue) {
            if (typeof (window.vue.$store.getters.get_user_token) == 'object') {
              msg.requestId = window.vue.$store.getters.get_user_token.token;
            } else {
              msg.requestId = window.vue.$store.getters.get_user_token;
            }
          }
        } catch (e) {
          console.error(e)
        }
        if (!msg.requestId) {
          msg.requestId = sessionStorage.getItem('h5_token') || '';
        }
        window.wslog.sendMsg('WS---S:', msg)
        this.ws.send(JSON.stringify(msg));
        // console.log('WS发送命令:'+JSON.stringify(msg));
      }
    } catch (error) {
      console.error(error)
    }
  }

  onMessage(this_, e) {
    let msg = e.data;
    // console.log(`---WS REV  MSG---:${msg}`);
    try {
      window.wslog.sendMsg('WS---R:', msg)
      WsRev.wsRevMsg(this_, JSON.parse(msg));
    } catch (error) {
      console.error(error)
      // console.log('=======websocket服务器返回数据错误=======' + msg);
    }
    // this_.pushWsQueueMsg(msg);
  }
}

