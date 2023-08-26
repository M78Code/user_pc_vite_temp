
import { ref, defineComponent } from "vue"
import BetKeyboard from "../common/bet-keyboard.vue";

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
    });

    /**
        * @description: 获取串关赔率(欧赔)
        * @param {undefined} undefined
        * @return {Number} 赔率
        */
    const get_series_odds = () => {
      let series_odds = 1;
      BetData.bet_list.forEach(item => {
        let obj = _.get(BetData.bet_obj, `${item}.cs`);
        let odds_value = (obj && obj.odds_value) || 1;
        // 此处乘以100然后除以100是为了保证精度
        series_odds = ((Math.floor(odds_value / 1000)) / 100) * series_odds;
      });
      // 此处乘以100然后除以100是为了保证精度
      return ((Math.floor(series_odds * 100)) / 100).toFixed(2);
    }
    /**
     * @description: 获取串关个数
     * @param {undefined} undefined
     * @return {String} 个数
     */
    const count = () => {
      let count = _.get(BetData.bet_s_obj, `${id}.cs.count`);
      if (count) {
        return `${count}`;
      }
      return '';
    }
    /**
     * @description: 最大值
     * @param {undefined} undefined
     * @return {String}
     */
    const max_money = () => {
      let max_money = _.get(BetData.bet_s_obj, `${id}.cs.max_money`);
      if (max_money) {
        return `${max_money}`;
      }
      return '';
    }
    /**
     * @description: 最小值
     * @param {undefined} undefined
     * @return {String}
     */
    const min_money = () => {
      let min_money = _.get(BetData.bet_s_obj, `${id}.cs.min_money`);
      if (min_money) {
        return `${min_money}`;
      }
      return '';
    }
    /**
     * @description: 金额是否为空
     * @param {undefined} undefined
     * @return {Boolean}
     */
    const is_empty_money = () => {
      let is_empty_money_ = money == null;
      // 金额为空
      view_ctr_obj.is_empty_money = is_empty_money_;
      return is_empty_money_;
    }

    return {
      ...toRefs(data)
    }
  }
})


