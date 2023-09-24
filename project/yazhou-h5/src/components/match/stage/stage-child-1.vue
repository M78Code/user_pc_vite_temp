<!--
 * @Author: Supermark
 * @Date: 2020-06-07 10:59:08
 * @Description: 详情页显示足球赛事第几节以及赛事时间
-->
<template>
  <!-- 足球 -->
  <span class='stage_child_1'>
    <span v-if="match_result_state">
      {{i18n_t('match_info.match_over')}}
    </span>
    <span v-else>
      {{i18n_t('mmp')[1][detail_data.mmp]}}
      <!-- 计时器 -->
      <span  v-if="mmp_arr.includes(detail_data.mmp) && showTime != 0">&nbsp;{{ utils.counting_time_ctr_show_format(detail_data,format_mgt_time(showTime)) }}</span>
      <span  v-if="detail_data.mmp == '0'">&nbsp;&nbsp;{{ utils.counting_time_ctr_show_format(detail_data, '00:00')}}</span>
    </span>
  </span>
</template>

<script>
// import { mapGetters, mapMutations } from "vuex"
// import msc from "src/public/mixins/common/msc.js";  // 国际化比赛阶段比分转换工具
import { format_mgt_time } from "src/core/format/index.js"
import { utils } from 'src/core/utils/index.js';
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";

export default {
  // mixins: [msc],
  name: 'stage_child_1',
  data(){
    // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
    return {
      step:1, // 计时器步长
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
        if( mmp_arr.includes(n.mmp) ){ // 比赛的时候，更新mst时间;
          let num = 0;
          if(n.c_time){ num = (new Date().getTime() - n.c_time) / 1000 }
          initRestTime(num);
        }else{
          initRestTime(0);
        }
      },
      deep: true,
    }
  },
  computed: {
    // ...mapGetters(['get_menu_type']),
    match_result_state(){
      return detail_data.ms == 3 || detail_data.ms == 4 || detail_data.mo == 1
    }
  },
  props: ['detail_data',"dialog"],
  let off_ = ''
  created(){
    // 初始化修正设置步长
    step = utils.match_vr_step(detail_data,step);
    // C01赛事使用mstrc字段数据
    let mstrc = _.get(detail_data,'mstrc');
    if(_.get(detail_data,'cds')=='C01' && mstrc){
      detail_data.mst = mstrc;
    }
    // 时间延时器
    showTimeInterval = 0,
    initEvent();
    useMittOn(MITT_TYPES.EMIT_UPDATE_GAME_TIME, initEvent);
  },
  destroyed(){
    clearTimeObj();
    off_()
  },
  methods: {
    // ...mapMutations([
    //   'set_match_real_time'
    // ]),
    /**
     *@description 判断赛事状态:暂停||开始
     *@param {Undefined}
     *@return {Undefined}
     */
    initEvent(){
      let detail_data = detail_data;
      // mess 0:暂停 1:开始
      if(detail_data.mess == 0 && !mmp_arr1.includes(detail_data.mmp)){
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
      let detail_data = detail_data;
      // 清除相关倒计时;
      if(showTimeInterval){ clearInterval(showTimeInterval) }
      // 比赛进行时; 6, 上半场， 7，下半场, 41 加时赛上半场， 42 加时下半场；
      if(detail_data.mmp == '6' || detail_data.mmp == '7' || detail_data.mmp == '41' || detail_data.mmp == '42'){
         calculagraph(num);
      }
    },
    /**
     *@description 时间正计时
     *@param {Number} 赛事进行时间
     *@return {Undefined}
     */
    calculagraph(num){
      showTime = Number(detail_data.mst) + Number(num);
      savePageTime();
      showTimeInterval = setInterval(() => {
        showTime += step;
        savePageTime();
        set_match_real_time(format_mgt_time(showTime))
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
     *@description 清除计时器
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
}
</script>

<style lang="scss" scoped></style>
