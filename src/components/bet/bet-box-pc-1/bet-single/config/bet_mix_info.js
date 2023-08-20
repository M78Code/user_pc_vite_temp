/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关信息组件 mixin
 */
import { mapGetters, mapActions } from "vuex";
export default {
  name: "bet-mix-info",
  props: {
   
  },
  computed: {
    ...mapGetters({
      vx_get_bet_list: "get_bet_list",        // 获取串关列表(主要存入的是串关投注项id)
      vx_get_bet_s_list: "get_bet_s_list", //获取串关投注输入列表部分数据(主要存入的是串关输入部分的id如:2001,3001)
      vx_get_bet_obj: "get_bet_obj",  // 押注扁平化对象扁平
      vx_get_bet_s_obj: "get_bet_s_obj", // 串关对象扁平化
      vx_is_bet_single: "is_bet_single", //单关
    }),
  },
  methods: {
    ...mapActions({
      vx_bet_obj_add_attr: "bet_obj_add_attr"  // 添加串关投注项对象
    }),
    /**
     * @description: 获取投注项的oid
     * @param {Object} item 投注项对象
     * @return {String}
     */
    get_oid(item) {
      return BetCommonHelper.get_id( item); //根据oid或者坑位id获取投注项id
    }
  }
};
