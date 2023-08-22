/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关信息组件 mixin
 */

export default {
  name: "bet-mix-info",
  props: {
   
  },
  computed: {
   
  },
  methods: {
  
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
