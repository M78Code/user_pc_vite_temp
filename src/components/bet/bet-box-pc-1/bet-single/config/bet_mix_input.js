/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关金额输入部分 正常
 */
import { mapGetters, mapActions } from "vuex";
import betting from "src/public/mixins/betting/betting.js";
import odds_conversion from "src/public/mixins/odds_conversion/odds_conversion_mixin.js";
import * as bet_utils from "src/public/mixins/bet/bet_utils.js";
import BetKeyboard from "src/public/components/bet/bet_keyboard.vue";
export default {
  name: "bet-mix-input",
  mixins: [betting, odds_conversion],
  data() {
    return {
      money: null, // 输入框金额
      win_money: "", // 可赢额
      is_show_keyboard: false, // 键盘是否显示
      odds_value: 1.00, // 赔率
      // 键盘数据集合
      keyboard_data: [
        {
          text: "5",
          value: 5,
          disabled: false
        },
        {
          text: "10",
          value: 10, // 数值
          disabled: false // 禁用
        },
        {
          text: "25",
          value: 25,
          disabled: false
        },
        {
          text: "50",
          value: 50,
          disabled: false
        },
        {
          text: "100",
          value: 100,
          disabled: false
        },
        {
          text: "200",
          value: 200,
          disabled: false
        }
      ],
      input_max: null, // 可输入的最大值
      setup_mix_info: {}, // 串关设置信息
      timer_input_focus: null // 获得焦点定时器
    }
  },
  components: {
    "bet-keyboard": BetKeyboard
  },
  props: {
    id: {
      type: String,
      default: "0"
    },
    index: { //第几个
      type: Number,
      default: 0
    },
    view_ctr_obj: { //数据源
      type: Object,
      default: {
      }
    }
  },
  created() {
    //网络错误时设置默认最大最小值
    this.$root.$on(this.emit_cmd.EMIT_NET_ERR, this.net_err_fun)
    // 串关的校验金额
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD, this.check_money);
    // 触发清除串关输入框金额
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_CLEAR_HANDLE_CMD, this.bet_clear_handle);
    // 设置金额
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_SET_MONEY_CMD, this.set_money);
    // 设置输入框的最大金额
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_INPUT_MAX_MONEY, this.set_input_max);
    // 设置最小金额
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_MIN_MONEY, this.set_min_money);
    // 更新键盘按键状态
    this.$root.$on(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD,this.update_keyboard_status);
    // 若为串关的额第一个输入投注项
    if (this.index == 0) {
      // 计算第一个输入投注项显示的赔率(各个投注项赔率进行相乘)
      this.vx_get_bet_list.forEach(id => {
        this.odds_value *= this.get_odds_value(id);
      });
    }
    // 获取串关配置信息
    this.setup_mix_info = _.get(this.vx_get_user, 'cvo.series');
    // 串关配置信息存在且是一个对象
    if(!_.isEmpty(this.setup_mix_info) && _.isObject(this.setup_mix_info)) {
      // 重新获取键盘数据集合
      this.keyboard_data = this.get_keyboard_data();
    }
  },
  destroyed() {
    //清除网络错误时设置默认最大最小值
    this.$root.$off(this.emit_cmd.EMIT_NET_ERR, this.net_err_fun)
    //清除串关的校验金额
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD, this.check_money);
    // 清除触发清除串关输入框金额
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_CLEAR_HANDLE_CMD, this.bet_clear_handle);
     // 清除设置金额
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_SET_MONEY_CMD, this.set_money);
    //清除 设置输入框的最大金额
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_INPUT_MAX_MONEY, this.set_input_max);
    // 清除设置最小金额
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_MIN_MONEY, this.set_min_money);
     // 清除更新键盘按键状态
    this.$root.$off(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD,this.update_keyboard_status);
    //清除计时器
    clearTimeout(this.timer_input_focus);
    this.keyboard_data = null;
    this.setup_mix_info = {};
  },
  computed: {
    ...mapGetters({
      vx_get_user: "get_user",  // 用户信息
      vx_get_bet_list: "get_bet_list",  // 押注信息列表
      vx_get_bet_obj: "get_bet_obj",   // 押注信息对象
      vx_get_bet_s_list: "get_bet_s_list",   // 串关信息列表
      vx_get_bet_s_obj: "get_bet_s_obj",   // 串关信息对象
      vx_get_is_bet_merge: "get_is_bet_merge",  //是否合并
      vx_get_bet_current_money_obj: 'get_bet_current_money_obj',
    }),
    /**
     * @description: 获取串关赔率(欧赔)
     * @param {undefined} undefined
     * @return {Number} 赔率
     */
    get_series_odds() {
      let series_odds = 1;
      this.vx_get_bet_list.forEach(item => {
        let obj = _.get(this.vx_get_bet_obj, `${item}.cs`);
        let odds_value = (obj && obj.odds_value) || 1;
         // 此处乘以100然后除以100是为了保证精度
        series_odds = ((Math.floor(odds_value / 1000)) / 100) * series_odds;
      });
      // 此处乘以100然后除以100是为了保证精度
      return ((Math.floor(series_odds * 100)) / 100).toFixed(2);
    },
    /**
     * @description: 获取串关个数
     * @param {undefined} undefined
     * @return {String} 个数
     */
    count() {
      let count =  _.get(this.vx_get_bet_s_obj,`${this.id}.cs.count`);
      if(count) {
        return `${count}`;
      }
      return '';
    },
    /**
     * @description: 最大值
     * @param {undefined} undefined
     * @return {String}
     */
    max_money() {
      let max_money =  _.get(this.vx_get_bet_s_obj,`${this.id}.cs.max_money`);
      if(max_money) {
        return `${max_money}`;
      }
      return '';
    },
    /**
     * @description: 最小值
     * @param {undefined} undefined
     * @return {String}
     */
    min_money() {
      let min_money =  _.get(this.vx_get_bet_s_obj,`${this.id}.cs.min_money`);
      if(min_money) {
        return `${min_money}`;
      }
      return '';
    },
    /**
     * @description: 金额是否为空
     * @param {undefined} undefined
     * @return {Boolean}
     */
    is_empty_money() {
      let is_empty_money_ = this.money == null;
      // 金额为空
      this.view_ctr_obj.is_empty_money = is_empty_money_;
      return is_empty_money_;
    },
  },
  watch: {
    /**
     * @description: 监控cur_keyboard_index索引变化
     * @param {Number} new_ 索引
     * @return {undefined} undefined
     */
    "view_ctr_obj.cur_keyboard_index"(new_) {
      // 当前点击的是那个输入投注项
      let index = this.vx_get_bet_s_list.findIndex(item => item === this.id);
      // index与当前键盘索引一致时显示
      this.is_show_keyboard = new_ == index ? true : false;
    },
    /**
     * @description: 监控最高可赢额
     * @param {Number} new_ 可赢额
     * @return {undefined} undefined
     */
    win_money(new_) {
      // 存储最高可赢额
      this.set_bet_s_obj("win_money", new_);
      // 重新统计总的最高可赢额
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD);
    },
    /**
     * 最高限额值
     * @param {*} new_ 
     */
    max_money(new_) {
      let input = this.$refs[`input-money-${this.id}`];
      if(new_ && input && input.value) {
        // 存储输入金额
        this.set_bet_s_obj("money", parseFloat(input.value));
        input = null;
      }
    },
    /**
     * 投注列表变化
     */
    vx_get_bet_list() {
      if(this.money) {
         this.set_bet_s_obj('money', parseFloat(this.money));
         // 计算总投注额
         this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
         // 计算总收益额
         this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD);
      }
    },
    'view_ctr_obj':{
      handler () {
       this.get_max_win_money()
      },
      deep: true,
    }
  },
  beforeDestroy () {
    //  将输入框金额保存在vuex 待切换成小框使用
      if (this.money&&this.vx_get_bet_list.length>0) {
        this.vx_set_bet_current_money_obj({id:this.id,value:this.money}) 
      }else{
        this.vx_set_bet_current_money_obj({id:this.id,value:null}) 
      }
    },
  methods: {
    ...mapActions({
      vx_bet_obj_remove_attr: "bet_obj_remove_attr",  // 删除投注对象
      vx_bet_obj_add_attr: "bet_obj_add_attr",    // 添加投注对象
      vx_bet_s_obj_add_attr: "bet_s_obj_add_attr",  // 添加投注串关输入对象
      vx_set_bet_current_money_obj: "set_bet_current_money_obj", // 保存当前输入金额
    }),

    /**
     * @description:网络错误时触发方法 用于最大最小值接口错误时 设置默认最大最小值
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    net_err_fun(){
      let obj = _.cloneDeep(_.get(this.vx_get_bet_s_obj, `${this.id}`));
      if(!obj) return;
      obj.key = this.id;
      obj.cs.max_money = '8888';
      obj.cs.min_money = '5'
      this.vx_bet_s_obj_add_attr(obj);
    },
    /**
     * @description: 获取最大最小值金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_max_win_money() {
      let series_values, temp, money;
      // 多个串关的计算
      let id = this.vx_get_bet_s_list[this.index];
      // 串关值获取
      series_values = _.get(this.vx_get_bet_s_obj,`${id}.cs.name`) || '';
      // 获取存储的金额
      money = _.get(this.vx_get_bet_s_obj,`${id}.cs.money`) || 0.00;
      // 串关值存在时
      if (series_values) {
        // 计算最高可赢额
        temp = bet_utils.get_max_win_money(this.vx_get_bet_list, this.vx_get_bet_obj, this.vx_get_bet_s_list, series_values, parseFloat(money), this);
      }
      this.win_money = (!temp || _.isNaN(temp)) ? '0.00' : temp;
      return this.win_money;
    },
    /**
     * @description: 根据id获取赔率
     * @param {String} 投注项id
     * @return {Number} 赔率值
     */
    get_odds_value(id) {
      return this.yabo_common.get_odds_value(this, id);
    },
    /**
     * @description: 设置串关投注额对象
     * @param {String} k 对象的属性
     * @param {String} v 对象属性要设置的值
     * @return {Number} 赔率值
     */
    set_bet_s_obj(k, v) {
      if (!this.vx_get_bet_s_list.includes(this.id)) {
        return;
      }
      // 根据id克隆投注项对象
      let obj = _.cloneDeep(_.get(this.vx_get_bet_s_obj,`${this.id}`));
      if (obj) {
        // 投注项的用投注项对象id作为key
        obj.key = this.id;
        // 更新投注项对象
        obj.cs[k] = v;
        // 存储投注项对象
        this.vx_bet_s_obj_add_attr(obj);
      }
    },
    /**
     * @description: 输入框点击事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    click_handle() {
      // 获取焦点方法
      this.foucs_handle();
    },
    /**
     * @description: 输入框获取焦点事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    foucs_handle() {
      // 获取当前输入投注项的索引
      let index = this.vx_get_bet_s_list.findIndex(item => item === this.id);
      // 设置当前键盘所在的输入投注项索引
      this.view_ctr_obj.cur_keyboard_index = index;
      clearTimeout(this.timer_input_focus);
      this.timer_input_focus = setTimeout(() => {
        // 是否为第一个输入投注项
        if(this.index == 0){
          // 获取投注额输入框
          let input = this.$refs[`input-money-${this.id}`];
          if(input) {
            // 投注项获取焦点
            input.$el.focus();
            input = null;
          }
          // 输入投注项的索引与当前投注项索引匹配
          if (this.index == index) {
            // 键盘显示
            this.is_show_keyboard = true
          }
        }
      }, 0);
    },
    /**
     * @description: 输入框输入事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    keyup_handle(event) {
      // 重置输入为空的提示信息
      this.reset_input_empty_message();
      // 是否满额投注设置默认 0:非满额投注 1:满额投注
      this.set_bet_s_obj("full_bet", 0);
      // 获取键盘输入的值
      let value = event.target.value;
      if(value && value.startsWith('-')) {
        event.target.value = '';
        return;
      }
      // 去除键盘上金额显示的分隔符逗号
      if(value && value.includes(",")) {
        value = parseFloat(value.replace(/,/g,''));
      }
      // 暂时还没有最高限额时
      if(this.max_money == "") {
        // 设置串关最大最小值正在获取中
        this.view_ctr_obj.mix_range_money = -3; 
        // 校验并提示
        this.yabo_common.check_result_msg(this, 'mix');
      }
      // 最高限额存在并且输入的金额大于等于最高限额
      if(this.max_money != "" && _.gte(this.money, parseFloat(this.max_money))) {
        // 输入的金额转换为最高限额
        this.money = parseFloat(this.max_money);
        // 投注是否满额设置为满额投注
        this.set_bet_s_obj("full_bet", 1);
      }
      // 输入金额大于最高限额时
      if(_.gt(this.money, this.max_money)) {
        // 获取无效的投注项个数
        let count = this.yabo_common.get_deactive_count(this);
        // 错误码不是不可串关的错误码并且没有失效的投注项
        if(!['0400477','0400478'].includes(this.view_ctr_obj.error_code) && count == 0) {
          // 金额存在时
          if (this.money) {
            // 重置提示的错误码和错误信息
            this.view_ctr_obj.error_code = "";
            this.view_ctr_obj.error_message = "";
          }
        }
      }
      let user = this.vx_get_user;
      // 用户存在以及用户有输入金额并且输入金额大于用户账户金额，并且串关投注项为两个(2串1)时
      if (user && this.money > parseFloat(user.balance) && this.vx_get_bet_list.length == 2) {
        // 转换输入金额为用户账户余额
        this.money = parseFloat(user.balance);
        // 串关金额范围设置为输入最大金额
        this.view_ctr_obj.mix_range_money = 2;
        // 存储输入的金额
        this.set_bet_s_obj("money", this.money);
        // 提示信息
        this.yabo_common.check_result_msg(this, 'mix');
      } else {
        // 存储输入金额
        this.set_bet_s_obj("money", this.money);
        // 校验输入金额
        this.check_money(value);
      }
      // 键盘按键状态更新
      this.update_keyboard_status();
      // 更新投注数量显示
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD);
      // 更新收益额
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
    },
    /**
     * @description: 按键事件
     * @param {Object} 按键对象
     * @return {undefined} undefined
     */
    keypress_handle(data_) {
      this.reset_input_empty_message();
      let bet_s_obj = this.vx_get_bet_s_obj && this.vx_get_bet_s_obj[this.id];
      // 输入投注项存在并且cs不为空
      if (bet_s_obj && bet_s_obj.cs) {
        // 获取该输入投注项上的存储金额
        let money_ = bet_s_obj.cs.money;
        // 存储的投注项金额存在并且最高可赢额存在
        if (money_ && this.max_money!="") {
          this.money = parseFloat(money_);
          //输入投注金额+键盘按键按下时的金额(投注框输入金额累加)
          let total_money = this.money + parseFloat(data_.number);
          // 计算的金额小于投注项输入框限额最大值
          if (total_money <= this.max_money) {
            // 输入框累加金额给输入框进行显示
            this.money = Number(total_money);
          }
        } else {
          // 把按键金额给输入框
          this.money = Number(data_.number);
        }
        // 更新值存储的金额
        this.set_bet_s_obj("money", this.money);
        // 最高限额存在并且输入金额大于等于最高输入金额
        if(this.max_money!="" && _.gte(this.money, parseFloat(this.max_money))) {
          // 设置满额投注
          this.set_bet_s_obj("full_bet", 1);
        } else {
          // 设置非满额投注
          this.set_bet_s_obj("full_bet", 0);
        }
        // 最高限额未拿到时
        if(this.max_money == "") {
          // 最大最小值正在获取中
          this.view_ctr_obj.mix_range_money = -3; 
          // 进行提示
          this.yabo_common.check_result_msg(this, 'mix');
        }
        // 更新键盘按键状态
        this.update_keyboard_status();
        // 统计总投注数量
        this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD);
        // 统计总收益额
        this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
        // 校验输入的金额
        this.check_money(this.money);
      }
    },
    /**
     * @description: 校验金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    check_money(value) {
      try {
        // 统计无效投注项
        let count = this.yabo_common.get_deactive_count(this);
        // 如果不能串关结合 或者有无效的投注项则不做任何处理
        if(['0400477','0400478'].includes(this.view_ctr_obj.error_code) || count>0) {
          return;
        }
        // 正在获取限额时
        if (this.view_ctr_obj.input_max_flag == 1) {
          // 最大最小值正在获取中设置
          this.view_ctr_obj.mix_range_money = -3; 
          // 设置提示信息
          this.yabo_common.check_result_msg(this, 'mix');
          return;
        }
        // 统计未输入金额的输入投注项
        let empty_count = 0;
        this.view_ctr_obj.error_code = "";
        this.view_ctr_obj.mix_range_money = 0;
        this.vx_get_bet_s_list.forEach(item => {
          let cs = _.get(this.vx_get_bet_s_obj,`${item}.cs`);
          // 金额为空
          if (cs && (cs.money === null || cs.money === '')) {
            // 统计未输入金额的输入投注项个数
            empty_count++;
          }
        });
        // 为空的投注项个数和未输入投注项数量相等时
        if (empty_count == this.vx_get_bet_s_list.length) {
          //-2: 输入金额全部为空
          this.view_ctr_obj.mix_range_money = -2; 
          // 设置输入金额为空的标识
          this.view_ctr_obj.is_empty_money = true;
        } else {
          // 输入金额
          let input_amount = null;
          // 外部有出入金额
          if(value) {
            // 把传入金额给输入金额
            input_amount = parseFloat(value);
          } else {
            // 投注框金额给输入金额
            input_amount = parseFloat(this.money);
          }
          let user = this.vx_get_user;
          // 当账户金额为0时
          if(parseFloat(user.balance) == 0.00) {
          } else if(parseFloat(this.min_money) > input_amount) { // 当输入金额比输入框最小限额时
            // 设置串关输入金额标识为小于最小限额
            this.view_ctr_obj.mix_range_money = -4;
          } else if(parseFloat(this.max_money)<input_amount) { // 当输入金额大于输入框最大限额时
            // 输入金额超出最大限额时
            this.view_ctr_obj.mix_range_money = 1; 
          } else {
            // 设置为默认值
            this.view_ctr_obj.mix_range_money = 0;
          }
          // 输入金额是否为空设置为false
          this.view_ctr_obj.is_empty_money = false;
        }
        // 检查校验结果(需要显示提示信息时会提示)
        this.yabo_common.check_result_msg(this, 'mix');
        // 转换成最大金额
        if(this.view_ctr_obj.error_code == "M400011") {
          // 输入金额转换最大限额
          this.money = parseFloat(this.max_money);
          // 存储输入金额
          this.set_bet_s_obj("money", this.money);
        }
      }
      catch (e) {
        console.error(e)
      }
    },
    /**
     * @description: 点击输入框中的清除按钮事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_clear_handle() {
      // 输入金额设置默认
      this.money = null;
      // 最高可赢额设置默认
      this.win_money = 0.00;
      // 更新输入金额为null
      this.set_bet_s_obj("money", this.money);
      // 更新键盘按键状态
      this.update_keyboard_status();
      // 统计总投注数量
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD);
      // 统计总收益额
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
    },
    /**
     * @description: 检查所有输入框是否金额都是空的
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    check_all_money_empty() {
      let check_result = true;
      // 不能够串关结合是返回校验结果
      if(['0400477','0400478'].includes(this.view_ctr_obj.error_code)) {
        return check_result;
      }
      // 当投注项输入框有金额时校验是否为空设置为false
      this.vx_get_bet_s_list.forEach(item => {
        let cs = _.get(this.vx_get_bet_s_obj,`${item}.cs`);
        if(cs && cs.money) {
          check_result = false;
        }
      });
      return check_result;
    },
    /**
     * @description:设置输入金额
     * @param {*} obj 
     * @return {undefined} undefined
     */
    set_money(obj) {
      // console.log(`===bet_mix_input=========set_money===id:${obj.id}=====this.id:${this.id}`);
      if(obj.id == this.id) {
        // console.log(`=================bet_mix_input======id:${obj.id}=====money:${obj.money}`);
        // 获取金额
        this.money = parseFloat(obj.money);
        // 满额投注给默认值
        this.set_bet_s_obj("full_bet", 0);
        // 最高限额不为空并且最输入金额大于等于高限额
        if(this.max_money!="" && _.gte(this.money, parseFloat(this.max_money))) {
          // 设置为满额投注
          this.set_bet_s_obj("full_bet", 1);
        }
      }
    },
    /**
     * @description:更新键盘按键状态
     * @param {String}} value
     * @return {undefined} undefined
     */
    update_keyboard(value) {
      _.forEach(this.keyboard_data, item => {
        if(item.value > value) {
          // 按键不可用(置灰)
          item.disabled = true;
        } else {
          // 按键正常
          item.disabled = false;
        }
      });
    },
    /**
     * @description:设置输入框为最小限额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    set_min_money() {
      // 输入金额不为空
      if(this.money != null) {
        // 转换输入金额为最小限额
        this.money = parseFloat(this.min_money);
        // 输入金额小于最小限额标识
        this.view_ctr_obj.mix_range_money = -1;
        // 存储输入金额
        this.set_bet_s_obj("money", this.money);
        // 设置提示信息
        this.yabo_common.check_result_msg(this, 'mix', this.money);
      }      
    },
    /**
     * @description: 设置组件最大输入值
     * @param {*} value
     * @return {*}
     */
    set_input_max(obj) {
      if(obj.type == this.id) {
        this.input_max = obj.value;
      }
    },
    /**
     * @description:更新键盘按键状态
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    update_keyboard_status() {
      //用户信息
      let user = this.vx_get_user;
      // 用户余额获取
      let init_money = parseFloat(user.balance) || 0.00;
      // 输入金额存在并且用户账户有钱
      if(!_.isNull(this.money) && init_money != 0) {
        init_money = this.money > init_money? this.money : init_money;
      }
      // 最高限额存在并且用户账户金额大于最高限额
      if(this.max_money && init_money > parseFloat(this.max_money)) {
        // 最高限额给金额
        init_money = parseFloat(this.max_money);
      }
      // 计算输入后还剩下多少钱
      init_money = init_money - this.money;
      // 更新键盘数据
      this.update_keyboard(init_money);
    },
    /**
     * @description: 清除输入为空的提示
     * @param {*}
     * @return {*}
     */
    reset_input_empty_message() {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        if(this.money != null && this.view_ctr_obj.error_code == "M400005") {
          // 复位提示语
          this.yabo_common.reset_message_info(this);
          this.view_ctr_obj.mix_range_money = 0;
        }
      },0);
    },
    /**
     * @description: 根据用户信息获取键盘数据
     * @param {undefined} undefined
     * @return {Array} 返回键盘数据
     */
    get_keyboard_data() {
      let keyboard_data = [];
      // keys取部分getUserInfo接口cvo对象的single对象的key中的，其实就是键盘按键配置
      let keys = ['qon','qtw','qth','qfo','qfi','qsi'];
      _.forEach(keys, key => {
        let value = _.get(this.setup_mix_info,`${key}`);
        let text = _.toString(value);
        text = text.replace(/\d+/, function(n){ // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function($1){
             return $1+",";
           });
        });
        // 设置键盘按键对象
        keyboard_data.push({
          value,
          text,
          cur_btn: false,
          disabled: false
        });
      });
      return keyboard_data;
    },
  },
  mounted() {
      // 当切换小窗口或内嵌版投注栏金额要保留
    const value = this.vx_get_bet_current_money_obj[this.id]||null
    if (value&&this.vx_get_bet_list.length>0) {
    setTimeout(() => {
       this.money = value
       this.set_bet_s_obj("money", this.money);
       this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
    }, 500);
    }
    // 第一个投注输入框
    if (this.index == 0) {
      this.$nextTick().then(() => {
        let len = this.vx_get_bet_s_list.length;
        if (len > 0) {
          // 调用输入点击方法使其获取焦点
          this.click_handle();
          // 更新键盘按键状态
          this.update_keyboard_status();
        }
      });
    }
    
  }
}