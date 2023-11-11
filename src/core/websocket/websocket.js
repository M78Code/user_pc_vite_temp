/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: websocket数据页面数据接入 ---- 公共使用
 */
// 发送websocket命令时使用
// import * as SCMD from "src/project/yabo/mixins/websocket/common/websocket_cmd_s.js";
// import * as websocket from "src/project/yabo/mixins/websocket/common/websocket_base.js";
import { WsSend } from "src/core/data-warehouse/ws/ws-ctr/ws-ctr.js";
import Ws from "src/public/utils/ws/ws.js";
import { mapGetters, mapActions } from "vuex";
import http from "src/public/utils/http/axios_warpper.js";
import odds_conversion_mixin from "src/public/mixins/odds_conversion/odds_conversion_mixin";
import { api_account} from "src/public/api/index.js";
// const api_prefix = window.env.config.api.API_PREFIX_WBSOCKET
import { uid } from 'quasar';
export default {
  mixins: [odds_conversion_mixin],
  data() {
    return {
      // 菜单数据
      menu_data: $menu.menu_data,
      // websocket是否正常连接
      websocketStatus: false,
      // 网页休眠timer
      timer: null,
      // 最后次ws断开时间
      lase_socket_close_time: new Date().getTime(),
      // ws操作对应
      ws:null,
    }
  },
  computed: {
    ...mapGetters({
      // socke接收数据集合
      socket_data: 'get_socket_obj',
      // 获取ws连接状态(0-断开,1-连接,2-断网续连状态)
      socket_status: 'get_socket_status',

      //押注相关方法
      bet_list: 'get_bet_list',
      // 获取串关投注项对象
      vx_bet_obj: 'get_bet_obj',
      // 获取单关列表(以前单关可以有多个，历史原因目前数组中只存一个值)
      bet_single_list: 'get_bet_single_list',
      // 获取单关投注项对象
      vx_bet_single_obj: 'get_bet_single_obj',
      // 是否为单关
      is_bet_single: 'is_bet_single',
      // 用户登录信息
      vx_get_uid: 'get_uid',
      // 获取用户信息
      vx_get_user: "get_user",
      // 获取用户id
      uuid: "get_uuid",
      // 串关是否正在处理
      get_is_handle: "get_is_handle",
      // 监听页面是否转入休眠状态
      get_vue_hidden_run: "get_vue_hidden_run",
      vx_get_is_single_handle: "get_is_single_handle", // 单关是否正在处理
      vx_get_is_handle: "get_is_handle", // 串关是否正在处理
      // 投注模式
      vx_get_bet_mode: "get_bet_mode",
      // 投注项锁获取
      vx_get_bet_item_lock: 'get_bet_item_lock',
      // 获取当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      // 是否为虚拟体育投注
      vx_get_is_virtual_bet: "get_is_virtual_bet",
	    // 虚拟投注是否正在进行
      vx_get_is_virtual_handle: "get_is_virtual_handle",
      // 获取虚拟投注列表
      vx_get_virtual_bet_list: "get_virtual_bet_list",
      // 获取虚拟体育投注对象
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",
      vx_virtual_bet_s_obj:"get_virtual_bet_s_obj",

    }),
    // 是否为电竞
    is_esports() {
      return this.menu_data.is_esports
    }
  },
  watch: {
    /**
     * @description: 监听串关列表的变化
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_list: {
      // 监听押注列表变化
      handler(new_) {
        if(new_.length) {
          this.SCMD_C2();
        }
      }
    },
    /**
     * @description: 监听单关列表的变化
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_single_list: {
      handler(new_) {
        if(new_.length) {
          this.SCMD_C2();
        }
      }
    },
    /**
    * @description: 监听电竞投注数据列表
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    vx_get_virtual_bet_list(new_) {
      if($menu.menu_data.is_esports && new_.length) {
        this.SCMD_C2();
      }
    },
    /**
     * @description: 监听页面是否转入休眠状态
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_vue_hidden_run() {
      // console.log(`---------------------进入了get_vue_hidden_run方法-------------------`);
      if (document.visibilityState == 'hidden') {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          if (document.visibilityState == 'hidden') {
            this.set_socket_status(0);
            // console.log(`-----------------------socket_status:${this.socket_status}`);
            // console.log('---未在当前网站--关闭WS---',_.get(window.ws,'ws.url'));
            window.ws.retInitData(true);
          }
        }, http.DOCUMENT_HIDDEN_WS_CLOSE_TIME);
      } else {
        // console.log(`-----------------------socket_status:${this.socket_status}`);
        // console.log(`---进入当前网站--开启WS---222222222222`)
        // if (!this.socket_status) {
          this.set_socket_status(2);
          // console.log('---进入当前网站--开启WS---',_.get(window.ws,'ws.url'));
          if (window.ws) {
            window.ws.connect('vue_hidden_to_show');
          }
        // }
      }
    },
    /**
     * @description: 监听用户信息变化,变化后重新订阅C3,C4,C5
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    vx_get_uid() {
      this.SCMD_C3();
      this.SCMD_C4();
      this.SCMD_C5();
    },
    /**
     * @description: 监控socket状态是否变化,如果断链以后启用重新连接
     * @param {Boolean} status
     * @return {undefined} undefined
     */
    socket_status(status, old_status) {
      if (status) {
        if ((new Date().getTime() - this.lase_socket_close_time) > (1 * 1000)) {
          this.set_socket_status(2);
          console.log('--------WS---断网太久重新刷新数据----------------');
        } else {
          this.set_socket_status(1);
        }
        // 发送刷新菜单数量命令
        this.$root.$emit(this.emit_cmd.EMIT_MENU_REFRESH_COUNT_CMD);
      } else {
        this.lase_socket_close_time = new Date().getTime();
      }
      // 监听sockect连接状态
      if (status && old_status) {
        //当sockect重新连接时自动发送消息
        // 发送注单信息命令
        let timer = setTimeout(() => {
          if(timer) {
            clearTimeout(timer);
          }
          if(this.bet_list.length || this.bet_single_list.length) {
            this.SCMD_C2();
          }
          this.SCMD_C3();
          this.SCMD_C4();
          this.SCMD_C5();
          this.SCMD_C7();
        }, 600);
      }
    }
  },
  created() {
    this.set_socket_status(0);
    // 启动websocket服务
    //console.log('-----------------启动websocket服务--------------------------')
    // websocket.Reconnect(this);
    // var url = api_prefix.replace('http', 'ws') + '/push';
    var url = http.getWsUrl();
    // var url = 'ws://localhost:8081';
    window.ws = new Ws(this, url);
    this.ws = window.ws
    window.ws.wsStatusCall = (status) => {
      this.set_socket_status(status);
    }
    window.ws.connect();
    window.ws.addQueueViewObj('websocket', this);
    this.$root.$on(this.emit_cmd.EMIT_SCMD_C2_CMD, this.SCMD_C2);
    this.SCMD_C51 = this.throttle(this.SCMD_C51, 2000);
  },
  updated: function () {
    //console.log('updated 更新完成状态===============》');
    // websocket.Reconnect(this);
  },
  destroyed() {
    this.debounce_throttle_cancel(this.SCMD_C51);
    this.$root.$off(this.emit_cmd.EMIT_SCMD_C2_CMD, this.SCMD_C2);
    // websocket.del();
    if (window.ws) {
      window.ws.sendMsg({cmd:"C00"});
      window.ws.removeQueueViewObj('websocket');
      window.ws.destroy();
    }
    this.ws = null;
  },
  methods: {
    ...mapActions({
      // 设置websocket连接状态
      set_socket_status: 'set_socket_status',
      //押注相关方法
      set_bet_list: 'set_bet_list',
      // 更新投注项对象
      upd_bet_obj: 'upd_bet_obj',
      // 删除串关列表
      bet_list_remove: 'bet_list_remove',
      // 添加串关列表
      bet_list_push: 'bet_list_push',
      // ---未使用
      bet_list_add_attr: "bet_list_add_attr",
      // 监听页面是否转入休眠状态
      set_vue_hidden_run: 'set_vue_hidden_run',
      // 添加单关投注项对象
      bet_single_obj_attr: 'bet_single_obj_attr',
      // 添加串关投注项对象
      bet_obj_add_attr: 'bet_obj_add_attr',
      // 设置用户信息
      vx_set_user: "set_user",
      vx_set_user_balance: "set_user_balance",
      //设置全局开关
      set_global_switch: 'set_global_switch',
    }),
    /**
     * @description: 赛事订阅(C2)-盘口/投注项(C106)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C2() {
      // 盘口Id，多个Id使用逗号分隔
      let hid_obj = {};
      // 赛事Id，多个Id使用逗号分隔
      let mid_obj = {};
      let collect_func = (bet_obj) =>{
        for(const key in bet_obj) {
          let mid = _.get(bet_obj, `${key}.bs.mid`);
            if (mid) {
              let hid = _.get(bet_obj, `${key}.bs.hps[0].hl[0].hid`);
              hid_obj[hid] = 1;
              mid_obj[mid] = 1;
            }
        }
      }
      let _bet_obj;
      if($menu.menu_data.is_esports) {
        _bet_obj = _.cloneDeep(this.vx_get_virtual_bet_obj);
        collect_func(_bet_obj);
      } else {
        if (this.is_bet_single) {
          _bet_obj = _.cloneDeep(this.vx_bet_single_obj);
          collect_func(_bet_obj);
        } else {
          _bet_obj = _.cloneDeep(this.vx_bet_obj);
          collect_func(_bet_obj);
        }
      }
      let obj = {};
      obj.hid = Object.keys(hid_obj).toString();
      obj.mid = Object.keys(mid_obj).toString();
      obj.marketLevel = _.get(this.vx_get_user,'marketLevel','0');
      for (const key in hid_obj) {
        delete hid_obj[key];
      }
      for (const key in mid_obj) {
        delete mid_obj[key];
      }
      WsSend.sktSendBatHandicapOdds(window.ws, obj);
    },
    /**
     * @description: 订单订阅(C3)-未结算订单数(C202)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C3() {
      let obj = {};
      obj.cuid = this.vx_get_uid;
      WsSend.sktSendOrder(window.ws, obj);
    },
    /**
     *  C4推送数据
     * `copen` 1:打开 2:关闭
     * @description: 辅助订阅C4-滚球新赛事通知(C302)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C4() {
      let obj = { copen: 1 };
      WsSend.sktSendInitiativePush(window.ws, obj);
    },
    /**
     * @description: 菜单订阅C5-菜单栏目统计(C301)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C5() {
      let obj = {};
      obj.cdt = "4";
      WsSend.sktSendMenu(window.ws, obj);
    },
    /**
     * @description: 全局开关
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    SCMD_C7() {
      WsSend.sktSendSwitch(window.ws);
    },
    /**
     * @description: 菜单订阅C51菜单栏目统计(C501)
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    SCMD_C51(obj) {
      WsSend.sktSendMenu2(window.ws, obj);
    },
    /**
     * @description: 改版新UI菜单栏目
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C501(obj) {
      if (!obj) {
        return;
      }
      let skt_data = obj.cd;
      // 设置菜单数量
      $menu.ws_update_menu(skt_data);
    },
    /**
     * @description: 全局开关推送
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
     RCMD_C701(obj) {
      console.log("++++++++++++++++++++++++", obj.cd);
      let data = obj.cd
      let {
          //热门推荐
          hotRecommend: hot_recommend = 1,
          //统计
          statisticsSwitch: statistics_switch = 1,
          //收藏
          collectSwitch: collect_switch = 1,
          //近期
          recentSwitch: recent_switch = 1,
          //活动
          activitySwitch: activity_switch = 1,
          //搜索
          searchSwitch: search_switch = 1,
          //联赛筛选
          filterSwitch: filter_switch = 1,
          //盘口数量
          handicapNum: handicap_num = 1,
          //热门赛事
          hotMatchNum: hot_match_num = 1,
          //排序
          sortCut: sort_cut = 1,
          //滚球全部
          playAllShow: play_all_show = 1,
          //多列
          multiColumn: multi_column = 1,
      } = data
      let cur_obj = {
          hot_recommend,
          statistics_switch,
          collect_switch,
          recent_switch,
          activity_switch,
          search_switch,
          filter_switch,
          handicap_num,
          hot_match_num,
          sort_cut,
          play_all_show,
          multi_column
      }
      for (const key in cur_obj) {
          if (cur_obj[key] === 1) {  delete cur_obj[key] }
      }
      this.set_global_switch(cur_obj)
   },
    /**
     * @description: 菜单栏目
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C301(obj) {
      // console.log('-----------------菜单栏目C301------------');
      if (!obj) {
        return;
      }

      let skt_data = obj.cd;
      // 设置菜单数量
      $menu.ws_update_menu(skt_data);
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
      if(skt_data.refreshAll) {
        $menu.api_get_menu_data(true)
      }
    },
    /**
     * C201推动数据
     * `orderNo` 订单编号
     * `status` 订单状态(1:投注成功 2:投注失败)
     * `newTotalMaxWinAmount` 订单最高可赢金额
     * `isOddsChange` 赔率是否变更，为true时处理赔率变更集合
     * `newProcessOrder` 是否投注新流程订单 1:是 0:否
     * `tryNewProcessBet` 是否重试投注新流程订单 1:是 2:投注金额变更 0:否
     * `refuseCode` 拒单编码
     * `cuid` 用户Id
     * `preStatus` 是否提前结算状态：0:原有结算逻辑, 1:是提前结算
     * `orderStatus` 专指提前结算状态  1:通过  2:拒绝
     * @description:  订单状态
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C201(obj) {
      // console.log('-----------------订单状态C201------------');
      if (!obj) {
        return;
      }
      let skt_data = obj.cd;
      // 订单无论成功还是失败都进行收藏
      if ([1,2].includes(skt_data.status)) {
        // console.log(`===================RCMD_C201RCMD_C201RCMD_C201===============================${JSON.stringify(this.view_ctr_obj)}`);
        // 自动收藏
        this.$root.$emit(this.emit_cmd.EMIT_MX_COLLECT_COUNT_CMD, { type: "bet" });
        // 统计未计算订单
        this.$root.$emit(this.emit_cmd.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
        // 更新提前结算金额
        this.$root.$emit(this.emit_cmd.EMIT_UPD_CASHOUT_MAX_AMOUNT_LIST_CMD, skt_data);
      }
    },
    // 用户账变(C203)
    RCMD_C203(obj){
       // console.log('-----------------订单状态C203------------');
      if (!obj) {
        return;
      }
      let skt_data = obj.cd;
      if (this.vx_get_user && this.vx_get_user.uid && skt_data.cuid == this.vx_get_user.uid) {
        this.get_balance();
      }
    },
    /**
     * `hls` 盘口集合
     * `mid` 赛事Id
     * `hid` 盘口Id
     * `hpid` 玩法Id
     * `hs` 盘口状态 0:开盘 1:封盘 2:关盘 11:锁盘
     * `hn` 坑位 1:表示主盘，2:表示第一副盘，以此类推
     * `hps` 基准分S1|0:0  不存在基准分则不传输该字段
     * `hmt` 盘口类型 1:赛前盘 0:滚球盘
     * @description:  注单订阅盘口状态、赔率
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C106(obj) {
      if (!obj) {
        return;
      }
      if(this.is_esports) {
        // 电竞投注项更新
        this.esports_bet_data(obj);
      } else {
        // 普通赛事投注项更新
        this.general_bet_data(obj);
      }
    },
    /**
     * 109 推送数据
     * `mid` 赛事Id
     * `hs` 盘口状态
     * `csid` 球种Id
     * `ms` 赛事状态 赛事状态 0:未开赛 1:滚球 110:即将开赛
     * @description:  赛事级开盘推送
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C109(obj) {
      //console.log(`=============进入websocket========RCMD_C109`);
      if (!obj) return;
      let id, bet_obj, skt_data = obj.cd;
      let len = skt_data.length
      for(let i = 0; i < len; i++) {
        let item = skt_data[i];
        if (this.is_bet_single) {
          id = this.bet_single_list[0];
          bet_obj = _.cloneDeep(this.vx_bet_single_obj[id]);
          if (bet_obj && bet_obj.bs && bet_obj.cs) {
            if (bet_obj.cs.match_id == item.mid) {
              bet_obj.cs.match_status = item.hs;
              bet_obj.cs.handicap_status = item.hs;
            }
            if (bet_obj.bs.mid == item.mid) {
              bet_obj.bs.mhs = item.hs;
              bet_obj.bs.hps[0].hl[0].hshandicap_status = item.hs;
              bet_obj.bs.hps[0].hl[0].ol[0]._mhs = item.hs;
              bet_obj.bs.hps[0].hl[0].ol[0]._hs = item.hs;
            }
            this.upd_bet_obj((state) => {
              state.bet_single_obj[id] = bet_obj;
              // console.log('RCMD_C109合并bet_obj对象:',{bet_obj});
            });
          }
        } else {
          if (this.vx_bet_obj) {
            let _bet_obj = _.cloneDeep(this.vx_bet_obj);
            for (let [key, obj] of Object.entries(this.vx_bet_obj)) {
              if (obj.cs && obj.cs.match_id == skt_data.mid) {
                bet_obj = this.vx_bet_obj && this.vx_bet_obj[key];
                if (bet_obj && bet_obj.cs && bet_obj.bs) {
                  _bet_obj[key] = { cs: bet_obj.cs, bs: bet_obj.bs };
                  if (bet_obj.cs.match_id == skt_data.mid) {
                    _bet_obj[key].cs.match_status = skt_data.hs;
                    _bet_obj[key].cs.handicap_status = skt_data.hs;
                  }
                  if (bet_obj.bs.mid == skt_data.mid) {
                    _bet_obj[key].bs.mhs = skt_data.hs;
                    _bet_obj[key].bs.hps[0].hl[0].hs = skt_data.hs;
                    _bet_obj[key].bs.hps[0].hl[0].ol[0]._mhs = skt_data.hs;
                    _bet_obj[key].bs.hps[0].hl[0].ol[0]._hs = skt_data.hs;
                  }
                }
              }
            }
            this.upd_bet_obj((state) => {
              state.bet_obj = _bet_obj;
              // console.log('RCMD_C109合并bet_obj对象:',{bet_obj});
            });
          }
        }
      }
    },
    /**
     * 普通赛事
     * @param {*} obj
     * @returns
     */
    general_bet_data(obj) {
      // console.log(`======is_bet_single:${this.is_bet_single}=======vx_get_is_single_handle:${this.vx_get_is_single_handle}`);
      // 如果是单关并且单关正在处理投注阻止数据合并 或者如果是串关且串关正在投注中,阻止数据合并
      if ((this.is_bet_single && this.vx_get_is_single_handle) || (!this.is_bet_single && this.vx_get_is_handle)) {
        // console.log('RCMD_C106中更新投注项被阻止',{ is_bet_single: this.is_bet_single, vx_get_is_single_handle: this.vx_get_is_single_handle, vx_get_is_handle: this.vx_get_is_handle});
        return;
      }
      // 新流程正在锁住投注项的时候不允许更新投注栏赔率
      if(this.vx_get_bet_mode==1 && this.vx_get_bet_item_lock) {
        return;
      }
      //坑位有没有变化，默认没变化，走正常逻辑
      let hn_obj = this.check_hpn(obj);
      console.log('hn_objxxxx===', hn_obj);
        // console.log('-----------------注单订阅盘口状态、赔率C106------------');
        let skt_data = obj.cd.hls,
          _bet_single_obj = _.cloneDeep(this.vx_bet_single_obj),
          _bet_obj = _.cloneDeep(this.vx_bet_obj),
          mid,play_id,handle_time;
        let len = skt_data.length;
        if (skt_data && len) {
          if (this.is_bet_single) {
            for (let i = 0; i < len; i++) {
              let obj1 = skt_data[i];
              if (obj1 && obj1.mid && _bet_single_obj) {
                let hs = obj1.hs ? obj1.hs : 0;
                if(hn_obj[obj1.hid]){
                  //拉接口
                  this.get_java_info();
                }else{
                  //走之前流程
                  if (obj1.ol && obj1.ol.length) {
                      obj1.ol.forEach(skt_item => {
                      // 投注项的坑位id
                      let {property, kid} = this.get_bet_info(skt_item.oid);
                      // console.log('RCMD_C106的id值与坑位全称kid', {id:property, kid})
                      // ws组成的坑位id
                      let skt_hn = `${obj1.mid}_${obj1.chpid || obj1.hpid}_${obj1.hn}_${skt_item.ot}`;
                      if(property && kid && property!=kid) {
                        property = kid;
                      }
                      let bet_single_obj = _.get(_bet_single_obj, property);
                      handle_time = _.get(bet_single_obj, 'cs.handle_time');
                      mid =  _.get(bet_single_obj, 'cs.match_id');
                      play_id = _.get(bet_single_obj, 'cs.play_id');
                      // 坑位如果存在,则kid为id为条件进行匹配,如果不存在直接是oid进行匹配的(property是通过oid拿到的)
                      // console.log('RCMD_C106坑位值', {hn: obj1.hn, kid, skt_hn })
                      if (obj1.mid == mid &&(!obj1.hn || (obj1.hn && kid==skt_hn)) && obj1.hpid == play_id && bet_single_obj) { // && handle_time < obj.ctsp
                        let bs = _.get(bet_single_obj, 'bs');
                        let cs = _.get(bet_single_obj, 'cs');
                        // console.log(property + '盘口状态合并前===========111111=======' + JSON.stringify(bet_single_obj));
                        let ol_obj = _.get(bs, "hps[0].hl[0].ol[0]");
                        let ov = skt_item.obv ? skt_item.obv : skt_item.ov;
                        let os = (ov < 101000) ? 2 : skt_item.os; // 赔率小于1.01则设置为封盘:2
                        // console.log('RCMD_C106玩法和投注项类型比较', {hpid: obj1.hpid, play_id: cs.play_id, ot: ol_obj.ot, skt_item_ot: skt_item.ot})
                        if(cs.play_id == obj1.hpid && ((ol_obj.ot == skt_item.ot && cs.match_type!=3) || (cs.match_type==3))){
                          let obj_ = {
                            _hs: hs,
                            ov: skt_item.ov,
                            obv: skt_item.obv,
                            os
                          };
                          if(!_.isUndefined(skt_item.ot) && !_.isNull(skt_item.ot)) {
                            Object.assign(obj_ ,{ot: skt_item.ot});
                          }
                          // console.log('RCMD_C106单关数据开始数据组装', {obj_})
                          Object.assign(ol_obj, obj_);
                          // console.log('RCMD_C106单关数据开始数据组装bs:',{bs})
                          Object.assign(cs, {
                            odds_value: skt_item.ov,
                            active: os,
                            break_odds_value: skt_item.obv,
                            handle_time: obj.ctsp
                          });
                          // console.log('RCMD_C106单关数据开始数据组装cs:',{cs});
                          _bet_single_obj[property] = bet_single_obj;
                          // console.log('RCMD_C106合并_bet_single_obj完成:', {bet_single_obj});
                        }
                        // console.log(property + '盘口状态合并后==========================22222' + JSON.stringify(bet_single_obj));
                      }
                    });
                  }
                  if (obj1 && obj1.hid) {
                    let hs = obj1.hs ? obj1.hs : 0;
                    for (const key in _bet_single_obj) {
                      let bet_single_obj = _.get(_bet_single_obj, key);
                      let hl_obj = _.get(bet_single_obj, 'bs.hps[0].hl[0]');
                      mid = _.get(bet_single_obj,'cs.match_id');
                      if (hl_obj && obj1.mid==mid) {
                        let bs = _.get(bet_single_obj, 'bs');
                        // console.log(key + '盘口状态合并前========================33333' + JSON.stringify(bet_single_obj[key]));
                        if (_.get(bs, 'hps[0].hl[0].hid') == obj1.hid) {
                          if(obj1.hmt!=null) {
                            bet_single_obj.bs.hps[0].hl[0].hmt = obj1.hmt; // 赛事盘口类型
                            bet_single_obj.cs.market_type = obj1.hmt;
                          }
                          bet_single_obj.bs.hps[0].hl[0].hs = hs;
                          bet_single_obj.bs.hps[0].hl[0].ol[0]._hs = hs;
                          //Object.assign(bs, { hps });
                          // 后台已经不推送盘口值
                          bet_single_obj.cs.handicap_status = hs;
                          //Object.assign(cs, {handicap_status: obj1.hs});
                        }

                        // 玩法上的基准分对应
                        if(obj1.hpid==_.get(bs,'hps[0].hpid')
                          && (obj1.hn==_.get(bs,'hps[0].hl[0].hn') || obj1.hid == _.get(bs,'hps[0].hl[0].hid'))
                          && obj1.hps && obj1.hps.includes('|')
                          && obj1.hps.includes(':')) {
                          let score_info_arr = obj1.hps.split('|');
                          if(score_info_arr.length==2) {
                            let score_type = score_info_arr[0];
                            let score_arr = score_info_arr[1].split(':');
                            if((score_arr instanceof Array) &&
                                score_arr.length==2 &&
                                score_arr[0]!='' &&
                                score_arr[1]!='') {
                                bet_single_obj.cs.score_type = score_type;  // S几
                                bet_single_obj.cs.home_score = score_arr[0]; // 主队得分
                                bet_single_obj.cs.away_score = score_arr[1]; // 客队得分
                                let msc = bet_single_obj.bs.msc;
                              // bs中的msc数据同步
                              if(!_.isEmpty(msc)) {
                                if(_.isObject(msc)) {
                                  msc[score_type] = {
                                    home: score_arr[0],
                                    away: score_arr[1]
                                  }
                                } else if(_.isArray(msc)) {
                                  let index = _.findIndex(msc, item=>item.includes(score_type));
                                  if(index==-1) {
                                    msc.push(obj1.hps);
                                  } else {
                                    msc[index] = obj1.hps;
                                  }
                                }
                              }
                            }
                          }
                          // console.log('RCMD_C106基准分处理:',{score_type, home_score: score_arr[0],away_score: score_arr[1]});
                        }
                        // console.log(key + '盘口状态合并后=======================444444' + JSON.stringify(bet_single_obj[key]));
                        _bet_single_obj[key] = bet_single_obj;
                      }
                    }
                  }
                }
              }
            }
            this.upd_bet_obj((state) => {
              state.bet_single_obj = _bet_single_obj;
              // console.log('RCMD_C106合并bet_single_obj对象:',{_bet_single_obj});
            });
          } else {
            if (skt_data && skt_data.length) {
              for (let i = 0; i < skt_data.length; i++) {
                let obj1 = skt_data[i];
                // 合并数据
                if (obj1 &&
                  obj1.mid &&
                  _bet_obj) {
                  let hs = (obj1.hs ? obj1.hs : 0);
                  // obj1.ol.forEach(skt_item => {
                  if (obj1.ol &&
                    obj1.ol.length) {
                    for (let j = 0; j < obj1.ol.length; j++) {
                      let skt_item = obj1.ol[j];
                      let {property, kid} = this.get_bet_info(skt_item.oid);
                      // console.log('RCMD_C106的id值与坑位全称kid', {id:property, kid})
                      // ws组成的坑位id
                      let skt_hn = `${obj1.mid}_${obj1.chpid || obj1.hpid}_${obj1.hn}_${skt_item.ot}`;
                      if(property && kid && property!=kid) {
                        property = kid;
                      }
                      let bet_obj = _.get(_bet_obj, `${property}`);
                      // console.log('RCMD_C106坑位值及投注对象', {hn: obj1.hn, kid, skt_hn, bet_obj})
                      if ((!obj1.hn || (obj1.hn && kid==skt_hn)) && bet_obj) {
                        let bs = _.get(bet_obj, 'bs');
                        let cs = _.get(bet_obj, 'cs');
                        let ol_obj = _.get(bs, `hps[0].hl[0].ol[0]`);
                        handle_time = _.get(_bet_obj, `${property}.cs.handle_time`);
                        mid =  _.get(_bet_obj, `${property}.cs.match_id`);
                        play_id = _.get(bet_obj, 'cs.play_id');
                        if (obj1.mid == mid &&
                          obj1.hid == _.get(bs, 'hps[0].hl[0].hid') &&
                          obj1.hpid == play_id &&
                          ol_obj) {
                          // console.log(property + '盘口状态合并前=========================5555555' + JSON.stringify(cs));
                          // console.log('RCMD_C106时间戳比较', { handle_time, ctsp:obj.ctsp})
                          if(!handle_time || (handle_time && handle_time < obj.ctsp)) {
                            let ov = this.compute_value_by_cur_odd_type(
                              skt_item.ov / 100000,
                              skt_item.obv / 100000,
                              _.get(cs, "odds_switch")
                            );
                            let os = (ov < 1.01) ? 2 : skt_item.os;  // 赔率小于1.01则设置为封盘:2
                            // console.log('RCMD_C106玩法和投注项类型比较', {hpid: obj1.hpid, play_id: cs.play_id, ot: ol_obj.ot, skt_item_ot: skt_item.ot})
                            if(cs.play_id == obj1.hpid && ((ol_obj.ot == skt_item.ot && cs.match_type!=3) || (cs.match_type==3))) {
                              let obj_ = {
                                _hs: hs,
                                ov: skt_item.ov,
                                obv: skt_item.obv,
                                os
                              };
                              if(!_.isUndefined(skt_item.ot) && !_.isNull(skt_item.ot)) {
                                Object.assign(obj_, {ot: skt_item.ot})
                              }
                              // console.log('RCMD_C106单关数据开始数据组装', {obj_})
                              Object.assign(ol_obj, obj_);
                              // console.log('RCMD_C106单关数据开始数据组装bs:',{bs})
                              Object.assign(cs, {
                                odds_value: skt_item.ov,
                                active: os,
                                break_odds_value: skt_item.obv
                              });
                              // console.log('RCMD_C106单关数据开始数据组装cs:',{cs});
                              _bet_obj[property] = bet_obj;
                              // console.log('RCMD_C106合并_bet_obj完成:', {_bet_obj});
                            }
                            // console.log(property + '盘口状态合并后' + JSON.stringify(bet_obj));
                          }
                        }
                      }
                    }
                  }

                  //});
                  // 设置盘口状态 -- 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
                  if (obj1 && obj1.hid) {
                    let hs = obj1.hs ? obj1.hs : 0;
                    for (const key in _bet_obj) {
                      let bet_obj = _.get(_bet_obj, key);
                      let hl_obj = _.get(bet_obj, 'bs.hps[0].hl[0]');
                      let cs = _.get(bet_obj, 'cs');
                      if (bet_obj && hl_obj && obj1.mid == cs.match_id) {
                        let bs = _.get(bet_obj, 'bs');
                        if(_.get(bs, 'hps[0].hl[0].hid') == obj1.hid && obj1.hpid==_.get(bs, 'hps[0].hpid')) {
                          if(obj1.hmt!=null) {
                            bet_obj.bs.hps[0].hl[0].hmt = obj1.hmt;
                            bet_obj.cs.market_type = obj1.hmt;
                          }
                          bet_obj.bs.hps[0].hl[0].hs = hs;
                          bet_obj.bs.hps[0].hl[0].ol[0]._hs = hs;
                          //Object.assign(bet_obj.bs, { hps });
                          console.log(key + '盘口状态合并前' + JSON.stringify(cs));
                          bet_obj.cs.handicap_status = hs;
                        }

                        // 玩法上的基准分对应
                        if(obj1.hpid==_.get(bs,'hps[0].hpid')
                        && (obj1.hn==_.get(bs,'hps[0].hl[0].hn') || obj1.hid == _.get(bs,'hps[0].hl[0].hid'))
                        && obj1.hps && obj1.hps.includes('|')
                        && obj1.hps.includes(':')) {
                          let score_info_arr = obj1.hps.split('|');
                          if(score_info_arr.length==2) {
                            let score_type = score_info_arr[0];
                            let score_arr = score_info_arr[1].split(':');
                            if((score_arr instanceof Array) &&
                              score_arr.length==2 &&
                              score_arr[0]!='' &&
                              score_arr[1]!='') {
                              bet_obj.cs.score_type = score_type;  // S几
                              bet_obj.cs.home_score = score_arr[0]; // 主队得分
                              bet_obj.cs.away_score = score_arr[1]; // 客队得分
                              let msc = bs.msc;
                              if(!_.isEmpty(msc)) {
                                if(_.isObject(msc)) {
                                  msc[score_type] = {
                                    home: score_arr[0],
                                    away: score_arr[1]
                                  }
                                } else if(_.isArray(msc)) {
                                  let index = _.findIndex(msc, item=>item.includes(score_type));
                                  if(index == -1) {
                                    msc.push(obj1.hps);
                                  } else {
                                    msc[index] = obj1.hps;
                                  }
                                }
                              }
                            }
                          }
                          // console.log('RCMD_C106基准分处理:',{score_type, home_score: score_arr[0],away_score: score_arr[1]});
                        }
                        // 后台已经不推送盘口值
                        //Object.assign(bet_obj.cs, { handicap_status: skt_data.hs });
                        console.log(key + '盘口状态合并后' + JSON.stringify(cs));
                        _bet_obj[key] = bet_obj;
                      }
                    }
                  }
                }
              }
            }
            this.upd_bet_obj((state) => {
              state.bet_obj = _bet_obj;
              // console.log('RCMD_C106合并bet_obj对象:',{bet_obj});
            });
          }
        }

    },
    check_hpn(obj){
      let same_hpn_obj = {};
      // obj = {
      //   "cd": {
      //      "hls": [
      //        {
      //           "hid": "1315918111111426050",
      //           "hpid": "4",
      //           "hs": 0,
      //           "mid": "1422839",
      //           "hn": 1,
      //           "hps": "S1|2:1",
      //           "ol": [
      //              {
      //                 "obv": "205000",
      //                 "oid": "1315918126340943874",
      //                 "os": 1,
      //                 "ot": "1",
      //                 "ov": "205000"
      //               }
      //            ]
      //         }
      //      ],
      //      "mid": "1422839"
      //    },
      //    "cmd": "C106",
      //    "ctsp": "1600152527052",
      //    "ld": "0af5033320200915144846729c7f4853"
      // }
      let skt_data = obj.cd.hls,

      _bet_single_obj = _.cloneDeep(this.vx_bet_single_obj),
      _bet_obj = _.cloneDeep(this.vx_bet_obj),

      _bet_virtual_single_obj = _.cloneDeep(this.vx_get_virtual_bet_obj),
      _bet_virtual_obj = _.cloneDeep(this.vx_virtual_bet_s_obj);
      console.log('skt_data===', skt_data);
      let len = skt_data.length;
      if (skt_data && len) {
        if(this.vx_get_is_virtual_bet){
          if (this.is_bet_single) {
            for(let i = 0; i < len; i++){
              let item = skt_data[i];
              for(let obj_item in _bet_virtual_single_obj){
                console.log('obj_item===', obj_item);
                console.log('_bet_single_obj===', _bet_virtual_single_obj[obj_item]);
                if(_bet_virtual_single_obj[obj_item].cs.handicap_id == item.hid){
                    if(_bet_virtual_single_obj[obj_item].bs.hps[0].hl[0].hn == item.hn){
                      same_hpn_obj[item.hid] = false;
                    }else{
                      same_hpn_obj[item.hid] = true;
                    }
                }
              }
            }
          }else{
            skt_data.map((item)=>{
              for(let obj_item in _bet_virtual_obj){
                console.log('obj_item===', obj_item);
                console.log('_bet_single_obj===', _bet_virtual_obj[obj_item]);
                if(_bet_virtual_obj[obj_item].cs.handicap_id == item.hid){
                    if(_bet_virtual_obj[obj_item].bs.hps[0].hl[0].hn == item.hn){
                      same_hpn_obj[item.hid] = false;
                    }else{
                      same_hpn_obj[item.hid] = true;
                    }
                }
              }
            })
          }
        }else{
          if (this.is_bet_single) {
            for(let i = 0; i < len; i++){
              let item = skt_data[i];
              for(let obj_item in _bet_single_obj){
                console.log('obj_item===', obj_item);
                console.log('_bet_single_obj===', _bet_single_obj[obj_item]);
                if(_bet_single_obj[obj_item].cs.handicap_id == item.hid){
                    if(_bet_single_obj[obj_item].bs.hps[0].hl[0].hn == item.hn){
                      same_hpn_obj[item.hid] = false;
                    }else{
                      same_hpn_obj[item.hid] = true;
                    }
                }
              }
            }
          }else{
            skt_data.map((item)=>{
              for(let obj_item in _bet_obj){
                console.log('obj_item===', obj_item);
                console.log('_bet_single_obj===', _bet_single_obj[obj_item]);
                if(_bet_single_obj[obj_item].cs.handicap_id == item.hid){
                    if(_bet_single_obj[obj_item].bs.hps[0].hl[0].hn == item.hn){
                      same_hpn_obj[item.hid] = false;
                    }else{
                      same_hpn_obj[item.hid] = true;
                    }
                }
              }
            })
          }
        }
      }
      console.log('same_hpn_obj===', same_hpn_obj);
      return same_hpn_obj;
      },
    get_java_info(){
      this.check_odds_beforebet();
    },

    /**
     * 电竞投注C106
     * @param {*} obj
     * @returns
     */
    esports_bet_data(obj) {
      // console.log(`======is_bet_single:${this.is_bet_single}=======vx_get_is_single_handle:${this.vx_get_is_single_handle}`);
      // 如果是单关并且单关正在处理投注阻止数据合并 或者如果是串关且串关正在投注中,阻止数据合并
      if (this.vx_get_is_virtual_handle) {
        return;
      }
      //坑位有没有变化，默认没变化，走正常逻辑
      // let hn_obj = this.check_hpn(obj);
      // console.log('hn_objddddd===', hn_obj);
      // console.log('-----------------注单订阅盘口状态、赔率C106------------');
      let skt_data = obj.cd.hls,
        _virtual_bet_obj = _.cloneDeep(this.vx_get_virtual_bet_obj),
        mid,hid,handle_time,play_id;
      if (skt_data && skt_data.length) {
        for (let i = 0; i < skt_data.length; i++) {
          let obj1 = skt_data[i];
          // 合并数据
          if (obj1 && obj1.mid && _virtual_bet_obj) {
            let hs = obj1.hs ? obj1.hs : 0;
            // if(hn_obj[obj1.hid]){
            //   //拉接口
            //   this.get_java_info();
            // }else{
              // obj1.ol.forEach(skt_item => {
              if (obj1.ol && obj1.ol.length) {
                for (let j = 0; j < obj1.ol.length; j++) {

                  let skt_item = obj1.ol[j];
                  let {property, kid} = this.get_bet_info(skt_item.oid);
                  // console.log('RCMD_C106的id值与坑位全称kid', {id:property, kid})
                  // ws组成的坑位id
                  let skt_hn = `${obj1.mid}_${ obj1.chpid || obj1.hpid}_${obj1.hn}_${skt_item.ot}`;
                  if(property && kid && property!=kid) {
                    property = kid;
                  }
                  let bet_obj = _.get(_virtual_bet_obj, `${property}`);
                  if(bet_obj) {
                    handle_time = _.get(bet_obj, 'cs.handle_time');
                    mid =  _.get(bet_obj, 'cs.match_id');
                    hid = _.get(bet_obj,'cs.handicap_id');
                    play_id = _.get(bet_obj, 'cs.play_id');
                    // console.log('RCMD_C106坑位值及投注对象', {hn: obj1.hn, kid, skt_hn, bet_obj})
                    if (obj1.mid == mid && (!obj1.hn || (obj1.hn && kid==skt_hn)) && obj1.hpid == play_id && bet_obj) {
                      let bs = _.get(bet_obj, 'bs');
                      let cs = _.get(bet_obj, 'cs');
                      let ol_obj = _.get(bs, `hps[0].hl[0].ol[0]`, {});
                      if (obj1.hid == hid && ol_obj) {
                        // console.log(property + '盘口状态合并前=========================66666666' + JSON.stringify(cs));
                        // console.log('RCMD_C106时间戳比较', { handle_time, ctsp:obj.ctsp})
                        if(!handle_time || (handle_time && handle_time < obj.ctsp)) {
                          let ov = this.compute_value_by_cur_odd_type(
                            skt_item.ov / 100000,
                            skt_item.obv / 100000,
                            _.get(cs, "odds_switch"),
                            cs.sport_id
                          );
                          let os = (ov < 1.01) ? 2 : skt_item.os;  // 赔率小于1.01则设置为封盘:2
                          // console.log('RCMD_C106玩法和投注项类型比较', {hpid: obj1.hpid, play_id: cs.play_id, ot: ol_obj.ot, skt_item_ot: skt_item.ot})
                          if(cs.play_id == obj1.hpid && ((ol_obj.ot == skt_item.ot && cs.match_type!=3) || (cs.match_type==3))) {
                            let obj_ = {
                              _hs: hs,
                              ov: skt_item.ov,
                              obv: skt_item.obv,
                              os
                            };
                            if(!_.isUndefined(skt_item.ot) && !_.isNull(skt_item.ot)) {
                              Object.assign(obj_, {ot: skt_item.ot})
                            }
                            // console.log('RCMD_C106单关数据开始数据组装', {obj_})
                            Object.assign(ol_obj, obj_);
                            // console.log('RCMD_C106单关数据开始数据组装bs:',{bs})
                            Object.assign(cs, {
                              odds_value: skt_item.ov,
                              active: os,
                              break_odds_value: skt_item.obv
                            });
                            // console.log('RCMD_C106单关数据开始数据组装cs:',{cs});
                            _virtual_bet_obj[property] = bet_obj;
                            // console.log('_virtual_bet_obj:', {_virtual_bet_obj});
                          }
                          // console.log(property + '盘口状态合并后' + JSON.stringify(bet_obj));
                        }
                      }
                    }
                  }
                }
              }

              //});
              // 设置盘口状态 -- 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
              if (obj1 && obj1.hid) {
                let hs = obj1.hs ? obj1.hs : 0;
                for (const key in _virtual_bet_obj) {
                  let bet_obj = _.get(_virtual_bet_obj, key);
                  let hl_obj = _.get(bet_obj, 'bs.hps[0].hl[0]');
                  let cs = _.get(bet_obj, 'cs');
                  if (hl_obj && obj1.mid == cs.match_id) {
                    let bs = _.get(bet_obj, 'bs');
                    if(_.get(bs, 'hps[0].hl[0].hid') == obj1.hid && obj1.hpid==_.get(bs, 'hps[0].hpid')) {
                      if(obj1.hmt!=null) {
                        bet_obj.bs.hps[0].hl[0].hmt = obj1.hmt;
                        bet_obj.cs.market_type = obj1.hmt;
                      }
                      bet_obj.bs.hps[0].hl[0].hs = hs;
                      bet_obj.bs.hps[0].hl[0].ol[0]._hs = hs;
                      //Object.assign(bet_obj.bs, { hps });
                      //console.log(key + '盘口状态合并前' + JSON.stringify(cs));
                      bet_obj.cs.handicap_status = hs;
                    }

                    // 玩法上的基准分对应
                    if(obj1.hpid==_.get(bs,'hps[0].hpid')
                        && (obj1.hn==_.get(bs,'hps[0].hl[0].hn') || obj1.hid == _.get(bs,'hps[0].hl[0].hid'))
                        && obj1.hps && obj1.hps.includes('|')
                        && obj1.hps.includes(':')) {
                      let score_info_arr = obj1.hps.split('|');
                      if(score_info_arr.length==2) {
                        let score_type = score_info_arr[0];
                        let score_arr = score_info_arr[1].split(':');
                        if((score_arr instanceof Array) &&
                          score_arr.length==2 &&
                          score_arr[0]!='' &&
                          score_arr[1]!='') {
                          bet_obj.cs.score_type = score_type;  // S几
                          bet_obj.cs.home_score = score_arr[0]; // 主队得分
                          bet_obj.cs.away_score = score_arr[1]; // 客队得分
                          let msc = bs.msc;
                          if(!_.isEmpty(msc)) {
                            if(_.isObject(msc)) {
                              msc[score_type] = {
                                home: score_arr[0],
                                away: score_arr[1]
                              }
                            } else if(_.isArray(msc)) {
                              let index = _.findIndex(msc, item=>item.includes(score_type));
                              if(index == -1) {
                                msc.push(obj1.hps);
                              } else {
                                msc[index] = obj1.hps;
                              }
                            }
                          }
                        }
                      }
                      // console.log('RCMD_C106基准分处理:',{score_type, home_score: score_arr[0],away_score: score_arr[1]});
                    }
                    // 后台已经不推送盘口值
                    //Object.assign(bet_obj.cs, { handicap_status: skt_data.hs });
                    //console.log(key + '盘口状态合并后' + JSON.stringify(cs));
                    _virtual_bet_obj[key] = bet_obj;
                  }
                }
                this.upd_bet_obj((state) => {
                  state.virtual_bet_obj = _virtual_bet_obj;
                });
              }
            }
          // }
        }
      }
    },
    get_bet_info(oid) {
      let property, kid;
      if(this.is_esports) {
        for(let {cs} of Object.values(this.vx_get_virtual_bet_obj)) {
          if(cs && (cs.oid == oid || cs.kid == oid)) {
            property = oid;
            kid = cs.kid;
            break;
          }
        }
      } else {
        let bet_obj = this.vx_is_bet_single? 'vx_get_bet_single_obj':'vx_get_bet_obj';
        for(let [key, obj] of Object.entries(this[bet_obj])) {
          if(key && obj && (_.get(obj,'cs.oid')==oid || _.get(obj,'cs.kid') == oid)) {
            property = key;
            kid = _.get(obj,'cs.kid','');
            break;
          }
        }
      }
      return {property, kid};
    },
    /**
     * @更新用户余额
     * @param uid ：this.params.userId
     */
    get_balance() {
      this.send_gcuuid = uid();
      let gcuuid = this.send_gcuuid;
      // console.log('get_balance====',JSON.stringify(gcuuid));

      api_account
        .check_balance({ uid: this.vx_get_user.uid, t: new Date().getTime(), gcuuid:gcuuid })
        .then((res) => {
        // console.log('get_balance====res===', this.send_gcuuid == res.config.gcuuid);
        // if(this.send_gcuuid != res.config.gcuuid) return;

        
        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && this.send_gcuuid != gcuuid) {
          return;
        }

          const result = _.get(res, "data.data");
          const code = _.get(res, "data.code");
          if (code == 200) {
            this.vx_set_user_balance(result.amount);
          }
      });
    }
  }
}
