<!--
 * @Description: 虚拟体育时钟
-->
<template>
  <div class="v-s-timer">
    <div class="v-timer-inner column justify-center items-center">
      <div class="timer-format" :class="{last:is_last_circle}">{{timer_format}}</div>
    </div>
    <div class="graphic-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="none" :d="get_path_background_d()" stroke-width="3.4" :stroke="strokeBgColor"></path>
      </svg>
    </div>
    <div class="graphic-wrapper circle-time-wrapper" :class="{'final-circle': strokeColor}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="none" :d="path_d" stroke-width="3.4"></path>
      </svg>
    </div>
    <div class="count-wrap" v-if="title">
      <div class="count">{{title}}</div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { get_now_server } from 'src/core/utils/common/module/other.js'
// import common from 'src/base-h5/vr/mixin/constant/module/common.js'
import VR_CTR from "src/base-h5/vr/utils/vsport/virtual_ctr.js"
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
    }
  },
  setup(props) {
    const state = reactive({timer_format: ''});
    return {
      ...state
    }
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
      },10);
    },
  },
  watch:{
    mid(){
      console.error("this.mid====>", this.mid);
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
</script>

<style lang="scss" scoped>
.v-s-timer {
  min-width: 1.1rem;
  height: 1.1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.38rem;
  .circle-time-wrapper svg path{
    stroke: var(--q-gb-t-c-35);
  }
  .final-circle {
      svg path {
        stroke: var(--q-gb-bd-c-8);
      }
    }

  .v-timer-inner {
    width: 1.05rem;
    height: 1.05rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    line-height: 1;

    position: relative;

    .timer-format {
      // color: #ffb001;
      font-size: 0.3rem;
      font-weight: 500;
      color: var(--q-gb-t-c-35) !important;
      &.last {
        // color: #E23E3E;
        color: var(--q-gb-bd-c-8) !important;
      }
    }
  }

  .graphic-wrapper {
    width: 1.1rem;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translateY(-50%) translateX(-50%) rotateZ(-90deg);
  }

  .count-wrap {
    position: absolute;
    left: 50%;
    bottom: -0.38rem;
    display: flex;
    justify-content: center;
    transform: translateX(-50%);

    .count {
      height: 0.3rem;
      line-height: 0.3rem;
      min-width: 0.8rem;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 0.1rem;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 0.15rem;
      font-size: 0.14rem;
      color: #F5F8FA;
      backdrop-filter: blur(5px);
      letter-spacing: 0.02rem;
    }
  }
}
</style>
