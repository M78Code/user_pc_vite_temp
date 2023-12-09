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
// #TODO mixins
// import common from 'src/base-h5/vr/mixin/constant/module/common.js'
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { get_now_server } from 'src/core/utils/common/module/other.js'
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "virtual-sports-timer",
  // components:{
  //   'virtual-sports-category':virtual_sports_category,
  //   'match-tab':matchTab,
  //   'v-s-match-list':v_s_match_list,
  //   'ranking-list-start':ranking_list_start,
  //   'football-ranking-list':football_ranking_list,
  //   'group-knockout':group_knockout,
  //   'virtual-sports-tab':virtualSportsTab,
  //   'virtual-sports-stage':virtual_sports_stage,
  //   'dynamic-ranking': dynamic_ranking,
  //   'result-page': result_page,
  //   noData,
  //   'virtual-skeleton':virtual_skeleton,
  // },
  props:{
    // ms:Number, // 指定毫秒数后开赛
    mid:Number|String,// 赛事id
    title:String,
    match:Object,
    source:String,
  },
  
  setup(props, evnet) {
    const allData = reactive({
      start_second:null,
      timer_format:'',
      is_last_circle:false,
      start:null,
      timer_mid_map:{},
      path_d:'',
      strokeColor: false,
      strokeBgColor: 'rgba(255,255,255,.2)'
    })
    let timer_super31 = 0;

    onMounted(() => {
      draw_timer_by_second();
    })

    onUnmounted(() => {
      clearTimeout(timer_super31);

      // #TODO 
      // for (const key in $data) {
      //   $data[key] = null
      // }
    })

    watch(
      () => props.mid,
      () => {
        allData.start = null;
        draw_timer_by_second();
      }
    );

    /**
     * 保留三位小数
     * @param {number} number 需要转换的数字
     */
    const to_fixed = (number) => {
      return parseInt(number * 1000) / 1000
    };
    /**
     * @Description 获取圆弧路径
     * @param {number} time 剩余时间毫秒
     * @param {undefined} undefined
    */
    const get_path_d = (time) => {
      let angle = (1 - to_fixed(time % 60000 / 60000)) * 360
      let width = 3.4
      let width_half = width / 2
      let r = 50 - width_half
      let x = to_fixed(Math.sin(angle * 0.01745) * r + 50)
      let y = to_fixed(50 - Math.cos(angle * 0.01745) * r)
      let is_big = angle > 180 ? 0 : 1
      return `M ${x} ${y} A ${r} ${r} 0 ${is_big} 1 50 ${width_half}`
    };
    /**
     * @Description 获取圆弧路径背景
     * @param {undefined} undefined
    */
    const get_path_background_d = () => {
      let angle = (1 - .999) * 360
      let width = 3.4
      let width_half = width / 2
      let r = 50 - width_half
      let x = to_fixed(Math.sin(angle * 0.01745) * r + 50)
      let y = to_fixed(50 - Math.cos(angle * 0.01745) * r)
      let is_big = angle > 180 ? 0 : 1
      return `M ${x} ${y} A ${r} ${r} 0 ${is_big} 1 50 ${width_half}`
    };
    /**
     * 每10毫秒绘制时钟
     * @return {Undefined}Undefined
     */
    const draw_timer_by_second = () => {
      if(!props.match || !props.match.mgt || !props.match.mid){
        return;
      }
      let ms = Number(props.match.mgt) - get_now_server();
      let single_circle = 60 * 1000;
      let now = get_now_server();
      if(allData.start == null) allData.start = now;
      //最初时间(用于计算总圈数)
      let timer_key = `virtual-sports-timer`;

      let f_t_m_s = null;
      let first_time_ms = sessionStorage.getItem(timer_key);
      if(first_time_ms){
        let cache = JSON.parse(first_time_ms);
        if(cache[props.mid]){
          f_t_m_s = cache[props.mid] * 1;
        }
      }
      if(!f_t_m_s){
        let dict = {};
        dict[props.mid] = ms;
        sessionStorage.setItem(timer_key,JSON.stringify(dict));
        f_t_m_s = ms;
      }

      //剩余时间
      let remaining_time = ms;
      //剩余圈数
      let remain_circle = Math.ceil(remaining_time / single_circle);

      allData.is_last_circle = false;
      if(remain_circle == 1){
        allData.strokeColor = true
        allData.is_last_circle = true;
      }

      //时钟毫秒数
      let seconds_ms = remaining_time % single_circle;
      if(seconds_ms < 0) {
        // #TODO emit事件
        // $emit("time_ended",mid);
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
      allData.timer_format = `${minutes_format}'${seconds_f_format}"`;
      allData.path_d = get_path_d(remaining_time);
      if(remaining_time < 1000){
        // #TODO emit事件
        // $emit("time_ended",mid);
        return;
      }
      timer_super31 = setTimeout(() => {
        draw_timer_by_second.call();
        let seconds = Math.floor(remaining_time / 1000);
        //提前10秒通知锁盘
        if(seconds <= 10 && !(seconds % 3)){
          // #TODO emit事件
          useMittEmit(MITT_TYPES.EMIT_ARRIVED10, {
            mid:props.match.mid,
            batchNo:props.match.batchNo
          });
        }
      },10);
    };
    return {
      ...toRefs(allData),
      to_fixed,
      get_path_d,
      get_path_background_d,
      draw_timer_by_second
    }
  }
});

</script>

<style lang="scss" scoped>
.v-s-timer {
  min-width: 1.06rem;
  height: 1.06rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.38rem;

  .v-timer-inner {
    width: 1rem;
    height: 1rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    line-height: 1;

    position: relative;

    .timer-format {
      // color: #ffb001;
      font-size: 0.24rem;

      &.last {
        // color: #E23E3E;
      }
    }
  }

  .graphic-wrapper {
    width: 1.06rem;
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
src/core/utils/common/module/other.js