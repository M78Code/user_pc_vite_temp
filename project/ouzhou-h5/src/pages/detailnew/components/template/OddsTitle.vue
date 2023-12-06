<template>
  <div class="component odds-title" v-if="show">
    <template v-for="item in data.title">
      <div class="item ol-title">
        <span class="overflow">{{ item.osn }}</span>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">

const props = defineProps<{
  data: TYPES.OddInfo
}>()

const len = props.data.title.length
const show = len > 1 && len <= 3

</script>

<style scoped lang="scss">
.overflow {
  flex: 1;
  width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.component {
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