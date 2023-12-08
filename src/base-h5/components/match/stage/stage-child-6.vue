<!--
 * @Author: Supermark
 * @Date: 2020-09-16 16:19:05
 * @Description: 详情页显示美式足球赛事第几节以及赛事时间
-->
<template>
  <!-- 美式足球 -->
  <span class='stage_child_6'>
    <!-- 美足赛事阶段 -->
    {{i18n_t('mmp')[6][detail_data_mmp]}}
    <!-- mlet的值控制是否显示倒计时 为空不显示 -->
    <template v-if="detail_data.mlet != ''">
      <!-- 赛事计时器 -->
      <span  v-if="mmp_arr.includes(detail_data.mmp) && showTime > 0" >&nbsp;&nbsp;{{ $filters.format_mgt_time(showTime) }}</span>
      <!-- 前端做兼容处理 赛事阶段未开赛+赛事状态进行中 默认显示每节赛事的时间 -->
      <span  v-if="detail_data.mmp == '0' && detail_data.ms == 1 ">&nbsp;{{detail_data.mlet}}</span>  
    </template>
  </span>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";
// import { format_mgt_time } from "src/output/index.js"
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";

export default {
  // mixins: [msc],
  name: 'stage_child_6',
  data(){
    // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
    return {
      // 显示比赛时间的阶段
      mmp_arr:['13','14','15','16',"40","301","302","303"],
      // 赛事进行时间
      showTime: '',
      // 业务为局间休息(前端展示为赛事阶段)
      mmp_arr1:["301","302","303"]
    }
  },
  watch: {
    detail_data:{
      // 比赛的时候，更新mst时间
      handler(n, o){
        if( this.mmp_arr.includes(n.mmp) ){ 
          let num = 0;
          if(n.c_time){ num = (new Date().getTime() - n.c_time) / 1000 }
          // 重置时间
          this.init_rest_time(num);
        }else{
          this.init_rest_time(0);
        }
      },
      deep: true,
    }
  },
  props: ["detail_data","dialog"],
  computed:{
    /**
     *@description 美足赛事阶段显示
     *@param {Undefined}
     *@return {String} 赛事阶段 
     */
    detail_data_mmp(){
      // 前端做兼容处理 赛事阶段未开赛+赛事状态进行中 默认显示第一节
      if(this.detail_data.mmp == '0' && this.detail_data.ms == 1){
        // mmp=13 代表第一节
        return '13';
      }else{
        return this.detail_data.mmp
      }
    }
  },
  created(){
    // 时间延时器
    this.showTimeInterval = 0;
    this.init_event();
    // let { off: off_ } = useMittOn(MITT_TYPES.EMIT_UPDATE_GAME_TIME, init_event);
  },
  destroyed(){
    this.clear_time_obj();
    // off_()
  },
  methods: {
    /**
     *@description 判断美式足球赛事阶段:暂停||开始
     *@param {Undefined}
     *@return {Undefined}
     */
    init_event(){
      // 赛事暂停且不是休息的状态 mess:开始和暂停状态 1-start  0-stop
      if(this.detail_data.mess == 0 && !this.mmp_arr1.includes(this.detail_data.mmp)){
        // 赛事时间
        this.showTime = Number(this.detail_data.mst);
        // 保存当前比赛时间
        this.save_page_time();
      }else{
        this.init_rest_time(0);
      }
    },
    /**
     *@description 重置时间
     *@param {Number} 赛事时间 
     *@return {Undefined}
     */
    init_rest_time(num){
      // 清除相关倒计时;
      if(this.showTimeInterval){ clearInterval(this.showTimeInterval) }
      // 显示比赛时间的阶段且时间静止不动 因为是在赛事休息阶段
      if(this.mmp_arr1.includes(this.detail_data.mmp)){
        this.showTime = 900;
        this.save_page_time();
      }else if(this.mmp_arr.slice(0,5).includes(this.detail_data.mmp)){
        // 比赛进行阶段
        this.calculagraph(num);
      }
    },
    /**
     *@description 时间倒计时
     *@param {Number} 赛事时间
     *@return {Undefined}
     */
    calculagraph(num){
      if(Number(this.detail_data.mst) - Number(num) <= 0 ){
        clearInterval(this.showTimeInterval);
        this.showTime = 0;
      }else{
        this.showTime = Number(this.detail_data.mst) - Number(num);
      }
      // 保存当前比赛时间
      this.save_page_time();
      // 赛事时间自减1S
      this.showTimeInterval = setInterval(() => {
        if(this.showTime <= 0){
          clearInterval(this.showTimeInterval);
          this.showTime = 0;
        }else if(this.detail_data.mess == 1){
          this.showTime -= 1;
        }
        this.save_page_time();
      }, 1000);
    },
    /**
     *@description 保存当前比赛时间
     *@param {Undefined}
     *@return {Undefined}
     */
    save_page_time(){
      if(this.dialog) return;
      useMittEmit(MITT_TYPES.EMIT_SET_MATCH_TIME, Number(this.showTime));
    },
    /**
     *@description 组件销毁时清除时间自增方法
     *@param {Undefined}
     *@return {Undefined}
     */
    clear_time_obj(){
      if(!!this.showTimeInterval){
        clearInterval(this.showTimeInterval)
        this.showTimeInterval = null
      }
    }
  },
}
</script>

<style lang="scss" scoped></style>
