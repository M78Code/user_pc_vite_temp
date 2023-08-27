
import { ref, onMounted, defineComponent } from "vue"

import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import store from "src/store-redux/index.js";

import * as bet_utils from "./bet_utils.js";
import _ from "lodash"

import BetKeyboard from "../common/bet-keyboard.vue";

const {
  userReducer
} = store.getState()

const keyboard = [
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
]

export default defineComponent({
  components: {
    BetKeyboard,
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
  setup(props, evnet) {
    const data = reactive({
      money: null, // 输入框金额
      win_money: '', // 可赢额
      is_show_keyboard: false, // 键盘是否显示
      odds_value: 1.00, // 赔率
      keyboard_data: keyboard, // 键盘数据集合
      input_max: null, // 可输入的最大值
      setup_mix_info: {}, // 串关设置信息
      timer_input_focus: null, // 获得焦点定时器
      vx_get_user:userReducer.user_info
    });

    onMounted(() => {
      //网络错误时设置默认最大最小值
      useMittEmit(MITT_TYPES.EMIT_NET_ERR, net_err_fun)
      // 串关的校验金额
      useMittEmit(MITT_TYPES.EMIT_BET_MIX_CHECK_MONEY_CMD, check_money)
      // 触发清除串关输入框金额
      useMittEmit(MITT_TYPES.EMIT_BET_MIX_CLEAR_HANDLE_CMD, bet_clear_handle)
      // 设置金额
      useMittEmit(MITT_TYPES.EMIT_BET_MIX_SET_MONEY_CMD, set_money)
      // 设置输入框的最大金额
      useMittEmit(MITT_TYPES.EMIT_BET_MIX_INPUT_MAX_MONEY, set_input_max)
      // 设置最小金额
      useMittEmit(MITT_TYPES.EMIT_BET_MIX_MIN_MONEY, set_min_money)
      // 更新键盘按键状态
      useMittEmit(MITT_TYPES.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD, update_keyboard_status)
      // 若为串关的额第一个输入投注项
      if (props.index == 0) {
        // 计算第一个输入投注项显示的赔率(各个投注项赔率进行相乘)
        BetData.bet_list.forEach(id => {
          odds_value.value *= get_odds_value(id);
        });
      }
      // 获取串关配置信息
      setup_mix_info.value = _.get(vx_get_user, 'cvo.series');
      // 串关配置信息存在且是一个对象
      if (!_.isEmpty(setup_mix_info.value) && _.isObject(setup_mix_info.value)) {
        // 重新获取键盘数据集合
        keyboard_data.value = get_keyboard_data();
      }
    })
    /**
   * @description: 获取串关赔率(欧赔)
   * @param {undefined} undefined
   * @return {Number} 赔率
   */
    const get_series_odds = computed(() => {
      let series_odds = 1;
      BetData.bet_list.forEach(item => {
        let obj = _.get(BetData.bet_obj, `${item}.cs`);
        let odds_value = (obj && obj.odds_value) || 1;
        // 此处乘以100然后除以100是为了保证精度
        series_odds = ((Math.floor(odds_value / 1000)) / 100) * series_odds;
      });
      // 此处乘以100然后除以100是为了保证精度
      return ((Math.floor(series_odds * 100)) / 100).toFixed(2);
    })


    /**
     * @description: 获取串关个数
     * @param {undefined} undefined
     * @return {String} 个数
     */
    const count = computed(() => {
      let count = _.get(BetData.bet_s_obj, `${props.id}.cs.count`);
      if (count) {
        return `${count}`;
      }
      return '';
    })
    /**
     * @description: 最大值
     * @param {undefined} undefined
     * @return {String}
     */
    const max_money = computed(() => {
      let max_money = _.get(BetData.bet_s_obj, `${props.id}.cs.max_money`);
      if (max_money) {
        return `${max_money}`;
      }
      return '';
    })
    /**
     * @description: 最小值
     * @param {undefined} undefined
     * @return {String}
     */
    const min_money = computed(() => {
      let min_money = _.get(BetData.bet_s_obj, `${props.id}.cs.min_money`);
      if (min_money) {
        return `${min_money}`;
      }
      return '';
    })
    /**
     * @description: 金额是否为空
     * @param {undefined} undefined
     * @return {Boolean}
     */
    const is_empty_money = computed(() => {
      let is_empty_money_ = money == null;
      // 金额为空
      view_ctr_obj.is_empty_money = is_empty_money_;
      return is_empty_money_;
    })
    /**
    * @description: 监控cur_keyboard_index索引变化
    * @param {Number} new_ 索引
    * @return {undefined} undefined
    */
    watch(
      () => view_ctr_obj.cur_keyboard_index,
      (new_) => {
        // 当前点击的是那个输入投注项
        let index = BetData.bet_s_list.findIndex(item => item === props.id);
        // index与当前键盘索引一致时显示
        is_show_keyboard.value = new_ == index ? true : false;
      },
      {
        immediate: true,
      }
    );


    /**
     * @description: 监控最高可赢额
     * @param {Number} new_ 可赢额
     * @return {undefined} undefined
     */
    watch(
      () => win_money,
      (new_) => {
        // 存储最高可赢额
        BetData.set_bet_s_obj("win_money", new_);
        // 重新统计总的最高可赢额
        useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_WIN_MONEY_CMD)
      },
      {
        immediate: true,
      }
    );


    /**
     * 最高限额值
     * @param {*} new_ 
     */
    watch(
      () => max_money,
      (new_) => {
        let input = '' // this.$refs[`input-money-${this.id}`];
        if (new_ && input && input.value) {
          // 存储输入金额
          BetData.set_bet_s_obj("money", parseFloat(input.value));
          input = null;
        }
      },
      {
        immediate: true,
      }
    );

    /**
     * 投注列表变化
     */
    watch(
      () => vx_get_bet_list,
      (new_) => {
        if (money.value) {
          BetData.set_bet_s_obj('money', parseFloat(money.value));
          // 计算总投注额
          useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_MONEY_CMD)
          // 计算总收益额
          useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_WIN_MONEY_CMD)
        }
      },
      {
        immediate: true,
      }
    );

    watch(
      () => view_ctr_obj,
      (new_) => {
        get_max_win_money()
      },
      {
        immediate: true,
      }
    );
    /**
     * @description:网络错误时触发方法 用于最大最小值接口错误时 设置默认最大最小值
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const net_err_fun = () => {
      let obj = _.cloneDeep(_.get(BetData.bet_s_obj, `${props.id}`));
      if (!obj) return;
      obj.key = props.id;
      obj.cs.max_money = '8888';
      obj.cs.min_money = '5'
      BetData.bet_s_obj_add_attr(obj);
    }
    /**
     * @description: 获取最大最小值金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const get_max_win_money = () => {
      let series_values, temp, money;
      // 多个串关的计算
      let id = BetData.bet_s_list[props.index];
      // 串关值获取
      series_values = _.get(BetData.bet_s_obj, `${id}.cs.name`) || '';
      // 获取存储的金额
      money = _.get(BetData.bet_s_obj, `${id}.cs.money`) || 0.00;
      // 串关值存在时
      if (series_values) {
        // 计算最高可赢额
        temp = bet_utils.get_max_win_money(BetData.bet_list, BetData.bet_obj, BetData.bet_s_list, series_values, parseFloat(money), this);
      }
      win_money.value = (!temp || _.isNaN(temp)) ? '0.00' : temp;
      return win_money.value;
    }
    /**
         * @description: 根据id获取赔率
         * @param {String} 投注项id
         * @return {Number} 赔率值
         */
    const get_odds_value = (id) => {
      return this.yabo_common.get_odds_value(this, id);
    }
    /**
     * @description: 设置串关投注额对象
     * @param {String} k 对象的属性
     * @param {String} v 对象属性要设置的值
     * @return {Number} 赔率值
     */
    const set_bet_s_obj = (k, v) => {
      if (!BetData.bet_s_list.includes(props.id)) {
        return;
      }
      // 根据id克隆投注项对象
      let obj = _.cloneDeep(_.get(BetData.bet_s_obj, `${props.id}`));
      if (obj) {
        // 投注项的用投注项对象id作为key
        obj.key = props.id;
        // 更新投注项对象
        obj.cs[k] = v;
        // 存储投注项对象
        BetData.bet_s_obj_add_attr(obj);
      }
    }
    /**
     * @description: 输入框点击事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const click_handle = () => {
      // 获取焦点方法
      foucs_handle();
    }
    /**
     * @description: 输入框获取焦点事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const foucs_handle = () => {
      // 获取当前输入投注项的索引
      let index = BetData.bet_s_list.findIndex(item => item === props.id);
      // 设置当前键盘所在的输入投注项索引
      this.view_ctr_obj.cur_keyboard_index = index;
      clearTimeout(timer_input_focus.value);
      timer_input_focus.value = setTimeout(() => {
        // 是否为第一个输入投注项
        if (props.index == 0) {
          // 获取投注额输入框
          let input = this.$refs[`input-money-${props.id}`];
          if (input) {
            // 投注项获取焦点
            input.$el.focus();
            input = null;
          }
          // 输入投注项的索引与当前投注项索引匹配
          if (props.index == index) {
            // 键盘显示
            is_show_keyboard.value = true
          }
        }
      }, 0);
    }
    /**
     * @description: 输入框输入事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const keyup_handle = (event) => {
      // 重置输入为空的提示信息
      this.reset_input_empty_message();
      // 是否满额投注设置默认 0:非满额投注 1:满额投注
      this.set_bet_s_obj("full_bet", 0);
      // 获取键盘输入的值
      let value = event.target.value;
      if (value && value.startsWith('-')) {
        event.target.value = '';
        return;
      }
      // 去除键盘上金额显示的分隔符逗号
      if (value && value.includes(",")) {
        value = parseFloat(value.replace(/,/g, ''));
      }
      // 暂时还没有最高限额时
      if (max_money.value == "") {
        // 设置串关最大最小值正在获取中
        this.view_ctr_obj.mix_range_money = -3;
        // 校验并提示
        this.yabo_common.check_result_msg(this, 'mix');
      }
      // 最高限额存在并且输入的金额大于等于最高限额
      if (max_money.value != "" && _.gte(money.value, parseFloat(max_money.value))) {
        // 输入的金额转换为最高限额
        money.value = parseFloat(max_money.value);
        // 投注是否满额设置为满额投注
        set_bet_s_obj("full_bet", 1);
      }
      // 输入金额大于最高限额时
      if (_.gt(money.value, max_money.value)) {
        // 获取无效的投注项个数
        let count = this.yabo_common.get_deactive_count(this);
        // 错误码不是不可串关的错误码并且没有失效的投注项
        if (!['0400477', '0400478'].includes(this.view_ctr_obj.error_code) && count == 0) {
          // 金额存在时
          if (money.value) {
            // 重置提示的错误码和错误信息
            this.view_ctr_obj.error_code = "";
            this.view_ctr_obj.error_message = "";
          }
        }
      }
      let user = vx_get_user.value;
      // 用户存在以及用户有输入金额并且输入金额大于用户账户金额，并且串关投注项为两个(2串1)时
      if (user && money.value > parseFloat(user.balance) && BetData.bet_list.length == 2) {
        // 转换输入金额为用户账户余额
        money.value = parseFloat(user.balance);
        // 串关金额范围设置为输入最大金额
        this.view_ctr_obj.mix_range_money = 2;
        // 存储输入的金额
        set_bet_s_obj("money", money.value);
        // 提示信息
        this.yabo_common.check_result_msg(this, 'mix');
      } else {
        // 存储输入金额
        et_bet_s_obj("money", money.value);
        // 校验输入金额
        check_money(value);
      }
      // 键盘按键状态更新
      update_keyboard_status();
      // 更新投注数量显示
      useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_COUNT_CMD)
      // 更新收益额
      useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_MONEY_CMD)
    }
    /**
     * @description: 按键事件
     * @param {Object} 按键对象
     * @return {undefined} undefined
     */
    const keypress_handle = (data_) => {
      reset_input_empty_message();
      let bet_s_obj = BetData.bet_s_obj &&BetData.bet_s_obj[props.id];
      // 输入投注项存在并且cs不为空
      if (bet_s_obj && bet_s_obj.cs) {
        // 获取该输入投注项上的存储金额
        let money_ = bet_s_obj.cs.money;
        // 存储的投注项金额存在并且最高可赢额存在
        if (money_ && max_money.value != "") {
          money.value = parseFloat(money_);
          //输入投注金额+键盘按键按下时的金额(投注框输入金额累加)
          let total_money = money.value + parseFloat(data_.number);
          // 计算的金额小于投注项输入框限额最大值
          if (total_money <= max_money.value) {
            // 输入框累加金额给输入框进行显示
            money.value = Number(total_money);
          }
        } else {
          // 把按键金额给输入框
          money.value = Number(data_.number);
        }
        // 更新值存储的金额
        set_bet_s_obj("money", money.value);
        // 最高限额存在并且输入金额大于等于最高输入金额
        if (max_money.value != "" && _.gte(money.value, parseFloat(max_money.value))) {
          // 设置满额投注
          set_bet_s_obj("full_bet", 1);
        } else {
          // 设置非满额投注
          set_bet_s_obj("full_bet", 0);
        }
        // 最高限额未拿到时
        if (max_money.value == "") {
          // 最大最小值正在获取中
          this.view_ctr_obj.mix_range_money = -3;
          // 进行提示
          this.yabo_common.check_result_msg(this, 'mix');
        }
        // 更新键盘按键状态
        update_keyboard_status();
        // 统计总投注数量
        useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_COUNT_CMD)
        // 统计总收益额
        useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_MONEY_CMD)
        // 校验输入的金额
        check_money(money.value);
      }
    }
    /**
     * @description: 校验金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const check_money = value => {
      try {
        // 统计无效投注项
        let count = this.yabo_common.get_deactive_count(this);
        // 如果不能串关结合 或者有无效的投注项则不做任何处理
        if (['0400477', '0400478'].includes(this.view_ctr_obj.error_code) || count > 0) {
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
        BetData.bet_s_list.forEach(item => {
          let cs = _.get(BetData.bet_s_obj, `${item}.cs`);
          // 金额为空
          if (cs && (cs.money === null || cs.money === '')) {
            // 统计未输入金额的输入投注项个数
            empty_count++;
          }
        });
        // 为空的投注项个数和未输入投注项数量相等时
        if (empty_count == BetData.bet_s_list.length) {
          //-2: 输入金额全部为空
          this.view_ctr_obj.mix_range_money = -2;
          // 设置输入金额为空的标识
          this.view_ctr_obj.is_empty_money = true;
        } else {
          // 输入金额
          let input_amount = null;
          // 外部有出入金额
          if (value) {
            // 把传入金额给输入金额
            input_amount = parseFloat(value);
          } else {
            // 投注框金额给输入金额
            input_amount = parseFloat(money.value);
          }
          let user = vx_get_user;
          // 当账户金额为0时
          if (parseFloat(user.balance) == 0.00) {
          } else if (parseFloat(min_money.value) > input_amount) { // 当输入金额比输入框最小限额时
            // 设置串关输入金额标识为小于最小限额
            this.view_ctr_obj.mix_range_money = -4;
          } else if (parseFloat(max_money.value) < input_amount) { // 当输入金额大于输入框最大限额时
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
        if (this.view_ctr_obj.error_code == "M400011") {
          // 输入金额转换最大限额
          money.value = parseFloat(max_money.value);
          // 存储输入金额
          set_bet_s_obj("money", money.value);
        }
      }
      catch (e) {
        console.error(e)
      }
    }
    /**
     * @description: 点击输入框中的清除按钮事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const bet_clear_handle = () => {
      // 输入金额设置默认
      money.value = null;
      // 最高可赢额设置默认
      win_money.value = 0.00;
      // 更新输入金额为null
      set_bet_s_obj("money", money.value);
      // 更新键盘按键状态
      update_keyboard_status();
      // 统计总投注数量
      useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_COUNT_CMD)
      // 统计总收益额
      useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_MONEY_CMD)
    }
    /**
     * @description: 检查所有输入框是否金额都是空的
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const check_all_money_empty = () => {
      let check_result = true;
      // 不能够串关结合是返回校验结果
      if (['0400477', '0400478'].includes(this.view_ctr_obj.error_code)) {
        return check_result;
      }
      // 当投注项输入框有金额时校验是否为空设置为false
      BetData.bet_s_list.forEach(item => {
        let cs = _.get(BetData.bet_s_obj, `${item}.cs`);
        if (cs && cs.money) {
          check_result = false;
        }
      });
      return check_result;
    }
    /**
     * @description:设置输入金额
     * @param {*} obj 
     * @return {undefined} undefined
     */
    const set_money = (obj) => {
      // console.log(`===bet_mix_input=========set_money===id:${obj.id}=====this.id:${this.id}`);
      if (obj.id == props.id) {
        // console.log(`=================bet_mix_input======id:${obj.id}=====money:${obj.money}`);
        // 获取金额
        money.value = parseFloat(obj.money);
        // 满额投注给默认值
        set_bet_s_obj("full_bet", 0);
        // 最高限额不为空并且最输入金额大于等于高限额
        if (max_money.value != "" && _.gte(money.value, parseFloat(max_money.value))) {
          // 设置为满额投注
          set_bet_s_obj("full_bet", 1);
        }
      }
    }
    /**
     * @description:更新键盘按键状态
     * @param {String}} value
     * @return {undefined} undefined
     */
    const update_keyboard = (value) => {
      _.forEach(keyboard_data.value, item => {
        if (item.value > value) {
          // 按键不可用(置灰)
          item.disabled = true;
        } else {
          // 按键正常
          item.disabled = false;
        }
      });
    }
    /**
     * @description:设置输入框为最小限额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const set_min_money = () => {
      // 输入金额不为空
      if (money.value != null) {
        // 转换输入金额为最小限额
        money.value = parseFloat(min_money.value);
        // 输入金额小于最小限额标识
        this.view_ctr_obj.mix_range_money = -1;
        // 存储输入金额
        this.set_bet_s_obj("money", money.value);
        // 设置提示信息
        this.yabo_common.check_result_msg(this, 'mix', money.value);
      }
    }
    /**
     * @description: 设置组件最大输入值
     * @param {*} value
     * @return {*}
     */
    const set_input_max = (obj) => {
      if (obj.type == props.id) {
        input_max.value = obj.value;
      }
    }
    /**
     * @description:更新键盘按键状态
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const update_keyboard_status = () => {
      //用户信息
      let user = vx_get_user;
      // 用户余额获取
      let init_money = parseFloat(user.balance) || 0.00;
      // 输入金额存在并且用户账户有钱
      if (!_.isNull(money.value) && init_money != 0) {
        init_money = money.value > init_money ? money.value : init_money;
      }
      // 最高限额存在并且用户账户金额大于最高限额
      if (max_money.value && init_money > parseFloat(max_money.value)) {
        // 最高限额给金额
        init_money = parseFloat(max_money.value);
      }
      // 计算输入后还剩下多少钱
      init_money = init_money - money.value;
      // 更新键盘数据
      this.update_keyboard(init_money);
    }
    /**
     * @description: 清除输入为空的提示
     * @param {*}
     * @return {*}
     */
    const reset_input_empty_message = () => {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        if (money.value != null && this.view_ctr_obj.error_code == "M400005") {
          // 复位提示语
          this.yabo_common.reset_message_info(this);
          this.view_ctr_obj.mix_range_money = 0;
        }
      }, 0);
    }

    /**
  * @description: 根据用户信息获取键盘数据
  * @param {undefined} undefined
  * @return {Array} 返回键盘数据
  */
    const get_keyboard_data = () => {
      let keyboard_data = [];
      // keys取部分getUserInfo接口cvo对象的single对象的key中的，其实就是键盘按键配置
      let keys = ['qon', 'qtw', 'qth', 'qfo', 'qfi', 'qsi'];
      _.forEach(keys, key => {
        let value = _.get(setup_mix_info.value, `${key}`);
        let text = _.toString(value);
        text = text.replace(/\d+/, function (n) { // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ",";
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
    }

    return {
      ...toRefs(data)
    }
  }
})


