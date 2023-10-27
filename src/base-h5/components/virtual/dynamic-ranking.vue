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

<script steup>
import VirtualSportsDRTimer from "src/base-h5/components/virtual/virtual-sports-d-r-timer.vue"
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
