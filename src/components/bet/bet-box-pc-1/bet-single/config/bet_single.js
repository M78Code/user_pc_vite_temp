/*
 * @Author: 单关投注的mixin文件
 * @Date: 2020-08-04 17:13:55
 * @Description: 单关投注的mixin文件
 */

import betting from "src/public/mixins/betting/betting.js"; // 押注相关功能
import skt_data_single_order from "src/public/mixins/websocket/data/skt_data_single_order.js";  //websocket数据页面数据接入 ---- 单关投注订单
import { api_betting } from "src/public/api/index.js";  //API 共通入口 
import { useMittOn, useMittEmit, useMittEmitterGenerator,MITT_TYPES  } from "src/core/mitt/index.js";
export default {
  name: "bet-single",
  mixins: [betting, skt_data_single_order],
  data() {
    return {

      timer_obj: {}, // 定时器对象
      code_exist: false, //是否有返回code码
      button_text: i18n.t('bet.accept_change'), // 接受变化
      bet_delete_over: false,
      // 单关主题文件路径
      valid_money_obj: {},
      refuse_code: undefined, // 错误码
      call_interface: 0, // 调用接口 1.调用投注前校验接口 2. 调用投注前校验和最大最小值接口
      is_common_amount: false, // 常用金额是否选中
      common_amount: null, //常用金额
      valid_error_codes: this.error_mapping.ERROR_CODE_ODDS_CLOSE,   // 错误码对应投注项失效(关盘)
      show_valid_btn: false,
      user_bet_prefer: false,
      is_forward: -1 //第几个项点击了，其他就锁住
    }
  },
  created() {
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.DOM_ID_SHOW;
 


   //生成事件监听  
   this.handle_generat_emitters()

 


    // 投注模式默认为未知
    this.BetDataCtr.set_bet_mode(-1);
    // 设置投注项为可选
    this.BetDataCtr.set_bet_item_lock(false);
    // 单关正在处理设置为未处理
    this.BetDataCtr.set_is_single_handle(false);
    // 菜单是否改变设置为未改变
    this.BetDataCtr.set_menu_change(false);
    //选中赔率喜好后退出，再次唤起投注栏，赔率喜好没有被保存
    this.$nextTick(() => {
      this.user_bet_prefer = _.get(this.BetData.user,'userBetPrefer') == 1;
    });
//生成事件监听
this.handle_generat_emitters()
    window.addEventListener("keyup", this.keyup_handle); // 监听键盘抬起事件
    this.$emit("set_scroll_this", {type:'bet_this', _this:this}); //设置滚动数据
  },
  beforeUnmount() {
    // 清除计时器对象
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    //清空计时器对象
    this.timer_obj = {};
 
    //移除相应监听事件 //视图销毁钩子函数内执行
    if(this.emitters_off){this.emitters_off()}  
    //清除计时器
    if (this.view_ctr_obj.timer_) {
      clearTimeout(this.view_ctr_obj.timer_);
      this.view_ctr_obj.timer_ = undefined;
    }
    //清空数据源对象
    this.view_ctr_obj = {};
    this.valid_money_obj = {};
    // this.valid_error_codes = {};
    this.$root.$off("enter_press_event",this.keyup_handle); //清除触发enter键执行
    window.removeEventListener("keyup",this.keyup_handle); // 取消监听键盘抬起事件
  },
  computed: {
 

    /**
     * @description: 确定按钮是否显示  
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_confirm_show() {
      let error_code = this.view_ctr_obj.error_code;
      let codes = _.clone(this.error_mapping.ERROR_CODE_CONFIRM_BTN);
      this.error_mapping.ERROR_CODE_NOT_DATA.forEach(code => { // 从后台返回数据错误码,但是无对应的data消息体
        if (!codes.includes(code)) {
          codes.push(code);
        }
      });
      this.error_mapping.ERROR_CODE_ACCOUNT.forEach(code => {// 账户异常类错误码,不需要直接在拉取请求接口
        if (!codes.includes(code)) {
          codes.push(code);
        }
      });
      //bet_order_status 1-投注状态,4-投注失败状态,5-投注校验未通过
      return [1, 4, 5].includes(this.view_ctr_obj.bet_order_status) && codes.includes(error_code);
    },
    /**
     * @description: 接受变化按钮是否显示
     * @param {undefined} undefined
     * @return {Boolean}
     */
    accept_button_show() {
      let error_code = this.view_ctr_obj.error_code;
      // 接受变化按钮对应的错误码
      let codes = this.error_mapping.ERROR_CODE_ACCEPT_BTN;
      // let count =  BetCommonHelper.get_deactive_count();
      //bet_order_status 1-投注状态,2-投注中状态,4-投注失败状态,5-投注校验未通过
      return ([1, 2, 4, 5].includes(this.view_ctr_obj.bet_order_status) && codes.includes(error_code)) && !this.BetData.bet_appoint_obj;
    },
    /**
     * @description: 完成按钮是否显示
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_complete_show() {
      //bet_order_status:3-投注成功状态 order_confirm_complete:2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败  4.所有注单已经确认完成 部分成功部分失败
      return this.view_ctr_obj.bet_order_status === 3 || [2, 3, 4].includes(this.view_ctr_obj.order_confirm_complete);
    },
    /**
     * @description: 是否在投注中
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_loadding() {
      //bet_order_status:2-投注中状态 order_confirm_complete:1.注单确认中
      return this.view_ctr_obj.bet_order_status == 2 || this.view_ctr_obj.order_confirm_complete == 1;
    },
    /**
     * @description: 这里预约投注成功后处理页面跳转
     * @param {undefined} undefined
     * @return {Boolean} 是否未投注: true, 已投注: false
     */
    bet_flag() {
      if(this.BetData.bet_mode == 0) {
        return false;
      }
      return this.BetData.bet_mode == -1 || (this.BetData.bet_mode == 1 && this.view_ctr_obj.order_confirm_complete != 2);
    },
    /**
     * @description 模式2下投注失败标识
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_fail_flag() {
      return this.BetData.bet_mode == -1 && [3,4].includes(this.view_ctr_obj.order_confirm_complete);
    },
    /**
     * @description 判断是否有无效的投注项
     * @param {undefined} undefined
     * @return {undefined} undefined
    */
    has_disable_item() {
      return BetCommonHelper.has_disable_item();
    },
    /**
     * 删除无效项按钮是否显示
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    show_invalid_btn() {
      let count = BetCommonHelper.get_deactive_count();
      return this.BetData.bet_single_list.length > 1 && count > 0 && this.bet_flag;
    }
  },
  watch: {
    /**
     * @description: 监听单关对象变化
     * @param {undefined} undefined 是否在最大最小值范围内
     * @return {undefined} undefined
     */
    'BetData.bet_single_obj'() {
      this.common_amount = localStorage.getItem('common_amount')
    },
    /**
     * @description: 监控当前串关金额的范围
     * @param {Array} new_ 是否在最大最小值范围内
     * @return {undefined} undefined
     */
    "view_ctr_obj.single_range_money"(new_) {
      if(![-4,0].includes(new_) && this.view_ctr_obj.error_code != "M400005") {
        clearTimeout(this.timer_obj['range_money']);
        this.timer_obj['range_money'] = setTimeout(() => {
          this.view_ctr_obj.error_code = "";
          this.view_ctr_obj.error_message = "";
          this.view_ctr_obj.single_range_money = 0;
        }, 3000);
      }
    },
    /**
     * @description: 监控投注是否完成
     * @param {Number} new_  0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败  4.所有注单已经确认完成 部分成功部分失败
     * @return {undefined} undefined
     */
    "view_ctr_obj.order_confirm_complete"(new_) {
      // 新的投注流程会到投注页面
      if([3,4].includes(new_)) {
        this.view_ctr_obj.bet_order_status = 4;
        if(this.BetData.bet_mode === 1) {
          this.BetDataCtr.set_bet_mode(-1);
        } else {
          this.view_ctr_obj.bet_order_status = 3;
        }
      }
      if([2,3,4].includes(new_)) {
        clearTimeout(this.timer_obj['time_over']);
        useMittEmit(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD);
        
        let mids = [], has_match_collect = false, has_hot_collect = false;
        let len = this.BetData.bet_single_list.length
        for(let i = 0;i < len; i++) {
          let id = this.BetData.bet_single_list[i];
          if (id && this.BetData.bet_single_obj[id]) {
            let bet_single_obj = this.BetData.bet_single_obj[id];
            if(bet_single_obj.cs.source == 'hot') {
              has_hot_collect = true;
            } else {
              let mid = _.get(bet_single_obj, 'cs.match_id');
              if(mid && !mids.includes(mid)) {
                mids.push(mid);
                has_match_collect = true;
              }
            }
          }
        }
        // 来源为热门赛事
        // if (has_hot_collect) {
        //   // 热门赛事收藏
        //   useMittEmit(MITT_TYPES.EMIT_HOT_COLLECT);
        // }
        // //投注成功后会调用这里，把赛事收藏起来
        // if(has_match_collect) {
        //   // 收藏投注赛事
        //   useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_COUNT_CMD, { type: "bet", mids });
        // }
        // 统计未结算订单
        useMittEmit(MITT_TYPES.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
      }

      // 投注项锁住不让点击
      if(this.BetData.bet_mode == 1 && new_ == 1) {
        this.BetDataCtr.set_bet_item_lock(true);
      } else {
        this.BetDataCtr.set_bet_item_lock(false);
        this.BetDataCtr.set_is_single_handle(false);
      }
    },
    /**
     * @description: 当错误码存在时应该保证投注项可以点击
     * @param {Array} new_ 是否在最大最小值范围内
     * @return {undefined} undefined
     */
    "view_ctr_obj.error_code": {
      handler(new_) {
        if(new_) {
          this.BetDataCtr.set_bet_mode(-1);
          this.BetDataCtr.set_bet_item_lock(false);
        }
        if(new_ != 'M400015') {
          this.show_valid_btn = false;
        }
        if(this.valid_error_codes.includes(new_)) {
          this.show_valid_btn = true;
        }
      },
      immediate: true
    },

     /**
     * @description: 投注失败标识
     * @param {Boolean} new_ 是否在最大最小值范围内
     * @return {undefined} undefined
     */
    bet_fail_flag(new_) {
      this.view_ctr_obj.bet_fail_flag = new_;
    },
     /**
     * @description: 监听单关列表变化
     * @param {Object} new_ 新的单关列表
     * @param {Object} old_ 旧的单关列表
     * @return {undefined} undefined
     */
    "BetData.bet_single_list":{
      handler(new_, old_) {
        //flag是bet_single_big_video且当前页面是video时return;
        if(this.flag == 'bet_single_big_video' && this.BetDataCtr.layout_cur_page.cur == 'video') return;
          // if(this.BetDataCtr.layout_left_show != 'bet_list') {
          //   return;
          // }
          if(new_.length == 0) {
            this.BetDataCtr.set_layout_left_show('menu');
            return;
          }
          let count_pa = 0;
          for(let key in this.BetData.bet_single_obj) {
            if(!this.BetData.bet_single_list.includes(key)) { // 如果单关对象中的key在投注项列表中不存在则移除对象
              this.BetDataCtr.bet_single_obj_remove_attr(key);
            } else if (this.BetData.bet_single_obj[key].cs.operate_type == 'PA') { // 统计类型为PA的投注项
              count_pa++;
            }
          }
          //初始化视图
          this.init_view();
          // 投注模式默认为未知
          this.BetDataCtr.set_bet_mode(-1);
          // 设置投注项为可选
          this.BetDataCtr.set_bet_item_lock(false);
          this.BetDataCtr.set_is_single_handle(false);
          if(new_.length == 1) {
            let is_common_amount = localStorage.getItem("is_common_amount");
            this.is_common_amount = JSON.parse(is_common_amount);
            this.common_amount = this.is_common_amount ? Number(localStorage.getItem("common_amount")) : null;
          } else {
            this.is_common_amount = false;
            this.common_amount = null;
          }
          if(new_ && new_.length > 0) {
            this.view_ctr_obj.input_max_flag = 1;
          } else {
            this.view_ctr_obj.input_max_flag = 0;
          }
          if(new_ && old_ && new_.length < old_.length) {
            return;
          }
          // 设置默认的最大最小值
          this.set_default_min_max();                
          if(count_pa > 0) {
            this.query_bet_amount((code, betAmountInfo)=>{    
              this.bet_reset_money_msg();
              if(code == 200 && betAmountInfo && betAmountInfo.length > 0) { 
                let bet_single_obj = _.cloneDeep(this.BetData.bet_single_obj);       
                this.min_max_handle(bet_single_obj, betAmountInfo);
              }
            });
          } else {
            // 同步赔率数据
            this.check_odds_beforebet(() => {
              let bet_single_obj = _.cloneDeep(this.BetData.bet_single_obj); 
              //获取最大最小值接口
              this.set_min_max_money(() => {             
                useMittEmit(MITT_TYPES.EMIT_SINGLE_UPDATE_KEYBOARD_STATUS_CMD);
              }, bet_single_obj);
              this.view_ctr_obj.bet_order_status = 1;
            });
          }
        // }
       
      },
      immediate: true
    },

    /**
     * @description: 监听是否单关发生变化
     * @param {Boolean} new_ 新的单关标识
     * @return {undefined} undefined
     */
    "BetDataCtr.is_bet_single"(new_) {
      if(!this.BetData.is_bet_merge && new_) {
        let count_pa = 0;        
        for(let key in this.BetData.bet_single_obj) {
          if(!this.BetData.bet_single_list.includes(key)) { // 如果单关对象中的key在投注项列表中不存在则移除对象
            this.BetDataCtr.bet_single_obj_remove_attr(key);
          } else if (this.BetData.bet_single_obj[key].cs.operate_type=='PA') { // 统计类型为PA的投注项
            count_pa++;
          }
        }
        // 设置默认的最大最小值
        this.set_default_min_max();
        // 当存在类型为PA的投注项时调用queryBetAmount接口(并将拉取的数据同步到vuex中)
        if(count_pa>0) {
          this.query_bet_amount((code, betAmountInfo)=>{        
            this.bet_reset_money_msg();
            if(code==200 && betAmountInfo&& betAmountInfo.length>0) {  
              let bet_single_obj = _.cloneDeep(this.BetData.bet_single_obj);          
              this.min_max_handle(bet_single_obj, betAmountInfo);
            }
          });
        } else {
          // 当都是类型都为MTS的投注项时调用checkOddsBeforeBet接口 (并将拉取的数据同步到vuex中)
          this.check_odds_beforebet(()=>{
            let bet_single_obj = _.cloneDeep(this.BetData.bet_single_obj);
            //获取最大最小值接口
            this.set_min_max_money(null,bet_single_obj);
            this.view_ctr_obj.bet_order_status = 1;
          });
        }
      }
    },

    /**
     * @description: 监听菜单开关是否发生变化
     * @param {Boolean} new_ 新的菜单开关标识
     * @return {undefined} undefined
     */
    vx_main_menu_toggle:{
      handler() {
        this.user_bet_prefer = _.get(this.BetData.user,'userBetPrefer')==1;
      }
    }
  },
  methods: {
  

    /**
* 生成事件监听  
*/
handle_generat_emitters(){
  let event_pairs=  [
   //单关投注完成
  { type:MITT_TYPES.EMIT_SINGLE_COMPLETE_HANDLE_CMD, callback:this.complete_handle} ,
   //检查单关无效的金额
  { type:MITT_TYPES.EMIT_SINGLE_CHECK_VALID_MOENY_CMD, callback:this.check_valid_money} ,
  //单关保留选项
  { type:MITT_TYPES.EMIT_SINGLE_SAVE_BET_CMD, callback:this.save_bet_items} ,
  //重新调用单关最大最小值接口
  { type:MITT_TYPES.EMIT_BET_SINGLE_RECALL_MONEY_CMD, callback:this.get_min_max_money_by_id} ,
   //触发enter键执行
  { type:MITT_TYPES.EMIT_ENTER_PRESS_EVENT, callback:this.keyup_handle} ,
  ]
  let  { emitters_off } =  useMittEmitterGenerator(event_pairs)
  this.emitters_off=emitters_off
},
 

  
    /**
     * @description: 返回体育项目
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    go_back_project() {
      this.BetDataCtr.set_layout_left_show("menu");
    },
    /**
     * @description: 保留这些选项按钮功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    save_bet_items() {
      this.remove_close_handicap();
      // 点击保留这些选项，返回投注栏保留投注成功的选项
      this.init_view();
      // 初始化单关数据
      this.init_bet_single_data();
      // this.BetDataCtr.set_is_single_handle(false);      
      let count_pa = 0;
      let bet_single_obj = _.cloneDeep(this.BetData.bet_single_obj);
      // 删除处理时间
      for (let key in bet_single_obj) {
        let obj = _.get(bet_single_obj, `${key}`);
        if (_.has(obj,'cs.handle_time')) {
          delete obj.cs.handle_time;
        }
        if(_.has(obj,'cs')) {
          obj.cs.money = "";
          obj.cs.win_money = "";
          obj.cs.min_money = "";
          obj.cs.max_money = "";
          BetCommonHelper.set_bet_obj_value( obj);
          if(obj.cs.operate_type=='PA') {
            count_pa++;
          }
        }
      }
      this.set_default_min_max();
      if(count_pa>0) {
        this.query_bet_amount((code, betAmountInfo)=>{        
          clearTimeout(this.timer_obj['min_max_timer']);
          this.view_ctr_obj.input_max_flag = 2;
          if(this.view_ctr_obj.error_code=='M400012') {
            this.view_ctr_obj.single_range_money = 0; 
            this.view_ctr_obj.error_code = '';
            this.view_ctr_obj.error_message = '';
          } 
          if(code==200 && betAmountInfo&& betAmountInfo.length>0) {  
            let bet_single_obj2 = _.cloneDeep(this.BetData.bet_single_obj);          
            this.min_max_handle(bet_single_obj2, betAmountInfo);
          }
        });
      } else {
        // 同步赔率数据
        this.check_odds_beforebet(()=>{
          let bet_single_obj2 = _.cloneDeep(this.BetData.bet_single_obj);
          //获取最大最小值接口
          this.set_min_max_money(null,bet_single_obj2);
        });
      }
      //清除球头数据
      this.BetDataCtr.set_bet_appoint_obj(null);
    },
    /**
     * @description: 提交按钮功能
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    submit_handle(handle_type) {
      //判断是不是失效
      if (userCtr.show_fail_alert()) {
        return;
      }
      let user = this.BetData.user;
      //验证账户金额
      if(user.balance == 0 || this.check_balance(user.balance)) {
        //余额不足，请充值
        this.set_message('0400454');
        return;
      }
      //这里是要给预约投注加一个赔率过低的提示  只有预约对象不为空进入
      if(!_.isNull(this.BetData.bet_appoint_obj)) {
        let appoint_value = this.$mathjs.multiply(this.BetData.bet_appoint_obj.appoint_odds_value,100000);
        let odds;
        //赔率不为null
        if(!_.isNull(appoint_value)) {
          odds =   appoint_value;
        }
        let oddFinally;
        //最终赔率
        // if (hsw != 1) {
        //   oddFinally = this.compute_value_by_cur_odd_type(temp.odds / 100000, _.get(item_cs, 'break_odds_value') / 100000, hsw);
        // } else {
          oddFinally = this.compute_value_by_cur_odd_type(odds / 100000, null, []);
          if(_.isUndefined(oddFinally)) oddFinally = 0
        // }    
          if(Number(oddFinally) < this.BetData.pre_min_odd_value) { //获取预约投注最小限制额
            this.set_message('0400540');
            let obj = _.cloneDeep(this.BetData.bet_appoint_obj);
            if(obj && !_.isNull(obj.appoint_odds_value)) {
              obj.appoint_odds_value = _.clone(this.BetData.pre_min_odd_value); //获取预约投注最小限制额
                // 设置预约投注项
              this.BetDataCtr.set_bet_appoint_obj(obj);
            }
            return 
          }
      }
      // 1.如果正在处理中 2.最大小值正在获取中 3.输入的限额不在范围内，4.输入框为空 等都不可提交
      if (this.BetData.is_single_handle || ["M400012"].includes(this.view_ctr_obj.error_code)) return;
      // 账户异常直接关闭 或者code码是以下三种,需要先移除数据这些是阶段性的错误
      // 0402046 该赛事阶段没有此玩法 0402047 该赛事无此阶段 0400451 盘口接受时间异常，无法投注
      if (this.error_mapping.ERROR_CODE_ACCOUNT.includes(this.view_ctr_obj.error_code) ||
        ['0402046', '0402047', '0400451'].includes(this.view_ctr_obj.error_code)) {
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
        //关闭投注项
        this.cancel_handle();
        return;
      }
      // 投注项失效
      if(this.valid_error_codes.includes(this.view_ctr_obj.error_code)) {
        this.view_ctr_obj.error_code = "M400015";
        this.show_valid_btn = true;
        return;
      }
      this.show_valid_btn = false;
      //防止串关走到这里
      if(this.BetData.bet_single_list.length == 0) return;
      // 金额为空时提交校验
      if(this.view_ctr_obj.is_empty_money) {
        this.check_money(MITT_TYPES.EMIT_BET_SINGLE_CHECK_MONEY_CMD);
        return;
      }
      if(this.view_ctr_obj.single_range_money == -4) {
        //设置单关最小金额
        useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_MIN_MONEY);
        return;
      }
      //有备注
      this.code_exist = false;
      //判断是否有投注数据发生变化
      this.view_ctr_obj.bet_data_change = false;
      // 打开遮罩
      useMittEmit(MITT_TYPES.EMIT_OPEN_MENU_LOADDING_CMD);
      // 设置投注状态为处理中
      this.view_ctr_obj.bet_order_status = 2;
      // 描述：断网25秒的处理办法
      if (this.timer_obj['time_over']) clearTimeout(this.timer_obj['time_over']);
      this.timer_obj['time_over'] = setTimeout(() => {
        if (this.code_exist) return;
        this.view_ctr_obj.bet_order_status = 5;
        this.BetDataCtr.set_bet_item_lock(false);
        this.BetDataCtr.set_bet_mode(-1);
        // 关闭遮罩
        useMittEmit(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD);
        this.set_message('0400483');//网络异常，请稍后再试
        clearTimeout(this.timer_obj['time_over']);
        if(this.view_ctr_obj.timer_) {
          clearTimeout(this.view_ctr_obj.timer_);
          this.view_ctr_obj.timer_ = undefined;
        }        
      }, 1000 * 25); // 原本30s Aden要求修改为25s
      // 同步赔率数据
      this.check_odds_beforebet((before_code) => {
        // 清除check_odds_beforebet接口超时
        if(before_code) {
          if(this.timer_obj['time_over']) {
            clearTimeout(this.timer_obj['time_over']);
          }
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
        }
        if (before_code == 200) {
          this.view_ctr_obj.bet_order_status = 1;
          // 移除无效盘口前投注项的数量
          let before_count = this.BetData.bet_single_list.length;

          // 如果是无效状态需要移除
          if (this.check_active_status()) {
            // this.remove_close_handicap(()=>{
            //   if(this.BetData.bet_single_list.length==0) {
            //     // 关闭遮罩
            //     useMittEmit(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD);
            //     return;
            //   }
            // });
            this.reset_bet_single();
            return;
          }
          // 是否为接受变化按钮
          if (handle_type == 'accept' && !this.has_disable_item) {
            useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_RESET_CMD);
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
            // 恢复校验
            BetCommonHelper.init_message();
          }

          // 移除无效盘口后投注项的数量
          let after_count = this.BetData.bet_single_list.length;
          // 删除了废弃盘口后无投注项不往下进行
          if (after_count == 0) {
            this.reset_bet_single();
            return;
          }
          // 若为串关,有无效盘口存在,删除盘口后,需要重新点击提交按钮
          if (before_count != after_count) {
            this.reset_bet_single();
            return;
          }
          if (handle_type == 'submit') {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
            // 恢复校验
            BetCommonHelper.init_message();
          }
          //console.log(`=========================single_range_money:${this.view_ctr_obj.single_range_money}`);
          // 校验金额
          if (this.check_money(MITT_TYPES.EMIT_BET_SINGLE_CHECK_MONEY_CMD)) {
            // 校验串关金额
            if (this.view_ctr_obj.error_code) {
              this.set_message(this.view_ctr_obj.error_code, handle_type);//请您输入投注金额
            }
            this.reset_bet_single();
            return;
          } else if (this.check_active()) {
            //校验投注项状态
            this.view_ctr_obj.bet_order_status = 1;  
            this.set_message('M400004');//赔率更新中!
            this.reset_bet_single();
            return;
          }
          if (this.view_ctr_obj.error_code && this.view_ctr_obj.error_code.startsWith("M")) {
            //投注项状态
            this.view_ctr_obj.bet_order_status = 1;
            this.code_exist = true;
            this.reset_bet_single();
            return false;
          }
          // 设置投注状态为处理中
          this.view_ctr_obj.bet_order_status = 2;
          clearTimeout(this.timer_obj['request']);
          this.timer_obj['request'] = setTimeout(() => {
            // 如果从无效变成有效的状态,给用户确认下
            if (this.view_ctr_obj.bet_data_change) {
              // 设置投注状态为处理中
              this.view_ctr_obj.bet_order_status = 1;
              this.reset_bet_single();
              return;
            }
            clearTimeout(this.timer_obj['time_over']);
            this.timer_obj['time_over'] = setTimeout(() => {
              if (this.code_exist) return;
              //投注项校验未通过
              this.view_ctr_obj.bet_order_status = 5;
              this.BetDataCtr.set_bet_item_lock(false);
              this.BetDataCtr.set_bet_mode(-1);
              // 关闭遮罩
              useMittEmit(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD);
              this.set_message('0400483');//服务繁忙，再试一次吧~
              clearTimeout(this.timer_obj['time_over']);
            }, 1000 * 25); // 原本30s Aden要求修改为25s
            // console.log(`===========is_single_handle:${this.BetData.is_single_handle}==========`);
            //正式调用投注接口
            this.bet_submit_data(1, (code, data, msg) =>{
              if (code) {
                this.code_exist = true;
                clearTimeout(this.timer_obj['time_over']);
              }
              if (code == 200) {
                BetCommonHelper.init_message();
                this.view_ctr_obj.bet_order_status = 3;//投注成功状态
                this.view_ctr_obj.order_detail_data = data.orderDetailRespList; //这里是playoptionname的数据源 总进球数区间玩法 预约如果是空  将导致投注记录那里0-1比分不显示
                let lock = data.lock ? data.lock : 0; // 如果没有返回，给默认老的投注流程
                console.log(`===========================>>>>lock:${lock}`);
                this.BetDataCtr.set_bet_mode(lock);
                let success_count = 0; // 注单提交成功的个数
                let confirm_count = 0; // 注单确认中的个数
                let fail_count = 0; // 注单失败的个数
                _.forEach(data.orderDetailRespList, item => {
                  let oid =  _.get(item, 'playOptionsId');
                  let bet_single_obj = _.cloneDeep(BetCommonHelper.get_bet_obj( oid));
                  if(bet_single_obj && bet_single_obj.cs) {
                    bet_single_obj.cs.handle_time = new Date().getTime();
                  }
                  BetCommonHelper.set_bet_obj_value( bet_single_obj); 
                  //正常注单统计数量
                  if(_.isNull(item.preOrderDetailStatus) || !_.hasIn(item,'preOrderDetailStatus' )) {
                    // 订单失败
                    if(item.orderStatusCode == 0) {
                      // 失败的订单数量统计
                      fail_count++;
                    } else if(item.orderStatusCode == 1) { // 订单处理成功
                      // 成功的订单数量统
                      success_count++;
                    } else if(item.orderStatusCode == 2) { // 订单确认中
                      // 确认中的订单数量统计
                      confirm_count++;
                    }
                  }else {
                  //预约统计数量
                    // if(item.preOrderDetailStatus == 0) { //预约中
                    //     confirm_count++;
                    // } else if(item.preOrderDetailStatus == 1) { // 预约成功
                    //     success_count++
                    // } else if(item.preOrderDetailStatus == 2) { //预约取消
                    //     fail_count++;
                    // }
                  if(item.preOrderDetailStatus == 0 || item.preOrderDetailStatus == 1) { //预约中 和 预约成功 都算成功
                      success_count++
                    } else if(item.preOrderDetailStatus == 2) { //预约取消
                        fail_count++;
                    }
                  }
                });
               
                // 确认中的
                if(confirm_count > 0) {
                  this.view_ctr_obj.order_confirm_complete = 1; //投注状态
                  // 进行轮询拉去接口
                  this.get_timed_task();
                }
                if(success_count > 0 && success_count == data.orderDetailRespList.length) {
                  // 全部成功
                  this.view_ctr_obj.order_confirm_complete = 2;
                }
                // 全部失败
                if(fail_count == data.orderDetailRespList.length) {
                  this.view_ctr_obj.order_confirm_complete = 3;
                }
                // 有成功有失败的
                if(fail_count > 0 && success_count > 0 && ((fail_count+success_count) == data.orderDetailRespList.length)) {
                  this.view_ctr_obj.order_confirm_complete = 4
                }
                // console.log(`===========================>>>>order_confirm_complete:${this.view_ctr_obj.order_confirm_complete}`);
                // console.log(`=====================>>>>>>bet_flag:${this.bet_flag}`);
                //console.log('========================submit_handle=========order_status:'+order_status)
                // 进行轮询拉去接口
                // 老流程在投注接口相应后关闭遮罩
                if(this.BetData.bet_mode == 0) {
                  this.BetDataCtr.set_bet_item_lock(false);
                  // 关闭遮罩
                  useMittEmit(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD);
                } else if(this.BetData.bet_mode == 1 && this.view_ctr_obj.order_confirm_complete == 1){ // 新流程调用接口22秒后还在确认中的时候拉取一次查询状态的接口
                  clearTimeout(this.timer_obj['time_over']);
                  this.timer_obj['time_over'] = setTimeout(()=>{
                    this.check_odds_beforebet(()=>{
                      if(this.view_ctr_obj.error_code=='') {
                        this.set_message('0400483');//服务繁忙，再试一次吧~
                      }
                    });
                    if(this.timer_obj['time_over']) {
                      clearTimeout(this.timer_obj['time_over']);
                    }
                    if(this.view_ctr_obj.timer_) {
                      clearTimeout(this.view_ctr_obj.timer_);
                      this.view_ctr_obj.timer_ = undefined;
                    }
                    // 关闭遮罩
                    useMittEmit(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD);
                  }, 1000 * 25);
                }
                //是不是预约投注
                let is_pre_bet_back = false;
                _.forEach(data.orderDetailRespList, item => {
                  if(_.hasIn(item,'preOrderDetailStatus') && !_.isNull(item.preOrderDetailStatus)) {
                    is_pre_bet_back = true;
                  }
                })
                /**
                 * 投注后业务返回来新的球头与赔率
                 * 一、若业务返回来最新的球头和赔率与当前预约的球头与赔率一样
                 * (1)若单关只有一个投注项，预约投注后移除此投注项
                 * (2)若单关有多个投注项，不用移除预约的投注项，还是停留在当前投注页面
                 * 二、若业务返回来最新的球头和赔率与当前预约的球头与赔率不一致则返回投注成功页面
                 */
                if(this.BetData.bet_appoint_obj && is_pre_bet_back) {
                  let {bet_appoint_id} = this.BetData.bet_appoint_obj;// 被预约的投注项id
                  // 主队，客队，玩法名称
                  let cs = _.get(this.BetData.bet_single_obj, `${bet_appoint_id}.cs`);
                  if(cs) {
                    let {home, away, play_name} = cs;
                    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${home} v ${away} - ${play_name} ${i18n.t('bet.bet_booked')}`);
                  }
                }
              } else if(code=='0400532'){
                this.view_ctr_obj.error_code = code;
                this.set_message(code);
                // 拉取投注前校验接口更新赔率
                this.check_odds_beforebet(()=>{
                  if(this.timer_obj['time_over']) {
                    clearTimeout(this.timer_obj['time_over']);
                  }
                  if(this.view_ctr_obj.timer_) {
                    clearTimeout(this.view_ctr_obj.timer_);
                    this.view_ctr_obj.timer_ = undefined;
                  }
                });
              } else {
                this.BetDataCtr.set_bet_item_lock(false);
                // 投注失败还原默认的模式
                this.BetDataCtr.set_bet_mode(-1);
                // 关闭遮罩
                useMittEmit(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD);
                this.view_ctr_obj.bet_order_status = 4;
                if(code == '111111') {
                  this.view_ctr_obj.error_code = code;
                  this.view_ctr_obj.error_message = msg;
                } else {
                  this.submit_error_result(code, data, handle_type);
                }
              } 
            });
          }, 300);
        } else {
          this.reset_bet_single();
          // 恢复校验
          BetCommonHelper.init_message();
          this.code_exist = true;
          this.view_ctr_obj.bet_order_status = 1;

          if (handle_type == 'accept') {
            this.remove_close_handicap();
            useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_RESET_CMD);
          }

          if (before_code !== 200) {
            this.set_message(before_code, handle_type);
          }
        }
      });
    },
    /**
     * @description: 单关打开左侧菜单那个未结算已结算注单记录
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    go_history() {
      this.BetDataCtr.set_layout_left_show('bet_history');
    },
    /**
     * @description: 投注后返回的错误结果处理
     * @param {String} code 错误码
     * @param {Array} data 接口返回的错误数据
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    submit_error_result(code, data, handle_type) {
      if (data && code && (this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(code) ||
        this.error_mapping.ERROR_CODE_ODDS_CHANGE.includes(code))) {
        // 投注失败返回的投注项oid
        let oid = _.get(data, '[0].data.playOptionsId');
        // 通过oid获取投注项对象
        let bet_obj = BetCommonHelper.get_bet_obj( oid);
        if (bet_obj) {
          let obj = _.cloneDeep(bet_obj);
          if (obj && obj.cs) {
            obj.key = obj.cs.id;
            // 错误码是否包含在需要显示关盘的错误码集合中(ERROR_CODE_ODDS_CLOSE)
            if (this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(code)) {
              // os: 3 关盘
              obj.cs.active = 3;
              obj.bs.hps[0].hl[0].ol[0].os = 3;
              //console.log('BetDataCtr.bet_single_obj_attr=============================开始调用');
              this.BetDataCtr.bet_single_obj_attr(obj);
              this.id = bet_obj.id;
              //console.log('bet_single=============================开始调用');
              BetCommonHelper.update_odds_info();
            } else if (this.error_mapping.ERROR_CODE_ODDS_CHANGE.includes(code)) { // 错误码是否包含在需要显示赔率变化的错误码集合中(ERROR_CODE_ODDS_CHANGE)
              let odds_value = _.get(data, '[0].data.odds');
              // os: 1 开盘
              obj.cs.active = 1;
              obj.cs.odds_value = odds_value;
              obj.bs.hps[0].hl[0].ol[0].os = 1;
              obj.bs.hps[0].hl[0].ol[0].ov = odds_value;
              this.BetDataCtr.bet_single_obj_attr(obj);
              this.id = bet_obj.id;
              BetCommonHelper.update_odds_info();
            }
          }
        }
        // 如果是接受变化按钮点击了,且code是需要移除的,那么移除投注项
        if (this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(code) && handle_type == 'accept') {
          this.remove_close_handicap();
          // 恢复校验
          this.reset_bet_single();
        }
        this.view_ctr_obj.error_code = code;
        this.view_ctr_obj.error_message = i18n.t(`error_msg_info.${code}`).client_msg1;
      } else {
        // 说明对应的id变化了(业务提示:坑位已发生改变，投注失败)
        if(['0402010','0400467'].includes(code)) {
          this.check_odds_beforebet(()=>{
            if(this.timer_obj['time_over']) {
              clearTimeout(this.timer_obj['time_over']);
            }
            if(this.view_ctr_obj.timer_) {
              clearTimeout(this.view_ctr_obj.timer_);
              this.view_ctr_obj.timer_ = undefined;
            }
          });
        } else if (['0400475','0400517'].includes(code)) {
          let id;
          if(!this.BetData.is_bet_merge) {
            id = this.BetData.bet_single_list[0];
          } else {
            let oid = _.get(data, '[0].data.playOptionsId');
            // 通过oid获取投注项对象
            let bet_obj = BetCommonHelper.get_bet_obj( oid);
            if(bet_obj) {
              id = bet_obj.id;
            }
          }   
          useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_RECALL_MONEY_CMD, id);       
        }
        this.set_message(code, handle_type);
      }
    },
    /**
     * @description: 确定按钮功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    submit_confirm() {
      // 账户异常不用去同步数据直接删除
      if (this.error_mapping.ERROR_CODE_ACCOUNT.includes(this.view_ctr_obj.error_code) ||
        this.error_mapping.ERROR_CODE_NOT_DATA.includes(this.view_ctr_obj.error_code)) {
        this.reset_bet_single();
        this.cancel_handle();
        return;
      }
      // 如果最大值是0,点击确定再同步一次最大值后进行删除判断
      if (this.view_ctr_obj.error_code == "M400009") {
        if(!this.BetData.is_bet_merge) {
          this.set_min_max_money(()=>{
            if(this.timer_obj['time_over']) {
              clearTimeout(this.timer_obj['time_over']);
            }
            if(this.view_ctr_obj.timer_) {
              clearTimeout(this.view_ctr_obj.timer_);
              this.view_ctr_obj.timer_ = undefined;
            }            
            if (this.view_ctr_obj.error_code == "M400009") {
              this.reset_bet_single();
              this.cancel_handle();
            } else if(this.view_ctr_obj.error_code=='M400012') {
              this.view_ctr_obj.single_range_money = 0; // 最大最小值正在获取中
              this.view_ctr_obj.error_code = '';
              this.view_ctr_obj.error_message = '';
            } else {
              this.view_ctr_obj.bet_order_status = 1;
            }
          });
        }
      } else {
        // 点击确定按钮后先同步一次数据再进行判定是否要进行删除操作
        this.check_odds_beforebet((code) => {
          if (code == 200 &&
            (this.error_mapping.ERROR_CODE_CONFIRM_BTN.includes(this.view_ctr_obj.error_code))) {
            this.reset_bet_single();
            this.cancel_handle();
          }
          if(this.timer_obj['time_over']) {
            clearTimeout(this.timer_obj['time_over']);
          }
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
        });
      }
    },
    /**
     * @description: 检测投注项状态是否为封盘
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    check_active() {
      let active_ = 1;
      let count = 0;
      let len = this.BetData.bet_single_list.length;
      for (let i = 0; i < len; i++) {
        let item = this.BetData.bet_single_list[i];
        let cs = this.BetData.bet_single_obj[item].cs;
        // 赛事盘口状态
        let match_status = _.get(cs, 'match_status');
        // 盘口状态
        let handicap_status = _.get(cs, 'handicap_status');
        // 投注项状态
        let active = _.get(cs, 'active');
        active_ = this.get_odds_active(match_status, handicap_status, active);
        if (active_ == 4) {
          count++;
        }
      }
      return count>0 && count == len;
    },
    /**
     * @description: 检测投注项状态
     * @param {undefined} undefined
     * @return {Boolean}
     */
    check_active_status() {
      let active_ = 1;
      let check_result = false;
      for (let i = 0; i < this.BetData.bet_single_list.length; i++) {
        let item = this.BetData.bet_single_list[i];
        let cs = this.BetData.bet_single_obj[item].cs;
        // 赛事盘口状态
        let match_status = _.get(cs, 'match_status');
        // 盘口状态
        let handicap_status = _.get(cs, 'handicap_status');
        // 投注项状态
        let active = _.get(cs, 'active');
        active_ = this.get_odds_active(match_status, handicap_status, active);
        if (active_ == 2 || active_ == 3) {
          check_result = true;
          break;
        }
      }
      return check_result;
    },
    /**
     * @description: 检测投注金额
     * @param {String} cmd
     * @return {Boolean}
     */
    check_money(cmd) {
      this.view_ctr_obj.single_range_money = 0;
      this.view_ctr_obj.input_max_flag = 0;
      let len = this.BetData.bet_single_list.length;
      // 如果单关列表为一个值时，输入的金额即使小于最小金额也可以提交
      if(len>1) {       
        useMittEmit(cmd);
        return this.view_ctr_obj.single_range_money;
      } else {
        let id = this.BetData.bet_single_list[0];
        
        if(_.get(this.BetData.bet_single_obj,`${id}.cs`)) {
          let {min_money, money} = _.get(this.BetData.bet_single_obj,`${id}.cs`);      
          let user = this.BetData.user;   
           // 用户账户金额小于最小金额时可以投注
          //下注金额大于0 且用户余额等于下注额且最小金额大于下注额返回0
          if(money>0 && user.balance==money && min_money>money) {
            return 0;
          }
        }
        //当用户余额不足时，且最低投注金额比用户余额更大时 需要让用户能投注更小的金额
        useMittEmit(cmd);
        return this.view_ctr_obj.single_range_money;
      }      
    },
    /**
     * @description: 初始化视图
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    init_view() {
      this.view_ctr_obj = {
        bet_order_status: 1,  //  1-投注状态,2-投注中状态,3-投注成功状态,4-投注失败状态,5-投注项失效
        //tips 数据
        bet_tips_info: {
          id: "", //目标id
          match_name: "", // 赛事名称  世界杯2022亚洲外围赛
          battle_info: "", // 对战信息 中国 v 关岛
          play_game: "", // 玩法游戏 滚球 让球
          match_type: "", // 赛事类型
          league_name: "", // 联赛名称
          bet_end_time: "" // 投注结束时间
        },
        //单关信息
        error_code: "",
        error_message: "",
        order_detail_data: [], // 单关投注成功记录
        order_confirm_complete: 0, // 订单是否确认完成
        is_empty_money: false, // 金额是否为空
        single_range_money: 0,
        input_max_flag: 0, // 最大值获取标志 0: 默认值 1: 正在获取最大最小值 2:获取完成
        bet_fail_flag: false //投注失败标识
      };
      this.refuse_code = undefined; // 错误码
      this.call_interface = 0; // 调用接口 1.调用投注前校验接口 2. 调用投注前校验和最大最小值接口
      this.BetDataCtr.set_bet_mode(-1);
      this.valid_money_obj = {};
      this.timer_obj = {}; //计时器对象
    },
    /**
     * @description: 设置提示消息
     * @param {String} code 错误码
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    set_message(code, handle_type) {
      if (!code ||
        (code && code != "" && !`${code}`.startsWith("M")) && handle_type == 'accept') {
        return;
      }
      // console.log('==================code=========================', code);
      let count = BetCommonHelper.get_deactive_count();
      if(count > 0) return;

      BetCommonHelper.init_message();
      let msg = i18n.t(`error_msg_info.${code}`);
      // 若msg为空则显示投注失败处理
      if (msg == `error_msg_info.${code}`) {
        // 异常码无对应的消息是显示默认的提示
        msg = i18n.t('error_msg_info.XXXXXX');
        code = 'XXXXXX';
      }
      //console.log('==================set_message=========================' + JSON.stringify(msg));
      this.view_ctr_obj.error_code = code;
      this.view_ctr_obj.error_message = msg.client_msg1;
      let delay = this.error_mapping.ERROR_CODE_DELAY[code];
      //console.log(`===========================================delay:${delay}`);
      if (delay && count == 0) {
        clearTimeout(this.timer_obj['init_message']);
        this.timer_obj['init_message'] = setTimeout(() => {
          BetCommonHelper.init_message();
        }, delay);
      }
    },
    /**
     * @description: 点击确定按钮完成投注
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    complete_handle() {
      this.cancel_handle();
    },
    /**
     * @description: 移除所有下注项功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    cancel_handle() {
      //console.log('=======================cancel_handle======11111111======================');
      this.go_back_project();
      this.BetDataCtr.bet_single_clear();
      if(this.BetData.is_bet_merge) {
        this.BetDataCtr.bet_mix_clear();
      }
      if(this.$route.params.video_size=='1') {
        this.BetDataCtr.set_is_show_full_bet(false);
      }
      if(this.BetData.bet_appoint_obj) { // 被预约的投注项id
        //清除球头数据
        this.BetDataCtr.set_bet_appoint_obj(null);
      }
    },
    /**
     * @description: 获取按钮上显示的文案
     * @param {Object} data
     * @return {undefined} undefined
     */
    get_button_text(data) {
      if (data && this.view_ctr_obj.is_effect) {
        // 接受变化并投注
        this.button_text = i18n.t('bet.accept_change_bet');
      } else {
        // 接受变化
        this.button_text = i18n.t('bet.accept_change');
        this.view_ctr_obj.is_effect = true;
      }
    },
    /**
     * 获取预约投注点击项索引
     * @param {*} index 
     */
    get_lock_index(index) {
      this.is_forward = index;
    },
    /**
     * @description: 重置单关投注标志为
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    reset_bet_single() {
      clearTimeout(this.view_ctr_obj.timer_);
      this.view_ctr_obj.timer_ = undefined;
      // this.BetDataCtr.set_is_single_handle(false);
      this.BetDataCtr.set_bet_item_lock(false);
      // 投注失败还原默认的模式
      this.BetDataCtr.set_bet_mode(-1);
      useMittEmit(MITT_TYPES.EMIT_CLOSE_MENU_LOADDING_CMD);
    },
    /**
     * @description: 定时任务
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_timed_task() {
      // console.log(`=============get_timed_task====================order_confirm_complete:${this.view_ctr_obj.order_confirm_complete}`);
      if (this.view_ctr_obj.order_confirm_complete == 1) {
        // console.log(`=========time=========get_timed_task=======`);
        this.view_ctr_obj.timer_ = setTimeout(() => {
          // console.log('======================before call get_order_result');
          if (this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.get_order_result();
        }, 5 * 1000); //5s后开始拉接口
      }
    },
    /**
     * @description: 获取订单结果
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_order_result() {
      // console.log('=================================get_order_result========interval_time:'+this.interval_time());
      // 老流程需要判断是否轮询
      if (this.interval_time()) return;
      // 如果无数据则不用往下进行
      if(this.view_ctr_obj.order_detail_data.length == 0) return;
      let orderNos = [];
      // 调用接口获取订单的最新数据
      _.forEach(this.view_ctr_obj.order_detail_data, item => {
        if((item.orderStatusCode == 2) && !orderNos.includes(item.orderNo)) {
          orderNos.push(item.orderNo);
        }
      });
      if(orderNos.length > 0) {
        orderNos = orderNos.join(',');
        // console.log(`=====================================${orderNos}`);
        api_betting.query_order_status({orderNos}).then(res => {
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data");
          let handle_time = _.get(res, 'data.ts');
          let status;
          // console.log(`=========================handle_time:${handle_time}`);
          if (this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          if (code == 200 && data && data.length) {          
            _.forEach(data, item => {
              status = this.change_status(item.status);
              let single_index = _.findIndex(this.view_ctr_obj.order_detail_data, item2 => item.orderNo == item2.orderNo);
              if(single_index > -1) {
                if(this.view_ctr_obj.order_detail_data[single_index].handle_time && this.view_ctr_obj.order_detail_data[single_index].handle_time>handle_time) {
                  return;
                }
                // 对应订单状态以及处理时间设置
                // console.log(`================status:${status}=====================${JSON.stringify(data)}`);
                Object.assign(this.view_ctr_obj.order_detail_data[single_index], { orderStatusCode: status, handle_time });
                // 订单状态为成功时 合并一下最新的数据,如果为失败则什么都不做                  
                if(item.oddsChangeList && item.oddsChangeList.length) {
                  if(this.view_ctr_obj.order_detail_data[single_index].playOptionsId == item.oddsChangeList[0].playOptionsId) {
                    Object.assign(this.view_ctr_obj.order_detail_data[single_index],{maxWinMoney: parseFloat(item.newMaxWinAmount).toFixed(2)});
                    _.forEach(item.oddsChangeList, item2=>{
                      if(item2) {
                        _.forEach(this.view_ctr_obj.order_detail_data, (detail_item, detail_index)=> {
                          if(item2.playOptionsId == detail_item.playOptionsId) {
                            // 赔率数据合并
                            Object.assign(this.view_ctr_obj.order_detail_data[detail_index], {oddsValues: item2.usedOdds});                           
                            if(item.refuseCode=='0400532') {
                              this.view_ctr_obj.error_code = item.refuseCode;
                            }
                          }
                        });
                      }
                    });
                  }
                }
              }
            });
            let success_count = 0; // 注单提交成功的个数
            let confirm_count = 0; // 注单确认中的个数
            let fail_count = 0; // 注单失败的个数
            _.forEach(this.view_ctr_obj.order_detail_data, item => {
              // 订单状态失败
              if(item.orderStatusCode == 0) {
                // 失败订单数量统计
                fail_count++;
              } else if(item.orderStatusCode == 1) { // 成功的订单
                // 投注成功的订单数量统计
                success_count++;
              } else if(item.orderStatusCode == 2) { // 订单确认中
                // 确认中的订单数量统计
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
            if(fail_count > 0 && success_count > 0 && ((fail_count+success_count) == this.view_ctr_obj.order_detail_data.length)) {
              this.view_ctr_obj.order_confirm_complete = 4
            }
            if(confirm_count==0 && [2,3,4].includes(this.view_ctr_obj.order_confirm_complete)) { // 如果没有待确认的订单，则需要拉去一次接口
              this.call_final();
            }
          }
          // 老投注流程需要判断是否继续轮询 或者新的投注流程不用轮询处理
          if (this.interval_time()) return;
          if (this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          // 老投注流程进行轮询
          this.view_ctr_obj.timer_ = setTimeout(() => {
            if(this.BetData.bet_mode==-1) {
              clearTimeout(this.view_ctr_obj.timer_);
            } else {
              this.get_order_result();
            }
          }, 2 * 1000); // 5s 改为 2s

        }).catch((err) => {
          console.error(err)
          console.log("获取订单状态和最新赔率最高可盈接口调用异常");
          if (this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.view_ctr_obj.timer_ = setTimeout(() => {
            if(this.BetData.bet_mode==-1) {
              clearTimeout(this.view_ctr_obj.timer_);
            } else {
              this.get_order_result();
            }
          }, 2 * 1000); // 5s 改为 2s
        });
      }
    },
    /**
     * @description: 重置定时任务标志
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    interval_time() {
      let result = false;
      // 没有确认中状态则中断定时调用
      let index = _.findIndex(this.view_ctr_obj.order_detail_data, item => item.orderStatusCode == 2);
      if (index == -1) {
        if (this.view_ctr_obj.timer_) {
          clearTimeout(this.view_ctr_obj.timer_);
          this.view_ctr_obj.timer_ = undefined;
        }
        result = true;
      }
      return result;
    },
    /**
      * @description: 将接口状态跟投注结果状态转换为orderStatusCode状态进行匹配
     * @param {Number} status 状态
     * @return {type}
     */
    change_status(status) {
      let bet_status = 0;
      switch (status) {
        case 0:
          bet_status = 1; // 成功
          break;
        case 3:
          bet_status = 2; // 确认中
          break;
        case 4:
          bet_status = 0; // 失败
          break;
      }
      return bet_status;
    },
    /**
     * @description: 校验单关金额是否在限额范围内
     * @param {obj} obj 对象
     * @return {undefined}
     */
    check_valid_money(obj) {
      if(obj.flag != 0 && obj.id && _.isEmpty(this.valid_money_obj)) {
        this.valid_money_obj = {};
        this.valid_money_obj[obj.id] = "";
      } else {
        this.valid_money_obj = {}
      }
    },
    /**
     * @description: 常用金额是否选中
     * @param {undefined} undefined
     * @return {undefined}
     */
    toggle_amount() {
      this.is_common_amount = !this.is_common_amount;
      localStorage.setItem("is_common_amount", this.is_common_amount);
    },
     /**
     * @description: 键盘事件
     * @param {event} event 事件类型
     * @return {undefined}
     */
    keyup_handle(event) {
      if(event.stopPropagation)
      {
        event.stopPropagation();
      }
      if(this.BetData.is_single_handle) {
        this.BetDataCtr.set_layout_left_show("bet_list");
      }
      // 当前是串关 或 在搜索页面 或 单关正在处理中 或 loadding还在执行
      if(!this.BetDataCtr.is_bet_single || this.BetData.is_single_handle || this.bet_loadding) return false;
      // 按enter按键
      if(this.bet_complete_show &&
        event.keyCode==13 &&
        !this.bet_loadding) {
        this.complete_handle();
      } else if(event.keyCode==13) {
        if(this.accept_button_show) {
          this.submit_handle('accept');
        } else {
          this.submit_handle('submit');
        }
      }
      // 按esc按键
      else if(event.keyCode==27) {
        this.cancel_handle();
      }
    },
    /**
     * @description: 设置最大最小值金额
     * @param {callback} callback 回调函数
     * @param {bet_single_obj} bet_single_obj 单关投注对象
     * @return {undefined} undefined
     */
    set_min_max_money(callback,bet_single_obj) {
      //最小投注额
      let min_money = "10";
      //最大投注额 之前是2000 世界杯改为8888
      let max_money = "8888"; 
      try {
        this.get_min_max_money(null, 1, (code, data) => {
          this.bet_reset_money_msg();
          if(code==200 && _.isArray(data) && data.length>0) {
            this.min_max_handle(bet_single_obj, data);
          }
          if(_.isFunction(callback)) {
            callback();
          }
        });
      } catch (e) {
        console.error(e);
        this.bet_reset_money_msg();
        for(let obj of Object.values(bet_single_obj)) {
          if(obj) {
            Object.assign( obj, {"key": obj.cs.id});
            // 最小值
            obj.cs.min_money = min_money;
            // 最大值
            obj.cs.max_money = max_money;
            if(obj.cs.money > parseFloat(max_money)) {
              // 输入金额转换为最高限额
              obj.cs.money = parseFloat(max_money);
            }
            BetCommonHelper.set_bet_obj_value(obj);
          }
        }
      }
    },
    /**
     * @description: 根据id获取最大最小值
     * @param {*} id 
     * @param {*} callback 
     * @return {undefined}
     */
    get_min_max_money_by_id(id, callback) {
      this.get_min_max_money([id], 1, (code, data) => {
        this.bet_reset_money_msg();
        if(code==200 && _.isArray(data) && data.length>0) {
          let bet_single_obj = _.cloneDeep(this.BetData.bet_single_obj);
          this.min_max_handle(bet_single_obj, data);
        }
        if(_.isFunction(callback)) {
          callback();
        }
      });
    },
    /**
     * @description: 取整
     * @param {String} min_money 最低限额(整数)
     * @param {String} max_money 最高小值(非整数)
     * @return {String}
     */
    round_money(min_money, max_money) {
      let min_interal='', max_integral = '', min_len = 0, max_len = 0; //max_integral:最大金额整数部分 min_len:最小值的长度，max_len:最大值的长度
      if(!_.isEmpty(min_money) && !_.isEmpty(max_money)) {   
        min_interal = min_money.split('.')[0]   
        min_len = min_interal.length; // 最小值整数部分长度
        max_integral = max_money.split('.')[0]; // 最大值整数部分的长度
        max_len = max_integral.length;
      }
      // 最低投注金额数值为四位及以上
      if(min_len >= 4) {
        min_len = 4;
      }
      // 最高限额整数位和最低限额整数位数相同时, 取整为减少一位
      if(max_len == min_len) {
        min_len = min_len - 1;
      }
      max_integral = max_integral.substr(0, max_len - min_len);
      max_money = _.padEnd(max_integral,(max_integral.length + min_len),'0');
      return max_money;
    },
    /**
     * @description:移除无效项
     * @param {undefined} undefined 
     * @return {undefined}
     */
    remove_invalid_item() {
      // 移除无效盘口
      this.remove_close_handicap(()=>{
        if(this.BetData.bet_single_list.length==0) {
          if(this.BetData.is_bet_merge) {
            this.BetDataCtr.bet_mix_clear();
          } else {
            this.BetDataCtr.is_bet_single(false);
          }          
        }
        this.show_valid_btn = false;
      });
    },
    /**
     * @description:切换用户喜好设置
     * @param {undefined} undefined 
     * @return {undefined}
     */
    toggle_bet_prefer() {
      this.user_bet_prefer = !this.user_bet_prefer;
      if (this.user_bet_prefer) {
        this.BetDataCtr.set_user_bet_prefer(1);
        api_betting.record_user_preference({userBetPrefer: 1});
      } else {
        this.BetDataCtr.set_user_bet_prefer(2)
        api_betting.record_user_preference({userBetPrefer: 2});
      }
    },
    /**
     * @description:设置最大最小默认值
     * @param {undefined} undefined 
     * @return {undefined}
     */
    set_default_min_max() {
      //最小投注额
      let min_money = "10";
      //最大投注额 之前是2000 世界杯改为8888
      let max_money = "8888";
      let bet_single_obj = _.cloneDeep(this.BetData.bet_single_obj);
      let len = this.BetData.bet_single_list.length;
      clearTimeout(this.timer_obj['min_max_timer']);
      this.timer_obj['min_max_timer'] = setTimeout(() => { 
        this.bet_reset_money_msg();
        for(let obj of Object.values(bet_single_obj)) {
          if(obj) {
            Object.assign( obj, {"key": obj.cs.id});
            // 最小值
            obj.cs.min_money = min_money;
            // 最大值
            obj.cs.max_money = max_money;
            if(len == 1 && this.is_common_amount) {
              // 常用金额
              obj.cs.money = this.common_amount;
            }
            if(obj.cs.money && obj.cs.money > parseFloat(max_money)) {
              // 输入金额转换为最高限额
              obj.cs.money = parseFloat(max_money);
            }
            BetCommonHelper.set_bet_obj_value(obj);
          }
        }         
      }, 5000);
    },
    /**
     * @description:最大最小值处理
     * @param {*} bet_single_obj 
     * @param {*} data 
     */
    min_max_handle(bet_single_obj, data) {
      //最小投注额
      let min_money = "10";
      //最大投注额 之前是2000 世界杯改为8888
      let max_money = "8888";
      let len = this.BetData.bet_single_list.length;
      _.forEach(data, item =>{
        if(item.playOptionsId) {               
          let obj;
          if(bet_single_obj[item.playOptionsId]) {
            obj = bet_single_obj[item.playOptionsId];
          } else {
            for(let bet_obj of Object.values(bet_single_obj)) {
              let oid = _.get(bet_obj,'cs.oid');
              if(oid == item.playOptionsId) {
                obj = bet_obj;
                break;
              }
            }
          }
          if(obj) {
            min_money = _.get(item, 'minBet', '10');
            max_money = this.round_money(min_money,item.orderMaxPay);
            if(parseFloat(max_money) < parseFloat(min_money)) {
              max_money = item.orderMaxPay;
            }
            if(parseFloat(max_money) == 0) {
              this.view_ctr_obj.bet_order_status = 5;  //投注项失败
              this.view_ctr_obj.error_code = "M400009"; //"该选项当前不可投注，请选择其他选项"
              this.view_ctr_obj.error_message = i18n.t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg1;
            }
            // 最小值
            obj.cs.min_money = min_money;
            // 最大值
            obj.cs.max_money = max_money;
            if(len == 1 && this.is_common_amount && parseFloat(this.common_amount) > 0) {
              // 设置常用金额为输入金额
              obj.cs.money = parseFloat(this.common_amount);
            }
            if(max_money && obj.cs.money && obj.cs.money > parseFloat(max_money)) {
              // 设置最大限额为输入金额
              obj.cs.money = parseFloat(max_money);
            }
            BetCommonHelper.set_bet_obj_value(obj);
          }                
        }
      });
      this.view_ctr_obj.input_max_flag = 2;
      useMittEmit(MITT_TYPES.EMIT_SINGLE_UPDATE_KEYBOARD_STATUS_CMD); //更新键盘状态
    },
    /**
     * @description:检测用户账户金额
     * @param {*} balance 
     * @returns 
     */
    check_balance(balance) {
      let total_money = 0;
      for(let obj of Object.values(this.BetData.bet_single_obj)) {
        let { cs } = obj;
        if(cs.money) {
          total_money += parseFloat(cs.money);
        }
      }
      return balance < total_money;
    },
    /**
     * @description: 重置获取金额后的标记以及消息提示信息
     * @param {undefined} undefined 
     * @return {undefined}
     */
    bet_reset_money_msg() {
      clearTimeout(this.timer_obj['min_max_timer']);
      this.view_ctr_obj.input_max_flag = 2;
      // 大于最大金额,小于最小金额,金额为空,最大最小值正在获取中的code码
      if(["M400005","M400010","M400011","M400012","M400009"].includes(this.view_ctr_obj.error_code)) {
        this.view_ctr_obj.single_range_money = 0; 
        // 重新初始化错误信息
        BetCommonHelper.init_message();
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      let count = BetCommonHelper.get_deactive_count();
      // 如果存在无效项需要提示
      if(count > 0) {
        this.view_ctr_obj.error_code = "0402049"; //已失效
        this.view_ctr_obj.error_message = i18n.t(`error_msg_info.0402049.client_msg1`);
      }
    });
  }
}