import WsQueue from "src/core/ws/wsQueue.js";
import { WsRev } from "src/core/ws/wsCtr.js";
import WsSendManger from "src/core/ws/ws-send-manger.js";
// import { api_common } from "src/public/api/index.js";
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
    this.ws_send_manger_objs={};
    /* this.mids = "";
    this.interval;
    this.sync_time = this.view.throttle(this.sync_time, 3000); */
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
   * @Description:增加订阅对象
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 14:18:01
   */
  addQueueViewObj(key, obj) {
    this.wsQueue.addQueueViewObj(key, obj)
  }

  /**
 * @Description:清除消费对象
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
    console.log('ws setWsUrl new url:'+url);
    // 未发现该域名,增加到数组中
    if(!this.urls.includes(url)){
      this.urls.unshift(url);
      this.urls = _.uniq(this.urls);
    }
    console.log('this.urls:',JSON.stringify(this.urls));
  }

  /**
   * @Description:重新初始化数据
   * @Author success
   * @param:noAuto-是否手动关闭ws
   * @return:
   * @Date 2020/03/02 17:27:49
   */
  retInitData(noAuto) {
    console.log('-----ws--retInitData----------'+noAuto)
    if(noAuto)
    {
      this.ctr = noAuto;
    }
    if (this.ws) {
      // 清空监听函数
      this.ws.onopen = function (e){};
      this.ws.onclose = function (e){};
      this.ws.onmessage = function (e){};
      this.ws.close();
      this.ws = '';
    }
    //清除心跳包定时器
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
    if(is_close){
      this.run = false;
    }
    if (this.ws) {
      // 清空监听函数
      this.ws.onopen = function (e){};
      this.ws.onclose = function (e){};
      this.ws.onmessage = function (e){};
      this.ws.close();
      this.ws = '';
    }
    //清除心跳包定时器
    if (this.headbeetTimer) {
      clearInterval(this.headbeetTimer);
      this.headbeetTimer = '';
    }
    //停止消费队列
    if (this.wsQueue) {
      this.wsQueue.stop();
    }

    // 销毁ws消息推送管理对象
    for (const key in this.ws_send_manger_objs) {
        const item = this.ws_send_manger_objs[key];
        if(item)
        {
          item.destroy();
        }
    }
    this.ws_send_manger_objs=null;
    // 销毁定时器
    clearTimeout(this.timer_ws);
  }

  /**
   * @description: ws重新连接
   * @param {*} type 操作类型 vue_hidden_to_show:后台转前台时
   */
  connect(type) {
    console.log('-----ws--connect----------'+type)
    if (this.ws) {
      // console.error(`--------readyState:${this.ws.readyState}-----------CONNECTING:${WebSocket.CONNECTING}----------------OPEN:${WebSocket.OPEN}`);
      // ws处于可用状态时,不需要重新创建和连接
      if(this.ws.readyState == WebSocket.CONNECTING || this.ws.readyState == WebSocket.OPEN){
        return;
      }
      // console.log('---------------------------------清空操作-----------------------');
      // 清空监听函数
      this.ws.onopen = function (e){};
      this.ws.onclose = function (e){};
      this.ws.onmessage = function (e){};
      this.ws.close();
      this.ws = '';
    }
    var this_ = this;
    // 获取轮询数组中最前面的url地址
    if(type != 'vue_hidden_to_show' && this.urls.length){
      // console.log(`---------------------------------urls:${JSON.stringify(this.urls)}-----------------------`);
      // 将第一个域名移动到数组最后,并设置给this.url参数
      this.url = this.urls[0];
      this.urls.splice(0,1);
      this.urls.push(this.url)
    }
    try {
      this.ws = new WebSocket(this.url);
      console.log(this.ws);
      console.log(`-----------------------------------new WebSocket---------------------this.url:${this.url}`);
      //打开
      this.ws.onopen = function (e) {
        // console.log('------------------------------------onopen----------------------')
        Ws.err_count = 0;
        this_.onConnect(this_, e)
      };
      //关闭
      this.ws.onclose = function (e) {
        // console.log('------------------------------------onclose----------------------')
        this_.onClose(this_, e)
      };
      //接收消息
      this.ws.onmessage = function (e) {
        // console.log('------------------------------------onmessage----------------------')
        this_.onMessage(this_, e)
      };
    } catch (error) {
      console.error(error);
    }
  }
  //连接ws成功
  onConnect(this_) {
    console.log(`--------------------------------------onConnect---------------------this.url=${this.url}`);
    // 设置ws链接状态
    this_.wsStatus = 1;

    if (this_.wsStatusCall) {
      this_.wsStatusCall(this_.wsStatus)
    }
    if (!this_.headbeetTimer) {
      clearInterval(this_.headbeetTimer);
      this_.headbeetTimer = setInterval(() => {
        // 发送心跳包命令
        this_.sendMsg({ "cmd": "C0" });
      }, this_.HEARTBEAT_TIME);
    }
  }
  onClose(this_) {
    console.log(`--------------------------------------onClose------------this.url=${this.url}`);
    // 设置ws链接状态
    this_.wsStatus = 0;
    if (this_.wsStatusCall) {
      this_.wsStatusCall(this_.wsStatus)
    }
    this_.retInitData();
    // 不允许执行时阻止自动重启功能
    if(!this.run){
      return;
    }
    console.log(`--------------------------------------onClose------------this.url=${this.url}----------this.ctr = ${this.ctr}`);
    // 发送api域名切换命令命令
    if(!this.ctr)
    {
      this.view.$root.$emit('EMIT_API_DOMAIN_UPD_CMD',{type:'ws', data:{url:this.url}});
    }
    this.ctr = false;
    if (!this_.wsStatus && document.visibilityState == 'visible') {
      Ws.err_count++;
      clearTimeout(this.timer_ws);
      if(Ws.err_count>10)
      {
        // 10秒后再连接
        this.timer_ws = setTimeout(() => {
          this_.connect();
        }, 10000);
      } else{
        // 3秒后再连接
        this.timer_ws = setTimeout(() => {
          this_.connect();
        }, 3000);
      }
    }
  }

  /**
   * @Description:发送ws 消息
   * @Author success
   * @param:
   * @return:
   * @Date 2020/03/02 17:36:09
   */
  sendMsg(msg) {
    try {
      if (this.ws && this.ws.readyState == 1) {
        // 对特殊命令进行统一管理处理发送
        switch (msg.cmd) {
          case 'C8':
            // 是否一条一条发送
            if(!msg.one_send){
              if(!this.ws_send_manger_objs[msg.cmd])
              {
                this.ws_send_manger_objs[msg.cmd] = new WsSendManger(this.view, msg.cmd);
              }
              // 增加缓存信息,并获取组装后信息
              msg = this.ws_send_manger_objs[msg.cmd].push_obj(msg.key, msg);
              // this.mids = msg.mid;
            }
           /*  if(this.interval) {
              clearInterval(this.interval);
            }
            this.interval = setInterval(()=>{
              this.sync_time(this.ws_send_manger_objs[msg.cmd]);
            }, 1000); */
            break;
          default:
            break;
        }
        if(window.vue) {
          try {
            msg.requestId = window.vue.$store.getters.get_user.token || sessionStorage.getItem('pc_token');
          } catch (error) {
            console.error(error)
          }
        }
        console.log(`---WS SEND MSG---:${JSON.stringify(msg)}`);
        if(window.wslog && window.wslog.sendMsg){
          window.wslog.sendMsg('WS---S:', msg)
        }
        if(this.ws){
          this.ws.send(JSON.stringify(msg));
        }
      }
    } catch (error) {
      console.log(`ws send error! data:${JSON.stringify(msg)}`);
    }
  }

  onMessage(this_, e) {
    let msg = e.data;
    // console.log(`---WS REV  MSG---:${msg}`);
    try {
      if(window.wslog && window.wslog.sendMsg){
        window.wslog.sendMsg('WS---R:', msg)
        // console.log('------------------------------------onMessage----------------------'+msg)
      }
      WsRev.wsRevMsg(this_, JSON.parse(msg));
    } catch (error) {
      console.log('=======websocket服务器返回数据错误=======' + msg);
    }
    // this_.pushWsQueueMsg(msg);
  }


  /**
   * @Description:客户端伪造指令使用(伪造消息要求必须以C0开头)
   * @Author success
   * @param: e-{data:jsonText}
   * @return:
   * @Date 2020/06/12 11:51:32
   */
  customWsCmdData(data) {
    // 使用demo
    // let msg = {"cd":{"hls":[{"hid":"1271012027129176066","hpid":"2","hs":0,"mid":"826414","ol":[{"obv":"285000","oid":"1271015140590395393","os":1,"ot":"Over","ov":"288000"},{"obv":"123000","oid":"1271015140716224514","os":1,"ot":"Under","ov":"123000"}]}],"mid":"826414"},"cmd":"C0105","ctsp":"1591868727453","ld":"ac12b2f6202006111745253233007be6"};
    // if(window.ws)
    // {
    //   window.ws.customWsCmdData(msg)
    // }
    this.pushWsQueueMsg(data);
  }
  /**
   * @description: http同步赛事时间
   * @param {Object} ws_send_manger 对象
   */
  sync_time(ws_send_manger) {
    let mids = '';
    if(ws_send_manger.cmd == 'C8')
    {
      let obj_ = ws_send_manger.obj;
      if(obj_){
        let mid_arr = [];
        for(const key in obj_) {
          if(obj_[key] && obj_[key].mid) {
            const matchs = obj_[key].mid;
            for (const mid_ in matchs) {
              const match = matchs[mid_];
              if (match) {
                if(match.csid==2 && match.mess==0 && ([1,2,7,10,110].includes(match.ms))){
                  // 是篮球,是滚球的时候,倒计时停表的时候
                  mid_arr.push(match.mid);
                }
              }
            }
          }
        }
        if(mid_arr.length){
          mid_arr = _.uniq(mid_arr);
          mids = mid_arr.join(",");
        }
      }
    }
    // if(mids){
    //   api_common.match_event({ mids }).then(res => {
    //     let code = _.get(res, 'data.code');
    //     let ctsp = _.get(res, 'data.ts');
    //     if(code==200) {
    //       let data = _.get(res, 'data.data');
    //       let ts_http = _.get(res, 'data.ts_http');
    //       // 接口响应必须在1S内才进行C102的发送
    //       if(data && data instanceof Array && ts_http < 1000) {
    //         _.forEach(data, item=>{
    //           item.ctsp = ctsp;
    //           this.view.yabo_common.update_match_time(item);
    //         });
    //       }
    //     }
    //   }).catch(error =>{
    //     console.log('=======调用接口获取赛事时间失败=======' + error);
    //   })
    // }
  }
}
