<!--
 * @Description: 中立场赛事展示
-->
<template>
  <div class="team-text">
    <!-- mng 是否中立场 1:是中立场，0:非中立场 --- 仅足球 -->
    <span class="style_icon" v-if="detail_data.mng == 1">
      <img  src="image/wwwassets/bw3/svg/zhonglichang.svg" alt />
    </span>
    <span v-if="detail_data.ms != 110" class="base-header-font">
      <!-- 赛事阶段 1、足球；2、篮球；3、棒球；4、冰球；5、网球；6、美足； 7、斯诺克； 8、乒乓球；9、排球； 10、羽毛球； 11、手球； 12、拳击； 13、沙滩排球 -->
      <!-- <match-stage :detail_data="detail_data"></match-stage> -->
    </span>
  </div>
</template>

<script>
// import match_stage from "src/project/components/match/match_stage.vue";   // 下拉列表赛事时间展示
import { defineComponent, reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "team_text",
  props: ["detail_data"],
  components: {
    // "match-stage": match_stage
  },
  setup(props, evnet) {
    const data = reactive({

    });
    onUnmounted(() => {
      clearInterval(vsport_ctr.interval_id)
    })
    return {}
  }
})
</script>

<style lang="scss" scoped>
.team-text {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.style_icon {
  position: relative;
  top: 0.14rem;
  margin-right: 0.05rem;

  img {
    width: 0.12rem;
  }
}

.base-header-font {
  position: relative;
  font-size: 0.12rem;
  color: var(--q-gb-t-c-1);
  letter-spacing: 0;
  top: 0.12rem;
}
</style>
