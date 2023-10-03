<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页下滑动置顶title栏-篮球的赛事时间
-->
<template>
  <!-- 篮球 -->
  <span class="dialogStage_2">
    <span v-if="detail_data.ms == 110">
      {{i18n_t(`ms[${detail_data.ms}]`)}}
    </span>
    <span v-else>
      {{i18n_t('mmp')[2][detail_data.mmp]}}
      <!-- 计时器 -->
      <span v-if="mmp_arr_base.includes(detail_data.mmp) && match_time_dt > 0" >&nbsp;&nbsp;<span>{{ $filters.format_mgt_time(match_time_dt) }}</span></span>
    </span>    
  </span>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";
export default {
  // mixins: [msc],
  name: 'dialogStage_2',
  data(){
    return {
      mmp_arr_base: ['1','2','13','14','15','16','40','301','302','303','31','21'],
      mmp_arr:['1','2','13','14','15','16','40'], // 显示比赛时间
      mmp_arr1:['301', '302', '303', '31'], // 赛间休息;      
    }
  },
  props: ['detail_data','match_time_dt'],
}
</script>

<style lang="scss" scoped>
</style>
