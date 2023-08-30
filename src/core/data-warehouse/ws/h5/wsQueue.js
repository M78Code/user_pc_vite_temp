/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: ws 消息队列
 */
 

import sleep from  "licia/sleep"  
import Queue from  "licia/Queue"  
export default class WsQueue {
  /**
   * @Description:构造函数
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:02:53
   */
  constructor(view) {
    // 消息消费开关
    this.run = true;
    // 加载对象页面
    this.view = view;
    // 消费列表对象
    this.listObj = {};
    // 创建消息队列
    this.queue = new Queue();
  }

  /**
   * @Description:增加消费对象
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:18:01
   */
  addQueueViewObj(key, obj) {
    this.listObj[key] = obj;
  }

  /**
   * @Description:删除消费对象
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:23:26
   */
  removeQueueViewObj(key) {
    delete this.listObj[key];
  }

  /**
   * @Description:增加消息队列数据
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:05:05
   */
  pushMsg(obj) {
    // msg_obj = JSON.parse(str);
    this.queue.enqueue(obj);
  }

  /**
   * @Description:停止消费队列
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:14:19
   */
  stop() {
    this.run = false;
    this.queue.clear();
  }

  start() {
    // // 消费一条记录
    // this.queue.dequeue();
    // // 获取队列中的记录总数
    // this.queue.size;
    (async () => {
      var msg_obj = '';
      var fun = '';
      while (this.run) {
        // 消费一条记录
        msg_obj = this.queue.dequeue();
        if (msg_obj && msg_obj != undefined) {
          for (const key in this.listObj) {
            if (this.listObj[key]) {
              try {
                fun = `RCMD_${msg_obj.cmd}`;
                if (this.listObj[key][fun]) {
                  this.listObj[key][fun](msg_obj);
                }
              } catch (error) {
                if (window.wslog && window.wslog.sendMsg) {
                  window.wslog.sendMsg('WS---E:', { cmd: msg_obj.cmd, err: error.stack });
                }
                // console.log(`======= 消费记录时异常 ======RCMD_${msg_obj.cmd}`);
                console.error(error);
              }
            } else {
              delete this.listObj[key];
            }
          }
        }

        if (this.queue.size == 0) {
          await sleep(200);
        } else {
          if (document.visibilityState == 'visible') {
            await sleep(10);
          }
        }
      }
    })();
  }
}

