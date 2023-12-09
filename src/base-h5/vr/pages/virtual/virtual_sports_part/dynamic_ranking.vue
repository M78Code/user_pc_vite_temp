<!--
 * @Author: Supermark
 * @Date: 2020-12-25 14:47:31
 * @Description: 赛马进行中的动态排名
-->
<template>
  <div class="dynamic-main rank">
    <virtual-sports-d-r-timer v-for="(match,i) of virtual_match_list" :key="i" :match="match"
      :team_list="match.teams">      
    </virtual-sports-d-r-timer>
  </div>
</template>

<script>
import virtual_sports_d_r_timer from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_d_r_timer.vue"
export default {
  name:'dynamic_ranking',
  props:{
    virtual_match_list:Array
  },
  components:{
    'virtual-sports-d-r-timer':virtual_sports_d_r_timer
  },
}
</script>

<style lang="scss" scoped>
/*************** 排名最后一个子元素开始 *************** -S*/
.dynamic-main {
  width: 100%;
  height: auto;
  margin-top: 0.08rem;
}

.dynamic-main :last-child {
  border-bottom: none;
}
</style>
