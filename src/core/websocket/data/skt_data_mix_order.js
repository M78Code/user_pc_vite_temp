/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: websocket数据页面数据接入 ---- 串关投注订单
 */
import { mapGetters } from "vuex";
import { WsSend } from "src/core/data-warehouse/ws/ws-ctr/ws-ctr.js";
export default {
  computed: {
    ...mapGetters({
      // socket状态
      socket_status: 'get_socket_status',
      // 用户id
      vx_get_uid: 'get_uid',
      // 是否为单关投注
      is_bet_single: 'is_bet_single'
    }),
  },
  mounted() {
    if(window.ws) {
      //增加订阅对象
      window.ws.addQueueViewObj('skt_data_mix_order', this);
    }
  },
  methods: {
    /**
     * @description: 发送启动命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketInitCmd() {
      clearTimeout(this.send_socket_init);
      this.send_socket_init = setTimeout(() => {
        // 发送赛状态订阅息命令C1
        this.SCMD_C3();
      }, 0);
    },
    /**
     * @description: 订阅订单推送
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C3() {
      let obj = {};
      obj.cuid = this.vx_get_uid;
      //发送订单信息命令C3
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
      //数据不存在或者是单关投注
      if ((!obj && obj.cd) || this.is_bet_single) {
        return;
      }
      let skt_data = obj.cd;
      // console.log(`============RCMD_C201========order_detail_data:${this.view_ctr_obj.series_order_data.length}=====`);
      // 串关记录
      if (this.view_ctr_obj.series_order_data && this.view_ctr_obj.series_order_data.length > 0) {
        let find_index = _.findIndex(this.view_ctr_obj.series_order_data, item => item.orderNo == skt_data.orderNo);
        // console.log(`============RCMD_C201==================index:${find_index}`);	 
        if (find_index > -1) { 
          // console.log(`============RCMD_C201=======handle_time:${JSON.stringify(this.view_ctr_obj.series_order_data[find_index].handle_time)}======ctsp:${obj.ctsp}`);	 
          // C201推送与接口拉取,谁最后执行谁
          if(this.view_ctr_obj.series_order_data[find_index].handle_time && this.view_ctr_obj.series_order_data[find_index].handle_time > obj.ctsp) {
            return;
          } 
          if(skt_data.refuseCode == '0400532') { //赔率调整中
            this.view_ctr_obj.error_code = skt_data.refuseCode;
          }
          let status = skt_data.status == 1 ? 1 : 0;  
          // console.log(`============RCMD_C201==================status:${status}`);	 								
          Object.assign(this.view_ctr_obj.series_order_data[find_index], { orderStatusCode: status, handle_time: obj.ctsp });
          let order_odds_vo = {};
          _.forEach(skt_data.orderOddsVos, skt_vos_item => {  
            order_odds_vo[skt_vos_item.oid] = skt_vos_item               
          });
          // 成功的时候需要修改最高可赢额和最终赔率
          if(skt_data.isOddsChange && (skt_data.orderOddsVos && skt_data.orderOddsVos.length > 0)) { 
            _.forEach(this.view_ctr_obj.order_detail_data, item => {
              let obj = order_odds_vo[item.playOptionsId];
              if(obj) {
                // 合并赔率
                Object.assign(item, {oddsValues: `${obj.ov}`});
              }
            });    
            Object.assign(this.view_ctr_obj.series_order_data[find_index], { maxWinAmount: skt_data.newTotalMaxWinAmount*100});
          }
          
          let success_count = 0; // 注单提交成功的个数
          let confirm_count = 0; // 注单确认中的个数
          let fail_count = 0; // 注单失败的个数
          _.forEach(this.view_ctr_obj.series_order_data, item => {
            if(item.orderStatusCode == 0) { //失败
              fail_count++;
            } else if(item.orderStatusCode == 1) { //成功
              success_count++; 
            } else if(item.orderStatusCode == 2) { //确认
              confirm_count++;
            }
          });
          // 全部成功
          if(success_count == this.view_ctr_obj.series_order_data.length) {
            this.view_ctr_obj.order_confirm_complete = 2;
          }
          // 全部失败
          if(fail_count == this.view_ctr_obj.series_order_data.length) {
            this.view_ctr_obj.order_confirm_complete = 3;
          }
          // 确认中的
          if(confirm_count > 0) {
            this.view_ctr_obj.order_confirm_complete = 1;
          }
          // 有成功有失败的
          if(fail_count > 0 && success_count > 0 && ((fail_count+success_count) == this.view_ctr_obj.series_order_data.length)) {
            this.view_ctr_obj.order_confirm_complete = 4
          }
          // 如果是老流程且无确认中状态 则中断计时器
          if(confirm_count == 0) {                                                              //重置定时任务标志                       
            this.interval_time();
          }
          // console.log(`=========skt_data_mix_order=====confirm_count:${confirm_count}====newProcessOrder:${skt_data.newProcessOrder}`);
          //是投注新流程
          if(skt_data.newProcessOrder == 1){
            this.view_ctr_obj.series_order_success = _.filter(this.view_ctr_obj.series_order_data, (item) => item.orderStatusCode == 1); 
            // console.log(`=====skt_data_mix_order====series_order_success=====${this.view_ctr_obj.series_order_success.length}`); 
            if(skt_data.refuseCode) {
              this.refuse_code = skt_data.refuseCode;
            }  
            // console.log(`=========skt_data_mix_order============refuse_code:${this.refuse_code}==========status:${status}`);      
            if(status == 0) { // 如果是新流程，且有失败              
              if([0,1].includes(skt_data.tryNewProcessBet) && this.call_interface != 2) { // 如果是新流程且tryNewProcessBet为1则需要拉去状态接口一次             
                this.call_interface = 1;
              } else if(skt_data.tryNewProcessBet == 2) { // 投注限额发生变化需要同步最大最小值
                this.call_interface = 2;
              } 
            } 
            // console.log(`=========skt_data_mix_order====bet_mode:${this.vx_get_bet_mode}====tryNewProcessBet:${skt_data.tryNewProcessBet}======all_interface:${this.call_interface}=====order_confirm_complete:${this.view_ctr_obj.order_confirm_complete}`);   
            if(confirm_count==0) { // 如果没有待确认的订单，则需要拉取一次接口
              // console.log(`===============order_confirm_complete:${this.view_ctr_obj.order_confirm_complete}===============`);
              if(this.view_ctr_obj.order_confirm_complete == 2) {
                this.view_ctr_obj.series_order_success = [];
                this.refuse_code = undefined;
                this.call_interface = 0; 
              } else if([3,4].includes(this.view_ctr_obj.order_confirm_complete)) { //全部失败或者有成功有失败的
                //最终调用接口
                this.call_final();
              }
            }
          }
        }
      }
    },
    /**
     * @description: 最终调用接口
     */
    call_final() {
      // console.log(`=========skt_data_mix_order=========timer_obj['over_time']:${this.timer_obj['over_time']}`);
      if(this.timer_obj['over_time']) {
        clearTimeout(this.timer_obj['over_time']);
        this.timer_obj['over_time'] = undefined;
      }
      // console.log(`=========skt_data_mix_order=========timer_:${this.view_ctr_obj.timer_}`);
      if(this.view_ctr_obj.timer_) {
        clearTimeout(this.view_ctr_obj.timer_); 
        this.view_ctr_obj.timer_ = undefined;
      }
      // console.log(`=========skt_data_mix_order=========refuse_code:${this.refuse_code}`);
      //拒单编码存在给提示
      if(this.refuse_code) {
        this.submit_error_result(this.refuse_code); // 给与提示 
        this.call_interface = ['0402010','0400467','0400532'].includes(this.refuse_code)? 0: this.call_interface; // 0400467 会拉去投注前校验的接口
      }       
      // console.log(`=========skt_data_mix_order=========call_interface:${this.call_interface}`);
      // 此处串关与单关不同需要包含0和1
      if([0,1].includes(this.call_interface)) {
        //投注前拉取最新的盘口赔率状态(应对socket推送不及时)
        this.check_odds_beforebet(()=>{
          if(this.refuse_code != '0400532') {
            this.refuse_code = undefined;
          }
          this.call_interface = 0; // 复位调用接口标识
        });
      } else if(this.call_interface == 2) { // 投注限额发生变化需要同步最大最小值 投注前拉取最新的盘口赔率状态(应对socket推送不及时)
        this.check_odds_beforebet(()=>{
          this.set_min_max_money();
          this.refuse_code = undefined;
          this.call_interface = 0; // 复位调用接口标识  
        });
      }
    }
  },
  destroyed: function () {
    clearTimeout(this.send_socket_init);
    if(window.ws) {
      window.ws.removeQueueViewObj('skt_data_order');
    }
  }
}