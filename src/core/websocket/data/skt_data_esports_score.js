/*
 * @Author: Sword
 * @Date: 2021-09-29 20:20:29
 * @Description:  websocket数据页面数电竞右侧赛事比分列表
 * @Path: 
 */
// 发送websocket命令时使用
import { WsSend } from "src/core/data-warehouse/ws/ws-ctr/ws-ctr.js";
import { mapGetters } from "vuex";
import global_mixin from "src/public/mixins/global/global_mixin.js";
import betting from "src/public/mixins/betting/betting.js";
export default {
  mixins: [global_mixin,betting],
  data() {
    return {
      // ws 推送使用timeout
      timer_obj: {}
    }
  },
  computed: {
    ...mapGetters({
      // socket状态
      socket_status: 'get_socket_status',
      // 用户id      
      vx_get_uid: "get_uid",
      // 用户信息
      vx_get_user: "get_user"
    }),
    /**
     * @description: 赛事id集合
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    match_ids() {
      let mIds = [];
      let list = this.match_ctr.list;
      if (list && list.length) {
        list.forEach(item => {
          mIds.push(item.mid);
        });
      }
      return mIds.toString();
    }    
  },
  created() {
    //1秒节流C8指令
    this.SCMD_C8 = this.debounce(this.SCMD_C8,1000);    
  },
  mounted() {
    // ws推送socket名称
    let socket_name = this.socket_name || 'esport_score_list';
    //ws存在
    if(window.ws){  
      //增加消费对象    
      window.ws.addQueueViewObj(socket_name, this);
    }
  },
  methods: {
    /**
     * @description: 是否继续发送socket命令进行初始化
     * @param {Number} count 发送第几次了
     * @return {undefined} undefined
     */
    continueSendSocketInit(count) {
      clearTimeout(this.timer_obj['continue_send']);
      this.timer_obj['continue_send'] = setTimeout(() => { 
        if(this.skt_mid && _.keys(this.skt_mid).length == 0 && count < 5) {
          count++
          //console.log(`=======================================count:${count}`);
          this.continueSendSocketInit(count);
        }   
        //发送启动命令      
        this.sendSocketInitCmd();
      }, 500);
    },
    /**
     * @description: 发送启动命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketInitCmd() {
      clearTimeout(this.timer_obj['send_socket_init']);
      this.timer_obj['send_socket_init'] = setTimeout(() => {
        // 发送赛状态订阅息命令C1
        //this.SCMD_C1();
        // 当前为首页的时候订阅(h_match_list)
        if(this.vx_layout_cur_page.cur=="home") {
          // socket订阅 C8
          this.SCMD_C8("h_match_list");
        } else {
          // socket订阅 C8
          this.SCMD_C8();
        }
      }, 0);
    },
    /**
     * @description: 发送关闭命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketCloseCmd() {
      // 发送赛状态订阅息命令C1
      WsSend.sktCancelSend(window.ws, "C8");
    },  
    /**
     * C101 数据
     * `mid` 赛事Id
     * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
     * @description: 赛事状态
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
     RCMD_C101(obj) {
      //console.log('-----------------赛事状态C101------------obj:' + JSON.stringify(obj));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || (!this.match_ctr.mid_obj[obj.cd.mid])) {
        return;
      }
      let skt_data = obj.cd;
      // 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断 110 即将开赛
      if([3, 4, 5, 6, 7, 9].includes(skt_data.ms)) {
        //获取列表接口
        this.get_match_list();
      }
    },
    /**
     * C102 推送数据
     * `mid` 赛事Id
     * `mst` 比赛进行时间/比赛剩余时间
     * `cmec` 事件编码
     * `cmes` 事件状态 0:未取消 1:被取消
     * `mat` 发球方,主队发球 home，客队发球：away
     * `mmp` 
     * `mess` 开始结束状态 1:start 0:stop此字段只适用于特定事件编码）篮球暂停事件编码=time_start  现阶段只关注0、 1 其它值不必关注
     * `mct` 当前节/盘/局
     * `mbhn` 好球数（棒球专用）
     * `mbkn` 坏球数（棒球专用）
     * `mbcn` 出局数（棒球专用）
     * `mbolp` 一垒  0:未占用  1:已占用（棒球专用）
     * `mbtlp` 二垒 0:未占用  1:已占用（棒球专用）
     * `mbthlp` 三垒 0:未占用  1:已占用（棒球专用）
     * `mststs` 是否补时 0未开,1开
     * `mststi` 补时固定时间：比如补5分钟
     * @description: 赛事事件
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
     RCMD_C102(obj) {
      //console.log('-----------------赛事事件C102------------obj:' + JSON.stringify(obj));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || (!this.match_ctr.mid_obj[obj.cd.mid])) {
        return;
      }
      let skt_data = obj.cd;
      //console.log('合并数据前' + JSON.stringify(this.mid_obj[skt_data.mid]));
      if (skt_data.mmp == "999") {   
        //获取赛事列表      
        this.get_match_list();
      }      
      //console.log('合并数据后' + JSON.stringify(this.mid_obj[skt_data.mid]));
    },  
    /**
     *  C103 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `msc` 比分
     * @description: 赛事比分
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C103(obj) {
      //console.log('-------------skt_data_list----赛事比分C103------------obj:' + JSON.stringify(obj));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || !this.match_ctr.mid_obj[obj.cd.mid]) {
        return;
      }
      let skt_data = obj.cd;  
      let score_obj = _.cloneDeep(this.match_ctr.mid_obj[skt_data.mid].msc);
      let skt_score_obj = this.$utils.serialized_score(_.get(skt_data,'msc',[]))
      Object.assign(score_obj, skt_score_obj);
      Object.assign(this.match_ctr.mid_obj[skt_data.mid], {msc:score_obj});  
      this.match_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);
      // console.log('合并数据后' + JSON.stringify(this.match_ctr.mid_obj[skt_data.mid].msc));
    },
    /**
     * C104 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `mhs` 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
     * `ms` 赛事状态  0:未开赛  1:滚球
     * @description: 赛事级盘口状态推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C104(obj) {
      // mid:赛事Id hs: 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）      
      //console.log('-----------------盘口状态C104------------obj:' + JSON.stringify(obj));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || !this.match_ctr.mid_obj[obj.cd.mid]) {
        return;
      }
      if (skt_data.mhs == 2) {
        this.get_match_list();
      }
    },
    /**
     *  C302 推送数据
     * `mid` 赛事Id
     * `ms` 赛事状态：0未开赛 1开赛
     * `csid` 球种id
     * @description: 赛事开赛状态
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
     RCMD_C302(obj) {
      //数据不存在
      if (!obj) {
        return;
      }
      let skt_data = obj.cd;
      //console.log('-----------------赛事开赛通知状态C302------------obj:' + JSON.stringify(obj));
      // 0、未开赛 1、开赛
      if (skt_data.ms == 1) {
        this.get_match_list();
      }
    },
    /**
     *  C8 参数说明
     * `cufm` 赛事列表、详细在同一页面标识，传入"m"。赛事列表、详细不同页面不需要此字段
     * `marketLevel` 0:默认行情等级，1:信用网等级
     * `list` 要订阅的赛事玩法对象
     * `mid` 赛事Id
     * `hid` 盘口Id，多个玩法Id用逗号分隔。订阅所有玩法用"*"
     * `说明:` 订阅后会推送C101,C102,C103,C105,C107,C110,C113,C114,C115,C303,C304,C305,C801
     * @description: 赛事订阅(C1)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
     SCMD_C8(key='match_list') {  
      let obj = {};
      obj.key = key;
      // 订阅的模块
      obj.module = _.get(this.match_ctr,'_module', 'match_list');
      // 要订阅赛事及玩法获取
      obj.list = this.get_c8_list();      
      obj.one_send = false; 
      obj.cufm = "L";
      // 用户信用等级获取
      obj.marketLevel = _.get(this.vx_get_user, 'marketLevel', '0');
      //处理逻辑
      if(obj.list.length>0) {
        WsSend.sktSendMatchStatus(window.ws, obj);
      }      
    },
    /**
     * @description: C8的List部分获取
     * @param {*}
     * @return {*}
     */
    get_c8_list() {
      let list = [];
      _.forEach(this.skt_mid, item => {      
        let mid = "", hpid="*";
        mid = item.mid;
        if(_.isArray(item.hpids) && item.hpids.length>0 && !item.hpids.includes("*")) {
          hpid = item.hpids.join(',')
        }        
        let obj = { mid, hpid  }; // level：2 值针对C303
        list.push(obj);
      });    
      return list;
    }
  },
  watch: {
    /**
     * @description: 监控socket状态
     * @param {String} status 状态
     * @return {undefined} undefined
     */
    socket_status(status) {    
      // 监听sockect连接状态
      if (status) { //当sockect重新连接时自动发送消息
        if(status == 2){
          // 拉取全量接口
          this.get_match_list();
        }
        this.SCMD_C8("match_list");
      }
    },
    /**
     * @description: 监控赛事id
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    match_ids: {
      handler() {
        //console.log(`=================================================${this.skt_mid}`);
        if(this.skt_mid) {
          //发送启动命令
          this.sendSocketInitCmd();
        }  
      },
      immediate: true
    } 
  },
  destroyed() {
    // 清除定时器
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    // 清空定时器对象
    this.timer_obj = {};
    // 取消防抖
    this.debounce_throttle_cancel(this.SCMD_C8);
    // 取消订阅
    this.sendSocketCloseCmd();
    //清除消费对象
    if(window.ws){     
      let socket_name = this.socket_name || 'skt_data_list_hot';
      window.ws.removeQueueViewObj(socket_name);
    }
  }
}