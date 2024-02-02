<!--
 * @Author: Supermark
 * @Date: 2020-06-07 10:59:08
 * @Description: 详情页显示足球赛事第几节以及赛事时间
-->
<template>
  <!-- 足球 -->
  <div class='stage_child_1'>
    <span v-if="match_result_state">
      {{i18n_t('match_info.match_over')}}
    </span>
    <div v-else class="counting-main" >
       <span class="counting-title">{{i18n_t('mmp')[1][detail_data.mmp]}}</span> 
      <!-- 计时器 222-->
      <CountingDown v-if="![31].includes(+detail_data.mmp)" ref="counting-down-second" :title="mmp_map_title" :mmp="detail_data.mmp"
        :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+detail_data.csid)" :m_id="detail_data.mid"
        :second="detail_data.mst" :match="detail_data">
      </CountingDown>
      <!-- <span  v-if="mmp_arr.includes(detail_data.mmp) && showTime != 0">&nbsp;{{ counting_time_ctr_show_format_ouzhou(detail_data, format_mgt_time(showTime)) }}</span>
      <span  v-if="detail_data.mmp == '0'">&nbsp;&nbsp;{{ counting_time_ctr_show_format_ouzhou(detail_data, '00:00')}}</span> -->
      </div>
  </div>
</template>
<script setup>
  import { format_mgt_time } from "src/output/index.js"
  import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
  import CountingDown from 'src/base-h5/components/common/counting-down.vue';
  import matchListClass from 'src/core/match-list-h5/match-class/match-list.js'
// import { format_mgt_time } from "src/output/index.js";
  import { ref,watch,computed,onMounted ,onUnmounted } from "vue";
  const props = defineProps({
    detail_data: {
      type: Object,
      default: {}
    },
    dialog: {
      type: Boolean,
      default: false
    }
  })
    // 计时器步长
    const step = ref(1) 
    // 显示比赛时间
    const mmp_arr = ['6','7','41','42']
    // 时间
    const showTime = ref('') 
    // 上下半场
    const mmp_arr1 = ["31", "33"]
    // 延时器
    const showTimeInterval = ref(null)

    const mmp_map_title = ref('')

  watch(() => props.detail_data, (n, o) => {
    mmp_map_title.value = matchListClass.match_period_map(props.detail_data);
    if(mmp_arr.includes(n.mmp) ){ // 比赛的时候，更新mst时间;
      let num = 0;
      if(n.c_time){ num = (new Date().getTime() - n.c_time) / 1000 }
      initRestTime(num);
    }else{
      initRestTime(0);
    }
})
const match_result_state = computed( () => {
  return props.detail_data.ms == 3 || props.detail_data.ms == 4 || props.detail_data.mo == 1
})
onMounted(() => {
  // mess 0:暂停 1:开始
  if(props.detail_data.mess == 0 && !mmp_arr1.includes(props.detail_data.mmp)){
    showTime.value = Number(props.detail_data.mst);
    savePageTime();
  }else{
    initRestTime(0);
  }
  // 时间延时器
    initEvent();
    useMittOn(MITT_TYPES.EMIT_UPDATE_GAME_TIME, initEvent);
})
onUnmounted(() => {
  clearTimeObj();
})

 /**
   *@description 判断赛事状态:暂停||开始
    *@param {Undefined}
    *@return {Undefined}
    */
  const initEvent = () => {
    // mess 0:暂停 1:开始
    if(props.detail_data.mess == 0 && !mmp_arr1.includes(props.detail_data.mmp)){
      showTime.value = Number(props.detail_data.mst);
      savePageTime();
    }else{
      initRestTime(0);
    }
  }
  /**
   *@description 重置时间
    *@param {Number} 赛事进行时间
    *@return {Undefined}
    */
  const initRestTime = (num) => {
    // 清除相关倒计时;
    if(showTimeInterval.value){ clearInterval(showTimeInterval.value) }
    // 比赛进行时; 6, 上半场， 7，下半场, 41 加时赛上半场， 42 加时下半场；
    if(props.detail_data.mmp == '6' || props.detail_data.mmp == '7' || props.detail_data.mmp == '41' || props.detail_data.mmp == '42'){
        calculagraph(num);
    }
  }
  /**
   *@description 时间正计时
    *@param {Number} 赛事进行时间
    *@return {Undefined}
    */
  const calculagraph = (num) => {
    showTime.value = Number(props.detail_data.mst) + Number(num);
    savePageTime();
    showTimeInterval.value = setInterval(() => {
      showTime.value += step.value;
      savePageTime();
      // set_match_real_time(format_mgt_time(showTime))
    }, 1000);
  }
  /**
   *@description 保存当前比赛时间
    *@param {Undefined}
    *@return {Undefined}
    */
  const savePageTime = () => {
    if(props.dialog) return;
    useMittEmit(MITT_TYPES.EMIT_SET_MATCH_TIME, Number(showTime));
  }
  /**
   *@description 清除计时器
    *@param {Undefined}
    *@return {Undefined}
    */
  const clearTimeObj = () => {
    if(!!showTimeInterval.value){
      clearInterval(showTimeInterval.value)
      showTimeInterval.value = null
    }
  }
</script>



<style lang="scss" scoped>
.stage_child_1 {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(){
  .title-space-1{
    display: none;
    color:var(--q-gb-t-c-14) !important
  }
  .counting{
    color:var(--q-gb-t-c-14) 
  }
  .counting-down-wrap{
     margin-left: 0.05rem;
     width:0.4rem !important;
    //  margin-left: 0.2rem;
     position: relative !important;
  }
}
.counting-main{
  // margin-left: -0.3rem;
  display: flex;

}

// src/core/utils/common/index.jssrc/output/index.js
</style>
