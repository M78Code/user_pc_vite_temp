<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情点击下拉-篮球联赛-显示当前赛事的时间
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
      <span v-if="mmp_arr_base.includes(detail_data.mmp) && match_time_dt > 0" >&nbsp;&nbsp;<span>{{$filters.format_mgt_time(match_time_dt) }}</span></span>
    </span>    
  </span>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";
// import { format_mgt_time } from "src/output/index.js"
export default {
  // mixins: [msc],
  name: 'dialogStage_2',
  data(){
    return {
      mmp_arr_base: ['1','2','13','14','15','16','40','301','302','303','31','21'],      
    }
  },
  props: ['detail_data','match_time_dt'],
}
</script>

<style lang="scss" scoped>
</style>
