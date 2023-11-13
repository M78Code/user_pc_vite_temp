/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关金额输入部分
 */
import { mapGetters, mapActions } from "vuex";
import betting from "src/public/mixins/betting/betting2.js";
import odds_conversion from "src/public/mixins/odds_conversion/odds_conversion_mixin.js";
import * as bet_utils from "src/public/mixins/virtual_bet/bet_utils.js";
import BetKeyboard from "src/public/components/bet/bet_keyboard.vue";
export default {
  name: "bet-mix-input",
  mixins: [betting, odds_conversion],
  data() {
    return {
      money: null,
      win_money: "", // 可赢额
      is_show_keyboard: false,
      odds_value: 1.00,
      keyboard_data: [
        {
          text: "5",
          value: 5,
          disabled: false
        },
        {
          text: "10",
          value: 10,
          disabled: false
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
      input_max: null,
      setup_mix_info: {}, // 串关设置信息
      timer_input_focus: null
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
    index: {
      type: Number,
      default: 0
    },
    view_ctr_obj: {
      type: Object,
      default: {
      }
    }
  },
  created() {    
    // 串关的校验金额
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD, this.check_money);
    // 触发清除串关输入框金额
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_CLEAR_HANDLE_CMD, this.bet_clear_handle);
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_MIN_MONEY, this.set_min_money);
    // 更新键盘按键状态
    this.$root.$on(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD,this.update_keyboard_status);    
    this.$root.$on(this.emit_cmd.EMIT_BET_MIX_INPUT_MAX_MONEY, this.set_input_max);
    if (this.index == 0) {
      this.vx_get_virtual_bet_list.forEach(id => {
        this.odds_value *= this.get_odds_value(id);
      });
    }
    this.setup_mix_info = _.get(this.vx_get_user, 'cvo.series');
    if(!_.isEmpty(this.setup_mix_info) && _.isObject(this.setup_mix_info)) {
      this.keyboard_data = this.get_keyboard_data();
    }
  },
  destroyed() {
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_CHECK_MONEY_CMD, this.check_money);
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_CLEAR_HANDLE_CMD, this.bet_clear_handle);
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_MIN_MONEY, this.set_min_money);
    this.$root.$off(this.emit_cmd.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD,this.update_keyboard_status);
    this.$root.$off(this.emit_cmd.EMIT_BET_MIX_INPUT_MAX_MONEY, this.set_input_max);
    clearTimeout(this.timer_input_focus);
    this.keyboard_data = null;
    this.setup_mix_info = {};
  },
  computed: {
    ...mapGetters({
      vx_get_virtual_bet_list: "get_virtual_bet_list",//虚拟体育投注列表
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",
      vx_get_virtual_bet_s_list: "get_virtual_bet_s_list",
      vx_get_virtual_bet_s_obj: "get_virtual_bet_s_obj",
      vx_get_currency_obj: "get_currency_obj", // 当前币种对象
      vx_get_mix_keyboard: "get_mix_keyboard",  // 串关键盘数据
      vx_cur_menu_type: "get_cur_menu_type",
    }),
    /**
     * 电竞只能输入整数
     * @returns 
     */
    has_input_integer() {
      return $menu.menu_data.is_esports;
    },
    /**
     * @description: 获取串关赔率
     * @param {undefined} undefined 
     * @return {Number} 赔率 
     */
    get_series_odds() {
      let series_odds = 1;
      let sport_id = 0;
      this.vx_get_virtual_bet_list.forEach(item => {
        let obj = _.get(this.vx_get_virtual_bet_obj, `${item}.cs`);   
        let odds_value = (obj && obj.odds_value) || 1;
        sport_id = obj.sport_id;
        if(this.float_3_csid.includes(1*sport_id)) {
          series_odds = ((Math.floor(odds_value / 100)) / 1000) * series_odds;
        } else {
          series_odds = ((Math.floor(odds_value / 1000)) / 100) * series_odds;
        }
      });  
      // 电竞dota2
      if(this.float_3_csid.includes(1*sport_id)) {
        return ((Math.floor(series_odds * 1000)) / 1000).toFixed(3);
      }    
      return ((Math.floor(series_odds * 100)) / 100).toFixed(2);
    },
    /**
     * @description: 获取串关个数
     * @param {undefined} undefined 
     * @return {String} 个数
     */
    count() {
      let count =  _.get(this.vx_get_virtual_bet_s_obj,`${this.id}.cs.count`);
      return `${count}`;
    },
    /**
     * @description: 最大值
     * @param {undefined} undefined 
     * @return {String}
     */
    max_money() {
      let max_money =  _.get(this.vx_get_virtual_bet_s_obj,`${this.id}.cs.max_money`);
      return `${max_money}`;
    },
    /**
     * @description: 最小值
     * @param {undefined} undefined 
     * @return {String}
     */
    min_money() {
      let min_money =  _.get(this.vx_get_virtual_bet_s_obj,`${this.id}.cs.min_money`);
      return `${min_money}`
    },
    /**
     * @description: 金额是否为空
     * @param {undefined} undefined 
     * @return {Boolean}
     */
    is_empty_money() {
      let is_empty_money_ = this.money==null;
      this.view_ctr_obj.is_empty_money = is_empty_money_;
      return is_empty_money_;
    }
  },
  watch: {
    /**
     * @description: 监控cur_keyboard_index索引变化
     * @param {Number} new_ 索引 
     * @return {undefined} undefined 
     */
    "view_ctr_obj.cur_keyboard_index":{
      handler(new_) {
        let index = this.vx_get_virtual_bet_s_list.findIndex(item => item === this.id);
        this.is_show_keyboard = new_ == index ? true : false;
      },
      immediate: true
    },
    /**
     * @description: 监控最高可赢额
     * @param {Number} new_ 可赢额 
     * @return {undefined} undefined 
     */
    win_money(new_) {
      this.set_virtual_bet_s_obj("win_money", new_);
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD);
    },
    max_money(new_) {
      let input = this.$refs[`input-money-${this.id}`];
      if(new_ && input && input.value) {
        this.set_virtual_bet_s_obj("money", parseFloat(input.value));
        input = null;
      }
    },
    vx_get_virtual_bet_list() {
      if(this.money) {
         this.set_bet_s_obj('money', parseFloat(this.money));
         this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
         this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD);
      }
    }
  },
  methods: {
    ...mapActions({
      vx_virtual_bet_obj_del: "virtual_bet_obj_del",
      vx_virtual_bet_obj_add: "virtual_bet_obj_add",
      vx_virtual_bet_s_obj_add: "virtual_bet_s_obj_add",
    }), 
    /**
     * @description: 设置串关投注额对象
     * @param {String} k 对象的属性
     * @param {String} v 对象属性要设置的值
     * @return {Number} 赔率值
     */
    set_bet_s_obj(k, v) {
      if (!this.vx_get_virtual_bet_s_list.includes(this.id)) {
        return;
      }
      // 根据id克隆投注项对象
      let obj = _.cloneDeep(_.get(this.vx_get_virtual_bet_s_obj,`${this.id}`));
      if (obj) {
        // 投注项的用投注项对象id作为key
        obj.key = this.id;
        // 更新投注项对象
        obj.cs[k] = v;
        // 存储投注项对象
        this.vx_virtual_bet_s_obj_add(obj);
      }
    },
    /**
     * @description: 获取最大最小值金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_max_win_money() {
      let series_values, temp, money;
      // 多个串关的计算
      let id = this.vx_get_virtual_bet_s_list[this.index];
      let virtual_bet_s_obj = this.vx_get_virtual_bet_s_obj && this.vx_get_virtual_bet_s_obj[id];

      if (virtual_bet_s_obj && virtual_bet_s_obj.cs) {
        series_values = virtual_bet_s_obj.cs.name;
        money = _.get(this.vx_get_virtual_bet_s_obj,`${id}.cs.money`) || 0.00;
        if (series_values) {
          temp = bet_utils.get_max_win_money(this.vx_get_virtual_bet_list, this.vx_get_virtual_bet_obj, this.vx_get_virtual_bet_s_list, series_values, parseFloat(money),this.float_3_csid);
        }
      }
      this.win_money = _.isNaN(temp) ? '0.00' : temp;
      return this.win_money;
    },
    /**
     * @description: 根据id获取赔率
     * @param {String} 投注项id
     * @return {Number} 赔率值
     */
    get_odds_value(id) {
      return this.virtual_common.get_odds_value(this, id);
    },
    /**
     * @description: 设置串关投注额对象
     * @param {String} k 对象的属性
     * @param {String} v 对象属性要设置的值
     * @return {Number} 赔率值
     */
    set_virtual_bet_s_obj(k, v) {
      if (!this.vx_get_virtual_bet_s_list.includes(this.id)) {
        return;
      }

      let obj = _.cloneDeep(_.get(this.vx_get_virtual_bet_s_obj,`${this.id}`));
      if (obj) {        
        obj.key = this.id;
        obj.cs[k] = v;
        // console.log(`============>>>obj:${JSON.stringify(obj)}`);
        this.vx_virtual_bet_s_obj_add(obj);
      }
    },
    /**
     * @description: 输入框点击事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    click_handle() {
      this.foucs_handle();
    },
    /**
     * @description: 输入框获取焦点事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    foucs_handle() {
      let index = this.vx_get_virtual_bet_s_list.findIndex(item => item === this.id);
      this.view_ctr_obj.cur_keyboard_index = index;
      clearTimeout(this.timer_input_focus);      
      this.timer_input_focus = setTimeout(() => {
        // 获取焦点的投注额输入框
        if(this.index == 0){
          let input = this.$refs[`input-money-${this.vx_get_virtual_bet_s_list.length}`];
          if(input) {
            input.$el.focus();
            input = null;
          }        
          if (this.index == index) {
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
      this.reset_input_empty_message();
      this.set_virtual_bet_s_obj("full_bet", 0);
      let value = event.target.value;
      if(value && value.startsWith('-')) {
        event.target.value = '';
        return;
      } 
      if(value && value.includes(",")) {
        value = parseFloat(value.replace(/,/g,''));
      }   
      if(this.max_money=="") {
        this.view_ctr_obj.mix_range_money = -3; // 最大最小值正在获取中
        this.virtual_common.check_result_msg(this, 'mix');
      }
      if(this.max_money!="" && _.gte(this.money, parseFloat(this.max_money))) {
        this.money = parseFloat(this.max_money);
        this.set_virtual_bet_s_obj("full_bet", 1);
      } 
      this.set_virtual_bet_s_obj("money", this.money); 
      if(_.gt(this.money, this.max_money)) {
        let count = this.virtual_common.get_deactive_count(this);
        //串关当中相同球队不能组合投注(0400477)  串关当中相同球员不能组合投注(0400478)
        if(!['0400477','0400478'].includes(this.view_ctr_obj.error_code) && count == 0) {
          // 关掉投注项提示
          if (this.money) {
            this.view_ctr_obj.error_code = "";
            this.view_ctr_obj.error_message = "";
          }
        }
      }      
      let user = this.vx_get_user;
      if (user && this.money > parseFloat(user.balance) && this.vx_get_bet_list.length==2) {       
        this.money = parseFloat(user.balance);
        this.view_ctr_obj.mix_range_money = 2;
        this.set_virtual_bet_s_obj("money", this.money);
        this.virtual_common.check_result_msg(this, 'mix');
      } else {
        this.set_virtual_bet_s_obj("money", this.money);
        this.check_money(value);
        this.update_keyboard_status();
      }
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD);
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
    },
    /**
     * @description: 按键事件
     * @param {Object} 按键对象
     * @return {undefined} undefined
     */
    keypress_handle(data_) {
      this.reset_input_empty_message();
      let cs = _.get(this.vx_get_virtual_bet_s_obj,`${this.id}.cs`);
      if (cs) {
        let money_ = cs.money;
        // 从键盘上获取值赋给组件
        if (money_ && this.max_money!="") {
          this.money = parseFloat(money_);
          //小于最大值得时候键盘不能够继续点击       
          let total_money = this.money + parseFloat(data_.number);
          if (total_money <= this.max_money) {
            this.money = Number(total_money); 
          }
        } else {
          this.money = Number(data_.number);                  
        }
        // 更新值
        this.set_virtual_bet_s_obj("money", this.money);
        // this.$refs[`input-money-${this.id}`].setValue(this.money);  
        if(this.max_money!="" && _.gte(this.money, parseFloat(this.max_money))) {
          this.set_virtual_bet_s_obj("full_bet", 1);
        } else {
          this.set_virtual_bet_s_obj("full_bet", 0);
        }
        if(this.max_money=="") {
          this.view_ctr_obj.mix_range_money = -3; // 最大最小值正在获取中
          this.virtual_common.check_result_msg(this, 'mix');
        }
        this.update_keyboard_status();
        this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD);
        this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
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
        //串关当中相同球队不能组合投注(0400477)  串关当中相同球员不能组合投注(0400478)
        if(['0400477','0400478'].includes(this.view_ctr_obj.error_code)) {
          return;
        }
        if (this.view_ctr_obj.input_max_flag == 1) {
          this.view_ctr_obj.mix_range_money = -3; // 最大最小值正在获取中
          this.virtual_common.check_result_msg(this, 'mix');
          return;
        }
        let empty_count = 0;
        this.view_ctr_obj.error_code = "";
        this.view_ctr_obj.mix_range_money = 0;
        this.vx_get_virtual_bet_s_list.forEach(item => {
          let cs = _.get(this.vx_get_virtual_bet_s_obj,`${item}.cs`);
          if (cs && (cs.money===null || cs.money==='')) {
            empty_count++;            
          }
        });
        if (empty_count == this.vx_get_virtual_bet_s_list.length) {
          this.view_ctr_obj.mix_range_money = -2; //-2: 输入金额全部为空
          this.view_ctr_obj.is_empty_money = true;          
        } else {
          let input_amount = null;          
          if(value) {
            input_amount = parseFloat(value);
          } else {
            input_amount = parseFloat(this.money);
          }
          let user = this.vx_get_user;
          if(parseFloat(user.balance)==0.00) {
          } else if(parseFloat(this.min_money)>input_amount) {
            this.view_ctr_obj.mix_range_money = -4;
          } else if(parseFloat(this.max_money)<input_amount) {
            this.view_ctr_obj.mix_range_money = 1; // 输入金额超出最大限额时
          } else {
            this.view_ctr_obj.mix_range_money = 0;
          }
          this.view_ctr_obj.is_empty_money = false;
        }
        this.virtual_common.check_result_msg(this, 'mix');
        // 转换成最大金额
        if(this.view_ctr_obj.error_code == "M400011") {
          this.money = parseFloat(this.max_money);
          this.set_virtual_bet_s_obj("money", this.money);
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
      this.money = null;
      this.win_money = 0.00;
      this.set_virtual_bet_s_obj("money", this.money);
      this.update_keyboard_status();
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_COUNT_CMD);
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_MONEY_CMD);
    },
    /**
     * @description: 获取最大最小值
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_min_max_handle() {
      this.bet_clear_handle();
    },
    /**
     * @description: 检查所有输入框是否金额都是空的
     */
    check_all_money_empty() {
      let check_result = true;
      //串关当中相同球队不能组合投注(0400477)  串关当中相同球员不能组合投注(0400478)
      if(['0400477','0400478'].includes(this.view_ctr_obj.error_code)) {
        return check_result;
      }
      this.vx_get_virtual_bet_s_list.forEach(item => {
        let cs = _.get(this.vx_get_virtual_bet_s_obj,`${item}.cs`);
        if(cs && _.trim(cs.money)!="") {
          check_result = false;
        }
      });
      return check_result;
    },
    update_keyboard(value) {
      _.forEach(this.keyboard_data, item => {        
        if(item.value>value) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    },
    set_min_money() {
      if(this.money!=null) {
        this.money = parseFloat(this.min_money);
        this.view_ctr_obj.mix_range_money = -1;
        this.set_virtual_bet_s_obj("money", this.money);
        this.virtual_common.check_result_msg(this, 'mix', this.money);
      }      
    },
    /**
     * @description: 设置组件最大输入值
     * @param {*} value
     * @return {*}
     */    
     set_input_max(obj) {
      if(obj.type== this.id) {
        this.input_max = obj.value;
      }      
    },
    /**
     * 更新键盘按键状态
     */
    update_keyboard_status() {
      let user = this.vx_get_user;
      let init_money = parseFloat(user.balance) || 0.00;
      if(!_.isNull(this.money) && init_money!=0) {
        init_money = this.money > init_money? this.money : init_money;
      }
      if(this.max_money && init_money > parseFloat(this.max_money)) {            
        init_money = parseFloat(this.max_money); 
      }
      init_money = init_money - this.money;
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
        if(this.money!=null && this.view_ctr_obj.error_code=="M400005") {
          this.virtual_common.reset_message_info(this);
          this.view_ctr_obj.mix_range_money = 0;
        }
      },0);
    },
    get_keyboard_data() {
      let keyboard_data = [];
      let keys = ['qon','qtw','qth','qfo','qfi','qsi'];      
      _.forEach(keys, key => {
        let value = _.get(this.setup_mix_info,`${key}`);
        let text = _.toString(value);
        text = text.replace(/\d+/, function(n){ // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
             return $1+",";
           });
        });
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
    if (this.index == 0) {
      this.$nextTick().then(() => {
        let len = this.vx_get_virtual_bet_s_list.length;
        if (len > 0) {
          this.click_handle();
          this.update_keyboard_status();
        }
      });
    }
  }
}