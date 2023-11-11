/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: websocket数据页面数据接入 ---- 单关投注订单
 */
import { WsSend } from "src/core/data-warehouse/ws/ws-ctr/ws-ctr.js";
import { mapGetters, mapActions } from "vuex";
import play_mapping from "src/public/config/mapping/play_mapping.js";
export default {
  computed: {
    ...mapGetters({
      socket_status: 'get_socket_status', // socket状态
      vx_get_uid: 'get_uid',  // 用户id    
      is_bet_single: 'is_bet_single',  // 单关
      // 单关投注对象
      vx_get_bet_single_obj: 'get_bet_single_obj',
      // 串关投注对象
      vx_bet_obj: 'get_bet_obj',
      // 是否为虚拟体育投注
      vx_get_is_virtual_bet: "get_is_virtual_bet",
    }),
  },
  mounted() {
    //ws存在就添加订阅对象
    if(window.ws) {
      window.ws.addQueueViewObj('skt_data_single_order', this);
    }
  },
  methods: {
    ...mapActions({
      vx_bet_single_obj_attr: 'bet_single_obj_attr',
      vx_bet_obj_add_attr: 'bet_obj_add_attr',  
    }),
   /**
     * @description: 发送启动命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketInitCmd() {
      //先清除定时器，再使用
      clearTimeout(this.send_init_timer);
      this.send_init_timer = setTimeout(() => {
        // 发送赛状态订阅息命令C1
        this.SCMD_C3();
      }, 0);
    },
    /**
     * C3订阅参数`cuid` 用户id
     * `说明:` 订阅后会推送C201,C202
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
     * @description: 订单状态推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C201(obj) {   
      //数据不存在且cd存在 或者 是单关不处理  
      if ((!obj && obj.cd) || !this.is_bet_single) { //单关
        return;
      }
      // console.log(`============RCMD_C201========get_bet_mode:${this.vx_get_bet_mode}`);   
      let skt_data = obj.cd;
      // console.log(`============RCMD_C201==================order_detail_data:${this.view_ctr_obj.order_detail_data.length}`);
      // 单关记录
      if (this.view_ctr_obj.order_detail_data) {    
        let index = this.view_ctr_obj.order_detail_data.findIndex(item => item.orderNo == skt_data.orderNo);
        // console.log(`============RCMD_C201==================index:${index}`);
        if(index > -1) {
          // C201推送与接口拉取,谁最后执行谁
          if(this.view_ctr_obj.order_detail_data[index].handle_time && this.view_ctr_obj.order_detail_data[index].handle_time > obj.ctsp){
            return;
          }
          if(skt_data.refuseCode == '0400532') {  //赔率调整中
            this.view_ctr_obj.error_code = skt_data.refuseCode;
          }
          let status = skt_data.status == 1 ? 1 : 0;
          Object.assign(this.view_ctr_obj.order_detail_data[index], { orderStatusCode: status, handle_time: obj.ctsp });
          let order_odds_vo = {};
          _.forEach(skt_data.orderOddsVos, skt_vos_item => {  
            order_odds_vo[skt_vos_item.oid] = skt_vos_item               
          });
          // 成功的时候需要修改最高可赢额和最终赔率
          if(skt_data.isOddsChange && (skt_data.orderOddsVos && skt_data.orderOddsVos.length>0)) { 
            _.forEach(this.view_ctr_obj.order_detail_data, item=>{
              let obj = order_odds_vo[item.playOptionsId];
              if(obj) {
                // 合并赔率
                Object.assign(item, {oddsValues: `${obj.ov}`});
              }
            });
            Object.assign(this.view_ctr_obj.order_detail_data[index], { maxWinMoney: skt_data.newTotalMaxWinAmount*100});
          }
          let success_count = 0; // 注单提交成功的个数
          let confirm_count = 0; // 注单确认中的个数
          let fail_count = 0; // 注单失败的个数
          _.forEach(this.view_ctr_obj.order_detail_data, item=>{
            if(item.orderStatusCode == 0) {   //失败
              fail_count++;
            } else if(item.orderStatusCode == 1) { // 成功
              success_count++;
            } else if(item.orderStatusCode == 2) {  // 确认中
              confirm_count++;
            }
          });
          // 全部成功
          if(success_count == this.view_ctr_obj.order_detail_data.length) {
            this.view_ctr_obj.order_confirm_complete = 2; 
          }
          // 全部失败
          if(fail_count == this.view_ctr_obj.order_detail_data.length) {
            this.view_ctr_obj.order_confirm_complete = 3;
          }
          // 确认中的
          if(confirm_count > 0) {
            this.view_ctr_obj.order_confirm_complete = 1;  
          }
          // 有成功有失败的
          if(fail_count > 0 && success_count > 0 && ((fail_count + success_count) == this.view_ctr_obj.order_detail_data.length)) {
            this.view_ctr_obj.order_confirm_complete = 4
          }
          // 如果是老流程且无确认中状态 则中断计时器
          if(confirm_count == 0) {  
            //重置定时任务标志                                                                                      
            this.interval_time();
          }
          //新流程
          if(skt_data.newProcessOrder == 1){
            // console.log(`=====skt_data_mix_order====series_order_success=====${this.view_ctr_obj.series_order_success.length}`); 
            if(skt_data.refuseCode) {
              this.refuse_code = skt_data.refuseCode;
            }  
            // console.log(`=========skt_data_mix_order============refuse_code:${this.refuse_code}==========status:${status}`);      
            if(status == 0) { // 如果是新流程，且有失败              
              if([0,1].includes(skt_data.tryNewProcessBet) && this.call_interface!=2) { // 如果是新流程且tryNewProcessBet为1则需要拉去状态接口一次             
                this.call_interface = 1;
              } else if(skt_data.tryNewProcessBet == 2) { // 投注限额发生变化需要同步最大最小值
                this.call_interface = 2;
              } 
            } 
            // console.log(`=========skt_data_mix_order====bet_mode:${this.vx_get_bet_mode}====tryNewProcessBet:${skt_data.tryNewProcessBet}======all_interface:${this.call_interface}=====order_confirm_complete:${this.view_ctr_obj.order_confirm_complete}`);   
            if(confirm_count == 0) { // 如果没有待确认的订单，则需要拉去一次接口
              // console.log(`===============order_confirm_complete:${this.view_ctr_obj.order_confirm_complete}===============`);
              if(this.view_ctr_obj.order_confirm_complete == 2) {
                this.refuse_code = undefined;
                this.call_interface = 0; 
              } else if([3,4].includes(this.view_ctr_obj.order_confirm_complete)) {
                this.call_final();
              }
              if(this.timer_obj['time_over']) {
                clearTimeout(this.timer_obj['time_over']);
              }
              if(this.view_ctr_obj.timer_) {
                clearTimeout(this.view_ctr_obj.timer_);
                this.view_ctr_obj.timer_ = undefined;
              }
            }
          }
        }
      }
    },
    /**     
     * C103 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `msc` 比分
     * @description: 赛事比分
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     * {
     * "cd": {
     *   "csid": 1,
     *   "mid": "2017671",
     *   "msc": [
     *       "S1|3:3",
		 *       "S5|3:5",
     *       "S108|11:8",
     *       "S110|8:10",
     *       "S10903|5:3",
     *       "S19|29:20",
     *       "S11|2:4",
     *       "S12|1:3"
     *     ]
     *   },
     *   "cmd": "C103",
     *   "ctsp": "1580718972981"
     *  }
     */
    RCMD_C103(obj) {
      // console.log('-------------skt_data_list----赛事比分C103------------obj:' + obj);
      //数据不存在或者是虚拟体育
      if (!obj || this.vx_get_is_virtual_bet) {
        return;
      }
      let skt_data = obj.cd;
      let score_obj = this.is_bet_single ? _.cloneDeep(this.vx_get_bet_single_obj):_.cloneDeep(this.vx_bet_obj);
        // console.log('-------------skt_data_list----赛事比分C103------------合并数据前',this.vx_get_bet_single_obj);
      let new_obj = {};
      for (const key in score_obj) {
          let bet_single_obj = _.get(score_obj, key);
          if(_.get(bet_single_obj,'cs.match_id') != skt_data.mid) continue;
          bet_single_obj.bs.msc = skt_data.msc
                let item_obj = _.get(bet_single_obj,'bs');
                let item_cs = _.get(bet_single_obj,'cs');
                // 球种id
                let sport_id = _.get(item_obj, 'csid');
                // 玩法id
                let play_id = _.get(item_obj, 'hps[0].hpid');
                // 主队比分
                let home_score = 0;
                // 客队比分
                let away_score = 0;
                // timerly_score_type:及时比分类型 timerly_home_score:主队及时比分 timerly_away_score:客队及时比分
                let timerly_score_type ='';
                let score_type="S1"
                // 投注项来源于赛事列表
              {
                let hpid = _.get(item_obj, 'hps[0].hpid');
                score_type = _.get(play_mapping,`SCORE_BASE_KEY[${hpid}]`,"S1");
                  // 比分对象
                  // let msc_obj = _.get(item_obj, 'msc');          
                  let msc_obj = this.yabo_common.msc_array_obj(skt_data.msc);
                  if(msc_obj instanceof Array) {
                    // 将数组对象转换成对应的Object类型的对象
                    // msc_obj = this.yabo_common.msc_array_obj(msc_obj);
                  }
                  if(_.get(msc_obj,`${score_type}`,false)) {
                    // 主队比分
                    home_score = _.get(msc_obj,`${score_type}.home`) || '0';
                    // 客队比分
                    away_score = _.get(msc_obj,`${score_type}.away`) || '0';
                  }
                  // sport_id在一下取值的含义 1:足球，2:篮球，3:棒球，8:乒乓球，9：排球
                  // 当为对应的球种时对应玩法id存在对应数组对象中则是需要显示及时比分的
                  if((sport_id == '1' && play_mapping.FOOTBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
                  (sport_id  == '2' && play_mapping.BASKETBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
                  (sport_id == '3' && play_mapping.BASEBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
                  (sport_id == '8' && play_mapping.TENNIS_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
                  (sport_id == '9' && play_mapping.VOLLEYBALL_TIMERLY_SCORE_HPID.includes(play_id * 1))) {
                    // 获取及时比分的类型(即为S几比分)
                    timerly_score_type = play_mapping.SPORT_PLAY_TO_SCROE[sport_id][play_id];
                    // 并且及时比分类型只有一个(不包含其他及时比分不是如"S1,S2,S3"的形式)
                    if(!timerly_score_type.includes(",")) {
                      // 获取主队及时比分
                      item_cs.timerly_home_score =  _.get(msc_obj,`${timerly_score_type}.home`);
                      // 获取客队及时比分
                      item_cs.timerly_away_score =  _.get(msc_obj,`${timerly_score_type}.away`);
                      	// 全场比分时赋值更新比分
                        if(timerly_score_type == 'S1'){
                          // 主队及时比分
                          item_cs.home_score = home_score;
                          // 获取客队及时比分
                          item_cs.away_score = away_score;
                        }
                    } else {
                      // 及时比分类型只有多个如"S1,S2,S3"的形式，则转换成数组              
                      let _score_type_arr = timerly_score_type.split(",");
                      // 通过球种id，玩法id，赛事阶段在对应的映射对象中获取其对应的及时比分类型
                      timerly_score_type = _.get(play_mapping.SPORT_PLAY_TO_STAGE_SCROE,`${sport_id}.${play_id}.${item_obj.mmp}`);
                      // 及时比分类型存在
                      if(_score_type_arr.includes(timerly_score_type)) {
                        // 主队及时比分
                        item_cs.timerly_home_score = _.get(msc_obj,`${timerly_score_type}.home`);
                        // 获取客队及时比分
                        item_cs.timerly_away_score = _.get(msc_obj,`${timerly_score_type}.away`);
                      } else {
                          // 主队及时比分取主队比分
                          item_cs.timerly_home_score = home_score;
                          // 客队及时比分取客队比分
                          item_cs.timerly_away_score = away_score;
                        }
                        // 足球而且15分钟玩法
                        if (sport_id == 1 && [32, 33, 34,231,232,233,370,371,372].includes(play_id*1)) {
                          // 玩法比分
                          // "S1001|0:2"
                          let hps = _.get(item_obj, 'hps[0].hps');
                          if(hps && hps.includes('|') && hps.includes(':')) {
                            let timerly_total = hps.split('|')[1]
                            let timerly_total_ = timerly_total.split(':')
                            item_cs.timerly_home_score = timerly_total_[0]
                            item_cs.timerly_away_score = timerly_total_[1]
                          } else {
                            // 不展示比分
                            item_cs.timerly_home_score = ''
                            item_cs.timerly_away_score = ''
                          }
                        } 
                    }
                  }
                }
                new_obj[key] = bet_single_obj;
                //往串关列表添加数据按键值存储
                if(!this.is_bet_single) {
                  bet_single_obj.key = key;
                  this.vx_bet_obj_add_attr(new_obj[key])
                }
      }
      //往单关列表添加数据直接覆盖
      if(this.is_bet_single) {
        this.vx_bet_single_obj_attr(score_obj);
      }     
      // console.log('-------------skt_data_list----赛事比分C103------------合并数据后',this.vx_get_bet_single_obj);
    },
    /**
     * @description: 最终调用接口
     */
    call_final() {
      // console.log(`=========skt_data_single_order=========timer_obj['time_over']:${this.timer_obj['time_over']}`);
      if(this.timer_obj['time_over']) {
        clearTimeout(this.timer_obj['time_over']);
      }
      // console.log(`=========skt_data_single_order=========timer_:${this.view_ctr_obj.timer_}`);
      if(this.view_ctr_obj.timer_) {
        clearTimeout(this.view_ctr_obj.timer_); 
        this.view_ctr_obj.timer_ = undefined;
      }
      // console.log(`=========skt_data_single_order=========refuse_code:${this.refuse_code}`);
      if(this.refuse_code) {
        //投注后返回的错误结果处理
        this.submit_error_result(this.refuse_code);
        // 0402010 盘口值已变更 0400467 坑位已发生改变，投注失败
        this.call_interface = ['0402010','0400467'].includes(this.refuse_code)? 0: this.call_interface; // 0400467 会拉去投注前校验的接口
      }   
      // console.log(`=========skt_data_single_order=========call_interface:${this.call_interface}`);   
      // 新流程且失败了根据tryNewProccessBet决定是否拉取接口
      if(this.call_interface == 1) {
        //投注前拉取最新的盘口赔率状态(应对socket推送不及时)
        this.check_odds_beforebet(()=>{
          if(this.refuse_code != '0400532') { //赔率调整中
            this.refuse_code = undefined;
          }
          this.call_interface = 0; // 复位调用接口标识               
        });
      } else if(this.call_interface == 2) { // 投注限额发生变化需要同步最大最小值
        //投注前拉取最新的盘口赔率状态(应对socket推送不及时)
        this.check_odds_beforebet(()=>{
          this.refuse_code = undefined;
          this.call_interface = 0; // 复位调用接口标识
          this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_RECALL_MONEY_CMD);
        });
      }
    }
  },
  destroyed: function () {
    clearTimeout(this.send_init_timer);
    if(window.ws)
    {
      window.ws.removeQueueViewObj('skt_data_order');
    }
  }
}