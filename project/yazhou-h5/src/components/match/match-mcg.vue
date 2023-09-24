<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页开赛时间的展示组件
-->
<template>
  <span class="match_mcg">
    {{detail_data.mgt | format_M_D(this)}}
  </span>
</template>

<script>
import counting_down_start from 'src/project/components/common/counting_down_start.vue';
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: "match_mcg",
  data() {
    return {
      // 1 滚球,2 即将开赛,3 今日赛事,4 早盘
    };
  },
  props: ["detail_data"],
  components: {
    "counting-down-start": counting_down_start
  },
  methods: {
    // 页面赛事开赛时间对应消失后，详情状态变更;
    is_show_counting(bool) {
      if (!!bool) {
        useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS); // 刷新详情状态;
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>

