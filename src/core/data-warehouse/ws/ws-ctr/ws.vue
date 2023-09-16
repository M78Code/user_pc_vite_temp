/*
 * @Author: hanmar
 * @Date: 2023-09-15 17:13:55
 * @Description: websocket 组件(包括测试功能)
 */

<template>
  <div></div>
</template>
<script>
import WsMan from './ws-man.js';
import UserCtr from "src/core/user-config/user-ctr.js";
// 页面 失去 焦点后  WS 断开时间
const DOCUMENT_HIDDEN_WS_CLOSE_TIME = 5 * 60 * 1000;
export default {
  computed: {
    get_uid(){
      // 用户登录信息
      return UserCtr.get_uid();
    }
  },
  watch: {
    /**
     * @description: 监听用户信息变化,变化后重新订阅C3,C4,C5
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_uid() {
      this.SCMD_C3();
      this.SCMD_C4();
      this.SCMD_C5();
    },
  },
  created() {
    // 最后次ws断开时间
    this.lase_socket_close_time = new Date().getTime();
    window.addEventListener("message", this.rev_event_msg);
    // 监听页面是否转入休眠状态
    document.addEventListener('visibilitychange', this.event_listener_visibilitychange);
    document.addEventListener('pagehide', this.event_listener_visibilitychange);
    // 启动WS操作对象
    WsMan.run();
  },
  beforeUnmount() {
    window.removeEventListener("message", this.rev_event_msg);
    document.removeEventListener('visibilitychange', this.event_listener_visibilitychange);
    document.removeEventListener('pagehide', this.event_listener_visibilitychange);
    clearTimeout(this.timer);
    // 销毁WS操作对象
    WsMan.destroyed();
  },
  methods: {
    /**
     * @description: visibilitychange事件监听
     */
    event_listener_visibilitychange(){
      this.get_vue_hidden_run();
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
            let data =  {ws_status:0, ws_status_old:this.ws_status || 0};
            // 发送ws连接状态(0-断开,1-连接,2-断网续连状态)
            window.postMessage({event: 'WS', cmd:`WS_STATUS_CHANGE_EVENT`, data},'*');
            // console.log('---未在当前网站--关闭WS---',_.get(window.ws,'ws.url'));
            WsMan.ws && window.ws.retInitData(true);
          }
        }, DOCUMENT_HIDDEN_WS_CLOSE_TIME);
      } else {
        // console.log(`---进入当前网站--开启WS---222222222222`)
        // if (!this./) {
          let data =  {ws_status:2, ws_status_old:this.ws_status || 0};
          // 发送ws连接状态(0-断开,1-连接,2-断网续连状态)
          window.postMessage({event: 'WS', cmd:`WS_STATUS_CHANGE_EVENT`, data},'*');
          // console.log('---进入当前网站--开启WS---',_.get(window.ws,'ws.url'));
           WsMan.ws && WsMan.ws.connect('vue_hidden_to_show');
        // }
      }
    },
    /**
     * @description: 监控socket状态是否变化,如果断链以后启用重新连接
     * @param {Boolean} status
     * @return {undefined} undefined
     */
    socket_status(status, old_status) {
      //缓存变量
      this.ws_status = status;
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
    },
    /**
   * @Description:接收ws内部通信事件
   * @param: event 事件消息对象
   * @return:
   */
    rev_event_msg(event) {
      if(event && event.data && event.data.event == 'WS'){
        switch (event.data.cmd) {
          case 'WS_STATUS_CHANGE_EVENT': // ws链接状态变化 (0-断开,1-连接,2-断网续连状态)
            let ws_status = lodash.get(event,'ws_status');
            let ws_status_old = lodash.get(event,'ws_status_old');
            this.socket_status(ws_status, ws_status_old);
            break;
          default:
            break;
        }
      }
    },
    // ...mapActions({
    //   // 设置websocket连接状态
    //   set_socket_status: 'set_socket_status',
    //   // 监听页面是否转入休眠状态
    //   set_vue_hidden_run: 'set_vue_hidden_run',
    //   //设置全局开关
    //   set_global_switch: 'set_global_switch',
    // }),
    set_socket_status(){},
    set_vue_hidden_run(){},
    /**
     * @description: 赛事订阅(C2)-盘口/投注项(C106)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C2() {
      let obj = {};
      WsMan.skt_send_bat_handicap_odds(window.ws, obj);
    },
    /**
     * @description: 订单订阅(C3)-未结算订单数(C202)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C3() {
      let obj = {};
      obj.cuid = UserCtr.get_uid();
      WsMan.skt_send_order(window.ws, obj);
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
      WsMan.skt_send_initiative_push(window.ws, obj);
    },
    /**
     * @description: 菜单订阅C5-菜单栏目统计(C301)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C5() {
      let obj = {};
      obj.cdt = "4";
      WsMan.skt_send_menu(window.ws, obj);
    },
    /**
     * @description: 全局开关
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    SCMD_C7() {
      WsMan.skt_send_switch(window.ws);
    },
    /**
     * @description: 菜单订阅C51菜单栏目统计(C501)
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
    SCMD_C51(obj) {
      WsMan.skt_send_menu2(window.ws, obj);
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
    },
    /**
     * @description: 全局开关推送
     * @param {Object} obj 推送的消息体
     * @return {undefined} undefined
     */
     RCMD_C701(obj) {
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
      // TODO hanmar 设置全局开关 
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
      if (this.get_uid && skt_data.cuid == this.get_uid) {
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
        .check_balance({ uid: UserCtr.get_uid(), t: new Date().getTime(), gcuuid:gcuuid })
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
            // TODO hanmar 通知更新用户金额
          }
      });
    }
  }
}
</script>