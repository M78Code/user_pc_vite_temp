<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页同联赛的赛事即将开赛显示时间
-->
<template>
  <span class='show-start-time'>
    <span v-if="start_time" class="fz_12" style="font-weight:400">
      <!-- "after_time_start": "分钟后开赛", -->
      {{i18n_tc("list.after_time_start",[longTime])}}
    </span>
    <span v-else>
      {{ format_H_M(format_time_zone_time(+detail_data.mgt)) }}
    </span>
  </span>
</template>

<script>
import { format_time_zone_time, format_H_M } from "src/output/index.js"
import { i18n_tc } from "src/boot/i18n.js"
//国际化


export default {
  name: 'show_start_time',
  data(){
    return {
      // 赛事进行时间
      longTime: '',
      // 是否显示开赛时间
      start_time: false,
      
      format_time_zone_time,
      format_H_M,
      i18n_tc
    }
  },
  props: ["detail_data"],
  created(){
    // 时间延时器
    this.timerInterval = '';
    this.initEvent(); },
  beforeUnmount(){
    clearInterval(this.timerInterval);
    this.timerInterval = null
  },
  methods: {
    initEvent(){
      let now = new Date().getTime();
      let bool = Number(this.detail_data.mgt) - now < 3600 * 1000;
      let longTime = Math.floor( (+this.detail_data.mgt -now ) / 1000 / 60 );
      if( longTime == 0 ){
        longTime += 1;
      }
      // 判断开始时间小于本地时间 则不显示具体时间
      if( this.detail_data.mgt - now < 0 ){
        clearInterval(this.timerInterval);
        this.start_time = false;
      } else {
        this.start_time = bool;
      }
      this.longTime = longTime;

      this.timerInterval = setInterval(()=>{
        let now = new Date().getTime();
        if(+this.detail_data.mgt - now < 0 ){
          clearInterval(this.timerInterval);
          this.start_time = false;
        }
        let longTime = Math.floor( (+this.detail_data.mgt - now )/ 1000 / 60);
        if(longTime == 0){ longTime += 1; }
        this.longTime = longTime;
      }, 1000 * 1)
    }
  },
}
</script>

<style lang="scss" scoped>
.show-start-time {
  display: flex;
  justify-content: center;
}
</style>