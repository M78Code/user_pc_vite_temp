<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 右侧详情区赛事统计图表面板
-->
 
<template>
  <div>
    <template v-if="lodash.get(match_info, 'csid') == '1'">
      <football :match_info="match_info" />
    </template>
    <template v-else-if="lodash.get(match_info, 'csid') == '2'&&lodash.get(match_info,'mle')!=73">
      <basketball :match_info="match_info" />
    </template>
    <!-- 3棒、4冰、5网、6美足、7斯诺克、8乒乓、9排球、10羽毛球 -->

    <!-- 3棒 -->
    <template v-else-if="lodash.get(match_info,'csid')=='3'">
      <baseball :match_info="match_info" />
    </template>

    <!-- 4冰、6美足、5网、7斯诺克、9排球、10羽毛球 -->
    <template v-else-if="['4','6','5','7','9','10'].includes(lodash.get(match_info,'csid'))">
      <more :match_info="match_info" />
    </template>
  </div>
</template>

<script>
import football from "src/components/match-detail/match_info/football/chart.vue";
// import basketball from "src/components/match-detail/match_info/basketball/chart";
// import more from "src/components/match-detail/match_info/more/chart";
// import baseball from "src/components/match-detail/match_info/animation_template/baseball_chart";
// import hockey_USAsoccer from "src/components/match-detail/match_info/animation_template/hockey_USAsoccer_chart";
export default {
  props: {
    match_info: Object
  },
  components: {
    football,
    // basketball,
    // more,//5网、7斯诺克、9排球、10羽毛球
    // baseball,
    // "hockey-USAsoccer":hockey_USAsoccer//冰球、美足模板
  }
};
</script>
