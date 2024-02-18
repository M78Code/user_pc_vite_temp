/*
 * @Description: 虚拟体育时钟
 */
import { reactive } from 'vue'
import { get_now_server } from 'src/core/utils/common/module/other.js'
// import common from 'src/base-h5/vr/mixin/constant/module/common.js'
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"

export default {
  name: 'virtual_sports_timer',
  // mixins:[common],
  props:{
    // ms:Number, // 指定毫秒数后开赛
    mid:Number|String,// 赛事id
    title:String,
    match:Object,
    source:String,
  },
  data(){
    return {
      start_second:null,
      
      is_last_circle:false,
      start:null,
      timer_mid_map:{},
      path_d:'',
      strokeColor: false,//
      VR_CTR,
      timer_format: ''
    }
  },
  setup(props) {
    
  },
  created () {
    this.strokeBgColor='rgba(255,255,255,.2)';
    this.timer_super31 = 0;
  },
  mounted(){
    this.draw_timer_by_second();
  },
  methods:{
    /**
     * 保留三位小数
     * @param {number} number 需要转换的数字
     */
    to_fixed(number){
      return parseInt(number * 1000) / 1000
    },
    /**
     * @Description 获取圆弧路径
     * @param {number} time 剩余时间毫秒
     * @param {undefined} undefined
    */
    get_path_d(time){
      let angle = (1 - this.to_fixed(time % 60000 / 60000)) * 360
      let width = 3.4
      let width_half = width / 2
      let r = 50 - width_half
      let x = this.to_fixed(Math.sin(angle * 0.01745) * r + 50)
      let y = this.to_fixed(50 - Math.cos(angle * 0.01745) * r)
      let is_big = angle > 180 ? 0 : 1
      return `M ${x} ${y} A ${r} ${r} 0 ${is_big} 1 50 ${width_half}`
    },
    /**
     * @Description 获取圆弧路径背景
     * @param {undefined} undefined
    */
    get_path_background_d(){
      let angle = (1 - .999) * 360
      let width = 3.4
      let width_half = width / 2
      let r = 50 - width_half
      let x = this.to_fixed(Math.sin(angle * 0.01745) * r + 50)
      let y = this.to_fixed(50 - Math.cos(angle * 0.01745) * r)
      let is_big = angle > 180 ? 0 : 1
      return `M ${x} ${y} A ${r} ${r} 0 ${is_big} 1 50 ${width_half}`
    },
    /**
     * 每10毫秒绘制时钟
     * @return {Undefined}Undefined
     */
    draw_timer_by_second(){
      // console.log("draw_timer_by_second=========match========", this.match);
      if(!this.match || !this.match.mgt || !this.match.mid){
        // console.log('走进  !this.match || !this.match.mgt || !this.match.mid');
        return;
      }
      // let ms = Number(this.match.mgt) - get_now_server();
      let ms = Number(this.match.mgt) - get_now_server();
      // console.log("ms===========a///=", ms);
      let single_circle = 60 * 1000;
      // let now = get_now_server();
      let now = get_now_server();
      if(this.start == null) this.start = now;
      //最初时间(用于计算总圈数)
      let timer_key = `virtual-sports-timer`;

      let f_t_m_s = null;
      let first_time_ms = sessionStorage.getItem(timer_key);
      if(first_time_ms){
        let cache = JSON.parse(first_time_ms);
        if(cache[this.mid]){
          f_t_m_s = cache[this.mid] * 1;
        }
      }
      if(!f_t_m_s){
        let dict = {};
        dict[this.mid] = ms;
        sessionStorage.setItem(timer_key,JSON.stringify(dict));
        f_t_m_s = ms;
      }

      //剩余时间
      let remaining_time = ms;
      //剩余圈数
      let remain_circle = Math.ceil(remaining_time / single_circle);

      this.is_last_circle = false;
      if(remain_circle == 1){
        this.strokeColor = true
        this.is_last_circle = true;
      }

      //时钟毫秒数
      let seconds_ms = remaining_time % single_circle;
      if(seconds_ms < 0) {
        this.$emit("time_ended",this.mid);
        return;
      }

      //毫秒格式化为: 分钟'秒''
      let minutes = Math.floor(remaining_time / (1000 * 60));
      let sub_ms_r = remaining_time - minutes * 60 * 1000;
      let seconds_f = Math.floor(sub_ms_r / 1000);
      minutes = String(minutes);
      seconds_f = String(seconds_f);

      let minutes_format = minutes.padStart(2, '0');
      let seconds_f_format = seconds_f.padStart(2, '0');
      this.timer_format = `${minutes_format}:${seconds_f_format}`;
      this.$forceUpdate();
      // console.error("virtual_sports_timer.vue-> draw_timer_by_second() ->157)this.timer_format", `${minutes_format}:${seconds_f_format}`);
      // console.error("virtual_sports_timer.vue-> draw_timer_by_second() ->157)this.timer_format", this.timer_format);
      this.path_d = this.get_path_d(remaining_time);
      if(remaining_time < 1000){
        this.$emit("time_ended",this.mid);
        return;
      }
      this.timer_super31 = setTimeout(() => {
        this.draw_timer_by_second.call(this);
        let seconds = Math.floor(remaining_time / 1000);
        //提前10秒通知锁盘
        if(seconds <= 10 && !(seconds % 3)){
          useMittEmit(MITT_TYPES.EMIT_ARRIVED10, {
            mid:this.match.mid,
            batchNo:this.match.batchNo
          });
        }
      },100);
    },
  },
  watch:{
    mid(){
      this.start = null;
      this.draw_timer_by_second();
      VR_CTR.state.current_match_mid = this.mid;
    }
  },
  unmounted(){
    clearTimeout(this.timer_super31);

    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
}