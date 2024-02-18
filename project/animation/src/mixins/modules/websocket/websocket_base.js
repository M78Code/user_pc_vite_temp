/*
 * @Date           : 2019-12-13 16:22:21
 * @FilePath     : /system-monitor-kanban/src/store/module/websocket/websocket_base.js
 * @description    :websocket
 */

import { uid } from "quasar";

export default {
  data() {
    return {
      uuid: "",
      time: {
        1: 5000,
        2: 5000,
        3: 15000,  // 心跳多久发一次
      },
      timer: { // 心跳计数
        1: null,
        2: null,
        3: "",
      },
      onerror_timer: {  // 重连的计时器
        1: null,
        2: null,
        3: "",
      },
      websockect_obj: {
        1: [],
        2: [],
        3: [],
      },
      websocket_connection_1: null, // socket实例
      websocket_connection_1_url: "", // socket 1的地址
      websocket_connection_2: null, // socket实例
      websocket_connection_2_url: "", // socket 2的地址
      websocket_connection_3: null, // socket实例
      websocket_connection_3_url: "", // socket 3的地址
      // 重连次数（连接一直失败时，用来判断重连失败）
      reconnection_number: 0,
      // 心跳计时 三次无响应 --- 进行重连
      heartbeat_number: 0,
      // 请求发送成功状态
      send_status: true,
      // 请求相应计数器 一个心跳内没收到请求相应 则视为参数发送失败
      sending_number: 0, // 发送次数
      max_reconnection_number: 10,  // 最大重连次数
    };
  },
  methods: {
    set_websocket_data(which,data) {

    },
    /**
     * @description: 连接socket
     * @param {Number} which
     */
    websocket_connection_connect(which) {
      //调用websocket入口方法
      this.websocket_connect(this[`websocket_connection_${which}_url`], which);
      this.websocket_connect_init(which);
    },
    /**
     * @description: 关闭socket
     * @param {Number} which
     */
    websocket_connection_close(which) {
      if (this[`websocket_connection_${which}`]) {
        this[`websocket_connection_${which}`].close();
        this[`websocket_connection_${which}`] = null;
      }
    },
    /**
     * @description: 初始化连接socket
     * @param {String} connectionUrl
     * @param {Number} which
     */
    websocket_connect(connectionUrl, which) {
      //websocket实例化 建立
      /**
       *
       * opts :  自定义 控制阀等
       *
       */
      if (!connectionUrl || !which) {
        return;
      }
      this[`websocket_connection_${which}`] = new WebSocket(connectionUrl); //动态赋值给websocket_connection_$变量  对象

    },
    websocket_send_heartbeat(item) {
      /**
       * 心跳包
       */
      if (!item && typeof item != "object") return;
      let { which } = item;
      if (this[`websocket_connection_${which}`] && this.timer) {
        let params = {
          uuid: this.uuid,
          // lang: sessionStorage.getItem("i18n") || "zs",  // 当前语言环境
          commands:[300],
          timestamp:Date.parse(new Date()),
        };
        
        // WS连接状态
        let ws_s = this.check_websocket_online({ websocket: this[`websocket_connection_${which}`]})
        // 判断ws连接状态  连接异常 进行重连
        if (ws_s){
          this.websocket_send(params, which);
          if (this.timer[which]){
            clearTimeout(this.timer[which]);
          }
          // 请求发送中 一个心跳内没收到请求相应 则视为参数发送失败
          if(this.sending && this.sending_number > 1) {
            // 请求发送成功状态(失败)
            this.send_status = false
            // 请求是否正在发送中（否）
            this.sending = false
            // 参数请求计数器清空
            this.sending_number = 0
          }
          // 心跳没收到回应 出现3次 进行重连--------
          if(this.heartbeat_number > 2) {
            // 清空timer
            clearTimeout(this.timer[which])
            this.websocket_connection_close(which);  // 关闭ws 和  清空timer  这两步必备
            // 进入onerror流程  进行重连
            this.websocket_onerror(which);
            return
          }
          this.timer[which] = setTimeout(() => {
            // 心跳计数
            this.heartbeat_number++
            // 请求发送中计数器
            this.sending && this.sending_number++
            this.websocket_send_heartbeat({ which });
            // this.set_socket_2_close()
          }, this.time[which]);  // 多久发一次心跳

        }else{
          clearTimeout(this.timer[which]);
          this.websocket_connection_close(which);
          this.websocket_onerror(which);
        }
      }
    },
    // 检测ws是否正常连接
    check_websocket_online(item) {
      let { websocket } = item;
      if (!websocket || !(websocket instanceof WebSocket)) return false;
      return websocket.readyState === websocket.OPEN;
    },
    websockt_fn(which){ //默认连接成功回调函数
        console.log(123456,'ws创建成功',which)
    },
    /**
     * @description: 初始化连接
     * @param {Number} which
     */
    websocket_connect_init(which) {
      //初始化websocket_connection_$四个API方法
      this[`websocket_connection_${which}`].onopen = event => {
        //连接websocket
        this.websocket_onopen(event, which);
        this.websockt_fn(which)
        // this.websockt_fn(which)
        sessionStorage.setItem("ws_init", true);

        // 清空重连次数
        this.reconnection_number = 0
        // 清空心跳计数
        this.heartbeat_number = 0
      };
      this[`websocket_connection_${which}`].onclose = event => {
        //关闭websocket
        console.log( 'xxxxxxxxxxxxx' )
      };
      this[`websocket_connection_${which}`].onerror = event => {
        console.error('-----WS----连接错误')
        //websocket连接错误
        this.websocket_onerror(which); // 连接错误 进入重连
      };
      this[`websocket_connection_${which}`].onmessage = event => {
        //获取websocket消息  然后将数据存入vuex
        this.websocket_onmessage(event, which);
        // 收到任何消息 ---- 清空心跳计数
        this.heartbeat_number = 0
        // 请求参数发送中时对应逻辑-------------
        if(this.sending) {
          // 获取相应状态
          let data = JSON.parse(this.$lodash.get(event, "data"))
          let responseData = data.responseData
          let succeed = this.$lodash.get(responseData, "succeed")
          // 非参数请求相应消息
          if(!succeed) return
          // needCommands（在使用组件定义） WS请求对应接口【及时注单: 30006】
          else {
            // 收到参数请求响应 改变请求状态
            this.sending = false
            // 收到参数请求响应 参数响应计数器清空
            this.sending_number = 0
            // 收到参数请求响应 参数发送成功
            this.send_status = true
          }
        }
      };
    },
    /**
     * @description: 发送消息
     * @param {Object} params
     * @param {Number} which
     */
    websocket_send(params, which) {
      //websocket 传参
      if (!which) {
        return;
      }

      params.uuid = this.uuid;
      if (this[`websocket_connection_${which}`]) {
        //websocket 连接已存在 则发送uuid
        this[`websocket_connection_${which}`].send(JSON.stringify(params));
      } else {
        //websocket不存在则再次发送调用websocket入口方法
        this.websocket_connection_connect(which);
        // this.websocket_send(params, which);
      }
    },
    /**
     * @description: socket开启时处理函数 
     * @param {Object} event
     * @return {Number} which
     */
    websocket_onopen(event, which) {
      // 处理未连接收集的数组
      if (this.websockect_obj && Array.isArray(this.websockect_obj[which])) {
        let arr = this.websockect_obj[which],
          len = arr.length;
        while (len > 0) {
          let fn = arr.shift();
          len = arr.length;
          if (typeof fn == "function") {
            fn();
          }
        }
      }
      this.websocket_send_heartbeat({ type: 0, which });
    },
    /**
     * @description: socket通信时处理函数 
     * @param {Object} event
     * @return {Number} which
     */
    websocket_onmessage(event, which) {
      /**
       * 存入 vuex ,
       * 在 vuex 中  初次分流
       *
       */
      setTimeout(() => {
        this.set_websocket_data({
          data: event.data
        });
      }, 100);
    },
    // get_websocket_data_() { },
    // 连接异常后  进入重连
    websocket_onerror(which) {
      console.error('ws重连次数------', this.reconnection_number)
      clearTimeout(this.onerror_timer[which])

      // if(this.reconnection_number > 10) {  // 连接超过10次就不在连接了
      //   this.websocket_connection_close(which)
      //   // 超过最大可连接次数
      //   return
      // }

      this.onerror_timer[which] = setTimeout(() => {
        // 生成新的uuid
        this.uuid = uid()
        this.websocket_connection_connect(which);
        // 重新连接次数 +1
        this.reconnection_number++
      }, 2000);  // 多久重连一次
    }
  },
  /**
   * @description: 初始化页面id
   */
  created() {
    this.uuid = uid();
  },
  /**
   * @description: 销毁socket
   */
  destroyed() {
    if (this.websocket_connection_1) {
      this.websocket_connection_close(1);
    }
    if (this.websocket_connection_2) {
      this.websocket_connection_close(2);
    }
    if (this.websocket_connection_3) {
      this.websocket_connection_close(3);
    }
  }
};
