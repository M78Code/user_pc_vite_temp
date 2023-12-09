<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页下滑动置顶title栏-足球的赛事时间
-->
<template>
  <!-- 足球 -->
  <span class='dialogStage_1'>
    <span v-if="detail_data.ms == 110">
      {{i18n_t(`ms[${detail_data.ms}]`)}}
    </span>
    <span v-else>
      {{i18n_t('mmp')[1][detail_data.mmp]}}
      <!-- 计时器 -->
      <span >
        <span v-if="mmp_arr.includes(detail_data.mmp)">&nbsp;&nbsp;{{counting_time_ctr_show_format(detail_data,$filters.format_mgt_time(match_time_dt))}}</span>
        <span v-if="detail_data.mmp == '0'">&nbsp;&nbsp;{{ counting_time_ctr_show_format(detail_data,'00:00')}}</span>    
      </span>
    </span>
  </span>
</template>

<script>
// import { mapGetters, mapMutations, mapActions } from "vuex"
// import msc from "src/public/mixins/common/msc.js";
import { counting_time_ctr_show_format } from 'src/core/format/common/index.js'
export default {
  // mixins: [msc],
  name: 'dialogStage_1',
  data(){
    return {
      mmp_arr:['6','7','41','42'], // 显示比赛时间        
    }
  },
  props: ['detail_data','match_time_dt'],

}
</script>

<style lang="scss" scoped>
</style>
src/core/utils/common/index.js