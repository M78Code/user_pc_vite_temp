<!--
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情点击下拉显示当前赛事的时间( stage_child_1 + stage_child_2 )
-->
<template>
  <div class="match-dialog-stage details-t-color5">
    <span v-if="['result_details', 'match_result'].includes($route.name)">
      {{ i18n_t('match_info.match_end') }}
    </span>
    <!-- ms赛事状态：0:未开始 1:进行中 2:暂停 3:结束 4:关闭 -->
    <span v-else-if="detail_data.ms == 0">
      <!-- 未开赛显示赛事开赛时间 eg:12月12日 -->
      <span v-if="!one_hour">
        <!-- 显示示例：02/01 .Format(i18n_t('time3')-->
        {{ formatTime(+detail_data.mgt, "mm/DD") }}
      </span>
    </span>
    <span v-else>
      <component
        :is="componentId"
        :detail_data="detail_data"
        :match_time_dt="match_time_dt"
      ></component>
    </span>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, defineComponent } from 'vue';
import { format_time_zone, formatTime } from 'src/output/index.js'
// import dialogStageFootball from "src/base-h5/components/match/dialogStage/dialogStage-1.vue";  // 详情点击下拉-足球联赛-显示当前赛事的时间
// import stageChildBasketball from "src/base-h5/components/match/dialogStage/dialogStage-2.vue";  // 详情点击下拉-篮球联赛-显示当前赛事的时间
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import { UserCtr, MenuData } from "src/output/index.js";

const props = defineProps(['detail_data'])
const one_hour = ref(false)
const match_time_dt = ref(0)
const type_map = {
  1: 'Football',
  2: 'basketball'
}
const componentId = computed(() =>MenuData.menu_type != 3000 ? `stage-child-${type_map[props.detail_data.csid]}` : '')

const { off } = useMittOn(MITT_TYPES.EMIT_SET_MATCH_TIME, set_match_time); // 储存时间，保证时间同步;
onUnmounted(off)

function initEvent() {
  let now = new Date().getTime();
  one_hour.value = Number(props.detail_data.mgt) - now < 3600 * 1000;
}
onMounted(initEvent)
// 监听set_match_time事件，储存赛事时间
function set_match_time(time) {
  // time为需要储存的赛事时间
  match_time_dt.value = time;
}

</script>

<script>
export default defineComponent({
  name: "match-dialog-stage",
});
</script>

<style lang="scss" scoped></style>