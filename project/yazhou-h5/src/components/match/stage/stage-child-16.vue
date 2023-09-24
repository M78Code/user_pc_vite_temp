<!--
 * @Author: Supermark
 * @Date: 2021-08-14 15:44:34
 * @Description: 详情页显示水球赛事第几节以及赛事时间
-->
<template>
  <!-- 水球 -->
  <div class="stage_child_16">
    <span v-if="detail_data.mmp == 110">
      {{i18n_t(`ms[${detail_data.ms}]`)}}
    </span>
    <span v-else>
      {{i18n_t('mmp')[16][detail_data.mmp]}}
    </span>
    <!-- 四节休息阶段显示每节总时间 -->
    <span v-if="mmp_arr1.includes(detail_data.mmp)">{{detail_data.mlet}}</span>
    <!-- 四节比赛阶段显示计时器 -->
    <span v-if="!mmp_arr1.includes(detail_data.mmp) && showTime > 0" >&nbsp;&nbsp;<span v-if="showTime > 0"><span v-html="i18n_t('detail.less')"></span>{{ showTime | format_min_time }}{{i18n_t("detail.mins")}}</span></span>
</div>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";

export default {
  // mixins: [msc],
  name: "stage_child_16",
  data() {
    // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
    return {
      // mmp_arr_base: ['13','14','15','16','301', '302', '303','100'],
      // 显示比赛时间
      mmp_arr:['13','14','15','16'],
      // 赛间休息;
      mmp_arr1:['301', '302', '303'],
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
        if( mmp_arr.includes(n.mmp) ){
          // 暂停  在水球暂停时 ws推送的C102或者接口返回的cmec的值是事件编码 会出现很多种情况 不能作为附加的判断条件 只用判断mess的值即可
          if(n.mess == '0'){
            let num = 0;
            if(n.c_time){ num = (new Date().getTime() - n.c_time) / 1000 }
            clearTimeObj();
          // 开始
          }else if(n.mess == '1'){
            let num = 0;
            if(n.c_time){ num = (new Date().getTime() - n.c_time) / 1000 }
            initRestTime(num);
          }
        }else{
          initRestTime(0);
        }
      },
      deep: true,
    }
  },
  props: ["detail_data", "dialog"],
  components: {},
  let off_ = ''
  created() {
    // 时间延时器
    showTimeInterval = 0;
    // mess 1:开始 0:暂停
    initEvent();
    let {off: off_} = useMittOn(MITT_TYPES.EMIT_UPDATE_GAME_TIME, initEvent);
  },
  destroyed() {
    clearTimeObj();
    off_()
  },
  methods: {
    /**
     *@description 判断赛事是暂停||开始
     *@param {Undefined}
     *@return {Undefined}
     */
    initEvent(){
      if(detail_data.mess == 0 && detail_data.cmec == "time_start" && !mmp_arr1.includes(detail_data.mmp)){
        showTime = Number(detail_data.mst);
        savePageTime();
      }else{
        initRestTime(0);
      }
    },
    /**
     *@description 重置时间
     *@param {Number} 赛事进行时间
     *@return {Undefined}
     */
    initRestTime(num){
      // 清除相关倒计时;
      if(showTimeInterval){ clearInterval(showTimeInterval) }
      // 比赛休息时间,显示下一节比赛时间初始化比赛休息时间
      if(detail_data.mmp == '301' || detail_data.mmp == '302' || detail_data.mmp == '303'){
        // 根据mle 的值，来显示默认值的值；
        showTime = (detail_data.mlet.split(":")[0] == '8' || detail_data.mle == '0') ? 480 :'';
        savePageTime();
      }else if(detail_data.mmp == '13' || detail_data.mmp == '14' || detail_data.mmp == '15' || detail_data.mmp == '16'){
        // 进入比赛时;
        calculagraph(num);
      }
    },
    /**
     *@description 时间倒计时
     *@param {Number} 赛事进行时间
     *@return {Undefined}
     */
    calculagraph(num){
      showTime = Number(detail_data.mst) - Number(num);
      savePageTime();
      showTimeInterval = setInterval(() => {
        if(showTime <= 0){
          clearInterval(showTimeInterval);
          showTime = 0;
        }else{
          showTime -= 1;
        }
        savePageTime();
      }, 1000);
    },
    /**
     *@description 保存当前比赛时间
     *@param {Undefined}
     *@return {Undefined}
     */
    savePageTime(){
      if(dialog) return;
      useMittEmit(MITT_TYPES.EMIT_SET_MATCH_TIME, Number(showTime));
    },
    /**
     *@description 清除时间倒计时
     *@param {Undefined}
     *@return {Undefined}
     */
    clearTimeObj(){
      if(!!showTimeInterval){
        clearInterval(showTimeInterval)
        showTimeInterval = null
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>
