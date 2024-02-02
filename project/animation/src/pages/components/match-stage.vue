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
        <span >
          <!-- 距离开赛时间大于1小时 显示月和日 .Format(i18n_t('time3'))-->
          <!-- {{(new Date(+detail_data.mgt)).Format(i18n_t('time3'))}} -->
          {{ formatTime(+detail_data.mgt, "DD/mm hh:MM") }}
        </span>
      </span>

      <span v-else-if="detail_data.ms == 3">
        <span v-if="detail_data.csid == 1 || detail_data.csid == 2">
          {{ i18n_t('match_info.match_over') }}
        </span>
        <span v-else>
          {{ i18n_t('match_info.match_end') }}
        </span>
      </span>

      <span v-else-if="detail_data.ms == 110">
        {{ i18n_t(`ms[${detail_data.ms}]`) }}
      </span>
      <span v-else>
        <!-- 显示 赛事阶段和赛事时间111 -->
        <component
          :is="playComponent[`stage_child_${detail_data.csid}`]"
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
import { i18n_t } from "src/boot/i18n.js"
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
  }
})

/** 时间显示 */
const one_hour = ref(false)
const playComponent = ref({
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
})
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
/**
 * @description: 格式化时间
 * @param {Number} timestamp 时间戳
 * @param {String} fmt 自定义格式("mm月DD日 HH时MM")
 * @return {String} 格式好的时间
 */
 const formatTime = (timestamp, fmt) => {
  try {
    // const date = new Date(parseInt(timestamp))
    const date = new Date(format_time_zone_millisecond(parseInt(timestamp)));
    let ret;
    let opt = {
      "Y+":
        fmt.lastIndexOf("Y") - fmt.indexOf("Y") == 3
          ? date.getFullYear().toString()
          : date.getFullYear().toString().substr(2, 2), // 年
      "y+":
        fmt.lastIndexOf("y") - fmt.indexOf("y") == 3
          ? date.getFullYear().toString()
          : date.getFullYear().toString().substr(2, 2), // 年
      "m+": (date.getMonth() + 1).toString(), // 月
      "D+": date.getDate().toString(), // 日
      "d+": date.getDate().toString(), // 日
      "H+": date.getHours().toString(), // 时
      "h+": date.getHours().toString(), // 时
      "M+": date.getMinutes().toString(), // 分
      "S+": date.getSeconds().toString(), // 秒
      "s+": date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
    return fmt;
  } catch (error) {}
};
</script>

<script>
export default defineComponent({
  name: "match_stage",
})
</script>

<style lang="scss" scoped></style>