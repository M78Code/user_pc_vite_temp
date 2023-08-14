/*
 * @Author: 单关投注的mixin文件
 * @Date: 2020-08-04 17:13:55
 * @Description: 单关投注的mixin文件
 */
import { mapGetters, mapActions } from "vuex";
import betting from "src/public/mixins/betting/betting2.js";
import play_mapping from "src/public/config/mapping/play_mapping.js";
import { api_betting } from "src/public/api/index.js";

export default {
  name: "bet-single",
  mixins: [betting],
  data() {
    return {
      view_ctr_obj: {
        bet_data_change: false, // 检测数据是否有变,主要在提交时使用
        bet_order_status: 1,  //  1-投注状态,2-投注中状态,3-投注成功状态,4-投注失败状态,5-投注项失效
        is_effect: true,
        bet_tips_info: {
          id: "", //目标id
          match_name: "", // 赛事名称  世界杯2022亚洲外围赛
          battle_info: "", // 对战信息 中国 v 关岛
          play_game: "", // 玩法游戏 滚球 让球
          match_type: "", // 赛事类型
          league_name: "", // 联赛名称
          bet_end_time: "" // 投注截止时间
        },
        //单关信息
        error_code: "",
        error_message: "",
        order_detail_data: [], // 单关投注成功记录
        order_confirm_complete: 0, //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
        is_empty_money: true, // 金额是否为空
        single_range_money: 0, //-2:输入金额为空 -1:输入金额小于最低限额时，1: 输入金额超出最大限额时 2:输入金额超出用户余额时 3:用户余额是小于等于输入金额(转换后)
        input_max_flag: 0 // 最大值获取标志 0: 默认值 1: 正在获取最大最小值 2:获取完成
      },
      //是否有返回code码
      code_exist: false,
      button_text: this.$root.$t('bet.accept_change'),
      bet_delete_over: false,
      valid_money_obj: {},
      play_mapping: {},
      is_common_amount: false, // 常用金额是否选中
      common_amount: null, //常用金额
      valid_error_codes: this.error_mapping.ERROR_CODE_ODDS_CLOSE,
      show_valid_btn: false,
      timer_obj: {},
      user_bet_prefer: false,
      menu_data: $menu.menu_data
    }
  },
  created() {
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
    this.play_mapping = play_mapping;
    //单关投注完成
    this.$root.$on(this.emit_cmd.EMIT_SINGLE_COMPLETE_HANDLE_CMD, this.complete_handle);
    //单关取消按钮
    this.$root.$on(this.emit_cmd.EMIT_SINGLE_CANCEL_HANDLE_CMD, this.cancel_handle);
    //单关保留选项
    this.$root.$on(this.emit_cmd.EMIT_SINGLE_SAVE_BET_CMD, this.save_bet_items);
    // 投注模式默认为未知
    this.vx_set_virtual_bet_mode(-1);
    // 设置投注项为可选
    this.vx_set_bet_item_lock(false);
    this.vx_set_is_virtual_handle(false);
    this.vx_set_menu_change(false);
    this.vx_virtual_bet_s_clear();
    this.user_bet_prefer = _.get(this.vx_get_user,'userBetPrefer')==1;
    this.$root.$on(this.emit_cmd.EMIT_ENTER_PRESS_EVENT,this.keyup_handle);
    window.addEventListener("keyup", this.keyup_handle);
    this.$emit("set_scroll_this",{type:'bet_this',_this:this});
  },
  destroyed() {
    this.$root.$off(this.emit_cmd.EMIT_SINGLE_COMPLETE_HANDLE_CMD, this.complete_handle);
    this.$root.$off(this.emit_cmd.EMIT_SINGLE_CANCEL_HANDLE_CMD, this.cancel_handle);
    this.$root.$off(this.emit_cmd.EMIT_SINGLE_CHECK_VALID_MOENY_CMD, this.check_valid_money);
    this.$root.$off(this.emit_cmd.EMIT_SINGLE_SAVE_BET_CMD, this.save_bet_items);
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    this.timer_obj = {};
    if (this.view_ctr_obj.timer_) {
      clearTimeout(this.view_ctr_obj.timer_);
      this.view_ctr_obj.timer_ = undefined;
    }
    this.view_ctr_obj = {};
    this.valid_money_obj = {};
    this.valid_error_codes = {};
    this.$root.$off("enter_press_event",this.keyup_handle);
    window.removeEventListener("keyup", this.keyup_handle);
  },
  computed: {
    ...mapGetters({
      vx_get_bet_single_obj: "get_bet_single_obj",
      vx_get_virtual_bet_list: "get_virtual_bet_list",//虚拟体育投注列表
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",
      vx_get_is_virtual_handle: "get_is_virtual_handle",
      vx_get_menu_change: 'get_menu_change',
      vx_get_virtual_bet_mode: 'get_virtual_bet_mode'
    }),
    /**
     * @description: 确定按钮是否显示
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_confirm_show() {
      let error_code = this.view_ctr_obj.error_code;
      let codes = _.clone(this.error_mapping.ERROR_CODE_CONFIRM_BTN);
      this.error_mapping.ERROR_CODE_NOT_DATA.forEach(code => {
        if (!codes.includes(code)) {
          codes.push(code);
        }
      });
      this.error_mapping.ERROR_CODE_ACCOUNT.forEach(code => {
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
      //bet_order_status 1-投注状态,2-投注中状态,4-投注失败状态,5-投注校验未通过
      return [1, 2, 4, 5].includes(this.view_ctr_obj.bet_order_status) && codes.includes(error_code);
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
      return this.view_ctr_obj.bet_order_status === 2 || this.view_ctr_obj.order_confirm_complete == 1;
    },
    /**
     * @description: 是否未投注: true, 已投注: false
     */
    bet_flag() {
      if(this.vx_get_virtual_bet_mode==0) {
        return false;
      }
      return this.vx_get_virtual_bet_mode==-1 || (this.vx_get_virtual_bet_mode==1 && this.view_ctr_obj.order_confirm_complete != 2);
    },
    /**
     * @description 模式2下投注失败标识
     */
    bet_fail_flag() {
      return this.vx_get_virtual_bet_mode==1 && this.view_ctr_obj.order_confirm_complete==3
    }
  },
  watch: {
    vx_get_bet_single_obj() {
      this.common_amount = localStorage.getItem('common_amount')
    },
    /**
     * @description: 控当前投注项列表(vx_get_virtual_bet_list中存放单关的投注项id)
     * @param {Array} new_ 当前数组中的内容
     * @return {undefined} undefined
     */
    vx_get_virtual_bet_list: {
      handler(new_) {
        console.log('5555555555555555555555555555',this.vx_get_virtual_bet_obj)
        for(let key in this.vx_get_virtual_bet_obj) {
          if(!new_.includes(key)) {
            this.vx_virtual_bet_obj_del(key);
          }
        }
        if(new_.length==1) {
          this.vx_set_virtual_bet_s_list([]);
          this.vx_set_virtual_bet_s_obj({});
        }
        let is_common_amount = localStorage.getItem("is_common_amount");
        this.is_common_amount = JSON.parse(is_common_amount);
        this.common_amount = this.is_common_amount? Number(localStorage.getItem("common_amount")) : null;
        //初始化视图
        this.init_view();
        // 投注模式默认为未知
        this.vx_set_virtual_bet_mode(-1);
        // 设置投注项为可选
        this.vx_set_bet_item_lock(false);
        this.vx_set_is_single_handle(false);
      },
      immediate: true
    },
    /**
     * @description: 监控当前串关金额的范围
     * @param {Array} new_ 是否在最大最小值范围内
     * @return {undefined} undefined
     */
    "view_ctr_obj.single_range_money"(new_) {
      if(![-4,0].includes(new_) && this.view_ctr_obj.error_code!="M400005") {
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
     if(new_ == 3) {
        this.view_ctr_obj.bet_order_status = 4;
        if(this.vx_get_virtual_bet_mode == 1){
          this.vx_set_virtual_bet_mode(-1);
        }
      }
      if([2,3].includes(new_)) {
        this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
      }
      // 投注项锁住不让点击
      if(this.vx_get_virtual_bet_mode ===1 && new_===1) {
        this.vx_set_bet_item_lock(true);
      } else {
        this.vx_set_bet_item_lock(false);
        this.vx_set_is_virtual_handle(false);
      }
      let id = this.vx_get_virtual_bet_list[0];
      let source = _.get(this.vx_get_virtual_bet_obj,`${id}.cs.source`);
      let mid = _.get(this.vx_get_virtual_bet_obj, `${id}.cs.match_id`);
      // 来源为热门赛事
      // if (source == 'hot') {
      //   // 热门赛事收藏
      //   this.$root.$emit(this.emit_cmd.EMIT_HOT_COLLECT);
      // } else {
      //   // 收藏投注赛事
      //   this.$root.$emit(this.emit_cmd.EMIT_MX_COLLECT_COUNT_CMD, { type: "bet", mids:[mid] });
      // }
      // 统计未结算订单
      this.$root.$emit(this.emit_cmd.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
    },
    /**
     * @description: 当错误码存在时应该保证投注项可以点击
     */
    "view_ctr_obj.error_code": {
      handler(new_) {
        let obj = {};
        if(new_) {
          this.vx_set_virtual_bet_mode(-1);
          this.vx_set_bet_item_lock(false);
          let error_message =  this.$root.$t('error_msg_info')[new_].client_msg1;
          obj = {
            error_code: new_,
            error_message
          }
          this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
        }
        if(new_!='M400015') {
          this.show_valid_btn = false;
        }
        if(this.valid_error_codes.includes(new_)) {
          this.show_valid_btn = true;
        }
        this.vx_set_virtual_error_info(obj);
      },
      immediate: true
    },
    vx_main_menu_toggle:{
      handler() {
        this.user_bet_prefer = _.get(this.vx_get_user,'userBetPrefer')==1;
      }
    }
  },
  methods: {
    ...mapActions({
      vx_set_layout_left_show: "set_layout_left_show",
      vx_set_is_virtual_handle: "set_is_virtual_handle",
      vx_set_virtual_bet_list: "set_virtual_bet_list",
      vx_virtual_bet_obj_add: "virtual_bet_obj_add",
      vx_virtual_bet_obj_del: "virtual_bet_obj_del",
      vx_set_menu_change: "set_menu_change",
      vx_set_virtual_bet_mode: "set_virtual_bet_mode",
      // 投注项是否锁住设置
      vx_set_bet_item_lock: 'set_bet_item_lock',
      vx_set_virtual_bet_s_list: 'set_virtual_bet_s_list',
      vx_set_virtual_bet_s_obj: 'set_virtual_bet_s_obj',
      vx_set_virtual_error_info: "set_virtual_error_info",
      vx_virtual_bet_s_clear: "virtual_bet_s_clear",
      vx_virtual_bet_clear: "virtual_bet_clear",
      vx_set_user_bet_prefer: "set_user_bet_prefer",
      vx_set_is_virtual_bet: "set_is_virtual_bet",
    }),
    /**
     * @description: 保留这些选项按钮功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    save_bet_items() {
      // 点击保留这些选项，返回投注栏保留投注成功的选项
      this.init_view();
      // 初始化单关数据
      this.init_bet_single_data();
      this.vx_set_is_virtual_handle(false);
      let virtual_bet_obj = _.cloneDeep(this.vx_get_virtual_bet_obj);
      // 删除处理时间
      for (let key in virtual_bet_obj) {
        let obj = _.get(virtual_bet_obj, `${key}`);
        if (_.has(obj, 'cs.handle_time')) {
          delete obj.cs.handle_time;
        }
        if(_.has(obj, 'cs')) {
          obj.cs.money = "";
          obj.cs.win_money = "";
          obj.cs.min_money = "";
          obj.cs.max_money = "";
          this.virtual_common.set_bet_obj_value(this, obj);
        }
      }
    },
    /**
     * @description: 提交按钮功能
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    submit_handle(handle_type) {
      if (userCtr.show_fail_alert()) {
        return;
      }
      let user = this.vx_get_user;
      if(user.balance==0 || this.check_balance(user.balance)) {
        this.set_message('0400454');
        return;
      }
      // 1.如果正在处理中 2.大最小值正在获取中 3.输入的限额不在范围内，4.输入框为空 等都不可提交
      if (this.vx_get_is_virtual_handle || ["M400012"].includes(this.view_ctr_obj.error_code)) return;
      // 失效
      if(this.valid_error_codes.includes(this.view_ctr_obj.error_code)) {
        this.view_ctr_obj.error_code="M400015";
        this.show_valid_btn = true;
        return;
      }
      this.show_valid_btn = false;
      this.view_ctr_obj.bet_order_status = 1;
      // 是否为接受变化按钮
      if (handle_type == 'accept') {
        this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_RESET_CMD);
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
        // 恢复校验
        this.virtual_common.init_message(this);
      }
      if(this.view_ctr_obj.is_empty_money) {
        this.check_money(this.emit_cmd.EMIT_BET_SINGLE_CHECK_MONEY_CMD);
        return;
      }
      if(this.view_ctr_obj.single_range_money==-4) {
        this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_MIN_MONEY);
        return;
      }
      if (handle_type == 'submit') {
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
        // 恢复校验
        this.virtual_common.init_message(this);
      }
      //console.log(`=========================single_range_money:${this.view_ctr_obj.single_range_money}`);
      // 校验金额
      if (this.check_money(this.emit_cmd.EMIT_BET_SINGLE_CHECK_MONEY_CMD)) {
        // 校验串关金额
        if (this.view_ctr_obj.error_code) {
          this.set_message(this.view_ctr_obj.error_code, handle_type);//请您输入投注金额
        }
        return;
      } else if (this.check_active()) {
        //校验投注项状态
        this.view_ctr_obj.bet_order_status = 1;
        this.set_message('M400004');//赔率更新中!
        return;
      }
      if (this.view_ctr_obj.error_code && this.view_ctr_obj.error_code.startsWith("M")) {
        this.view_ctr_obj.bet_order_status = 1;
        this.code_exist = true;
        return false;
      }
      // 账户异常直接关闭 或者code码是一下三种,需要先移除数据这些是阶段性的错误
      // 0402046 该赛事阶段没有此玩法 0402047 该赛事无此阶段 0400451 盘口接受时间异常，无法投注
      if (this.error_mapping.ERROR_CODE_ACCOUNT.includes(this.view_ctr_obj.error_code) ||
        ['0402046', '0402047', '0400451'].includes(this.view_ctr_obj.error_code)) {
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
        //移除所有下注项功能
        this.cancel_handle();
        return;
      }
      let input_value = document.querySelector('input').value;
      if(input_value==="") {
        return;
      }
      this.code_exist = false;
      this.view_ctr_obj.bet_data_change = false;
      // 打开遮罩
      this.$root.$emit(this.emit_cmd.EMIT_OPEN_MENU_LOADDING_CMD);
      // 设置投注状态为处理中
      this.view_ctr_obj.bet_order_status = 2;
      // 描述：断网25秒的处理办法
      if (this.timer_obj['time_over']) clearTimeout(this.timer_obj['time_over']);
      this.timer_obj['time_over'] = setTimeout(() => {
        if (this.code_exist) return;
        this.view_ctr_obj.bet_order_status = 5;
        this.vx_set_virtual_bet_mode(-1);
        // 关闭遮罩
        this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
        this.set_message('0400483');//网络异常，请稍后再试
        clearTimeout(this.timer_obj['time_over']);
      }, 1000 * 25); // 原本30s Aden要求修改为25s
      this.virtual_bet_submit_data(1, (code, data, msg) =>{

        if (code) {
          this.code_exist = true;
          clearTimeout(this.timer_obj['time_over']);
        }
        if (code == 200) {
          this.virtual_common.init_message(this);
          //提交成功
          this.order_no = data.orderDetailRespList[0].orderNo;
          // 更新活动的投注额
          // this.$root.$emit("update-bonus");
          this.view_ctr_obj.bet_order_status = 3;
          this.view_ctr_obj.order_detail_data = data.orderDetailRespList;
          let order_status = data.orderDetailRespList[0].orderStatusCode;

          let oid =  _.get(data, 'orderDetailRespList[0].playOptionsId');
          let bet_single_obj = _.cloneDeep(this.virtual_common.get_bet_obj(this, oid));
          if(bet_single_obj && bet_single_obj.cs) {
            bet_single_obj.cs.handle_time = new Date().getTime();
          }
          this.virtual_common.set_bet_obj_value(this, bet_single_obj);
          let lock = data.lock? data.lock: 0; // 如果没有返回，给默认老的投注流程
          this.vx_set_virtual_bet_mode(lock);
          if (order_status == 0) {
            this.view_ctr_obj.order_confirm_complete = 3; // 全部投注失败
          } else if (order_status == 1) {
            this.view_ctr_obj.order_confirm_complete = 2; // 全部投注成功
          } else if (order_status == 2) {
            this.view_ctr_obj.order_confirm_complete = 1; // 注单确认中
          }
          //console.log('========================submit_handle=========order_status:'+order_status)
          // 进行轮询拉去接口
          if (this.view_ctr_obj.order_confirm_complete == 1) {
            this.get_timed_task();
          } else {
            this.vx_set_bet_item_lock(false);
            // 关闭遮罩
            this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
          }
        } else {
          console.log(`========virtual_bet_submit_data========22222====code:${code}`);
          // 关闭遮罩
          this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
          this.reset_bet_single();
          this.code_exist = true;
          this.view_ctr_obj.bet_order_status = 4;
          if(code=='111111') {
            this.view_ctr_obj.error_code = code;
            this.view_ctr_obj.error_message = msg;
          } else {
            this.submit_error_result(code, data, handle_type);
          }
        }
      });
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
        let bet_obj = this.virtual_common.get_bet_obj(this, oid);
        if (bet_obj) {
          let obj = _.cloneDeep(bet_obj);
          if (obj && obj.cs) {
            obj.key = obj.cs.id;
            // 错误码是否包含在需要显示关盘的错误码集合中(ERROR_CODE_ODDS_CLOSE)
            if (this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(code)) {
              // os: 3 关盘
              obj.cs.active = 3;
              obj.bs.hps[0].hl[0].ol[0].os = 3;
              //console.log('vx_virtual_bet_obj_add=============================开始调用');
              this.vx_virtual_bet_obj_add(obj);
              this.id = bet_obj.id;
              //console.log('bet_single=============================开始调用');
              this.virtual_common.update_odds_info(this);
            } else if (this.error_mapping.ERROR_CODE_ODDS_CHANGE.includes(code)) { // 错误码是否包含在需要显示赔率变化的错误码集合中(ERROR_CODE_ODDS_CHANGE)
              let odds_value = _.get(data, '[0].data.odds');
              // os: 1 开盘
              obj.cs.active = 1;
              obj.cs.odds_value = odds_value;
              obj.bs.hps[0].hl[0].ol[0].os = 1;
              obj.bs.hps[0].hl[0].ol[0].ov = odds_value;
              this.vx_virtual_bet_obj_add(obj);
              this.id = bet_obj.id;
              this.virtual_common.update_odds_info(this);
            }
          }
        }
        // 如果是接受变化按钮点击了,且code是需要移除的,那么移除投注项
        if (this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(code) && handle_type == 'accept') {
          this.remove_virtual_handicap();
          // 恢复校验
          this.reset_bet_single();
        }
        this.view_ctr_obj.error_code = code;
        this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${code}`).client_msg1;
      } else {
        // 说明对应的id变化了(业务提示:坑位已发生改变，投注失败)
        if(['0402010','0400467'].includes(code)) {
          this.check_odds_beforebet();
        } else if (['0400475','0400517'].includes(code)) {
          this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_RECALL_MONEY_CMD);
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
        //移除所有下注项功能
        this.cancel_handle();
        return;
      }
      // 如果最大值是0,点击确定再同步一次最大值后进行删除判断
      if (this.view_ctr_obj.error_code == "M400009") {
        this.$root.$emit(this.emit_cmd.EMIT_BET_SINGLE_RECALL_MONEY_CMD, () => {
          if (this.view_ctr_obj.error_code == "M400009") {
            this.reset_bet_single();
            //移除所有下注项功能
            this.cancel_handle();
          } else {
            this.view_ctr_obj.bet_order_status = 1;
          }
        });
      } else if(this.error_mapping.ERROR_CODE_CONFIRM_BTN.includes(this.view_ctr_obj.error_code)) { // 点击确定按钮后先同步一次数据再进行判定是否要进行删除操作
        this.reset_bet_single();
        this.cancel_handle();
      }
    },
    /**
     * @description: 检测投注项状态是否为封盘
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    check_active() {
      let active_ = 1;
      let check_result = false;
      for (let i = 0; i < this.vx_get_virtual_bet_list.length; i++) {
        let item = this.vx_get_virtual_bet_list[i];
        let cs = this.vx_get_virtual_bet_obj[item].cs;
        // 赛事盘口状态
        let match_status = _.get(cs, 'match_status');
        // 盘口状态
        let handicap_status = _.get(cs, 'handicap_status');
        // 投注项状态
        let active = _.get(cs, 'active');
        active_ = this.get_odds_active(match_status, handicap_status, active);
        if (active_ == 4) {
          check_result = true;
          break;
        }
      }
      return check_result;
    },
    /**
     * @description: 检测投注项状态
     * @param {undefined} undefined
     * @return {Boolean}
     */
    check_active_status() {
      let active_ = 1;
      let check_result = false;
      for (let i = 0; i < this.vx_get_virtual_bet_list.length; i++) {
        let item = this.vx_get_virtual_bet_list[i];
        let cs = this.vx_get_virtual_bet_obj[item].cs;
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
      let id = this.vx_get_virtual_bet_list[0];
      if(_.get(this.vx_get_virtual_bet_obj,`${id}.cs`)) {
        let {min_money, money} = _.get(this.vx_get_virtual_bet_obj,`${id}.cs`);
        let user = this.vx_get_user;
        // 用户账户金额小于最小金额时可以投注
        if(money>0 && user.balance==money && min_money>money) {
          return 0;
        }
      }
      this.$root.$emit(cmd);
      return this.view_ctr_obj.single_range_money;
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
        single_range_money: 0
      };
      this.call_interface = 0; // 调用接口 1.调用投注前校验接口 2. 调用投注前校验和最大最小值接口
      this.vx_set_virtual_bet_mode(-1);
      this.valid_money_obj = {};
    },
    /**
     * @description: 设置提示消息
     * @param {String} code 错误码
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    set_message(code, handle_type) {
      if (!code || (code != "" && !code.toString().startsWith("M")) && handle_type == 'accept') {
        return;
      }
      let count = this.virtual_common.get_deactive_count(this);
      if(count>0) return;
      this.virtual_common.init_message(this);
      let msg = this.$root.$t(`error_msg_info.${code}`);
      // 若msg为空则显示投注失败处理
      if (msg == `error_msg_info.${code}`) {
        // 异常码无对应的消息是显示默认的提示
        msg = this.$root.$t('error_msg_info.XXXXXX');
        code = 'XXXXXX';
      }
      //console.log('==================set_message=========================' + JSON.stringify(msg));
      this.view_ctr_obj.error_code = code;
      this.view_ctr_obj.error_message = msg.client_msg1;
      let delay = this.error_mapping.ERROR_CODE_DELAY[code];
      //console.log(`===========================================delay:${delay}`);
      if (delay) {
        clearTimeout(this.timer_obj['init_message']);
        this.timer_obj['init_message'] = setTimeout(() => {
          this.virtual_common.init_message(this);
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
      //初始化视图
      this.init_view();
      //左侧显示菜单
      this.vx_set_layout_left_show("menu");
      //设置虚拟体育标识（否）
      this.vx_set_is_virtual_handle(false);
      //清空投注项数据
      this.vx_virtual_bet_clear();
    },
    /**
     * @description: 获取按钮上显示的文案
     * @param {Object} data
     * @return {undefined} undefined
     */
    get_button_text(data) {
      if (data && this.view_ctr_obj.is_effect) {
        this.button_text = this.$root.$t('bet.accept_change');
      } else {
        this.button_text = this.$root.$t('bet.accept_change');
        this.view_ctr_obj.is_effect = true;
      }
    },
    /**
     * @description: 重置单关投注标志为
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    reset_bet_single() {
      clearTimeout(this.view_ctr_obj.timer_);
      this.view_ctr_obj.timer_ = undefined;
      // this.vx_set_is_virtual_handle(false);
      this.vx_set_bet_item_lock(false);
      // 投注失败还原默认的模式
      this.vx_set_virtual_bet_mode(-1);
      this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
    },
    /**
     * @description: 定时任务
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_timed_task() {
      //console.log('=================================get_timed_task');
      if (this.view_ctr_obj.order_confirm_complete == 1) {
        this.view_ctr_obj.timer_ = setTimeout(() => {
          //console.log('======================before call get_order_result');
          if(this.view_ctr_obj.timer_) {
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
      //console.log('=================================get_order_result========interval_time:'+this.interval_time());
      // 老流程需要判断是否轮询
      if (this.interval_time()) return;
      // 如果无数据则不用往下进行
      if(!this.view_ctr_obj.order_detail_data.length==0) return;
      let orderNo = this.view_ctr_obj.order_detail_data[0].orderNo;      // 拉取接口
      //console.log(`=====================================${orderNo}`);
      api_betting.query_order_status({ orderNos: orderNo }).then(res => {
        let code = _.get(res, "data.code");
        let data = _.get(res, "data.data");
        let handle_time = _.get(res, 'data.ts');
        let status;
        // console.log(`=========================handle_time:${handle_time}`);
        if (this.view_ctr_obj.timer_) {
          clearTimeout(this.view_ctr_obj.timer_);
          this.view_ctr_obj.timer_ = undefined;
        }
        // 如果C201和接口拉取都同时进行,则优先最晚的执行
        if (this.view_ctr_obj.order_detail_data[0] &&
          this.view_ctr_obj.order_detail_data[0].handle_time &&
          this.view_ctr_obj.order_detail_data[0].handle_time > handle_time) {
          return;
        }
        if (code == 200 && data && data.length && data[0]) {
          let item = data[0];
          status = this.change_status(item.status);
          //console.log(`=====================================${JSON.stringify(data)}`);
          Object.assign(this.view_ctr_obj.order_detail_data[0], { orderStatusCode: status, handle_time });
          if (status == 0) {
            this.view_ctr_obj.order_confirm_complete = 3; // 全部投注失败
          } else if (status == 1) {
            this.view_ctr_obj.order_confirm_complete = 2; // 全部投注成功
          } else if (status == 2) {
            this.view_ctr_obj.order_confirm_complete = 1; // 注单确认中
          }
          // 订单状态为成功时 合并一下最新的数据,如果为失败则什么都不做
          if(item.oddsChangeList && item.oddsChangeList.length) {
            if(this.view_ctr_obj.order_detail_data[0].playOptionsId == item.oddsChangeList[0].playOptionsId) {
              Object.assign(this.view_ctr_obj.order_detail_data[0],{maxWinMoney: parseFloat(item.newMaxWinAmount).toFixed(2), oddsValues: item.oddsChangeList[0].usedOdds});
            }
          }
        }
        if([2,3].includes(this.view_ctr_obj.order_confirm_complete)) { // 如果没有待确认的订单，则需要拉去一次接口
          this.call_final();
        }
        // 老投注流程需要判断是否继续轮询
        if (this.interval_time()) return;
        if (this.view_ctr_obj.timer_) {
          clearTimeout(this.view_ctr_obj.timer_);
          this.view_ctr_obj.timer_ = undefined;
        }
        // 老投注流程进行轮询
        this.view_ctr_obj.timer_ = setTimeout(() => {
          this.get_order_result();
        }, 2 * 1000); // 5s 改为 2s
      }).catch((err) => {
        console.error(err)
        console.log("获取订单状态和最新赔率最高可盈接口调用异常");

        // 投注流程不用轮询处理
        if (this.view_ctr_obj.timer_) {
          clearTimeout(this.view_ctr_obj.timer_);
          this.view_ctr_obj.timer_ = undefined;
        }

        this.view_ctr_obj.timer_ = setTimeout(() => {
          this.get_order_result();
        }, 2 * 1000); // 5s 改为 2s
      });
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
     * @description: 将接口状态跟投注结果状态进行转换匹配
     * @param {Number} status 状态
     * @return {type}
     */
    change_status(status) {
      let bet_status = 0;
      switch (status) {
        case 0:
          bet_status = 1;
          break;
        case 3:
          bet_status = 2;
          break;
        case 4:
          bet_status = 0;
          break;
      }
      return bet_status;
    },
    /**
     * @description: 最终调用接口
     */
    call_final() {
      if(this.view_ctr_obj.timer_) {
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
      }
    },
    /**
     * @description: 检查不在范围的金额
     * @param {*} obj
     * @return {*}
     */
    check_valid_money(obj) {
      // 校验单关金额是否在限额范围内
      if(obj.flag!=0 && obj.id && _.isEmpty(this.valid_money_obj)) {
        this.valid_money_obj = {};
        this.valid_money_obj[obj.id] = "";
      } else {
        this.valid_money_obj = {}
      }
    },
    toggle_amount() {
      this.is_common_amount = !this.is_common_amount;
      localStorage.setItem("is_common_amount", this.is_common_amount);
    },
    toggle_bet_prefer() {
      this.user_bet_prefer = !this.user_bet_prefer;
      if (this.user_bet_prefer) {
        this.vx_set_user_bet_prefer(1);
        api_betting.record_user_preference({userBetPrefer: 1});
      } else {
        this.vx_set_user_bet_prefer(2);
        api_betting.record_user_preference({userBetPrefer: 2});
      }
    },
    keyup_handle(event) {
      if(event.stopPropagation)
      {
        event.stopPropagation();
      }
      if(this.vx_get_is_virtual_handle) {
        this.vx_set_layout_left_show("bet_list");
      }
      if(this.vx_get_is_virtual_handle || this.bet_loadding) return;
      // 按enter按键
      if(this.bet_complete_show &&
        event.keyCode==13 &&
        !this.bet_loadding) {
        this.complete_handle();
      } else if(event.keyCode==13) {
        this.submit_handle();
      }
      // 按esc按键
      else if(event.keyCode==27) {
        //移除所有下注项功能
        this.cancel_handle();
      }
    },
    check_balance(balance) {
      let total_money = 0;
      for(let obj of Object.values(this.vx_get_virtual_bet_obj)) {
        let { cs } = obj;
        if(cs.money) {
          total_money += parseFloat(cs.money);
        }
      }
      return balance < total_money;
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      let count = this.virtual_common.get_deactive_count(this);
      // 如果存在无效项需要提示
      if(count>0) {
        this.view_ctr_obj.error_code = "0402049";
        this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.0402049.client_msg2`);
      }
    });
  }
}