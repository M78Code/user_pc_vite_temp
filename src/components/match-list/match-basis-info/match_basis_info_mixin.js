/*
 * @Author: Cable
 * @Date: 2021-09-09 12:30
 * @Description: 赛事基础信息mixin
 */

import { reactive, computed } from 'vue';
import details from "src/core/match-list/details-class/details.js";
import { t } from "src/boot/i18n";
import { is_eports_csid } from "src/core/utils/utils";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import store from 'src/store-redux/index.js'
import { mapGetters} from "vuex"
let state = store.getState();
;


export default {
  props: {  
    match: {
      type: Object,
      default: () => {}
    },
  },
  setup(props) {
    //全局开关
    const get_global_switch = reactive(state.globalReducer.global_switch)
    
    const handicap_num = computed(() => {
      if(get_global_switch.value.handicap_num){
        return `+${ props.match.mc || 0}`
      }else{
        return t('match_info.more')
      }
    })

    /**
     * @description 跳转至详情
     */
    const on_go_detail = () => {
      if(is_eports_csid(props.match.csid)){
        props.match.go_detail_type = 'no_switch'
      }
      details.on_go_detail(props.match);
    }
    /**
     * @Description 赛事收藏 
     * @param {undefined} undefined
    */
    const collect = () => {
      useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_MATCH,props.match)
    }

    return {
      get_global_switch,
      handicap_num,
      collect,
      on_go_detail
    }
  },
};