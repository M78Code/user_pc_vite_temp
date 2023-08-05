<template>
  <div class="dynamic-main rank">
    <virtual-sports-d-r-timer v-for="(match,i) of virtual_match_list" :key="i" :match="match"
      :team_list="match.teams">      
    </virtual-sports-d-r-timer>
  </div>
</template>

<script>
import virtual_sports_d_r_timer from "project_path/pages/virtual/virtual_sports_part/virtual_sports_d_r_timer.vue"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name:'dynamic_ranking',
  props:{
    virtual_match_list:Array
  },
  components:{
    'virtual-sports-d-r-timer':virtual_sports_d_r_timer
  },
  
  setup(props, evnet) {}
})
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
