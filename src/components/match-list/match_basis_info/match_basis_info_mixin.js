/*
 * @Author: Cable
 * @Date: 2021-09-09 12:30
 * @Description: 赛事基础信息mixin
 */

import details from "src/public/utils/detailsClass/details.js";
import { mapGetters} from "vuex"
export default {

  props: {  
    match: Object,
  },
  computed: {
    ...mapGetters({
      //全局开关
       get_global_switch:'get_global_switch'
    }),
    handicap_num(){
        if(this.get_global_switch.handicap_num){
            return `+${ this.match.mc || 0}`
        }else{
          return  this.$root.$t('match_info.more')
        }
    }
  },
  methods:{
    /**
     * 跳转至详情
     * @return {undefined} undefined
     */
    on_go_detail() {
      if(this.$utils.is_eports_csid(this.match.csid)){
        this.match.go_detail_type = 'no_switch'
      }
      details.on_go_detail(this.match);
    },
    /**
     * @Description 赛事收藏 
     * @param {undefined} undefined
    */
    collect(){
      this.$root.$emit(this.emit_cmd.EMIT_MX_COLLECT_MATCH,this.match)
    }
  }
};