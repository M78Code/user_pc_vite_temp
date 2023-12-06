<template>
  <div class="component odd-item" :class="{ 'active': active }">
    <div class="icontainer">
      <span class="item ol-name" :alt="value.on || value.ott"> {{ value.on || value.ott }} </span>
      <span class="separate"></span>
      <span class="item ol-content" v-if="value.os ==1 || Number(ov)>0"> {{ ov }} </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { compute_value_by_cur_odd_type, MatchDetailCalss } from "src/core/index.js"

const props = withDefaults(defineProps<{
  value: TYPES.Ol,
  active?: boolean
}>(), {
  active: false
})

const sportId = MatchDetailCalss.params.sportId
// @ts-nocheck
const ov = computed(()=>{
  return compute_value_by_cur_odd_type(props.value.ov, props.value._hpid, '', sportId)
})


</script>

<style scoped lang="scss">
.overflow {
  flex: 1;
  width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
.icontainer{
  display: flex;
}
.separate{
  width: 10px;
}
</style>