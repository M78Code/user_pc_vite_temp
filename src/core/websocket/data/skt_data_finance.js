/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: websocket数据页面数据接入----账务消息推送处理
 */
export default {
  // mixins: [skt],
  data() {
    return {
      model: '',//标识使用模块名称
      C108_timer:null, // c108命令用到的定时器
    }
  },
  mounted() {
    if(window.ws){
      //增加消费对象
      window.ws.addQueueViewObj('skt_data_finance', this);
    }
  },
  methods: {
    /**
     * C108 数据
     * cd{}
     * @description: 账务推送(C108)(非订阅类)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    RCMD_C108(obj) {
      //数据不存在
      if (!obj) {
        return;
      }
      // let skt_data = obj.cd;
      // 列表页面更新所有菜单和列表信息(结算日期发生变化)
      clearTimeout(this.C108_timer);
      this.C108_timer = setTimeout(() => {
        // 账务推送收到命令后,随机5分钟内刷新页面
        window.location.reload();
      }, parseInt((Math.random()*100000)%300)*1000);
      
    },
  },
  destroyed: function () {
    if(window.ws) {
      //清除消费对象
      window.ws.removeQueueViewObj('skt_data_finance');
    }
    //清除延时器
    clearTimeout(this.C108_timer);
  }
}
