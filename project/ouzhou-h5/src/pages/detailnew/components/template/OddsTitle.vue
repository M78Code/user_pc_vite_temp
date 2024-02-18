<template>
  <div class="component odds-title" v-if="vif">
    <template v-for="item in list">
      <div class="item ol-title">
        <span class="overflow">{{ item.osn }}</span>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';


const props = withDefaults(defineProps<{
  list: TYPES.OddTitle[]
  show?: boolean
}>(),{
  show:true
})
const vif = computed(()=>props.show&&props.list?.length)
</script>

<style scoped lang="scss">
.overflow {
  flex: 1;
  width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.component.odds-title {
  width: 100%;
  display: flex;
  padding: 8px 0;
  background-color: #F5F5F5;

  >.item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 0;
    text-align: center;
  }
}
</style>