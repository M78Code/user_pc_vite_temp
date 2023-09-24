<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情点击下拉显示当前赛事的时间( stage_child_1 + stage_child_2 )
-->
<template>
  <div class="match-dialog-stage details-t-color5">
    <span v-if="['result_details', 'match_result'].includes($route.name)">
      {{i18n_t('match_info.match_end')}}
    </span>
    <!-- ms赛事状态：0:未开始 1:进行中 2:暂停 3:结束 4:关闭 -->
    <span v-else-if="detail_data.ms == 0">
      <!-- 未开赛显示赛事开赛时间 eg:12月12日 -->
      <span v-if="!one_hour">
        <!-- 显示示例：02/01 -->
        {{utils.format_time_zone(+detail_data.mgt).Format(i18n_t('time3'))}}
      </span>
    </span>
    <span v-else>
      <component :is="componentId" :detail_data="detail_data" :match_time_dt="match_time_dt"></component>
    </span>
  </div>
</template>

<script>
// import { mapGetters} from "vuex";
import { utils } from 'src/core/utils/index.js';
import stage_child_1 from "project_path/src/components/match/dialogStage/dialogStage-1.vue";  // 详情点击下拉-足球联赛-显示当前赛事的时间
import stage_child_2 from "project_path/src/components/match/dialogStage/dialogStage-2.vue";  // 详情点击下拉-篮球联赛-显示当前赛事的时间
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";

export default {
  name: "match_dialog_stage",
  data() {
    return {
      one_hour: false,
      match_time_dt:0, // 赛事时间
      utils
    };
  },
  computed: {
    // ...mapGetters(['get_menu_type']),
    componentId() {
      if (get_menu_type != 3000) {
        return `stage-child-${detail_data.csid}`;
      }
    }
  },
  props: ["detail_data"],
  components: {
    'stage-child-1': stage_child_1,
    'stage-child-2': stage_child_2,
  },
  let off_ = ''
  created() {
    initEvent()
    let {off: off_} = useMittOn(MITT_TYPES.EMIT_SET_MATCH_TIME, set_match_time); // 储存时间，保证时间同步;
  },
  methods: {
    initEvent(){
      let now = new Date().getTime();
      one_hour = Number(detail_data.mgt) - now < 3600 * 1000;
    },
    // 监听set_match_time事件，储存赛事时间
    set_match_time(time) {
      // time为需要储存的赛事时间
      match_time_dt = time;
    },
  },
  destroyed () {
    off_() // 清除储存时间
  },
};
</script>

<style lang="scss" scoped>

</style>
