/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关组件的mixin文件  正常
 */
import { mapGetters, mapActions } from "vuex";
import betting from "src/public/mixins/betting/betting.js"; //投注逻辑
import skt_data_mix_order from "src/public/mixins/websocket/data/skt_data_mix_order.js"; //串关ws推送
import { api_betting } from "src/public/api/index.js"; // 投注api

export default {
  name: "bet-mix",
  mixins: [   betting, skt_data_mix_order],
  data() {
    return {
     
      // 总投注数
      bet_total_count: 0,
      // 总投注额
      bet_total_money: 0.00,
      // 预计总收益
      bet_total_win_money: 0.00,
      // 是否展开
      is_expend: true,
      //串关异常数据
      series_error_data: [],
      timer_: undefined, // 计时器
      //是否有返回code码
      code_exist: false,
      // 串关性能优化时使用
      bet_obj_item_h:{},
      // 是否移动到全部删除按钮
      bet_delete_over: false,
      refuse_code: undefined, // 错误码
      call_interface: 0, // 调用接口 1.调用投注前校验接口 2. 调用投注前校验和最大最小值接口
      // 失效错误码
      valid_error_codes: this.error_mapping.ERROR_CODE_ODDS_CLOSE,
      // 是否显示无效按钮
      show_valid_btn: false,
      timer_obj: {}, //计时器对象
      // 用户喜好 false:自动接受更好赔率 true 不接收任何赔率
      user_bet_prefer: false,
      save_bet_item:false
    }
  },
  created() {
    //设置滚动数据
    this.$emit("set_scroll_this",{type:'bet_this', _this:this});
    //设置串关最大高度
    this.set_max_height = this.debounce(this.set_max_height, 100);
    // 投注数量
    this.$root.$on(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD, this.get_bet_total_count);
    // 投注金额
    this.$root.$on(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD, this.get_bet_total_money);
    // 最高可赢额
    this.$root.$on(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD, this.get_bet_total_win_money);
    // 完成按钮功能
    this.$root.$on(this.emit_cmd.EMIT_COMPLETE_HANDLE_CMD, this.complete_handle);
    // 最大最小值
    this.$root.$on(this.emit_cmd.EMIT_MIN_MAX_MONEY_CMD, this.set_min_max_money);
    // 初始化视图
    this.$root.$on(this.emit_cmd.EMIT_MIX_INIT_VIEW_CMD, this.init_view);
    // 保留这些选项
    this.$root.$on(this.emit_cmd.EMIT_MIX_SAVE_BET_CMD, this.save_bet_items);
    // 是否正在处理为未处理
    this.vx_set_is_handle(false);
    // 设置投注模式为未知
    this.vx_set_bet_mode(-1);
    // 设置投注项可选
    this.vx_set_bet_item_lock(false);
    // 菜单是否改变设置为未改变
    this.vx_set_menu_change(false);
    this.user_bet_prefer = _.get(this.vx_get_user,'userBetPrefer') == 1;
    //监听键盘抬起事件
    this.$root.$on(this.emit_cmd.EMIT_ENTER_PRESS_EVENT, this.keyup_handle);
    //全局的键盘抬起事件
    window.addEventListener("keyup", this.keyup_handle);
  },
  destroyed() {
    //清除定时器
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    //置空定时器对象
    this.timer_obj = {};
    clearTimeout(this.view_ctr_obj.timer_);
    this.view_ctr_obj.timer_ = undefined;
    this.view_ctr_obj = {};
    //清理防抖节流
    this.debounce_throttle_cancel(this.set_max_height);
    // 销毁接收版本类型变化参数
    //清除监听 投注数量
    this.$root.$off(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD, this.get_bet_total_count);
    //清除监听  投注金额
    this.$root.$off(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD, this.get_bet_total_money);
    //清除监听 最高可赢额
    this.$root.$off(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD, this.get_bet_total_win_money);
    //清除监听 完成按钮功能
    this.$root.$off(this.emit_cmd.EMIT_COMPLETE_HANDLE_CMD, this.complete_handle);
    //清除监听 最大最小值
    this.$root.$off(this.emit_cmd.EMIT_MIN_MAX_MONEY_CMD, this.set_min_max_money);
    //清除监听 初始化视图
    this.$root.$off(this.emit_cmd.EMIT_MIX_INIT_VIEW_CMD, this.init_view);
    //清除监听 保留这些选项
    this.$root.$off(this.emit_cmd.EMIT_MIX_SAVE_BET_CMD, this.save_bet_items);
    this.user_bet_prefer = _.get(this.vx_get_user,'userBetPrefer')==1;
    //清除监听 键盘抬起事件
    this.$root.$off("enter_press_event", this.keyup_handle);
    //清除监听 全局的键盘抬起事件
    window.removeEventListener("keyup", this.keyup_handle);
    //置空对象
    this.close_rules_info = null;
    this.show_rules_info = null;
    this.mix_toggle_handle = null;
    this.is_expend = null;
    this.series_error_data = null;
  },
  computed: {
    ...mapGetters({
      vx_is_bet_single: 'is_bet_single', //是否为单关
      vx_get_bet_list: "get_bet_list", //串关列表
      vx_get_bet_obj:"get_bet_obj",   //串关投注项对象
      vx_get_bet_s_list: "get_bet_s_list", //串关投注输入部分列表
      vx_get_bet_s_obj: "get_bet_s_obj", //串关投注输入部分对象
      vx_get_user: "get_user",   //用户信息
      vx_get_is_handle: "get_is_handle", //串关是否正在投注中
      vx_layout_left_show: "get_layout_left_show",  //获取左侧布局信息
      vx_get_bet_mode: "get_bet_mode",  //投注模式
      vx_get_is_bet_merge: "get_is_bet_merge", // 是否为合并模式
      vx_cur_menu_type: "get_cur_menu_type"  //当前菜单类型
    }),
    /**
     * @description: 折叠是否可用
     * @param {undefined} undefined
     * @return {Boolean}
     */
    expend_disable() {
      return this.vx_get_bet_list.length < 3;
    },
    /**
     * @description: 投注数量
     * @param {undefined} undefined
     * @return {Number}
     */
    bet_count() {
      return this.vx_get_bet_list.length;
    },
    /**
     * @description: 投注按钮是否显示
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_submit_show() {
      //  1-投注状态,2-投注中状态,4-投注失败状态,5-投注项失效 显示提交按钮
      return [1, 2, 4, 5].includes(this.view_ctr_obj.bet_order_status);
    },
    /**
     * @description: 确定按钮是否显示
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_confirm_show() {
      let error_code = this.view_ctr_obj.error_code;
      let codes = _.clone(this.error_mapping.ERROR_CODE_CONFIRM_BTN);
      this.error_mapping.ERROR_CODE_NOT_DATA.forEach(code=>{
        if(!codes.includes(code)) {
          codes.push(code);
        }
      });
      this.error_mapping.ERROR_CODE_ACCOUNT.forEach(code=>{
        if(!codes.includes(code)) {
          codes.push(code);
        }
      });
      //  1-投注状态,4-投注失败状态,5-投注项失效
      return [1,4,5].includes(this.view_ctr_obj.bet_order_status) && codes.includes(error_code);
    },
    /**
     * @description: 接受变化按钮是否显示
     * @param {undefined} undefined
     * @return {Boolean}
     */
    accept_button_show() {
      let error_code = this.view_ctr_obj.error_code;
      let codes = this.error_mapping.ERROR_CODE_ACCEPT_BTN;
      // let count =  BetCommonHelper.get_deactive_count();
      // console.log(`================accept_button_show======error_code:${error_code}====${this.view_ctr_obj.bet_order_status}`);
      //1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
      return ([1, 2, 4, 5].includes(this.view_ctr_obj.bet_order_status) && codes.includes(error_code));
    },
    /**
     * @description: 完成按钮是否显示
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_complete_show() {
      //3-投注成功状态
      return this.view_ctr_obj.bet_order_status == 3;
    },
    /**
     * @description: 是否在投注中
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_loadding() {
      //2-投注中状态
      return this.view_ctr_obj.bet_order_status === 2 || this.view_ctr_obj.order_confirm_complete === 1;
    },
    /**
     * @description: 是否禁用投注按钮
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_disable() {
      return this.vx_get_bet_list.length == 1;
    },
    /**
     * @description: 是否未投注: true, 已投注: false
     */
    bet_flag() {
      if(this.vx_get_bet_mode == 0) {
        return false;
      }
      //投注模式没有或者是投注模式为1且不是全部成功
      return this.vx_get_bet_mode == -1 || (this.vx_get_bet_mode == 1 && this.view_ctr_obj.order_confirm_complete != 2);
    },
    /**
     * @description 模式2下投注失败标识
     */
    bet_fail_flag() {
      //3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
      return this.vx_get_bet_mode == -1 && [3,4].includes(this.view_ctr_obj.order_confirm_complete);
    },
    /**
     * @description 判断是否有无效的投注项
     */
    has_disable_item() {
      return BetCommonHelper.has_disable_item();
    },
    bet_s_count() {
      return this.vx_get_bet_s_list.length;
    },
    bet_mode() {
      return this.vx_is_bet_single;
    },
    /**
     * 删除无效项按钮是否显示
     * @returns
     */
    show_invalid_btn() {
      let count = BetCommonHelper.get_deactive_count();
      return this.vx_get_bet_list.length > 1 && count > 0 && this.bet_flag;
    }
  },
  watch: {
    /**
     * @description: 监控当前投注项列表(vx_get_bet_list中存放的是投注项的id)
     * @param {Array} new_ 当前数组中的内容
     * @return {undefined} undefined
     */
    vx_get_bet_list(new_, old_) {
      //左侧显示页面
      // if(this.vx_layout_left_show != 'bet_list') {
      //   return;
      // }
      if(new_.length == 0) {
        //清除串关投注数据
        this.vx_bet_mix_clear();
        //左侧显示页面
        this.vx_set_layout_left_show('menu');
        //初始化信息
        BetCommonHelper.init_message(true);
        if(this.vx_get_is_bet_merge) {
          //清除单关投注数据
          this.vx_bet_single_clear();
        }
        if(this.vx_cur_menu_type.type_name!='bet') {
          //是不是合并
          this.vx_set_is_bet_merge(false);
          //是不是单关
          this.vx_set_is_bet_single(true);
        }
        return;
      } else if(new_.length == 1){
        //初始化信息
        BetCommonHelper.init_message(true);
      }
      for(let key in this.vx_get_bet_obj) {
        if(new_ && !new_.includes(key)) {
          //需要删除对象的键值
          this.vx_bet_obj_remove_attr(key);
        }
      }
      if(new_ && new_.length > 0) {
        if(new_.length < 3) {
          this.is_expend = false;
        } else {
          this.is_expend = true;
        }
        let id = new_[0];
        let oid = _.get(this.vx_get_bet_obj,`${id}.cs.oid`);
        if(new_.length == 2) {
          //更新串关投注项上的match_udpate字段
          this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_MATCH_UPDATE, oid);
        } else if (new_.length == 1 && old_.length == 2) {
          // 更改串关的match_update字段值
          this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_CHANGE_MATCH_UPDATE, oid);
        }
        //获取串关数据
        this.get_mix_data(()=>{
          // 单关投注成功记录
          this.view_ctr_obj.order_detail_data = [];
          // 串关投注成功记录
          this.view_ctr_obj.series_order_data = [];
          // 串关投注成功部分的记录
          this.view_ctr_obj.series_order_success = [];
          //0.默认值还没开始确认注单
          this.view_ctr_obj.order_confirm_complete = 0;
          //检查串关并回复默认串关标志
          this.reset_serial();
          if(new_.length > 1) {
            //同步数据
            this.sync_data();
          }
          let delay = this.error_mapping.ERROR_CODE_DELAY[this.view_ctr_obj.error_code];
          if(delay) {
            //复位盘口及赔率的变换标志
            BetCommonHelper.delay_reset_message( delay,() => {
              if(this.view_ctr_obj.timer_) {
                clearTimeout(this.view_ctr_obj.timer_);
                this.view_ctr_obj.timer_ = undefined;
              }
            });
          }
          if (!this.has_disable_item) {
            //初始化信息
            BetCommonHelper.init_message();
          }
        });
      }else {
        this.vx_set_bet_s_list([]);
        // 当删除完数据时
        clearTimeout(this.view_ctr_obj.timer_);
        // 返回体育项目
        this.vx_set_layout_left_show("menu");
        //是否投注处理中
        this.vx_set_is_handle(false);
      }
      // 投注模式默认为未知
      this.vx_set_bet_mode(-1);
      // 设置投注项为可选
      this.vx_set_bet_item_lock(false);
      //是否正在处理投注中
      this.vx_set_is_handle(false);
    },
    /**
     * @description: 监控串关投注成功项
     * @param {*} new_
     */
    'view_ctr_obj.series_order_success'(new_) {
      if(new_ && new_.length > 0) {
        // console.log(`==========0000===============>>>bet_s_list:${JSON.stringify(this.vx_get_bet_s_list)}===========bet_s_obj:${JSON.stringify(this.vx_get_bet_s_obj)}`);
        _.forEach(new_, item => {
          for(let obj of Object.values(this.vx_get_bet_s_obj)) {
            let cs = _.get(obj, 'cs');
            // console.log(`============seriesValue:${item.seriesValue}=====name:${cs.name}`);
            if(cs && item.seriesValue == cs.name) {
              let id = cs.id;
              if(id && this.vx_get_bet_s_obj[id]) {
                // console.log(`============remove:${id}`);
                let index = _.findIndex(this.vx_get_bet_s_list, item => item == id);
                if(index > -1 && this.vx_get_bet_s_list[index]) {
                  //删除串关投注项输入对象
                  this.vx_bet_s_remove_attr(id);
                  // 移除输入投注列表
                  this.vx_bet_s_list_remove(index);
                }
                // console.log(`=================index:${index}========>>>bet_s_list:${JSON.stringify(this.vx_get_bet_s_list)}===========bet_s_obj:${JSON.stringify(this.vx_get_bet_s_obj)}`);
              }
            }
          }
        });
        this.$nextTick().then(() => {
          for(let obj of Object.values(this.vx_get_bet_s_obj)) {
            let cs = _.get(obj, 'cs');
            if(cs && cs.money) {
              //设置输入框金额
              this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_SET_MONEY_CMD, {id: cs.id, money: cs.money});
            }
          }
        });
        this.view_ctr_obj.timestap = new Date().getTime();
      }
    },
    /**
     * @description: 投注项数量
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_s_count() {
      // 投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
      if(this.vx_get_bet_mode != 1) {
        //红色选项不可结合进行串关投注 0400477
        //红色选项不可结合进行串关投注 0400478
        if(!["0400477","0400478"].includes(this.view_ctr_obj.error_code)) {
          // 触发清除串关输入框金额
          this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_CLEAR_HANDLE_CMD);
        }
        this.view_ctr_obj.input_max_flag = 0;
      }
    },
    /**
     * @description: 监控当前是否是单关
     * @param {Object} new_ 当前是否单关
     * @return {undefined} undefined
     */
    bet_mode: {
      handler(new_) {
        if(!new_ && this.vx_get_bet_list.length>1) {
          //同步数据
          this.sync_data();
        }
      },
      immediate: true
    },
   /**
     * @description: 监控当前串关金额的范围
     * @param {Array} new_ 是否在最大最小值范围内
     * @return {undefined} undefined
     */
    "view_ctr_obj.mix_range_money"(new_){
      if(![-4,0].includes(new_) && this.view_ctr_obj.error_code!="M400005") {
        clearTimeout(this.timer_obj['range_money']);
        this.timer_obj['range_money'] = setTimeout(() => {
          BetCommonHelper.reset_message_info();
          this.view_ctr_obj.mix_range_money = 0;
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
      //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
      if([3,4].includes(new_)) {
        if(this.vx_get_bet_mode===1) {
          this.view_ctr_obj.bet_order_status = 4;
           // 投注模式 -1.还不知道使用哪种模式 0.足球PA滚球 1.非足球PA滚球
          this.vx_set_bet_mode(-1);
        } else {
          this.view_ctr_obj.bet_order_status = 3;
        }
      }
      //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
      if([2,3,4].includes(new_)) {
        if(this.vx_get_bet_mode==1 && this.timer_obj['over_time']) {
          clearTimeout(this.timer_obj['over_time']);
          this.timer_obj['over_time'] = undefined;
        }
        //关闭菜单上loading指令
        this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);

        let find_match_collect = false, find_hot = false,bet_obj, mids = [];
        let d_data = this.view_ctr_obj.order_detail_data;
        let dl = d_data.length;
        for(let i = 0; i < dl; i++) {
          let it = d_data[i];
          let oid = it.playOptionsId;
          //更具投注项id,获取投注项对象
          bet_obj = BetCommonHelper.get_bet_obj( oid);
          // 投注成功则收藏热门
          if(it.orderStatusCode == 1 && bet_obj &&
            bet_obj.cs && bet_obj.cs.source=='hot') {
            find_hot = true;
          } else {
            let mid = _.get(bet_obj, 'cs.match_id');
            if(mid && !mids.includes(mid)) {
              mids.push(mid);
              find_match_collect = true;
            }
          }
        }
        // if(find_match_collect) {
        //   // 收藏投注赛事
        //   this.$root.$emit(this.emit_cmd.EMIT_MX_COLLECT_COUNT_CMD, {type:"bet", mids});
        // }
        // if(find_hot) {
        //   // 热门推荐收藏成功
        //   this.$root.$emit(this.emit_cmd.EMIT_HOT_COLLECT);
        // }
        // 统计未结算订单
        this.$root.$emit(this.emit_cmd.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
      }
      // 投注项锁住不让点击
      if(this.vx_get_bet_mode ===1 && new_===1) {
        // 投注项加锁(无法点击)
        this.vx_set_bet_item_lock(true);
      } else {
        // 解锁投注(可以点击)
        this.vx_set_bet_item_lock(false);
        //投注处理中
        this.vx_set_is_handle(false);
      }
    },
    /**
     * @description: 当错误码存在时应该保证投注项可以点击
     * @param {string} new_ 错误码
     * @return {undefined} undefined
     */
    "view_ctr_obj.error_code"(new_) {
      if(new_) {
        this.vx_set_bet_mode(-1);
        // 是否锁住投注项不让点，默认为不锁住(针对新的投注流程)
        this.vx_set_bet_item_lock(false);
        if(this.valid_error_codes.includes(new_)) {
          this.show_valid_btn = true;
        }
      } else {
        this.show_valid_btn = false;
      }
    },
    /**
     * @description: 投注失败标识
     * @param {string} new_ 标识
     * @return {undefined} undefined
     */
    bet_fail_flag(new_) {
      this.view_ctr_obj.bet_fail_flag = new_;
      // 当投注失败后重新计算投注数量，投注额，预计总收益额
      if(new_) {
        //总投注数
        this.get_bet_total_count();
        //总投注额
        this.get_bet_total_money();
        //预计总收益
        this.get_bet_total_win_money();
      }
    },
    /**
     * @description: 左侧列表显示形式normal：展开 mini：收起
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    vx_main_menu_toggle:{
      handler() {
        this.user_bet_prefer = _.get(this.vx_get_user,'userBetPrefer')==1;
      }
    }
  },
  methods: {
    ...mapActions({
      vx_set_bet_list: "set_bet_list",  // 押注信息列表
      vx_set_bet_s_list: "set_bet_s_list", // 串关信息列表
      vx_bet_s_list_remove: "bet_s_list_remove",
      vx_bet_s_obj: "bet_s_obj", // 串关对象扁平化
      vx_bet_s_obj_add_attr: "bet_s_obj_add_attr", //添加投注串关输入对象
      vx_bet_s_remove_attr: "bet_s_remove_attr", //删除串关投注项输入对象
      vx_set_layout_left_show: "set_layout_left_show",
      vx_set_is_handle: "set_is_handle", //串关是否正在进行
      vx_bet_s_obj_upd_cs:"bet_s_obj_upd_cs", //更新投注项对象(合并最大最小值时使用)
      vx_bet_obj_add_attr: "bet_obj_add_attr", //添加串关投注项对象
      vx_set_bet_mode: "set_bet_mode",//设置投注模式
      vx_set_bet_item_lock: 'set_bet_item_lock',
      vx_set_menu_change: 'set_menu_change',//菜单是否有变化
      vx_bet_single_obj_attr: "bet_single_obj_attr",//添加单关投注项对象
      vx_bet_single_list_push: 'bet_single_list_push',// 添加单关投注
      vx_bet_single_clear: "bet_single_clear",//清除单关数据
      vx_bet_mix_clear: "bet_mix_clear",  //清除虚拟投注数据
      // 设置是否为当
      vx_set_is_bet_single: 'set_is_bet_single',//设置单关串关标志
      vx_set_user_bet_prefer: 'set_user_bet_prefer',
      vx_set_is_bet_merge: "set_is_bet_merge",// 是否为合并模式
      vx_set_bet_current_money_obj: "set_bet_current_money_obj"//投注成功清除保存的金额数据
    }),
    /**
     * @description:串关打开左侧菜单那个未结算已结算注单记录
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    go_history() {
      this.vx_set_layout_left_show('bet_history');
    },
   /**
     * @description: 设置最大最小值
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    set_min_max_money() {
      if (!(this.vx_get_bet_s_list && this.vx_get_bet_s_list.length)) {
        return;
      }
      try {
        let last_obj = _.last(this.vx_get_bet_s_list);
        let success_count = _.get(this.view_ctr_obj, 'series_order_success.length') || 0;
        if(success_count>0) {
          //获取投注模块-统计串关数
          this.getSeriesCountJointNumbe((code, data) => {
            if(code==200) {
              last_obj = _.last(data);
              this.query_min_max_money(last_obj);
            } else {
              console.log('========获取最大最小值失败=========');
            }
          });
        } else {
          this.query_min_max_money(last_obj);
        }
      } catch (e) {
        console.error(e)
        this.set_all_money();
        this.bet_reset_money_msg();
      }
    },
    /**
     * @description:获取押注项最大和最小的金额
     * @param {*} last_obj 取得最后一个对象
     * @return {undefined} undefined
     */
    query_min_max_money(last_obj) {
      this.get_min_max_money(this.vx_get_bet_list, last_obj, (code, data) => {
        if (code == 200 && data && Array.isArray(data)) {
          clearTimeout(this.timer_obj['min_max_timer']);
          if (this.vx_get_bet_s_list && this.vx_get_bet_s_list[0]) {
            //console.log(`============set_min_max_money========${JSON.stringify(data)}`);
            data.forEach((item) => {
              let orderMaxPay = this.round_money(item.minBet, item.orderMaxPay);
              if(parseFloat(orderMaxPay) > parseFloat(item.minBet)) {
                item.orderMaxPay = orderMaxPay;
              }
              //更新投注项对象(合并最大最小值时使用)
              this.vx_bet_s_obj_upd_cs(item);
              //设置最高可以输入
              this.set_bet_max_input(item);
            });
          }
        }
        else {
          //设置所有的最大最小值金额
          this.set_all_money();
        }
        //重置获取金额后的标记以及消息提示信息
        this.bet_reset_money_msg();
        let all_empty_money = true;
        for(let obj of Object.values(this.vx_bet_s_obj)) {
          let money = _.get(obj, 'cs.money');
          if(money) {
            all_empty_money = false;
            break;
          }
        }
        if(!all_empty_money) {
          // 串关的校验金额
          this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD);
        }
        this.$root.$emit(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD);
        this.$nextTick(()=>{
          if (this.view_ctr_obj.error_code=='0400517') {
            this.view_ctr_obj.mix_range_money=-4;
          }
        });
      });
    },
    /**
     * @description: 点击确定按钮完成投注
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    complete_handle() {
      // 移除所有的投注项功能
      this.cancel_handle();
    },
    /**
     * @description: 移除所有下注项功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    cancel_handle() {
      // 移除所有的投注项功能
      this.vx_set_is_handle(false);
      //清除投注数据
      this.vx_bet_mix_clear();
      //合并
      if(this.vx_get_is_bet_merge) {
        //清除单关数据
        this.vx_bet_single_clear();
      }
      if(this.vx_cur_menu_type.type_name!='bet') {
        //单关
        this.vx_set_is_bet_single(true);
      }
      //获取左侧布局信息
      this.vx_set_layout_left_show("menu");
    },
    /**
     * @description: 保留这些选项按钮功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    save_bet_items() {
      //移除串关结束的赛事
      this.remove_mix_match_end();
      // 点击保留这些选项，返回投注栏保留投注成功的选项
      this.init_view();
      // 串关数据初始化
      this.get_mix_data();
      // 还原投注处理标识
      this.vx_set_is_handle(false);
      // 获取投注对象
      let bet_obj = _.cloneDeep(this.vx_get_bet_obj);
      // 移除投注项合并数据的处理时间
      for(let key in this.vx_get_bet_obj) {
        if(this.vx_get_bet_obj[key] &&
          this.vx_get_bet_obj[key].cs) {
          bet_obj[key].cs.match_update = false;
          delete bet_obj[key].cs.handle_time;
        }
      }
      // 将处理后的数据更新到vuex中
      this.vx_bet_obj_add_attr(bet_obj);
      //同步数据
      this.sync_data();
    },
    /**
     * @description: 获取串关数据
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_mix_data(callback) {
      if (this.view_ctr_obj.is_effect) {
        let len = this.vx_get_bet_s_list.length;
        let bet_obj = JSON.parse(JSON.stringify(this.vx_get_bet_s_obj))
        for(let i = 0; i < len; i++) {
          let id  = this.vx_get_bet_s_list[i];
          //删除bet_s_obj键值是id的值
          this.vx_bet_s_remove_attr(id);
        }
        //置空投注项数据
        this.vx_set_bet_s_list([]);
        // 调用串关接口统计串关数量
        this.getSeriesCountJointNumbe((code, data) => {
          if (code == 200) {
            // this.vx_bet_s_obj({});
             // 获取投注项列表id
            let bet_s_list = _.map(data, 'id');
            // 设置投注项列表数据
            this.vx_set_bet_s_list(bet_s_list);
            _.forEach(data, item => {
              // 获取服务器上的数据
              let bs_obj = { bs: { ...item } };
              // 扩展一个key字段并赋值
              bs_obj.key = `${item.id}`;
              // 扩展cs客户端对象，并对对象进行初始化赋值
              bs_obj.cs = {
                ...item,
                odds_value: "",
                money: '', // 投注额
                win_money: "", // 可赢额
                min_money: "", // 最低限额
                max_money: "", // 最高可投
              }
              if(item.id) {
                // 添加投注项对象到vuex中
                this.vx_bet_s_obj_add_attr(bs_obj);
              }
            });
            // 总的投注项个数
            this.get_bet_total_count();
            // 总投注额
            this.get_bet_total_money();
            // 总的预计收益额
            this.get_bet_total_win_money();
            // 如果回调函数存在，则执行回调
            if(callback) {
              callback();
            }
          }
        });
      }
    },
    /**
     * @description: 初始化视图
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    init_view() {
      this.view_ctr_obj = {
        bet_order_status: 1,  //  1-投注状态,2-投注中状态,3-投注成功状态,4-投注失败状态,5-投注项校验未通过
        cur_keyboard_index: -1,
        bet_tips_info: {
          id: "", //目标id
          match_name: "", // 赛事名称  世界杯2022亚洲外围赛
          battle_info: "", // 对战信息 中国 v 关岛
          play_game: "", // 玩法游戏 滚球 让球
          match_type: "", // 赛事类型
          league_name: "", // 联赛名称
          bet_end_time: "" // 投注结束时间
        },
        order_detail_data: [], // 单关投注成功记录
        series_order_data: [],  // 串关投注成功记录
        series_order_success: [],
        order_confirm_complete: 0, //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
        is_empty_money: true, // 金额是否为空
        error_code: "", // 错误码
        error_message: "", // 错误消息
        is_submit_result: false, // 是否提交标志
        is_effect: true, //供串关是使用
        mix_range_money: 0, // 串关金额范围
        timer: undefined,
        input_max_flag: 0, // 输入最大金额标志
        valid_money_obj: {}, // 是否显示失效按钮
        bet_fail_flag: false
      };
      this.refuse_code = undefined;
      this.call_interface = 0; // 调用接口 1.调用投注前校验接口 2. 调用投注前校验和最大最小值接口
      // 总投注数
      this.bet_total_count = 0.00;
      // 总投注额
      this.bet_total_money = 0.00;
      // 预计总收益
      this.bet_total_win_money = 0.00;
      // 投注模式初始化赋值
      this.vx_set_bet_mode(-1);
    },
    /**
     * @description: 提交按钮功能
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    submit_handle(handle_type) {
      //是不是失效
      if(userCtr.show_fail_alert()) {
        return;
      }
      // 获取用户信息
      let user = this.vx_get_user;
      //检测金额是否足够投注
      if(user.balance==0 || this.check_balance(user.balance)) {
        this.set_message('0400454'); //提示 余额不足,请您先充值
        return;
      }
      // 如果正在处理中
      if(this.vx_get_is_handle) return;

      let len1 = this.vx_get_bet_list.length;
      // 移除串关结束的赛事
      this.remove_mix_match_end((data)=>{
        if(data) {
          this.view_ctr_obj.error_message="";
          //重置串关投注标志为
          this.reset_bet_mix();
          // 关闭遮罩
          this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
        }
      });
      if(len1 < 2) {
        BetCommonHelper.init_message();
        //重置串关投注标志为
        this.reset_bet_mix();
        //小于一场的时候只清理错误码，不处理投注提示(可能为接受变化按钮，清理了错误码按钮变为投注)
        this.view_ctr_obj.error_code = "";
        return;
      }
      // 串关所有的金额都是空的时候 M400012 或者金额不在限额范围内 0400477 ，或者不能够串关 0400478则按钮为灰色不能够提交
      if(["M400012","0400477","0400478"].includes(this.view_ctr_obj.error_code)){
        return;
      }
      // 金额为空时提交校验
      if(this.view_ctr_obj.is_empty_money) {
        // 检查串关金额
        this.check_money(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD);
        return;
      }
      if(this.view_ctr_obj.mix_range_money==-4) {
        // 调用最大最小值接口
        this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_MIN_MONEY);
        // 获取总投注额
        this.get_bet_total_money();
        // 获取总的预计收益
        this.get_bet_total_win_money();
        return;
      }
      this.code_exist = false;
      this.series_error_data = [];
      // 账户异常直接移除投注项
      if(this.error_mapping.ERROR_CODE_ACCOUNT.includes(this.view_ctr_obj.error_code)) {
        // 重置串关数据
        this.reset_bet_mix();
        // 取消串关投注项
        this.cancel_handle();
        return;
      }
      // 正在提交投注
      this.view_ctr_obj.is_submit_result = true;
      // 投注数据变更状态改为false
      this.view_ctr_obj.bet_data_change = false;
      // 打开遮罩
      this.$root.$emit(this.emit_cmd.EMIT_OPEN_MENU_LOADDING_CMD);
      // 描述：断网25秒的处理办法
      if (this.timer_obj['over_time']) clearTimeout(this.timer_obj['over_time']);
      this.timer_obj['over_time'] = setTimeout(() => {
        if (this.code_exist) return;
        // 投注项校验为通过
        this.view_ctr_obj.bet_order_status = 5;
        // 解锁投注项
        this.vx_set_bet_item_lock(false);
        // 投注项模式设置为默认
        this.vx_set_bet_mode(-1);
        // 关闭遮罩
        this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
        this.set_message('0400483');//网络异常，请在投注单中查看投注结果
        clearTimeout(this.timer_obj['over_time']);
      }, 1000 * 25);
      // 同步赔率数据
      this.check_odds_beforebet((before_code)=>{
        // 清除check_odds_beforebet接口超时
        if (before_code && this.timer_) clearTimeout(this.timer_);
        if(before_code==200) {
          // 设置投注状态
          this.view_ctr_obj.bet_order_status = 1;
          this.view_ctr_obj.is_submit_result = false;
          // 移除无效盘口前投注项的数量
          let before_count = this.vx_get_bet_list.length;
          // 移除串关无效投注项
          this.remove_mix_match_end((data)=>{
            if(data) {
              // 重置错误信息
              this.view_ctr_obj.error_message="";
              // 重置串关投注数据(并检查是否可以串关)
              this.reset_bet_mix();
            }
          });
          // 如果是无效状态需要移除
          /* if(this.check_active_status()) {
            let index = _.findIndex(this.vx_get_bet_list, item => _.get(this.vx_get_bet_obj,`[${item}].cs.active`)!=1);
            if(index>-1) {
              let offsetTop = BetCommonHelper.get_bet_scroll_top('bet-mix-info',index);
              this.$root.$emit(this.emit_cmd.EMIT_BET_ITEM_SCROLL_TOP, offsetTop);
              return;
            }
          } */

          if(handle_type == 'accept' && !this.has_disable_item) {
            //重置串关投注项组件的标志
            this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_ITEM_RESET_CMD);
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
            // 恢复校验
            BetCommonHelper.init_message();
          }
          // 移除无效盘口后投注项的数量
          let after_count = this.vx_get_bet_list.length;
          // 删除了废弃盘口后无投注项不往下进行
          if (after_count == 0 || after_count == 1) {
            // this.vx_set_is_handle(false);
            this.view_ctr_obj.error_message="";
            //重置串关投注标志为
            this.reset_bet_mix();
            return;
          }
          // 若为串关,有无效盘口存在,删除盘口后,需要重新点击提交按钮
          if (before_count != after_count) {
            // 重置错误信息
            this.view_ctr_obj.error_message="";
            // 重置串关投注数据(并检查是否可以串关)
            this.reset_bet_mix();
            return;
          }

          if(handle_type=='submit') {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
            // 恢复校验
            BetCommonHelper.init_message();
          }
          // 校验金额
          if (![-4,0].includes(this.check_money(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD))) {
            // 校验串关金额
            if(this.view_ctr_obj.error_code) {
              this.set_message(this.view_ctr_obj.error_code,handle_type);//请您输入投注金额
            }
            // 重置串关投注标志为
            this.reset_bet_mix();
            return;
          } else if (this.check_active()) {
            //校验投注项状态
            this.view_ctr_obj.bet_order_status = 1;
            this.set_message('M400004');//赔率更新中!
            //重置串关投注标志为
            this.reset_bet_mix();
            return;
          }

          if ( this.view_ctr_obj.error_code && this.view_ctr_obj.error_code.startsWith("M")) {
            this.view_ctr_obj.bet_order_status = 1;
            this.code_exist = true;
            // this.vx_set_is_handle(false);
            //重置串关投注标志为
            this.reset_bet_mix();
            return false;
          }
          // 设置投注状态为处理中
          this.view_ctr_obj.bet_order_status = 2;
          clearTimeout(this.timer_obj['request']);
          this.timer_obj['request'] = setTimeout(() => {
            clearTimeout(this.timer_obj['request']);
            // 如果从无效变成有效的状态,给用户确认下
            if(this.view_ctr_obj.bet_data_change) {
              // 设置投注状态为处理中
              this.view_ctr_obj.bet_order_status = 1;
              //重置串关投注标志
              this.reset_bet_mix();
              return;
            }
            clearTimeout(this.timer_obj['over_time']);
            this.timer_obj['over_time'] = setTimeout(() => {
              if (this.code_exist) return;
              this.view_ctr_obj.bet_order_status = 5;
              this.vx_set_bet_item_lock(false);
              this.vx_set_bet_mode(-1);
              // 关闭遮罩
              this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
              this.set_message('0400483');//服务繁忙，再试一次吧~
              clearTimeout(this.timer_obj['over_time']);
            }, 1000 * 25); // 原本30s Aden要求修改为25s

            //这里进入投注提交环节 2是串关  1是单关
            this.bet_submit_data(2, (code, data, msg) => {
              if (code) {
                this.code_exist = true;
                clearTimeout(this.timer_obj['over_time']);
              }
              if (code == 200) {
              // 投注成功清除保存的金额
              this.vx_set_bet_current_money_obj({value:null})
                BetCommonHelper.init_message();
                this.view_ctr_obj.bet_order_status = 3;
                // 订单数据设置
                this.view_ctr_obj.order_detail_data = data.orderDetailRespList;
                // 串关数据设置
                this.view_ctr_obj.series_order_data = data.seriesOrderRespList;
                // console.log(`==========order_detail_data:${data.orderDetailRespList.length}=======series_order_data:${data.seriesOrderRespList.length}`);
                let bet_obj;
                _.forEach(data.orderDetailRespList,item=>{
                  //根据投注项id,获取投注项对象
                  bet_obj = _.cloneDeep(BetCommonHelper.get_bet_obj( item.playOptionsId));
                  if(bet_obj && bet_obj.cs) {
                    bet_obj.cs.handle_time = new Date().getTime();
                  }
                  //更新投注项的比分
                  BetCommonHelper.set_bet_obj_value( bet_obj);
                });

                let lock = data.lock? data.lock: 0; // 如果没有返回，给默认老的投注流程
                this.vx_set_bet_mode(lock);
                let success_count = 0; // 注单提交成功的个数
                let confirm_count = 0; // 注单确认中的个数
                let fail_count = 0; // 注单失败的个数
                _.forEach(data.seriesOrderRespList, item=>{
                  // 订单失败
                  if(item.orderStatusCode==0) {
                    // 失败的订单数量统计
                    fail_count++;
                  } else if(item.orderStatusCode==1) { // 订单处理成功
                    // 成功的订单数量统
                    success_count++;
                  } else if(item.orderStatusCode==2) { // 订单确认中
                    // 确认中的订单数量统计
                    confirm_count++;
                  }
                });


                // 确认中的
                if(confirm_count > 0) {
                  this.view_ctr_obj.order_confirm_complete = 1;
                }
                if(success_count > 0 && success_count == data.seriesOrderRespList.length) {

                  // 全部成功
                  if(success_count == data.seriesOrderRespList.length) {
                    this.view_ctr_obj.order_confirm_complete = 2;
                  }
                }
                // 全部失败
                if(fail_count == data.seriesOrderRespList.length) {
                  this.view_ctr_obj.order_confirm_complete = 3;
                }
                // 有成功有失败的
                if(fail_count > 0 && success_count>0 && ((fail_count+success_count) == data.seriesOrderRespList.length)) {
                  this.view_ctr_obj.order_confirm_complete = 4
                }

                if (this.view_ctr_obj.order_confirm_complete == 1) {
                  // 定时去拉接口
                  this.get_timed_task();
                }
                // 老流程在投注接口相应后关闭遮罩
                if(this.vx_get_bet_mode === 0) {
                  // 解锁投注项(解锁后可以点击)
                  this.vx_set_bet_item_lock(false);
                  // 关闭遮罩
                  this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
                } else if(this.vx_get_bet_mode === 1){ // 新流程调用接口22秒后还在确认中的时候拉取一次查询状态的接口
                  if(this.view_ctr_obj.series_order_data.length > 0) {
                    // 获取投注成功的订单
                    this.view_ctr_obj.series_order_success = _.filter(this.view_ctr_obj.series_order_data, (item) => item.orderStatusCode == 1);
                    // 如果投注成功的订单和串关订单个数相同则说明全部投注成功
                    if(this.view_ctr_obj.series_order_success.length == this.view_ctr_obj.series_order_data.length) {
                      // 设置确认完成状态为2  0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
                      this.view_ctr_obj.order_confirm_complete = 2;
                      // 清除订单成功数据
                      this.view_ctr_obj.series_order_success = [];
                    }
                  }

                  // 订单在确认中
                  if(this.view_ctr_obj.order_confirm_complete === 1) {
                    clearTimeout(this.timer_obj['over_time']);
                    this.timer_obj['over_time'] = setTimeout(()=>{
                      // 25秒后超时拉去投注前校验接口同步数据
                      this.check_odds_beforebet(()=>{
                        if(this.view_ctr_obj.error_code=='') {
                          this.set_message('0400483');//服务繁忙，再试一次吧~
                        }
                      });
                      // 解锁投注项使其可以点击
                      this.vx_set_bet_item_lock(false);
                      // 关闭遮罩
                      this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
                      clearTimeout(this.timer_obj['over_time']);
                    }, 1000 * 25);
                  }
                }
              } else if(code=='400532'){ //赔率调整中
                this.view_ctr_obj.error_code = code;
                // 设置提示消息
                this.set_message(code);
                // 拉取投注前校验接口更新赔率
                this.check_odds_beforebet();
              } else {
                // 投注模式设置为默认
                this.vx_set_bet_mode(-1);
                // 解锁投注项
                this.vx_set_bet_item_lock(false);
                // 关闭遮罩
                this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
                // 设置投注订单状态为投注失败
                this.view_ctr_obj.bet_order_status = 4;
                // 提交结果标识
                this.view_ctr_obj.is_submit_result = true;
                 // 串关错误数据设置
                this.series_error_data = data;
                if(code == '111111') {
                  // 设置错误码
                  this.view_ctr_obj.error_code = code;
                  // 设置提示信息
                  this.view_ctr_obj.error_message = msg;
                } else {
                  // 错误信息处理
                  this.submit_error_result(code, data, handle_type);
                }
              }
            });
          }, 300);
        } else {
          // 重置投注项数据
          this.reset_bet_mix();
          // 初始化错误信息
          BetCommonHelper.init_message();
          // 错误码退出为true
          this.code_exist = true;
          // 投注状态设置为可以投注
          this.view_ctr_obj.bet_order_status = 1;
          this.view_ctr_obj.is_submit_result = false;
          // 接受变化按钮 并且存在无效投注项
          if(handle_type=='accept' && !this.has_disable_item) {
            // 移除无效投注项
            this.remove_mix_match_end();
            this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_ITEM_RESET_CMD);
          }
          if(before_code!==200) {
            // 设置提示信息
            this.set_message(before_code,handle_type);
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
      if(data && data.length) {
        //1.开盘，2封盘，3关盘 ，4 锁盘
        let dl = data.length;
        for(let i = 0;i < dl; i++) {
          let oid =  _.get(data, `[${i}].data.playOptionsId`);
          let mix_code = _.get(data, `[${i}].code`);
          // 投注项id存在且错误码为关盘的错误码或者赔率变化的错误码
          if(oid && (this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(mix_code) ||
            this.error_mapping.ERROR_CODE_ODDS_CHANGE.includes(mix_code))) {
            let bet_obj = BetCommonHelper.get_bet_obj( oid);
            if (bet_obj) {
              let obj = _.cloneDeep(bet_obj);
              if(obj && obj.cs) {
                obj.key = obj.cs.id;
                // 如果是关盘错误码
                if(this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(mix_code)) {
                  // 设置投注项状态为关盘
                  obj.cs.active = 3;
                  // 设置投注项状态为关盘
                  obj.bs.hps[0].hl[0].ol[0].os = 3;
                  // 添加投注项到Vuex中若存在则更新
                  this.vx_bet_obj_add_attr(obj);
                  this.id = bet_obj.id;
                  // 模拟发送C105 同步列表和详情中对应的投注项数据
                  // BetCommonHelper.update_odds_info();
                } else //赔率变化错误码
                if (this.error_mapping.ERROR_CODE_ODDS_CHANGE.includes(mix_code)) {
                  let odds_value =  _.get(data, `[${i}].data.odds`);
                  // 设置投注项状态为开盘
                  obj.cs.active = 1;
                  // 设置最新赔率
                  obj.cs.odds_value = odds_value;
                  // 设置投注项状态为开盘
                  obj.bs.hps[0].hl[0].ol[0].os = 1;
                  // 设置最新赔率
                  obj.bs.hps[0].hl[0].ol[0].ov = odds_value;
                  // 添加投注项到Vuex中若存在则更新
                  this.vx_bet_obj_add_attr(obj);
                  this.id = bet_obj.id;
                  // 模拟发送C105 同步列表和详情中对应的投注项数据
                  // BetCommonHelper.update_odds_info();
                }
              }
            }
          }
        }
        // console.log(`===========================code:${code}`);
        // 如果code码不在关盘错误码与赔率变化的错误码列表中存在
        if(![...this.error_mapping.ERROR_CODE_ODDS_CLOSE,
            ...this.error_mapping.ERROR_CODE_ODDS_CHANGE].includes(code)) {
          //坑位已发生改变，投注失败则需要同步数据  0402010 盘口值变化 0400467 坑位已发生改变，投注失败
          if(['0402010','0400467'].includes(code)) {
            // 拉去投注前校验接口
            this.check_odds_beforebet();
          } else if (code=='0400475') { //额度变更
            //设置最大最小默认值
            this.set_default_min_max();
            // 最高可投与用户的投注金额都变成最新的最高可投
            this.set_min_max_money();
          }
          // 若业务端返回禁止串关，则前端也需要再次检测才能显示样式
          if(['0400477','0400478'].includes(code) && this.vx_get_bet_list.length>1) {
            // 检查是否可以串关
            BetCommonHelper.check_mix();
          }
        }
        this.set_message(code, handle_type);
      } else {
        if(code=='0400517') {
          //设置最大最小默认值
          this.set_default_min_max();
          // 最高可投与用户的投注金额都变成最新的最高可投
          this.set_min_max_money();
        }
        // 设置错误提示信息
        this.set_message(code, handle_type);
      }
    },
    /**
     * @description: 确定按钮功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    submit_confirm() {
      // 账户异常直接移除投注项
      if(this.error_mapping.ERROR_CODE_ACCOUNT.includes(this.view_ctr_obj.error_code) ||
        this.error_mapping.ERROR_CODE_NOT_DATA.includes(this.view_ctr_obj.error_code)) {
        //重置串关投注标志
        this.reset_bet_mix();
        //移除所有下注项功能
        this.cancel_handle();
        return;
      }
      // 投注前拉取最新的盘口赔率状态(应对socket推送不及时)
      this.check_odds_beforebet((code)=>{
        if(code == 200) {
          if(this.error_mapping.ERROR_CODE_CONFIRM_BTN.includes(this.view_ctr_obj.error_code)) { // 非用户类错误
            //0402018 ,0400450 返回结果data为null 直接删除
            this.series_error_data = this.this.series_error_data || []; //这里对null报错做一个兼容
            let sd = this.series_error_data.length
            if(this.series_error_data &&  sd > 0) {
              for(let i = 0; i < sd; i++) {
                // 投注项id
                let oid =  _.get(this.series_error_data, `[${i}].data.playOptionsId`);
                // 串关投注失败的code码
                let mix_code = _.get(this.series_error_data, `[${i}].code`);
                // 根据oid获取投vuex中投注项的id
                let id = BetCommonHelper.get_id(oid);
                // 投注项在虚拟体育列表中的位置
                let index = _.findIndex(this.vx_get_bet_list, item=>item==id);
                // 串关错误码是否在确认按钮错误码列表中 并且在投注项列表中存在
                if(this.error_mapping.ERROR_CODE_CONFIRM_BTN.includes(mix_code) && index>-1) {
                  // 移除投注项对象中对应的投注项
                  this.vx_bet_obj_remove_attr(id);
                  //删除该子项
                  this.vx_bet_list_remove(index, 1);
                }
              }
              clearTimeout(this.view_ctr_obj.timer_);
              this.view_ctr_obj.timer_ = undefined;
              // 初始化视图对象
              this.init_view();
            } else {
              // 重置串关投注项信息
              this.reset_bet_mix();
              // 取消投注
              this.cancel_handle();
            }
          }
        } else {
          console.log("===============submit_confirm方法调用接口===check_odds_beforebet失败=======");
        }
      });
    },
    /**
     * @description: 检测投注项状态是否为封盘
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    check_active() {
      let active_ = 1;
      let check_result = false;
      for (let i = 0; i < this.vx_get_bet_list.length; i++) {
        let item = this.vx_get_bet_list[i];
        let cs = _.get(this.vx_get_bet_obj,`${item}.cs`);
        if(cs) {
          // 赛事盘口状态
          let match_status = _.get(cs, 'match_status');
          // 盘口状态
          let handicap_status = _.get(cs, 'handicap_status');
          // 投注项状态
          let active = _.get(cs, 'active');
          active_ = this.get_odds_active(match_status, handicap_status, active);
          // 锁盘状态
          if (active_ == 4) {
            check_result = true;
            break;
          }
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
      for (let i = 0; i < this.vx_get_bet_list.length; i++) {
        let item = this.vx_get_bet_list[i];
        let cs = _.get(this.vx_get_bet_obj,`${item}.cs`);
        if(cs) {
          // 赛事盘口状态
          let match_status = _.get(cs, 'match_status');
          // 盘口状态
          let handicap_status = _.get(cs, 'handicap_status');
          // 投注项状态
          let active = _.get(cs, 'active');
          // 根据赛事盘口状态 盘口状态 投注项状态获取投注项需要显示的状态
          active_ = this.get_odds_active(match_status, handicap_status, active);
          // 如果是封盘或者关盘
          if (active_ == 2 || active_ == 3) {
            check_result = true;
            break;
          }
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
      this.view_ctr_obj.mix_range_money = 0;
      this.$root.$emit(cmd);
      // 返回串关金额限额标志
      return this.view_ctr_obj.mix_range_money;
    },
    /**
     * @description: 总投注数
     * @param {undefined} undefined
     * @return {Number}
     */
    get_bet_total_count() {
      // 获取金额不为空的投注项列表
      let bet_list = _.filter(this.vx_get_bet_s_list, (item) => {
        let res = _.get(this.vx_get_bet_s_obj, `${item}`);
        if (res && res.cs) {
          let money_ = res.cs.money;
          return money_ && money_ !== "";
        }
      });
      // 获取投注数量
      this.bet_total_count = bet_list.length;
    },
    /**
     * @description: 总投注额
     * @param {undefined} undefined
     * @return {Number}
     */
    get_bet_total_money() {
      let total_money = 0.00;
      this.bet_total_money = 0.00;
      if (this.vx_get_bet_s_list.length == 0) {
        this.bet_total_money = total_money;
        return;
      }
      //串关计算
      _.forEach(this.vx_get_bet_s_list, item => {
        let res =  _.get(this.vx_get_bet_s_obj, `${item}`);
        if (res && res.cs && res.cs.money !== null && res.cs.money!=="") {
          // 总收益 += 可赢额
          total_money = total_money + parseFloat(this.vx_get_bet_s_obj[item].cs.money) * this.vx_get_bet_s_obj[item].cs.count;
        }
      });
      // 预计总收益
      this.bet_total_money = total_money;
    },
    /**
     * @description: 预计总收益
     * @param {undefined} undefined
     * @return {Number}
     */
    get_bet_total_win_money() {
      this.bet_total_win_money = 0.00;
      if (this.vx_get_bet_s_list.length == 0) {
        return 0.00;
      }
      let total_win_money = 0;
      //串关计算
      _.forEach(this.vx_get_bet_s_list, item => {
        let res =  _.get(this.vx_get_bet_s_obj, `${item}`);
        if (res && res.cs && res.cs.win_money !== "") {
          total_win_money = total_win_money + parseFloat(res.cs.win_money);
        }
      });
      this.bet_total_win_money = total_win_money;
    },
    /**
     * @description: 设置提示消息
     * @param {String} code 错误码
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    set_message(code, handle_type) {
      // console.log(`==========set_message=============code:${code}`);
      // 错误码不存在 或者 错误码存在但是错误码为前端自定义错误码(以M开头的错误码) 或者虚拟体育已经处理完成按钮为接受变化 都不进行处理
      if (!code ||
        (code && !code.toString().startsWith("M")) && handle_type=='accept') {
        return;
      }
      // 如果是失效的投注项并且是关盘的错误码则不处理
      if(this.has_disable_item && !this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(code)) {
        return;
      }
      // 重新初始化错误信息
      BetCommonHelper.init_message();
      let msg = this.$root.$t(`error_msg_info.${code}`);
      // 若msg为空则显示投注失败处理
      if (msg == `error_msg_info.${code}`) {
        // 异常码无对应的消息是显示默认的提示
        msg = this.$root.$t('error_msg_info.XXXXXX');
        code = 'XXXXXX';
      }
      // 设置错误码
      this.view_ctr_obj.error_code = code;
      if(code=='0400538') { //串关最小仅支持%s串,请重新组合投注
        this.view_ctr_obj.error_message = msg.client_msg2.replace('%s', this.vx_get_mix_min_count);
      } else if(code=='0400539') { //串关最大仅支持%s串,请重新组合投注
        this.view_ctr_obj.error_message = msg.client_msg2.replace('%s', this.vx_get_mix_max_count);
      } else {
        // 设置错误信息
        this.view_ctr_obj.error_message = msg.client_msg2;
      }
      // 获取错误码需要提示的时长
      let delay = this.error_mapping.ERROR_CODE_DELAY[code];
      // console.log(`===============111111111111111111111111=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
      if (delay) {
        clearTimeout(this.timer_obj['init_message']);
        this.timer_obj['init_message'] = setTimeout(() =>{
          this.view_ctr_obj.is_submit_result = false;
          //console.log(`===============2222222222222222222=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
          // 重新初始化错误信息
          BetCommonHelper.init_message();
          clearTimeout(this.timer_obj['init_message']);
        }, delay);
      }
    },
    /**
     * @description: 展开折叠复式连串过关投注按钮  显示所有过关
     * @param {undefined} undefine
     * @return {undefined} undefine
     */
    mix_toggle_handle() {
      //如果投注项少于3个则不允许展开
      if(this.vx_get_bet_list.length<3) {
        return;
      }
      this.is_expend = !this.is_expend;
    },
    /**
     * @description: 设置所有的最大最小值金额
     * @param {String} code 错误码
     * @param {Array} data 错误数据
     * @return {undefined} undefine
     */
    set_all_money() {
      let min_money = '1';
      let max_money = '2000';
      if(parseFloat(max_money) < parseFloat(min_money) && parseFloat(max_money) != 0) {
        min_money = max_money;
      }
      if (this.vx_get_bet_s_obj) {
        for (let key in this.vx_get_bet_s_obj) {
          let bet_s_obj =  _.get(this.vx_get_bet_s_obj, `${key}`);
          if (bet_s_obj) {
            let obj = _.cloneDeep(bet_s_obj);
            obj.key = key;
            // 满额投注为false
            obj.cs.full_bet = 0;
            // 最小值
            obj.cs.min_money = min_money;
            // 最大值
            obj.cs.max_money = max_money;
            // 投注项对象设置
            this.vx_bet_s_obj_add_attr(obj);
            // 设置可以输入的最大金额
            this.set_bet_max_input({minBet: min_money, orderMaxPay: max_money, type: key});
          }
        }
      }
    },
    /**
     * @description: 重置串关投注标志为
     * @param {undefined} undefine
     * @return {undefined} undefine
     */
    reset_bet_mix() {
      clearTimeout(this.view_ctr_obj.timer_);
      this.view_ctr_obj.timer_ = undefined;
      this.view_ctr_obj.is_submit_result = false;
      // this.vx_set_is_handle(false);
      this.vx_set_bet_item_lock(false);
      // 投注失败还原默认的模式
      this.vx_set_bet_mode(-1);
      // 关闭遮罩 关闭菜单上loadding指令
      this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
    },
    /**
     * @description: 重置获取金额后的标记以及消息提示信息
     * @param {undefined} undefine
     * @return {undefined} undefine
     */
    bet_reset_money_msg() {
      clearTimeout(this.timer_obj['min_max_timer']);
      this.view_ctr_obj.mix_range_money = 0;
      this.view_ctr_obj.input_max_flag = 2;
      // 大于最大金额,小于最小金额,金额为空,最大最小值正在获取中的code码
      if(["M400005","M400010","M400011","M400012"].includes(this.view_ctr_obj.error_code)) {
        // 重新初始化错误信息
        BetCommonHelper.init_message();
      }
    },
    /**
     * @description: 检查串关并回复默认串关标志
     * @param {undefined} undefine
     * @return {undefined} undefine
     */
    reset_serial() {
      // 检测是否可以进行串关 matches有值则表示不能够串关，返回的不能串关的赛事id数组
      let matches = BetCommonHelper.check_mix();
      // 如果都可以串关 0400478，且之前的错误提示为不能够串关 0400477，则复位错误信息以及错误码
      if(matches.length == 0 && ["0400477","0400478"].includes(this.view_ctr_obj.error_code)) {
        //复位提示语
        BetCommonHelper.reset_message_info();
      } else if(matches.length > 0){
        // 设置不可串关的错误码
        this.view_ctr_obj.error_code = "0400477";
      }
      _.forEach(this.vx_get_bet_list, item => {
        let obj = _.cloneDeep(this.vx_get_bet_obj[item]);
        let cs = _.get(obj, 'cs', {});
        // 恢复是否可以串关的标志
        if(cs && matches.length == 0) {
          cs.is_serial = true;
        } else {
          if(matches.includes(cs.match_id)) {
             // 不可以串关
            cs.is_serial = false;
          } else {
            // 可以串关
            cs.is_serial = true;
          }
        }
        // 更新投注项对象
        BetCommonHelper.set_bet_obj_value( obj);
      });
    },
    /**
     * @description: 定时去拉接口
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_timed_task() {
      //console.log('=================================get_timed_task');
      //1是确认中的  4是有成功有失败的 都去拉接口
      if([1,4].includes(this.view_ctr_obj.order_confirm_complete)) {
        this.view_ctr_obj.timer_ = setTimeout(() => {
          //console.log('======================before call get_order_result');
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.get_order_result();
        }, 5 * 1000); // 5S后拉取接口
      }
    },
    /**
     * @description: 获取订单结果
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_order_result() {
      //console.log('=================================get_order_result========interval_time:'+this.interval_time());
      //重置定时任务标志
      if(this.interval_time()) return;
      let orderNos = [];
      // 调用接口获取订单的最新数据
      _.forEach(this.view_ctr_obj.series_order_data, item => {
        if((item.orderStatusCode == 2) && !orderNos.includes(item.orderNo)) {
          orderNos.push(item.orderNo);
        }
      });

      if(orderNos.length > 0) {
        orderNos = orderNos.join(',');
        api_betting.query_order_status({orderNos}).then(res=>{
          // 状态码
          let code = _.get(res, "data.code");
          // 返回的处理数据
          let data = _.get(res, "data.data");
          // 处理时间
          let handle_time = _.get(res, 'data.ts');
          let status, newProcessOrder = 0;
          //console.log(`=====================================${JSON.stringify(data)}`);
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          if(code == 200 && data && data.length) {
            _.forEach(data, item => {
              // 订单状态转换
              status = this.change_status(item.status);
              // 串关订单列表中ws所在的位置
              let series_index = _.findIndex(this.view_ctr_obj.series_order_data, item2 => item.orderNo==item2.orderNo);
              if(series_index > -1) {
                // 如果C201和接口拉取都同时进行,则优先最晚的执行
                if(this.view_ctr_obj.series_order_data[series_index].handle_time && this.view_ctr_obj.series_order_data[series_index].handle_time > handle_time) {
                  return;
                }
                // 对应订单状态以及处理时间设置
                Object.assign(this.view_ctr_obj.series_order_data[series_index], {orderStatusCode: status, handle_time});
                //注单修改项【单关1个，串关所有】
                if(item.oddsChangeList && item.oddsChangeList.length) {
                  Object.assign(this.view_ctr_obj.series_order_data[series_index], {maxWinMoney: parseFloat(item.newMaxWinAmount).toFixed(2)});
                  _.forEach(item.oddsChangeList, item2 => {
                      if(item2) {
                        _.forEach(this.view_ctr_obj.order_detail_data, (detail_item, detail_index) => {
                          // 投注项id
                          if(item2.playOptionsId == detail_item.playOptionsId) {
                            // 赔率数据合并
                            Object.assign(this.view_ctr_obj.order_detail_data[detail_index], {oddsValues: item2.usedOdds});
                            if(item.refuseCode=='0400532') {//赔率调整中
                              this.view_ctr_obj.error_code = item.refuseCode;
                            }
                           /*  // 赔率投注栏同步
                            let bet_mix_obj = _.cloneDeep(BetCommonHelper.get_bet_obj( item2.playOptionsId));
                            // 客户端对象赔率设置
                            bet_mix_obj.cs.odds_value = item2.usedOdds;
                            // 服务器对对象赔率设置
                            bet_mix_obj.bs.hps[0].hl[0].ol[0].ov = item2.usedOdds;
                            // 投注项对象设置
                            BetCommonHelper.set_bet_obj_value( bet_mix_obj); */
                          }
                        });
                      }
                  });
                }
                // console.log(`=========bet_mix=========newProcessOrder:${item.newProcessOrder}`);
                //是投注新流程订单
                if(item.newProcessOrder == 1){
                  newProcessOrder = 1;
                  this.view_ctr_obj.series_order_success = _.filter(this.view_ctr_obj.series_order_data, (item) => item.orderStatusCode == 1);
                  // console.log(`=======bet_mix=====series_order_success============${this.view_ctr_obj.series_order_success.length}`);
                  if(item.refuseCode) {
                    this.refuse_code = item.refuseCode;
                  }
                  // console.log(`=========bet_mix=========status:${status}`);
                  if(status == 0) { // 如果是新流程，且有失败
                    if([0,1].includes(item.tryNewProcessBet) && this.call_interface != 2) { // 如果是新流程且tryNewProcessBet为1则需要拉去状态接口一次
                      this.call_interface = 1;
                    } else if(skt_data.tryNewProcessBet == 2) { // 投注限额发生变化需要同步最大最小值
                      this.call_interface = 2;
                    }
                  }
                  // console.log(`=========bet_mix=========call_interface:${this.call_interface}`);
                }
              }
            });
          }
          let success_count = 0; // 注单提交成功的个数
          let confirm_count = 0; // 注单确认中的个数
          let fail_count = 0; // 注单失败的个数
          _.forEach(this.view_ctr_obj.series_order_data, item => {
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
          if(success_count == this.view_ctr_obj.series_order_data.length) {
            this.view_ctr_obj.order_confirm_complete = 2;
          }
          // 全部失败
          if(fail_count==this.view_ctr_obj.series_order_data.length) {
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
          // 是新投注流程且没有确认中状态(订单状态已经处理完毕)
          if(newProcessOrder == 1 && confirm_count == 0 ) { // 如果没有待确认的订单，则需要拉去一次接口
            // console.log(`========order_confirm_complete:${this.view_ctr_obj.order_confirm_complete}=======================>>>>>call_final======`);
            if(this.view_ctr_obj.order_confirm_complete==2) {
              this.view_ctr_obj.series_order_success = [];
              this.refuse_code = undefined;
              this.call_interface = 0;
            } else if ([3,4].includes(this.view_ctr_obj.order_confirm_complete)) { // 如果没有待确认的订单，则需要拉去一次接口
              this.call_final();
            }
          }
          // 需要判断是否继续轮询
          if (this.interval_time()) return;
          this.view_ctr_obj.timer_ = setTimeout(() => {
            if(this.vx_get_bet_mode==-1) {
              clearTimeout(this.view_ctr_obj.timer_);
            } else {
              this.get_order_result();
            }
          }, 2 * 1000); // 5s 改为 2s
        }).catch((err)=>{
          console.error(err)
          console.log("获取订单状态和最新赔率最高可盈接口调用异常");
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.view_ctr_obj.timer_ = setTimeout(() => {
            if(this.vx_get_bet_mode==-1) {
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
      let index = _.findIndex(this.view_ctr_obj.series_order_data, item => item.orderStatusCode == 2);
      if(index == -1) {
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
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
      switch(status) {
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
     * @description:设置最高可以输入
     * @param {*} item
     * @return {undefined} undefined
     */
    set_bet_max_input(item){
      // 获取用户信息
      let user = this.vx_get_user;
      // 获取账户金额
      let balance = parseFloat(user.balance) || 0.00;
      let input_max = null;
      // 最高限额存在
      if(item.orderMaxPay) {
        // 串关信息列表
        if(this.vx_get_bet_s_list.length == 1) {
          // 用户金额比最高限额的值大
          if(balance > parseFloat(item.orderMaxPay)) {
             // 最高可以输入最大限额的值
            input_max = parseFloat(item.orderMaxPay);
          } else if(balance <= parseFloat(item.orderMaxPay)) { // 账户金额比最高限额小
            // 最高可以输入账户金额的值
            input_max = balance;
          }
        } else {
          // 只能输入最高限额那么多的金额
          input_max = parseFloat(item.orderMaxPay);
        }
      }
      //赛事订阅
      this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_INPUT_MAX_MONEY, {type: item.type, value: input_max});
    },
    /**
     * @description:监听键盘抬起事件
     * @param {*} event
     * @return {undefined} undefined
     */
    keyup_handle(event) {
      if(event.stopPropagation)
      {
        event.stopPropagation();
      }
      //正在投注处理中
      if(this.vx_get_is_handle) {
        // 设置左侧为投注列表
        this.vx_set_layout_left_show("bet_list");
      }
      //单关，投注处理中，或者正在投注中，返回不做处理
      if(this.vx_is_bet_single || this.vx_get_is_handle || this.bet_loadding) return;
      // 按enter按键 且投注成功 且不是处理中
      if(this.bet_complete_show && event.keyCode == 13 && !this.bet_loadding) {
        // 触发完成方法
        this.complete_handle();
      } else if(event.keyCode == 13) {
        // 触发提交方法
        this.submit_handle();
      }
      // 按esc按键
      else if(event.keyCode == 27) {
        // 触发取消投注方法
        this.cancel_handle();
      }
    },
    /**
     * @description: 取整
     * @param {String} min_money 最低限额(整数)
     * @param {String} max_money 最高小值(非整数)
     * @return {String}  最大钱
     */
    round_money(min_money, max_money) {
      let min_interal='', max_integral = '', min_len = 0, max_len = 0; //max_integral:最大金额整数部分 min_len:最小值的长度，max_len:最大值的长度
      if(!_.isEmpty(min_money) && !_.isEmpty(max_money)) {   
        min_interal = min_money.split('.')[0]   
        min_len= min_interal.length; // 最小值整数部分长度
        max_integral = max_money.split('.')[0]; // 最大值整数部分的长度
        max_len = max_integral.length;
      }
      // 最低投注金额数值为四位及以上
      if(min_len>=4) {
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
     * @description: 移除无效项
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    remove_invalid_item() {
      // 移除无效的投注盘口
      this.remove_mix_match_end(()=>{
        // 移除后串关列表为空
        if(this.vx_get_bet_list.length==0) {
          // 如果为合并则清除单关投注项
          if(this.vx_get_is_bet_merge) {
            this.vx_bet_single_clear();
          }
          if(this.vx_cur_menu_type.type_name!='bet') {
            // 设置为不合并
            this.vx_set_is_bet_merge(false);
            // 设置为单关
            this.vx_set_is_bet_single(true);
          }
        }
        this.show_valid_btn = false;
      });
    },
    /**
     * @description:同步数据
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sync_data() {
      let count_pa = 0;
      //获取串关投注项对象
      let obj = this.vx_get_bet_obj;
      let bet_obj = _.cloneDeep(obj);
      for(let key in obj) {
        if(obj[key] &&  obj[key].cs) {
          bet_obj[key].cs.match_update = false;
          delete bet_obj[key].cs.handle_time;
          if(obj[key].cs.operate_type=='PA') {
            count_pa++;
          }
        }
      }
      //添加串关投注项对象
      this.vx_bet_obj_add_attr(bet_obj);
      if(count_pa>0) {
        //设置最大最小默认值
        this.set_default_min_max();
        //获取额度接口合并
        this.query_bet_amount((code, betAmountInfo)=>{
          clearTimeout(this.timer_obj['min_max_timer']);
          //限额获取中请稍后
          if(this.view_ctr_obj.error_code=='M400012') {
            this.view_ctr_obj.mix_range_money = 0;
            this.view_ctr_obj.error_code = '';
            this.view_ctr_obj.error_message = '';
          }
          //原有获取额度返回结构体
          if(code == 200 && betAmountInfo && betAmountInfo.length > 0) {
            betAmountInfo.forEach((item) => {
              let orderMaxPay = this.round_money(item.minBet, item.orderMaxPay);
              if(parseFloat(orderMaxPay) > parseFloat(item.minBet)) {
                item.orderMaxPay = orderMaxPay;
              }
              //更新投注项对象(合并最大最小值时使用)
              this.vx_bet_s_obj_upd_cs(item);
              //设置最高可以输入
              this.set_bet_max_input(item);
            });
            this.view_ctr_obj.bet_order_status = 1;
            // 是否正在处理投注
            this.vx_set_is_handle(false);
            this.$root.$emit(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD);
          }
        });
      } else {
        // 设置最大最小默认值
        this.set_default_min_max();
        // 投注前拉取最新的盘口赔率状态(应对socket推送不及时)
        this.check_odds_beforebet(()=>{
          //获取最大最小值接口
          this.set_min_max_money();
          this.view_ctr_obj.bet_order_status = 1;
          // 是否正在处理投注
          this.vx_set_is_handle(false);
        });
      }
    },
    /**
     * @description:切换用户喜好设置
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    toggle_bet_prefer() {
      // 用户喜好切换
      this.user_bet_prefer = !this.user_bet_prefer;
      if (this.user_bet_prefer) {
        this.vx_set_user_bet_prefer(1);
        // 自动接受更好的赔率
        api_betting.record_user_preference({userBetPrefer: 1});
      } else {
        this.vx_set_user_bet_prefer(2);
        // 不自动接受赔率变化
        api_betting.record_user_preference({userBetPrefer: 2});
      }
    },
    /**
     * @description:设置最大最小默认值
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    set_default_min_max() {
      let minBet = '1';
      let orderMaxPay = '2000';
      clearTimeout(this.timer_obj['min_max_timer']);
      this.timer_obj['min_max_timer'] = setTimeout(() => {
        let len = this.vx_get_bet_s_list.length;
        for(let i = 0;i < len ; i++) {
          let type = this.vx_get_bet_s_list[i];
          let obj = {minBet, orderMaxPay, type};
          //更新投注项对象
          this.vx_bet_s_obj_upd_cs(obj);
          //设置最高可以输入
          this.set_bet_max_input(obj);
        }
        //重置获取金额后的标记以及消息提示信息
        this.bet_reset_money_msg();
        this.$root.$emit(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD);
      }, 5000);
    },
    /**
     * 检测金额是否足够投注
     * @param {*} balance
     * @returns
     */
    check_balance(balance) {
      let total_money = 0;
      for(let obj of Object.values(this.vx_get_bet_s_obj)) {
        let { cs } = obj;
        if(cs.money) {
          total_money += parseFloat(cs.money);
        }
      }
      return balance < total_money;
    }
  },
  mounted() {
    //获取串关数据
    this.get_mix_data(()=>{
      // 若串关投注列表中有两个以上的投注项
      if(this.vx_get_bet_list.length > 1) {
        // 重置投注项数据并校验串关投注规则
        this.reset_serial();
        // 若错误码存在
        if(this.view_ctr_obj.error_code) {
          // 根据错误码设置错误信息
          this.set_message(this.view_ctr_obj.error_code);
        }
      }
      this.$nextTick(()=>{
        // 无效投注项统计
        let count = BetCommonHelper.get_deactive_count();
        // 如果存在无效项需要提示
        if(count > 0 && !['0400477','0400478'].includes(this.view_ctr_obj.error_code)) {
          this.view_ctr_obj.error_code = "0402049";
          //投注项违反比分检查规则,禁止投注
          this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.0402049.client_msg2`);
        }
      });
    });
  }
}
