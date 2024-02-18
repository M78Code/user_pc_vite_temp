/*
 * @Author: hanmar
 * @Description: ws 消息队列
 */
import licia from "licia";
import { wslog } from "src/core/log/";
export default class WsQueue {
  /**
   * @Description:构造函数
   * @param:
   */
  constructor() {
    // 消息消费开关
    this.run = true;
    // 创建消息队列
    this.queue = new licia.Queue();
  }


  /**
   * @Description:增加消息队列数据
   * @param: obj 消息体
   * @return:
   */
  push_msg(obj) {
    this.queue.enqueue(obj);
  }

  /**
   * @Description:停止消费队列
   * @return:
   */
  stop() {
    this.run = false;
    this.queue.clear();
  }

   /**
   * @Description:开始消费队列
   * @return:
   */
  start() {
    // // 消费一条记录
    // this.queue.dequeue();
    // // 获取队列中的记录总数
    // this.queue.size;
    (async () => {
      // var count = 0;
      var msg_obj = '';
      while (this.run) {
        // 消费一条记录
        msg_obj = this.queue.dequeue();
        if (msg_obj && msg_obj != undefined) {
          try {
            // 打印收到的消息
            window.wsmsg && console.log(`WS MSG REV ---:${JSON.stringify(msg_obj)}`);
            // 广播消费信息
            window.postMessage({event: 'WS', cmd:`WS_MSG_REV`, data:msg_obj},'*');
          } catch (error) {
            console.error(error);
            // 增加错误信息到日志系统中
            if (wslog && wslog.send_msg) {
              wslog.send_msg('WS---E:', { cmd: msg_obj.cmd, err: error.stack });
            }
          }
        }
        if (this.queue.size == 0) {
          // 队列无数据时,休眠200毫秒
          await licia.sleep(200);
        } else {
          if (document.visibilityState == 'visible') {
            // 页面显示时,休眠10毫秒
            await licia.sleep(10);
          }
        }
      }
    })();
  }
}
