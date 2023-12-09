<!--
 * @Author: Supermark
 * @Date: 2020-06-07 10:59:08
 * @Description: 详情页手球赛事阶段+赛事时间
-->
<template>
  <!-- 手球 -->
  <span class='stage_child_11'>
    <span v-if="match_result_state">
      {{i18n_t('match_info.match_over')}}
    </span>
    <span v-else>
      {{i18n_t('mmp')[11][detail_data.mmp]}}
      <!-- 计时器 -->
      <span  v-if="mmp_arr.includes(detail_data.mmp) && showTime != 0">&nbsp;{{ $filters.format_mgt_time(showTime) }}</span>
      <span  v-if="detail_data.mmp == '0'">&nbsp;&nbsp;00:00</span>
    </span>
  </span>
</template>

<script>
// import { mapGetters } from "vuex"
// import msc from "src/public/mixins/common/msc.js";
// import { format_mgt_time } from "src/output/index.js"
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";

export default {
  // mixins: [msc],
  name: 'stage_child_11',
  data(){
    // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js 
    return {
      // 显示比赛时间
      mmp_arr:['6','7','41','42'],
      // 时间
      showTime: '',
      // 上下半场
      mmp_arr1:["31", "33"],
    }
  },
  watch: {
    detail_data:{
      handler(n, o){
        if( this.mmp_arr.includes(n.mmp) ){ // 比赛的时候，更新mst时间;
          let num = 0;
          if(n.c_time){ num = (new Date().getTime() - n.c_time) / 1000 }
          this.initRestTime(num);
        }else{
          this.initRestTime(0);
        }
      },
      deep: true,
    }
  },
  computed: {
    // ...mapGetters(['get_menu_type']),
    match_result_state(){
      return this.detail_data.ms == 3 || this.detail_data.ms == 4 || this.detail_data.mo == 1
    }
  },
  props: ['detail_data',"dialog"],

  created(){
    // 时间延时器
    this.showTimeInterval = 0;
    this.initEvent();
    // let { off: off_ }(MITT_TYPES.EMIT_UPDATE_GAME_TIME, initEvent);
  },
  destroyed(){
    this.clearTimeObj();
    // off_()
  },
  methods: {
    /**
     *@description 判断赛事状态:暂停||开始
     *@param {Undefined}
     *@return {Undefined}
     */
    initEvent(){
      // mess 0:暂停 1:开始
      if(this.detail_data.mess == 0 && !this.mmp_arr1.includes(this.detail_data.mmp)){
        this.showTime = Number(this.detail_data.mst);
        this.savePageTime();
      }else{
        this.initRestTime(0);
      }
    },
    /**
     *@description 重置时间
     *@param {Number} 赛事进行时间
     *@return {Undefined}
     */
    initRestTime(num){
      // 清除相关倒计时;
      if(this.showTimeInterval){ clearInterval(this.showTimeInterval) }
      // 比赛进行时; 6, 上半场， 7，下半场, 41 加时赛上半场， 42 加时下半场；
      if(this.detail_data.mmp == '6' || this.detail_data.mmp == '7' || this.detail_data.mmp == '41' || this.detail_data.mmp == '42'){
         this.calculagraph(num);
      }
    },
    /**
     *@description 时间正计时
     *@param {Number} 赛事进行时间
     *@return {Undefined}
     */
    calculagraph(num){
      this.showTime = Number(this.detail_data.mst) + Number(num);
      this.savePageTime();
      this.showTimeInterval = setInterval(() => {
        this.showTime += 1;
        this.savePageTime();
      }, 1000);
    },
    /**
     *@description 保存当前比赛时间
     *@param {Undefined}
     *@return {Undefined}
     */
    savePageTime(){
      if(this.dialog) return;
      useMittEmit(MITT_TYPES.EMIT_SET_MATCH_TIME, Number(showTime));
    },
    /**
     *@description 清除计时器
     *@param {Undefined}
     *@return {Undefined}
     */
    clearTimeObj(){
      if(!!this.showTimeInterval){
        clearInterval(this.showTimeInterval)
        this.showTimeInterval = null
      }
    }
  },
}
</script>

<style lang="scss" scoped></style>
