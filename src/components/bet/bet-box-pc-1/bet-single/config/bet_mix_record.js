/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注记录
 */
// import betting from "src/public/mixins/betting/betting.js";
import { ref, reactive, onMounted, defineComponent, computed } from "vue"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetDataCtr from "src/core/bet/bet-data-ctr-class.js";
import _ from "lodash"

export default defineComponent({
  name: "bet-mix-item",
  mixins: [betting],
  props: {
    is_close: {
      type: Boolean,
      default: true
    }
  },
  setup(props, evnet) {

    /**
     * @description: 是否还有确认中的状态
     * @param {undefined} undefined 
     * @return {Boolean}  
     */
    const has_confirm_status = computed(() => {
      return _.findIndex(BetDataCtr.bet_order_success_all, item => item.orderStatusCode == 2) > -1;
    })
    // 总投注
    const allBetAmount = computed(() => {
      let count = 0
      BetDataCtr.bet_order_success_all.forEach(item => {
        count += Number(item.seriesBetAmount)
      })
      return count
    })
    //  预计总收益
    const all_max_win_amount = computed(() => {
      let count = 0
      BetDataCtr.bet_order_success_all.forEach(item => {
        count += Number(item.maxWinAmount)
      })
      return count
    })

    /**
    * @description: 监控是否还有确认中的状态
    * @param {Boolean} new_ 是否还有确认中的状态 
    * @return {undefined} undefined 
    */
    watch(
      () => has_confirm_status,
      (new_) => {
        if (!new_) {
          let success_count = 0; // 注单提交成功的个数
          let fail_count = 0; // 注单失败的个数
          _.forEach(BetDataCtr.bet_order_success_all, item => {
            if (item.orderStatusCode == 0) {
              fail_count++;
            } else if (item.orderStatusCode == 1) {
              success_count++;
            }
          });

          // 全部成功
          if (success_count == BetDataCtr.bet_order_success_all.length) {
            BetDataCtr.order_confirm_complete = 2;
            clearTimeout(BetDataCtr.timer_);
          }

          // 全部失败
          if (fail_count == BetDataCtr.bet_order_success_all.length) {
            BetDataCtr.order_confirm_complete = 3;
            clearTimeout(BetDataCtr.timer_);
          }
          // 有成功有失败的
          if (fail_count > 0 && success_count > 0 && ((fail_count + success_count) == BetDataCtr.bet_order_success_all.length)) {
            BetDataCtr.order_confirm_complete = 4;
            clearTimeout(BetDataCtr.timer_);
          }
        }
      })
  }
})