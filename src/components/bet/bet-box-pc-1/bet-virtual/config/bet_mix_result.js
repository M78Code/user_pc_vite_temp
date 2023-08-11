/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注结果
 */
import betting from "src/public/mixins/betting/betting.js";
export default {
  name: "bet-mix-result",
  mixins: [betting],
  data() {
    return {
      bet_result: '' // 投注结果
    }
  },
  props: {
    series_obj: {
      type: Object,
      default: {}
    },
    index: {
      type: Number,
      default: -1
    }
  },
  computed: {
    // 最高可赢额
    max_win_amount() {
      return (this.series_obj.maxWinAmount / 100).toFixed(2);
    }
  }
}