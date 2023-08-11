/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注结果
 */
import betting from "src/public/mixins/betting/betting.js";
import { mapGetters } from "vuex";
export default {
  name: "bet-mix-result",
  mixins: [betting],
  data() {
    return {
      bet_result: '' // 投注结果
    }
  },
  props: {
    series_obj: { //串关对象
      type: Object,
      default: {}
    },
    index: { //当前是第几个投注项
      type: Number,
      default: -1
    }
  },
  computed: {
    ...mapGetters({
      vx_get_theme: "get_theme"  // 主题色
    }),
    /**
     * @description: 最大最小值
     * @param {undefined} undefined 
     * @return {undefined} undefined 
     */
    max_win_amount() {
      return (this.series_obj.maxWinAmount / 100).toFixed(2);
    }
  }
}