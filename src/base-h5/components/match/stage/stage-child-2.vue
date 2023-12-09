<!--
 * @Author: Supermark
 * @Date: 2020-06-07 10:59:08
 * @Description: 详情页显示篮球赛事第几节以及赛事时间
-->
<template>
  <!-- 篮球 -->
  <div class="stage_child_2">
    <template v-if="detail_data.mle != 73">
      <span v-if="detail_data.mmp == '100'">
        <span v-if="(detail_data.mlet == '0' || detail_data.mle == '0') || (detail_data.mlet == '7' || detail_data.mle == '7')">
          <!-- 第四节 -->
          {{i18n_t('mmp')[2][1001]}}
        </span>
        <span v-if="(detail_data.mlet == '17' || detail_data.mle == '17')">
          <!-- 下半场 -->
          {{i18n_t('mmp')[2][1002]}}
        </span>
      </span>
      <span v-else-if="detail_data.mmp == 110">
        {{i18n_t(`ms[${detail_data.ms}]`)}}
      </span>
      <span v-else>
        {{i18n_t('mmp')[2][detail_data.mmp]}}
      </span>
      <!-- 计时器 -->
      <span  v-if="mmp_arr_base.includes(detail_data.mmp) && showTime >= 0" >&nbsp;&nbsp;<span v-if="showTime >=0">{{ $filters.format_mgt_time(showTime) }}</span></span>
    </template>
    <template v-else>
      <span>{{detail_data.ms==1?i18n_t('mmp.2.21'):i18n_t('mmp.2'+detail_data.mmp)}}</span>
      <span v-if="showTime > 0" >&nbsp;&nbsp;<span v-if="showTime > 0">{{ $filters.format_mgt_time(showTime) }}</span></span>
    </template>
  </div>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";
// import { format_mgt_time } from "src/output/index.js"
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import { i18n_t } from "src/boot/i18n.js";
export default {
  // mixins: [msc],
  name: "stage_child_2",
  data() {
    // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
    return {
      mmp_arr_base: ['1','2','13','14','15','16','40','301', '302', '303', '31','100'],
      // 显示比赛时间
      mmp_arr:['1','2','13','14','15','16','40'],
      // 赛间休息;
      mmp_arr1:['301', '302', '303', '31'],
      // 赛事时间
      showTime: '',
    };
  },
  watch: {
    detail_data:{
      handler(n, o){
        /**
         *@description 比赛的时候，更新mst时间
         *@param {String} 赛事阶段
         *@return {Undefined}
         */
        if(this.mmp_arr.includes(n.mmp) ){
          // 暂停  在篮球暂停时 ws推送的C102或者接口返回的cmec的值是事件编码 会出现很多种情况 不能作为附加的判断条件 只用判断mess的值即可
          if(n.mess == '0'){
            let num = 0;
            if(n.c_time){ num = (new Date().getTime() - n.c_time) / 1000 }
            this.clearTimeObj();
          // 开始
          }else if(n.mess == '1'){
            let num = 0;
            if(n.c_time){ num = (new Date().getTime() - n.c_time) / 1000 }
            this.initRestTime(num);
          }
        }else{
          this.initRestTime(0);
        }
      },
      deep: true,
    }
  },
  props: ["detail_data", "dialog"],
  components: {},
  created() {
    // 延时器
    this.showTimeInterval = 0;
    // mess 1:开始 0:暂停
    this.initEvent();
    // let {off: off_} = useMittOn(MITT_TYPES.EMIT_UPDATE_GAME_TIME, initEvent);
  },
  destroyed() {
    this.clearTimeObj();
 	//  off_()
  },
  methods: {
    /**
     *@description 判断赛事是暂停||开始
     *@param {Undefined}
     *@return {Undefined}
     */
    initEvent(){
      if(this.detail_data.mess == 0 && this.detail_data.cmec == "time_start" && !this.mmp_arr1.includes(this.detail_data.mmp)){
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
      // 比赛休息时间,显示下一节比赛时间初始化比赛休息时间
      if(this.detail_data.mmp == '301' || this.detail_data.mmp == '302' || this.detail_data.mmp == '303' || this.detail_data.mmp == '31'){
        // 根据mle 的值，来显示默认值的值；
        this.showTime = (this.detail_data.mlet == '0' || this.detail_data.mle == '0') ? 600 : (this.detail_data.mlet == '7' || this.detail_data.mle == '7') ? 720 : (this.detail_data.mlet == '17' || this.detail_data.mle == '17') ? 1200 : (this.detail_data.mlet == '64' || this.detail_data.mle == '64') ? 360 : (this.detail_data.mlet == '68' || this.detail_data.mle == '68') ? 300 : (this.detail_data.mlet == '70' || this.detail_data.mle == '70') ? 240 :'';
        this.savePageTime();
      }else if(this.detail_data.mmp == '1' || this.detail_data.mmp == '2' || this.detail_data.mmp == '13' || this.detail_data.mmp == '14' || this.detail_data.mmp == '15' || this.detail_data.mmp == '16' || this.detail_data.mmp == '40'||this.detail_data.mmp == '21'){
        // 进入比赛时;
        this.calculagraph(num);
      }
    },
    /**
     *@description 时间倒计时
     *@param {Number} 赛事进行时间
     *@return {Undefined}
     */
    calculagraph(num){
      this.showTime = Number(this.detail_data.mst) - Number(num);
      this.savePageTime();
      this.showTimeInterval = setInterval(() => {
        if(this.showTime <= 0){
          this.showTime = 0;
        }else{
          if(this.detail_data.mess == 0){
            clearInterval(this.showTimeInterval);
            this.showTime++;
          }
          this.showTime -= 1;
        }
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
      useMittEmit(MITT_TYPES.EMIT_SET_MATCH_TIME, Number(this.showTime));
    },
    /**
     *@description 清除时间倒计时
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
};
</script>

<style lang="scss" scoped></style>
