<template>
  <div class='header-bottom'>
    <!-- 动画+视频 按钮 收藏按钮 -->
    <team-match-icon v-if="!['result_details', 'match_result'].includes(route.name)"></team-match-icon>
    <!-- ms,赛事状态：0未开赛，1进行中，2暂停，3结束，4关闭; (mcg栏目类型：| mcg =1 滚球 | mcg=2 即将开赛| mcg=3 今日赛事| mcg=4 早盘) -->
    <span v-if="[1,2,3,4].includes(+detail_data.ms) || detail_data.ms == 0 || detail_data.mo == 1 ">
      <!-- 根据球类id: csid显示相应的比分详情 -->
      <!-- <match-score :detail_data="detail_data"></match-score> -->
    </span>
  </div>
</template>
<script>
// #TODO vuex
// import { mapGetters } from "vuex"
import team_match_icon from "src/components/details/team-match-icon/team-match-icon-template-1/team-match-icon.vue"  // 动画和视频按钮的展示
// import match_score from 'src/project/components/match/match_score.vue'  // 详情页所有球种的细节比分展示条

import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useRoute } from "vue-router"

let route = useRoute()
export default defineComponent({
  name: "header_bottom",
  props: {
    detail_data: {
      type: Object
    }
  },
  components: {
    "team-match-icon":team_match_icon,
    // "match-score": match_score,
  },
  setup(props, evnet) {
    const data = reactive({
      get_menu_type: "",
    });
    // #TODO vuex
    // computed: {
    //   ...mapGetters(["get_menu_type"])
    // },
    const get_menu_type = computed(() => {
      return ""
    })
    return {
      ...toRefs(data),
      ...toRefs(props),
      get_menu_type
    }
  }
})
</script>
<style lang="scss" scoped>
.header-bottom  {
  overflow: hidden;
  height: 0.71rem; /*  高度 */
}
</style>
