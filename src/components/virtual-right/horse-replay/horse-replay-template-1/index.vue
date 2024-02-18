<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 赛马进程
-->

<template>
  <div>
    <div class="horse-replay" v-for="(item,key) in match.rankings" :key="key">
      <div class="number din-medium">{{key+1}}</div>
      <div class="bg-style" :class="`ranking-bg-style1-${match[item]} csid-${vsport_ctr.info.csid}`"></div>
      <div class="name col ellipsis">{{match.team[match[item]].name}}</div>
      <div class="rank-col">{{compute_value_by_cur_odd_type(match.team[match[item]].play20033.ov,'',match.team[match[item]].play20033.hsw)}}</div>
      <div class="rank-col">{{compute_value_by_cur_odd_type(match.team[match[item]].play20034.ov,'',match.team[match[item]].play20034.hsw)}}</div>
      <div class="rank-col"  v-if="vsport_ctr.info.csid !='1009'">{{compute_value_by_cur_odd_type(match.team[match[item]].play20035.ov,'',match.team[match[item]].play20035.hsw)}}</div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "horseReplay",
  props:{
    // 虚拟体育控制类
    vsport_ctr: Object,
  },
  setup(props, evnet) {
    const data = reactive({
      match:this.vsport_ctr.replay_list[0]
    });
    return {
      ...toRefs(data)
    }
  }
})
</script>
<style lang="scss" scoped>
.rank-col {
  width: 18%;
  max-width: 96px;
  text-align: center;
}
.horse-replay {
  display: flex;
  height: 33px;
  align-items: center;
  padding-right: 5px;
  &:last-child{
    border-radius: 0 0 6px 6px;
  }
  .number {
    width: 44px;
    text-align: center;
  }
  .bg-style {
    width: 24px;
    height: 24px;
    margin-right: 20px;
  }
  .name {
    font-size: 13px;
  }
  .rank-col {
    font-size: 13px;
  }
}
</style>
