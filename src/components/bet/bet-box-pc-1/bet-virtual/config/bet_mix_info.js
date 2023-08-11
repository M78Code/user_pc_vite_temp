/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关信息组件 mixin
 */
import { mapGetters, mapActions } from "vuex";
export default {
  name: "bet-mix-info",
  props: {
    view_ctr_obj: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters({
      vx_get_virtual_bet_list: "get_virtual_bet_list",//虚拟体育投注列表
      vx_get_virtual_bet_s_list: "get_virtual_bet_s_list"
    }),
  },
  methods: {
    ...mapActions({
      vx_bet_obj_add_attr: "bet_obj_add_attr"
    }),
    /**
     * @description: 获取投注项的oid
     * @param {Object} item 投注项对象
     * @return {String} 
     */
    get_oid(item) {
      return this.virtual_common.get_id(this, item);
    }    
  }
};