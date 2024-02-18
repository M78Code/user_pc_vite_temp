/*
 * @Description: 虚拟体育新手版投注项
 */
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
// import odds_conversion from "src/base-h5/vr/mixin/odds_conversion/odds_conversion.js"
import { compute_value_by_cur_odd_type } from "src/output/index.js";
import BetData from "src/core/bet/class/bet-data-class.js"

export default {
  // mixins:[odds_conversion],
  data(){
    return {
      BetData
    }
  },
  props:{
    ol_item:Object,
    hl_item:Object,
    match_invalid:Boolean,
    // mhs 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
    match:Object,
    is_vr_lock: Boolean //用来控制vr投注项提前10s封盘 
  },
  methods:{
    get_odd_value(ol_item){
      let r = "";
      if(ol_item.result === "0" || ol_item.result === 0 || ol_item.result){
        r = i18n_t(`virtual_sports.result[${ol_item.result}]`);
      }
      else{
        r = this.odds_value;
      }
      return r;
    }
  },
  computed:{
    // ...mapGetters(['get_bet_list']),
    get_bet_list(){ return [] },
    /**
     * @description: 计算最终显示的赔率
     * @param {Undefined} Undefined
     * @return {number} 最终显示的赔率
     */
    odds_value(){
      let ov = this.ol_item.ov,
        hsw = this.hl_item ? this.hl_item.hsw : 0,
        csid = lodash.get(this.ol_item,'_csid'),
        hpid = lodash.get(this.ol_item,'_hpid');
      let r1 = compute_value_by_cur_odd_type(ov, hpid, hsw, csid);
      return r1 || '';
    },
  }
}
