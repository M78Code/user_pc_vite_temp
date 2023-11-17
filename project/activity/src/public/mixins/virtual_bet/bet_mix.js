/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关组件的mixin文件
 */
import { mapGetters, mapActions } from "vuex";
import betting from "src/public/mixins/betting/betting2.js";

import play_mapping from "src/public/config/mapping/play_mapping.js";
import { api_betting } from "src/public/api/index.js";

export default {
  name: "bet-mix",
  mixins: [ betting],
  data() {
    return {
      view_ctr_obj: {
        bet_data_change: false, // 检测数据是否右边,主要在提交时使用
        bet_order_status: 1,  //  1-投注状态,2-投注中状态,3-投注成功状态,4-投注失败状态,5-投注项失效
        cur_keyboard_index: 0,
        //tips 数据 */
        bet_tips_info: {
          id: "", //目标id
          match_name: "", // 赛事名称  世界杯2022亚洲外围赛
          battle_info: "", // 对战信息 中国 v 关岛
          play_game: "", // 玩法游戏 滚球 让球
          match_type: "", // 赛事类型
          league_name: "", // 联赛名称
          bet_end_time: "" // 投注截止时间
        },
        // 串关信息
        error_code: "",
        error_message: "",
        is_submit_result: false, // 提交结果 用来控制code的提示
        order_detail_data: [], // 单关投注成功记录
        series_order_data: [],  // 串关投注成功记录
        order_confirm_complete: 0, //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
        is_empty_money: true, // 金额是否为空
        is_effect: true, //供串关是使用
        mix_range_money: 0,
        timer_: undefined,
        input_max_flag: 0, // 最大值获取标志 0: 默认值 1: 正在获取最大最小值 2:获取完成
        valid_money_obj: {} // 无效金额对象收集
      },
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
      //是否有返回code码
      code_exist: false,
      // 串关性能优化时使用
      bet_obj_item_h:{},
      // 是否移动到全部删除按钮
      bet_delete_over: false,
      // 玩法映射列表
      play_mapping: {},
      // 是否显示无效按钮
      show_valid_btn: false,
       // 失效错误码
      valid_error_codes: this.error_mapping.ERROR_CODE_ODDS_CLOSE,
      // 定时器对象
      timer_obj: {},
      // 用户喜好 false:自动接受更好赔率 true 不接收任何赔率
      user_bet_prefer: false
    }
  },
  created() {
    //设置滚动数据
    this.play_mapping = play_mapping;
    this.$emit("set_scroll_this",{type:'bet_this',_this:this})
    //设置串关最大高度
    this.set_max_height = this.debounce(this.set_max_height,100)
    // 投注数量
    this.$root.$on(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD, this.get_bet_total_count);
    // 投注金额
    this.$root.$on(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD, this.get_bet_total_money);
    // 最高可赢额
    this.$root.$on(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD, this.get_bet_total_win_money);
    // 完成按钮功能
    this.$root.$on(this.emit_cmd.EMIT_COMPLETE_HANDLE_CMD, this.complete_handle);
    // 最大最小值
    this.$root.$on(this.emit_cmd.EMIT_MIN_MAX_MONEY_CMD,this.set_min_max_money);
    // 保留这些选项
    this.$root.$on(this.emit_cmd.EMIT_MIX_SAVE_BET_CMD, this.save_bet_items);
    // this.$root.$on(this.emit_cmd.EMIT_MIX_INIT_VIEW_CMD,this.init_view);
    // 设置投注模式为未知
    this.vx_set_virtual_bet_mode(-1);
    // 设置投注项可选
    this.vx_set_bet_item_lock(false);

    this.vx_set_is_virtual_handle(false);
    this.user_bet_prefer = _.get(this.vx_get_user,'userBetPrefer')==1;
    //监听键盘抬起事件
    this.$root.$on(this.emit_cmd.EMIT_ENTER_PRESS_EVENT,this.keyup_handle);
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
    this.series_error_data = null;
    //清理防抖节流
    this.debounce_throttle_cancel(this.set_max_height);
    // 销毁接收版本类型变化参数 清除监听
    this.$root.$off(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD, this.get_bet_total_count);
    this.$root.$off(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD, this.get_bet_total_money);
    this.$root.$off(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD, this.get_bet_total_win_moneyff);
    this.$root.$off(this.emit_cmd.EMIT_COMPLETE_HANDLE_CMD, this.complete_handle);
    this.$root.$off(this.emit_cmd.EMIT_MIN_MAX_MONEY_CMD, this.set_min_max_money);
    this.$root.$off(this.emit_cmd.EMIT_MIX_SAVE_BET_CMD, this.save_bet_items);
    this.$root.$off("enter_press_event",this.keyup_handle);
    window.removeEventListener("keyup", this.keyup_handle);
  },
  computed: {
    ...mapGetters({
      vx_get_virtual_bet_list: "get_virtual_bet_list",//虚拟体育投注列表
      vx_get_virtual_bet_obj:"get_virtual_bet_obj",
      vx_get_virtual_bet_s_list: "get_virtual_bet_s_list",
      vx_get_virtual_bet_s_obj: "get_virtual_bet_s_obj",
      vx_get_user: "get_user",
      vx_get_is_virtual_handle: "get_is_virtual_handle",
      vx_get_virtual_bet_mode: "get_virtual_bet_mode",
      vx_cur_menu_type: "get_cur_menu_type",
      vx_get_mix_min_count: "get_mix_min_count",
      vx_get_mix_max_count: "get_mix_max_count"
    }),
    /**
     * @description: 折叠是否可用
     * @param {undefined} undefined
     * @return {Boolean}
     */
    expend_disable() {
      return this.vx_get_virtual_bet_list.length < 3;
    },
    /**
     * @description: 投注数量
     * @param {undefined} undefined
     * @return {Number}
     */
    bet_count() {
      return this.vx_get_virtual_bet_list.length;
    },
    /**
     * @description: 投注按钮是否显示
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_submit_show() {
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
      return [1, 2, 4, 5].includes(this.view_ctr_obj.bet_order_status) && codes.includes(error_code);
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
      return this.view_ctr_obj.bet_order_status == 2 || this.view_ctr_obj.order_confirm_complete==1;
    },
    /**
     * @description: 是否禁用投注按钮
     * @param {undefined} undefined
     * @return {Boolean}
     */
    bet_disable() {
      return (this.vx_get_virtual_bet_list.length == 1);
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
      //3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
      return this.vx_get_virtual_bet_mode==-1 && [3,4].includes(this.view_ctr_obj.order_confirm_complete);
    },
    /**
     * @description 判断是否有无效的投注项
     */
    has_disable_item() {
      return this.virtual_common.has_disable_item(this);
    },
    /**
     * 删除无效项按钮是否显示
     * @returns
     */
    show_invalid_btn() {
      let count = this.virtual_common.get_deactive_count(this);
      return this.vx_get_virtual_bet_list.length > 1 && count > 0 && this.bet_flag;
    }
  },
  watch: {
    /**
     * @description: 监控当前投注项列表(vx_get_virtual_bet_list中存放的是投注项的id)
     * @param {Array} new_ 当前数组中的内容
     * @return {undefined} undefined
     */
    vx_get_virtual_bet_list(new_) {
      let has_serial = true; //支持串关
      for(let key in this.vx_get_virtual_bet_obj) {
        if(new_) {
          if(!new_.includes(key)) {
            this.vx_virtual_bet_obj_del(key);
          }
          if($menu.menu_data.is_esports) {
            let serial_type = _.get(this.vx_get_virtual_bet_obj, `${key}.cs.serial_type`);
            if(has_serial && new_.length>1 &&serial_type==0) {
              has_serial = false;
            }
          }
        }
      }
      if(new_ && new_.length>0) {
        if(new_.length<3) {
          this.is_expend = false;
        } else {
          this.is_expend = true;
        }
        this.get_mix_data(() => {
          if(!$menu.menu_data.is_esports || ($menu.menu_data.is_esports && !has_serial)) {
            this.show_valid_btn = false;
          }
          this.reset_serial();
          let delay = this.error_mapping.ERROR_CODE_DELAY[this.view_ctr_obj.error_code];
          if(delay) {
            this.virtual_common.delay_reset_message(this, delay,()=>{
              if(this.view_ctr_obj.timer_) {
                clearTimeout(this.view_ctr_obj.timer_);
                this.view_ctr_obj.timer_ = undefined;
              }
            });
          }
        });
      } else {
        this.vx_set_virtual_bet_s_list([]);
        // 当删除完数据时
        clearTimeout(this.view_ctr_obj.timer_);
        // 返回体育项目
        this.go_back_project();
      }
      // 投注模式默认为未知
      this.vx_set_virtual_bet_mode(-1);
      // 设置投注项为可选
      this.vx_set_bet_item_lock(false);
      this.vx_set_is_virtual_handle(false);
    },
    /**
     * @description: 监控当前输入框列表
     * @param {Array} new_ 当前数组中的内容
     * @return {undefined} undefined
     */
    vx_get_virtual_bet_s_list: {
      handler(new_) {
        if(this.vx_get_virtual_bet_list==1) return;
        for (let key in this.vx_get_virtual_bet_s_obj) {
          if(!["0400477","0400478"].includes(this.view_ctr_obj.error_code)) {
            // 触发清除串关输入框金额
            this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_CLEAR_HANDLE_CMD);
          }
          if(new_.length>0 && !new_.includes(key)) {
            this.vx_virtual_bet_obj_del(key);
          }
        }
        //获取最大最小值接口
        this.set_min_max_money();
        this.view_ctr_obj.bet_order_status = 1;
        this.vx_set_is_virtual_handle(false);
        this.view_ctr_obj.is_empty_money = true;
        this.view_ctr_obj.mix_range_money = 0;

        let virtual_bet_obj = _.cloneDeep(this.vx_get_virtual_bet_obj);
        for(let key in virtual_bet_obj) {
          if(virtual_bet_obj[key] &&
            virtual_bet_obj[key].cs &&
            virtual_bet_obj[key].cs.handle_time) {
            delete virtual_bet_obj[key].cs.handle_time;
          }
        }
        this.vx_virtual_bet_obj_add(virtual_bet_obj);
      }
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
          clearTimeout(this.timer_obj['range_money']);
          this.yabo_common.reset_message_info(this);
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
      if([3, 4].includes(new_)) {
        if(this.vx_get_virtual_bet_mode == 1){
          this.view_ctr_obj.bet_order_status = 4;
          this.vx_set_virtual_bet_mode(-1);
        } else {
          this.view_ctr_obj.bet_order_status = 3;
        }
      }
      if([2,3,4].includes(new_)) {
        this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);

        let find_hot = false,bet_obj, mids = [];
        for(let i=0;i<this.view_ctr_obj.order_detail_data.length;i++) {
          let it = this.view_ctr_obj.order_detail_data[i];
          let oid = it.playOptionsId;
          bet_obj = this.virtual_common.get_bet_obj(this, oid);
          let source = _.get(bet_obj, 'cs.source');
          let mid =  _.get(bet_obj, 'cs.match_id');
          mids.push(mid);
          // 投注成功则收藏热门
          if(it.orderStatusCode==1 && source && source=='hot') {
            find_hot = true;
            break;
          }
        }
        // 收藏投注赛事
        // this.$root.$emit(this.emit_cmd.EMIT_MX_COLLECT_COUNT_CMD, {type:"bet", mids});
        // if(find_hot) {
        //   this.$root.$emit(this.emit_cmd.EMIT_HOT_COLLECT);
        // }
      }
      // 投注项锁住不让点击
      if(this.vx_get_virtual_bet_mode ===1 && new_===1) {
        this.vx_set_bet_item_lock(true);
      } else {
        this.vx_set_bet_item_lock(false);
        this.vx_set_is_virtual_handle(false);
      }
    },
    /**
     * @description: 当错误码存在时应该保证投注项可以点击
     */
    "view_ctr_obj.error_code"(new_) {
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
        if(new_!="M400014") {
          this.show_valid_btn = false;
        }
        if(this.valid_error_codes.includes(new_)) {
          this.show_valid_btn = true;
        }
      }
      this.vx_set_virtual_error_info(obj);
    }
  },
  methods: {
    ...mapActions({
      vx_set_virtual_bet_list: "set_virtual_bet_list",
      vx_set_virtual_bet_s_list: "set_virtual_bet_s_list",
      vx_set_virtual_bet_s_obj: "set_virtual_bet_s_obj",
      vx_virtual_bet_s_obj_del: "virtual_bet_s_obj_del",
      vx_virtual_bet_obj_add: "virtual_bet_obj_add",
      vx_virtual_bet_obj_del: "virtual_bet_obj_del",
      vx_set_layout_left_show: "set_layout_left_show",
      vx_set_is_virtual_handle: "set_is_virtual_handle",
      vx_virtual_bet_s_obj_upd_cs:"virtual_bet_s_obj_upd_cs",
      vx_virtual_bet_s_obj_add: "virtual_bet_s_obj_add",
      vx_virtual_bet_s_obj_del: "virtual_bet_s_obj_del",
      vx_set_virtual_bet_mode: "set_virtual_bet_mode",
      vx_set_virtual_error_info: "set_virtual_error_info",
      vx_virtual_bet_clear: "virtual_bet_clear",
      // 设置是否为当
      vx_set_is_bet_single: 'set_is_bet_single',
      vx_set_user_bet_prefer: 'set_user_bet_prefer',
      vx_set_is_virtual_bet: "set_is_virtual_bet",
    }),
   /**
     * @description: 设置最大最小值
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    set_min_max_money() {
      if (!(this.vx_get_virtual_bet_s_list && this.vx_get_virtual_bet_s_list.length)) {
        return;
      }
      try {
        let minBet = '1';
        let orderMaxPay = '2000';
        clearTimeout(this.timer_obj['min_max_timer']);
        this.timer_obj['min_max_timer'] = setTimeout(() => {
          for(let i=0;i<this.vx_get_virtual_bet_s_list.length;i++) {
            let type = this.vx_get_virtual_bet_s_list[i];
            let obj = {minBet, orderMaxPay, type};
            this.vx_virtual_bet_s_obj_upd_cs(obj);
            this.set_bet_max_input(obj);
          }
          this.bet_reset_money_msg();
          this.$root.$emit(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD);
        }, 5 * 1000);
        let last_obj = _.last(this.vx_get_virtual_bet_s_list);
        this.get_virtual_min_max_money(this.vx_get_virtual_bet_list, last_obj, (code, data) => {
          clearTimeout(this.timer_obj['min_max_timer']);
          if (code == 200 && data && Array.isArray(data)) {
            if (this.vx_get_virtual_bet_s_list && this.vx_get_virtual_bet_s_list[0]) {
              //console.log(`============set_min_max_money========${JSON.stringify(data)}`);
              data.forEach((item) => {
                let orderMaxPay = this.round_money(item.minBet, item.orderMaxPay);
                if(parseFloat(orderMaxPay)>parseFloat(item.minBet)) {
                  item.orderMaxPay = orderMaxPay;
                }
                this.vx_virtual_bet_s_obj_upd_cs(item);
                this.set_bet_max_input(item);
              });
            }
          }
          else {
            // 设置所有的限额
            this.set_all_money();
          }
          // 重置获取金额后的标记以及消息提示信息
          this.bet_reset_money_msg();
          // 检测金额是否都为空
          let all_empty_money = true;
          for(let obj of Object.values(this.vx_get_virtual_bet_s_obj)) {
            let money = _.get(obj, 'cs.money');
            // 如果金额存在
            if(money) {
              // 设置所有金额为空的标识为false
              all_empty_money = false;
              break;
            }
          }
          if(!all_empty_money && this.view_ctr_obj.error_code!='0400517') {
            // 串关的校验金额
            this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD);
          }
          // 设置键盘状态
          this.$root.$emit(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD);
          this.$nextTick(()=>{
            if (this.view_ctr_obj.error_code=='0400517') {
              this.view_ctr_obj.mix_range_money=-4;
            }
          });
        });
      } catch (e) {
        console.error(e)
        // 设置所有的限额
        this.set_all_money();
        // 重置获取金额后的标记以及消息提示信息
        this.bet_reset_money_msg();
      }
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
     * @description: 返回体育项目
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    go_back_project() {
      // 设置左侧为菜单显示
      this.vx_set_layout_left_show("menu");
      // 设置虚拟体育处理状态为初始状态
      this.vx_set_is_virtual_handle(false);
    },
    /**
     * @description: 移除所有下注项功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    cancel_handle() {
      // 调用初始化试图方法
      this.init_view();
      // 返回项目(菜单列表)
      this.go_back_project();
      // 清除所有选择的虚拟体育投注项
      this.vx_virtual_bet_clear();
    },
    /**
     * @description: 保留这些选项按钮功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    save_bet_items() {
      // 点击保留这些选项，返回投注栏保留投注成功的选项
      this.init_view();
      // 串关数据初始化
      this.get_mix_data();
      // 设置虚拟投注模式
      this.vx_set_virtual_bet_mode(-1);
      // 虚拟体育处理状态为未处理(处理完毕)
      this.vx_set_is_virtual_handle(false);
      // 获取虚拟体育投注项对象
      let virtual_bet_obj = _.cloneDeep(this.vx_get_virtual_bet_obj);
      // 移除虚拟体育处理时间字段
      for(let key in virtual_bet_obj) {
        if(virtual_bet_obj[key] &&
          virtual_bet_obj[key].cs &&
          virtual_bet_obj[key].cs.handle_time) {
          delete virtual_bet_obj[key].cs.handle_time;
        }
      }
      // 将处理后的数据更新到vuex中
      this.vx_virtual_bet_obj_add(virtual_bet_obj);
    },
    /**
     * @description: 获取串关数据
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_mix_data(callback) {
      if (this.view_ctr_obj.is_effect) {
        // 虚拟体育投注项部分对象移除
        for(let i=0;i<this.vx_get_virtual_bet_s_list.length;i++) {
          let id  = this.vx_get_virtual_bet_s_list[i];
          this.vx_virtual_bet_s_obj_del(id);
        }
        this.vx_set_virtual_bet_s_list([]);
        let type = "";
        // 电竞串关数量接口最多支持5串，当大于五串时不显示(6串57，7串120，8串247，9串502，10串1013)
        if($menu.menu_data.is_esports) {
          type = "getEsportsSeriesCountNumbe";
        } else {
          // 虚拟体育串关数量接口
          type = "getVirtualSeriesCountNumbe";
        }
        // 调用串关接口统计串关数量
        this[type]((code, data) => {
          if (code == 200) {
            // 虚拟体育投注项部分数据清除
            this.vx_set_virtual_bet_s_obj({});
            //this.series_order_data = data;
            // 获取虚拟体育投注项列表id
            let virtual_bet_s_list = _.map(data, 'id');
            // 设置虚拟体育投注项列表数据
            this.vx_set_virtual_bet_s_list(virtual_bet_s_list);
            _.forEach(data, item => {
              // 获取服务器上的数据
              let bs_obj = { bs: { ...item } };
              // 扩展一个key字段并赋值
              bs_obj.key = `${item.id}`;
              // 扩展cs客户端对象，并对对象进行初始化赋值
              bs_obj.cs = {
                ...item,
                odds_value: "",
                money: "", // 投注额
                win_money: "", // 可赢额
                min_money: "", // 最低限额
                max_money: "" // 最高可投
              }
              // 添加虚拟体育投注项对象到vuex中
              this.vx_virtual_bet_s_obj_add(bs_obj);
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
        cur_keyboard_index: -1, // 当前键盘的索引
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
        order_confirm_complete: 0, //0.默认值还没开始确认注单 1.注单确认中 2.所有注单已经确认完成 且全部成功 3.所有注单已经确认完成 且全部失败 4.所有注单已经确认完成 部分成功部分失败
        is_empty_money: true, // 金额是否为空
        error_code: "", // 错误码
        error_message: "", // 错误消息
        is_submit_result: false, // 是否提交标志
        is_effect: true, //供串关是使用
        mix_range_money: 0, // 串关金额范围
        timer: undefined,
        input_max_flag: 0, // 输入最大金额标志
        show_valid_btn:false // 是否显示失效按钮
      };
      // 总投注数
      this.bet_total_count = 0.00;
      // 总投注额
      this.bet_total_money = 0.00;
      // 预计总收益
      this.bet_total_win_money = 0.00;
      // 虚拟体育投注模式初始化赋值
      this.vx_set_virtual_bet_mode(-1);
    },
    /**
     * @description: 提交按钮功能
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    submit_handle(handle_type) {
      let index = _.findIndex(this.vx_get_virtual_bet_list, (item) => {
        // 赛事级盘口状态
        let mhs = _.get(this.vx_get_virtual_bet_obj,`${item}.cs.match_status`, 0) * 1;
        // 盘口状态
        let hs = _.get(this.vx_get_virtual_bet_obj,`${item}.cs.handicap_status`, 0) * 1;
        // 投注项状态
        let active = _.get(this.vx_get_virtual_bet_obj,`${item}.cs.active`, 1) * 1;
        // 串关类型
        let serial_type = _.get(this.vx_get_virtual_bet_obj,`${item}.cs.serial_type`, 1) * 1;
        return [1,2].includes(mhs) || [1,2].includes(hs) || [2,3].includes(active) || serial_type !== 1;
      });
      if(index>-1) {
        // 值情况code不清空记录，时为了保持提示不变，只变化按钮
        this.show_valid_btn = true;
        // 设置订单状态 为投注状态
        this.view_ctr_obj.bet_order_status = 1;
        return;
      }
      if(this.show_fail_alert()) {
        return;
      }
      let user = this.vx_get_user;
      if(user.balance==0 || this.check_balance(user.balance)) {
        this.set_message('0400454');
        return;
      }
      if(this.vx_get_is_virtual_handle) return;
      // 串关所有的金额都是空的时候或者金额不在限额范围内，或者不能够串关则按钮为灰色不能够提交
      if(!_.isEmpty(this.view_ctr_obj.valid_money_obj) ||
        ["M400005","M400012","0400477","0400478"].includes(this.view_ctr_obj.error_code)){
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
        // 获取总的最高可赢额
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
        // this.vx_set_is_virtual_handle(false);
        return;
      }
      if(handle_type=='accept' && !this.has_disable_item) {
        this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_ITEM_RESET_CMD);
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
        // 恢复校验
        this.virtual_common.init_message(this);
      }
      if(handle_type=='submit') {
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
        // 恢复校验
        this.virtual_common.init_message(this);
      }
      // 校验金额
      if (![-4,0].includes(this.check_money(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD))) {
        // 校验串关金额
        if(this.view_ctr_obj.error_code) {
          this.set_message(this.view_ctr_obj.error_code,handle_type);//请您输入投注金额
        }
        // this.vx_set_is_virtual_handle(false);
        return;
      } else if (this.check_active()) {
        //校验投注项状态
        this.view_ctr_obj.bet_order_status = 1;
        this.set_message('M400004');//赔率更新中!
        // this.vx_set_is_virtual_handle(false);
        return;
      }
      // 如果为前端自定义错误码则不再进行处理
      if (this.view_ctr_obj.error_code && this.view_ctr_obj.error_code.startsWith("M")) {
        // 设置为可以投注
        this.view_ctr_obj.bet_order_status = 1;
        this.code_exist = true;
        // this.vx_set_is_virtual_handle(false);
        return false;
      }

      if(this.has_disable_item) {
        return;
      }
      this.show_valid_btn = false;
      // 设置投注状态为处理中
      this.view_ctr_obj.bet_order_status = 2;
      // 投注数据未发生变化
      this.view_ctr_obj.bet_data_change = false;
      // 设置投注状态为处理中
      this.view_ctr_obj.bet_order_status = 2;
      // this.vx_set_is_virtual_handle(true);
      // 打开遮罩
      this.$root.$emit(this.emit_cmd.EMIT_OPEN_MENU_LOADDING_CMD);
      // 设置为可投注状态
      this.view_ctr_obj.bet_order_status = 1;
      // 设置提交结果为为提交
      this.view_ctr_obj.is_submit_result = false;
      // 描述：断网25秒的处理办法
      if (this.timer_obj['time_over']) clearTimeout(this.timer_obj['time_over']);
      this.timer_obj['time_over'] = setTimeout(() => {
        if (this.code_exist) return;
        // 投注项校验为通过
        this.view_ctr_obj.bet_order_status = 5;
        // 回复默认的虚拟体育处理状态
        this.vx_set_is_virtual_handle(false);
        // 解锁投注项
        this.vx_set_bet_item_lock(false);
        // 投注项模式设置为默认
        this.vx_set_virtual_bet_mode(-1);
        // 关闭遮罩
        this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
        this.set_message('0400483');//网络异常，请在投注单中查看投注结果
        clearTimeout(this.timer_obj['time_over']);
      }, 1000 * 25); // 原本30s Aden要求修改为22s
      this.virtual_bet_submit_data(2, (code, data, msg) => {
        if (code) {
          this.code_exist = true;
          clearTimeout(this.timer_obj['time_over']);
        }
        // this.vx_set_is_virtual_handle(false);
        if (code == 200) {
          this.virtual_common.init_message(this);
          //提交成功
          this.order_no = data.orderDetailRespList[0].orderNo;
          // 设置投注状态为成功
          this.view_ctr_obj.bet_order_status = 3;
          // 订单数据设置
          this.view_ctr_obj.order_detail_data = data.orderDetailRespList;
          // 串关数据设置
          this.view_ctr_obj.series_order_data = data.seriesOrderRespList;

          let bet_obj;
          _.forEach(data.orderDetailRespList,item=>{
            bet_obj = _.cloneDeep(this.virtual_common.get_bet_obj(this, item.playOptionsId));
            // 设置订单处理时间
            if(bet_obj && bet_obj.cs) {
              bet_obj.cs.handle_time = new Date().getTime();
            }
            // 更新对应的投注对象
            this.virtual_common.set_bet_obj_value(this, bet_obj);
          });
          let lock = data.lock? data.lock: 0; // 如果没有返回，给默认老的投注流程
          // 虚拟体育投注模式设置
          this.vx_set_virtual_bet_mode(lock);
          let success_count = 0; // 注单提交成功的个数
          let confirm_count = 0; // 注单确认中的个数
          let fail_count = 0; // 注单失败的个数
          _.forEach(data.seriesOrderRespList, item=>{
            // 订单失败
            if(item.orderStatusCode==0) {
              // 失败的订单数量统计
              fail_count++;
            } else if(item.orderStatusCode==1) { // 订单处理成功
              // 成功的订单数量统计
              success_count++;
            } else if(item.orderStatusCode==2) { // 订单确认中
              // 确认中的订单数量统计
              confirm_count++;
            }
          });
          // 确认中的
          if(confirm_count>0) {
            this.view_ctr_obj.order_confirm_complete = 1;
          }
          if(success_count>0 && success_count==data.seriesOrderRespList.length) {
            // 全部成功
            if(success_count==data.seriesOrderRespList.length) {
              this.view_ctr_obj.order_confirm_complete = 2;
            }
          }
          // 全部失败
          if(fail_count==data.seriesOrderRespList.length) {
            this.view_ctr_obj.order_confirm_complete = 3;
          }
          // 有成功有失败的
          if(fail_count>0 && success_count>0) {
            this.view_ctr_obj.order_confirm_complete = 4
          }
          if (this.view_ctr_obj.order_confirm_complete == 1) {
            // 定时拉去接口
            this.get_timed_task();
          }
          // 解锁投注项(解锁后可以点击)
          this.vx_set_bet_item_lock(false);
          // 关闭遮罩
          this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
        } else {
          // this.vx_set_is_virtual_handle(false);
          // 投注失败还原默认的模式
          this.vx_set_virtual_bet_mode(-1);
          // 解锁投注项(解锁后可以点击)
          this.vx_set_bet_item_lock(false);
          // 关闭遮罩
          this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
          // 投注失败
          this.view_ctr_obj.bet_order_status = 4;
          // 提交结果标识
          this.view_ctr_obj.is_submit_result = true;
          // 串关错误数据设置
          this.series_error_data = data;
          if(code=='111111') {
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
        for(let i = 0;i<data.length;i++) {
          let oid =  _.get(data, `[${i}].data.playOptionsId`);
          let mix_code = _.get(data, `[${i}].code`);
          // 投注项id存在且错误码为关盘的错误码或者赔率变化的错误码
          if(oid && (this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(mix_code) ||
            this.error_mapping.ERROR_CODE_ODDS_CHANGE.includes(mix_code))) {
            // 根据投注项id获取投注项对象
            let bet_obj = this.virtual_common.get_bet_obj(this, oid);
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
                  this.vx_virtual_bet_obj_add(obj);
                  this.id = bet_obj.id;
                  // 模拟发送C105 同步列表和详情中对应的投注项数据
                  // this.virtual_common.update_odds_info(this);
                } else if (this.error_mapping.ERROR_CODE_ODDS_CHANGE.includes(mix_code)) {
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
                  this.vx_virtual_bet_obj_add(obj);
                  this.id = bet_obj.id;
                  // 模拟发送C105 同步列表和详情中对应的投注项数据
                  // this.virtual_common.update_odds_info(this);
                }
              }
            }
          }
        }
        // 如果code码不在关盘错误码与赔率变化的错误码列表中存在
        if(![...this.error_mapping.ERROR_CODE_ODDS_CLOSE,
            ...this.error_mapping.ERROR_CODE_ODDS_CHANGE].includes(code)) {
          if (code=='0400475') {
            // 最高可投与用户的投注金额都变成最新的最高可投
            this.set_min_max_money();
          }
        }
        // 设置错误提示信息
        this.set_message(code, handle_type);
      } else {
        if(code=='0400517') {
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
        this.reset_bet_mix();
        this.cancel_handle();
        return;
      }
      if(this.error_mapping.ERROR_CODE_CONFIRM_BTN.includes(this.view_ctr_obj.error_code)) { // 非用户类错误
        //0402018 ,0400450 返回结果data为null 直接删除
        if(this.series_error_data &&  this.series_error_data.length>0) {
          for(let i=0;i<this.series_error_data.length;i++) {
            // 投注项id
            let oid =  _.get(this.series_error_data, `[${i}].data.playOptionsId`);
            // 串关投注失败的code码
            let mix_code = _.get(this.series_error_data, `[${i}].code`);
            // 根据oid获取投vuex中投注项的id
            let id = this.virtual_common.get_id(this,oid);
            // 投注项在虚拟体育列表中的位置
            let index = _.findIndex(this.vx_get_virtual_bet_list, item=>item==id);
            // 串关错误码是否在确认按钮错误码列表中 并且在投注项列表中存在
            if(this.error_mapping.ERROR_CODE_CONFIRM_BTN.includes(mix_code) && index>-1) {
              // 移除投注项对象中对应的投注项
              this.vx_virtual_bet_obj_del(id);
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
        // 锁盘状态
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
        // 根据赛事盘口状态 盘口状态 投注项状态获取投注项需要显示的状态
        active_ = this.get_odds_active(match_status, handicap_status, active);
        // 如果是封盘或者关盘
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
      let bet_list = _.filter(this.vx_get_virtual_bet_s_list, (item) => {
        let res = this.vx_get_virtual_bet_s_obj && this.vx_get_virtual_bet_s_obj[item];
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
      if (this.vx_get_virtual_bet_s_list.length == 0) {
        this.bet_total_money = total_money;
        return;
      }
      //串关计算
      _.forEach(this.vx_get_virtual_bet_s_list, item => {
        let res = this.vx_get_virtual_bet_s_obj && this.vx_get_virtual_bet_s_obj[item];
        if (res && res.cs && res.cs.money !== null && res.cs.money !== "") {
          // 投注额的计算 += 虚拟体育中投注项上的金额 * 投注项上的数量
          total_money = total_money + parseFloat(this.vx_get_virtual_bet_s_obj[item].cs.money) * this.vx_get_virtual_bet_s_obj[item].cs.count;
        }
      });
      this.bet_total_money = total_money;
    },
    /**
     * @description: 预计总收益
     * @param {undefined} undefined
     * @return {Number}
     */
    get_bet_total_win_money() {
      this.bet_total_win_money = 0.00;
      if (this.vx_get_virtual_bet_s_list.length == 0) {
        return 0.00;
      }
      let total_win_money = 0;
      //串关计算
      _.forEach(this.vx_get_virtual_bet_s_list, item => {
        let res =  _.get(this.vx_get_virtual_bet_s_obj, `${item}`);
        if (res && res.cs && res.cs.win_money !== "") {
          // 总收益 += 可赢额
          total_win_money = total_win_money + parseFloat(res.cs.win_money);
        }
      });
      // 预计总收益
      this.bet_total_win_money = total_win_money;
    },
    /**
     * @description: 设置提示消息
     * @param {String} code 错误码
     * @param {String} handle_type 提交的类型 accept: 接受变化, submit: 投注
     * @return {undefined} undefined
     */
    set_message(code, handle_type) {
      // 错误码不存在 或者 错误码存在但是错误码为前端自定义错误码(以M开头的错误码) 或者虚拟体育已经处理完成按钮为接受变化 都不进行处理
      if (!code ||
        (code && !code.toString().startsWith("M")) &&
        !this.vx_get_is_virtual_handle && handle_type=='accept') {
        return;
      }
      // 如果是失效的投注项并且是关盘的错误码则不处理
      if(this.has_disable_item && !this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(code)) {
        return;
      }
      // 重新初始化错误信息
      this.virtual_common.init_message(this);
      let msg = this.$root.$t(`error_msg_info.${code}`);
      // 若msg为空则显示投注失败处理
      if (msg == `error_msg_info.${code}`) {
        // 异常码无对应的消息是显示默认的提示
        msg = this.$root.$t('error_msg_info.XXXXXX');
        code = 'XXXXXX';
      }
      // 设置错误码
      this.view_ctr_obj.error_code = code;
      if(code=='0400538') {
        this.view_ctr_obj.error_message = msg.client_msg2.replace('%s', this.vx_get_mix_min_count);
      } else if(code=='0400539') {
        this.view_ctr_obj.error_message = msg.client_msg2.replace('%s', this.vx_get_mix_max_count);
      } else {
        // 设置错误信息
        this.view_ctr_obj.error_message = msg.client_msg2;
      }
      // 获取错误码需要提示的时长
      let delay = this.error_mapping.ERROR_CODE_DELAY[code];
      //console.log(`===============111111111111111111111111=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
      if (delay) {
        clearTimeout(this.timer_obj['message']);
        this.timer_obj['message'] = setTimeout(() =>{
          this.view_ctr_obj.is_submit_result = false;
          //console.log(`===============2222222222222222222=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
          // 重新初始化错误信息
          this.virtual_common.init_message(this);
          clearTimeout(this.timer_obj['message']);
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
      if(this.vx_get_virtual_bet_list.length<3) {
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
      if (this.vx_get_virtual_bet_s_obj) {
        for (let key in this.vx_get_virtual_bet_s_obj) {
          let bet_s_obj = this.vx_get_virtual_bet_s_obj && this.vx_get_virtual_bet_s_obj[key];
          if (bet_s_obj) {
            let obj = _.cloneDeep(bet_s_obj);
            obj.key = key;
            // 满额投注为false
            obj.cs.full_bet = 0;
            // 最小值
            obj.cs.min_money = min_money;
            // 最大值
            obj.cs.max_money = max_money;
            // 虚拟体育投注项对象设置
            this.vx_virtual_bet_s_obj_add(obj);
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
      // this.vx_set_is_virtual_handle(false);
      // 投注失败还原默认的模式
      this.vx_set_virtual_bet_mode(-1);
      // 关闭遮罩
      this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
    },
    /**
     * @description: 重置获取金额后的标记以及消息提示信息
     * @param {*}
     * @return {*}
     */
    bet_reset_money_msg() {
      clearTimeout(this.timer_obj['min_max_timer']);
      this.view_ctr_obj.mix_range_money = 0;
      this.view_ctr_obj.input_max_flag = 2;
      // 大于最大金额,小于最小金额,金额为空,最大最小值正在获取中的code码
      if(["M400011","M400010","M400005","M400012"].includes(this.view_ctr_obj.error_code)) {
        // 重新初始化错误信息
        this.virtual_common.init_message(this);
      }
    },
    /**
     * @description: 检查串关并回复默认串关标志
     */
    reset_serial() {
      // 检测是否可以进行串关 matches有值则表示不能够串关，返回的不能串关的赛事id数组
      let matches = this.virtual_common.check_mix(this);
      // 如果都可以串关，且之前的错误提示为不能够串关，则复位错误信息以及错误码
      if(matches.length==0 && ["0400477","0400478"].includes(this.view_ctr_obj.error_code)) {
        this.virtual_common.reset_message_info(this);
      } else if(matches.length>0){
        // 设置不可串关的错误码
        this.view_ctr_obj.error_code = "0400477";
      }
      _.forEach(this.vx_get_virtual_bet_list, item => {
        let obj = _.cloneDeep(this.vx_get_virtual_bet_list[item]);
        let cs = _.get(obj, 'cs', {});
        // 恢复是否可以串关的标志
        if(cs && matches.length==0) {
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
        this.virtual_common.set_bet_obj_value(this, obj);
      });
    },
    /**
     * @description: 定时任务
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_timed_task() {
      //console.log('=================================get_timed_task');
      if(this.view_ctr_obj.order_confirm_complete==1) {
        this.view_ctr_obj.timer_ = setTimeout(() => {
          //console.log('======================before call get_order_result');
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.get_order_result();
        }, 5 * 1000); // 30s拉取接口改为5S
      }
    },
    /**
     * @description: 获取订单结果
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_order_result() {
      //console.log('=================================get_order_result========interval_time:'+this.interval_time());
      if(this.interval_time()) return;
      let orderNos = [];
      // 调用接口获取订单的最新数据
      _.forEach(this.view_ctr_obj.series_order_data, item => {
        if((item.orderStatusCode==2)&&!orderNos.includes(item.orderNo)) {
          orderNos.push(item.orderNo);
        }
      });

      if(orderNos.length>0) {
        orderNos = orderNos.join(',');
        api_betting.query_order_status({orderNos}).then(res=>{
          // 状态码
          let code = _.get(res, "data.code");
          // 返回的处理数据
          let data = _.get(res, "data.data");
          // 处理时间
          let handle_time = _.get(res, 'data.ts');
          let status;
          //console.log(`=====================================${JSON.stringify(data)}`);
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          if(code==200 && data && data.length) {
            _.forEach(data, item => {
              // 订单状态转换
              status = this.change_status(item.status);
              // 串关订单列表中ws所在的位置
              let series_index = _.findIndex(this.view_ctr_obj.series_order_data, item2=>item.orderNo==item2.orderNo);
              if(series_index>-1) {
                // 如果C201和接口拉取都同时进行,则优先最晚的执行
                if(this.view_ctr_obj.series_order_data[series_index].handle_time && this.view_ctr_obj.series_order_data[series_index].handle_time>handle_time) {
                  return;
                }
                // 对应订单状态以及处理时间设置
                Object.assign(this.view_ctr_obj.series_order_data[series_index], {orderStatusCode: status, handle_time});
                if(item.oddsChangeList && item.oddsChangeList.length) {
                  Object.assign(this.view_ctr_obj.series_order_data[series_index], {maxWinMoney: parseFloat(item.newMaxWinAmount).toFixed(2)});
                  _.forEach(item.oddsChangeList, item2=> {
                      if(item2) {
                        _.forEach(this.view_ctr_obj.order_detail_data, (detail_item, detail_index)=> {
                          if(item2.playOptionsId == detail_item.playOptionsId) {
                            // 赔率数据合并
                            Object.assign(this.view_ctr_obj.order_detail_data[detail_index], {oddsValues: item2.usedOdds});
                            /* // 赔率投注栏同步
                            let bet_mix_obj = _.cloneDeep(this.virtual_common.get_bet_obj(this, item2.playOptionsId));
                            // 客户端对象赔率设置
                            bet_mix_obj.cs.odds_value = item2.usedOdds;
                            // 服务器对对象赔率设置
                            bet_mix_obj.bs.hps[0].hl[0].ol[0].ov = item2.usedOdds;
                            // 投注项对象设置
                            this.virtual_common.set_bet_obj_value(this, bet_mix_obj); */
                          }
                        });
                      }
                  });
                }
              }
            });
          }
          let success_count = 0; // 注单提交成功的个数
          let confirm_count = 0; // 注单确认中的个数
          let fail_count = 0; // 注单失败的个数
          _.forEach(this.view_ctr_obj.series_order_data, item=>{
            // 订单状态失败
            if(item.orderStatusCode==0) {
              // 失败订单数量统计
              fail_count++;
            } else if(item.orderStatusCode==1) { // 成功的订单
              // 投注成功的订单数量统计
              success_count++;
            } else if(item.orderStatusCode==2) { // 订单确认中
              // 确认中的订单数量统计
              confirm_count++;
            }
          });
          // 全部成功
          if(success_count==this.view_ctr_obj.series_order_data.length) {
            this.view_ctr_obj.order_confirm_complete = 2;
          }
          // 全部失败
          if(fail_count==this.view_ctr_obj.series_order_data.length) {
            this.view_ctr_obj.order_confirm_complete = 3;
          }
          // 确认中的
          if(confirm_count>0) {
            this.view_ctr_obj.order_confirm_complete = 1;
          }
          // 有成功有失败的
          if(fail_count>0 && success_count>0 && ((fail_count+success_count)==this.view_ctr_obj.series_order_data.length)) {
            this.view_ctr_obj.order_confirm_complete = 4
          }
          if(confirm_count==0 && [2,3,4].includes(this.view_ctr_obj.order_confirm_complete)) { // 如果没有待确认的订单，则需要拉去一次接口
            this.call_final();
          }
          // 需要判断是否继续轮询
          if (this.interval_time()) return;
          if (this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.view_ctr_obj.timer_ = setTimeout(() => {
            this.get_order_result();
          }, 2 * 1000); // 5s 改为 2s
        }).catch((err)=>{
          console.error(err)
          console.log("获取订单状态和最新赔率最高可盈接口调用异常");
          if (this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.view_ctr_obj.timer_ = setTimeout(() => {
            this.get_order_result();
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
      let index = _.findIndex(this.view_ctr_obj.series_order_data, item=>item.orderStatusCode==2);
      if(index==-1) {
        clearTimeout(this.view_ctr_obj.timer_);
        this.view_ctr_obj.timer_ = undefined;
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
      switch(status) {
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
     * 设置最高可以输入
     * @param {*} item
     */
    set_bet_max_input(item){
      // 获取用户信息
      let user = this.vx_get_user;
      // 获取账户金额
      let balance = parseFloat(user.balance) || 0.00;
      let input_max = null;
      // 最高限额存在
      if(item.orderMaxPay) {
        if(this.vx_get_virtual_bet_s_list.length==1) {
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
      this.$root.$emit(this.emit_cmd.EMIT_BET_MIX_INPUT_MAX_MONEY, {type: item.type, value: input_max});
    },
    keyup_handle(event) {
      if(event.stopPropagation)
      {
        event.stopPropagation();
      }
      if(this.vx_get_is_virtual_handle) {
        // 设置左侧为投注列表
        this.vx_set_layout_left_show("bet_list");
      }
      if(this.vx_get_is_virtual_handle || this.bet_loadding) return false;
      // 按enter按键
      if(this.bet_complete_show &&
        event.keyCode==13 &&
        !this.bet_loadding) {
        // 触发完成方法
        this.complete_handle();
      } else if(event.keyCode==13) { // enter键按下时
        // 触发提交方法
        this.submit_handle();
      }
      // 按esc按键
      else if(event.keyCode==27) {
        // 触发取消投注方法
        this.cancel_handle();
      }
    },
    /**
     * @description: 取整
     * @param{String} min_money 最低限额(整数)
     * @param{String} max_money 最高小值(非整数)
     * @return{String}
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
      if(max_len==min_len) {
        min_len = min_len - 1;
      }
      max_integral = max_integral.substr(0, max_len - min_len);
      max_money = _.padEnd(max_integral,(max_integral.length + min_len),'0');
      return max_money;
    },
    /**
     * 移除无效的投注项
     */
    remove_invalid_item() {
      // 移除无效的虚拟体育投注盘口
      this.remove_virtual_handicap();
    },
    /**
     * 切换用户喜好设置
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
     * 检测是否够投注金额
     * @param {*} balance
     * @returns
     */
    check_balance(balance) {
      let total_money = 0;
      for(let obj of Object.values(this.vx_get_virtual_bet_s_obj)) {
        let { cs } = obj;
        if(cs.money) {
          total_money += parseFloat(cs.money);
        }
      }
      return balance < total_money;
    }
  },
  mounted() {
    this.get_mix_data(()=>{
      if($menu.menu_data.is_esports) {
        let has_serial = true; //支持串关
        let count = _.get(this.vx_get_virtual_bet_list, 'length', 0);
        for(let key in this.vx_get_virtual_bet_obj) {
          // 获取串关类型
          let serial_type = _.get(this.vx_get_virtual_bet_obj, `${key}.cs.serial_type`);
          // 默认标识为支持串关且串关数量大于1 串关类型为不支持串关则设置是否支持串关标志位false(不支持串关)
          if(has_serial && count.length>1 &&serial_type==0) {
            has_serial = false;
            break;
          }
        }
        // 不支持串关
        if(!has_serial) {
          this.view_ctr_obj.error_code = "M400014";
          this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg2;
        }
      } else {
        if(this.vx_get_virtual_bet_list.length>1) {
          // 重置串关投注数据并检查串关规则
          this.reset_serial();
          // 错误码存在则设置错误信息
          if(this.view_ctr_obj.error_code) {
            // 设置错误信息
            this.set_message(this.view_ctr_obj.error_code);
          }
        }
      }
      this.$nextTick(()=>{
        // 无效投注项统计
        let count = this.virtual_common.get_deactive_count(this);
        // 如果存在无效项需要提示
        if(count>0 && _.isEmpty(this.view_ctr_obj.error_code)) {
          this.view_ctr_obj.error_code = "0402049";
          //投注项违反比分检查规则,禁止投注
          this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.0402049.client_msg2`);
        }
      });
    });
  }
}
