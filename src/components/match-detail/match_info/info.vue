<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事详情 比分面板
-->
<template>
  <div class="right_match_info">
    <!-- ms，0未开赛；1进行中；3完赛 110 即将开赛 -->
    <template v-if="[0, 110].includes(_.get(match_info,'ms')*1)">
      <before :match_info="match_info" :is_new="true" />
    </template>
    <template v-else>
      <!-- 足球 -->
      <template v-if="_.get(match_info, 'csid') == '1'">
        <football :right="right" :match_info="match_info" />
      </template>
      <!-- 2、篮球 6美足 -->
      <template v-else-if="['2','6'].includes(_.get(match_info, 'csid'))">
        <basketball :right="right" :match_info="match_info" />
      </template>
      <!-- 棒球 -->
      <template v-else-if="_.get(match_info, 'csid') == '3'">
        <baseball :match_info="match_info" :right="right" />
      </template>
      <!-- 3棒、4冰、5网、7斯诺克、8乒乓、9排球、10羽毛球、11手球、12拳击、13沙滩排球、16水球、15曲棍球、14橄榄球 -->
      <template v-else-if="['4','5','7','8','9','10','11','12','13','16','15','14'].includes(_.get(match_info,'csid'))">
        <more :match_info="match_info" :right="right" />
      </template>
      <!-- 电竞赛种 -->
      <template v-else-if="[1, 2, 3, 4].includes(_.get(match_info,'ms')*1) && $utils.is_eports_csid(match_info.csid)">
        <dota2 :match_info="match_info"></dota2>
      </template>
    </template>
  </div>
</template>

<script>
import football from "src/project/yabo/components/match_details/match_info/football/after.vue";
import basketball from "src/project/yabo/components/match_details/match_info/basketball/after";
import more from "src/project/yabo/components/match_details/match_info/more/after";
import baseball from "src/project/yabo/components/match_details/match_info/more/baseball_after";
import common_before from "src/project/yabo/components/match_details/match_info/animation_template/common_before";

import dota2_started from "src/project/yabo/components/match_details/match_info/dota2/dota2-started.vue"

export default {
  props: {
    match_info: Object,
    right: Boolean, // 判断当前是右侧还是中间
  },
  components: {
    football,
    basketball,
    more,
    baseball,
    before: common_before,
    dota2: dota2_started
  }
};
</script>
