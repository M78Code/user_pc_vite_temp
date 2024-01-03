/*
 * @Description: 虚拟体育赛马,赛狗列表
 */
import VR_CTR from "src/base-h5/vr/utils/vsport/virtual_ctr.js"
import { useMittOn, MITT_TYPES } from "src/core/mitt/"
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5} from "src/output/index.js"
import { standard_edition } from 'src/base-h5/mixin/userctr.js'

export default {
  props:{
    virtual_match_list:Array,
    match_list_loaded:Number,
    v_menu_changed:Number | String,
    csid:Number | String,
  },
  data(){
    return{
      selected_match_i:0,
      v_match_hps:[],
      standard_odd_status:0,
      MatchDataBaseH5,
      standard_edition
    }
  },
  mounted() {
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS, this.odd_pan_handle).off,
    ]
  },
  unmounted(){
    this.emitters.map((x) => x());
  },
  methods:{
    // 设置玩法项默认选中
    set_details_item(data){ VR_CTR.state.details_item = data },
    /**
     * 切换赛事
     * @param {Number} i 赛事下标
     * @return {Undefined}
     */
    switch_match_handle(i){
      this.selected_match_i = i;
      this.$emit('switch_match',i);
    },
    /**
     * 赔率滑动状态
     */
    odd_pan_handle(status){
      this.standard_odd_status = status;
    },
  },
  watch:{
    v_menu_changed(){
      this.standard_odd_status = 0;
    },
    virtual_match_list(){
      if(!this.virtual_match_list || !this.virtual_match_list.length) return;
      this.v_match_hps = this.virtual_match_list[0].hps
      this.switch_match_handle(this.selected_match_i);
      this.$emit('switch_match',this.selected_match_i);
    }
  },
}