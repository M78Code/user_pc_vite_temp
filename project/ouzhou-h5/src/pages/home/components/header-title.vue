<!--
* @Author: Dolphin
* @Description: 标题
-->

<template>
  <div class="title" @click.stop>{{ title }}</div>
</template>
 
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: () => '',
    required: true
  }
})
</script>
 
<style scoped lang="scss">
.title{
  height: 47px;
  line-height: 55px;
  font-size: 16px;
  padding-left: 15px;
  font-weight: 600;
  background: #E2E2E2;
  color: var(--q-gb-t-c-4);
}
</style>