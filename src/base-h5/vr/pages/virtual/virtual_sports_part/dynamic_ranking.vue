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
import dynamic_ranking_mixin from "src/base-h5/vr/mixin/virtual_sports/pages/virtual/virtual_sports_part/dynamic_ranking_mixin.js";
export default {
  mixins:[dynamic_ranking_mixin],
  name:'dynamic_ranking',
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
