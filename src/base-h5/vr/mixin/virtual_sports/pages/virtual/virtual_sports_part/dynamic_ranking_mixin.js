/*
 * @Description: 赛马进行中的动态排名
 */
import virtual_sports_d_r_timer from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_d_r_timer.vue"
export default {
  name:'dynamic_ranking',
  props:{
    virtual_match_list:Array
  },
  components:{
    'virtual-sports-d-r-timer':virtual_sports_d_r_timer
  },
}