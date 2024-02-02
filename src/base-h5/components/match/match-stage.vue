<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 下拉列表赛事时间展示
-->
<template>
  <div class="match_stage">
    <span v-if="!['result_details', 'match_result'].includes($route.name)">
      <!-- 赛事未开赛 -->
      <span v-if="detail_data.ms == 0">
        <!--Bug: 52532-->
        <!--即将开赛的赛事不显示日期-->
        <!--所以加了 v-if="!one_hour"-->
        <!--这个组件是所有公用的，这里会影响其他项目，要加prop变量控制 -->
        <span v-if="!is_show_time && !one_hour">
          <!-- 距离开赛时间大于1小时 显示月和日 .Format(i18n_t('time3'))-->
           {{(new Date(+detail_data.mgt)).Format(i18n_t('time11'))}}
          <!--{{ formatTime(+detail_data.mgt, "DD/mm hh:MM") }}-->
        </span>

        <!--Bug: 52634-->
        <span v-if="!is_change_header && is_show_time">
          {{(new Date(+detail_data.mgt)).Format(i18n_t('time11'))}}
        </span>

        <!--Bug: 52782-->
        <show-start-time v-if="is_change_header && one_hour" :detail_data="detail_data"></show-start-time>

      </span>

      <span v-else-if="detail_data.ms == 3 || detail_data.mo == 1">
        <span v-if="detail_data.csid == 1 || detail_data.csid == 2">
          {{ i18n_t('match_info.match_over') }}
        </span>
        <span v-else>
          {{ i18n_t('match_info.match_end') }}
        </span>
      </span>

      <span v-else-if="detail_data.ms == 110">
        <!-- 补偿赛事状态110没有 结束比赛的赛事 主要是针对赛果页面 -->
        {{ (detail_data.mmp == '999' && route.name == 'result') ? i18n_t(`mmp[${detail_data.csid}][${detail_data.mmp}]`) : i18n_t(`ms[${detail_data.ms}]`)  }}
      </span>
      <span v-else>
        <!-- 显示 赛事阶段和赛事时间22 -->
        <component
          :is="componentId"
          :detail_data="detail_data"
          :dialog="dialog"
        ></component>
      </span>
    </span>
    <span v-else>
      {{ i18n_t('match_info.match_end') }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, onUnmounted, watch, defineAsyncComponent,markRaw } from 'vue';
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import { MenuData } from "src/output/index.js";
import { i18n_t } from "src/boot/i18n.js"
import { format_time_zone, formatTime } from 'src/output/index.js'
import showStartTime from 'src/base-h5/components/details/wight/show-start-time.vue'   // 详情页同联赛的赛事即将开赛显示时间
import { useRoute } from "vue-router";
let route = useRoute()
// import stage_child_1 from "./stage/stage-child-1.vue";  // 详情页显示足球赛事第几节以及赛事时间
// import stage_child_2 from "./stage/stage-child-2.vue";  // 详情页显示篮球赛事第几节以及赛事时间
// import stage_child_3 from "./stage/stage-child-3.vue";  // 详情页显示棒球赛事第几节以及赛事时间
// import stage_child_4 from "./stage/stage-child-4.vue";  // 详情页显示冰球赛事第几节以及赛事时间
// import stage_child_5 from "./stage/stage-child-5.vue";  // 详情页显示网球赛事第几节以及赛事时间
// import stage_child_6 from "./stage/stage-child-6.vue";  // 详情页显示美式足球赛事第几节以及赛事时间
// import stage_child_7 from "./stage/stage-child-7.vue";  // 详情页显示斯诺克赛事第几节以及赛事时间
// import stage_child_8 from "./stage/stage-child-8.vue";  // 详情页显示兵乓球赛事第几节以及赛事时间
// import stage_child_9 from "./stage/stage-child-9.vue";  // 详情页显示排球赛事第几节以及赛事时间
// import stage_child_10 from "./stage/stage-child-10.vue";  // 详情页显示羽毛球赛事第几节以及赛事时间
// import stage_child_11 from "./stage/stage-child-11.vue";  // 详情页手球赛事阶段+赛事时间
// import stage_child_12 from "./stage/stage-child-12.vue";  // 详情页拳击赛事阶段
// import stage_child_13 from "./stage/stage-child-13.vue";  // 详情页显示沙滩排球赛事第几节以及赛事时间
// import stage_child_14 from "./stage/stage-child-14.vue";  // 详情页橄榄球赛事阶段+赛事时间
// import stage_child_15 from "./stage/stage-child-15.vue";  // 详情页显示曲棍球赛事阶段及赛事时间
// import stage_child_16 from "./stage/stage-child-16.vue";  // 详情页显示水球赛事第几节以及赛事时间
// import stage_child_101 from "./stage/stage-child-101.vue";  // 详情页 电竞第几局 以及 赛事时间


// const props = defineProps(["detail_data", "dialog"])
const props = defineProps({
  detail_data: {
    type: Object,
    default: () => {}
  },
  dialog: {
    type: Boolean,
    default: false
  },
  // Bug: 52634
  // 这个参数控制开赛时间是否显示时间
  // 不影响其他项目
  is_show_time: {
    type: Boolean,
    default: false
  },
  // Bug: 52782
  // 是否是滑动之后的顶部显示
  is_change_header: {
    type: Boolean,
    default: false
  }
})

/** 时间显示 */
const one_hour = ref(false)
// const playComponent = ref({
// stage_child_1 :markRaw(stage_child_1),
// stage_child_2 :markRaw(stage_child_2),
// stage_child_3 :markRaw(stage_child_3),
// stage_child_4 :markRaw(stage_child_4),
// stage_child_5 :markRaw(stage_child_5),
// stage_child_6 :markRaw(stage_child_6),
// stage_child_7 :markRaw(stage_child_7),
// stage_child_8:markRaw(stage_child_8),
// stage_child_9 :markRaw(stage_child_9),
// stage_child_10 :markRaw(stage_child_10),
// stage_child_11 :markRaw(stage_child_11),
// stage_child_12 :markRaw(stage_child_12),
// stage_child_13 :markRaw(stage_child_13),
// stage_child_14 :markRaw(stage_child_14),
// stage_child_15 :markRaw(stage_child_15),
// stage_child_16 :markRaw(stage_child_16),
// stage_child_101:markRaw(stage_child_101)
// })
let componentId = null
let csid = MenuData.is_esports() ? '101' :  route.params.csid
 componentId = defineAsyncComponent(() => import(`./stage/stage-child-${csid}.vue`))
watch(
  () => props.detail_data,
  () => initEvent(),
  {
    deep: true,
    immediate: true
  }
)

// const id = props.detail_data.csid || 101
// const dComponent = defineAsyncComponent(()=>import(`./stage/stage-child-${id}.vue`))

// 计算bool的值 控制是否显示赛事时间
function initEvent() {
  // 当前时间
  let now = new Date().getTime();
  // 赛事开始时间-当前时间 小于一小时并且大于0时为true
  one_hour.value = (+props.detail_data?.mgt - now < 3600 * 1000) && (props.detail_data.mgt - now > 0)
}

// 监听match_nostart事件
const { off } = useMittOn(MITT_TYPES.EMIT_MATCH_NOSTART, initEvent);
onUnmounted(off)

</script>

<script>
export default defineComponent({
  name: "match_stage",
})
</script>

<style lang="scss" scoped>
</style>