<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页同联赛的赛事即将开赛显示时间
-->
<template>
  <span class='show-start-time'>
    <span v-if="start_time" class="fz_12" style="font-weight:400">
      <!-- "after_time_start": "分钟后开赛", -->
      {{ i18n_t("list.after_time_start",[longTime])}}
    </span>
    <span v-else>
      {{   format_H_M(   format_time_zone_time(+detail_data.mgt)     ) }}
    </span>
  </span>
</template>

<script>
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
import { format_H_M  } from "src/output/index.js";

export default defineComponent({
  name: "show_start_time",
  props: ["detail_data"],

  setup(props, evnet) {
    const data = reactive({
      // 赛事进行时间
      longTime: '',
      // 是否显示开赛时间
      start_time: false,
      utils
    });
    onMounted(() => {
      // 时间延时器
      // 原 created
      timerInterval = '';
      initEvent();
    });
    const initEvent = () => {
      let now = new Date().getTime();
      let bool = Number(detail_data.mgt) - now < 3600 * 1000;
      let longTime = Math.floor( (+detail_data.mgt -now ) / 1000 / 60 );
      if( longTime == 0 ){
        longTime += 1;
      }
      // 判断开始时间小于本地时间 则不显示具体时间
      if( detail_data.mgt - now < 0 ){
        clearInterval(timerInterval);
        start_time = false;
      } else {
        start_time = bool;
      }
      longTime = longTime;

      timerInterval = setInterval(()=>{
        let now = new Date().getTime();
        if(+detail_data.mgt - now < 0 ){
          clearInterval(timerInterval);
          start_time = false;
        }
        let longTime = Math.floor( (+detail_data.mgt - now )/ 1000 / 60);
        if(longTime == 0){ longTime += 1; }
        longTime = longTime;
      }, 1000 * 1)
    }
    onUnmounted(() => {
      clearInterval(timerInterval);
      timerInterval = null
    })
    return {
      ...toRefs(data),
      initEvent,
      format_H_M,
    }
  }
})
</script>

<style lang="scss" scoped>
.show-start-time {
  display: flex;
  justify-content: center;
}
</style>
