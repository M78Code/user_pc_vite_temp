<!--
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
import dynamic_ranking_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/dynamic-ranking-mixin.js";
import virtual_sports_d_r_timer from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-d-r-timer.vue"
export default {
  mixins:[dynamic_ranking_mixin],
  name:'dynamic_ranking',
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