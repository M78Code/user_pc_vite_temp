<template>
  <div class="header-bottom">
    
    <!-- 动画+视频 按钮 收藏按钮 -->

    <team-match-icon :main_source="main_source" v-if="!['result_details', 'match_result'].includes(route.name)" :detail_data="detail_data"></team-match-icon>
    <!-- ms,赛事状态：0未开赛，1进行中，2暂停，3结束，4关闭; (mcg栏目类型：| mcg =1 滚球 | mcg=2 即将开赛| mcg=3 今日赛事| mcg=4 早盘) -->
    <span v-if="[1, 2, 3, 4].includes(+detail_data?.ms)  || detail_data?.mo == 1">
      <!-- 根据球类id: csid显示相应的比分详情 -->
      <match-score :detail_data="detail_data"></match-score>
    </span>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import teamMatchIcon from "src/base-h5/components/details/team-match-icon.vue"; // 动画和视频按钮的展示
import matchScore from "src/base-h5/components/match/match-score.vue"; // 详情页所有球种的细节比分展示条

const props = defineProps({
  detail_data: {
    type: Object,
    default: () => {},
  },
  main_source:{
    type: String,
    default: () => 'details',
  }
});
let route = useRoute();
</script>

<script>
export default defineComponent({
  name: "header_bottom",
});
</script>
<style lang="scss" scoped>
.header-bottom {
  overflow: hidden;
  height: 0.71rem;
  display: flex;
  flex-direction: column;
  justify-content: end;
  /*  高度 */
}


</style>
