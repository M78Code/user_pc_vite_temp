/*
 * @Description:
 */
import ChatroomEventcenter from './chatroom-eventcenter';
import MsgType from './chatroom-msgtype';
export default class ChatroomWs {
  // ws实例
  ws;
  // 连接Url
  url;
  // 是否在重连中
  isReconnectioning = false;
  // 重连间隔时间
  reconnectionTimeOut = 5000;
  // 重连间隔时间Obj
  reconnectionTimeOutObj = null;
  // 心跳间隔时间
  heartBeatTimeOut = 10000;
  // 心跳间隔时间Obj
  heartBeatTimeOutObj = null;
  // 服务器间隔时间Obj
  serverTimeOutObj = null;
  // 是否是用户手动关闭连接
  isCustomClose = false;
  // 消息管理中心
  eventCenter;
  // 重连次数
  reconnect_count = 0;

  constructor(url) {
    this.url = url;
    this.createWs();
    this.eventCenter = new ChatroomEventcenter();
  }

  createWs() {
    if ('WebSocket' in window) {
      // 实例化WS
      this.ws = new WebSocket(this.url);
      // 初始化监听事件
      this.onopen();
      this.onerror();
      this.onclose();
      this.onmessage();
    } else {
      console.log('你的浏览器不支持 WebSocket');
    }
  }


  onopen() {
    this.ws.onopen = () => {
      console.log('聊天室 onopen');
      this.heartCheck();
    }
  }

  sendMsg({
    msgtype,
    data
  }) {
    this.ws && this.ws.send(JSON.stringify({
      option: msgtype,
      data,
    }));
  }

  onerror() {
    this.ws.onerror = (err) => {
      console.log(err, '聊天室 onerror');
    }
  }

  // 发送消息


  // 手动关闭ws
  close() {
    this.isCustomClose = true;
    this.ws && this.ws.close();
  }

  // 手动销毁ws等实例
  destory() {
    this.close();
    this.ws = null;
    this.eventCenter = null;
  }


  onclose() {
    this.ws.onclose = () => {
      console.log('聊天室 onclose');
      if (this.isCustomClose) return;
      this.reconnection();
    }
  }

  // 接收 WebSocket 消息
  async onmessage() {
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.option == 0) {
          this.heartCheck();
        } else {
          this.eventCenter.emit('chat', data);
        }
      } catch (error) {
        console.log(error, 'error');
      }
    }
  }

  // 事件订阅
  subscribe(eventName, cb) {
    this.eventCenter.on(eventName, cb);
  }

  // 取消订阅
  unsubscribe(eventName, cb) {
    this.eventCenter.off(eventName, cb);
  }

  // 重连
  reconnection() {
    // 防止重复重连
    if (this.isReconnectioning) return;

    if (this.reconnect_count > 5) {
      return this.close()
    }
    
    this.reconnect_count++;
    this.isReconnectioning = true;
    this.reconnectionTimeOutObj && clearTimeout(this.reconnectionTimeOutObj);
    console.log('聊天室 正在重连');
    this.reconnectionTimeOutObj = setTimeout(() => {
      this.createWs();
      this.isReconnectioning = false;
    }, this.reconnectionTimeOut);
  }

  // 心跳检查(每隔一段时间，发送一次心跳，服务端回应之后，重置心跳)
  heartCheck() {
    this.serverTimeOutObj && clearTimeout(this.serverTimeOutObj);
    this.heartBeatTimeOutObj && clearTimeout(this.heartBeatTimeOutObj);
    this.heartBeatTimeOutObj = setTimeout(() => {
      // console.log('聊天室 发送心跳');
      this.sendMsg({
        msgtype: MsgType.HEART_MESSAGE
      });
      this.serverTimeOutObj = setTimeout(() => {
        // 发送心跳后，服务器未响应，手动调用close, close回调重新建立连接
        this.ws && this.ws.close();
      }, this.heartBeatTimeOut);
    }, this.heartBeatTimeOut);
  }
}
