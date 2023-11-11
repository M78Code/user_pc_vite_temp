/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: websocket数据页面数据接入 ---- 投注订单(投注记录和注单历史部分)
 */
import { mapGetters, mapActions } from "vuex";
import { WsSend } from "src/core/data-warehouse/ws/ws-ctr/ws-ctr.js";
export default {
  computed: {
    ...mapGetters({
      socket_status: 'get_socket_status', // socket状态
      vx_get_uid: 'get_uid',  // 用户id      
      
      vx_is_bet_single: 'is_bet_single',  //单关
      vx_get_bet_single_obj: 'get_bet_single_obj', //单关对象
      vx_get_bet_single_list: 'get_bet_single_list', //单关列表
     
      // 串关部分
      vx_get_bet_list: 'get_bet_list',   //串关列表
      vx_get_bet_obj: 'get_bet_obj',     // 串关对象
      vx_get_bet_s_list: 'get_bet_s_list',  //串关投注列表
      vx_get_bet_s_obj: 'get_bet_s_obj',    //串关投注列表对象
      vx_get_is_handle: "get_is_handle"  //处理中
    }),
  },
  mounted() {
    if(window.ws) {
      let socket_name = this.socket_name || 'skt_data_order';
      //注册
      window.ws.addQueueViewObj(socket_name, this);
    }
  },
  methods: {
    ...mapActions({
      vx_bet_single_obj_attr: "bet_single_obj_attr",  //添加单关投注项对象
      vx_bet_obj_add_attr: "bet_obj_add_attr"   //添加串关投注项对象
    }),
    /**
     * @description: 发送启动命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketInitCmd() {
      clearTimeout(this.send_init_timer);
      this.send_init_timer = setTimeout(() => {
        // 发送赛状态订阅息命令C1
        this.SCMD_C3();
      }, 0);
    },
    SCMD_C21() {
      //{"cmd":"C21","list":[{"hid":"142725909041383","oid":"142725909041383930"},{"hid":"142725909041383","oid":"142725909041383931"}],"requestId":"2c7cd42c97020001b7fb0688654fc2708dd5c31e"}
     let obj = {list: []};
      for(let record of Object.values(this.record_obj)) {
        // 单关
        if(record.seriesType == '1' && record.initPresettleWs) {
          let hid = _.get(record, 'orderVOS.0.marketId', '');     //盘口id
          let oid = _.get(record, 'orderVOS.0.playOptionsId', '');  //投注项id
          let ov =  _.get(record, 'orderVOS.0.oddFinally'); //最终赔率
          let marketType =  _.get(record, 'orderVOS.0.marketType');  //盘口类型
          if(marketType == 'HK') {  //香港盘
            ov = (ov * 1 + 1).toFixed(2);
          }
          if(hid && oid) {
            obj.list.push({
              hid,
              oid,
              ov
            });
          }       
        }
      }
      // 发送注单盘口赔率命令C21
      WsSend.sktSendBatHandicapOdds2(window.ws, obj);
    },
    /**
     * @description: 订阅订单推送
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C3() {
      let obj = {};
      obj.cuid = this.vx_get_uid;
      WsSend.sktSendOrder(window.ws, obj);
    },
    /**
     *  C201推动数据
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
     * @description: 订单状态推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C201(obj) {
      //数据不存在且cd存在
      if (!obj && obj.cd) {
        return;
      }
      // preStatus 0:原有结算逻辑, 1:是提前结算  
      let skt_data = obj.cd;
      let socket_name = this.socket_name || 'skt_data_order';
      switch (socket_name) {
        // 历史注单
        case "bet_records":
        // 投注记录
        case "bet_record_view":
          // 只处理已结算和未结算的订单状态          
          if (this.record_obj[skt_data.orderNo]) {
            let status = skt_data.status == 1 ? 0 : 4;
            //console.log(`合并前===============>${JSON.stringify(this.record_obj[skt_data.orderNo])}`);
            let enablePreSettle = skt_data.preStatus ? true: false;
            let skt_obj = { orderStatus: `${status}` };
            // 设置提前结算的订单状态orderStatus 风控状态 1通过  2拒绝
            if(enablePreSettle) {
              Object.assign(skt_obj, {
                enablePreSettle,
                settle_status: skt_data.orderStatus
              });
              // 注单历史需要发送消息
              if(socket_name == 'bet_records') {
                // 设置注单历史结算订单状态
                this.$root.$emit(this.emit_cmd.EMIT_SET_PRE_ORDER_STATUS_CMD, {orderNo:skt_data.orderNo, settle_status: skt_data.orderStatus});
              }
            }
            // 合并订单状态
            Object.assign(this.record_obj[skt_data.orderNo], skt_obj); 
            if(!skt_data.orderOddsVos || (skt_data.orderOddsVos && skt_data.orderOddsVos.length == 0)) return;   
            if(skt_data.isOddsChange && 
                this.record_obj[skt_data.orderNo].orderVOS && 
                this.record_obj[skt_data.orderNo].orderVOS.length) {                 
                Object.assign(this.record_obj[skt_data.orderNo], {maxWinAmount: parseFloat(skt_data.newTotalMaxWinAmount)});
                let order_odds_vo = {};
                _.forEach(skt_data.orderOddsVos, skt_vos_item => {  
                  order_odds_vo[skt_vos_item.oid] = skt_vos_item               
                });
                _.forEach(this.record_obj[skt_data.orderNo].orderVOS, item => {
                  let obj = order_odds_vo[item.playOptionsId];
                  if(obj) {
                    // 合并赔率
                    Object.assign(item, {oddFinally: `${obj.ov}`});
                  }
                });
                //检查状态是否从确认中变为已完成
                this.check_confirm_complete();
            }
            if(socket_name == 'bet_records') {
              let skt_record_obj = {};
              skt_record_obj[skt_data.orderNo] = this.record_obj[skt_data.orderNo];
              // 设置注单历史结算概率(probabilities)和cashOutStatus的值
              this.$root.$emit(this.emit_cmd.EMIT_SET_WS_INFO_DATA_CMD, skt_record_obj);
            }           
          }
        break;
      }
    },
    /**
     * @description: 未结算订单数量
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C202(obj) {
      //数据不存在且cd存在
      if (!obj && obj.cd) {
        return;
      }

      let skt_data = obj.cd;
      // 先根据用户id去匹配，匹配到了在根据页面是否在投注记录 然后投注记录需要有数据且未结算树龄与同送过来的数量不相等再进行拉去接口
      if (this.vx_get_uid == skt_data.cuid && 
        this.socket_name =='bet_records' &&
        this.toolSelected == 0 &&
        this.order_list &&
        skt_data.count != this.order_list.total) {
        this.getOrderList(true);
      }
    },
    /**
     * C210 推送数据
     * `hid` 盘口id
     * `oid` 投注项id (当cashOutStatus!=1可能为null)
     * `probabilities` 概率
     * `ov` 欧赔(为两位小数)
     * `cashOutStatus` 1 AVAILABLE(=1才能提前结算), -1 UNAVAILABLE, -2 CLOSED
     * `hs` 盘口状态 0:开盘，1:封盘 2:关盘 11:锁盘
     * @description: 提前结算(C21)-投注项(C210)
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C210(obj) {
      //数据不存在
      if (!obj) {
        return;
      }
      if(_.isEmpty(this.record_obj)) {
        return;
      }
      let socket_name = this.socket_name;
      let skt_data = obj.cd;   
      let records = Object.values(this.record_obj);
      records = records.filter(item => item.seriesType == 1);
      let skt_record_obj = {};
      _.forEach(skt_data, item => {   
        let len = records.length;    
        for(let i = 0; i < len; i++) {
          let it = records[i];
          let order_obj = _.get(it, 'orderVOS.0', {});
          if(!_.isEmpty(order_obj) && 
            // (order_obj.marketId == item.hid || order_obj.playOptionsId == item.oid)) {  //玩法id
              (order_obj.marketId == item.hid)) {  //玩法id
              skt_record_obj[it.orderNo] = it;   //订单号
              if(order_obj.marketId == item.hid) {
                if(this.record_obj[it.orderNo].enablePreSettle && this.record_obj[it.orderNo].settle_status == 0) {
                  this.record_obj[it.orderNo].cash_out_status = item.cashOutStatus;
                  Object.assign(skt_record_obj[it.orderNo], {
                    cash_out_status: item.cashOutStatus
                  });
                }                
                this.record_obj[it.orderNo].orderVOS[0].hs = item.hs;
                if(!this.record_obj[it.orderNo].enablePreSettle && item.cashOutStatus == 1) {
                  this.record_obj[it.orderNo].enablePreSettle = true;
                }
                Object.assign(skt_record_obj[it.orderNo], {
                  hs: item.hs
                });
              }
              // let ov = this.record_obj[it.orderNo].orderVOS[0].oddFinally;
              // let marketType = this.record_obj[it.orderNo].orderVOS[0].marketType;
              // let skt_ov = item.ov;
              // if(marketType == 'HK') {
              //   skt_ov = (item.ov * 1 - 1).toFixed(2);
              // }
              // if(order_obj.playOptionsId == item.oid && ov == skt_ov) {
              //   //正在确认中，或者已经成功的
              //   let bet_status = _.get(this.record_obj,`${it.orderNo}.bet_status`);
              //   if(!['start_bet_pre','end_bet_pre'].includes(bet_status)) {
              //     this.record_obj[it.orderNo].orderVOS[0].probabilities = item.probabilities;
              //     skt_record_obj[it.orderNo].orderVOS[0].probabilities = item.probabilities;                  
              //   }
              // }
          }
        }
      });
      if(socket_name == 'bet_records') {
        // 设置注单历史结算概率(probabilities)和cashOutStatus的值
        this.$root.$emit(this.emit_cmd.EMIT_SET_WS_INFO_DATA_CMD, skt_record_obj);
      } else {
        // 获取提前结算按钮上的金额
        this.$root.$emit(this.emit_cmd.EMIT_GET_PRE_AMOUNT_CMD);
      }
    }
  },
  destroyed: function () {
    clearTimeout(this.send_init_timer);
    if(window.ws)
    {
      let socket_name = this.socket_name || 'skt_data_order';
      window.ws.removeQueueViewObj(socket_name);
    }
  }
}