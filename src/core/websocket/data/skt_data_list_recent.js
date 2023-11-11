/*
 * @Author: Sword
 * @Date: 2020-08-06 15:54:31
 * @Description: websocket数据页面数据接入 ---- 近期关注
 */
import { WsSend } from "src/core/data-warehouse/ws/ws-ctr/ws-ctr.js";
import { mapGetters } from "vuex";
import global_mixin from "src/core/global/mixin/global_mixin.js";
import betting from "src/public/mixins/betting/betting.js";
import play_mapping from "src/public/config/mapping/play_mapping";
export default {
  mixins: [global_mixin, betting],
  data() {
    return {
      play_mapping: {}, //玩法集
      timer_obj: {}  // 延时器集合
    }
  },
  computed: {
    ...mapGetters({
      socket_status: 'get_socket_status', // socket状态
      vx_get_uid: "get_uid",    // 用户id     
      vx_get_user: "get_user",    // 用户信息
      vx_layout_list_type: "get_layout_list_type",   //列表信息
      get_is_handle: "get_is_handle", // 有使用不在文件
      vx_get_is_single_handle: "get_is_single_handle", //设置列表显示内容  match:赛事 collect:收藏 search:搜索
      lang: 'get_lang',  //语言包
    }),
    /**
     * @description: 赛事id
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    match_ids() {
      let mIds = [];
      if (this.match_ctr.list && this.match_ctr.list.length) {
        this.match_ctr.list.forEach(item => {
          mIds.push(item.mid);
        });
      }
      // console.log(`=====================================match_ids:${mIds.toString()}`);
      return mIds.toString();
    }    
  },
  created() {
    this.play_mapping = play_mapping;
    //防抖 
    this.SCMD_C8 = this.debounce(this.SCMD_C8, 1000);   
    this.debounce_get_history = this.debounce(this.get_history, 5000);
  },
  mounted() {
    //初始话socket
    this.sendSocketInitCmd();
    let socket_name = this.socket_name || 'skt_data_list';
    if(window.ws)
    {  
      //注册    
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
        if(this.vx_layout_cur_page.cur == "home") {
          // socket订阅
          this.SCMD_C8("h_match_list");
        } else {
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
      // 重新订阅赛事详情
      this.$root.$emit(this.emit_cmd.EMIT_MATCH_DETAIL_SUBSCRIBE);
    },
    /**
     *  C101 数据
     * `mid` 赛事Id
     * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
     * @description: 赛事状态
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
     RCMD_C101(obj) {
      // console.log('-----------------赛事状态C101------------obj:' + JSON.stringify(obj));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || !this.match_ctr.mid_obj[obj.cd.mid]) {
        return;
      }
      let skt_data = obj.cd;      
      // 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断 110 即将开赛
      if([0, 1, 2, 7, 10, 110].includes(skt_data.ms)) {
        Object.assign(this.match_ctr.mid_obj[skt_data.mid], { ms: skt_data.ms });
        //设置赛事信息时间对象
        this.match_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);
      } else {
        //更新投注项状态
        this.yabo_common.update_bet_item_status(this, {
          mid: skt_data.mid,
          status: 2
        });
        // 拉取全量接口
        this.debounce_get_history();
      }
    },
    /**     
     *  C102 推送数据
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
      if (!obj || !this.match_ctr.mid_obj[obj.cd.mid]) {
        return;
      }
      let skt_data = obj.cd;
      let cur_match = this.match_ctr.mid_obj[skt_data.mid];
      //console.log('合并数据前' + JSON.stringify(this.mid_obj[skt_data.mid]));
      if (skt_data.mmp != "999") {
         // 非足球,而且赛事阶段切换的时候拉取接口(并且不是内部发送的命令,内部发送会有send字段值为my_self)    
         let check_result = this.get_phase_result(cur_match.csid, skt_data.mmp); // 获取该阶段是否进行接口查询
         // 非足球球种在赛事阶段变化时拉取接口(该推送不是自己模拟发送的)
         if(cur_match.csid != 1 && skt_data.mmp != cur_match.mmp && check_result && !skt_data.send) {
           //获取轮播数据
           this.get_hots();
         } else {
          // 移除模拟发送参数标识
          delete skt_data.send;
          Object.assign(cur_match, skt_data);
           // 记录当前赛事的时间戳
          this.match_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);
         }
      } else {   
        // 同步投注项的状态为无效
        this.yabo_common.update_bet_item_status(this, {
          mid: skt_data.mid,
          status: 2
        }); 
        //拉取全量接口
        this.debounce_get_history();     
      } 
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
      skt_data.msc.forEach(msc_item => {
        // 检查比分格式
        let check_msc_item =  msc_item && msc_item.includes('|') && msc_item.includes(':');
        if(check_msc_item) {
          // 从比分字段中解析主客队的比分
          let msc_arr = msc_item.split('|');
          let name = msc_arr[0];
          let team = msc_arr[1];
          let home = team.split(':')[0];
          let away = team.split(':')[1]
          let obj = {};
          obj[name] = {
            home,
            away
          }        
          Object.assign(score_obj, obj);
        }        
      });
      // 合并比分对象(数据)   
      Object.assign(this.match_ctr.mid_obj[skt_data.mid], {msc:score_obj}); 
      // 记录当前赛事的时间戳
      this.match_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);   
      return;
      // 足球、篮球、棒球、乒乓球、排球
      if([1,2,3,8,9].includes(skt_data.csid*1)) {
        // 同步比分
        this.yabo_common.update_bet_score(this, skt_data.mid, this.socket_name);
        } 
      //console.log('合并数据后' + JSON.stringify(cur_match.msc));
    },
    /**
     *  C104 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `mhs` 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
     * `ms` 赛事状态  0:未开赛  1:滚球
     * @description: 赛事级盘口状态推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C104(obj) {
      // mid:赛事Id mhs: 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
      //数据不存在或者数据存在不是当前赛事
      if (!obj || (!this.match_ctr.mid_obj[obj.cd.mid])) {
        return;
      }
      let skt_data = obj.cd;      
      // 赛事状态 0:active 开, 1:suspended 封, 2:deactivated 关
      if(skt_data.mhs == 0 ){    
        // 开的时候拉取http请求
        this.debounce_get_history(()=>{          
          this.yabo_common.sync_bet_obj(this,skt_data);
        });  
      } else if(skt_data.mhs == 1 || skt_data.mhs == 11){ // 封或锁盘 
        // 设置页面赛事级盘口状态
        this.match_ctr.set_match_mhs_status(skt_data.mid, skt_data.mhs);
        // 记录当前赛事的时间戳
        this.match_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);
      } else if(skt_data.mhs == 2){
        // 同步投注项数据
        this.yabo_common.update_bet_item_status(this,{
          mid: skt_data.mid,
          hid: skt_data.hid,
          status: skt_data.mhs
        });
        this.match_info_ctr.clear_data();
        //拉取接口
        this.debounce_get_history();
      }
    },
    /**
     *  C105 推送数据
     * `hls` 盘口集合
     * `mid` 赛事Id
     * `hid` 盘口Id
     * `hpid` 玩法Id
     * `hs` 盘口状态 0:开盘 1:封盘 2:关盘 11:锁盘
     * `hn` 坑位 1:表示主盘，2:表示第一副盘，以此类推
     * `hps` 基准分S1|0:0  不存在基准分则不传输该字段
     * `hmt` 盘口类型 1:赛前盘 0:滚球盘
     * @description: 盘口赔率
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C105(obj) {   
      //数据不存在且当前赛事数据不存在
      if (!obj && !this.match_ctr.mid_obj[obj.cd.mid]) {
        return;
      }
      let skt_data = obj.cd.hls;
      let obj1 = null;
      let hs = 0;   
      let ol = null;
      let sd = skt_data.length; 
      if(skt_data && sd) {     
        for(let i = 0; i< sd; i++) {
          obj1 = skt_data[i];
          if(obj1 && obj1.mid && !this.match_ctr.mid_obj[obj1.mid]) {
            continue;
          }
          hs = obj1.hs ? obj1.hs : 0;
          // 设置盘口状态
          this.match_ctr.set_match_hs_status(obj1.hid, hs);
          // 盘口类型合并0:滚球盘 1:赛前盘
          this.match_ctr.set_match_hmt(obj1.hid, obj1.hmt);
          ol = obj1.ol;   
          let l = ol.length    
          if(ol && l) {
            for(let j = 0; j < l; j++) {
              let obj2 = ol[j];              
              if(obj2) {
                // 设置投注项状态合并投注项数据
                this.match_ctr.set_match_ol_data(obj2);
              }
            }
          }
        }
      }      
    }, 
    /**
     *  109 推送数据
     * `mid` 赛事Id
     * `hs` 盘口状态
     * `csid` 球种Id
     * `ms` 赛事状态 赛事状态 0:未开赛 1:滚球 110:即将开赛
     * @description: 赛事级开盘推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */   
    RCMD_C109(obj) {
      //数据不存在
      if (!obj) {
        return;
      }   
      let type_name = this.vx_cur_menu_type.type_name || "";      
      // 赛事从关盘到开盘发送C109
      let skt_data = obj.cd;
      let len = skt_data.length;
      for(let i = 0; i < len; i++) {
        let item = skt_data[i];
        // 即将开赛状态详情只需要和数据
        if(item.ms == 110) {
          Object.assign(this.match_ctr.mid_obj[item.mid], { ms: item.ms });
          this.match_ctr.upd_time_obj.set_match_obj(item.mid, item, obj.ctsp);
          continue;
        }  
      }

      for(let j = 0; j < len; j++) {
        let item = skt_data[j];
        // 即将开赛状态详情只需要和数据
        if(item.ms == 110) {
          continue
        }  
        // 单签选中菜单的menuType
        let cur_menu_id = $menu.menu_data.cur_level2_menu;
        let cur_menu_type = _.get(window.$menu,`menu_obj.menu_id_${cur_menu_id}.menuType`,-1);
        if(type_name == 'play' && item.ms == 1) { // 现场滚球里面开赛进行匹配   
          // 热门赛事菜单     
          this.debounce_get_history();
          break;
        } else if(['today','bet'].includes(type_name) && (item.ms == 0 || item.ms == 1)) {  // 今日
          // 热门赛事菜单
          this.debounce_get_history();
          break;
        } else if(type_name =='early' && item.ms == 0) { // 早盘 未开赛进行匹配      
          // 热门赛事菜单
          this.debounce_get_history();
          break;
        } else if (type_name =='hot_one' && ['30','100'].includes(cur_menu_type)) { // 热门赛事菜单
          // 热门赛事菜单
          this.debounce_get_history();
          break;
        }
      }
    },
    /**    
     * C3011 推送数据
     * `refreshAll` 是否全刷，true：全刷，false：不全刷
     * @description: 菜单栏顺序变更(专业版处理)
     * @param {*} obj
     * @return {*}
     */
    RCMD_C3011(obj) {
      let skt_data = obj.cd;
      // 菜单顺序是否变更了
      if(skt_data.refreshAll) {
        this.debounce_get_history();
      }
    },
    /**
     * C302 推送数据
     * `mid` 赛事Id
     * `ms` 赛事状态：0未开赛 1开赛
     * `csid` 球种id
     * @description: 赛事开赛状态
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C302(obj) {
      if (!obj) {
        return;
      }
      let skt_data = obj.cd;
      //console.log('-----------------赛事开赛通知状态C302------------obj:' + JSON.stringify(obj));
      // 0、未开赛 1、开赛
      if (skt_data.ms == 1) {
        this.debounce_get_history();
      }
    },
    /**    
     *  C303 推送数据
     * `mid` 赛事Id
     * `hid` 盘口id
     * `hpid` 玩法id
     * `hs` 盘口状态
     * @description: 赛事盘口新增(玩法)
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C303(obj) {
      //数据不存在或者数据存在不是当前赛事
      if (!obj || !this.match_ctr.mid_obj[obj.cd.mid]) {
        return;
      }    
      let skt_data = obj.cd;
      let sport_id = this.match_ctr.mid_obj[skt_data.mid].csid;
      // 网球且玩法为171时不处理 只是列表不处理
      if(sport_id == 5 && skt_data.hpid== 171 ) {
        return;
      }
      // 如果是单关并且单关正在处理投注阻止数据合并 或者如果是串关且串关正在投注中,阻止数据合并
      if ((this.is_bet_single && this.vx_get_is_single_handle) || (!this.is_bet_single && this.vx_get_is_handle)) {
        return;
      }
      let cur_menu_id =  _.get(window.$menu,'menu_data.cur_level2_menu');
      let cur_menu_type = _.get(window.$menu,`menu_obj.menu_id_${cur_menu_id}.menuType`, -1);
      // 获取球种对应的menuType menuType与当前的
      let sport_to_menu_type = _.get(this.play_mapping,`SPORT_TO_MENU_TYPE.${skt_data.csid}`,'');
      let flag = false;
      let type_name = this.vx_cur_menu_type.type_name || "";
      if(['30','100'].includes(cur_menu_type) || ['play', 'hot_one'].includes(type_name)) { // 政治娱乐，冠军菜单 现场滚球 热门赛事
        flag = true;
      }  
      if((['today','bet'].includes(type_name)) && (cur_menu_type == sport_to_menu_type)) {  // 今日
        this.debounce_get_history();
      } else if((type_name == 'early') && (cur_menu_type == sport_to_menu_type)) { // 早盘 未开赛进行匹配       
        this.debounce_get_history();        
      } else if (flag) { // 热门赛事菜单
        this.debounce_get_history();
      } 
    },
    /**
     *  C801 推送数据
     * `mct` 当前节/盘/局
     * `mess` 1:start 0:stop
     * `mhs` 赛事级别盘口状态 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
     * `mid` 赛事Id
     * `mmp` 赛事阶段
     * `ms` 赛事状态
     * `mst` 比赛进行时间/比赛剩余时间
     * `msc` 比分数据
     * @description: 倒计时补充-C801
     * @param {Object} obj
     */
    RCMD_C801(obj) {
      //数据不存在
      if(!obj) {
        return;
      }
      let skt_data = obj.cd;
      //倒计时补充
      this.yabo_common.match_fill_time(this, skt_data, this.socket_name);
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
      obj.module = _.get(this.match_ctr,'_module', 'match_list');
      obj.list = this.get_c8_list();      
      obj.one_send = false; 
      obj.cufm = "L";
      obj.marketLevel = _.get(this.vx_get_user, 'marketLevel', '0');
      //处理逻辑
      if(obj.list.length>0) {
        //发送赛状态订阅息命令C8
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
          if(_.isArray(item.hpids) && item.hpids.length > 0 && !item.hpids.includes("*")) {
            hpid = item.hpids.join(',')
          }
          // hpid = this.get_hpid_by_mid(item); // 通过mid获取要订阅的玩法id(可能后面会是菜单id，联赛id，球种id)
          let obj = { mid, hpid }; // level：2 值针对C303
          list.push(obj);
        });    
        return list;
      },
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
          this.get_history();
        }
        if(this.vx_layout_cur_page.cur=="home") {
          // socket订阅 C8订阅
          this.SCMD_C8("h_match_list");
        } else {
           // C8订阅
          this.SCMD_C8();
        }
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
    },
  },
  destroyed() {
    //清空延时器
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    //置空对象
    this.timer_obj = {};
    this.play_mapping = {};
    //取消防抖和节流
    this.debounce_throttle_cancel(this.SCMD_C8);
    this.debounce_throttle_cancel(this.debounce_get_history);
    //发送关闭命令
    this.sendSocketCloseCmd();
    this.$root.$off(this.emit_cmd.EMIT_MATCH_LIST_SUBSCRIBE,this.sendSocketInitCmd);
    if(window.ws) {
      let socket_name = this.socket_name || 'skt_data_list_recent';
      //删除订阅对象
      window.ws.removeQueueViewObj(socket_name);
    }
  }
}