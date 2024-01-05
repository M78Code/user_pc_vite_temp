/*
 * @Author: 虚拟赛事时钟
 */
// import common from "src/base-h5/vr/mixin/constant/module/common.js"
export default {
  // mixins:[common],
  props:{
    match:Object,
    i_of_list:Number,
    current_match_i:Number,
  },
  data(){
    return {
      minutes:0,
      seconds:0
    }
  },
  watch:{
    //秒数
    'match.show_time'(c_time){
      this.minutes = c_time;
    }
  },
  methods:{
  }
}